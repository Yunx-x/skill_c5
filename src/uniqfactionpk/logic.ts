import {openRaid} from "./raid";
import {intAt, lastInt, R, u16Name, W} from "./wire";

/** 和 18 客户端、16 服务端对过的协议号。 */
export const T = {
    challenge: 6886,
    challengeRe: 6887,
    invite: 6890,
    inviteRe: 6891,
    begin: 6892,
    score: 6894,
    scoreRe: 6895,
    stop: 6896,
    list: 6897,
    listRe: 6898,
    fight: 6900,
    zone: 6904,
    zoneRe: 6905,
    faction: 6906,
    factionRe: 6907,
    insert: 55623,
    insertRe: 55624,
    remove: 55625,
    removeRe: 55626,
    self: 55627,
    selfRe: 55628,
    query: 55629,
    queryRe: 55630,
    register: 6902,
    resend: 6903,
    inviteAsk: 6910,
    inviteResult: 6911,
};

export const REQUESTS = [
    T.challenge, T.inviteRe, T.score, T.list, T.zone, T.faction,
    T.insert, T.remove, T.self, T.query,
];

export const REPLIES = [
    T.challengeRe, T.invite, T.begin, T.scoreRe, T.stop, T.listRe,
    T.zoneRe, T.factionRe, T.insertRe, T.removeRe, T.selfRe, T.queryRe,
];

/** 服与服之间的名单同步，不走客户端。 */
export const SERVER = [T.register, T.resend, T.inviteAsk, T.inviteResult];

export interface Brief {
    zone: number;
    faction: number;
    level: number;
    activity: number;
    name: number[];
}

export interface Out {
    type: number;
    body: number[];
}

interface Decl {
    roleId: number;
    factionId: number;
    zoneId: number;
}

interface Room {
    id: number;
    mapId: number;
    atkRole: number;
    atkFaction: number;
    atkZone: number;
    defRole: number;
    defFaction: number;
    defZone: number;
    endTime: number;
    running: boolean;
    waiting: boolean;
    left: number[];
    atkName: number[];
    defName: number[];
    token: number;
}

export interface Leader {
    role: number;
    linksid: number;
    localsid: number;
}

let leadersOf: (faction: number) => Leader[] = () => [];
let linkSend: (linksid: number, body: number[]) => void = () => {};
let relay: (zone: number, type: number, body: number[]) => boolean = () => false;
let pushRole: (role: number, type: number, body: number[]) => void = () => {};
let roomToken = 1;

export function setLeadersOf(fn: (faction: number) => Leader[]) {
    leadersOf = fn;
}

export function setLinkSend(fn: (linksid: number, body: number[]) => void) {
    linkSend = fn;
}

export function setRelay(fn: (zone: number, type: number, body: number[]) => boolean) {
    relay = fn;
}

export function setPushRole(fn: (role: number, type: number, body: number[]) => void) {
    pushRole = fn;
}

const rooms = new Map<number, Room>();
let nextRoom = 1;
let zoneId = 1;
let serverZone = 1;
let answerFromStore = false;
const byZone = new Map<number, Brief[]>();
let localBriefs: (zone: number) => Brief[] = () => [];
let zoneList: () => number[] = () => [];

export function setServerZone(id: number) {
    if (id > 0) {
        serverZone = id;
        zoneId = id;
    }
}

export function setAnswerFromStore(on: boolean) {
    answerFromStore = on;
}

export function setLocalBriefs(fn: (zone: number) => Brief[]) {
    localBriefs = fn;
}

export function setZoneList(fn: () => number[]) {
    zoneList = fn;
}

export function storeZone(zone: number, briefs: Brief[]) {
    if (zone > 0) byZone.set(zone, briefs);
}

function nameBytes(r: R): number[] {
    const n = r.compact();
    const out: number[] = [];
    const cap = n > 128 ? 128 : n;
    for (let i = 0; i < cap; i++) out.push(r.u8());
    for (let i = cap; i < n; i++) r.u8();
    return out;
}

