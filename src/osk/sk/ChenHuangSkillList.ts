import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 3998 里界·霁云
 * 反射次数调整为12次，持续时间20秒；
 * 15秒内随机为自身增加1-5条有利状态；
 * 自身6秒内免疫伤害及负面状态5次
 */
class Skill3998 extends BaseHookSkillStub {

    constructor() {
        super(3998);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        player.SetDispel(120, 4240, 0, 0);

        let Var1 = player.GetVar(1);
        let d = Var1 * skill.GetLevel() * 0.1;
        player.SetDechurt2(1.0, d, 60000);

        let v13;
        if (skill.GetT0() <= 0) {
            v13 = 0;
        } else {
            v13 = 60000;
        }

        let v17 = player.GetVar(1);
        let da = v17 * skill.GetT0() * 0.1;
        player.SetAddmp(v13, da, 1);

        player.SetSkillreflect2(100, 12, 12, 20100);

        player.SetRandbuff(120, 5, 1, 15000, 1)
        player.SetBlessed(5, 6100)
        return true
    }

}

/**
 * 4039  界·天演式·六道
 * 冷却减少15秒
 */
class Skill4039 extends BaseHookSkillStub {

    constructor() {
        super(4039);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

}

/**
 * 4037  元·无间
 * 冷却80秒；20秒内进入迅疾状态，施法时间减少40%；10秒内额外令自身技能伤害增加5%
 *
 */
class Skill4037 extends BaseHookSkillStub {

    constructor() {
        super(4037);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 80000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSwift(120, 20000, 0.4, 0)
        player.SetIncskilldamage(0.05, 10000, 1)
        return true
    }
}

/**
 * 3999  界·遁光式·千行
 * 冷却减少30秒
 * 6925玄烛·千行·曦日：被动减少界·遁光式·千行冷却时间6*level秒
 *
 */
class Skill3999 extends BaseHookSkillStub {

    constructor() {
        super(3999);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        let t = player.GetSkilllevel(6925) * 6000
        return super.GetCooldowntime(stub, skill, originFunc) - 30000 - t;
    }

}

/**
 * 4000  碎涅·龙元
 * 直接附加自身当前真气值100%的伤害，无需蓄力；取消对自身造成的伤害
 */
class Skill4000 extends BaseHookSkillStub {

    constructor() {
        super(4000);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const sp_damage = player.GetMaxmp();
        const mpb = player.GetMp() - sp_damage;
        player.SetMp(mpb);
        const v18 = (skill.GetT0() * 0.1 + 1.0) * sp_damage;
        skill.SetPlus(v18);
        player.SetPerform(1);
    }

}

/**
 * 4020  莲华·翔
 * 额外获得12秒蚩魂状态；额外进入隐身状态10秒
 *
 * 玄烛·翔·曦日：清除莲华·瞬冷却的概率调整为100%
 */
class Skill4020 extends BaseHookSkillStub {

    constructor() {
        super(4020);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetChihun(120, 12000, 0, 0, 1)
        player.SetHider(10000)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const skillLevel6929 = player.GetSkilllevel(6929);
        const skillLevel6930 = player.GetSkilllevel(6930);
        const skillLevel6931 = player.GetSkilllevel(6931);
        const star_lvl = skillLevel6929 + skillLevel6930 + skillLevel6931
        let bonus = 0;
        if (star_lvl > 0) {
            bonus = 1000 * star_lvl + 3000;
            let chance = 6;
            if (skillLevel6930 > 0) chance = 12;
            if (skillLevel6931 > 0) chance = 100;
            if (norm(100) <= chance) {
                player.SetClearcooldown(4019, 0, 0);
            }
        }

        player.SetDodge(5000, 15);

        const var1 = player.GetVar1() ? 0 : 120;
        const t = 1000 * skill.GetLevel() + 6000;
        const ta = skill.GetT0() + 10;
        player.SetFly(var1, ta, t);

        const var2 = player.GetVar2() ? 0 : 120;

        const tb = 1000 * skill.GetLevel() + 6000 + bonus;
        const tc = skill.GetT0() + 10;
        player.SetAddspeed(var2, tb, tc, 1);

        const var1Condition = player.GetVar1() ? 120 : 0;
        player.SetDispel(var1Condition, 4243, 0, 0);
        return true
    }

}

/**
 * 4005  枭夜
 * 不再生成暗灵，不再与启辉共享冷却；额外解除自身3个不利状态，免疫不利状态5秒
 */
class Skill4005 extends BaseHookSkillStub {

