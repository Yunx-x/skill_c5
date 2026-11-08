import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 1886 风行者
 * 冷却时间减少15秒
 */
class Skill1886 extends BaseHookSkillStub {

    constructor() {
        super(1886);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

}

/**
 * 1910  双飞火
 * 施法时间1秒，无冷却，
 * 每段附加自身当前气血15%攻击力，10秒内被暴击伤害50%
 * 攻击怪物目标时，不需要蓄力，每击附加自身气血上限20%的攻击力
 */
class Skill1910 extends BaseHookSkillStub {

    constructor() {
        super(1910);
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

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 125
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 125
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v2 = 0
        let v3 = 0
        let v5 = 0
        player.SetVar1(1);

        if (player.GetTypeIsMob()) {
            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = (skill.GetLevel() * 0.05 + 0.5) + v15;
            skill.SetRatio(cb);

            skill.SetCrit(skill.GetLevel() * 0.01 + 0.05);
            skill.SetCrithurt(skill.GetLevel() * 0.05);
        } else {
            if (skill.GetCharging() <= 0xFA) {
                v2 = 0.0;
                v3 = 0.050000001;
                v5 = 0.0;
            } else {
                let v11 = skill.GetCharging() * 0.001;
                v2 = skill.GetLevel() * 0.05 * v11;
                v3 = skill.GetLevel() * 0.01 * v11 + 0.05;
                v5 = (skill.GetLevel() * 0.05 + 0.5) * v11;
            }

            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = v5 + v15;
            skill.SetRatio(cb);
            skill.SetCrit(v3);
            skill.SetCrithurt(v2);
        }

        let v8 = 19 * skill.GetLevel() + 472;
        skill.SetPlus(v8 + player.GetHp() * 0.15);

        const mobAtk = player.GetMaxhp() * 0.2;
        skill.SetMobBonusDamage(mobAtk);//对怪增伤
        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v2 = 0
        let v3 = 0
        let v5 = 0
        player.SetVar1(2);

        if (player.GetTypeIsMob()) {
            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = (skill.GetLevel() * 0.05 + 0.5) + v15;
            skill.SetRatio(cb);

            skill.SetCrit(skill.GetLevel() * 0.01 + 0.05);
            skill.SetCrithurt(skill.GetLevel() * 0.05);
        } else {
            if (skill.GetCharging() <= 0xFA) {
                v2 = 0.0;
                v3 = 0.050000001;
                v5 = 0.0;
            } else {
                let v11 = skill.GetCharging() * 0.001;
                v2 = skill.GetLevel() * 0.05 * v11;
                v3 = skill.GetLevel() * 0.01 * v11 + 0.05;
                v5 = (skill.GetLevel() * 0.05 + 0.5) * v11;
            }

            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = v5 + v15;
            skill.SetRatio(cb);
            skill.SetCrit(v3);
            skill.SetCrithurt(v2);
        }

        let v8 = 19 * skill.GetLevel() + 472;
        skill.SetPlus(v8 + player.GetHp() * 0.15);

        const mobAtk = player.GetMaxhp() * 0.2;
        skill.SetMobBonusDamage(mobAtk);//对怪增伤
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v2 = 0
        let v3 = 0
        let v5 = 0
        player.SetVar1(2);

        if (player.GetTypeIsMob()) {
            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = (skill.GetLevel() * 0.05 + 0.5) + v15;
            skill.SetRatio(cb);

            skill.SetCrit(skill.GetLevel() * 0.01 + 0.05);
            skill.SetCrithurt(skill.GetLevel() * 0.05);
        } else {
            if (skill.GetCharging() <= 0xFA) {
                v2 = 0.0;
                v3 = 0.050000001;
                v5 = 0.0;
            } else {
                let v11 = skill.GetCharging() * 0.001;
                v2 = skill.GetLevel() * 0.05 * v11;
                v3 = skill.GetLevel() * 0.01 * v11 + 0.05;
                v5 = (skill.GetLevel() * 0.05 + 0.5) * v11;
            }

            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = v5 + v15;
            skill.SetRatio(cb);
            skill.SetCrit(v3);
            skill.SetCrithurt(v2);
        }

        let v8 = 19 * skill.GetLevel() + 472;
        skill.SetPlus(v8 + player.GetHp() * 0.15);

        const mobAtk = player.GetMaxhp() * 0.2;
        skill.SetMobBonusDamage(mobAtk);//对怪增伤
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v2 = 0
        let v3 = 0
        let v5 = 0
        player.SetVar1(2);

        if (player.GetTypeIsMob()) {
            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = (skill.GetLevel() * 0.05 + 0.5) + v15;
            skill.SetRatio(cb);

            skill.SetCrit(skill.GetLevel() * 0.01 + 0.05);
            skill.SetCrithurt(skill.GetLevel() * 0.05);
        } else {
            if (skill.GetCharging() <= 0xFA) {
                v2 = 0.0;
                v3 = 0.050000001;
                v5 = 0.0;
            } else {
                let v11 = skill.GetCharging() * 0.001;
                v2 = skill.GetLevel() * 0.05 * v11;
                v3 = skill.GetLevel() * 0.01 * v11 + 0.05;
                v5 = (skill.GetLevel() * 0.05 + 0.5) * v11;
            }

            let v13 = skill.GetLevel() * 0.01 + 1.0;
            let v14 = skill.GetT1() * 0.02 + v13;
            let v15 = skill.GetT0() * 0.01 + v14;
            let cb = v5 + v15;
            skill.SetRatio(cb);
            skill.SetCrit(v3);
            skill.SetCrithurt(v2);
        }

        let v8 = 19 * skill.GetLevel() + 472;
        skill.SetPlus(v8 + player.GetHp() * 0.15);

        const mobAtk = player.GetMaxhp() * 0.2;
        skill.SetMobBonusDamage(mobAtk);//对怪增伤
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //增加被暴击伤害
        player.SetIncfatalhurt(120, 0.05 * (skill.GetLevel() + 1), 10100, 1)
        return true
    }
}

/**
 * 1909  侵如火
 * 姿态额外增加20%自身最大攻击力
 */
class Skill1909 extends BaseHookSkillStub {

