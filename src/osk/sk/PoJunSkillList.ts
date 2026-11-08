import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";
import {SkillFuncCore} from "../../base/skill/SkillFuncCore";
import {getHookStubFuncName, getSkillStub} from "../../base/skill/HookSkillUtil";


/**
 * 5388  赤帝挥戈
 * 无冷却
 */
class Skill5388 extends BaseHookSkillStub {

    constructor() {
        super(5388);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

}

/**
 * 5392  燕舞明堂
 * 无冷却
 */
class Skill5392 extends BaseHookSkillStub {

    constructor() {
        super(5392);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }
}

/**
 * 5411  七星闪
 * 冷却时间减少30秒
 *
 * 七星闪 Ⅱ原增加自身致命一击伤害的效果调整为释放“七星闪”后增加自身致命一击伤害，
 * 持续时间与七星闪破煞效果的持续时间一致
 */
class Skill5411 extends BaseHookSkillStub {

    constructor() {
        super(5411);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 25000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        const ID = player.GetID();

        let v6;
        if (ID === player.GetVar1())
            v6 = 3000 * skill.GetT0();
        else
            v6 = 0;

        const t = v6 + 2000 * skill.GetLevel() + 5000;
        const d = (7 * (skill.GetLevel() + 1)) * 0.01 + 0.0001;
        player.SetInccrithurt(100, d, t, 5);
        return true
    }

}

/**
 * 6974  玄烛·疾风斩月·萤炬
 * 6975  玄烛·疾风斩月·皓月
 * 6976  玄烛·疾风斩月·曦日
 * 【玄烛·疾风斩月·萤炬/皓月/曦日】
 * 新增效果：流风回雪加速效果延长 6/9/12s，且移动速度取狂暴后的数值；
 * 新增效果：技能达到 5 级时，疾风斩月额外获得流风回雪的加速效果，持续 6/9/12 秒
 */
class Skill5379 extends BaseHookSkillStub {

    constructor() {
        super(5379);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const yj = player.GetSkilllevel(6974)
        const hy = player.GetSkilllevel(6975)
        const xr = player.GetSkilllevel(6976)

        const t = 4000 * skill.GetLevel();
        let ft = t

        if (yj > 0) {
            ft = t + 6000
        }

        if (hy > 0) {
            ft = t + 9000
        }

        if (xr > 0) {
            ft = t + 12000
        }

        let v = skill.GetLevel() * 0.8;
        if (player.GetHasmultbuff(125)) {
            const ta = (player.GetSkilllevel(5450) * 0.3 + 1.0) * 0.8;
            v = skill.GetLevel() * ta;
        }

        player.SetAddspeed(101, ft, v, 0);

        return true
    }

}

/**
 * 5396  疾风斩月
 * 冷却减少25秒
 *
 * 玄烛·疾风斩月·曦日：
 * 新增效果-被动减少排山倒海<玄><煞><禅>冷却时间40秒
 * 新增效果-增加自身技能命中50点，暴击率15%，持续时间12秒
 * 疾风斩月的连携次数增加2次，连携持续时间加5秒（总共连携5次）
 */
class Skill5396 extends BaseHookSkillStub {

    constructor() {
        super(5396);
        // SkillFuncCore.hookSkillValue(getHookStubFuncName(5396, "GetConButtonMax"), 'int32', this.GetConButtonMax);
        // SkillFuncCore.hookSkillValue(getHookStubFuncName(5396, "GetConButtonTime"), 'int32', this.GetConButtonTime);
    }

    GetConButtonMax(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetSkilllevel(6976) > 0) {
            return 5
        } else {
            return 3
        }
    }

    GetConButtonTime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        if (player.GetSkilllevel(6976) > 0) {
            return skill.GetLevel() * 1000 + 5000
        } else {
            return skill.GetLevel() * 1000
        }
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

    Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const yj = player.GetSkilllevel(6974)
        const hy = player.GetSkilllevel(6975)
        const xr = player.GetSkilllevel(6976)

        let ft = 0
        if (yj >= 5) {
            ft = 6000
        }

        if (hy >= 5) {
            ft = 9000
        }

        if (xr >= 5) {
            ft = 12000
        }

        if (xr > 0) {
            player.SetIncskillaccu(120, 0.5, 12000, 1)
            player.SetInccritrate(12000, 0.15, 1)
        }

        if (ft > 0) {
            let v = skill.GetLevel() * 0.8;
            if (player.GetHasmultbuff(125)) {
                const ta = (player.GetSkilllevel(5450) * 0.3 + 1.0) * 0.8;
                v = skill.GetLevel() * ta;
            }

            player.SetAddspeed(101, ft, v, 0);
        }

        super.Calculate1(stub, skill, originFunc);
    }
}

/**
 * 5404  龙困浅滩
 * 冷却时间减少10秒
 */
class Skill5404 extends BaseHookSkillStub {

