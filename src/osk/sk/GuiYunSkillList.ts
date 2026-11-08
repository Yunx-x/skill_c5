import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 6511  穿林打叶
 * 施法1.5秒，6段攻击，每段附加自身气血上限6%攻击力，新增效果：每段额外降低目标减免伤害百分比2%，持续0.9*level秒，最多叠加3次
 * 对怪物伤害附加自身当前气血6%。
 *
 * 6754T4岁寒II  穿林打叶附加自身气血上限伤害调整为0.8%*level
 */
class Skill6511 extends BaseHookSkillStub {

    constructor() {
        super(6511);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
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
        // skill.SetCrit(0.02);
        //
        // const skilllevel = player.GetSkilllevel(6540);
        // const v21 = (v7 + skilllevel * skill.GetT1()) * 0.01 + 1.0;
        // skill.SetRatio(v21);
        //
        // const v2 = skill.GetLevel() + 4;
        // const v3 = v2 + 3 * skill.GetT3();
        // const player = skill.GetPlayerNice();
        // const bufflevel = player.GetBufflevel(9333);
        // const v6 = skill.GetT4() <= 0 ? 1 : 2;
        // const v7 = bufflevel * v6 + v3;
        //
        // const v10 = 30 * skill.GetLevel() + 160;
        // const T4 = skill.GetT4();
        // const v19 = T4 * player.GetMaxhp() * 0.008;
        // const v14 = player.GetBufflevel(9333);
        // const v20 = v10 + Math.floor(v14 * v19);
        // const v18 = skill.GetT4() * 0.005;
        // const v22 = player.GetMaxhp() * v18 + v20 + player.GetMaxhp() * 0.06;
        // skill.SetPlus(v22);

        skill.SetCrit(0.02);
        let v2 = skill.GetLevel() + 4;
        let v3 = v2 + 3 * skill.GetT3();
        const player = skill.GetPlayerNice();
        let bufflevel = player.GetBufflevel(9333);
        let v6 = skill.GetT4() <= 0 ? 1 : 2;
        let v7 = bufflevel * v6 + v3;
        let skilllevel = player.GetSkilllevel(6540);
        let v21 = (v7 + skilllevel * skill.GetT1()) * 0.01 + 1.0;
        skill.SetRatio(v21);
        let v10 = 30 * skill.GetLevel() + 160;
        let T4 = skill.GetT4();
        let v19 = T4 * player.GetMaxatk() * 0.002;
        let v14 = player.GetBufflevel(9333);
        let v20 = v10 + Math.floor(v14 * v19);
        let v18 = T4 * 0.008;
        let v22 = player.GetMaxhp() * v18 + v20;
        skill.SetPlus(v22 + player.GetMaxhp() * 0.06);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetVar1(1);
        player.SetPerform(1);
        player.SetPerform(0)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetCrit(0.039999999);
        let v2 = 2 * (skill.GetLevel() + 3);
        let v3 = v2 + 3 * skill.GetT3();
        const player = skill.GetPlayerNice();
        let bufflevel = player.GetBufflevel(9333);
        let v6 = skill.GetT4() <= 0 ? 1 : 2;
        let v7 = bufflevel * v6 + v3;
        let skilllevel = player.GetSkilllevel(6540);
        let v21 = (v7 + skilllevel * skill.GetT1()) * 0.01 + 1.0;
        skill.SetRatio(v21);
        let v10 = 30 * skill.GetLevel() + 170;
        let T4 = skill.GetT4();
        let v19 = T4 * player.GetMaxatk() * 0.002;
        let v14 = player.GetBufflevel(9333);
        let v20 = v10 + Math.floor(v14 * v19);
        let v18 = T4 * 0.008;
        let v22 = player.GetMaxhp() * v18 + v20;
        skill.SetPlus(v22 + player.GetMaxhp() * 0.06);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetVar1(2);
        player.SetPerform(0);
        player.SetPerform(0)
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetCrit(0.059999999);
        let v2 = 3 * skill.GetLevel() + 8;
        let v3 = v2 + 3 * skill.GetT3();
        const player = skill.GetPlayerNice();
        let bufflevel = player.GetBufflevel(9333);
        let v6 = skill.GetT4() <= 0 ? 1 : 2;
        let v7 = bufflevel * v6 + v3;
        let skilllevel = player.GetSkilllevel(6540);
        let v21 = (v7 + skilllevel * skill.GetT1()) * 0.01 + 1.0;
        skill.SetRatio(v21);
        let v10 = 30 * skill.GetLevel() + 180;
        let T4 = skill.GetT4();
        let v19 = T4 * player.GetMaxatk() * 0.002;
        let v14 = player.GetBufflevel(9333);
        let v20 = v10 + Math.floor(v14 * v19);
        let v18 = T4 * 0.008;
        let v22 = player.GetMaxhp() * v18 + v20;
        skill.SetPlus(v22 + player.GetMaxhp() * 0.06);

        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetVar1(3);
        player.SetPerform(0);
        player.SetPerform(0)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFlamecurse(120, skill.GetLevel() * 900, 0.02, 3)
        player.SetGFrosty(16, 5000)
        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 6515  流年暗度
 *
 * 天书-斗转参横    增加“流年暗度”效果的时间调整为4*level 秒
 */
class Skill6515 extends BaseHookSkillStub {

    constructor() {
        super(6515);
    }

    // GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    //     return 120000
    // }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();
        const t0 = skill.GetT0();
        const t1 = skill.GetT1();
        const res3 = player.GetRes3();
        const res5 = player.GetRes5();

        const v2 = 5 * level + 31;
        const d = v2 + 20 * t0;

        const v4 = 4000 * t1 + 5000;
        const v6 = res3 / 300;
        const da = v4 + 1000 * (v6 + res5 / 300);

        player.SetAgedRewind(d, da);

        return true
    }

}

/**
 * 6533  千山飞白
 * 冷却时间减少30秒
 */
class Skill6533 extends BaseHookSkillStub {

