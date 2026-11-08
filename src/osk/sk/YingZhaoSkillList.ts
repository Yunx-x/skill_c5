import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";
import {getSkillStub} from "../../base/skill/HookSkillUtil";

/**
 * 4844 令·急行
 * 冷却减少30秒，移动速度额外加1米
 *
 * 玄烛·急行·曦日：重置狂澜术的几率调整为60%
 */
class Skill4844 extends BaseHookSkillStub {

    constructor() {
        super(4844);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 2000 * skill.GetLevel() + 8000;
        player.SetAddspeed(120, t, 4, 0);

        let v7;
        if (skill.GetT0() <= 0) {
            v7 = 10.0;
        } else {
            const ta = 2000 * skill.GetLevel() + 8000;
            v7 = (skill.GetT0() * 0.33 + 0.01) * ta;
        }
        player.SetImmuneslow(v7);

        let chance = 0;

        if (player.GetSkilllevel(6965) > 0)
            chance = 10;
        if (player.GetSkilllevel(6966) > 0)
            chance = 15;
        if (player.GetSkilllevel(6967) > 0)
            chance = 60;
        if (chance && zrand(100) <= chance) {
            player.SetClearcooldown(4874, 0, 0);
        }

        return true
    }

}

/**
 * 4853  令·奔袭
 * 冷却减少15秒
 */
class Skill4853 extends BaseHookSkillStub {

    constructor() {
        super(4853);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

}

/**
 * 4871  麒麟化身
 * 变麒麟1秒冷却，变回来1秒冷却
 */
class Skill4871 extends BaseHookSkillStub {

    constructor() {
        super(4871);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();
        victim.SetSetcooldown(120, 5325, 0, 0, 1000);
        return true
    }

}

/**
 * 5324 变身麒麟后设置变回人冷却
 */
class Skill5324 extends BaseHookSkillStub {

    constructor() {
        super(5324);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();
        victim.SetSetcooldown(120, 4871, 5325, 0, 1000);
        return true
    }

}

/**
 * 4873  背水
 * 瞬间冷却
 * 玄烛·背水·曦日：若目标被致命一击额外附加气血2%*level伤害；
 *
 */
class Skill4873 extends BaseHookSkillStub {

    constructor() {
        super(4873);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let cultivation = player.GetCultivation();
        let cul = (cultivation === 2) ? player.GetSkilllevel(5256) * 0.1 : 0.0;
        let dam = 0;
        let star_ratio = 0.0;

        if (player.GetHasbuff(4274)) {
            let rage = player.GetRage() * 0.01;
            dam = Math.floor(player.GetSkilllevel(4852) * rage);
        }

        if (player.GetSkilllevel(6962) > 0) {
            star_ratio = 0.30000001;
        }

        if (player.GetSkilllevel(6963) > 0) {
            star_ratio = 0.60000002;
        }

        if (player.GetSkilllevel(6964) > 0) {
            star_ratio = 0.80000001;
        }

        let skillLevel6962 = player.GetSkilllevel(6962);
        let skillLevel6963 = player.GetSkilllevel(6963);
        let skillLevel6964 = player.GetSkilllevel(6964);
        let star_lvl = skillLevel6962 + skillLevel6963 + skillLevel6964;

        let isCrit = player.GetIscrit();
        let v45 = (80 * skill.GetLevel() + 640) + (dam * cul);
        let pa = 0.0;

        if (isCrit) {
            pa = ((star_lvl * player.GetMaxhp()) * 0.02) + v45;//2%最大血
        }

        skill.SetPlus(pa);

        let pb = (player.GetLevel() * 0.04) + (skillLevel6962 * 0.05) + 1.0 + star_ratio;
        skill.SetRatio(pb);

        let critModifier = 1.0;

        if (isCrit) {
            if (player.GetHasbuff(4274)) {
                let rage = player.GetRage();
                let rageRatio = rage / player.GetMaxhp();
                let skillLevel4852 = player.GetSkilllevel(4852);
                let rageModifier = rageRatio / (-5 * skillLevel4852 + 30);
                let missingHp = (player.GetMaxhp() - player.GetHp()) / player.GetMaxhp();
                let cultivationModifier = (cultivation === 2) ? skillLevel6962 * 0.05 : 0.0;
                critModifier = (cultivationModifier * missingHp) + rageModifier;
            } else {
                critModifier = -10.0;
            }
        }

        skill.SetCrit(critModifier);

        player.SetVar(1, 2);
        player.SetPerform(0);
    }
}

/**
 * 4856  分化术
 * 冷却15秒
 */
class Skill4856 extends BaseHookSkillStub {

