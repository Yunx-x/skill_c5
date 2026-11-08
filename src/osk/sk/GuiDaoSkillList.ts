import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 1109  怨念羁縻
 * 36秒内技能伤害增加8%*level，自身致命一击率增加2.5%*level，致命一击伤害增加10%*level
 * 保护自身有利状态不被一般类技能清除，持续1*Level + 7秒
 */
class Skill1109 extends BaseHookSkillStub {

    constructor() {
        super(1109);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 3000 * skill.GetLevel() + 12100;
        player.SetPowerless(100, t);

        const ta = 3000 * skill.GetLevel() + 12100;
        let tb = skill.GetLevel() * 0.08;
        tb = skill.GetT0() * 0.05 + tb;
        player.SetIncskilldamage(tb, ta, 1);

        player.SetInccritrate(ta, 0.025 * skill.GetLevel(), 1);
        player.SetInccrithurt(120, 0.1 * skill.GetLevel(), ta, 1)

        tb = 3000 * skill.GetLevel() + 12100;
        player.SetImmunesilent(tb);
        return true
    }

}

/**
 * 1114  归灵秘印
 * 新增效果：最初 10 秒内，自身获得“蚩魂”效果，免疫白字伤害30%
 * 真气盾总量调整为自身真气的30倍，用真气抵消伤害的比例调整为90%
 * 真气盾消失时，解除自身3个不利状态，同时获得3秒无敌效果
 */
class Skill1114 extends BaseHookSkillStub {

    constructor() {
        super(1114);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        const d = 5 * skill.GetT0() + 33;
        const v3 = 3000 * skill.GetLevel() + 27000;
        const da = v3 + 3000 * skill.GetT1() + 100;
        let db = skill.GetLevel() * 0.01;
        db = skill.GetT0() * 0.01 + db;
        player.SetAttack2mp(d, db, da);

        const v7 = 3000 * skill.GetLevel() + 27000;
        const time = v7 + 3000 * skill.GetT1() + 100;

        const amount = 30 * player.GetMaxmp() + 1;
        player.SetMagicshield(0.9, amount, time);

        player.SetChihun(120, 10000, 0.1, 0.1, 1);
        player.SetSlant(120, 10000, 0.3)

        player.SetCleardebuff(120, 3)
        player.SetInvincible(3000)
        player.SetShadowhide(120, 0, 0, 10000, 9)
        return true
    }

}

/**
 * 3360  归灵秘印 真气盾消失时，解除自身3个不利状态，同时获得3秒无敌效果
 */
class Skill3360 extends BaseHookSkillStub {

    constructor() {
        super(3360);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 3)
        player.SetInvincible(3000)
        if (player.GetSkilllevel(2052) > 0) {
            player.SetAddspeed(120, 5000, 5, 1)
        }

        return true
    }

}

/**
 * 1108  蚀心毒蛊
 * 为目标种虫蛊，持续7秒。冷却13秒
 * 虫蛊：调整为令目标降低自身气血40%的气血上限，持续10秒，最多不超过目标气血上限的一半；额外增加令玩家全身瘙痒。
 */
class Skill1108 extends BaseHookSkillStub {

    constructor() {
        super(1108);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 13000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetTimedSkill(120, 7074, 1, 7000, 1);
        const ta = Math.floor(player.GetMp() * 0.002 + 1.0);
        player.SetAdddefence(100, 8100, ta, 5);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let d = (1.0 - player.GetLevel() * 0.002) * 100.0;
        d = ((skill.GetT2() * 0.1 + 1.0) * d);

        d = Math.floor(-2000 * skill.GetT2() + 18000);

        const da = skill.GetLevel() * 1.728;
        const db = skill.GetLevel() * da;
        const dc = skill.GetLevel() * 22.4 + db + 311.68;
        let dd = ((skill.GetT1() * 0.1 + 1.0) * dc);

        const v19 = skill.GetT1() * 0.005;
        const v20 = skill.GetLevel() * v19;
        dd = player.GetHp() * v20 + dd;

        const de = skill.GetLevel() * 1.728;
        const df = skill.GetLevel() * de;
        let dg = (skill.GetLevel() * 22.4 + df + 311.68) * 0.1;
        dg = skill.GetT0() * dg;

        if (player.SetHpleak(d, d, dd, dg, 1)) {
            const dh = 6020 * skill.GetT0();
            player.SetSlow(9999, 0.2, dh, 1);
        }

        player.SetInsectPoison(120, 7000);
        return true
    }
}

/**
 * 7074  清虫蛊
 *（虫蛊触发）
 * 虫蛊：调整为令目标降低自身气血40%的气血上限，持续10秒，最多不超过目标气血上限的一半；额外增加令玩家全身瘙痒。
 */
class Skill7074 extends BaseHookSkillStub {

    constructor() {
        super(7074);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let p = 0
        if (player.GetHasbuff(9368)) {
            p = 120
        }

        let var1 = player.GetVar(1);
        let hp_drop = var1 * 0.4;
        let maxhp = player.GetMaxhp();
        if (hp_drop > maxhp * 0.5) {
            hp_drop = maxhp * 0.5;
        }

        player.SetSubhp2(p, hp_drop, 99, 10100);
        player.SetDispel(120, 9368, 0, 0);
        return true
    }

}

/**
 * 1188  鬼蜮
 * 前2*level秒内自身处于真无敌效果，4*level进入神佑状态，免疫30次伤害。
 * 有50%几率清除自身冷却
 *
 * 玄烛·鬼蜮·萤炬/皓月/曦日  延长鬼域神佑时间5,10,15秒，增加鬼蜮神佑次数1,2,3*level次
 */
class Skill1188 extends BaseHookSkillStub {

    constructor() {
        super(1188);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        if (zrand(100 >= 50)) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetInvincible(skill.GetLevel() * 2000);

        let skillLevel6851 = player.GetSkilllevel(6851);
        let skillLevel6852 = player.GetSkilllevel(6852);
        let skillLevel6853 = player.GetSkilllevel(6853);

        let star_duration_bonus = 0;
        let count = 0;
        if (skillLevel6851 > 0) {
            star_duration_bonus = 5000;
            count = skillLevel6851
        } else if (skillLevel6852 > 0) {
            star_duration_bonus = 10000;
            count = skillLevel6852 * 2
        } else if (skillLevel6853 > 0) {
            star_duration_bonus = 15000;
            count = skillLevel6853 * 3
        }

        const ta = 4000 * skill.GetLevel() + star_duration_bonus;
        const tb = count + 20.0;
        player.SetBlessed(tb, ta);
        return true
    }

}

/**
 * 1117  缚足蛇蛊
 * 冷却13秒，为目标种蛇蛊，持续7秒。清除目标有利状态2个
 *
 * 蛊之原罪会使其触发伤蛊
 * T3蛊之原罪:调整为10%*level触发伤蛊效果，积累记录伤害数值20%
 */
class Skill1117 extends BaseHookSkillStub {

    constructor() {
        super(1117);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 13000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetTimedSkill(120, 7075, 1, 7000, 1)
        return true
    }


    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let da = 1.0 - player.GetLevel() * 0.002;
        let db = (skill.GetT3() * 0.1 + da) * 100.0;
        const p = (skill.GetT2() * 0.1 + 1.0) * db;

        const t = Math.floor(-2000 * skill.GetT2() + 32000);

