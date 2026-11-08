import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";
import {getSkillStub} from "../../base/skill/HookSkillUtil";

/**
 * 289  浮光
 * 冷却60秒，瞬发；急速效果调整为12秒
 */
class Skill289 extends BaseHookSkillStub {

    constructor() {
        super(289);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        //天书无踪按3级算，减冷却45秒
        return -15000 * skill.GetT0() + 75000;
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetAddspeed(120, 12000, 6.5, 1);

        const v8 = 3000 * skill.GetT1();
        const t = (v8 + 2000 * skill.GetLevel() + 14100);
        const ta = Math.floor(skill.GetLevel() * 0.5 + 0.5);
        player.SetAddspeed(120, t, ta, 2);

        const tb = 20 * skill.GetT1();
        const tc = 8050 * skill.GetT1();
        const td = 15 * skill.GetT1();
        player.SetAddattack(tb, tc, td, 1);
        return true
    }

}

/**
 * 300   倾情
 * 冷却降低30秒，瞬发
 *
 * 6847玄烛·倾情·曦日：
 * 提升技能闪躲和增加自身减免致命一击伤害调整为0.12*level
 * 技能达到5级时，被动降低“倾情”冷却8秒，效果持续时间增加8秒，
 * 额外增加自身致命一击伤害30%，持续时间20秒（可与其他爆伤buff叠加）；
 *
 * 被动令幻真增加技能闪躲30点，额外增加自身减免致命一击伤害75%。
 */
class Skill300 extends BaseHookSkillStub {

    constructor() {
        super(300);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const xr = player.GetSkilllevel(6847)
        let t = 0
        if (xr >= 5) {
            t = 8000
        }

        return -7200 * skill.GetT1() + 60000 - t;
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = skill.GetT1() * 0.1 + 1.0;
        t = (1000 * skill.GetLevel() + 4000) * t + 100.0;
        const r = skill.GetLevel() * 0.01 + 0.04;

        const xr = player.GetSkilllevel(6847)
        if (xr >= 5) {
            t += 8000
        }

        player.SetIncattack3(120, r, t, 1);

        const Skilllevel = player.GetSkilllevel(6845);
        const v10 = player.GetSkilllevel(6846) + Skilllevel;
        const star_lvl = v10 + player.GetSkilllevel(6847);
        if (star_lvl > 0) {
            const ta = star_lvl * 0.12;
            player.SetDecfatalhurt(120, ta, 12100, 9);
            player.SetIncskilldodge(120, ta, 12100, 9);
        }

        if (star_lvl >= 5) {
            player.SetInccrithurt(120, 0.3, 20100, 7);
        }

        return true
    }
}

/**
 * 305   热血
 * 瞬发
 */
class Skill305 extends BaseHookSkillStub {

    constructor() {
        super(305);
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

}

/**
 * 299   激励
 * 瞬发，冷却60秒；下一次伤害提升调整为15*level
 * 6841玄烛·激励·曦日：降低冷却时间15秒；
 * 技能达到5级时，额外附带不悔效果
 *
 */
class Skill299 extends BaseHookSkillStub {

    constructor() {
        super(299);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6841) > 0) {
            return 45000
        }

        return 60000
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const T2 = skill.GetT2();
        const T4 = skill.GetT4();
        const d = 5216 * norm(T2) * (T4 / 7.9);
        const amount = 4100 * norm(T4 / 7.9);
        player.SetDispel(120, d, amount, 0);

        const da = norm(T4 / 7.9);
        const db = ((T2 * 0.1 + 1.0) * da);
        const t1 = (2000 * skill.GetLevel() + 14000) * db + 100.0;

        const Level = skill.GetLevel();
        const v12 = Level * Level;
        const ratio = (v12 * Level + 20);
        const v15 = zrand(100);
        const T5 = skill.GetT5();
        let dc = Math.floor(v15 / (-6 * T5 + 100)) + 1;
        let dd = (skill.GetT5() * 0.1 + 1.0) * dc;
        const v17 = 3 * Level;
        const v18 = Level * v17;
        const value = (v18 + 50 * Level) * dd;
        player.SetCrazy(ratio, 30 * Level, value, t1);

        const p2 = (skill.GetT4() / 7.9) * 120.0;
        const de = skill.GetT2() * 0.1 + 1.0;
        const v23 = norm(skill.GetT2());
        const t2 = (v23 * (8000 * skill.GetT2() + 14000)) * de + 100.0;
        const v25 = skill.GetLevel();
        const ratio2 = (v25 / 8 * skill.GetT2()) * 0.4;
        player.SetInccrithurt(p2, ratio2, t2, 6);

        const t3 = (2000 * skill.GetLevel() + 14000) * de + 100.0;
        const v31 = zrand(100);
        const T3 = skill.GetT3();
        let v33 = Math.floor(v31 / (-6 * T3 + 100)) + 1;
        let dg = (v33 * skill.GetT3()) * 0.01;
        dg = (skill.GetLevel() * 0.01 + dg + 0.04);
        player.SetIncattack(120, t3, dg, 2);

        const Skilllevel = player.GetSkilllevel(6839);
        const v40 = player.GetSkilllevel(6840) + Skilllevel;
        const star_lvl = v40 + player.GetSkilllevel(6841);
        if (zrand(100) <= 8 * (star_lvl + 5)) {
            player.RemoveMultiFilter(58);
        }
        let immu_dur = 0;
        if (player.GetSkilllevel(6839) > 0)
            immu_dur = 6000;
        if (player.GetSkilllevel(6840) > 0)
            immu_dur = 9000;
        if (player.GetSkilllevel(6841) > 0)
            immu_dur = 12000;
        if (immu_dur > 0) {
            const dh = immu_dur + 100;
            player.SetTime(dh);
            player.SetImmunesilent(1);
        }

