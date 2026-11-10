const IDA_BASE = 0x8048000;

const SEND_RAID_START = 0x19ac;
const SEND_RAID_ENTER = 0x19b2;
const SEND_RAID_CLOSE = 0x19ae;
const RAID_TYPE = 18;
const TEMPLATE = 0x58e;

interface World {
    mapId: number;
    gs: number;
    index: number;
    templateId: number;
    mapInfo: NativePointer;
}

const worlds = new Map<number, World>();
const opening = new Map<number, {mapId: number; gs: number; mapInfo: NativePointer; templateId: number}>();
const kept: any[] = [];

function rebase(ida: number): NativePointer {
    const mod = Process.enumerateModules()[0];
    return mod.base.add(ida - IDA_BASE);
}

function keep(cb: any): any {
    kept.push(cb);
    return cb;
}

function zero(p: NativePointer, n: number) {
    for (let i = 0; i < n; i += 4) p.add(i).writeU32(0);
}

function trampoline(addr: NativePointer, steal: number): NativePointer {
    const cave = Memory.alloc(Process.pageSize);
    Memory.protect(cave, Process.pageSize, "rwx");
    cave.writeByteArray(addr.readByteArray(steal)!);
    const from = cave.add(steal);
    from.writeU8(0xe9);
    from.add(1).writeS32(addr.add(steal).sub(from.add(5)).toInt32());
    return cave;
}

function findMap(mapId: number): {info: NativePointer; templateId: number} | null {
    const mgr = new NativeFunction(rebase(0x82f03c8), "pointer", [])();
    const out = Memory.alloc(4);
    const key = Memory.alloc(4);
    key.writeS32(mapId);
    const find = new NativeFunction(rebase(0x84d336c), "void", ["pointer", "pointer", "pointer"]);
    find(out, mgr.add(8), key);
    const node = out.readPointer();
    if (node.equals(mgr.add(0xc))) return null;
    const info = node.add(0x14).readPointer();
    if (info.isNull()) return null;
    return {info, templateId: info.add(0x34).readS32()};
}

function tryLine(info: NativePointer): number {
    const slot = Memory.alloc(4);
    slot.writeS32(-1);
    const ok = new NativeFunction(rebase(0x84ce6ea), "int", ["pointer", "pointer"])(info, slot);
    if (!ok) return -1;
    return slot.readS32();
}

function finishLine(info: NativePointer, gs: number, success: boolean) {
    new NativeFunction(rebase(0x84ce63a), "void", ["pointer", "int", "int"])(info, gs, success ? 1 : 0);
}

function makeOctets(at: NativePointer) {
    new NativeFunction(rebase(0x82d44fc), "void", ["pointer"])(at);
}

function sendStart(gs: number, mapId: number, roomId: number) {
    const obj = Memory.alloc(0x40);
    zero(obj, 0x40);
    obj.writePointer(rebase(0x85164c0));
    obj.add(8).writeU32(SEND_RAID_START);
    obj.add(0xc).writeS32(mapId);
    obj.add(0x10).writeS32(roomId);
    obj.add(0x14).writePointer(rebase(0x8516498));
    obj.add(0x24).writeS32(RAID_TYPE);
    makeOctets(obj.add(0x28));
    const send = new NativeFunction(rebase(0x82fe44e), "int", ["pointer", "int", "pointer"]);
    const ret = send(rebase(0x8670430), gs, obj);
    new NativeFunction(rebase(0x83b11c8), "void", ["pointer"])(obj);
    return ret;
}

function sendEnter(gs: number, role: number, mapId: number, templateId: number, index: number) {
    const obj = Memory.alloc(0x40);
    zero(obj, 0x40);
    obj.writePointer(rebase(0x85160d8));
    obj.add(8).writeU32(SEND_RAID_ENTER);
    obj.add(0xc).writeS32(role);
    obj.add(0x10).writeS32(mapId);
    obj.add(0x14).writeS32(templateId);
    obj.add(0x18).writeS32(index);
    obj.add(0x1c).writeS32(RAID_TYPE);
    makeOctets(obj.add(0x20));
    const send = new NativeFunction(rebase(0x82fe44e), "int", ["pointer", "int", "pointer"]);
    const ret = send(rebase(0x8670430), gs, obj);
    new NativeFunction(rebase(0x83b16b4), "void", ["pointer"])(obj);
    return ret;
}