        let v7;
        if (skill.GetLevel() <= 13) {
            const dh = skill.GetLevel() * 6.27;
            const di = skill.GetLevel() * dh;
            const dj = (skill.GetLevel() << 7) + di + 1837.0;
            let dk = (skill.GetT1() * 0.1 + 1.0) * dj;
            const v31 = skill.GetLevel() * 0.005;
            const v32 = skill.GetT1() * v31;
            v7 = player.GetHp() * v32 + dk;
        } else {
            const dc = (skill.GetLevel() - 13) * 6.27;
            const dd = (skill.GetLevel() - 13) * dc;
            const de = ((skill.GetLevel() - 13) << 7) + dd + 1837.0;
            let df = (skill.GetT1() * 0.1 + 1.0) * de;
            const v29 = (skill.GetLevel() - 13) * 0.005;
            const v30 = skill.GetT1() * v29;
            const dg = player.GetHp() * v30 + df;
            v7 = (skill.GetT4() * 0.4 + 1.0) * dg;
        }

        let d;
        if (skill.GetLevel() <= 13) {
            const dq = skill.GetLevel() * 6.27;
            const dr = skill.GetLevel() * dq;
            d = ((skill.GetLevel() << 7) + dr + 1837.0) * 0.1;
        } else {
            const dm = (skill.GetLevel() - 13) * 6.27;
            const dn = (skill.GetLevel() - 13) * dm;
            const dp = ((skill.GetLevel() - 13) << 7) + dn + 1837.0;
            d = (skill.GetT4() * 0.4 + 1.0) * dp;
        }

        const ds = skill.GetT0() * d;
        player.SetHpleak2(p, v7, ds, t, 2);

        let v15;
        if (skill.GetLevel() <= 13)
            v15 = 5 * skill.GetLevel();
        else
            v15 = 5 * (skill.GetLevel() - 13);

        const dt = v15 * (skill.GetT0() + 1);
        player.SetValue(dt);
        player.SetSubanti(120, dt, 32100, 1);

        const du = 5 * skill.GetT3();
        const dv = skill.GetLevel() * 0.01;
        const T3 = skill.GetT3();
        const dw = norm(T3 / 0.9) * dv;
        player.SetAccumdamage(du, dw, 2 * player.GetVar1(), 10000);

        player.SetSnakePoison(120, 7000);
        player.SetClearbuff(120, 2)
        return true
    }

}

/**
 * 1094  百鬼夜行
 * 冷却减少60秒
 * T0天书-掩月幕，提高速度100%
 */
class Skill1094 extends BaseHookSkillStub {

    constructor() {
        super(1094);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 60000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let v3 = 2000 * skill.GetLevel() + 10100;
        v3 += 2000 * skill.GetT2();
        let v5 = zrand(100);
        let T2 = skill.GetT2();
        let t = v3 * (norm(v5 / (-10 * T2 + 100)) + 1);
        let ta = skill.GetLevel() * 0.4 + 0.2;
        ta = ((skill.GetT0() + 1.0) * ta);
        player.SetAddspeed(100, t, ta, 1);

        let v11 = 2000 * skill.GetLevel() + 10100;
        let v12 = v11 + 2000 * skill.GetT2();
        let v13 = zrand(100);
        let v14 = skill.GetT2();
        const time = (v12 * (norm(v13 / (-10 * v14 + 100)) + 1));

        let v17 = 4 * skill.GetLevel();
        let v18 = 4 * skill.GetLevel();
        ta = (v17 + v18 * skill.GetT0());
        player.SetAddanti(ta, time, 1);
        return true
    }

}

/**
 * 1102  护法鬼语
 * 释放后获得抵挡20次伤害的神佑效果，持续10秒
 *
 * 6856玄烛·护法鬼语·曦日，免疫嘲讽的时间加强为15秒；额外10秒内保护自身有利状态不被清除
 * 6856玄烛·护法鬼语·曦日：新增效果 技能躲闪提升45点，增加减免致命一击率15%，持续时间25秒
 */
class Skill1102 extends BaseHookSkillStub {

    constructor() {
        super(1102);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, 4);
        player.SetBlessed(20, 10000)

        if (player.GetSkilllevel(6854) > 0
            || player.GetSkilllevel(6855) > 0
            || player.GetSkilllevel(6856) > 0) {
            let time = 3100;
            if (player.GetSkilllevel(6855) > 0) {
                time = 6100;
            }

            if (player.GetSkilllevel(6856) > 0) {
                time = 15100;
            }

            player.SetImmunetaune(120, time);
        }

        player.SetIncskilldodge(120, 0.45, 25000, 9)

        if (player.GetSkilllevel(6856) > 0) {
            player.SetDecfatalratio(120, 0.15, 25000, 9)
            player.SetBuffClearImmune(120, 10000)
        }

        return true
    }
}

/**
 * 1115  怨鬼心魔
 * 目标15秒内被暴击伤害提升80%
 */
class Skill1115 extends BaseHookSkillStub {

    constructor() {
        super(1115);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //增加被暴击伤害
        player.SetIncfatalhurt(120, 0.08 * skill.GetLevel(), 1510 * skill.GetLevel(), 1)
        return true
    }

}

/**
 * 1130  巫毒斗瘴
 * 阵法期间，降低目标技能命中15点
 */
class Skill1130 extends BaseHookSkillStub {

    constructor() {
        super(1130);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const d = skill.GetLevel() * 0.02 + 0.03;
        player.SetDecskillaccu(100, d, 4100, 1);
        return true
    }
}

/**
 * 1097 魔魂姿态
 * 天书-奠魂曲:删除切换姿态后增加下一击伤害的效果
 */
class Skill1097 extends BaseHookSkillStub {

    constructor() {
        super(1097);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const v2 = 90 * skill.GetLevel();
        const v3 = 120 * skill.GetLevel();
        const d = (v2 + v3 * skill.GetLevel());
        const prob = (skill.GetT1() * 0.15 + 1.0) * d;
        const player = skill.GetVictimNice();
        const ratio = 15 * skill.GetLevel();
        const amount = 11 * skill.GetLevel() - 93;
        const value = 15 * skill.GetLevel();
        player.SetGhostform(prob, 0, value, ratio, amount);

        //删除
        // player.SetProbability(120.0);
        // const time = 6000 * skill.GetT1();
        // player.SetTime(time);
        // const ratio2 = skill.GetT1() * 0.15;
        // player.SetRatio(ratio2);
        // player.SetNingjin(1);

        return true
    }

}

/**
 * 1595  魔魂姿态II
 * 10级时，提高气血比例调整为5%（之前是1.2%）
 * 天书-奠魂曲:删除切换姿态后增加下一击伤害的效果
 */
class Skill1595 extends BaseHookSkillStub {

    constructor() {
        super(1595);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const v2 = 180 * skill.GetLevel();
        const v3 = 240 * skill.GetLevel();
        const d = v2 + v3 * skill.GetLevel();
        const player = skill.GetVictimNice();

        let hp = player.GetHp() * 0.012;
        if (skill.GetLevel() >= 10) {
            hp = player.GetHp() * 0.05;
        }

        const da = skill.GetLevel() * hp + d;
        const prob = (skill.GetT1() * 0.3 + 1.0) * da;
        const ratio = 35 * skill.GetLevel();
        const value = 40 * skill.GetLevel();
        player.SetGhostform(prob, 0, value, ratio, 0.0);
        return true
    }
}

/**
 * 1171  天书-灭杀
 * 施法1秒,
 * 每段额外附加自身气血上限 10%*level 的攻击力,
 * 第一击额外附加50%爆伤，
 * 第二击额外附加5%暴击率，
 * 第三击额外附加25%暴击率
 *
 * 灭杀 施法1秒，每击附加自身气血上限20%，自身真气上限10%，自身防御8倍攻击力，无视神佑
 */
class Skill1171 extends BaseHookSkillStub {

