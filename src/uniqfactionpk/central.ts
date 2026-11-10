import {Brief, Leader, registerBody, setAnswerFromStore, setLeadersOf, setLocalBriefs, setServerZone, setZoneList, T} from "./logic";

const IDA = 0x8048000;
const CLIENT = 0x8680300;
const SERVER = 0x8680364;
const ZONE = 0x86702e0;
const CENTRAL_FLAG = 0x8670270;
const ON_ADD = 0x8495da6;
const ON_ACT = 0x8436fc8;
const ON_IDENTITY = 0x83e9546;
const TOP_INSTANCE = 0x8358bb2;
const TOP_FIND = 0x843d81e;
const FAC_INSTANCE = 0x82ed67c;
const GET_LEVEL = 0x8436f0a;
const FIND_MASTER_ROLE = 0x8437584;
const FIND_MASTER_LINK = 0x8437612;
const FIND_VICE_ROLE = 0x84376a8;
const FIND_VICE_LINK = 0x8437736;
const SEND_PROTO = 0x82fe340;

export interface CentralSend {
    toCentral(type: number, body: number[]): void;
    broadcast(type: number, body: number[]): void;
}

let send: CentralSend | null = null;
let central = false;
let lastPush = 0;

function rebase(ida: number): NativePointer {
    const mod = Process.enumerateModules()[0];
    return mod.base.add(ida - IDA);
}

function client(): NativePointer {
    return rebase(CLIENT);
}

function zoneId(): number {
    const id = rebase(ZONE).readS32();
    return id > 0 ? id : 1;
}

function linked(): boolean {
    return client().add(52).readU8() !== 0;
}

function readName(item: NativePointer): number[] {
    const data = item.add(12).readPointer();
    if (data.isNull()) return [];
    const size = data.sub(8).readU32();
    if (size <= 0 || size > 128) return [];
    const raw = data.readByteArray(size);
    return raw ? Array.from(new Uint8Array(raw)) : [];
}

interface ForgeRow {
    zone: number;
    faction: number;
    name: string;
    level: number;
    activity: number;
}

const CONFIG_PATH = "/root/uniqfaction.json";
let configured: ForgeRow[] = [];

/** 每次拉区服和帮派都重读 /root/uniqfaction.json。有帮派时按 zone 分开回，没写 zone 的算本区。文件没有或名单为空时，仍读排行榜。 */
function num(v: unknown): number {
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    if (n !== n) return 0;
    return n | 0;
}

function loadConfig(): void {
    configured = [];
    let text = "";
    try {
        text = File.readAllText(CONFIG_PATH);
    } catch (e) {
        console.log(`[UniqFactionPk] 未读到配置 ${CONFIG_PATH} ${e}`);
        return;
    }
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    try {
        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : data && data.factions;
        if (!Array.isArray(list)) {
            console.log("[UniqFactionPk] 配置没有 factions 数组");
            return;
        }
        for (let i = 0; i < list.length; i++) {
            const row = list[i] || {};
            const faction = num(row.faction);
            if (!faction) continue;
            configured.push({
                zone: num(row.zone),
                faction,
                name: row.name == null ? "" : String(row.name),
                level: num(row.level),
                activity: num(row.activity),
            });
        }
        console.log(`[UniqFactionPk] 配置帮派 ${configured.length} ${CONFIG_PATH}`);
    } catch (e) {
        console.log(`[UniqFactionPk] 配置解析失败 ${e}`);
    }
}


function u16(text: string): number[] {
    const out: number[] = [];
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        out.push(c & 255, (c >>> 8) & 255);
    }
    return out;
}