export function openRaid(roomId: number, mapId: number) {
    if (worlds.has(roomId) || opening.has(roomId)) return;
    const found = findMap(mapId);
    if (!found) {
        console.log("[UniqFactionPk] \u6ca1\u6709 gs \u767b\u8bb0\u5730\u56fe " + mapId + " \u623f\u95f4\u5f00\u4e0d\u51fa\u6765");
        if (!isCentral()) askCentralOpen(roomId, mapId);
        return;
    }
    const gs = tryLine(found.info);
    if (gs < 0) {
        console.log("[UniqFactionPk] \u5730\u56fe " + mapId + " \u6ca1\u6709\u7a7a\u4f4d");
        return;
    }
    const templateId = found.templateId || TEMPLATE;
    opening.set(roomId, {mapId, gs, mapInfo: found.info, templateId});
    const ret = sendStart(gs, mapId, roomId);
    console.log("[UniqFactionPk] \u5f00\u623f\u95f4 room=" + roomId + " map=" + mapId + " gs=" + gs + " template=" + templateId + " send=" + ret);
}

function noteStart(roomId: number, gs: number, index: number, retcode: number) {
    const pending = opening.get(roomId);
    if (!pending) return false;
    opening.delete(roomId);
    finishLine(pending.mapInfo, gs, retcode === 0);
    if (retcode !== 0) {
        waiting.delete(roomId);
        console.log("[UniqFactionPk] gs \u521b\u5efa\u5931\u8d25 room=" + roomId + " ret=" + retcode);
        return true;
    }
    worlds.set(roomId, {mapId: pending.mapId, gs, index, templateId: pending.templateId, mapInfo: pending.mapInfo});
    console.log("[UniqFactionPk] \u526f\u672c\u5df2\u5f00 room=" + roomId + " gs=" + gs + " index=" + index);
    flushEnter(roomId);
    return true;
}

interface Arrival {
    gs: number;
    index: number;
    side: number;
}

const arrivals = new Map<number, Arrival>();

function isCentral(): boolean {
    return rebase(0x8670270).readU8() !== 0;
}

function centralLinked(): boolean {
    return rebase(0x8680334).readU8() !== 0;
}

function findRole(role: number): NativePointer | null {
    const info = new NativeFunction(rebase(0x82ed0e4), "pointer", ["pointer", "int"])(rebase(0x866eff8), role);
    if (info.isNull()) return null;
    return info;
}

function enterRaid(role: number, mapId: number, roomId: number, side: number): boolean {
    const world = worlds.get(roomId);
    if (!world) return false;
    const info = findRole(role);
    if (!info) {
        console.log("[UniqFactionPk] 进房玩家不在线 role=" + role);
        return true;
    }
    const line = info.add(0x18).readS32();
    if (line !== world.gs) {
        console.log("[UniqFactionPk] 人在线 " + line + " 副本在 gs " + world.gs + " room=" + roomId);
        return true;
    }
    const templateId = world.templateId || TEMPLATE;
    const ret = sendEnter(line, role, mapId || world.mapId, templateId, world.index);
    console.log("[UniqFactionPk] 进入战场 role=" + role + " side=" + side + " line=" + line + " index=" + world.index + " send=" + ret);
    return true;
}

interface Waiter {
    zone: number;
    role: number;
    mapId: number;
    side: number;
}

const waiting = new Map<number, Waiter[]>();

function askCentralOpen(roomId: number, mapId: number) {
    if (!centralLinked()) {
        console.log("[UniqFactionPk] \u4e2d\u592e\u6ca1\u8fde\u4e0a\uff0c\u623f\u95f4\u5f00\u4e0d\u51fa\u6765 room=" + roomId);
        return;
    }
    const zone = rebase(0x86702e0).readS32();
    const obj = Memory.alloc(0x30);
    zero(obj, 0x30);
    obj.writePointer(rebase(0x851f388));
    obj.add(8).writeU32(0x3e8);
    obj.add(0x10).writeS32(19);
    obj.add(0x14).writeS32(roomId);
    obj.add(0x18).writeS32(zone);
    obj.add(0x1c).writeS32(mapId);
    const send = new NativeFunction(rebase(0x82fe340), "int", ["pointer", "pointer"]);
    const ret = send(rebase(0x8680300), obj);
    console.log("[UniqFactionPk] \u8bf7\u4e2d\u592e\u5f00\u623f room=" + roomId + " map=" + mapId + " send=" + ret);
}

function queueEnter(roomId: number, waiter: Waiter) {
    const list = waiting.get(roomId);
    if (list) list.push(waiter);
    else waiting.set(roomId, [waiter]);
}

function flushEnter(roomId: number) {
    const list = waiting.get(roomId);
    if (!list) return;
    waiting.delete(roomId);
    const world = worlds.get(roomId);
    if (!world) return;
    for (const w of list) pullHome(w.zone, w.role, w.mapId, world, w.side);
}

