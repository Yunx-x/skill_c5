import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickBlessMeList, QuickCoolDownList, QuickExecutetimeList} from "../../base/skill/QuickSkillUtil";

/**
 * 276  易筋经
 * 冷却减50秒，优化施法
 */
class Skill276 extends BaseHookSkillStub {

    constructor() {
        super(276);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 50000;
    }

}

/**
 * 283   慈航普渡
 * 3*level秒内令自身及周围队友获得薄命效果
 * 冷却时间调整为200秒
 *
 * 2070  慈航普渡II
 * 被动额外降低慈航普渡冷却时间60秒，延长慈航普渡免死时间10秒
 */
class Skill283 extends BaseHookSkillStub {

    constructor() {
        super(283);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const sk = player.GetSkilllevel(2070)
        if (sk > 0) {
            return 140000
        } else {
            return 200000
        }
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const sk = player.GetSkilllevel(2070)
        let skTime = 0
        if (sk > 0) {
            skTime = 10000
        }

        player.SetImmuneDeath(120, 1, 3000 * skill.GetLevel() + skTime)
        return true
    }

}

/**
 * 275   同归极乐
 * 施法1秒，冷却固定180秒
 * 新增效果：额外追加一次白字伤害，数值为自身真气上限的10%*level
 *
 * 6829玄烛·御空术·曦日：
 * 技能达到5级时
 * 新增效果三：被动影响，同归极乐追加一次伤害的数值额外附加自身真气上限的20%，降低冷却时间50秒
 */
class Skill275 extends BaseHookSkillStub {

    constructor() {
        super(275);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetVar2() >= 5) {
            return 130000
        } else {
            return 180000
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 800
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetMaxmp())
        player.SetVar2(player.GetSkilllevel(6829))
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetVar2() >= 5) {
            player.SetDirecthurt(120, player.GetVar1() * 0.2 * skill.GetLevel())
        } else {
            player.SetDirecthurt(120, player.GetVar1() * 0.1 * skill.GetLevel())
        }

        return true
    }
}

/**
 * 319   观音经
 * 冷却减少90秒
 */
class Skill319 extends BaseHookSkillStub {

    constructor() {
        super(319);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 90000;
    }

}

/**
 * 285   金刚护体
 * 30分钟内减免伤害提升5%，没优化施法
 */
class Skill285 extends BaseHookSkillStub {

    constructor() {
        super(285);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetUltimateDamageReduction(100, 30 * 60000, 0.03, 1, 7);
        super.Calculate2(stub, skill, originFunc);
    }

}

/**
 * 386   大慈悲
 * 施法1秒，冷却固定60秒，增加气血上限调整为3%*level
 * 新增效果：令自身/队友15秒内增加2%*level致命一击率，6%*level致命一击伤害
 */
class Skill386 extends BaseHookSkillStub {

    constructor() {
        super(386);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 800
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const v13 = 900000 * skill.GetT(0) + 1800000;
        const v17 = skill.GetT(2) * 0.04;
        const d = skill.GetLevel() * 0.03 + v17;
        player.SetCibei(100, d, 0, v13, 1);

        const T1 = skill.GetT(1);
        const v15 = skill.GetLevel() * 8.8;
        const level = skill.GetLevel();
        const da = ((skill.GetLevel() * 2.7 * level + v15 + 239.0) * 0.75 * T1);
        player.SetHeal(100, da, 0);

        //暴击
        player.SetInccritrate(15000, skill.GetLevel() * 0.02, 5)

        //爆伤
        player.SetInccrithurt(100, skill.GetLevel() * 0.06, 15000, 5)
        return true
    }

}

/**
 * 550   寂灭蔽日
 * 冷却减少30秒
 */
class Skill550 extends BaseHookSkillStub {

    constructor() {
        super(550);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

}

/**
 * 553   慈航法愿
 * 增加每5秒减免伤害提升6%
 */
class Skill553 extends BaseHookSkillStub {

    constructor() {
        super(553);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = skill.GetLevel() * 0.03;
        player.SetIncskilldamage(d, 8100, 2);

        let v6 = zrand(125);
        let da = 9 * norm(v6 / 100) + 266;
        let v8 = zrand(125);
        let db = 16 * norm(v8 / 100) + 266;
        let v10 = zrand(125);
        let dc = 280 * norm(v10 / 100) + 266;
        player.SetClearcooldown(da, db, dc);

        let v13 = zrand(125);
        let dd = 286 * norm(v13 / 100) + 266;
        let v15 = zrand(125);
        let de = 521 * norm(v15 / 100) + 266;
        player.SetClearcooldown(dd, de, 266);

        let df = skill.GetLevel() * 0.05;
        player.SetIncdrugeffect(120, 8100, df, 1);

        player.SetDecfatalhurt(120, 0.1, 8100, 2)

        //驱散不利状态
        player.SetCleardebuff(120, 2);
        return true
    }

}

/**
 * 277   佛光普照
 * 新增效果:增加自身及周围队友减爆伤40%,持续30秒
 */
class Skill277 extends BaseHookSkillStub {