    constructor() {
        super(4856);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }
}

/**
 * 4867  直捣黄龙
 * 冷却30秒，自身获得技能命中20点，持续20秒
 */
class Skill4867 extends BaseHookSkillStub {

    constructor() {
        super(4867);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskillaccu(120, 0.2, 20000, 1)
        return true
    }

}

/**
 * 4859  破天
 * 无冷却，攻击9次，施法1秒；
 * 每击追加的本体攻击力额外提升100%；
 * 每击附加伤害调整为自身10%气血，敛锋状态直接叠加至30层；
 * 攻击怪物目标时，令其受到伤害调整为5%*level；
 * 6秒内目标被暴击增加15%，被暴击伤害增加100%
 */
class Skill4859 extends BaseHookSkillStub {

    constructor() {
        super(4859);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
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

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Hp = player.GetHp();
        const buffLevel = player.GetBufflevel(9360);
        player.SetVar1(Hp);
        player.SetVar3(buffLevel);
        const v7 = 20 * skill.GetLevel() + 160;
        skill.SetPlus(v7 + Hp * 0.1);
        const v8 = skill.GetLevel() * 0.02 + 2.0;
        const v9 = buffLevel * 0.09 + v8;
        skill.SetRatio(v9);
        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Hp = player.GetHp();
        const buffLevel = player.GetBufflevel(9360);
        player.SetVar1(Hp);
        player.SetVar3(buffLevel);
        const v7 = 20 * skill.GetLevel() + 160;
        skill.SetPlus(v7 + Hp * 0.1);
        const v8 = skill.GetLevel() * 0.02 + 2.0;

        const v9 = buffLevel * 0.09 + v8;
        skill.SetRatio(v9);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Hp = player.GetHp();
        const buffLevel = player.GetBufflevel(9360);
        player.SetVar1(Hp);
        player.SetVar3(buffLevel);
        const v7 = 20 * skill.GetLevel() + 160;
        skill.SetPlus(v7 + Hp * 0.1);
        const v8 = skill.GetLevel() * 0.02 + 2.0;
        const v9 = buffLevel * 0.09 + v8;
        skill.SetRatio(v9);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Hp = player.GetHp();
        const buffLevel = player.GetBufflevel(9360);
        player.SetVar1(Hp);
        player.SetVar3(buffLevel);
        player.SetVar2(1);
        const v7 = 20 * skill.GetLevel() + 160;
        skill.SetPlus(v7 + Hp * 0.1);
        const v8 = skill.GetLevel() * 0.02 + 2.0;
        const v9 = buffLevel * 0.09 + v8;
        skill.SetRatio(v9);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar2() == 1) {
            const d = skill.GetLevel();
            const var1 = player.GetVar1() * 0.01 * d;
            player.SetRagegen(120, var1, 0, 100, 8);
        }

        player.AddRestrainedEdge(120, 30, 20000);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetTypeIsMob()) {
            const var1 = player.GetVar1() * 0.15 + (player.GetVar3() * 0.01 * player.GetVar1());
            player.SetDirecthurt(120, var1);

            const da = skill.GetLevel() * 0.05;
            player.SetInchurt(120, da, 10000);
            player.SetIncfatalratio(120, 0.15, 6000, 1)
            player.SetIncfatalhurt(120, 1.0, 6000, 1)
        }
        return true
    }

}

/**
 * 4880  阎王敌
 * 每秒增加50%的怒气；无敌延长5秒
 * 玄烛·阎王敌·曦日：持续时间内，自身所有抗性增加300点（可叠加）；
 * 技能达到五级时，冷却时间减少40秒，阎王敌持续时间增加8秒；
 */
class Skill4880 extends BaseHookSkillStub {

