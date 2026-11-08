import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 243  追风咒
 * 冷却减少30秒；
 * 天书-迅疾：坐骑极速提升13秒。
 * 坐骑速度提升到5米/秒
 */
class Skill243 extends BaseHookSkillStub {

    constructor() {
        super(243);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let t = (2000 * skill.GetLevel() + 10100);
        let ta = skill.GetLevel() * 0.4 + 0.2;
        player.SetAddspeed(120, t, ta, 1);

        let v8 = 1000 * skill.GetT0() + 2000;
        let tb = (v8 * skill.GetLevel() + 10100);
        let v11 = 2 * skill.GetLevel();
        let tc = (v11 * (skill.GetT0() + 1));
        player.SetAdddodge(120, tb, tc, 1);

        let v14;
        if (skill.GetT0() == 2) {
            v14 = 120;
        } else {
            v14 = 0;
        }
        let v16 = 11000 * skill.GetLevel();
        let td = (v16 * skill.GetT0() + 100) + 13000;
        player.SetIncmountspeed(v14, td, 5, 0);

        let T0 = skill.GetT0();
        let te = (120 * norm(T0));
        let tf = (2 * skill.GetT0());
        player.SetIncmountspeed(te, 30000, tf, 1);
        return true
    }

}

/**
 * 260  锐金咒
 * 新增：增加自身技能命中 20 点，持续 20秒
 */
class Skill260 extends BaseHookSkillStub {

    constructor() {
        super(260);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskillaccu(120, 0.2, 20000, 1)
        return true
    }

}

/**
 * 249  枯木咒
 * 冷却降低40秒
 * 6805玄烛·痴情咒·曦日：减害比例调整为30%，提升致命一击伤害调整为20%*level
 * 新增效果：“枯木咒”可增加自身防御力 3.0 倍，持续 6*level 秒
 */
class Skill249 extends BaseHookSkillStub {

    constructor() {
        super(249);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 40000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const level = player.GetSkilllevel(6805)
        if (level > 0) {
            player.SetIncdefence(120, 6000 * level, 3.0, 4)
        }
        return true
    }
}

/**
 * 314  痴情咒
 * 施法1秒，冷却固定80秒；
 * 减伤比例每级提高2%；
 * 20秒内附加迅疾状态，速度加快40%，只对自身有效
 *
 * 6805玄烛·痴情咒·曦日：减害比例调整为30%，提升致命一击伤害调整为20%*level
 * 新增效果：“枯木咒”可增加自身防御力 3.0 倍，持续 6*level 秒
 */
class Skill314 extends BaseHookSkillStub {

    constructor() {
        super(314);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 80000
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
        const player = skill.GetPlayerNice();
        let bon = 0.0;
        if (player.GetSkilllevel(6803)) {
            bon = 0.02;
        }

        if (player.GetSkilllevel(6804)) {
            bon = 0.050000001;
        }

        if (player.GetSkilllevel(6805)) {
            bon = 0.1;
        }

        player.SetVar2(bon)

        super.Calculate2(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v2 = (skill.GetT0() <= 0) ? 0 : 120;
        let t = 60000 * skill.GetT0();
        let ta = skill.GetT0() * 0.1 + 0.00001;
        let tb = player.GetMaxmp() * (skill.GetT0() * 0.06);
        player.SetAddhp2(v2, tb, ta, t, 1);

        let T1 = skill.GetT1();
        const r = 120 * norm(T1);
        let v12 = 1000 * skill.GetLevel() + 14100;
        const tt = v12 + 2000 * skill.GetT0();
        let v15 = 80 * skill.GetLevel();
        const v = v15 * skill.GetT1();
        player.SetAdddefence(r, tt, v, 1);

        let v19 = (player.GetVar1() <= 950) ? 0.0 : 120 * norm(skill.GetT0() / 3.9);
        let tc = player.GetMaxhp();
        player.SetHeal(v19, tc, 0);

        let Skilllevel = player.GetSkilllevel(6803);
        let v28 = player.GetSkilllevel(6804) + Skilllevel;
        let slvl = v28 + player.GetSkilllevel(6805);
        let td = 120 * slvl;
        let te = slvl * 0.2;
        player.SetInccrithurt(td, te, 8100, 8);

        const rr = skill.GetLevel() * 0.05
        player.SetSwift(120, skill.GetLevel() * 2000 + 4100, rr, rr)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let bon = 0.0;
        const playerSkill = skill.GetPlayerNice();

        if (playerSkill.GetSkilllevel(6803)) {
            bon = 0.02;
        }
        if (playerSkill.GetSkilllevel(6804)) {
            bon = 0.050000001;
        }
        if (playerSkill.GetSkilllevel(6805)) {
            bon = 0.3;
        }

        let v2 = 1000 * skill.GetLevel() + 14100;
        let t = v2 + 2000 * skill.GetT0();

        let ta = skill.GetLevel() * 0.04 + 0.15 + player.GetVar2() + bon;

        const level = skill.GetLevel();
        const maxmp = player.GetMaxmp();
        let tb = level * maxmp;
        tb = (skill.GetT1() * 7.5 + 1.0) * tb;
        player.SetDechurt(t, ta, tb);
        return true
    }

}

/**
 * 526 无间寂
 * 冷却降低24秒；
 * 令目标受到伤害加深，最多积累5次，每次加深1%。
 * 如目标被魅惑，则附加相同时间的变乌龟状态（仅对玩家有效）
 */
class Skill526 extends BaseHookSkillStub {