export function takeRegister(body: number[]) {
    if (!answerFromStore) return;
    const r = new R(body);
    const zone = r.i32();
    const n = r.compact();
    const briefs: Brief[] = [];
    for (let i = 0; i < n && i < 20; i++) {
        const faction = r.i32();
        const level = r.i32();
        const activity = r.i32();
        const name = nameBytes(r);
        if (faction !== 0) briefs.push({zone, faction, level, activity, name});
    }
    storeZone(zone, briefs);
    console.log(`[UniqFactionPk] 收到区${zone}帮派名单 ${briefs.length}`);
}

export function registerBody(zone: number, briefs: Brief[]): number[] {
    const w = new W();
    w.i32(zone).compact(briefs.length);
    for (let i = 0; i < briefs.length; i++) {
        const b = briefs[i];
        w.i32(b.faction).i32(b.level).i32(b.activity).compact(b.name.length).raw(b.name);
    }
    return w.b;
}

function writeBriefs(list: Brief[], zone: number): number[] {
    const vec = new W();
    vec.compact(list.length);
    for (let i = 0; i < list.length; i++) {
        const b = list[i];
        vec.i32(b.zone || zone).i32(b.faction).i32(b.level).i32(b.activity).compact(b.name.length).raw(b.name);
    }
    return vec.b;
}

export function roleOf(type: number, body: number[]): number {
    switch (type) {
        case T.zone:
            return intAt(body, 1);
        case T.zoneRe:
            return intAt(body, 1);
        case T.challenge:
            return intAt(body, 1);
        case T.challengeRe:
            return intAt(body, 2);
        case T.inviteRe:
            return intAt(body, 1);
        case T.list:
            return intAt(body, 1);
        case T.score:
            return intAt(body, 3);
        case T.faction:
            return intAt(body, 1);
        case T.query:
        case T.insert:
        case T.remove:
        case T.self:
            return intAt(body, 0);
        case T.queryRe:
        case T.insertRe:
        case T.removeRe:
        case T.selfRe:
            return intAt(body, 1);
        case T.invite: {
            const r = new R(body);
            r.i32();
            r.i32();
            r.i32();
            r.octets();
            r.i32();
            return r.i32();
        }
        case T.factionRe:
            return intAt(body, 1);
        case T.begin:
        case T.stop:
        case T.scoreRe:
        case T.listRe:
            return lastInt(body);
        default:
            return 0;
    }
}

function factionName(room: Room, side: "atk" | "def"): number[] {
    const raw = side === "atk" ? room.atkName : room.defName;
    if (raw.length) return raw;
    return u16Name(String(side === "atk" ? room.atkFaction : room.defFaction));
}

function roomItem(room: Room): number[] {
    return new W()
        .i32(room.id)
        .i32(room.atkFaction)
        .i32(room.atkZone)
        .i32(room.defFaction)
        .i32(room.defZone)
        .u8(1)
        .u8(1)
        .bytes(factionName(room, "atk"))
        .bytes(factionName(room, "def"))
        .i16(0)
        .i16(0)
        .i16(0).b;
}

export function beginForFaction(faction: number, role: number): number[] | null {
    if (!faction) return null;
    const now = Date.now() / 1000 | 0;
    for (const room of rooms.values()) {
        if (!room.running || room.endTime <= now) continue;
        const mine = (room.atkFaction === faction && room.atkZone === serverZone)
            || (room.defFaction === faction && room.defZone === serverZone);
        if (mine) return beginOf(room, role).body;
    }
    return null;
}

function beginOf(room: Room, roleId: number): Out {
    return {
        type: T.begin,
        body: new W()
            .i32(0)
            .i32(room.mapId)
            .i32(room.id)
            .i32(room.atkFaction)
            .i32(room.atkZone)
            .i32(room.defFaction)
            .i32(room.defZone)
            .bytes(room.atkName.length ? room.atkName : u16Name(String(room.atkFaction)))
            .bytes(room.defName.length ? room.defName : u16Name(String(room.defFaction)))
            .i32(roleId).b,
    };
}

function stopOf(room: Room, roleId: number): Out {
    return {
        type: T.stop,
        body: new W()
            .i32(room.atkFaction)
            .i32(room.atkZone)
            .i32(room.defFaction)
            .i32(room.defZone)
            .i32(room.mapId)
            .i32(room.id)
            .i32(roleId).b,
    };
}

