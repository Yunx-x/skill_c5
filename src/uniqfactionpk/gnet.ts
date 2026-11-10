import {HookFuncCore} from "../base/HookFuncCore";
import {attachRaid} from "./raid";
import {intAt} from "./wire";
import {askMissBody, beginForFaction, handle, inviteLocalsid, onInviteAsk, onInviteResult, REPLIES, REQUESTS, roleOf, setLinkSend, setPushRole, setRelay, takeRegister, T} from "./logic";
import {attachCentral, canReachCentral, forwardRequest, isCentralServer, onResend, shouldForward, shouldRouteReply} from "./central";

const IDA_BASE = 0x8048000;

function trackedTypes(): number[] {
    return REQUESTS.concat(REPLIES).concat([T.fight, T.register, T.resend, T.inviteAsk, T.inviteResult]);
}
const bodies = new Map<string, number[]>();
const sessions = new Map<number, {manager: NativePointer; sid: number}>();

let mode: "glink" | "delivery" = "glink";
let vt: NativePointer = ptr(0);
let nw: NativeFunction<NativePointer, [number]> | null = null;
let delFn: NativeFunction<void, [NativePointer]> | null = null;
let mgrSend: NativeFunction<number, [NativePointer, number, NativePointer, number]> | null = null;
let forwardToDelivery: NativeFunction<number, [NativePointer, NativePointer]> | null = null;
let deliveryObj: NativePointer = ptr(0);
let linkEndpoint: {manager: NativePointer; sid: number} | null = null;

const kept: any[] = [];

function keep(cb: any): any {
    kept.push(cb);
    return cb;
}

function rebase(ida: number): NativePointer {
    const mod = Process.enumerateModules()[0];
    return mod.base.add(ida - IDA_BASE);
}

function findFn(name: string, ida: number): NativePointer {
    const exported = Module.findExportByName(null, name);
    if (exported && !exported.isNull()) return exported;
    if (ida === 0) return ptr(0);
    return rebase(ida);
}

function takeBody(stream: NativePointer): number[] {
    const dataPtr = stream.add(4).readPointer();
    const pos = stream.add(8).readU32();
    const size = dataPtr.sub(8).readU32();
    const n = size - pos;
    if (n < 0 || n > 1024 * 1024) return [];
    const raw = dataPtr.add(pos).readByteArray(n);
    stream.add(8).writeU32(size);
    return raw ? Array.from(new Uint8Array(raw)) : [];
}

function appendBody(stream: NativePointer, bytes: number[]) {
    if (!bytes.length) return;
    const mem = Memory.alloc(bytes.length);
    mem.writeByteArray(bytes);
    if (mode === "delivery") {
        const end = HookFuncCore.getNativeFunc("_ZN4GNET6Octets3endEv", "pointer", ["pointer"]);
        const insert = HookFuncCore.getNativeFunc("_ZN4GNET6Octets6insertEPvPKvj", "pointer", ["pointer", "pointer", "pointer", "uint32"]);
        insert(stream, end(stream), mem, bytes.length);
        return;
    }
    const end = new NativeFunction(rebase(0x80584b4), "int", ["pointer"]);
    const insert = new NativeFunction(rebase(0x80584d0), "pointer", ["pointer", "int", "pointer", "int"]);
    insert(stream, end(stream), mem, bytes.length);
}

function allocProto(type: number): NativePointer {
    const obj = nw!(32);
    obj.writePointer(vt);
    obj.add(4).writeU32(0);
    obj.add(8).writeU32(type);
    return obj;
}

function sendOn(manager: NativePointer, sid: number, type: number, body: number[]) {
    if (!mgrSend || manager.isNull()) return;
    const obj = allocProto(type);
    bodies.set(obj.toString(), body);
    try {
        mgrSend(manager, sid, obj, 0);
    } finally {
        bodies.delete(obj.toString());
        if (delFn) delFn(obj);
    }
}

function deliveryServer(): NativePointer {
    const exported = Module.findExportByName(null, "_ZN4GNET15GDeliveryServer8instanceE");
    if (exported && !exported.isNull()) return exported;
    return rebase(0x8670240);
}

