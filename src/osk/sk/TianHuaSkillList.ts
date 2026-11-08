import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 2470  鸣泉雅韵
 * 额外令周围队友增加攻击力2%*level,且每5万真气额外增加1%,增加攻击百分比的效果调整为可与其他职业的相叠加
 */
class Skill2470 extends BaseHookSkillStub {

    constructor() {
        super(2470);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(Math.floor(player.GetMaxmp() / 50000))
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncattack(120, 1800000, 0.02 * skill.GetLevel() + player.GetVar1() * 0.01, 7)
        return true
    }

}

/**
 * 2465  行云流水
 * 基础冷却50秒
 */
class Skill2465 extends BaseHookSkillStub {

    constructor() {
        super(2465);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return -10000 * skill.GetT1() + 50000;
    }

}

/**
 * 2495  秋声雅韵
 * 新增效果:增加目标 5%*level 点致命一击率、12%*level 点致命一击伤害和 4*level 点技能命中，技能伤害增加12%*level,持续时间原版
 *
 * 【玄烛·听霜雅韵·曦日】新增效果：技能达 5 级时，秋声雅韵额外增加目标致命一击伤害数值:自身每10万真气上限额外增加1%
 *
 * 玄烛·琼台雅韵·莹炬/皓月/曦日 新增效果：降低秋声雅韵技能冷却时间4/7/10*level 秒。
 * 曦日
 * 100%激活技能镜
 * 技能5级时，增加秋声雅韵所有增益效果持续时间10秒
 */
class Skill2495 extends BaseHookSkillStub {

    constructor() {
        super(2495);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetVictimNice();
        const yj = player.GetSkilllevel(6911)
        const hy = player.GetSkilllevel(6912)
        const xr = player.GetSkilllevel(6913)

        let tunit = 0
        if (yj > 0) {
            tunit = 4000 * yj
        }

        if (hy > 0) {
            tunit = 7000 * hy
        }

        if (xr > 0) {
            tunit = 10000 * xr
        }

        return super.GetCooldowntime(stub, skill, originFunc) - tunit;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();

        player.SetVar1(player.GetSkilllevel(6919))
        player.SetVar2(player.GetMaxmp() / 100000)
        player.SetVar3(player.GetSkilllevel(6913))

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let mpCount = player.GetVar2()
        if (player.GetVar1() < 5) {
            mpCount = 0
        }

        const level = skill.GetLevel()
        const v2 = 1000 * level + 12000;
        const t = v2 + 2000 * skill.GetT0();

        let xrTime = 0
        if (player.GetVar3() >= 5) {
            xrTime = 10000
        }

        player.SetInccritrate(t + xrTime, level * 0.05, 1)
        player.SetInccrithurt(120, level * 0.12 + mpCount * 0.01, t + xrTime, 1)
        player.SetIncskillaccu(120, level * 0.04, t + xrTime, 1)
        player.SetIncskilldamage(level * 0.12, t + xrTime, 1)
        return true
    }

}

/**
 * 2500  神引：梅花三弄
 * 攻击群体目标6次，对怪物目标额外追加本体攻击调整至100%，附加自身气血上限10%攻击力，无冷却，释放1秒
 */
class Skill2500 extends BaseHookSkillStub {