    constructor() {
        super(1171);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 267
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 266
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 267
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetCrit(0.1);
        skill.SetCrithurt(0.5);
        const player = skill.GetPlayerNice();
        skill.SetPlus(player.GetMaxhp() * 0.2 + player.GetMaxmp() * 0.1 + player.GetDef() * 8);
        player.SetIgnoreblessed(120, 1100)
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetCrithurt(1.0);
        skill.SetCrit(0.05);
        const player = skill.GetPlayerNice();
        skill.SetPlus(player.GetMaxhp() * 0.2 + player.GetMaxmp() * 0.1 + player.GetDef() * 8);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetCrit(0.25);
        skill.SetCrithurt(1.0);
        const player = skill.GetPlayerNice();
        skill.SetPlus(player.GetMaxhp() * 0.2 + player.GetMaxmp() * 0.1 + player.GetDef() * 8);
        player.SetPerform(0);
    }

}

/**
 * 2052  归灵秘印II
 * 冷却90秒，削减自身受到伤害5%*level。30秒内增加自身技能躲闪60点
 */
class Skill2052 extends BaseHookSkillStub {

    constructor() {
        super(2052);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = skill.GetLevel() * 0.0601;
        player.SetDecfatalhurt(100, d, 90000, 2);
        const da = skill.GetLevel() * 0.05;
        player.SetDecdamage(120, da, 90000);
        player.SetIncskilldodge(120, 0.6, 30000, 8)
        return true
    }

}

/**
 * 2053  幽泉鬼步II
 * 冷却60秒。
 * 30秒内增加自身技能躲闪30点
 * 暴击率调整为20%，暴伤调整为80%，持续时间30秒
 *
 * 幽泉鬼步II、归灵秘印II、归去来<玄>的技能躲闪，可以叠加
 */
class Skill2053 extends BaseHookSkillStub {

    constructor() {
        super(2053);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetIncskilldodge(120, 0.03 * skill.GetLevel(), 3000 * skill.GetLevel(), 7)
        player.SetInccritrate(3000 * skill.GetLevel(), 0.02 * skill.GetLevel(), 1)
        player.SetInccrithurt(120, 0.08 * skill.GetLevel(), 3000 * skill.GetLevel(), 1)
        player.SetExorcism(100, -1, 3, 0)
        return true
    }

}

/**
 * 1597  燃魂劫火II
 * 冷却45秒
 */
class Skill1597 extends BaseHookSkillStub {

    constructor() {
        super(1597);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 45000
    }
}

/**
 * 2072  怨鬼心魔II
 * 清除目标4个有利状态
 */
class Skill2072 extends BaseHookSkillStub {

    constructor() {
        super(2072);
    }


    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const v11 = 1000 * skill.GetLevel() + 5000;
        const d = skill.GetLevel() * 0.02 + 0.1;

        player.SetSlow(600, d, v11, 1);

        const da = 10 * skill.GetLevel();
        player.SetClearbuff(da, 4);
        return true
    }
}

/**
 * 1571  百蛊啖魂II
 * 新增效果:
 * 40%概率无视目标神佑及真无敌，
 * 眩晕目标5秒，眩晕能力为自身晕抗+80.
 * 若自身技能命中高于目标：则禁食概率提高30%
 * 若自身攻击力高于目标：立即清空目标血槽内气血，令目标的血槽10秒内不能被恢复
 */
class Skill1571 extends BaseHookSkillStub {

    constructor() {
        super(1571);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(player.GetInk())
        player.SetVar2(player.GetSkillAttack())
        player.SetVar3(player.GetRes1() + 80)

        const r = zrand(100)
        if (r <= 40) {
            player.SetIgnoreblessed(120, 1000)
            player.SetIgnoreinvicible(120, 1000)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let d = 1.0 - player.GetLevel() * 0.002;
        let da = (skill.GetT4() * 0.03 + d) * 100.0;
        da = (skill.GetT3() * 0.1 + 1.0) * da;
        const t = -2000 * skill.GetT3() + 48000;
        let db = skill.GetLevel() * 8.960000000000001;
        let dc = skill.GetLevel() * db;
        let dd = skill.GetLevel() * 371.84 + dc + 8320.0;
        let de = (skill.GetT1() * 0.1 + 1.0) * dd;

        let v19 = skill.GetT1() * 0.005;
        let v20 = skill.GetLevel() * v19;
        de = player.GetHp() * v20 + de;
        player.SetHpleak(da, t, de, 0, 2);

        let v10 = 5 * skill.GetLevel();
        let pp = v10 + 3 * skill.GetT0();
        const tt = 1000 * skill.GetT2() + 4100;

        if (player.GetVar2() > player.GetSkillAttack()) {
            pp += 30
        }

        player.SetDiet(pp, tt);

        let v14 = zrand(100);
        const ppp = 600 * norm(v14 / 67);
        player.SetWrap(ppp, 3050 * skill.GetT2());

        player.SetDizzy(player.GetVar3(), 5000)
        if (player.GetVar1() > player.GetInk()) {
            player.SetAbolishbloodpool(120, 10000, 1, 1)
        }

        return true
    }

}

/**
 * 1569  蛊王姿态II
 * 切换至蛊王姿态II时，自身额外增加 20 点技能命中，持续 60 秒
 */
class Skill1569 extends BaseHookSkillStub {

    constructor() {
        super(1569);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetIncskillaccu(120, 0.2, 60000, 8)
        return true
    }

}

/**
 * 2073  森罗三笑II
 * 抄制伤害公式——
 * 第一击追加双方气血差1倍的白字伤害，
 * 第二击追加双方气血差2倍的白字伤害，
 * 第三击追加双方气血差3倍的白字伤害；
 * 1秒施法，30秒冷却
 */
class Skill2073 extends BaseHookSkillStub {

    constructor() {
        super(2073);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 298
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 234
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 234
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 234
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar3(player.GetHp())
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar3(player.GetHp())
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar3(player.GetHp())
        super.Calculate4(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetTypeIsMob()) {
            return true
        }

        const hp = player.GetHp()
        const hurt = Math.abs(hp - player.GetVar3()) + 1
        player.SetDirecthurt(120, hurt * player.GetVar1())
        return true
    }

}

/**
 * 3035  神鬼乱舞<玄>
 * 1166天书-回魂祭 新增影响神鬼乱舞<玄><煞><禅>，
 * 效果为对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
 *
 * 神鬼乱舞<玄><煞><禅>每次攻击附加的本体攻击力数值由3%*level调整为6%*level，
 * 攻击怪物目标时，每击额外附加自身气血上限10%加真气上限5%的攻击力，
 * 迷惘诅咒效果持续时间由12秒上调至20秒
 */
class Skill3035 extends BaseHookSkillStub {

