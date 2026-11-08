import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";
import {getSkillStub} from "../../base/skill/HookSkillUtil";

/**
 * 231  五气朝元
 * 施法时间调整为1秒
 */
class Skill231 extends BaseHookSkillStub {

    constructor() {
        super(231);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 600
    }

}

/**
 * 233  逍遥游
 * 瞬发，冷却减少50秒，额外新增免疫魅惑和定身6秒
 *
 * 【玄烛·逍遥游·莹炬/皓月/曦日】释放逍遥游额外增加技能躲闪5/10/15，持续35秒
 *
 * 玄烛·逍遥游·曦日
 * 新增效果二：技能达到五级时，令冰心诀额外清除天尊法身<玄><煞><禅>，天机印，天地不仁II的冷却
 */
class Skill233 extends BaseHookSkillStub {

    constructor() {
        super(233);
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

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 50000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetImmunewrap(1100 + 1000 * skill.GetLevel())
        player.SetImmunesilent(1100 + 1000 * skill.GetLevel())

        const n1 = player.GetSkilllevel(6821)
        const n2 = player.GetSkilllevel(6822)
        const n3 = player.GetSkilllevel(6823)
        if (n1 > 0) {
            player.SetIncskilldodge(120, 0.05, 35000, 3)
        } else if (n2 > 0) {
            player.SetIncskilldodge(120, 0.1, 35000, 3)
        } else if (n3 > 0) {
            player.SetIncskilldodge(120, 0.15, 35000, 3)
        }
        return true
    }

}

/**
 * 229   冰心诀
 * 玄烛·逍遥游·曦日
 * 新增效果二：技能达到五级时，令冰心诀额外清除天尊法身<玄><煞><禅>，天机印，天地不仁II的冷却
 */
class Skill229 extends BaseHookSkillStub {

    constructor() {
        super(229);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const skill6823Level = player.GetSkilllevel(6823);//玄烛·逍遥游·曦日
        if (skill6823Level > 4) {//五级以上
            player.SetClearcooldown(3018, 3066, 3114);
            player.SetClearcooldown(544, 1539, 1539);
        }

        return true
    }

}

/**
 * 235   真元护体
 * 吸收伤害总量额外提升15%，吸收总量不超过自身真气上限的10倍；且100%概率获得减免致命伤害50%，持续30秒
 */
class Skill235 extends BaseHookSkillStub {

    constructor() {
        super(235);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let d = Math.floor(skill.GetT0() * 0.1);
        const r = Math.floor((skill.GetLevel() * 0.01 + 0.08 + d) * 100) / 100;
        const Level = skill.GetLevel();
        const a = Math.floor(10 * player.GetMaxmp());
        player.SetMagicshield(r + 0.15, a, 30100);

        const T1 = skill.GetT1();
        const t = Math.floor(4000 * zrand(T1));
        let da = skill.GetT1();
        const v13 = 5 * Level;
        const v14 = Level * v13;
        da = (v14 + 100 * Level) * 0.15 * da;
        player.SetMpgen(100, t, 0, da, 1);

        player.SetDecfatalhurt(100, 0.5, 30000, 1);

        return true
    }
}

/**
 * 312   少阳剑气
 * 令目标进入焱阳状态的几率调整为100%
 *
 */
class Skill312 extends BaseHookSkillStub {

    constructor() {
        super(312);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let d = Math.floor(player.GetVar1() * 0.05);
        const Level = skill.GetLevel();
        d = Math.floor((Level + 3 * skill.GetT0()) * d);
        const t = 300 * skill.GetLevel() + 1900;
        player.SetWrap(d, t);
        player.SetBlazingSun(100, 15100, 0.5, 0.0);
        return true
    }

}

/**
 * 539  天玄冰
 * 冷却减少70秒，没优化施法
 */
class Skill539 extends BaseHookSkillStub {

    constructor() {
        super(539);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000;
    }

}

/**
 * 236   雷霆震怒
 * 施法时间调整为0.8秒
 * 6820玄烛·雷霆震怒·曦日
 * 新增效果一：定身成功则令目标6秒内禁食
 * 新增效果四：天尊法身和天尊法身<玄><煞><禅>，施法后30秒内增加自身40%真气上限
 * 新增效果五：技能达到5级时，额外减少“雷霆震怒”冷却时间30秒，令玩家目标麻痹8秒，技能施法速度和移动速度降低50%
 * 新增效果六：原技能“定身能力附加自身定身抗性的85%”修改为120%
 */
class Skill236 extends BaseHookSkillStub {

    constructor() {
        super(236);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        let t = 0
        if (player.GetVar4() >= 5) {//曦日
            t = 30000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - t;
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 800
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        let bonus = 0.0;
        const player = skill.GetPlayerNice();

        if (player.GetVar2() > 0) {
            bonus = player.GetVar1() * 0.35;
        }

        if (player.GetVar3() > 0) {
            bonus = player.GetVar1() * 0.6;
        }

        if (player.GetVar4() > 0) {//曦日
            bonus = player.GetVar1() * 1.2;
        }

        const d = 10 * skill.GetLevel() + 91;
        const v37 = skill.GetLevel() * 0.18;
        let ddd = d - skill.GetLevel() * v37;
        const v8 = 3 * skill.GetLevel();
        const p = v8 * skill.GetT0() + ddd + bonus;

        const v10 = 330 * skill.GetLevel() + 800;
        const v11 = 300 * skill.GetLevel();
        const da = v10 + v11 * skill.GetT0();
        player.SetWrap(p, da);

        const Var2 = player.GetVar2();
        const v17 = player.GetVar3() + Var2;
        const star_lvl = v17 + player.GetVar4();
        if (star_lvl) {
            player.SetDecdrugeffect(-1, star_lvl * 0.16, 6100, 9);
        }

        const Var1 = player.GetVar1();
        const advantage = Var1 - player.GetParalyzeRes();
        const v27 = (advantage <= 0) ? 0.0 : (10 * (advantage / 50));
        player.SetPulltoTarget(v27, player.GetVar5(), player.GetVar6(), player.GetVar7());

        if (bonus > player.GetRes3()) {//大于定身抗性
            player.SetDiet(120, 6000)
        }

        // 令玩家目标麻痹8秒，技能施法速度和移动速度降低50%
        if (player.GetVar4() >= 5) {//曦日
            player.SetParalysis(100, 8000, 0.5, 0.5)
        }

        return true
    }
}

/**
 * 540   极度深寒
 * 额外降低目标减免伤害百分比8%
 */
class Skill540 extends BaseHookSkillStub {

    constructor() {
        super(540);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetFlamecurse(120, 16000, 0.08, 1.0);
        return true
    }

}

/**
 * 544   天机印
 * 新增释放后令自身4*level秒内技能伤害提升5%*level
 */
class Skill544 extends BaseHookSkillStub {

    constructor() {
        super(544);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetIncskilldamage(0.05 * skill.GetLevel(), 4000 * skill.GetLevel(), 1)
        return super.BlessMe(stub, skill, originFunc);
    }

}

/**
 * 537   霜天雪舞
 * 双击刑冰对
 * 还原官服施法动作特效,
 * 冷却时间12秒,攻击目标1次,
 * 附加攻击力为170%,额外附加自身真气上限23%的攻击力;
 * 若自身攻击力大于目标，则冰冻目标 6秒，额外附加一次自身真气上限2倍的白字伤害
 * 攻击怪物目标时额外附加自身真气上限30%的攻击力；
 */
class Skill537 extends BaseHookSkillStub {

    constructor() {
        super(537);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 12000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        // 附加攻击力为170%,额外附加自身真气上限23%的攻击力;
        // 攻击怪物目标时额外附加自身真气上限30%的攻击力；
        // 若自身攻击力大于目标，则冰冻目标 6秒，额外附加一次自身真气上限的白字伤害
        const player = skill.GetPlayerNice()
        skill.SetRatio(1.7)
        skill.SetPlus(player.GetMaxmp() * 0.23)
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.3)
        player.SetVar1(player.GetInk())
        player.SetVar2(player.GetMaxmp())

        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const v1 = player.GetVar1()
        if (player.GetInk() < v1) {
            player.SetFrozen(120, 0, (skill.GetLevel() - 3) * 1000, 1)
            player.SetDirecthurt(120, player.GetVar2() * 2)
        }