    constructor() {
        super(526);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 24000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v4;

        if (player.GetVar1() <= 900) {
            v4 = 900.0;
        } else {
            v4 = player.GetVar1();
        }

        const t = (1000 * skill.GetLevel() + 3000);
        const tValue = ((skill.GetT1() * 0.3 + 1.0) * t + 100.0);
        player.SetWrap(v4, tValue);

        const levelFactor = (1.0 - player.GetLevel() * 0.002) * 100.0;
        const timeValue = (-2000 * skill.GetT2() + 14000);
        const v12 = 120 * skill.GetLevel() + 60;
        const v13 = skill.GetT2() * v12;
        const v14Value = (v13 * skill.GetLevel());
        player.SetHpleak(levelFactor, timeValue, v14Value, 0, 1);

        if (player.GetVar2() <= 900) {
            v4 = 900.0;
        } else {
            v4 = player.GetVar2();
        }

        const ta = (2050 * skill.GetT1());
        player.SetTime(ta);
        player.SetSilent(v4, ta);
        if (player.GetTypeIsPlayer()) {
            player.SetTransform(-1, 956, 1, 1, ta);
        }

        const tb = (1000 * skill.GetLevel() + 3000);
        const tbValue = ((skill.GetT1() * 0.3 + 1.0) * tb + 100.0);
        player.SetSlow(900, 1.0, tbValue, 1);

        player.SetCursed(0.01, 5, ta);
        return true
    }

}

/**
 * 261   逆水咒
 * 冷却固定80秒
 * 新增：若自身技能命中高于目标，则清除目标心斋、格挡、真气盾、效果反弹、牺牲、屏障、神佑状态（仅对玩家有效）
 */
class Skill261 extends BaseHookSkillStub {

    constructor() {
        super(261);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar2(player.GetSkillrate())
        player.SetIgnoreblessed(120, 1000)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetVar2() > player.GetSkillrate() && player.GetTypeIsPlayer()) {
            //格挡2，格挡
            if (player.GetHasbuff(9307) || player.GetHasbuff(4294)) {
                player.SetDispel(120, 9307, 9307, 4294)
                return true
            }

            //牺牲
            if (player.GetHasbuff(9320)) {
                player.SetDispel(120, 9320, 9320, 9320)
                return true
            }

            //神佑
            if (player.GetHasbuff(4119)) {
                player.SetDispel(120, 4119, 4119, 4119)
                return true
            }

            //心斋
            if (player.GetHasbuff(9386)) {
                player.SetDispel(120, 9386, 9386, 9386)
                return true
            }

            //效果反弹。（没有生效，镜子清不了）
            if (player.GetHasbuff(4188)) {
                player.SetDispel(120, 4188, 4188, 4188)
                return true
            }

            //屏障，屏障2
            if (player.GetHasbuff(9339)||player.GetHasbuff(9343)) {
                player.SetDispel(120, 9339, 9343, 9339)
                return true
            }
        }

        return true
    }

}

/**
 * 522   明王降世
 * 冷却减少30秒，
 * 祝福自身24秒神佑，免疫次数加强为80次；前10秒处于无敌状态；
 * 额外16秒内增加自身减暴伤100%，
 * 20秒内保护自身有利状态不被清除
 */
class Skill522 extends BaseHookSkillStub {

    constructor() {
        super(522);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 30000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const t = (2000 * skill.GetT1() + 24100);
        const v3 = 10 * skill.GetLevel();
        const v4 = 2 * skill.GetT0();
        const ta = (v3 + v4 * skill.GetLevel());
        player.SetBlessed(ta, t);

        const T0 = skill.GetT0();
        const tb = (1500 * norm(T0 / 1.5) + 10000);
        player.SetInvincible(tb);

        player.SetDecfatalhurt(120, 0.2 + skill.GetLevel() * 0.1, 2000 * skill.GetLevel(), 2)
        player.SetBuffClearImmune(120, skill.GetLevel() * 2000 + 4100)

        return true
    }

}

/**
 * 651   天书-惟我
 * 无冷却，攻击怪物目标时额外附加自身真气上限5%的攻击力
 */
class Skill651 extends BaseHookSkillStub {

    constructor() {
        super(651);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.05)
        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 524   化血魔心
 * 额外获得7秒无视神佑状态
 * 玄烛·化血魔心·曦日：
 * 施法后下一次攻击必定是致命一击，持续3*level秒
 * 达到5级时，令化血魔心增加5秒无视神佑、无敌效果
 *
 */
class Skill524 extends BaseHookSkillStub {

    constructor() {
        super(524);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        const xr = player.GetSkilllevel(6808)
        if (xr > 0) {
            player.SetMakecrit(3000 * xr)
        }

        return true
    }

}

/**
 * 262   天魔附体
 * 无冷却。30分钟内提升爆伤30%，暴击10%。优化施法
 */
class Skill262 extends BaseHookSkillStub {