    constructor() {
        super(5404);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

/**
 * 5717  流光逐月
 * 冷却时间 150 秒
 * 增加自身单体攻击技能的距离 20米,持续时间 30 秒；
 * 自身技能伤害提升30%，持续时间 30 秒；
 * 使用后立即清除“繁星碎"、“繁星碎<玄><煞><禅>"、"繁星碎Ⅲ”技能冷却
 */
class Skill5717 extends BaseHookSkillStub {

    constructor() {
        super(5717);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 150000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetSingleatkchange(100, 30000, 20, 0.3);

        player.SetClearcooldown(5415, 5803, 5804)
        player.SetClearcooldown(5805, 5806, 5705)
        player.SetClearcooldown(5709, 5713, 0)

        return true
    }

}

/**
 * 5384  穿云逐月
 * 冷却减少25秒，并对冲锋路径上目标冰冻4秒
 */
class Skill5384 extends BaseHookSkillStub {

    constructor() {
        super(5384);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //冰冻
        player.SetFrozen(120, 0, 4000, 1)
        return true
    }

}

/**
 * 5395 斗转星移
 * 神佑效果调整为免疫 10 次伤害和负面效果，持续 12秒，
 * 技能冷却 120-2*level秒
 * 5487天书-恩光:额外减少"斗转星移"冷却时间2* level 秒
 * 5687雪爪鸿泥II取消原有对技能“斗转星移”的影响，调整为减少“斗转星移”技能冷却时间5+level 秒
 */
class Skill5395 extends BaseHookSkillStub {

    constructor() {
        super(5395);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000 - 2000 * skill.GetLevel() - skill.GetT0() * 2000 - skill.GetT1() * 5000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetBlessed(10, 12000)
        return true
    }

}

/**
 * 5399  孤烟障
 * 冷却时间 210-10*level 秒
 * 新增效果：在技能生效期间间，自身技能伤害提升30%，持续 30 秒，
 * 增加自身单体攻击技能的距离 20米，持续时间 30秒
 */
class Skill5399 extends BaseHookSkillStub {

    constructor() {
        super(5399);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 210000 - 10000 * skill.GetLevel()
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetSingleatkchange(120, 30000, 20, 0.3)
        return true
    }

}

/**
 * 5716  飞星鸣镝
 *减少目标技能命中效果的持续时间由 12秒上调至 15秒，
 *若施法者为仙阵营,则新增令目标15秒内真气上限减少15%，
 *施法者为魔阵营，则新增令目标 15秒内气血上限减少15%,
 *施法者为佛阵营,则新增令目标15秒内技能躲闪减少20点,
 *目标若被标记，则以上效果翻倍
 */
class Skill5716 extends BaseHookSkillStub {

    constructor() {
        super(5716);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(player.GetCultivation())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const cult = player.GetVar1()

        player.SetProbability(100.0);
        const hasSign = player.GetHasbuff(4296)

        if (hasSign) {
            player.SetDecskillaccu(100, 0.05, 30000, 4);
        } else {
            player.SetDecskillaccu(100, 0.025, 15000, 4);
        }

        if (cult == 1) {//仙
            if (hasSign) {
                player.SetDecmp(120, 30000, 0.3);
            } else {
                player.SetDecmp(120, 15000, 0.15,);
            }
        }

        if (cult == 2) {//魔
            if (hasSign) {
                player.SetSubhp(120, player.GetMaxhp() * 0.3, player.GetLevel() * 20, 30000, 1);
            } else {
                player.SetSubhp(120, player.GetMaxhp() * 0.15, player.GetLevel() * 10, 15000, 1);
            }
        }

        if (cult == 4) {//佛
            if (hasSign) {
                player.SetDecskilldodge(120, 0.04, 30000, 1);
            } else {
                player.SetDecskilldodge(120, 0.02, 15000, 1);
            }
        }

        return true
    }

}

/**
 * 5406  挪移咒
 * “挪移”的伤害调整为不超过自身气血上限的 1.5 倍
 * 玄烛·挪移咒·曦日：影响转移比例调整为45%
 *
 */
class Skill5406 extends BaseHookSkillStub {

    constructor() {
        super(5406);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        let bon = 0.0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6971) > 0)
            bon = 0.1;
        if (player.GetSkilllevel(6972) > 0)
            bon = 0.2;
        if (player.GetSkilllevel(6973) > 0)
            bon = 0.45;

        const v5 = 10 * skill.GetT0();
        const d = v5 + 6 * skill.GetLevel();
        const v7 = 3000 * skill.GetT1();
        const da = v7 + 2000 * skill.GetLevel() + 6000;
        let db = skill.GetT2() * 0.03;
        db = skill.GetLevel() * 0.08 + db + bon;
        const maxHp = 1.5 * player.GetMaxhp();
        player.SetSkilltransfer(da, db, maxHp, d);

        return true
    }
}

/**
 * 5405  浮光掠影
 * 连携持续时间由3秒调整为9秒
 */
class Skill5405 {

    constructor() {
        SkillFuncCore.hookSkillValue(getHookStubFuncName(5405, "GetConButtonTime"), 'int32', this.GetConButtonTime);
    }

    GetConButtonTime(): number {
        return 9000
    }
}

/**
 * 5403  离火印
 * 调整为自身祝福技能，施法时间 1 秒，冷却时间 15 秒，
 * 100%概率为自身附加保护罩
 */
class Skill5403 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(5403)
        stub.pointer.add(0x2C).writeU8(2)
        super(5403);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
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
        return 400
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v3 = 0.0;
        if (player.GetVar1() == 1) {
            v3 = 3000 * skill.GetLevel();
        }

        let d = Math.floor(player.GetSkilllevel(5460) * 0.1 + 1.0);
        d = Math.floor(player.GetKillnum() * d);
        player.SetDechurt(v3, 1.0, d);

        return true
    }

}

/**
 * 5435  弩 奥义
 * //5690  T4燕舞明堂II：奥义触发的迅疾状态持续时间调整为25秒，迅疾数值调整为70%
 */
class Skill5435 extends BaseHookSkillStub {

    constructor() {
        super(5435);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v3 = 0
        if (skill.GetLevel() <= 4) {
            v3 = 0.0;
        } else {
            v3 = (5 * player.GetVar1() + 25);
        }

        const Var1 = player.GetVar1();
        player.SetIncattack(v3, 6000, 0.05, Var1);

        const t = (player.GetSkilllevel(5458) * 0.01 * 33.0 + 1.0);
        const Comb = player.GetComb() > 2 ? 1 : 0;
        const v14 = 2000 * norm(Comb);
        const v14Adjusted = (v14 * skill.GetT0()) * t;
        const v16 = zrand(100) < 10 ? 1 : 0;
        const v17 = skill.GetPlayerNice();
        const v18 = v16 * v17.GetSkilllevel(5461);
        const t2 = (5 * skill.GetT0());
        player.SetAddantisilent(v14Adjusted, t2, v18);

        const v23 = (player.GetComb() == 5) ? 100 : 0;
        const T1 = skill.GetT1();
        const v26 = 2000 * norm(T1);
        const v27 = skill.GetPlayerNice();
        const v28 = v27.GetSkilllevel(5468) * v26;
        const ta = (v28 + 1000 * (skill.GetT1() / 2));
        const v31 = norm(skill.GetT1());
        const v32 = skill.GetPlayerNice();
        const tb = (v31 * v32.GetSkilllevel(5468)) * 0.01001;
        const tbAdjusted = (skill.GetT1() * 0.01001 + tb);
        player.SetIncskillaccu(v23, tbAdjusted, ta, 0);

        const v36 = (skill.GetT4() > 0) ? 120 : 0;
        const tc = (2500 * skill.GetT4());
        const td = (skill.GetT4() * 0.07);
        player.SetSwift(v36, tc, td, 0);
        return true
    }

}

/**
 * 5691  艮土印II
 * 删除原有效果，调整为使用此技能提高真气上限90%，持续20秒，冷却时间调整为固定30秒
 */
class Skill5691 extends BaseHookSkillStub {

    constructor() {
        super(5691);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const t = 2000 * skill.GetLevel();
        const player = skill.GetPlayerNice();
        player.SetIncmp(0.9, t, 8);
        return true
    }

}

