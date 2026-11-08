import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";


/**
 * 4773 神行
 * 冷却30秒，瞬间释放
 */
class Skill4773 extends BaseHookSkillStub {

    constructor() {
        super(4773);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
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
 * 4793  机关术：迷踪
 *
 */
class Skill4793 extends BaseHookSkillStub {

    constructor() {
        super(4793);
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
 * 5249  木甲技·点破清光
 * 无冷却
 */
class Skill5249 extends BaseHookSkillStub {

    constructor() {
        super(5249);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

}

/**
 * 4777  蛮烟
 * 瞬间释放，提升自身真气上限22%
 */
class Skill4777 extends BaseHookSkillStub {

    constructor() {
        super(4777);
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
        player.SetIncmp(skill.GetLevel() * 0.04 + 0.02, 1800000, 5)
        return true
    }
}

/**
 * 4781  灵言心甲
 * 瞬间释放
 *
 * 灵言心甲II：令灵言心甲的抗性提升调整为48%
 */
class Skill4781 extends BaseHookSkillStub {

    constructor() {
        super(4781);
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
        const d = skill.GetT2() * 0.01;
        const da = skill.GetT1() * 0.048 + d + skill.GetLevel() * 0.01;
        player.SetIncanti(da, 600000);
        return true
    }
}

/**
 * 4801  涡流
 * 冷却减少30秒
 *
 * 玄烛·涡流·曦日：提升友方暴击伤害和减暴击伤害调整为20%*level，持续时间20秒
 */
class Skill4801 extends BaseHookSkillStub {

    constructor() {
        super(4801);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Var1 = player.GetVar1();
        const v5 = player.GetVar2() + Var1;
        const star_lvl = v5 + player.GetVar3();

        const v8 = skill.GetLevel() + 7;
        const t = 1000 * (v8 + skill.GetT1());
        const v11 = skill.GetLevel() + 7;
        const ta = v11 + skill.GetT0();
        player.SetSpeedto(120, ta, t, 1);

        const tb = 120 * star_lvl;
        const tc = star_lvl * 0.2;
        player.SetInccrithurt(tb, tc, 20100, 4);
        player.SetDecfatalhurt(tb, tc, 20100, 4);
        return true
    }


}

/**
 * 5001  裂地机器人技能
 *眩晕时间3秒
 */
class Skill5001 extends BaseHookSkillStub {

    constructor() {
        super(5001);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let buffLevel = player.GetBufflevel(4260);
        let da = buffLevel * player.GetVar(2);
        player.SetSubantidizzy2(120, da, 99, 20000);

        let Var1 = player.GetVar(1);
        let da2 = Var1 + 10 * player.GetVar(3);

        player.SetDizzy(da2, 3000);

        player.SetSeed(120, 10, 20000);
        return true
    }

}

/**
 * 5002  通天机器人技能
 * 眩晕时间3秒
 */
class Skill5002 extends BaseHookSkillStub {

    constructor() {
        super(5002);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        let d = player.GetVar(1);
        player.SetDizzy(d, 3000);
        player.SetSeed(120, 20, 20000);
        return true
    }
}

/**
 * 4778  神机：诡雷
 * 施法1秒
 */
class Skill4778 extends BaseHookSkillStub {

    constructor() {
        super(4778);
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
 * 4794  机关术：余烬
 * 施法1秒
 */
class Skill4794 extends BaseHookSkillStub {

    constructor() {
        super(4794);
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
 * 4802  机关术：飞泉
 *
 */
class Skill4802 extends BaseHookSkillStub {

    constructor() {
        super(4802);
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
 * 4811  机关术：红尘
 *
 */
class Skill4811 extends BaseHookSkillStub {

    constructor() {
        super(4811);
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
 * 4818  机关术：裂地
 *
 */
class Skill4818 extends BaseHookSkillStub {

    constructor() {
        super(4818);
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
 * 4797  召唤：燃薪
 * 施法1秒，删除共享CD
 */
class Skill4797 extends BaseHookSkillStub {

    constructor() {
        super(4797);
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
        const t = (10000 * skill.GetT0() + 20000);
        player.SetPossummon(58860, 1, t);
        // player.SetProbability(120.0);
        // player.SetTime(30000.0);
        // player.SetRatio(4806.0);
        // player.SetAmount(4815.0);
        // player.SetValue(0.0);
        // player.SetSetcooldown(1);

        return true
    }

}

/**
 * 4806  召唤：浩渺
 * 施法1秒，删除共享CD
 */
class Skill4806 extends BaseHookSkillStub {

    constructor() {
        super(4806);
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
        const t = (10000 * skill.GetT0() + 20000);
        player.SetPossummon(58861, 1, t);
        return true
    }
}

/**
 * 4815  召唤：菡萏
 * 更快捷的召唤速度，且不再共享 CD（最多仍只能存在一个机关)
 */
class Skill4815 extends BaseHookSkillStub {

    constructor() {
        super(4815);
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
        const t = (10000 * skill.GetT0() + 20000);
        player.SetPossummon(58862, 1, t);
        return true
    }
}

/**
 * 4817  木甲术·山洪
 * 施法1.5秒，瞬间冷却；
 */
class Skill4817 extends BaseHookSkillStub {

    constructor() {
        super(4817);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
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

}

/**
 * 4790  木甲术：燎原
 * 每一击可为自身叠加5层“灵种”，持续20秒；每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
 */
class Skill4790 extends BaseHookSkillStub {

    constructor() {
        super(4790);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res3 = player.GetRes3();
        player.SetVar1(res3);
        let res4;
        if (player.GetPuppetid() === 4) {
            res4 = player.GetRes4();
        } else {
            res4 = 0;
        }
        player.SetVar2(res4);
        player.SetVar3(1);
        let res5;
        if (player.GetPuppetid() === 3) {
            res5 = player.GetRes5();
        } else {
            res5 = 0;
        }
        player.SetVar4(res5);
        const skilllevel = player.GetSkilllevel(5166);
        player.SetVar5(skilllevel);
        const skilllevel2 = player.GetSkilllevel(5167);
        player.SetVar6(skilllevel2);
        const skilllevel3 = player.GetSkilllevel(5168);
        player.SetVar7(skilllevel3);
        let v24;
        if (player.GetPuppetid() === 2) {
            v24 = 0.1;
        } else {
            v24 = 0;
        }
        skill.SetCrit(v24);
        const v29 = (skill.GetLevel() * 0.01 + 1.08);
        let v26;
        if (player.GetPuppetid() === 1) {
            v26 = 0.1;
        } else {
            v26 = 0.0;
        }
        const v30 = v26 + v29;
        skill.SetRatio(v30);
        const v28 = (35 * skill.GetLevel() + 150);
        // 每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
        skill.SetPlus(v28 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar3(0);
        let v4;
        if (player.GetPuppetid() == 2)
            v4 = 0.1;
        else
            v4 = 0;
        skill.SetCrit(v4);
        const v9 = (skill.GetLevel() * 0.01 + 1.08);
        let v6;
        if (player.GetPuppetid() == 1)
            v6 = 0.1;
        else
            v6 = 0.0;
        const v10 = v6 + v9;
        skill.SetRatio(v10);
        const v8 = (35 * skill.GetLevel() + 150);
        // 每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar3(0);
        let v4;
        if (player.GetPuppetid() == 2)
            v4 = 0.1;
        else
            v4 = 0;
        skill.SetCrit(v4);
        const v9 = (skill.GetLevel() * 0.01 + 1.08);
        let v6;
        if (player.GetPuppetid() == 1)
            v6 = 0.1;
        else
            v6 = 0.0;
        const v10 = v6 + v9;
        skill.SetRatio(v10);
        const v8 = (35 * skill.GetLevel() + 150);
        // 每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = (skill.GetLevel() * 0.02 + 0.0001);
        player.SetInccritrate(7000, d, 0);

        player.AddSpiritSeed(120, 5, 20000);
        return true
    }
}

/**
 * 4799  木甲术：浩渺
 * 每一击可为自身叠加5层“灵种”，持续20秒；每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
 */
class Skill4799 extends BaseHookSkillStub {

    constructor() {
        super(4799);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        const res5 = player.GetRes5();
        player.SetVar2(res5);
        if (player.GetPuppetid() === 4) {
            const res4 = player.GetRes4();
            player.SetVar3(res4);
        } else {
            player.SetVar3(0);
        }
        if (player.GetPuppetid() === 3) {
            const res5 = player.GetRes5();
            player.SetVar4(res5);
        } else {
            player.SetVar4(0);
        }
        const skilllevel = player.GetSkilllevel(5166);
        player.SetVar5(skilllevel);
        const skilllevel2 = player.GetSkilllevel(5167);
        player.SetVar6(skilllevel2);
        const skilllevel3 = player.GetSkilllevel(5168);
        player.SetVar7(skilllevel3);
        const res5_2 = player.GetRes5();
        const res4_2 = player.GetRes4();
        const res3 = player.GetRes3();
        const res2 = player.GetRes2();
        const res1 = player.GetRes1();
        const totalRes = res4_2 + res3 + res2 + res1 + res5_2;
        player.SetVar8(totalRes);
        const crit = player.GetCrit();
        player.SetVar9(crit);
        let v24;
        if (player.GetPuppetid() === 2) {
            v24 = 0.1;
        } else {
            v24 = 0;
        }
        skill.SetCrit(v24);
        let v38;
        if (player.GetPuppetid() === 1) {
            v38 = (skill.GetLevel() * 0.01 + 1.12 + 0.1);
        } else {
            v38 = (skill.GetLevel() * 0.01 + 1.12);
        }
        skill.SetRatio(v38);
        const v40 = (50 * skill.GetLevel() + 300);
        // 每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
        skill.SetPlus(v40 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        const res5 = player.GetRes5();
        const res4 = player.GetRes4();
        const res3 = player.GetRes3();
        const res2 = player.GetRes2();
        const res1 = player.GetRes1();
        const totalRes = res4 + res3 + res2 + res1 + res5;
        player.SetVar8(totalRes);
        const crit = player.GetCrit();
        player.SetVar9(crit);
        let v16;
        if (player.GetPuppetid() === 2) {
            v16 = 0.1;
        } else {
            v16 = 0;
        }
        skill.SetCrit(v16);
        let v18;
        if (player.GetPuppetid() === 1) {
            v18 = (skill.GetLevel() * 0.01 + 1.12 + 0.1);
        } else {
            v18 = (skill.GetLevel() * 0.01 + 1.12);
        }
        skill.SetRatio(v18);
        const v20 = (50 * skill.GetLevel() + 300);
        // 每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
        skill.SetPlus(v20 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        const res5 = player.GetRes5();
        const res4 = player.GetRes4();
        const res3 = player.GetRes3();
        const res2 = player.GetRes2();
        const res1 = player.GetRes1();
        const totalRes = res4 + res3 + res2 + res1 + res5;
        player.SetVar8(totalRes);
        const crit = player.GetCrit();
        player.SetVar9(crit);
        let v16;
        if (player.GetPuppetid() === 2) {
            v16 = 0.1;
        } else {
            v16 = 0;
        }
        skill.SetCrit(v16);
        let v18;
        if (player.GetPuppetid() === 1) {
            v18 = (skill.GetLevel() * 0.01 + 1.12 + 0.1);
        } else {
            v18 = (skill.GetLevel() * 0.01 + 1.12);
        }
        skill.SetRatio(v18);
        const v20 = (50 * skill.GetLevel() + 300);
        // 每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
        skill.SetPlus(v20 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.AddSpiritSeed(120, 5, 20000);
        return true
    }

}

/**
 * 4809  木甲术：百劫
 * 每一击可为自身叠加5层“灵种”，持续20秒；每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
 */
class Skill4809 extends BaseHookSkillStub {

    constructor() {
        super(4809);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        const res4 = player.GetRes4();
        player.SetVar2(res4);
        let v8;
        if (player.GetPuppetid() == 4) {
            v8 = player.GetRes4();
        } else {
            v8 = 0;
        }
        player.SetVar3(v8);
        if (player.GetPuppetid() == 5) {
            player.SetVar4(1);
        } else {
            player.SetVar4(0);
        }

        let Res5;
        if (player.GetPuppetid() == 3) {
            Res5 = player.GetRes5();
        } else {
            Res5 = 0;
        }
        player.SetVar5(Res5);
        const skilllevel = player.GetSkilllevel(5166);
        player.SetVar6(skilllevel);
        const skilllevel2 = player.GetSkilllevel(5167);
        player.SetVar7(skilllevel2);
        const skilllevel3 = player.GetSkilllevel(5168);
        player.SetVar8(skilllevel3);
        const maxmp = player.GetMaxmp();
        player.SetVar9(maxmp);
        let v30;
        if (player.GetPuppetid() == 2) {
            v30 = 0.1;
        } else {
            v30 = 0;
        }
        skill.SetCrit(v30);
        const v35 = (skill.GetLevel() * 0.01 + 1.2);
        let v32;
        if (player.GetPuppetid() == 1) {
            v32 = 0.1;
        } else {
            v32 = 0.0;
        }
        const v36 = v32 + v35;
        skill.SetRatio(v36);
        const v34 = (100 * skill.GetLevel() + 800);
        skill.SetPlus(v34 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        let v4;
        if (player.GetPuppetid() === 2) {
            v4 = 0.1;
        } else {
            v4 = 0;
        }
        skill.SetCrit(v4);
        const v9 = (skill.GetLevel() * 0.01 + 1.2);
        let v6;
        if (player.GetPuppetid() === 1) {
            v6 = 0.1;
        } else {
            v6 = 0.0;
        }
        const v10 = v6 + v9;
        skill.SetRatio(v10);
        const v8 = (100 * skill.GetLevel() + 800);
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);

    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        let v4;
        if (player.GetPuppetid() === 2) {
            v4 = 0.1;
        } else {
            v4 = 0;
        }
        skill.SetCrit(v4);
        const v9 = (skill.GetLevel() * 0.01 + 1.2);
        let v6;
        if (player.GetPuppetid() === 1) {
            v6 = 0.1;
        } else {
            v6 = 0.0;
        }
        const v10 = v6 + v9;
        skill.SetRatio(v10);
        const v8 = (100 * skill.GetLevel() + 800);
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);

    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        let v4;
        if (player.GetPuppetid() === 2) {
            v4 = 0.1;
        } else {
            v4 = 0;
        }
        skill.SetCrit(v4);
        const v9 = (skill.GetLevel() * 0.01 + 1.2);
        let v6;
        if (player.GetPuppetid() === 1) {
            v6 = 0.1;
        } else {
            v6 = 0.0;
        }
        const v10 = v6 + v9;
        skill.SetRatio(v10);
        const v8 = (100 * skill.GetLevel() + 800);
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);

    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.AddSpiritSeed(120, 5, 20000);
        return true
    }

}

/**
 * 5286  木甲术：燎原II
 * 每一击可为自身叠加5层“灵种”，持续20秒；每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
 */
class Skill5286 extends BaseHookSkillStub {

    constructor() {
        super(5286);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {

        const player = skill.GetPlayerNice();
        const res3 = player.GetRes3();
        player.SetVar1(res3);
        if (player.GetPuppetid() === 4) {
            const res4 = player.GetRes4();
            player.SetVar2(res4);
        } else {
            player.SetVar2(0);
        }
        player.SetVar3(1);
        if (player.GetPuppetid() === 3) {
            const res5 = player.GetRes5();
            player.SetVar4(res5);
        } else {
            player.SetVar4(0);
        }
        const skilllevel = player.GetSkilllevel(5166);
        player.SetVar5(skilllevel);
        const skilllevel2 = player.GetSkilllevel(5167);
        player.SetVar6(skilllevel2);
        const skilllevel3 = player.GetSkilllevel(5168);
        player.SetVar7(skilllevel3);
        let v24;
        if (player.GetPuppetid() === 2) {
            v24 = 0.1;
        } else {
            v24 = 0;
        }
        skill.SetCrit(v24);
        let v26;
        if (player.GetPuppetid() === 1) {
            v26 = (skill.GetLevel() * 0.01 + 1.0 + 0.1);
        } else {
            v26 = (skill.GetLevel() * 0.01 + 1.0);
        }
        skill.SetRatio(v26);
        const v28 = (180 * skill.GetLevel() + 1450);
        skill.SetPlus(v28 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar3(0);
        let v4;
        if (player.GetPuppetid() === 2)
            v4 = 0.1;
        else
            v4 = 0;
        skill.SetCrit(v4);
        let v6;
        if (player.GetPuppetid() === 1)
            v6 = (skill.GetLevel() * 0.01 + 1.0 + 0.1);
        else
            v6 = (skill.GetLevel() * 0.01 + 1.0);
        skill.SetRatio(v6);
        const v8 = (180 * skill.GetLevel() + 1450);
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar3(0);
        let v4;
        if (player.GetPuppetid() === 2)
            v4 = 0.1;
        else
            v4 = 0;
        skill.SetCrit(v4);
        let v6;
        if (player.GetPuppetid() === 1)
            v6 = (skill.GetLevel() * 0.01 + 1.0 + 0.1);
        else
            v6 = (skill.GetLevel() * 0.01 + 1.0);
        skill.SetRatio(v6);
        const v8 = (180 * skill.GetLevel() + 1450);
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.AddSpiritSeed(120, 5, 20000);
        return true
    }
}

/**
 * 5287  木甲术：浩渺II
 * 每一击可为自身叠加5层“灵种”，持续20秒；每一层灵种额外附加6%最大攻击力与2%气血与真气上限之和的攻击力
 */
class Skill5287 extends BaseHookSkillStub {

    constructor() {
        super(5287);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(1);
        const Res5 = player.GetRes5();
        player.SetVar2(Res5);
        let Res4;
        if (player.GetPuppetid() === 4) {
            const Res4 = player.GetRes4();
        } else {
            Res4 = 0;
        }
        player.SetVar3(Res4);
        let v12;
        if (player.GetPuppetid() === 3) {
            v12 = player.GetRes5();
        } else {
            v12 = 0;
        }
        player.SetVar4(v12);
        const Skilllevel = player.GetSkilllevel(5166);
        player.SetVar5(Skilllevel);
        const v18 = player.GetSkilllevel(5167);
        player.SetVar6(v18);
        const v21 = player.GetSkilllevel(5168);
        player.SetVar7(v21);
        let v24;
        if (player.GetPuppetid() === 2) {
            v24 = 0.1;
        } else {
            v24 = 0;
        }
        skill.SetCrit(v24);
        let v26;
        if (player.GetPuppetid() === 1) {
            v26 = (skill.GetLevel() * 0.01 + 1.0 + 0.1);
        } else {
            v26 = (skill.GetLevel() * 0.01 + 1.0);
        }
        skill.SetRatio(v26);
        const v28 = (200 * skill.GetLevel() + 1500);
        skill.SetPlus(v28 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        if (player.GetPuppetid() === 2) {
            skill.SetCrit(0.1);
        } else {
            skill.SetCrit(0);
        }
        let v6;
        if (player.GetPuppetid() === 1) {
            v6 = (skill.GetLevel() * 0.01 + 1.0 + 0.1);
        } else {
            v6 = (skill.GetLevel() * 0.01 + 1.0);
        }
        skill.SetRatio(v6);
        const v8 = (200 * skill.GetLevel() + 1500);
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        if (player.GetPuppetid() === 2) {
            skill.SetCrit(0.1);
        } else {
            skill.SetCrit(0);
        }
        let v6;
        if (player.GetPuppetid() === 1) {
            v6 = (skill.GetLevel() * 0.01 + 1.0 + 0.1);
        } else {
            v6 = (skill.GetLevel() * 0.01 + 1.0);
        }
        skill.SetRatio(v6);
        const v8 = (200 * skill.GetLevel() + 1500);
        skill.SetPlus(v8 + player.GetSpiritSeed() * (player.GetMaxatk() * 0.06 + player.GetMaxHPAndMP() * 0.02));
        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.AddSpiritSeed(120, 5, 20000);
        return true
    }
}

// /**
// * 5288  木甲术：百劫II
// * 伤害额外增加比例提高为20%
// */
// class Skill5288 extends BaseHookSkillStub {
//
//     constructor() {
//         super(5288);
//     }
//
// }


/**
 * 4796  李代桃僵
 * 李代桃僵II：额外被动降低李代桃僵的冷却20秒
 */
class Skill4796 extends BaseHookSkillStub {

    constructor() {
        super(4796);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(5292) > 0) {
            return 40000
        } else {
            return 60000
        }
    }

}

/**
 * 5297  海市蜃楼II
 * 改为被动技能；额外令海市蜃楼III《英雄》，在20秒内提升自身的隐身能力20点
 */
class Skill5297 extends BaseHookSkillStub {

    constructor() {
        super(5297);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {

        return true
    }

}

/**
 * 5304  木甲术：山洪<玄>
 *
 */
class Skill5304 extends BaseHookSkillStub {

    constructor() {
        super(5304);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

}

/**
 * 5308
 *
 */
class Skill5308 extends BaseHookSkillStub {

    constructor() {
        super(5308);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

}

/**
 * 5316
 *
 */
class Skill5316 extends BaseHookSkillStub {

    constructor() {
        super(5316);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

}

/**
 * 5302  召唤：通天<玄>
 * 施法1秒
 */
class Skill5302 extends BaseHookSkillStub {

    constructor() {
        super(5302);
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
 * 5306
 *
 */
class Skill5306 extends BaseHookSkillStub {

    constructor() {
        super(5306);
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
 * 5314
 *
 */
class Skill5314 extends BaseHookSkillStub {

    constructor() {
        super(5314);
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
 * 5884  海市蜃楼III《英雄》
 * 提高技能命中45点，持续时间15秒
 *
 * 5297海市蜃楼II
 * 改为被动技能；额外令海市蜃楼III《英雄》，在20秒内提升自身的隐身能力20点
 */
class Skill5884 extends BaseHookSkillStub {

    constructor() {
        super(5884);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const ta = skill.GetLevel() * 0.15;
        player.SetIncskillaccu(100, ta, skill.GetLevel() * 5000, 5);

        if (player.GetSkilllevel(5297) > 0) {
            player.SetAddhide(120, 20, 20000, 3)
        }

        return true
    }

}

/**
 * 6946  赤乌·文心雕龙·曦日
 * 冷却40秒，增加自身命中和技能伤害的时间25秒
 */
class Skill6946 extends BaseHookSkillStub {

    constructor() {
        super(6946);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetInvincible(18100);

        player.SetCleardebuff(120, 6);

        const d = skill.GetLevel() * 0.04;
        player.SetIncskillaccu(100, d, 25000, 6);

        player.SetIncskilldamage(d, 25000, 8);

        player.SetSetcooldown(120, 90000, 4805, 6945, 6944);
        return true
    }

}

/**
 * 4792  如归
 * 玄烛·如归·曦日：12秒内提升攻击力50%
 */
class Skill4792 extends BaseHookSkillStub {

    constructor() {
        super(4792);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDodge(5000, 15);

        const d = 100 * skill.GetT0();
        const da = skill.GetT0() + 7;
        player.SetSpeedto(d, da, 5000, 2);

        const Skilllevel = player.GetSkilllevel(6947);
        const v13 = player.GetSkilllevel(6948) + Skilllevel;
        const star_lvl = v13 + player.GetSkilllevel(6949);
        const db = 100 * star_lvl;
        const dc = star_lvl * 0.1;

        player.SetIncattack(db, 12000, dc, 1);

        let star_clear_c = 0;
        if (player.GetSkilllevel(6947) > 0)
            star_clear_c = 30;
        if (player.GetSkilllevel(6948) > 0)
            star_clear_c = 60;
        if (player.GetSkilllevel(6949) > 0)
            star_clear_c = 120;
        player.SetDispel(star_clear_c, 58, 32, 4266);
        return true
    }

}

/**
 * 4812  慧眼问道
 * 玄烛·慧眼问道·曦日：8秒内增加技能命中50点；免疫冰冻效果10秒
 */
class Skill4812 extends BaseHookSkillStub {

    constructor() {
        super(4812);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Skilllevel = player.GetSkilllevel(6953);
        const v5 = player.GetSkilllevel(6954) + Skilllevel;
        const star_lvl = v5 + player.GetSkilllevel(6955);
        let ratio = 0;
        if (player.GetSkilllevel(6953) > 0)
            ratio = 0.2;
        if (player.GetSkilllevel(6954) > 0)
            ratio = 0.3;
        if (player.GetSkilllevel(6955) > 0)
            ratio = 0.5;
        const d = 100 * star_lvl;

        player.SetIncskillaccu(d, ratio, 8100, 7);

        const da = 2100 * star_lvl;
        player.SetFrozenImmune(d, da);
        return true
    }

}

/**
 * 5250  墨染经年
 * 施法1.5秒，瞬间冷却；
 * 瞬间叠加20层种子，
 * 群体攻击目标18次，每次附加自身当前气血5%，当前真气5%攻击力。
 * 攻击怪物目标时，每击附加自身当前气血10%的攻击力，对怪暴击伤害80%
 */
class Skill5250 extends BaseHookSkillStub {

    constructor() {
        super(5250);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
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

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }


    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }


    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }


    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }


    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const Res5 = player.GetRes5();
        const v5 = player.GetRes4() + Res5;
        const v7 = player.GetRes3() + v5;
        const v9 = player.GetRes2() + v7;
        const v12 = v9 + player.GetRes1();
        let p = v12 + player.GetHp() * 0.05 % +player.GetMp() * 0.05;
        skill.SetPlus(p);

        skill.SetMobBonusDamage(player.GetHp() * 0.1)
        skill.SetMobCrithurt(0.8)

        player.SetPerform(0);
        player.SetPerform(0);
    }
}

/**
 * 5247  蹑影追风
 * 冷却减少120秒，优化施法，自身技能命中提升25点，抗性提升128点
 */
class Skill5247 extends BaseHookSkillStub {

    constructor() {
        super(5247);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000;
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
        const player = skill.GetVictimNice();
        player.SetAddspeed(120, 20000, 5, 1);
        player.SetAddanti(128, 20000, 0);
        player.SetIncskillaccu(120, 0.25, 20000, 5)
        return true
    }

}

/**
 * 木甲术：百劫II：引爆伤害额外增加比例提高为20%
 * 心境澄明II：令召唤的种子机关气血比例提高到100%
 */
export class QianJiSkillList {
    constructor() {
        new Skill4773()
        new Skill4793()
        new Skill5249()
        new Skill4777()
        new Skill4781()
        new Skill5001()
        new Skill5002()
        new Skill4778()
        new Skill4794()
        new Skill4802()
        new Skill4811()
        new Skill4818()
        new Skill4797()
        new Skill4806()
        new Skill4815()
        new Skill4817()
        new Skill4790()
        new Skill4799()
        new Skill4809()
        new Skill5286()
        new Skill5287()
        new Skill4796()
        new Skill5297()
        new Skill5304()
        new Skill5308()
        new Skill5316()
        new Skill5302()
        new Skill5306()
        new Skill5314()
        new Skill5884()
        new Skill6946()
        new Skill4792()
        new Skill4812()
        new Skill5250()
        new Skill5247()
        new Skill4801()
    }
}