    constructor() {
        super(262);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInccritrate(1800000, skill.GetLevel() * 0.02, 7)
        player.SetInccrithurt(120, skill.GetLevel() * 0.06, 1800000, 7)
        return true
    }
}

/**
 * 257   魔性大发
 * 冷却减少50秒，
 * 并在15秒内免疫嘲讽，优化施法
 * 自身祝福，令单体攻击技能距离增加8米，持续15秒。
 * 自身祝福，技能命中提升80点，持续15秒。
 */
class Skill257 extends BaseHookSkillStub {

    constructor() {
        super(257);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 50000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetVictimNice();
        player.SetIncskillaccu(120, 0.8, 15000, 1)
        player.SetSingleatkchange(120, 15000, 8, 0)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetDispel(120, 4272, 4098, 4272);

        const t = (2000 * skill.GetT1() + 20100);
        const v9 = 4 * skill.GetLevel();
        const v10 = skill.GetT0() * v9;
        const ta = (v10 + 10 * skill.GetLevel() + 20);
        player.SetAddantisilent(t, ta, 2);

        const tb = (10 * skill.GetT3());
        player.SetClearwrap(tb);

        const tc = (2000 * (skill.GetLevel() + 1100));
        player.SetImmunetaune(120, tc);
        return true
    }


}

/**
 * 248   火焰刀
 * 冷却时间增加8秒。
 * 追加本体攻击力20%，附加攻击力2240点。
 * 效果重写：降低目标伤害减免10%，令目标进入焱阳状态，持续12秒；
 * 为目标增加最多3层灼烧状态，每层灼烧状态持续12秒，造成伤害总量为人物眩晕抗性的120倍。
 * 冰火不容：
 * 当目标处于冰冻状态时，解除目标的冰冻状态，追加自身真气上限2倍的白伤害（仅对玩家有效）
 */
class Skill248 extends BaseHookSkillStub {

    constructor() {
        super(248);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) + 8000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const v12 = (skill.GetT3() * 0.05 + 1.2);
        skill.SetRatio(v12);

        const Level = skill.GetLevel();
        const v9 = Math.floor(1.42 - Level * 0.05);
        const v6 = Level * 0.014;
        const v7 = Level * v6;
        const v10 = ((Level * 2.9 + v7 + 34.0) * v9);
        const v8 = Math.floor(Level * 0.05 + 0.55);
        const v5 = Level * 0.37;
        const v11 = ((Level * v5 + 44.0) * v8 + v10);
        const v13 = (skill.GetT2() * 0.08 + 1.0) * v11;
        skill.SetPlus(v13 + 2240);

        player.SetVar1(player.GetRes1())
        player.SetVar2(player.GetMaxmp())

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFlamecurse(120, 12000, 0.1, 1)
        player.SetBlazingSun(120, 12000, 0.2, player.GetVar2() * 0.1)

        const res = player.GetVar1()
        // 为目标增加最多3层灼烧状态，每层灼烧状态持续12秒，造成伤害总量为人物眩晕抗性的120倍。
        player.SetHpleak4(120, 12000, res * 40, 0, 1)
        player.SetHpleak4(120, 12000, res * 40, 0, 2)
        player.SetHpleak4(120, 12000, res * 40, 0, 3)

        if (player.GetTypeIsPlayer() && player.GetHasmultbuff(111)) {
            player.SetDispel(120, 111, 111, 111)
            player.SetDirecthurt(120, player.GetVar2() * 2)
        }

        return true
    }

}

/**
 * 1584  明王降世II
 * 额外获得30点技能命中，冷却固定120秒
 */
class Skill1584 extends BaseHookSkillStub {

    constructor() {
        super(1584);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskillaccu(120, 0.3, 3000 * skill.GetLevel() + 17100, 3)
        return true
    }

}

/**
 * 1585  化血魔心II
 * 冷却降低150秒，免疫白字伤害10秒
 */
class Skill1585 extends BaseHookSkillStub {

    constructor() {
        super(1585);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 150000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetImmuneWhiteDmg(120, 10100)
        return true
    }

}

/**
 * 1558  猛火咒II
 * 冷却60秒；额外获得50点技能命中
 */
class Skill1558 extends BaseHookSkillStub {

    constructor() {
        super(1558);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskillaccu(120, 0.5, 16100, 2)
        return true
    }

}

/**
 * 1559 聚2
 * 冷却60秒
 */
class Skill1559 extends BaseHookSkillStub {

    constructor() {
        super(1559);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

}

/**
 * 1533  苍劫阵II
 * 法阵的每次攻击，额外追加200%的攻击力；降低技能躲闪40点
 */
class Skill1533 extends BaseHookSkillStub {

    constructor() {
        super(1533);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const d = (skill.GetLevel() * 0.09 + 2.29);
        player.SetEvilaura(d, 0, 20, 3600000);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDecskilldodge(120, 0.4, 7000, 2)
        return true
    }

}

/**
 * 2049  旋龙幻杀II
 * 2秒施法；眩晕改为冰冻，若自身晕抗大于目标，则每段攻击依次冰冻目标1秒、3秒、5秒、7秒
 */
class Skill2049 extends BaseHookSkillStub {