    constructor() {
        super(6533);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

}

/**
 * 6523  冷露无声
 * 持续时间减少5秒。新增效果-施法后自身获得神佑状态，免疫攻击和负面效果4次，持续3秒
 *
 * 【玄烛-冷露无声·萤矩/皓月/曦日】新增效果："冷露无声"神佑效果持续时间增加1/2/3 秒
 */
class Skill6523 extends BaseHookSkillStub {

    constructor() {
        super(6523);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const yj = player.GetSkilllevel(6995)
        const hy = player.GetSkilllevel(6996)
        const xr = player.GetSkilllevel(6997)

        const star_lvl = yj + hy + xr
        let extra = 0.0;
        if (star_lvl)
            extra = star_lvl * 0.5 + 1.5;//5*0.5+1.5=4

        let edur = 0;
        if (yj > 0)
            edur = 2000;
        if (hy > 0)
            edur = 4000;
        if (xr > 0) {
            edur = 6000;
            extra += 2
        }

        //16-9-6=3

        const ta = 16.0 - skill.GetLevel() - extra;
        player.SetIntagible(120, ta, 3000 * skill.GetLevel() + 2000 + edur - 5000);

        const tb = 5 * skill.GetT1();
        const tc = 5 * skill.GetT1();
        player.SetRandbuff(tb, 4, tc, 5000, 1);

        const td = skill.GetT1() * 120.0;
        const te = Math.floor(skill.GetT1() / 2.6 + 1.0);
        const tf = 7000 * skill.GetT2() + 10000;
        player.AddCloudShift(td, te, tf);

        let t = 0
        if (yj > 0) {
            t = 1000
        }

        if (hy > 0) {
            t = 2000
        }

        if (xr > 0) {
            t = 3000
        }

        player.SetBlessed(4, 3000 + t)
        player.SetImmunetaune(120,10000)
        return true
    }

}

/**
 * 6718  落花寂寂
 * 施法时间由2秒调整为1秒,
 * 冷却时间调整为90秒,
 * 新增10%概率令目标陷入\"霜结\"效果10秒,自身每比目标高1点晕抗,则额外提供成功率1%(最高额外提供100%概率)
 */
class Skill6718 extends BaseHookSkillStub {

