import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";
import {HookFuncCore} from "../../base/HookFuncCore";
import {SPlayer} from "../../base/skill/SPlayer";

/**
 * 474
 * 三碗不过岗
 * 调整为10%概率触发醉酒状态,增伤10%
 */
class Skill474 extends BaseHookSkillStub {

    constructor() {
        super(474);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = skill.GetLevel() * 0.1;//增伤10%
        player.SetDrunk(120, d, 300000);
        player.SetSleep(-1, 5000, 0);
        return true
    }

}

// /**
//  * 473
//  * 飘香竹桶饭    5530
//  * 修改为 天子硬上床 100%令自身进入醉酒状态，技能伤害提高25%，持续300秒
//  */
// class Skill473 extends BaseHookSkillStub {
//
//     constructor() {
//         super(473);
//     }
//
//     StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
//         const player = skill.GetPlayerNice();
//         const d = skill.GetLevel() * 0.25;//增伤25%
//         player.SetDrunk(120, d, 300000);
//         player.SetSleep(-1, 5000, 0);
//         return true
//     }
//
// }

//            441,//众志成城
//             442,//同生共死
//             443,//群策群力
//             7021,//同仇敌忾
//             7022,//披荆斩棘
//             7023,//无坚不摧
//             7024,//肝胆相照
//             7025,//神融气泰
//             7026,//凝心聚力

/**
 * 441   众志成城
 *
 */
class Skill441 extends BaseHookSkillStub {

    constructor() {
        super(441);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const level = 15;
        const d = level * 0.005 + 0.005;
        const r = (skill.GetT0() * 0.25 + 1.0) * d;
        const v = (skill.GetT0() * 0.25 + 1.0) * 75.0;
        player.SetFamilyincattack(r, v, 600000);
        return true
    }

}

/**
 * 442   同生共死
 *
 */
class Skill442 extends BaseHookSkillStub {

    constructor() {
        super(442);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        const level = 15;
        const d = level * 0.006 + 0.004;
        const levelR = 1//Math.floor(level / 15);
        let da = levelR * 0.006 + d;
        da = (skill.GetT0() * 0.25 + 1.0) * da;

        let db = (100 * level + 200);
        db = (skill.GetT0() * 0.25 + 1.0) * db;

        player.SetFamilyinchp(da, db, 600000);
        return true
    }

}

/**
 * 443   群策群力
 *
 */
class Skill443 extends BaseHookSkillStub {

    constructor() {
        super(443);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const level = 15;
        const d = level * 0.01
        const r = (skill.GetT0() * 0.25 + 1.0) * d;
        const v = (skill.GetT0() * 0.25 + 1.0) * (100 * level + 200);
        player.SetFamilyincmp(r, v, 600000);
        return true
    }

}

/**
 * 7021  同仇敌忾
 *
 */
class Skill7021 extends BaseHookSkillStub {

    constructor() {
        super(7021);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let dur_bonus = 0;
        let bonus_ratio = 1.0;
        if (player.GetMapFamilyMembersCnt() > 2) {
            dur_bonus = 120000;
            bonus_ratio = 1.3;
        }
        const t = dur_bonus + 300000;
        const v6 = 25 * 15//skill.GetLevel();
        const v7 = 7 * 15//skill.GetLevel();
        const ta = (v6 + v7 * 15) * bonus_ratio + 50.0;
        player.SetAddattack4(120, ta, t, 8);
        return true
    }
}

/**
 * 7022  披荆斩棘
 *
 */
class Skill7022 extends BaseHookSkillStub {

    constructor() {
        super(7022);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let dur_bonus = 0;
        let bonus_ratio = 1.0;
        if (player.GetMapFamilyMembersCnt() > 2) {
            dur_bonus = 120000;
            bonus_ratio = 1.3;
        }
        const t = dur_bonus + 300000;
        const ta = (15 * 0.003 + 0.015) * bonus_ratio;
        player.SetInccritrate(t, ta, 0);
        return true
    }
}

/**
 * 7023  无坚不摧
 *
 */
class Skill7023 extends BaseHookSkillStub {

    constructor() {
        super(7023);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let dur_bonus = 0;
        let bonus_ratio = 1.0;
        if (player.GetMapFamilyMembersCnt() > 2) {
            dur_bonus = 120000;
            bonus_ratio = 1.3;
        }
        const t = dur_bonus + 300000;
        const Level = 15;
        const v6 = Level * Level;
        const ta = (v6 + 12 * Level - 5) * 0.001 * bonus_ratio;
        player.SetInccrithurt(120, t, ta, 8);
        return true
    }
}

/**
 * 7024
 *
 */
class Skill7024 extends BaseHookSkillStub {