        if (player.GetSkilllevel(6841) >= 5) {
            const t = 1000 * skill.GetLevel() + 15000;
            const ta = skill.GetLevel() * 0.0401;
            player.SetInccritrate(t, ta, 0);

            for (let i = 0; i < skill.GetLevel(); i++) {
                player.SetInccrithurt(120, t, 0.2, i + 1);
            }

            //增加技能躲闪
            let level = skill.GetLevel();
            let d = level * 0.15 + 0.05;
            player.SetIncskilldodge(120, d, t, 1);

            //增加攻击力
            player.SetAddattack(120, t, 1500, 1);

            //迅疾
            let d2 = level * 0.1;
            player.SetSwift(120, t, d2, 0.05);
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //清除定身
        player.SetClearwrap(120);

        //免疫定身
        const v20 = (skill.GetT(2) * 0.1 + 1.0);
        const t = ((2000 * skill.GetLevel() + 8000) * v20 + 100.0);
        player.SetImmunewrap(t);

        //下一击伤害增加
        const ta = ((skill.GetT(2) * 0.1 + 1.0) * 15000.0 + 100.0);
        const T0 = skill.GetT(0);
        const v19 = (T0 * skill.GetLevel() * 0.03);
        const tb = (skill.GetLevel() * 0.15 + v19 + 0.19);//调整为15%
        player.SetNingjin(120, tb, ta);

        //增加技能命中
        const T2 = skill.GetT(2);
        const v18 = norm(T2);
        const tc = ((T2 * 0.1 + 1.0) * v18 * 15000.0 + 100.0);
        const td = (T2 * 0.05001);
        player.SetIncskillaccu(120, td, tc, 2);
        return true
    }

}

/**
 * 293   止水
 * 瞬发，冷却60秒；可清除祈福III冷却
 * 天书-天籁：删除清除幻真技能冷却，改为清除倾情的冷却
 */
class Skill293 extends BaseHookSkillStub {

    constructor() {
        super(293);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        player.SetClearcooldown(289, 291, 302);

        const Level = skill.GetLevel();
        const d = (79 * Math.floor(Level / 5.9) + 220);
        const da = (20 * Math.floor(Level / 6.9) + 287);
        const db = (74 * Math.floor(Level / 7.9) + 218);
        player.SetClearcooldown(d, da, db);
        player.SetClearcooldown(300, 300, 218);
        player.SetClearcooldown(5841, 5842, 5843)
        player.SetClearcooldown(5844, 0, 0)
        const de = (4500 * skill.GetT2());
        player.SetTime(de);
        player.SetImmunesleep(1);
        return true
    }

}

/**
 * 770   不悔
 * 瞬发，冷却40秒，自身增加暴击率12%，暴击伤害60%，技能躲闪50点，攻击力1500，同时进入迅疾状态，移动速度增加50%，施法速度减少30%
 */
class Skill770 extends BaseHookSkillStub {

    constructor() {
        super(770);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const t = 1000 * skill.GetLevel() + 15000;
        const ta = skill.GetLevel() * 0.0401;
        player.SetInccritrate(t, ta, 0);

        for (let i = 0; i < skill.GetLevel(); i++) {
            player.SetInccrithurt(120, t, 0.2, i + 1);
        }

        //增加技能躲闪
        let level = skill.GetLevel();
        let d = level * 0.15 + 0.05;
        player.SetIncskilldodge(120, d, t, 1);

        //增加攻击力
        player.SetAddattack(120, t, 1500, 1);

        //迅疾
        let d2 = level * 0.1;
        player.SetSwift(120, t, d2, 0.05);

        return true
    }

}

/**
 * 530   幻真
 * 瞬发，10秒内免疫冰冻；
 * 释放后100%几率令自身5 * level+10秒内保护自身有利状态不被一般类技能清除，
 * 并免疫来自远方（16 - level 米）的伤害8 * level秒，
 * 8 * level秒内提升自身技能躲闪20 * level
 *
 * 6847玄烛·倾情·曦日：
 * 被动令幻真增加技能闪躲30点，额外增加自身减免致命一击伤害75%。
 *
 */
class Skill530 extends BaseHookSkillStub {

    constructor() {
        super(530);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetFrozenImmune(120, 10000)
        player.SetBuffClearImmune(120, 5000 * skill.GetLevel() + 10000)
        player.SetIntagible2(120, 16 - skill.GetLevel(), 8000 * skill.GetLevel())
        const xr = player.GetSkilllevel(6847)
        let xrAdd = 0
        if (xr >= 5) {
            xrAdd = 0.3
            player.SetDecfatalhurt(120, 0.75, 8000, 4)
        }

        player.SetIncskilldodge(120, 0.2 * skill.GetLevel() + xrAdd, 8000 * skill.GetLevel(), 1)
        return true
    }

}

/**
 * 531   秋波
 * 冷却35秒
 *
 * 1588  秋波II
 * 令秋波魅惑能力提升100点，魅惑时间提升4秒；
 *
 * 6844玄烛·秋波·曦日：
 * 清除倾情概率调整为20%*level，眩晕时间调整为6秒
 * 令秋波的魅惑能力增加，额外增加自身魅惑抗性的20%点数值；
 * 若魅惑目标成功，则会令目标进入“麻痹”状态，效果为10秒内移速，施法速度降低60%
 *
 */
class Skill531 extends BaseHookSkillStub {

    constructor() {
        super(531);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar6(player.GetSkilllevel(1588))
        super.Calculate2(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Var2 = player.GetVar2();
        const v5 = player.GetVar3() + Var2;
        const star_lvl = v5 + player.GetVar4();
        if (zrand(100) <= 20 * star_lvl) {
            player.SetClearcooldown(300, 300, 300);
        }
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let d = player.GetVar1();
        let da = 500 * skill.GetLevel() + 2000;

        if (player.GetVar6() > 0) {
            d += 100
            da += 4000
        }

        if (player.GetVar4() > 0) {
            d += (d * 0.2)
        }

        player.SetSilent(d, da);
        const db = 500 * skill.GetLevel() + 2000;
        const dc = skill.GetLevel() * 0.03 + 0.22;
        player.SetSlow(-1, dc, db, 1);
        player.SetSilent(d, 10);
        player.SetParalysis(-1, 10100, 0.6, 0.6);

        let stun = 0;
        if (player.GetVar2() > 0)
            stun = 2000;
        if (player.GetVar3() > 0)
            stun = 3000;
        if (player.GetVar4() > 0)
            stun = 6000;
        if (stun) {
            let dd = player.GetVar5() + 50;
            let de = stun + 10;
            player.SetDizzy(dd, de);
        }

        return true
    }

}

/**
 * 292   决绝
 * 瞬间冷却
 *
 * 天书-情惑：提高致命一击伤害提高至40%*level
 */
class Skill292 extends BaseHookSkillStub {

