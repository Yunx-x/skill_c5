import {BaseHookSkillStub} from "../base/skill/BaseHookSkillStub";
import {Skill} from "../base/skill/Skill";
import {Frozen_multi} from "../base/ExtFunc";
import {norm, zrand} from "../base/ConstFunc";
import {
    GetTs579Effect,
    GetTs583Effect1,
    GetTs592Effect1,
    GetTs592Effect2,
    GetTs592Effect3,
    GetTs596Effect,
    GetTs602Effect,
    GetTs606Effect,
    GetTs607Effect,
    GetTs617Effect1,
    GetTs617Effect2,
    setUniqprompt
} from "../talent/QingYunTalent";

/**
 * 223 寒冰咒   9
 * 单体攻击10.7米，施法时间1秒，技能冷却2秒。
 * 攻击目标1次，附加53/85点攻击力。
 * 有48%/72%几率使目标被冰冻，持续4/12秒：降低其移动速度22%/46%
 *
 * 567  寒冰烈炎    2
 * 被动生效
 * 寒冰咒每升一级攻击力额外增加6点，并使其减速能力和降低速度能力少量增加。
 *
 * 盛冰之寒
 * 寒冰类法术的技能附加攻击力增加10%
 *
 */
class Skill223 extends BaseHookSkillStub {

    constructor() {
        super(223);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();

        const sk567 = player.GetSkilllevel(567);
        const tsPlus1 = sk567 * 6 * skill.GetLevel()

        skill.SetPlus(49 + skill.GetLevel() * 4 + tsPlus1);

        player.SetVar1(sk567)

        GetTs602Effect(stub, skill, originFunc)
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const tsAdd1 = player.GetVar1() * 2 * skill.GetLevel()

        player.SetFrozen(45 + skill.GetLevel() * 3 + tsAdd1, 1, 3100 + skill.GetLevel() * 1000, 1);
        player.SetSlow(-1, 0.19 + skill.GetLevel() * 0.03, 3100 + skill.GetLevel() * 1000, 1);

        return true
    }
}

/**
 * 460 养生主   3
 * 被动。
 * 永久增加自身真气回复速度30%/90%，永久增加自身增加自身定身抗性15/45点。
 *
 * 584  修身养性
 * 养生主每升一级真气回复速度额外增加15%。
 */
class Skill460 extends BaseHookSkillStub {

    constructor() {
        super(460);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts584Level = player.GetSkilllevel(584);
        const ts1 = ts584Level * 0.15;

        player.SetPasincmpgen((0.3 + ts1) * skill.GetLevel());
        player.SetPasaddanti(15 * skill.GetLevel());

        const ts595 = player.GetSkilllevel(595);
        player.SetPasaddhp(ts595 * 120 * skill.GetLevel())

        return true;
    }

}

/**
 * 226 寒霜剑气   9
 * 线型攻击14米，目标限制15个，施法时间1秒，技能冷却2秒。
 * 攻击目标1次，附加46/97点攻击力。
 * 有37%/53%几率使目标被冰冻，持续3秒：降低其移动速度10%/26%。
 *
 * 霜寒化境	被动生效
 * 寒霜剑气每升一级攻击力额外增加4点，冰冻效果持续总时间增加3秒。
 */
class Skill226 extends BaseHookSkillStub {

    constructor() {
        super(226);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        const ts605 = player.GetSkilllevel(605);

        skill.SetPlus(40 + skill.GetLevel() * 6 + ts605 * 4 * skill.GetLevel());

        GetTs602Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        player.SetVar1(ts605)
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetFrozen(35 + skill.GetLevel() * 2, 1, 3000 + player.GetVar1() * 3000, 1);

        player.SetSlow(-1, 0.08 + skill.GetLevel() * 0.02, 3000, 1);

        return true;
    }

}

/**
 * 233 逍遥游   5
 * 施法时间1秒，技能冷却75秒。
 * 16/24秒内移动速度增加2.5/4.1米/秒，非战斗状态下300/1500秒内真气回复速度增加12%/100%，加速效果在骑乘状态下无效，冷却时间75秒。
 *
 * 601  气御六合
 * 逍遥游真气回复速度每级增加25%，增加真气回复效果持续时间300秒，加速效果持续时间5秒。
 */
class Skill233 extends BaseHookSkillStub {

    constructor() {
        super(233);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 75000 - GetTs596Effect(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();
        const ts601 = player.GetSkilllevel(601)

        // 移动速度增加：16/24秒内移动速度增加2.5/4.1米/秒
        player.SetAddspeed(100, 16000 + (level - 1) * 2000 + ts601 * 5000, 2.5 + (level - 1) * 0.4, 1);

        // 真气回复速度增加：非战斗状态下300/1500秒内真气回复速度增加12%/100%
        player.SetIncmpgen(0.12 + (level - 1) * 0.22 + 0.25 * ts601 * level, level * 300000 + ts601 * 300000, 1);

        GetTs592Effect1(stub, skill, originFunc)
        return true
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {

        return true;
    }

}

/**
 * 222 御剑诀   9
 * 真气贯穿+1（真气大于95%时追加本体攻击力4%）
 * 单体攻击10.7米，施法时间1秒，技能冷却6秒。
 * 攻击目标1次，每击附加68/156点攻击力。
 *
 * 569  风剑之芒    2
 * 被动生效
 * 御剑诀追加攻击力提升15%;
 *
 * 579  天剑随心    2
 * 被动生效
 * 降低单攻剑气类技能的冷却时间1秒。
 *
 * 583  剑魔宿命    4
 * 被动生效
 * 单攻剑气类技能的附加人物本体攻击增加5%,
 * 并额外追加该类技能致命一击率1%
 * 攻击怪物目标时，额外附加自身当前真气4%的攻击力。
 *
 * (任一单攻剑气类技能达到9阶，均相互额外追加5%的本体攻击，并且各自附加致命一击伤害30%，致命一击率1%)
 *
 */
class Skill222 extends BaseHookSkillStub {

    constructor() {
        super(222);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            skill.SetRatio(1 + 0.04);
        }

        const ts569 = player.GetSkilllevel(569);
        skill.SetPlus((57 + skill.GetLevel() * 11) * (ts569 * 0.15 + 1));

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(1);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)
        return true
    }

}

/**
 * 231 五气朝元   8
 * 群体祝福，自身周围18米，施法时间1秒，技能冷却2秒。
 * 令自身及周围18米内队友真气上限提升5%/40%，效果持续30分钟。
 *
 * 586  内气充盈    2
 * 被动生效
 * 五气朝元的效果每级增加1%，持续时间增加15分钟。
 */
class Skill231 extends BaseHookSkillStub {

    executetime = [800, 200]

    constructor() {
        super(231);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const ts586 = player.GetSkilllevel(586);
        player.SetVar1(ts586)
        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts586 = player.GetVar1();
        const tsTime = ts586 * 900000
        const tsRatio = ts586 * 0.01

        player.SetZhaoqi(120, 0.05 * skill.GetLevel() + tsRatio, 0, 1800000 + tsTime, 1);
        return true
    }

}

/**
 * 225 驭雷术   9
 * 群体攻击，目标周围半径8米，目标限制16个，施法时间2秒，技能冷却2秒。
 * 攻击目标周围1次，附加128/209点攻击力。
 *
 * 610  玄刹天威
 * 以下技能有5%几率令目标防御下降5%，效果持续3秒。
 * 影响技能:驭雷术、五雷轰顶、霜天雪舞、雷光遁龙诀。
 *
 */
class Skill225 extends BaseHookSkillStub {

    constructor() {
        super(225);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();

        skill.SetPlus(119 + skill.GetLevel() * 10);
        GetTs606Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)

        player.SetVar1(player.GetSkilllevel(610))
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts610 = player.GetVar1()
        player.SetDecdefence(5 * ts610, 0.05 * ts610, 3000 * ts610, 1)
        return true
    }

}

/**
 * 232 归元剑气   9
 * 单体攻击10.7米，施法时间1秒，技能冷却6秒。
 * 攻击目标1次，附加本体攻击2%，附加151/271点攻击力，并令自身此次和3秒内的攻击力上升6/54点。
 * 570  归元真解    2
 * 被动生效
 * 归元剑气追加攻击力增强效果提升，数值相当于人物等级的50%，持续时间增加2秒。
 * 579  天剑随心    2
 * 被动生效
 * 降低单攻剑气类技能的冷却时间1秒。
 *
 * 604  剑元之聚
 * 归元剑气有15%概率击退怪物，并有5%几率造成极效附加攻击祝福效果。
 *
 */
class Skill232 extends BaseHookSkillStub {

    constructor() {
        super(232);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        skill.SetRatio(1 + 0.02);
        skill.SetPlus(136 + skill.GetLevel() * 15);

        GetTs583Effect1(stub, skill, originFunc)
        player.SetVar1(player.GetSkilllevel(604))
        player.SetPerform(1);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts570 = player.GetSkilllevel(570)
        const ts604 = player.GetSkilllevel(604)

        const tsTime = ts570 * 2000
        const tsPlus = ts570 * player.GetLevel() * 0.5

        let plus = 6 * skill.GetLevel() + tsPlus

        const tsRatio = (zrand(100) / ts604 * -5 + 100) + 1
        plus *= tsRatio

        player.SetAddattack(120, 3100 + tsTime, plus, 1);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetRepel(15 * player.GetVar1(), 9.0)
        return true
    }

}

/**
 * 380 玄妙镜   6
 * 被动。
 * 永久增加自身眩晕抗性5/30点。
 *
 * 587  玄通妙语
 * 玄妙镜增加眩晕抗性效果提升20%
 *
 * 血脉调和
 * 你在每个门派被动技能上的投入点数,将为你额外提供120点气血上限增益。
 */
class Skill380 extends BaseHookSkillStub {

    constructor() {
        super(380);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts587 = player.GetSkilllevel(587);
        const tsRatio = ts587 * 0.2
        player.SetPasadddizzy(5 * skill.GetLevel() * (1 + tsRatio));

        const ts595 = player.GetSkilllevel(595);
        player.SetPasaddhp(ts595 * 120 * skill.GetLevel())

        return true
    }

}

