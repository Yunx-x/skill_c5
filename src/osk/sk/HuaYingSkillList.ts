import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";
import {HookFuncCore} from "../../base/HookFuncCore";
import {SPlayer} from "../../base/skill/SPlayer";


//心斋：所有心斋效果都会将气血固定为1点
//心斋效果函数中实现降血1点，

/**
 * 行意
 * 所有行意效果的叠加上限改为10层
 */
function XingYi10Ceng() {
    //行意全部替换叠加最大10层
    const xingYiFuncName = "_ZN4GNET13PlayerWrapper12SetFiveElemsEb"
    const address = HookFuncCore.getFuncAddress(xingYiFuncName);
    Interceptor.replace(address,
        new NativeCallback((p: NativePointer, b: number) => {
                const originFunc = HookFuncCore.getNativeFunc(xingYiFuncName,
                    'bool', ['pointer', 'bool'])
                const player = new SPlayer(p)
                player.SetValue(10)
                return originFunc(p, b);
            },
            'bool',
            ['pointer', 'bool']
        ));

}

/**
 * 7272  游意飞白
 * 100%为自身恢复5点神息
 */
class Skill7272 extends BaseHookSkillStub {

    constructor() {
        super(7272);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const v3 = 3000 * skill.GetLevel() + 2100;
        const t = v3 + 3000 * skill.GetT0();
        const ta = skill.GetLevel() * 0.5 + 2.7;
        player.SetAddspeed(100, t, ta, 1);

        player.SetAddSyliaOrb(100, 5);
        return true
    }

}

/**
 * 7299  大衍化形
 * 无冷却。对非玩家目标额外附加自身真气上限10%的攻击力
 */
class Skill7299 extends BaseHookSkillStub {

    constructor() {
        super(7299);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v26 = (Math.floor(skill.GetLevel() * 0.05) + 1.0);
        skill.SetRatio(v26);
        const v19 = (105 * skill.GetLevel() + 197);
        const player = skill.GetPlayerNice();
        const v18 = (Math.floor(player.GetMaxatk() * 0.02));
        const v27 = (skill.GetT2() * v18 + v19);
        skill.SetPlus(v27);
        const v28 = (skill.GetT1() * 0.02);
        skill.SetCrit(v28);
        let moral_bon = 0;
        if (player.GetHasbuff(9406)) {
            const Level = player.GetLevel();
            const v20 = (Math.floor(Level / 30) * 0.001);
            const v21 = (player.GetSkilllevel(7595) * v20);
            moral_bon = Math.floor(player.GetHp() * v21);
            const v22 = (player.GetSkilllevel(7595) * 0.002);
            const Skilllevel = player.GetSkilllevel(7281);
            const v12 = player.GetSkilllevel(7290) + Skilllevel;
            const v29 = (v12 + player.GetSkilllevel(7299)) * v22;
            skill.SetMobCrithurt(v29);
        }
        const v15 = player.GetLevel();
        const v23 = Math.floor(v15 / 15);
        const v24 = ((skill.GetT3() * 0.01 + 0.03) * v23);
        const v25 = (player.GetMaxatk() * v24);
        skill.SetMobBonusDamage(Math.floor(v25) + moral_bon + player.GetMaxmp() * 0.1);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v26 = (Math.floor(skill.GetLevel() * 0.05) + 1.0);
        skill.SetRatio(v26);
        const v19 = (105 * skill.GetLevel() + 197);
        const player = skill.GetPlayerNice();
        const v18 = (Math.floor(player.GetMaxatk() * 0.02));
        const v27 = (Math.floor(skill.GetT2() * v18) + v19);
        skill.SetPlus(v27);
        const v28 = (Math.floor(skill.GetT1() * 0.02));
        skill.SetCrit(v28);
        let moral_bon = 0;
        if (player.GetHasbuff(9406)) {
            const Level = player.GetLevel();
            const v20 = (Math.floor(Level / 30) * 0.001);
            const v21 = (player.GetSkilllevel(7595) * v20);
            moral_bon = Math.floor(player.GetHp() * v21);
            const v22 = (player.GetSkilllevel(7595) * 0.002);
            const Skilllevel = player.GetSkilllevel(7281);
            const v12 = player.GetSkilllevel(7290) + Skilllevel;
            const v29 = ((v12 + player.GetSkilllevel(7299)) * v22);
            skill.SetMobCrithurt(v29);
        }
        const v15 = player.GetLevel();
        const v23 = Math.floor(v15 / 15);
        const v24 = (((skill.GetT3() * 0.01) + 0.03) * v23);
        const v25 = (player.GetMaxatk() * v24);
        skill.SetMobBonusDamage(Math.floor(v25) + moral_bon + player.GetMaxmp() * 0.1);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v26 = (Math.floor(skill.GetLevel() * 0.05) + 1.0);
        skill.SetRatio(v26);
        const v19 = (105 * skill.GetLevel() + 197);
        const player = skill.GetPlayerNice();
        const v18 = (Math.floor(player.GetMaxatk() * 0.02));
        const v27 = (Math.floor(skill.GetT2() * v18) + v19);
        skill.SetPlus(v27);
        const v28 = (Math.floor(skill.GetT1() * 0.02));
        skill.SetCrit(v28);
        let moral_bon = 0;

        if (player.GetHasbuff(9406)) {
            const Level = player.GetLevel();
            const v20 = (Math.floor(Level / 30) * 0.001);

            const v21 = (player.GetSkilllevel(7595) * v20);

            moral_bon = Math.floor(player.GetHp() * v21);

            const v22 = (player.GetSkilllevel(7595) * 0.002);

            const Skilllevel = player.GetSkilllevel(7281);

            const v12 = player.GetSkilllevel(7290) + Skilllevel;

            const v29 = (v12 + player.GetSkilllevel(7299)) * v22;
            skill.SetMobCrithurt(v29);
        }
        const v15 = player.GetLevel();
        const v23 = Math.floor(v15 / 15);
        const v24 = ((skill.GetT3() * 0.01 + 0.03) * v23);
        const v25 = player.GetMaxatk() * v24;
        skill.SetMobBonusDamage(Math.floor(v25) + moral_bon + player.GetMaxmp() * 0.1);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v26 = (Math.floor(skill.GetLevel() * 0.05) + 1.0);
        skill.SetRatio(v26);
        const v19 = (105 * skill.GetLevel() + 197);
        const player = skill.GetPlayerNice();
        const v18 = (Math.floor(player.GetMaxatk() * 0.02));
        const v27 = (Math.floor(skill.GetT2() * v18) + v19);
        skill.SetPlus(v27);
        const v28 = (Math.floor(skill.GetT1() * 0.02));
        skill.SetCrit(v28);
        let moral_bon = 0;

        if (player.GetHasbuff(9406)) {
            const Level = player.GetLevel();
            const v20 = (Math.floor(Level / 30) * 0.001);

            const v21 = (player.GetSkilllevel(7595) * v20);

            moral_bon = Math.floor(player.GetHp() * v21);

            const v22 = (player.GetSkilllevel(7595) * 0.002);

            const Skilllevel = player.GetSkilllevel(7281);

            const v12 = player.GetSkilllevel(7290) + Skilllevel;

            const v29 = (v12 + player.GetSkilllevel(7299)) * v22;
            skill.SetMobCrithurt(v29);
        }
        const v15 = player.GetLevel();
        const v23 = Math.floor(v15 / 15);
        const v24 = ((skill.GetT3() * 0.01 + 0.03) * v23);
        const v25 = player.GetMaxatk() * v24;
        skill.SetMobBonusDamage(Math.floor(v25) + moral_bon + player.GetMaxmp() * 0.1);
        player.SetPerform(0);
    }
}