    constructor() {
        super(4880);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();

        let xrTime = 0
        if (player.GetSkilllevel(6961) >= 5) {
            xrTime = 40000
        }

        return 120000 - xrTime;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const T1 = skill.GetT1();
        const v4 = skill.GetT2() + T1;
        const firmus = v4 + skill.GetT3();
        const v5 = 1000 * skill.GetT0() + 10000;
        const v6 = (firmus <= 4) ? 0 : 5000;

        let xrTime = 0
        if (player.GetSkilllevel(6961) >= 5) {
            xrTime = 8000
        }

        const t = v5 + v6 + xrTime;

        const ta = 0.5 * player.GetMaxhp();
        player.SetBuxiu(120, ta, t);
        // player.SetTurndebuff(10000, 1, 1)
        player.SetInvincible(5000)

        let tlvl = 0;
        if (player.GetSkilllevel(6959) > 0)
            tlvl = 1;
        if (player.GetSkilllevel(6960) > 0)
            tlvl = 2;
        if (player.GetSkilllevel(6961) > 0)
            tlvl = 4;
        if (tlvl) {
            player.SetAddanti(300, t, 9)

            player.SetDelaycast(120, 20000, 7080, tlvl, 1);
        }

        return true
    }

}

/**
 * 4877  纵横天下
 * 冷却26秒；和纵横天下二代不再共享冷却；攻击怪物目标时，附加20秒内降低目标减免致命一击伤害100%的效果。
 */
class Skill4877 extends BaseHookSkillStub {

    constructor() {
        super(4877);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 26000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = (80 * skill.GetLevel() + 640);
        const v18 = player.GetVar1() * 0.1;
        const newValue = skill.GetLevel() * v18 + d;
        player.SetCycleskill(120, 1.0, newValue, 0.0, 10000);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();

        if (player.GetTypeIsMob()) {
            player.SetIncfatalhurt(120, 1.0, 20000, 1)
        }

        return true
    }
}

/**
 * 4865  计·围魏救赵
 * 强化雄辩天书，令其嘲讽能力加强为自身的魅抗+80点
 *
 * 5264围魏救赵II：魅惑能力调整为自身魅惑抗性+200点
 */
class Skill4865 extends BaseHookSkillStub {

    constructor() {
        super(4865);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Skilllevel;
        if (player.GetCultivation() == 4) {
            Skilllevel = player.GetSkilllevel(5264);
        } else {
            Skilllevel = 0;
        }
        player.SetVar2(Skilllevel);
        if (player.GetCultivation() == 4 && Skilllevel > 0) {
            const v15 = player.GetRes4() + 20 * Skilllevel;
            player.SetVar1(v15);
        } else {
            const Res4 = player.GetRes4() + 80;
            player.SetVar1(Res4);
        }

        player.SetPerform(1);
    }

}

/**
 * 4861  阵·十面埋伏
 * 法阵额外降低自身周围目标50%的施法速度
 */
class Skill4861 extends BaseHookSkillStub {

    constructor() {
        super(4861);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetParalysis(120, 10000, 0.5, 0)
        return true
    }

}

/**
 * 4874  狂澜术
 * 令目标进入麻痹状态，移动速度减少50%，技能施法减少50%
 *
 * 5265狂澜术II：使用后附加神佑效果，免疫伤害和不利效果40次
 */
class Skill4874 extends BaseHookSkillStub {

    constructor() {
        super(4874);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v4;
        if (player.GetCultivation() == 4 && player.GetSkilllevel(5265) > 0) {
            v4 = 10000;
        } else {
            v4 = 0;
        }

        player.SetBlessed(4 * player.GetSkilllevel(5265), v4);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetParalysis(120, skill.GetLevel() * 500 + 2500, 0.5, 0.5)
        return true
    }

}

/**
 * 5266  纵横天下<玄>
 * 冷却减少5秒，和纵横天下不再共享冷却；附加本体攻击力10%*level，额外附加致命一击率level%；
 *
 * <玄>不再附加焦土II效果。
 * 可以嘲讽玩家，嘲讽能力继承计·围魏救赵
 * 攻击怪物目标时，附加20秒内降低目标减免致命一击伤害300%的效果
 */