    constructor() {
        super(3035);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        player.SetVar2(1);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const v17 = skill.GetT1() * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01;
        skill.SetCrit(v18);
        const Res1 = player.GetRes1();
        const v11 = level * 0.1;
        const v14 = (norm(level / 19.9) + v11) * Res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        player.SetVar2(2);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const v17 = skill.GetT1() * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01 + 0.01;
        skill.SetCrit(v18);
        const Res1 = player.GetRes1();
        const v11 = level * 0.1;
        const v14 = (norm(level / 19.9) + v11) * Res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        player.SetVar2(3);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const v17 = skill.GetT1() * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01 + 0.02;
        skill.SetCrit(v18);
        const Res1 = player.GetRes1();
        const v11 = level * 0.1;
        const v14 = (norm(level / 19.9) + v11) * Res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res5 = player.GetRes5();
        player.SetVar1(Res5);
        player.SetVar2(4);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const v17 = skill.GetT1() * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01 + 0.03;
        skill.SetCrit(v18);
        const Res1 = player.GetRes1();
        const v11 = level * 0.1;
        const v14 = (norm(level / 19.9) + v11) * Res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const level = skill.GetLevel();
        const d = level + 5;
        const da = level * 0.01001 + 0.04;
        player.SetDeccritrate(d, da, 20100,3);

        const db = level * 0.05;
        player.SetDecdodge(15, db, 12100, 1);

        const dc = level + 5;
        const maxMp = player.GetMaxmp();
        const dd = maxMp * 0.25 + 1.0;
        const var1 = player.GetVar1();
        const de = var1 * level;
        player.SetSubmp(dc, de, dd, 12100, 1);

        const v21 = zrand(100);
        const df = 650 * norm(v21 / (100 - level));
        player.SetSilent(df, 12100);

        const dg = level * 0.01;
        const dgAdjusted = Math.floor(level / 20) * 0.1 + dg;
        const var2 = player.GetVar2();
        player.SetDecskillaccu(15, dgAdjusted, 6100, var2);

        return true
    }
}

/**
 * 3083  神鬼乱舞<煞>
 * 每次攻击附加的本体攻击力数值由 3%*level 调整为 6%*level，
 * 攻击怪物目标时，每击附加攻击力自身气血真气上限和的25%；
 * 迷惘诅咒效果持续时间由12秒上调至 20秒
 * 1166天书-回魂祭 新增影响神鬼乱舞<玄><煞><禅>，
 * 效果为对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
 */
class Skill3083 extends BaseHookSkillStub {

    constructor() {
        super(3083);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        player.SetVar2(1);
        const level = skill.GetLevel();
        const t1 = skill.GetT1();
        const ratio = level * 0.06 + 1.0;
        const ratioAdjusted = t1 * 0.05 + ratio;
        skill.SetRatio(ratioAdjusted);
        const crit = level * 0.01;
        skill.SetCrit(crit);
        const res1 = player.GetRes1();
        const normValue = norm(level / 19.9);
        const v14 = (normValue + level * 0.1) * res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const plusValue = v9 * level + v16;
        skill.SetPlus(plusValue);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        player.SetVar2(2);
        const level = skill.GetLevel();
        const t1 = skill.GetT1();
        const ratio = level * 0.06 + 1.0;
        const ratioAdjusted = t1 * 0.05 + ratio;
        skill.SetRatio(ratioAdjusted);
        const crit = level * 0.01 + 0.01;
        skill.SetCrit(crit);
        const res1 = player.GetRes1();
        const normValue = norm(level / 19.9);
        const v14 = (normValue + level * 0.1) * res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const plusValue = v9 * level + v16;
        skill.SetPlus(plusValue);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        player.SetVar2(3);
        const level = skill.GetLevel();
        const t1 = skill.GetT1();
        const ratio = level * 0.06 + 1.0;
        const ratioAdjusted = t1 * 0.05 + ratio;
        skill.SetRatio(ratioAdjusted);
        const crit = level * 0.01 + 0.02;
        skill.SetCrit(crit);
        const res1 = player.GetRes1();
        const normValue = norm(level / 19.9);
        const v14 = (normValue + level * 0.1) * res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const plusValue = v9 * level + v16;
        skill.SetPlus(plusValue);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        player.SetVar2(4);
        const level = skill.GetLevel();
        const t1 = skill.GetT1();
        const ratio = level * 0.06 + 1.0;
        const ratioAdjusted = t1 * 0.05 + ratio;
        skill.SetRatio(ratioAdjusted);
        const crit = level * 0.01 + 0.03;
        skill.SetCrit(crit);
        const res1 = player.GetRes1();
        const normValue = norm(level / 19.9);
        const v14 = (normValue + level * 0.1) * res1;
        const v8 = 35 * level;
        const v15 = v8 * skill.GetT0() + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const plusValue = v9 * level + v16;
        skill.SetPlus(plusValue);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const level = skill.GetLevel();
        const d = level * 0.01001 + 0.04;
        player.SetDeccritrate(15, d, 20100,3);

        const da = level * 0.05;
        player.SetDecdodge(15, da, 12100, 1);

        const db = level + 5;
        const maxmp = player.GetMaxmp();
        const dc = maxmp * 0.25 + 1.0;
        const var1 = player.GetVar1();
        const dd = var1 * level;
        player.SetSubmp(db, dd, dc, 12100, 1);

        const rand = zrand(100);
        const de = 650 * norm(rand / (2 * (50 - level)));
        player.SetSilent(de, 12100);

        const df = level * 0.01;
        const dfAdjusted = Math.floor(level / 20) * 0.1 + df;
        const df2 = level * 0.02;
        player.SetParalysis(15, 6000, dfAdjusted, df2);

        return true
    }
}

/**
 * 3131  神鬼乱舞<禅>
 * 每次攻击附加的本体攻击力数值由 3%*level 调整为 6%*level，
 * 攻击怪物目标时，每击附加攻击力自身气血真气上限和的25%；
 * 迷惘诅咒效果持续时间由12秒上调至 20秒
 * 1166天书-回魂祭 新增影响神鬼乱舞<玄><煞><禅>，
 * 效果为对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
 */
class Skill3131 extends BaseHookSkillStub {

    constructor() {
        super(3131);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res1 = player.GetRes1();
        player.SetVar1(res1);
        player.SetVar2(1);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const t1 = skill.GetT1();
        const v17 = t1 * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01;
        skill.SetCrit(v18);
        const res1Double = player.GetRes1();
        const v11 = level * 0.1;
        const normValue = norm(level / 19.9);
        const v14 = (normValue + v11) * res1Double;
        const v8 = 35 * level;
        const t0 = skill.GetT0();
        const v15 = v8 * t0 + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res1 = player.GetRes1();
        player.SetVar1(res1);
        player.SetVar2(2);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const t1 = skill.GetT1();
        const v17 = t1 * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01 + 0.01;
        skill.SetCrit(v18);
        const res1Double = player.GetRes1();
        const v11 = level * 0.1;
        const normValue = norm(level / 19.9);
        const v14 = (normValue + v11) * res1Double;
        const v8 = 35 * level;
        const t0 = skill.GetT0();
        const v15 = v8 * t0 + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res1 = player.GetRes1();
        player.SetVar1(res1);
        player.SetVar2(3);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const t1 = skill.GetT1();
        const v17 = t1 * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01 + 0.02;
        skill.SetCrit(v18);
        const res1Double = player.GetRes1();
        const v11 = level * 0.1;
        const normValue = norm(level / 19.9);
        const v14 = (normValue + v11) * res1Double;
        const v8 = 35 * level;
        const t0 = skill.GetT0();
        const v15 = v8 * t0 + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res1 = player.GetRes1();
        player.SetVar1(res1);
        player.SetVar2(4);
        const level = skill.GetLevel();
        const v12 = level * 0.06 + 1.0;
        const t1 = skill.GetT1();
        const v17 = t1 * 0.05 + v12;
        skill.SetRatio(v17);
        const v18 = level * 0.01 + 0.03;
        skill.SetCrit(v18);
        const res1Double = player.GetRes1();
        const v11 = level * 0.1;
        const normValue = norm(level / 19.9);
        const v14 = (normValue + v11) * res1Double;
        const v8 = 35 * level;
        const t0 = skill.GetT0();
        const v15 = v8 * t0 + v14 + 860.0;
        const v16 = 45 * level + v15;
        const v9 = 2 * level;
        const v19 = v9 * level + v16;
        skill.SetPlus(v19);

        const hhj = player.GetSkilllevel(1166)
        //每击额外附加自身气血上限10%加真气上限5%的攻击力，
        let mobDmg = player.GetMaxhp() * 0.1 + player.GetMaxmp() * 0.05
        if (hhj > 0) {
            //对怪物目标额外附加自身真气上限 5%*level 的攻击力，额外附加 30%*level 本体攻击力
            mobDmg += player.GetMaxmp() * 0.05 * hhj + player.GetInk() * 0.3 * hhj
        }

        skill.SetMobBonusDamage(mobDmg);

        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();

        const level = skill.GetLevel();
        const d = level * 0.01001 + 0.04;
        victim.SetDeccritrate(15, d, 20100,3);

        const da = level * 0.05;
        victim.SetDecdodge(15, da, 12100, 1);

        const db = level + 5;
        const maxmp = victim.GetMaxmp();
        const dc = maxmp * 0.25 + 1.0;
        const var1 = victim.GetVar1();
        const dd = var1 * level;
        victim.SetSubmp(db, dd, dc, 12100, 1);

        const v21 = zrand(100);
        const de = 650 * norm(v21 / (2 * (50 - level)));
        victim.SetSilent(de, 12100);

        const df = level * 0.01;
        victim.SetInchurt3(15, df, 6000, 1.0);
        return true
    }
}

/**
 * 3036  天选道怨<玄>
 * 一丈红基础成功概率上调为5*level%，并且不再需要比较双方气血真气攻击力；
 * 一丈红的流血效果压缩到8秒；
 * 35%概率穿透无敌、神佑及部分抵御效果；
 * 40%概率随机不利0.4*level秒；
 * 最后一次流血，追加自身当前气血40%和自身当前真气30%。
 */
class Skill3036 extends BaseHookSkillStub {