    constructor() {
        super(2500);
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
        const player = skill.GetPlayerNice()

        let v17 = skill.GetJ1() * 0.01;
        let c = skill.GetT0() * 0.02 + v17;
        skill.SetCrit(c);

        let v15 = 0.15 * skill.GetT0() + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v15;
        let T3 = skill.GetT3();

        let v12;
        if (T3 < skill.GetT4()) {
            let T4 = skill.GetT4();
            if (T4 < skill.GetT5()) {
                v12 = skill.GetT5() * 0.05 + v16;
            } else {
                v12 = skill.GetT4() * 0.05 + v16;
            }
        } else {
            let v3 = skill.GetT3();
            if (v3 < skill.GetT5()) {
                v12 = skill.GetT5() * 0.05 + v16;
            } else {
                v12 = skill.GetT3() * 0.05 + v16;
            }
        }

        let ca = v12;
        skill.SetRatio(ca);

        let v5 = 50 * skill.GetLevel();
        let Level = skill.GetLevel();
        let v7 = 15 * skill.GetLevel() * Level + v5;
        let v11 = 90 * skill.GetJ0() + v7 + 800;
        skill.SetPlus(v11);

        skill.SetMobBonusDamage(player.GetMaxatk() + player.GetMaxhp() * 0.1);
        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        let v17 = skill.GetJ1() * 0.01;
        let c = skill.GetT0() * 0.02 + v17;
        skill.SetCrit(c);

        let v15 = 0.15 * skill.GetT0() + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v15;
        let T3 = skill.GetT3();

        let v12;
        if (T3 < skill.GetT4()) {
            let T4 = skill.GetT4();
            if (T4 < skill.GetT5()) {
                v12 = skill.GetT5() * 0.05 + v16;
            } else {
                v12 = skill.GetT4() * 0.05 + v16;
            }
        } else {
            let v3 = skill.GetT3();
            if (v3 < skill.GetT5()) {
                v12 = skill.GetT5() * 0.05 + v16;
            } else {
                v12 = skill.GetT3() * 0.05 + v16;
            }
        }

        let ca = v12;
        skill.SetRatio(ca);

        let v5 = 50 * skill.GetLevel();
        let Level = skill.GetLevel();
        let v7 = 15 * skill.GetLevel() * Level + v5;
        let v11 = 90 * skill.GetJ0() + v7 + 800;
        skill.SetPlus(v11);

        skill.SetMobBonusDamage(player.GetMaxatk() + player.GetMaxhp() * 0.1);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        let v17 = skill.GetJ1() * 0.01;
        let c = skill.GetT0() * 0.02 + v17;
        skill.SetCrit(c);

        let v15 = 0.15 * skill.GetT0() + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v15;
        let T3 = skill.GetT3();

        let v12;
        if (T3 < skill.GetT4()) {
            let T4 = skill.GetT4();
            if (T4 < skill.GetT5()) {
                v12 = skill.GetT5() * 0.05 + v16;
            } else {
                v12 = skill.GetT4() * 0.05 + v16;
            }
        } else {
            let v3 = skill.GetT3();
            if (v3 < skill.GetT5()) {
                v12 = skill.GetT5() * 0.05 + v16;
            } else {
                v12 = skill.GetT3() * 0.05 + v16;
            }
        }

        let ca = v12;
        skill.SetRatio(ca);

        let v5 = 50 * skill.GetLevel();
        let Level = skill.GetLevel();
        let v7 = 15 * skill.GetLevel() * Level + v5;
        let v11 = 90 * skill.GetJ0() + v7 + 800;
        skill.SetPlus(v11);

        skill.SetMobBonusDamage(player.GetMaxatk() + player.GetMaxhp() * 0.1);
        player.SetPerform(0);
        player.SetPerform(0);
    }

}

/**
 * 2488  天籁：金蛇狂舞
 * 使自身周围20米的目标免疫定身状态，令领域内的队友，抗性提升，攻击力提升，同时领域内的队友附加“余音”攻击效果，施法速度提升40%，技能伤害提升30%，持续20秒
 */
class Skill2488 extends BaseHookSkillStub {

    constructor() {
        super(2488);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const t = 2000 * skill.GetLevel() + 2000
        player.SetSwift(120, t, 0.04 * skill.GetLevel() + 0.04, 0);
        player.SetIncskilldamage(0.03 * skill.GetLevel() + 0.03, t, 2)//伤害提升
        return true
    }

}

/**
 * 2479  天籁：高山流水
 * 无冷却，队友/自身技能伤害增加2%*level，技能命中13点
 */
class Skill2479 extends BaseHookSkillStub {