    constructor() {
        super(292);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const d = (120 * (skill.GetLevel() / 8));
        const T1 = skill.GetT(1);
        const v4 = norm(T1);
        const v11 = (v4 * (8000 * skill.GetT(1) + 14000));
        const da = ((skill.GetT(1) * 0.1 + 1.0) * v11 + 100.0);
        const v10 = (skill.GetT(1) * 0.4);//提高到0.4
        const db = ((skill.GetLevel() / 8) * v10);
        player.SetInccrithurt(d, db, da, 6);
        return true
    }

}

/**
 * 780   惜春
 * 冷却时间60秒；免疫伤害及部分负面效果44次，且去除流血效果。持续18秒
 */
class Skill780 extends BaseHookSkillStub {

    constructor() {
        super(780);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const t = (skill.GetT2() * 0.1 + 1.0) * 18000.0 + 100.0;
        const T0 = skill.GetT0();
        const ta = 4 * (T0 + skill.GetLevel() + 5) + 4;
        player.SetBlessed(ta, t);
        player.SetExorcism(100, 99, 99, 2);
        player.SetClearslow(30 * T0);
        return true
    }

}

/**
 * 1534  祈福II
 * 冷却75秒，瞬发；削减伤害的比例提升为50%，额外25秒内增加技能命中50点
 */
class Skill1534 extends BaseHookSkillStub {

    constructor() {
        super(1534);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 75000
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const level = skill.GetLevel();
        const maxAtk = player.GetMaxatk();

        player.SetHpgen(100, 30000, 0, maxAtk * level * 0.6, 0, 1);

        const da = level * 0.045;//修改为4.5%*level
        const v15 = 9999999 * level;
        player.SetDechurt(30100, da, v15);

        player.SetIncskillaccu(120, 0.5, 25100, 2);
        return true
    }
}

/**
 * 1536  江南II
 * 每击附加气血调整为2%*level，施法时间1.5秒，冷却8秒。攻击怪物目标时，瞬间冷却
 */
class Skill1536 extends BaseHookSkillStub {

    constructor() {
        super(1536);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsMob()) {
            return 0
        }

        return 8000
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Hasmultbuff = player.GetHasmultbuff(66);
        player.SetVar1(Hasmultbuff);
        const Hp = player.GetHp();
        player.SetVar2(Hp);
        const Crit = player.GetCrit();
        player.SetVar3(Crit);
        const Crithurt = player.GetCrithurt();
        player.SetVar4(Math.floor(Crithurt));
        skill.SetCrit(0.050000001);
        if (player.GetVar1() == 1) {
            skill.SetRatio(1.0);
            skill.SetPlus(0.0);
        } else {
            const v18 = skill.GetLevel() * 0.03 + 1.07;
            skill.SetRatio(v18);
            const v17 = skill.GetLevel() * 0.02;
            const v19 = player.GetHp() * v17;
            skill.SetPlus(v19);
        }
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        skill.SetCrit(0.050000001);
        const v6 = skill.GetLevel() * 0.03 + 1.07;
        skill.SetRatio(v6);
        const v5 = skill.GetLevel() * 0.02;
        const v7 = player.GetHp() * v5;
        skill.SetPlus(v7);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        skill.SetCrit(0.050000001);
        const v6 = skill.GetLevel() * 0.03 + 1.07;
        skill.SetRatio(v6);
        const v5 = skill.GetLevel() * 0.02;
        const v7 = player.GetHp() * v5;
        skill.SetPlus(v7);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        skill.SetCrit(0.050000001);
        const v6 = skill.GetLevel() * 0.03 + 1.07;
        skill.SetRatio(v6);
        const v5 = skill.GetLevel() * 0.02;
        const v7 = player.GetHp() * v5;
        skill.SetPlus(v7);
        player.SetPerform(0);
    }
}

/**
 * 1586  烟雨II
 * 冷却降至120秒，瞬发；额外20秒内保护自身有利状态不被清除，
 */
class Skill1586 extends BaseHookSkillStub {

    constructor() {
        super(1586);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetBuffClearImmune(120, 20000)
        return true
    }
}

/**
 * 2067  相思II
 *
 */
class Skill2067 extends BaseHookSkillStub {

    constructor() {
        super(2067);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

}

/**
 * 1560  决绝II
 * 60秒冷却，瞬发；技能命中增加80点，额外获得玉册效果20秒
 */
class Skill1560 extends BaseHookSkillStub {

    constructor() {
        super(1560);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = skill.GetLevel() * 0.06;
        player.SetIncanti(d, 30100);

        const da = skill.GetLevel() * 0.0801;
        player.SetIncskillaccu(100, da, 30100, 1);

        player.SetTurndebuff(20100, 1, 2)
        return true
    }
}

/**
 * 1561  山盟II
 * 施法时间1秒，冷却10秒；令目标100%禁食4秒；新增：眩晕目标6秒，眩晕能力等于自身抗性
 */
class Skill1561 extends BaseHookSkillStub {

    constructor() {
        super(1561);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
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
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetStunRes())
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = skill.GetLevel() * 0.02;
        let da = player.GetMaxhp() * d;
        da = player.GetDef() + da;
        player.SetBleeding(100, da, 100);

        const pda = 1000 * Math.floor(skill.GetT0() / 2.99) + 4100;
        player.SetDiet(120, pda);

        player.SetDizzy(player.GetVar1(), 6100)
        return true
    }

}

/**
 * 2057  激励II
 * 冷却时间调整为 90 秒，
 * 新增效果：清除江南Ⅲ 技能冷却；
 * 新增效果：令下一击伤害增加6*level%，持续 4*level 秒
 *释放后获得“迅疾”状态，释法速度减少60%，移动速度增加50%，持续30秒
 */
class Skill2057 extends BaseHookSkillStub {

    constructor() {
        super(2057);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetClearcooldown(5755, 5756, 5757)
        player.SetClearcooldown(5758, 5758, 5758)

        player.SetSwift(120, 30100, 0.6, 0.1)
        player.SetNingjin(120, 0.06 * skill.GetLevel(), skill.GetLevel() * 4000)
        return true
    }

}

