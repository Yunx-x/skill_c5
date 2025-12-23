import {Skill} from "../base/skill/Skill";
import {norm, zrand} from "../base/ConstFunc";
import {BaseHookSkillStub} from "../base/skill/BaseHookSkillStub";
import {QuickCoolDownList} from "../base/skill/QuickSkillUtil";

/**
 * 3467 寸地诀
 * 冷却时间减少10秒；移动速度每级0.8m/s；额外解除自身2个不利状态
 *
 * 6943玄烛·寸地决·曦日：
 * 令寸地诀60%概率瞬间冷却
 * 技能达到5级时，减少纵横令II的冷却时间10秒
 */
class Skill3467 extends BaseHookSkillStub {

    constructor() {
        super(3467);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6943) > 0) {
            const r = zrand(100)
            if (r >= 40) {
                return 0
            }
        }

        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const skillLevel = player.GetSkilllevel(6941);
        const starLvl = player.GetSkilllevel(6942) + skillLevel;
        const starLvlSum = starLvl + player.GetSkilllevel(6943);

        if (starLvlSum > 0) {
            let chance = 20;

            if (player.GetSkilllevel(6942) > 0) {
                chance = 25;
            }

            if (player.GetSkilllevel(6943) > 0) {
                chance = 30;
            }

            player.SetDelaycast(chance, 100, 7079, 1, 7);
        }

        const v16 = 3000 * skill.GetLevel();
        const da = v16 + 2000 * skill.GetT0() + 2000 * starLvlSum;
        const db = Math.floor(skill.GetLevel() * 0.8 + 1.0);
        const adjustedDb = Math.floor(skill.GetT0() * 0.2 + db);
        player.SetAddspeed(120, da, adjustedDb, 1);
        player.SetBuffClearImmune(120, 14000 + player.GetSkilllevel(3547) * 1000)
        return true
    }

}

/**
 * 3488  滔天劲
 * 施法1秒，无冷却，攻击怪物目标时攻击6次，额外附加自身气血上限10%的攻击力
 */
class Skill3488 extends BaseHookSkillStub {

    constructor() {
        super(3488);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v2 = 20 * skill.GetLevel() + 450;
        const Level = skill.GetLevel();
        const v5 = (v2 + 10 * skill.GetLevel() * Level);
        skill.SetPlus(v5);
        const v6 = skill.GetLevel() * 0.03;
        skill.SetRatio(v6);
        const v7 = skill.GetT0() * 0.04;
        skill.SetCrit(v7);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
            player.SetPerform(0);
        }
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v2 = 20 * skill.GetLevel() + 450;
        const Level = skill.GetLevel();
        const v5 = (v2 + 10 * skill.GetLevel() * Level);
        skill.SetPlus(v5);
        const v6 = skill.GetLevel() * 0.03;
        skill.SetRatio(v6);
        const v7 = skill.GetT0() * 0.04;
        skill.SetCrit(v7);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
            player.SetPerform(0);
        }
    }

}

/**
 * 3475  空行
 * 冷却时间减少25秒，新增令自身8秒内100%几率无视单体攻击
 */
class Skill3475 extends BaseHookSkillStub {

    constructor() {
        super(3475);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

    // StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
    //     super.StateAttack(stub, skill, originFunc);
    //     const player = skill.GetPlayerNice()
    //     player.SetSingleTargetImmune(100, 8000)
    //     return true
    // }
}

/**
 * 3485  天脉者
 * 1秒施法，冷却固定50秒
 * 23秒神佑效果，免疫次数60次，前10秒处于无敌状态；
 * 14秒内保护自身所有有利状态不被清除
 * 天书-睥睨：删除原有效果，修改为每级增加天脉者保护自身有利状态1秒
 */
class Skill3485 extends BaseHookSkillStub {

    constructor() {
        super(3485);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 750
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetBlessed(60, 23000)
        player.SetInvincible(10000)
        // player.SetBuffClearImmune(120, 14000 + skill.GetT0() * 1000)
        return true
    }
}

/**
 * 3502  伏羲魂
 * 伏羲魂：冷却减少45秒，施法1秒
 */
class Skill3502 extends BaseHookSkillStub {

    constructor() {
        super(3502);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 45000;
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

}

/**
 * 3476  天罡正觉·形
 *
 */
class Skill3476 extends BaseHookSkillStub {

    constructor() {
        super(3476);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

}

/**
 * 3490  星河陨
 * 触发阴阳劫的概率提升至100%
 */
class Skill3490 extends BaseHookSkillStub {