        return true
    }
}

/**
 * 6814  赤乌·天诛剑气·曦日
 * 施法时间 1 秒，冷却时间 15 秒，攻击目标 4次，
 * 每一段额外追加一次自身真气上限70%的白字伤害，附加攻击力为320%，额外附加本体攻击力 3600，
 * 攻击怪物目标时附加攻击力为 7200，额外附加自身真气上限28%的攻击力，
 *
 * 若自身真气高于75%时，额外追加自身真气上限23%攻击力的真气贯穿效果；
 * 驱散自身2个常规不利状态,第一击驱散目标2个常规有利状态;
 * 额外令目标进入“焱阳”效果 12秒
 *
 * 群攻的范围写在扩展函数中
 */
class Skill6814 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(6814)
        stub.pointer.add(0x2F).writeU8(2)
        super(6814);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const maxMp = player.GetMaxmp()
        const mp = player.GetMp()
        let v3 = 0
        if (mp >= maxMp * 0.75) {
            v3 = 1
        }

        player.SetVar1(0)
        player.SetVar2(maxMp)
        const level = skill.GetLevel()
        skill.SetRatio(0.2 + level * 0.6 + v3 * 0.23)
        if (player.GetTargetTypeIsMob()) {
            skill.SetPlus((level * 500 + 1100) * 2)
            skill.SetMobBonusDamage(maxMp * 0.28)
        } else {
            skill.SetPlus(level * 500 + 1100)
        }

        player.SetPerform(1)
        player.SetPerform(0)
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const maxMp = player.GetMaxmp()
        const mp = player.GetMp()
        let v3 = 0
        if (mp >= maxMp * 0.75) {
            v3 = 1
        }

        player.SetVar1(0)
        player.SetVar2(maxMp)
        const level = skill.GetLevel()

        skill.SetRatio(0.2 + level * 0.6 + v3 * 0.23)
        if (player.GetTargetTypeIsMob()) {
            skill.SetPlus((level * 500 + 1100) * 2)
            skill.SetMobBonusDamage(maxMp * 0.28)
        } else {
            skill.SetPlus(level * 500 + 1100)
        }

        player.SetPerform(0)
        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // 驱散自身2个常规不利状态
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 2)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        //每一段额外追加一次自身真气上限70%的白字伤害，附加攻击力为320%，额外附加本体攻击力 3600，
        //攻击怪物目标时附加攻击力为 7200，额外附加自身真气上限28%的攻击力，
        const player = skill.GetPlayerNice()
        const var1 = player.GetVar(1)
        const var2 = player.GetVar(2)

        player.SetDirecthurt(120, var2 * (skill.GetLevel() * 0.1 + 0.2))

        if (var1 == 1) {
            // 第一击驱散目标2个常规有利状态;
            player.SetClearbuff(120, 2)
            //额外令目标进入“焱阳”效果 12秒
            player.SetBlazingSun(120, skill.GetLevel() * 2000 + 2000, 0.5, 0)
        }

        return true
    }
}

/**
 * 545   七劫斩龙诀
 * 冷却调整为0秒，1秒释放。附加攻击力上调至300*level点，每击额外附加自身真气上限level%的攻击力，7次攻击都对玩家生效
 *
 * 天书-斩龙奥义 效果重置，调整为攻击非玩家目标时，令“七劫斩龙诀”每击额外附加自身真气上限5% * level 的攻击力
 */
class Skill545 extends BaseHookSkillStub {