    constructor() {
        super(3036);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar9() == 1) {
            const d = Math.floor(player.GetMp() * 0.004 + 1.0);
            player.SetAdddefence(100, 8100, d, 5);

            const da = Math.floor(5 * skill.GetLevel());
            const db = Math.floor(skill.GetLevel() * 0.1 + 0.5);
            player.SetDeathscatter(20, da, db, 0, 15, 20050);

            if (zrand(100) <= 35) {
                player.SetIgnoreinvicible(120, 1000);
                player.SetIgnoreblessed(120, 1000);
            }
        }
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar9() == 2) {
            const da = -1000 * skill.GetLevel() + 28000;
            const Var2 = player.GetVar2();
            const db = Var2 + player.GetMaxhp();
            const dc = player.GetVar4() * 0.5 + player.GetVar5() * 0.3;
            player.SetHpleak7(5 * skill.GetLevel(), da, db, dc, 0);
        } else {
            const dd = (1.0 - player.GetLevel() * 0.003) * 100.0;
            const chance = (skill.GetT2() * 0.1 + 1.0) * dd;
            const time = -2000 * skill.GetT2() + 60000;
            const de = skill.GetLevel() * 0.1 + 1.0;
            const df = player.GetVar2() * de;
            const dg = player.GetVar1() * (skill.GetLevel() * 0.8 + 2.0) + df;
            const dh = (skill.GetT0() * 0.1 + 1.0) * dg;
            const dj = (skill.GetT0() * 0.005) * (skill.GetLevel() * 0.1) * player.GetHp() + dh;
            const di = (skill.GetLevel() * 0.1 + 1.8) * player.GetVar1();
            player.SetHpleak3(chance, dj, di, time, 1);

            const dj2 = (1.0 - player.GetLevel() * 0.002) * (skill.GetLevel() + 5) * skill.GetLevel();
            player.SetDrainmagic(dj2, 1.0);

            const dj3 = 5 * skill.GetLevel();
            const time2 = 2000 * skill.GetT1() + 12000;
            const dk = player.GetVar1() * 0.05 * skill.GetLevel();
            player.SetSubdefence(dj3, dk, time2, 1);

            const dk2 = skill.GetLevel() * 2;
            const time3 = 400 * skill.GetLevel() + 2000 * skill.GetT1();
            player.SetRandcurse(dk2, 0.2, 0.2, time3);
        }

        return true
    }

}

/**
 * 3084  天选道怨<煞>
 * 一丈红基础成功概率上调为5*level%，并且不再需要比较双方气血真气攻击力
 */
class Skill3084 extends BaseHookSkillStub {

    constructor() {
        super(3084);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar9() == 1) {
            const d = Math.floor(player.GetMp() * 0.004 + 1.0);
            player.SetAdddefence(100, 8100, d, 5);

            const Level = skill.GetLevel();
            const v9 = 2 * (Level + 5);
            const da = v9 + 15 * norm(Level / 19.9);

            const v12 = skill.GetLevel();
            const db = norm(v12 / 19.9) + 1;
            player.SetCleardebuff(da, db);

            if (zrand(100) <= 35) {
                player.SetIgnoreinvicible(120, 1000);
                player.SetIgnoreblessed(120, 1000);
            }
        }
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar9() == 2) {
            const da = -1000 * skill.GetLevel() + 28000;
            const Var2 = player.GetVar2();
            const db = Var2 + player.GetMaxhp();
            const dc = player.GetVar4() * 0.5 + player.GetVar5() * 0.3;
            player.SetHpleak7(5 * skill.GetLevel(), da, db, dc, 0);
        } else {
            const dd = (1.0 - player.GetLevel() * 0.003) * 100.0;
            const chance = (skill.GetT2() * 0.1 + 1.0) * dd;
            const time = -2000 * skill.GetT2() + 60000;
            const de = skill.GetLevel() * 0.1 + 1.0;
            const df = player.GetVar2() * de;
            const dg = player.GetVar1() * (skill.GetLevel() * 0.8 + 2.0) + df;
            const dh = (skill.GetT0() * 0.1 + 1.0) * dg;
            const dj = (skill.GetT0() * 0.005) * (skill.GetLevel() * 0.1) * player.GetHp() + dh;
            const di = (skill.GetLevel() * 0.1 + 0.8) * player.GetVar1();
            player.SetHpleak3(chance, dj, di, time, 1);

            const dj2 = (skill.GetLevel() + 5) * (1.0 - player.GetLevel() * 0.002);
            player.SetDrainmagic(dj2, 1.0);

            const dj3 = 5 * skill.GetLevel();
            const time2 = 2000 * skill.GetT1() + 12000;
            const dk = player.GetVar1() * 0.05 * skill.GetLevel();
            player.SetSubdefence(dj3, dk, time2, 1);

            const dk2 = skill.GetLevel() * 2;
            const time3 = 400 * skill.GetLevel() + 2000 * skill.GetT1();
            player.SetRandcurse(dk2, 0.2, 0.2, time3);
        }

        return true
    }

}

/**
 * 3132  天选道怨<禅>
 * 一丈红基础成功概率上调为5*level%，并且不再需要比较双方气血真气攻击力
 * 35%概率无视目标神佑及真无敌；随机不利概率，由25%加强到40%；触发一丈红的基础概率，由30%加强至40%，
 * 若自身的攻击、气血、真气比目标高，则分别增加20%、20%、20%的一丈红概率，极限概率为100%；
 * 一丈红的流血效果，由16秒集中到8秒；
 * 最后一次流血，追加自身当前气血40%和自身当前真气30%。
 */
class Skill3132 extends BaseHookSkillStub {

