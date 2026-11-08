import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 2416 鬼步
 * 冷却减少25秒，额外增加自身技能躲闪35点
 * 2689鬼步II：令鬼步的技能躲闪额外增加50点；取消降低鬼步冷却的效果，令鬼步额外增加0.8米移动速度
 */
class Skill2416 extends BaseHookSkillStub {

    constructor() {
        super(2416);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 45000 - skill.GetT0() * 5000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = (5000 * skill.GetLevel() + 10000);
        const ta = skill.GetLevel() + 1 + skill.GetT2() * 0.08;
        player.SetAddspeed(120, t, ta, 1);

        const v7 = 20 * skill.GetLevel() + 10;
        const tb = (v7 + 10 * skill.GetT0());
        const tc = (skill.GetLevel() + 1);
        player.SetCleardebuff(tb, tc);

        const td = (5000 * skill.GetLevel() + 10000);
        const te = (skill.GetT2() * 0.05 + 0.35);
        player.SetIncskilldodge(120, te, td, 3);
        return true
    }

}

/**
 * 2426  空行
 * 2544天书-通幽：官方鸡肋效果全部删除；优化为令足通获得10秒必暴状态(鬼步、空行、足通)
 */
class Skill2426 extends BaseHookSkillStub {

    constructor() {
        super(2426);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDodge(5000, 15);
        const t = (2000 * skill.GetT0() + 5000);
        const ta = (skill.GetLevel() * 0.03 + 0.00001);
        player.SetInccritrate(t, ta, 0);
        return true
    }

}

/**
 * 2435  足通
 * 将自身防御力全部转换为攻击力，持续9秒；
 * 自身增加下一击伤害调整为30%*level，持续15秒；
 * 瞬移后获得6秒无敌
 * 2544天书-通幽：官方鸡肋效果全部删除；优化为令足通获得10秒必暴状态(鬼步、空行、足通)
 *
 * 2690足通II：官方效果全部取消；令足通的下一击伤害增加效果额外提升20%；并立即清除目标3个有利状态
 */
class Skill2435 extends BaseHookSkillStub {

