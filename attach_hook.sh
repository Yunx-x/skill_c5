#!/bin/bash
# Attach frida to every gs, gdeliveryd and glinkd.
# Logs: /root/zxserver/logs/gs_hook_<pid>  gde_hook_<pid>  glink_hook_<pid>

set -u

HOOK="/root/zxserver/hook/main.js"
LOG_DIR="/root/zxserver/logs"

if ! command -v frida >/dev/null 2>&1; then
    echo "frida not found" >&2
    exit 1
fi

if [ ! -f "$HOOK" ]; then
    echo "hook script not found: $HOOK" >&2
    exit 1
fi

mkdir -p "$LOG_DIR"

already_attached() {
    local pid="$1"
    local line cmd
    for line in /proc/[0-9]*/cmdline; do
        [ -r "$line" ] || continue
        cmd=$(tr '\0' ' ' < "$line")
        case "$cmd" in
            *"frida -p ${pid} "*|*"frida -p ${pid}"*)
                return 0
                ;;
        esac
    done
    return 1
}

attach_comm() {
    local prefix="$1"
    local comm="$2"
    local dir pid cmd exe base
    local found=0
    local log

    # Match argv0, so ./gs and /path/gs both count. ps comm misses these.
    for dir in /proc/[0-9]*; do
        [ -r "$dir/cmdline" ] || continue
        pid=${dir#/proc/}
        cmd=$(tr '\0' ' ' < "$dir/cmdline")
        [ -n "$cmd" ] || continue
        exe=${cmd%% *}
        base=${exe##*/}
        [ "$base" = "$comm" ] || continue
        found=1
        log="${LOG_DIR}/${prefix}_hook_${pid}"
        if already_attached "$pid"; then
            echo "skip ${comm} pid=${pid}, already attached"
            continue
        fi
        echo "===== $(date '+%F %T') attach ${comm} pid=${pid} =====" >> "$log"
        nohup frida -p "$pid" -l "$HOOK" >> "$log" 2>&1 &
        echo "attached ${comm} pid=${pid} -> ${log}"
    done

    if [ "$found" -eq 0 ]; then
        echo "no process named ${comm}"
    fi
}

attach_comm gs gs
attach_comm gde gdeliveryd
attach_comm glink glinkd