    constructor() {
        super(3132);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar9() == 1) {
            const d = Math.floor(player.GetMp() * 0.004 + 1.0);
            player.SetAdddefence(100, 8100, d, 5);

            const da = Math.floor(5 * skill.GetLevel());
            const db = Math.floor(skill.GetLevel() * 0.1 + 0.5);
            player.SetDeathscatter(20, da, db, 0, 15, 20050);

            if (zrand(100) <= 35) {
                player.SetIgnoreinvicible(120, 1000);
                player.SetIgnoreblessed(120, 1000);
            }
        }
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar9() == 2) {
            const da = -1000 * skill.GetLevel() + 28000;
            const Var2 = player.GetVar2();
            const db = Var2 + player.GetMaxhp();
            const dc = player.GetVar4() * 0.5 + player.GetVar5() * 0.3;
            player.SetHpleak7(5 * skill.GetLevel(), da, db, dc, 0);
        } else {
            let dd = (1.0 - player.GetLevel() * 0.003) * 100.0;
            dd = ((skill.GetT2() * 0.1 + 1.0) * dd);
            let time = -2000 * skill.GetT2() + 60000;
            const de = skill.GetLevel() * 0.1 + 1.0;
            const df = player.GetVar2() * de;
            const v50 = skill.GetLevel() * 0.8 + 2.0;
            const dg = player.GetVar1() * v50 + df;
            let dh = (skill.GetT0() * 0.1 + 1.0) * dg;
            const v51 = skill.GetT0() * 0.005;
            const v52 = skill.GetLevel() * v51;
            dh = player.GetHp() * v52 + dh;
            let di = player.GetVar1();
            di = ((skill.GetLevel() * 0.1 + 0.8) * di);
            player.SetHpleak3(dd, dh, di, time, 1);

            let dj = (skill.GetLevel() + 5);
            dj = (1.0 - player.GetLevel() * 0.002) * dj;
            player.SetDrainmagic(dj, 1.0);

            dj = (5 * skill.GetLevel());
            const time2 = (2000 * skill.GetT1() + 12000);
            let dk = player.GetVar1() * 0.05 * skill.GetLevel();
            player.SetSubdefence(dj, dk, time2, 1);

            const dk2 = skill.GetLevel() * 2;
            const time3 = 400 * skill.GetLevel() + 2000 * skill.GetT1();
            player.SetRandcurse(dk2, 0.2, 0.2, time3);
        }

        return true
    }

}

/**
 * 3033  灭魂狂飙<玄>
 *
 * 施法1秒，瞬间冷却。
 * 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
 * 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
 * 仙阵：自身5秒内技能躲闪增加20点
 * 魔阵：5秒内降低范围内当前气血5%
 *
 * 6859玄烛·血雾·曦日  被动气血上限增加调整为5%*level，被动增加灭魂狂飙极效几率调整为固定30%
 */
class Skill3033 extends BaseHookSkillStub {

    constructor() {
        super(3033);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Level = skill.GetLevel();
        const v12 = Level * 0.15 + 1.0;
        const v10 = norm(Level / 14.9) * 0.03;
        const v13 = (Level - 15) * v10 + v12;
        const v14 = skill.GetT1() * 0.06 + v13;
        const v15 = skill.GetT4() * 0.02 + v14;
        const v11 = skill.GetT1() * 0.06;
        const v4 = zrand(5 * skill.GetT1() + 100);
        const v18 = norm(v4 / 100) * v11 + v15;
        skill.SetRatio(v18);

        const v16 = skill.GetT3() * 0.01;
        const v19 = norm(skill.GetT4() / 9.9) * 0.03 + v16;
        skill.SetCrit(v19);

        const v17 = Level * 0.05;
        const v20 = skill.GetT3() * 0.1 + v17;
        skill.SetCrithurt(v20);

        const v6 = 50 * Level + 750;
        const v7 = 2 * Level;
        const v9 = v6 + v7 * Level;
        skill.SetPlus(v9 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)
        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Level = skill.GetLevel();
        const v12 = Level * 0.15 + 1.0;
        const v10 = norm(Level / 14.9) * 0.03;
        const v13 = (Level - 15) * v10 + v12;
        const v14 = skill.GetT1() * 0.06 + v13;
        const v15 = skill.GetT4() * 0.02 + v14;
        const v11 = skill.GetT1() * 0.06;
        const v4 = zrand(5 * skill.GetT1() + 100);
        const v18 = norm(v4 / 100) * v11 + v15;
        skill.SetRatio(v18);

        const v16 = skill.GetT3() * 0.01;
        const v19 = norm(skill.GetT4() / 9.9) * 0.03 + v16;
        skill.SetCrit(v19);

        const v17 = Level * 0.05;
        const v20 = skill.GetT3() * 0.1 + v17;
        skill.SetCrithurt(v20);

        const v6 = 50 * Level + 750;
        const v7 = 2 * Level;
        const v9 = v6 + v7 * Level;
        skill.SetPlus(v9 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let bonus_chance = 0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6857) > 0) {
            if (player.GetSkilllevel(1150) > 0) {
                bonus_chance = 1;
            }
        }

        if (player.GetSkilllevel(6858) > 0) {
            if (player.GetSkilllevel(1150) > 0) {
                bonus_chance = 2;
            }
        }

        if (player.GetSkilllevel(6859) > 0) {
            if (player.GetSkilllevel(1150) > 0) {
                bonus_chance = 30;
            }
        }

        const Level = skill.GetLevel();
        const v25 = Level * 0.15 + 1.0;
        const v23 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v23 + v25;
        const v27 = skill.GetT4() * 0.02 + v26;

        const v12 = zrand(108);
        const v28 = 3 * norm(v12 / 100.0) + v27;
        const v29 = skill.GetT1() * 0.06 + v28;
        const v24 = skill.GetT1() * 0.06;
        const T1 = skill.GetT1();
        const v14 = zrand(5 * T1 + 100 + bonus_chance);
        const v32 = norm(v14 / 100) * v24 + v29;
        skill.SetRatio(v32);

        const v30 = skill.GetT3() * 0.01;
        const T4 = skill.GetT4();
        const v33 = norm(T4 / 9.9) * 0.03 + v30;
        skill.SetCrit(v33);

        const v31 = Level * 0.05;
        const v34 = skill.GetT3() * 0.1 + v31;
        skill.SetCrithurt(v34);

        const v16 = 50 * Level + 750;
        const v17 = 2 * Level;
        const v18 = v17 * Level + v16;
        const v19 = 2 * Level;
        const playerLevel = player.GetLevel();
        const v22 = v18 + v19 * playerLevel;
        skill.SetPlus(v22 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, 0.2, 5000, 2)
        return true
    }
}

/**
 * 3081
 * 施法1秒，瞬间冷却。
 * 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
 * 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
 * 仙阵：自身5秒内技能躲闪增加20点
 * 魔阵：5秒内降低范围内当前气血5%
 */
class Skill3081 extends BaseHookSkillStub {