/**
 * 5412  坎水印
 * 坎水印、坎水印<玄><煞><禅>    瞬间冷却
 * 攻击怪物目标时额外附加 5%*level 自身真气上限的攻击力
 * 5455天书-巨门 令坎水印、坎水印<玄><煞><禅>额外附加本体攻击力调整为5%*level
 *
 * 【玄烛·坎水印·萤炬/皓月/曦日】额外新增影响坎水印<玄><煞><禅>，
 * 新增效果：技能达到 5 级时，坎水印、坎水印<玄><煞><禅>攻击范围增加 5/10/15米，目标限制个数额外增加 3/6/9个
 */
class Skill5412 extends BaseHookSkillStub {

    constructor() {
        super(5412);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0.0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 5.0;
        if (player.GetSkilllevel(6978) > 0)
            bon = 10.0;
        if (player.GetSkilllevel(6979) > 0)
            bon = 15.0;

        return bon + 7.0;
    }

    GetCoverage(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 3;
        if (player.GetSkilllevel(6978) > 0)
            bon = 6;
        if (player.GetSkilllevel(6979) > 0)
            bon = 9;

        return bon + 10;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const Skilllevel = Player.GetSkilllevel(6977);
        const v5 = Player.GetSkilllevel(6978) + Skilllevel;
        const star_lvl = v5 + Player.GetSkilllevel(6979);
        const v16 = star_lvl * 0.02;
        skill.SetCrit(v16);
        const v14 = skill.GetLevel() * 0.03;
        const v15 = Player.GetSkilllevel(5455) * 0.05 + v14;
        const v17 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v15 + 1.0 + star_lvl * 0.08;
        skill.SetRatio(v17);
        const Killnum = Player.GetKillnum();
        const v11 = skill.GetT0() * Killnum;
        const v13 = v11 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v13);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const Skilllevel = Player.GetSkilllevel(6977);
        const v5 = Player.GetSkilllevel(6978) + Skilllevel;
        const star_lvl = v5 + Player.GetSkilllevel(6979);
        const v25 = star_lvl * 0.02;
        skill.SetCrit(v25);
        const v23 = skill.GetLevel() * 0.04;
        const v24 = Player.GetSkilllevel(5455) * 0.05 + v23;
        const v26 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v24 + 1.0 + star_lvl * 0.08;
        skill.SetRatio(v26);
        const Killnum = Player.GetKillnum();
        const v11 = skill.GetT0() * Killnum;
        const v22 = v11 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v22);
        const v13 = Player.GetSkilllevel(6977);
        const v14 = Player.GetSkilllevel(6978);
        const v15 = Player.GetSkilllevel(6979);
        Player.SetVar3(v13);
        Player.SetVar4(v14);
        Player.SetVar5(v15);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const Player = skill.GetPlayerNice();
        const Skilllevel = Player.GetSkilllevel(6977);
        const v5 = Player.GetSkilllevel(6978) + Skilllevel;
        const star_lvl = v5 + Player.GetSkilllevel(6979);
        const v16 = star_lvl * 0.02;
        skill.SetCrit(v16);
        const v14 = skill.GetLevel() * 0.05;
        const v15 = Player.GetSkilllevel(5455) * 0.05 + v14;
        const v17 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v15 + 1.0 + star_lvl * 0.08;
        skill.SetRatio(v17);
        const Killnum = Player.GetKillnum();
        const v11 = skill.GetT0() * Killnum;
        const v13 = v11 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v13);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }
}

/**
 * 5704  坎水印<玄>
 * 攻击怪物目标时额外附加 5%*level 自身真气上限的攻击力
 * 【玄烛·坎水印·萤炬/皓月/曦日】额外新增影响坎水印<玄><煞><禅>，
 * 新增效果：技能达到 5 级时，坎水印、坎水印<玄><煞><禅>攻击范围增加 5/10/15米，目标限制个数额外增加 3/6/9个
 */
class Skill5704 extends BaseHookSkillStub {

    constructor() {
        super(5704);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0.0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 5.0;
        if (player.GetSkilllevel(6978) > 0)
            bon = 10.0;
        if (player.GetSkilllevel(6979) > 0)
            bon = 15.0;

        return bon + 7.0;
    }

    GetCoverage(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 3;
        if (player.GetSkilllevel(6978) > 0)
            bon = 6;
        if (player.GetSkilllevel(6979) > 0)
            bon = 9;

        return bon + 10;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 0.1;
        skill.SetCrit(v11);
        const v9 = skill.GetLevel() * 0.03;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 0.1;
        skill.SetCrit(v11);
        const v9 = skill.GetLevel() * 0.04;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 0.1;
        skill.SetCrit(v11);
        const v9 = skill.GetLevel() * 0.05;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }

}

/**
 * 5706
 *
 */
class Skill5706 extends BaseHookSkillStub {

    constructor() {
        super(5706);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0.0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 5.0;
        if (player.GetSkilllevel(6978) > 0)
            bon = 10.0;
        if (player.GetSkilllevel(6979) > 0)
            bon = 15.0;

        return bon + 7.0;
    }

    GetCoverage(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 3;
        if (player.GetSkilllevel(6978) > 0)
            bon = 6;
        if (player.GetSkilllevel(6979) > 0)
            bon = 9;

        return bon + 10;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 0.01;
        skill.SetCrithurt(v11);
        const v9 = skill.GetLevel() * 0.03;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 0.01;
        skill.SetCrithurt(v11);
        const v9 = skill.GetLevel() * 0.04;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 0.01;
        skill.SetCrithurt(v11);
        const v9 = skill.GetLevel() * 0.05;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }
}

/**
 * 5710
 *
 */
class Skill5710 extends BaseHookSkillStub {