/**
 * 230 玄冰刺   9
 * 霜燃劲气+1（劲气冲击，33%几率击退怪物目标）
 * 群体攻击，扇形120度半径6.0米，目标限制24个，施法时间1秒，技能冷却1秒。
 * 攻击目标1次，附加56/128点攻击力。
 * 有45%/85%几率使目标被冰冻，持续3.0/7.0秒：降低其移动速度22%/54%。
 *
 * 571  玄冰劲气    3
 * 被动生效
 * 玄冰刺如果令目标减速成功，则令其6秒内攻击力下降15点;
 */
class Skill230 extends BaseHookSkillStub {

    constructor() {
        super(230);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        skill.SetPlus(47 + skill.GetLevel() * 9);

        player.SetVar1(player.GetSkilllevel(571))

        GetTs602Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFrozen(40 + skill.GetLevel() * 5, 1, 2600 + skill.GetLevel() * 500, 1);
        player.SetSlow(-1, 0.18 + skill.GetLevel() * 0.04, 2600 + skill.GetLevel() * 500, 1);

        let ts571 = player.GetVar1();
        let v9 = 4000 * norm(ts571);
        let dc = v9 + 2000 * ts571 + 100;
        player.SetSubattack(-1, 15 * ts571, dc, 1);

        if (player.GetTypeIsMob) {
            player.SetRepel(33, 10)
        }

        return true
    }

}

/**
 * 235 真元护体   7
 * 自身祝福，施法时间1秒，技能冷却120/90秒。
 * 吸收9%/15%伤害，总量不超过自身真气上限的2倍，效果最多维持30秒，效果持续期间增加自身减免致命一击伤害10%。
 *
 * 588  护体罡气
 * 真元护体吸收伤害比例提升10%
 *
 * 1589  真元护体II
 * 被动
 * 令真元护体吸收伤害总量增加自身真气上限的2倍，吸收比例增加10%;
 */
class Skill235 extends BaseHookSkillStub {

    constructor() {
        super(235);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 125000 - skill.GetLevel() * 5000 - GetTs596Effect(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts588 = player.GetSkilllevel(588);
        const ts1589 = player.GetSkilllevel(1589);

        let ratio = 0.08 + skill.GetLevel() * 0.01
        ratio += ts588 * 0.1
        ratio += norm(ts1589) * 0.1

        let amount = 2 * player.GetMaxmp()
        amount += norm(ts1589) * 2

        player.SetMagicshield(ratio, amount, 30000)
        player.SetDecfatalhurt(120, 0.1, 30000, 1)

        GetTs592Effect1(stub, skill, originFunc)

        return true
    }

}

/**
 * 395 御空术   3
 * 御空术15米，施法时间0秒，技能冷却23/13秒。
 * 快速向前冲刺，有15%/35%概率解除减速。
 *
 * 603  剑之翔空
 * 御空术解除减速概率每级提升5%，并使技能的冷却减少5秒，能力略微提升。
 */
class Skill395 extends BaseHookSkillStub {

    constructor() {
        super(395);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        const ts603 = player.GetSkilllevel(603);
        return 28000 - skill.GetLevel() * 5000 - ts603 * 5000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts603 = player.GetSkilllevel(603);

        player.SetDodge(6000, 50 + ts603)

        const tsRatio = ts603 * 5 * skill.GetLevel()

        player.SetClearslow(10 + skill.GetLevel() * 5 + tsRatio)
        return true
    }
}

/**
 * 239 炼气还神   8
 * 自身祝福，施法时间1秒，技能冷却120秒。
 * 消耗240/1080点气血，自身在6/27秒内回复252/1512点真气，回复效果可与炼气还神Ⅱ叠加，吟唱期间补血类效果无效，气血不足效果削减。
 *
 * 589  炼神还虚
 * 炼气还神回复真气量提升60%，并有15%几率产生极效回复真气效果。
 */
class Skill239 extends BaseHookSkillStub {

    constructor() {
        super(239);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000 - GetTs596Effect(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts589 = player.GetSkilllevel(589);
        const tsValue = ts589 * 0.6 * (1 + Math.floor(zrand(100) / (ts589 * -16 + 100)))

        player.SetMpgen(120, 3000 * skill.GetLevel() + 3000, 0, (72 + skill.GetLevel() * 180) * (1 + tsValue), 5)

        GetTs592Effect2(stub, skill, originFunc)

        return true
    }
}

/**
 * 224 南华真经   6
 * 被动。
 * 永久增加自身真气上限300/1800点，永久增加自身自身减免致命一击率0.5%/3.0%。
 *
 * 591  玄经修为
 * 南华真经提升真气上限效果增加15%。
 * 南华真经每一级额外永久提升真气0.5%。
 */
class Skill224 extends BaseHookSkillStub {

    constructor() {
        super(224);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts591 = player.GetSkilllevel(591);
        const tsRatio = ts591 * 0.15

        player.SetPasaddmp(300 * skill.GetLevel() * (1 + tsRatio))

        player.SetPasdecfatalratio(0.05 * skill.GetLevel())

        player.SetPasaddmp(ts591 * 0.005 * skill.GetLevel())

        const ts595 = player.GetSkilllevel(595);
        player.SetPasaddhp(ts595 * 120 * skill.GetLevel())

        return true
    }

}

/**
 * 312 少阳剑气   9
 * 真气贯穿+2（真气大于95%时追加本体攻击力8%）
 * 单体攻击10.7米，施法时间1秒，技能冷却60秒。
 * 攻击目标1次，附加468/897点攻击力，定身能力为自身定抗的5%/45%，效果持续2.1/4.5秒。
 * 当自身攻击大于目标攻击时，有6%/54%概率令目标进入焱阳状态，持续15秒，
 * 效果为：令目标每次攻击都会丢失自身一个常规有利状态，且每次攻击目标造成伤害的50%由自身承担，青云自身每2万点攻击可额外提高成功率15%。
 *
 * 572  少阳初现    4
 * 被动生效
 * 少阳剑气的定身能力额外增加自身定抗的15%。
 * 少阳剑气附加攻击力提高20%。
 * 少阳剑气令目标进入焱阳状态的概率额外提升2%。
 */
class Skill312 extends BaseHookSkillStub {

    constructor() {
        super(312);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            skill.SetRatio(1 + 0.08)
        }

        const ts572 = player.GetSkilllevel(572)
        const tsV1 = ts572 * 0.15

        skill.SetPlus((411 + skillLevel * 54) * (ts572 * 0.2 + 1))

        player.SetVar1(player.GetRes3() * (skillLevel * 0.05 + tsV1))
        player.SetVar2(player.GetMaxatk())
        player.SetVar3(ts572)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetWrap(player.GetVar1(), 1900 + skill.GetLevel() * 300)
        const maxAtk = player.GetMaxatk();
        if (player.GetVar2() > maxAtk) {
            //当自身攻击大于目标攻击时，有6%/54%概率令目标进入焱阳状态，持续15秒
            //令目标每次攻击都会丢失自身一个常规有利状态，且每次攻击目标造成伤害的50%由自身承担，
            // 青云自身每2万点攻击可额外提高成功率15%。
            const r = Math.floor(player.GetVar2() / 20000) * 0.15
            const tsProb = player.GetVar3() * 2
            player.SetBlazingSun(skill.GetLevel() * 6 + r + tsProb, 15000, 0.5, 0)
        }

        return true
    }

}

/**
 * 234 雷云风暴   9
 * 群体攻击自身周围12米，目标限制25个，施法时间2秒，技能冷却2秒。
 * 攻击自身周围目标1次，附加299/424点攻击力。
 *
 * 609  雷云奇变
 * 雷云风暴有5%几率追加人物本体攻击力的20%的伤害。
 *
 * 611  焚心厉雷
 * 令自身为中心群体法术有3%几率令目标虚弱，目标被虚弱后攻击力下降10%、效果持续3秒，忽略目标虚弱抗性。
 * 影响技能:雷云风暴、雷神之锥、天地不仁;
 *
 */
class Skill234 extends BaseHookSkillStub {

    constructor() {
        super(234);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        const ts609 = player.GetSkilllevel(609);
        const ts611Level = player.GetSkilllevel(611)

        const tsRatio = Math.floor(zrand(100) / (ts609 * -5 + 100)) * 0.2
        skill.SetRatio(1 + tsRatio)

        skill.SetPlus(280 + skill.GetLevel() * 16);

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        player.SetVar1(ts611Level)

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts611 = player.GetVar1()

        if (zrand(100) / (ts611 * -3 + 100) * norm(ts611) > 0) {
            player.SetWeak(99999, ts611 * 3100, ts611 * 0.1, 1)
        }

        return true;
    }

}

/**
 * 229 冰心诀   6
 * 自身祝福，施法时间1秒，技能冷却120秒。
 * 10/30秒内自身防御提升1%/6%，效果可与真元护体Ⅱ叠加。
 * 并清除逍遥游、真元护体和炼气还神的冷却时间。
 *
 * 590  冰心玉阙
 * 被动生效
 * 冰心诀每升一级增加防御效果提升1%,
 * 并在冰心玉阙大于1级时令冰心诀额外具有清除技能天仙护体冷却与额外清除3个自身常规不利状态的能力。
 *
 */
class Skill229 extends BaseHookSkillStub {

    constructor() {
        super(229);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000 - GetTs596Effect(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts590 = player.GetSkilllevel(590)
        if (ts590 > 0) {
            player.SetCleardebuff(120, 3)
        }

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        const ts590 = player.GetSkilllevel(590)
        const tsRatio = ts590 * 0.01

        player.SetIncdefence(120, 4000 * skill.GetLevel() + 6100, (0.01 + tsRatio) * skill.GetLevel(), 1)

        player.SetClearcooldown(233, 235, 239)
        if (ts590 > 0) {
            player.SetClearcooldown(241, 241, 241)
        }

        GetTs592Effect1(stub, skill, originFunc)

        return true;
    }

}

/**
 * 228 破魔剑气   9
 * 单体攻击16米，施法时间1秒，技能冷却60秒。
 * 攻击目标1次，附加352/612点攻击力，并有100%概率减少目标真气，
 * 减少数值为自身真气上限10%/90%，
 * TODO:未实现 若自身真气上限高于目标时，则目标4秒内无法通过吃药来回复真气。
 *
 * 573  破魔怒意    2
 * 被动生效
 * 破魔剑气附加攻击力增加20%。
 *
 * 574  破魔秘法    2
 * 被动生效
 * 破魔剑气有20%几率在2秒后为自身回复该技能消耗真气的20%。
 */
class Skill228 extends BaseHookSkillStub {