/**
 * 1562  云雨II
 * 取消技能伤害，调整为诅咒技能，原有技能效果调整为：
 * 降低目标技能命中和技能闪躲 10+2*level 点，持续 20 秒，冷却45 秒
 * 额外降低目标减免伤害10%，持续10秒
 */
class Skill1562 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(1562)
        stub.pointer.add(0x2C).writeU8(3)
        super(1562);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 45000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDecskillaccu(120, 0.01 + 0.002 * skill.GetLevel(), 20100, 1)
        player.SetDecskilldodge(120, 0.01 + 0.002 * skill.GetLevel(), 20100, 1)
        player.SetFlamecurse(120, 10100, 0.1, 1)
        return true
    }

}

/**
 * 1588  秋波II
 * 令秋波魅惑能力提升100点，魅惑时间提升4秒；
 * 100%概率清空目标防御力；
 * 若自身虚抗高于目标，则70%概率清除目标蚩魂之类的状态，并令目标10秒内无法获得有利状态
 */
class Skill1588 extends BaseHookSkillStub {

    constructor() {
        super(1588);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetRes2())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        if (player.GetTypeIsPlayer()) {
            const v3 = 2000 * skill.GetLevel() + 10100;
            const ta = v3 + 2000 * skill.GetT0();
            player.SetDecdefence(100, 1.0, ta, 0);

            const td = 15 * skill.GetLevel();
            player.SetSubanti(120, td, v3, 1);

            if (player.GetVar1() > player.GetRes2()) {
                player.SetDispel(70, 90, 0, 0);
                player.SetTurnbuff(10000, 1, 2)
            }
        }

        return true
    }

}

/**
 * 1587  止水II
 * 额外20秒内令自身技能命中提升50点
 */
class Skill1587 extends BaseHookSkillStub {

    constructor() {
        super(1587);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskillaccu(120, 0.5, 20000, 2)
        return true
    }

}

/**
 * 2066  飞花II
 * 1秒施法；立即清除目标所有加速状态，并令目标在10秒内无法移动且不可解除
 */
class Skill2066 extends BaseHookSkillStub {

    constructor() {
        super(2066);
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
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDispel(120, 11, 11, 11)
        player.SetEarthBound(120, 10000)
        return true
    }

}

/**
 * 3032  风花雪月<玄>
 * 风花雪月<玄><煞><禅>：
 * 施法1秒，攻击8次，瞬间冷却；
 * 每段追加攻击上调到15%*level；
 * 额外附加自身气血上限10%的攻击力，落瑛状态直接叠至30层，持续10秒。
 * 攻击怪物目标时，额外附加自身气血10%的攻击力，增加被致命一击率30%
 * <玄>：20%几率6秒内无视神佑。
 * <煞>：6秒内令目标增加伤害15%。
 * <禅>：6秒内施法速度减少50%
 */
class Skill3032 extends BaseHookSkillStub {

    constructor() {
        super(3032);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1300
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

    // GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }
    //
    // GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }
    //
    // GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(1);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);

        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);

        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar1(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v15 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v15 + 0.3);
        } else {
            skill.SetCrit(v15);
        }

        const v16 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v16);
        const v13 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v12 = norm(Level / 14.9) * 0.03;
        const v14 = (skill.GetLevel() - 15) * v12 + v13;
        const v17 = skill.GetT0() * 0.05 + v14;
        skill.SetRatio(v17);
        const v8 = 29 * skill.GetLevel() + 850;
        const v9 = 4 * skill.GetLevel();
        const v11 = v8 + v9 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    // Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.06)
    //
    //     player.SetPerform(0);
    // }
    //
    // Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.06)
    //
    //     player.SetPerform(0);
    // }
    //
    // Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.06)
    //
    //     player.SetPerform(0);
    // }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = player.GetMp() * 0.05;
        player.SetHeal(25, d, 0);
        const da = 120 * player.GetVar2();
        player.SetReduceskillcd(da, 293, 0, 0, 2000);
        const targetType = player.GetTargetTypeIsMob();
        const v15 = targetType ? 120 : 0;
        player.AddFallingLustre(v15, 30, 10100);
        if (player.GetVar2() == 1) {
            //无视神佑
            player.SetIgnoreblessed(20, 6100);
        }
        return true
    }

}

/**
 * 3080
 *
 */
class Skill3080 extends BaseHookSkillStub {

    constructor() {
        super(3080);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1300
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

    // GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }
    //
    // GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }
    //
    // GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(1);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar1(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v15 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v15 + 0.3);
        } else {
            skill.SetCrit(v15);
        }

        const v16 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v16);
        const v13 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v12 = norm(Level / 14.9) * 0.03;
        const v14 = (skill.GetLevel() - 15) * v12 + v13;
        const v17 = skill.GetT0() * 0.05 + v14;
        skill.SetRatio(v17);
        const v8 = 29 * skill.GetLevel() + 850;
        const v9 = 4 * skill.GetLevel();
        const v11 = v8 + v9 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    // Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.1)
    //
    //     player.SetPerform(0);
    // }
    //
    // Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.1)
    //
    //     player.SetPerform(0);
    // }
    //
    // Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.1)
    //
    //     player.SetPerform(0);
    // }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = player.GetMp() * 0.05;
        player.SetHeal(25, d, 0);
        const da = 120 * player.GetVar2();
        player.SetReduceskillcd(da, 293, 0, 0, 2000);
        const targetType = player.GetTargetTypeIsMob();
        const v15 = targetType ? 120 : 0;
        player.AddFallingLustre(v15, 30, 10100);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        //受到伤害增加
        player.SetInchurt(120, skill.GetLevel() / 2 * 0.015, 6100)
        return true
    }
}

/**
 * 3128
 *
 */
class Skill3128 extends BaseHookSkillStub {

    constructor() {
        super(3128);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1300
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

    // GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }
    //
    // GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }
    //
    // GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 100
    // }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(1);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar1(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v15 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v15 + 0.3);
        } else {
            skill.SetCrit(v15);
        }

