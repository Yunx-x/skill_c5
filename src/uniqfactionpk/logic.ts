import {centralLink, closeRaid, crossedRoles, forgetRaid, homeOf, openRaid} from "./raid";
import {intAt, lastInt, R, u16Name, W} from "./wire";
import {WarPeriod, warBroadcastText} from "./broadcast";
import {grantsFor, loadReward, MailText} from "./reward";

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
    roomSync: 6912,
    item: 6913,
    itemRe: 6914,
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
export const SERVER = [T.register, T.resend, T.inviteAsk, T.inviteResult, T.roomSync, T.item, T.itemRe];

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

interface ScoreRow {
    role: number;
    kills: number;
    deaths: number;
    faction: number;
    side: number;
    name: number[];
    homeRole: number;
    homeZone: number;
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
    worldIndex: number;
    trusted: boolean;
    rows: ScoreRow[];
    atkCount: number;
    defCount: number;
    broadcasted: WarPeriod[];
    rewarded: boolean;
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

const CONFIG_PATH = "/root/uniqfaction.json";
const DEFAULT_START = 12 * 60;
const DEFAULT_END = 21 * 60 + 45;
let gate: (role: number, faction: number, defLevel: number) => number = () => 0;
let factionLevel: (faction: number) => number = () => 1;
let localWar: (faction: number) => number = () => 0;
let roster: (faction: number) => Leader[] = () => [];
let askItem: (role: number, action: number, token: number) => boolean = () => false;
let announce: (text: string) => void = () => {};
let sendMail: (role: number, title: string, context: string, itemId: number, count: number, proctype: number) => boolean = () => false;
let memberSend: (linksid: number, type: number, body: number[]) => void = () => {};

export function setGate(fn: (role: number, faction: number, defLevel: number) => number) {
    gate = fn;
}

export function setFactionLevel(fn: (faction: number) => number) {
    factionLevel = fn;
}

export function setLocalWar(fn: (faction: number) => number) {
    localWar = fn;
}

export function setRoster(fn: (faction: number) => Leader[] ) {
    roster = fn;
}

export function setAskItem(fn: (role: number, action: number, token: number) => boolean) {
    askItem = fn;
}

export function setAnnounce(fn: (text: string) => void) {
    announce = fn;
}

export function setSendMail(fn: (role: number, title: string, context: string, itemId: number, count: number, proctype: number) => boolean) {
    sendMail = fn;
}

export function setMemberSend(fn: (linksid: number, type: number, body: number[]) => void) {
    memberSend = fn;
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
        worldIndex: 0,
        trusted: false,
        rows: [],
        atkCount: 0,
        defCount: 0,
        broadcasted: [],
        rewarded: false,
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
        case T.roomSync:
            applyRoomSync(body);
            return [];
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
        worldIndex: 0,
        trusted: false,
        rows: [],
        atkCount: 0,
        defCount: 0,
        broadcasted: [],
        rewarded: false,
    };
    rooms.set(room.id, room);
    return room;
}

function namesOf(zone: number, faction: number, fallback: number[]): number[] {
    const brief = listedFaction(zone, faction);
    if (brief && brief.name.length) return brief.name;
    return fallback;
}

interface ItemWait {
    role: number;
    srcZone: number;
    faction: number;
    mapId: number;
    dstZone: number;
    dstFaction: number;
    timer: ReturnType<typeof setTimeout>;
}

const itemWaits = new Map<number, ItemWait>();
const inside = new Map<number, {atk: number[]; def: number[]}>();

function clockPart(v: unknown, max: number): number {
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    if (n !== n || n < 0 || n > max) return -1;
    return n | 0;
}

function loadOpenHours(): {start: number; end: number} {
    const fallback = {start: DEFAULT_START, end: DEFAULT_END};
    let text = "";
    try {
        text = File.readAllText(CONFIG_PATH);
    } catch (e) {
        return fallback;
    }
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    try {
        const data = JSON.parse(text);
        const raw = data && data.hours;
        if (!raw || typeof raw !== "object") return fallback;
        const sh = clockPart(raw.startHour, 23);
        const sm = clockPart(raw.startMinute, 59);
        const eh = clockPart(raw.endHour, 23);
        const em = clockPart(raw.endMinute, 59);
        if (sh < 0 || sm < 0 || eh < 0 || em < 0) {
            console.log("[UniqFactionPk] \u7533\u8bf7\u65f6\u6bb5\u914d\u7f6e\u65e0\u6548");
            return fallback;
        }
        const start = sh * 60 + sm;
        const end = eh * 60 + em;
        if (end <= start) {
            console.log("[UniqFactionPk] \u7533\u8bf7\u65f6\u6bb5\u7ed3\u675f\u4e0d\u665a\u4e8e\u5f00\u59cb");
            return fallback;
        }
        return {start, end};
    } catch (e) {
        console.log("[UniqFactionPk] \u7533\u8bf7\u65f6\u6bb5\u89e3\u6790\u5931\u8d25 " + e);
        return fallback;
    }
}