    constructor() {
        super(228);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        const ts573 = player.GetSkilllevel(573)
        const tsV1 = ts573 * 0.15

        skill.SetPlus((315 + skill.GetLevel() * 33) * (tsV1 * 0.2 + 1))
        // player.SetVar1(player.GetMaxmp())

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictim();
        const ts574 = player.GetSkilllevel(574)
        let d = 20 * ts574

        let da = skill.GetLevel() * 0.46;
        let db = skill.GetLevel() * da;
        let dc = (skill.GetLevel() * 6.7 + db + 159.0) * 0.2;

        player.SetMpgen(20 * ts574, 2000, 0, ts574 * dc, 2);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDrainmagic(120, 0.1 * skill.GetLevel())
        // if (player.GetVar1() > player.GetMaxmp()) {
        //
        // }
        return true
    }

}

/**
 * 238 五雷轰顶   9
 * 群体攻击，目标周围8米，目标限制30个，施法时间2秒，技能冷却2秒。
 * 攻击目标周围8米内的敌人1次，附加434/597点攻击力。
 *
 * 608  五雷交轰
 * 五雷轰顶附加暴击率2%，并有10%几率清除目标身上的1个常规有利状态。
 */
class Skill238 extends BaseHookSkillStub {

    constructor() {
        super(238);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const ts608 = player.GetSkilllevel(608)

        skill.SetCrit(ts608 * 0.02)

        skill.SetPlus(429 + skill.GetLevel() * 21)
        GetTs606Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        player.SetVar1(ts608)
        player.SetVar2(player.GetSkilllevel(610))

        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetClearbuff(player.GetVar1() * 10, 1)

        const ts610 = player.GetVar2()
        player.SetDecdefence(5 * ts610, 0.05 * ts610, 3000 * ts610, 1)

        return true
    }

}

/**
 *
 * 461 黄帝内经   3
 * 自身祝福，施法时间1秒，技能冷却120/100秒。
 * 获得神佑效果，免疫6/18次伤害和负面效果，持续16/24秒，且最初3秒自身获得无敌效果。
 */
class Skill461 extends BaseHookSkillStub {

    constructor() {
        super(461);
    }

    TakeEffect(
        stub: NativePointer,
        skill: Skill,
        originFunc: NativeFunction<void, NativePointer[]>
    ): boolean {
        const gplayer = skill.GetGPlayer();

        console.log("黄帝内经被动", gplayer.GetSkillLevel(5039))
        if (gplayer.GetSkillLevel(5039) <= 0) {
            console.log("黄帝内经学习5039")
            const r = gplayer.PlayerLearnSkill(5039);
            console.log(r)
        }

        return true;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetBlessed(skill.GetLevel() * 6, 16000 + (skill.GetLevel() - 1) * 8000)
        player.SetInvincible(3100)
        return true
    }

}

/**
 * 5039 黄帝内经
 * 被动改主动。
 * 技能冷却120/100秒
 * 获得神佑效果，免疫6/18次伤害和负面效果，持续16/24秒，且最初3秒自身获得无敌效果。
 *
 * 玄烛·逍遥游·曦日:
 * 影响技能:黄帝内经 冷却时间减少45秒。
 */
class Skill5039 extends BaseHookSkillStub {

    constructor() {
        super(5039);
        this.SetType(2)
        this.SetRangeType(5)
        this.SetOccupation(9)
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 130000 - skill.GetLevel() * 10000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        const level = player.GetSkilllevel(461)
        //获得神佑效果，免疫6/18次伤害和负面效果，持续16/24秒，且最初3秒自身获得无敌效果。
        player.SetInvincible(3100)
        player.SetBlessed(level * 6, level * 8000 + 100)
        return true
    }

}

/**
 * 313 剑心通明   6
 * 被动。
 * 永久增加自身攻击力100/600。
 * 永久增加自身攻击力2%/12%。
 *
 * 575  灵剑残心    3
 * 被动生效
 * 剑心通明对人物增加攻击力提升12点。
 * 剑心通明额外增加自身2%攻击力。
 */
class Skill313 extends BaseHookSkillStub {

    constructor() {
        super(313);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts575 = player.GetSkilllevel(575)

        player.SetPasaddattack(skill.GetLevel() * 100 + ts575 * 12)
        player.SetPasincattack(skill.GetLevel() * 0.02 + ts575 * 0.02)

        const ts595 = player.GetSkilllevel(595);
        player.SetPasaddhp(ts595 * 120 * skill.GetLevel())

        return true
    }

}

/**
 * 236 雷霆震怒   8
 * 群体诅咒，目标周围10米，目标限制6个，施法时间1秒，技能冷却140/105秒。
 * 雷电闪耀目标周围10米内敌人，技能对目标无伤害。
 * 若自身定身抗性高于目标，则强制定身目标6秒。
 * 593  狂雷天怒
 * 雷霆震怒减少冷却时间2秒。
 */
class Skill236 extends BaseHookSkillStub {

    constructor() {
        super(236);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        const ts593 = player.GetSkilllevel(593)

        return 145000 - skill.GetLevel() * 5000 - ts593 * 2000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar1(player.GetRes3())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetWrap(player.GetVar1(), 6100)
        return true
    }

}

/**
 * 237 怒剑狂花   9
 * 真气贯穿+3（真气大于95%时追加本体攻击力12%）
 * 单体攻击10.7米，施法时间2秒，技能冷却8秒。
 * 攻击目标1次，附加1008/1474点攻击力，并令目标在未来8秒内损失3296/6016气血。
 *
 * 576  怒剑心劫    2
 * 被动生效
 * 怒剑狂花每升一级攻击力额外增加25点。
 */
class Skill237 extends BaseHookSkillStub {

    constructor() {
        super(237);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8000 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            skill.SetRatio(1 + 0.12)
        }

        const v41 = 1.42 - skillLevel * 0.05;
        const v34 = 114 * skillLevel + 901;
        const v27 = skillLevel * 6.4;
        const v42 = (v34 - skillLevel * v27) * v41;
        const v35 = skillLevel * 0.05 + 0.55;
        const v28 = skillLevel * 1.8;
        const v29 = skillLevel * v28;
        const v43 = (77 * skillLevel + v29 + 636) * v35 + v42;

        const ts576 = player.GetSkilllevel(576)
        const plusTs = skillLevel * 25 * ts576

        skill.SetPlus(v43 + plusTs);

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        //并令目标在未来8秒内损失3296/6016气血
        const player = skill.GetPlayerNice();
        const prob = (1.0 - player.GetLevel() * 0.002) * 100.0;

        const amount = 340 * skill.GetLevel() + 2956;
        player.SetHpleak(prob, 8000, amount, 0, 1);
        return true
    }

}

/**
 * 241 天仙护体   5
 * 自身祝福，施法时间1秒，技能冷却120秒。
 * 防御提升20/60点，真气上限提升200/1000点，防御效果增加持续10/30分钟，真气上限提升持续10/30分钟。
 *
 * 594  仙元护体
 * 被动生效
 * 天仙护体增加防御能力提升4倍,并有8%几率产生极效防御增加祝福效果;
 * 天仙护体增加自身全抗5%，效果持续12秒；
 *
 * 1590  天仙护体II
 * 令天仙护体增加防御效果和真气效果提升10%/100%；
 *
 */
class Skill241 extends BaseHookSkillStub {

    constructor() {
        super(241);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000 - GetTs596Effect(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts594 = player.GetSkilllevel(594)
        player.SetIncanti(0.05 * ts594, ts594 * 12000)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel();

        const ts594 = player.GetSkilllevel(594)
        const ts1590 = player.GetSkilllevel(1590)

        // 防御提升20/60点，持续10/30分钟
        let defenceValue = 20 + (skillLevel - 1) * 10;

        const tsValue = ts594 * 4 * Math.floor(zrand(100) / (-8 * ts594 + 100)) + 1

        defenceValue *= tsValue

        defenceValue *= 1 + ts1590 * 0.1

        const defenceTime = (10 + (skillLevel - 1) * 5) * 60 * 1000;
        player.SetAdddefence(120, defenceTime, defenceValue, 1);

        // 真气上限提升200/1000点，持续10/30分钟
        let mpValue = 200 * skillLevel;
        mpValue *= 1 + ts1590 * 0.1
        const mpTime = (10 + (skillLevel - 1) * 5) * 60 * 1000;
        player.SetAddmp(mpTime, mpValue, 1);

        GetTs592Effect1(stub, skill, originFunc)

        return true
    }

}

/**
 * 242 雷神之锥   9
 * 群体攻击，自身周围10米，目标限制35个，施法时间1秒，技能冷却2秒。
 * 攻击自身周围10/12米内的目标1次，附加609/798点攻击力。
 *
 * 613  雷神降世
 * 雷神之锥有6%几率令目标定身3秒，忽略定身抗性。
 *
 */
class Skill242 extends BaseHookSkillStub {

    executetime = [600, 400]

    constructor() {
        super(242);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();

        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)

        let ratio = 1.0;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level

        skill.SetRatio(ratio)

        const attackValue = Math.floor(609 + (skill.GetLevel() - 1) * 189 / 8);
        skill.SetPlus(attackValue);

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)

        player.SetVar1(player.GetSkilllevel(613))
        player.SetVar2(player.GetSkilllevel(611))
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts613 = player.GetVar1()

        if (zrand(100) / (ts613 * -6 + 100) * norm(ts613) > 0) {
            player.SetWrap(99999, 3100)
        }

        const ts611 = player.GetVar2()
        if (zrand(100) / (ts611 * -3 + 100) * norm(ts611) > 0) {
            player.SetWeak(99999, ts611 * 3100, ts611 * 0.1, 1)
        }

        return true
    }

}