        const v16 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v16);
        const v13 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v12 = norm(Level / 14.9) * 0.03;
        const v14 = (skill.GetLevel() - 15) * v12 + v13;
        const v17 = skill.GetT0() * 0.05 + v14;
        skill.SetRatio(v17);
        const v8 = 29 * skill.GetLevel() + 850;
        const v9 = 4 * skill.GetLevel();
        const v11 = v8 + v9 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v14 = skill.GetT2() * 0.01;

        if (player.GetTargetTypeIsMob()) {
            skill.SetCrit(v14 + 0.3);
        } else {
            skill.SetCrit(v14);
        }

        const v15 = skill.GetT2() * 0.1;
        skill.SetCrithurt(v15);
        const v12 = skill.GetLevel() * 0.15 + 1.0;
        const Level = skill.GetLevel();
        const v11 = norm(Level / 14.9) * 0.03;
        const v13 = (skill.GetLevel() - 15) * v11 + v12;
        const v16 = skill.GetT0() * 0.05 + v13;
        skill.SetRatio(v16);
        const v7 = 29 * skill.GetLevel() + 850;
        const v8 = 4 * skill.GetLevel();
        const v10 = v7 + v8 * skill.GetLevel();
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);
        skill.SetMobBonusDamage(player.GetHp() * 0.1)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    // Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.1)
    //
    //     player.SetPerform(0);
    // }
    //
    // Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.1)
    //
    //     player.SetPerform(0);
    // }
    //
    // Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    //     const player = skill.GetPlayerNice();
    //     player.SetVar2(0);
    //     player.SetVar1(0);
    //     const v25 = skill.GetT2() * 0.01;
    //
    //     if (player.GetTargetTypeIsMob()) {
    //         skill.SetCrit(v25 + 0.3);
    //     } else {
    //         skill.SetCrit(v25);
    //     }
    //
    //     const v26 = skill.GetT2() * 0.1;
    //     skill.SetCrithurt(v26);
    //     const v21 = skill.GetLevel() * 0.05 + 1.0;
    //     const Level = skill.GetLevel();
    //     const v19 = norm(Level / 14.9) * 0.03;
    //     const v22 = (skill.GetLevel() - 15) * v19 + v21;
    //     const v27 = skill.GetT0() * 0.05 + v22;
    //     skill.SetRatio(v27);
    //     const v5 = 29 * skill.GetLevel() + 850;
    //     const v6 = 4 * skill.GetLevel();
    //     const v23 = v5 + v6 * skill.GetLevel();
    //     const maxAtk = player.GetMaxatk() * 0.05;
    //     const v24 = skill.GetLevel() * maxAtk + v23;
    //     const res1 = player.GetRes1();
    //     const res2 = player.GetRes2() + res1;
    //     const res3 = player.GetRes3() + res2;
    //     const res4 = player.GetRes4() + res3;
    //     const res5 = player.GetRes5() + res4;
    //     const v28 = (res5 * skill.GetLevel()) * 0.25 + v24;
    //     skill.SetPlus(v28 + player.GetMaxhp() * 0.1);
    //     skill.SetMobBonusDamage(player.GetHp() * 0.1)
    //
    //     player.SetPerform(0);
    // }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const d = player.GetMp() * 0.05;
        player.SetHeal(25, d, 0);
        const da = 120 * player.GetVar2();
        player.SetReduceskillcd(da, 293, 0, 0, 2000);
        const targetType = player.GetTargetTypeIsMob();
        const v15 = targetType ? 120 : 0;
        player.AddFallingLustre(v15, 30, 10100);
        if (player.GetVar2() == 1) {
            player.SetSwift(120, 500 * skill.GetLevel() + 1000, 0.5, 0);
        }
        return true
    }

}

/**
 * 3030  惜春<玄>
 * 免疫伤害及部分负面效果66次，且去除流血效果。
 * <玄>：技能躲闪增加2点*level，持续16秒。
 */
class Skill3030 extends BaseHookSkillStub {

    constructor() {
        super(3030);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = ((skill.GetT2() * 0.1 + 1.0) * 19000.0 + 100.0);
        const ta = 2 * skill.GetT0() + skill.GetLevel() * 3 + 6;
        player.SetBlessed(ta, t);

        player.SetExorcism(100, 99, 99, 2);

        const tb = 30 * skill.GetT0();
        player.SetClearslow(tb);

        const tc = 5 * skill.GetLevel();
        const td = 500 * skill.GetLevel() + 2050;
        const te = skill.GetLevel() * 0.05;
        player.SetIncdrugeffect(tc, te, td, 1);

        //增加技能躲闪
        let d = skill.GetLevel() * 0.02;
        player.SetIncskilldodge(120, d, 16100, 2);
        return true
    }

}

/**
 * 3078
 * <煞>：单体技能延长6米，持续16秒。
 */
class Skill3078 extends BaseHookSkillStub {

    constructor() {
        super(3078);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = ((skill.GetT2() * 0.1 + 1.0) * 19000.0 + 100.0);
        const ta = 2 * skill.GetT0() + skill.GetLevel() * 3 + 6;
        player.SetBlessed(ta, t);

        player.SetExorcism(100, 99, 99, 2);

        const tb = 30 * skill.GetT0();
        player.SetClearslow(tb);

        //单体攻击距离
        player.SetSingleatkchange(120, 100 + 800 * skill.GetLevel(), 0.3 * skill.GetLevel(), 0);
        return true
    }

}

/**
 * 3126
 *
 */
class Skill3126 extends BaseHookSkillStub {

    constructor() {
        super(3126);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = ((skill.GetT2() * 0.1 + 1.0) * 19000.0 + 100.0);
        const ta = 2 * skill.GetT0() + skill.GetLevel() * 3 + 6;
        player.SetBlessed(ta, t);

        player.SetExorcism(100, 99, 99, 2);

        const tb = 30 * skill.GetT0();
        player.SetClearslow(tb);

        const tc = 4 * skill.GetLevel() + 10;
        player.SetClearwrap(tc);
        return true
    }

}

/**
 * 3031  怜影<玄>
 * “黯然之痛”效果上调两级，即增加伤害比例额外增加4%，持续时间额外增加 4 秒，
 * 新增效果：第一击增加自身 10 层落瑛状态
 * 怜影<玄><煞><禅>攻击怪物目标时每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
 * 施法时间缩短至 1 秒
 */
class Skill3031 extends BaseHookSkillStub {