    constructor() {
        super(3490);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetTriggerskill(120, 15000, 3706, player.GetSkilllevel(3852) + skill.GetLevel());

        player.SetSetcooldown(-1, 3706, 0, 0, 10);
        return true
    }


}

/**
 * 3477  地煞狂灵·形
 * 冷却90秒，去除增加技能施法时间的效果
 *
 * 3745玄武经II：被动加强地煞狂灵·形，气血上限增加至210%（不计算天书百炼的加成，天书加成额外计算）
 */
class Skill3477 extends BaseHookSkillStub {

    constructor() {
        super(3477);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        const level = skill.GetLevel();
        const v4 = 5000 * (level + skill.GetT1());
        const t = v4 + 3000 * skill.GetT2();

        const ta = level * 0.05 + 1.0;

        const xwj2 = skill.GetT2() * 6
        const v7 = 300 * level;
        let v8 = 200 * skill.GetT0() + v7;

        if (player.GetCultivation() == 1) {
            v8 += xwj2
        }

        const tb = level * 0.2;
        let amount = skill.GetT0() * 0.1 + tb;

        // Skill5874 碧海使用地煞狂灵类技能可额外提升最大攻击力15%*level
        const bh = player.GetSkilllevel(5874)
        if (bh > 0) {
            amount += 0.15 * bh
        }

        player.SetGuishen1(120, t, ta, amount, 0, v8);

        const v14 = player.GetVar1() <= 950 ? 0 : 111;

        const td = player.GetMaxhp();

        player.SetHeal(v14, td, 0);

        const te = 120 * skill.GetT1();
        player.SetDecfatalhurt(te, 0.2, 12000, 1);
        return true
    }

}

/**
 * 3487  地煞狂灵·神
 * 冷却90秒，去除增加技能施法时间的效果
 */
class Skill3487 extends BaseHookSkillStub {

    constructor() {
        super(3487);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        const level = skill.GetLevel();
        const v4 = 5000 * (level + skill.GetT1());
        const t = v4 + 3000 * skill.GetT3();

        const ta = Math.floor(level * 0.05 + 1.0);

        const v7 = 30 * level;
        const v8 = 20 * skill.GetT0() + v7;

        const tb = Math.floor(level * 0.02);
        let adjustedTb = Math.floor(skill.GetT0() * 0.015 + tb);

        // Skill5874 碧海使用地煞狂灵类技能可额外提升最大攻击力15%*level
        const bh = player.GetSkilllevel(5874)
        if (bh > 0) {
            adjustedTb += 0.15 * bh
        }

        player.SetGuishen2(120, t, ta, adjustedTb, 0, v8);

        const v13 = skill.GetT2() ? 111 : 0;

        const v16 = 5000 * (level + skill.GetT1());
        const td = v16 + 3000 * skill.GetT3();

        const te = Math.floor(skill.GetT2() * 0.05);

        player.SetInccrithurt(v13, te, td, 1);

        const v21 = skill.GetT2() ? 111 : 0;

        const v24 = 5000 * (level + skill.GetT1());
        const tf = v24 + 3000 * skill.GetT3();

        const tg = Math.floor(skill.GetT2() * 0.01);

        player.SetIncskillaccu(v21, tg, tf, 1);

        const th = 120 * skill.GetT1();
        player.SetDecfatalhurt(th, 0.2, 12000, 1);
        return true
    }

}

/**
 * 3466  纵横令
 * 冷却25秒，并令自身3秒内处于真无敌状态；
 * 额外魅惑目标4秒，魅惑能力为自身魅抗；
 *
 * 天书-天策：附加的爆伤时间10秒；
 */
class Skill3466 extends BaseHookSkillStub {

    constructor() {
        super(3466);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const d = Math.floor(50 * skill.GetT0());
        const da = Math.floor(skill.GetT0() * 0.2);
        player.SetInccrithurt(d, da, 10000, 1);

        // player.SetInvincible(3000)
        return true
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetSilenceRes())
        super.Calculate1(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSilent(player.GetVar1(), 4000)
        return true
    }

}

/**
 * 3484  闪神诀
 * 冷却调整为60秒
 */
class Skill3484 extends BaseHookSkillStub {

    constructor() {
        super(3484);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

}

/**
 * 3483  亢龙击
 * 新增：减少目标6%减免百分比，减少目标10%御属性，持续12秒
 *
 * 6937玄烛·亢龙击·曦日：定身能力调整为30%，黑屏时间调整为10秒
 * 技能达到5级时，天罡正觉·神III额外增加减暴击5%
 */
class Skill3483 extends BaseHookSkillStub {

