/** 跨服帮战各时期的世界广播。
 * 新加一个时期：先在 WarPeriod 里加名字，再在 warBroadcastText 里加一句，
 * 然后在对应时机调用 broadcastWar(room, 时期)。
 * 发送仍走世界频道，不在这里改。
 */
export type WarPeriod = "end";

export interface WarFacts {
    atkName: string;
    defName: string;
    atkKills: number;
    defKills: number;
    atkCount: number;
    defCount: number;
}

export function warBroadcastText(period: WarPeriod, facts: WarFacts): string {
    switch (period) {
        case "end":
            return "跨服帮战结束，" + facts.atkName + "击杀" + facts.atkKills + "，" + facts.defName + "击杀" + facts.defKills;
    }
}