/**
 * 7303  有无相生
 * 冷却减少40秒
 */
class Skill7303 extends BaseHookSkillStub {

    constructor() {
        super(7303);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 40000;
    }
}

/**
 * 7283  逸然绝凡
 * 冷却时间减少15秒
 */
class Skill7283 extends BaseHookSkillStub {

    constructor() {
        super(7283);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

}

/**
 * 7288  瑶朵傲霜
 * 施法 1 秒，冷却时间减少20秒，额外解除自身 5 个不利状态
 * 7323天书-德满坤：治疗技能施法后，提供免疫群攻的几率调整为100%，持续时间调整为10秒
 */
class Skill7288 extends BaseHookSkillStub {

    constructor() {
        super(7288);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const d = 3 * skill.GetT3();
        const player = skill.GetPlayerNice();
        player.SetAddSyliaOrb(d, 1);

        const da = 40 * skill.GetT4();
        const db = 3000 * skill.GetT4() + 1100;
        player.SetAoEImmune(da, db,);

        player.SetCleardebuff(120, 5)
        return true
    }

}

/**
 * 7297  蕙质兰心
 * 施法时间1秒，冷却时间减少20秒
 * 7323天书-德满坤：治疗技能施法后，提供免疫群攻的几率调整为100%，持续时间调整为10秒
 */
class Skill7297 extends BaseHookSkillStub {

    constructor() {
        super(7297);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const d = 3 * skill.GetT3();
        const player = skill.GetPlayerNice();
        player.SetAddSyliaOrb(d, 1);

        const da = 40 * skill.GetT4();
        const db = 3000 * skill.GetT4() + 1100;
        player.SetAoEImmune(da, db);

        return true
    }
}

/**
 * 7275  引蝶入梦
 * 100%为目标附加4层行意，持续15秒；若目标为怪物时，持续时间30秒
 */
class Skill7275 extends BaseHookSkillStub {

    constructor() {
        super(7275);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        let time = 15000
        if (player.GetTypeIsMob()) {
            time = 30000
        }

        player.SetFiveElems(100, time, 10, 4)
        return true
    }

}

/**
 * 7581  妙致毫巅
 * 施法时间调整为 1 秒，冷却120秒
 * 移除施法者性别限制，
 * 急速治疗友方，
 * 为自身及友方单位提供 10 秒“心斋”效果，
 * 自身每 50 万气血上限“心斋”效果持续时间额外延长 1 秒，最多延长 3秒
 */
class Skill7581 extends BaseHookSkillStub {

    constructor() {
        super(7581);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
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
        let exbur = 5000;
        let abon = 1.2;
        let exch = 30;
        const player = skill.GetPlayerNice();
        let Var1 = player.GetVar1();

        let hpTime = Math.floor(Var1 / 500000)
        if (hpTime > 5) {
            hpTime = 5
        }

        player.SetAbstain(100, 10100 + hpTime * 1000, 0);
        player.SetHp(1)

        let ta = Math.floor(Var1 + player.GetVar2()) * 0.3;
        player.SetHeal(100, ta, 0.0);

        let tb = exbur + 15100;
        let tc = exch + 5;
        let Var3 = player.GetVar3();
        let td = Math.floor(Var3 + player.GetVar4()) * abon;
        player.SetHpgen2(100, td, 0, tb, 0, tc);
        return true
    }

}

/**
 * 7270  凌寒拂霜
 * 冷却时间减少20秒
 * 自身每有 40 万真气上限，提升2%*level友方目标对非玩家目标伤害
 * 7311天书-傲霜寒令\"凌寒拂霜\"技能增伤效果时间延长的概率调整为100%,每级增加3秒
 */
class Skill7270 extends BaseHookSkillStub {

    constructor() {
        super(7270);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(Math.floor(player.GetMaxmp() / 400000))
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let t = 3000 * skill.GetT0() + 20000;
        let ta = skill.GetLevel() * 0.03 + skill.GetT0() * 0.03 + player.GetVar1() * 0.02;
        player.SetIncMobDmg(100, t, ta, 1);
        return true
    }
}

/**
 * 7269  朔风解意
 * 冷却60 秒，为自身恢复神息值 5 点，新增效果：重置自身所有五行技能冷却
 * 天书-迷悟同：自身60秒内致命一击率提升5%*level，致命一击伤害提升8%*level。5秒*level内施法时间减少15%*level
 */
class Skill7269 extends BaseHookSkillStub {

    constructor() {
        super(7269);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetAddSyliaOrb(120, 5)
        player.SetClearcooldown(7277, 7286, 7295)
        player.SetClearcooldown(7304, 7308, 7516)
        player.SetClearcooldown(7593, 7626, 7627)
        player.SetClearcooldown(7628, 7608, 7612)
        player.SetClearcooldown(7616, 7619, 7620)
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let d = skill.GetLevel() * 0.02;
        player.SetIncattack(100, 600000, d, 0);
        if (skill.GetT0() > 0) {
            let da = skill.GetT0() * 0.03;
            player.SetInccritrate(60000, da, 0);
            player.SetInccrithurt(120, skill.GetT0() * 0.08, 60000, 1);
            player.SetSwift(120, 5000 * skill.GetT0(), 0.15 * skill.GetT0(), 0);
        }

        return true
    }

}

/**
 * 7273  心无挂碍
 * 冷却时间减少20秒，
 * 新增效果：施法后自身免疫不利状态（玉册），持续10秒，
 * 若施法者为佛阵营，则免疫不利状态时间翻倍
 */
class Skill7273 extends BaseHookSkillStub {

    constructor() {
        super(7273);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 70000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 2000 * skill.GetLevel() + 3100;
        const ta = skill.GetT0();
        player.SetAbstain(100, t, ta);

        if (player.GetCultivation() == 4) {
            player.SetTurndebuff(20000, 1, 1)
        } else {
            player.SetTurndebuff(10000, 1, 1)
        }
        return true
    }

}

/**
 * 7301  入静通玄
 * 冷却减少20秒，自身祝福，不再消耗神息，直接5层效果
 */
class Skill7301 extends BaseHookSkillStub {