    constructor() {
        super(3483);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        let bon = 0.0;
        const player = skill.GetPlayerNice();
        const Var2 = player.GetVar2();
        const v5 = player.GetVar3() + Var2;
        const star_lvl = v5 + player.GetVar4();

        if (star_lvl) {
            bon = player.GetVar1() * 0.05;

            if (player.GetVar3() > 0) {
                bon = player.GetVar1() * 0.1;
            }

            if (player.GetVar4() > 0) {
                bon = player.GetVar1() * 0.3;
            }

            const t = 2000 * star_lvl + 100;
            player.SetDarkness(120, t);
        }

        const ta = player.GetVar1() * 0.2;
        const tb = skill.GetLevel() * ta;
        let tc = 10 * skill.GetLevel() + tb;
        tc = 5 * skill.GetT0() + tc + bon;

        const tcValue = 1000 * skill.GetLevel();
        player.SetWrap(tc, tcValue);

        player.SetFlamecurse(120, 12000, 0.06, 1)
        player.SetDecCultRes(120, 20000, 0.1, 0, 0)
        player.SetDecCultRes(120, 20000, 0.1, 1, 1)
        player.SetDecCultRes(120, 20000, 0.1, 2, 2)
        return true
    }

}

/**
 * 3496  玄魂甲
 * 施法1秒
 */
class Skill3496 extends BaseHookSkillStub {

    constructor() {
        super(3496);
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

}

/**
 * 3470  杀破狼
 * 魅惑时间延长为6秒，冷却降至10秒
 */
class Skill3470 extends BaseHookSkillStub {

    constructor() {
        super(3470);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = player.GetVar2();
        const v10 = Math.floor(player.GetVar1() * 0.1);
        const v11 = Math.floor(skill.GetLevel() * v10);
        const v9 = Math.floor(player.GetVar1() * 0.05);
        const v12 = Math.floor(skill.GetT0() * v9 + v11);
        const v13 = Math.floor(5 * skill.GetLevel() + v12);
        const v14 = Math.floor(2 * skill.GetT2() + v13);
        const calculatedD = Math.floor((2 * skill.GetT3() + v14) * d);

        const timeD = Math.floor(600 * (skill.GetLevel() + 1));
        player.SetSilent(calculatedD, timeD);
        return true

    }

}

/**
 * 3742  鬼阎罗II
 * 冷却固定20秒
 */
class Skill3742 extends BaseHookSkillStub {

    constructor() {
        super(3742);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 20000
    }

}

/**
 * 3807  天脉者II
 * 增加技能躲闪调整为7*level点，冷却固定55秒；新增20秒内减免受到的伤害50%
 */
class Skill3807 extends BaseHookSkillStub {

    constructor() {
        super(3807);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 55000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let t = (1000 * skill.GetLevel() + 5000);
        let ta = skill.GetLevel() * 0.07;
        player.SetIncskilldodge(120, ta, t, 1);
        player.SetDecdamage(120, 0.5, 20000);
        return true
    }

}

/**
 * 3806  闪神诀II
 * 冷却时间60秒；诅咒成功率，优化为与自身魅抗有关。
 */
class Skill3806 extends BaseHookSkillStub {

    constructor() {
        super(3806);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res3 = player.GetSilenceRes()
        player.SetVar1(res3);

        const level = skill.GetLevel();
        const v5 = 6 * level + 253;
        const v8 = v5 + 10 * level * level;
        skill.SetPlus(v8);

        const v9 = level * 0.01 + 1.01;
        skill.SetRatio(v9);

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const var1 = player.GetVar1();
        const res3 = player.GetSilenceRes();

        let v8;
        if (var1 - res3 <= 0) {
            v8 = 0.0;
        } else {
            v8 = var1 - res3;
        }

        const level = Math.floor(skill.GetLevel() * 0.08);
        player.SetParalysis(v8, 15000, level, level);
        player.SetCrippleddebuff(-1, 8000, level);
        return true
    }

}

/**
 * 3814  山海经II
 * 增加技能命中10点；增加天罡正觉·神效果持续时间30秒（本来就是）；
 */
class Skill3814 extends BaseHookSkillStub {

    constructor() {
        super(3814);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetPasincskillaccu(skill.GetLevel() * 10 + 10)
        return true
    }

}

/**
 * 3741  杀破狼II
 * 1秒施法，无冷却，附加气血伤害调整为2%*level
 */
class Skill3741 extends BaseHookSkillStub {

    constructor() {
        super(3741);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);

        const level = skill.GetLevel();
        const v6 = level * 0.02 + 1.0;
        skill.SetRatio(v6);