    constructor() {
        super(2479);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldamage(skill.GetLevel() * 0.02, 3000, 1)
        player.SetIncskillaccu(120, 0.13, 3000, 1)
        return true
    }

}

/**
 * 2497  天籁：阳春白雪
 * 瞬间冷却，队友/自身暴击伤害增加45%，并免疫禁食
 */
class Skill2497 extends BaseHookSkillStub {

    constructor() {
        super(2497);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInccrithurt(120, 0.05 * skill.GetLevel(), 3000, 1)
        player.SetDietImmune(120, 3000)

        return true
    }

}

/**
 * 2474  天籁：平沙落雁
 * 瞬间冷却，领域范围内目标降低气血15%
 */
class Skill2474 extends BaseHookSkillStub {

    constructor() {
        super(2474);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSubhp(120, player.GetMaxhp() * 0.15, player.GetMaxhp() * 0.5, 3000, 1)
        return true
    }
}

/**
 * 2483  天籁：十面埋伏
 * 瞬间冷却，领域内敌对目标致命一击率减少10%
 */
class Skill2483 extends BaseHookSkillStub {

    constructor() {
        super(2483);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetDeccritrate(120, 0.1, 3000,1)
        return true
    }

}

/**
 * 2492  天籁：春江月夜
 * 瞬间冷却，领域范围内目标无法开启神佑，且进入寂然状态，领域内无法产生致命一击效果，并驱散目标下击必爆
 */
class Skill2492 extends BaseHookSkillStub {

    constructor() {
        super(2492);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDisableBless(120, 3000)
        player.SetDisableCrit(120, 3000, 0)
        player.SetDispel(120, 4175, 4175, 4175)
        return true
    }

}

/**
 * 2487  听霜雅韵
 * 玄烛·听霜雅韵·曦日：提升技能命中时间提高20秒，激活技能镜几率提升10%，有2%*level几率清除秋声雅韵技能冷却；令目标增加10%点克仙、克魔、克佛属性
 * 新增效果：技能达 5 级时，秋声雅韵额外增加目标致命一击伤害数值:自身每10万真气上限额外增加1%;
 */
class Skill2487 extends BaseHookSkillStub {

    constructor() {
        super(2487);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let T0 = skill.GetT0();
        let t = 6000 * norm(T0);

        let ta = skill.GetT0() * 0.05;
        ta *= player.GetMaxmp();
        player.SetHpgen(120, t, 0, ta, 0, 2);

        let t2 = skill.GetT1() + 10;
        let T1 = skill.GetT1();
        const t3 = 2000 * norm(T1) + 3000;

        let xrP = 0
        if (player.GetVar4() > 0) {
            xrP = 10
        }

        player.SetSkillmirror(t2 + xrP, t3);

        let Var2 = player.GetVar2();
        let v19 = player.GetVar3() + Var2;
        if (v19 + player.GetVar4()) {
            let xrTime = 0
            let ratio = 6;
            if (player.GetVar3() > 0)
                ratio = 12;
            if (player.GetVar4() > 0) {
                ratio = 20;
                xrTime = 20000
            }

            player.SetIncskillaccu(100, ratio, 6100 + xrTime, 6);
        }

// 被动影响听霜雅韵驱散几率调整为20%*level，令目标增加10%点克仙、克魔、克佛属性
        if (player.GetVar4() > 0) {
            const r = zrand(100)
            if (r < 20) {
                player.SetClearcooldown(2495, 2495, 2495)
            }
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        const yj = player.GetVar2()
        const hy = player.GetVar3()
        const xr = player.GetVar4()
        if ((yj + hy + xr) > 0) {
            let r = 0
            if (yj >= 5) {
                r = 0.06
            }

            if (hy >= 5) {
                r = 0.08
            }

            if (xr >= 5) {
                r = 0.1
            }

            if (r > 0) {
                player.SetDecCultRes(120, 20000, r, 0, 0)
                player.SetDecCultRes(120, 20000, r, 1, 1)
                player.SetDecCultRes(120, 20000, r, 2, 2)
            }
        }

        return true
    }

}

/**
 * 2478  青冥雅韵
 * 施法0.5秒
 */
class Skill2478 extends BaseHookSkillStub {