    constructor() {
        super(7301);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetBlessed(45, 35100);

        let invincibleTime=10000
        if (player.GetCultivation()==4){
            invincibleTime=5000
        }

        const t = 1000 * skill.GetT0() + invincibleTime;
        player.SetInvincible(t);
        return true
    }

}

/**
 * 7285  妄心寂灭
 * 冷却减少10秒
 */
class Skill7285 extends BaseHookSkillStub {

    constructor() {
        super(7285);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

/**
 * 7294  阴阳离诀
 *
 */
class Skill7294 extends BaseHookSkillStub {

    constructor() {
        super(7294);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }
}

/**
 * 7342  分元均
 * 施法0.5秒
 *
 * 7634玄烛·分元均·曦日：10秒内气血上限提升18%
 */
class Skill7342 extends BaseHookSkillStub {

    constructor() {
        super(7342);
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(7634) > 0) {
            player.SetInchp(0.18, 10000, 4)
        }

        return true
    }
}

/**
 * 7291  生死尘劫
 * 施法0.5秒
 *
 * 清逸II：被动新增 生死尘劫 技能冷却额外减少 1.5level 秒；
 */
class Skill7291 extends BaseHookSkillStub {

    constructor() {
        super(7291);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const lv = player.GetSkilllevel(7599)
        return 75000 - lv * 1500
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
 * 7282  韶光流转
 * 反隐时间延长为6秒
 */
class Skill7282 extends BaseHookSkillStub {

    constructor() {
        super(7282);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetDodge(5000, 15);

        let v8 = 2 * skill.GetLevel();
        let d = v8 + skill.GetT0();
        player.SetAddspot(100, d, 6100, 2);
        return true
    }
}

/**
 * 7584  取象无惑
 * 冷却时间调整为65秒
 */
class Skill7584 extends BaseHookSkillStub {

    constructor() {
        super(7584);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 65000
    }

}

/**
 * 7582  绝迹天机
 * 冷却时间调整为 120秒
 * 施法者每获得一点神息值，可增加的致命一击率和技能命中3点
 */
class Skill7582 extends BaseHookSkillStub {

    constructor() {
        super(7582);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let inc = player.GetSyliaOrb() * 0.01;
        player.SetPasinccrit(inc);
        let inca = 30 * player.GetSyliaOrb();
        player.SetPasincskillaccu(inca);
        return true
    }
}

/**
 * 7298  正声雅音
 * 2%*level概率令其派技能的级别在15秒内提升1级，法阵维持时间10分钟
 */
class Skill7298 extends BaseHookSkillStub {

    constructor() {
        super(7298);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetHolyaura(600000, 18)
        return true
    }

}

/**
 * 7589  引蝶入梦II
 * 每一击附加的行意效果改为2层
 */
class Skill7589 extends BaseHookSkillStub {

    constructor() {
        super(7589);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const d = 10 * skill.GetLevel();
        const player = skill.GetVictimNice();
        player.SetFiveElems(d, 15100, 10, 2);

        const da = 100 * player.GetVar1();
        player.SetDecCultRes(da, 8100, 0.05, 0, 0);
        return true
    }

}

/**
 * 7304  金风玉露
 * 五行技能
 * 7590凝思II：技能到达10级时减少五行技能冷却时间由5秒提高至10秒
 */
class Skill7304 extends BaseHookSkillStub {

    constructor() {
        super(7304);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const v2 = -3000 * skill.GetT1() + 36000;
        const T6 = Math.floor(skill.GetT6() / 10);
        return v2 - 10000 * T6;
    }

}

/**
 * 7277  松风逐雪
 * 五行技能
 * 7590凝思II：技能到达10级时减少五行技能冷却时间10秒
 */
class Skill7277 extends BaseHookSkillStub {

    constructor() {
        super(7277);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const v2 = -3000 * skill.GetT1() + 36000;
        const T6 = Math.floor(skill.GetT6() / 10);
        return v2 - 10000 * T6;
    }

}

/**
 * 7308  浩渺无极
 * 五行技能
 * 7590凝思II：技能到达10级时减少五行技能冷却时间由5秒提高至10秒
 *
 * 浩渺无极：水系出现极效概率额外增加5%
 */
class Skill7308 extends BaseHookSkillStub {

    constructor() {
        super(7308);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const v2 = -3000 * skill.GetT1() + 36000;
        const T6 = Math.floor(skill.GetT6() / 10);
        return v2 - 10000 * T6;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar(1) === 1) {//第一段时触发水系效果
            player.SetFrozen(50, 0, 3100, 0);//冰封

            if (skill.GetT5()) {//7284 凝思。^ffffff每次施展^11ff11门派五行技能^ffffff攻击目标时，都有^ffcb4a%d%%^ffffff几率为目标附加^11ff11行意^ffffff效果。"
                const v8 = skill.GetT5() + 1;
                const d = v8 + skill.GetT6();//7590 凝思II。^ffffff施展^11ff11门派五行技能^ffffff攻击目标附加^11ff11行意^ffffff效果概率提升^ffcb4a%d%%^ffffff
                player.SetFiveElems(d, 15100, 3, 1);//增加行意
            }
        }

        let bon2 = 0.0;
        if (skill.GetT0() > 0) {//淼涯极.^11ff11浩渺无极^ffffff最终伤害在基础伤害的^ffcb4a%d%%^ffffff到^ffcb4a%d%%^ffffff之间波动。
            const v14 = 3 * skill.GetT0();
            const T0 = skill.GetT0();
            bon2 = (v14 + zrand(7 * T0)) / 100.0 + 1.0;
        }

        //7357,贯幽明.^ffffff所有^11ff11五行技能^ffffff五行伤害触发几率提升^ffcb4a%d%%^ffffff，极效伤害效果提升^ffcb4a%d%%^ffffff。
        const da = skill.GetT3() * 3.0 + 20.0;
        const Var9 = player.GetVar(9);//自身是否有某Buff，（化境姿态）
        const daModified = Var9 * player.GetVar(10) + da;//7591 化境II等级

        const ratio = skill.GetT3() * 0.05 + bon2;

        const db = player.GetVar(3);
        const dbModified = skill.GetLevel() / 1.65 * db;

        const v27 = Var9 * player.GetVar(10) + 15;
        player.SetElementDamage(daModified + 5, v27, dbModified, ratio, 3);

        //如果触发水系伤害则清除1个buff
        player.SetClearbuff(-1, 1);
        return true
    }

}

/**
 * 7295  惊尘蔽天
 * 新增效果:第一击减少目标防御力,数值为自身最大攻击力的100%,持续 30秒
 * 五行技能
 * 7590凝思II：技能到达10级时减少五行技能冷却时间由5秒提高至10秒
 */
class Skill7295 extends BaseHookSkillStub {