    constructor() {
        super(7024);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let dur_bonus = 0;
        let bonus_ratio = 1.0;
        if (player.GetMapFamilyMembersCnt() > 2) {
            dur_bonus = 120000;
            bonus_ratio = 1.3;
        }
        const t = dur_bonus + 300000;
        const ta = (15 * 0.005 + 0.025) * bonus_ratio;
        player.SetDecfatalratio(120, ta, t, 8);
        return true
    }
}

/**
 * 7025
 *
 */
class Skill7025 extends BaseHookSkillStub {

    constructor() {
        super(7025);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let dur_bonus = 0;
        let bonus_ratio = 1.0;
        if (player.GetMapFamilyMembersCnt() > 2) {
            dur_bonus = 120000;
            bonus_ratio = 1.3;
        }
        const t = dur_bonus + 300000;
        const v5 = 2 * 15;
        const v6 = 15 * v5;
        const ta = (v6 + 3 * 15 + 5) * 0.001 * bonus_ratio;
        player.SetDecfatalhurt(120, ta, t, 8);
        return true
    }
}

/**
 * 7026
 *
 */
class Skill7026 extends BaseHookSkillStub {

    constructor() {
        super(7026);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let dur_bonus = 0;
        let bonus_ratio = 1.0;
        if (player.GetMapFamilyMembersCnt() > 2) {
            dur_bonus = 120000;
            bonus_ratio = 1.3;
        }
        const t = dur_bonus + 300000;
        const ta = (15 * 0.2 + 1.0) * 0.01 * bonus_ratio;
        player.SetUltimateDamageReduction(120, t, ta, 1, 8);
        return true
    }
}

/**
 * 师徒技能
 * 冷却5分钟
 */
export class ShituSkill extends QuickCoolDownList {

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000;
    }

    getSkillList(): number[] {
        return [
            1507,//天罡贮元
            1509,//天罡战意
            1510,//天罡云体
            1511,//天罡步尘
        ];
    }
}

/**
 * 仙阵冷却5分钟
 * 寂灭天、离恨天、天外天、归去来、道之守护
 */
export class XianSkill extends QuickCoolDownList {

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000;
    }

    getSkillList(): number[] {
        return [
            1528,//寂灭天
            1529,//离恨天
            1530,//天外天
            1521,//归去来
            2036,//道之守护
        ];
    }
}

/**
 * 3009  逆水寒
 * 冷却减少10秒
 */
class Skill3009 extends BaseHookSkillStub {

    constructor() {
        super(3009);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

/**
 * 3010  北冥印
 * 冷却减少50秒
 */
class Skill3010 extends BaseHookSkillStub {

    constructor() {
        super(3010);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 50000;
    }

}

/**
 * 3013  归去来<玄>
 * 冷却90秒
 */
class Skill3013 extends BaseHookSkillStub {

    constructor() {
        super(3013);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

}

/**
 * 3015  寂灭天<玄>
 * 冷却120秒
 */
class Skill3015 extends BaseHookSkillStub {

    constructor() {
        super(3015);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 12000
    }
}

/**
 * 1525  玉真诀
 * 不再共享冷却
 */
class Skill1525 extends BaseHookSkillStub {

    constructor() {
        super(1525);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const v2 = zrand(100);
        const Level = skill.GetLevel();
        const d = 8 * (norm(v2 / (-5 * Level + 90)) + 190);
        const v5 = zrand(100);
        const v6 = skill.GetLevel();
        const da = 9 * norm(v5 / (-5 * v6 + 90)) + 1520;
        const v8 = zrand(100);
        const v9 = skill.GetLevel();
        const db = 10 * norm(v8 / (-5 * v9 + 90)) + 1520;
        player.SetClearcooldown(d, db, da);
        return true
    }

}

/**
 * 3014  玉真诀<玄>
 * 不再共享冷却
 */
class Skill3014 extends BaseHookSkillStub {

    constructor() {
        super(3014);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const v2 = zrand(100);
        const Level = skill.GetLevel();
        const d = 8 * (norm(v2 / (2 * (50 - Level))) + 190);
        const player = skill.GetVictimNice();
        const v5 = zrand(100);
        const v6 = skill.GetLevel();
        const da = 9 * norm(v5 / (2 * (50 - v6))) + 1520;
        const v8 = zrand(100);
        const v9 = skill.GetLevel();
        const db = 10 * norm(v8 / (2 * (50 - v9))) + 1520;
        player.SetClearcooldown(d, db, da);
        return true
    }

}

/**
 * 肾宝
 * 神力爆发：冷却减少80秒
 */
class ShenBao extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            3005,
            3053,
            3101
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 80000;
    }
}

/**
 * 魔阵冷却5分钟
 * 狂神、空灵、遁甲、血魂、祭魂、魔之守护、降临
 */
export class MoSkill extends QuickCoolDownList {

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000;
    }