    constructor() {
        super(3081);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();
        const v11 = level * 0.15 + 1.0;
        const v9 = Math.floor(norm(level / 14.9) * 0.03);
        const v12 = (level - 15) * v9 + v11;
        const v13 = skill.GetT1() * 0.06 + v12;
        const v14 = skill.GetT4() * 0.02 + v13;
        const v10 = skill.GetT1() * 0.06;
        const T1 = skill.GetT1();
        const v4 = zrand(5 * T1 + 100);
        const v16 = Math.floor(norm(v4 / 100) * v10 + v14);
        skill.SetRatio(v16);
        const v17 = skill.GetT3() * 0.01;
        skill.SetCrit(v17);
        const v15 = level * 0.05;
        const v18 = skill.GetT3() * 0.1 + v15;
        skill.SetCrithurt(v18);
        const v5 = 50 * level + 750;
        const v6 = 2 * level;
        const v8 = v5 + v6 * level;
        skill.SetPlus(v8 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)
        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();
        const v11 = level * 0.15 + 1.0;
        const v9 = Math.floor(norm(level / 14.9) * 0.03);
        const v12 = (level - 15) * v9 + v11;
        const v13 = skill.GetT1() * 0.06 + v12;
        const v14 = skill.GetT4() * 0.02 + v13;
        const v10 = skill.GetT1() * 0.06;
        const T1 = skill.GetT1();
        const v4 = zrand(5 * T1 + 100);
        const v16 = Math.floor(norm(v4 / 100) * v10 + v14);
        skill.SetRatio(v16);
        const v17 = skill.GetT3() * 0.01;
        skill.SetCrit(v17);
        const v15 = level * 0.05;
        const v18 = skill.GetT3() * 0.1 + v15;
        skill.SetCrithurt(v18);
        const v5 = 50 * level + 750;
        const v6 = 2 * level;
        const v8 = v5 + v6 * level;
        skill.SetPlus(v8 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {

        let bonus_chance = 0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6857) > 0) {
            if (player.GetSkilllevel(1150) > 0)
                bonus_chance = 1;
        }

        if (player.GetSkilllevel(6858) > 0) {
            if (player.GetSkilllevel(1150) > 0)
                bonus_chance = 2;
        }

        if (player.GetSkilllevel(6859) > 0) {
            if (player.GetSkilllevel(1150) > 0)
                bonus_chance = 30;
        }

        const level = skill.GetLevel();
        const v24 = level * 0.15 + 1.0;
        const v22 = Math.floor(norm(level / 14.9) * 0.03);
        const v25 = (level - 15) * v22 + v24;
        const v26 = skill.GetT4() * 0.02 + v25;
        const v12 = zrand(108);
        const v27 = 3 * norm(v12 / 100.0) + v26;
        const v28 = skill.GetT1() * 0.06 + v27;
        const v23 = skill.GetT1() * 0.06;
        const T1 = skill.GetT1();
        const v14 = zrand(5 * T1 + 100 + bonus_chance);
        const v30 = Math.floor(norm(v14 / 100) * v23 + v28);
        skill.SetRatio(v30);
        const v31 = skill.GetT3() * 0.01;
        skill.SetCrit(v31);
        const v29 = level * 0.05;
        const v32 = skill.GetT3() * 0.1 + v29;
        skill.SetCrithurt(v32);

        const v15 = 50 * level + 750;
        const v16 = 2 * level;
        const v17 = v16 * level + v15;
        const v18 = 2 * level;
        const v21 = v17 + v18 * player.GetLevel();
        skill.SetPlus(v21 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        player.SetSubhp(120, player.GetHp() * 0.05, player.GetMaxhp() * 0.5, 5000, 1)
        return true
    }
}

/**
 * 3129
 */
class Skill3129 extends BaseHookSkillStub {

    constructor() {
        super(3129);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const level = skill.GetLevel();
        const v11 = level * 0.15 + 1.0;
        const v9 = Math.floor(norm(level / 14.9) * 0.03);
        const v12 = (level - 15) * v9 + v11;
        const v13 = skill.GetT1() * 0.06 + v12;
        const v14 = skill.GetT4() * 0.02 + v13;
        const v10 = skill.GetT1() * 0.06;
        const T1 = skill.GetT1();
        const v4 = zrand(5 * T1 + 100);
        const v16 = Math.floor(norm(v4 / 100) * v10 + v14);
        skill.SetRatio(v16);
        const v17 = skill.GetT3() * 0.01;
        skill.SetCrit(v17);
        const v15 = level * 0.06;
        const v18 = skill.GetT3() * 0.1 + v15;
        skill.SetCrithurt(v18);

        const v5 = 50 * level + 750;
        const v6 = 2 * level;
        const v8 = v5 + v6 * level;
        skill.SetPlus(v8 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const level = skill.GetLevel();
        const v11 = level * 0.15 + 1.0;
        const v9 = Math.floor(norm(level / 14.9) * 0.03);
        const v12 = (level - 15) * v9 + v11;
        const v13 = skill.GetT1() * 0.06 + v12;
        const v14 = skill.GetT4() * 0.02 + v13;
        const v10 = skill.GetT1() * 0.06;
        const T1 = skill.GetT1();
        const v4 = zrand(5 * T1 + 100);
        const v16 = Math.floor(norm(v4 / 100) * v10 + v14);
        skill.SetRatio(v16);
        const v17 = skill.GetT3() * 0.01;
        skill.SetCrit(v17);
        const v15 = level * 0.06;
        const v18 = skill.GetT3() * 0.1 + v15;
        skill.SetCrithurt(v18);

        const v5 = 50 * level + 750;
        const v6 = 2 * level;
        const v8 = v5 + v6 * level;
        skill.SetPlus(v8 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let bonus_chance = 0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6857) > 0) {
            if (player.GetSkilllevel(1150) > 0)
                bonus_chance = 1;
        }

        if (player.GetSkilllevel(6858) > 0) {
            if (player.GetSkilllevel(1150) > 0)
                bonus_chance = 2;
        }

        if (player.GetSkilllevel(6859) > 0) {
            if (player.GetSkilllevel(1150) > 0)
                bonus_chance = 30;
        }

        const level = skill.GetLevel();
        const v24 = level * 0.15 + 1.0;
        const v22 = Math.floor(norm(level / 14.9) * 0.03);
        const v25 = (level - 15) * v22 + v24;
        const v26 = skill.GetT4() * 0.02 + v25;
        const v12 = zrand(108);
        const v27 = 3 * norm(v12 / 100.0) + v26;
        const v28 = skill.GetT1() * 0.06 + v27;
        const v23 = skill.GetT1() * 0.06;
        const T1 = skill.GetT1();
        const v14 = zrand(5 * T1 + 100 + bonus_chance);
        const v30 = Math.floor(norm(v14 / 100) * v23 + v28);
        skill.SetRatio(v30);

        const v31 = skill.GetT3() * 0.01;
        skill.SetCrit(v31);

        const v29 = level * 0.06;
        const v32 = skill.GetT3() * 0.1 + v29;
        skill.SetCrithurt(v32);

        const v15 = 50 * level + 750;
        const v16 = 2 * level;
        const v17 = v16 * level + v15;
        const v18 = 2 * level;
        const v21 = v17 + v18 * player.GetLevel();
        skill.SetPlus(v21 + player.GetMaxHPAndMP() * 0.1);
        // 附加攻击力调整为15%*level，每段攻击额外附加自身气血上限和真气上限总和10%的攻击力
        // 攻击怪物目标时，每一击附加10%自身气血和真气上限的玫击力，8%概率附加10%自身最大气血值的攻击力
        const r = zrand(100)
        let p = 0
        if (r <= 8) {
            p = player.GetMaxhp() * 0.1
        }

        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1 + p)

        player.SetPerform(0);
        player.SetPerform(0);
    }
}

/**
 * 1132  邪神傲世
 * 天书-奠魂曲增加下一击伤害的效果,效果移到邪神傲世、邪神傲世<玄><煞><禅>、邪神傲世Ⅲ
 * 增加伤害调整为level*0.2
 */
class Skill1132 extends BaseHookSkillStub {

    constructor() {
        super(1132);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }

}

/**
 * 3034  邪神傲世<玄><煞><禅>
 * 天书-奠魂曲增加下一击伤害的效果,效果移到邪神傲世、邪神傲世<玄><煞><禅>、邪神傲世Ⅲ
 * 增加伤害调整为level*0.2
 */
class Skill3034 extends BaseHookSkillStub {

    constructor() {
        super(3034);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }
}

/**
 * 3082
 *
 */
class Skill3082 extends BaseHookSkillStub {

    constructor() {
        super(3082);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }
}

/**
 * 3130
 *
 */
class Skill3130 extends BaseHookSkillStub {

    constructor() {
        super(3130);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }
}