    constructor() {
        super(6718);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 750
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar2(player.GetRes1())
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        let d = 10 + player.GetVar2() - player.GetRes1()
        if (d > 110) {
            d = 110
        }

        player.SetGFrosty(d, 10000)
        return true
    }

}

/**
 * 6528  枯荷待雨
 * 6757 T2枯荷待雨II，令枯荷待雨的基本伤害调整至30%；目标每3个不利状态和自身每3个有利状态，都会提前1秒触发结算伤害，最快提前10秒。
 */
class Skill6528 extends BaseHookSkillStub {

    constructor() {
        super(6528);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 15000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const v3 = player.GetVar1() + 25;
        const d = 5 * ((v3 - player.GetRes4()) / 10);

        let duration = -1000 * skill.GetLevel() + 20000;
        if (skill.GetT2() > 0) {
            const Debuffcnt = player.GetDebuffcnt();
            const da = Math.floor(Debuffcnt / 3) * 1000;
            const Var4 = player.GetVar4();
            let earlier = Math.floor(Var4 / 3) * 1000 + da;
            const max = 1000 * skill.GetT2();
            if (earlier > max)
                earlier = max;
            duration -= earlier;
        }

        const dc = player.GetVar2() * 0.1;
        const dd = skill.GetLevel() * dc;
        const de = (skill.GetT0() * 0.05 + 1) * dd;
        const T1 = skill.GetT1();
        const df = (T1 * player.GetVar3() * 0.005 + de) * (skill.GetT2() * 0.03 + 1);

        const ratio = skill.GetLevel() + 4;
        player.SetWitheredLotus(d, df, ratio, duration);
        return true
    }

}

/**
 * 6514 骤雨逐风
 * 6751 骤雨逐风II
 * 由自身祝福技能调整为被动技能，取消现有效果，调整为被动增益“骤雨逐风”技能，效果为：
 * 当自身攻击力高于目标时，令此技能附加禁食效果，持续0.5*level秒；
 * 额外降低“骤雨逐风”技能冷却时间 1.5level 秒
 */
class Skill6514 extends BaseHookSkillStub {

    constructor() {
        super(6514);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const t = player.GetSkilllevel(6751) * 1500
        return super.GetCooldowntime(stub, skill, originFunc) - t;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar3(player.GetMaxatk())
        player.SetVar4(player.GetSkilllevel(6751))
        const xy = player.GetBufflevel(9333) * 0.01
        player.SetIncMobDmg(120, 20000, xy, 3)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const v4 = player.GetVar4()
        if (v4 > 0 && player.GetVar3() > player.GetMaxatk()) {
            player.SetDiet(120, 500 * v4)
        }

        return true
    }

}

/**
 * 6751  骤雨逐风II
 *
 */
class Skill6751 extends BaseHookSkillStub {

    constructor() {
        super(6751);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {

        return true
    }

}

/**
 * 6746  吹雪洒冰II
 * 新增效果：降低目标防御力 30秒，数值为自身最大攻击力 10%*level；降低御仙10%，15秒
 */
class Skill6746 extends BaseHookSkillStub {

    constructor() {
        super(6746);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v8 = (2 * (skill.GetLevel() + 5)) * 0.01 + 1.0;
        skill.SetRatio(v8);
        let v7 = (30 * skill.GetLevel() + 592);
        skill.SetPlus(v7+player.GetMaxmp()*0.03);
        player.SetVar1(1);
        let res2 = player.GetRes2();
        player.SetVar2(res2);
        player.SetVar3(player.GetMaxatk())
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        let v8 = (2 * (skill.GetLevel() + 5)) * 0.01 + 1.0;
        skill.SetRatio(v8);
        let v7 = (30 * skill.GetLevel() + 592);
        skill.SetPlus(v7+player.GetMaxmp()*0.03);
        player.SetVar1(2);
        let res2 = player.GetRes2();
        player.SetVar2(res2);
        player.SetVar3(player.GetMaxatk())
        player.SetPerform(0);
        player.SetVar1(3);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            player.SetSubdefence(120, player.GetVar3() * 0.1 * skill.GetLevel(), 30000, 2)
            player.SetDecCultRes(120, 15000, 0.1, 2, 2)
        }

        return true
    }

}

/**
* 6527  潇潇雨歇
* 降低御魔10%
*/
class Skill6527 extends BaseHookSkillStub {