    getSkillList(): number[] {
        return [
            1550,//狂神
            1547,//空灵
            1548,//遁甲
            1551,//血魂
            1554,//祭魂
            2038,//魔之守护
            3064,//降临
        ];
    }
}

/**
 * 3058  夺魄
 * 冷却20秒
 */
class Skill3058 extends BaseHookSkillStub {

    constructor() {
        super(3058);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 20000
    }

}

/**
 * 3059  业障
 * 冷却20秒
 */
class Skill3059 extends BaseHookSkillStub {

    constructor() {
        super(3059);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 20000
    }

}

/**
 * 3063  空灵<煞>
 * 冷却60秒
 */
class Skill3063 extends BaseHookSkillStub {

    constructor() {
        super(3063);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }
}

/**
 * 佛阵冷却5分钟
 * 明镜灵台、佛尊庇佑、因果之念、佛之守护
 */
export class FoSkill extends QuickCoolDownList {

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000;
    }

    getSkillList(): number[] {
        return [
            1577,//明镜灵台
            1576,//佛尊庇佑
            1579,//因果之念
            2040,//佛之守护
        ];
    }
}

/**
 * 3106  万法不侵
 * 冷却60秒
 */
class Skill3106 extends BaseHookSkillStub {

    constructor() {
        super(3106);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

}

/**
 * 3108  无上正觉
 * 冷却50秒，反射次数增加10次
 */
class Skill3108 extends BaseHookSkillStub {

    constructor() {
        super(3108);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 500 * skill.GetLevel() + 2050;
        const ta = 5 * skill.GetLevel();
        const Level = skill.GetLevel();
        const tb = Math.floor(Level / 4.9) + 10;
        player.SetSkillreflect(100, ta, tb, t);
        return true
    }

}

/**
 * 3107  刀山地狱
 * 每移动一米的伤害调整为80%施法者攻击力
 */
class Skill3107 extends BaseHookSkillStub {

    constructor() {
        super(3107);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const Level = skill.GetLevel();
        const v3 = 500 * Level + 4050;
        const t = v3 + 4000 * norm(Level / 19.9);

        const ta = player.GetVar1();
        const tb = ((Level * 0.02 + 0.4) * ta) * (norm(Level / 19.9) * 0.2 + 1.0);
        player.SetDamagemove(100, tb, t, 1);
        return true
    }

}

/**
 * 1573  炼狱魔劫
 * 冷却10分钟
 */
class Skill1573 extends BaseHookSkillStub {

    constructor() {
        super(1573);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 600000
    }

}

/**
 * 碧落凡情、陌路凡歌、凡华凌云、碧情动天、暮雪千山、凡尘无常：冷却10分钟
 */
class ShiZhuang extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            3285,
            3284,
            6217,
            6218,
            6294,
            7543
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 600000
    }

}

/**
 * 2515  虎-福星高照
 * 清除自身6个负面状态，并令自身免疫伤害和负面状态10次，持续30秒，冷却5分钟
 */
class Skill2515 extends BaseHookSkillStub {

    constructor() {
        super(2515);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetCleardebuff(120, 6);
        const v7 = player.GetSkilllevel(4730) == 1 ? 13 : 10;
        player.SetBlessed(v7, 30000);
        return true
    }
}

/**
 * 3214  兔-玉阙玄天
 * 冷却150秒
 */
class Skill3214 extends BaseHookSkillStub {

    constructor() {
        super(3214);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150000
    }
}

/**
 * 3874  龙-龙腾四海
 * 900秒内额外增加自身减免7%
 */
class Skill3874 extends BaseHookSkillStub {

    constructor() {
        super(3874);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetUltimateDamageReduction(120, 900000, 0.07, 1, 9)
        return true
    }

}

/**
 * 4730  蛇-金蛇狂舞
 * 自身在3600秒内增加自身攻击力2025点,在900秒内共回复2025518气血,在60秒内增加自身技能躲闪100点,缩短自身释法速度30%，冷却15分钟
 */
class Skill4730 extends BaseHookSkillStub {

    constructor() {
        super(4730);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 900000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetHpgen(120, 900000, 0, 2025518, 0, 1);
        player.SetAddattack(120, 3600000, 200, 2);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetIncskilldodge(120, 1.0, 60000, 5);
        player.SetSwift(120, 60000, 0.3, 0);
        return true
    }

}

/**
 * 5342  马-天马行空
 * 自身在15秒内免疫致命一击和多种负面状态，并且50%概率反弹技能效果6次，
 * 立刻回复自身最大元力值50%，900秒内回复自身气血72000点，900秒内回复自身真气72000点，
 * 冷却15分钟
 */