    constructor() {
        super(5710);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetRadius(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0.0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 5.0;
        if (player.GetSkilllevel(6978) > 0)
            bon = 10.0;
        if (player.GetSkilllevel(6979) > 0)
            bon = 15.0;

        return bon + 7.0;
    }

    GetCoverage(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        let bon = 0;
        const player = skill.GetPlayerNice();

        if (player.GetSkilllevel(6977) > 0)
            bon = 3;
        if (player.GetSkilllevel(6978) > 0)
            bon = 6;
        if (player.GetSkilllevel(6979) > 0)
            bon = 9;

        return bon + 10;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 10;
        skill.SetSkillaccu(v11);
        const v9 = skill.GetLevel() * 0.03;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 10;
        skill.SetSkillaccu(v11);
        const v9 = skill.GetLevel() * 0.03;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const v11 = (skill.GetLevel() / 5 + 1) * 10;
        skill.SetSkillaccu(v11);
        const v9 = skill.GetLevel() * 0.03;
        const Player = skill.GetPlayerNice();
        const v10 = Player.GetSkilllevel(5455) * 0.05 + v9;
        const v12 = Player.GetSkilllevel(5462) * 0.01 * 3.0 + v10 + 1.0;
        skill.SetRatio(v12);
        const Killnum = Player.GetKillnum();
        const v6 = skill.GetT0() * Killnum;
        const v8 = v6 + 225 * skill.GetLevel() + 420;
        skill.SetPlus(v8);
        skill.SetMobBonusDamage(skill.GetLevel() * 0.05 * Player.GetMaxmp())
        Player.SetPerform(0);
    }
}

/**
 * 5705  繁星碎<玄>
 * 施法2秒，每段额外附加自身真气/佛魔气血上限15%的攻击力。
 * 攻击怪物目标时，无冷却且每段额外附加自身真气/佛魔气血上限10%的攻击力
 *
 * 繁星碎<玄>：每段禁食1秒，降低目标当前真气4%，持续10秒最高叠加5层；第一段10%概率触发无视神佑，存在2秒；
 */
class Skill5705 extends BaseHookSkillStub {

    constructor() {
        super(5705);
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
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
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

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(5);
        const Maxmp = player.GetMaxmp();
        player.SetVar2(Maxmp);
        const T2 = skill.GetT2();

        let v12 = Math.floor(skill.GetT4() * 0.02);
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = Math.floor(v9 * 0.02);
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = Math.floor(T3 * 0.02);
            }
        }

        const v8 = Math.floor(skill.GetLevel() * 0.12 + v12 + 1.0);
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxmp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.1)
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(6);
        const Maxmp = player.GetMaxmp();
        player.SetVar2(Maxmp);
        const T2 = skill.GetT2();

        let v12 = Math.floor(skill.GetT4() * 0.02);
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = Math.floor(v9 * 0.02);
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = Math.floor(T3 * 0.02);
            }
        }

        const v8 = Math.floor(skill.GetLevel() * 0.12 + v12 + 1.0);
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxmp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.1)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(7);
        const Maxmp = player.GetMaxmp();
        player.SetVar2(Maxmp);
        const T2 = skill.GetT2();

        let v12 = Math.floor(skill.GetT4() * 0.02);
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = Math.floor(v9 * 0.02);
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = Math.floor(T3 * 0.02);
            }
        }

        const v8 = Math.floor(skill.GetLevel() * 0.12 + v12 + 1.0);
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxmp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.1)
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(8);
        const Maxmp = player.GetMaxmp();
        player.SetVar2(Maxmp);
        const T2 = skill.GetT2();

        let v12 = Math.floor(skill.GetT4() * 0.02);
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = Math.floor(v9 * 0.02);
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = Math.floor(T3 * 0.02);
            }
        }

        const v8 = Math.floor(skill.GetLevel() * 0.12 + v12 + 1.0);
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxmp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.1)
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(9);
        const Maxmp = player.GetMaxmp();
        player.SetVar2(Maxmp);
        const T2 = skill.GetT2();

        let v12 = Math.floor(skill.GetT4() * 0.02);
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = Math.floor(v9 * 0.02);
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = Math.floor(T3 * 0.02);
            }
        }

        const v8 = Math.floor(skill.GetLevel() * 0.12 + v12 + 1.0);
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxmp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.1)
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        const Maxmp = player.GetMaxmp();
        player.SetVar2(Maxmp);
        const T2 = skill.GetT2();

        let v12 = Math.floor(skill.GetT4() * 0.02);
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = Math.floor(v9 * 0.02);
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = Math.floor(T3 * 0.02);
            }
        }

        const v8 = Math.floor(skill.GetLevel() * 0.12 + v12 + 1.0);
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxmp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.1)
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(120, 1000)
        player.SetSubmp2(120, player.GetMp() * 0.04, 5, 10000)
        return true
    }

}

/**
 * 5709 繁星碎<煞>
 * 施法2秒，每段额外附加自身气血上限15%的攻击力。
 * 攻击怪物目标时，无冷却且每段额外附加自身真气/佛魔气血上限10%的攻击力
 * 每段禁食2秒，10%概率触发无视神佑，存在2秒，降低目标减免伤害2%，持续10秒，最高叠加3层
 */
class Skill5709 extends BaseHookSkillStub {

    constructor() {
        super(5709);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
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

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        if (player.GetTargetTypeIsMob()) {
            return 0
        }
        return 45000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(5);
        const Crit = player.GetCrit();
        const v4 = Math.floor(Crit / 19.99);
        player.SetVar2(v4);
        const T2 = skill.GetT2();
        let v13 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v13 = v9 * 0.02;

            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v13 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v13 + 1.0;
        skill.SetRatio(v8);
        const Level = skill.GetLevel();
        const maxhp = player.GetMaxhp();
        const v14 = (Level * maxhp) * 0.01;
        const v17 = (110 * skill.GetLevel()) + v14;
        skill.SetPlus(v17 + maxhp * 0.2);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(6);
        const Crit = player.GetCrit();
        const v4 = Math.floor(Crit / 19.99);
        player.SetVar2(v4);
        const T2 = skill.GetT2();
        let v13 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v13 = v9 * 0.02;

            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v13 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v13 + 1.0;
        skill.SetRatio(v8);
        const Level = skill.GetLevel();
        const maxhp = player.GetMaxhp();
        const v14 = (Level * maxhp) * 0.01;
        const v17 = (110 * skill.GetLevel()) + v14;
        skill.SetPlus(v17 + maxhp * 0.2);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(7);
        const Crit = player.GetCrit();
        const v4 = Math.floor(Crit / 19.99);
        player.SetVar2(v4);
        const T2 = skill.GetT2();
        let v13 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v13 = v9 * 0.02;

            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v13 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v13 + 1.0;
        skill.SetRatio(v8);
        const Level = skill.GetLevel();
        const maxhp = player.GetMaxhp();
        const v14 = (Level * maxhp) * 0.01;
        const v17 = (110 * skill.GetLevel()) + v14;
        skill.SetPlus(v17 + maxhp * 0.2);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(8);
        const Crit = player.GetCrit();
        const v4 = Math.floor(Crit / 19.99);
        player.SetVar2(v4);
        const T2 = skill.GetT2();
        let v13 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v13 = v9 * 0.02;

            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v13 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v13 + 1.0;
        skill.SetRatio(v8);
        const Level = skill.GetLevel();
        const maxhp = player.GetMaxhp();
        const v14 = (Level * maxhp) * 0.01;
        const v17 = (110 * skill.GetLevel()) + v14;
        skill.SetPlus(v17 + maxhp * 0.2);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(9);
        const Crit = player.GetCrit();
        const v4 = Math.floor(Crit / 19.99);
        player.SetVar2(v4);
        const T2 = skill.GetT2();
        let v13 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v13 = v9 * 0.02;

            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v13 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v13 + 1.0;
        skill.SetRatio(v8);
        const Level = skill.GetLevel();
        const maxhp = player.GetMaxhp();
        const v14 = (Level * maxhp) * 0.01;
        const v17 = (110 * skill.GetLevel()) + v14;
        skill.SetPlus(v17 + maxhp * 0.2);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        const Crit = player.GetCrit();
        const v4 = Math.floor(Crit / 19.99);
        player.SetVar2(v4);
        const T2 = skill.GetT2();
        let v13 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v13 = v9 * 0.02;

            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v13 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v13 + 1.0;
        skill.SetRatio(v8);
        const Level = skill.GetLevel();
        const maxhp = player.GetMaxhp();
        const v14 = (Level * maxhp) * 0.01;
        const v17 = (110 * skill.GetLevel()) + v14;
        skill.SetPlus(v17 + maxhp * 0.2);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetDiet(120, 2000)
        player.SetFlamecurse(120, 10000, 0.02, 3)
        return true
    }
}