    constructor() {
        super(277);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDecfatalhurt(120, 0.4, 30000, 2)
        return true
    }

}

/**
 * 549   摩诃心经
 * 冷却减少100秒
 *
 * 6832玄烛·摩诃心经·曦日：技能达到5级时
 * 降低摩诃心经的冷却时间100秒
 * 新增效果二：令目标10秒内无视单体技能攻击
 * 新增效果三：令目标获得15秒的转阴易阳（玉册）效果
 * 新增效果四：25秒内令目标增加气血上限，数值为自身最大攻击力的8.0倍
 */
class Skill549 extends BaseHookSkillStub {

    constructor() {
        super(549);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6832) >= 5) {
            return super.GetCooldowntime(stub, skill, originFunc) - 200000;
        } else {
            return super.GetCooldowntime(stub, skill, originFunc) - 100000;
        }
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetMaxatk())
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6832) >= 5) {
            // 令目标10秒内无视单体技能攻击
            player.SetSingleTargetImmune(120, 10000,1.0)
            // 令目标获得15秒的转阴易阳（玉册）效果
            player.SetTurndebuff(15000, 0, 1)
            //25秒内令目标增加气血上限，数值为自身最大攻击力的8.0倍
            player.SetAddhp(25000, player.GetVar1() * 8, 6)
        }

        return true
    }

}

/**
 * 273   宏愿
 * 冷却0秒；令目标90秒内气血上限提升,数值为1%*level
 */
class Skill273 extends BaseHookSkillStub {

    constructor() {
        super(273);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInchp(skill.GetLevel() * 0.01, 90000, 3)
        return true
    }

}

// /**
//  * 554   佛陀净世愿
//  * 694天书-伏魔真诀新增影响佛陀净世愿,
//  * 新增效果:攻击怪物目标时,
//  * 额外附加本体攻击力50%*level,
//  * 额外附加自身气血真气上限和的 5%*level的攻击力，
//  * 额外附加致命一击率5%*level
//  */
// class Skill554 extends BaseHookSkillStub {
//
//     constructor() {
//         super(554);
//     }
//
//     Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
//         const player = skill.GetPlayerNice()
//
//         let crit = 0
//         const fmzj = player.GetSkilllevel(694)
//         if (fmzj > 0) {
//             const atk = fmzj * 0.5 * player.GetInk()
//             const hpmp = (player.GetMaxhp() + player.GetMaxmp()) * fmzj * 0.05
//             skill.SetMobBonusDamage(atk + hpmp)
//
//             if (player.GetTargetTypeIsMob()) {
//                 crit = 0.05 * fmzj
//             }
//         }
//
//         let v9 = skill.GetT2() * 0.01;
//         skill.SetCrit(v9 + crit);
//         let v6 = skill.GetT0() * 0.05 + 1.0;
//         let v10 = skill.GetT2() * 0.1 + v6;
//         skill.SetRatio(v10);
//         const Level = skill.GetLevel();
//         let v7 = Math.floor(1.42 - Level * 0.05) * 0.9;
//         let v8 = (13 * skill.GetLevel() + 280) * v7;
//         const v3 = skill.GetLevel();
//         let v5 = Math.floor(v3 * 0.05 + 0.55) * 0.9;
//         let v11 = (15 * skill.GetLevel() + 300) * v5 + v8;
//         skill.SetPlus(v11);
//         player.SetPerform(1);
//     }
//
//     Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
//         const player = skill.GetPlayerNice()
//
//         let crit = 0
//         if (player.GetSkilllevel(694) > 0) {
//             const atk = skill.GetLevel() * 0.5 * player.GetInk()
//             const hpmp = (player.GetMaxhp() + player.GetMaxmp()) * skill.GetLevel() * 0.05
//             skill.SetMobBonusDamage(atk + hpmp)
//
//             if (player.GetTargetTypeIsMob()) {
//                 crit = 0.05 * skill.GetLevel()
//             }
//         }
//
//         let v9 = skill.GetT2() * 0.01;
//         skill.SetCrit(v9 + crit);
//         let v6 = skill.GetT0() * 0.05 + 1.0;
//         let v10 = skill.GetT2() * 0.1 + v6;
//         skill.SetRatio(v10);
//         const Level = skill.GetLevel();
//         let v7 = Math.floor(1.42 - Level * 0.05) * 0.9;
//         let v8 = (13 * skill.GetLevel() + 280) * v7;
//         const v3 = skill.GetLevel();
//         let v5 = Math.floor(v3 * 0.05 + 0.55) * 0.9;
//         let v11 = (15 * skill.GetLevel() + 300) * v5 + v8;
//         skill.SetPlus(v11);
//         player.SetPerform(0);
//     }
//
//     Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
//         const player = skill.GetPlayerNice()
//
//         let crit = 0
//         if (player.GetSkilllevel(694) > 0) {
//             const atk = skill.GetLevel() * 0.5 * player.GetInk()
//             const hpmp = (player.GetMaxhp() + player.GetMaxmp()) * skill.GetLevel() * 0.05
//             skill.SetMobBonusDamage(atk + hpmp)
//
//             if (player.GetTargetTypeIsMob()) {
//                 crit = 0.05 * skill.GetLevel()
//             }
//         }
//
//         let v9 = skill.GetT2() * 0.01;
//         skill.SetCrit(v9 + crit);
//         let v6 = skill.GetT0() * 0.05 + 1.0;
//         let v10 = skill.GetT2() * 0.1 + v6;
//         skill.SetRatio(v10);
//         const Level = skill.GetLevel();
//         let v7 = Math.floor(1.42 - Level * 0.05) * 0.9;
//         let v8 = (13 * skill.GetLevel() + 280) * v7;
//         const v3 = skill.GetLevel();
//         let v5 = Math.floor(v3 * 0.05 + 0.55) * 0.9;
//         let v11 = (15 * skill.GetLevel() + 300) * v5 + v8;
//         skill.SetPlus(v11);
//         player.SetPerform(0);
//     }
//
// }

