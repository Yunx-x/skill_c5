import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";
import {HookFuncCore} from "../../base/HookFuncCore";

/**
 * 6079 捣尽玄霜
 * 瞬发
 */
class Skill6079 extends BaseHookSkillStub {

    constructor() {
        super(6079);
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
 * 6017  明月逐来
 * 瞬发；目标提升移速的效果持续15+level 秒，层数调整为4层
 */
class Skill6017 extends BaseHookSkillStub {

    constructor() {
        super(6017);
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
        const t = 1000 * skill.GetLevel() + 15000;
        player.SetScudblessing(120, t, 4, 4.5, 1.5);
        return true
    }
}

/**
 * 6081  研彻晓光
 * 瞬发
 */
class Skill6081 extends BaseHookSkillStub {

    constructor() {
        super(6081);
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
 * 6078  晴沙絮舞
 * 施法1秒
 */
class Skill6078 extends BaseHookSkillStub {

    constructor() {
        super(6078);
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
 * 6018  碧柳摇风
 * 瞬发，冷却减少10秒
 */
class Skill6018 extends BaseHookSkillStub {

    constructor() {
        super(6018);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
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
 * 6091  乱花如雨
 * 6046天书-将进酒 附加本体攻击力追加8%*level，
 * 攻击怪物目标时额外附加自身气血上限level%的攻击力
 */
class Skill6091 extends BaseHookSkillStub {

    constructor() {
        super(6091);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v7 = skill.GetT0() * 0.08;
        const c = skill.GetLevel() * 0.02 + 1.15 + v7;
        skill.SetRatio(c);

        const v2 = 33 * skill.GetT0() + 66 * skill.GetLevel() + 666;
        skill.SetPlus(v2);

        let v4;
        if (skill.GetT0() <= 0) {
            v4 = 0.0;
        } else {
            const v3 = norm(100);
            if (v3 >= 5 * skill.GetLevel() + 2) {
                v4 = 0.0;
            } else {
                v4 = skill.GetT0() * 0.05;
            }
        }
        skill.SetCrit(v4);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.01 * skill.GetLevel());

        player.SetPerform(1);
    }

}

/**
 * 6020  一川烟草
 * 冷却减少30秒，封禁技能数量3个，概率调整为100%，持续时间10秒
 * 6991玄烛·一川烟草·曦日：6秒内降低目标技能闪避60点，6秒内降低目标技能命中60点，技能达到5级时降低冷却6秒
 *
 */
class Skill6020 extends BaseHookSkillStub {

    constructor() {
        super(6020);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        let t = 0
        if (player.GetSkilllevel(6991) >= 5) {
            t = 6000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - 30000 - t;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const db = 1000 * skill.GetLevel() + 2000;

        let da;
        if (skill.GetLevel() > 8) {
            da = 2 * skill.GetT0() + 3;
        } else {
            da = 2 * skill.GetT0() + 1;
        }

        player.SetFenggong(120, db, da);

        let ratio = 0;
        if (player.GetVar2() > 0) {
            ratio = 0.1;
        } else if (player.GetVar3() > 0) {
            ratio = 0.2;
        } else if (player.GetVar4() > 0) {
            ratio = 0.6;
        }

        const Var2 = player.GetVar2();
        const star_lvl = player.GetVar3() + Var2 + player.GetVar4();
        const dc = 100 * star_lvl;
        player.SetDecskilldodge(dc, ratio, 6100, 4);

        const dd = star_lvl * 100;
        player.SetDecskillaccu(dc, dd, 6100, 4);
        return true
    }

}

/**
 * 6015  浮生回顾
 * 删除“节命”状态，新增“薄命”状态
 * 玄烛·浮生回顾·曦日：护盾时间延长7秒，护盾减免上限提升100%
 */
class Skill6015 extends BaseHookSkillStub {

    constructor() {
        super(6015);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetInvincible(6100)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let da = Math.floor(player.GetVar1() * 0.02);
        da = (8 * skill.GetLevel() + 10) + da;
        player.SetProbability(da);

        let v4 = 3000 * skill.GetT1();
        da = (v4 + 2000 * skill.GetLevel() + 4000);
        player.SetTime(da);
        player.SetImmuneDeath(da, 1, da)

        let bon = 0;
        if (player.GetSkilllevel(6983) > 0)
            bon = 2000;
        if (player.GetSkilllevel(6984) > 0)
            bon = 4000;
        if (player.GetSkilllevel(6985) > 0)
            bon = 7000;

        const Skilllevel = player.GetSkilllevel(6983);
        const star_lvl = player.GetSkilllevel(6984) + Skilllevel + player.GetSkilllevel(6985);

        let t;
        if (player.GetVar3() == 4) {
            t = 0.0;
        } else {
            if (skill.GetT0() <= 0) {
                t = 0.0;
            } else {
                t = (2000 * skill.GetT0() + bon);
            }
        }

        let dc = skill.GetT0() * 0.15 + 0.3;
        const dd = (skill.GetT0() * player.GetVar2()) * ((star_lvl * 0.4) + 1.0);

        player.SetDechurt(t, dc, dd);

        let ta;
        if (player.GetVar3() == 4) {
            ta = (1000 * skill.GetT2() + bon);
        } else {
            ta = 0.0;
        }
        const de = skill.GetT2() * 0.08 + 0.15;
        const T2 = skill.GetT2();
        const df = (skill.GetT2() * player.GetVar2()) * 0.5 * ((star_lvl * 0.4) + 1.0);
        player.SetDechurt3(de, df, ta, 6273, T2);
        return true
    }

}

/**
 * 6087  新蝉惊晚
 * 无冷却
 * 6988玄烛·新蝉惊晚·曦日：
 * 降低目标气血上限15%，持续20秒。
 * 自身8秒内攻击力增加3000；
 * 降低目标减免伤害的概率调整为100%，数值调整为3%，最多可叠加3层
 */
class Skill6087 extends BaseHookSkillStub {

    constructor() {
        super(6087);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6988) > 0) {
            player.SetAddattack(120, 8000, 3000, 2)
        }
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let t = 1000 * skill.GetLevel() + 5000;

        player.SetDecdefence(120, 0.05, t, 3);
        player.SetDecdefence(120, 0.05, t, 4);
        player.SetDecdefence(120, 0.05, t, 5);

        let tb = 45 * skill.GetT0();
        let tc = 2000 * skill.GetT0();
        let td = skill.GetLevel() + 1;
        let T0 = skill.GetT0();
        let calculatedValue = player.GetVar1() * 0.01 * T0 * td;
        player.SetHpleak(tb, tc, calculatedValue, 0, 6);

        let te = 0;

        if (player.GetVar2() > 0) {
            te = 30;
        } else if (player.GetVar3() > 0) {
            te = 50;
        } else if (player.GetVar4() > 0) {
            te = 80;
        }

        player.SetFlamecurse(te, 12100, 0.02, 3);
        return true
    }

}

/**
 * 6088  门含风帘
 *
 */
class Skill6088 extends BaseHookSkillStub {

    constructor() {
        super(6088);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 45000
    }

}

/**
 * 6157  空驰有术
 * 冷却10秒
 */
class Skill6157 extends BaseHookSkillStub {

    constructor() {
        super(6157);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
    }

}

/**
 * 6089  骊歌一叠
 * 冷却40秒
 */
class Skill6089 extends BaseHookSkillStub {

    constructor() {
        super(6089);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
    }

}

/**
 * 6098  夭桃繁杏
 * 冷却减少15秒，召唤两只扇灵；取消“天桃繁杏Ⅱ”冷却共享。
 * 6043 T1 天书-菩萨蛮：增伤效果调整为10*level秒
 */
class Skill6098 extends BaseHookSkillStub {

    constructor() {
        super(6098);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        const v3 = 1000 * skill.GetT0();
        const t = v3 + 3000 * skill.GetLevel() + 15000;

        const ta = Math.floor(skill.GetLevel() * 0.1 + 0.2);
        player.SetImitate(120, t, ta, 2);

        let v8;
        if (skill.GetT1() <= 0) {
            v8 = 10.0;
        } else {
            v8 = 10000 * skill.GetT1();
        }

        const tb = Math.floor(skill.GetT1() * 0.1);
        player.SetIncskilldamage(tb, v8, 3);
        return true
    }

}

/**
 * 6102  舞破重山
 * 冷却减少20秒，施法1秒；
 * 焕发影响彤云扫天2、彤云扫天3 攻击怪物目标时，每段攻击额外附加本体攻击力50%，附加自身气血上限5%的攻击力
 * （只改了彤云扫天2、彤云扫天3）
 */
class Skill6102 extends BaseHookSkillStub {

    constructor() {
        super(6102);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }
}

/**
 * 6232  寒影初回II
 * 冷却35秒
 */
class Skill6232 extends BaseHookSkillStub {

    constructor() {
        super(6232);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
    }

}

/**
 * 6229  彤云扫天II
 * 冷却减少10秒。攻击目标12段。
 * 附加自身气血上限10%，增加目标被暴击伤害10%
 * 对怪物伤害附加自身当前气血8%，附加爆伤50%，无冷却
 */
class Skill6229 extends BaseHookSkillStub {

    constructor() {
        super(6229);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v3;

        let mobR = 0
        let mobP = 0

        if (player.GetHasmultbuff(127)) {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0 + 0.1);
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0);
        }

        skill.SetRatio(v3 + mobR);

        const v12 = 46 * skill.GetLevel() + 629;
        skill.SetPlus(v12);

        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.08)
        skill.SetMobCrithurt(0.5)

        player.SetVar1(1);

        const Res3 = player.GetRes3();
        player.SetVar2(Res3);

        const Res4 = player.GetRes4();
        player.SetVar3(Res4);

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v3;
        let mobR = 0
        let mobP = 0

        if (player.GetHasmultbuff(127)) {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0 + 0.1);
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0);
        }

        skill.SetRatio(v3 + mobR);

        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.08)
        skill.SetMobCrithurt(0.5)

        const Level = skill.GetLevel();
        const v8 = player.GetHp() * 0.01 * Level;
        const v10 = 46 * Level + 629 + v8;
        skill.SetPlus(v10 + player.GetMaxhp() * 0.1);

        player.SetVar1(2);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v3;
        let mobR = 0
        let mobP = 0

        if (player.GetHasmultbuff(127)) {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0 + 0.1);
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0);
        }

        skill.SetRatio(v3 + mobR);

        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.08)
        skill.SetMobCrithurt(0.5)

        const v6 = 46 * skill.GetLevel() + 629;
        skill.SetPlus(v6);

        player.SetVar1(3);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v3;
        let mobR = 0
        let mobP = 0

        if (player.GetHasmultbuff(127)) {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0 + 0.1);
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0);
        }

        skill.SetRatio(v3 + mobR);

        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.08)
        skill.SetMobCrithurt(0.5)

        const Level = skill.GetLevel();
        const v14 = player.GetHp() * 0.01 * Level;
        const v16 = 46 * Level + 629 + v14;
        skill.SetPlus(v16);

        player.SetVar1(4);

        const Res3 = player.GetRes3();
        player.SetVar2(Res3);

        const Res4 = player.GetRes4();
        player.SetVar3(Res4);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v3;
        let mobR = 0
        let mobP = 0

        if (player.GetHasmultbuff(127)) {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0 + 0.1);
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0);
        }

        skill.SetRatio(v3 + mobR);

        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.08)
        skill.SetMobCrithurt(0.5)

        const v6 = 46 * skill.GetLevel() + 629;
        skill.SetPlus(v6);

        player.SetVar1(5);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        let v3;
        let mobR = 0
        let mobP = 0

        if (player.GetHasmultbuff(127)) {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0 + 0.1);
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v3 = Math.floor(skill.GetLevel() * 0.1 + 1.0);
        }

        skill.SetRatio(v3 + mobR);

        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.08)
        skill.SetMobCrithurt(0.5)

        const Level = skill.GetLevel();
        const v14 = player.GetHp() * 0.01 * Level;
        const v16 = 46 * Level + 629 + v14;
        skill.SetPlus(v16);

        player.SetVar1(6);

        const Res3 = player.GetRes3();
        player.SetVar2(Res3);

        const Res4 = player.GetRes4();
        player.SetVar3(Res4);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncfatalhurt(120, 0.1, 6100, 1)
        return true
    }
}