/**
 * 5713 繁星碎<禅>
 * 施法2秒，每段额外附加自身气血上限15%的攻击力。
 * 攻击怪物目标时，无冷却且每段额外附加自身真气/佛魔气血上限10%的攻击力
 * 每段禁食1秒，10%概率触发无视神佑，存在2秒，降低目标御仙、魔、佛10%，持续10秒
 */
class Skill5713 extends BaseHookSkillStub {

    constructor() {
        super(5713);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
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

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(5);
        const Skilldodge = player.GetSkilldodge();
        player.SetVar2(Skilldodge);
        const T2 = skill.GetT2();
        let v12 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = v9 * 0.02;
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v12 + 1.0;
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(6);
        const Skilldodge = player.GetSkilldodge();
        player.SetVar2(Skilldodge);
        const T2 = skill.GetT2();
        let v12 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = v9 * 0.02;
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v12 + 1.0;
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(7);
        const Skilldodge = player.GetSkilldodge();
        player.SetVar2(Skilldodge);
        const T2 = skill.GetT2();
        let v12 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = v9 * 0.02;
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v12 + 1.0;
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(8);
        const Skilldodge = player.GetSkilldodge();
        player.SetVar2(Skilldodge);
        const T2 = skill.GetT2();
        let v12 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = v9 * 0.02;
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v12 + 1.0;
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(9);
        const Skilldodge = player.GetSkilldodge();
        player.SetVar2(Skilldodge);
        const T2 = skill.GetT2();
        let v12 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = v9 * 0.02;
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v12 + 1.0;
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(0);
        const Skilldodge = player.GetSkilldodge();
        player.SetVar2(Skilldodge);
        const T2 = skill.GetT2();
        let v12 = skill.GetT4() * 0.02;
        if (T2 >= skill.GetT3()) {
            const v9 = skill.GetT2();
            if (v9 >= skill.GetT4()) {
                v12 = v9 * 0.02;
            }
        } else {
            const T3 = skill.GetT3();
            if (T3 >= skill.GetT4()) {
                v12 = T3 * 0.02;
            }
        }

        const v8 = skill.GetLevel() * 0.12 + v12 + 1.0;
        skill.SetRatio(v8);
        const v11 = 110 * skill.GetLevel();
        skill.SetPlus(v11 + player.GetMaxhp() * 0.15);
        skill.SetMobBonusDamage(player.GetMaxhp() * 0.1)
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        //每段禁食1秒，10%概率触发无视神佑，存在2秒，降低目标御仙、魔、佛10%，持续10秒（不叠加）
        player.SetDiet(120, 1000)

        player.SetDecCultRes(120, 10000, 0.1, 0, 0)
        player.SetDecCultRes(120, 10000, 0.1, 1, 1)
        player.SetDecCultRes(120, 10000, 0.1, 2, 2)
        return true
    }
}

/**
 * 5703  排山倒海<玄>
 * 排山倒海<玄><煞><禅>新增效果：令自身进入迅疾状态，减少施法速度2.5% * level，持续时间为1.5 * level秒。
 * 50%。30秒
 *
 * 玄烛·疾风斩月·曦日：
 * 新增效果-被动减少排山倒海<玄><煞><禅>冷却时间40秒
 */
class Skill5703 extends BaseHookSkillStub {

    constructor() {
        super(5703);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        let t = 0
        if (player.GetSkilllevel(6976) > 0) {
            t = 40000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - t;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        const r = skill.GetLevel() * 0.025
        player.SetSwift(120, skill.GetLevel() * 1500, r, 0)
        return true
    }

}

class Skill5708 extends BaseHookSkillStub {

    constructor() {
        super(5708);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        let t = 0
        if (player.GetSkilllevel(6976) > 0) {
            t = 40000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - t;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        const r = skill.GetLevel() * 0.025
        player.SetSwift(120, skill.GetLevel() * 1500, r, 0)
        return true
    }

}

class Skill5712 extends BaseHookSkillStub {

    constructor() {
        super(5712);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        let t = 0
        if (player.GetSkilllevel(6976) > 0) {
            t = 40000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - t;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        const r = skill.GetLevel() * 0.025
        player.SetSwift(120, skill.GetLevel() * 1500, r, 0)
        return true
    }

}

/**
 * 5702 万象鸿冥<玄>
 * 冷却减少10秒
 *
 */
class Skill5702 extends BaseHookSkillStub {