    constructor() {
        super(2435);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        let t = 0
        if (player.GetSkilllevel(6895) >= 5) {
            t = 10000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - t;
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar2(player.GetDef())
        super.Calculate1(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetAddattack(120, 9000, player.GetVar2(), 2)

        const ta = 1000 * skill.GetT0() + 13000;
        const tb = skill.GetLevel() * 0.3 + skill.GetT2() * 0.02;
        player.SetNingjin(120, tb, ta);

        player.SetInvincible(6100);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetClearbuff(120, 3)
        super.StateAttack(stub, skill, originFunc);
        return true

    }

}

/**
 * 2431  当身
 * 增加自身减免伤害提升3%*level+1%，本体受到伤害16%*level由影子承担
 *
 * 2709当身II：取消影子承担伤害的额外比例
 */
class Skill2431 extends BaseHookSkillStub {

    constructor() {
        super(2431);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const v12 = 1000 * skill.GetT2() + 20000;
        const v15 = skill.GetLevel() * 0.16;//本体受到伤害16%*level由影子承担
        player.SetSharelifewithclone(120, v15, v12);//当身

        const v14 = skill.GetT0() <= 0 ? 0.0 : 120.0;
        const v13 = 1000 * skill.GetT2() + 20000;
        const da = skill.GetT0() * 0.1;
        player.SetIncdefence(v14, v13, da, 0);

        //减免伤害
        player.SetUltimateDamageReduction(120, v13, 0.03 * skill.GetLevel() + 0.01, 0, 1);
        return true
    }

}

/**
 * 2449  受身
 * 本体受到负面效果16%*level几率由影子承担
 * 受身II：取消影子承担负面效果的额外加成
 */
class Skill2449 extends BaseHookSkillStub {

    constructor() {
        super(2449);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const v13 = 1000 * skill.GetT2() + 20000;
        const v17 = skill.GetLevel() * 0.16;
        player.SetSharestatewithclone(120, v17, v13);//受身

        const t = skill.GetT0() <= 0 ? 0.0 : 1000 * skill.GetT2() + 20000;
        let v15;
        if (skill.GetT0() <= 0) {
            v15 = 0.0;
        } else {
            const T0 = skill.GetT0();
            const v9 = zrand(100);
            v15 = 50 * (T0 * (v9 / (100 - 4 * skill.GetT0())) + T0);
        }

        player.SetAddanti(v15, t, 0);
        return true
    }

}

/**
 * 2429  天书-延命
 * 新增效果：影子存在时，增加怀光本体减免爆伤 10%*level
 */
class Skill2429 extends BaseHookSkillStub {

    constructor() {
        super(2429);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.TakeEffect(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetPasdecfatalhurt(skill.GetLevel() * 0.1)
        return true
    }

}

/**
 * 2412  血刃
 * 瞬发，消耗自身10%当前气血，转换为攻击力，存在10秒；
 * 原增加攻击力和致命一击率效果时间持续30秒；
 * 增加自身技能命中level 点持续30秒；
 * 增加自身对怪物目标伤害10% * level持续30秒
 *
 * 玄烛·血刃·曦日：30秒内增加自身攻击力50%，额外增加自身致命一击伤害10%*level；技能达到5级时，下击必爆，持续15秒
 */
class Skill2412 extends BaseHookSkillStub {

    constructor() {
        super(2412);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        const hp = player.GetHp() * 0.1
        player.SetVar1(hp)
        player.SetHp(player.GetHp() - hp)
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetAddattack(120, 10000, player.GetVar1(), 1)

        player.SetIncskillaccu(120, skill.GetLevel() * 0.01, 30000, 1)

        const d = (skill.GetLevel() * 0.01);
        const hp = player.GetHp();
        const amount = hp * d;
        player.SetHpleak(120, 200, amount, 0, 0);

        const ratio = (skill.GetLevel() * 0.01);

        const xr = player.GetSkilllevel(6892);
        player.SetIncattack(120, 30000, ratio + xr * 0.1, 0);
        player.SetInccrithurt(xr * 24, xr * 0.1, 30000, 8)

        if (xr >= 5) {
            player.SetMakecrit(15100)
        }

        player.SetIncMobDmg(120, 30000, 0.1 * skill.GetLevel(), 1);

        const star_lvl = player.GetSkilllevel(6891)
            + player.GetSkilllevel(6890)
            + player.GetSkilllevel(6892);

        if (star_lvl > 0) {
            player.SetDecfatalhurt(120, star_lvl * 0.1, 15100, 6);

            let ratio = 0.1;
            if (player.GetSkilllevel(6891) > 0)
                ratio = 0.2;
            if (player.GetSkilllevel(6892) > 0)
                ratio = 0.3;

            player.SetDecfatalratio(120, ratio, 30100, 3);
        }

        return true
    }

}

/**
 * 2418  迷踪
 * 冷却30秒；增加技能躲闪20点，技能命中20点持续20秒
 * 玄烛·迷踪·曦日：迅疾效果持续时间调整为20秒，技能5级时增加技能躲闪15点，技能命中15点
 */
class Skill2418 extends BaseHookSkillStub {

    constructor() {
        super(2418);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = (15 * skill.GetLevel());
        const da = (30 * skill.GetT0());
        player.SetDimming(120, 0, da, 20000, d, 0);

        const star_lvl = player.GetSkilllevel(6888) + player.GetSkilllevel(6887) + player.GetSkilllevel(6889);
        if (star_lvl > 0) {
            let ctr = 0.2;
            if (player.GetSkilllevel(6888) > 0)
                ctr = 0.3;
            if (player.GetSkilllevel(6889) > 0)
                ctr = 0.5;

            player.SetSwift(120, 20100, ctr, 0);
            player.SetAddspeed(100, 20100, star_lvl, 8);
        }

        let xx = 0
        if (star_lvl >= 5) {
            xx = 0.15
        }

        player.SetIncskillaccu(120, 0.2 + xx, 20000, 1)
        player.SetIncskilldodge(120, 0.2 + xx, 20000, 1)
        return true
    }
}

/**
 * 2427  乘崩
 * 额外增加目标被致命一击受到伤害66%，持续20秒
 */
class Skill2427 extends BaseHookSkillStub {

    constructor() {
        super(2427);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = (5000 * skill.GetT1() + 20000);
        const ta = (10 * skill.GetLevel());
        player.SetSubanti(120, ta, t, 0);
        let v7;
        if (skill.GetT0() <= 0)
            v7 = 0;
        else
            v7 = 120;

        const tb = (5000 * skill.GetT1() + 20000);
        const tc = skill.GetT0() * 0.1 + 0.66;
        player.SetIncfatalhurt(v7, tc, tb, 0);
        return true
    }

}

/**
 * 2445  分筋
 * 冷却减少40秒，令目标增伤10%
 */
class Skill2445 extends BaseHookSkillStub {

    constructor() {
        super(2445);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 40000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        //增伤
        player.SetInchurt(120, 0.1, 5000 * skill.GetT1() + 20000);
        return true
    }

}

/**
 * 2424  鬼切
 * 攻击怪物目标时,额外附加本体攻击力50%,额外附加自身气血真气上限和10%的攻击力，每个连击点令此技能额外附加10%本体攻击力
 * 2530天书-鬼足 新增影响鬼切、鬼切I1，效果为对怪物目标额外附加 10%*level 真气上限的攻击力
 */
class Skill2424 extends BaseHookSkillStub {

    constructor() {
        super(2424);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let r = 1.1
        if (player.GetTargetTypeIsMob()) {
            r = 1.6 + skill.GetC0() * 0.1
        }

        skill.SetRatio(r);
        const v4 = skill.GetT1() * 0.01;
        skill.SetCrit(v4);
        const v3 = 8 * (skill.GetLevel() + 14);
        skill.SetPlus(v3);

        const gz = skill.GetT0() * 0.1 * player.GetMaxmp()
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + gz)

        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

}

/**
 * 2691  鬼切II
 * 攻击怪物目标时,额外附加本体攻击力35%,额外附加自身气血真气上限和10%的攻击力，每个连击点令此技能额外附加10%本体攻击力
 * 2530天书-鬼足 新增影响鬼切、鬼切I1，效果为对怪物目标额外附加 10%*level 真气上限的攻击力
 */
class Skill2691 extends BaseHookSkillStub {

    constructor() {
        super(2691);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const v8 = skill.GetT1() * 0.01;
        skill.SetCrit(v8);
        let v9 = skill.GetLevel() * 0.02 + 1.0;
        if (player.GetTargetTypeIsMob()) {
            v9 = v9 + 0.35 + skill.GetC0() * 0.1
        }

        skill.SetRatio(v9);

        const Maxhp = player.GetMaxhp();
        const v10 = skill.GetLevel() * 0.015 * Maxhp;
        skill.SetPlus(v10);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);
        const gz = skill.GetT0() * 0.1 * player.GetMaxmp()
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + gz)

        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const v8 = skill.GetT1() * 0.01;
        skill.SetCrit(v8);
        let v9 = skill.GetLevel() * 0.02 + 1.0;
        if (player.GetTargetTypeIsMob()) {
            v9 = v9 + 0.35 + skill.GetC0() * 0.1
        }

        skill.SetRatio(v9);

        const Maxhp = player.GetMaxhp();
        const v10 = skill.GetLevel() * 0.015 * Maxhp;
        skill.SetPlus(v10);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);
        const gz = skill.GetT0() * 0.1 * player.GetMaxmp()
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + gz)

        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

}