/**
 * 四大皆空：火/风/水/地
 * 施法1秒
 */
class SiDaJieKong extends QuickExecutetimeList {
    getSkillList(): number[] {
        return [382, 383, 384, 385];
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 800
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

}

/**
 * 280   苦海无边
 * 无冷却，攻击3次，每段附加自身当前气血8%攻击力，优化施法
 */
class Skill280 extends BaseHookSkillStub {

    constructor() {
        super(280);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v7 = Math.floor(skill.GetT2() * 0.05 + 1.0);
        skill.SetRatio(v7);
        const v6 = 15 * skill.GetLevel();
        const player = skill.GetPlayerNice();
        const v4 = Math.floor(player.GetLevel() * 0.12);
        const v5 = skill.GetT0() * v4;
        const v8 = skill.GetLevel() * v5 + v6;
        skill.SetPlus(v8 + player.GetHp() * 0.08);
        const v3 = skill.GetPlayerNice();
        v3.SetPerform(1);
        v3.SetPerform(0);
        v3.SetPerform(0);
    }

}

/**
 * 284   天地同寿
 * 优化施法，快速对目标攻击3次，附加自身当前气血，真气提高2%，转换总量提升1%
 * 【玄烛·天地同寿·萤炬/皓月/曦日】令天地同寿额外追加自身本体攻击力40%/70%/100%
 */
class Skill284 extends BaseHookSkillStub {

    constructor() {
        super(284);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v17 = Math.floor(skill.GetT1() * 0.05 + 1.0);
        skill.SetRatio(v17);
        const player = skill.GetPlayerNice();

        const yj = player.GetSkilllevel(6833);
        const hy = player.GetSkilllevel(6834);
        const xr = player.GetSkilllevel(6835);

        const atk = player.GetInk()
        let addPlus = 0
        if (yj > 0) {
            addPlus = atk * 0.4
        }

        if (hy > 0) {
            addPlus = atk * 0.7
        }

        if (xr > 0) {
            addPlus = atk
        }

        const star_lvl = player.GetSkilllevel(6834) + player.GetSkilllevel(6833) + player.GetSkilllevel(6835);
        const hp = player.GetHp() * 0.32;
        const hpa = player.GetMp() * 1.02 + hp;
        const v18 = ((skill.GetLevel() * 0.03 + 0.13 + star_lvl * 0.02) * hpa);
        skill.SetPlus(v18 + addPlus);

        const hpa2 = player.GetHp() * 0.7;
        player.SetHp(hpa2);
        const hpb = skill.GetT0() * 0.05;
        const hpb2 = player.GetMp() * hpb;
        player.SetMp(hpb2);
        player.SetPerform(1);
        player.SetPerform(0);
        player.SetPerform(0);
    }

}

/**
 * 677   相续不空
 * 删除原有效果，冷却固定100秒
 * 新增效果：20秒内自身气血上限提升50%，减免致命一击率，减免致命一击伤害，减免伤害百分比提升20%，同时保护自身所有状态不会被清除
 */
class Skill677 extends BaseHookSkillStub {

    constructor() {
        super(677);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetInchp(0.5, 20000, 1)
        player.SetDecfatalratio(120, 0.2, 20000, 1)
        player.SetDecfatalhurt(120, 0.2, 20000, 1)
        player.SetUltimateDamageReduction(120, 20000, 0.2, 1, 7)
        player.SetBuffClearImmune(120, 20000)
        return true
    }

}

/**
 * 1541  同归极乐II
 * 冷却固定为40秒，技能等级升高不再延长技能冷却，施法1秒。附加攻击力为自身当前气血的100%
 */
class Skill1541 extends BaseHookSkillStub {

    constructor() {
        super(1541);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 800
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.0)
        skill.SetPlus(skill.GetLevel() * 0.1 * player.GetHp())
        player.SetPerform(1)
    }

}

/**
 * 1542  慈航法愿II
 * 降低技能命中调整为3*level，降低技能躲闪调整为5*level
 * 增加效果：令目标技能伤害降低 2%*level
 */
class Skill1542 extends BaseHookSkillStub {

    constructor() {
        super(1542);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //降低技能命中
        const d = skill.GetLevel() * 0.0301;//改3
        player.SetDecskillaccu(100, d, 8100, 0);

        //降低技能躲闪
        const da = skill.GetLevel() * 0.0501;//改5
        player.SetDecskilldodge(100, da, 8100, 0);

        player.SetDecskilldamage(0.02 * skill.GetLevel(), 8100, 2)
        return true
    }

}