/**
 * 5849  邪神傲世III《天空》
 * 邪神傲世III：自身攻击上限，气血上限，真气上限，防御上限提升效果调整为40%
 */
class Skill5849 extends BaseHookSkillStub {

    constructor() {
        super(5849);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetDispel(120, 4144, 4144, 4144);

        player.SetAoshi(120, 0.4, 0, 0, 30100, 1);

        player.SetDispel(120, 18, 19, 22);

        player.SetDelaycast(120, 50, 6192, 1, 1);

        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }

}

/**
 * 5850  碧海
 * 魔魂姿态下使用，30秒内自身暴击增加30%，爆伤增加120%
 */
class Skill5850 extends BaseHookSkillStub {

    constructor() {
        super(5850);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetAoshi(120, 0.4, 0, 0, 30100, 1);

        let v10;
        if (player.GetHasbuff(4154)) {
            v10 = 30000;
        } else {
            v10 = 0;
        }

        player.SetInccritrate(v10, 0.3, 0);
        player.SetInccrithurt(120, 1.2, v10, 0)

        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }

}

/**
 * 5851  大地
 * 新增效果：15秒内获得蚩魂状态，增加10%攻击和气血
 */
class Skill5851 extends BaseHookSkillStub {

    constructor() {
        super(5851);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetAoshi(120, 0.4, 0, 0, 30100, 1);
        player.SetChihun(120, 15000, 0.1, 0.1, 1)

        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }
}

/**
 * 5852  英雄
 * 自身10秒内无视群体技能攻击
 */
class Skill5852 extends BaseHookSkillStub {

    constructor() {
        super(5852);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetAoshi(120, 0.4, 0, 0, 30100, 1);
        player.SetImmuneslow(30100)
        player.SetAoEImmune(120, 10000)

        const dhqLevel = player.GetSkilllevel(1158)
        if (dhqLevel > 0) {
            const time = 6000 * dhqLevel;
            const ratio2 = dhqLevel * 0.2;
            player.SetNingjin(120, ratio2, time);
        }

        return true
    }
}

/**
 * 5765  森罗三笑III【大地】
 * 施法1秒。每段清除目标2个有利状态，并以自身气血20%降低目标气血上限
 */
class Skill5765 extends BaseHookSkillStub {

    constructor() {
        super(5765);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        const Var1 = player.GetVar1();
        const Res5 = player.GetRes5();
        const v8 = player.GetRes3() + Res5;

        let v18;
        if (Var1 <= v8 + player.GetRes1()) {
            v18 = 0.0;
        } else {
            const Level = skill.GetLevel();
            const v12 = player.GetVar1();
            const v14 = v12 - player.GetRes1();
            const v16 = v14 - player.GetRes3();
            v18 = 2 * (Level + 2 * (v16 - player.GetRes5()));
        }

        player.SetValue(v18);
        player.SetDirecthurt(100, v18);

        player.SetClearbuff(100, 2);

        const Var2 = player.GetVar2();
        player.SetSubhp(100, player.GetVar3() * 0.2, 1, 2100, Var2);

        const ta = player.GetVar4();
        const tb = 1100 * skill.GetLevel();
        player.SetWrap(ta, tb);

        return true
    }

}

/**
 * 5766  森罗三笑III【英雄】
 * 忽略抗性令目标难受
 */
class Skill5766 extends BaseHookSkillStub {

    constructor() {
        super(5766);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        const Var1 = player.GetVar1();
        const Res5 = player.GetRes5();
        const v8 = player.GetRes3() + Res5;

        let v18;
        if (Var1 <= v8 + player.GetRes1()) {
            v18 = 0.0;
        } else {
            const Level = skill.GetLevel();
            const v12 = player.GetVar1();
            const v14 = v12 - player.GetRes1();
            const v16 = v14 - player.GetRes3();
            v18 = 2 * (Level + 2 * (v16 - player.GetRes5()));
        }

        player.SetDirecthurt(100, v18);

        const ta = 1100 * skill.GetLevel();
        player.SetSleep(9999, ta, 0);

        player.SetInchurt(-1, 1, 2000);
        return true
    }

}

/**
 * 6850  赤乌·狱火炼志·曦日
 * 冷却时间降低30秒，删除几率清除鬼蜮和护法鬼语的冷却；20秒内100%概率免疫冰冻
 */
class Skill6850 extends BaseHookSkillStub {

    constructor() {
        super(6850);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetImmunelakemp(120, 12100);

        const d = 25 * skill.GetLevel();
        player.SetFrozenImmune(d, 20100);

        player.SetSetcooldown(120, 1123, 6849, 6848, 90000);
        return true
    }

}

/**
 * 1150  血雾
 * 6859玄烛·血雾·曦日  被动气血上限增加调整为5%*level，被动增加灭魂狂飙极效几率调整为固定30%
 */
class Skill1150 extends BaseHookSkillStub {

    constructor() {
        super(1150);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const skillLevel6857 = player.GetSkilllevel(6857);
        const skillLevel6858 = player.GetSkilllevel(6858);
        const skillLevel6859 = player.GetSkilllevel(6859);

        const star_lvl = skillLevel6857 + skillLevel6858 + skillLevel6859;

        if (star_lvl) {
            player.SetTime(1800000.0);
            const d = star_lvl * 0.05;
            player.SetInchp(d, 1800000, 8);
        }

        const level = skill.GetLevel();
        const v13 = 240 * level + 120;
        const v14 = 160 * level;
        const da = v13 + v14 * level;
        player.SetAddhp(1800000, da, 5);
        return true
    }

}

/**
 * 飞升技能改冷却
 * 逆魔：玄/霸/妙/梵/暗/焚 冷却时间调整至90秒
 * 碎刃：玄/霸/妙/梵/暗/焚 冷却时间调整至90秒
 * 幽击：玄/霸妙/梵/暗/焚 冷却时间调整至90秒
 * 沙铠：玄/霸/妙/梵/暗/焚 冷却时间调整至120秒
 *         1315, 1647, 1667, 1687, 1707, 3802,//沙铠
 */
class SkillHookFeiSheng extends QuickCoolDownList {
    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    getSkillList(): number[] {
        return [
            1314, 1646, 1666, 1686, 1706, 3801,//逆魔
            1316, 1648, 1668, 1688, 1708, 3803,//碎刃
            1317, 1649, 1669, 1689, 1709, 3804//幽击
        ]
    }

}

class SkillHookShaKai extends QuickCoolDownList {
    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    getSkillList(): number[] {
        return [
            1315, 1647, 1667, 1687, 1707, 3802,//沙铠
        ]
    }

}

export class GuiDaoSkillList {
    constructor() {
        new Skill1109()
        new Skill1114()
        new Skill3360()
        new Skill1108()
        new Skill7074()
        new Skill1188()
        new Skill1117()
        new Skill1094()
        new Skill1115()
        new Skill1102()
        new Skill1130()
        new Skill1097()
        new Skill1595()
        new Skill1171()
        new Skill2052()
        new Skill2053()
        new Skill1597()
        new Skill2072()
        new Skill1571()
        new Skill1569()
        new Skill2073()
        new Skill3035()
        new Skill3083()
        new Skill3131()
        new Skill3036()
        new Skill3084()
        new Skill3132()
        new Skill3033()
        new Skill3081()
        new Skill3129()
        new Skill1132()
        new Skill3034()
        new Skill3082()
        new Skill3130()
        new Skill5849()
        new Skill5850()
        new Skill5851()
        new Skill5852()
        new Skill5765()
        new Skill5766()
        new Skill6850()
        new Skill1150()
        new SkillHookFeiSheng()
        new SkillHookShaKai()

    }
}