/**
 * 240 天外飞仙   9
 * 单体攻击10.7米，施法时间2秒，技能冷却16秒。
 * 攻击目标1次，附加1639/2188点攻击力，受伤减速40%/64%，效果持续3.8/6.2秒，受伤减速效果可与冰冻效果叠加。
 *
 * 577  邪剑星羽    2
 * 被动生效
 * 天外飞仙每升一级攻击力额外增加30点。
 */
class Skill240 extends BaseHookSkillStub {

    constructor() {
        super(240);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 16000 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel()

        const ts577 = player.GetSkilllevel(577)
        const plusTs = skillLevel * 30 * ts577

        skill.SetPlus(1570 + skillLevel * 69 + plusTs);

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(1)
    }

}

/**
 * 381 齐物论   7
 * 被动。
 * 永久增加自身基础防御6/36点。
 * 永久降低自身受到的致命一击伤害5%/35%。
 */
class Skill381 extends BaseHookSkillStub {

    constructor() {
        super(381);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetPasadddefence(5 * skill.GetLevel() + 1)
        player.SetPasdecfatalhurt(0.05 * skill.GetLevel())

        const ts595 = player.GetSkilllevel(595);
        player.SetPasaddhp(ts595 * 120 * skill.GetLevel())

        return true
    }

}

/**
 * 537   霜天雪舞    9
 * **技能冷却**: 60秒
 * - 霜燃之寒+1 (如成功减速，则2秒后追加气血伤害)
 * - 攻击目标周围5米内的敌人1次，附加724/934点攻击力
 * - 有49%/59%几率令多目标减速25%，效果持续4秒
 * - 当自身攻击高于目标，可令目标周围冰冻2.5/6.5秒，令其陷入“霜结"状态,使其技能停止冷却,最多影响6个目标。
 * - *霜燃之寒造成每秒为目标级别的20%/180%*
 */
class Skill537 extends BaseHookSkillStub {

    constructor() {
        super(537);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetPlus(700 + skill.GetLevel() * 24 + (skill.GetLevel() - 1) * 2)
        player.SetVar1(player.GetMaxatk())
        player.SetVar2(player.GetSkilllevel(610))

        GetTs602Effect(stub, skill, originFunc)
        GetTs606Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel()
        player.SetSlow(41 + skillLevel * 2, 0.25, 4100, 1)
        player.SetHpleak(-1, 2000, player.GetLevel() * skillLevel * 0.2, 0, 1)

        if (player.GetVar1() > player.GetMaxatk()) {
            const time = 2000 + skillLevel * 500
            player.SetFrozen(120, 1, time, 1)
            player.SetGFrosty(120, time)
        }

        const ts610 = player.GetVar2()
        player.SetDecdefence(5 * ts610, 0.05 * ts610, 3000 * ts610, 1)

        return true
    }

}

/**
 * 538   大道无形    3
 * **技能冷却**: 120秒
 * - 16秒内有55%几率减少自身受到的伤害30%/60%
 *
 * 578  天眷有道    2
 * 被动生效
 * 大道无形减免伤害概率提升15%；
 *
 * 582  玄天星芒    3
 * 被动生效
 * 大道无形冷却时间减少10%;
 *
 * 597  先天罡气
 * 大道无形减免伤害能力提升15%，效果持续总时间增加6秒。
 */
class Skill538 extends BaseHookSkillStub {

    constructor() {
        super(538);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayer();
        const ts582 = player.GetSkilllevel(582);
        return 120000 - ts582 * 12000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const ts578 = player.GetSkilllevel(578)
        const ts597 = player.GetSkilllevel(597)

        const tsRatio = ts597 * 0.15
        const tsTime = ts597 * 6000

        player.SetDecdamage(55 + ts578 * 15, 0.3 + skill.GetLevel() * 0.1 + tsRatio, 16100 + tsTime)
        return true
    }

}

/**
 * 539   天玄冰 6
 * **技能冷却**: 150/125秒
 * - 自身在2/12秒内，免疫部分不利状态和致命一击效果
 *
 * 571  玄冰劲气    3
 * 被动生效
 * 天玄冰持续时间增加15%。
 *
 * 616  玄冰圣护
 * 天玄冰冷却时间降低5%。
 *
 */
class Skill539 extends BaseHookSkillStub {

    constructor() {
        super(539);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        const ts616 = player.GetSkilllevel(616)
        return 155000 - 5000 * skill.GetLevel() - 7750 * ts616
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        const ts571 = player.GetSkilllevel(571)
        player.SetChihun(120, (2000 * skill.GetLevel()) * (ts571 * 0.15 + 1) + 200, 0, 0, 9)
        return true
    }

}

/**
 * 540   极度深寒    7
 * **技能冷却**: 90秒
 * - 施法距离18/36米，令目标持续减少防御共计80/464点
 * - 持续减少目标减免伤害百分比共计8%
 * - 降低气血与真气上限28%，持续8/20秒
 *
 * 冰域天机
 * 极度深寒降低目标防御能力增加25%;
 * 615  北地之刺
 * 极度深寒有20%概率令目标减速25%,效果持续8秒。
 */
class Skill540 extends BaseHookSkillStub {

    constructor() {
        super(540);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000 - GetTs596Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetSkilllevel(599))
        player.SetVar2(player.GetSkilllevel(615))
        super.Calculate2(stub, skill, originFunc);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        GetTs592Effect1(stub, skill, originFunc)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const ts599 = player.GetVar1()

        const time = skill.GetLevel() * 2000 + 6100

        let value = 64 * skill.GetLevel() + 16
        const tsRatio = ts599 * 0.25
        value *= (1 + tsRatio)

        player.SetCycsubdefence(120, value, time, 1)

        player.SetFlamecurse(120, time, 0.08, 1)
        player.SetSubhp(120, player.GetMaxhp() * (0.04 * skill.GetLevel()), time, skill.GetLevel() * 10, 1)
        player.SetSubmp(120, player.GetMaxmp() * (0.04 * skill.GetLevel()), time, skill.GetLevel() * 10, 1)

        const ts615 = player.GetVar2()
        player.SetSlow(ts615 * 20, 0.25, 8000 * ts615, 1)

        return true
    }
}

/**
 * 541   天诛剑气    9
 *
 * 冷却6秒，施法1秒
 *
 * 真气贯穿+4
 * (真气大于95%时追加本体攻击力16%)
 *
 * 攻击目标1次,追加本体攻击力1%/9%，附加2214/2886点攻击力，并额外追加自身真气上限1%/9%的攻击力。
 * 攻击怪物目标时，追加真气上限相关攻击力翻3倍。
 * *剑气延伸追加攻击距离0.5/4.5米*
 *
 * 580  天诛真诀    2
 * 被动生效
 * 天诛剑气每升一级攻击力额外增加50点。
 */
class Skill541 extends BaseHookSkillStub {

    executetime = [800, 200]

    constructor() {
        super(541);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.16
        }

        skill.SetRatio(1 + r1 + skillLevel * 0.01)
        const plus1 = 320 * skillLevel + skillLevel
        const plus2 = maxmp * 0.01 * skillLevel


        const ts580 = player.GetSkilllevel(580)
        const plusTs = ts580 * 50 * skillLevel

        skill.SetPlus(plus1 + plus2 + plusTs)

        skill.SetMobBonusDamage(plus2 * 2)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)
        return true
    }

}

/**
 * 542   真元华闪    7
 * 真气贯穿
 * (真气大于95%时追加自身真气上限5%的攻击力)
 *
 * 冷却90秒
 * 攻击目标1次，附加本体攻击力15%/105%,目标气血比例越高,攻击力越高,最多不超过施法者气血上限的1.5倍。
 *
 *
 * 598  华闪之歌
 * 真元华闪攻击力每级增加4%，所造成的致命一击伤害增加20%;
 * 目标每增加一个常规不利状态、自身每增加一个常规有利状态,真元华闪的华闪效果分别增加4%。
 *
 */
class Skill542 extends BaseHookSkillStub {

    constructor() {
        super(542);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000 - GetTs596Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const ts598 = player.GetSkilllevel(598)
        const tsRatio = ts598 * 0.04 * skill.GetLevel()

        skill.SetRatio(1 + 0.15 * skill.GetLevel() + tsRatio)

        skill.SetCrithurt(ts598 * 0.2)

        const buffcnt = player.GetBuffcnt();
        player.SetVar1(ts598);
        player.SetVar2(buffcnt);
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)

        GetTs592Effect1(stub, skill, originFunc)

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        const ts598 = player.GetVar1()

        const ratio = skill.GetLevel() * 0.15;
        const hpRatio = player.GetHp() / player.GetMaxhp();

        const tsBuffRatio = player.GetVar2() * ts598 * 0.04;
        const tsDeBuffRatio = player.GetDebuffcnt() * ts598 * 0.04;

        player.SetSecondattack(ratio + hpRatio + tsBuffRatio + tsDeBuffRatio, 0, 0);
        return true
    }

}

/**
 * 543   天地不仁    9
 * 群体攻击，自身周围18米，目标限制40个，
 * 施法时间4秒，技能冷却8秒。
 * 攻击自身周围18米内的敌人2次，附加本体攻击力2%/18%，每次附加1545/1941点攻击力。
 * *6%几率令目标真气损失75%
 * *技能吟唱的中间1秒内处于无敌状态
 *
 * 614  天地无用
 * 天地不仁令目标真气尽失概率增加5%，无敌时间增加0.5秒。
 */
class Skill543 extends BaseHookSkillStub {

    constructor() {
        super(543);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = skill.GetLevel()

        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)

        let ratio = 1 + 0.02 * lv;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level

        skill.SetRatio(ratio)

        skill.SetPlus(215 * lv + lv)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        player.SetVar1(player.GetSkilllevel(611))
        player.SetVar2(player.GetSkilllevel(614))

        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = skill.GetLevel()

        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)

        let ratio = 1 + 0.02 * lv;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level

        skill.SetRatio(ratio)


        skill.SetPlus(215 * lv + lv)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        player.SetVar1(player.GetSkilllevel(611))
        player.SetVar2(player.GetSkilllevel(614))

        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictim();
        let t = 500 * player.GetVar2() + 1500;
        player.SetInvincible(t);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDrainmagic(6 + player.GetVar2() * 5, 0.25)

        const ts611 = player.GetVar1()
        if (zrand(100) / (ts611 * -3 + 100) * norm(ts611) > 0) {
            player.SetWeak(99999, ts611 * 3100, ts611 * 0.1, 1)
        }

        return true
    }

}