    constructor() {
        super(7295);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const v2 = -3000 * skill.GetT1() + 36000;
        const T6 = Math.floor(skill.GetT6() / 10);
        return v2 - 10000 * T6;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetSubdefence(120, player.GetVar3(), 30000, 1)
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 7628  赤乌·惊尘蔽天·曦日
 * 7590凝思11技能新增效果：令【赤乌·惊尘蔽天·萤炬/皓月/曦日】额外附加0.5*level%的致命一击率，
 * 且自身每 1 万真气额外附加1%的致命一击伤害，最多附加150%致命—击伤害
 *
 * 赤乌·惊尘蔽天·曦日：冷却 27 秒；
 * 一定几率令目标进入冰封/寂然效果；
 * 目标为怪物时，第一击降低目标自身最大攻击力的100%防御力，持续30秒；
 * 额外附加自身真气上限 5%*level 的攻击力
 */
class Skill7628 extends BaseHookSkillStub {

    constructor() {
        super(7628);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 27000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = player.GetSkilllevel(7590)
        skill.SetRatio(2.5);
        skill.SetCrit(0.15 + lv * 0.005);

        let hurt = 0
        if (lv > 0) {
            const tmp = Math.floor(player.GetMaxmp() / 10000) * 0.01
            if (tmp > 1.5) {
                hurt = 1.5
            } else {
                hurt = tmp
            }
            skill.SetCrithurt(hurt);
        }

        let v13 = player.GetMaxatk() * 0.1;
        let Maxhp = player.GetMaxhp();
        let v14 = (Maxhp - player.GetHp()) * 0.04 + v13;
        const orb = player.GetSyliaOrb()
        let v16 = orb * v14;
        skill.SetPlus(v16);

        let v15 = player.GetMaxatk();
        skill.SetMobBonusDamage(Math.floor(v15 + 0.05 * player.GetMaxmp()));
        skill.SetMobCrithurt(1.0);

        player.SetVar1(1);
        let Maxatk = player.GetMaxatk();
        player.SetVar3(Maxatk);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = player.GetSkilllevel(7590)
        skill.SetRatio(2.5);
        skill.SetCrit(0.15 + lv * 0.005);

        let hurt = 0
        if (lv > 0) {
            const tmp = Math.floor(player.GetMaxmp() / 10000) * 0.01
            if (tmp > 1.5) {
                hurt = 1.5
            } else {
                hurt = tmp
            }
            skill.SetCrithurt(hurt);
        }

        let v13 = player.GetMaxatk() * 0.1;
        let Maxhp = player.GetMaxhp();
        let v14 = (Maxhp - player.GetHp()) * 0.04 + v13;
        const orb = player.GetSyliaOrb()
        let v16 = orb * v14;
        skill.SetPlus(v16);

        let v15 = player.GetMaxatk();
        skill.SetMobBonusDamage(Math.floor(v15 + 0.05 * player.GetMaxmp()));
        skill.SetMobCrithurt(1.0);

        player.SetVar1(2);
        let Maxatk = player.GetMaxatk();
        player.SetVar3(Maxatk);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = player.GetSkilllevel(7590)
        skill.SetRatio(2.5);
        skill.SetCrit(0.15 + lv * 0.005);

        let hurt = 0
        if (lv > 0) {
            const tmp = Math.floor(player.GetMaxmp() / 10000) * 0.01
            if (tmp > 1.5) {
                hurt = 1.5
            } else {
                hurt = tmp
            }
            skill.SetCrithurt(hurt);
        }

        let v13 = player.GetMaxatk() * 0.1;
        let Maxhp = player.GetMaxhp();
        let v14 = (Maxhp - player.GetHp()) * 0.04 + v13;
        const orb = player.GetSyliaOrb()
        let v16 = orb * v14;
        skill.SetPlus(v16);

        let v15 = player.GetMaxatk();
        skill.SetMobBonusDamage(Math.floor(v15 + 0.05 * player.GetMaxmp()));
        skill.SetMobCrithurt(1.0);

        player.SetVar1(3);
        let Maxatk = player.GetMaxatk();
        player.SetVar3(Maxatk);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = player.GetSkilllevel(7590)
        skill.SetRatio(2.5);
        skill.SetCrit(0.15 + lv * 0.005);

        let hurt = 0
        if (lv > 0) {
            const tmp = Math.floor(player.GetMaxmp() / 10000) * 0.01
            if (tmp > 1.5) {
                hurt = 1.5
            } else {
                hurt = tmp
            }
            skill.SetCrithurt(hurt);
        }

        let v13 = player.GetMaxatk() * 0.1;
        let Maxhp = player.GetMaxhp();
        let v14 = (Maxhp - player.GetHp()) * 0.04 + v13;
        const orb = player.GetSyliaOrb()
        let v16 = orb * v14;
        skill.SetPlus(v16);

        let v15 = player.GetMaxatk();
        skill.SetMobBonusDamage(Math.floor(v15 + 0.05 * player.GetMaxmp()));
        skill.SetMobCrithurt(1.0);

        player.SetVar1(4);
        let Maxatk = player.GetMaxatk();
        player.SetVar3(Maxatk);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            const v5 = player.GetTypeIsMob() ? 30000 : 8000;
            player.SetInchurt(100, 0.8, v5);

            player.SetSubdefence(120, player.GetVar3(), 30000, 4)

            const d = Math.floor(player.GetMaxmp() * 0.7);
            player.SetMpleak(100, 8000, d, 0.0, 1);

            player.SetFiveElems(6, 15100, 10, 1);
        }

        const da = 3.5 * player.GetVar3();
        player.SetElementDamage(15, 20, da, 0.0, 5);
        player.SetDisableCrit(-1.0, 8000, 60);

        if (skill.GetIscrit()) {
            const db = 20 * skill.GetLevel();
            player.SetClearbuff(db, 1);
        }

        if (skill.GetIscrit() || skill.GetLevel() == 5) {
            let red = skill.GetLevel() * 600.0;
            let dur = 8000;
            if (skill.GetLevel() > 3) {
                red *= 1.25;
                dur = 10000;
            }

            if (skill.GetLevel() > 4) {
                red *= 1.25;
                dur += 30000;
            }

            const Var1 = player.GetVar1();
            player.SetSubdp(100, red, 0, dur, Var1);
        }

        return true
    }

}

/**
 * 7595  道心II
 * 提升攻击力效果，加强为当前抗性和的100%，且不再有上限限制
 */
class Skill7595 extends BaseHookSkillStub {