    constructor() {
        super(545);
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
        return 100
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 100
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const v27 = skill.GetT2() * 0.3;
        const Level = skill.GetLevel();
        const v34 = Math.floor(Level / 9) * v27;
        skill.SetCrithurt(v34);
        const v28 = skill.GetT2() * 0.01;
        const v23 = skill.GetT2() * 0.01;
        const v35 = (skill.GetLevel() / 9) * v23 + v28;
        skill.SetCrit(v35);
        const v29 = skill.GetLevel() * 0.01 + 1.0;
        const v30 = skill.GetT2() * 0.05 + v29;//1.2

        let count = 0
        const skillArr = [222, 232, 228, 312, 240, 541, 545, 237]
        for (let i = 0; i < skillArr.length; i++) {
            if (Player.GetSkilllevel(skillArr[i]) > 8) {
                count++
            }
        }

        const v24 = count * 0.05;
        const v25 = skill.GetT2() * v24;
        const T2 = skill.GetT2();
        const v36 = norm(T2) * v25 + v30;

        skill.SetRatio(v36 + Player.GetSkilllevel(2055) * 0.22);

        const v19 = skill.GetLevel();
        const v31 = Math.floor(1.42 - v19 * 0.05);
        const v26 = 105 * skill.GetLevel() + 1230;
        const v22 = skill.GetLevel() * 5.3;
        const v32 = (v26 - skill.GetLevel() * v22) * v31;
        const v33 = skill.GetLevel();
        const v20 = Math.floor(v33 * 0.05 + 0.55);
        const v37 = (v20 * (300 * skill.GetLevel() + 1126)) + v32;
        skill.SetPlus(v37 + Player.GetMaxmp() * 0.01 * skill.GetLevel());
        skill.SetMobCrithurt(1.2)
        skill.SetMobBonusDamage(Player.GetMaxmp() * (0.05 * skill.GetT1() + 0.06))
        Player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const v27 = skill.GetT2() * 0.3;
        const Level = skill.GetLevel();
        const v34 = Math.floor(Level / 9) * v27;
        skill.SetCrithurt(v34);
        const v28 = skill.GetT2() * 0.01;
        const v23 = skill.GetT2() * 0.01;
        const v35 = (skill.GetLevel() / 9) * v23 + v28;
        skill.SetCrit(v35);
        const v29 = skill.GetLevel() * 0.01 + 1.0;
        const v30 = skill.GetT2() * 0.05 + v29;
        let count = 0
        const skillArr = [222, 232, 228, 312, 240, 541, 545, 237]
        for (let i = 0; i < skillArr.length; i++) {
            if (Player.GetSkilllevel(skillArr[i]) > 8) {
                count++
            }
        }

        const v24 = count * 0.05;
        const v25 = skill.GetT2() * v24;
        const T2 = skill.GetT2();
        const v36 = norm(T2) * v25 + v30;

        skill.SetRatio(v36 + Player.GetSkilllevel(2055) * 0.22);

        const v19 = skill.GetLevel();
        const v31 = Math.floor(1.42 - v19 * 0.05);
        const v26 = 105 * skill.GetLevel() + 1230;
        const v22 = skill.GetLevel() * 5.3;
        const v32 = (v26 - skill.GetLevel() * v22) * v31;
        const v33 = skill.GetLevel();
        const v20 = Math.floor(v33 * 0.05 + 0.55);
        const v37 = (v20 * (300 * skill.GetLevel() + 1126)) + v32;
        skill.SetPlus(v37 + Player.GetMaxmp() * 0.01 * skill.GetLevel());
        skill.SetMobCrithurt(1.2)
        skill.SetMobBonusDamage(Player.GetMaxmp() * (0.05 * skill.GetT1() + 0.06))
        Player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const v27 = skill.GetT2() * 0.3;
        const Level = skill.GetLevel();
        const v34 = Math.floor(Level / 9) * v27;
        skill.SetCrithurt(v34);
        const v28 = skill.GetT2() * 0.01;
        const v23 = skill.GetT2() * 0.01;
        const v35 = (skill.GetLevel() / 9) * v23 + v28;
        skill.SetCrit(v35);
        const v29 = skill.GetLevel() * 0.01 + 1.0;
        const v30 = skill.GetT2() * 0.05 + v29;
        let count = 0
        const skillArr = [222, 232, 228, 312, 240, 541, 545, 237]
        for (let i = 0; i < skillArr.length; i++) {
            if (Player.GetSkilllevel(skillArr[i]) > 8) {
                count++
            }
        }

        const v24 = count * 0.05;
        const v25 = skill.GetT2() * v24;
        const T2 = skill.GetT2();
        const v36 = norm(T2) * v25 + v30;

        skill.SetRatio(v36 + Player.GetSkilllevel(2055) * 0.22);

        const v19 = skill.GetLevel();
        const v31 = Math.floor(1.42 - v19 * 0.05);
        const v26 = 105 * skill.GetLevel() + 1230;
        const v22 = skill.GetLevel() * 5.3;
        const v32 = (v26 - skill.GetLevel() * v22) * v31;
        const v33 = skill.GetLevel();
        const v20 = Math.floor(v33 * 0.05 + 0.55);
        const v37 = (v20 * (300 * skill.GetLevel() + 1126)) + v32;
        skill.SetPlus(v37 + Player.GetMaxmp() * 0.01 * skill.GetLevel());
        skill.SetMobCrithurt(1.2)
        skill.SetMobBonusDamage(Player.GetMaxmp() * (0.05 * skill.GetT1() + 0.06))
        Player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const v27 = skill.GetT2() * 0.3;
        const Level = skill.GetLevel();
        const v34 = Math.floor(Level / 9) * v27;
        skill.SetCrithurt(v34);
        const v28 = skill.GetT2() * 0.01;
        const v23 = skill.GetT2() * 0.01;
        const v35 = (skill.GetLevel() / 9) * v23 + v28;
        skill.SetCrit(v35);
        const v29 = skill.GetLevel() * 0.01 + 1.0;
        const v30 = skill.GetT2() * 0.05 + v29;
        let count = 0
        const skillArr = [222, 232, 228, 312, 240, 541, 545, 237]
        for (let i = 0; i < skillArr.length; i++) {
            if (Player.GetSkilllevel(skillArr[i]) > 8) {
                count++
            }
        }

        const v24 = count * 0.05;
        const v25 = skill.GetT2() * v24;
        const T2 = skill.GetT2();
        const v36 = norm(T2) * v25 + v30;

        skill.SetRatio(v36 + Player.GetSkilllevel(2055) * 0.22);

        const v19 = skill.GetLevel();
        const v31 = Math.floor(1.42 - v19 * 0.05);
        const v26 = 105 * skill.GetLevel() + 1230;
        const v22 = skill.GetLevel() * 5.3;
        const v32 = (v26 - skill.GetLevel() * v22) * v31;
        const v33 = skill.GetLevel();
        const v20 = Math.floor(v33 * 0.05 + 0.55);
        const v37 = (v20 * (300 * skill.GetLevel() + 1126)) + v32;
        skill.SetPlus(v37 + Player.GetMaxmp() * 0.01 * skill.GetLevel());
        skill.SetMobCrithurt(1.2)
        skill.SetMobBonusDamage(Player.GetMaxmp() * (0.05 * skill.GetT1() + 0.06))
        Player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const v27 = skill.GetT2() * 0.3;
        const Level = skill.GetLevel();
        const v34 = Math.floor(Level / 9) * v27;
        skill.SetCrithurt(v34);
        const v28 = skill.GetT2() * 0.01;
        const v23 = skill.GetT2() * 0.01;
        const v35 = (skill.GetLevel() / 9) * v23 + v28;
        skill.SetCrit(v35);
        const v29 = skill.GetLevel() * 0.01 + 1.0;
        const v30 = skill.GetT2() * 0.05 + v29;
        let count = 0
        const skillArr = [222, 232, 228, 312, 240, 541, 545, 237]
        for (let i = 0; i < skillArr.length; i++) {
            if (Player.GetSkilllevel(skillArr[i]) > 8) {
                count++
            }
        }

        const v24 = count * 0.05;
        const v25 = skill.GetT2() * v24;
        const T2 = skill.GetT2();
        const v36 = norm(T2) * v25 + v30;

        skill.SetRatio(v36 + Player.GetSkilllevel(2055) * 0.22);

        const v19 = skill.GetLevel();
        const v31 = Math.floor(1.42 - v19 * 0.05);
        const v26 = 105 * skill.GetLevel() + 1230;
        const v22 = skill.GetLevel() * 5.3;
        const v32 = (v26 - skill.GetLevel() * v22) * v31;
        const v33 = skill.GetLevel();
        const v20 = Math.floor(v33 * 0.05 + 0.55);
        const v37 = (v20 * (300 * skill.GetLevel() + 1126)) + v32;
        skill.SetPlus(v37 + Player.GetMaxmp() * 0.01 * skill.GetLevel());
        skill.SetMobCrithurt(1.2)
        skill.SetMobBonusDamage(Player.GetMaxmp() * (0.05 * skill.GetT1() + 0.06))
        Player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const v27 = skill.GetT2() * 0.3;
        const Level = skill.GetLevel();
        const v34 = Math.floor(Level / 9) * v27;
        skill.SetCrithurt(v34);
        const v28 = skill.GetT2() * 0.01;
        const v23 = skill.GetT2() * 0.01;
        const v35 = (skill.GetLevel() / 9) * v23 + v28;
        skill.SetCrit(v35);
        const v29 = skill.GetLevel() * 0.01 + 1.0;
        const v30 = skill.GetT2() * 0.05 + v29;
        let count = 0
        const skillArr = [222, 232, 228, 312, 240, 541, 545, 237]
        for (let i = 0; i < skillArr.length; i++) {
            if (Player.GetSkilllevel(skillArr[i]) > 8) {
                count++
            }
        }

        const v24 = count * 0.05;
        const v25 = skill.GetT2() * v24;
        const T2 = skill.GetT2();
        const v36 = norm(T2) * v25 + v30;

        skill.SetRatio(v36 + Player.GetSkilllevel(2055) * 0.22);

        const v19 = skill.GetLevel();
        const v31 = Math.floor(1.42 - v19 * 0.05);
        const v26 = 105 * skill.GetLevel() + 1230;
        const v22 = skill.GetLevel() * 5.3;
        const v32 = (v26 - skill.GetLevel() * v22) * v31;
        const v33 = skill.GetLevel();
        const v20 = Math.floor(v33 * 0.05 + 0.55);
        const v37 = (v20 * (300 * skill.GetLevel() + 1126)) + v32;
        skill.SetPlus(v37 + Player.GetMaxmp() * 0.01 * skill.GetLevel());
        skill.SetMobCrithurt(1.2)
        skill.SetMobBonusDamage(Player.GetMaxmp() * (0.05 * skill.GetT1() + 0.06))
        Player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const v27 = skill.GetT2() * 0.3;
        const Level = skill.GetLevel();
        const v34 = Math.floor(Level / 9) * v27;
        skill.SetCrithurt(v34);
        const v28 = skill.GetT2() * 0.01;
        const v23 = skill.GetT2() * 0.01;
        const v35 = (skill.GetLevel() / 9) * v23 + v28;
        skill.SetCrit(v35);
        const v29 = skill.GetLevel() * 0.01 + 1.0;
        const v30 = skill.GetT2() * 0.05 + v29;
        let count = 0
        const skillArr = [222, 232, 228, 312, 240, 541, 545, 237]
        for (let i = 0; i < skillArr.length; i++) {
            if (Player.GetSkilllevel(skillArr[i]) > 8) {
                count++
            }
        }

        const v24 = count * 0.05;
        const v25 = skill.GetT2() * v24;
        const T2 = skill.GetT2();
        const v36 = norm(T2) * v25 + v30;

        skill.SetRatio(v36 + Player.GetSkilllevel(2055) * 0.22);

        const v19 = skill.GetLevel();
        const v31 = Math.floor(1.42 - v19 * 0.05);
        const v26 = 105 * skill.GetLevel() + 1230;
        const v22 = skill.GetLevel() * 5.3;
        const v32 = (v26 - skill.GetLevel() * v22) * v31;
        const v33 = skill.GetLevel();
        const v20 = Math.floor(v33 * 0.05 + 0.55);
        const v37 = (v20 * (300 * skill.GetLevel() + 1126)) + v32;
        skill.SetPlus(v37 + Player.GetMaxmp() * 0.01 * skill.GetLevel());
        skill.SetMobCrithurt(1.2)
        skill.SetMobBonusDamage(Player.GetMaxmp() * (0.05 * skill.GetT1() + 0.06))
        Player.SetPerform(0);
    }
}