    constructor() {
        super(2049);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        // 眩晕改为冰冻，若自身晕抗大于目标，则每段攻击依次冰冻目标1秒、3秒、5秒、7秒
        const d = 3 * (skill.GetLevel() + 1);
        const player = skill.GetPlayerNice();
        player.SetBarehanded(d, 3100);

        const da = player.GetVar2();
        if (da > player.GetRes1()) {
            player.SetFrozen(120, 1, (player.GetVar1() * 2 - 1) * 1000, 1)
        }

        return true
    }

}

/**
 * 3024  未名斩<玄>
 * 未名斩<玄><煞><禅>：
 * 施法1.5秒，每段附加自身当前真气10%攻击力；
 * 攻击怪物目标时，瞬间冷却，每次攻击额外附加自身真气上限15%和自身防御400%的攻击力。
 * 若自身真气高于90%，30秒内增加自身攻击6000点，并免疫禁食6秒；
 * 低于90%，10秒内增加自身攻击力2000
 */
class Skill3024 extends BaseHookSkillStub {

    constructor() {
        super(3024);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar3(ParalyzeRes);

        const level = skill.GetLevel();
        const v15 = level * 0.05 + 1.12;//2.12
        const v14 = norm(level / 14.9) * 0.03;//0.03
        const v16 = (level - 15) * v14 + v15;//5*0.03+2.15=2.3
        const v20 = skill.GetT1() * 1.5 + v16;//4.5+2.3=7.8
        skill.SetRatio(v20);

        const v10 = 5 * level;
        const v17 = (v10 * level + 720);
        const v21 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v17;
        skill.SetPlus(v21 + player.GetMp() * 0.1);
        // 每段附加自身当前真气10%攻击力；
        // 攻击怪物目标时，瞬间冷却，每次攻击额外附加自身真气上限15%和自身防御400%的攻击力。
        const v18 = level * 0.005;
        const Mp = player.GetMp();
        const v13 = Math.floor(Mp * v18);
        skill.SetMobBonusDamage(v13 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar3(ParalyzeRes);

        const level = skill.GetLevel();
        const v15 = level * 0.05 + 1.12;
        const v14 = norm(level / 14.9) * 0.03;
        const v16 = (level - 15) * v14 + v15;
        const v20 = skill.GetT1() * 1.5 + v16;//0.15+
        skill.SetRatio(v20);

        const v10 = 5 * level;
        const v17 = (v10 * level + 720);
        const v21 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v17;
        skill.SetPlus(v21 + player.GetMp() * 0.1);
        // 每段附加自身当前真气10%攻击力；
        // 攻击怪物目标时，瞬间冷却，每次攻击额外附加自身真气上限15%和自身防御400%的攻击力。
        const v18 = level * 0.005;
        const Mp = player.GetMp();
        const v13 = Math.floor(Mp * v18);
        skill.SetMobBonusDamage(v13 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar3(ParalyzeRes);

        const level = skill.GetLevel();
        const v15 = level * 0.05 + 1.12;
        const v14 = norm(level / 14.9) * 0.03;
        const v16 = (level - 15) * v14 + v15;
        const v20 = skill.GetT1() * 1.5 + v16;//0.15+
        skill.SetRatio(v20);

        const v10 = 5 * level;
        const v17 = (v10 * level + 720);
        const v21 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v17;
        skill.SetPlus(v21 + player.GetMp() * 0.1);
        // 每段附加自身当前真气10%攻击力；
        // 攻击怪物目标时，瞬间冷却，每次攻击额外附加自身真气上限15%和自身防御400%的攻击力。
        const v18 = level * 0.005;
        const Mp = player.GetMp();
        const v13 = Math.floor(Mp * v18);
        skill.SetMobBonusDamage(v13 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar3(ParalyzeRes);

        const level = skill.GetLevel();
        const v15 = level * 0.05 + 1.12;
        const v14 = norm(level / 14.9) * 0.03;
        const v16 = (level - 15) * v14 + v15;
        const v20 = skill.GetT1() * 1.5 + v16;//0.15+
        skill.SetRatio(v20);

        const v10 = 5 * level;
        const v17 = (v10 * level + 720);
        const v21 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v17;
        skill.SetPlus(v21 + player.GetMp() * 0.1);
        // 每段附加自身当前真气10%攻击力；
        // 攻击怪物目标时，瞬间冷却，每次攻击额外附加自身真气上限15%和自身防御400%的攻击力。
        const v18 = level * 0.005;
        const Mp = player.GetMp();
        const v13 = Math.floor(Mp * v18);
        skill.SetMobBonusDamage(v13 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar3(ParalyzeRes);

        const level = skill.GetLevel();
        const v15 = level * 0.05 + 1.12;
        const v14 = norm(level / 14.9) * 0.03;
        const v16 = (level - 15) * v14 + v15;
        const v20 = skill.GetT1() * 1.5 + v16;//0.15+
        skill.SetRatio(v20);

        const v10 = 5 * level;
        const v17 = (v10 * level + 720);
        const v21 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v17;
        skill.SetPlus(v21 + player.GetMp() * 0.1);
        // 每段附加自身当前真气10%攻击力；
        // 攻击怪物目标时，瞬间冷却，每次攻击额外附加自身真气上限15%和自身防御400%的攻击力。
        const v18 = level * 0.005;
        const Mp = player.GetMp();
        const v13 = Math.floor(Mp * v18);
        skill.SetMobBonusDamage(v13 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar3(ParalyzeRes);

        const level = skill.GetLevel();
        const v15 = level * 0.05 + 1.12;
        const v14 = norm(level / 14.9) * 0.03;
        const v16 = (level - 15) * v14 + v15;
        const v20 = skill.GetT1() * 1.5 + v16;//0.15+
        skill.SetRatio(v20);

        const v10 = 5 * level;
        const v17 = (v10 * level + 720);
        const v21 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v17;
        skill.SetPlus(v21 + player.GetMp() * 0.1);
        // 每段附加自身当前真气10%攻击力；
        // 攻击怪物目标时，瞬间冷却，每次攻击额外附加自身真气上限15%和自身防御400%的攻击力。
        const v18 = level * 0.005;
        const Mp = player.GetMp();
        const v13 = Math.floor(Mp * v18);
        skill.SetMobBonusDamage(v13 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        //若自身真气高于90%，30秒内增加自身攻击6000点，并免疫禁食6秒；
        // 低于90%，10秒内增加自身攻击力2000
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetHp() / player.GetMaxhp() > 0.9) {
            player.SetAddattack(120, 30000, 6000, 2)
            player.SetDietImmune(120, 6000)
        } else {
            player.SetAddattack(120, 30000, 2000, 2)
        }

        return true
    }

}

/**
 * 3072
 *
 */
class Skill3072 extends BaseHookSkillStub {

    constructor() {
        super(3072);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v20 = skill.GetT1() * 1.5 + v13;//0.15+
        skill.SetRatio(v20);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v20 = skill.GetT1() * 1.5 + v13;//0.15+
        skill.SetRatio(v20);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v20 = skill.GetT1() * 1.5 + v13;//0.15+
        skill.SetRatio(v20);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v20 = skill.GetT1() * 1.5 + v13;//0.15+
        skill.SetRatio(v20);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v20 = skill.GetT1() * 1.5 + v13;//0.15+
        skill.SetRatio(v20);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12 + 0.15;
        const v20 = skill.GetT1() * 1.5 + v13;//0.15+
        skill.SetRatio(v20);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        //若自身真气高于90%，30秒内增加自身攻击6000点，并免疫禁食6秒；
        // 低于90%，10秒内增加自身攻击力2000
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetHp() / player.GetMaxhp() > 0.9) {
            player.SetAddattack(120, 30000, 6000, 2)
            player.SetDietImmune(120, 6000)
        } else {
            player.SetAddattack(120, 30000, 2000, 2)
        }

        return true
    }


}

/**
 * 3120
 *
 */
class Skill3120 extends BaseHookSkillStub {

    constructor() {
        super(3120);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1500
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsMob()) {
            return 0
        } else {
            return super.GetCooldowntime(stub, skill, originFunc);
        }
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 225
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT1() * 1.5 + v13;
        skill.SetRatio(v17);
        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);
        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT1() * 1.5 + v13;
        skill.SetRatio(v17);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(1);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT1() * 1.5 + v13;
        skill.SetRatio(v17);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT1() * 1.5 + v13;
        skill.SetRatio(v17);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(3);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT1() * 1.5 + v13;
        skill.SetRatio(v17);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res2 = player.GetRes2();
        player.SetVar1(Res2);

        player.SetVar2(0);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.12;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12 + 0.15;
        const v17 = skill.GetT1() * 1.5 + v13;
        skill.SetRatio(v17);

        const v7 = 5 * level;
        const v14 = (v7 * level + 720);
        const v18 = (skill.GetT3() * 0.07000000000000001 + 1.0) * v14;
        skill.SetPlus(v18 + player.GetMp() * 0.1);

        const v15 = level * 0.005;
        const Mp = player.GetMp();
        const v10 = Math.floor(Mp * v15);
        skill.SetMobBonusDamage(v10 + player.GetMaxmp() * 0.2 + player.GetMaxatk() * 4);

        player.SetPerform(0);
    }


    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        //若自身真气高于90%，30秒内增加自身攻击6000点，并免疫禁食6秒；
        // 低于90%，10秒内增加自身攻击力2000
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        if (player.GetHp() / player.GetMaxhp() > 0.9) {
            player.SetAddattack(120, 30000, 6000, 2)
            player.SetDietImmune(120, 6000)
        } else {
            player.SetAddattack(120, 30000, 2000, 2)
        }

        return true
    }

}

/**
 * 3021  魔魂天咒<玄>
 * 魔魂天咒<玄>、<煞>、<禅>：
 * 群体攻击目标12次，每段附加自身当前真气8%攻击力。增加被暴击伤害60%,持续6秒，
 * <玄>：6秒内增加被暴击伤害100%。
 * <煞>：6秒内增加被暴击25%。
 * <禅>：6秒内令目标受伤增加15%
 */
class Skill3021 extends BaseHookSkillStub {