/**
 * 544   天机印 6
 * 自身祝福，施法时间1秒，技能冷却220/120秒。
 * 自身在4/24秒内，TODO:所有真气贯穿效果额外增加10%自身真气上限的攻击力。
 * 天机印持续时间内,单体攻击技能天诛剑气、赤乌·天诛剑气变为群体攻击技能天诛剑气·罚、赤乌·天诛剑气·罚，并获得新技能霜极刑冰错。
 *
 * 1537  炼气还神Ⅱ
 * 被动
 * 天机印技能冷却时间减少15秒，天机印持续时间增加自身10%的克仙/魔/佛属性。
 */
class Skill544 extends BaseHookSkillStub {

    constructor() {
        super(544);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice();
        const ts1537 = player.GetSkilllevel(1537)
        return 240000 - skill.GetLevel() * 20000 - norm(ts1537) * 15000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const time = 4000 * skill.GetLevel() + 100
        player.SetSkillreplace(120, time, 230, 5040, 1)
        player.SetSkillreplace(120, time, 6814, 5047, 2)

        const ts1537 = player.GetSkilllevel(1537)

        player.SetIncCultAtk(120, time, norm(ts1537) * 0.1, 0, 0)
        player.SetIncCultAtk(120, time, norm(ts1537) * 0.1, 1, 1)
        player.SetIncCultAtk(120, time, norm(ts1537) * 0.1, 2, 2)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }

}

/**
 * 5040 霜极刑冰错7/7
 * 狱破重重引暴霜,刑冰错错戮骁魔
 *
 * 霜燃之寒+3:
 * 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%
 * 最高不超过自身1.5倍气血上限
 * (真气大于75%时追加自身真气上限10%的攻击力)
 *
 * 群体攻击
 * 自身周围25米
 * 目标限制40个
 * 施法时间2秒
 * 真气消耗3500点
 * 技能冷却12秒
 *
 * 攻击自身周围25米内的敌人4（改6）次,附加本体攻击力170%，额外附加自身真气上限23%的攻击力;
 * 攻击怪物目标时,额外附加自身真气上限30%的攻击力;
 * 自身最大攻击力高于目标时冰冻目标6秒。
 */
class Skill5040 extends BaseHookSkillStub {

    executetime = [300, 300, 300, 300, 300, 300, 300]

    constructor() {
        super(5040);
        this.SetOccupation(151)
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 12000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        // 霜燃之寒+3:
        // 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%/110%/120%/130%
        // 最高不超过自身1.5倍气血上限
        // (真气大于75%时追加自身真气上限10%的攻击力)
        const player = skill.GetPlayer();
        skill.SetRatio(1.7)

        let mpPlus = 0
        if (player.GetMp() / player.GetMaxmp() >= 0.75) {
            mpPlus = player.GetMaxmp() * 0.1
        }

        skill.SetPlus(player.GetMaxmp() * 0.23 + mpPlus)
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.3)

        player.SetVar1(player.GetMaxatk())
        player.SetVar2(1)
        player.SetVar3(player.GetMaxmp())

        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        // 霜燃之寒+3:
        // 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%/110%/120%/130%
        // 最高不超过自身1.5倍气血上限
        // (真气大于75%时追加自身真气上限10%的攻击力)
        const player = skill.GetPlayer();
        skill.SetRatio(1.7)

        let mpPlus = 0
        if (player.GetMp() / player.GetMaxmp() >= 0.75) {
            mpPlus = player.GetMaxmp() * 0.1
        }

        skill.SetPlus(player.GetMaxmp() * 0.23 + mpPlus)
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.3)

        player.SetVar1(player.GetMaxatk())
        player.SetVar2(2)
        player.SetVar3(player.GetMaxmp())

        player.SetPerform(0)
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        // 霜燃之寒+3:
        // 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%/110%/120%/130%
        // 最高不超过自身1.5倍气血上限
        // (真气大于75%时追加自身真气上限10%的攻击力)
        const player = skill.GetPlayer();
        skill.SetRatio(1.7)

        let mpPlus = 0
        if (player.GetMp() / player.GetMaxmp() >= 0.75) {
            mpPlus = player.GetMaxmp() * 0.1
        }

        skill.SetPlus(player.GetMaxmp() * 0.23 + mpPlus)
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.3)

        player.SetVar1(player.GetMaxatk())
        player.SetVar2(3)
        player.SetVar3(player.GetMaxmp())

        player.SetPerform(0)
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        // 霜燃之寒+3:
        // 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%/110%/120%/130%
        // 最高不超过自身1.5倍气血上限
        // (真气大于75%时追加自身真气上限10%的攻击力)
        const player = skill.GetPlayer();
        skill.SetRatio(1.7)

        let mpPlus = 0
        if (player.GetMp() / player.GetMaxmp() >= 0.75) {
            mpPlus = player.GetMaxmp() * 0.1
        }

        skill.SetPlus(player.GetMaxmp() * 0.23 + mpPlus)
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.3)

        player.SetVar1(player.GetMaxatk())
        player.SetVar2(4)
        player.SetVar3(player.GetMaxmp())

        player.SetPerform(0)
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        // 霜燃之寒+3:
        // 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%/110%/120%/130%
        // 最高不超过自身1.5倍气血上限
        // (真气大于75%时追加自身真气上限10%的攻击力)
        const player = skill.GetPlayer();
        skill.SetRatio(1.7)

        let mpPlus = 0
        if (player.GetMp() / player.GetMaxmp() >= 0.75) {
            mpPlus = player.GetMaxmp() * 0.1
        }

        skill.SetPlus(player.GetMaxmp() * 0.23 + mpPlus)
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.3)

        player.SetVar1(player.GetMaxatk())
        player.SetVar2(5)
        player.SetVar3(player.GetMaxmp())

        player.SetPerform(0)
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        // 霜燃之寒+3:
        // 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%/110%/120%/130%
        // 最高不超过自身1.5倍气血上限
        // (真气大于75%时追加自身真气上限10%的攻击力)
        const player = skill.GetPlayer();
        skill.SetRatio(1.7)

        let mpPlus = 0
        if (player.GetMp() / player.GetMaxmp() >= 0.75) {
            mpPlus = player.GetMaxmp() * 0.1
        }

        skill.SetPlus(player.GetMaxmp() * 0.23 + mpPlus)
        skill.SetMobBonusDamage(player.GetMaxmp() * 0.3)

        player.SetVar1(player.GetMaxatk())
        player.SetVar2(6)
        player.SetVar3(player.GetMaxmp())

        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        // 霜燃之寒+3:
        // 对冰冻目标,每一击额外附加一次伤害,数值为自身真气上限的70%/80%/90%/100%/110%/120%/130%
        // 最高不超过自身1.5倍气血上限
        // 自身最大攻击力高于目标时冰冻目标6秒。

        if (player.GetVar1() > player.GetMaxatk()) {
            player.SetFrozen(120, 0, 6100, 2)
        }

        if (player.GetHasmultbuff(Frozen_multi)) {
            player.SetDirecthurt(120, player.GetVar3() * (0.6 + player.GetVar2() * 0.1))
        }

        return true
    }

}

/**
 * 5047 赤乌·天诛剑气·罚·曦日
 * 施法时间 1 秒，冷却时间 15 秒，攻击目标 4次，
 */
class Skill5047 extends BaseHookSkillStub {