    constructor() {
        super(6527);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
         super.StateAttack(stub, skill, originFunc);
         const player=skill.GetPlayerNice()
        player.SetDecCultRes(120,1000 * skill.GetLevel() + 2000,0.1,0,0)
        return true
    }

}

/**
 * 星庐听雨，星庐听雨<玄><煞><禅>：调整为无冷却
 */
class XingLuTingYu extends QuickCoolDownList {
    getSkillList(): number[] {
        return [6538, 6641, 6645, 6649];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

}

/**
 * 6750  铁马冰河II
 * 攻击目标8段，附加的4段当前气血比例伤害分别提高为：10% 13%，16%、19%，22%，25%、28%，31%
 */
class Skill6750 extends BaseHookSkillStub {

    constructor() {
        super(6750);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v8 = skill.GetLevel() * 0.02;
        skill.SetCrithurt(v8);
        const v2 = skill.GetLevel() + 5;
        const player = skill.GetPlayerNice();
        const v9 = (2 * (v2 + player.GetBufflevel(9333))) * 0.01 + 1.0;
        skill.SetRatio(v9);

        const v7 = 35 * skill.GetLevel() + 655;
        const v10 = player.GetMaxhp() * 0.1 + v7;
        skill.SetPlus(v10);
        player.SetVar1(1);
        player.SetPerform(1);

        const v102 = player.GetMaxhp() * 0.13 + v7;
        skill.SetPlus(v102);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v8 = skill.GetLevel() * 0.04;
        skill.SetCrithurt(v8);
        const v2 = 3 * skill.GetLevel() + 20;
        const player = skill.GetPlayerNice();
        const v9 = (v2 + 2 * player.GetBufflevel(9333)) * 0.01 + 1.0;
        skill.SetRatio(v9);
        const v7 = 55 * skill.GetLevel() + 755;
        const v10 = player.GetMaxhp() * 0.16 + v7;
        skill.SetPlus(v10);
        player.SetVar1(2);
        player.SetPerform(0);
        const v102 = player.GetMaxhp() * 0.19 + v7;
        skill.SetPlus(v102);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v8 = skill.GetLevel() * 0.06;
        skill.SetCrithurt(v8);
        const v2 = 4 * skill.GetLevel() + 30;
        const player = skill.GetPlayerNice();
        const v9 = (v2 + 2 * player.GetBufflevel(9333)) * 0.01 + 1.0;
        skill.SetRatio(v9);
        const v7 = 75 * skill.GetLevel() + 855;
        const v10 = player.GetMaxhp() * 0.22 + v7;
        skill.SetPlus(v10);
        player.SetVar1(3);
        player.SetPerform(0);
        const v102 = player.GetMaxhp() * 0.25 + v7;
        skill.SetPlus(v102);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v8 = skill.GetLevel() * 0.08;
        skill.SetCrithurt(v8);
        const v2 = 5 * skill.GetLevel() + 60;
        const player = skill.GetPlayerNice();
        const v9 = (v2 + 2 * player.GetBufflevel(9333)) * 0.01 + 1.0;
        skill.SetRatio(v9);
        const v7 = 95 * skill.GetLevel() + 955;
        const v10 = player.GetMaxhp() * 0.28 + v7;
        skill.SetPlus(v10);
        player.SetVar1(4);
        player.SetPerform(0);
        const v102 = player.GetMaxhp() * 0.31 + v7;
        skill.SetPlus(v102);
        player.SetPerform(0);
    }

}

/**
 * 6758  桐影疏风II
 * 100%概率诅咒目标和祝福自身
 */
class Skill6758 extends BaseHookSkillStub {

    constructor() {
        super(6758);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const da = 6 * skill.GetLevel();
        player.SetRandbuff(120, 6, da, 10000, 1);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const da = 6 * skill.GetLevel();
        player.SetCurses(6, 120, 10000, da, 1);
        return true
    }

}

/**
 * 6755  白雨跳珠II
 * 额外增加自身抗性15%，持续15秒
 */
class Skill6755 extends BaseHookSkillStub {

    constructor() {
        super(6755);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetIncanti(0.15, 15000)
        return true
    }

}

/**
 * 6453 绿蓑衣
 * 6756绿蓑衣II 减伤比例上限提升至最多60%
 */
class Skill6453 extends BaseHookSkillStub {