    constructor() {
        super(5702);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

class Skill5707 extends BaseHookSkillStub {

    constructor() {
        super(5707);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

class Skill5711 extends BaseHookSkillStub {

    constructor() {
        super(5711);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

}

/**
 * 5804  繁星碎III 《碧海》
 *
 * 施法2秒，额外附加自身气血上限和真气上限10%的攻击力，清除自身冷却概率75%，
 * 第一击降低目标气血上限几率改为100%，降低数值改为自身最大攻击力的5倍，最多降低目标50%气血上限，
 * 第一击增加目标被致命一击伤害360%，持续20秒，
 * 每一击清除目标2个有利状态，
 * 如果目标为怪物，额外附加自身气血上限和真气上限10%的攻击力
 *
 * 原有碧海系特有效果删除（须弥破变身效果），新增效果：
 * 额外附加60点技能命中，第一击降低目标技能闪躲50点，降低目标减免伤害百分比5%，持续15秒
 */
class Skill5804 extends BaseHookSkillStub {

    constructor() {
        super(5804);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const wf3Lv = player.GetSkilllevel(5889) + player.GetSkilllevel(5890)
            + player.GetSkilllevel(5891)
        let t = 0
        if (wf3Lv > 0) {
            t = wf3Lv * 3000
        }

        const yx = player.GetSkilllevel(5892)
        if (yx > 0) {
            t = yx * 5000
        }

        return 20000 - t
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
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

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar2(res4);
        player.SetVar1(5);
        player.SetVar3(player.GetMaxatk());

        const level = skill.GetLevel();
        const critValue = (level + 2) * 0.01;
        skill.SetCrit(critValue);

        const critHurtValue = (5 * level + 10) * 0.01 + 1.0;
        skill.SetCrithurt(critHurtValue);

        const skillAccuracy = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(skillAccuracy);

        const ratioValue = (5 * level + 10) * 0.01 + 2.0;
        skill.SetRatio(ratioValue);

        const plusValue = 1000 * level + 2000;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(plusValue + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)

        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar2(res4);
        player.SetVar1(6);

        const level = skill.GetLevel();
        const critValue = (level + 2) * 0.01;
        skill.SetCrit(critValue);

        const critHurtValue = (5 * level + 10) * 0.01 + 1.0;
        skill.SetCrithurt(critHurtValue);

        const skillAccuracy = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(skillAccuracy);

        const ratioValue = (5 * level + 10) * 0.01 + 2.0;
        skill.SetRatio(ratioValue);

        const plusValue = 1000 * level + 2000;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(plusValue + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)

        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar2(res4);
        player.SetVar1(7);

        const level = skill.GetLevel();
        const critValue = (level + 2) * 0.01;
        skill.SetCrit(critValue);

        const critHurtValue = (5 * level + 10) * 0.01 + 1.0;
        skill.SetCrithurt(critHurtValue);

        const skillAccuracy = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(skillAccuracy);

        const ratioValue = (5 * level + 10) * 0.01 + 2.0;
        skill.SetRatio(ratioValue);

        const plusValue = 1000 * level + 2000;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(plusValue + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)

        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar2(res4);
        player.SetVar1(8);

        const level = skill.GetLevel();
        const critValue = (level + 2) * 0.01;
        skill.SetCrit(critValue);

        const critHurtValue = (5 * level + 10) * 0.01 + 1.0;
        skill.SetCrithurt(critHurtValue);

        const skillAccuracy = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(skillAccuracy);

        const ratioValue = (5 * level + 10) * 0.01 + 2.0;
        skill.SetRatio(ratioValue);

        const plusValue = 1000 * level + 2000;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(plusValue + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)

        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar2(res4);
        player.SetVar1(9);

        const level = skill.GetLevel();
        const critValue = (level + 2) * 0.01;
        skill.SetCrit(critValue);

        const critHurtValue = (5 * level + 10) * 0.01 + 1.0;
        skill.SetCrithurt(critHurtValue);

        const skillAccuracy = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(skillAccuracy);

        const ratioValue = (5 * level + 10) * 0.01 + 2.0;
        skill.SetRatio(ratioValue);


        const plusValue = 1000 * level + 2000;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(plusValue + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)

        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const res4 = player.GetRes4();
        player.SetVar2(res4);
        player.SetVar1(4);

        const level = skill.GetLevel();
        const critValue = (level + 2) * 0.01;
        skill.SetCrit(critValue);

        const critHurtValue = (5 * level + 10) * 0.01 + 1.0;
        skill.SetCrithurt(critHurtValue);

        const skillAccuracy = Math.floor((2 * (level + 2)) * 0.01);
        skill.SetSkillaccu(skillAccuracy);

        const ratioValue = (5 * level + 10) * 0.01 + 2.0;
        skill.SetRatio(ratioValue);

        const plusValue = 1000 * level + 2000;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(plusValue + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)

        player.SetPerform(0);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice();
        const var1Value = player.GetVar1();
        if (var1Value == 5) {
            player.SetIncskillaccu(120, 0.03 * skill.GetLevel(), 5000 * skill.GetLevel(), 1)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        // 第一击降低目标气血上限几率改为100%，降低数值改为自身最大攻击力的5倍，最多降低目标50%气血上限，
        // 第一击增加目标被致命一击伤害调整为360%，概率不变，持续20秒，
        // 每一击清除目标2个有利状态，
        player.SetClearbuff(120, 2);

        const var1Value = player.GetVar1();

        //第一击降低目标技能闪躲50点，降低目标减免伤害百分比5%，持续15秒
        if (var1Value == 5) {
            player.SetSubhp(120, player.GetVar3() * 5, player.GetMaxhp() * 0.5, 4100, 1);
            player.SetDecskilldodge(120, 0.025 * skill.GetLevel(), 5000 * skill.GetLevel(), 1)
            player.SetFlamecurse(120, 5000 * skill.GetLevel(), 0.05, 1)
        }

        player.SetIncfatalhurt(80, 0.6, 20100, var1Value);
        return true
    }

}

/**
 * 5806  繁星碎III 《英雄》
 * 施法2秒，额外附加自身气血上限和真气上限10%的攻击力，清除自身冷却概率75%，
 * 第一击降低目标气血上限几率改为100%，降低数值改为自身最大攻击力的5倍，最多降低目标50%气血上限，
 * 每一击增加目标被致命一击伤害60%，持续20秒，
 * 每一击清除目标2个有利状态，
 * 如果目标为怪物，额外附加自身气血上限和真气上限10%的攻击力
 *
 * 冷却减少5秒。第一击降低目标御仙、魔、佛10%，持续15秒。每段降低目标减免伤害3%，持续10秒，最高叠加3层
 */
class Skill5806 extends BaseHookSkillStub {

    constructor() {
        super(5806);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const wf3Lv = player.GetSkilllevel(5889) + player.GetSkilllevel(5890)
            + player.GetSkilllevel(5891)
        let t = 0
        if (wf3Lv > 0) {
            t = wf3Lv * 3000
        }

        const yx = player.GetSkilllevel(5892)
        if (yx > 0) {
            t = yx * 5000
        }

        return 15000 - t
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 200
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

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);
        player.SetVar1(5);
        player.SetVar3(player.GetMaxatk());
        const v12 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v12);

        const v13 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v13);

        const Level = skill.GetLevel();
        const v10 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v10);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v14);

        const Hp = player.GetMaxhp();
        const v11 = (Hp * skill.GetLevel()) * 0.05;
        const v15 = (1000 * skill.GetLevel() + 2000) + v11;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(v15 + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetPerform(1);

    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);
        player.SetVar1(6);
        const v12 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v12);

        const v13 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v13);