    constructor() {
        super(7595);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        if (player.GetHasbuff(9406)) {
            player.SetDispel(120, 9406, 0, 0);
        } else {
            let Res1 = player.GetRes1();
            let v11 = player.GetRes2() + Res1;
            let v13 = player.GetRes3() + v11;
            let v15 = player.GetRes4() + v13;
            let d = (v15 + player.GetRes5());
            let ap = Math.floor(skill.GetLevel() * d);
            player.SetMoralsense(120, ap);
        }
        return true
    }

}

/**
 * 7593  松风逐雪II
 * 新增效果:技能额外附加致命—击率level%
 */
class Skill7593 extends BaseHookSkillStub {

    constructor() {
        super(7593);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const sx = player.GetSyliaOrb()
        if (sx > 0) {
            player.SetAddSyliaOrb(120, -1)
            return 0
        }

        return super.GetCooldowntime(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetCrit(0.01 * skill.GetLevel())
        super.Calculate2(stub, skill, originFunc);
    }

}

/**
 * 7583  挥拂阴阳
 * 第三击新增额外附加冰冻效果，持续 6秒，
 * 冷却时间调整为 120秒
 */
class Skill7583 extends BaseHookSkillStub {

    constructor() {
        super(7583);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        let player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            player.SetDisableCrit(100, 15100, 60);
        }

        if (player.GetVar1() == 2) {
            player.SetFiveElems(100, 15100, 10, 3);
        }

        if (player.GetVar1() == 3) {
            let am = Math.floor(player.GetVar2() * 0.02);
            if (am > 300) {
                am = 300;
            }

            player.SetResLeak(100, 15100, am);
            player.SetFrozen(100, 0.0, 6100, 8);
        }

        return true
    }

}

/**
 * 7292  凝神化虚
 * 7599清逸II被动效果新增被动增加 凝神化虚 技能持续时间level秒,并降低冷却时间6*level秒
 *
 * 7637 玄烛·流光掷火·曦日：
 * 新增效果二：被动影响凝神化虚，令目标石化概率增加70%，减少凝神化虚冷却时间15秒
 */
class Skill7292 extends BaseHookSkillStub {

    constructor() {
        super(7292);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const victim = skill.GetVictimNice();
        const lv = victim.GetSkilllevel(7599)
        const xr = victim.GetSkilllevel(7637)
        return super.GetCooldowntime(stub, skill, originFunc) - lv * 6000 - xr * 3000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const victim = skill.GetVictimNice();
        const lv = victim.GetSkilllevel(7599)
        const xr = victim.GetSkilllevel(7637)

        const level = skill.GetLevel();
        let d = level + 2 * skill.GetT0() + xr * 14;
        victim.SetDecay(100, 15100 + lv * 1000, d, 2);

        victim.SetAddSyliaOrb(100, -2);
        return true
    }

}

/**
 * 7602  瑶朵傲霜II
 * 冷却时间调整为 65 秒，
 * 新增“从革”效果，持续 5+2*level 秒，承担比例8%*level，
 * 新增令自身进入心斋效果 2+level 秒
 */
class Skill7602 extends BaseHookSkillStub {

    constructor() {
        super(7602);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 65000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInnerSkin(120, skill.GetLevel() * 2000 + 5000)
        player.SetAbstain(100, skill.GetLevel() * 1000 + 2000, 0);
        player.SetHp(1)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetOuterSkin(120, 0.08 * skill.GetLevel(), skill.GetLevel() * 2000 + 5000)
        return true
    }

}

/**
 * 7608 浩渺无极<玄>
 * 浩渺无极<玄><煞><禅>：水系出现极效概率额外增加5%。
 * 每击附加自身气血上限10%攻击力，攻击目标12次
 * 攻击非玩家目标时额外附加自身真气上限10%攻击力，不进入冷却概率增加15%
 * 第一击有35%几率清除玩家目标的蚩魂效果
 * <禅>第一击有80%几率清除蚩魂状态，且在6秒内无法被施加有利状态
 *
 * T2 7352天书-风雪催 新增效果：浩渺无极<玄><煞><禅>攻击非玩家目标时，额外附加自身真气上限 2.5%*level 的攻击力
 *
 * 玄烛·竹引清风·曦日：技能达到 5 级时，
 * 如果施法者阵营为仙，则令 浩渺无极、浩渺无极<玄>、金风玉露III《英雄》 不进入冷却概率增加30%；
 *
 */
class Skill7608 extends BaseHookSkillStub {

    constructor() {
        super(7608);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v19 = skill.GetLevel() * 0.11 + 1.6;
        skill.SetRatio(v19);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * Maxatk * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(1);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(1);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v19 = skill.GetLevel() * 0.11 + 1.65;
        skill.SetRatio(v19);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * Maxatk * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(2);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v19 = skill.GetLevel() * 0.11 + 1.7;
        skill.SetRatio(v19);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * Maxatk * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(3);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v19 = skill.GetLevel() * 0.11 + 1.75;
        skill.SetRatio(v19);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * Maxatk * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(4);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v19 = skill.GetLevel() * 0.11 + 1.8;
        skill.SetRatio(v19);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * Maxatk * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(5);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v19 = skill.GetLevel() * 0.11 + 1.85;
        skill.SetRatio(v19);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * Maxatk * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(6);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let r = zrand(100)
        let resultR = 15
        const yh = player.GetSkilllevel(7629)
        const hy = player.GetSkilllevel(7630)
        const xr = player.GetSkilllevel(7631)
        if (yh >= 5) {
            resultR = 10
        }

        if (hy >= 5) {
            resultR = 30
        }

        if (xr >= 5) {
            resultR = 30
        }

        const fyj = player.GetSkilllevel(7634)
        resultR += fyj * 7

        if (r < resultR) {
            player.SetClearcooldown(7608, 0, 0)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            if (player.GetTypeIsPlayer()) {
                player.SetFrozen(50, 0, 3100, 8);
            }

            if (skill.GetT5()) {
                let v8 = skill.GetT5() + 1;
                let d = v8 + skill.GetT6();
                player.SetFiveElems(d, 15100, 3, 1);
            }

            if (player.GetTypeIsPlayer()) {
                player.SetFrozen(60, 0, 3100, 8);
                player.SetDispel(50, 90, 0, 0);
            }
        }

        let bon2 = 0.0;
        if (skill.GetT0() > 0) {
            let v14 = 3 * skill.GetT0();
            let T0 = skill.GetT0();
            bon2 = (v14 + norm(7 * T0)) / 100.0 + 1.0;
        }
        // let da = skill.GetLevel() + 20.0;//40
        // da = skill.GetT3() * 7.0 + da;//3*7=21+40=61
        const db = (skill.GetLevel() / 15.0 + 2.0) * player.GetVar3();
        player.SetElementDamage(66, 15, db, skill.GetT3() * 0.05 + bon2, 3);
        player.SetClearbuff(-1, 1);
        return true
    }
}

/**
 * 7612 浩渺无极<煞>
 * 攻击非玩家目标时，有15%概率不进入冷却（此效果与【玄烛·竹引清风·萤矩/皓月/曦日】 影响浩渺无极、浩渺无极<玄>不进入冷却的效果可叠加
 * 浩渺无极<煞>不再额外清除目标有利状态,调整为当自身气血高于目标时,第一击可降低目标气血上限至当前，最低降低至目标气血上限的50%，持续 4秒"
 * T2 7352天书-风雪催 新增效果：浩渺无极<玄><煞><禅>攻击非玩家目标时，额外附加自身真气上限 2.5%*level 的攻击力
 */
class Skill7612 extends BaseHookSkillStub {