    constructor() {
        super(4005);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 3)
        player.SetTurndebuff(5000, 1, 1)
        return true
    }

}

/**
 * 4006  启辉
 * 不再生成光灵，不再与枭夜共享冷却；15秒内令下一击伤害增加50%
 */
class Skill4006 extends BaseHookSkillStub {

    constructor() {
        super(4006);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetNingjin(120, 0.5, 15000)
        return true
    }

}

/**
 * 4571  碎涅·罡·连星II
 * 眩晕时间延长3秒
 */
class Skill4571 extends BaseHookSkillStub {

    constructor() {
        super(4571);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Var1 = player.GetVar1();
        const d = Var1 + 10 * skill.GetLevel();
        const v5 = player.GetVar1();
        const dAdjusted = (v5 * skill.GetT0()) * 0.05 + d;
        player.SetDizzy(dAdjusted, 6000);
        return true
    }

}

/**
 * 4576  碎涅·劫·暗香浮动II
 * 魅惑时间延长4秒，魅惑成功则额外禁食目标4秒
 */
class Skill4576 extends BaseHookSkillStub {

    constructor() {
        super(4576);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Var1 = player.GetVar1();
        const v4 = 5 * skill.GetLevel() + Var1;
        const d = v4 + 10 * skill.GetT0();

        player.SetSilent(d, 8000);
        player.SetDiet(-1, 4000)
        return true
    }

}

/**
 * 4581  净涅·朔星II
 * 额外清除目标2个有利状态
 */
class Skill4581 extends BaseHookSkillStub {

    constructor() {
        super(4581);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const d = 10 * skill.GetLevel();
        const player = skill.GetVictimNice();
        player.SetClearbuff(d, 3);
        return true
    }
}

/**
 * 4583  碎涅·弥陆II
 * 施法1秒，冷却15秒；降低目标气血上限时间延长4秒；
 */
class Skill4583 extends BaseHookSkillStub {

    constructor() {
        super(4583);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = player.GetVar1() * 0.02;
        player.SetSubhp(120, skill.GetLevel() * d, 1000, 10100, 1);
        return true
    }
}

/**
 * 4584  碎涅·屏夜II
 * 施法1.5秒，冷却15秒；昏睡时间延长4秒；
 */
class Skill4584 extends BaseHookSkillStub {

    constructor() {
        super(4584);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const Var1 = player.GetVar1();
        const d = Var1 + 5 * skill.GetLevel();
        player.SetSleep(d, 10100, 0);
        return true
    }

}

/**
 * 4586  元·无间<玄>
 * 冷却减少25秒；
 * 自身25秒内进入迅疾状态，施法时间减少50%；
 * 10秒内额外令自身技能伤害增加10%，且技能命中增加10点
 */
class Skill4586 extends BaseHookSkillStub {

    constructor() {
        super(4586);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSwift(120, 25000, 0.5, 0)
        player.SetIncskilldamage(0.1, 10100, 2)
        player.SetIncskillaccu(120, 0.1, 10100, 2)
        return true
    }
}

/**
 * 4590
 *
 */
class Skill4590 extends BaseHookSkillStub {

    constructor() {
        super(4590);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSwift(120, 25000, 0.5, 0)
        player.SetIncskilldamage(0.1, 10100, 2)
        player.SetIncskillaccu(120, 0.1, 10100, 2)
        return true
    }
}

/**
 * 4594
 *
 */
class Skill4594 extends BaseHookSkillStub {