class Skill5266 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(5266)
        stub.pointer.add(0x30).writeU8(1)
        super(5266);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 5000;
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 12.0
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Skilllevel;
        if (player.GetCultivation() == 4) {
            Skilllevel = player.GetSkilllevel(5264);
        } else {
            Skilllevel = 0;
        }
        player.SetVar2(Skilllevel);
        if (player.GetCultivation() == 4 && Skilllevel > 0) {
            const v15 = player.GetRes4() + 20 * Skilllevel;
            player.SetVar1(v15);
        } else {
            const Res4 = player.GetRes4() + 80;
            player.SetVar1(Res4);
        }

        super.Calculate1(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ta = (500 * skill.GetLevel() + 4500);
        const tb = skill.GetLevel() * 0.1 + 1.0;
        const tc = (80 * skill.GetLevel() + 640);
        player.SetCycleskill(120, tb, tc, 0.001 * skill.GetLevel(), ta);
        return true
    }

}

/**
 * 5270
 * 纵横天下<玄><煞><禅>附加本体攻击力由 7%*level 上调至10%*level,
 * 新增效果:额外附加致命一击率level%，
 * 攻击范围由 10 米调整为 12米
 */
class Skill5270 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(5270)
        stub.pointer.add(0x30).writeU8(1)
        super(5270);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 5000;
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 12.0
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Skilllevel;
        if (player.GetCultivation() == 4) {
            Skilllevel = player.GetSkilllevel(5264);
        } else {
            Skilllevel = 0;
        }
        player.SetVar2(Skilllevel);
        if (player.GetCultivation() == 4 && Skilllevel > 0) {
            const v15 = player.GetRes4() + 20 * Skilllevel;
            player.SetVar1(v15);
        } else {
            const Res4 = player.GetRes4() + 80;
            player.SetVar1(Res4);
        }

        super.Calculate1(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const tb = (500 * skill.GetLevel() + 4500);

        const tc = skill.GetLevel() * 0.1 + 1.0;
        const maxhp = player.GetMaxhp();
        const td = (maxhp - player.GetHp());
        const t = td / player.GetMaxhp();

        let cirt = 0.01 * skill.GetLevel()
        if (player.GetCultivation() === 2) {
            const skillLevel5260 = player.GetSkilllevel(5260) * 0.05;
            cirt += skillLevel5260 * t;
        }

        const tf = (80 * skill.GetLevel() + 640);
        player.SetCycleskill(120, tc, tf, cirt, tb);
        return true
    }

}

/**
 * 5274
 * 纵横天下<玄><煞><禅>附加本体攻击力由 7%*level 上调至10%*level,
 * 新增效果:额外附加致命一击率level%，
 * 攻击范围由 10 米调整为 12米
 */
class Skill5274 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(5274)
        stub.pointer.add(0x30).writeU8(1)
        super(5274);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 5000;
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 12.0
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Skilllevel;
        if (player.GetCultivation() == 4) {
            Skilllevel = player.GetSkilllevel(5264);
        } else {
            Skilllevel = 0;
        }
        player.SetVar2(Skilllevel);
        if (player.GetCultivation() == 4 && Skilllevel > 0) {
            const v15 = player.GetRes4() + 20 * Skilllevel;
            player.SetVar1(v15);
        } else {
            const Res4 = player.GetRes4() + 80;
            player.SetVar1(Res4);
        }

        super.Calculate1(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const tb = (500 * skill.GetLevel() + 4500);

        const tc = skill.GetLevel() * 0.1 + 1.0;
        const maxhp = player.GetMaxhp();
        const td = (maxhp - player.GetHp());
        const t = td / player.GetMaxhp();

        let cirt = 0.01 * skill.GetLevel()
        if (player.GetCultivation() === 2) {
            const skillLevel5260 = player.GetSkilllevel(5260) * 0.05;
            cirt += skillLevel5260 * t;
        }

        const tf = (80 * skill.GetLevel() + 640);
        player.SetCycleskill(120, tc, tf, cirt, tb);
        return true
    }

}

/**
 * 5269  阎王敌<玄>
 * 冷却90秒；
 * 额外附加10秒焚香玉册效果，免疫所有不利状态；
 * 免伤延长15秒；无敌10秒；
 * 每秒增加50%的怒气；
 * <玄>：五抗额外加100点持续30秒
 * <煞>：暴伤持续30秒；
 * <禅>：额外附加15秒焚香玉册效果；额外免疫冰冻30秒
 */
class Skill5269 extends BaseHookSkillStub {