/**
 * 784  天尊法身
 * 天书-天眷有道：增加气血上限的能力调整为50%*level
 * 天书-返朴归真：新增效果—增加技能伤害调整为10%*level，持续时间调为10*level秒，新增影响技能“天尊法身”，‘天尊法身<玄><煞><禅>’
 *
 * 6820玄烛·雷霆震怒·曦日
 * 新增效果四：天尊法身和天尊法身<玄><煞><禅>，施法后30秒内增加自身40%真气上限
 */
class Skill784 extends BaseHookSkillStub {

    constructor() {
        super(784);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const Level = skill.GetLevel();
        let d = Level * 0.01 + 0.011;
        let da = skill.GetT2() * 0.01 + d;
        const T2 = skill.GetT2();
        const v5 = zrand(5 * T2 + 99);
        da = (Math.floor(v5 / 100) + 1) * da;

        const v8 = 500 * Level;
        const v9 = 75 * Level;
        const v10 = Level * v9;
        const v11 = v10 * Level + v8;
        const db = (v11 - 1500 * Math.floor(Level / 6.5)) * ((skill.GetT0() * 0.5 + 1.0));
        player.SetFashen(100, da, db, 20100, 1);

        const T1 = skill.GetT1();
        const v17 = 4000 * norm(T1);
        let dc = skill.GetT1() * 0.5;
        dc = player.GetMaxhp() * dc;
        player.SetHpgen(100, v17, 0.0, dc, 0.0, 1);

        player.SetIncskilldamage(0.1 * skill.GetT1(), 10000 * skill.GetT1(), 1)

        const xr = player.GetSkilllevel(6820)
        if (xr > 0) {
            player.SetIncmp(0.4, 30000, 1)
        }
        return true
    }

}

/**
 * 3018 天尊法身<玄>
 * 冷却减少60秒，自身自身免疫降血、降蓝
 * T1天书-返朴归真：新增效果—增加技能伤害调整为10%*level，持续时间调为10秒*level，新增影响技能“天尊法身”，‘天尊法身<玄><煞><禅>’
 * T2天书-仙元护体：新增效果—天尊法身<玄><煞><禅>额外增加致命一击率5% * level
 * T0天书-天眷有道：增加气血上限的能力调整为40%*level
 *
 * 6820玄烛·雷霆震怒·曦日
 * 新增效果：天尊法身和天尊法身<玄><煞><禅>，施法后30秒内增加自身40%真气上限
 */
class Skill3018 extends BaseHookSkillStub {

    constructor() {
        super(3018);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 60000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const Level = skill.GetLevel();
        const t = (10000 * Math.floor(Level / 20) + 20100);
        const ta = Level * 0.01 + 0.011;
        let tb = skill.GetT2() * 0.05 + ta;
        const T2 = skill.GetT2();
        const v6 = zrand(5 * T2 + 99);
        tb = (Math.floor(v6 / 100) + 1) * tb;
        const Player = skill.GetPlayerNice();
        const tc = Player.GetMaxhp() * 0.01;
        const td = skill.GetLevel() * tc;
        const v = ((skill.GetT0() * 0.4 + 1.0) * td);
        player.SetFashen(100, tb, v, t, 1);

        const v13 = 1000 * Level + 4100;
        const tt = (v13 + 10000 * Math.floor(Level / 20));
        player.SetFrenzied(100, 1.0, player.GetVar1(), Level, tt);

        const v22 = 300 * Level + 4000;
        const t3 = (v22 + 10000 * Math.floor(Level / 20));
        player.SetBuffClearImmune(120, t3);

        player.SetHiddenmbocdred(1000 * Level);

        //驱散气血凝滞，真气凝滞
        player.SetDispel(120, 32, 33, 0)
        //免疫气血凝滞
        player.SetRedImmunity(120, 100 + 600 * skill.GetLevel())
        //免疫真气凝滞
        player.SetBlueImmunity(120, 100 + 600 * skill.GetLevel())

        player.SetIncskilldamage(0.1 * skill.GetT1(), 10000 * skill.GetT1(), 1)

        const xr = player.GetSkilllevel(6820)
        if (xr > 0) {
            player.SetIncmp(0.4, 30000, 1)
        }
        return true
    }

}

/**
 * 3114 天尊法身<煞>
 */
class Skill3114 extends BaseHookSkillStub {

    constructor() {
        super(3114);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 60000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const Level = skill.GetLevel();
        const t = (10000 * Math.floor(Level / 20) + 20100);
        const ta = Level * 0.01 + 0.011;
        let tb = skill.GetT2() * 0.05 + ta;
        const T2 = skill.GetT2();
        const v6 = zrand(5 * T2 + 99);
        tb = (Math.floor(v6 / 100) + 1) * tb;
        const Player = skill.GetPlayerNice();
        const tc = Player.GetMaxhp() * 0.01;
        const td = skill.GetLevel() * tc;
        const v = ((skill.GetT0() * 0.4 + 1.0) * td);
        player.SetFashen(100, tb, v, t, 1);

        const v12 = 1000 * Level + 4100;
        tb = (v12 + 10000 * Math.floor(Level / 20));
        const Res1 = Player.GetRes1();
        const v19 = Player.GetRes2() + Res1;
        const v21 = Player.GetRes3() + v19;
        const v23 = Player.GetRes4() + v21;
        let te = (v23 + Player.GetRes5()) * 0.002;
        player.SetAddanti(Level * te, tb, 2);

        const v28 = 300 * Level + 4000;
        te = (v28 + 10000 * Math.floor(Level / 20));
        player.SetBuffClearImmune(120, te);

        player.SetHiddenmbocdred(1000 * Level);

        //驱散气血凝滞，真气凝滞
        player.SetDispel(120, 32, 33, 0)
        //免疫气血凝滞
        player.SetRedImmunity(120, 100 + 600 * skill.GetLevel())
        //免疫真气凝滞
        player.SetBlueImmunity(120, 100 + 600 * skill.GetLevel())

        player.SetIncskilldamage(0.1 * skill.GetT1(), 10000 * skill.GetT1(), 1)

        const xr = player.GetSkilllevel(6820)
        if (xr > 0) {
            player.SetIncmp(0.4, 30000, 1)
        }

        return true
    }

}

/**
 * 3066 天尊法身<禅>
 */
class Skill3066 extends BaseHookSkillStub {

    constructor() {
        super(3066);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 60000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const Level = skill.GetLevel();
        const t = (10000 * Math.floor(Level / 20) + 20100);
        const ta = Level * 0.01 + 0.011;
        let tb = skill.GetT2() * 0.05 + ta;
        const T2 = skill.GetT2();
        const v6 = zrand(5 * T2 + 99);
        tb = (Math.floor(v6 / 100) + 1) * tb;
        const Player = skill.GetPlayerNice();
        const tc = Player.GetMaxhp() * 0.01;
        const td = skill.GetLevel() * tc;
        const v = ((skill.GetT0() * 0.4 + 1.0) * td);
        player.SetFashen(100, tb, v, t, 1);

        const v13 = 1000 * Level + 4100;
        tb = (v13 + 10000 * Math.floor(Level / 20));
        const r = (Level * 0.02 + 0.0001);
        player.SetIncskilldodge(4 * Level + 15, r, tb, 1);

        const v28 = 300 * Level + 4000;
        const te = (v28 + 10000 * Math.floor(Level / 20));
        player.SetBuffClearImmune(120, te);

        player.SetHiddenmbocdred(1000 * Level);

        //驱散气血凝滞，真气凝滞
        player.SetDispel(120, 32, 33, 0)
        //免疫气血凝滞
        player.SetRedImmunity(120, 100 + 600 * skill.GetLevel())
        //免疫真气凝滞
        player.SetBlueImmunity(120, 100 + 600 * skill.GetLevel())

        player.SetIncskilldamage(0.1 * skill.GetT1(), 10000 * skill.GetT1(), 1)

        const xr = player.GetSkilllevel(6820)
        if (xr > 0) {
            player.SetIncmp(0.4, 30000, 1)
        }

        return true
    }
}