        const Level = skill.GetLevel();
        const v10 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v10);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v14);

        const Hp = player.GetMaxhp();
        const v11 = (Hp * skill.GetLevel()) * 0.05;
        const v15 = (1000 * skill.GetLevel() + 2000) + v11;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(v15 + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetPerform(0);

    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);
        player.SetVar1(7);
        const v12 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v12);

        const v13 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v13);

        const Level = skill.GetLevel();
        const v10 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v10);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v14);

        const Hp = player.GetMaxhp();
        const v11 = (Hp * skill.GetLevel()) * 0.05;
        const v15 = (1000 * skill.GetLevel() + 2000) + v11;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(v15 + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetPerform(0);

    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);
        player.SetVar1(8);
        const v12 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v12);

        const v13 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v13);

        const Level = skill.GetLevel();
        const v10 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v10);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v14);

        const Hp = player.GetMaxhp();
        const v11 = (Hp * skill.GetLevel()) * 0.05;
        const v15 = (1000 * skill.GetLevel() + 2000) + v11;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(v15 + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetPerform(0);

    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);
        player.SetVar1(9);
        const v12 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v12);

        const v13 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v13);

        const Level = skill.GetLevel();
        const v10 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v10);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v14);

        const Hp = player.GetMaxhp();
        const v11 = (Hp * skill.GetLevel()) * 0.05;
        const v15 = (1000 * skill.GetLevel() + 2000) + v11;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(v15 + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetPerform(0);

    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Res4 = player.GetRes4();
        player.SetVar2(Res4);
        player.SetVar1(4);
        const v12 = (skill.GetLevel() + 2) * 0.01;
        skill.SetCrit(v12);

        const v13 = (5 * skill.GetLevel() + 10) * 0.01 + 1.0;
        skill.SetCrithurt(v13);

        const Level = skill.GetLevel();
        const v10 = Math.floor((2 * (Level + 2)) * 0.01);
        skill.SetSkillaccu(v10);

        const v14 = (5 * skill.GetLevel() + 10) * 0.01 + 2.0;
        skill.SetRatio(v14);

        const Hp = player.GetMaxhp();
        const v11 = (Hp * skill.GetLevel()) * 0.05;
        const v15 = (1000 * skill.GetLevel() + 2000) + v11;
        const plus = player.GetMaxHPAndMP() * (0.01 + 0.03 * skill.GetLevel())
        skill.SetPlus(v15 + plus);
        skill.SetMobBonusDamage(player.GetMaxHPAndMP() * 0.1)
        player.SetPerform(0);

    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        // 第一击降低目标气血上限几率改为100%，降低数值改为自身最大攻击力的5倍，最多降低目标50%气血上限，
        // 第一击增加目标被致命一击伤害调整为360%，概率不变，持续20秒，
        // 每一击清除目标2个有利状态，
        player.SetClearbuff(120, 2);
        const var1Value = player.GetVar1();
        if (var1Value == 5) {
            player.SetSubhp(120, player.GetVar3() * 5, player.GetMaxhp() * 0.5, 4100, 1);
            player.SetDecCultRes(120, 15000, 0.1, 0, 0)
            player.SetDecCultRes(120, 15000, 0.1, 1, 1)
            player.SetDecCultRes(120, 15000, 0.1, 2, 2)
        }

        player.SetIncfatalhurt(80, 0.6, 20100, var1Value);
        player.SetFlamecurse(120, 10000, 0.03, 3)
        return true
    }

}

/**
 * 5889  万夫莫开III 《天空》《碧海》《大地》《英雄》
 * 减伤效果90%，冷却固定35秒，持续5*level+12秒
 *
 * 10.万夫莫开II：新增影响万夫莫开Ⅲ全系列，额外增加触发免疫伤害和负面效果持续时间5秒和抵消次数15次
 * 18.万夫莫开Ⅲ《天空》《碧海》《大地》《英雄》：减伤效果提高至90%，冷却时间调整为固定35秒，持续时间调整为5*level+12秒
 * 新增效果二-《天空》《碧海》《大地》被动减少繁星碎Ⅲ全系列冷却时间9秒
 *
 * 《天空》《碧海》《大地》减少繁星碎Ⅲ《碧海》《英雄》冷却时间9秒。
 * 英雄系减少繁星碎Ⅲ《碧海》《英雄》冷却时间15
 */
class Skill5889 extends BaseHookSkillStub {

    constructor() {
        super(5889);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 5000 * skill.GetLevel() + 12000;
        const ta = skill.GetT0();
        let v5;
        if (skill.GetT0() > 0)
            v5 = 5718;
        else
            v5 = 5379;
        const tb = player.GetMaxhp();
        player.SetParry2(111, t, 0.9, tb, v5, ta);

        player.SetDispel(120, 2.0, 4099, 2);

        const tc = 2000 * skill.GetLevel() + 8000;
        player.SetActivebeattacked(100, 5922, 1, tc, 0);
        return true
    }
}

class Skill5890 extends BaseHookSkillStub {

    constructor() {
        super(5890);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 5000 * skill.GetLevel() + 12000;
        const ta = skill.GetT0();
        let v5;
        if (skill.GetT0() > 0)
            v5 = 5718;
        else
            v5 = 5379;
        const tb = player.GetMaxhp();
        player.SetParry2(111, t, 0.9, tb, v5, ta);

        const tc = 2000 * skill.GetLevel() + 8000;
        let td = player.GetSkilllevel(5694) * 0.01 * 3.0;
        const ratio = (8 * player.GetSkilllevel(5406)) * 0.01 + td;
        const a = 10 * player.GetMaxhp();
        player.SetSkilltransfer(tc, ratio, a, 100);

        return true
    }
}

class Skill5891 extends BaseHookSkillStub {

    constructor() {
        super(5891);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 5000 * skill.GetLevel() + 12000;
        const tb = player.GetMaxhp();
        player.SetParry2(111, t, 0.9, tb, 5718, player.GetSkilllevel(5693));

        return true
    }

}

class Skill5892 extends BaseHookSkillStub {