/**
 * 6226  夭桃繁杏II
 * 取消“天桃繁杏”共享冷却，激活扇灵3只持续16秒
 */
class Skill6226 extends BaseHookSkillStub {

    constructor() {
        super(6226);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetImitate(111, skill.GetLevel() * 1000 + 8100, skill.GetLevel() * 0.08, 3)
        return true
    }

}

/**
 * 6228  研彻晓光II
 * 施法1秒，冷却35秒
 */
class Skill6228 extends BaseHookSkillStub {

    constructor() {
        super(6228);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
    }

}

/**
 * 6231  门含风帘II
 * 冷却60秒
 */
class Skill6231 extends BaseHookSkillStub {

    constructor() {
        super(6231);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

}

/**
 * 6224  烛影摇红II
 * 效果修改为技能命中增加30
 */
class Skill6224 extends BaseHookSkillStub {

    constructor() {
        super(6224);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetPasincskillaccu(skill.GetLevel() * 30)
        return true
    }

}

/**
 * 6239  舞破重山<玄>
 * 舞破重山<玄><煞><禅>：
 * 冷却时间减少20秒，施法1秒；
 * 自身10秒内处于反射，反射8次；
 */
class Skill6239 extends BaseHookSkillStub {

    constructor() {
        super(6239);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSkillreflect(120, 4 * skill.GetLevel() + 20, skill.GetLevel() / 10 * 4, 500 * skill.GetLevel() + 100)
        return true
    }
}

/**
 * 6244
 * 舞破重山<玄><煞><禅>：
 * 冷却时间减少20秒，施法1秒；
 * 自身10秒内处于反射，反射8次；
 */
class Skill6244 extends BaseHookSkillStub {