function askCentral(role: number, mapId: number, roomId: number, side: number) {
    if (!centralLinked()) {
        console.log("[UniqFactionPk] 中央没连上，进不了副本 role=" + role);
        return;
    }
    const zone = rebase(0x86702e0).readS32();
    const obj = Memory.alloc(0x30);
    zero(obj, 0x30);
    obj.writePointer(rebase(0x851f388));
    obj.add(8).writeU32(0x3e8);
    obj.add(0xc).writeS32(role);
    obj.add(0x10).writeS32(RAID_TYPE);
    obj.add(0x14).writeS32(roomId);
    obj.add(0x18).writeS32(zone);
    obj.add(0x1c).writeS32(mapId);
    obj.add(0x20).writeS32(side);
    const send = new NativeFunction(rebase(0x82fe340), "int", ["pointer", "pointer"]);
    const ret = send(rebase(0x8680300), obj);
    console.log("[UniqFactionPk] 转中央进房 role=" + role + " room=" + roomId + " zone=" + zone + " send=" + ret);
}

function pullHome(zone: number, role: number, mapId: number, world: World, side: number) {
    arrivals.set(role, {gs: world.gs, index: world.index, side});
    const obj = Memory.alloc(0x40);
    zero(obj, 0x40);
    obj.writePointer(rebase(0x8516108));
    obj.add(8).writeU32(0x1a75);
    obj.add(0x14).writeS32(role);
    obj.add(0x18).writeS32(world.gs);
    obj.add(0x1c).writeS32(mapId || world.mapId);
    obj.add(0x20).writeS32(world.templateId || TEMPLATE);
    obj.add(0x24).writeS32(world.index);
    obj.add(0x28).writeS32(RAID_TYPE);
    const send = new NativeFunction(rebase(0x82febea), "int", ["pointer", "int", "pointer"]);
    const ret = send(rebase(0x8680364), zone, obj);
    new NativeFunction(rebase(0x83b1682), "void", ["pointer"])(obj);
    console.log("[UniqFactionPk] 拉人回本区 role=" + role + " zone=" + zone + " gs=" + world.gs + " index=" + world.index + " send=" + ret);
}

