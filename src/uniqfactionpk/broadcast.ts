/** 跨服帮战各时期的世界广播。
 * 句子写在 TEMPLATES 里。花括号是关键字，发出时换成这场的数字和名字。
 * 攻方是 atk，守方是 def。{atk} 是 [区号]帮派名，也可以拆开写 {atk.zone}、{atk.name}。
 * 击杀、死亡、人数是 {atk.kills}、{atk.deaths}、{atk.count}，守方把 atk 换成 def。
 * 每人是 {atk.mvp.role}、{atk.mvp.name}、{atk.mvp.kills}、{atk.mvp.deaths}。
 * 击杀多的一方是 win，少的一方是 lose，平局时 win 用攻方。{winner} 是攻方、守方或平局。
 * 新加一个时期：在 WarPeriod 和 TEMPLATES 里各加一项，再在对应时机调用 broadcastWar。
 * 发送仍走世界频道，不在这里改。
 */
export type WarPeriod = "ask" | "accept" | "retreat" | "end";

export interface PlayerLine {
    role: number;
    name: string;
    kills: number;
    deaths: number;
}

export interface WarFacts {
    atkZone: number;
    defZone: number;
    atkName: string;
    defName: string;
    atkKills: number;
    defKills: number;
    atkDeaths: number;
    defDeaths: number;
    atkCount: number;
    defCount: number;
    winner: "atk" | "def" | "draw";
    atkMvp: PlayerLine | null;
    defMvp: PlayerLine | null;
}

const TEMPLATES: Record<WarPeriod, string> = {
    ask: "{atk} 向 {def} 提出了帮派决战请求。",
    accept: "{def}  接受了 {atk} 的挑战。",
    retreat: "面对 {atk} 的挑战，{def} 自认实力不济，选择了退避。",
    end: "{atk} 与 {def} 的帮派决战结束，{atk.name} 击杀{atk.kills}人，{def.name} 击杀{def.kills}人。来自 {win.name} 帮的 {win.mvp.name} 杀了{win.mvp.kills}人，成为了本次帮战的MVP！",
};

function putSide(bag: Record<string, string>, prefix: string, zone: number, name: string, kills: number, deaths: number, count: number, mvp: PlayerLine | null) {
    const who = mvp && (mvp.name || mvp.role) ? mvp : null;
    bag[prefix] = name + "[" + zone + "]";
    bag[prefix + ".zone"] = String(zone);
    bag[prefix + ".name"] = name;
    bag[prefix + ".kills"] = String(kills);
    bag[prefix + ".deaths"] = String(deaths);
    bag[prefix + ".count"] = String(count);
    bag[prefix + ".mvp.role"] = who ? String(who.role) : "0";
    bag[prefix + ".mvp.name"] = who && who.name ? who.name : "无";
    bag[prefix + ".mvp.kills"] = who ? String(who.kills) : "0";
    bag[prefix + ".mvp.deaths"] = who ? String(who.deaths) : "0";
}

function alias(bag: Record<string, string>, from: string, to: string) {
    const keys = Object.keys(bag);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === from || key.indexOf(from + ".") === 0) bag[to + key.slice(from.length)] = bag[key];
    }
}

function valuesOf(facts: WarFacts): Record<string, string> {
    const bag: Record<string, string> = {};
    putSide(bag, "atk", facts.atkZone, facts.atkName, facts.atkKills, facts.atkDeaths, facts.atkCount, facts.atkMvp);
    putSide(bag, "def", facts.defZone, facts.defName, facts.defKills, facts.defDeaths, facts.defCount, facts.defMvp);
    const win = facts.winner === "def" ? "def" : "atk";
    const lose = win === "atk" ? "def" : "atk";
    alias(bag, win, "win");
    alias(bag, lose, "lose");
    bag["winner"] = facts.winner === "draw" ? "平局" : facts.winner === "atk" ? "攻方" : "守方";
    return bag;
}

export function warBroadcastText(period: WarPeriod, facts: WarFacts): string {
    const template = TEMPLATES[period];
    if (!template) return "";
    const bag = valuesOf(facts);
    return template.replace(/\{([a-z0-9.]+)\}/g, (all, key) => bag[key] === undefined ? all : bag[key]);
}