    constructor() {
        super(6244);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSkillreflect(120, 4 * skill.GetLevel() + 20, skill.GetLevel() / 10 * 4, 500 * skill.GetLevel() + 100)
        return true
    }
}

/**
 * 6249
 * 舞破重山<玄><煞><禅>：
 * 冷却时间减少20秒，施法1秒；
 * 自身10秒内处于反射，反射8次；
 */
class Skill6249 extends BaseHookSkillStub {

    constructor() {
        super(6249);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSkillreflect(120, 4 * skill.GetLevel() + 20, skill.GetLevel() / 10 * 4, 500 * skill.GetLevel() + 100)
        return true
    }
}

/**
 * 6241  风行碧落<玄>
 * 风行碧落<玄><煞><禅>：冷却减少10秒
 */
class Skill6241 extends BaseHookSkillStub {

    constructor() {
        super(6241);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

/**
 * 6246
 * 风行碧落<玄><煞><禅>：冷却减少10秒
 */
class Skill6246 extends BaseHookSkillStub {

    constructor() {
        super(6246);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

/**
 * 6251
 *
 */
class Skill6251 extends BaseHookSkillStub {

    constructor() {
        super(6251);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }
}

/**
 * 6260  春衫凝碧III  《天空》
 * 施法1秒，冷却35秒；
 * 减免伤害上限调整为90%；
 * 减免比例取消和技能躲闪挂钩，调整为level*30%，减免伤害最高至90%；
 * 去除牺牲结束时结算伤害
 *
 * 新增：英雄系特效同步至其他三个系列（只改了天空）
 * 天：格挡牺牲持续时间加3秒；额外附加10秒无我状态（免疫10米内伤害）
 * 雄：减免比例增加5%；额外附加10秒保护有利不被清状态
 */
class Skill6260 extends BaseHookSkillStub {

    constructor() {
        super(6260);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
         return 35000
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetBlessed(24, 12000);
        player.SetActivebecrit2(24000, 111, 6274, 1, 0);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Var1 = player.GetVar1();
        const d = Math.floor(20 * (Math.floor(Var1 / 500) + 1));

        const var2Value = skill.GetLevel() * 0.35;
        const value = var2Value > 0.88 ? 0.88 : var2Value;
        player.SetSacrifice(d, 26000, 0, value, 0);
        player.SetIntagible2(120, 10, 10100)
        return true
    }

}

/**
 * 6263  春衫凝碧III  《英雄》
 * 雄：减免比例增加5%；额外附加10秒保护有利不被清状态
 */
class Skill6263 extends BaseHookSkillStub {

    constructor() {
        super(6263);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const Var1 = player.GetVar1();
        const d = Math.floor(20 * (Math.floor(Var1 / 500) + 1));

        const var2Value = skill.GetLevel() * 0.35;
        const value = var2Value > 0.90 ? 0.90 : var2Value;

        player.SetSacrifice(d, 23000, 0, value, 0);
        player.SetBuffClearImmune(120, 10000)
        return true
    }

}

/**
 * 6274  春衫请冷却
 *
 */
class Skill6274 extends BaseHookSkillStub {

    constructor() {
        super(6274);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetClearcooldown(6263, 6260, 6263)
        return true
    }

}


/**
 * 6259  彤云扫天III雄
 * 施法1秒，冷却4秒
 * 雄：
 * 每段额外附加自身气血上限15%的攻击力，致命一击率15%，
 * 当目标为怪物时，无冷却，附加自身当前气血10%，附加爆伤100%；
 * 第一段令目标进入霜结状态5秒，6秒内概率封禁对方技能4个
 * 每段45%概率清除目标1个有利状态
 * 第一段和最后一段，5%概率禁食4秒
 */
class Skill6259 extends BaseHookSkillStub {

    constructor() {
        super(6259);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 5000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        //雄：
        // 每段额外附加自身气血上限15%的攻击力，致命一击率15%，
        // 当目标为怪物时，无冷却，附加自身当前气血10%，附加爆伤100%；
        // 第一段令目标进入霜结状态5秒，6秒内概率封禁对方技能4个
        // 每段45%概率清除目标1个有利状态
        // 第一段和最后一段，5%概率禁食4秒
        const level = skill.GetLevel();
        const v31 = (level + 2) * 0.01 + 0.15;
        skill.SetCrit(v31);

        const v32 = (5 * level + 10) * 0.01;
        skill.SetCrithurt(v32);

        const v25 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v25);

        const hasMultiBuff = player.GetHasmultbuff(127);

        let v4;
        let mobR = 0
        let mobP = 0
        if (hasMultiBuff) {
            v4 = level * 0.3 + 1.1 + v32 + 0.1;
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v4 = level * 0.3 + 1.1 + v32;
        }

        skill.SetRatio(v4 + mobR);

        const v5 = 1000 * level;
        const v26 = v5 + 116 * level + 729;
        skill.SetPlus(v26 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.1)
        skill.SetMobCrithurt(1.0)

        const Res5 = player.GetRes5();
        const Res4 = player.GetRes4();
        const Res3 = player.GetRes3();
        const Res2 = player.GetRes2();
        const var2Value = Res4 + Res3 + Res2 + player.GetRes1() + Res5;
        player.SetVar2(var2Value);

        const var4Value = player.GetRes3();
        player.SetVar4(var4Value);

        const var5Value = player.GetRes4();
        player.SetVar5(var5Value);

        const Maxhp = player.GetMaxhp();
        player.SetVar6(Maxhp);
        player.SetVar7(1);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        //雄：
        // 每段额外附加自身气血上限15%的攻击力，致命一击率15%，
        // 当目标为怪物时，无冷却，附加自身当前气血10%，附加爆伤100%；
        // 第一段令目标进入霜结状态5秒，6秒内概率封禁对方技能4个
        // 每段45%概率清除目标1个有利状态
        // 第一段和最后一段，5%概率禁食4秒
        const level = skill.GetLevel();
        const v24 = (level + 2) * 0.01 + 0.15;
        skill.SetCrit(v24);

        const v25 = (5 * level + 10) * 0.01;
        skill.SetCrithurt(v25);

        const v18 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v18);

        const hasMultiBuff = player.GetHasmultbuff(127);

        let v4;
        let mobR = 0
        let mobP = 0
        if (hasMultiBuff) {
            v4 = level * 0.3 + 1.1 + v25 + 0.1;
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v4 = level * 0.3 + 1.1 + v25;
        }

        skill.SetRatio(v4 + mobR);

        const v22 = level * 0.03 + 0.01;
        const hp = player.GetHp();
        const v23 = hp * v22;

        const v6 = 1000 * level;
        const v27 = v6 + 116 * level + 729 + v23;
        skill.SetPlus(v27 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.1)
        skill.SetMobCrithurt(1.0)

        const Res5 = player.GetRes5();
        const Res4 = player.GetRes4();
        const Res3 = player.GetRes3();
        const Res2 = player.GetRes2();
        const var2Value = Res4 + Res3 + Res2 + player.GetRes1() + Res5;
        player.SetVar2(var2Value);

        player.SetVar3(1);
        player.SetVar7(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();
        //雄：
        // 每段额外附加自身气血上限15%的攻击力，致命一击率15%，
        // 当目标为怪物时，无冷却，附加自身当前气血10%，附加爆伤100%；
        // 第一段令目标进入霜结状态5秒，6秒内概率封禁对方技能4个
        // 每段45%概率清除目标1个有利状态
        // 第一段和最后一段，5%概率禁食4秒
        const v22 = (level + 2) * 0.01 + 0.15;
        skill.SetCrit(v22);

        const v23 = (5 * level + 10) * 0.01;
        skill.SetCrithurt(v23);

        const v16 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v16);

        const hasMultiBuff = player.GetHasmultbuff(127);

        let v4;
        let mobR = 0
        let mobP = 0
        if (hasMultiBuff) {
            v4 = level * 0.3 + 1.1 + v23 + 0.1;
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v4 = level * 0.3 + 1.1 + v23;
        }
        skill.SetRatio(v4 + mobR);

        const v5 = 1000 * level;
        const v17 = v5 + 116 * level + 729;
        skill.SetPlus(v17 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.1)
        skill.SetMobCrithurt(1.0)

        const Res5 = player.GetRes5();
        const Res4 = player.GetRes4();
        const Res3 = player.GetRes3();
        const Res2 = player.GetRes2();

        const var2Value = Res4 + Res3 + Res2 + player.GetRes1() + Res5;
        player.SetVar2(var2Value);
        player.SetVar7(0);
        player.SetPerform(0);

    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();

        const v24 = (level + 2) * 0.01 + 0.15;
        skill.SetCrit(v24);

        const v25 = (5 * level + 10) * 0.01;
        skill.SetCrithurt(v25);

        const v18 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v18);

        const hasMultiBuff = player.GetHasmultbuff(127);

        let v4;
        let mobR = 0
        let mobP = 0
        if (hasMultiBuff) {
            v4 = level * 0.3 + 1.1 + v25 + 0.1;
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v4 = level * 0.3 + 1.1 + v25;
        }
        skill.SetRatio(v4 + mobR);

        const v22 = level * 0.03 + 0.01;
        const v23 = player.GetHp() * v22;

        const v5 = 1000 * level;
        const v27 = v5 + 116 * level + 729 + v23;
        skill.SetPlus(v27 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.1)
        skill.SetMobCrithurt(1.0)

        player.SetVar3(2);

        const Res5 = player.GetRes5();
        const Res4 = player.GetRes4();
        const Res3 = player.GetRes3();
        const Res2 = player.GetRes2();
        const Res1 = player.GetRes1();

        const var2Value = Res4 + Res3 + Res2 + Res1 + Res5;
        player.SetVar2(var2Value);
        player.SetVar7(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();

        const v22 = (level + 2) * 0.01 + 0.15;
        skill.SetCrit(v22);

        const v23 = (5 * level + 10) * 0.01;
        skill.SetCrithurt(v23);

        const v16 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v16);

        const hasMultiBuff = player.GetHasmultbuff(127);

        let v4;
        let mobR = 0
        let mobP = 0
        if (hasMultiBuff) {
            v4 = level * 0.3 + 1.1 + v23 + 0.1;
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v4 = level * 0.3 + 1.1 + v23;
        }
        skill.SetRatio(v4 + mobR);

        const v5 = 1000 * level;
        const v17 = v5 + 116 * level + 729;
        skill.SetPlus(v17 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.1)
        skill.SetMobCrithurt(1.0)

        const Res5 = player.GetRes5();
        const Res4 = player.GetRes4();
        const Res3 = player.GetRes3();
        const Res2 = player.GetRes2();
        const Res1 = player.GetRes1();

        const var2Value = Res4 + Res3 + Res2 + Res1 + Res5;
        player.SetVar2(var2Value);
        player.SetVar7(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();

        const v29 = (level + 2) * 0.01 + 0.15;
        skill.SetCrit(v29);

        const v30 = (5 * level + 10) * 0.01;
        skill.SetCrithurt(v30);

        const v24 = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(v24);

        const hasMultiBuff = player.GetHasmultbuff(127);

        let v4;
        let mobR = 0
        let mobP = 0
        if (hasMultiBuff) {
            v4 = level * 0.3 + 1.1 + v30 + 0.1;
            if (player.GetTargetTypeIsMob()) {
                mobR = 0.5
                mobP = player.GetMaxhp() * 0.05
            }
        } else {
            v4 = level * 0.3 + 1.1 + v30;
        }
        skill.SetRatio(v4 + mobR);

        const v27 = level * 0.03 + 0.01;
        const v28 = player.GetHp() * v27;

        const v5 = 1000 * level;
        const v32 = v5 + 116 * level + 729 + v28;
        skill.SetPlus(v32 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(mobP + player.GetHp() * 0.1)
        skill.SetMobCrithurt(1.0)

        player.SetVar1(1);
        player.SetVar3(3);

        const Res5 = player.GetRes5();
        const Res4 = player.GetRes4();
        const Res3 = player.GetRes3();
        const Res2 = player.GetRes2();
        const Res1 = player.GetRes1();

        const var2Value = Res4 + Res5 + Res3 + Res2 + Res1;
        player.SetVar2(var2Value);

        const Maxhp = player.GetMaxhp();
        player.SetVar6(Maxhp);
        player.SetVar7(2);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        // 第一段令目标进入霜结状态5秒，概率封禁对方技能4个,6秒
        // 每段45%概率清除目标1个有利状态
        // 第一段和最后一段，5%概率禁食4秒
        player.SetClearbuff(45, 1)

        if (player.GetVar7() == 1) {
            player.SetGFrosty(120, 5000)
            player.SetFenggong(45, 6000, 4)
            player.SetDiet(6, 4000)
        }

        if (player.GetVar7() == 2) {
            player.SetDiet(6, 4000)
        }

        return true
    }
}

/**
 * 6982  赤乌·寒影初回·曦日
 *  冷却减少30秒，
 * 令目标进入迟缓状态的概率调整为100%，
 * 令目标受到伤害加深的时间调整为15秒；
 * 额外吹飞目标6秒
 */
class Skill6982 extends BaseHookSkillStub {

    constructor() {
        super(6982);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetTorpescence(100, 24100, 0.48, 0.48, 30000);

        player.SetSubanti(-1, 24100, 90, 7);

        const v28 = 8 * (skill.GetLevel() + 5);
        player.SetWraptimer(v28, 2100, 2, 8);

        const v29 = skill.GetLevel() * 0.08;
        player.SetInchurt(120, v29, 15100);
        player.SetSuspend(120, 6000, 80, 0, 0)
        return true
    }

}

class FeiShengJiNeng extends QuickCoolDownList {
    getSkillList(): number[] {
        return [6007, 6008, 6009, 6010];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}


export class QingLuoSkillList {
    constructor() {
        const beXS = "_ZN16object_interface20SetSacrificeAttackerERK3XIDii"
        Interceptor.replace(HookFuncCore.getFuncAddress(beXS),
            new NativeCallback(() => {
                    return 1
                }, 'int32', ['pointer', 'int32', 'int32', 'int32']
            ));

        const dmg = "_ZN16object_interface15AddSacrificeDmgEi"
        Interceptor.replace(HookFuncCore.getFuncAddress(dmg),
            new NativeCallback(() => {
                    return 1
                }, 'int32', ['pointer', 'int32', 'int32', 'int32']
            ));

        const testCool = "_ZN16object_interface21TestSacrificeCoolDownEv"
        Interceptor.replace(HookFuncCore.getFuncAddress(testCool),
            new NativeCallback(() => {
                    return 1
                }, 'int32', ['pointer']
            ));

        new Skill6079()
        new Skill6017()
        new Skill6081()
        new Skill6078()
        new Skill6018()
        new Skill6091()
        new Skill6020()
        new Skill6015()
        new Skill6087()
        new Skill6088()
        new Skill6157()
        new Skill6089()
        new Skill6098()
        new Skill6102()
        new Skill6232()
        new Skill6229()
        new Skill6226()
        new Skill6228()
        new Skill6231()
        new Skill6224()
        new Skill6239()
        new Skill6244()
        new Skill6249()
        new Skill6241()
        new Skill6246()
        new Skill6251()
        new Skill6260()
        new Skill6263()
        new Skill6259()
        new Skill6982()
        new Skill6274()
        new FeiShengJiNeng()
    }
}