export function attachRaid() {
    const re = rebase(0x8383916);
    Interceptor.attach(re, {
        onEnter(args) {
            try {
                const proto = args[0];
                const retcode = proto.add(0xc).readS32();
                const gs = proto.add(0x10).readS32();
                const room = proto.add(0x18).readS32();
                const index = proto.add(0x1c).readS32();
                noteStart(room, gs, index, retcode);
            } catch (e) {
                console.log("[UniqFactionPk] \u5f00\u623f\u56de\u5305\u5931\u8d25 " + e);
            }
        },
    });

    const realDispatch = new NativeFunction(rebase(0x82fe44e), "int", ["pointer", "int", "pointer"]);
    Interceptor.replace(rebase(0x84060d8), keep(new NativeCallback((self: NativePointer, gs: number, proto: NativePointer) => {
        try {
            if (proto.add(8).readU32() === SEND_RAID_CLOSE && worlds.has(proto.add(0xc).readS32())) {
                console.log("[UniqFactionPk] \u4fdd\u4f4f\u526f\u672c room=" + proto.add(0xc).readS32());
                return 1;
            }
        } catch (e) {
            console.log("[UniqFactionPk] \u5173\u95ed\u5305\u68c0\u67e5\u5931\u8d25 " + e);
        }
        return realDispatch(self, gs, proto);
    }, "int", ["pointer", "int", "pointer"])));

    const join = rebase(0x83f7838);
    const origJoin = new NativeFunction(trampoline(join, 9), "void", ["pointer", "pointer", "uint"]);
    Interceptor.replace(join, keep(new NativeCallback((proto: NativePointer, manager: NativePointer, sid: number) => {
        try {
            const room = proto.add(0x3c).readS32();
            const role = proto.add(0x10).readS32();
            const map = proto.add(0xc).readS32();
            const side = proto.add(0x40).readU8();
            if (worlds.has(room)) {
                enterRaid(role, map, room, side);
                return;
            }
            askCentral(role, map, room, side);
            return;
        } catch (e) {
            console.log("[UniqFactionPk] \u8fdb\u623f\u5931\u8d25 " + e);
        }
        origJoin(proto, manager, sid);
    }, "void", ["pointer", "pointer", "uint"])));
        Interceptor.attach(rebase(0x84cecfa), {
        onEnter(args) {
            try {
                const gs = args[2].toInt32();
                const vec = args[3];
                let cur = vec.readPointer();
                const end = vec.add(4).readPointer();
                const maps: number[] = [];
                while (!cur.equals(end) && maps.length < 40) {
                    maps.push(cur.add(4).readS32());
                    cur = cur.add(0x24);
                }
                console.log("[UniqFactionPk] \u767b\u8bb0\u526f\u672c gs=" + gs + " maps=" + maps.join(","));
            } catch (e) {
                console.log("[UniqFactionPk] \u767b\u8bb0\u526f\u672c\u5931\u8d25 " + e);
            }
        },
    });

    const enterRe = rebase(0x83fba6c);
    Interceptor.attach(enterRe, {
        onEnter(args) {
            try {
                const proto = args[0];
                if (proto.add(0x14).readS32() !== 0) return;
                if (proto.add(0x20).readS32() !== RAID_TYPE) return;
                if (isCentral()) return;
                proto.add(0x20).writeS32(0x13);
                console.log("[UniqFactionPk] 检查通过，切到跨服 role=" + proto.add(0xc).readS32());
            } catch (e) {
                console.log("[UniqFactionPk] 切服失败 " + e);
            }
        },
    });

    const team = rebase(0x839ac8c);
    const origTeam = new NativeFunction(trampoline(team, 9), "void", ["pointer", "pointer", "uint"]);
    Interceptor.replace(team, keep(new NativeCallback((proto: NativePointer, manager: NativePointer, sid: number) => {
        try {
            const kind = proto.add(0x10).readS32();
            const room = proto.add(0x14).readS32();
            const map = proto.add(0x1c).readS32();
            if (kind === 19) {
                openRaid(room, map);
                return;
            }
            if (kind !== RAID_TYPE) {
                origTeam(proto, manager, sid);
                return;
            }
            const role = proto.add(0xc).readS32();
            const zone = proto.add(0x18).readS32();
            const side = proto.add(0x20).readS32();
            const world = worlds.get(room);
            if (!world) {
                queueEnter(room, {zone, role, mapId: map, side});
                openRaid(room, map);
                console.log("[UniqFactionPk] \u526f\u672c\u8fd8\u6ca1\u5f00\uff0c\u5148\u5f00\u623f room=" + room + " role=" + role);
                return;
            }
            if (!isCentral()) console.log("[UniqFactionPk] 副本不在中央交付服 room=" + room);
            pullHome(zone, role, map, world, side);
        } catch (e) {
            console.log("[UniqFactionPk] 中央进房失败 " + e);
        }
    }, "void", ["pointer", "pointer", "uint"])));

    const alias = new Map<number, number>();
    const saved = rebase(0x83fc540);
    Interceptor.attach(saved, {
        onEnter(args) {
            try {
                if (!isCentral()) return;
                const arg = args[1];
                const res = args[2];
                if (res.add(4).readS32() !== 0) return;
                const src = arg.add(4).readS32();
                const remote = res.add(0x10).readS32();
                const spot = arrivals.get(src);
                if (!spot || remote === 0 || remote === src) return;
                const prev = alias.get(src);
                if (prev !== undefined && prev !== remote) arrivals.delete(prev);
                alias.set(src, remote);
                arrivals.set(remote, spot);
                console.log('[UniqFactionPk] \u8de8\u670d\u89d2\u8272 src=' + src + ' remote=' + remote);
            } catch (e) {
                console.log('[UniqFactionPk] \u8de8\u670d\u89d2\u8272\u5931\u8d25 ' + e);
            }
        },
    });

    const login = rebase(0x8435320);
    Interceptor.attach(login, {
        onEnter(args) {
            try {
                if (!isCentral()) return;
                const proto = args[0];
                const role = proto.add(0xc).readS32();
                const spot = arrivals.get(role);
                if (!spot) return;
                proto.add(0x10).writeS32(spot.gs);
                proto.add(0x1c).writeS32(spot.index);
                proto.add(0x30).writeS32(1);
                proto.add(0x34).writeS32(0);
                proto.add(0x38).writeS32(0);
                proto.add(0x3c).writeS32(0);
                proto.add(0x44).writeU8(spot.side & 0xff);
                proto.add(0x46).writeU8(1);
                arrivals.delete(role);
                alias.forEach((remote, src) => {
                    if (role === src || role === remote) {
                        arrivals.delete(src);
                        arrivals.delete(remote);
                        alias.delete(src);
                    }
                });
                console.log("[UniqFactionPk] 登录进副本 role=" + role + " gs=" + spot.gs + " index=" + spot.index + " side=" + spot.side);
            } catch (e) {
                console.log("[UniqFactionPk] 登录进副本失败 " + e);
            }
        },
    });

console.log("[UniqFactionPk] \u5f00\u623f\u95f4\u5df2\u6302\u4e0a");
}