    constructor() {
        super(4594);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSwift(120, 25000, 0.5, 0)
        player.SetIncskilldamage(0.1, 10100, 2)
        player.SetIncskillaccu(120, 0.1, 10100, 2)
        return true
    }
}

/**
 * 4588  界·天演式·六道<玄>
 * 冷却减少10秒，真气附加比例分别提高至40%、60%、80%、100%、120%、140%
 *
 * <玄>：70%概率禁食目标
 */
class Skill4588 extends BaseHookSkillStub {

    constructor() {
        super(4588);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Mp = player.GetMp();
        player.SetVar1(Mp);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.02;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.05;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(70, 2000)
        return true
    }

}

/**
 * 4660
 *
 */
class Skill4660 extends BaseHookSkillStub {

    constructor() {
        super(4660);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Mp = player.GetMp();
        player.SetVar1(Mp);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.03;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.1;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(70, 2000)
        return true
    }

}

/**
 * 4661
 *
 */
class Skill4661 extends BaseHookSkillStub {

    constructor() {
        super(4661);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Mp = player.GetMp();
        player.SetVar1(Mp);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.04;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.15;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(70, 2000)
        return true
    }

}

/**
 * 4662
 *
 */
class Skill4662 extends BaseHookSkillStub {

    constructor() {
        super(4662);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Mp = player.GetMp();
        player.SetVar1(Mp);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.05;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.2;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(70, 2000)
        return true
    }

}

/**
 * 4663
 *
 */
class Skill4663 extends BaseHookSkillStub {

    constructor() {
        super(4663);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Mp = player.GetMp();
        player.SetVar1(Mp);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.06;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.25;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(70, 2000)
        return true
    }

}

/**
 * 4664
 *
 */
class Skill4664 extends BaseHookSkillStub {

    constructor() {
        super(4664);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Mp = player.GetMp();
        player.SetVar1(Mp);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.07;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.3;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(70, 2000)
        return true
    }

}

/**
 * 4592  界·天演式·六道<煞>
 * 冷却减少10秒，真气附加比例分别提高至40%、60%、80%、100%、120%、140%
 */
class Skill4592 extends BaseHookSkillStub {

    constructor() {
        super(4592);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.02;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        skill.SetCrit(level * 0.005);
        const t1Percentage = skill.GetT1() * 0.05;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }
}

/**
 * 4665
 *
 */
class Skill4665 extends BaseHookSkillStub {

    constructor() {
        super(4665);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.03;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        skill.SetCrit(level * 0.005 * 2);
        const t1Percentage = skill.GetT1() * 0.1;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }
}

/**
 * 4666
 *
 */
class Skill4666 extends BaseHookSkillStub {

    constructor() {
        super(4666);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.04;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        skill.SetCrit(level * 0.005 * 3);
        const t1Percentage = skill.GetT1() * 0.15;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }
}

/**
 * 4667
 *
 */
class Skill4667 extends BaseHookSkillStub {

    constructor() {
        super(4667);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.05;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        skill.SetCrit(level * 0.005 * 4);
        const t1Percentage = skill.GetT1() * 0.2;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }
}

/**
 * 4668
 *
 */
class Skill4668 extends BaseHookSkillStub {

    constructor() {
        super(4668);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.06;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        skill.SetCrit(level * 0.005 * 5);
        const t1Percentage = skill.GetT1() * 0.25;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }
}

/**
 * 4669
 *
 */
class Skill4669 extends BaseHookSkillStub {

    constructor() {
        super(4669);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.07;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        skill.SetCrit(level * 0.005 * 6);
        const t1Percentage = skill.GetT1() * 0.3;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }
}

/**
 * 4596  界·天演式·六道<禅>
 * 冷却减少10秒，真气附加比例分别提高至40%、60%、80%、100%、120%、140%
 * <禅>：昏睡调整为眩晕目标6秒；
 */
class Skill4596 extends BaseHookSkillStub {