class Skill5342 extends BaseHookSkillStub {

    constructor() {
        super(5342);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 900000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetHpgen(120, 900000, 0, 72000, 0, 1);
        player.SetMpgen(120, 900000, 0, 72000, 1);
        player.SetDivinityfury(120, player.GetMaxdp() * 0.5, 0, 100, 2);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetChihun(120, 15000, 0, 0, 1);
        player.SetSkillreflect(120, 50, 6, 15000);
        return true
    }

}

/**
 * 5950  羊-三阳开泰
 * 效果一：立即回复自身100%的气血、真气、元力；
 * 效果二：提高所有抗性50%持续60秒，可与其他抗性增益效果叠加；
 */
class Skill5950 extends BaseHookSkillStub {

    constructor() {
        super(5950);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetIncanti(0.5, 60000)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetHpgen(120, 100, 0, player.GetMaxhp(), 0, 1);
        player.SetMpgen(120, 100, 0, player.GetMaxmp(), 1);
        player.SetDivinityfury(120, player.GetMaxdp(), 0, 100, 2);
        return true
    }

}

/**
 * 6412  猴-灵猴兆瑞
 * 冷却时间调整为180秒
 * 当自身受到魅惑及部分移动受阻类效果时使用后有50%概率缩短受控制时间80%,反弹状态类攻击给施放该状态的目标，持续10秒，计算目标抗性；
 * 同时增加自身致命一击率，效果与自身当前致命一击率相关,60秒内增强吃药效果50%
 * 本命：灵明通悟——有100%概率直接解除魅惑及部分移动受阻效果，并自身进入隐身效果
 */
class Skill6412 extends BaseHookSkillStub {

    constructor() {
        super(6412);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetMonkeyBuff(50, 80);
        player.SetDispel(100, 4098, 2, 0);
        player.SetShadowhide(120, 0, 0, 8000, 9)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const crit = player.GetCrit();
        const d = (crit / 100) * 0.05 + 0.05;
        player.SetInccritrate(10000, d, 0);

        player.SetIncdrugeffect(120, 0.5, 60000, 0);

        player.SetRejectdebuff(120, 10100);
        return true
    }

}

/**
 * 7241  鸡-金鸡迎春
 * 300秒内增加自身致命一击率7.7%，增加自身致命一击伤害77%，增加自身气血上限、真气上限7.7%；
 * 额外增加自身攻击力和防御力2025
 */
class Skill7241 extends BaseHookSkillStub {

    constructor() {
        super(7241);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetInccritrate(300000, 0.077, 9);
        player.SetInccrithurt(120, 0.77, 300000, 9);
        player.SetInchp(0.077, 300000, 9)
        player.SetIncmp(0.077, 300000, 9)
        player.SetAddattack(120, 300000, 2025, 6);
        player.SetAdddefence(120, 300000, 2025, 6);
        return true
    }

}

/**
 * 7793  狗-白云苍狗
 *  降低目标技能闪躲30点，增加目标被致命一击概率，效果与自身致命一击率相关，最多增加目标被致命一击概率50%
 * 增加目标受到的致命一击伤害，效果与自身致命一击伤害相关最多增加目标受到的致命一击伤害200%，
 * 增加目标受到的技能伤害25%
 * 持续20秒
 */
class Skill7793 extends BaseHookSkillStub {

    constructor() {
        super(7793);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDecskilldodge(100, 0.2, 20000, 8);

        let reduce = player.GetVar3() / 200.0;
        if (reduce > 0.5) {
            reduce = 0.50000001;
        }

        player.SetIncfatalratio(100, reduce, 20000, 8);

        let reducea = player.GetVar4() / 1000.0;
        if (reducea > 2.0) {
            reducea = 2.0;
        }

        player.SetIncfatalhurt(100, reducea, 20000, 8);
        player.SetIncskilldamage(0.25, 20000, 8)
        return true
    }

}

/**
 * 220 勇气
 * 额外提高暴击率5%，对怪物伤害增加10%
 */
class Skill220 extends BaseHookSkillStub {

    constructor() {
        super(220);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInccritrate(180000, 0.05, 8)
        player.SetIncMobDmg(120, 180000, 0.1, 8)
        player.SetAbstain(120,20000,1)
        return true
    }
}

/**
 * 221 疗伤
 */
class Skill221 extends BaseHookSkillStub {

    constructor() {
        super(221);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDispel(120, 9386, 0, 0)
        return true
    }
}