/**
 * 1593  金刚护体II
 * 冷却120秒，修改效果：20秒内增加减免致命一击率10%，减免致命一击伤害50%，并且根据自身真气上限每十万提高目标减免伤害百分1%，最高提高10%，
 */
class Skill1593 extends BaseHookSkillStub {

    constructor() {
        super(1593);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let count = Math.floor(player.GetMaxmp() / 1000000)
        if (count > 0) {
            if (count > 10) {
                count = 10
            }

            player.SetUltimateDamageReduction(120, skill.GetLevel() * 2000, count * 0.01, 1, 2)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 900000 * skill.GetT1() + 1800000;
        const ta = skill.GetT0() * 0.01;
        const ta2 = skill.GetLevel() * 0.01 + 0.15 + ta;
        player.SetIncdefence(120, t, ta2, 2);

        player.SetDecfatalratio(120, skill.GetLevel() * 0.01, skill.GetLevel() * 2000, 3);
        player.SetDecfatalhurt(120, skill.GetLevel() * 0.05, skill.GetLevel() * 2000, 3);
        return true
    }
}

/**
 * 2070  慈航普渡II
 * 在10+2*level 秒内增加自身及友方三御属性1%*level;
 * 令自身及周围队友受到的暴击伤害减15%*level;
 *
 * 被动额外降低慈航普渡冷却时间60秒，延长慈航普渡免死时间20秒
 */
class Skill2070 extends BaseHookSkillStub {

    constructor() {
        super(2070);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const t = 10000 + 2000 * skill.GetLevel()
        const r = 0.01 * skill.GetLevel()
        player.SetIncCultRes(120, t, r, 0, 0)
        player.SetIncCultRes(120, t, r, 1, 1)
        player.SetIncCultRes(120, t, r, 2, 2)

        player.SetDecfatalhurt(120, skill.GetLevel() * 0.15, t, 3);
        return true
    }

}

/**
 * 2071  天地同寿II
 * 令自身及周围队友获得神佑10秒,免疫伤害20次，队友减免伤害的比例提升至60%
 */
class Skill2071 extends BaseHookSkillStub {

    constructor() {
        super(2071);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetBlessed(20, 10000)
        return super.BlessMe(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = skill.GetLevel() * 0.02 + 0.1;
        const d2 = player.GetVar1() * d * 15.0;
        player.SetHpgen(120, 30000, 0, d2, 0, 0);

        player.SetBlessed(20, 10000)

        const d3 = 1500 * skill.GetLevel() + 15000;
        const d4 = skill.GetLevel() * 0.06;
        player.SetDecdamage(100, d4, d3);
        return true
    }

}

/**
 * 1594  摩诃心经II
 * 冷却120秒，并在20秒内令自身和友方获得转阴易阳（玉册）效果，同时在此期间保护友方的有利状态不会被清除
 */
class Skill1594 extends BaseHookSkillStub {

    constructor() {
        super(1594);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetTurndebuff(2000 * skill.GetLevel(), 10, 1)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetTurndebuff(2000 * skill.GetLevel(), 10, 1)
        player.SetBuffClearImmune(120, 2000 * skill.GetLevel())
        return true
    }

}

/**
 * 1592  易筋经II
 * 冷却减少80秒，增加自身技能躲闪200点
 */
class Skill1592 extends BaseHookSkillStub {

    constructor() {
        super(1592);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 80000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, 2.0, skill.GetLevel() * 1000 + 5500, 2)
        return true
    }
}

/**
 * 2061  宏愿II
 * 降低目标气血50%，最多降至气血上限的60%，降低技能伤害90%
 */
class Skill2061 extends BaseHookSkillStub {

    constructor() {
        super(2061);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const t = 1000 * skill.GetLevel() + 5000;
        const player = skill.GetPlayerNice();
        let ta = skill.GetLevel() * 0.04;
        if (ta > 0.9) {
            ta = 0.9
        }

        player.SetDecskilldamage(ta, t, 1);

        const tb = 1000 * skill.GetLevel() + 5000;
        const maxhp = player.GetMaxhp();

        const tc = maxhp * 0.6;
        let td = skill.GetLevel() * 0.05;

        if (td > 0.6) {
            td = 0.6
        }

        const value = maxhp * td;
        player.SetSubhp(100, value, tc, tb, 8);

        return true
    }

}

/**
 * 2060  往生咒II
 * 施法1秒，冷却60秒。追加伤害调整为自身真气上限的15%*level，最多不超过自身气血上限的1.5倍
 */
class Skill2060 extends BaseHookSkillStub {

    constructor() {
        super(2060);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 600
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar3(player.GetMaxmp())
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let hurt = player.GetVar3() * 0.15 * skill.GetLevel()
        const maxhp = player.GetVar2()
        if (hurt > maxhp * 1.5) {
            hurt = maxhp * 1.5
        }

        player.SetDirecthurt(120, hurt);
        return true
    }

}

/**
 * 2050  四大皆空II
 * 冷却80秒。新增效果：20秒内保护自身有利状态不被清除，并令自身10秒内下一击必定出爆
 */
class Skill2050 extends BaseHookSkillStub {