    constructor() {
        super(6453);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = 10 * skill.GetLevel() + 50;
        const v3 = 3000 * skill.GetLevel();
        const da = v3 + 1000 * skill.GetT0();

        let reduction = skill.GetLevel() * 0.04;
        if (skill.GetT0()) {
            reduction = (player.GetVar1() / 50000) * 0.06 + reduction;
        }

        player.SetDecdamage(d, reduction, da);

        return true
    }

}

/**
 * 6643  撑花照影<玄>
 * 自身20秒内真气增加50%
 */
class Skill6643 extends BaseHookSkillStub {

    constructor() {
        super(6643);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncmp(0.5, skill.GetLevel() * 1000, 1);

        return true
    }

}

/**
 * 6647  撑花照影<煞>
 * 自身15秒内获得迅疾效果，技能施法减少40%，移动速度增加15%
 */
class Skill6647 extends BaseHookSkillStub {

    constructor() {
        super(6647);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const level = skill.GetLevel()
        const da = 600 * level + 3100;//满级15秒
        const db = level * 0.02;//满级0.3
        const dc = level * 0.0075;//满级0.1
        player.SetSwift(120, da, db, dc);
        return true
    }

}

/**
 * 6651  撑花照影<禅>
 * 自身10秒内免疫不利状态
 */
class Skill6651 extends BaseHookSkillStub {

    constructor() {
        super(6651);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetTurndebuff(skill.GetLevel() * 500, 0, 1);
        return true
    }

}

/**
 * 6717  清和雨初
 * 冷却时间调整为 120 秒
 */
class Skill6717 extends BaseHookSkillStub {