    constructor() {
        super(3031);
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
        player.SetVar2(1);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate4(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const Player = skill.GetPlayerNice();
        const var2 = Player.GetVar2();
        if (var2 == 1) {
            Player.AddFallingLustre(120, 10, 20100)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let d = (norm(zrand(60) + 60) * 0.02);
        let da = skill.GetLevel() * d;
        const v5 = 10 * skill.GetLevel();
        const v6 = skill.GetLevel() * v5;
        const Var1 = player.GetVar1();
        const v10 = player.GetVar1() * Var1;
        const v12 = player.GetVar1() * v10;
        const v13 = player.GetVar1();
        da = (v6 + v12 * v13) * da;
        player.SetHpleak(33, 4000, Math.floor(da), 0, 1);

        let dc = ((norm(skill.GetT2()) * 0.3 + 1.0) * 8000.0 + 4100.0);
        let dd = (skill.GetT3() * 0.03 + 0.14);
        player.SetInchurt2(-1, dd, dc);

        player.SetBarehanded(5 * skill.GetLevel(), 5050);
        return true
    }

}

/**
 * 3079  怜影<煞>
 * “黯然之痛”增加伤害比例额外增加4%，持续时间额外增加 4 秒，
 * 新增效果：第一击增加自身 10 层落瑛状态
 * 怜影<玄><煞><禅>攻击怪物目标时每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
 * 施法时间缩短至 1 秒
 */
class Skill3079 extends BaseHookSkillStub {

    constructor() {
        super(3079);
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
        player.SetVar2(1);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate4(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const Player = skill.GetPlayerNice();
        const var2 = Player.GetVar2();
        if (var2 == 1) {
            Player.AddFallingLustre(120, 10, 20100)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const victim = skill.GetVictimNice();

        const d = Math.floor((zrand(60) + 60) * 0.02);
        const da = Math.floor(skill.GetLevel() * d);
        const v5 = 10 * skill.GetLevel();
        const v6 = skill.GetLevel() * v5;
        const Var1 = player.GetVar1();
        const v10 = player.GetVar1() * Var1;
        const v12 = player.GetVar1() * v10;
        const v13 = player.GetVar1() * v12;
        const amount = Math.floor((v6 + v13) * da);
        victim.SetHpleak(33, 4000, amount, 0, 1);

        const time = Math.floor((skill.GetT2() * 0.3 + 1.0) * 8000.0 + 4100.0);
        const ratio = (skill.GetT3() * 0.03 + 0.14);
        victim.SetInchurt2(-1, ratio, time);

        const probability = 5 * skill.GetLevel();
        const time2 = 500 * skill.GetLevel() + 2050;
        const db = Math.floor(skill.GetLevel() * 0.02);
        const maxmp = player.GetMaxmp();
        const value = Math.floor(maxmp * db);
        victim.SetSubmp(probability, value, 1000, time2, 1);

        return true
    }

}

/**
 * 3127  怜影<禅>
 *“黯然之痛”效果上调两级，即增加伤害比例额外增加4%，持续时间额外增加 4 秒，新增效果：第一击增加自身 10 层落瑛状态
 *怜影<玄><煞><禅>攻击怪物目标时每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
 * 施法时间缩短至 1 秒
 * <禅>：降血上限提升为30%
 */
class Skill3127 extends BaseHookSkillStub {

    constructor() {
        super(3127);
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
        player.SetVar2(1);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        // 每一层落瑛状态额外附加自身气血真气上限和的0.1%的攻击力
        const v14 = player.GetBufflevel(9359) * 0.01;
        const v22 = Math.floor((player.GetMaxhp() + player.GetMaxmp()) * v14);
        skill.SetMobBonusDamage(v22);
        super.Calculate4(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const Player = skill.GetPlayerNice();
        const var2 = Player.GetVar2();
        if (var2 == 1) {
            Player.AddFallingLustre(120, 10, 20100)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const victim = skill.GetVictimNice();

        const d = Math.floor((zrand(60) + 60) * 0.02);
        const da = Math.floor(skill.GetLevel() * d);
        const v5 = 10 * skill.GetLevel();
        const v6 = skill.GetLevel() * v5;

        const Var1 = player.GetVar1();
        const v10 = player.GetVar1() * Var1;
        const v12 = player.GetVar1() * v10;
        const v13 = player.GetVar1() * v12;
        const amount = Math.floor((v6 + v13 * player.GetVar1()) * da);

        victim.SetHpleak(33, 4000, amount, 0, 1);

        const time = Math.floor((skill.GetT2() * 0.3 + 1.0) * 8000.0 + 4100.0);
        const ratio = skill.GetT3() * 0.03 + 0.14;
        victim.SetInchurt2(-1, ratio, time);

        const probability = 5 * skill.GetLevel();
        const time2 = 500 * skill.GetLevel() + 2050;
        const db = skill.GetLevel() * 0.015;
        const maxhp = player.GetMaxhp();
        const value = maxhp * db;
        player.SetSubhp(probability, value, 1000, time2, 1);
        return true
    }

}

/**
 * 3125  旧梦<禅>
 * 100%清除目标有利状态
 */
class Skill3125 extends BaseHookSkillStub {

    constructor() {
        super(3125);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const d = 8 * skill.GetT2() + 60;
        const player = skill.GetPlayerNice();
        const level = player.GetLevel();
        const v4 = zrand(100);
        const T2 = skill.GetT2();
        const d2 = (Math.floor(v4 / (4 * (25 - T2))) + 1) * 0.48;
        player.SetDrainmagic((1.0 - level * 0.002) * d, d2);

        const d4 = norm(level / 19.9) + 2;
        player.SetClearbuff(120, d4);

        const d5 = 300 * skill.GetLevel() + 2050;
        player.SetDisperseanti(1.0, d5);
        return true
    }

}

/**
 * 5841  祈福III《天空》
 * 瞬发，100%几率触发极效，18秒内自身进入隐身状态，自身25秒内免疫降低气血上限类效果
 */
class Skill5841 extends BaseHookSkillStub {

    constructor() {
        super(5841);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //极效加血
        player.SetInchp2(7.0, 36100, 1);

        let skillLevel = player.GetSkilllevel(740);
        let v8 = norm(skillLevel / 1.5);
        let v10 = player.GetSkilllevel(305);
        let v31 = 4500000 * norm(v10) * v8;
        let maxmp = player.GetMaxmp();
        let v34 = (maxmp * player.GetSkilllevel(305)) * 0.05;
        let level = player.GetLevel();
        let v36 = ((level * player.GetSkilllevel(305)) * 0.2 + v34) * 2.05;
        player.SetAddhp(v31, v36, 4);

        let var1 = player.GetVar(1);
        let v33 = (var1 <= 950) ? 0.0 : (120 * norm(1.333333333333333));
        let maxhp = player.GetMaxhp();
        player.SetHeal(v33, maxhp, 0);

        player.SetInccritrate(6100, 0.1, 3);

        player.SetShadowhide(120, 0, 0, 2000 * skill.GetLevel() + 2100, 9);//隐身

        //免疫气血凝滞
        player.SetRedImmunity(120, 1100 + 8000 * skill.GetLevel())
        return true
    }

}

/**
 * 5842
 *
 */
class Skill5842 extends BaseHookSkillStub {

    constructor() {
        super(5842);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //极效加血
        player.SetInchp2(7.0, 36100, 1);

        let skillLevel = player.GetSkilllevel(740);
        let v8 = norm(skillLevel / 1.5);
        let v10 = player.GetSkilllevel(305);
        let v31 = 4500000 * norm(v10) * v8;
        let maxmp = player.GetMaxmp();
        let v34 = (maxmp * player.GetSkilllevel(305)) * 0.05;
        let level = player.GetLevel();
        let v36 = ((level * player.GetSkilllevel(305)) * 0.2 + v34) * 2.05;
        player.SetAddhp(v31, v36, 4);

        let var1 = player.GetVar(1);
        let v33 = (var1 <= 950) ? 0.0 : (120 * norm(1.333333333333333));
        let maxhp = player.GetMaxhp();
        player.SetHeal(v33, maxhp, 0);

        player.SetIncskilldamage(0.1, (2000 * skill.GetLevel() + 4100), 1);

        player.SetShadowhide(120, 0, 0, 2000 * skill.GetLevel() + 2100, 9);//隐身

        //免疫气血凝滞
        player.SetRedImmunity(120, 1100 + 8000 * skill.GetLevel())
        return true
    }

}

/**
 * 5843
 *
 */
class Skill5843 extends BaseHookSkillStub {

    constructor() {
        super(5843);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //极效加血
        player.SetInchp2(7.0, 36100, 1);

        let skillLevel = player.GetSkilllevel(740);
        let v8 = norm(skillLevel / 1.5);
        let v10 = player.GetSkilllevel(305);
        let v31 = 4500000 * norm(v10) * v8;
        let maxmp = player.GetMaxmp();
        let v34 = (maxmp * player.GetSkilllevel(305)) * 0.05;
        let level = player.GetLevel();
        let v36 = ((level * player.GetSkilllevel(305)) * 0.2 + v34) * 2.05;
        player.SetAddhp(v31, v36, 4);

        let var1 = player.GetVar(1);
        let v33 = (var1 <= 950) ? 0.0 : (120 * norm(1.333333333333333));
        let maxhp = player.GetMaxhp();
        player.SetHeal(v33, maxhp, 0);

        player.SetImmunelakemp(100, 16100);

        player.SetShadowhide(120, 0, 0, 2000 * skill.GetLevel() + 2100, 9);//隐身

        //免疫气血凝滞
        player.SetRedImmunity(120, 1100 + 8000 * skill.GetLevel())
        return true
    }

}

/**
 * 5844
 * 雄：祈福时间加强为60秒；
 * 10秒内免疫嘲讽，15秒内保护自身有利状态不被清除
 */
class Skill5844 extends BaseHookSkillStub {

    constructor() {
        super(5844);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        //极效加血
        player.SetInchp2(7.0, 60100, 1);

        let skillLevel = player.GetSkilllevel(740);
        let v8 = norm(skillLevel / 1.5);
        let v10 = player.GetSkilllevel(305);
        let v31 = 4500000 * norm(v10) * v8;
        let maxmp = player.GetMaxmp();
        let v34 = (maxmp * player.GetSkilllevel(305)) * 0.05;
        let level = player.GetLevel();
        let v36 = ((level * player.GetSkilllevel(305)) * 0.2 + v34) * 2.05;
        player.SetAddhp(v31, v36, 4);

        let var1 = player.GetVar(1);
        let v33 = (var1 <= 950) ? 0.0 : (120 * norm(1.333333333333333));
        let maxhp = player.GetMaxhp();
        player.SetHeal(v33, maxhp, 0);

        player.SetBuffClearImmune(120, 15100)
        player.SetImmunetaune(120, 10100)

        player.SetShadowhide(120, 0, 0, 2000 * skill.GetLevel() + 2100, 9);//隐身

        //免疫气血凝滞
        player.SetRedImmunity(120, 1100 + 8000 * skill.GetLevel())
        return true
    }

}

/**
 * 5755  江南III
 * 江南III《天空》《大地》《碧海》《英雄》：
 * 施法1.5秒，冷却10秒，每一击附加当前气血的20%；
 * 攻击非玩家目标时额外附加自身气血真气上限之和10%攻击力
 * 天：第一击令目标9秒深度睡眠
 *
 */
class Skill5755 extends BaseHookSkillStub {

    constructor() {
        super(5755);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        player.SetVar2(0);
        player.SetVar3(1);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v12 = Hp * v14;
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        player.SetVar2(0);
        player.SetVar3(0);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v12 = Hp * v14;
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        player.SetVar2(0);
        player.SetVar3(0);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v12 = Hp * v14;
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        player.SetVar2(1);
        player.SetVar3(0);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v12 = Hp * v14;
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar3() == 1) {
            player.SetDsleep(120, 6100, 3)
        }

        super.StateAttack(stub, skill, originFunc);
        return true
    }
}

/**
 * 5756
 * 海：第一击令目标3秒内处于冰冻
 */
class Skill5756 extends BaseHookSkillStub {

    constructor() {
        super(5756);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res4 = player.GetRes4();
        player.SetVar1(Res4);
        player.SetVar2(0);
        player.SetVar3(1);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const Level = skill.GetLevel();
        const v11 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v12 = Math.floor(Hp * v14);
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(0);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v8 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v8);
        const v15 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v15);
        const v10 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v16 = hp * 0.2 + v10;
        skill.SetPlus(v16);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v11 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v9 = Math.floor(Hp * v11);
        skill.SetMobBonusDamage(v9 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(0);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v8 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v8);
        const v15 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v15);
        const v10 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v16 = hp * 0.2 + v10;
        skill.SetPlus(v16);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v11 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v9 = Math.floor(Hp * v11);
        skill.SetMobBonusDamage(v9 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(1);
        player.SetVar3(0);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v8 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v8);
        const v15 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v15);
        const v10 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v16 = hp * 0.2 + v10;
        skill.SetPlus(v16);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v11 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v9 = Math.floor(Hp * v11);
        skill.SetMobBonusDamage(v9 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar3() == 1) {
            player.SetFrozen(120, 1, 3100, 3)
        }

        super.StateAttack(stub, skill, originFunc);
        return true
    }
}

/**
 * 5757
 * 地：第一击清除目标5个有利状态
 */
class Skill5757 extends BaseHookSkillStub {