function hourCode(): number {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const open = loadOpenHours();
    if (minutes < open.start || minutes >= open.end) {
        console.log("[UniqFactionPk] \u4e0d\u5728\u7533\u8bf7\u65f6\u6bb5 " + now.getHours() + ":" + two(now.getMinutes()) + " open=" + (open.start / 60 | 0) + ":" + two(open.start % 60) + "-" + (open.end / 60 | 0) + ":" + two(open.end % 60));
        return 93;
    }
    return 0;
}

function failChallenge(ret: number, srcZone: number, role: number, faction: number, mapId: number, dstZone: number, dstFaction: number): Out[] {
    return [{type: T.challengeRe, body: challengeAnswer(ret, srcZone, role, faction, mapId, dstZone, dstFaction)}];
}

function launchChallenge(srcZone: number, role: number, faction: number, mapId: number, dstZone: number, dstFaction: number) {
    const brief = listedFaction(dstZone, dstFaction);
    if (!brief) {
        pushRole(role, T.challengeRe, challengeAnswer(5, srcZone, role, faction, mapId, dstZone, dstFaction));
        return;
    }
    const atkName = namesOf(serverZone, faction, u16Name(String(faction || srcZone)));
    const defName = brief.name.length ? brief.name : u16Name(String(brief.faction));
    const targetZone = brief.zone || dstZone;
    const room = holdRoom(nextRoom++, mapId, role, faction, serverZone, brief.faction, targetZone, atkName, defName, []);
    if (!relay(targetZone, T.inviteAsk, askBody(room, role))) {
        rooms.delete(room.id);
        console.log("[UniqFactionPk] \u8de8\u533a\u9080\u8bf7\u6ca1\u6709\u9001\u51fa dst=" + targetZone);
        pushRole(role, T.challengeRe, challengeAnswer(5, srcZone, role, faction, mapId, targetZone, brief.faction));
        return;
    }
    armWait(room, role);
}

export function onItemReply(body: number[]) {
    const token = intAt(body, 0);
    const ok = intAt(body, 1) !== 0;
    const action = intAt(body, 2);
    const wait = itemWaits.get(token);
    if (action !== 1 || !wait) {
        console.log("[UniqFactionPk] \u6263\u7269\u54c1 token=" + token + " ok=" + (ok ? 1 : 0));
        return;
    }
    clearTimeout(wait.timer);
    itemWaits.delete(token);
    if (!ok) {
        console.log("[UniqFactionPk] \u6ca1\u6709\u6311\u6218\u4ee4 role=" + wait.role);
        pushRole(wait.role, T.challengeRe, challengeAnswer(16, wait.srcZone, wait.role, wait.faction, wait.mapId, wait.dstZone, wait.dstFaction));
        return;
    }
    launchChallenge(wait.srcZone, wait.role, wait.faction, wait.mapId, wait.dstZone, wait.dstFaction);
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
        return failChallenge(5, srcZone, role, faction, mapId, dstZone, dstFaction);
    }
    const targetZone = brief.zone || dstZone;
    if (targetZone === serverZone) {
        console.log("[UniqFactionPk] \u540c\u533a\u4e0d\u5141\u8bb8 faction=" + brief.faction);
        return failChallenge(70, srcZone, role, faction, mapId, targetZone, brief.faction);
    }
    const when = hourCode();
    if (when) return failChallenge(when, srcZone, role, faction, mapId, targetZone, brief.faction);
    const blocked = gate(role, faction, brief.level);
    if (blocked) {
        console.log("[UniqFactionPk] \u7533\u8bf7\u88ab\u62e6 code=" + blocked + " role=" + role);
        return failChallenge(blocked, srcZone, role, faction, mapId, targetZone, brief.faction);
    }
    const itemCode = checkChallengeItem(role);
    if (itemCode) {
        console.log("[UniqFactionPk] \u7269\u54c1\u4e0d\u591f code=" + itemCode + " role=" + role);
        return failChallenge(itemCode, srcZone, role, faction, mapId, targetZone, brief.faction);
    }
    launchChallenge(srcZone, role, faction, mapId, targetZone, brief.faction);
    return [];
}