        const v5 = level * 0.02;
        const hp = player.GetHp();
        const v7 = hp * v5;
        skill.SetPlus(v7);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v6 = level * 0.02 + 1.0;
        skill.SetRatio(v6);

        const v5 = level * 0.02;
        const hp = player.GetHp();
        const v7 = hp * v5;
        skill.SetPlus(v7);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v6 = level * 0.02 + 1.0;
        skill.SetRatio(v6);

        const v5 = level * 0.02;
        const hp = player.GetHp();
        const v7 = hp * v5;
        skill.SetPlus(v7);

        player.SetPerform(0);
    }

}

/**
 * 3812  纵横令II
 * 眩晕4秒；100%清除纵横令冷却；冷却减少10秒
 * 6943玄烛·寸地决·曦日：
 * 令寸地诀60%概率瞬间冷却
 * 技能达到5级时，减少纵横令II的冷却时间10秒
 */
class Skill3812 extends BaseHookSkillStub {

    constructor() {
        super(3812);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        let t = 0
        if (player.GetSkilllevel(6943) >= 5) {
            t = 10000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - 10000 - t;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetClearcooldown(3466, 0, 0)
        return true
    }

}

/**
 * 3813  亢龙击II
 * 100%概率冰冻目标，持续时间+2秒，冷却25秒
 */
class Skill3813 extends BaseHookSkillStub {

    constructor() {
        super(3813);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFrozen(120, 4000, 0, 1);

        const v21 = skill.GetLevel() * 0.05;
        player.SetSlow(-1, v21, 6000, 1);
        return true
    }

}

/**
 * 3584 伏羲魂<玄>
 * 伏羲魂<玄><煞><禅>：施法1秒，冷却减少45秒；
 * 令自身技能伤害增加25%，持续40秒。
 * <玄>：额外免疫群攻技能15秒，免疫嘲讽15秒
 * <煞>：额外增加技能命中80点15秒
 * <禅>：额外增加免疫不利状态15秒
 */
class Skill3584 extends BaseHookSkillStub {

    constructor() {
        super(3584);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 45000;
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetIncskilldamage(0.25, 40000, 1)
        player.SetAoEImmune(120, 15000)
        player.SetImmunetaune(120, 15000)
        player.SetSingleTargetImmune(100, 8000,1.0)
        return true
    }
}

/**
 * 3590
 * <煞>：附加的技能命中80点
 */
class Skill3590 extends BaseHookSkillStub {

    constructor() {
        super(3590);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 45000;
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetIncskilldamage(0.25, 40000, 1)
        player.SetIncskillaccu(120, 0.8, 15000, 1)
        player.SetSingleTargetImmune(100, 8000,1.0)
        return true
    }
}

/**
 * 3594
 * <禅>：额外增加免疫不利状态15秒
 */
class Skill3594 extends BaseHookSkillStub {

    constructor() {
        super(3594);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 45000;
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetIncskilldamage(0.25, 40000, 1)
        player.SetTurndebuff(15000, 0, 1)
        player.SetSingleTargetImmune(100, 8000,1.0)
        return true
    }
}

/**
 * 3574  乾坤荡<玄>
 * 乾坤荡<玄><煞><禅>：施法2秒，冷却2秒；
 * 100%几率触发天地绝<玄><煞><禅>，持续30秒；
 * 每段附加的本体攻击力额外提升60%，并额外追加当前气血10%的伤害；
 */
class Skill3574 extends BaseHookSkillStub {

    constructor() {
        super(3574);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetTriggerskill(120, 30000, 3857, skill.GetLevel());
        player.SetSetcooldown(-1, 3857, 0, 0, 10);
        return true
    }
}

/**
 * 3588
 *
 */
class Skill3588 extends BaseHookSkillStub {

    constructor() {
        super(3588);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetTriggerskill(120, 30000, 3858, skill.GetLevel());
        player.SetSetcooldown(-1, 3858, 0, 0, 10);
        return true
    }
}

/**
 * 3592
 *
 */
class Skill3592 extends BaseHookSkillStub {