    constructor() {
        super(3021);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res4 = player.GetRes4();
        player.SetVar3(Res4);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.1;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT3() + v13;
        skill.SetRatio(v17);

        const v14 = level * 9.9;
        const v15 = level * v14;
        const v16 = v15 - level * 8.6 + 858.0;
        const v18 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v16;
        skill.SetPlus(v18 + player.GetMp() * 0.08);

        player.SetVar1(1);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(1);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res4 = player.GetRes4();
        player.SetVar3(Res4);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.1;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT3() + v13;
        skill.SetRatio(v17);

        const v14 = level * 9.9;
        const v15 = level * v14;
        const v16 = v15 - level * 8.6 + 858.0;
        const v18 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v16;
        skill.SetPlus(v18 + player.GetMp() * 0.08);

        player.SetVar1(2);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res4 = player.GetRes4();
        player.SetVar3(Res4);

        const level = skill.GetLevel();
        const v12 = level * 0.05 + 1.1;
        const v11 = norm(level / 14.9) * 0.03;
        const v13 = (level - 15) * v11 + v12;
        const v17 = skill.GetT3() + v13;
        skill.SetRatio(v17);

        const v14 = level * 9.9;
        const v15 = level * v14;
        const v16 = v15 - level * 8.6 + 858.0;
        const v18 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v16;
        skill.SetPlus(v18 + player.GetMp() * 0.08);

        player.SetVar1(3);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const Res4 = player.GetRes4();
        player.SetVar3(Res4);

        const level = skill.GetLevel();
        const v6 = zrand(4 * (level + 10));
        const v8 = zrand(level + 100);

        const v16 = (v6 * norm(v8 / 100.0)) * 0.02 + 1.1;
        const v17 = level * 0.05 + v16;

        const v15 = norm(level / 14.9) * 0.03;
        const v18 = (level - 15) * v15 + v17;

        const v22 = skill.GetT3() + v18;
        skill.SetRatio(v22);

        const v19 = level * 9.9;
        const v20 = level * v19;
        const v21 = v20 - level * 8.6 + 858.0;

        const v23 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v21;
        skill.SetPlus(v23 + player.GetMp() * 0.08)

        player.SetVar1(4);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncfatalhurt(120, 0.1, 6100, 2)
        return true
    }

}

/**
 * 3069
 * 煞>：6秒内增加被暴击25%。
 */
class Skill3069 extends BaseHookSkillStub {