    constructor() {
        super(7612);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v19 = skill.GetLevel() * 0.10 + 1.5;
        skill.SetRatio(v19);

        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(1);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);

        player.SetVar4(player.GetHp())
        player.SetPerform(1);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v19 = skill.GetLevel() * 0.10 + 1.5;
        skill.SetRatio(v19);

        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(2);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);

        player.SetVar4(player.GetHp())
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v19 = skill.GetLevel() * 0.10 + 1.5;
        skill.SetRatio(v19);

        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(3);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);

        player.SetVar4(player.GetHp())
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v19 = skill.GetLevel() * 0.10 + 1.5;
        skill.SetRatio(v19);

        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(4);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);

        player.SetVar4(player.GetHp())
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v19 = skill.GetLevel() * 0.10 + 1.5;
        skill.SetRatio(v19);

        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(5);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);

        player.SetVar4(player.GetHp())
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let v19 = skill.GetLevel() * 0.10 + 1.5;
        skill.SetRatio(v19);

        let Maxatk = player.GetMaxatk();
        let v16 = skill.GetT4() * 0.02 * Maxatk;
        let v14 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v17 = (Maxhp - player.GetHp()) * v14 + v16;
        let v20 = player.GetSyliaOrb() * v17;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v20 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v18 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v18));

        let v21 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v21);

        player.SetVar1(6);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);

        player.SetVar4(player.GetHp())
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let r = zrand(100)
        let resultR = 15
        const yh = player.GetSkilllevel(7629)
        const hy = player.GetSkilllevel(7630)
        const xr = player.GetSkilllevel(7631)
        if (yh >= 5) {
            resultR = 10
        }

        if (hy >= 5) {
            resultR = 30
        }

        if (xr >= 5) {
            resultR = 30
        }

        const fyj = player.GetSkilllevel(7634)
        resultR += fyj * 7

        if (r < resultR) {
            player.SetClearcooldown(7612, 0, 0)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            if (player.GetTypeIsPlayer()) {
                player.SetFrozen(skill.GetLevel() + 55, 0.0, 3100, 8);
            }

            if (skill.GetT5()) {
                let v8 = skill.GetT5() + 1;
                let da = v8 + skill.GetT6();
                player.SetFiveElems(da, 15100, 10, 1);
            }

            if (player.GetTypeIsPlayer()) {

                player.SetDispel(50, 90, 0, 0);
            }
        }
        let bon2 = 0.0;
        if (skill.GetT0() > 0) {
            let v14 = 3 * skill.GetT0();
            let T0 = skill.GetT0();
            bon2 = (v14 + zrand(7 * T0)) / 100.0 + 1.0;
        }
        // let db = skill.GetT3() * 7.0 + 20.0;
        let dc = skill.GetT3() * 0.05 + bon2;
        let dd = player.GetVar3();
        dd = (skill.GetLevel() / 15.0 + 2.0) * dd;
        player.SetElementDamage(66, 15, dd, dc, 3.0);
        return true
    }
}

/**
 * 7616 浩渺无极<禅>
 * T2 7352天书-风雪催 新增效果：浩渺无极<玄><煞><禅>攻击非玩家目标时，额外附加自身真气上限 2.5%*level 的攻击力
 * <禅>第一击有80%几率清除蚩魂状态，且在6秒内无法被施加有利状态
 */
class Skill7616 extends BaseHookSkillStub {

    constructor() {
        super(7616);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v25 = skill.GetLevel() * 0.09 + 1.3;
        skill.SetRatio(v25);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v22 = skill.GetT4() * 0.02 * Maxatk;
        let v20 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v23 = (Maxhp - player.GetHp()) * v20 + v22;
        let v26 = player.GetSyliaOrb() * v23;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v26 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v24 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v24));

        let v27 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v27);

        player.SetVar1(1);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        let v14 = player.GetMaxhp();
        player.SetVar4(v14);
        let Maxmp = player.GetMaxmp();
        player.SetVar5(Maxmp);
        player.SetPerform(1);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v25 = skill.GetLevel() * 0.09 + 1.3;
        skill.SetRatio(v25);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v22 = skill.GetT4() * 0.02 * Maxatk;
        let v20 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v23 = (Maxhp - player.GetHp()) * v20 + v22;
        let v26 = player.GetSyliaOrb() * v23;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v26 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v24 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v24));

        let v27 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v27);

        player.SetVar1(2);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v25 = skill.GetLevel() * 0.09 + 1.3;
        skill.SetRatio(v25);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v22 = skill.GetT4() * 0.02 * Maxatk;
        let v20 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v23 = (Maxhp - player.GetHp()) * v20 + v22;
        let v26 = player.GetSyliaOrb() * v23;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v26 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v24 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v24));

        let v27 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v27);

        player.SetVar1(3);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v25 = skill.GetLevel() * 0.09 + 1.3;
        skill.SetRatio(v25);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v22 = skill.GetT4() * 0.02 * Maxatk;
        let v20 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v23 = (Maxhp - player.GetHp()) * v20 + v22;
        let v26 = player.GetSyliaOrb() * v23;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v26 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v24 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v24));

        let v27 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v27);

        player.SetVar1(4);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v25 = skill.GetLevel() * 0.09 + 1.3;
        skill.SetRatio(v25);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v22 = skill.GetT4() * 0.02 * Maxatk;
        let v20 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v23 = (Maxhp - player.GetHp()) * v20 + v22;
        let v26 = player.GetSyliaOrb() * v23;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v26 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v24 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v24));

        let v27 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v27);

        player.SetVar1(5);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        let v25 = skill.GetLevel() * 0.09 + 1.3;
        skill.SetRatio(v25);

        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        let v22 = skill.GetT4() * 0.02 * Maxatk;
        let v20 = skill.GetT4() * 0.01;
        let Maxhp = player.GetMaxhp();
        let v23 = (Maxhp - player.GetHp()) * v20 + v22;
        let v26 = player.GetSyliaOrb() * v23;
        //每击附加自身气血上限10%攻击力
        skill.SetPlus(v26 + Maxhp * 0.1);

        let T2 = skill.GetT2();
        let v24 = T2 * player.GetMaxatk() * 0.15 + player.GetMaxmp() * (0.1 + T2 * 0.025);
        skill.SetMobBonusDamage(Math.floor(v24));

        let v27 = skill.GetT2() * 0.15;
        skill.SetMobCrithurt(v27);

        player.SetVar1(6);
        let v11 = player.GetMaxatk();
        player.SetVar3(v11);
        player.SetPerform(0);
        player.SetVar1(0);
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar3() == 1) {
            let r = zrand(100)
            let resultR = 0
            const yh = player.GetSkilllevel(7629)
            const hy = player.GetSkilllevel(7630)
            const xr = player.GetSkilllevel(7631)
            if (yh >= 5) {
                resultR = 10
            }

            if (hy >= 5) {
                resultR = 12
            }

            if (xr >= 5) {
                resultR = 15
            }

            if (player.GetTargetTypeIsMob()) {
                resultR += 50
            }

            const fyj = player.GetSkilllevel(7634)
            resultR += fyj * 3

            if (r < resultR) {
                player.SetClearcooldown(7612, 0, 0)
            }
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            if (player.GetTypeIsPlayer()) {
                player.SetFrozen(50, 0, 3100, 8);
            }

            if (skill.GetT5()) {
                const v8 = skill.GetT5() + 1;
                const d = v8 + skill.GetT6();
                player.SetFiveElems(d, 15100, 10, 1);
            }

            if (player.GetTypeIsPlayer()) {
                player.SetDispel(80, 90, 0, 0);
                player.SetTurnbuff(6000, 1, 2)
            }
        }

        let bon2 = 0.0;
        if (skill.GetT0() > 0) {
            const v24 = 3 * skill.GetT0();//3*3=9
            const T0 = skill.GetT0();//3
            bon2 = (v24 + zrand(7 * T0)) / 100.0 + 1.0;
        }

        let db = skill.GetLevel() + 20.0;
        // const p = skill.GetT3() * 7.0 + db;
        const dd = skill.GetT3() * 0.05 + bon2;
        const dc = (skill.GetLevel() / 15.0 + 2.0) * player.GetVar3();//3.3*大攻
        player.SetElementDamage(66, 15, dc, dd, 3);

        player.SetClearbuff(-1, 1);

        return true
    }
}

