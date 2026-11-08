import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList, QuickExecutetimeList} from "../../base/skill/QuickSkillUtil";

/**
 * 1853 空行
 * 基础冷却40秒
 * 6901玄烛·空行·曦日：无视群攻效果的时间调整为12秒；驱散自身3个超过5秒的不利效果
 *
 */
class Skill1853 extends BaseHookSkillStub {

    constructor() {
        super(1853);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetDodge(5000, 15);

        const d = 30 * skill.GetLevel();
        player.SetClearslow(d);

        const da = 30 * skill.GetLevel();
        player.SetDispel(da, 9312, 9312, 9312);

        const skillLevel6899 = player.GetSkilllevel(6899);
        const skillLevel6900 = player.GetSkilllevel(6900);
        const skillLevel6901 = player.GetSkilllevel(6901);
        const star_lvl = skillLevel6899 + skillLevel6900 + skillLevel6901;

        if (star_lvl > 0) {
            let count = player.GetDebuffcntTimeout(5);
            if (count > star_lvl + 2) count = star_lvl + 2;

            player.SetCleardebuff(100, count);
            player.SetCleardebuffDuration(100, 3, 5000);

            let dur = 2000;
            if (skillLevel6900 > 0) dur = 4000;
            if (skillLevel6901 > 0) dur = 12000;

            const dc = dur + 100;
            player.SetAoEImmune(120, dc);
        }
        return true
    }
}

/**
 * 1844  横行
 * 基础冷却50秒；前10秒进入极速加速；移动速度额外加1米
 */
class Skill1844 extends BaseHookSkillStub {

    constructor() {
        super(1844);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 2000 * skill.GetLevel() + 12000;
        const ta = skill.GetLevel() * 0.4 + 0.2;
        player.SetAddspeed(120, t, ta, 2);

        player.SetAddspeed(120, 10000, 6.5, 1);

        const tb = 10 * skill.GetLevel();
        player.SetClearweak(tb);
        return true
    }

}

/**
 * 1875  杀戮
 * 删除原有效果，施法1秒，冷却固定40秒，附加本体攻击50%，额外附加技能命中15点，
 * 附加虚弱效果，虚弱能力为自身虚弱抗性+120点，降低攻击力40%，
 * 虚弱成功则令目标立即损失双方气血差10倍再加双方虚弱抗性差20倍的伤害
 * 攻击怪物目标时，额外附加自身气血真气上限和40%的本体攻击力
 */
class Skill1875 extends BaseHookSkillStub {

    constructor() {
        super(1875);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
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
        // 附加本体攻击50%，额外附加技能命中15点，
        // 附加虚弱效果，虚弱能力为自身虚弱抗性+120点
        //攻击怪物目标时，额外附加自身气血真气上限和40%的本体攻击力
        skill.SetRatio(1.05 + skill.GetLevel() * 0.05)
        skill.SetSkillaccu(0.15)
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.4)
        player.SetVar1(player.GetRes2())
        player.SetVar2(player.GetHp())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // 降低攻击力40%，
        // 虚弱成功则令目标立即损失双方气血差10倍再加双方虚弱抗性差20倍的伤害
        const player = skill.GetPlayerNice()
        player.SetWeak(player.GetVar1() + 120, 10000, 0.4, 1)
        if (player.GetVar1() + 120 > player.GetRes3() && player.GetVar2() > player.GetHp()) {
            let h = 0
            if (player.GetVar1() > player.GetRes3()) {
                h = (player.GetVar1() - player.GetRes3()) * 20
            }

            player.SetDirecthurt(120, player.GetVar2() * 10 + h)
        }

        return true
    }
}

/**
 * 1879  乱刃
 * 瞬间冷却，施法1秒，对怪物的附加固定伤害值每级提升20%
 */
class Skill1879 extends BaseHookSkillStub {

    constructor() {
        super(1879);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v3;
        if (player.GetTypeIsMob()) {
            v3 = 120;
        } else {
            v3 = 0;
        }

        let d = skill.GetLevel() * 0.8 * player.GetVar1();
        player.SetDirecthurt(v3, d);

        let v9 = 0;
        if (player.GetDef() > 20000) {
            v9 = 0.0;
        } else {
            v9 = 2 * skill.GetLevel();
        }

        const da = 3000 * skill.GetLevel();
        const db = player.GetDef();
        player.SetSubdefence(v9, db, da, 0);
        return true
    }

}