/**
 * 1539 天地不仁II
 * 天地不仁II：施法时间调整为2秒，禁食概率与清除目标增益效果概率提升至100%，新增令周围目标强制定身8秒，定身能力为自身定身抗性，冷却时间减少180秒
 */
class Skill1539 extends BaseHookSkillStub {

    constructor() {
        super(1539);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 180000;
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 750
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 750
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetRes3())
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetClearbuff(120, 3);

        const tt = 1000 * skill.GetLevel() + 10100;
        player.SetDiet(120, tt);

        player.SetWrap(player.GetVar1(), 8000)
        return true
    }

}

/**
 * 2044  逍遥游II
 * 冷却时间减少40秒
 */
class Skill2044 extends BaseHookSkillStub {

    constructor() {
        super(2044);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 40000;
    }

}

/**
 * 1589  真元护体II
 * 新增效果—自身在3*level秒内，减免致命一击率提升1%*level，减免致命一击伤害提升5%*level，
 * 同时吸收70%收到的伤害，总量不超过自身真气上限的2*level倍
 */
class Skill1589 extends BaseHookSkillStub {

    constructor() {
        super(1589);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        const level = skill.GetLevel()
        const time = level * 3000

        player.SetDecfatalratio(120, 0.01 * level, time, 1)
        player.SetDecfatalhurt(120, 0.05 * level, time, 1)

        const r = Math.floor((level * 0.07) * 100) / 100;
        const a = Math.floor(2 * level * player.GetMaxmp());
        player.SetMagicshield(r, a, time);


        return true
    }

}

/**
 * 1590  天仙护体II
 * 施法时间调整为1秒，冷却时间80秒，新增效果-自身在3*level秒内，减免20%附加伤害
 */
class Skill1590 extends BaseHookSkillStub {

    constructor() {
        super(1590);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 80000;
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
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetSlant(120, 3000 * skill.GetLevel(), 0.2)
        return true
    }

}

/**
 * 2064  五气朝元II
 * 新增效果—自身8秒内免疫单体攻击，施法时间调整为1秒，冷却时间90秒
 */
class Skill2064 extends BaseHookSkillStub {

    constructor() {
        super(2064);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000;
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
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetSingleTargetImmune(120, 8000,1.0)
        return true
    }

}

/**
 * 1564  天外飞仙II
 * 施法时间调整为1秒，冷却时间减少10秒
 */
class Skill1564 extends BaseHookSkillStub {

    constructor() {
        super(1564);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
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
 * 1563  寒霜剑气II
 * 新增效果-额外令目标进入“霜结”状态，持续5秒，技能停止冷却
 */
class Skill1563 extends BaseHookSkillStub {

    constructor() {
        super(1563);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetGFrosty(120, 5000)
        return true
    }

}

/**
 * 2054  破魔剑气II
 * 冷却时间减少240秒
 * 新增效果-额外令目标防御减少15%，持续10秒
 */
class Skill2054 extends BaseHookSkillStub {

    constructor() {
        super(2054);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 80000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDecdefence(120, 0.15, 10000, 2)
        return true
    }

}

/**
 * 1591 大道无形II
 * 清除自身不利状态3个
 */
class Skill1591 extends BaseHookSkillStub {

    constructor() {
        super(1591);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        //清除不利状态
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 3);
        return true
    }

}

/**
 * 2055  七劫斩龙诀II
 * 新增效果-第一击降低目标气血上限，数值为自身真气上限的30%，最多降低目标气血上限的50%
 */
class Skill2055 extends BaseHookSkillStub {

    constructor() {
        super(2055);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar1(player.GetMaxmp())
        player.SetVar2(1)
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetVictimNice();
        player.SetVar2(2)
        super.Calculate3(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        if (player.GetVar2() == 1) {
            player.SetSubhp(120, player.GetVar1() * 0.3, player.GetMaxhp() * 0.5, 6000, 1)
        }
        return true
    }

}

/**
 * 5833  大道无形Ⅲ《天空》
 * 固定25秒，删除气血要求，施法后立即获得抵挡20次的神佑状态8秒
 */
class Skill5833 extends BaseHookSkillStub {

    constructor() {
        super(5833);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDecdamage(100, 0.9, 25100);

        player.SetBlessed(20, 2000 * skill.GetLevel() + 2100);
        return true
    }

}

/**
 * 5834  大道无形Ⅲ《碧海》
 * 固定25秒，清除自身3个不利状态，100%概率触发免疫不利9秒，5秒内无视群体攻击
 */
class Skill5834 extends BaseHookSkillStub {

    constructor() {
        super(5834);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDecdamage(100, 0.9, 25100);

        player.SetCleardebuff(100, 3);

        player.SetTurndebuff(3000 * skill.GetLevel(), 1, 0);

        player.SetAoEImmune(100, 5000)

        return true
    }

}

/**
 * 5835  大道无形Ⅲ《大地》
 * 固定25秒，调整为自身10秒内技能闪躲增加45点
 */
class Skill5835 extends BaseHookSkillStub {

    constructor() {
        super(5835);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDecdamage(100, 0.9, 25100);

        player.SetIncskilldodge(100, 0.015 * skill.GetLevel(), 2000 * skill.GetLevel() + 4100, 3);

        return true
    }
}

/**
 * 5836  大道无形III  《英雄》
 * 固定25秒
 */
class Skill5836 extends BaseHookSkillStub {

    constructor() {
        super(5836);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000;
    }

}

/**
 * 1565  真元华闪II
 * 冷却减少85秒
 */
class Skill1565 extends BaseHookSkillStub {

    constructor() {
        super(1565);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 85000;
    }

}

/**
 * 5747  真元华闪Ⅲ《天空》
 * 冷却减少5秒，调整真气贯穿效果：当前真气大于80%时，追加自身真气上限15%攻击力
 */
class Skill5747 extends BaseHookSkillStub {

    constructor() {
        super(5747);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 5000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Buffcnt = player.GetBuffcnt();
        player.SetVar1(Buffcnt);
        const Mp = player.GetMp();
        player.SetVar2(Mp);

        const v18 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v18);
        const v19 = skill.GetLevel() * 0.05 + 0.7000000000000001;
        skill.SetCrithurt(v19);

        const v13 = 2 * (skill.GetLevel() + 2);
        skill.SetSkillaccu(v13);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        const v20 = skill.GetLevel() * 0.5 + 1.5 + v14;
        skill.SetRatio(v20);

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = Math.floor(v15 / (Maxmp * 0.8));
        const v17 = player.GetMaxmp() * 0.15 * v16;
        const v21 = 1000 * skill.GetLevel() + v17;
        skill.SetPlus(v21);

        player.SetPerform(1);
    }

}

/**
 * 5748  真元华闪Ⅲ《碧海》
 * 冷却减少5秒，调整真气贯穿效果：当前真气大于80%时，追加自身真气上限15%攻击力
 */
class Skill5748 extends BaseHookSkillStub {

    constructor() {
        super(5748);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 5000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Buffcnt = player.GetBuffcnt();
        player.SetVar1(Buffcnt);
        const Mp = player.GetMp();
        player.SetVar2(Mp);

        const v18 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v18);
        const v19 = skill.GetLevel() * 0.05 + 0.7000000000000001;
        skill.SetCrithurt(v19);

        const v13 = 2 * (skill.GetLevel() + 2);
        skill.SetSkillaccu(v13);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01;
        const v20 = skill.GetLevel() * 0.5 + 1.5 + v14;
        skill.SetRatio(v20);

        const Maxmp = player.GetMaxmp();
        const v15 = player.GetMp();
        const v16 = Math.floor(v15 / (Maxmp * 0.8));
        const v17 = player.GetMaxmp() * 0.15 * v16;
        const v21 = 1000 * skill.GetLevel() + v17;
        skill.SetPlus(v21);

        player.SetPerform(1);
    }
}

/**
 * 5749  真元华闪Ⅲ《大地》
 * 冷却减少5秒，调整真气贯穿效果：当前真气大于80%时，追加自身真气上限15%攻击力
 */
class Skill5749 extends BaseHookSkillStub {