    constructor() {
        super(5269);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 1000 * skill.GetT0() + 25000;
        const ta = 0.5 * player.GetMaxhp();
        player.SetBuxiu(120, ta, t);
        player.SetTurndebuff(10000, 1, 1)
        player.SetInvincible(10000)

        const ta2 = 5 * skill.GetLevel() + 100;
        player.SetAddanti(ta2, 30000, 0);
        return true
    }

}

/**
 * 5273
 *
 */
class Skill5273 extends BaseHookSkillStub {

    constructor() {
        super(5273);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 1000 * skill.GetT0() + 25000;
        const ta = 0.5 * player.GetMaxhp();
        player.SetBuxiu(120, ta, t);
        player.SetTurndebuff(10000, 1, 1)
        player.SetInvincible(10000)

        const ta2 = skill.GetLevel() * 0.05;
        player.SetInccrithurt(120, ta2, 30000, 0);
        return true
    }
}

/**
 * 5277
 * 冷却90秒；
 * 额外附加10秒焚香玉册效果，免疫所有不利状态；
 * 免伤延长15秒；无敌10秒；
 * 每秒增加50%的怒气；
 * <玄>：五抗额外加100点持续30秒
 * <煞>：暴伤持续30秒；
 * <禅>：额外附加15秒焚香玉册效果；额外免疫冰冻30秒
 */
class Skill5277 extends BaseHookSkillStub {

    constructor() {
        super(5277);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 1000 * skill.GetT0() + 25000;
        const ta = 0.5 * player.GetMaxhp();
        player.SetBuxiu(120, ta, t);
        player.SetTurndebuff(15000, 1, 1)
        player.SetInvincible(10000)
        player.SetFrozenImmune(120, 30000);
        return true
    }

}

/**
 * 5268  逆鳞断<玄>
 * 冷却减少75秒，攻击目标12次，
 * 每击附加当前气血7%攻击力（其中六段伤害仅对攻击怪物目标时生效）；
 * 无视目标抗性，嘲讽目标5秒
 * <玄>：附加攻击力加强为怒气的100%
 */
class Skill5268 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(5268)
        stub.pointer.add(0x30).writeU8(1)
        super(5268);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 75000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let p = skill.GetT0() * 0.05;
        skill.SetCrit(p);
        skill.SetRatio(2.0);

        if (player.GetHasbuff(4271)) {
            skill.SetPlus(player.GetRage() + player.GetHp() * 0.07);
        } else {
            skill.SetPlus(0.0);
        }

        if (player.GetHasbuff(4271)) {
            skill.SetPlus2(0.0);
        } else {
            skill.SetPlus2(player.GetRage() + player.GetHp() * 0.07);
        }

        player.SetRage(0);
        player.SetPerform(1);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);

        if (player.GetTypeIsMob()) {
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
        }
    }

}

/**
 * 5272
 *
 */
class Skill5272 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(5272)
        stub.pointer.add(0x30).writeU8(1)
        super(5272);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 75000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v14 = skill.GetT0() * 0.05;
        let v12 = skill.GetLevel() * 0.01;
        let v13 = player.GetRage() * v12;
        let p = v13 / player.GetMaxhp() + v14;
        skill.SetCrit(p);
        skill.SetRatio(2.0);

        if (player.GetHasbuff(4271)) {
            let v15 = skill.GetLevel() * 0.025 + 0.5;
            let pa = player.GetRage() * v15;
            skill.SetPlus(pa + player.GetHp() * 0.07);
        } else {
            skill.SetPlus(0.0);
        }

        if (player.GetHasbuff(4271)) {
            skill.SetPlus2(0.0);
        } else {
            let v16 = skill.GetLevel() * 0.025 + 0.5;
            let pb = player.GetRage() * v16;
            skill.SetPlus2(pb + player.GetHp() * 0.07);
        }

        player.SetRage(0);
        player.SetPerform(1);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);

        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
        }
    }
}

/**
 * 5276
 *
 */
class Skill5276 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(5276)
        stub.pointer.add(0x30).writeU8(1)
        super(5276);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 75000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let p = skill.GetT0() * 0.05;
        skill.SetCrit(p);
        skill.SetRatio(2.0);

        if (player.GetHasbuff(4271)) {
            let v10 = skill.GetLevel() * 0.01 + 0.5;
            let pa = player.GetRage() * v10;
            skill.SetPlus(pa + player.GetHp() * 0.07);
        } else {
            skill.SetPlus(0.0);
        }

        if (player.GetHasbuff(4271)) {
            skill.SetPlus2(0.0);
        } else {
            let v11 = skill.GetLevel() * 0.01 + 0.5;
            let pb = player.GetRage() * v11;
            skill.SetPlus(pb + player.GetHp() * 0.07);
        }

        player.SetRage(0);
        player.SetPerform(1);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);

        if (player.GetTargetTypeIsMob()) {
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
            player.SetPerform(0);
        }
    }
}