    constructor() {
        super(2050);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 80000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetBuffClearImmune(120, 2000 * skill.GetLevel())
        player.SetMakecrit(10000)
        return true
    }

}

/**
 * 3025  雷音法谕<玄>
 * 攻击目标8次，每段附加自身当前气血3%，当前真气3%，无冷却，
 * 每次施法有几率增加自身致命一击伤害10%，
 * 最高可叠加100%
 * 攻击非玩家目标时额外附加自身真气上限20%攻击力
 *
 * 694
 * 天书-伏魔真诀：
 * 攻击怪物目标时，附加本体攻击力50%*level,附加自身气血真气上限和的 5%*level的攻击力，额外附加致命一击率5%*level，致命一击伤害25%*level。
 * 影响技能：雷音法谕<玄><煞><禅>、无量真言<玄><煞><禅>
 */
class Skill3025 extends BaseHookSkillStub {

    constructor() {
        super(3025);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //叠加致命一击伤害
        player.SetStackCritHurt(90, 0.1, 1, 10, 7000)
        return true
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res3 = player.GetRes3();
        player.SetVar(1, res3);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);

        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res3 = player.GetRes3();
        player.SetVar(1, res3);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);
        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res3 = player.GetRes3();
        player.SetVar(1, res3);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);
        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res3 = player.GetRes3();
        player.SetVar(1, res3);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);
        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);
    }

}

/**
 * 3073
 *
 */
class Skill3073 extends BaseHookSkillStub {

    constructor() {
        super(3073);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //叠加致命一击伤害
        player.SetStackCritHurt(90, 0.1, 1, 10, 7000)
        return true
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res1 = player.GetRes1();
        player.SetVar(1, res1);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);
        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(1);
        player.SetPerform(0);

    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res1 = player.GetRes1();
        player.SetVar(1, res1);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);
        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);

    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res1 = player.GetRes1();
        player.SetVar(1, res1);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);
        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);

    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let res1 = player.GetRes1();
        player.SetVar(1, res1);

        let level = skill.GetLevel();
        let v14 = level * 0.05 + 1.0;
        let v13 = norm(level / 14.9) * 0.03;
        let v15 = (level - 15) * v13 + v14;
        let v16 = skill.GetT2() * 0.12 + v15;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v16 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v16);
        }

        let v6 = 22 * level + 835;
        let v8 = v6 + level * level;
        let t3 = skill.GetT3();
        let v10 = zrand(7 * t3 + 99);
        let v12 = v8 * (v10 / 100 + 1);
        skill.SetPlus(v12 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);

    }
}

/**
 * 3121
 *
 */
class Skill3121 extends BaseHookSkillStub {

    constructor() {
        super(3121);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //叠加致命一击伤害
        player.SetStackCritHurt(90, 0.1, 1, 10, 7000)
        return true
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let level = skill.GetLevel();
        let v11 = level * 0.05 + 1.0;
        let v10 = norm(level / 14.9) * 0.03;
        let v12 = (level - 15) * v10 + v11;
        let v13 = skill.GetT2() * 0.12 + v12;

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v13 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v13);
        }

        let v3 = 22 * level + 835;
        let v5 = v3 + level * level;
        let t3 = skill.GetT3();
        let v7 = zrand(7 * t3 + 99);
        let v9 = v5 * (v7 / 100 + 1);

        skill.SetPlus(v9 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let level = skill.GetLevel();
        let v11 = level * 0.05 + 1.0;
        let v10 = norm(level / 14.9) * 0.03;
        let v12 = (level - 15) * v10 + v11;
        let v13 = skill.GetT2() * 0.12 + v12;
        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v13 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v13);
        }

        let v3 = 22 * level + 835;
        let v5 = v3 + level * level;
        let t3 = skill.GetT3();
        let v7 = zrand(7 * t3 + 99);
        let v9 = v5 * (parseInt(String(v7 / 100)) + 1);

        skill.SetPlus(v9 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let level = skill.GetLevel();
        let v11 = level * 0.05 + 1.0;
        let v10 = norm(level / 14.9) * 0.03;
        let v12 = (level - 15) * v10 + v11;
        let v13 = skill.GetT2() * 0.12 + v12;
        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v13 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v13);
        }

        let v3 = 22 * level + 835;
        let v5 = v3 + level * level;
        let t3 = skill.GetT3();
        let v7 = zrand(7 * t3 + 99);
        let v9 = v5 * (parseInt(String(v7 / 100)) + 1);

        skill.SetPlus(v9 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let level = skill.GetLevel();
        let v11 = level * 0.05 + 1.0;
        let v10 = norm(level / 14.9) * 0.03;
        let v12 = (level - 15) * v10 + v11;
        let v13 = skill.GetT2() * 0.12 + v12;
        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            const fmRatio = fmLevel * 0.5
            skill.SetRatio(v13 + fmRatio);
            skill.SetCrit(fmLevel * 0.05)
        } else {
            skill.SetRatio(v13);
        }

        let v3 = 22 * level + 835;
        let v5 = v3 + level * level;
        let t3 = skill.GetT3();
        let v7 = zrand(7 * t3 + 99);
        let v9 = v5 * (parseInt(String(v7 / 100)) + 1);
        skill.SetPlus(v9 + player.GetHp() * 0.05 + player.GetMp() * 0.05);

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        player.SetPerform(0);
        player.SetPerform(0);
    }
}