    constructor() {
        super(5047);
        this.SetOccupation(151)
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2100
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

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        const mp = player.GetMp();
        const maxMp = player.GetMaxmp();
        //真气贯穿（施法时真气高于75%则追加自身真气上限10%的攻击力)
        //追加本体攻击力320%，附加攻击力3600点，额外追加自身真气上限28%攻击力。
        const ratio = mp <= maxMp * 0.75 ? 3.2 : 3.3;
        skill.SetRatio(ratio);

        const plusValue = maxMp * 0.28 + 3600.0;
        skill.SetPlus(plusValue);
        //攻击怪物目标时，此技能附加攻击力翻倍。
        skill.SetMobBonusDamage(plusValue);
        player.SetVar2(maxMp);
        player.SetVar3(0);
        player.SetPerform(1);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        const mp = player.GetMp();
        const maxMp = player.GetMaxmp();
        //真气贯穿（施法时真气高于75%则追加自身真气上限10%的攻击力)
        //追加本体攻击力320%，附加攻击力3600点，额外追加自身真气上限28%攻击力。
        const ratio = mp <= maxMp * 0.75 ? 3.2 : 3.3;
        skill.SetRatio(ratio);

        const plusValue = maxMp * 0.28 + 3600.0;
        skill.SetPlus(plusValue);
        //攻击怪物目标时，此技能附加攻击力翻倍。
        skill.SetMobBonusDamage(plusValue);
        player.SetVar2(maxMp);
        player.SetVar3(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        const mp = player.GetMp();
        const maxMp = player.GetMaxmp();
        //真气贯穿（施法时真气高于75%则追加自身真气上限10%的攻击力)
        //追加本体攻击力320%，附加攻击力3600点，额外追加自身真气上限28%攻击力。
        const ratio = mp <= maxMp * 0.75 ? 3.2 : 3.3;
        skill.SetRatio(ratio);

        const plusValue = maxMp * 0.28 + 3600.0;
        skill.SetPlus(plusValue);
        //攻击怪物目标时，此技能附加攻击力翻倍。
        skill.SetMobBonusDamage(plusValue);
        player.SetVar2(maxMp);
        player.SetVar3(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        const mp = player.GetMp();
        const maxMp = player.GetMaxmp();
        //真气贯穿（施法时真气高于75%则追加自身真气上限10%的攻击力)
        //追加本体攻击力320%，附加攻击力3600点，额外追加自身真气上限28%攻击力。
        const ratio = mp <= maxMp * 0.75 ? 3.2 : 3.3;
        skill.SetRatio(ratio);

        const plusValue = maxMp * 0.28 + 3600.0;
        skill.SetPlus(plusValue);
        //攻击怪物目标时，此技能附加攻击力翻倍。
        skill.SetMobBonusDamage(plusValue);
        player.SetVar2(maxMp);
        player.SetVar3(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        player.SetPerform(0);
    }

    BlessMe(
        stub: NativePointer,
        skill: Skill,
        originFunc: NativeFunction<void, NativePointer[]>
    ): boolean {
        const player = skill.GetPlayer();
        if (!player.GetVar3()) {
            //驱散自身4个常规不利状态
            player.SetCleardebuff(120, 4);
        }

        return true;
    }

    StateAttack(
        stub: NativePointer,
        skill: Skill,
        originFunc: NativeFunction<void, NativePointer[]>
    ): boolean {
        const player = skill.GetPlayer();
        if (!player.GetVar3()) {
            //*驱逐驱散目标身上2个常规有利状态
            player.SetClearbuff(120, 2);
            //*余威额外追加一次伤害，上限是自身真气上限的65%
            const dmg = player.GetVar2() * skill.GetLevel() * 0.13;
            player.SetDirecthurt(120, dmg);
            //额外附加6秒焱阳效果
            player.SetBlazingSun(120, 6100, 0.5, 0);
        }

        return true;
    }

}

/**
 * 545   七劫斩龙诀   9
 * 剑气延伸+1
 * (攻击距离少量追加)
 * 单体攻击11.2/15.2米，施法时间2秒，技能冷却3.8秒。
 * 攻击目标7次,附加本体攻击力1%/9%，附加300/2700点攻击力，并有33%几率令自身在接下来的12秒内每次攻击回复攻击力1%/9%的气血。
 * *剑气延伸追加攻击距离0.5/4.5米*
 *
 * 581  斩龙奥义    2
 * 被动生效
 * 七劫斩龙诀每击附加自身真气上限4%的攻击力，
 * 对怪物目标额外附加自身气血真气上限和4%的攻击力,
 * 对龙种族的怪物附加一次伤害，数值为自身真气上限5%。
 */
class Skill545 extends BaseHookSkillStub {

    constructor() {
        super(545);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 3800 - GetTs579Effect(stub, skill, originFunc);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        skill.SetRatio(1 + 0.01 * skill.GetLevel())

        const ts581 = player.GetSkilllevel(581);
        const tsPlus = ts581 * 0.04 * player.GetMaxmp()
        const tsMobPlus = ts581 * 0.04 * player.GetMaxHPAndMP()

        skill.SetPlus(300 * skill.GetLevel() + tsPlus)
        skill.SetMobBonusDamage(tsMobPlus)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        skill.SetRatio(1 + 0.01 * skill.GetLevel())

        const ts581 = player.GetSkilllevel(581);
        const tsPlus = ts581 * 0.04 * player.GetMaxmp()
        const tsMobPlus = ts581 * 0.04 * player.GetMaxHPAndMP()

        skill.SetPlus(300 * skill.GetLevel() + tsPlus)
        skill.SetMobBonusDamage(tsMobPlus)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(0)
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        skill.SetRatio(1 + 0.01 * skill.GetLevel())

        const ts581 = player.GetSkilllevel(581);
        const tsPlus = ts581 * 0.04 * player.GetMaxmp()
        const tsMobPlus = ts581 * 0.04 * player.GetMaxHPAndMP()

        skill.SetPlus(300 * skill.GetLevel() + tsPlus)
        skill.SetMobBonusDamage(tsMobPlus)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(0)
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        skill.SetRatio(1 + 0.01 * skill.GetLevel())

        const ts581 = player.GetSkilllevel(581);
        const tsPlus = ts581 * 0.04 * player.GetMaxmp()
        const tsMobPlus = ts581 * 0.04 * player.GetMaxHPAndMP()

        skill.SetPlus(300 * skill.GetLevel() + tsPlus)
        skill.SetMobBonusDamage(tsMobPlus)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(0)
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        skill.SetRatio(1 + 0.01 * skill.GetLevel())

        const ts581 = player.GetSkilllevel(581);
        const tsPlus = ts581 * 0.04 * player.GetMaxmp()
        const tsMobPlus = ts581 * 0.04 * player.GetMaxHPAndMP()

        skill.SetPlus(300 * skill.GetLevel() + tsPlus)
        skill.SetMobBonusDamage(tsMobPlus)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(0)
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        skill.SetRatio(1 + 0.01 * skill.GetLevel())

        const ts581 = player.GetSkilllevel(581);
        const tsPlus = ts581 * 0.04 * player.GetMaxmp()
        const tsMobPlus = ts581 * 0.04 * player.GetMaxHPAndMP()

        skill.SetPlus(300 * skill.GetLevel() + tsPlus)
        skill.SetMobBonusDamage(tsMobPlus)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(0)
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();

        skill.SetRatio(1 + 0.01 * skill.GetLevel())

        const ts581 = player.GetSkilllevel(581);
        const tsPlus = ts581 * 0.04 * player.GetMaxmp()
        const tsMobPlus = ts581 * 0.04 * player.GetMaxHPAndMP()

        skill.SetPlus(300 * skill.GetLevel() + tsPlus)
        skill.SetMobBonusDamage(tsMobPlus)

        GetTs583Effect1(stub, skill, originFunc)

        player.SetPerform(0)
    }
}

/**
 * 783   雷光遁龙诀   6
 * 单体攻击16米，施法时间1秒，技能冷却6秒。
 * 攻击目标3次,每击附加本体攻击力50%,附加694/914点攻击力。
 *
 * 582  玄天星芒    3
 * 被动生效
 * 雷光遁龙诀、雷光遁龙诀<玄><煞><禅>攻击怪物时额外附加本体攻击力30%
 */
class Skill783 extends BaseHookSkillStub {

    constructor() {
        super(783);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        skill.SetRatio(1.5)
        let v7 = lv * lv * 7.2 - lv * 6.4 + 694;
        skill.SetPlus(v7)
        GetTs606Effect(stub, skill, originFunc)

        const ts582 = player.GetSkilllevel(582)
        const mobPlus = ts582 * 0.3 * player.GetMaxatk()
        skill.SetMobBonusDamage(mobPlus)

        player.SetVar1(player.GetSkilllevel(610))
        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        skill.SetRatio(1.5)
        let v7 = lv * lv * 7.2 - lv * 6.4 + 694;
        skill.SetPlus(v7)
        GetTs606Effect(stub, skill, originFunc)

        const ts582 = player.GetSkilllevel(582)
        const mobPlus = ts582 * 0.3 * player.GetMaxatk()
        skill.SetMobBonusDamage(mobPlus)
        player.SetVar1(player.GetSkilllevel(610))
        player.SetPerform(0)
        player.SetPerform(0)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        const ts610 = player.GetVar1()
        player.SetDecdefence(5 * ts610, 0.05 * ts610, 3000 * ts610, 1)
        return true
    }

}

/**
 * 784   天尊法身    5
 * 自身祝福，施法时间1秒，技能冷却120秒。
 * 自身在20秒内增加气血上限575/11875点，提升致命一击率2%/6%。
 *
 * 578  天眷有道    2
 * 被动生效
 * 天尊法身增加气血上限能力提升100%；
 *
 */
class Skill784 extends BaseHookSkillStub {

    constructor() {
        super(784);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000 - GetTs596Effect(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()

        const v8 = 500 * lv;
        const v9 = 75 * lv * lv * lv;
        const hp = v9 + v8;

        const ts578 = player.GetSkilllevel(578)

        const plusHp = (ts578 + 1) * hp

        const time = 20100
        player.SetFashen(120, 0.01 + 0.01 * lv, plusHp, time, 1)

        GetTs592Effect2(stub, skill, originFunc)

        GetTs592Effect3(stub, skill, originFunc)

        return true
    }

}

/**
 * 785   太极玄天真诀  4
 * 真气贯穿
 * (真气大于95%时追加自身本体攻击力8%和自身真气上限5%的攻击力)
 * 群体攻击，自身周围22米，目标限制40个，施法时间1.5秒，技能冷却0秒。
 * 攻击自身周围22米内的敌人3次，追加本体攻击力10%/40%，每次附加780/966点攻击力。
 * *5%/20%几率令目标随机进入不利状态3秒
 */
class Skill785 extends BaseHookSkillStub {

    executetime = [400, 400, 400, 400]

    constructor() {
        super(785);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        let p1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.08
            p1 = maxmp * 0.05
        }

        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)

        let ratio = 1 + 0.1 * skill.GetLevel() + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level

        skill.SetRatio(ratio)

        const v8 = 22 * lv + 750;
        const v9 = 8 * lv * lv;
        const plus = v8 + v9;
        skill.SetPlus(plus + p1)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar1(player.GetSkilllevel(611))

        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        let p1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.08
            p1 = maxmp * 0.05
        }


        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)

        let ratio = 1 + 0.1 * skill.GetLevel() + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level

        skill.SetRatio(ratio)

        const v8 = 22 * lv + 750;
        const v9 = 8 * lv * lv;
        const plus = v8 + v9;
        skill.SetPlus(plus + p1)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar1(player.GetSkilllevel(611))

        player.SetPerform(0)
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        let p1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.08
            p1 = maxmp * 0.05
        }


        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)

        let ratio = 1 + 0.1 * skill.GetLevel() + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level

        skill.SetRatio(ratio)

        const v8 = 22 * lv + 750;
        const v9 = 8 * lv * lv;
        const plus = v8 + v9;
        skill.SetPlus(plus + p1)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar1(player.GetSkilllevel(611))

        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictim();

        let v2 = 5 * skill.GetLevel();
        let d = v2 + 3 * player.GetVar1();
        player.SetRandcurse(d, 0.2, 0.2, 3100);
        return true
    }

}