    constructor() {
        super(1909);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = Math.floor(skill.GetLevel() * 0.2);
        let da = Math.floor(player.GetLevel() * d);
        const v9 = Math.floor(player.GetVar1() * 0.1);
        const ddd = Math.floor(skill.GetLevel() * v9 + da);

        const T0 = skill.GetT0();
        const dd = T0 * skill.GetLevel();
        player.SetAsfire(ddd + player.GetMaxatk() * 0.2, dd);
        return true
    }

}

/**
 * 1913  天衍阵
 * 瞬间释放，冷却时间调整为固定120秒，删除原有法阵效果
 * 新增效果—令自身获得神佑状态，免疫次数30次，持续时间20秒，最初5秒内为真无敌状态
 *
 * 当玄烛·固元术·曦日达到五级时，技能天衍的冷却时间减少60秒
 */
class Skill1913 extends BaseHookSkillStub {

    constructor() {
        super(1913);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6883) >= 5) {
            return 60000
        }

        return 120000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetInvincible(5000)
        player.SetBlessed(30, 4000 * skill.GetLevel())
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {

        return true
    }
}

/**
 * 1922  龙须虎
 * 施法1秒，一次召唤两只，冷却60秒
 */
class Skill1922 extends BaseHookSkillStub {

    constructor() {
        super(1922);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 700
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const v10 = 20000 * skill.GetT(0) + 40000;
        player.SetSummon(120, 30007, 2, v10, 1.0);
        return true
    }

}

/**
 * 3044  龙须虎<玄>
 * 施法1秒，冷却60秒
 */
class Skill3044 extends BaseHookSkillStub {

    constructor() {
        super(3044);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 700
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

}

/**
 * 3092  龙须虎<煞>
 * 施法1秒，冷却60秒
 */
class Skill3092 extends BaseHookSkillStub {

    constructor() {
        super(3092);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 700
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

}

/**
 * 3140  龙须虎<禅>
 * 施法1秒，冷却60秒
 */
class Skill3140 extends BaseHookSkillStub {

    constructor() {
        super(3140);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 700
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

}

/**
 * 2234  双飞火II
 * 施法1秒，冷却25秒，蓄力时间0.5秒
 * 附加气血百分比伤害120%
 */
class Skill2234 extends BaseHookSkillStub {

