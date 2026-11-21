#!/bin/bash

# sleep 5
cd /root

here=$(cd "$(dirname "$0")" && pwd)
log="/root/zxserver/logs/uniqfaction_hook.log"

if [ -x ./uniqfaction_pk ]; then
    prog="./uniqfaction_pk"
else
    echo "uniqfaction_pk not found" >&2
    exit 1
fi

join_pids() {
    pgrep -x "$1" | tr '\n' ',' | sed 's/,$//'
}

gs_pids=$(join_pids gs)
gde_pids=$(join_pids gdeliveryd)
glink_pids=$(join_pids glinkd)

pids=""
add_pids() {
    if [ -z "$1" ]; then
        return
    fi
    if [ -z "$pids" ]; then
        pids="$1"
    else
        pids="$pids,$1"
    fi
}
add_pids "$gs_pids"
add_pids "$gde_pids"
add_pids "$glink_pids"

if [ -z "$pids" ]; then
    echo "未找到 gs、gdeliveryd、glinkd 进程"
    exit 1
fi

echo "挂载到以下进程: $pids"
echo "gs: ${gs_pids:-无}"
echo "gdeliveryd: ${gde_pids:-无}"
echo "glinkd: ${glink_pids:-无}"
echo "===== $(date '+%F %T') $pids =====" >> "$log"

if ! command -v script >/dev/null 2>&1; then
    echo "script command not found" >&2
    exit 1
fi

nohup $prog $pids > $log 2>&1 &

echo "日志: $log"