function openRoom(atkRole: number, atkFaction: number, atkZone: number, def: Decl, mapId: number): Room {
    const room: Room = {
        id: nextRoom++,
        mapId,
        atkRole,
        atkFaction,
        atkZone,
        defRole: def.roleId,
        defFaction: def.factionId,
        defZone: def.zoneId,
        endTime: (Date.now() / 1000 | 0) + 1800,
        running: true,
        waiting: false,
        left: [],
        atkName: [],
        defName: [],
        token: 0,
    };
    rooms.set(room.id, room);
    return room;
}

export function handle(type: number, body: number[]): Out[] {
    switch (type) {
        case T.zone:
            return onZone(body);
        case T.query:
            return onQuery(body);
        case T.insert:
            return onInsert(body);
        case T.remove:
            return onRemove(body);
        case T.self:
            return onSelf(body);
        case T.faction:
            return onFaction(body);
        case T.challenge:
            return onChallenge(body);
        case T.inviteRe:
            return onInviteRe(body);
        case T.list:
            return onList(body);
        case T.score:
            return onScore(body);
        case T.fight:
            return onFight(body);
        default:
            return [];
    }
}

function pushZone(ids: number[], zone: number) {
    if (zone > 0 && ids.indexOf(zone) < 0) ids.push(zone);
}

function onZone(body: number[]): Out[] {
    const asked = intAt(body, 0);
    const role = intAt(body, 1);
    const ids: number[] = [];
    if (answerFromStore) {
        const stored = Array.from(byZone.keys());
        for (let i = 0; i < stored.length; i++) pushZone(ids, stored[i]);
    } else {
        const extra = zoneList();
        for (let i = 0; i < extra.length; i++) pushZone(ids, extra[i]);
    }
    if (!ids.length) pushZone(ids, serverZone);
    const zones = new W();
    zones.compact(ids.length);
    for (let i = 0; i < ids.length; i++) zones.i32(ids[i]);
    const shown = asked > 0 ? asked : (ids.length ? ids[0] : serverZone);
    console.log("[UniqFactionPk] \u533a\u670d\u5217\u8868 role=" + role + " zones=" + ids.join(","));
    return [{
        type: T.zoneRe,
        body: new W().i32(shown).i32(role).raw(zones.b).i32(role).b,
    }];
}

function onQuery(body: number[]): Out[] {
    const role = intAt(body, 0);
    const page = intAt(body, 2);
    const vec = new W().compact(0);
    return [{
        type: T.queryRe,
        body: new W().i32(0).i32(role).i32(zoneId).i32(page).i32(0).i32(0).raw(vec.b).b,
    }];
}

function onInsert(body: number[]): Out[] {
    const role = intAt(body, 0);
    const faction = intAt(body, 2);
    return [{
        type: T.insertRe,
        body: new W().i32(1).i32(role).i32(0).i32(faction).i32(0).b,
    }];
}

function onRemove(body: number[]): Out[] {
    const role = intAt(body, 0);
    const faction = intAt(body, 2);
    return [{
        type: T.removeRe,
        body: new W().i32(1).i32(role).i32(0).i32(faction).i32(0).b,
    }];
}

function onSelf(body: number[]): Out[] {
    const role = intAt(body, 0);
    const faction = intAt(body, 2);
    return [{
        type: T.selfRe,
        body: new W().i32(1).i32(role).i32(0).i32(faction).i32(0).b,
    }];
}

function onFaction(body: number[]): Out[] {
    const zone = intAt(body, 0) || serverZone;
    const role = intAt(body, 1);
    const target = intAt(body, 2) || zone;
    let list: Brief[] = [];
    if (answerFromStore) list = byZone.get(target) || [];
    else list = localBriefs(target);
    console.log(`[UniqFactionPk] \u5e2e\u6d3e\u5217\u8868 zone=${zone} role=${role} target=${target} count=${list.length}`);
    return [{
        type: T.factionRe,
        body: new W().i32(zone).i32(role).i32(target).raw(writeBriefs(list, target)).i32(0).b,
    }];
}

function briefsOf(zone: number): Brief[] {
    if (answerFromStore) return byZone.get(zone) || [];
    return localBriefs(zone);
}

function findBrief(zone: number, faction: number): Brief | undefined {
    const list = briefsOf(zone);
    for (let i = 0; i < list.length; i++) {
        if (list[i].faction === faction) return list[i];
    }
    return undefined;
}