    constructor() {
        super(2478);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }
}

/**
 * 2716  云水雅韵II
 * 删除原有效果，新增效果： 3*level秒内提升目标气血和真气上限
 * 提升气血上限数值为自身最大攻击力的2.5倍
 * （提升气血上限效果无法与玄烛·摩诃心经·曦日被动提升气血效果叠加），
 * 提升真气上限数值为自身最大攻击力的5倍
 * 【玄烛-云水雅韵·萤炬/皓月/曦日】新增效果：“云水雅韵II”令目标增加1%/2%/3%*level 点御仙御魔御佛效果，持续 6*level 秒
 */
class Skill2716 extends BaseHookSkillStub {

    constructor() {
        super(2716);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetMaxatk() * 5)
        player.SetVar2(player.GetMaxatk() * 2.5)
        player.SetVar3(player.GetSkilllevel(6914))
        player.SetVar4(player.GetSkilllevel(6915))
        player.SetVar5(player.GetSkilllevel(6916))
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const t = 3000 * skill.GetLevel()
        player.SetAddhp(t, player.GetVar2(), 6)
        player.SetAddmp(t, player.GetVar1(), 1)

        const yj = player.GetVar3()
        const hy = player.GetVar4()
        const xr = player.GetVar5()

        if ((yj + hy + xr) > 0) {
            let r = 0.01 * yj
            let t = yj * 6000
            if (hy > 0) {
                r = 0.02 * hy
                t = hy * 6000
            }

            if (xr > 0) {
                r = 0.03 * xr
                t = xr * 6000
            }

            player.SetIncCultRes(120, t, r, 0, 0)
            player.SetIncCultRes(120, t, r, 1, 1)
            player.SetIncCultRes(120, t, r, 2, 2)
        }

        return true
    }

}

/**
 * 2694  青冥雅韵II
 * 施法1秒；
 * 提升60点技能躲闪和技能命中；
 *
 * 15秒内，自身暴伤增加60%，攻击力增加50%；
 * 12秒内令自身获得无视神佑效果；
 */
class Skill2694 extends BaseHookSkillStub {

    constructor() {
        super(2694);
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
        player.SetInccrithurt(120, 0.06 * skill.GetLevel(), skill.GetLevel() * 500, 1)
        player.SetIncattack(120, 0.05 * skill.GetLevel(), skill.GetLevel() * 500, 1)
        player.SetIgnoreblessed(120, 12000)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, skill.GetLevel() * 0.06, 30000, 1)
        player.SetIncskillaccu(120, skill.GetLevel() * 0.06, 30000, 1)
        return true
    }

}

/**
 * 2695  红鸾音刃II
 * 1秒施法，16秒冷却
 */
class Skill2695 extends BaseHookSkillStub {