function readKey(top: NativePointer, tableId: number): Brief[] {
    const key = Memory.alloc(4);
    key.writeS32(tableId);
    const slot = Memory.alloc(4);
    const find = new NativeFunction(rebase(TOP_FIND), "void", ["pointer", "pointer", "pointer"]);
    find(slot, top, key);
    const node = slot.readPointer();
    if (node.isNull() || node.equals(top.add(4))) return [];
    const table = node.add(0x14);
    const begin = table.add(16).readPointer();
    const end = table.add(20).readPointer();
    if (begin.isNull() || end.isNull()) return [];
    const bytes = end.sub(begin).toInt32();
    if (bytes <= 0 || bytes % 32 !== 0 || bytes / 32 > 5000) return [];
    const count = Math.min(20, bytes / 32);
    const facFn = new NativeFunction(rebase(FAC_INSTANCE), "pointer", []);
    const levelFn = new NativeFunction(rebase(GET_LEVEL), "int", ["pointer", "uint32"]);
    const fac = facFn();
    const zone = zoneId();
    const briefs: Brief[] = [];
    for (let i = 0; i < count; i++) {
        const item = begin.add(i * 32);
        const faction = item.add(4).readU32();
        if (faction === 0) continue;
        const activity = item.add(24).readU32();
        let level = 0;
        if (!fac.isNull()) level = levelFn(fac, faction) & 0xff;
        briefs.push({zone, faction, level, activity, name: readName(item)});
    }
    return briefs;
}


function rowZone(row: ForgeRow): number {
    return row.zone > 0 ? row.zone : zoneId();
}

function zoneIdsFromRows(): number[] {
    const ids: number[] = [];
    for (let i = 0; i < configured.length; i++) {
        const zone = rowZone(configured[i]);
        if (zone > 0 && ids.indexOf(zone) < 0) ids.push(zone);
    }
    return ids;
}

function briefsFromConfig(zone: number): Brief[] {
    const facFn = new NativeFunction(rebase(FAC_INSTANCE), "pointer", []);
    const levelFn = new NativeFunction(rebase(GET_LEVEL), "int", ["pointer", "uint32"]);
    const fac = facFn();
    const briefs: Brief[] = [];
    for (let i = 0; i < configured.length; i++) {
        const row = configured[i];
        const rowZoneId = rowZone(row);
        if (rowZoneId !== zone) continue;
        let level = row.level;
        if (!level && !fac.isNull()) level = levelFn(fac, row.faction) & 0xff;
        briefs.push({
            zone: rowZoneId,
            faction: row.faction,
            level,
            activity: row.activity,
            name: u16(row.name),
        });
    }
    return briefs;
}

function readBoard(): Brief[] {
    const topFn = new NativeFunction(rebase(TOP_INSTANCE), "pointer", []);
    const top = topFn();
    if (top.isNull()) return [];
    const weekly = readKey(top, 1036);
    const current = readKey(top, 36);
    console.log(`[UniqFactionPk] \u5468\u699c1036=${weekly.length} \u5f53\u524d\u699c36=${current.length}`);
    return weekly.length ? weekly : current;
}

export function zoneIds(): number[] {
    loadConfig();
    if (configured.length) {
        const ids = zoneIdsFromRows();
        return ids.length ? ids : [zoneId()];
    }
    const zone = zoneId();
    return zone > 0 ? [zone] : [];
}

export function briefsFor(zone: number): Brief[] {
    loadConfig();
    if (configured.length) {
        const briefs = briefsFromConfig(zone);
        console.log(`[UniqFactionPk] \u914d\u7f6e\u533a${zone}\u5e2e\u6d3e ${briefs.length}`);
        return briefs;
    }
    if (zone > 0 && zone !== zoneId()) return [];
    try {
        return readBoard();
    } catch (e) {
        console.log(`[UniqFactionPk] \u8bfb\u699c\u5931\u8d25 ${e}`);
        return [];
    }
}

function publish(force: boolean) {
    if (central || !send) return;
    if (!linked()) return;
    const now = Date.now();
    if (!force && now - lastPush < 2000) return;
    lastPush = now;
    loadConfig();
    if (!configured.length) {
        const zone = zoneId();
        let briefs: Brief[] = [];
        try {
            briefs = readBoard();
        } catch (e) {
            console.log(`[UniqFactionPk] \u8bfb\u699c\u5931\u8d25 ${e}`);
        }
        send.toCentral(T.register, registerBody(zone, briefs));
        console.log(`[UniqFactionPk] \u4e0a\u62a5\u533a${zone}\u5e2e\u6d3e\u540d\u5355 ${briefs.length}`);
        return;
    }
    const ids = zoneIdsFromRows();
    for (let i = 0; i < ids.length; i++) {
        const zone = ids[i];
        const briefs = briefsFromConfig(zone);
        send.toCentral(T.register, registerBody(zone, briefs));
        console.log(`[UniqFactionPk] \u4e0a\u62a5\u533a${zone}\u5e2e\u6d3e\u540d\u5355 ${briefs.length}`);
    }
}