    constructor() {
        super(5749);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 5000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Buffcnt = player.GetBuffcnt();
        player.SetVar1(Buffcnt);
        const Mp = player.GetMp();
        player.SetVar2(Mp);
        const Res4 = player.GetRes4();
        player.SetVar3(Res4);
        const Res1 = player.GetRes1();
        player.SetVar4(Res1);

        const v24 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v24);
        const v25 = skill.GetLevel() * 0.05 + 0.7000000000000001;
        skill.SetCrithurt(v25);

        const v19 = 2 * (skill.GetLevel() + 2);
        skill.SetSkillaccu(v19);

        const v20 = (5 * skill.GetLevel() + 10) * 0.01;
        const v26 = skill.GetLevel() * 0.5 + 1.5 + v20;
        skill.SetRatio(v26);

        const Maxmp = player.GetMaxmp();
        const v21 = player.GetMp();
        const v22 = Math.floor(v21 / (Maxmp * 0.8));
        const v23 = player.GetMaxmp() * 0.15 * v22;
        const v27 = 1000 * skill.GetLevel() + v23;
        skill.SetPlus(v27);

        player.SetPerform(1);

    }

}

/**
 * 5750  真元华闪Ⅲ《英雄》
 * 冷却减少5秒，调整真气贯穿效果：当前真气大于80%时，追加自身真气上限15%攻击力
 * 取消最近距离限制，12米内若自身每增加1个有利状态，目标每增加1个不利状态，效果提高20%；
 * 35%概率无视目标神佑
 */
class Skill5750 extends BaseHookSkillStub {

    constructor() {
        super(5750);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 5000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Buffcnt = player.GetBuffcnt();
        player.SetVar1(Buffcnt);
        const Mp = player.GetMp();
        player.SetVar2(Mp);
        const Res4 = player.GetRes4();
        player.SetVar3(Res4);
        const Res1 = player.GetRes1();
        player.SetVar4(Res1);

        const standRange = player.GetStandrange();
        let v5 = 0
        if (standRange <= 12.0) {
            v5 = 10;
            player.SetVar6(1);
        } else {
            v5 = Math.floor((29.0 - standRange) * 0.5881999999999999);
        }

        player.SetVar5(v5);

        const v30 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v30);
        const v31 = skill.GetLevel() * 0.05 + 0.7000000000000001;
        skill.SetCrithurt(v31);

        const Level = skill.GetLevel();
        const v25 = Math.floor(2 * (Level + 2) + 0.15);
        skill.SetSkillaccu(v25);

        const v26 = (5 * skill.GetLevel() + 10) * 0.01;
        const v32 = skill.GetLevel() * 0.5 + 1.5 + v26;
        skill.SetRatio(v32);

        const Maxmp = player.GetMaxmp();
        const v27 = Math.floor(player.GetMp() / (Maxmp * 0.8));
        const v29 = player.GetMaxmp() * 0.15 * v27;
        const v33 = 1000 * skill.GetLevel() + v29;
        skill.SetPlus(v33);
        player.SetPerform(1);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // super.BlessMe(stub, skill, originFunc);
        // const player = skill.GetPlayerNice()
        // player.SetIgnoreblessed(35, 1200)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // 若自身每增加1个有利状态，目标每增加1个不利状态，效果提高20%；
        const player = skill.GetPlayerNice();
        let da = 0
        if (player.GetVar6() == 1) {
            const d = player.GetDebuffcnt() * 0.2;
            da = player.GetVar1() * 0.2 + d;
        }

        const db = player.GetVar5() * 0.1 * da + 1.0;
        const v6 = 2 * (player.GetHp() + 50);
        const dbAdjusted = ((v6 / (player.GetMaxhp() + 100)) + 0.35) * db;
        player.SetSecondattack(dbAdjusted, 0, 0);
        return true
    }
}

/**
 * 3019  太极玄天真决<玄>
 * 群攻6次，附加自身真气上限10%的攻击力
 * 每一击可令目标被暴击伤害增加30%，最多叠加3层，持续时间20秒
 */
class Skill3019 extends BaseHookSkillStub {

    constructor() {
        super(3019);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(1)
        player.SetPerform(1);
        player.SetVar1(2)
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(3)
        player.SetPerform(0);
        player.SetVar1(4)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(5)
        player.SetPerform(0);
        player.SetVar1(6)
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        if (player.GetVar1() % 2 != 0) {
            player.SetIncfatalhurt(120, 0.3, 20000, player.GetVar1())
        }

        return true
    }

}

/**
 * 3067  太极玄天真诀<煞>
 * 群攻6次，附加自身真气上限10%的攻击力
 */
class Skill3067 extends BaseHookSkillStub {

    constructor() {
        super(3067);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(1)
        player.SetPerform(1);
        player.SetVar1(2)
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(3)
        player.SetPerform(0);
        player.SetVar1(4)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(5)
        player.SetPerform(0);
        player.SetVar1(6)
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        if (player.GetVar1() % 2 != 0) {
            player.SetIncfatalhurt(120, 0.3, 20000, player.GetVar1())
        }

        return true
    }

}

/**
 * 3115  太极玄天真诀<禅>
 * 群攻6次，附加自身真气上限10%的攻击力
 */
class Skill3115 extends BaseHookSkillStub {

    constructor() {
        super(3115);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(1)
        player.SetPerform(1);
        player.SetVar1(2)
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(3)
        player.SetPerform(0);
        player.SetVar1(4)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Level = skill.GetLevel();
        const v25 = Level * 0.05 + 1.0;
        const v18 = norm(Level / 14.9) * 0.03;
        const v26 = (Level - 15) * v18 + v25;
        const v19 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v20 = player.GetSkilllevel(242) / 9 * 0.05 + v19;
        const v21 = player.GetSkilllevel(543) / 9 * 0.05 + v20;
        const v22 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v21;
        const v23 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v22;
        const v27 = skill.GetT3() * v23 + v26;
        const v24 = Level * 0.02 + 0.06;
        const Mp = player.GetMp();
        const v17 = Mp / (0.95 - skill.GetT2() * 0.1);
        const Maxmp = player.GetMaxmp();
        const v30 = Math.floor(v17 / Maxmp) * v24 + v27;
        skill.SetRatio(v30);
        const v11 = 22 * Level + 750;
        const v12 = 2 * Level;
        const v28 = v11 + v12 * Level;
        const T0 = skill.GetT0();
        const v14 = zrand(15 * T0 + 10) - 10;
        const v29 = skill.GetT0();
        const v31 = (v14 * norm(v29 + 0.1) + 100) / 100.0 * v28;
        skill.SetPlus(v31 + Maxmp * 0.1);
        player.SetVar1(5)
        player.SetPerform(0);
        player.SetVar1(6)
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        if (player.GetVar1() % 2 != 0) {
            player.SetIncfatalhurt(120, 0.3, 20000, player.GetVar1())
        }

        return true
    }

}

/**
 * 3020  神剑御雷真诀<玄>
 * 调整为5秒施法，18次攻击，冷却时间固定25秒,
 * 每段附加自身当前真气8%，攻击怪物目标时，追加自身真气上限8%的攻击力
 * 新增真气贯穿：自身真气大于95%时，追加自身真气上限15%的攻击力
 *
 * 技能有%d%%几率进入急速冷却，施法时免疫睡眠6秒。
 * 每一击均可令目标禁食3秒
 * 每段附加附加致命一击率10%，技能达到20级每段附加20%致命伤害
 * 单数段，令目标定身6秒，定身能力为自身定身抗性+2*level点
 * 双数段，令玩家目标麻痹6秒，技能施法和移动速度降低2%*level
 * 第一段攻击时令自身1秒内处于真无敌状态
 * 最后一段攻击附加自身真气上限30%的攻击力。%.1f%%几率令目标无法施法%d秒，魅惑能力为自身魅惑抗性。
 * 范围内敌对目标每增加1人，则范围内所有敌对目标伤害额外增加施法者自身气血、真气和的2%与攻击力的20%
 * <玄>：增加自身技能躲闪50点6秒。
 * 玄烛·雷霆震怒·曦日【被动生效:令-“神剑御雷真诀<玄><煞><禅>”施法速度减少20%】
 */