function listedFaction(zone: number, faction: number): Brief | undefined {
    if (!faction) return undefined;
    const direct = findBrief(zone, faction);
    if (direct) return direct;
    const ids = zoneList();
    for (let i = 0; i < ids.length; i++) {
        if (ids[i] === zone) continue;
        const hit = findBrief(ids[i], faction);
        if (hit) return hit;
    }
    return undefined;
}

function challengeAnswer(ret: number, srcZone: number, role: number, faction: number, mapId: number, dstZone: number, dstFaction: number): number[] {
    return new W().i32(ret).i32(srcZone).i32(role).i32(faction).i32(mapId).i32(dstZone).i32(dstFaction).i32(role).b;
}

function answerTo(role: number, ret: number, room: Room) {
    pushRole(role, T.challengeRe, challengeAnswer(ret, room.atkZone, role, room.atkFaction, room.mapId, room.defZone, room.defFaction));
}

function inviteBody(room: Room, localsid: number): number[] {
    return new W()
        .i32(room.mapId)
        .i32(room.atkZone)
        .i32(room.atkFaction)
        .bytes(room.atkName)
        .i32(room.defZone)
        .i32(localsid)
        .i32(room.defFaction)
        .bytes(room.defName)
        .i32(room.id)
        .i32(0).b;
}

export function inviteLocalsid(body: number[]): number {
    const r = new R(body);
    r.i32();
    r.i32();
    r.i32();
    r.octets();
    r.i32();
    return r.i32();
}

function askBody(room: Room, role: number): number[] {
    return new W()
        .i32(room.id)
        .i32(room.mapId)
        .i32(room.atkZone)
        .i32(role)
        .i32(room.atkFaction)
        .i32(room.defZone)
        .i32(room.defFaction)
        .bytes(room.atkName)
        .bytes(room.defName).b;
}

function resultBody(room: Room, code: number, replyRole: number): number[] {
    return new W()
        .i32(room.id)
        .i32(room.atkZone)
        .i32(room.defZone)
        .i32(code)
        .i32(replyRole)
        .i32(room.mapId)
        .i32(room.atkFaction)
        .i32(room.defFaction).b;
}

function sendInvites(room: Room, leaders: Leader[]) {
    for (let i = 0; i < leaders.length; i++) {
        const leader = leaders[i];
        linkSend(leader.linksid, inviteBody(room, leader.localsid));
        console.log("[UniqFactionPk] \u9080\u8bf7 role=" + leader.role + " link=" + leader.linksid + " local=" + leader.localsid + " room=" + room.id);
    }
}

function armWait(room: Room, role: number) {
    const token = room.token;
    setTimeout(() => {
        const cur = rooms.get(room.id);
        if (!cur || cur.token !== token || !cur.waiting) return;
        cur.waiting = false;
        rooms.delete(cur.id);
        if (cur.atkZone === serverZone) answerTo(role, 51, cur);
        console.log("[UniqFactionPk] \u9080\u8bf7\u8d85\u65f6 room=" + cur.id);
    }, 300000);
}

function holdRoom(id: number, mapId: number, role: number, atkFaction: number, atkZone: number, defFaction: number, defZone: number, atkName: number[], defName: number[], leaders: Leader[]): Room {
    if (id >= nextRoom) nextRoom = id + 1;
    const room: Room = {
        id,
        mapId,
        atkRole: role,
        atkFaction,
        atkZone,
        defRole: 0,
        defFaction,
        defZone,
        endTime: (Date.now() / 1000 | 0) + 1800,
        running: false,
        waiting: true,
        left: leaders.map((leader) => leader.role),
        atkName,
        defName,
        token: roomToken++,
    };
    rooms.set(room.id, room);
    return room;
}

function namesOf(zone: number, faction: number, fallback: number[]): number[] {
    const brief = listedFaction(zone, faction);
    if (brief && brief.name.length) return brief.name;
    return fallback;
}