function checkChallengeItem(role: number): number {
    return 0;
}

function takeChallengeItem(role: number): void {
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
        broadcastWar(room, "accept");
        room.waiting = false;
        room.running = true;
        shareRoom(room);
        openRaid(room.id, room.mapId);
        room.defRole = leader;
        room.left = [];
        const outs = [beginOf(room, roleKey)];
        if (room.atkZone !== serverZone) relay(room.atkZone, T.inviteResult, resultBody(room, 1, roleKey));
        else outs.push(beginOf(room, room.atkRole));
        tellMembers(room, room.defFaction, [roleKey]);
        if (room.atkZone === serverZone) tellMembers(room, room.atkFaction, [room.atkRole]);
        return outs;
    }
    room.left = room.left.filter((id) => id !== leader);
    if (room.left.length) return [];
    broadcastWar(room, "retreat");
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
    const level = factionLevel(defFaction);
    const war = localWar(defFaction);
    if (level <= 0 || war === 47) {
        room.waiting = false;
        rooms.delete(room.id);
        const code = war === 47 ? 4 : 5;
        relay(atkZone, T.inviteResult, resultBody(room, code, 0));
        console.log("[UniqFactionPk] \u5b88\u65b9\u4e0d\u7b26\u5408 level=" + level + " war=" + war + " faction=" + defFaction);
        return;
    }
    broadcastWar(room, "ask");
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
        broadcastWar(room, "ask");
        answerTo(room.atkRole, 0, room);
        return;
    }
    if (code === 2) {
        room.waiting = false;
        rooms.delete(room.id);
        answerTo(room.atkRole, 48, room);
        return;
    }
    if (code === 4 || code === 5 || code === 6) {
        room.waiting = false;
        rooms.delete(room.id);
        answerTo(room.atkRole, code === 4 ? 47 : code === 6 ? 93 : 45, room);
        return;
    }
    if (code === 1) {
        broadcastWar(room, "accept");
        room.waiting = false;
        room.running = true;
        shareRoom(room);
        openRaid(room.id, room.mapId);
        room.defRole = replyRole;
        pushRole(room.atkRole, T.begin, beginOf(room, room.atkRole).body);
        tellMembers(room, room.atkFaction, [room.atkRole]);
        takeChallengeItem(room.atkRole);
        return;
    }
    if (code === 0) broadcastWar(room, "retreat");
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


let centralNow: () => boolean = () => false;
const pendingFight = new Map<number, {mapId: number; endTime: number; started: number}>();
const pendingKills: {mapId: number; index: number; killer: number; victim: number; victimFaction: number; killerName: number[]; victimName: number[]}[] = [];

export function setCentral(fn: () => boolean) {
    centralNow = fn;
}

function shareRoom(room: Room) {
    const body = packRoom(room);
    if (!centralNow()) {
        relay(0, T.roomSync, body);
        return;
    }
    if (room.atkZone && room.atkZone !== serverZone) relay(room.atkZone, T.roomSync, body);
    if (room.defZone && room.defZone !== serverZone && room.defZone !== room.atkZone) relay(room.defZone, T.roomSync, body);
}

function packRoom(room: Room): number[] {
    const w = new W()
        .i32(room.id)
        .i32(room.mapId)
        .i32(room.endTime)
        .i32(room.trusted ? 1 : 0)
        .i32(room.running ? 1 : 0)
        .i32(room.atkRole)
        .i32(room.atkFaction)
        .i32(room.atkZone)
        .bytes(room.atkName)
        .i32(room.defRole)
        .i32(room.defFaction)
        .i32(room.defZone)
        .bytes(room.defName)
        .i32(room.worldIndex)
        .compact(room.rows.length);
    for (let i = 0; i < room.rows.length; i++) {
        const row = room.rows[i];
        w.i32(row.role).i16(row.kills).i16(row.deaths).i32(row.faction).i32(row.side).bytes(row.name).i32(row.homeRole).i32(row.homeZone);
    }
    w.i16(room.atkCount).i16(room.defCount);
    return w.b;
}