    constructor() {
        super(3592);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const crit = level * 0.01;
        skill.SetCrit(crit);

        const crithurt = level * 0.03;
        skill.SetCrithurt(crithurt);

        const ratio = level * 0.02 + 1.6;
        skill.SetRatio(ratio);

        const v3 = 60 * level;
        const v4 = 5 * level;
        const v6 = v3 + v4 * level + 55;
        skill.SetPlus(v6 + player.GetHp() * 0.1);

        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetTriggerskill(120, 30000, 3859, skill.GetLevel() + Math.floor(skill.GetLevel() / 19.99) * 5);
        player.SetSetcooldown(-1, 3859, 0, 0, 10);
        return true
    }
}

/**
 * 3857  天地绝<玄>
 * 天地绝<玄><煞><禅>：攻击10段，施法3秒，冷却减少8秒；优化施法
 * 每段附加的本体攻击力额外提升50%，额外附加自身气血上限10%的攻击力，
 * 攻击怪物目标时，无冷却；每击额外附加自身气血上限10%的攻击力
 * 第一击令目标致盲3秒；攻击玩家时40%几率清除自身冷却
 * <玄>：第一击降低目标御仙10%点，持续10秒，
 * <煞>：第一击降低目标御魔10%点，持续10秒
 * <禅>：100%几率清除自身冷却
 */
class Skill3857 extends BaseHookSkillStub {

    constructor() {
        super(3857);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            const r = zrand(100)
            if (r <= 45) {
                return 0
            } else {
                return super.GetCooldowntime(stub, skill, originFunc) - 8000;
            }
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 350
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    // BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
    //     const player = skill.GetPlayerNice();
    //     const v3 = player.GetVar1() == 1 ? 120 : 0;
    //     const t = 1000 * skill.GetLevel() + 10000;
    //     const ta = skill.GetLevel() * 0.01;
    //     player.SetBloodthirsty(v3, t, ta, 1);
    //     return true
    // }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        //<玄>：第一击降低目标御仙10%点，持续10秒，
        const player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            player.SetDecCultRes(120, 10000, 0.1, 2, 2)
        }
        return true
    }

}

/**
 * 3858
 * <煞>：第一击降低目标御魔10%点，持续10秒
 */
class Skill3858 extends BaseHookSkillStub {

    constructor() {
        super(3858);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            const r = zrand(100)
            if (r <= 45) {
                return 0
            } else {
                return super.GetCooldowntime(stub, skill, originFunc) - 8000;
            }
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 350
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            player.SetDecCultRes(120, 10000, 0.1, 0, 0)
        }
        return true
    }

}

/**
 * 3859
 * <禅>：100%几率清除自身冷却
 */
class Skill3859 extends BaseHookSkillStub {

    constructor() {
        super(3859);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 350
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);

        const level = skill.GetLevel();
        const v9 = level * 0.08 + 1.7;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;
        skill.SetRatio(v10);

        const v11 = level * 0.05;
        skill.SetCrithurt(v11);

        const v4 = 15 * level + 850;
        const v5 = 4 * level;
        const v7 = v4 + v5 * level;
        skill.SetPlus(v7 + player.GetMaxhp() * 0.1);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }
}

/**
 * 3573  三生判<玄>
 * 三生判<玄><煞><禅> ： 冷却时间5秒
 * <煞>：麻痹成功率调整为与魅抗相关
 * <禅>：禁食成功率调整为与魅抗相关，且不需要目标有加速状态
 */
class Skill3573 extends BaseHookSkillStub {

    constructor() {
        super(3573);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 5000
    }

}

/**
 * 3587
 * 三生判<玄><煞><禅> ： 冷却时间5秒
 * <煞>：麻痹成功率调整为与魅抗相关
 */
class Skill3587 extends BaseHookSkillStub {

    constructor() {
        super(3587);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 5000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res1 = player.GetSilenceRes();
        player.SetVar1(res1);

        const level = skill.GetLevel();
        const v10 = level * 0.05 + 1.35;
        const v9 = norm(level / 14.9) * 0.03;
        const v11 = (level - 15) * v9 + v10;
        skill.SetRatio(v11);

        const v6 = 5 * level;
        const v8 = v6 * level + 180;
        skill.SetPlus(v8);

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const t = 1000 * skill.GetLevel();
        const ta = (skill.GetLevel() + 5) * 0.01;
        player.SetDecskilldamage(ta, t, 0);

        const tb = 3 * skill.GetLevel();
        const level = skill.GetLevel();
        const tc = Math.floor(level / 5) + 1;
        player.SetClearbuff(tb, tc);

        const var1 = player.GetVar1();
        const res1 = player.GetSilenceRes();

        let td;
        if (var1 - res1 <= 0) {
            const v36 = skill.GetLevel();
            td = 20 * norm(v36 / 19.99);
        } else {
            const v16 = var1 - res1;
            const v35 = skill.GetLevel();
            td = v16 + 20 * norm(v35 / 19.99);
        }

        const v20 = 1000 * Math.floor(level / 5) + 2000;
        const te = v20 + 5000 * norm(level / 19.99);

        const tf = level * 0.03 + 0.2;

        const tg = level * 0.03 + 0.2;

        player.SetParalysis(td, te, tf, tg);
        return true
    }
}

/**
 * 3583
 * 三生判<玄><煞><禅> ： 冷却时间5秒
 * <禅>：禁食成功率调整为与魅抗相关，且不需要目标有加速状态
 */
class Skill3583 extends BaseHookSkillStub {