/**
 * 3026  无量真言<玄>
 * 【仙阵：深度睡眠延长至9秒，令目标禁食5秒，几率触发自身2秒神佑 攻击非玩家目标时额外附加自身真气上限20%攻击力】
 * 无量真言<煞>【魔阵：深度睡眠延长至9秒，对目标神佑压制，几率触发自身2秒神佑 攻击非玩家目标时额外附加自身真气上限20%攻击力】
 * 无量真言<禅>【佛阵：深度睡眠延长至9秒，深度睡眠再次延长6秒，几率触发自身2秒神佑 攻击非玩家目标时额外附加自身真气上限20%攻击力】
 */
class Skill3026 extends BaseHookSkillStub {

    constructor() {
        super(3026);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //神佑
        player.SetBlessed(5, 2100);
        return true
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate4(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = skill.GetLevel() * 0.01 + 0.1;
        player.SetDecanti(d, 3100);

        let playerVar1 = player.GetVar(1);
        let playerVar3 = player.GetVar(3);
        player.SetDsleep((skill.GetLevel() * 0.01 + 0.5) * playerVar1, 9100, playerVar3 * 0.1);

        let t2Value = skill.GetT2() * 0.1;
        player.SetDrainmagic(-1, t2Value);

        player.SetSleep((skill.GetLevel() * 0.01 + 0.5) * playerVar1, 15100, 0);

        let var2Check = player.GetVar(2) == 2 ? 120 : 0;
        let dc = 1500 * skill.GetLevel();
        player.SetInchurt3(var2Check, 0.03, dc, 5);

        //禁食
        player.SetDiet((skill.GetLevel() * 0.01 + 0.5) * playerVar1, 5100);
        return true
    }
}

/**
 * 3074
 *
 */
class Skill3074 extends BaseHookSkillStub {

    constructor() {
        super(3074);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //神佑
        player.SetBlessed(5, 2100);
        return true
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate4(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = skill.GetLevel() * 0.01 + 0.1;
        player.SetDecanti(d, 3100);

        let playerVar1 = player.GetVar(1);
        let playerVar3 = player.GetVar(3);
        player.SetDsleep((skill.GetLevel() * 0.01 + 0.5) * playerVar1, 9100, playerVar3 * 0.1);

        let t2Value = skill.GetT2() * 0.1;
        player.SetDrainmagic(-1, t2Value);

        player.SetSleep((skill.GetLevel() * 0.01 + 0.5) * playerVar1, 15100, 0);

        let var2Check = player.GetVar(2) == 2 ? 120 : 0;
        let dc = 1500 * skill.GetLevel();
        player.SetInchurt3(var2Check, 0.03, dc, 5);

        player.SetDisableBless(120, 5100);
        return true
    }
}

/**
 * 3122
 *
 */
class Skill3122 extends BaseHookSkillStub {

    constructor() {
        super(3122);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //神佑
        player.SetBlessed(5, 2100);
        return true
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const fmLevel = player.GetSkilllevel(694)
        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(fmLevel * 0.05)
        }

        const fmPlus = fmLevel * 0.05 * player.GetMaxHPAndMP() + fmLevel * 0.5 * player.GetInk()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.2 + fmPlus)
        skill.SetMobCrithurt(fmLevel * 0.25)

        super.Calculate4(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = skill.GetLevel() * 0.01 + 0.1;
        player.SetDecanti(d, 3100);

        let playerVar1 = player.GetVar(1);
        let playerVar3 = player.GetVar(3);
        player.SetDsleep((skill.GetLevel() * 0.01 + 0.5) * playerVar1, 15100, playerVar3 * 0.1);

        let t2Value = skill.GetT2() * 0.1;
        player.SetDrainmagic(-1, t2Value);

        player.SetSleep((skill.GetLevel() * 0.01 + 0.5) * playerVar1, 15100, 0);

        let var2Check = player.GetVar(2) == 2 ? 120 : 0;
        let dc = 1500 * skill.GetLevel();
        player.SetInchurt3(var2Check, 0.03, dc, 5);

        return true
    }
}

/**
 * 天外佛光:玄/霸/妙/梵/暗/焚 新增效果:释放技能时清除“大梵般若<玄><煞><禅>”的冷却
 */
class TianWaiFoGuang extends QuickBlessMeList {
    getSkillList(): number[] {
        return [1307, 1639, 1659, 1679, 3794];
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()

        player.SetClearcooldown(3027, 3075, 3123)
        return true
    }

}

/**
 * 破魔迦蓝：玄/霸/妙/梵/暗/焚 冷却时间由 360 秒调整至 120 秒
 */
class PoMoGaLan extends QuickCoolDownList {