function blankRoom(id: number): Room {
    return {
        id, mapId: 0, atkRole: 0, atkFaction: 0, atkZone: 0, defRole: 0, defFaction: 0, defZone: 0,
        endTime: 0, running: false, waiting: false, left: [], atkName: [], defName: [], token: 0,
        worldIndex: 0, trusted: false, rows: [], atkCount: 0, defCount: 0, broadcasted: [], rewarded: false,
    };
}

export function applyRoomSync(body: number[]) {
    const r = new R(body);
    const id = r.i32();
    if (!id) return;
    const mapId = r.i32();
    const endTime = r.i32();
    const trusted = r.i32() === 1;
    const running = r.i32() === 1;
    const atkRole = r.i32();
    const atkFaction = r.i32();
    const atkZone = r.i32();
    const atkName = r.bytes();
    const defRole = r.i32();
    const defFaction = r.i32();
    const defZone = r.i32();
    const defName = r.bytes();
    const worldIndex = r.i32();
    const count = r.compact();
    const rows: ScoreRow[] = [];
    for (let i = 0; i < count; i++) {
        rows.push({
            role: r.i32(),
            kills: r.i16(),
            deaths: r.i16(),
            faction: r.i32(),
            side: r.i32(),
            name: r.bytes(),
            homeRole: r.i32(),
            homeZone: r.i32(),
        });
    }
    let atkCount = -1;
    let defCount = -1;
    if (r.rest() >= 4) {
        atkCount = r.i16();
        defCount = r.i16();
    }
    let room = rooms.get(id);
    const created = !room;
    if (!room) {
        room = blankRoom(id);
        rooms.set(id, room);
        if (id >= nextRoom) nextRoom = id + 1;
    }
    if (mapId) room.mapId = mapId;
    if (atkName.length) room.atkName = atkName;
    if (defName.length) room.defName = defName;
    if (atkFaction) room.atkFaction = atkFaction;
    if (defFaction) room.defFaction = defFaction;
    if (atkZone) room.atkZone = atkZone;
    if (defZone) room.defZone = defZone;
    if (atkRole) room.atkRole = atkRole;
    if (defRole) room.defRole = defRole;
    if (worldIndex) room.worldIndex = worldIndex;
    if (trusted || !room.trusted) {
        if (endTime) room.endTime = endTime;
        if (trusted) room.trusted = true;
    }
    const wasRunning = room.running;
    if (trusted) room.running = running;
    else if (running) room.running = true;
    const justStopped = wasRunning && !room.running;
    if (justStopped) stopEveryone(room);
    if (count > 0) room.rows = rows;
    if (atkCount >= 0) {
        room.atkCount = atkCount;
        room.defCount = defCount;
    }
    if (justStopped) {
        broadcastWar(room, "end");
        if (!centralNow()) payRewards(room);
    }
    const pending = pendingFight.get(id);
    if (pending && pending.endTime && !room.trusted) {
        room.endTime = pending.endTime;
        room.trusted = true;
        room.mapId = pending.mapId || room.mapId;
        room.running = pending.started !== 0;
        pendingFight.delete(id);
        shareRoom(room);
    }
    if (created) flushKills();
    console.log("[UniqFactionPk] \u8ba1\u5206\u540c\u6b65 room=" + id + " end=" + room.endTime + " rows=" + room.rows.length + " run=" + (room.running ? 1 : 0));
}

function scoreRows(room: Room, side: number): number[] {
    const rows = room.rows.filter((row) => row.side === side);
    const w = new W().compact(rows.length);
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        w.i32(row.role).i16(row.kills).i16(row.deaths).i32(row.faction).bytes(row.name);
    }
    return w.b;
}

function findScoreRoom(mapId: number, index: number): Room | undefined {
    if (index) {
        for (const room of rooms.values()) {
            if (room.worldIndex === index) return room;
        }
    }
    const hits: Room[] = [];
    for (const room of rooms.values()) {
        if (room.running && mapId && room.mapId === mapId) hits.push(room);
    }
    return hits.length === 1 ? hits[0] : undefined;
}

function bump(room: Room, role: number, side: number, faction: number, name: number[], kills: number, deaths: number) {
    let row: ScoreRow | undefined;
    for (let i = 0; i < room.rows.length; i++) {
        if (room.rows[i].role === role) row = room.rows[i];
    }
    if (!row) {
        row = {role, side, faction, name, kills: 0, deaths: 0, homeRole: 0, homeZone: 0};
        room.rows.push(row);
    }
    const home = homeOf(role);
    if (home && !row.homeRole) {
        row.homeRole = home.role;
        row.homeZone = home.zone;
    }
    if (name.length) row.name = name;
    row.side = side;
    row.faction = faction || row.faction;
    row.kills += kills;
    row.deaths += deaths;
}