function onChallenge(body: number[]): Out[] {
    const srcZone = intAt(body, 0) || serverZone;
    const role = intAt(body, 1);
    const faction = intAt(body, 2);
    const mapId = intAt(body, 3) || 0x20d;
    const dstZone = intAt(body, 4) || serverZone;
    const dstFaction = intAt(body, 5);
    const brief = listedFaction(dstZone, dstFaction);
    console.log("[UniqFactionPk] \u7533\u8bf7\u5e2e\u6218 role=" + role + " src=" + srcZone + "/" + faction + " dst=" + dstZone + "/" + dstFaction + " map=" + mapId + " listed=" + (brief ? 1 : 0));
    if (!brief) {
        return [{type: T.challengeRe, body: challengeAnswer(5, srcZone, role, faction, mapId, dstZone, dstFaction)}];
    }
    const atkName = namesOf(serverZone, faction, u16Name(String(faction || srcZone)));
    const defName = brief.name.length ? brief.name : u16Name(String(brief.faction));
    const targetZone = brief.zone || dstZone;
    if (targetZone === serverZone) {
        console.log("[UniqFactionPk] \u540c\u533a\u4e0d\u5141\u8bb8 faction=" + brief.faction);
        return [{type: T.challengeRe, body: challengeAnswer(70, srcZone, role, faction, mapId, targetZone, brief.faction)}];
    }
    const room = holdRoom(nextRoom++, mapId, role, faction, serverZone, brief.faction, targetZone, atkName, defName, []);
    if (!relay(targetZone, T.inviteAsk, askBody(room, role))) {
        rooms.delete(room.id);
        console.log("[UniqFactionPk] \u8de8\u533a\u9080\u8bf7\u6ca1\u6709\u9001\u51fa dst=" + targetZone);
        return [{type: T.challengeRe, body: challengeAnswer(5, srcZone, role, faction, mapId, targetZone, brief.faction)}];
    }
    armWait(room, role);
    return [];
}

function findWaiting(mapId: number, atkZone: number, atkFaction: number, defZone: number, defFaction: number): Room | undefined {
    for (const room of rooms.values()) {
        if (!room.waiting) continue;
        if (room.mapId === mapId && room.atkZone === atkZone && room.atkFaction === atkFaction && room.defZone === defZone && room.defFaction === defFaction) {
            return room;
        }
    }
    return undefined;
}

function knownLeader(room: Room, roleKey: number, otherKey: number): number {
    for (let i = 0; i < room.left.length; i++) {
        if (room.left[i] === roleKey || room.left[i] === otherKey) return room.left[i];
    }
    return 0;
}

function onInviteRe(body: number[]): Out[] {
    const r = new R(body);
    const otherKey = r.i32();
    const roleKey = r.i32();
    const mapId = r.i32();
    const result = r.u8();
    const atkZone = r.i32();
    const atkFaction = r.i32();
    const defZone = r.i32();
    const defFaction = r.i32();
    const room = findWaiting(mapId, atkZone, atkFaction, defZone, defFaction);
    console.log("[UniqFactionPk] \u5e94\u6218 role=" + roleKey + " other=" + otherKey + " result=" + result + " room=" + (room ? room.id : 0));
    if (!room) return [];
    const leader = knownLeader(room, roleKey, otherKey);
    if (!leader) return [];
    if (result !== 0) {
        room.waiting = false;
        room.running = true;
        openRaid(room.id, room.mapId);
        room.defRole = leader;
        room.left = [];
        const outs = [beginOf(room, roleKey)];
        if (room.atkZone !== serverZone) relay(room.atkZone, T.inviteResult, resultBody(room, 1, roleKey));
        else outs.push(beginOf(room, room.atkRole));
        return outs;
    }
    room.left = room.left.filter((id) => id !== leader);
    if (room.left.length) return [];
    room.waiting = false;
    rooms.delete(room.id);
    if (room.atkZone !== serverZone) relay(room.atkZone, T.inviteResult, resultBody(room, 0, roleKey));
    else answerTo(room.atkRole, 50, room);
    return [];
}

export function onInviteAsk(body: number[]): void {
    const r = new R(body);
    const id = r.i32();
    const mapId = r.i32();
    const atkZone = r.i32();
    const role = r.i32();
    const atkFaction = r.i32();
    const defZone = r.i32();
    const defFaction = r.i32();
    const atkName = r.bytes();
    const defName = r.bytes();
    if (defZone !== serverZone) return;
    const leaders = leadersOf(defFaction);
    const room = holdRoom(id, mapId, role, atkFaction, atkZone, defFaction, defZone, atkName, defName.length ? defName : namesOf(defZone, defFaction, []), leaders);
    if (!leaders.length) {
        room.waiting = false;
        rooms.delete(room.id);
        relay(atkZone, T.inviteResult, resultBody(room, 2, 0));
        console.log("[UniqFactionPk] \u76ee\u6807\u533a\u5e2e\u4e3b\u526f\u5e2e\u4e3b\u90fd\u4e0d\u5728\u7ebf faction=" + defFaction);
        return;
    }
    sendInvites(room, leaders);
    armWait(room, role);
    relay(atkZone, T.inviteResult, resultBody(room, 3, 0));
}