    constructor() {
        super(5892);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 35000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetSkilllevel(5693) > 0) {
            player.SetBlessed(15, 5000)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const t = 5000 * skill.GetLevel() + 12000;
        const ta = skill.GetT0();
        const v5 = (skill.GetT0() > 0) ? 5718 : 5379;
        player.SetParry2(111, t, 0.9, player.GetMaxhp(), v5, ta);
        return true
    }

}

// /**
//  * 5718
//  * 5693万夫莫开II：新增影响万夫莫开Ⅲ全系列，额外增加触发免疫伤害和负面效果持续时间5秒和抵消次数15次
//  */
// class Skill5718 extends BaseHookSkillStub {
//
//     constructor() {
//         super(5718);
//     }
//
//     StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
//         const player = skill.GetPlayerNice();
//
//         let v4 = 0;
//         if (player.GetSkilllevel(5693) > 0 && player.GetCultivation() == 2) {
//             v4 = Math.floor(500 * skill.GetLevel());
//         }
//
//         let d = Math.floor(2 * skill.GetLevel() + 5);
//         player.SetBlessed(d + 15, v4 + 5000);
//
//         let ta = 0
//         if (player.GetSkilllevel(5891) <= 0) {
//             ta = 0
//         } else {
//             ta = Math.floor(2000 * player.GetSkilllevel(5891) + 8000);
//         }
//
//         player.SetIncskilldamage(0.15000001, ta, 1);
//         return true
//     }
//
// }

/**
 * 6968  赤乌·暗剑藏锋·萤炬
 * 赤乌·暗剑藏锋·萤炬/皓月/曦日 标记效果的持续时间30秒，减少目标技能闪躲效果的持续3+3*level 秒。
 *
 */
class Skill6968 extends BaseHookSkillStub {

    constructor() {
        super(6968);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetSign(111, 30100);

        player.SetIncfatalratio(120, 0.03, 18100, 3);

        const d = Math.floor(skill.GetLevel() * 0.06);
        player.SetDecskilldodge(100, d, 3000 + 3000 * skill.GetLevel(), 9);

        const caster_cb = player.GetVar1() / 1000.0;
        const target_cb = player.GetCrithurt();
        let res_caster, res_target;
        if (caster_cb <= target_cb) {
            res_caster = -(target_cb - caster_cb);
            res_target = target_cb - caster_cb;
        } else {
            res_caster = caster_cb - target_cb;
            res_target = -(caster_cb - target_cb);
        }

        const da = 8 * (skill.GetLevel() + 5);
        player.SetSwapCritHurt(da, 10100, res_caster, res_target);

        let bon = 0.0;
        const var2 = player.GetVar2();
        if (var2 > player.GetStunRes()) {
            bon = (var2 - player.GetStunRes()) / 5;
        }
        if (bon > 30.0) {
            bon = 30.0;
        }

        const db = 10 * skill.GetLevel() + 20 + bon;
        player.SetGoback(db, 5050, 1);

        return true
    }

}

/**
 * 6969
 *
 */
class Skill6969 extends BaseHookSkillStub {

    constructor() {
        super(6969);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetSign(111, 30100);

        player.SetIncfatalratio(120, 0.06, 18100, 3);

        const d = Math.floor(skill.GetLevel() * 0.06);
        player.SetDecskilldodge(100, d, 3000 + 3000 * skill.GetLevel(), 9);

        const caster_cb = player.GetVar1() / 1000.0;
        const target_cb = player.GetCrithurt();
        let res_caster, res_target;
        if (caster_cb <= target_cb) {
            res_caster = -(target_cb - caster_cb);
            res_target = target_cb - caster_cb;
        } else {
            res_caster = caster_cb - target_cb;
            res_target = -(caster_cb - target_cb);
        }

        const da = 8 * (skill.GetLevel() + 5);
        player.SetSwapCritHurt(da, 10100, res_caster, res_target);

        let bon = 0.0;
        const var2 = player.GetVar2();
        if (var2 > player.GetStunRes()) {
            bon = (var2 - player.GetStunRes()) / 5;
        }
        if (bon > 30.0) {
            bon = 30.0;
        }

        const db = 10 * skill.GetLevel() + 20 + bon;
        player.SetGoback(db, 5050, 1);

        return true
    }

}

/**
 * 6970
 * 曦日：冷却减少10秒，标记的目标10秒内被周期性魅惑。魅惑能力自身魅抗+80
 */
class Skill6970 extends BaseHookSkillStub {

    constructor() {
        super(6970);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar3(player.GetSilenceRes() + 80)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetSign(111, 30100);

        player.SetIncfatalratio(120, 0.09, 18100, 3);

        const d = Math.floor(skill.GetLevel() * 0.06);
        player.SetDecskilldodge(100, d, 3000 + 3000 * skill.GetLevel(), 9);

        const caster_cb = player.GetVar1() / 1000.0;
        const target_cb = player.GetCrithurt();
        let res_caster, res_target;
        if (caster_cb <= target_cb) {
            res_caster = -(target_cb - caster_cb);
            res_target = target_cb - caster_cb;
        } else {
            res_caster = caster_cb - target_cb;
            res_target = -(caster_cb - target_cb);
        }

        const da = 8 * (skill.GetLevel() + 5);
        player.SetSwapCritHurt(da, 10100, res_caster, res_target);

        let bon = 0.0;
        const var2 = player.GetVar2();
        if (var2 > player.GetStunRes()) {
            bon = (var2 - player.GetStunRes()) / 5;
        }
        if (bon > 30.0) {
            bon = 30.0;
        }

        const db = 10 * skill.GetLevel() + 20 + bon;
        player.SetGoback(db, 5050, 1);

        player.SetSilenttimer(player.GetVar3() - player.GetSilenceRes(), 10000, 1.0, 3.0);
        return true
    }

}

/**
 */
export class PoJunSkillList {
    constructor() {
        new Skill5388()
        new Skill5392()
        new Skill5411()
        new Skill5396()
        new Skill5404()
        new Skill5717()
        new Skill5384()
        new Skill5395()
        new Skill5399()
        new Skill5716()
        new Skill5406()
        new Skill5405()
        new Skill5403()
        new Skill5435()
        new Skill5691()
        new Skill5412()
        new Skill5704()
        new Skill5706()
        new Skill5710()
        new Skill5705()
        new Skill5709()
        new Skill5713()
        new Skill5703()
        new Skill5708()
        new Skill5712()
        new Skill5702()
        new Skill5707()
        new Skill5711()
        new Skill5804()
        new Skill5806()
        new Skill5889()
        new Skill5890()
        new Skill5891()
        new Skill5892()
        new Skill6968()
        new Skill6969()
        new Skill6970()
        new Skill5379()
    }
}