function addKill(room: Room, killer: number, victim: number, victimFaction: number, killerName: number[], victimName: number[]) {
    let victimSide = 0;
    if (victimFaction && victimFaction === room.defFaction && victimFaction !== room.atkFaction) victimSide = 2;
    else if (victimFaction && victimFaction === room.atkFaction && victimFaction !== room.defFaction) victimSide = 1;
    if (!victimSide) return false;
    const killerSide = victimSide === 1 ? 2 : 1;
    const killerFaction = killerSide === 1 ? room.atkFaction : room.defFaction;
    bump(room, killer, killerSide, killerFaction, killerName, 1, 0);
    bump(room, victim, victimSide, victimFaction, victimName, 0, 1);
    return true;
}

function flushKills() {
    const left: typeof pendingKills = [];
    for (let i = 0; i < pendingKills.length; i++) {
        const hit = pendingKills[i];
        const room = findScoreRoom(hit.mapId, hit.index);
        if (!room || !addKill(room, hit.killer, hit.victim, hit.victimFaction, hit.killerName, hit.victimName)) {
            left.push(hit);
            continue;
        }
        shareRoom(room);
        console.log("[UniqFactionPk] \u51fb\u6740 room=" + room.id + " killer=" + hit.killer + " victim=" + hit.victim);
    }
    pendingKills.length = 0;
    for (let i = 0; i < left.length; i++) pendingKills.push(left[i]);
}

export function bindInstance(roomId: number, index: number) {
    const room = rooms.get(roomId);
    if (!room || !index) return;
    room.worldIndex = index;
    flushKills();
}

export function noteKill(mapId: number, index: number, killer: number, victim: number, victimFaction: number, killerName: number[], victimName: number[]) {
    if (!killer || killer === victim) return;
    const room = findScoreRoom(mapId, index);
    if (!room) {
        if (mapId === 525 && pendingKills.length < 40) {
            pendingKills.push({mapId, index, killer, victim, victimFaction, killerName, victimName});
        }
        return;
    }
    if (!addKill(room, killer, victim, victimFaction, killerName, victimName)) {
        console.log("[UniqFactionPk] \u51fb\u6740\u5bf9\u4e0d\u4e0a\u5e2e\u6d3e room=" + room.id + " victimFaction=" + victimFaction);
        return;
    }
    shareRoom(room);
    console.log("[UniqFactionPk] \u51fb\u6740 room=" + room.id + " killer=" + killer + " victim=" + victim);
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
        .raw(room ? scoreRows(room, 1) : empty)
        .raw(room ? scoreRows(room, 2) : empty)
        .i32(room ? Math.max(0, room.endTime - (Date.now() / 1000 | 0)) : 0)
        .i16(room ? room.atkCount : 0)
        .i16(room ? room.defCount : 0)
        .i16(0)
        .i32(0)
        .i32(role);
    return [{type: T.scoreRe, body: w.b}];
}

const SCORE_LOG_DIR = "/root/zxserver/logs";

function two(n: number): string {
    return n < 10 ? "0" + n : String(n);
}

function fileNamePart(name: string): string {
    let out = "";
    for (let i = 0; i < name.length && out.length < 32; i++) {
        const c = name.charCodeAt(i);
        if (c <= 32 || c === 47 || c === 92 || c === 58 || c === 42 || c === 63 || c === 34 || c === 60 || c === 62 || c === 124) out += "_";
        else out += name.charAt(i);
    }
    return out || "\u672a\u77e5";
}

function scoreSideText(room: Room, side: number, title: string): string {
    const list: ScoreRow[] = [];
    for (let i = 0; i < room.rows.length; i++) if (room.rows[i].side === side) list.push(room.rows[i]);
    list.sort((a, b) => (b.kills - a.kills) || (a.deaths - b.deaths) || (a.role - b.role));
    const lines = [title, "\u540d\u5b57\t\u51fb\u6740\t\u6b7b\u4ea1\t\u8de8\u670d\u89d2\u8272\t\u672c\u533a\u89d2\u8272\t\u672c\u533a"];
    if (!list.length) {
        lines.push("\uff08\u65e0\u4eba\u4e0a\u699c\uff09");
        return lines.join("\n");
    }
    for (let i = 0; i < list.length; i++) {
        const row = list[i];
        const name = textOf(row.name) || String(row.role);
        lines.push(name + "\t" + row.kills + "\t" + row.deaths + "\t" + row.role + "\t" + row.homeRole + "\t" + row.homeZone);
    }
    return lines.join("\n");
}