class Skill3020 extends BaseHookSkillStub {

    constructor() {
        super(3020);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetTime(6000.0);
        player.SetImmunesleep(1);
        if (player.GetVar3() == 1) {
            const xr = player.GetSkilllevel(6820)
            let t = 0
            if (xr >= 5) {//曦日
                t = 2000
            }

            player.SetInvincible(2000 + t)
            //<玄>：增加自身技能躲闪50点6秒。
            player.SetIncskilldodge(120, 0.05, 6000, 2)
        }

        const v3 = player.GetVar3()
        if (v3 == 1 || v3 == 3 || v3 == 5 || v3 == 7 || v3 == 9 || v3 == 11 || v3 == 13 || v3 == 15 || v3 == 17) {
            const Level = skill.GetLevel();
            const v3 = zrand(2 * (Level + 50));
            const d = 2800 * Math.floor(v3 / 100) + 220;
            player.SetClearcooldown(d, 220, 220);
        }

        //额外增加施法者自身气血、真气和的2%与攻击力的20%
        player.SetScopedamage(120, player.GetMaxHPAndMP() * 0.02 + player.GetInk() * 0.2, 0.0);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetDiet(100, 3000)
        if (player.GetVar3() % 2 == 0) {//双数段
            //第2、4、6、8、10、12、14、16、18段令玩家目标麻痹6秒，技能施法和移动速度降低2%*level
            player.SetParalysis(100, 6000, 0.02 * skill.GetLevel(), 0.02 * skill.GetLevel())
        } else {//单数段
            //第1、3、5、7、9、11、13、15、17段令目标定身6秒，定身能力为自身定身抗性+2*level点
            player.SetWrap(player.GetVar1() + skill.GetLevel() * 2, 6000)
        }

        //40%几率令目标无法施法6秒，魅惑能力为自身魅惑抗性。
        if (player.GetVar3() == 18) {
            const r = zrand(100)
            if (r < skill.GetLevel() * 2) {
                player.SetSilent(player.GetVar2(), 6100)
            }
        }

        return true
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 4000
        } else {
            return 5000
        }
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 560
        } else {
            return 700
        }
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 560
        } else {
            return 700
        }
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)
        player.SetVar3(1)
        player.SetPerform(1);
        player.SetVar3(2)
        player.SetPerform(0);
        player.SetVar3(3)
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(4)
        player.SetPerform(0);
        player.SetVar3(5)
        player.SetPerform(0);
        player.SetVar3(6)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(7)
        player.SetPerform(0);
        player.SetVar3(8)
        player.SetPerform(0);
        player.SetVar3(9)
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(10)
        player.SetPerform(0);
        player.SetVar3(11)
        player.SetPerform(0);
        player.SetVar3(12)
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(13)
        player.SetPerform(0);
        player.SetVar3(14)
        player.SetPerform(0);
        player.SetVar3(15)
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(16)
        player.SetPerform(0);
        player.SetVar3(17)
        player.SetPerform(0);
        player.SetVar3(18)
        // 最后一段攻击附加自身真气上限30%的攻击力
        skill.SetPlus(v35 + mpPlus + zqgc + Maxmp * 0.3);
        player.SetPerform(0);
    }
}

/**
 * 3068  神剑御雷真诀<煞>
 * 调整为5秒施法，18次攻击，冷却时间固定25秒,
 * 每段附加自身当前真气8%，攻击怪物目标时，追加自身真气上限8%的攻击力
 * 新增真气贯穿：自身真气大于95%时，追加自身真气上限15%的攻击力
 *
 * 技能有%d%%几率进入急速冷却，施法时免疫睡眠6秒。
 * 每一击均可令目标禁食3秒
 * 每段附加附加致命一击率10%，技能达到20级每段附加20%致命伤害
 * 单数段，令目标定身6秒，定身能力为自身定身抗性+2*level点
 * 双数段，令玩家目标麻痹6秒，技能施法和移动速度降低2%*level
 * 第一段攻击时令自身2秒内处于真无敌状态
 * 最后一段攻击附加自身真气上限30%的攻击力。%.1f%%几率令目标无法施法%d秒，魅惑能力为自身魅惑抗性。
 * 范围内敌对目标每增加1人，则范围内所有敌对目标伤害额外增加施法者自身气血、真气和的2%与攻击力的20%
 * <煞>：最后一段取消魅惑，令对方8秒内每次攻击概率丢失有利状态。
 * 玄烛·雷霆震怒·曦日【被动生效:令-“神剑御雷真诀<玄><煞><禅>”施法速度减少20%】
 */
class Skill3068 extends BaseHookSkillStub {

    constructor() {
        super(3068);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetImmunesleep(6000);

        if (player.GetVar3() == 1) {
            const xr = player.GetSkilllevel(6820)
            let t = 0
            if (xr >= 5) {//曦日
                t = 2000
            }

            player.SetInvincible(2000 + t)
        }

        const v3 = player.GetVar3()
        if (v3 == 1 || v3 == 3 || v3 == 5 || v3 == 7 || v3 == 9 || v3 == 11 || v3 == 13 || v3 == 15 || v3 == 17) {
            const Level = skill.GetLevel();
            const v3 = zrand(2 * (Level + 50));
            const d = 2848 * Math.floor(v3 / 100) + 220;
            player.SetClearcooldown(d, 220, 220);
        }

        //额外增加施法者自身气血、真气和的2%与攻击力的20%
        player.SetScopedamage(120, player.GetMaxHPAndMP() * 0.02 + player.GetInk() * 0.2, 0.0);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetDiet(100, 3000)
        if (player.GetVar3() % 2 == 0) {//双数段
            //第2、4、6、8、10、12、14、16、18段令玩家目标麻痹6秒，技能施法和移动速度降低2%*level
            player.SetParalysis(100, 6000, 0.02 * skill.GetLevel(), 0.02 * skill.GetLevel())
        } else {//单数段
            //第1、3、5、7、9、11、13、15、17段令目标定身6秒，定身能力为自身定身抗性+2*level点
            player.SetWrap(player.GetVar1() + skill.GetLevel() * 2, 6000)
        }

        if (player.GetVar3() == 18) {
            player.SetBlazingSun(100, 8100, 0.5, 0.0);
        }

        return true
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 4000
        } else {
            return 5000
        }
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 560
        } else {
            return 700
        }
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 560
        } else {
            return 700
        }
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)
        player.SetVar3(1)
        player.SetPerform(1);
        player.SetVar3(2)
        player.SetPerform(0);
        player.SetVar3(3)
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(4)
        player.SetPerform(0);
        player.SetVar3(5)
        player.SetPerform(0);
        player.SetVar3(6)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(7)
        player.SetPerform(0);
        player.SetVar3(8)
        player.SetPerform(0);
        player.SetVar3(9)
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(10)
        player.SetPerform(0);
        player.SetVar3(11)
        player.SetPerform(0);
        player.SetVar3(12)
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(13)
        player.SetPerform(0);
        player.SetVar3(14)
        player.SetPerform(0);
        player.SetVar3(15)
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(16)
        player.SetPerform(0);
        player.SetVar3(17)
        player.SetPerform(0);
        player.SetVar3(18)
        // 最后一段攻击附加自身真气上限30%的攻击力
        skill.SetPlus(v35 + mpPlus + zqgc + Maxmp * 0.3);
        player.SetPerform(0);
    }
}

/**
 * 3116  神剑御雷真诀<禅>
 * 调整为5秒施法，18次攻击，冷却时间固定25秒,
 * 每段附加自身当前真气8%，攻击怪物目标时，追加自身真气上限8%的攻击力
 * 新增真气贯穿：自身真气大于95%时，追加自身真气上限15%的攻击力
 *
 * 技能有%d%%几率进入急速冷却，施法时免疫睡眠6秒。
 * 每一击均可令目标禁食3秒
 * 每段附加附加致命一击率10%，技能达到20级每段附加20%致命伤害
 * 单数段，令目标定身6秒，定身能力为自身定身抗性+2*level点
 * 双数段，令玩家目标麻痹6秒，技能施法和移动速度降低2%*level
 * 第一段攻击时令自身1秒内处于真无敌状态
 * 最后一段攻击附加自身真气上限30%的攻击力。%.1f%%几率令目标无法施法%d秒，魅惑能力为自身魅惑抗性。
 * 范围内敌对目标每增加1人，则范围内所有敌对目标伤害额外增加施法者自身气血、真气和的2%与攻击力的20%
 * <禅>：最后一段增加自身减免伤害4%，持续6秒
 * 玄烛·雷霆震怒·曦日【被动生效:令-“神剑御雷真诀<玄><煞><禅>”施法速度减少20%】
 */