/**
 * 1869  豪血
 * 增加气血上限调整为4%*level；祝福自身及队友在30分钟内增加三御10%
 */
class Skill1869 extends BaseHookSkillStub {

    constructor() {
        super(1869);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const v7 = 300000 * skill.GetT1() + 600000;
        const v8 = skill.GetLevel() * 0.04;//增加气血上限调整为4%*level
        const d = (skill.GetT0() * 0.25 + 1.0) * v8;
        player.SetInchp(d, v7, 1);

        player.SetIncCultRes(120, 1800000, 0.1, 0, 0)
        player.SetIncCultRes(120, 1800000, 0.1, 1, 1)
        player.SetIncCultRes(120, 1800000, 0.1, 2, 2)
        return true
    }

}

/**
 * 1855  龙骧
 * 不再降低防御，攻击力额外提升10%；30分钟内增加自身气血上限3%
 */
class Skill1855 extends BaseHookSkillStub {

    constructor() {
        super(1855);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v5;
        if (player.GetVar1()) {
            v5 = 4167;
        } else {
            v5 = 0;
        }

        player.SetDispel(120, 4168, v5, 0);
        let v10;
        if (player.GetVar1()) {
            v10 = 0;
        } else {
            v10 = 120;
        }
        player.SetProbability(v10);
        const d = skill.GetLevel() * 0.06 + 0.1;
        player.SetLongxiang(v10, d, 0);
        player.SetInchp(0.03, 1800000, 8);
        return true
    }

}

/**
 * 1881  蚩魂
 * 额外增加自身减免伤害10%，持续20秒
 *
 */
class Skill1881 extends BaseHookSkillStub {

    constructor() {
        super(1881);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetUltimateDamageReduction(120, 20000, 0.1, 1, 1);
        return true
    }

}

/**
 * 1858  虎踞
 * 不再降低攻击，防御力额外提升20%；30分钟内增加自身减免伤害3%
 */
class Skill1858 extends BaseHookSkillStub {

    constructor() {
        super(1858);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v5;
        if (player.GetVar1()) {
            v5 = 4168;
        } else {
            v5 = 0;
        }

        player.SetDispel(120, 4167, v5, 0);

        let v10;
        if (player.GetVar1()) {
            v10 = 0;
        } else {
            v10 = 120;
        }

        player.SetHuju(v10, 0, skill.GetLevel() * 0.08);
        player.SetInchp(0.03, 1800000, 8);
        return true
    }
}

/**
 * 1866  龙光
 * 自身及队伍固定攻击增加2000点；祝福自身及队友在30分钟内增加对非玩家目标伤害10%
 */
class Skill1866 extends BaseHookSkillStub {

    constructor() {
        super(1866);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let t = 300000 * skill.GetT1() + 600000;
        let ta = skill.GetLevel() * 0.01 + 0.05;
        ta = (skill.GetT0() * 0.25 + 1.0) * ta;
        player.SetIncattack(120, t, ta, 2);
        player.SetAddattack(120, t, 2000, 2)
        player.SetIncMobDmg(120, 1800000, 0.1, 2);
        return true
    }

}

/**
 * 1871  战歌
 * 阵法期间，祝福自身及队友免疫致命一击及多种负面状态
 */
class Skill1871 extends BaseHookSkillStub {

    constructor() {
        super(1871);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetChihun(120, 10000, 0, 0, 2)
        // player.SetAvert(120, 10000, 0.15)
        return true
    }

}

/**
 * 1848  虎力
 * 只对自身有效。删除加攻击效果，改为10秒内免疫嘲讽；冷却固定为90秒
 */
class Skill1848 extends BaseHookSkillStub {

    constructor() {
        super(1848);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetImmunetaune(120, 10100)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }

}

/**
 * 1851  风息
 * 只对自身有效。删除加血效果，改为15秒内反隐能力提高20点；冷却固定为50秒
 */
class Skill1851 extends BaseHookSkillStub {

    constructor() {
        super(1851);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 50000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetAddspot(120, 20, 15000, 1)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }
}