    constructor() {
        super(4596);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.02;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.05;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let v2;
        if (skill.GetT0() <= 0)
            v2 = 0;
        else
            v2 = 120;

        const d = skill.GetT0() * 0.01;

        player.SetIncfatalratio(v2, d, 2000, 1);

        const Var1 = player.GetVar1();
        const da = Var1 + 5 * skill.GetLevel();

        player.SetSleep(da, 6000, 0);
        return true
    }
}

/**
 * 4670
 *
 */
class Skill4670 extends BaseHookSkillStub {

    constructor() {
        super(4670);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.03;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.1;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }


    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let v2;
        if (skill.GetT0() <= 0)
            v2 = 0;
        else
            v2 = 120;

        const d = skill.GetT0() * 0.01;

        player.SetIncfatalratio(v2, d, 2000, 1);

        const Var1 = player.GetVar1();
        const da = Var1 + 5 * skill.GetLevel() + 10;

        player.SetSleep(da, 6000, 0);
        return true
    }
}

/**
 * 4671
 *
 */
class Skill4671 extends BaseHookSkillStub {

    constructor() {
        super(4671);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.04;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.15;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let v2;
        if (skill.GetT0() <= 0)
            v2 = 0;
        else
            v2 = 120;

        const d = skill.GetT0() * 0.01;

        player.SetIncfatalratio(v2, d, 2000, 1);

        const Var1 = player.GetVar1();
        const da = Var1 + 5 * skill.GetLevel() + 20;

        player.SetSleep(da, 6000, 0);
        return true
    }
}

/**
 * 4672
 *
 */
class Skill4672 extends BaseHookSkillStub {

    constructor() {
        super(4672);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.05;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.2;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let v2;
        if (skill.GetT0() <= 0)
            v2 = 0;
        else
            v2 = 120;

        const d = skill.GetT0() * 0.01;

        player.SetIncfatalratio(v2, d, 2000, 1);

        const Var1 = player.GetVar1();
        const da = Var1 + 5 * skill.GetLevel() + 30;

        player.SetSleep(da, 6000, 0);
        return true
    }
}

/**
 * 4673
 *
 */
class Skill4673 extends BaseHookSkillStub {

    constructor() {
        super(4673);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.06;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.25;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }


    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let v2;
        if (skill.GetT0() <= 0)
            v2 = 0;
        else
            v2 = 120;

        const d = skill.GetT0() * 0.01;

        player.SetIncfatalratio(v2, d, 2000, 1);

        const Var1 = player.GetVar1();
        const da = Var1 + 5 * skill.GetLevel() + 40;

        player.SetSleep(da, 6000, 0);
        return true
    }
}

/**
 * 4674
 *
 */
class Skill4674 extends BaseHookSkillStub {

    constructor() {
        super(4674);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        skill.SetPlus(2000.0);
        const MpPercentage = player.GetMp() * 0.07;
        const level = skill.GetLevel();
        const plus2 = level * MpPercentage;
        skill.SetPlus2(plus2);
        const t1Percentage = skill.GetT1() * 0.3;
        skill.SetCrithurt(t1Percentage);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let v2;
        if (skill.GetT0() <= 0)
            v2 = 0;
        else
            v2 = 120;

        const d = skill.GetT0() * 0.01;

        player.SetIncfatalratio(v2, d, 2000, 1);

        const Var1 = player.GetVar1();
        const da = Var1 + 5 * skill.GetLevel() + 50;

        player.SetSleep(da, 6000, 0);
        return true
    }
}

/**
 * 5791  净涅·罡·存照III 《天空》
 * 施法1.5秒，无冷却；
 * 额外附加50%本体攻击力；攻击怪物目标时额外附加10%气血上限的攻击力
 */
class Skill5791 extends BaseHookSkillStub {

    constructor() {
        super(5791);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
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
        return 200
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate4(stub, skill, originFunc);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate5(stub, skill, originFunc);
    }

}

/**
 * 5792  净涅·罡·存照III 《碧海》
 *
 */
class Skill5792 extends BaseHookSkillStub {