    constructor() {
        super(2695);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 16000
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
 * 2697 济岚音刃II
 * 流血时间缩短为4秒；16秒冷却
 */
class Skill2697 extends BaseHookSkillStub {

    constructor() {
        super(2697);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 16000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let ta = player.GetMaxhp();
        ta *= skill.GetLevel() * 0.05;
        let tb = player.GetVar1();
        tb *= skill.GetLevel() * 0.1;
        player.SetHpleak(120, 4000, ta, tb, 1);

        return true
    }
}

/**
 * 2696  昆玉华章II
 * 100%概率令目标喝药效果减弱90%，持续20秒；1秒施法，16秒冷却
 */
class Skill2696 extends BaseHookSkillStub {

    constructor() {
        super(2696);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 16000
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

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let da = 2000 * skill.GetLevel();
        let db = skill.GetLevel() * 0.09;
        player.SetDecdrugeffect(120, db, da, 1);

        return true
    }

}

/**
 * 2706  清辉音刃II
 * 施法时间调整为 1 秒，新增效果令目标禁食 5 秒
 */
class Skill2706 extends BaseHookSkillStub {

    constructor() {
        super(2706);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetDiet(120, 5000)
        return true
    }
}

/**
 * 2707  弥纱音刃II
 * 令目标定身改为令目标冰冻5秒，1秒施法
 */
class Skill2707 extends BaseHookSkillStub {

    constructor() {
        super(2707);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetFrozen(120, 0, 5000, 1)
        return true
    }

}

/**
 * 2705  天籁：十面埋伏II
 * 法阵期间，额外持续魅惑敌对目标，能力为自身魅抗+80点
 */
class Skill2705 extends BaseHookSkillStub {

    constructor() {
        super(2705);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetSilenceRes() + 80)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSilent(player.GetVar1(), 3000)
        return true
    }

}

/**
 * 2714  听霜雅韵II
 * 额外令自身施法速度提升30%；持续15秒
 */
class Skill2714 extends BaseHookSkillStub {

    constructor() {
        super(2714);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetSwift(120, 15000, 0.3, 0)
        super.Calculate2(stub, skill, originFunc);
    }

}

/**
 * 3051  神引：梅花三弄<玄>
 * 攻击目标6段，瞬间冷却，1.5秒释放，每个宫元素提供80%攻击力
 * 攻击怪物目标时，追加200%本体攻击力和自身气血真气上限和16%的攻击力
 */
class Skill3051 extends BaseHookSkillStub {

    constructor() {
        super(3051);
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetRadius(stub, skill, originFunc)+5;
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes2();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes2();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes2();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(0);
        player.SetPerform(0);
    }
}

class Skill3099 extends BaseHookSkillStub {

    constructor() {
        super(3099);
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetRadius(stub, skill, originFunc)+5;
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes3();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes3();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes3();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(0);
        player.SetPerform(0);
    }
}

class Skill3147 extends BaseHookSkillStub {

    constructor() {
        super(3147);
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetRadius(stub, skill, originFunc)+5;
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes4();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes4();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v7 = skill.GetJ1() * 0.01;
        let v5 = skill.GetLevel() * 0.003;
        let v8 = skill.GetJ1() * v5 + v7;
        let v15 = skill.GetT0() * 0.02 + v8;
        skill.SetCrit(v15);

        let v9 = skill.GetLevel() * 0.02 + 0.4;
        let v10 = skill.GetJ2() * v9 + 1.0;
        let v16 = skill.GetJ2() * 0.01 + v10;
        skill.SetRatio(v16);

        let v11 = skill.GetLevel() * 0.091;
        let v12 = skill.GetLevel() * v11;
        let v13 = 14 * skill.GetLevel() + v12;
        let Res2 = player.GetRes4();
        let v6 = Res2 * skill.GetJ0();
        let v14 = (skill.GetLevel() * 0.2 + 3.0) * v6 + v13 + 543.0;
        let v17 = 90 * skill.GetJ0() + v14;
        skill.SetPlus(v17);

        skill.SetMobBonusDamage(player.GetMaxatk() * 2 + player.GetMaxHPAndMP() * 0.16)

        player.SetPerform(0);
        player.SetPerform(0);
    }
}

/**
 * 3052  琼台雅韵：<玄><煞><禅>
 * 令队友带有技能反射效果基础概率提高至43%，满级为100%，反射次数5次，反射概率调整至100%
 */
class Skill3052 extends BaseHookSkillStub {

    constructor() {
        super(3052);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v23 = 1000 * skill.GetLevel() + 5000;
        let d = 5 * skill.GetT0() + 3 * skill.GetLevel() + 30;

        player.SetHeal(120, v23, 0);

        player.SetDispel(d, 4099, 15, 14);//驱散流血燃魔？

        player.SetDispel(-1, 48, 49, 50);//驱散什么？

        player.SetSkillreflect(3 * skill.GetLevel() + 43, 4 * skill.GetLevel() + 20, 5, 500 * skill.GetLevel() + 2050);//技能反射

        if (skill.GetLevel() > 19) {//御魔
            player.SetIncCultRes(120, 6050, 0.05, 0, 0);
        }

        return true
    }

}

/**
 * 3100
 *
 */
class Skill3100 extends BaseHookSkillStub {