/**
 * 2443  斗杀
 * 施法1秒，冷却1秒；
 * 本体两击额外追加自身当前气血值10%的伤害，暗影两击额外追加自身当前真气值5%的伤害；
 * 在暗影状态下本体两击伤害提升60%；
 * 攻击非玩家目标时，每个连击点可令此技能第一击额外附加自身当前气血10%的伤害。
 */
class Skill2443 extends BaseHookSkillStub {

    constructor() {
        super(2443);
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
        //本体两击额外追加自身当前气血值10%的伤害，暗影两击额外追加自身当前真气值5%的伤害；
        // 在暗影状态下本体两击伤害提升60%；
        // 攻击非玩家目标时，每个连击点可令此技能第一击额外附加自身当前气血10%的伤害。
        const player = skill.GetPlayerNice();

        player.SetVar1(player.GetMp() * 0.05)

        const v10 = (skill.GetC0() * 0.1);
        skill.SetCrit(v10);
        const v7 = (46 * skill.GetLevel() + 726);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        const v9 = (skill.GetLevel() * 0.02 + 1.1);
        const v3 = 2 * player.GetHp();
        const v4 = skill.GetPlayerNice();
        const v5 = (v3 >= v4.GetMaxhp()) ? 0.0 : (skill.GetT0() * 0.1);
        const v8 = (skill.GetC0() * 0.08);
        const v11 = (skill.GetT1() * v8 + (v5 + v9));

        if (player.GetHide() == 1) {
            skill.SetRatio(v11 + 0.6);
        } else {
            skill.SetRatio(v11);
        }

        skill.SetMobBonusDamage(player.GetHp() * skill.GetC0() * 0.1)

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        //本体两击额外追加自身当前气血值10%的伤害，暗影两击额外追加自身当前真气值5%的伤害；
        // 在暗影状态下本体两击伤害提升60%；
        // 攻击非玩家目标时，每个连击点可令此技能第一击额外附加自身当前气血10%的伤害。
        const player = skill.GetPlayerNice();
        player.SetVar1(player.GetMp() * 0.05)
        const v10 = (skill.GetC0() * 0.1);
        skill.SetCrit(v10);
        const v7 = (46 * skill.GetLevel() + 726);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        const v9 = (skill.GetLevel() * 0.01 + 1.1);
        const v3 = 2 * player.GetHp();
        const v4 = skill.GetPlayerNice();
        const v5 = (v3 >= v4.GetMaxhp()) ? 0.0 : (skill.GetT0() * 0.1);
        const v8 = (skill.GetC0() * 0.08);
        const v11 = (skill.GetT1() * v8 + (v5 + v9));

        if (player.GetHide() == 1) {
            skill.SetRatio(v11 + 0.6);
        } else {
            skill.SetRatio(v11);
        }

        skill.SetMobBonusDamage(player.GetHp() * skill.GetC0() * 0.1)

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetSecondattack(0.6, skill.GetLevel() * 0.05, player.GetVar1());
        return true
    }
}

/**
 * 2423  潜袭
 * 无冷却，附加本体攻击力50%
 */
class Skill2423 extends BaseHookSkillStub {

    constructor() {
        super(2423);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const hide = player.GetHide();
        player.SetVar2(hide);
        let v6;
        if (player.GetHide() <= 0) {
            v6 = 1.5700001;
        } else {
            v6 = skill.GetT1() * 0.1 + 1.57;
        }
        skill.SetRatio(v6);
        const level = player.GetLevel();
        player.SetVar1(level);
        const v11 = 5 * skill.GetLevel() + 79;
        skill.SetPlus(v11);
        player.SetPerform(1);
    }

}

/**
 * 2434  突杀
 * 施法1秒
 */
class Skill2434 extends BaseHookSkillStub {

    constructor() {
        super(2434);
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

}

/**
 * 2444  杀域
 * 降低目标技能命中修改为降低技能躲闪
 */
class Skill2444 extends BaseHookSkillStub {

    constructor() {
        super(2444);
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar1(player.GetRes4() + 100)
        super.Calculate1(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = (skill.GetLevel() * 0.12);
        player.SetSlow(player.GetVar1(), d, 10000, 0);
        const da = (skill.GetLevel() * 0.03 + 0.00001);
        player.SetDecskilldodge(120, da, 10000, 0)
        return true
    }
}

/**
 * 2453  影舞·极
 * 一次召唤2个暗影分身
 */
class Skill2453 extends BaseHookSkillStub {

    constructor() {
        super(2453);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const v10 = 5000 * skill.GetT0() + 30000;
        player.SetSummonclone(120, 34670, 2, v10, 3);//影子
        return true
    }

}

/**
 * 2452  一闪
 * 冷却减少20秒；15秒内增加下击伤害20%，增加自身气血上限8%
 */
class Skill2452 extends BaseHookSkillStub {