    constructor() {
        super(3069);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(1);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(1);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(2);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(3);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(4);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncfatalratio(120, 0.25, 6100, 2)
        return true
    }
}

/**
 * 3117
 * <禅>：6秒内令目标受伤增加15%
 */
class Skill3117 extends BaseHookSkillStub {

    constructor() {
        super(3117);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(1);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(1);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(2);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(3);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const level = skill.GetLevel();
        const player = skill.GetPlayerNice();

        const v9 = level * 0.05 + 1.1;
        const v8 = norm(level / 14.9) * 0.03;
        const v10 = (level - 15) * v8 + v9;

        const v14 = skill.GetT3() + v10;
        skill.SetRatio(v14);

        const v11 = level * 9.9;
        const v12 = level * v11;
        const v13 = v12 - level * 8.6 + 858.0;

        const v15 = (skill.GetT2() * 0.07000000000000001 + 1.0) * v13;
        skill.SetPlus(v15 + player.GetMp() * 0.08);

        player.SetVar1(4);

        const Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);

        player.SetPerform(0);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInchurt(120, 0.15, 6100)
        return true
    }
}

/**
 * 3022  狂灵反噬<玄>
 * 冷却减少20秒。
 * 减少15%来自目标伤害，减少12%来自目标附加伤害，双新妄念（减爆伤150%，需要妄念护符）。优化施法
 */
class Skill3022 extends BaseHookSkillStub {

    constructor() {
        super(3022);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = (2000 * skill.GetT0() + 20100);
        let ta = skill.GetLevel() * 0.04;
        let Level = skill.GetLevel();
        const r = norm(Level / 19.9) * 0.3 + ta;
        const v = 5 * skill.GetLevel();
        player.SetRetort(100, r, v, 0, t);

        player.SetImmunesleep(3000 * skill.GetT2() + 10100);

        let v11;
        if (skill.GetT0() <= 0) {
            v11 = 0;
        } else {
            v11 = 120;
        }

        let tb = (60000 * skill.GetT0());
        let tc = skill.GetT0() * 0.3 + 0.00001;
        let td = skill.GetT0() * 0.06;
        td = player.GetMaxmp() * td;
        player.SetAddhp2(v11, td, tc, tb, 1);
        player.SetAddhp2(v11, td, tc, tb, 2);

        let v19 = 3000 * skill.GetT2() + 10100;
        const ttd = v19 * norm(skill.GetT2());
        player.SetImmunedizzy(ttd);

        player.SetDecdamage(v11, 0.15, tb);
        player.SetSlant(v11, tb, 0.12);
        return true
    }

}

/**
 * 3070
 *
 */
class Skill3070 extends BaseHookSkillStub {

    constructor() {
        super(3070);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = (2000 * skill.GetT0() + 20100);
        let ta = skill.GetLevel() * 0.04;
        let Level = skill.GetLevel();
        const r = norm(Level / 19.9) * 0.3 + ta;
        const v = 5 * skill.GetLevel();
        player.SetRetort(100, r, v, 0, t);

        player.SetImmunesleep(3000 * skill.GetT2() + 10100);

        let v11;
        if (skill.GetT0() <= 0) {
            v11 = 0;
        } else {
            v11 = 120;
        }

        let tb = (60000 * skill.GetT0());
        let tc = skill.GetT0() * 0.3 + 0.00001;
        let td = skill.GetT0() * 0.06;
        td = player.GetMaxmp() * td;
        player.SetAddhp2(v11, td, tc, tb, 1);
        player.SetAddhp2(v11, td, tc, tb, 2);

        let v19 = 3000 * skill.GetT2() + 10100;
        const ttd = v19 * norm(skill.GetT2());
        player.SetImmunedizzy(ttd);

        player.SetDecdamage(v11, 0.15, tb);
        player.SetSlant(v11, tb, 0.12);
        return true
    }

}

/**
 * 3118
 *
 */
class Skill3118 extends BaseHookSkillStub {