/**
 * 1876  钢胆
 * 真气替换气血伤害的比例提高5%
 */
class Skill1876 extends BaseHookSkillStub {

    constructor() {
        super(1876);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = skill.GetT0() * 0.1 + 0.3;
        let da = skill.GetLevel() * 0.01001 + 0.05;
        player.SetGangdan(da, d, 0.5,1);
        return true
    }

}

/**
 * 1873  斗魂
 * 该姿态下，自身暴击额外提升5%，暴伤额外提升50%
 */
class Skill1873 extends BaseHookSkillStub {

    constructor() {
        super(1873);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = skill.GetT0() * 0.1 + 0.35;
        let da = skill.GetLevel() * 0.01001;
        player.SetDouhun(da, d, 2.0);
        return true
    }

}

/**
 * 2228  裂空II
 * 施法1秒，额外清除目标所有加速状态；令目标“禁食”，持续3秒
 */
class Skill2228 extends BaseHookSkillStub {

    constructor() {
        super(2228);
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
        player.SetDiet(120, 3000)
        player.SetDispel(120, 11, 0, 0)
        return true
    }

}

/**
 * 2229  杀戮II
 * 冷却30秒
 */
class Skill2229 extends BaseHookSkillStub {

    constructor() {
        super(2229);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
    }

}

/**
 * 2217  虎啸II
 * 冷却减少30秒
 */
class Skill2217 extends BaseHookSkillStub {

    constructor() {
        super(2217);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

}

/**
 * 2216  雷霆II
 * 施法1秒，额外禁食目标4秒
 */
class Skill2216 extends BaseHookSkillStub {

    constructor() {
        super(2216);
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
        player.SetDiet(120, 4000)
        return true
    }

}

/**
 * 2219  百烈II
 * 施法1秒，额外禁食目标4秒
 */
class Skill2219 extends BaseHookSkillStub {

    constructor() {
        super(2219);
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
        player.SetDiet(120, 4000)
        return true
    }

}

/**
 * 2218  战歌II
 * 法阵的技能命中和暴击率增益额外提升10点，并令自身及队友的移动速度增加1米（不可与一代法阵叠加）
 */
class Skill2218 extends BaseHookSkillStub {

    constructor() {
        super(2218);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = skill.GetLevel() * 0.005 + 0.1;
        player.SetIncskillaccu(120, d, 9000, 1);

        let da = skill.GetLevel() * 0.005 + 0.1;
        player.SetInccritrate(9000, da, 0);

        player.SetAddspeed(120, 9000, 1, 4)
        return true
    }

}

/**
 * 2235  履尾II
 * 施法1秒，额外清除目标2个有利状态
 */
class Skill2235 extends BaseHookSkillStub {