    constructor() {
        super(2452);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldamage(0.2, 15000, 3)
        player.SetInchp(0.08, 15000, 3)
        return true
    }

}

/**
 * 2417  血毒
 * 2699血毒II：每次攻击损失的气血额外增加目标自身气血上限的20%
 */
class Skill2417 extends BaseHookSkillStub {

    constructor() {
        super(2417);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = (5000 * skill.GetT1() + 20000);
        const ta = (player.GetVar1() * 0.01);
        let tb = (skill.GetLevel() * ta);
        const v18 = (player.GetMaxhp() * 0.02);
        tb = (skill.GetT2() * v18 + tb);
        player.SetCrazycurse(120, tb, 1, t);

        const v9 = (skill.GetT0() <= 0) ? 0 : 120;
        const tc = (5000 * skill.GetT1() + 20000);
        let td = (player.GetVar1() * 0.05);
        td = (skill.GetT0() * td);
        player.SetSubhp(v9, td, 1.0, tc, 0);
        return true
    }

}

/**
 * 2436  鬼幕
 * 2700鬼幕II：禁食时间加强为10秒
 * 玄烛·鬼幕·曦日：清除目标身上4个有利效果；
 * 当自身攻击力高于目标时，额外附加“业障”效果，持续4秒
 * 技能达到5级时，被动减少足通冷却10秒
 */
class Skill2436 extends BaseHookSkillStub {

    constructor() {
        super(2436);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar4(player.GetMaxatk())
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = (5000 * skill.GetT1() + 20000);
        const ta = (skill.GetLevel() * 0.05);
        player.SetDecaccuracy(120, ta, t, 0);

        const pp = (skill.GetT0() <= 0) ? 0 : 120
        const td = (5000 * skill.GetT1() + 20000);
        const te = (skill.GetT0() * 0.02 + 0.00001);
        player.SetDeccritrate(pp, te, td,1);

        const pp2 = (skill.GetT2() <= 0) ? 0 : 120
        const tf = (1000 * skill.GetT2() + 100);
        player.SetDiet(pp2, tf);

        const Var1 = player.GetVar1();
        const v25 = player.GetVar2() + Var1;
        const star_lvl = v25 + player.GetVar3();
        if (star_lvl) {
            let ratio = 0.3;
            if (player.GetVar2() > 0) ratio = 0.5;
            if (player.GetVar3() > 0) ratio = 0.8;

            player.SetDecdrugeffect(120, ratio, 10100, 8);
            const tg = (8 * (star_lvl + 5));
            player.SetDispel(tg, 4172, 54, 95);

            if (player.GetVar4() > player.GetMaxatk()) {
                //当自身攻击力高于目标时，额外附加“业障”效果，持续4秒
                player.SetDarkness2(120, 4100);
            }
        }
        return true
    }

}

/**
 * 2701  瞬杀II
 * 施法1秒，冷却降至30秒，附加本体攻击力30%*level
 */
class Skill2701 extends BaseHookSkillStub {

    constructor() {
        super(2701);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const maxAtk = player.GetMaxatk();
        const crithurt = player.GetCrithurt() * maxAtk;
        player.SetVar1(Math.floor(crithurt));

        const c0 = skill.GetC0();
        const level = skill.GetLevel();
        const t0 = skill.GetT0();

        const crit = c0 * 0.1;
        skill.SetCrit(crit);

        const v9 = level * 0.3 + 1.0;
        const v6 = c0 * 0.08;
        const ratio = t0 * v6 + v9;
        skill.SetRatio(ratio);

        player.SetPerform(1);
    }

}

/**
 * 2702  突杀II
 * 施法1秒，附加本体攻击力30%*level
 */
class Skill2702 extends BaseHookSkillStub {

    constructor() {
        super(2702);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 575
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 425
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const c0 = skill.GetC0();
        const level = skill.GetLevel();
        const t0 = skill.GetT0();

        const crit = c0 * 0.1;
        skill.SetCrit(crit);

        const v4 = level * 0.3 + 1.0;
        const v3 = c0 * 0.08;
        const v6 = t0 * v3 + v4;
        skill.SetRatio(v6);

        const player = skill.GetPlayerNice();
        player.SetPerform(1);
    }

}

/**
 * 3047  一闪<玄>
 *
 * 冷却减少20秒；
 * 施法后获得神佑效果，抵挡20次伤害，持续20秒；
 * 20秒内额外增加隐身能力20点
 * 增加自身气血上限13%，增加下击伤害40%（与足通互斥），持续15秒；
 * <玄>：自身5秒内处于无敌状态；
 */
class Skill3047 extends BaseHookSkillStub {

    constructor() {
        super(3047);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetBlessed(20, 20000)
        player.SetInvincible(5000)
        player.SetInchp(0.13, 15000, 2)
        player.SetNingjin(120, 0.4, 15000)
        return true
    }

}

/**
 * 3095
 * 冷却减少20秒；
 * 施法后获得神佑效果，抵挡20次伤害，持续20秒；
 * 20秒内额外增加隐身能力20点
 * 增加自身气血上限13%，增加下击伤害40%（与足通互斥），持续15秒；
 * <煞>：自身5秒内无视神佑，且15秒内下一击必暴；
 */
class Skill3095 extends BaseHookSkillStub {

    constructor() {
        super(3095);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetBlessed(20, 20000)
        player.SetInchp(0.13, 15000, 2)
        player.SetNingjin(120, 0.4, 15000)

        player.SetIgnoreblessed(120, 5000)
        player.SetMakecrit(5000)
        return true
    }
}

/**
 * 3143
 * <禅>：施法后自身气血真气提升10%，持续 15 秒
 */
class Skill3143 extends BaseHookSkillStub {