    getSkillList(): number[] {
        return [1306, 1638, 1658, 1678, 1698, 3793];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

/**
 * 3027  大梵般若<玄>
 * 基础无敌时间增加3秒，冷却90秒
 */
class Skill3027 extends BaseHookSkillStub {

    constructor() {
        super(3027);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 2000 * skill.GetT2() + 20100;
        const ta = skill.GetLevel() * 0.02;
        const ta2 = skill.GetT0() * 0.02 + ta - 0.002;
        const tb = skill.GetLevel() * 0.03;
        const tc = player.GetMaxhp() * tb * 10.0;
        const td = (skill.GetT1() * 0.2 + 1.0) * tc;
        const td2 = (skill.GetT2() * 0.1 + 1.0) * td;
        player.SetBanruo(100, ta2, 0, td2, t, 1);

        const td3 = 2000 * skill.GetT2() + 5100;
        player.SetInvincible(td3);

        const td4 = 2000 * skill.GetT2() + 20100;
        const td5 = skill.GetLevel() * 0.01 + 0.003;
        player.SetInccritrate(td4, td5, 1);
        return true
    }

}

/**
 * 3075  大梵般若<煞>
 * 基础无敌时间增加3秒，冷却90秒
 */
class Skill3075 extends BaseHookSkillStub {

    constructor() {
        super(3075);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 2000 * skill.GetT2() + 20100;
        const ta = skill.GetLevel() * 0.02;
        const ta2 = skill.GetT0() * 0.02 + ta - 0.002;
        const tb = skill.GetLevel() * 0.03;
        const tc = player.GetMaxhp() * tb * 10.0;
        const td = (skill.GetT1() * 0.2 + 1.0) * tc;
        const td2 = (skill.GetT2() * 0.1 + 1.0) * td;
        player.SetBanruo(100, ta2, 0, td2, t, 1);

        const td3 = 2000 * skill.GetT2() + 5100;
        player.SetInvincible(td3);

        const t3 = 2000 * skill.GetT2() + 20100;
        const tdd = skill.GetLevel() * 0.04;
        player.SetInccrithurt(100, tdd, t3, 1);
        return true
    }

}

/**
 * 3123  大梵般若<禅>
 * 基础无敌时间增加3秒，冷却90秒
 */
class Skill3123 extends BaseHookSkillStub {

    constructor() {
        super(3123);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 2000 * skill.GetT2() + 20100;
        const ta = skill.GetLevel() * 0.02;
        const ta2 = skill.GetT0() * 0.02 + ta - 0.002;
        const tb = skill.GetLevel() * 0.03;
        const tc = player.GetMaxhp() * tb * 10.0;
        const td = (skill.GetT1() * 0.2 + 1.0) * tc;
        const td2 = (skill.GetT2() * 0.1 + 1.0) * td;
        player.SetBanruo(100, ta2, 0, td2, t, 1);

        const td3 = 2000 * skill.GetT2() + 5100;
        player.SetInvincible(td3);

        player.SetDecfatalratio(120, 0.05, 20100, 1);
        return true
    }

}

/**
 * 5845  大梵般若III《天空》
 * 《天空》《大地》《碧海》《英雄》
 * 无敌时间13秒，提高自身暴击30点
 */
class Skill5845 extends BaseHookSkillStub {

    constructor() {
        super(5845);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = player.GetMaxhp() * 0.3 * 13.0;
        player.SetBanruo(100, 0.24, 0, d, 26100, 1);
        player.SetInvincible(13100);
        player.SetInccritrate(12100, 0.3, 0);
        return true
    }

}

/**
 * 5846  大梵般若III《碧海》
 * 无敌时间13秒，提高自身爆伤80点
 */
class Skill5846 extends BaseHookSkillStub {

    constructor() {
        super(5846);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = player.GetMaxhp() * 0.3 * 13.0;
        player.SetBanruo(100, 0.24, 0, d, 26100, 1);
        player.SetInvincible(13100);
        player.SetInccrithurt(100, 0.8, 8100, 1);
        return true
    }

}

/**
 * 5848  大梵般若III《英雄》
 * 无敌时间13秒，提高自身技能命中80点
 */
class Skill5848 extends BaseHookSkillStub {

    constructor() {
        super(5848);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = player.GetMaxhp() * 0.3 * 13.0;
        player.SetBanruo(100, 0.24, 0, d, 26100, 1);
        player.SetInvincible(13100);
        player.SetIncskillaccu(100, 0.8, 16100, 1);
        return true
    }

}

/**
 * 6826  赤乌·破魔秘言·曦日
 * 增加减免伤害百分比的数值调整为3*level，持续时间调整为12秒。
 * 新增效果：可清除自身/队友受到的 一丈红 状态
 */
class Skill6826 extends BaseHookSkillStub {

    constructor() {
        super(6826);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = skill.GetLevel() * 0.03;
        player.SetUltimateDamageReduction(120, 12100, d, 1, 2);

        player.SetSetcooldown(120, 547, 6825, 6824, 90000);
        player.SetDispel(120, 9356, 0, 0)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetDispel(120, 9356, 0, 0)
        return true
    }

}

/**
 * 396   御空术
 * 6829玄烛·御空术·曦日：
 * 6秒内100%几率无视群体技能攻击，
 * 技能达到5级时
 * 新增效果一：被动影响，每次使用御空术将会降低易筋经II的冷却时间12秒
 * 新增效果二：被动影响，额外降低天书技能-相续不空的冷却时间30秒
 * 新增效果三：被动影响，同归极乐追加一次伤害的数值额外附加自身真气上限的20%，降低冷却时间50秒
 */
class Skill396 extends BaseHookSkillStub {

    constructor() {
        super(396);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        //御空术位移
        player.SetDodge(5000, 15);
        //回血速度增加
        const d = skill.GetLevel() * 0.25;
        const Player = skill.GetPlayerNice();
        const da = Player.GetLevel() * d;
        const da2 = (skill.GetT0() * 1.2 + 1.0) * da;
        player.SetHpgen(100, 8000, 0, da2, 0, 3);

        //清除技能冷却
        const Skilllevel = player.GetSkilllevel(6827);
        const v16 = player.GetSkilllevel(6828) + Skilllevel;
        const star_lvl = v16 + player.GetSkilllevel(6829);
        const v18 = zrand(100);
        const Level = skill.GetLevel();
        const daa = 276 * norm(v18 / (-2 * star_lvl - 9 * Level + 100));
        player.SetClearcooldown(daa, 0, 0);

        let chance = 0;
        if (player.GetSkilllevel(6827) > 0)
            chance = 30;
        if (player.GetSkilllevel(6828) > 0)
            chance = 60;
        if (player.GetSkilllevel(6829) > 0)
            chance = 100;
        const db = chance;

        player.SetAoEImmune(db, 6100);

        if (player.GetSkilllevel(6829) >= 5) {
            player.SetReduceskillcd(120, 1592, 0, 0, 10000)
            player.SetReduceskillcd(120, 677, 0, 0, 30000)
        }

        return true
    }

}

/**
 * 5761  六道轮回III 《大地》
 * 第一段立刻清除目标神佑状态，
 *第四段神佑压制，100%概率令目标在15秒内无法受到神佑状态的保护，
 *施法1.5秒，冷却时间为50秒
 */
class Skill5761 extends BaseHookSkillStub {

    constructor() {
        super(5761);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(1)
        player.SetIgnoreblessed(120, 900)
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(2)
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(3)
        super.Calculate4(stub, skill, originFunc);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(4)
        super.Calculate5(stub, skill, originFunc);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(5)
        super.Calculate6(stub, skill, originFunc);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(6)
        super.Calculate7(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetRandcurse(6, 0.5, 0.5, 4100);
        let d = 0
        if (player.GetVar1() == 1) {
            d = player.GetVar2();
        }

        player.SetSleep(d, 2000, 0);

        let da = 0
        if (player.GetVar1() === 2) {
            da = player.GetVar2();
        }

        const t = player.GetVar3() * 0.1;
        player.SetDsleep(da, 6100, t);

        if (player.GetVar6() == 1) {
            player.SetDispel(120, 4119, 4119, 4119)
        }

        if (player.GetVar6() == 4) {
            const ta = skill.GetLevel() * 5000.0;
            player.SetDisableBless(120, ta);
        }

        return true
    }
}

/**
 * 5762  六道轮回III 《英雄》
 * 每一击可降低目标气血上限8%,持续10秒，
 * 降血状态可叠加6次；
 * 第四段神佑压制，100%概率令目标在15秒内无法受到神佑状态的保护；
 *
 * 施法时间降为1.5秒
 */
class Skill5762 extends BaseHookSkillStub {

    constructor() {
        super(5762);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(1)
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(2)
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(3)
        super.Calculate4(stub, skill, originFunc);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(4)
        super.Calculate5(stub, skill, originFunc);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(5)
        super.Calculate6(stub, skill, originFunc);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar6(6)
        super.Calculate7(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetRandcurse(6, 0.5, 0.5, 4100);

        let d = 0
        if (player.GetVar1() == 1) {
            d = player.GetVar2();
        }

        player.SetSleep(d, 2000, 0);

        if (player.GetVar6() == 4) {
            const ta = skill.GetLevel() * 5000.0;
            player.SetDisableBless(120, ta);
        }

        //每一击可降低目标气血上限8%，持续10秒，降血状态可叠加6次
        player.SetSubhp2(120, player.GetMaxhp() * 0.08, 6, 10000)
        return true
    }
}

export class TianYinSkillList {
    constructor() {
        new Skill276()
        new Skill283()
        new Skill275()
        new Skill319()
        new Skill285()
        new Skill386()
        new Skill550()
        new Skill553()
        new Skill277()
        new Skill549()
        new Skill273()
        // new Skill554()
        new SiDaJieKong()
        new Skill280()
        new Skill284()
        new Skill677()
        new Skill1541()
        new Skill1542()
        new Skill1593()
        new Skill2070()
        new Skill2071()
        new Skill1594()
        new Skill1592()
        new Skill2061()
        new Skill2060()
        new Skill2050()
        new Skill3025()
        new Skill3073()
        new Skill3121()
        new Skill3026()
        new Skill3074()
        new Skill3122()
        new TianWaiFoGuang()
        new Skill3027()
        new Skill3075()
        new Skill3123()
        new Skill5845()
        new Skill5846()
        new Skill5848()
        new Skill6826()
        new Skill396()
        new Skill5761()
        new Skill5762()
        new PoMoGaLan()
    }
}