/**
 * 786   神剑御雷真诀  2
 * 真气贯穿
 * (真气大于95%时追加自身真气上限10%的攻击力)
 * 群体攻击，自身周围25米，目标限制40个，施法时间6秒，技能冷却16秒。
 * 攻击自身周围25米内的敌人18次,追加本体攻击力40%/60%，每次附加865/960点攻击力。
 * *第1、3、5、7、9、11、13、15、17段有4%/8%几率急速冷却;
 * *第1、3、5、7、9、11、13、15、17段有一定几率令目标定身6秒，定身能力为自身定身抗性。
 * *最后一段攻击附加自身真气上限4%/8%的攻击力
 * *范围内敌对目标每增加1人，范围内所有敌对目标伤害额外增加施法者自身气血真气和的1%与攻击力的10%。
 *
 * 593  狂雷天怒
 * 神剑御雷真诀、神剑御雷真诀<玄><煞><禅>每升一级定身能力增加6点，定身效果每升两级增加1秒。
 */
class Skill786 extends BaseHookSkillStub {

    constructor() {
        super(786);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.1
        }

        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)
        const skill785Level = player.GetSkilllevel(785)

        let ratio = 1.2 + 0.2 * lv + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill785Level / 4) * 0.05 * ts617Level

        skill.SetRatio(ratio)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar2(player.GetSkilllevel(593))
        player.SetVar3(player.GetSkilllevel(611))

        player.SetVar1(1)
        player.SetPerform(1)
        player.SetVar1(2)
        player.SetPerform(0)
        player.SetVar1(3)
        player.SetPerform(0)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.1
        }


        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)
        const skill785Level = player.GetSkilllevel(785)

        let ratio = 1.2 + 0.2 * lv + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill785Level / 4) * 0.05 * ts617Level

        skill.SetRatio(ratio)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar2(player.GetSkilllevel(593))
        player.SetVar3(player.GetSkilllevel(611))

        player.SetVar1(4)
        player.SetPerform(0)
        player.SetVar1(5)
        player.SetPerform(0)
        player.SetVar1(6)
        player.SetPerform(0)
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.1
        }


        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)
        const skill785Level = player.GetSkilllevel(785)

        let ratio = 1.2 + 0.2 * lv + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill785Level / 4) * 0.05 * ts617Level

        skill.SetRatio(ratio)


        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar2(player.GetSkilllevel(593))
        player.SetVar3(player.GetSkilllevel(611))

        player.SetVar1(7)
        player.SetPerform(0)
        player.SetVar1(8)
        player.SetPerform(0)
        player.SetVar1(9)
        player.SetPerform(0)
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.1
        }


        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)
        const skill785Level = player.GetSkilllevel(785)

        let ratio = 1.2 + 0.2 * lv + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill785Level / 4) * 0.05 * ts617Level

        skill.SetRatio(ratio)


        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar2(player.GetSkilllevel(593))
        player.SetVar3(player.GetSkilllevel(611))

        player.SetVar1(10)
        player.SetPerform(0)
        player.SetVar1(11)
        player.SetPerform(0)
        player.SetVar1(12)
        player.SetPerform(0)
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.1
        }


        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)
        const skill785Level = player.GetSkilllevel(785)

        let ratio = 1.2 + 0.2 * lv + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill785Level / 4) * 0.05 * ts617Level

        skill.SetRatio(ratio)


        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar2(player.GetSkilllevel(593))
        player.SetVar3(player.GetSkilllevel(611))

        player.SetVar1(13)
        player.SetPerform(0)
        player.SetVar1(14)
        player.SetPerform(0)
        player.SetVar1(15)
        player.SetPerform(0)
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.95 - ts612 * 0.1) {
            r1 = 0.1
        }


        const ts617Level = player.GetSkilllevel(617)
        const skill234Level = player.GetSkilllevel(234)
        const skill242Level = player.GetSkilllevel(242)
        const skill543Level = player.GetSkilllevel(543)
        const skill785Level = player.GetSkilllevel(785)

        let ratio = 1.2 + 0.2 * lv + r1;
        ratio += Math.floor(skill234Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill242Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill543Level / 9) * 0.05 * ts617Level
        ratio += Math.floor(skill785Level / 4) * 0.05 * ts617Level

        skill.SetRatio(ratio)


        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

        GetTs607Effect(stub, skill, originFunc)
        GetTs617Effect2(stub, skill, originFunc)
        GetTs617Effect1(stub, skill, originFunc)
        player.SetVar2(player.GetSkilllevel(593))
        player.SetVar3(player.GetSkilllevel(611))

        player.SetVar1(16)
        player.SetPerform(0)
        player.SetVar1(17)
        player.SetPerform(0)
        player.SetVar1(18)
        //*最后一段攻击附加自身真气上限4%/8%的攻击力
        skill.SetPlus(v22 + player.GetMaxmp() * 0.04 * skill.GetLevel())

        GetTs607Effect(stub, skill, originFunc)

        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        if (player.GetVar1() % 2 == 1 && zrand(100) <= 4 * skill.GetLevel() + player.GetVar3() * 5) {
            player.SetClearcooldown(786, 786, 786)
        }

        //范围内敌对目标每增加1人，范围内所有敌对目标伤害额外增加施法者自身气血真气和的1%与攻击力的10%。
        player.SetScopedamage(120, (player.GetHp() + player.GetMp()) * 0.01 + player.GetMaxatk() * 0.1, 0,);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        if (player.GetVar1() % 2 == 1) {
            const v7 = 17 * skill.GetLevel() + 180;
            const v8 = 6 * player.GetVar2() * skill.GetLevel();
            const da = v7 + v8;

            const t = player.GetVar2() * 500
            player.SetWrap(da, 6100 + t)
        }

        return true
    }

}

/**
 * 600   绝圣弃智
 * 群体攻击，目标周围23米，目标限制22个，施法时间1秒，
 * 真气消耗当前所有真气，气血消耗当前所有气血，
 * 技能冷却60秒。
 *
 * 攻击目标周围23米内的敌人。附加攻击力为消耗气血和真气的15%。
 *
 * 1539  天地不仁II
 * 被动效果
 * 绝圣弃智额外附加自身气血真气上限和1%/10%的攻击力。
 *
 */
class Skill600 extends BaseHookSkillStub {

    constructor() {
        super(600);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const plus = player.GetHp() + player.GetMp() * 0.15 * skill.GetLevel()
        const ts1539 = player.GetSkilllevel(1539)
        const tsPlus = ts1539 * 0.01 * player.GetMaxHPAndMP()
        skill.SetPlus(plus + tsPlus)
        player.SetMp(0)
        player.SetHp(1)
        player.SetPerform(1)
    }

}

/**
 * 1537  炼气还神II
 * 祝福技能/自身，1秒施放。
 * 令自身技能伤害增加2%/20%，持续4/40秒；
 * 立即在4/40秒内回复自身真气上限4%/40%的真气,回复效果可与炼气还神叠加;
 * 冷却时间200/20秒。
 * 被动
 * 天机印技能冷却时间减少15秒，天机印持续时间增加自身10%的克仙/魔/佛属性。
 */
class Skill1537 extends BaseHookSkillStub {

    constructor() {
        super(1537);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 220000 - 20000 * skill.GetLevel()
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const skillLevel = skill.GetLevel()
        player.SetIncskilldamage(0.02 * skillLevel, skillLevel * 4000, 2)
        player.SetMpgen(120, skillLevel * 4000, 0, skillLevel * 0.04, 5)
        return true
    }
}

/**
 * 1538  怒剑狂花II
 * 目标限制:2/11个，本体攻击追加:5%/50%，
 * 令目标气血上限降低，数值为自身气血的2%20%，最多降低至目标气血上限的50%，持续8秒。
 * 有较大概率打断目标攻击，
 * 同时解除自身所处的流血和燃魔效果。
 * 冷却时间16秒。
 */
class Skill1538 extends BaseHookSkillStub {

    constructor() {
        super(1538);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 16000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(skill.GetLevel() * 0.05 + 1.0)
        player.SetVar1(player.GetHp())
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetExorcism(120, 3, 1, 2)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetHpleak(120, 8100, player.GetVar1() * 0.02 * skill.GetLevel(), player.GetMaxhp() * 0.5, 1)
        player.SetBreakcasting(120)
        return true
    }
}

/**
 * 1539  天地不仁II
 * 目标限制:12个
 * 攻击自身周围20米内的敌人，
 * 每次攻击有10%/100%几率清除目标身上3个常规有利状态，
 * 10%/100%几率令目标进入禁食状态，效果持续11/20秒，
 * 强制定身周围目标8秒，定身能力为自身定身抗性，
 * 冷却时间240/60秒。
 * 被动效果
 * 绝圣弃智额外附加自身气血真气上限和1%/10%的攻击力。
 */
class Skill1539 extends BaseHookSkillStub {

    constructor() {
        super(1539);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 260000 - skill.GetLevel() * 20000
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
        const player = skill.GetPlayerNice()
        player.SetClearbuff(10 * skill.GetLevel(), 3)
        player.SetDiet(10 * skill.GetLevel(), 10100 + 1000 * skill.GetLevel())

        player.SetWrap(player.GetVar1(), 8100)
        return true
    }

}

/**
 * 2044  逍遥游II
 * 12/30秒内移动速度增加1.4/5.0米/秒,普攻躲闪增加30/120点;
 * 2/20秒内技能躲闪增加15/60点,冷却时间80秒。
 */
class Skill2044 extends BaseHookSkillStub {

    constructor() {
        super(2044);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const skillLevel = skill.GetLevel()
        const time = 10000 + skillLevel * 2000
        player.SetAddspeed(120, time, 1.0 + skillLevel * 0.4, 1)
        player.SetAdddodge(120, time, 20 + skillLevel * 10, 1)
        player.SetIncskilldodge(120, 0.1 + skillLevel * 0.05, skillLevel * 2000, 1)
        return true
    }

}

/**
 * 2045 天诛剑气II
 * 真气贯穿
 * （施法时真气高于75%则追加自身真气上限10%的攻击力)
 * 目标限制:40个
 * 攻击自身周围25米内的敌人,每击附加本体攻击力160%/340%，附加攻击力1000点，额外附加自身真气上限20%攻击力。
 * 攻击怪物目标时，此技能伤害增加2倍。
 * 第一击令目标被间歇性定身，定身能力为自身定身抗性，效果持续1/10秒。
 * 每击额外追加一次自身真气上限18%/45%的伤害。冷
 * 却时间60秒。
 */
class Skill2045 extends BaseHookSkillStub {