//
// /**
//  * 7220 东青之灵 调整效果
//  *
//  */
// class Skill7220 extends BaseHookSkillStub {
//
//     constructor() {
//         super(7220);
//     }
//
//     StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
//         const player = skill.GetPlayerNice()
//         player.SetHupo(120, 0.5, 1000, 1800000, 2)
//         player.SetGuilin(120, 0.5, 1000, 1800000, 2)
//         player.SetSwift(120, 1800000, 0.25, 0.1)
//         return true
//     }
//
// }


/**
 * 飞雪封脉
 *
 * 特效:霜啸+2
 * 在10秒内令目标受到的伤害加深15%455level。特效:霜骨+2
 * 在10秒内增加自身真气上限5%levela特效:霜剑+2
 * 若自身真气上限高于目标，则有60%概率令目标进入霜结状态4.5秒。·
 */
class SkillMoXue extends BaseHookSkillStub {

    constructor() {
        super(562);//九龙神火罩改
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(0.78)
        skill.SetPlus(1075)
        player.SetVar1(player.GetMaxmp())
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:霜骨+2
        //在10秒内增加自身真气上限5%*level
        player.SetIncmp(0.05 * skill.GetLevel(), 10000, 4)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:霜啸+2
        //在10秒内令目标受到的伤害加深15%+5%*level。
        player.SetInchurt(120, 0.15 + 0.05 * skill.GetLevel(), 10000)
        //特效:霜剑+2
        //若自身真气上限高于目标，则有60%概率令目标进入霜结状态4.5秒。
        if (player.GetVar1() > player.GetMaxmp()) {
            player.SetGFrosty(60, 4500)
        }

        return true
    }
}

/**
 * 真·飞雪封脉
 *
 * 特效:霜啸+2
 * 在10秒内令目标受到的伤害加深15%455level。特效:霜骨+2
 * 在10秒内增加自身真气上限5%levela特效:霜剑+2
 * 若自身真气上限高于目标，则有60%概率令目标进入霜结状态4.5秒。·
 */
class SkillMoXueZhen extends BaseHookSkillStub {

    constructor() {
        super(4097);//九龙神火罩改
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    GetCastdistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8
    }

    GetEffectdistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8
    }

    GetPraydistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let player = skill.GetPlayerNice();
        let Occupation = player.GetOccupation();
        player.SetVar11(Occupation);

        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);

        let Maxhp = player.GetMaxhp();
        player.SetVar2(Maxhp);

        let Maxmp = player.GetMaxmp();
        player.SetVar3(Maxmp);

        let Hp = player.GetHp();
        player.SetVar4(Hp);

        let Mp = player.GetMp();
        player.SetVar5(Mp);

        let Res1 = player.GetRes1();
        player.SetVar6(Res1);

        let Res2 = player.GetRes2();
        player.SetVar7(Res2);

        let Res3 = player.GetRes3();
        player.SetVar8(Res3);

        let Res4 = player.GetRes4();
        player.SetVar9(Res4);

        let Res5 = player.GetRes5();
        player.SetVar10(Res5);

        let v35 = zrand(100);
        let v36 = skill.GetLevel() + 1;
        let v37 = (v35 >= v36 * (skill.GetLevel() + 1)) ? 2 : 1;

        player.SetVar16(v37);
        skill.SetRatio(0.78)
        skill.SetPlus(1075)
        player.SetPerform(1)
    }

    // BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
    //     const player = skill.GetPlayerNice()
    //     //特效:霜骨+2
    //     //在10秒内增加自身真气上限5%*level
    //     player.SetIncmp(0.05 * skill.GetLevel(), 10000, 4)
    //     return super.BlessMe(stub, skill, originFunc)
    // }
    //
    // StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
    //     const player = skill.GetPlayerNice()
    //     //特效:霜啸+2
    //     //在10秒内令目标受到的伤害加深15%+5%*level。
    //     player.SetInchurt(120, 0.15 + 0.05 * skill.GetLevel(), 10000)
    //     //特效:霜剑+2
    //     //若自身真气上限高于目标，则有60%概率令目标进入霜结状态4.5秒。
    //     if (player.GetVar3() > player.GetMaxmp()) {
    //         player.SetGFrosty(60, 4500)
    //     }
    //
    //     return super.
    // }
}

/**
 * 承·飞雪封脉
 *
 * 特效:霜啸+2
 * 在10秒内令目标受到的伤害加深15%455level。特效:霜骨+2
 * 在10秒内增加自身真气上限5%levela特效:霜剑+2
 * 若自身真气上限高于目标，则有60%概率令目标进入霜结状态4.5秒。·
 */
class SkillMoXueCheng extends BaseHookSkillStub {

    constructor() {
        super(4515);//九龙神火罩改
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    GetCastdistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8
    }

    GetEffectdistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8
    }

    GetPraydistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let player = skill.GetPlayerNice();
        let Occupation = player.GetOccupation();
        player.SetVar11(Occupation);

        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);

        let Maxhp = player.GetMaxhp();
        player.SetVar2(Maxhp);

        let Maxmp = player.GetMaxmp();
        player.SetVar3(Maxmp);

        let Hp = player.GetHp();
        player.SetVar4(Hp);

        let Mp = player.GetMp();
        player.SetVar5(Mp);

        let Res1 = player.GetRes1();
        player.SetVar6(Res1);

        let Res2 = player.GetRes2();
        player.SetVar7(Res2);

        let Res3 = player.GetRes3();
        player.SetVar8(Res3);

        let Res4 = player.GetRes4();
        player.SetVar9(Res4);

        let Res5 = player.GetRes5();
        player.SetVar10(Res5);

        let v35 = zrand(100);
        let v36 = skill.GetLevel() + 1;
        let v37 = (v35 >= v36 * (skill.GetLevel() + 1)) ? 2 : 1;

        player.SetVar16(v37);
        skill.SetRatio(0.78)
        skill.SetPlus(1075)
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:霜骨+2
        //在10秒内增加自身真气上限5%*level
        player.SetIncmp(0.05 * skill.GetLevel(), 10000, 4)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:霜啸+2
        //在10秒内令目标受到的伤害加深15%+5%*level。
        player.SetInchurt(120, 0.15 + 0.05 * skill.GetLevel(), 10000)
        //特效:霜剑+2
        //若自身真气上限高于目标，则有60%概率令目标进入霜结状态4.5秒。
        if (player.GetVar3() > player.GetMaxmp()) {
            player.SetGFrosty(60, 4500)
        }

        return true
    }
}

/**
 * 4297  飞雪封脉特效 霜啸
 *
 */
class Skill4297 extends BaseHookSkillStub {

    constructor() {
        super(4297);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:霜啸+2
        //在10秒内令目标受到的伤害加深15%+5%*level。
        player.SetInchurt(120, 0.15 + 0.05 * skill.GetLevel(), 10000)
        return true
    }

}

/**
 * 4298  飞雪封脉特效 霜骨
 * //特效:霜骨+2
 * //在10秒内增加自身真气上限5%*level
 */
class Skill4298 extends BaseHookSkillStub {

    constructor() {
        super(4298);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:霜骨+2
        //在10秒内增加自身真气上限5%*level
        player.SetIncmp(0.05 * skill.GetLevel(), 10000, 4)
        return true
    }

}

/**
 * 4299  飞雪封脉特效 霜剑
 * //特效:霜剑+2
 * //若自身真气上限高于目标，则有60%概率令目标进入霜结状态4.5秒。
 */
class Skill4299 extends BaseHookSkillStub {

    constructor() {
        super(4299);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:霜骨+2
        //在10秒内增加自身真气上限5%*level
        if (player.GetVar3() > player.GetMaxmp()) {
            player.SetGFrosty(60, 4500)
        }

        return true
    }

}

/**
 * 炎龙焚天
 *
 * 特效:炎炀+2
 * 二在36*level秒内增加自身攻击上限5000点。*特效:炎攸+2
 * ·在36 level秒内降低目标攻击上限5000点。特效:微炽+2
 * *121814%leve概率令自身获得附加状态,每次释放群体攻击时夺目标额外受到一次附加伤害,数值为50000点5
 */
class SkillXuanHuoJian extends BaseHookSkillStub {

    constructor() {
        super(1927);//浮屠改
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(0.54 + 0.18 * skill.GetLevel())
        skill.SetPlus(1530 + 510 * skill.GetLevel())
        player.SetVar1(player.GetMaxmp())
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:炎炀+2
        //在36*level秒内增加自身攻击上限5000点
        player.SetAddattack(120, 36000 * skill.GetLevel(), 5000, 4)
        //特效:微炽+2
        //12%+4%leve概率令自身获得附加状态,每次攻击时令目标额外受到一次附加伤害,数值为50000点
        player.SetAddcommon(0.12 + 0.04 * skill.GetLevel(), 120, 518, 1, 10000, 4)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:炎攸+2
        //在36*level秒内降低目标攻击上限5000点
        player.SetSubattack(120, 36000 * skill.GetLevel(), 5000, 4)
        return true
    }
}

/**
 * 真·炎龙焚天
 *
 * 特效:炎炀+2
 * 二在36*level秒内增加自身攻击上限5000点。*特效:炎攸+2
 * ·在36 level秒内降低目标攻击上限5000点。特效:微炽+2
 * *121814%leve概率令自身获得附加状态,每次释放群体攻击时夺目标额外受到一次附加伤害,数值为50000点5
 */