    constructor() {
        super(2235);
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
        const player = skill.GetPlayerNice()
        player.SetBreakcasting(120);
        let d = 10 * skill.GetLevel();
        player.SetClearbuff(d, 2);
        return true
    }
}

/**
 * 破坚II、破煞II、碎刃II
 * 施法1秒
 */
class ShiFa1S extends QuickExecutetimeList {
    getSkillList(): number[] {
        return [2236, 2237, 2238];
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
 * 3037  乱刃<玄>
 * 乱刃<玄><煞><禅>：施法1秒，瞬间冷却
 */
class Skill3037 extends BaseHookSkillStub {

    constructor() {
        super(3037);
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

}

/**
 * 3085
 *
 */
class Skill3085 extends BaseHookSkillStub {

    constructor() {
        super(3085);
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

}

/**
 * 3133
 *
 */
class Skill3133 extends BaseHookSkillStub {

    constructor() {
        super(3133);
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

}

/**
 * 3038  八肱<玄>
 * 八肱<玄><煞><禅>：
 * 瞬间冷却，施法1秒，攻击8次
 * 附加本体攻击力调整为10% * level，额外附加自身当前气血10%的攻击力，
 * 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
 * 第一击概率清除目标有利状态1个；令目标在10秒内增加被致命一击伤害15%*level（满级300%）
 * <玄>：降低目标气血上限20%。
 * <煞>：增加自身技能伤害15%。
 * <禅>：附加真气上限8%攻击力
 */
class Skill3038 extends BaseHookSkillStub {

    constructor() {
        super(3038);
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
        const player = skill.GetPlayerNice()
        player.SetVar1(1);
        let v8 = skill.GetT0() * 0.02 + 1.02;
        let v9 = skill.GetLevel() * 0.1 + v8;
        let Level = skill.GetLevel();
        let v7 = norm(Level / 14.9) * 0.03;
        let v10 = (Level - 15) * v7 + v9;
        let v11 = skill.GetT1() * 0.01 + v10;
        skill.SetRatio(v11);
        let v4 = skill.GetT1() <= 0 ? 0.0 : (10 * skill.GetT1() + 133);
        skill.SetPlus(v4 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(2);
        let Res2 = player.GetRes2();
        player.SetVar2(Res2);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT2() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT2() <= 0 ? 0.0 : (21 * skill.GetT2() + 324);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(3);
        let Res3 = player.GetRes3();
        player.SetVar3(Res3);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT3() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT3() <= 0 ? 0.0 : (33 * skill.GetT3() + 1043);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(4);
        let Res1 = player.GetRes1();
        player.SetVar4(Res1);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT4() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT4() <= 0 ? 0.0 : (32 * skill.GetT4() + 1543);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetClearbuff(45, 1)
            player.SetIncfatalhurt(120, 0.15 * skill.GetLevel(), 10100, 2)
            player.SetSubhp(120, player.GetMaxhp() * 0.2, player.GetMaxhp() * 0.1, 10100, 2)
        }

        super.StateAttack(stub, skill, originFunc);

        if (player.GetTypeIsMob()) {
            let dmg = player.GetVar5() * 5
            if (dmg > player.GetVar6()) {
                dmg = player.GetVar6()
            }

            player.SetDirecthurt(120, dmg)
        }

        return true
    }
}

/**
 * 3086
 * <煞>：增加自身技能伤害15%。
 *
 */
class Skill3086 extends BaseHookSkillStub {

    constructor() {
        super(3086);
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
        const player = skill.GetPlayerNice()
        player.SetVar1(1);
        let v8 = skill.GetT0() * 0.02 + 1.02;
        let v9 = skill.GetLevel() * 0.1 + v8;
        let Level = skill.GetLevel();
        let v7 = norm(Level / 14.9) * 0.03;
        let v10 = (Level - 15) * v7 + v9;
        let v11 = skill.GetT1() * 0.01 + v10;
        skill.SetRatio(v11);
        let v4 = skill.GetT1() <= 0 ? 0.0 : (10 * skill.GetT1() + 133);
        skill.SetPlus(v4 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(2);
        let Res2 = player.GetRes2();
        player.SetVar2(Res2);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT2() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT2() <= 0 ? 0.0 : (21 * skill.GetT2() + 324);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(3);
        let Res3 = player.GetRes3();
        player.SetVar3(Res3);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT3() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT3() <= 0 ? 0.0 : (33 * skill.GetT3() + 1043);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(4);
        let Res1 = player.GetRes1();
        player.SetVar4(Res1);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT4() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT4() <= 0 ? 0.0 : (32 * skill.GetT4() + 1543);
        skill.SetPlus(v7 + player.GetHp() * 0.1);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetIncskilldamage(0.15, 10100, 2)
        }

        return super.BlessMe(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetClearbuff(45, 1)
            player.SetIncfatalhurt(120, 0.15 * skill.GetLevel(), 10100, 2)
        }

        super.StateAttack(stub, skill, originFunc);

        if (player.GetTypeIsMob()) {
            let dmg = player.GetVar5() * 5
            if (dmg > player.GetVar6()) {
                dmg = player.GetVar6()
            }

            player.SetDirecthurt(120, dmg)
        }

        return true
    }

}

/**
 * 3134
 * <禅>：附加真气上限8%攻击力
 */
class Skill3134 extends BaseHookSkillStub {

    constructor() {
        super(3134);
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
        const player = skill.GetPlayerNice()
        player.SetVar1(1);
        let v8 = skill.GetT0() * 0.02 + 1.02;
        let v9 = skill.GetLevel() * 0.1 + v8;
        let Level = skill.GetLevel();
        let v7 = norm(Level / 14.9) * 0.03;
        let v10 = (Level - 15) * v7 + v9;
        let v11 = skill.GetT1() * 0.01 + v10;
        skill.SetRatio(v11);
        let v4 = skill.GetT1() <= 0 ? 0.0 : (10 * skill.GetT1() + 133);
        skill.SetPlus(v4 + player.GetHp() * 0.1 + player.GetMaxmp() * 0.08);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(2);
        let Res2 = player.GetRes2();
        player.SetVar2(Res2);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT2() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT2() <= 0 ? 0.0 : (21 * skill.GetT2() + 324);
        skill.SetPlus(v7 + player.GetHp() * 0.1 + player.GetMaxmp() * 0.08);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(3);
        let Res3 = player.GetRes3();
        player.SetVar3(Res3);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT3() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT3() <= 0 ? 0.0 : (33 * skill.GetT3() + 1043);
        skill.SetPlus(v7 + player.GetHp() * 0.1 + player.GetMaxmp() * 0.08);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(4);
        let Res1 = player.GetRes1();
        player.SetVar4(Res1);
        let v11 = skill.GetT0() * 0.02 + 1.02;
        let v12 = skill.GetLevel() * 0.1 + v11;
        let Level = skill.GetLevel();
        let v10 = norm(Level / 14.9) * 0.03;
        let v13 = (Level - 15) * v10 + v12;
        let v14 = skill.GetT4() * 0.01 + v13;
        skill.SetRatio(v14);
        let v7 = skill.GetT4() <= 0 ? 0.0 : (32 * skill.GetT4() + 1543);
        skill.SetPlus(v7 + player.GetHp() * 0.1 + player.GetMaxmp() * 0.08);
        // 攻击怪物目标时，额外附加自身气血真气上限和10%的攻击力，自身防御10倍攻击力
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetClearbuff(45, 1)
            player.SetIncfatalhurt(120, 0.15 * skill.GetLevel(), 10100, 2)
            player.SetSubhp(120, player.GetMaxhp() * 0.2, player.GetMaxhp() * 0.1, 10100, 2)
        }

        super.StateAttack(stub, skill, originFunc);

        if (player.GetTypeIsMob()) {
            let dmg = player.GetVar5() * 5
            if (dmg > player.GetVar6()) {
                dmg = player.GetVar6()
            }

            player.SetDirecthurt(120, dmg)
        }

        return true
    }

}

/**
 * 3039  蚩魂<玄>
 * 蚩魂<玄><煞><禅>：
 * 气血及攻击百分比提高至40%，
 * 增加自身减免伤害百分比15%，可减免受到部分附加额外伤害40%，持续20秒
 */
class Skill3039 extends BaseHookSkillStub {

    constructor() {
        super(3039);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = 2000 * skill.GetLevel() + 10000;
        let ta = skill.GetLevel() * 0.02
        player.SetChihun(120, t, ta, ta, 1);

        const p = 5 * skill.GetLevel();
        const tt = 1000 * skill.GetLevel() + 2050;
        player.SetAttack2hp(p, tt, skill.GetLevel() * 0.02);

        player.SetImmunetaune(111, 10000);

        player.SetSlant(111, 20000, 0.4);
        player.SetUltimateDamageReduction(120, 20000, 0.05, 1, 1)
        return true
    }

}

/**
 * 3087
 * 蚩魂<玄><煞><禅>：
 * 气血及攻击百分比提高至40%，
 * 增加自身减免伤害百分比15%，可减免受到部分附加额外伤害40%，持续20秒
 */
class Skill3087 extends BaseHookSkillStub {

    constructor() {
        super(3087);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = 2000 * skill.GetLevel() + 10000;
        let ta = skill.GetLevel() * 0.02
        player.SetChihun(120, t, ta, ta, 1);

        let tt = 1000 * skill.GetLevel() + 2000;
        let tb = player.GetRes2() * 0.05;
        tb = skill.GetLevel() * tb;
        player.SetValue(tb);
        player.SetFrenzied(120, 1.0, tb, skill.GetLevel(), tt);

        player.SetImmunetaune(111, 10000);

        player.SetSlant(111, 20000, 0.4);
        player.SetUltimateDamageReduction(120, 20000, 0.05, 1, 1)

        return true
    }

}

/**
 * 3135
 *
 */
class Skill3135 extends BaseHookSkillStub {

    constructor() {
        super(3135);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = 2000 * skill.GetLevel() + 10000;
        let ta = skill.GetLevel() * 0.02
        player.SetChihun(120, t, ta, ta, 1);

        let tb = 5 * skill.GetLevel();
        player.SetAttack2mp(tb, skill.GetLevel() * 0.01, 1000 * skill.GetLevel() + 2000);

        player.SetImmunetaune(111, 10000);

        player.SetSlant(111, 20000, 0.4);
        player.SetUltimateDamageReduction(120, 20000, 0.05, 1, 1)

        return true
    }

}

/**
 * 5857 蚩魂III
 * 气血及攻击百分比提高至40%，增加自身减免伤害百分比15%，可减免受到部分附加额外伤害40%，持续20秒
 * 6907玄烛·鏖战·曦日：技能达到5级时，额外增加蚩魂III持续时间6秒
 */
class Skill5857 extends BaseHookSkillStub {

    constructor() {
        super(5857);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        player.SetUltimateDamageReduction(120, 20000, 0.05, 1, 1)
        player.SetSlant(120, 20000 + xrTime, 0.4)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        let t = 5000 * skill.GetLevel() + 35000;
        player.SetChihun(120, t + xrTime, 0.4, 0.4, 1);

        player.SetIncskilldamage(0.1, 10100, 1);

        let ta = 2000 * skill.GetLevel() + 8000;
        player.SetImmunetaune(120, ta + xrTime);
        return true
    }

}

/**
 * 5858
 *
 */
class Skill5858 extends BaseHookSkillStub {

    constructor() {
        super(5858);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        player.SetDispel(100, 4262, 4263, 4264);
        player.SetDispel(100, 4265, 4265, 4265);

        let ta = 2000 * skill.GetLevel() + 8000;
        player.SetImmunetaune(120, ta + xrTime);

        player.SetUltimateDamageReduction(120, 20000, 0.05, 1, 1)
        player.SetSlant(120, 20000 + xrTime, 0.4)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        let t = 5000 * skill.GetLevel() + 35000;
        player.SetChihun(120, t + xrTime, 0.4, 0.4, 1);

        player.SetDispel(100, 24, 25, 26);
        player.SetDispel(100, 27, 28, 4126);
        player.SetDispel(100, 94, 4260, 4261);

        return true
    }
}

/**
 * 5859
 * 地：前15秒额外附加神佑，免疫30次伤害；提高自身气血比例200%
 */
class Skill5859 extends BaseHookSkillStub {

    constructor() {
        super(5859);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        player.SetUltimateDamageReduction(120, 20000, 0.05, 1, 1)
        player.SetSlant(120, 20000 + xrTime, 0.4)
        player.SetBlessed(120, 15000)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        let t = 5000 * skill.GetLevel() + 35000;
        player.SetChihun(120, t + xrTime, 0.4, 2.0, 1);

        let ta = 2000 * skill.GetLevel() + 8000;
        player.SetImmunetaune(120, ta + xrTime);
        return true
    }
}

/**
 * 5860
 *
 */
class Skill5860 extends BaseHookSkillStub {

    constructor() {
        super(5860);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        player.SetUltimateDamageReduction(120, 20000, 0.05, 1, 1)
        player.SetSlant(120, 20000 + xrTime, 0.4)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let xrTime = 0
        if (player.GetSkilllevel(6907) >= 5) {
            xrTime = 6000
        }

        let t = 5000 * skill.GetLevel() + 35000;
        player.SetChihun(120, t + xrTime, 0.4, 0.4, 1);

        player.SetAddspeed(100, 12100, 5.0, 9);

        let ta = 2000 * skill.GetLevel() + 8000;
        player.SetImmunetaune(120, ta + xrTime);
        return true
    }
}

/**
 * 5771  八肱III
 * 施法1秒，攻击8次，
 * 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
 * 每一击令目标受到的被暴击率增加15%
 * 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
 */
class Skill5771 extends BaseHookSkillStub {

    constructor() {
        super(5771);
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

        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v11 = player.GetRes1() + v9;

        player.SetVar3(v11);
        player.SetVar1(1);
        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v24 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v24);

        const v25 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v25);

        const v20 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v20);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v11 = player.GetRes1() + v9;

        player.SetVar3(v11);
        player.SetVar1(2);
        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v24 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v24);

        const v25 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v25);