    constructor() {
        super(5792);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
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
        return 200
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate4(stub, skill, originFunc);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate5(stub, skill, originFunc);
    }
}

/**
 * 5793  净涅·罡·存照III 《大地》
 *
 */
class Skill5793 extends BaseHookSkillStub {

    constructor() {
        super(5793);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
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
        return 200
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate4(stub, skill, originFunc);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate5(stub, skill, originFunc);
    }
}

/**
 * 5794  净涅·罡·存照III 《英雄》
 *
 */
class Skill5794 extends BaseHookSkillStub {

    constructor() {
        super(5794);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
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
        return 200
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate4(stub, skill, originFunc);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.5)
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        super.Calculate5(stub, skill, originFunc);
    }
}

/**
 * 5877  皇极·冥III  《天空》
 *
 */
class Skill5877 extends BaseHookSkillStub {

    constructor() {
        super(5877);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

}

/**
 * 5878  皇极·冥III  《碧海》
 * 海：获得神佑状态20秒，抵挡20次伤害和负面效果，前10秒处于无敌状态
 */
class Skill5878 extends BaseHookSkillStub {

    constructor() {
        super(5878);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetMirrorimage(120, 28100, 6, 1);

        player.SetBlessed(20, 20100)
        player.SetInvincible(10100);
        return true
    }
}

/**
 * 5879  皇极·冥III  《大地》
 *
 */
class Skill5879 extends BaseHookSkillStub {

    constructor() {
        super(5879);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }
}

/**
 * 6922  赤乌·听仇·曦日
 * 冷却15秒，施法1秒。
 * 附加当前真气20%，当前气血10%攻击力；
 * 令目标伤害加深的效果调整为8%*level，持续12秒；
 * 施法期间免疫控制3秒。
 * 技能达到5级，额外清除目标有利状态一个，额外增加自身当前真气与目标当前真气差的5%的附加伤害（仅对玩家有效）
 */
class Skill6922 extends BaseHookSkillStub {

    constructor() {
        super(6922);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
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
        return 200
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetTurndebuff(3000, 1, 4)
        super.Calculate1(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        skill.SetCrithurt(0.60000002);
        skill.SetRatio(2.95);
        //附加当前真气20%，当前气血10%攻击力；
        skill.SetPlus(3000 + player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.2);

        const darklight = player.GetDarklight();
        if (player.GetDarklightform() == 6)
            player.SetDarklight(darklight - 20);
        else
            player.SetDarklight(darklight + 20);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(2);
        skill.SetCrithurt(0.60000002);
        skill.SetRatio(2.95);
        //附加当前真气20%，当前气血10%攻击力；
        skill.SetPlus(3000 + player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.2);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(3);
        player.SetVar2(player.GetSleepRes());
        skill.SetCrithurt(0.60000002);
        skill.SetRatio(2.95);
        //附加当前真气20%，当前气血10%攻击力；
        skill.SetPlus(3000 + player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.2);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(4);
        const maxMp = player.GetMaxmp();
        const mp = player.GetMp();
        const var2 = maxMp - mp;
        player.SetVar2(var2);
        player.SetVar3(mp);
        skill.SetCrithurt(0.60000002);
        skill.SetRatio(2.95);
        skill.SetPlus(3000 + player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.2);
        player.SetPerform(0);
        //技能达到5级，额外清除目标有利状态一个，额外增加自身当前真气与目标当前真气差的5%的附加伤害（仅对玩家有效）
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const var1 = player.GetVar1();
        if (var1 == 2) {
            player.SetDecdrugeffect(120, 0.4, 4100, 9);
        } else if (var1 > 2) {
            if (var1 == 3) {
                const var2 = player.GetVar2() + 80;
                player.SetSleep(120, var2, 31000);
            } else if (var1 == 4) {
                const de = player.GetVar2() * 0.3;
                let plus = 0
                if (skill.GetLevel() >= 5) {
                    const v3 = player.GetVar3()
                    const mp = player.GetMp()
                    if (v3 > mp) {
                        plus = (v3 - mp) * 0.05
                    }
                }

                player.SetDirecthurt(120, de + plus);
            }
        } else if (var1 == 1) {
            player.SetIncfatalratio(120, 0.15, 4100, 4);

            const d = 200 * skill.GetLevel();
            const da = 2000 * skill.GetLevel() + 5000;
            const db = skill.GetLevel() * 0.15;
            player.SetSlow(d, db, da, 1);

            //令目标伤害加深的效果调整为8%*level，持续12秒；
            const dc = skill.GetLevel() * 0.08;
            player.SetInchurt(120, dc, 12100);
        }

        return true
    }
}

/**
 * 4024  碎涅·罡·三千界
 * 玄烛·三千界·曦日：附加真气上限伤害调整为2%*level
 */
class Skill4024 extends BaseHookSkillStub {