    constructor() {
        super(2045);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.75 - ts612 * 0.1) {
            r1 = 0.1
        }

        let ratio = 1.4 + skillLevel * 0.2
        ratio += r1

        skill.SetRatio(ratio)

        const plus = player.GetMp() * 0.2 + 1000
        skill.SetPlus(plus)

        skill.SetMobBonusDamage(plus * 2 + player.GetMaxatk() * ratio * 2)

        player.SetVar1(player.GetRes3())
        player.SetVar2(player.GetMaxmp())
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetWraptimer(player.GetVar1(), 10000, 3000, 3000)
        player.SetDirecthurt(120, player.GetVar2() * (skill.GetLevel() * 0.03 + 0.15))
        return true
    }

}

/**
 * 1563  寒霜剑气II
 * 施法距离:21米，目标限制:25个
 * 本体攻击力附加:14%/140%
 * 令目标立即减速20%/65%，持续16秒，并有2%/20%概率冰冻目标6秒，当自身最大攻击力高于目标时则100%冰冻，冷却时间24秒。
 */
class Skill1563 extends BaseHookSkillStub {

    constructor() {
        super(1563);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        skill.SetRatio(1 + 0.14 * skill.GetLevel())
        player.SetVar1(player.GetMaxatk())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetSlow(99999, 0.15 + 0.05 * skill.GetLevel(), 16000, 1)

        let prob = 2 * skill.GetLevel()
        if (player.GetVar1() > player.GetMaxatk()) {
            prob = 120
        }

        player.SetFrozen(prob, 1, 6000, 1)
        return true
    }

}

/**
 * 1564  天外飞仙II
 * 施法距离:21米
 * 当自身真气高于目标时,有10%/100%的概率令目标真气上限减少至2000点,持续6秒;
 * 眩晕目标6秒，眩晕能力为自身眩晕抗性;
 * 冷却时间60秒。
 */
class Skill1564 extends BaseHookSkillStub {

    constructor() {
        super(1564);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetMp())
        player.SetVar2(player.GetRes1())

        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() > player.GetMp()) {
            player.SetSubmp(10 * skill.GetLevel(), player.GetMaxmp(), 2000, 6100, 1)
        }

        player.SetDizzy(player.GetVar2(), 6100)
        return true
    }
}

/**
 * 1565  真元华闪II
 * 真气贯穿
 * (真气大于80%时追加自身真气上限10%的攻击力)
 * 单体攻击16/25米
 * 施法时间1秒，技能冷却174/120秒。攻击目标1次，额外附加本体攻击力35%/125%;
 * 目标气血比例越高额外攻击越高,若自身每增加1个有利状态，或目标每增加1个不利状态,则该效果产生的额外攻击提高8%，最多不超过施法者气血上限的1.5倍。
 */
class Skill1565 extends BaseHookSkillStub {

    constructor() {
        super(1565);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180000 - 6000 * skill.GetLevel()
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        const ts612 = player.GetSkilllevel(612);
        if (mp / maxmp > 0.8 - ts612 * 0.1) {
            r1 = 0.1
        }

        let ratio = 1.0
        ratio += r1

        skill.SetRatio(ratio)

        player.SetVar1(player.GetBuffcnt())

        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        let ratio = 1 + 0.25 + 0.1 * skill.GetLevel()
        ratio += 1 + player.GetHp() / player.GetMaxhp()
        ratio += player.GetVar1() * 0.08
        ratio += player.GetDebuffcnt() * 0.08

        player.SetSecondattack(ratio, 0, 0,)
        return true
    }
}

/**
 * 2054  破魔剑气II
 * 施法距离:21米
 * 消耗自身10%/100%的当前真气，以消耗量额外加50%的真气量燃烧对方真气,对方真气不足则损失气血，并令目标持续流失真气，持续时间12/30%秒，
 * 冷却时间300/120秒。
 */
class Skill2054 extends BaseHookSkillStub {

    constructor() {
        super(2054);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 320000 - skill.GetLevel() * 20000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const useMp = player.GetMp() * 0.1 * skill.GetLevel()
        player.SetVar1(useMp * 1.5)
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()

        player.SetMpdisperse(120, player.GetVar1())
        player.SetMpleak(120, 10000 + skill.GetLevel() * 2000, player.GetVar1(), 0, 1)
        return true
    }

}

/**
 * 2055  七劫斩龙诀II
 * 2.5秒施放，施法距离:22米。
 * 附加本体攻击力32%/320%，
 * 附加自身真气上限4%/40%的攻击力，
 * 第一击附加技能命中3/30点,受到的暴伤增加10%/100%，诅咒效果时间持续6秒，
 * 第二击附加暴率1%/10%，
 * 冷却时间24秒。
 * 目标为怪物时,额外附加5段伤害，并且额外附加本体攻击力132%/420%。
 * 攻击召唤兽目标时，冷却时间1秒。
 */
class Skill2055 extends BaseHookSkillStub {

    constructor() {
        super(2055);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const skillLevel = skill.GetLevel()

        let ratio = 1.0 + 0.32 * skillLevel

        if (player.GetTargetTypeIsMob()) {
            // 目标为怪物时,额外附加5段伤害，并且额外附加本体攻击力132%/420%。
            ratio += 1.0 + 0.32 * skillLevel
        }

        skill.SetRatio(ratio)

        let plus = player.GetMaxmp() * 0.04 * skillLevel

        skill.SetPlus(plus)

        skill.SetSkillaccu(3 * skillLevel)

        player.SetVar1(1)
        player.SetPerform(1)
        if (player.GetTargetTypeIsMob()) {
            player.SetVar1(0)
            player.SetPerform(0)
            player.SetPerform(0)
        }
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        const skillLevel = skill.GetLevel()

        let ratio = 1.0 + 0.32 * skillLevel

        if (player.GetTargetTypeIsMob()) {
            // 目标为怪物时,额外附加5段伤害，并且额外附加本体攻击力132%/420%。
            ratio += 1.0 + 0.32 * skillLevel
        }

        skill.SetRatio(ratio)

        let plus = player.GetMaxmp() * 0.04 * skillLevel

        skill.SetPlus(plus)

        skill.SetCrit(0.01 * skillLevel)

        player.SetVar1(2)
        player.SetPerform(0)
        if (player.GetTargetTypeIsMob()) {
            player.SetVar1(0)
            player.SetPerform(0)
            player.SetPerform(0)
            player.SetPerform(0)
        }
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar1() == 1) {
            //受到的暴伤增加10%/100%，诅咒效果时间持续6秒，
            player.SetIncfatalhurt(120, 0.1 * skill.GetLevel(), 6100, 1)
        }
        return true
    }

}

/**
 * 1589  真元护体II
 * 被动
 * 令真元护体吸收伤害总量增加自身真气上限的2倍，吸收比例增加10%;
 * 主动
 * 吸收60%伤害,总量不超过自身真气上限的6倍,效果最多维持3/30秒，
 * 效果持续期间增加自身减免致命一击几率1%/10%和减免致命一击伤害3%/30%。
 * 同时令自身30秒内防御提升20%/200%，效果可与冰心诀叠加，
 * 冷却时间180秒。
 */
class Skill1589 extends BaseHookSkillStub {

    constructor() {
        super(1589);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel()

        let ratio = skillLevel * 0.06
        let amount = 6 * player.GetMaxmp()
        player.SetMagicshield(ratio, amount, skillLevel * 3000)

        player.SetDecfatalratio(120, 0.01 * skillLevel, skillLevel * 3000, 1)
        player.SetDecfatalhurt(120, 0.03 * skillLevel, skillLevel * 3000, 1)
        player.SetIncdefence(120, 0.2 * skillLevel, skillLevel * 3000, 2)
        return true
    }

}

/**
 * 1590  天仙护体II
 * 令天仙护体增加防御效果和真气效果提升10%/100%；
 *
 * 自身30秒内气血持续恢复，总量为自身最大攻击的3/30倍，技能躲闪提升1/10点，同时令自身减少受到的部分技能的追加伤害2%/20%。
 * 冷却时间120秒。
 */
class Skill1590 extends BaseHookSkillStub {

    constructor() {
        super(1590);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetHpgen(120, 30100, player.GetMaxatk() * 3 * skill.GetLevel(), 0, 0, 2)
        player.SetIncskilldodge(120, 0.01 * skill.GetLevel(), 30100, 1)
        player.SetSlant(120, 30100, 0.02 * skill.GetLevel())
        return true
    }

}

/**
 * 1591  大道无形II
 * 令自身及周围18米内队友所有抗性提升60点，效果持续3/30秒;
 * 30秒内攻击增加，效果相当于自身所有抗性和的5%/50%;
 * 冷却时间240/60秒。
 */
class Skill1591 extends BaseHookSkillStub {

    constructor() {
        super(1591);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 260000 - 20000 * skill.GetLevel()
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetVar1(player.GetRes1() + player.GetRes2() + player.GetRes3() + player.GetRes4() + player.GetRes5())
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const skillLevel = skill.GetLevel()
        player.SetAddanti(60, skillLevel * 3000, 1)
        player.SetAddattack(120, skillLevel * 3000, player.GetVar1() * 0.05 * skillLevel, 1)
        return true
    }

}

/**
 * 2064  五气朝元II
 * 清除自身所处蛊类效果的效果;
 * 清除自身及周围18米内队友1/10个常规负面状态;
 * 冷却时间120秒。
 */
class Skill2064 extends BaseHookSkillStub {

    constructor() {
        super(2064);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        player.SetExorcism(120, 8, 7, 9)
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetCleardebuff(120, skill.GetLevel())
        return true
    }

}

/**
 * 2065  天机印II
 * 目标限制:25个
 * 禁魔光环,每五秒有28%/100%概率打断周围目标使用技能,打断成功则燃烧目标2%/20%真气,光环影响半径18米。
 */
class Skill2065 extends BaseHookSkillStub {

    constructor() {
        super(2065);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetEvilaura(0, 0, 18, 3600000)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetBreakcasting(20 + 8 * skill.GetLevel())
        player.SetMpleak(-1, 200, 0.02 * skill.GetLevel(), 0, 1)
        return true
    }

}


class QingYunSkillList {
}