/**
 * 5267  霸无双<玄>
 * 冷却50秒，反弹时间延长5秒
 */
class Skill5267 extends BaseHookSkillStub {

    constructor() {
        super(5267);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const db = 25 * skill.GetT0();
        let d;
        if (skill.GetT0() <= 0) {
            d = 0.0;
        } else {
            const player4878SkillLevel = player.GetSkilllevel(4878);
            d = (1000 * player4878SkillLevel + 5000);
        }
        const dc = (skill.GetLevel() * 0.05 + 1.0) * d;
        player.SetRejectdebuff(db, dc + 5000);

        const player4878SkillLevel2 = player.GetSkilllevel(4878);
        const dd = 1000 * player4878SkillLevel2 + 5000;
        const maxAtk = 5 * player.GetMaxatk();
        const df = player.GetVar1() * 0.5 + maxAtk;
        const v20 = player.GetVar1() * 0.01;
        const da = skill.GetLevel() * v20 + df;
        let v15;
        if (player.GetDmgreduce() > 998) {
            v15 = 1.0;
        } else {
            const dmgReduce = player.GetDmgreduce();
            v15 = 1.0 / (1000 - dmgReduce);
        }
        const dg = v15 * da * 1000.0;
        player.SetRetort(120, 3, 100, dg, dd + 5000);
        return true
    }

}

/**
 * 5271
 *
 */
class Skill5271 extends BaseHookSkillStub {

    constructor() {
        super(5271);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const db = 25 * skill.GetT0();
        const player = skill.GetPlayerNice();
        let d;
        if (skill.GetT0() <= 0) {
            d = 0.0;
        } else {
            d = 1000 * player.GetSkilllevel(4878) + 5000;
        }
        player.SetRejectdebuff(db, d + 5000);

        const dc = 1000 * player.GetSkilllevel(4878) + 5000;
        const maxAtk = 5 * player.GetMaxatk();
        const v21 = player.GetMaxatk() * 0.2;
        const de = skill.GetLevel() * v21 + maxAtk;
        const df = player.GetVar1() * 0.5 + de;
        const v22 = player.GetVar1() * 0.01;
        const da = skill.GetLevel() * v22 + df;
        let v16;
        if (player.GetDmgreduce() > 998) {
            v16 = 1.0;
        } else {
            const dmgReduce = player.GetDmgreduce();
            v16 = 1.0 / (1000 - dmgReduce);
        }
        const dg = v16 * da * 1000.0;
        player.SetRetort(120, 3.0, 100, dg, dc + 5000);
        return true
    }
}

/**
 * 5275
 *
 */
class Skill5275 extends BaseHookSkillStub {

    constructor() {
        super(5275);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const db = 25 * skill.GetT0();
        const player = skill.GetPlayerNice();
        let d;
        if (skill.GetT0() <= 0) {
            d = 0.0;
        } else {
            d = 1000 * player.GetSkilllevel(4878) + 5000;
        }
        player.SetRejectdebuff(db, d + 5000);

        const dc = (1000 * player.GetSkilllevel(4878) + 5000) * ((skill.GetLevel() * 0.05) + 1.0);
        const maxAtk = 5 * player.GetMaxatk();
        const de = player.GetVar1() * 0.5 + maxAtk;
        const v20 = player.GetVar1() * 0.01;
        const da = skill.GetLevel() * v20 + de;
        let v15;
        if (player.GetDmgreduce() > 998) {
            v15 = 1.0;
        } else {
            const dmgReduce = player.GetDmgreduce();
            v15 = 1.0 / (1000 - dmgReduce);
        }
        const df = v15 * da * 1000.0;
        player.SetRetort(120, 3.0, 100, df, dc + 5000);
        return true
    }

}