function snapshotScore(room: Room) {
    const atkName = textOf(room.atkName) || String(room.atkFaction || 0);
    const defName = textOf(room.defName) || String(room.defFaction || 0);
    const atkKills = sideSum(room, 1, "kills");
    const defKills = sideSum(room, 2, "kills");
    const winner = atkKills === defKills ? "\u5e73\u5c40" : atkKills > defKills ? "\u653b\u65b9\u80dc" : "\u5b88\u65b9\u80dc";
    const now = new Date();
    const stamp = now.getFullYear() + two(now.getMonth() + 1) + two(now.getDate()) + "_" + two(now.getHours()) + two(now.getMinutes()) + two(now.getSeconds());
    const file = SCORE_LOG_DIR + "/" + stamp + "_" + fileNamePart(atkName) + "_vs_" + fileNamePart(defName) + ".txt";
    const clock = now.getFullYear() + "-" + two(now.getMonth() + 1) + "-" + two(now.getDate()) + " " + two(now.getHours()) + ":" + two(now.getMinutes()) + ":" + two(now.getSeconds());
    const text = [
        "\u65f6\u95f4: " + clock,
        "\u623f\u95f4: " + room.id + "  \u5730\u56fe: " + room.mapId,
        "\u7ed3\u679c: " + winner,
        "\u653b\u65b9: [" + room.atkZone + "]" + atkName + "  \u5e2e\u6d3e=" + room.atkFaction + "  \u51fb\u6740=" + atkKills + "  \u6b7b\u4ea1=" + sideSum(room, 1, "deaths") + "  \u8fdb\u573a=" + room.atkCount,
        "\u5b88\u65b9: [" + room.defZone + "]" + defName + "  \u5e2e\u6d3e=" + room.defFaction + "  \u51fb\u6740=" + defKills + "  \u6b7b\u4ea1=" + sideSum(room, 2, "deaths") + "  \u8fdb\u573a=" + room.defCount,
        "",
        scoreSideText(room, 1, "\u653b\u65b9"),
        "",
        scoreSideText(room, 2, "\u5b88\u65b9"),
        "",
    ].join("\n");
    try {
        const mkdir = new NativeFunction(Module.getExportByName(null, "mkdir"), "int", ["pointer", "int"]);
        mkdir(Memory.allocUtf8String(SCORE_LOG_DIR), 493);
        File.writeAllText(file, text);
        console.log("[UniqFactionPk] \u8ba1\u5206\u5feb\u7167 " + file);
    } catch (err) {
        console.log("[UniqFactionPk] \u8ba1\u5206\u5feb\u7167\u5931\u8d25 " + err);
    }
}

const endTimers = new Map<number, ReturnType<typeof setTimeout>>();

export function raidExpired(roomId: number): boolean {
    const room = rooms.get(roomId);
    if (!room || !room.endTime) return false;
    return (Date.now() / 1000 | 0) >= room.endTime;
}

export function raidAccepting(roomId: number): boolean {
    const room = rooms.get(roomId);
    return !!room && room.running;
}

function clearRaidEnd(roomId: number) {
    const timer = endTimers.get(roomId);
    if (!timer) return;
    clearTimeout(timer);
    endTimers.delete(roomId);
}

function stopEveryone(room: Room) {
    const sent: number[] = [];
    const one = (role: number, linksid: number) => {
        if (!role || sent.indexOf(role) >= 0) return;
        sent.push(role);
        const body = stopOf(room, role).body;
        if (linksid) memberSend(linksid, T.stop, body);
        else pushRole(role, T.stop, body);
    };
    one(room.atkRole, 0);
    one(room.defRole, 0);
    const factions = [room.atkFaction, room.defFaction];
    for (let i = 0; i < factions.length; i++) {
        const people = roster(factions[i]);
        for (let n = 0; n < people.length; n++) one(people[n].role, people[n].linksid);
    }
    if (!centralNow()) return;
    const inside = crossedRoles();
    for (let i = 0; i < room.rows.length; i++) inside.push(room.rows[i].role);
    for (let i = 0; i < inside.length; i++) {
        const role = inside[i];
        const link = centralLink(role);
        if (link) one(role, link);
    }
}