    constructor() {
        super(2234);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v2 = 0
        if (skill.GetCharging() <= 0xFA) {
            v2 = 0.0;
        } else {
            let hpa = skill.GetCharging() * 0.001;
            v2 = skill.GetLevel() * 0.06 * hpa;
        }
        skill.SetCrithurt(v2);

        let Charging;
        if (skill.GetCharging() <= 0xFA) {
            Charging = 0;

        } else {
            Charging = skill.GetCharging();
        }


        player.SetVar3(Charging);

        let hp;
        if (skill.GetCharging() <= 0xFA) {
            hp = 0.0;
        } else {
            hp = skill.GetCharging() * 0.001;
        }
        let ca = skill.GetLevel() * 0.01 * hp;
        skill.SetCrit(ca);

        player.SetVar1(1);

        let cb = skill.GetLevel() * 0.02 + 1.0;
        skill.SetRatio(cb);

        let hpb = player.GetHp() * 0.05;
        let v7 = skill.GetLevel() * hpb;
        player.SetVar2(Math.floor(v7));

        let hpc = player.GetHp() * 0.12;
        let cc = skill.GetLevel() * hpc;
        skill.SetPlus(cc);

        let newHp = player.GetHp() * 0.5;
        player.SetHp(newHp);

        player.SetPerform(1);
        return true

    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v2 = 0
        if (skill.GetCharging() <= 0xFA) {
            v2 = 0.0;
        } else {
            let hpa = skill.GetCharging() * 0.001;
            v2 = skill.GetLevel() * 0.06 * hpa;
        }
        skill.SetCrithurt(v2);

        let Charging;
        if (skill.GetCharging() <= 0xFA) {
            Charging = 0;

        } else {
            Charging = skill.GetCharging();
        }


        player.SetVar3(Charging);

        let hp;
        if (skill.GetCharging() <= 0xFA) {
            hp = 0.0;
        } else {
            hp = skill.GetCharging() * 0.001;
        }
        let ca = skill.GetLevel() * 0.01 * hp;
        skill.SetCrit(ca);

        player.SetVar1(2);

        let cb = skill.GetLevel() * 0.02 + 1.0;
        skill.SetRatio(cb);

        let hpb = player.GetHp() * 0.05;
        let v7 = skill.GetLevel() * hpb;
        player.SetVar2(Math.floor(v7));

        let hpc = player.GetHp() * 0.12;
        let cc = skill.GetLevel() * hpc;
        skill.SetPlus(cc);

        let newHp = player.GetHp() * 0.5;
        player.SetHp(newHp);

        player.SetPerform(1);
        return true
    }
}

/**
 * 3041 三云龙<玄>
 * 释放时间调整为1秒，蓄力0.5秒
 * 附加攻击力调整为10*level，每击额外附加自身气血上限15%的攻击力，新增羿皇临世效果，此技能无视目标神佑状态
 * 攻击怪物目标时无冷却，无需蓄力即可获得满蓄力效果，附加 3 段攻击(共6段)，附加“自身气血上限的 1%*level”的攻击力（最多不超过自身最大攻击力的 3 倍）
 */
class Skill3041 extends BaseHookSkillStub {

    constructor() {
        super(3041);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(1);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.01%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)

        player.SetIgnoreblessed(120, 1000)

        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(2);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(2);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

}

/**
 * 3089  三云龙<煞>
 * 释放时间调整为1秒，
 * 附加攻击力调整为10*level，每击额外附加自身气血上限20%的攻击力，新增羿皇临世效果，此技能无视目标神佑状态
 * 攻击怪物目标时无冷却，无需蓄力即可获得满蓄力效果，附加 3 段攻击(共6段)，附加“自身气血上限的 1%*level”的攻击力（最多不超过自身最大攻击力的 3 倍）
 */
class Skill3089 extends BaseHookSkillStub {

    constructor() {
        super(3089);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(1);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)

        player.SetIgnoreblessed(120, 1000)

        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(2);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(2);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

}

/**
 * 3137  三云龙<禅>
 *
 */
class Skill3137 extends BaseHookSkillStub {

    constructor() {
        super(3137);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(1);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)

        player.SetIgnoreblessed(120, 1000)

        player.SetPerform(1);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(2);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Charging = skill.GetCharging()
        if (player.GetTargetTypeIsMob()) {
            Charging = 1000
        }

        let v2 = 0
        let v8 = 0
        let v11 = 0

        if (Charging <= 0xFA) {
            v2 = 0.0;
        } else {
            const v16 = Charging * 0.001;
            v2 = skill.GetLevel() * 0.03 * v16;
        }
        skill.SetCrithurt(v2);

        const c2 = (Charging <= 0xFA) ? 0 : Charging;
        player.SetVar3(c2);
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);

        if (Charging <= 0xFA) {
            v8 = 0.0;
        } else {
            const v17 = Charging * 0.001;
            v8 = skill.GetLevel() * 0.01 * v17;
        }
        skill.SetCrit(v8);

        player.SetVar1(2);