    constructor() {
        super(5757);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(1);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v8 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v8);
        const v15 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v15);
        const v10 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v16 = hp * 0.2 + v10;
        skill.SetPlus(v16);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v11 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v9 = Math.floor(Hp * v11);
        skill.SetMobBonusDamage(v9 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(0);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v8 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v8);
        const v15 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v15);
        const v10 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v16 = hp * 0.2 + v10;
        skill.SetPlus(v16);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v11 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v9 = Math.floor(Hp * v11);
        skill.SetMobBonusDamage(v9 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(0);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v8 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v8);
        const v15 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v15);
        const v10 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v16 = hp * 0.2 + v10;
        skill.SetPlus(v16);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v11 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v9 = Math.floor(Hp * v11);
        skill.SetMobBonusDamage(v9 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(1);
        player.SetVar3(0);
        const v13 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v13);
        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v14);
        const Level = skill.GetLevel();
        const v8 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v8);
        const v15 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v15);
        const v10 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v16 = hp * 0.2 + v10;
        skill.SetPlus(v16);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v11 = buffLevel9359 * 0.01;
        const Hp = player.GetHp();
        const v9 = Math.floor(Hp * v11);
        skill.SetMobBonusDamage(v9 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar3() == 1) {
            player.SetClearbuff(120, 5)
        }

        super.StateAttack(stub, skill, originFunc);
        return true
    }
}