function dispatchZone(zone: number, type: number, body: number[]): boolean {
    const addr = Module.findExportByName(null, "_ZN4GNET21CentralDeliveryServer16DispatchProtocolEiPNS_8ProtocolE");
    const server = Module.findExportByName(null, "_ZN4GNET21CentralDeliveryServer8instanceE");
    if (!addr || !server || !nw) return false;
    const call = new NativeFunction(addr, "int", ["pointer", "int", "pointer"]);
    const obj = allocProto(type);
    bodies.set(obj.toString(), body);
    try {
        const ok = call(server, zone, obj) !== 0;
        console.log("[UniqFactionPk] \u4e2d\u5fc3\u8f6c\u533a zone=" + zone + " type=" + type + " ok=" + (ok ? 1 : 0));
        return ok;
    } finally {
        bodies.delete(obj.toString());
        if (delFn) delFn(obj);
    }
}

function deliver(outs: {type: number; body: number[]}[], fallback: {manager: NativePointer; sid: number} | null) {
    for (let i = 0; i < outs.length; i++) {
        const out = outs[i];
        const role = roleOf(out.type, out.body);
        const sess = sessions.get(role) || fallback;
        if (!sess) {
            console.log(`[UniqFactionPk] 没有玩家会话 role=${role} type=${out.type}`);
            continue;
        }
        sendOn(sess.manager, sess.sid, out.type, out.body);
    }
}

function onProcess(self: NativePointer, manager: NativePointer, sid: number) {
    const type = self.add(8).readU32();
    const body = bodies.get(self.toString()) || [];
    const role = roleOf(type, body);
    if (REQUESTS.indexOf(type) >= 0 && role) {
        sessions.set(role, {manager, sid});
    }
    if (mode === "glink" && REQUESTS.indexOf(type) >= 0 && forwardToDelivery) {
        const up = !deliveryObj.isNull() && deliveryObj.add(0x30).readU8() !== 0;
        if (up) {
            forwardToDelivery(deliveryObj, self);
            return;
        }
    }
    if (mode === "glink" && type === T.invite) {
        const localsid = inviteLocalsid(body);
        const link = rebase(0x8165b14);
        if (localsid && mgrSend) {
            sendOn(link, localsid, type, body);
            console.log("[UniqFactionPk] \u9080\u8bf7\u9001\u5230\u5ba2\u6237\u7aef local=" + localsid);
        }
        return;
    }
    if (mode === "glink" && REPLIES.indexOf(type) >= 0) {
        const sess = sessions.get(role);
        if (!sess) {
            console.log(`[UniqFactionPk] 回包找不到角色 role=${role} type=${type}`);
            return;
        }
        mgrSend!(sess.manager, sess.sid, self, 0);
        return;
    }
    if (mode === "delivery" && type === T.register) {
        takeRegister(body);
        return;
    }
    if (mode === "delivery" && type === T.resend) {
        onResend();
        return;
    }
    if (mode === "delivery" && type === T.inviteAsk) {
        if (isCentralServer()) {
            const zone = intAt(body, 5);
            if (!dispatchZone(zone, type, body)) dispatchZone(intAt(body, 2), T.inviteResult, askMissBody(body));
        } else onInviteAsk(body);
        return;
    }
    if (mode === "delivery" && type === T.inviteResult) {
        if (isCentralServer()) dispatchZone(intAt(body, 1), type, body);
        else onInviteResult(body);
        return;
    }
    if (mode === "delivery" && (type === T.zone || type === T.faction) && shouldForward()) {
        forwardRequest(self);
        return;
    }
    if (mode === "delivery" && (type === T.zoneRe || type === T.factionRe) && shouldRouteReply()) {
        const back = role ? sessions.get(role) : undefined;
        if (back) {
            sendOn(back.manager, back.sid, type, body);
            console.log("[UniqFactionPk] \u8f6c\u53d1\u56de\u5305 role=" + role + " type=" + type);
        } else {
            console.log("[UniqFactionPk] \u56de\u5305\u627e\u4e0d\u5230\u4f1a\u8bdd role=" + role + " type=" + type);
        }
        return;
    }
    if (mode === "delivery" && REQUESTS.indexOf(type) >= 0) {
        linkEndpoint = {manager, sid};
    }
    if (mode === "delivery" || REQUESTS.indexOf(type) >= 0) {
        const outs = handle(type, body);
        const fallback = role ? sessions.get(role) || null : null;
        deliver(outs, fallback ? {manager: fallback.manager, sid: fallback.sid} : {manager, sid});
        if (type !== T.fight) {
            console.log(`[UniqFactionPk] ${mode} type=${type} role=${role} replies=${outs.length}`);
        }
    }
}