    constructor() {
        super(3118);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 20000;
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = (2000 * skill.GetT0() + 20100);
        let ta = skill.GetLevel() * 0.04;
        let Level = skill.GetLevel();
        const r = norm(Level / 19.9) * 0.3 + ta;
        const v = 5 * skill.GetLevel();
        player.SetRetort(100, r, v, 0, t);

        player.SetImmunesleep(3000 * skill.GetT2() + 10100);

        let v11;
        if (skill.GetT0() <= 0) {
            v11 = 0;
        } else {
            v11 = 120;
        }

        let tb = (60000 * skill.GetT0());
        let tc = skill.GetT0() * 0.3 + 0.00001;
        let td = skill.GetT0() * 0.06;
        td = player.GetMaxmp() * td;
        player.SetAddhp2(v11, td, tc, tb, 1);
        player.SetAddhp2(v11, td, tc, tb, 2);

        let v19 = 3000 * skill.GetT2() + 10100;
        const ttd = v19 * norm(skill.GetT2());
        player.SetImmunedizzy(ttd);

        player.SetDecdamage(v11, 0.15, tb);
        player.SetSlant(v11, tb, 0.12);
        return true
    }

}

/**
 * 776   狂灵反噬
 * 双妄念（新妄念。减免暴击伤害100，需要天书），优化施法
 */
class Skill776 extends BaseHookSkillStub {

    constructor() {
        super(776);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();

        let t = (2000 * skill.GetT0() + 20100);
        let ta = skill.GetLevel() * 0.04;
        let Level = skill.GetLevel();
        const r = norm(Level / 19.9) * 0.3 + ta;
        const v = 5 * skill.GetLevel();
        player.SetRetort(100, r, v, 0, t);

        player.SetImmunesleep(3000 * skill.GetT2() + 10100);

        let v11;
        if (skill.GetT0() <= 0) {
            v11 = 0;
        } else {
            v11 = 120;
        }

        let tb = (60000 * skill.GetT0());
        let tc = skill.GetT0() * 0.2 + 0.00001;
        let td = skill.GetT0() * 0.06;
        td = player.GetMaxmp() * td;
        player.SetAddhp2(v11, td, tc, tb, 1);
        player.SetAddhp2(v11, td, tc, tb, 2);

        let v19 = 3000 * skill.GetT2() + 10100;
        const ttd = v19 * norm(skill.GetT2());
        player.SetImmunedizzy(ttd);
        return true
    }

}

/**
 * 5754  聚灵咒III 《英雄》
 * 冷却40秒，
 * 可在35秒内，4次无视冷却进行攻击。
 */
class Skill5754 extends BaseHookSkillStub {

    constructor() {
        super(5754);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetSupertrigger(35000, 5928, 1, 4, 0, 5754);
        return true
    }
}

/**
 * 5837  猛火咒III
 * 冷却60秒，清除自身全部不利状态；
 * 10秒内令自身下一击必爆，令自身单攻技能的攻击距离延长10米；
 * 天：魔阵营降低冷却10秒；提升真气上限效果20%，持续15秒；
 * 海：10秒内获得玉册效果
 * 地：10秒内免疫50%白字伤害
 * 雄：10秒内免疫禁食
 */
class Skill5837 extends BaseHookSkillStub {

    constructor() {
        super(5837);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.IsMo()) {
            return 50000
        }

        return 60000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 40)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetMakecrit(10000)
        player.SetSingleatkchange(120, 10000, 10, 0)
        player.SetIncmp(0.2, 10100, 2)
        return true
    }

}

/**
 * 5838
 * 冷却60秒，清除自身全部不利状态；
 * 10秒内令自身下一击必爆，令自身单攻技能的攻击距离延长10米；
 * 海：10秒内获得玉册效果
 */
class Skill5838 extends BaseHookSkillStub {

    constructor() {
        super(5838);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 40)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetMakecrit(10000)
        player.SetSingleatkchange(120, 10000, 10, 0)
        player.SetTurndebuff(10000, 0, 3)
        return true
    }

}

/**
 * 5839
 * 冷却60秒，清除自身全部不利状态；
 * 10秒内令自身下一击必爆，令自身单攻技能的攻击距离延长10米；
 * 地：10秒内免疫50%白字伤害
 */
class Skill5839 extends BaseHookSkillStub {

    constructor() {
        super(5839);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 40)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetMakecrit(10000)
        player.SetSingleatkchange(120, 10000, 10, 0)
        player.SetSlant(120, 10100, 0.5)
        return true
    }

}

/**
 * 5840
 * 冷却60秒，清除自身全部不利状态；
 * 10秒内令自身下一击必爆，令自身单攻技能的攻击距离延长10米；
 * 雄：10秒内免疫禁食
 */
class Skill5840 extends BaseHookSkillStub {