    constructor() {
        super(3143);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetBlessed(20, 20000)
        player.SetInchp(0.23, 15000, 2)
        player.SetIncmp(0.1, 15000, 2)
        player.SetNingjin(120, 0.4, 15000)
        return true
    }
}

/**
 * 3048  影舞·极<玄>
 * 影舞·极<玄>、<煞>、<禅>：召唤影分身后，可令本体获得10秒神佑状态，免疫伤害20次
 * <玄><煞>：召唤3个大影子
 */
class Skill3048 extends BaseHookSkillStub {

    constructor() {
        super(3048);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const v3 = 1000 * skill.GetLevel() + 10000;
        const t = v3 + 5000 * skill.GetT0();
        player.SetSummonclone(120, 34670, 3, t, 3);

        player.SetBlessed(20, 10000)

        const ta = 500 * skill.GetLevel() + 5050;
        const tb = skill.GetLevel() + 2;
        const Def = player.GetDef();
        const tc = (Def * skill.GetLevel()) * 0.005;
        player.SetBloodshield(100, 1.0, tc, tb, ta);
        return true
    }

}

/**
 * 3096
 * 影舞·极<玄>、<煞>、<禅>：召唤影分身后，可令本体获得10秒神佑状态，免疫伤害20次
 * <玄><煞>：召唤3个大影子
 */
class Skill3096 extends BaseHookSkillStub {

    constructor() {
        super(3096);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const v3 = 1000 * skill.GetLevel() + 10000;
        const t = v3 + 5000 * skill.GetT0();
        player.SetSummonclone(120, 34670, 3, t, 3);

        player.SetBlessed(20, 10000)

        const ta = 500 * skill.GetLevel() + 5050;
        const tb = skill.GetLevel() + 2;
        const Maxatk = player.GetMaxatk();
        const tc = (Maxatk * skill.GetLevel()) * 0.002;
        player.SetFrenzied(100, 1.0, tc, tb, ta);
        return true
    }

}

/**
 * 3144
 * 影舞·极<玄>、<煞>、<禅>：召唤影分身后，可令本体获得10秒神佑状态，免疫伤害20次
 * <禅>：召唤4个大影子
 */
class Skill3144 extends BaseHookSkillStub {

    constructor() {
        super(3144);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const v3 = 1000 * skill.GetLevel() + 10000;
        const t = v3 + 5000 * skill.GetT0();
        player.SetSummonclone(120, 34670, 4, t, 3);

        player.SetBlessed(20, 10000)

        const tb = 3 * skill.GetLevel() + 20;
        const tc = 500 * skill.GetLevel() + 5050;
        player.SetAddspeed(tb, tc, 2, 2);
        return true
    }
}

/**
 * 7118  大影子
 * 出生时获得20秒神佑状态，免疫伤害80次，且前3秒处于无敌状态（7118技能）
 */
class Skill7118 extends BaseHookSkillStub {

    constructor() {
        super(7118);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetBlessed(80, 20000)
        player.SetInvincible(3000)
        return true
    }

}

/**
 * 3046  天诛<玄>
 * 施法1秒，冷却减少10秒，群体攻击2次；
 * 额外附加自身气血上限10%攻击力，附加自身真气上限5%攻击力；
 * 有概率击穿神佑
 */
class Skill3046 extends BaseHookSkillStub {

    constructor() {
        super(3046);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v14 = skill.GetC0() * 0.1;
        skill.SetCrit(v14);

        let T1 = skill.GetT1();
        let v12 = skill.GetC0() * 0.08 * T1;

        let v7 = skill.GetLevel() - 15;
        let Level = skill.GetLevel();
        let v8 = norm(Level / 14.9) * 0.03 * v7;

        let v15 = skill.GetLevel() * 0.05 + 1.05 + v8 + v12;
        skill.SetRatio(v15);

        let res2 = player.GetRes2();
        let v13 = res2 * (skill.GetLevel() + 2);

        let T0 = skill.GetT0();
        let v10 = player.GetHp() * 0.05 * T0;

        let v16 = 10 * skill.GetLevel() + 244 + v10 + v13;
        // 额外附加自身气血上限10%攻击力，附加自身真气上限5%攻击力；
        skill.SetPlus(v16 + player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05);

        player.SetIgnoreblessed(20, 1000)

        player.SetPerform(1);
        player.SetPerform(0);
    }
}

/**
 * 3094
 *
 */
class Skill3094 extends BaseHookSkillStub {

    constructor() {
        super(3094);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v14 = skill.GetC0() * 0.1;
        skill.SetCrit(v14);

        let T1 = skill.GetT1();
        let v12 = skill.GetC0() * 0.08 * T1;

        let v7 = skill.GetLevel() - 15;
        let Level = skill.GetLevel();
        let v8 = norm(Level / 14.9) * 0.03 * v7;

        let v15 = skill.GetLevel() * 0.05 + 1.05 + v8 + v12;
        skill.SetRatio(v15);

        let res4 = player.GetRes4();
        let v13 = res4 * (skill.GetLevel() + 2);

        let T0 = skill.GetT0();
        let v10 = player.GetHp() * 0.05 * T0;

        let v16 = 10 * skill.GetLevel() + 244 + v10 + v13;
        // 额外附加自身气血上限10%攻击力，附加自身真气上限5%攻击力；
        skill.SetPlus(v16 + player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05);

        player.SetIgnoreblessed(20, 1000)

        player.SetPerform(1);
        player.SetPerform(0);
    }
}

/**
 * 3142
 *
 */
class Skill3142 extends BaseHookSkillStub {