function installCallbacks() {
    const marshal = keep(new NativeCallback((self: NativePointer, stream: NativePointer) => {
        try {
            appendBody(stream, bodies.get(self.toString()) || []);
        } catch (e) {
            console.log(`[UniqFactionPk] marshal ${e}`);
        }
        return stream;
    }, "pointer", ["pointer", "pointer"]));
    const unmarshal = keep(new NativeCallback((self: NativePointer, stream: NativePointer) => {
        try {
            bodies.set(self.toString(), takeBody(stream));
        } catch (e) {
            console.log(`[UniqFactionPk] unmarshal ${e}`);
            bodies.set(self.toString(), []);
        }
        return stream;
    }, "pointer", ["pointer", "pointer"]));
    const passthrough = keep(new NativeCallback((_self: NativePointer, stream: NativePointer) => stream, "pointer", ["pointer", "pointer"]));
    const dtor = keep(new NativeCallback((self: NativePointer) => {
        bodies.delete(self.toString());
    }, "void", ["pointer"]));
    const deleting = keep(new NativeCallback((self: NativePointer) => {
        bodies.delete(self.toString());
        if (delFn) delFn(self);
    }, "void", ["pointer"]));
    const processFn = keep(new NativeCallback((self: NativePointer, manager: NativePointer, sid: number) => {
        try {
            onProcess(self, manager, sid);
        } catch (e) {
            console.log(`[UniqFactionPk] process ${e}`);
        }
    }, "void", ["pointer", "pointer", "uint32"]));
    const clone = keep(new NativeCallback((self: NativePointer) => {
        return allocProto(self.add(8).readU32());
    }, "pointer", ["pointer"]));
    const destroy = keep(new NativeCallback((self: NativePointer) => {
        if (self.isNull()) return ptr(0);
        bodies.delete(self.toString());
        if (delFn) delFn(self);
        return ptr(0);
    }, "pointer", ["pointer"]));
    const prior = keep(new NativeCallback(() => 1, "int", ["pointer"]));
    const sizeOk = keep(new NativeCallback(() => 1, "int", ["pointer", "uint32"]));
    vt = Memory.alloc(Process.pointerSize * 10);
    const slots = [marshal, unmarshal, passthrough, dtor, deleting, processFn, clone, destroy, prior, sizeOk];
    for (let i = 0; i < slots.length; i++) vt.add(i * 4).writePointer(slots[i]);
}