        const v18 = skill.GetLevel() * 0.05 + 1.02;
        const Level = skill.GetLevel();
        const v14 = norm(Level / 14.9) * 0.03;
        const v19 = (skill.GetLevel() - 15) * v14 + v18;
        const v20 = skill.GetT0() * 0.01 + v19;

        if (Charging <= 0xFA) {
            v11 = 0.0;
        } else {
            const v15 = Charging * 0.001;
            v11 = (skill.GetLevel() * 0.1 + 0.5) * v15;
        }
        const cb = v11 + v20;
        skill.SetRatio(cb);

        const v13 = 9 * skill.GetLevel() + 515;
        skill.SetPlus(v13 + player.GetMaxhp() * 0.15);
        // 且额外附加自身气血限的 0.5%*level的攻击力（最多不超过自身最大攻击力的 3 倍）
        let mobDmg = player.GetMaxhp() * skill.GetLevel() * 0.01
        if (mobDmg > player.GetMaxatk() * 3) {
            mobDmg = player.GetMaxatk() * 3
        }

        skill.SetMobBonusDamage(mobDmg)
        player.SetPerform(0);
        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
        }
    }

}

/**
 * 3042  大羿王<玄>
 * 大羿王<玄><煞><禅>：冷却时间减少30秒，所有增益状态持续时间调整为30秒（原27秒）
 * 自身在15秒内技能伤害增加45%，增加反隐能力20点，单体攻击距离增加8米
 */
class Skill3042 extends BaseHookSkillStub {

    constructor() {
        super(3042);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const xr = player.GetSkilllevel(6877)
        const t = 1000 * skill.GetLevel() + 10000;
        const ta = skill.GetLevel() * 0.05;
        const tb = skill.GetLevel() * 0.04 + 0.001;
        const tc = (skill.GetLevel() + xr * 2) * 0.04;
        player.SetEloquenceLord(120, t, ta, tb, tc);

        player.SetEagleEye(120, 30000, 70);

        const te = player.GetRes5() * 0.01;
        player.SetAddantisleep(t, skill.GetLevel() * te, 1);

        // player.SetIncskilldamage(0.5, 15000, 1)
        player.SetAddspot(120, 20, 15000, 1)
        player.SetSingleatkchange(120, 15000, 8, 0)

        return true
    }

}

/**
 * 3090  大羿王<煞>
 * 大羿王<玄><煞><禅>：冷却时间减少30秒，所有增益状态持续时间调整为30秒（原27秒）
 * 自身在15秒内技能伤害增加45%，增加反隐能力20点，单体攻击距离增加8米
 */
class Skill3090 extends BaseHookSkillStub {

    constructor() {
        super(3090);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const xr = player.GetSkilllevel(6877)
        const t = 1000 * skill.GetLevel() + 10000;
        const ta = skill.GetLevel() * 0.05;
        const tb = skill.GetLevel() * 0.04 + 0.001;
        const tc = (skill.GetLevel() + xr * 2) * 0.04;
        player.SetEloquenceLord(120, t, ta, tb, tc);

        player.SetEagleEye(120, 30000, 70);

        const td = 1000 * skill.GetLevel() + 10000;
        const Player = skill.GetPlayerNice();
        const te = Player.GetRes2() * 0.01;
        player.SetAddantiweak(td, skill.GetLevel() * te, 1);

        player.SetAddspot(120, 20, 15000, 1)
        player.SetSingleatkchange(120, 15000, 8, 0)

        return true
    }

}

/**
 * 3138  大羿王<禅>
 * 大羿王<玄><煞><禅>：冷却时间减少30秒，所有增益状态持续时间调整为30秒（原27秒）
 * 自身在15秒内技能伤害增加45%，增加反隐能力20点，单体攻击距离增加8米
 */
class Skill3138 extends BaseHookSkillStub {

    constructor() {
        super(3138);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        const xr = player.GetSkilllevel(6877)

        const t = 1000 * skill.GetLevel() + 10000;
        const ta = skill.GetLevel() * 0.05;
        const tb = skill.GetLevel() * 0.04 + 0.001;
        const tc = (skill.GetLevel() + xr * 2) * 0.04;
        player.SetEloquenceLord(120, t, ta, tb, tc);

        player.SetEagleEye(120, 30000, 70);

        const td = 1000 * skill.GetLevel() + 10000;
        const Player = skill.GetPlayerNice();
        const te = Player.GetRes1() * 0.01;
        player.SetAddantidizzy(td, skill.GetLevel() * te, 1);

        // player.SetIncskilldamage(0.45, 15000, 1)
        player.SetAddspot(120, 20, 15000, 1)
        player.SetSingleatkchange(120, 15000, 8, 0)
        return true
    }


}