/**
 * 5799  逆鳞断III 《天空》
 * 额外附加本体攻击力240%；
 * 攻击怪物目标时,额外附加自身当前怒气值的攻击力，每消耗 1 点怒气增加 1.5 点攻击力
 * 天：100%冰冻目标3+level秒
 */
class Skill5799 extends BaseHookSkillStub {

    constructor() {
        super(5799);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const p = (skill.GetLevel() + 2) * 0.01 + 0.05;
        skill.SetCrit(p);
        const pa = (5 * skill.GetLevel() + 10) * 0.01 + 0.5;
        skill.SetCrithurt(pa);
        const Level = skill.GetLevel();
        const v14 = Math.floor((2 * (Level + 2)) * 0.01 + 0.1);
        skill.SetSkillaccu(v14);
        const pb = (5 * skill.GetLevel() + 10) * 0.01 + 2.15;
        skill.SetRatio(pb);
        let v8;
        if (player.GetHasbuff(4271)) {
            v8 = player.GetRage();
        } else {
            v8 = 0.0;
        }
        skill.SetPlus(v8 * 1.5);
        let v10;
        if (player.GetHasbuff(4271)) {
            v10 = 0.0;
        } else {
            v10 = player.GetRage();
        }
        skill.SetPlus2(v10 * 1.5);
        player.SetRage(0);
        player.SetPerform(1);

    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetFrozen(120, 0.0, 3000 + skill.GetLevel() * 1000, 1)
        return true
    }
}

/**
 * 5800  逆鳞断III 《碧海》
 * 《天空》《大地》《碧海》《英雄》额外附加本体攻击力由100%上调至240%；
 * 攻击怪物目标时,额外附加自身当前怒气值的攻击力,与消耗怒气相关的攻击力数值由“每消耗1 点怒气增加 1 点攻击力”调整为“每消耗 1 点怒气增加 1.5 点攻击力”
 */
class Skill5800 extends BaseHookSkillStub {

    constructor() {
        super(5800);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Hp = player.GetHp();
        player.SetVar1(Hp);
        const p = (skill.GetLevel() + 2) * 0.01 + 0.05;
        skill.SetCrit(p);
        const pa = (5 * skill.GetLevel() + 10) * 0.01 + 0.5;
        skill.SetCrithurt(pa);
        const Level = skill.GetLevel();
        const v14 = Math.floor((2 * (Level + 2)) * 0.01 + 0.1);
        skill.SetSkillaccu(v14);
        const pb = (5 * skill.GetLevel() + 10) * 0.01 + 2.15;
        skill.SetRatio(pb);
        let v8;
        if (player.GetHasbuff(4271)) {
            v8 = player.GetRage();
        } else {
            v8 = 0.0;
        }
        skill.SetPlus(v8 * 1.5);
        let v10;
        if (player.GetHasbuff(4271)) {
            v10 = 0.0;
        } else {
            v10 = player.GetRage();
        }
        skill.SetPlus2(v10 * 1.5);
        player.SetRage(0);
        player.SetPerform(1);
    }

}

/**
 * 5801  逆鳞断III 《大地》
 *
 */
class Skill5801 extends BaseHookSkillStub {

    constructor() {
        super(5801);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const Res4 = Player.GetRes4();
        Player.SetVar1(Res4);
        const p = (skill.GetLevel() + 2) * 0.01 + 0.05;
        skill.SetCrit(p);
        const pa = (5 * skill.GetLevel() + 10) * 0.01 + 0.5;
        skill.SetCrithurt(pa);
        const Level = skill.GetLevel();
        const v14 = Math.floor((2 * (Level + 2)) * 0.01 + 0.1);
        skill.SetSkillaccu(v14);
        const pb = (5 * skill.GetLevel() + 10) * 0.01 + 2.15;
        skill.SetRatio(pb);
        let v8;
        if (Player.GetHasbuff(4271)) {
            v8 = Player.GetRage();
        } else {
            v8 = 0.0;
        }
        skill.SetPlus(v8 * 1.5);
        let v10;
        if (Player.GetHasbuff(4271)) {
            v10 = 0.0;
        } else {
            v10 = Player.GetRage();
        }
        skill.SetPlus2(v10 * 1.5);
        Player.SetRage(0);
        Player.SetPerform(1);
    }

}