function skipUnknownPolicy(addr: NativePointer) {
    const stolen = 6;
    const raw = new Uint8Array(addr.readByteArray(stolen) as ArrayBuffer);
    const prologue = raw[0] === 0x55 && raw[1] === 0x89 && raw[2] === 0xe5
        && raw[3] === 0x57 && raw[4] === 0x56 && raw[5] === 0x53;
    if (!prologue) {
        const hex = Array.from(raw).map((b) => b.toString(16)).join(' ');
        console.log('[UniqFactionPk] CheckPolicy prologue mismatch ' + addr + ' ' + hex);
        return;
    }
    const types = trackedTypes();
    const list = Memory.alloc(4 * (types.length + 1));
    for (let i = 0; i < types.length; i++) list.add(i * 4).writeU32(types[i] >>> 0);
    list.add(types.length * 4).writeU32(0);
    const logFn = keep(new NativeCallback((type: number) => {
        console.log('[UniqFactionPk] bypass CheckPolicy type=' + (type >>> 0));
    }, 'void', ['uint32']));
    const code: number[] = [];
    const u32 = (n: number) => {
        code.push(n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff);
    };
    code.push(0x8b, 0x44, 0x24, 0x04);
    code.push(0xba);
    u32(list.toUInt32());
    const loopAt = code.length;
    code.push(0x83, 0x3a, 0x00);
    const jeOrig = code.length;
    code.push(0x74, 0x00);
    code.push(0x3b, 0x02);
    const jeAllow = code.length;
    code.push(0x74, 0x00);
    code.push(0x83, 0xc2, 0x04);
    const jmpLoop = code.length;
    code.push(0xeb, 0x00);
    const allowAt = code.length;
    code.push(0x50, 0xb9);
    u32(logFn.toUInt32());
    code.push(0xff, 0xd1, 0x83, 0xc4, 0x04);
    code.push(0x8b, 0x44, 0x24, 0x0c, 0xc6, 0x40, 0x14, 0x00, 0xc3);
    const origAt = code.length;
    for (let i = 0; i < stolen; i++) code.push(raw[i]);
    code.push(0x68);
    u32(addr.add(stolen).toUInt32());
    code.push(0xc3);
    const rel8 = (at: number, target: number) => {
        const d = target - (at + 2);
        if (d < -128 || d > 127) throw new Error('rel8 ' + d);
        code[at + 1] = d & 0xff;
    };
    rel8(jeOrig, origAt);
    rel8(jeAllow, allowAt);
    rel8(jmpLoop, loopAt);
    const cave = Memory.alloc(code.length);
    cave.writeByteArray(code);
    Memory.protect(cave, code.length, 'rwx');
    kept.push(cave);
    kept.push(list);
    const patch = [0x68, 0, 0, 0, 0, 0xc3];
    const caveAddr = cave.toUInt32();
    patch[1] = caveAddr & 0xff;
    patch[2] = (caveAddr >>> 8) & 0xff;
    patch[3] = (caveAddr >>> 16) & 0xff;
    patch[4] = (caveAddr >>> 24) & 0xff;
    Memory.protect(addr, stolen, 'rwx');
    addr.writeByteArray(patch);
    console.log('[UniqFactionPk] CheckPolicy cave ' + cave + ' entry ' + addr);
}

function registerTypes(ctorAddr: NativePointer) {
    const ctor = new NativeFunction(ctorAddr, "pointer", ["pointer", "uint32"]);
    const types = trackedTypes();
    for (let i = 0; i < types.length; i++) {
        const obj = nw!(32);
        ctor(obj, types[i]);
        obj.writePointer(vt);
    }
}

function rememberClient(addr: NativePointer) {
    const link = rebase(0x8165b14);
    Interceptor.attach(addr, {
        onEnter() {
            const ctx = this.context as unknown as {ebx: NativePointer; esi: NativePointer};
            const role = ctx.ebx.add(0xc).readS32();
            const sid = ctx.esi.toUInt32();
            if (!role || !sid) return;
            sessions.set(role, {manager: link, sid});
        },
    });
}

function restoreOnEnter(addr: NativePointer) {
    const findRole = new NativeFunction(rebase(0x82ed0b0), "pointer", ["pointer", "int"]);
    const users = rebase(0x866eff8);
    Interceptor.attach(addr, {
        onEnter(args) {
            this.role = args[0].add(0xc).readS32();
            this.manager = args[1];
            this.sid = args[2].toUInt32();
        },
        onLeave() {
            try {
                const role = this.role as number;
                const info = findRole(users, role);
                if (info.isNull()) return;
                const faction = info.add(0x28).readS32();
                const body = beginForFaction(faction, role);
                if (!body) return;
                sendOn(this.manager as NativePointer, this.sid as number, T.begin, body);
                console.log("[UniqFactionPk] \u767b\u5f55\u6062\u590d\u5e2e\u6218 role=" + role + " faction=" + faction);
            } catch (e) {
                console.log("[UniqFactionPk] \u767b\u5f55\u6062\u590d\u5931\u8d25 " + e);
            }
        },
    });
}