    constructor() {
        super(3100);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v23 = 1000 * skill.GetLevel() + 5000;
        let d = 5 * skill.GetT0() + 3 * skill.GetLevel() + 30;

        player.SetHeal(120, v23, 0);

        player.SetDispel(d, 4099, 15, 14);//驱散流血燃魔？

        player.SetDispel(-1, 48, 49, 50);//驱散什么？

        player.SetSkillreflect(3 * skill.GetLevel() + 43, 4 * skill.GetLevel() + 20, 5, 500 * skill.GetLevel() + 2050);//技能反射

        if (skill.GetLevel() > 19) {
            player.SetIncCultRes(120, 6050, 0.05, 1, 1);
        }

        return true
    }

}

/**
 * 3148
 *
 */
class Skill3148 extends BaseHookSkillStub {

    constructor() {
        super(3148);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v23 = 1000 * skill.GetLevel() + 5000;
        let d = 5 * skill.GetT0() + 3 * skill.GetLevel() + 30;

        player.SetHeal(120, v23, 0);

        player.SetDispel(d, 4099, 15, 14);//驱散流血燃魔？

        player.SetDispel(-1, 48, 49, 50);//驱散什么？

        player.SetSkillreflect(3 * skill.GetLevel() + 43, 4 * skill.GetLevel() + 20, 5, 500 * skill.GetLevel() + 2050);//技能反射

        if (skill.GetLevel() > 19) {
            player.SetIncCultRes(120, 6050, 0.05, 2, 2);
        }

        return true
    }
}

/**
 * 5869  镜花水月III《天空》
 * 25秒内自身真气提高30%
 * 技能镜激活概率调整为100%，
 * 冷却固定60秒
 */
class Skill5869 extends BaseHookSkillStub {

    constructor() {
        super(5869);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDecdamage(120, 0.9, 25100);
        player.SetSkillmirror(120, 25100);
        player.SetIncmp(0.3, 25100, 5);
        player.SetCleardebuff(100, 5);
        return true
    }

}

/**
 * 5870 镜花水月III  《碧海》
 * 技能镜激活概率调整为100%，
 * 冷却时间调整为60秒,不再受技能等级影响
 */
class Skill5870 extends BaseHookSkillStub {

    constructor() {
        super(5870);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDecdamage(120, 0.9, 25100);
        player.SetSkillmirror(120, 25100);
        player.SetCleardebuff(100, 5);
        player.SetClearcooldown(2474, 2479, 2483);
        player.SetClearcooldown(2488, 2492, 2497);
        return true
    }
}

/**
 * 5871 镜花水月III  《大地》
 *
 */
class Skill5871 extends BaseHookSkillStub {

    constructor() {
        super(5871);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDecdamage(120, 0.9, 25100);
        player.SetSkillmirror(120, 25100);
        player.SetCleardebuff(100, 5);
        return true
    }
}

/**
 * 5872 镜花水月III  《英雄》
 * 20秒内技能命中提高30点、暴击率提高15点
 */
class Skill5872 extends BaseHookSkillStub {

    constructor() {
        super(5872);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetIncmp(0.3, 25100, 5);
        player.SetDecdamage(120, 0.9, 25100);
        player.SetSkillmirror(120, 25100);
        player.SetInccritrate(20100, 0.15, 3);
        player.SetIncskillaccu(100, 0.3, 20100, 1);
        return true
    }
}

/**
 * 5783  升皇音刃III 《天空》
 * 若自身当前真气量高于目标，则造成双方当前真气差4倍的白字伤害，取消极效效果；冷却30秒
 */
class Skill5783 extends BaseHookSkillStub {