function finishWar(room: Room) {
    if (!room.running || !rooms.has(room.id)) return;
    room.running = false;
    clearRaidEnd(room.id);
    shareRoom(room);
    broadcastWar(room, "end");
    stopEveryone(room);
    if (centralNow()) {
        snapshotScore(room);
        forgetRaid(room.id);
    } else {
        payRewards(room);
    }
    rooms.delete(room.id);
}

function armRaidEnd(room: Room) {
    clearRaidEnd(room.id);
    if (!centralNow() || !room.running || !room.endTime) return;
    const token = room.endTime;
    const wait = Math.max(0, token - (Date.now() / 1000 | 0));
    endTimers.set(room.id, setTimeout(() => {
        endTimers.delete(room.id);
        const cur = rooms.get(room.id);
        if (!cur || !cur.running || cur.endTime !== token) return;
        console.log("[UniqFactionPk] \u65f6\u95f4\u5230\uff0c\u5173\u95ed\u526f\u672c room=" + cur.id);
        stopEveryone(cur);
        if (!closeRaid(cur.id)) {
            finishWar(cur);
            return;
        }
        setTimeout(() => {
            const still = rooms.get(cur.id);
            if (!still || !still.running) return;
            console.log("[UniqFactionPk] \u5173\u95ed\u6ca1\u6709\u56de\u5305\uff0c\u6309\u65f6\u95f4\u7ed3\u675f room=" + cur.id);
            finishWar(still);
        }, 5000);
    }, wait * 1000));
}

function onFight(body: number[]): Out[] {
    const mapId = intAt(body, 0);
    const roomId = intAt(body, 1);
    const endTime = intAt(body, 2);
    const started = body.length > 12 ? body[12] : 0;
    let room = rooms.get(roomId);
    if (!room) {
        pendingFight.set(roomId, {mapId, endTime, started});
        console.log("[UniqFactionPk] 6900 \u6ca1\u6709\u623f\u95f4 room=" + roomId + " map=" + mapId + " start=" + started + " end=" + endTime);
        return [];
    }
    if (mapId) room.mapId = mapId;
    if (endTime) {
        room.endTime = endTime;
        room.trusted = true;
    }
    if (started === 0) {
        finishWar(room);
        return [];
    }
    room.running = true;
    shareRoom(room);
    if (centralNow()) {
        armRaidEnd(room);
        return [];
    }
    return [beginOf(room, room.atkRole), beginOf(room, room.defRole)];
}

function textOf(bytes: number[]): string {
    let text = "";
    for (let i = 0; i + 1 < bytes.length; i += 2) text += String.fromCharCode(bytes[i] | (bytes[i + 1] << 8));
    return text;
}

function sideSum(room: Room, side: number, field: "kills" | "deaths"): number {
    let n = 0;
    for (let i = 0; i < room.rows.length; i++) if (room.rows[i].side === side) n += room.rows[i][field];
    return n;
}

function mvpOf(room: Room, side: number): ScoreRow | null {
    let best: ScoreRow | null = null;
    for (let i = 0; i < room.rows.length; i++) {
        const row = room.rows[i];
        if (row.side !== side) continue;
        if (!best || row.kills > best.kills || (row.kills === best.kills && row.deaths < best.deaths)) best = row;
    }
    return best;
}

function lineOf(row: ScoreRow | null) {
    if (!row) return null;
    return {role: row.role, name: textOf(row.name), kills: row.kills, deaths: row.deaths};
}

function factsOf(room: Room) {
    const atkKills = sideSum(room, 1, "kills");
    const defKills = sideSum(room, 2, "kills");
    return {
        atkZone: room.atkZone,
        defZone: room.defZone,
        atkName: textOf(room.atkName) || String(room.atkFaction),
        defName: textOf(room.defName) || String(room.defFaction),
        atkKills,
        defKills,
        atkDeaths: sideSum(room, 1, "deaths"),
        defDeaths: sideSum(room, 2, "deaths"),
        atkCount: room.atkCount,
        defCount: room.defCount,
        winner: atkKills === defKills ? "draw" as const : atkKills > defKills ? "atk" as const : "def" as const,
        atkMvp: lineOf(mvpOf(room, 1)),
        defMvp: lineOf(mvpOf(room, 2)),
    };
}

function deliverMail(role: number, mail: MailText) {
    if (!mail.items.length) {
        sendMail(role, mail.title, mail.context, 0, 0, 0);
        return;
    }
    for (let i = 0; i < mail.items.length; i++) {
        const item = mail.items[i];
        sendMail(role, mail.title, mail.context, item.id, item.count, item.proctype);
    }
}