        const v20 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v20);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v11 = player.GetRes1() + v9;

        player.SetVar3(v11);
        player.SetVar1(3);
        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v24 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v24);

        const v25 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v25);

        const v20 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v20);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v11 = player.GetRes1() + v9;

        player.SetVar3(v11);
        player.SetVar1(4);
        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v24 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v24);

        const v25 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v25);

        const v20 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v20);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        // 每一击令目标受到的被暴击率增加15%
        player.SetIncfatalratio(120, 0.15, 5000, player.GetVar1())

        if (player.GetTypeIsMob()) {
            let dmg = player.GetVar5() * 10
            if (dmg > player.GetVar6()) {
                dmg = player.GetVar6()
            }

            player.SetDirecthurt(120, dmg)
        }

        return true
    }
}

/**
 * 5772
 * 海：每一击在6秒内降低目标气血上限为自身当前气血的10%；最多降至20%
 */
class Skill5772 extends BaseHookSkillStub {

    constructor() {
        super(5772);
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
        player.SetVar3(Hp);
        player.SetVar1(1);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Hp = player.GetHp();
        player.SetVar3(Hp);
        player.SetVar1(2);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Hp = player.GetHp();
        player.SetVar3(Hp);
        player.SetVar1(3);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Hp = player.GetHp();
        player.SetVar3(Hp);
        player.SetVar1(4);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        // 每一击令目标受到的被暴击率增加15%
        player.SetIncfatalratio(120, 0.15, 5000, player.GetVar1())

        let v3;
        if (player.GetVar1() == 1) {
            v3 = 120;
        } else {
            v3 = 0;
        }

        const d = skill.GetLevel() * 0.2 + 0.2;
        const da = skill.GetLevel() * 0.2 + 0.2;
        player.SetRandcurse(v3, d, da, 4100);

        const Var1 = player.GetVar1();
        const db = player.GetVar3() * 0.1;
        player.SetSubhp(100, db, player.GetMaxhp() * 0.2, 6100, Var1);

        if (player.GetTypeIsMob()) {
            let dmg = player.GetVar5() * 10
            if (dmg > player.GetVar6()) {
                dmg = player.GetVar6()
            }

            player.SetDirecthurt(120, dmg)
        }

        return true
    }
}