/**
 * 7605  幻隐三千<玄>
 *
 */
class Skill7605 extends BaseHookSkillStub {

    constructor() {
        super(7605);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

}

/**
 * 7609  幻隐三千<煞>
 *
 */
class Skill7609 extends BaseHookSkillStub {

    constructor() {
        super(7609);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

}

/**
 * 7613  幻隐三千<禅>
 *
 */
class Skill7613 extends BaseHookSkillStub {

    constructor() {
        super(7613);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

}

/**
 * 7614  舍心行藏<禅
 * 舍心行藏<禅>施放后获得的\"心斋\"效果持续时间由 8 秒上调为 12秒
 */
class Skill7614 extends BaseHookSkillStub {

    constructor() {
        super(7614);
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

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let t = 1000 * skill.GetLevel() + 5100;
        player.SetInnerSkin(120, t);

        let ta = -10000 * skill.GetT0() + 120000;
        player.SetSetcooldown(120, 7306, 0, 0, ta);

        player.SetAbstain(120, 12100, 0);
        player.SetHp(1)
        return true
    }

}

/**
 * 7606  舍心行藏<玄>
 *
 */
class Skill7606 extends BaseHookSkillStub {

    constructor() {
        super(7606);
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
 * 7610  舍心行藏<煞>
 *
 */
class Skill7610 extends BaseHookSkillStub {

    constructor() {
        super(7610);
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
 * 7607  玄极归一<玄><煞><禅>
 *冷却减少10秒
 */
class Skill7607 extends BaseHookSkillStub {

    constructor() {
        super(7607);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

/**
 * 7611
 *
 */
class Skill7611 extends BaseHookSkillStub {

    constructor() {
        super(7611);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }
}

/**
 * 7615
 *
 */
class Skill7615 extends BaseHookSkillStub {

    constructor() {
        super(7615);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }
}

/**
 * 7624  云生画影III  《碧海》
 * 碧海系特有效果调整为60秒内，每次使用单体攻击技能都有100%的几率为目标附加一层行意效果，原有仙阵营额外附加效果删除
 * 新增：若施法者为仙阵营，则额外减少20秒冷却，
 * 并清除所有五行技能冷却，包括轩辕策和星宿技能
 */
class Skill7624 extends BaseHookSkillStub {

    constructor() {
        super(7624);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetVictimNice();
        if (player.GetVar3() == 1) {
            return super.GetCooldowntime(stub, skill, originFunc) - 20000;
        }

        return super.GetCooldowntime(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const dur = 10000 * skill.GetLevel();
        let chance = 33 * skill.GetLevel() + 1;
        player.SetSingleTargetBreak(100, dur, chance, 7625, 1);

        // [7277, 7286, 7295, 7304, 7308, 7516, 7593, 7626, 7627, 7628, 7608, 7612, 7616, 7619, 7620]
        if (player.GetVar3() == 1) {
            player.SetClearcooldown(7277, 7286, 7295)
            player.SetClearcooldown(7304, 7308, 7516)
            player.SetClearcooldown(7593, 7626, 7627)
            player.SetClearcooldown(7628, 7608, 7612)
            player.SetClearcooldown(7616, 7619, 7620)
        }

        return true
    }

}

/**
 * 7621  云生画影III《英雄》
 * 若施法者为佛阵营，则12秒内额外增加自身减免百分比属性10%
 */
class Skill7621 extends BaseHookSkillStub {

    constructor() {
        super(7621);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);

        const player = skill.GetPlayerNice()
        if (player.GetCultivation() == 4) {
            player.SetUltimateDamageReduction(120, 12100, 0.1, 1, 3)
        }

        return true
    }

}

/**
 * 7622  云生画影III《大地》
 * 若施法者为魔阵营，则15秒内额外提升自身五抗10%
 */
class Skill7622 extends BaseHookSkillStub {

    constructor() {
        super(7622);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);

        const player = skill.GetPlayerNice()
        if (player.GetCultivation() == 2) {
            player.SetIncanti(0.1, 15000)
        }

        return true
    }


}

/**
 * 7617  金风玉露III  《英雄》
 *
 * 7590凝思11技能新增效果：金风雨露 ⅢII 《英雄》冷却时间减少 level 秒；
 * 金风玉露 111英雄冷却时间减少 level秒(最快冷却时间可至 14秒)
 * //【玄烛·竹引清风·萤矩/皓月/曦日】技能达到 5 级时，
 * // 如果施法者阵营为仙，则令“浩渺无极、浩渺无极<玄>、金风玉露 III 英雄\"有10%/20%/30%概率不进入冷却
 */
class Skill7617 extends BaseHookSkillStub {

    constructor() {
        super(7617);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let r = zrand(100)
        let resultR = 0
        if (player.GetCultivation() == 1) {
            const yh = player.GetSkilllevel(7629)
            const hy = player.GetSkilllevel(7630)
            const xr = player.GetSkilllevel(7631)
            if (yh >= 5) {
                resultR = 10
            }

            if (hy >= 5) {
                resultR = 20
            }

            if (xr >= 5) {
                resultR = 30
            }
        }

        if (r < resultR) {
            player.SetClearcooldown(7617, 0, 0)
        }

        return true
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const lv = player.GetSkilllevel(7590)
        return -4000 * skill.GetLevel() + 36000 - 1000 * lv;
    }

}

/**
 * 7286  流光掷火
 * 五行技能
 * 施法时间1秒
 * 7590凝思II：技能到达10级时减少五行技能冷却时间由5秒提高至10秒
 *
 * 7637 玄烛·流光掷火·曦日：
 * 玄烛·流光掷火·曦日：第二击和第三击触发火系伤害的概率调整为100%，
 * 新增效果一：被动额外增加火系伤害极效概率30%，火系极效伤害量提升30%
 * 新增效果二：被动影响凝神化虚，令目标石化概率增加70%，减少凝神化虚冷却时间15秒
 */
class Skill7286 extends BaseHookSkillStub {

    constructor() {
        super(7286);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const v2 = -3000 * skill.GetT1() + 36000;
        const T6 = Math.floor(skill.GetT6() / 10);
        return v2 - 10000 * T6;
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

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        //每一击将灼烧目标8秒，灼烧量为施法者最大攻击的%d%，每次灼烧都有%d%概率出现极效灼烧，极效倍率为施法者致命一击伤害的50%。
        if (player.GetTypeIsMob()) {
            const d = (skill.GetLevel() * 0.09 + 0.12) * player.GetVar3();
            const chance = 3 * skill.GetLevel();
            const db = (player.GetVar4() / 100) * 0.5 + 1.0;
            const Var1 = player.GetVar1();
            player.SetFiring2(120, 8100, db, d, chance, Var1);
        }

        const Var11 = player.GetVar11();//萤炬
        const star_lvl = Var11 + player.GetVar12() + player.GetVar13();
        let ult_chance = 0.0;
        if (star_lvl) {
            let check = player.GetVar2();
            if (check > 100 * star_lvl)
                check = 100 * star_lvl;
            ult_chance = check * 0.1;
        }

        if (player.GetVar1() == 1) {//第一击有15%几率追加一次火系伤害
            const da = skill.GetT3() * 3.0 + 15.0 + (player.GetVar9() * player.GetVar10());
            const dd = skill.GetT3() * 0.05 + 0.3;
            const de = (skill.GetLevel() / 3.0) * player.GetVar3();
            player.SetElementDamage(da, ult_chance + 30, de, dd, 4);
            // player.SetPetrify(50, 10000);

            if (skill.GetT5()) {
                const v36 = skill.GetT5() + 1;
                const dc = v36 + skill.GetT6();
                player.SetFiveElems(dc, 15100, 10, 1);
            }
        }

        if (star_lvl > 0) {
            let chance = 20.0;
            if (player.GetVar12() > 0)
                chance = 40.0;
            if (player.GetVar13() > 0)
                chance = 100.0;

            if (player.GetVar1() == 2 || player.GetVar1() == 3) {
                const xr = player.GetVar13()
                const dd = skill.GetT3() * 3.0 + chance + (player.GetVar9() * player.GetVar10());
                const ratio = skill.GetT3() * 0.05 + xr * 0.06 + 0.3;
                const de = (skill.GetLevel() / 3.0) * player.GetVar3();
                player.SetElementDamage(dd, 100, de, ratio, 4);
                // player.SetPetrify(50, 10000);
            }
        }

        const df = skill.GetT0() * 120.0;
        const dg = skill.GetT0() * 0.02;
        const Var1 = player.GetVar1();
        player.SetIncfatalratio(df, dg, 12100, Var1);

        const dh = skill.GetT0() * 120.0;
        const di = skill.GetT0() * 0.1;
        player.SetIncfatalhurt(dh, di, 12100, Var1);
        return true
    }
}

/**
 * 7279  竹引清风
 * 7323天书-德满坤：治疗技能施法后，提供免疫群攻的几率调整为100%，持续时间调整为10秒
 *
 * 玄烛·竹引清风·曦日：技能级别达到2级和4级分别清除自身2/4个不利状态，技能级别达到1/3/5级分别清除友方冰封/寂然效果；
 * 技能达到 5 级时，
 * 如果施法者阵营为仙，则令 浩渺无极、浩渺无极<玄>、金风玉露 III 英雄 不进入冷却概率增加30%；
 * 如果施法者阵营为佛，释放竹引清风则自身获得玉册效果 10 秒；
 */
class Skill7279 extends BaseHookSkillStub {

    constructor() {
        super(7279);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const d = 3 * skill.GetT4();
        const player = skill.GetPlayerNice();
        player.SetAddSyliaOrb(d, 1);

        const da = 40 * skill.GetT5();
        const db = 3000 * skill.GetT5() + 1100;
        player.SetAoEImmune(da, db);

        const Var10 = player.GetVar10();
        const v11 = player.GetVar11() + Var10;
        const star_lvl = v11 + player.GetVar12();
        if (star_lvl > 1) {
            player.SetDispel(33 * star_lvl, 4111, 0, 0);
        }

        if (star_lvl > 3) {
            const dd = 25 * star_lvl;
            player.SetDispel(dd, 115, 0, 0);
        }

        const lv = player.GetVar10() + player.GetVar11() + player.GetVar12()
        if (lv >= 5 && player.GetCultivation() == 4) {
            player.SetTurndebuff(10000, 5, 1)
        }

        return true
    }

}

export class HuaYingSkillList {
    constructor() {
        XingYi10Ceng()
        new Skill7283()
        new Skill7272()
        new Skill7299()
        new Skill7303()
        new Skill7288()
        new Skill7297()
        new Skill7275()
        new Skill7581()
        new Skill7270()
        new Skill7269()
        new Skill7273()
        new Skill7301()
        new Skill7285()
        new Skill7294()
        new Skill7342()
        new Skill7291()
        new Skill7282()
        new Skill7584()
        new Skill7582()
        new Skill7298()
        new Skill7589()
        new Skill7304()
        new Skill7277()
        new Skill7308()
        new Skill7295()
        new Skill7628()
        new Skill7595()
        new Skill7593()
        new Skill7583()
        new Skill7292()
        new Skill7602()
        new Skill7612()
        new Skill7616()
        new Skill7605()
        new Skill7609()
        new Skill7613()
        new Skill7614()
        new Skill7606()
        new Skill7610()
        new Skill7607()
        new Skill7611()
//        new Skill7615()
        new Skill7624()
        new Skill7621()
        new Skill7622()
        new Skill7617()
        new Skill7286()
        new Skill7279()
        new Skill7608()
    }
}