class Skill3116 extends BaseHookSkillStub {

    constructor() {
        super(3116);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetTime(6000.0);
        player.SetImmunesleep(1);

        if (player.GetVar3() == 1) {
            const xr = player.GetSkilllevel(6820)
            let t = 0
            if (xr >= 5) {//曦日
                t = 2000
            }

            player.SetInvincible(2000 + t)
        }

        const v3 = player.GetVar3()
        if (v3 == 1 || v3 == 3 || v3 == 5 || v3 == 7 || v3 == 9 || v3 == 11 || v3 == 13 || v3 == 15 || v3 == 17) {
            const Level = skill.GetLevel();
            const v3 = zrand(2 * (Level + 50));
            const d = 2896 * Math.floor(v3 / 100) + 220;
            player.SetClearcooldown(d, 220, 220);
        }

        //额外增加施法者自身气血、真气和的2%与攻击力的20%
        player.SetScopedamage(120, player.GetMaxHPAndMP() * 0.02 + player.GetInk() * 0.2, 0.0);

        if (player.GetVar3() == 18) {
            player.SetUltimateDamageReduction(120, 6100, 0.04, 1, 2)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetDiet(100, 3000)
        if (player.GetVar3() % 2 == 0) {//双数段
            //第2、4、6、8、10、12、14、16、18段令玩家目标麻痹6秒，技能施法和移动速度降低2%*level
            player.SetParalysis(100, 6000, 0.02 * skill.GetLevel(), 0.02 * skill.GetLevel())
        } else {//单数段
            //第1、3、5、7、9、11、13、15、17段令目标定身6秒，定身能力为自身定身抗性+2*level点
            player.SetWrap(player.GetVar1() + skill.GetLevel() * 2, 6000)
        }

        //40%几率令目标无法施法6秒，魅惑能力为自身魅惑抗性。
        if (player.GetVar3() == 18) {
            const r = zrand(100)
            if (r < skill.GetLevel() * 2) {
                player.SetSilent(player.GetVar2(), 6100)
            }
        }

        return true
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 4000
        } else {
            return 5000
        }
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 572
        } else {
            return 715
        }
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 560
        } else {
            return 700
        }
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6820) > 0) {
            return 560
        } else {
            return 700
        }
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)
        player.SetVar3(1)
        player.SetPerform(1);
        player.SetVar3(2)
        player.SetPerform(0);
        player.SetVar3(3)
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(4)
        player.SetPerform(0);
        player.SetVar3(5)
        player.SetPerform(0);
        player.SetVar3(6)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(7)
        player.SetPerform(0);
        player.SetVar3(8)
        player.SetPerform(0);
        player.SetVar3(9)
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(10)
        player.SetPerform(0);
        player.SetVar3(11)
        player.SetPerform(0);
        player.SetVar3(12)
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(13)
        player.SetPerform(0);
        player.SetVar3(14)
        player.SetPerform(0);
        player.SetVar3(15)
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res3 = player.GetRes3();
        player.SetVar1(Res3);
        const SilenceRes = player.GetSilenceRes();
        player.SetVar2(SilenceRes);

        skill.SetCrit(0.1)

        const Level = skill.GetLevel();
        const v33 = Math.floor(Level / 19.9) * 0.02;
        skill.SetCrithurt(v33);

        const v29 = Level * 0.13 + 1.0;
        const v22 = norm(Level / 14.9) * 0.03;
        const v30 = (Level - 15) * v22 + v29;

        const v23 = player.GetSkilllevel(234) / 9 * 0.05 + 0.05;
        const v24 = player.GetSkilllevel(242) / 9 * 0.05 + v23;
        const v25 = player.GetSkilllevel(543) / 9 * 0.05 + v24;
        const v26 = Math.floor(player.GetSkilllevel(785) / 3.9) * 0.05 + v25;
        const v27 = Math.floor(player.GetSkilllevel(786) / 1.9) * 0.05 + v26;
        const Skilllevel = player.GetSkilllevel(3019);
        const v28 = norm(Skilllevel / 0.9) * 0.05 + v27;
        const v34 = skill.GetT2() * v28 + v30;
        skill.SetRatio(v34);

        const v17 = 12 * Level + 800;
        const v18 = 3 * Level;
        const v31 = v17 + v18 * Level;
        const T1 = skill.GetT1();
        const v20 = zrand(15 * T1 + 10) - 10;
        const v35 = (v20 * norm(T1 + 0.1) + 100) / 100.0 * v31;

        const v15 = player.GetMp();
        const Maxmp = player.GetMaxmp();
        const v16 = v15 / (Maxmp * 0.95);

        const mpPlus = v15 * 0.08//每段附加真气
        const zqgc = Maxmp * 0.15 * v16;//真气贯穿
        skill.SetPlus(v35 + mpPlus + zqgc);

        skill.SetMobBonusDamage(Maxmp * 0.08)

        player.SetVar3(16)
        player.SetPerform(0);
        player.SetVar3(17)
        player.SetPerform(0);
        player.SetVar3(18)
        // 最后一段攻击附加自身真气上限30%的攻击力
        skill.SetPlus(v35 + mpPlus + zqgc + Maxmp * 0.3);
        player.SetPerform(0);
    }
}

/**
 * 飞升技能减免270秒冷却的技能，都是120秒冷却
 *
 * 太阴冰咒：玄、太阴冰咒：霸、太阴冰咒：妙、太阴冰咒：梵、太阴冰咒：暗、太阴冰咒：焚【冷却减少270秒】
 * 幻光圣天：玄、幻光圣天：霸、幻光圣天：妙、幻光圣天：梵、幻光圣天：暗、幻光圣天：焚【冷却减少270秒】
 * 八荒真火：玄、八荒真火：霸、八荒真火：妙、八荒真火：梵、八荒真火：暗、八荒真火：焚【冷却减少270秒】
 */
class FeiShengQingYunSkill extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            1300,
            1632,
            1652,
            1672,
            1692,
            3787,

            1299,
            1631,
            1651,
            1671,
            1691,
            3786,

            1298,
            1630,
            1650,
            1670,
            1690,
            3785,
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

/**
 * 600   绝圣弃智
 * 6817玄烛·绝圣弃智·曦日：真·弃智
 */
class Skill600 extends BaseHookSkillStub {

    constructor() {
        super(600);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6817) > 0 && player.GetTargetTypeIsMob()) {
            player.SetIncMobDmg(120, 17000, 0.12, 7);
        }

        super.Calculate2(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(6817) > 0) {
            player.SetTransform(120, 1260, 1, 1, 1100)
        }

        return true
    }

}


export class QingYunSkillList {
    constructor() {
        new Skill233()
        new Skill231()
        new Skill235()
        new Skill312()
        new Skill236()
        new Skill539()
        new Skill540()
        new Skill544()
        new Skill537()
        new Skill6814()
        new Skill545()
        new Skill784()
        new Skill3018()
        new Skill3114()
        new Skill3066()
        new Skill1539()
        new Skill2044()
        new Skill1589()
        new Skill1590()
        new Skill2064()
        new Skill1564()
        new Skill1563()
        new Skill2054()
        new Skill2055()
        new Skill5833()
        new Skill5834()
        new Skill5835()
        new Skill5836()
        new Skill1565()
        new Skill5747()
        new Skill5748()
        new Skill5749()
        new Skill5750()
        new Skill3019()
        new Skill3067()
        new Skill3115()
        new Skill3020()
        new Skill3068()
        new Skill3116()
        new Skill229()
        new Skill1591()
        new Skill600()
        new FeiShengQingYunSkill()
    }
}