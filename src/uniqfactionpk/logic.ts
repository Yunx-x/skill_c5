import {intAt, lastInt, R, W} from "./wire";

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
};

export const REQUESTS = [
    T.challenge, T.inviteRe, T.score, T.list, T.zone, T.faction,
    T.insert, T.remove, T.self, T.query,
];

export const REPLIES = [
    T.challengeRe, T.invite, T.begin, T.scoreRe, T.stop, T.listRe,
    T.zoneRe, T.factionRe, T.insertRe, T.removeRe, T.selfRe, T.queryRe,
];

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
}

const decls = new Map<number, Decl>();
const rooms = new Map<number, Room>();
let nextRoom = 1;
let zoneId = 1;

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
        case T.begin:
        case T.stop:
        case T.scoreRe:
        case T.listRe:
        case T.factionRe:
            return lastInt(body);
        default:
            return 0;
    }
}

function declItem(d: Decl): number[] {
    return new W().i32(d.factionId).i32(d.zoneId).octets(String(d.factionId)).i32(d.roleId).b;
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
        .octets(String(room.atkFaction))
        .octets(String(room.defFaction))
        .i16(0)
        .i16(0)
        .i16(0).b;
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
            .octets(String(room.atkFaction))
            .octets(String(room.defFaction))
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

function onZone(body: number[]): Out[] {
    const asked = intAt(body, 0);
    const role = intAt(body, 1);
    if (asked > 0) zoneId = asked;
    const zones = new W();
    zones.compact(1);
    zones.i32(zoneId);
    return [{
        type: T.zoneRe,
        body: new W().i32(zoneId).i32(role).raw(zones.b).i32(role).b,
    }];
}

function onQuery(body: number[]): Out[] {
    const role = intAt(body, 0);
    const page = intAt(body, 2);
    const list = Array.from(decls.values());
    const vec = new W();
    vec.compact(list.length);
    for (let i = 0; i < list.length; i++) vec.raw(declItem(list[i]));
    return [{
        type: T.queryRe,
        body: new W().i32(0).i32(role).i32(zoneId).i32(page).i32(list.length).i32(0).raw(vec.b).b,
    }];
}

function onInsert(body: number[]): Out[] {
    const role = intAt(body, 0);
    const faction = intAt(body, 2);
    if (faction !== 0) {
        decls.set(faction, {roleId: role, factionId: faction, zoneId});
    }
    return [{
        type: T.insertRe,
        body: new W().i32(0).i32(role).i32(0).i32(faction).i32(0).b,
    }];
}

function onRemove(body: number[]): Out[] {
    const role = intAt(body, 0);
    const faction = intAt(body, 2);
    if (faction !== 0) decls.delete(faction);
    else {
        for (const [id, d] of decls) {
            if (d.roleId === role) decls.delete(id);
        }
    }
    return [{
        type: T.removeRe,
        body: new W().i32(0).i32(role).i32(0).i32(faction).i32(0).b,
    }];
}

function onSelf(body: number[]): Out[] {
    const role = intAt(body, 0);
    const faction = intAt(body, 2);
    const hit = faction !== 0 ? decls.get(faction) : undefined;
    const mine = hit && hit.roleId === role ? 1 : 0;
    return [{
        type: T.selfRe,
        body: new W().i32(0).i32(role).i32(0).i32(faction).i32(mine).b,
    }];
}

function onFaction(body: number[]): Out[] {
    const zone = intAt(body, 0);
    const role = intAt(body, 1);
    const vec = new W();
    vec.compact(0);
    return [{
        type: T.factionRe,
        body: new W().i32(0).i32(zone || zoneId).i32(role).raw(vec.b).i32(role).b,
    }];
}

function onChallenge(body: number[]): Out[] {
    const srcZone = intAt(body, 0) || zoneId;
    const role = intAt(body, 1);
    const faction = intAt(body, 2);
    const mapId = intAt(body, 3);
    const dstZone = intAt(body, 4) || zoneId;
    const dstFaction = intAt(body, 5);
    const def = decls.get(dstFaction);
    const re = new W().i32(def ? 0 : 5).i32(srcZone).i32(role).i32(faction).i32(mapId).i32(dstZone).i32(dstFaction).i32(role);
    const outs: Out[] = [{type: T.challengeRe, body: re.b}];
    if (!def) return outs;
    const room = openRoom(role, faction, srcZone, def, mapId);
    outs.push({
        type: T.invite,
        body: new W()
            .i32(mapId)
            .i32(srcZone)
            .i32(faction)
            .octets(String(faction))
            .i32(dstZone)
            .i32(def.roleId)
            .i32(dstFaction)
            .octets(String(dstFaction))
            .i32(def.roleId).b,
    });
    outs.push(beginOf(room, role));
    outs.push(beginOf(room, def.roleId));
    return outs;
}

function onInviteRe(body: number[]): Out[] {
    const r = new R(body);
    r.i32();
    const role = r.i32();
    const mapId = r.i32();
    const result = r.u8();
    if (result === 0) return [];
    for (const room of rooms.values()) {
        if (room.defRole === role && (mapId === 0 || room.mapId === mapId) && !room.running) {
            room.running = true;
            return [beginOf(room, room.atkRole), beginOf(room, room.defRole)];
        }
    }
    return [];
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
        .octets(room ? String(room.atkFaction) : "")
        .i32(room ? room.defFaction : 0)
        .i32(room ? room.defZone : 0)
        .octets(room ? String(room.defFaction) : "")
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