    constructor() {
        super(5840);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, 40)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetMakecrit(10000)
        player.SetSingleatkchange(120, 10000, 10, 0)
        player.SetDietImmune(120, 10100)
        return true
    }

}

/**
 * 6802  赤乌·天魔舞·曦日
 * 施法1秒攻击目标三次，
 * 第一击降低目标技能躲闪60点，
 * 第二击令目标在6秒内吃药效果降低60%，
 * 第三击100%几率驱散目标4个有利状态，100%几率降低目标真气上限至1点，
 * 冷却10秒
 * 技能达5级时,若自身眩晕抗性+100高于目标,则最后一击强制眩晕目标 4 秒
 */
class Skill6802 extends BaseHookSkillStub {

    constructor() {
        super(6802);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 10000
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

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar3(player.GetRes1() + 100)
        player.SetVar4(skill.GetLevel())
        super.Calculate4(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const Var1 = player.GetVar1();
        //第一击降低目标技能躲闪60点，
        // 第二击令目标在6秒内吃药效果降低60%，
        // 第三击100%几率驱散目标4个有利状态，100%几率降低目标真气上限至1点，
        // 冷却10秒
        // 技能达5级时,若自身眩晕抗性+100高于目标,则最后一击强制眩晕目标 4 秒
        switch (Var1) {
            case 1:
                player.SetDecskilldodge(120, 0.6, 6100, 4)
                break;
            case 2:
                player.SetDecdrugeffect(120, 0.6, 6100, 4);
                break;
            case 3:
                player.SetClearbuff(120, 4);
                let da = player.GetMaxmp() - 1;
                player.SetSubmp(120, da, 1, 6100, 2);
                if (player.GetVar4() >= 5 && player.GetVar3() > player.GetRes3()) {
                    player.SetDizzy(999, 4100)
                }
                break;
        }

        return true
    }

}

/**
 * 523   狱龙破
 * 玄烛·狱龙破·曦日：第二击10秒内降低目标45%被暴击伤害
 */
class Skill523 extends BaseHookSkillStub {

    constructor() {
        super(523);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        if (player.GetVar1() == 1) {
            const Var2 = player.GetVar2();
            const v31 = player.GetVar3() + Var2;
            const slvl = v31 + player.GetVar4();
            const df = 120 * slvl;
            const dg = slvl * 0.09;
            player.SetIncfatalhurt(df, dg, 10100, 1);
        }
        return true
    }

}

/**
 * 1304  九变
 * 施法时间调整为4秒，冷却60秒，
 * 第一击附加本体攻击力130%，之后每一击伤害递30%，
 * 附加20%当前气血真气和的攻击力
 */
class Skill1304 extends BaseHookSkillStub {

    constructor() {
        super(1304);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 4000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.9);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.4);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.7);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

}

class Skill1636 extends BaseHookSkillStub {

    constructor() {
        super(1636);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 4000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.9);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.4);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.7);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

}

class Skill1656 extends BaseHookSkillStub {

    constructor() {
        super(1656);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 4000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.9);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.4);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.7);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

}

class Skill1676 extends BaseHookSkillStub {

    constructor() {
        super(1676);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 4000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.9);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.4);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.7);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

}

class Skill1696 extends BaseHookSkillStub {

    constructor() {
        super(1696);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 4000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.9);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.4);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.7);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

}

class Skill3791 extends BaseHookSkillStub {

    constructor() {
        super(3791);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 4000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 400
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(1.9);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.1);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.4);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(2.7);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.0);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.3);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        skill.SetRatio(3.6);

        const ParalyzeRes = player.GetParalyzeRes();
        player.SetVar1(ParalyzeRes);

        skill.SetPlus(player.GetHp() * 0.2 + player.GetMp() * 0.2);
        player.SetPerform(0);
    }

}

class NaiHe extends QuickCoolDownList {
    getSkillList(): number[] {
        return [1303, 1635, 1655, 1695, 3790];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

}

/**
 * 1675  奈何：梵
 * 冷却时间210秒；增加10秒群无敌
 */
class Skill1675 extends BaseHookSkillStub {

    constructor() {
        super(1675);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 210000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetInvincible(10100)
        return true
    }

}

class LongXiao extends QuickCoolDownList {
    getSkillList(): number[] {
        return [1302, 1634, 1654, 1674, 1694, 3789];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

}

export class GuiWangSkillList {
    constructor() {
        new Skill243()
        new Skill260()
        new Skill249()
        new Skill314()
        new Skill526()
        new Skill261()
        new Skill522()
        new Skill651()
        new Skill524()
        new Skill262()
        new Skill257()
        new Skill248()
        new Skill1584()
        new Skill1585()
        new Skill1558()
        new Skill1559()
        new Skill1533()
        new Skill2049()
        new Skill3024()
        new Skill3072()
        new Skill3120()
        new Skill3021()
        new Skill3069()
        new Skill3117()
        new Skill3022()
        new Skill3070()
        new Skill3118()
        new Skill776()
        new Skill5754()
        new Skill5837()
        new Skill5838()
        new Skill5839()
        new Skill5840()
        new Skill6802()
        new Skill523()
        new Skill1304()
        new Skill1636()
        new Skill1656()
        new Skill1676()
        new Skill1696()
        new Skill3791()
        new LongXiao()
        new Skill1675()
        new NaiHe()
    }
}