/**
 * 5773
 * 地：每一击令目标伤害加深调整为15%自身气血
 */
class Skill5773 extends BaseHookSkillStub {

    constructor() {
        super(5773);
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
        player.SetVar3(Hp);
        player.SetVar1(1);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Hp = player.GetHp();
        player.SetVar3(Hp);
        player.SetVar1(2);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Hp = player.GetHp();
        player.SetVar3(Hp);
        player.SetVar1(3);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Hp = player.GetHp();
        player.SetVar3(Hp);
        player.SetVar1(4);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        // 每一击令目标受到的被暴击率增加15%
        player.SetIncfatalratio(120, 0.15, 5000, player.GetVar1())

        let v3;
        if (player.GetVar1() == 1) {
            v3 = 120;
        } else {
            v3 = 0;
        }

        const d = skill.GetLevel() * 0.2 + 0.2;
        const da = skill.GetLevel() * 0.2 + 0.2;
        player.SetRandcurse(v3, d, da, 4100);

        const db = player.GetVar3() * 0.15;
        player.SetCursed(db, 1, 2100);

        if (player.GetTypeIsMob()) {
            let dmg = player.GetVar5() * 10
            if (dmg > player.GetVar6()) {
                dmg = player.GetVar6()
            }

            player.SetDirecthurt(120, dmg)
        }

        return true
    }
}