    constructor() {
        super(3583);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 5000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res1 = player.GetSilenceRes();
        player.SetVar1(res1);

        const level = skill.GetLevel();
        const v10 = level * 0.05 + 1.35;
        const v9 = norm(level / 14.9) * 0.03;
        const v11 = (level - 15) * v9 + v10;
        skill.SetRatio(v11);

        const v6 = 5 * level;
        const v8 = v6 * level + 180;
        skill.SetPlus(v8);

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const t = 1000 * skill.GetLevel();
        const ta = (skill.GetLevel() + 5) * 0.01;
        player.SetDecskilldamage(ta, t, 0);

        let v14 = 0
        const var1 = player.GetVar1();
        const res3 = player.GetSilenceRes();

        if (var1 - res3 <= 0) {
            v14 = 0.0;
        } else {
            v14 = var1 - res3;
        }
        const tb = skill.GetLevel();
        player.SetDelaycast(v14, 100, 3593, tb, 1);

        const tc = 3 * skill.GetLevel();
        const level = skill.GetLevel();
        const td = Math.floor(level / 5) + 1;
        player.SetClearbuff(tc, td);
        return true
    }
}

/**
 * 3585  鬼神气<玄>
 * 额外令目标进入寂然状态30秒，且清除目标必暴状态
 */
class Skill3585 extends BaseHookSkillStub {

    constructor() {
        super(3585);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetDisableCrit(120, 30000, 0)
        return true
    }

}

/**
 * 3591  鬼神气<煞>
 * 诅咒成功率调整为与魅抗相关
 */
class Skill3591 extends BaseHookSkillStub {

    constructor() {
        super(3591);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(player.GetSilenceRes())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let Var1 = player.GetVar1();

        let v8 = 0
        if (Var1 - player.GetRes1() <= 0) {
            v8 = 0.0;
        } else {
            v8 = (Var1 - player.GetSilenceRes());
        }

        const t = (1000 * skill.GetLevel() + 5000);
        const ta = Math.floor(skill.GetLevel() * 0.05);
        player.SetGuishen2(v8, t, 1.0, 0, ta, 0);

        const tb = (1000 * (skill.GetLevel() / 4) + 3000);
        const tc = skill.GetLevel();
        player.SetCrippleddebuff(-1, tb, tc);

        const td = (1000 * skill.GetLevel() + 2000);
        const te = (skill.GetLevel() + 3);
        const tf = player.GetVar1();
        const v27 = Math.floor(skill.GetLevel() * 0.05);
        const Level = skill.GetLevel();
        const vvv = ((norm(Level / 19.99) * 0.2 + v27) * tf);

        player.SetCursed(vvv, te, td);
        return true
    }
}

/**
 * 3595  鬼神气<禅>
 * 诅咒成功率调整为与魅抗相关
 */
class Skill3595 extends BaseHookSkillStub {

    constructor() {
        super(3595);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(player.GetSilenceRes())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let Var1 = player.GetVar1();

        let v8 = 0
        if (Var1 - player.GetRes1() <= 0) {
            v8 = 0.0;
        } else {
            v8 = (Var1 - player.GetSilenceRes());
        }

        const t = (1000 * skill.GetLevel() + 5000);
        const ta = Math.floor(skill.GetLevel() * 0.05);
        player.SetGuishen2(v8, t, 1.0, 0, ta, 0);

        const tb = (1000 * (skill.GetLevel() / 4) + 3000);
        const tc = skill.GetLevel();
        player.SetCrippleddebuff(-1, tb, tc);

        const v21 = 1000 * skill.GetLevel() + 3000;
        const Level = skill.GetLevel();
        const td = v21 + 10000 * norm(Level / 19.99);
        const v24 = skill.GetLevel();
        const te = Math.floor(v24 / 2) * 0.01 + 0.01;
        player.SetDeccritrate(-1, te, td,1);
        return true
    }
}

/**
 * 5787  天地绝III 《天空》
 * 天地绝《天空》《碧海》《英雄》
 * 天地绝III：施法3秒，攻击10段，优化施法。
 * 每击额外附加自身气血上限10%的攻击力，攻击怪物目标时每击额外附加自身气血上限15%的攻击力
 * 第一拳令目标致盲黑屏5秒；
 * 若目标为怪物，60%概率清除此技能冷却
 */
class Skill5787 extends BaseHookSkillStub {