class SkillXuanHuoJianZhen extends BaseHookSkillStub {

    constructor() {
        super(4102);//浮屠改
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let player = skill.GetPlayerNice();
        let Occupation = player.GetOccupation();
        player.SetVar11(Occupation);

        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);

        let Maxhp = player.GetMaxhp();
        player.SetVar2(Maxhp);

        let Maxmp = player.GetMaxmp();
        player.SetVar3(Maxmp);

        let Hp = player.GetHp();
        player.SetVar4(Hp);

        let Mp = player.GetMp();
        player.SetVar5(Mp);

        let Res1 = player.GetRes1();
        player.SetVar6(Res1);

        let Res2 = player.GetRes2();
        player.SetVar7(Res2);

        let Res3 = player.GetRes3();
        player.SetVar8(Res3);

        let Res4 = player.GetRes4();
        player.SetVar9(Res4);

        let Res5 = player.GetRes5();
        player.SetVar10(Res5);

        let v35 = zrand(100);
        let v36 = skill.GetLevel() + 1;
        let v37 = (v35 >= v36 * (skill.GetLevel() + 1)) ? 2 : 1;

        player.SetVar16(v37);
        skill.SetRatio(0.54 + 0.18 * skill.GetLevel())
        skill.SetPlus(1530 + 510 * skill.GetLevel())
        player.SetPerform(1)
    }

    // BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
    //     const player = skill.GetPlayerNice()
    //     //特效:炎炀+2
    //     //在36*level秒内增加自身攻击上限5000点
    //     player.SetAddattack(120, 36000 * skill.GetLevel(), 5000, 4)
    //     //特效:微炽+2
    //     //12%+4%leve概率令自身获得附加状态,每次攻击时令目标额外受到一次附加伤害,数值为50000点
    //     player.SetAddcommon(0.12 + 0.04 * skill.GetLevel(), 120, 518, 1, 10000, 4)
    //     return true
    // }
    //
    // StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
    //     const player = skill.GetPlayerNice()
    //     //特效:炎攸+2
    //     //在36*level秒内降低目标攻击上限5000点
    //     player.SetSubattack(120, 36000 * skill.GetLevel(), 5000, 4)
    //     return true
    // }
}

/**
 * 承·炎龙焚天
 *
 */
class Skill4520 extends BaseHookSkillStub {

    constructor() {
        super(4520);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let player = skill.GetPlayerNice();
        let Occupation = player.GetOccupation();
        player.SetVar11(Occupation);

        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);

        let Maxhp = player.GetMaxhp();
        player.SetVar2(Maxhp);

        let Maxmp = player.GetMaxmp();
        player.SetVar3(Maxmp);

        let Hp = player.GetHp();
        player.SetVar4(Hp);

        let Mp = player.GetMp();
        player.SetVar5(Mp);

        let Res1 = player.GetRes1();
        player.SetVar6(Res1);

        let Res2 = player.GetRes2();
        player.SetVar7(Res2);

        let Res3 = player.GetRes3();
        player.SetVar8(Res3);

        let Res4 = player.GetRes4();
        player.SetVar9(Res4);

        let Res5 = player.GetRes5();
        player.SetVar10(Res5);

        let v35 = zrand(100);
        let v36 = skill.GetLevel() + 1;
        let v37 = (v35 >= v36 * (skill.GetLevel() + 1)) ? 2 : 1;

        player.SetVar16(v37);
        skill.SetRatio(0.54 + 0.18 * skill.GetLevel())
        skill.SetPlus(1530 + 510 * skill.GetLevel())
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:炎炀+2
        //在36*level秒内增加自身攻击上限5000点
        player.SetAddattack(120, 36000 * skill.GetLevel(), 5000, 4)
        //特效:微炽+2
        //12%+4%leve概率令自身获得附加状态,每次攻击时令目标额外受到一次附加伤害,数值为50000点
        player.SetAddcommon(0.12 + 0.04 * skill.GetLevel(), 120, 518, 1, 10000, 4)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:炎攸+2
        //在36*level秒内降低目标攻击上限5000点
        player.SetSubattack(120, 36000 * skill.GetLevel(), 5000, 4)
        return true
    }
}

/**
 * 4312  特效:炎炀
 *
 */
class Skill4312 extends BaseHookSkillStub {

    constructor() {
        super(4312);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:炎炀+2
        //在36*level秒内增加自身攻击上限5000点
        player.SetAddattack(120, 36000 * skill.GetLevel(), 5000, 4)
        return true
    }

}

/**
 * 4313  特效:微炽
 *
 */
class Skill4313 extends BaseHookSkillStub {