/**
 * 5758
 * 雄：第一击令目标减速50%
 */
class Skill5758 extends BaseHookSkillStub {

    constructor() {
        super(5758);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(1);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const level = skill.GetLevel();
        const v11 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const v12 = Math.floor(hp * v14);
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const level = skill.GetLevel();
        const v11 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const v12 = Math.floor(hp * v14);
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(0);
        player.SetVar3(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const level = skill.GetLevel();
        const v11 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const v12 = Math.floor(hp * v14);
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(1);
        player.SetVar3(0);
        const res4 = player.GetRes4();
        player.SetVar1(res4);
        const v16 = (skill.GetLevel() + 2) * 0.01 + 0.1;
        skill.SetCrit(v16);
        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);
        const level = skill.GetLevel();
        const v11 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v11);
        const v18 = (5 * skill.GetLevel() + 10) * 0.01 + 1.45;
        skill.SetRatio(v18);
        const v13 = 1000 * skill.GetLevel();
        const hp = player.GetHp();
        const v19 = hp * 0.2 + v13;
        skill.SetPlus(v19);
        const buffLevel9359 = player.GetBufflevel(9359);
        const v14 = buffLevel9359 * 0.01;
        const v12 = Math.floor(hp * v14);
        skill.SetMobBonusDamage(v12 + player.GetMaxHPAndMP() * 0.1);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar3() == 1) {
            player.SetSlow(120, 0.5, 6100, 3)
        }

        super.StateAttack(stub, skill, originFunc);
        return true
    }

}

/**
 * 6838  赤乌·相思·曦日
 * 清除自身3个常规不利状态，增加自身技能闪躲75点；
 * 免疫禁食调整为5秒*level，单体攻击距离增加调整为10米，伤害提高15%，持续时间调整为20秒；
 * 技能达到5级时，施法后令自身进入隐身状态，持续18秒
 */
class Skill6838 extends BaseHookSkillStub {

    constructor() {
        super(6838);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.RemoveMultiFilter(32);

        player.SetCleardebuff(120, 3)

        player.SetSingleatkchange(111, 20100, 10, 0.15);

        const d = skill.GetLevel() * 0.15;
        player.SetIncskilldodge(100, d, 15100, 7);

        player.SetDietImmune(100, 5000 * skill.GetLevel());

        if (skill.GetLevel() >= 5) {
            player.SetShadowhide(120, 0, 0, 10000, 9);//隐身
        }

        return true
    }

}

class FeiShengCoolDown extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            1310, 1642, 1662, 1682, 1702, 3797,//几多愁
            1312, 1644, 1664, 1684, 1704, 3799,//再回首
            1313, 1645, 1665, 1685, 1705, 3800//曾记否
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

}

class FeiShengCoolDown2 extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            1311, 1643, 1663, 1683, 1703, 3798//晚来秋
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

/**
 */
export class HeHuanSkillList {
    constructor() {
        new Skill289()
        new Skill300()
        new Skill305()
        new Skill299()
        new Skill293()
        new Skill770()
        new Skill530()
        new Skill531()
        new Skill292()
        new Skill780()
        new Skill1534()
        new Skill1536()
        new Skill1586()
        new Skill2067()
        new Skill1560()
        new Skill1561()
        new Skill2057()
        new Skill1562()
        new Skill1588()
        new Skill1587()
        new Skill2066()
        new Skill3032()
        new Skill3080()
        new Skill3128()
        new Skill3030()
        new Skill3078()
        new Skill3126()
        new Skill3031()
        new Skill3079()
        new Skill3127()
        new Skill3125()
        new Skill5841()
        new Skill5842()
        new Skill5843()
        new Skill5844()
        new Skill5755()
        new Skill5756()
        new Skill5757()
        new Skill5758()
        new Skill6838()
        new FeiShengCoolDown()
        new FeiShengCoolDown2()
    }
}