    constructor() {
        super(5783);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar1() > player.GetMp()) {
            player.SetDirecthurt(120, Math.abs(player.GetVar1() - player.GetMp()) * 4)
        }

        let v36 = 0;
        if (skill.GetIscrit() == 1) {
            v36 = 120;
        }


        let dc = player.GetMaxmp() * 0.5;
        player.SetSubmp(v36, dc, 5000, 15100, 1);
        let dd = player.GetVar3();
        player.SetDizzy(dd, 3100);
        return true
    }

}

/**
 * 6910  赤乌·济岚音刃·曦日
 * 如果虚弱成功，则令目标变花（仅对玩家生效），持续7秒
 */
class Skill6910 extends BaseHookSkillStub {

    constructor() {
        super(6910);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const weak = player.GetVar1() + 80

        if (player.GetTypeIsPlayer() && weak > player.GetWeakenRes()) {
            player.SetTransform(120, 190, 1, 1, 7100)
        }

        return true
    }
}

/**
 * 2501  琼台雅韵
 * 玄烛·琼台雅韵·莹炬/皓月/曦日 新增效果：降低秋声雅韵技能冷却时间4/7/10*level 秒。
 * 曦日
 * 100%激活技能镜
 * 技能5级时，增加秋声雅韵所有增益效果持续时间10秒
 */
class Skill2501 extends BaseHookSkillStub {

    constructor() {
        super(2501);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let Skilllevel = player.GetSkilllevel(6911);
        let v5 = player.GetSkilllevel(6912) + Skilllevel;
        let star_lvl = v5 + player.GetSkilllevel(6913);
        let bonus = 0;
        if (star_lvl > 0) {
            if (zrand(100) <= 2 * star_lvl) {
                player.SetClearcooldown(2495, 0, 0);
            }
            bonus = 2;
            if (player.GetSkilllevel(6912) > 0)
                bonus = 5;

            if (player.GetSkilllevel(6913) > 0)
                bonus = 100;
        }

        let v13 = 6 * skill.GetLevel() + 14;
        let d = v13 + skill.GetT2() + bonus;

        let T2 = skill.GetT2();
        let da = 2000 * norm(T2) + 5000;
        player.SetSkillmirror(d, da);
        return true
    }

}

/**
 * 飞升技能
 * 龙翔操：烈/武/烈/影/华/昊/皇 冷却时间调整至120秒
 * 关山月：烈/武/烈/影/华/昊/皇 冷却时间调整至120秒
 * 将军令：烈/武/烈/影/华/昊/皇 冷却时间调整至120秒
 */
class FeiShengJiNeng extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            2645, 2653, 2669, 2685, 3829, 4628,//龙翔操
            2647, 2655, 2671, 2687, 3831, 4630,//关山月
            2648, 2656, 2672, 2688, 3832, 4631];//将军令
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

class FengQiuHuang extends QuickCoolDownList {
    getSkillList(): number[] {
        return [2646, 2654, 2670, 2686, 3830, 4629];//凤求凰
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }
}

export class TianHuaSkillList {
    constructor() {
        new Skill2470()
        new Skill2465()
        new Skill2495()
        new Skill2500()
        new Skill2488()
        new Skill2479()
        new Skill2497()
        new Skill2474()
        new Skill2483()
        new Skill2492()
        new Skill2478()
        new Skill2694()
        new Skill2716()
        new Skill2695()
        new Skill2697()
        new Skill2696()
        new Skill2706()
        new Skill2707()
        new Skill2705()
        new Skill2714()
        new Skill3051()
        new Skill3099()
        new Skill3147()
        new Skill3052()
        new Skill3100()
        new Skill3148()
        new Skill5869()
        new Skill5870()
        new Skill5871()
        new Skill5872()
        new Skill5783()
        new Skill6910()
        new Skill2487()
        new Skill2501()
        new FeiShengJiNeng()
        new FengQiuHuang()
    }
}