    constructor() {
        super(5787);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsPlayer()) {
            const r = zrand(100)
            if (r > 40) {
                return 0
            } else {
                return super.GetCooldowntime(stub, skill, originFunc);
            }
        }

        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 350
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);
        player.SetVar3(0);
        player.SetVar4(0);
        const v10 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v12);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(1);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(2);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(3);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(1);
        player.SetVar4(4);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetDarkness2(120, 5000)
        }
        return true
    }
}

/**
 * 5788  碧海
 *
 */
class Skill5788 extends BaseHookSkillStub {

    constructor() {
        super(5788);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsPlayer()) {
            const r = zrand(100)
            if (r > 40) {
                return 0
            } else {
                return super.GetCooldowntime(stub, skill, originFunc);
            }
        }

        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 350
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);
        player.SetVar3(0);
        player.SetVar4(0);
        const v10 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v12);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(1);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(2);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(3);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(1);
        player.SetVar4(4);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetDarkness2(120, 5000)
        }
        return true
    }
}

/**
 * 5789  大地
 */
class Skill5789 extends BaseHookSkillStub {

    constructor() {
        super(5789);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsPlayer()) {
            const r = zrand(100)
            if (r > 40) {
                return 0
            } else {
                return super.GetCooldowntime(stub, skill, originFunc);
            }
        }

        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 350
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        player.SetVar2(1);
        player.SetVar4(0);
        const v10 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v12);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(2);
        player.SetVar2(1);
        player.SetVar4(1);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(3);
        player.SetVar2(1);
        player.SetVar4(2);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(4);
        player.SetVar2(1);
        player.SetVar4(3);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(5);
        player.SetVar2(2);
        player.SetVar4(4);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetDarkness2(120, 5000)
        }
        return true
    }
}

/**
 * 5790
 *
 */
class Skill5790 extends BaseHookSkillStub {

    constructor() {
        super(5790);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsPlayer()) {
            const r = zrand(100)
            if (r > 40) {
                return 0
            } else {
                return super.GetCooldowntime(stub, skill, originFunc);
            }
        }

        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 350
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 330
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);
        player.SetVar3(0);
        player.SetVar4(0);
        const v10 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v12);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(1);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(2);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(0);
        player.SetVar4(3);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        player.SetVar2(0);
        player.SetVar3(1);
        player.SetVar4(4);
        const v8 = (1000 * skill.GetLevel() + 3000);
        //额外附加自身气血上限10%的攻击力
        skill.SetPlus(v8 + player.GetMaxhp() * 0.1);
        const v10 = (5 * skill.GetLevel() + 10) * 0.01 + 4.25;
        skill.SetRatio(v10);
        const v11 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v11);
        const v12 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v12);
        const Level = skill.GetLevel();
        const v9 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v9);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.15)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetDarkness2(120, 5000)
        }
        return true
    }
}

/**
 * 5873  天罡正觉·神III
 * 新增令自身10秒内无视群体攻击；减免暴击率调整为25%
 * 海：施法者为仙阵营时，使用地煞狂灵类技能可额外提升最大攻击力15%*level
 * 地：降低冷却时间15秒
 * 雄：降低冷却时间10秒，增加技能躲闪80点
 */
class Skill5873 extends BaseHookSkillStub {

    constructor() {
        super(5873);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetSkilllevel(6937))
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        // 6937玄烛·亢龙击·曦日：技能达到5级时，天罡正觉·神III额外增加减暴击5%

        let anti = 250
        if (player.GetVar1() >= 5) {
            anti += 50
        }

        player.SetTuoling2(120, 45100, 0.5, 0.0, 0.5, anti);

        player.SetDecfatalhurt(100, 0.3, 45100, 1);

        player.SetIncskilldodge(100, 0.1, 45100, 1);

        player.SetInccrithurt(100, 0.2, 12100, 4);
        player.SetAoEImmune(120, 10000)
        return true
    }

}

/**
 * 5875
 * 地：降低冷却时间15秒
 */
class Skill5875 extends BaseHookSkillStub {

    constructor() {
        super(5875);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        // 6937玄烛·亢龙击·曦日：技能达到5级时，天罡正觉·神III额外增加减暴击5%

        let anti = 250
        if (player.GetVar1() >= 5) {
            anti += 50
        }

        player.SetTuoling2(120, 45100, 0.5, 0.0, 0.5, anti);

        player.SetDecfatalhurt(100, 0.3, 45100, 1);

        player.SetIncskilldodge(100, 0.1, 45100, 1);

        player.SetInccrithurt(100, 0.2, 12100, 4);
        player.SetAoEImmune(120, 10000)
        return true
    }
}