/**
 * 5774
 *
 */
class Skill5774 extends BaseHookSkillStub {

    constructor() {
        super(5774);
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

        const res1 = player.GetRes1();
        player.SetVar3(res1);
        player.SetVar1(1);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const res1 = player.GetRes1();
        player.SetVar3(res1);
        player.SetVar1(2);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const res1 = player.GetRes1();
        player.SetVar3(res1);
        player.SetVar1(3);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const res1 = player.GetRes1();
        player.SetVar3(res1);
        player.SetVar1(4);

        const Level = player.GetLevel();
        player.SetVar2(Level);

        const v16 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v16);

        const v17 = (5 * skill.GetLevel() + 10) * 0.01;
        skill.SetCrithurt(v17);

        const v12 = Math.floor((2 * (skill.GetLevel() + 2)) * 0.01);
        skill.SetSkillaccu(v12);

        skill.SetRatio(skill.GetLevel() * 0.8);

        const v21 = 1000 * skill.GetLevel() + 6000;
        skill.SetPlus(v21 + player.GetHp() * 0.15);
        // 附加本体攻击力调整为240%，额外附加自身当前气血10%的攻击力，
        // 攻击怪物目标时，无冷却且额外附加自身气血真气上限和15%的攻击力，自身防御20倍攻击力
        const v22 = player.GetHp() * 0.05 + player.GetMaxHPAndMP() * 0.15
        skill.SetMobBonusDamage(v22);
        player.SetVar5(player.GetDef())
        player.SetVar6(player.GetMaxhp())

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        // 每一击令目标受到的被暴击率增加15%
        player.SetIncfatalratio(120, 0.15, 5000, player.GetVar1())