    constructor() {
        super(6717);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

/**
 * 6723  皓凝霜雪III 《大地》
 * 自身抗性和大于6000时，增加的暴伤加强为33%
 */
class Skill6723 extends BaseHookSkillStub {

    constructor() {
        super(6723);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        if (player.GetVar1() === 1) {
            const d = skill.GetLevel() * 33.0;
            const da = 2 * skill.GetLevel() + 3;
            const db = 7000 * skill.GetT0() + 10000;
            player.AddCloudShift(d, da, db);
        }

        const res1 = player.GetRes1();
        const res2 = player.GetRes2();
        const res3 = player.GetRes3();
        const res4 = player.GetRes4();
        const res5 = player.GetRes5();

        let time = 1000 * (skill.GetLevel() + 1);
        let ratio = 2 * skill.GetLevel();
        const sum = res1 + res2 + res3 + res4 + res5;
        if (sum > 2999) {
            time += 2000;
            ratio = 4 * skill.GetLevel();
        }
        if (sum > 3999) {
            time += 6000;
            ratio = 5 * skill.GetLevel();
        }
        if (sum > 5999) {
            time += 6000;
            ratio = 11 * skill.GetLevel();
        }
        const dd = ratio * 0.01;
        player.SetStackCritHurt(120, dd, 1, 4, time);
        return true
    }

}

/**
 * 6992   赤乌·撑花照影·萤矩
 * 令自身进入迅疾状态，施放速度加快60%，移动速度增加60%，持续30秒
 */
class Skill6992 extends BaseHookSkillStub {

    constructor() {
        super(6992);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        player.SetIncskilldamage(0.2, 20000, 2);

        const playerSkillVar1 = skill.GetPlayerNice().GetVar1();
        const d = playerSkillVar1 * 0.01 + 0.05;
        player.SetInchp(d, 20000, 8);

        const playerVar1 = skill.GetPlayerNice().GetVar1();
        const da = playerVar1 * 0.01 + 0.05;
        player.SetIncmp(da, 20000, 8);

        const db = skill.GetLevel() * 0.16;
        player.SetNingjin(100, db, 10100);

        player.SetSwift(120, 6000 * skill.GetLevel(), skill.GetLevel() * 0.12, skill.GetLevel() * 0.12);//迅疾
        return true
    }

}

/**
 * 6993  赤乌·撑花照影·皓月
 * 令自身进入迅疾状态，施放速度加快60%，移动速度增加60%，持续30秒
 */
class Skill6993 extends BaseHookSkillStub {

    constructor() {
        super(6993);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetVictimNice();

        player.SetSwift(120, 6000 * skill.GetLevel(), skill.GetLevel() * 0.12, skill.GetLevel() * 0.12);//迅疾
        return true
    }

}

/**
 * 6994  赤乌·撑花照影·曦日
 * 令自身进入迅疾状态，施放速度加快60%，移动速度增加60%，持续30秒
 * 令自身攻击力增加40%，增加技能伤害调整为35%，时间调整为30秒。增加气血、真气时间调整为30秒。
 * 蓄势：延长14秒
 * 免疫冰冻延长4秒，免疫禁食延长4秒
 */
class Skill6994 extends BaseHookSkillStub {

    constructor() {
        super(6994);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = 7000 * player.GetSkilllevel(6466) + 10000;
        player.AddCloudShift(120, 30, t);

        player.SetCleardebuff(120, 7);

        const ta = skill.GetLevel() * 20.0;
        player.SetFrozenImmune(ta, 10100);

        player.SetDietImmune(ta, 10100);

        const tb = 5 * skill.GetT0();
        const tc = 5 * skill.GetT0();
        player.SetRandbuff(tb, 4, tc, 5000, 1);

        player.SetAddattack(120, 30000, player.GetMaxatk() * skill.GetLevel() * 0.08, 2);//增加攻击力
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetIncskilldamage(0.35, 30000, 2);

        const d = player.GetVar1() * 0.03 + 0.05;
        player.SetInchp(d, 30000, 8);

        const da = player.GetVar1() * 0.03 + 0.05;

        player.SetIncmp(da, 30000, 8);

        const db = skill.GetLevel() * 0.16;
        player.SetNingjin(100, db, 14100);

        player.SetSwift(120, 6000 * skill.GetLevel(), skill.GetLevel() * 0.14, skill.GetLevel() * 0.14);//迅疾
        return true
    }
}

/**
 * 6458  春水碧天
 * 玄烛·春水碧天·曦日：技能达到5级时，100%概率获得漠视状态
 */
class Skill6458 extends BaseHookSkillStub {

    constructor() {
        super(6458);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(7000) >= 5) {
            player.SetSingleTargetImmune(120, 10000,1.0)
        }
        return true
    }
}

/**
 * 6512  风幢影波
 * 玄烛·风幢影波·曦日：技能达到5级时延长免疫眩晕、魅惑、嘲讽时间10秒
 */
class Skill6512 extends BaseHookSkillStub {

    constructor() {
        super(6512);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let Skilllevel = player.GetSkilllevel(7001);
        let v5 = player.GetSkilllevel(7002) + Skilllevel;
        const xr = player.GetSkilllevel(7003);
        let star_lvl = v5 + xr

        let t = 1000 * (skill.GetLevel() + 1) + 2000 * star_lvl;
        if (xr >= 5) {
            t += 10000
        }

        player.SetImmunetaune(120, t);

        let tb = 2000 * (star_lvl + skill.GetT0());
        if (xr >= 5) {
            tb += 10000
        }

        player.SetImmunesilent(tb);

        let td = 2000 * (star_lvl + skill.GetT0());
        if (xr >= 5) {
            td += 10000
        }

        player.SetImmunedizzy(td);

        let bon = 0;
        if (player.GetSkilllevel(7002) > 0)
            bon = 1000;
        if (player.GetSkilllevel(7003) > 0)
            bon = 2000;

        player.SetImmunesleep(bon + 10100);
        return true
    }

}


export class GuiYunSkillList {
    constructor() {
        new Skill6511()
        new Skill6515()
        new Skill6533()
        new Skill6523()
        new Skill6528()
        new Skill6514()
        new Skill6751()
        new Skill6746()
        new XingLuTingYu()
        new Skill6750()
        new Skill6758()
        new Skill6755()
        new Skill6453()
        new Skill6643()
        new Skill6647()
        new Skill6651()
        new Skill6718()
        new Skill6717()
        new Skill6992()
        new Skill6993()
        new Skill6994()
        new Skill6723()
        new Skill6458()
        new Skill6512()
        new Skill6527()
    }

}