export function onResend() {
    publish(true);
}

function symbol(name: string, ida: number): NativePointer {
    const exported = Module.findExportByName(null, name);
    if (exported && !exported.isNull()) return exported;
    return rebase(ida);
}

function readLeader(faction: number, linkName: string, linkIda: number, roleName: string, roleIda: number): Leader | null {
    const fac = new NativeFunction(rebase(FAC_INSTANCE), "pointer", [])();
    if (fac.isNull() || !faction) return null;
    const linkFn = new NativeFunction(symbol(linkName, linkIda), "int", ["pointer", "int", "pointer", "pointer"]);
    const roleFn = new NativeFunction(symbol(roleName, roleIda), "int", ["pointer", "int", "pointer"]);
    const link = Memory.alloc(4);
    const local = Memory.alloc(4);
    const role = Memory.alloc(4);
    link.writeU32(0);
    local.writeU32(0);
    role.writeS32(0);
    if (!linkFn(fac, faction, link, local) || !roleFn(fac, faction, role)) return null;
    const found = {role: role.readS32(), linksid: link.readU32(), localsid: local.readU32()};
    if (!found.role || !found.localsid || !found.linksid) return null;
    return found;
}

export function factionLeaders(faction: number): Leader[] {
    const out: Leader[] = [];
    try {
        const master = readLeader(
            faction,
            "_ZN4GNET14FactionManager10FindMasterEiRjS1_",
            FIND_MASTER_LINK,
            "_ZN4GNET14FactionManager10FindMasterEiRi",
            FIND_MASTER_ROLE,
        );
        const vice = readLeader(
            faction,
            "_ZN4GNET14FactionManager8FindViceEiRjS1_",
            FIND_VICE_LINK,
            "_ZN4GNET14FactionManager8FindViceEiRi",
            FIND_VICE_ROLE,
        );
        if (master) out.push(master);
        if (vice && (!master || vice.role !== master.role)) out.push(vice);
    } catch (e) {
        console.log(`[UniqFactionPk] \u67e5\u5e2e\u4e3b\u5931\u8d25 ${e}`);
    }
    return out;
}

export function isCentralServer(): boolean {
    return central;
}

export function canReachCentral(): boolean {
    return !central && linked();
}

export function shouldForward(): boolean {
    if (central || !linked()) return false;
    loadConfig();
    return configured.length === 0;
}

export function forwardRequest(self: NativePointer) {
    if (!linked()) return;
    const sendProto = new NativeFunction(rebase(SEND_PROTO), "uint8", ["pointer", "pointer"]);
    sendProto(client(), self);
}

export function shouldRouteReply(): boolean {
    return !central && linked();
}

export function attachCentral(api: CentralSend) {
    send = api;
    central = rebase(CENTRAL_FLAG).readU8() !== 0;
    setServerZone(zoneId());
    setAnswerFromStore(central);
    loadConfig();
    setZoneList(zoneIds);
    setLocalBriefs(briefsFor);
    setLeadersOf(factionLeaders);
    const kind = central ? "\u4e2d\u592e\u670d" : "\u666e\u901a\u670d";
    console.log(`[UniqFactionPk] ${kind} zone=${zoneId()} \u4e2d\u5fc3\u8fde\u63a5=${linked() ? 1 : 0}`);
    Interceptor.attach(rebase(ON_ADD), {
        onLeave() {
            publish(false);
        },
    });
    Interceptor.attach(rebase(ON_ACT), {
        onLeave() {
            publish(false);
        },
    });
    Interceptor.attach(rebase(ON_IDENTITY), {
        onLeave() {
            if (central && send) send.broadcast(T.resend, []);
        },
    });
    if (central) {
        send.broadcast(T.resend, []);
        console.log("[UniqFactionPk] \u5df2\u901a\u77e5\u5728\u7ebf\u533a\u91cd\u62a5\u5e2e\u6d3e\u540d\u5355");
    } else if (linked()) {
        publish(true);
    }
}