/**
 * 5802  逆鳞断III 《英雄》
 * 额外附加一次白字伤害，数值为自身最大气血的80%
 *
 * 6964
 * 玄烛·背水·曦日：新增效果：技能达到5级时，逆鳞断Ⅲ《英雄》的白字伤害量增加自身上限的20%
 */
class Skill5802 extends BaseHookSkillStub {

    constructor() {
        super(5802);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const Hp = Player.GetHp();
        Player.SetVar1(Hp);
        const Maxhp = Player.GetMaxhp();
        Player.SetVar2(Maxhp);

        if (Player.GetSkilllevel(6964) >= 5) {
            Player.SetVar3(1);
        } else {
            Player.SetVar3(0);
        }

        const p = (skill.GetLevel() + 2) * 0.01 + 0.05;
        skill.SetCrit(p);
        const pa = (5 * skill.GetLevel() + 10) * 0.01 + 0.5;
        skill.SetCrithurt(pa);
        const Level = skill.GetLevel();
        const v17 = Math.floor((2 * (Level + 2)) * 0.01 + 0.1);
        skill.SetSkillaccu(v17);
        const pb = (5 * skill.GetLevel() + 10) * 0.01 + 2.15;
        skill.SetRatio(pb);
        let v11;
        if (Player.GetHasbuff(4271)) {
            v11 = Player.GetRage();
        } else {
            v11 = 0.0;
        }
        skill.SetPlus(v11 * 1.5);
        let v13;
        if (Player.GetHasbuff(4271)) {
            v13 = 0.0;
        } else {
            v13 = Player.GetRage();
        }
        skill.SetPlus2(v13 * 1.5);
        Player.SetRage(0);
        Player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDirecthurt(120, player.GetVar2() * (0.8 + player.GetVar3() * 0.2))
        return true
    }
}

/**
 * 5885  霸无双III《天空》
 * 天：冷却时间40秒
 */
class Skill5885 extends BaseHookSkillStub {

    constructor() {
        super(5885);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
    }

}

/**
 * 5888  霸无双III 《英雄》
 * 使用技能后提高身抗性值15%，持续14秒；反弹延长5秒
 */
class Skill5888 extends BaseHookSkillStub {

    constructor() {
        super(5888);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetRejectdebuff(100, 15100);

        const dmgReduce = player.GetDmgreduce();
        let dc;
        if (dmgReduce <= 998) {
            const da = 1.0 / (1000 - dmgReduce) * player.GetVar1() * 0.1 * 5.0;
            const maxAtk = 5 * player.GetMaxatk();
            dc = ((maxAtk + da) * 1000.0);
        } else {
            const d = player.GetVar1() * 1000.0 * 0.1 * 5.0;
            dc = (5 * player.GetMaxatk() + d);
        }
        player.SetRetort(120, 3.0, 100, dc, 15100);

        player.SetIncanti(0.15, 15100)
        // player.SetChihun(120, 15100, 0, 0, 3)
        return true
    }
}

/**
 * 6958  赤乌·固若金汤·曦日
 * 冷却50秒；减免受到的伤害调整为90%，持续27秒，减免附加伤害的时间调整为20秒
 */
class Skill6958 extends BaseHookSkillStub {

    constructor() {
        super(6958);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        player.SetDecdamage(120, 0.9, 27100);

        player.SetActivebecrit(120, 12100, 7039, 3, 0);

        let level = skill.GetLevel();
        player.SetCleardebuff(120, skill.GetLevel());

        let da = level * 0.12;
        player.SetSlant(120, 20100, da);

        player.SetSetcooldown(120, 4866, 6957, 6956, 60010);
        return true
    }

}


export class YingZhaoSkillList {
    constructor() {
        new Skill4844()
        new Skill4853()
        new Skill4871()
        new Skill5324()
        new Skill4873()
        new Skill4856()
        new Skill4867()
        new Skill4859()
        new Skill4880()
        new Skill4877()
        new Skill4865()
        new Skill4861()
        new Skill4874()
        new Skill5266()
        new Skill5270()
        new Skill5274()
        new Skill5269()
        new Skill5273()
        new Skill5277()
        new Skill5268()
        new Skill5272()
        new Skill5276()
        new Skill5267()
        new Skill5271()
        new Skill5275()
        new Skill5799()
        new Skill5800()
        new Skill5801()
        new Skill5802()
        new Skill5885()
        new Skill5888()
        new Skill6958()
    }
}