    constructor() {
        super(3142);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v14 = skill.GetC0() * 0.1;
        skill.SetCrit(v14);

        let T1 = skill.GetT1();
        let v12 = skill.GetC0() * 0.08 * T1;

        let v7 = skill.GetLevel() - 15;
        let Level = skill.GetLevel();
        let v8 = norm(Level / 14.9) * 0.03 * v7;

        let v15 = skill.GetLevel() * 0.05 + 1.05 + v8 + v12;
        skill.SetRatio(v15);

        let res1 = player.GetRes1();
        let v13 = res1 * (skill.GetLevel() + 2);

        let T0 = skill.GetT0();
        let v10 = player.GetHp() * 0.05 * T0;

        let v16 = 10 * skill.GetLevel() + 244 + v10 + v13;
        // 额外附加自身气血上限10%攻击力，附加自身真气上限5%攻击力；
        skill.SetPlus(v16 + player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05);

        player.SetIgnoreblessed(20, 1000)

        player.SetPerform(1);
        player.SetPerform(0);
    }
}

/**
 * 2447  影祭
 * 取消下一击增伤效果；神佑状态调整为抵挡20次伤害，持续时间15秒
 */
class Skill2447 extends BaseHookSkillStub {

    constructor() {
        super(2447);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, skill.GetLevel());

        const v5 = skill.GetT0() <= 0 ? 15100 : 21100;
        const d = skill.GetT0() <= 0 ? 20 : 20 + skill.GetT0();
        player.SetBlessed(d, v5);

        player.SetUnsummonclone(120, 3);

        return true
    }

}

/**
 * 2446  影遁
 * 取消下一击增伤效果；神佑状态调整为抵挡20次伤害，持续时间15秒
 */
class Skill2446 extends BaseHookSkillStub {

    constructor() {
        super(2446);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let v2;
        if (skill.GetT3() <= 0)
            v2 = 0;
        else
            v2 = 120;
        const da = skill.GetT3();
        player.SetCleardebuff(v2, da);

        const v5 = skill.GetT0() <= 0 ? 15100 : 21100;
        const d = skill.GetT0() <= 0 ? 20 : 20 + skill.GetT0();
        player.SetBlessed(d, v5);

        player.SetDispel(120, 4141, 0, 0);
        return true
    }

}

/**
 * 5865  影祭III 《天空》
 * 取消下一击增伤效果；神佑状态调整为抵挡20次伤害，持续时间15秒
 */
class Skill5865 extends BaseHookSkillStub {

    constructor() {
        super(5865);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, 8);

        player.SetBlessed(20, 15100);

        player.SetUnsummonclone(120, 3);

        return true
    }

}

/**
 * 5866  影祭III  《碧海》
 * 海：神佑状态调整为抵挡30次伤害，并附带5秒真无敌效果
 */
class Skill5866 extends BaseHookSkillStub {

    constructor() {
        super(5866);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, 8);

        player.SetBlessed(30, 15100);
        player.SetInvincible(5000)

        player.SetUnsummonclone(120, 3);

        return true
    }

}

/**
 * 5867
 *
 */
class Skill5867 extends BaseHookSkillStub {

    constructor() {
        super(5867);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, 8);

        player.SetBlessed(20, 15100);

        player.SetUnsummonclone(120, 3);

        return true
    }
}

/**
 * 5868
 *
 */
class Skill5868 extends BaseHookSkillStub {

    constructor() {
        super(5868);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, 8);

        player.SetBlessed(20, 15100);

        player.SetUnsummonclone(120, 3);

        return true
    }
}

/**
 * 5779  天诛III 《天空》
 * 施法1秒
 * 附加气血攻击力调整为40%，攻击怪物目标时，有45%概率不进入冷却
 */
class Skill5779 extends BaseHookSkillStub {

    constructor() {
        super(5779);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            const r = zrand(100)
            if (r < 45) {
                return 0
            }
        }

        return super.GetCooldowntime(stub, skill, originFunc);
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v15 = (skill.GetLevel() + 2) * 0.01;
        let v3 = (skill.GetC0() * 0.1) + v15 + 0.1;
        if (player.GetHasbuff(4178)) {
            const v14 = (skill.GetLevel() + 2) * 0.01;
            v3 = (skill.GetC0() * 0.1) + v14;
        }

        const v18 = v3;
        skill.SetCrit(v18);
        const v19 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v19);
        const Level = skill.GetLevel();
        const v13 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v13);
        const v20 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v20);
        const v16 = player.GetHp() * 0.4;
        const v17 = (1000 * (Level + 1)) + v16;
        let v9 = 0.0;
        if (!player.GetHasbuff(4178) || player.GetHasbuff(4179)) {
            v9 = player.GetHp() * 0.1;
        }

        const C0 = skill.GetC0();
        const v21 = (C0 * player.GetMaxatk()) * 0.32 + (v9 + v17);
        skill.SetPlus(v21);
        player.SetPerform(1);
    }

}

/**
 * 5780  《碧海》
 *
 */
class Skill5780 extends BaseHookSkillStub {

    constructor() {
        super(5780);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            const r = zrand(100)
            if (r < 45) {
                return 0
            }
        }