export function askMissBody(body: number[]): number[] {
    return new W()
        .i32(intAt(body, 0))
        .i32(intAt(body, 2))
        .i32(intAt(body, 5))
        .i32(2)
        .i32(0)
        .i32(intAt(body, 1))
        .i32(intAt(body, 4))
        .i32(intAt(body, 6)).b;
}

export function onInviteResult(body: number[]): void {
    const id = intAt(body, 0);
    const code = intAt(body, 3);
    const replyRole = intAt(body, 4);
    const room = rooms.get(id);
    if (!room || room.atkZone !== serverZone) return;
    if (code === 3) {
        answerTo(room.atkRole, 0, room);
        return;
    }
    if (code === 2) {
        room.waiting = false;
        rooms.delete(room.id);
        answerTo(room.atkRole, 48, room);
        return;
    }
    if (code === 1) {
        room.waiting = false;
        room.running = true;
        openRaid(room.id, room.mapId);
        room.defRole = replyRole;
        pushRole(room.atkRole, T.begin, beginOf(room, room.atkRole).body);
        return;
    }
    room.waiting = false;
    rooms.delete(room.id);
    answerTo(room.atkRole, 50, room);
}

function onList(body: number[]): Out[] {
    const zone = intAt(body, 0) || zoneId;
    const role = intAt(body, 1);
    const mapId = intAt(body, 2);
    const vec = new W();
    const list: Room[] = [];
    for (const room of rooms.values()) {
        if (room.running && (mapId === 0 || room.mapId === mapId)) list.push(room);
    }
    vec.compact(list.length);
    for (let i = 0; i < list.length; i++) vec.raw(roomItem(list[i]));
    return [{
        type: T.listRe,
        body: new W().i32(0).i32(zone).i32(role).i32(mapId).raw(vec.b).i32(role).b,
    }];
}

function onScore(body: number[]): Out[] {
    const mapId = intAt(body, 0);
    const roomId = intAt(body, 1);
    const zone = intAt(body, 2);
    const role = intAt(body, 3);
    const room = rooms.get(roomId);
    const empty = new W().compact(0).b;
    const w = new W()
        .i32(room ? 0 : 6)
        .i32(role)
        .i32(zone || zoneId)
        .i32(room ? room.mapId : mapId)
        .i32(roomId)
        .i32(room ? room.atkFaction : 0)
        .i32(room ? room.atkZone : 0)
        .bytes(room ? factionName(room, "atk") : [])
        .i32(room ? room.defFaction : 0)
        .i32(room ? room.defZone : 0)
        .bytes(room ? factionName(room, "def") : [])
        .raw(empty)
        .raw(empty)
        .i32(room ? Math.max(0, room.endTime - (Date.now() / 1000 | 0)) : 0)
        .i16(0)
        .i16(0)
        .i16(0)
        .i32(0)
        .i32(role);
    return [{type: T.scoreRe, body: w.b}];
}

function onFight(body: number[]): Out[] {
    const mapId = intAt(body, 0);
    const roomId = intAt(body, 1);
    const endTime = intAt(body, 2);
    const started = body.length > 12 ? body[12] : 0;
    const room = rooms.get(roomId);
    if (!room) {
        console.log(`[UniqFactionPk] 6900 没有房间 room=${roomId} map=${mapId} start=${started}`);
        return [];
    }
    room.mapId = mapId || room.mapId;
    room.endTime = endTime || room.endTime;
    room.running = started !== 0;
    if (started !== 0) {
        return [beginOf(room, room.atkRole), beginOf(room, room.defRole)];
    }
    const outs = [stopOf(room, room.atkRole), stopOf(room, room.defRole)];
    rooms.delete(room.id);
    return outs;
}
