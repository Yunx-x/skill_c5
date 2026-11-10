/** 跨服帮战结束奖励。配置在 /root/uniqfaction.json 的 reward 里。
 * kills、deaths 是必须超过的数，默认都是 5。名单只取计分板上过线的人。
 * 同一边击杀最高的是 MVP，击杀相同再比死亡少。MVP 只领 MVP 邮件，不重复领阵营邮件。
 * 平局两边都发失败方奖励，MVP 发败方 MVP。
 * 系统邮件一次只能夹一件物品，多件就分多封，标题和正文相同。
 */
const CONFIG_PATH = "/root/uniqfaction.json";

export interface MailItem {
    id: number;
    count: number;
    proctype: number;
}

export interface MailText {
    title: string;
    context: string;
    items: MailItem[];
}

export interface RewardConfig {
    kills: number;
    deaths: number;
    win: MailText;
    lose: MailText;
    winMvp: MailText;
    loseMvp: MailText;
}

export interface RewardRow {
    role: number;
    side: number;
    kills: number;
    deaths: number;
    homeRole: number;
    homeZone: number;
}

export interface Grant {
    homeRole: number;
    kind: string;
    mail: MailText;
}

function num(v: unknown): number {
    const n = typeof v === "number" ? v : parseInt(String(v), 10);
    if (n !== n) return 0;
    return n | 0;
}

function mailOf(raw: unknown): MailText {
    const row = raw && typeof raw === "object" ? raw as {title?: unknown; context?: unknown; items?: unknown} : {};
    const items: MailItem[] = [];
    const list = Array.isArray(row.items) ? row.items : [];
    for (let i = 0; i < list.length; i++) {
        const one = list[i] || {};
        const id = num(one.id);
        const count = num(one.count);
        if (id <= 0 || count <= 0) continue;
        items.push({id, count, proctype: num(one.proctype)});
    }
    return {
        title: row.title == null ? "" : String(row.title),
        context: row.context == null ? "" : String(row.context),
        items,
    };
}

export function mailEmpty(mail: MailText | null): boolean {
    return !mail || (!mail.title && !mail.context && !mail.items.length);
}

export function loadReward(): RewardConfig | null {
    let text = "";
    try {
        text = File.readAllText(CONFIG_PATH);
    } catch (e) {
        console.log("[UniqFactionPk] \u5956\u52b1\u914d\u7f6e\u6ca1\u8bfb\u5230 " + e);
        return null;
    }
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    try {
        const data = JSON.parse(text);
        const raw = data && data.reward;
        if (!raw || typeof raw !== "object") return null;
        const kills = raw.kills == null ? 5 : num(raw.kills);
        const deaths = raw.deaths == null ? 5 : num(raw.deaths);
        return {
            kills,
            deaths,
            win: mailOf(raw.win),
            lose: mailOf(raw.lose),
            winMvp: mailOf(raw.winMvp),
            loseMvp: mailOf(raw.loseMvp),
        };
    } catch (e) {
        console.log("[UniqFactionPk] \u5956\u52b1\u914d\u7f6e\u89e3\u6790\u5931\u8d25 " + e);
        return null;
    }
}

function mvpOf(rows: RewardRow[], side: number): RewardRow | null {
    let best: RewardRow | null = null;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.side !== side) continue;
        if (!best || row.kills > best.kills || (row.kills === best.kills && row.deaths < best.deaths)) best = row;
    }
    return best;
}

export function grantsFor(rows: RewardRow[], winner: "atk" | "def" | "draw", serverZone: number, cfg: RewardConfig): Grant[] {
    const passed: RewardRow[] = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.kills > cfg.kills && row.deaths > cfg.deaths && row.homeRole && row.homeZone === serverZone) passed.push(row);
    }
    const atkMvp = mvpOf(passed, 1);
    const defMvp = mvpOf(passed, 2);
    const out: Grant[] = [];
    for (let i = 0; i < passed.length; i++) {
        const row = passed[i];
        const isMvp = (atkMvp && atkMvp.role === row.role) || (defMvp && defMvp.role === row.role);
        const winSide = winner === "atk" ? row.side === 1 : winner === "def" ? row.side === 2 : false;
        let kind = "lose";
        let mail = cfg.lose;
        if (winner === "draw") {
            kind = isMvp ? "loseMvp" : "lose";
            mail = isMvp ? cfg.loseMvp : cfg.lose;
            if (isMvp && mailEmpty(mail)) {
                kind = "lose";
                mail = cfg.lose;
            }
        } else if (isMvp) {
            kind = winSide ? "winMvp" : "loseMvp";
            mail = winSide ? cfg.winMvp : cfg.loseMvp;
            if (mailEmpty(mail)) {
                kind = winSide ? "win" : "lose";
                mail = winSide ? cfg.win : cfg.lose;
            }
        } else if (winSide) {
            kind = "win";
            mail = cfg.win;
        }
        if (mailEmpty(mail)) continue;
        out.push({homeRole: row.homeRole, kind, mail});
    }
    return out;
}