        return super.GetCooldowntime(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v15 = (skill.GetLevel() + 2) * 0.01;
        let v3 = (skill.GetC0() * 0.1) + v15 + 0.1;
        if (player.GetHasbuff(4178)) {
            const v14 = (skill.GetLevel() + 2) * 0.01;
            v3 = (skill.GetC0() * 0.1) + v14;
        }

        const v18 = v3;
        skill.SetCrit(v18);
        const v19 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v19);
        const Level = skill.GetLevel();
        const v13 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v13);
        const v20 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v20);
        const v16 = player.GetHp() * 0.4;
        const v17 = (1000 * (Level + 1)) + v16;
        let v9 = 0.0;
        if (!player.GetHasbuff(4178) || player.GetHasbuff(4179)) {
            v9 = player.GetHp() * 0.1;
        }

        const C0 = skill.GetC0();
        const v21 = (C0 * player.GetMaxatk()) * 0.32 + (v9 + v17);
        skill.SetPlus(v21);
        player.SetPerform(1);
    }

}

/**
 * 5781
 * 地：额外追加当前真气值10%的伤害；极限消失概率调整为100%，时间10秒
 */
class Skill5781 extends BaseHookSkillStub {

    constructor() {
        super(5781);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            const r = zrand(100)
            if (r < 45) {
                return 0
            }
        }

        return super.GetCooldowntime(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v15 = (skill.GetLevel() + 2) * 0.01;
        let v3 = (skill.GetC0() * 0.1) + v15 + 0.1;
        if (player.GetHasbuff(4178)) {
            const v14 = (skill.GetLevel() + 2) * 0.01;
            v3 = (skill.GetC0() * 0.1) + v14;
        }

        const v18 = v3;
        skill.SetCrit(v18);
        const v19 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v19);
        const Level = skill.GetLevel();
        const v13 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v13);
        const v20 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v20);
        const v16 = player.GetHp() * 0.4 + player.GetMp() * 0.1;
        const v17 = (1000 * (Level + 1)) + v16;
        let v9 = 0.0;
        if (!player.GetHasbuff(4178) || player.GetHasbuff(4179)) {
            v9 = player.GetHp() * 0.1;
        }

        const C0 = skill.GetC0();
        const v21 = (C0 * player.GetMaxatk()) * 0.32 + (v9 + v17);
        skill.SetPlus(v21);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDarkness2(100, 5100)
        return true
    }
}

/**
 * 5782
 *
 */
class Skill5782 extends BaseHookSkillStub {

    constructor() {
        super(5782);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            const r = zrand(100)
            if (r < 45) {
                return 0
            }
        }

        return super.GetCooldowntime(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v15 = (skill.GetLevel() + 2) * 0.01;
        let v3 = (skill.GetC0() * 0.1) + v15 + 0.1;
        if (player.GetHasbuff(4178)) {
            const v14 = (skill.GetLevel() + 2) * 0.01;
            v3 = (skill.GetC0() * 0.1) + v14;
        }

        const v18 = v3;
        skill.SetCrit(v18);
        const v19 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v19);
        const Level = skill.GetLevel();
        const v13 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v13);
        const v20 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v20);
        const v16 = player.GetHp() * 0.4;
        const v17 = (1000 * (Level + 1)) + v16;
        let v9 = 0.0;
        if (!player.GetHasbuff(4178) || player.GetHasbuff(4179)) {
            v9 = player.GetHp() * 0.1;
        }

        const C0 = skill.GetC0();
        const v21 = (C0 * player.GetMaxatk()) * 0.32 + (v9 + v17);
        skill.SetPlus(v21);
        player.SetPerform(1);
    }
}

/**
 * 6886  赤乌·斗杀·曦日
 * 施法1秒；
 * 附加本体攻击150%，技能的天罡特效修改为气血超过90%
 * 本体两击额外追加自身当前气血值10%的伤害，暗影两击额外追加自身当前真气值5%的伤害
 * 攻击怪物目标时无冷却；
 * 额外附加气血真气上限和20%的攻击力；
 */
class Skill6886 extends BaseHookSkillStub {

    constructor() {
        super(6886);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        }

        return super.GetCooldowntime(stub, skill, originFunc);
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let bon = 0.0;
        let bon2 = 0.0;
        const player = skill.GetPlayerNice();
        const Hp = player.GetHp();
        const Maxhp = player.GetMaxhp();

        if (Hp > Math.floor(Maxhp * 0.9)) {
            bon2 = skill.GetLevel() * 0.4;
            bon = skill.GetLevel() * 0.1;
        }

        const v8 = skill.GetC0() * 0.1 + bon;
        skill.SetCrit(v8);
        const v9 = player.GetHp() * 0.22 + 3000.0;
        // 本体两击额外追加自身当前气血值10%的伤害，暗影两击额外追加自身当前真气值5%的伤害
        player.SetVar1(player.GetMp() * 0.05)
        skill.SetPlus(v9);
        const v10 = skill.GetC0() * 0.1 + 1.5 + bon2;
        skill.SetRatio(v10);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.2)
        player.SetIgnoreblessed(120,1200)//无视神佑1.2秒
        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let bon = 0.0;
        let bon2 = 0.0;
        const player = skill.GetPlayerNice();
        const Hp = player.GetHp();
        const Maxhp = player.GetMaxhp();

        if (Hp > Math.floor(Maxhp * 0.9)) {
            bon2 = skill.GetLevel() * 0.4;
            bon = skill.GetLevel() * 0.1;
        }

        const v8 = skill.GetC0() * 0.1 + bon;
        skill.SetCrit(v8);
        const v9 = player.GetHp() * 0.22 + 3000.0;
        // 本体两击额外追加自身当前气血值10%的伤害，暗影两击额外追加自身当前真气值5%的伤害
        player.SetVar1(player.GetMp() * 0.05)
        skill.SetPlus(v9);
        const v10 = skill.GetC0() * 0.1 + 1.5 + bon2;
        skill.SetRatio(v10);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.2)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetSecondattack(0.7, 0.3, player.GetVar1())
        return true
    }

}