/**
 * 5775  三云龙Ⅲ《天空》
 * 释放时间调整为1秒，蓄力0.5秒
 * 附加攻击力调整为100%本体攻击力，每击额外附加自身气血上限8%*level的攻击力，增加羿皇临世效果，此技能无视目标神佑状态，
 * 攻击怪物目标时无冷却无需蓄力且每击额外附加自身气血上限20%的攻击力
 */
class Skill5775 extends BaseHookSkillStub {

    constructor() {
        super(5775);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let level = skill.GetLevel();

        v5 = parseInt(String((2 * level + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(1);

        const cb = (level * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * level + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.2)
        player.SetIgnoreblessed(120, 1000)
        player.SetPerform(1);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let level = skill.GetLevel();


        v5 = parseInt(String((2 * level + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(2);

        const cb = (level * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * level + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let level = skill.GetLevel();


        v5 = parseInt(String((2 * level + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(3);

        const cb = (level * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * level + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
    }
}

/**
 * 5776  三云龙Ⅲ《碧海》
 * 释放时间调整为1秒，蓄力0.5秒
 * 附加攻击力调整为100%本体攻击力，每击额外附加自身气血上限8%*level的攻击力，增加羿皇临世效果，此技能无视目标神佑状态，
 * 攻击怪物目标时无冷却无需蓄力且每击额外附加自身气血上限20%的攻击力
 */
class Skill5776 extends BaseHookSkillStub {

    constructor() {
        super(5776);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(1);


        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetIgnoreblessed(120, 1000)
        player.SetPerform(1);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(2);

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(3);

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
    }
}

/**
 * 5777  三云龙Ⅲ《大地》
 * 释放时间调整为1秒，蓄力0.5秒
 * 附加攻击力调整为100%本体攻击力，每击额外附加自身气血上限4%*level的攻击力，增加羿皇临世效果，此技能无视目标神佑状态，
 * 攻击怪物目标时无冷却无需蓄力且每击额外附加自身气血上限20%的攻击力
 */
class Skill5777 extends BaseHookSkillStub {

    constructor() {
        super(5777);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(1);

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetIgnoreblessed(120, 1000)
        player.SetPerform(1);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(2);

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let maxatk = player.GetMaxatk();
        player.SetVar2(maxatk);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(3);

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
    }
}

/**
 * 5778  三云龙Ⅲ《英雄》
 * 释放时间调整为1秒，蓄力0.5秒，攻击6次
 * 附加攻击力调整为100%本体攻击力，每击额外附加自身气血上限20%的攻击力，增加羿皇临世效果，此技能无视目标神佑状态，
 * 攻击怪物目标时无冷却无需蓄力且每击额外附加自身气血上限20%的攻击力
 */
class Skill5778 extends BaseHookSkillStub {

    constructor() {
        super(5778);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let hp = player.GetHp();
        player.SetVar2(hp);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(1);
        player.SetVar2(player.GetCultivation());

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetIgnoreblessed(120, 1000)
        player.SetPerform(1);
        player.SetPerform(0);
        if (player.GetCultivation() == 4) {
            player.SetPerform(0);
        }
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let hp = player.GetHp();
        player.SetVar2(hp);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(1);

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
        player.SetPerform(0);
        if (player.GetCultivation() == 4) {
            player.SetPerform(0);
        }
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let hp = player.GetHp();
        player.SetVar2(hp);

        let v5;
        if (player.GetTargetTypeIsMob()) {
            let v12 = skill.GetLevel() * 0.3;
            v5 = (5 * skill.GetLevel() + 10) * 0.01 + v12;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v12 = skill.GetLevel() * 0.3;
                let v13 = skill.GetCharging() * v12 * 0.001;
                v5 = (5 * skill.GetLevel() + 10) * 0.01 + v13;
            } else {
                v5 = (5 * skill.GetLevel() + 10) * 0.01;
            }
        }

        let v16 = v5;
        skill.SetCrithurt(v16);

        let v6;

        if (player.GetTargetTypeIsMob()) {
            let v14 = skill.GetLevel() * 0.03;
            v6 = (skill.GetLevel() + 2) * 0.01 + v14;
        } else {
            if (skill.GetCharging() > 0xFA) {
                let v14 = skill.GetLevel() * 0.03;
                let v15 = skill.GetCharging() * v14 * 0.001;
                v6 = (skill.GetLevel() + 2) * 0.01 + v15;
            } else {
                v6 = (skill.GetLevel() + 2) * 0.01;
            }
        }

        let v17 = v6;
        skill.SetCrit(v17);

        v5 = parseInt(String((2 * skill.GetLevel() + 4) * 0.01));
        skill.SetSkillaccu(v5);

        player.SetVar1(1);

        const cb = (skill.GetLevel() * 1.1) + 1.5 + 1.0;
        skill.SetRatio(cb);

        let plus = (1000 * skill.GetLevel() + 2000);
        let hpAtk = player.GetMaxhp() * 0.08 * skill.GetLevel();
        skill.SetPlus(plus + hpAtk);
        let mobDmg=player.GetMaxhp() * 0.2
        // if (mobDmg > player.GetMaxatk() * 3) {
        //     mobDmg = player.GetMaxatk() * 3
        // }

        skill.SetMobBonusDamage(mobDmg)

        player.SetPerform(0);
        player.SetPerform(0);
        if (player.GetCultivation() == 4) {
            player.SetPerform(0);
        }
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            const cult = player.GetVar2()
            if (cult == 1) {//仙
                player.SetDiet(120, 5000)
            } else if (cult == 2) {//魔
                player.SetSubhp(120, player.GetMaxhp() * 0.15, player.GetMaxhp() * 0.5, 5000, 2)
            }
        }

        return super.StateAttack(stub, skill, originFunc);
    }
}

/**
 * 5861  大羿王III  《天空》
 * 冷却时间减少20秒，所有增益状态持续时间调整为30秒，
 * 增加攻击距离10米，持续15秒
 */
class Skill5861 extends BaseHookSkillStub {

    constructor() {
        super(5861);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();
        victim.SetEloquenceLord(120, 30100, 0.75, 0.3001, 0.75);

        victim.SetEagleEye(120, 30000, 70);

        victim.SetCleardebuff(100, 30);
        victim.SetSingleatkchange(120, 15000, 10, 0)
        return true
    }

}

/**
 * 5862  大羿王III  《碧海》
 *
 */
class Skill5862 extends BaseHookSkillStub {

    constructor() {
        super(5862);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();
        victim.SetEloquenceLord(120, 30100, 0.75, 0.3001, 0.75);

        victim.SetEagleEye(120, 30000, 70);

        victim.SetIncskilldodge(100, 0.25, 30100, 1);
        victim.SetSingleatkchange(120, 15000, 10, 0)
        return true
    }

}

/**
 * 5863 大羿王III  《大地》
 * 大羿王Ⅲ《大地》：大地系特有效果改为增加自身15%点克仙、克魔、克佛属性，持续15秒
 */
class Skill5863 extends BaseHookSkillStub {

    constructor() {
        super(5863);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();
        victim.SetEloquenceLord(120, 30100, 0.75, 0.3001, 0.75);

        victim.SetEagleEye(120, 30000, 70);

        victim.SetSingleatkchange(120, 15000, 10, 0)

        victim.SetIncCultAtk(120, 15000, 0.15, 0, 0)
        victim.SetIncCultAtk(120, 15000, 0.15, 1, 1)
        victim.SetIncCultAtk(120, 15000, 0.15, 2, 2)
        return true
    }

}

/**
 * 5864  大羿王III  《英雄》
 *
 */
class Skill5864 extends BaseHookSkillStub {

    constructor() {
        super(5864);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();
        victim.SetEloquenceLord(120, 35100, 0.75, 0.3001, 0.75);

        victim.SetEagleEye(120, 30000, 70);

        victim.SetSingleatkchange(120, 15000, 10, 0)
        return true
    }

}

/**
 * 2188  狐影术
 * 大羿王Ⅲ《英雄》：狐影术触发的真无敌时间调整为2.5秒
 */
class Skill2188 extends BaseHookSkillStub {

    constructor() {
        super(2188);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const d = skill.GetLevel() * 0.3;
        player.SetFoxstate(120, d);

        player.SetClearslow(120);

        player.SetClearwrap(120);

        const playerSkillLevel = player.GetSkilllevel(5864);
        let t = 0
        if (playerSkillLevel > 0) {
            t = 2600 //修改为2.5秒
        }

        player.SetInvincible(t);
        return true
    }

}

/**
 * 2664 四濯：影
 * 神佑免疫次数提高至30次，持续时间调整为15秒，冷却时间减少290秒
 */
class Skill2664 extends BaseHookSkillStub {

    constructor() {
        super(2664);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 70000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 4)

        player.SetBlessed(30, 12000)
        return true
    }

}

/**
 * 2214  老虎流血
 * 修改老虎流血对怪物无效
 *
 */
class Skill2214 extends BaseHookSkillStub {

    constructor() {
        super(2214);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetProbability(600.0);
        player.SetWeak(600, 6000, 0.5, 1);

        if (player.GetTypeIsPlayer()) {
            let d = Math.floor(player.GetVar1() * 0.05);
            let v21 = Math.floor(player.GetMaxhp() * 0.1);
            let v14 = Math.floor(player.GetVar1() * 0.05);
            if (d <= Math.floor(player.GetVar2() * v21)) {
                let da = Math.floor(player.GetMaxhp() * 0.1);
                v14 = Math.floor(player.GetVar2() * da);
            }

            player.SetHpleak(120, 6000, v14, 0.0, 1);
        }

        return true
    }

}

/**
 * 2213  召唤兽砂河電
 * 砂河電Ⅱ令召唤兽砂河電分担人物受到伤害的比例额外提升 1%*level
 */
class Skill2213 extends BaseHookSkillStub {
    constructor() {
        super(2213);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetRetort(120, 0.6 + skill.GetLevel() * 0.01, 100, 0, 5000)
        return true
    }

}

/**
 * 2224  沧澜破II
 * 直接附加自身当前真气值120%的伤害，60秒冷却，无视目标神佑状态
 */
class Skill2224 extends BaseHookSkillStub {

    constructor() {
        super(2224);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v2 = 0
        if (skill.GetCharging() <= 0xFA) {
            v2 = 0.0;
        } else {
            const mpc = skill.GetCharging() * 0.001;
            v2 = skill.GetLevel() * 0.06 * mpc;
        }
        skill.SetCrithurt(v2);

        let mp;
        if (skill.GetCharging() <= 0xFA)
            mp = 0.0;
        else
            mp = skill.GetCharging() * 0.001;
        const ca = skill.GetLevel() * 0.01 * mp;
        skill.SetCrit(ca);

        const player = skill.GetPlayerNice();
        const mpa = player.GetMaxmp();
        let v4;
        if (skill.GetCharging() <= 0xFA)
            v4 = 0.0;
        else
            v4 = skill.GetCharging() * 0.001;
        const cb = v4 * mpa * 1.2;
        skill.SetPlus(cb);

        const v8 = player.GetMp();
        let mpb;
        if (skill.GetCharging() <= 0xFA)
            mpb = 0.0;
        else
            mpb = skill.GetCharging() * 0.0005 * 0.05;
        const mpd = (1.0 - skill.GetLevel() * mpb) * v8;
        player.SetMp(mpd);
        player.SetIgnoreblessed(120, 1000)
        player.SetPerform(1);
    }

}

/**
 * 6872  赤乌·退魔矢·萤炬
 * 【赤乌·退魔矢·莹拒/皓月/曦日】新增效果:令目标 20 秒内受到的伤害增加11%/22%/33%,可与其他增伤叠加
 */
class Skill6872 extends BaseHookSkillStub {

    constructor() {
        super(6872);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInchurt3(120, 0.11, 20000, 1.0)
        return true
    }

}

class Skill6873 extends BaseHookSkillStub {

    constructor() {
        super(6873);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInchurt3(120, 0.22, 20000, 1.0)
        return true
    }

}

class Skill6874 extends BaseHookSkillStub {

    constructor() {
        super(6874);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInchurt3(120, 0.33, 20000, 1.0)
        return true
    }

}

/**
 * 1904  固元术
 * 玄烛·固元术·曦日：护盾减免提高15%，免疫群体技能的时间调整为15秒
 */
class Skill1904 extends BaseHookSkillStub {

    constructor() {
        super(1904);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetExorcism(120, 3, 2, 0);

        const v7 = 20 * skill.GetLevel();
        const d = v7 + 10 * skill.GetT0() + 20;
        player.SetCleardebuff(d, 3);

        const Skilllevel = player.GetSkilllevel(6881);
        const v14 = player.GetSkilllevel(6882) + Skilllevel;
        const star_lvl = v14 + player.GetSkilllevel(6883);

        if (star_lvl > 0) {
            const da = 15 * star_lvl + 40;
            const db = 3000 * Math.floor(star_lvl / 5) + 5100.0;
            player.SetAoEImmune(da, db);

            let ratio = 0.45;
            if (player.GetSkilllevel(6882) > 0)
                ratio = 0.65;
            if (player.GetSkilllevel(6883) > 0)
                ratio = 0.85;
            player.SetDechurt(15100, ratio, 9999999);
        }

        return true
    }
}

/**
 * 1906 如梦令
 * 【玄烛·如梦令·萤炬/皓月/曦日】降低目标减免伤害百分比调整为 1/2/3*level,持续时间调整为 8秒
 */
class Skill1906 extends BaseHookSkillStub {

    constructor() {
        super(1906);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const var3 = player.GetVar3();
        const var4 = player.GetVar4();
        const var5 = player.GetVar5();
        const star_lvl = var4 + var3 + var5;
        if (star_lvl) {
            let chance = 100.0;

            let ddd = 0
            if (var3 > 0) {
                chance = player.GetVar2() * 0.8 + 100.0;
                ddd = 0.01
            }
            if (var4 > 0) {
                chance = player.GetVar2() * 0.9 + chance;
                ddd = 0.02
            }
            if (var5 > 0) {
                chance = player.GetVar2() + chance;
                ddd = 0.03
            }

            const d = player.GetVar6() * 0.1;
            player.SetDsleep(chance, 4100, d);

            const da = star_lvl * ddd;
            player.SetFlamecurse(120, 8100, da, 1.0);
        }

        const var1 = player.GetVar1();
        const v26 = player.GetVar1();
        const db = (var1 + skill.GetLevel() * v26 / 5);
        const dc = (2000 * skill.GetT1() + 6000);
        player.SetSleep(db, dc, 0.0);
        return true
    }

}

/**
 * 1911  镇龙击
 * 玄烛·镇龙击·曦日：驱散目标有利概率提高至100%
 */
class Skill1911 extends BaseHookSkillStub {

    constructor() {
        super(1911);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        var chb = 0;
        var amb = 0;

        var var3 = player.GetVar(3);
        var var4 = player.GetVar(4);
        var var5 = player.GetVar(5);//曦日

        var star_lvl = var5 + var4 + var3;

        if (var3 > 0) {
            chb = 6;
            amb = 1;
        }

        if (var4 > 0) {
            chb = 12;
            amb = 2;
        }

        if (var5 > 0) {
            chb = 100;//直接修改为100
            amb = 4;
        }

        const level = skill.GetLevel();
        const d = chb + 5 * (skill.GetT1() + level) + 20;
        const v20 = amb + 1;
        player.SetClearbuff(d, v20);

        if (star_lvl) {
            const v23 = player.GetBuffcnt() <= 6 ? 0.0 : 120.0;
            const v21 = 2 * star_lvl;
            const v22 = 15 - star_lvl;
            player.SetClearbuffDuration(v23, v21, v22);
        }

        return true
    }

}

/**
 * 飞升技能
 * 孤星：烈/武/烈/影/华/昊/皇 冷却时间调整至120秒。
 * 双娇：烈/武/烈/影/华/昊/皇 冷却时间调整至120秒。
 * 三叹：烈/武/烈/影/华/昊/皇 冷却时间调整至120秒。
 * 四濯：烈/武/烈/华/昊/皇 冷却时间调整至120秒。
 */
class FeiShengLieShan extends QuickCoolDownList {
    getSkillList(): number[] {
        return [2253, 2257, 2661, 2677, 3821, 4597,//孤星
            2254, 2258, 2662, 2678, 3822, 4598,//双娇
            2255, 2259, 2663, 2679, 3823, 4599,//三叹
            2256, 2260, 2680, 3824, 4600];//四濯
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

export class LieShanSkillList {
    constructor() {
        new Skill1886()
        new Skill1910()
        new Skill1909()
        new Skill1913()
        new Skill1922()
        new Skill3044()
        new Skill3092()
        new Skill3140()
        new Skill2234()
        new Skill3041()
        new Skill3089()
        new Skill3137()
        new Skill3042()
        new Skill3090()
        new Skill3138()
        new Skill5775()
        new Skill5776()
        new Skill5777()
        new Skill5778()
        new Skill5861()
        new Skill5862()
        new Skill5863()
        new Skill5864()
        new Skill2188()
        new Skill2664()
        new Skill2214()
        new Skill2213()
        new Skill2224()
        new Skill6872()
        new Skill6873()
        new Skill6874()
        new Skill1904()
        new Skill1911()
        new Skill1906()
        new FeiShengLieShan()
    }
}