    constructor() {
        super(4313);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:微炽+2
        //12%+4%leve概率令自身获得附加状态,每次攻击时令目标额外受到一次附加伤害,数值为50000点
        player.SetAddcommon(0.12 + 0.04 * skill.GetLevel(), 120, 518, 1, 10000, 4)
        return true
    }

}

/**
 * 4314  特效:炎攸
 *
 */
class Skill4314 extends BaseHookSkillStub {

    constructor() {
        super(4314);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //特效:炎攸+2
        //在36*level秒内降低目标攻击上限5000点
        player.SetSubattack(120, 36000 * skill.GetLevel(), 5000, 4)
        return true
    }
}

/**
 * 518   七步断肠散
 * 改为玄火鉴特效微炽触发，附加伤害50000点
 */
class Skill518 extends BaseHookSkillStub {

    constructor() {
        super(518);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetPlus(50000)
        const player = skill.GetPlayerNice()
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }
}


/**
 * 3981  八门遁甲·杜行
 * 改龙年效果
 * 若自身技能命中高于目标(仅玩家目标)，
 * 则有80%概率清除目标心斋、屏障、牺牲、格挡、不朽、冥、效果反弹、蚩魂、神佑状态，
 * 自身五抗和每高于目标100点，则额外提供1%成功率，冷却时间900秒
 */
class Skill3981 extends BaseHookSkillStub {

    constructor() {
        super(3981);
    }

    GetPraydistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10
    }

    GetEffectdistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10
    }

    GetCastdistance(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 900000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetSkillrate())
        const anti = player.GetRes1() + player.GetRes2() + player.GetRes3() + player.GetRes4() + player.GetRes5()
        player.SetVar2(anti)
        player.SetIgnoreblessed(120, 1200)
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetTypeIsPlayer()) {
            const skillAcc = player.GetSkillrate()
            if (player.GetVar1() > skillAcc) {
                // 则有80%概率清除目标心斋、屏障、牺牲、
                // 格挡、不朽、冥、
                // 效果反弹、蚩魂、神佑状态，
                // 自身五抗和每高于目标100点，则额外提供1%成功率

                let p = 80
                const anti = player.GetRes1() + player.GetRes2() + player.GetRes3() + player.GetRes4() + player.GetRes5()
                const antiProb = (player.GetVar2() - anti) / 100
                if (antiProb > 0) {
                    p += antiProb
                }

                //心斋、屏障、牺牲
                player.SetDispel(p, 9386, 9339, 9320)
                //格挡、不朽、冥、
                player.SetDispel(p, 4294, 4271, 4245)
                //效果反弹、蚩魂、神佑状态，
                player.SetDispel(p, 4188, 900, 4119)
            }
        }

        return true
    }

}


export class TongYongSkillList {
    constructor() {
        new Skill221()
        new SkillMoXue()
        new SkillMoXueZhen()
        new SkillMoXueCheng()
        new Skill4297()
        new Skill4298()
        new Skill4299()
        new SkillXuanHuoJian()
        new SkillXuanHuoJianZhen()
        new Skill4520()
        new Skill4312()
        new Skill4313()
        new Skill4314()
        new Skill518()
        // new Skill473()
        new Skill474()
        new Skill441()
        new Skill442()
        new Skill443()
        new Skill7021()
        new Skill7022()
        new Skill7023()
        new Skill7024()
        new Skill7025()
//        new Skill7026()
        new ShituSkill()
        new XianSkill()
        new Skill3009()
        new Skill3010()
        new Skill3013()
        new Skill3015()
        new Skill1525()
        new Skill3014()
        new MoSkill()
        new Skill3058()
        new Skill3059()
        new Skill3063()
        new FoSkill()
        new Skill3106()
        new Skill3108()
        new Skill3107()
        new Skill1573()
        new ShiZhuang()
        new Skill2515()
        new Skill3214()
        new Skill3874()
        new Skill4730()
        new Skill5342()
        new Skill5950()
        new Skill6412()
        new Skill7241()
        new Skill7793()
        new ShenBao()
        new Skill220()
        // new Skill7220()

        const setFrozenFunc = "_ZN4GNET13PlayerWrapper9SetFrozenEb"
        Interceptor.replace(HookFuncCore.getFuncAddress(setFrozenFunc),
            new NativeCallback((playerPointer, b) => {
                    const player = new SPlayer(playerPointer)
                    if (player.GetTypeIsMob()) {
                        return 1
                    } else {
                        const originFunc = HookFuncCore.getNativeFunc(setFrozenFunc, 'int32', ['pointer', 'bool'])
                        return originFunc(playerPointer, b)
                    }
                }, 'int32', ['pointer', 'bool']
            ));
    }
}