    constructor() {
        super(4024);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetRatio(1.1);
        const player = skill.GetPlayerNice();
        const maxMpPercentage = player.GetMaxmp() * 0.01;
        const skillLevel4573 = player.GetSkilllevel(4573);
        player.SetVar2(Math.floor(skillLevel4573 * maxMpPercentage));
        const cultivation = player.GetCultivation();
        const skillLevel6926 = player.GetSkilllevel(6926);
        const skillLevel6927 = player.GetSkilllevel(6927);
        const skillLevel6928 = player.GetSkilllevel(6928);
        let var1;
        if (cultivation === 1 && skillLevel4573 > 0) {
            var1 = 120;
        } else {
            var1 = 0;
        }
        player.SetVar1(var1);
        const star_lvl = skillLevel6926 + skillLevel6927 + skillLevel6928;
        const level = player.GetLevel();
        const levelMultiplier = 9 * level;
        const maxMp = player.GetMaxmp();
        const plusValue = (levelMultiplier + skill.GetLevel() * maxMp / 100) * (star_lvl * 0.02 + 1.0);
        skill.SetPlus(plusValue);
        const darklightForm = player.GetDarklightform();
        let darklightModifier;
        if (darklightForm == 4 || darklightForm == 5 || darklightForm == 6) {
            darklightModifier = skill.GetT2() * 0.1 + 1.0;
        } else {
            darklightModifier = 1.0;
        }
        const darklightValue = maxMp * (star_lvl * 0.01) + darklightModifier * plusValue;
        player.SetDarklight(Math.floor(darklightValue));
        player.SetPerform(1);
    }

}

class JunLinSkill extends QuickCoolDownList {
    getSkillList(): number[] {
        return [4546, 4550, 4554, 4558, 4562, 4566];//君临
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 70000
    }
}

/**
 * 4164  恒道
 *  增加爆伤修改为level*3%
 */
class Skill4164 extends BaseHookSkillStub {

    constructor() {
        super(4164);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetPasaddsmite(skill.GetLevel() * 0.03)
        return true
    }

}
export class ChenHuangSkillList {
    constructor() {
        new Skill3998()
        new Skill4039()
        new Skill4037()
        new Skill3999()
        new Skill4000()
        new Skill4020()
        new Skill4005()
        new Skill4006()
        new Skill4571()
        new Skill4576()
        new Skill4581()
        new Skill4583()
        new Skill4584()
        new Skill4586()
        new Skill4590()
        new Skill4594()
        new Skill4588()
        new Skill4660()
        new Skill4661()
        new Skill4662()
        new Skill4663()
        new Skill4664()
        new Skill4592()
        new Skill4665()
        new Skill4666()
        new Skill4667()
        new Skill4668()
        new Skill4669()
        new Skill4596()
        new Skill4670()
        new Skill4671()
        new Skill4672()
        new Skill4673()
        new Skill4674()
        new Skill5791()
        new Skill5792()
        new Skill5793()
        new Skill5794()
        new Skill5877()
        new Skill5878()
        new Skill5879()
        new Skill6922()
        new Skill4024()
        new JunLinSkill()
        new Skill4164()


    }
}