function payRewards(room: Room) {
    if (room.rewarded) return;
    room.rewarded = true;
    const cfg = loadReward();
    if (!cfg) {
        console.log("[UniqFactionPk] \u6ca1\u6709\u5956\u52b1\u914d\u7f6e room=" + room.id);
        return;
    }
    const atkKills = sideSum(room, 1, "kills");
    const defKills = sideSum(room, 2, "kills");
    const winner = atkKills === defKills ? "draw" as const : atkKills > defKills ? "atk" as const : "def" as const;
    for (let i = 0; i < room.rows.length; i++) {
        const row = room.rows[i];
        const qualified = row.kills >= cfg.kills || row.deaths >= cfg.deaths;
        if (!qualified) {
            console.log("[UniqFactionPk] \u5956\u52b1\u672a\u8fbe role=" + row.role + " kills=" + row.kills + " deaths=" + row.deaths + " need=" + cfg.kills + "/" + cfg.deaths);
        } else if (!row.homeRole || row.homeZone !== serverZone) {
            console.log("[UniqFactionPk] \u5956\u52b1\u8df3\u8fc7 role=" + row.role + " home=" + row.homeRole + " zone=" + row.homeZone + " kills=" + row.kills + " deaths=" + row.deaths);
        }
    }
    const grants = grantsFor(room.rows, winner, serverZone, cfg);
    for (let i = 0; i < grants.length; i++) {
        const grant = grants[i];
        deliverMail(grant.homeRole, grant.mail);
        console.log("[UniqFactionPk] \u53d1\u5956 room=" + room.id + " role=" + grant.homeRole + " " + grant.kind + " items=" + grant.mail.items.length);
    }
    console.log("[UniqFactionPk] \u5956\u52b1\u540d\u5355 room=" + room.id + " zone=" + serverZone + " n=" + grants.length + " winner=" + winner);
}

function broadcastWar(room: Room, period: WarPeriod) {
    if (room.broadcasted.indexOf(period) >= 0) return;
    room.broadcasted.push(period);
    const text = warBroadcastText(period, factsOf(room));
    if (!text) return;
    announce(text);
    console.log("[UniqFactionPk] " + period + " " + text);
}

function tellMembers(room: Room, faction: number, skip: number[]) {
    const people = roster(faction);
    for (let i = 0; i < people.length; i++) {
        const one = people[i];
        if (skip.indexOf(one.role) >= 0 || !one.linksid) continue;
        memberSend(one.linksid, T.begin, beginOf(room, one.role).body);
    }
}

export function noteEnter(index: number, role: number, side: number) {
    if (!centralNow() || !role) return;
    let room: Room | undefined;
    for (const item of rooms.values()) {
        if (item.worldIndex === index) {
            room = item;
            break;
        }
    }
    if (!room) {
        const running: Room[] = [];
        for (const item of rooms.values()) if (item.running) running.push(item);
        if (running.length === 1) room = running[0];
    }
    if (!room) {
        console.log("[UniqFactionPk] \u8fdb\u573a\u6ca1\u5bf9\u4e0a\u623f\u95f4 index=" + index + " role=" + role + " side=" + side);
        return;
    }
    const bag = inside.get(room.id) || {atk: [], def: []};
    const list = side === 2 ? bag.def : bag.atk;
    if (list.indexOf(role) < 0) list.push(role);
    inside.set(room.id, bag);
    room.atkCount = bag.atk.length;
    room.defCount = bag.def.length;
    shareRoom(room);
    console.log("[UniqFactionPk] \u8fdb\u573a room=" + room.id + " role=" + role + " side=" + side + " atk=" + room.atkCount + " def=" + room.defCount);
}

export function noteLeave(role: number) {
    if (!centralNow() || !role) return;
    for (const room of rooms.values()) {
        const bag = inside.get(room.id);
        if (!bag) continue;
        const atk = bag.atk.indexOf(role);
        const def = bag.def.indexOf(role);
        if (atk < 0 && def < 0) continue;
        if (atk >= 0) bag.atk.splice(atk, 1);
        if (def >= 0) bag.def.splice(def, 1);
        room.atkCount = bag.atk.length;
        room.defCount = bag.def.length;
        shareRoom(room);
        console.log("[UniqFactionPk] \u79bb\u573a room=" + room.id + " role=" + role + " atk=" + room.atkCount + " def=" + room.defCount);
    }
}