        if (player.GetTypeIsMob()) {
            let dmg = player.GetVar5() * 10
            if (dmg > player.GetVar6()) {
                dmg = player.GetVar6()
            }

            player.SetDirecthurt(120, dmg)
        }
        return true
    }
}

/**
 * 6898  赤乌·虎啸·曦日
 * 冷却45秒，
 * 令自身12秒内无视单体攻击；6秒内大幅增加移动速度，并驱散自身麻痹效果；
 * 令目标虚弱，虚弱能力为自身虚抗加120，并进入随机不利状态6秒；封禁目标3个技能12秒。
 */
class Skill6898 extends BaseHookSkillStub {

    constructor() {
        super(6898);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 45000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        //令自身12秒内无视单体攻击；6秒内大幅增加移动速度，并驱散自身麻痹效果；
        player.SetAddspeed(100, 6100, 4.0, 7);
        player.SetDispel(100, 4203, 4203, 4203);

        const d = skill.GetLevel() * 20.0;
        player.SetDispel(d, 115, 115, 115);

        const level = skill.GetLevel();
        const v17 = 8 * (level + 5);
        const da = v17 + 20 * Math.floor(level / 5);
        player.SetSingleTargetImmune(da, 12100,1.0);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        // 令目标虚弱，虚弱能力为自身虚抗加120，并进入随机不利状态6秒；封禁目标3个技能12秒。
        player.SetWeak(player.GetVar1() + 120, 10100, skill.GetLevel() * 0.19, 9)
        player.SetCurses(2, 1, 6100, 1, 9)
        player.SetFenggong(120, 12000, 3)
        return true
    }
}

class FeiShengSkill extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            2245, 2249, 2657, 2673, 3817, 4601,//血魂震
            2247, 2251, 2659, 2675, 3819, 4603,//天雷落
            2248, 2252, 2660, 2676, 3820, 4604,//斗神祭
            2246, 2250, 2658, 2674, 3818, 4602//鬼斧袭
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

}

/**
 */
export class JiuLiSkillList {
    constructor() {
        new Skill1853()
        new Skill1844()
        new Skill1875()
        new Skill1879()
        new Skill1869()
        new Skill1855()
        new Skill1881()
        new Skill1858()
        new Skill1866()
        new Skill1871()
        new Skill1848()
        new Skill1851()
        new Skill1876()
        new Skill1873()
        new Skill2228()
        new Skill2229()
        new Skill2217()
        new Skill2216()
        new Skill2219()
        new Skill2218()
        new Skill2235()
        new ShiFa1S()
        new Skill3037()
        new Skill3085()
        new Skill3133()
        new Skill3038()
        new Skill3086()
        new Skill3134()
        new Skill3039()
        new Skill3087()
        new Skill3135()
        new Skill5857()
        new Skill5858()
        new Skill5859()
        new Skill5860()
        new Skill5771()
        new Skill5772()
        new Skill5773()
        new Skill5774()
        new Skill6898()
        new FeiShengSkill()
    }
}