/**
 * 飞升技能：冷却120秒
 */
class HuaiGuangFeiSheng extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            2642, 2650, 2666, 2682, 3826, 4605,//五行遁
            2644, 2652, 2668, 2684, 3828, 4607,//七里香
            2643, 2651, 2667, 2683, 3827, 4608,//八蛛矛
            4606, 2641, 2649, 2665, 2681, 3825//六觉身
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

/**
 * 2442  龙切
 * 影子用的？
 *
 * 龙切：
 * 攻击怪物目标时，额外附加一段。
 * 额外附加本体攻击力50%，额外附加自身气血真气上限和15%的攻击力，每个连击点令此技能额外附加10%本体攻击力
 * （大影子释放也生效）
 */
class Skill2442 extends BaseHookSkillStub {

    constructor() {
        super(2442);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let r = skill.GetLevel() * 0.02 + 1.18;
        if (player.GetTargetTypeIsMob()) {
            r = r + skill.GetC0() * 0.1 + 0.5
        }

        skill.SetRatio(r);

        let v16 = skill.GetT1() * 0.01;
        skill.SetCrit(v16);
        let v14 = 30 * skill.GetLevel() + 260;
        let Res1 = player.GetRes1();
        let v5 = player.GetRes2() + Res1;
        let v7 = player.GetRes3() + v5;
        let v9 = player.GetRes4() + v7;
        let v13 = (v9 + player.GetRes5()) * 0.05;
        let Level = skill.GetLevel();
        let v17 = (Level + skill.GetT0()) * v13 + v14;
        skill.SetPlus(v17);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.15)
        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

}

/**
 * 5524 龙切
 * 攻击怪物目标时，额外附加一段。
 * 额外附加本体攻击力50%，额外附加自身气血真气上限和15%的攻击力，每个连击点令此技能额外附加10%本体攻击力
 * （大影子释放也生效）
 */
class Skill5524 extends BaseHookSkillStub {

    constructor() {
        super(5524);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let r = skill.GetLevel() * 0.04 + 1.16;
        if (player.GetTargetTypeIsMob()) {
            r = r + skill.GetC0() * 0.1 + 0.5
        }

        skill.SetRatio(r);

        let v16 = skill.GetT1() * 0.01;
        skill.SetCrit(v16);
        let T0 = skill.GetT0();
        let v3 = T0 + skill.GetLevel();

        let Res5 = player.GetRes5();
        let v7 = player.GetRes4() + Res5;
        let v9 = player.GetRes3() + v7;
        let v11 = player.GetRes2() + v9;
        let v14 = (v3 * 2 * (v11 + player.GetRes1())) * 0.05;
        let v17 = (60 * skill.GetLevel() + 520) + v14;
        skill.SetPlus(v17);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.15)

        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }
}

/**
* 2693  龙切II
* 攻击怪物目标时，额外附加1段。额外附加本体攻击力50%，额外附加自身气血真气上限和15%的攻击力，每个连击点令此技能额外附加10%本体攻击力
*/
class Skill2693 extends BaseHookSkillStub {

    constructor() {
        super(2693);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Res5 = player.GetRes5();
        let Res4 = player.GetRes4();
        let Res3 = player.GetRes3();
        let Res2 = player.GetRes2();
        let v9 = Res4 + Res3 + Res2 + player.GetRes1() + Res5;
        player.SetVar1(v9);

        let T0 = skill.GetT0();
        let v16 = T0 + skill.GetT2();
        let v17 = player.GetVar1() * 0.05 * v16;
        skill.SetPlus(v17);

        let v18 = skill.GetLevel() * 0.02 + 1.09;
        if (player.GetTargetTypeIsMob()) {
            v18 = v18 + skill.GetC0() * 0.1 + 0.5
        }

        skill.SetRatio(v18);

        let v19 = skill.GetT1() * 0.01;
        skill.SetCrit(v19);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.15)

        player.SetPerform(1);
        player.SetPerform(0);
    }

}

export class HuaiGuangSkillList {
    constructor() {
        new Skill2416()
        new Skill2426()
        new Skill2435()
        new Skill2431()
        new Skill2449()
        new Skill2429()
        new Skill2412()
        new Skill2418()
        new Skill2427()
        new Skill2445()
        new Skill2424()
        new Skill2691()
        new Skill2443()
        new Skill2423()
        new Skill2434()
        new Skill2444()
        new Skill2453()
        new Skill2452()
        new Skill2417()
        new Skill2436()
        new Skill2701()
        new Skill2702()
        new Skill3047()
        new Skill3095()
        new Skill3143()
        new Skill3048()
        new Skill3096()
        new Skill3144()
        new Skill7118()
        new Skill3046()
        new Skill3094()
        new Skill3142()
        new Skill2447()
        new Skill2446()
        new Skill5865()
        new Skill5866()
        new Skill5867()
        new Skill5868()
        new Skill5779()
        new Skill5780()
        new Skill5781()
        new Skill5782()
        new Skill6886()
        new HuaiGuangFeiSheng()
        new Skill2442()
        new Skill5524()
        new Skill2693()
    }
}