/**
 * 5876
 * 雄：降低冷却时间10秒，增加技能躲闪80点
 */
class Skill5876 extends BaseHookSkillStub {

    constructor() {
        super(5876);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        // 6937玄烛·亢龙击·曦日：技能达到5级时，天罡正觉·神III额外增加减暴击5%

        let anti = 250
        if (player.GetVar1() >= 5) {
            anti += 50
        }

        player.SetTuoling2(120, 45100, 0.5, 0.0, 0.5, anti);

        player.SetDecfatalhurt(100, 0.3, 45100, 1);

        player.SetIncskilldodge(100, 0.9, 45100, 1);

        player.SetInccrithurt(100, 0.2, 12100, 4);
        player.SetAoEImmune(120, 10000)
        return true
    }
}

/**
 * 6934 赤乌·玄魂甲·曦日
 * 冷却减少10秒。
 * 新增效果：
 * 攻击、气血、真气增加10%，持续15秒；
 * 免疫降低自身气血、真气。
 * 同时降低自身减免伤害5%
 */
class Skill6934 extends BaseHookSkillStub {

    constructor() {
        super(6934);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetFlamecurse(120, 15000, 0.05, 1)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetAoshi(120, 0.2, 0.0, 0.0, 20000, 1);
        player.SetInccrithurt(120, 0.12 * skill.GetLevel(), 20000, 4)
        player.SetRedImmunity(120, 15000)
        player.SetBlueImmunity(120, 15000)
        return true
    }

}

/**
 * 3463  醉乾坤
 * 玄烛·醉乾坤·曦日：令目标18秒内抗性分散，100%驱散目标气血增益、真气增益状态
 */
class Skill3463 extends BaseHookSkillStub {

    constructor() {
        super(3463);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Var2 = player.GetVar2();
        const v5 = player.GetVar3() + Var2;
        const star_lvl = v5 + player.GetVar4();

        if (star_lvl) {
            let dur = 6000;

            if (player.GetVar3() > 0) {
                dur = 12000;
            }

            if (player.GetVar4() > 0) {
                dur = 18000;
            }

            const t = dur + 100;
            player.SetDisperseanti(0.05, t);

            const ta = 10 * (star_lvl + 5);
            player.SetDispel(ta, 4125, 4127, 30);
            player.SetDispel(ta, 8, 10, 17);
            player.SetDispel(ta, 18, 19, 20);
            player.SetDispel(ta, 21, 22, 23);

        }

        const v32 = 3 * skill.GetLevel();
        const tb = v32 + 5 * skill.GetT0();

        const tc = 1000 * skill.GetLevel() + 5000;

        const td = skill.GetLevel() * 0.03;

        const te = skill.GetLevel() * 0.03;

        player.SetParalysis(tb, tc, td, te);
        return true
    }

}

class LinXuanBingJian extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            3833, 3837, 3841, 3845, 3849, 4632,//临玄
            3834, 3838, 3842, 3846, 3850, 4633//兵鉴
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

}

class DouHunWuZhe extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            3835, 3839, 3843, 3847, 3851, 4634,//斗魂
            3836, 3840, 3844, 3848, 3852, 4635//武者
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }
}

/**
 * ## 太昊
 */
export class TaiHaoSkillList {
    constructor() {
        new Skill3467()
        new Skill3488()
        new Skill3475()
        new Skill3485()
        new Skill3502()
        new Skill3476()
        new Skill3490()
        new Skill3477()
        new Skill3487()
        new Skill3466()
        new Skill3484()
        new Skill3483()
        new Skill3496()
        new Skill3470()
        new Skill3742()
        new Skill3807()
        new Skill3806()
        new Skill3814()
        new Skill3741()
        new Skill3812()
        new Skill3813()
        new Skill3584()
        new Skill3590()
        new Skill3594()
        new Skill3574()
        new Skill3588()
        new Skill3592()
        new Skill3857()
        new Skill3858()
        new Skill3859()
        new Skill3573()
        new Skill3587()
        new Skill3583()
        new Skill3585()
        new Skill3591()
        new Skill3595()
        new Skill5787()
        new Skill5788()
        new Skill5789()
        new Skill5790()
        new Skill5873()
        new Skill5875()
        new Skill5876()
        new Skill6934()
        new Skill3463()
        new LinXuanBingJian()
        new DouHunWuZhe()
    }
}