export function installGnet(which: "glink" | "delivery") {
    mode = which;
    const newAddr = findFn("_Znwj", 0);
    const delAddr = findFn("_ZdlPv", 0);
    if (newAddr.isNull() || delAddr.isNull()) {
        console.log("[UniqFactionPk] 找不到 operator new，协议桩没有挂上");
        return;
    }
    nw = new NativeFunction(newAddr, "pointer", ["uint32"]);
    delFn = new NativeFunction(delAddr, "void", ["pointer"]);
    installCallbacks();
    if (which === "glink") {
        mgrSend = new NativeFunction(rebase(0x8065078), "int", ["pointer", "uint32", "pointer", "int"]);
        forwardToDelivery = new NativeFunction(rebase(0x80c086c), "int", ["pointer", "pointer"]);
        deliveryObj = rebase(0x8165d40);
        skipUnknownPolicy(rebase(0x805e906));
        registerTypes(rebase(0x80a1f0e));
        try {
            rememberClient(rebase(0x80c0463));
        } catch (e) {
            console.log("[UniqFactionPk] \u9009\u89d2\u4f1a\u8bdd\u6ca1\u6302\u4e0a " + e);
        }
        console.log("[UniqFactionPk] glinkd 已注册跨服帮战协议");
        return;
    }
    const sendAddr = findFn("_ZN4GNET8Protocol7Manager4SendEjPS0_b", 0);
    const ctorAddr = findFn("_ZN4GNET8ProtocolC2Ej", 0);
    const policy = findFn("_ZN4GNET8Protocol11CheckPolicyEjjRKNS0_7Manager7Session6StreamE", 0);
    if (sendAddr.isNull() || ctorAddr.isNull() || policy.isNull()) {
        console.log("[UniqFactionPk] gdeliveryd 符号不齐，协议桩没有挂上");
        return;
    }
    mgrSend = new NativeFunction(sendAddr, "int", ["pointer", "uint32", "pointer", "int"]);
    skipUnknownPolicy(policy);
    registerTypes(ctorAddr);
    console.log("[UniqFactionPk] gdeliveryd 已注册跨服帮战协议");
    try {
        restoreOnEnter(rebase(0x83fb6f2));
    } catch (e) {
        console.log("[UniqFactionPk] \u767b\u5f55\u6062\u590d\u6ca1\u6302\u4e0a " + e);
    }
    try {
        attachRaid();
    } catch (e) {
        console.log("[UniqFactionPk] \u5f00\u623f\u95f4\u6ca1\u6302\u4e0a " + e);
    }
    const broadcastFn = new NativeFunction(rebase(0x83e7318), "void", ["pointer", "pointer"]);
    const centralServer = rebase(0x8680364);
    setLinkSend((linksid, body) => {
        sendOn(deliveryServer(), linksid, T.invite, body);
    });
    setPushRole((role, type, body) => {
        const sess = sessions.get(role);
        if (!sess) {
            console.log("[UniqFactionPk] \u6ca1\u6709\u73a9\u5bb6\u4f1a\u8bdd role=" + role + " type=" + type);
            return;
        }
        sendOn(sess.manager, sess.sid, type, body);
    });
    setRelay((zone, type, body) => {
        if (isCentralServer()) return dispatchZone(zone, type, body);
        const centralClient = rebase(0x8680300);
        const up = canReachCentral() && centralClient.add(52).readU8() !== 0;
        if (!up) {
            console.log("[UniqFactionPk] \u4e2d\u5fc3\u670d\u6ca1\u8fde\u4e0a zone=" + zone + " type=" + type);
            return false;
        }
        sendOn(centralClient, centralClient.add(48).readU32(), type, body);
        console.log("[UniqFactionPk] \u5df2\u4ea4\u7ed9\u4e2d\u5fc3\u670d zone=" + zone + " type=" + type);
        return true;
    });
    attachCentral({
        toCentral(type, body) {
            const centralClient = rebase(0x8680300);
            if (centralClient.add(52).readU8() === 0) return;
            sendOn(centralClient, centralClient.add(48).readU32(), type, body);
        },
        broadcast(type, body) {
            const obj = allocProto(type);
            bodies.set(obj.toString(), body);
            try {
                broadcastFn(centralServer, obj);
            } finally {
                bodies.delete(obj.toString());
                if (delFn) delFn(obj);
            }
        },
    });

}
