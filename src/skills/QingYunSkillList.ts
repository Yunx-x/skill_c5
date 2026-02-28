import {BaseHookSkillStub} from "../base/skill/BaseHookSkillStub";
import {Skill} from "../base/skill/Skill";
import {Frozen_multi} from "../base/ExtFunc";
import {norm, zrand} from "../base/ConstFunc";
import {GetTs579Effect, setUniqprompt} from "../talent/QingYunTalent";

/**
 * 223 寒冰咒   9
 * 单体攻击10.7米，施法时间1秒，技能冷却2秒。
 * 攻击目标1次，附加53/85点攻击力。
 * 有48%/72%几率使目标被冰冻，持续4/12秒：降低其移动速度22%/46%
 *
 * 567  寒冰烈炎    2
 * 被动生效
 * 寒冰咒每升一级攻击力额外增加6点，并使其减速能力和降低速度能力少量增加。
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
 */
class Skill460 extends BaseHookSkillStub {

    constructor() {
        super(460);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetPasincmpgen(0.3 * skill.GetLevel());
        player.SetPasaddanti(15 * skill.GetLevel());

        return true;
    }

}

/**
 * 226 寒霜剑气   9
 * 线型攻击14米，目标限制15个，施法时间1秒，技能冷却2秒。
 * 攻击目标1次，附加46/97点攻击力。
 * 有37%/53%几率使目标被冰冻，持续3秒：降低其移动速度10%/26%。
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
        skill.SetPlus(40 + skill.GetLevel() * 6);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetFrozen(35 + skill.GetLevel() * 2, 1, 3000, 1);
        player.SetSlow(-1, 0.08 + skill.GetLevel() * 0.02, 3000, 1);

        return true;
    }

}

/**
 * 233 逍遥游   5
 * 施法时间1秒，技能冷却75秒。
 * 16/24秒内移动速度增加2.5/4.1米/秒，非战斗状态下300/1500秒内真气回复速度增加12%/100%，加速效果在骑乘状态下无效，冷却时间75秒。
 */
class Skill233 extends BaseHookSkillStub {

    constructor() {
        super(233);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 75000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const level = skill.GetLevel();

        // 移动速度增加：16/24秒内移动速度增加2.5/4.1米/秒
        player.SetAddspeed(100, 16000 + (level - 1) * 2000, 2.5 + (level - 1) * 0.4, 1);

        // 真气回复速度增加：非战斗状态下300/1500秒内真气回复速度增加12%/100%
        player.SetIncmpgen(0.12 + (level - 1) * 0.22, level * 300000, 1);
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

        if (mp / maxmp > 0.95) {
            skill.SetRatio(1 + 0.04);
        }

        const ts569 = player.GetSkilllevel(569);
        skill.SetPlus((57 + skill.GetLevel() * 11) * (ts569 * 0.15 + 1));

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
 */
class Skill231 extends BaseHookSkillStub {

    executetime = [800, 200]

    constructor() {
        super(231);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetZhaoqi(120, 0.05 * skill.GetLevel(), 0, 1800000, 1);
        return true
    }

}

/**
 * 225 驭雷术   9
 * 群体攻击，目标周围半径8米，目标限制16个，施法时间2秒，技能冷却2秒。
 * 攻击目标周围1次，附加128/209点攻击力。
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

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
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
        player.SetPerform(1);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const ts570 = player.GetSkilllevel(570)
        const tsTime = ts570 * 2000
        const tsPlus = ts570 * player.GetLevel() * 0.5

        player.SetAddattack(120, 3100 + tsTime, 6 * skill.GetLevel() + tsPlus, 1);
        return true
    }

}

/**
 * 380 玄妙镜   6
 * 被动。
 * 永久增加自身眩晕抗性5/30点。
 */
class Skill380 extends BaseHookSkillStub {

    constructor() {
        super(380);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetPasadddizzy(5 * skill.GetLevel());
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
 */
class Skill235 extends BaseHookSkillStub {

    constructor() {
        super(235);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 125000 - skill.GetLevel() * 5000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetMagicshield(0.08 + skill.GetLevel() * 0.01, 2 * player.GetMaxmp(), 30000)
        player.SetDecfatalhurt(120, 0.1, 30000, 1)
        return true
    }

}

/**
 * 395 御空术   3
 * 御空术15米，施法时间0秒，技能冷却23/13秒。
 * 快速向前冲刺，有15%/35%概率解除减速。
 */
class Skill395 extends BaseHookSkillStub {

    constructor() {
        super(395);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 28000 - skill.GetLevel() * 5000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDodge(6000, 50)

        player.SetClearslow(10 + skill.GetLevel() * 5)
        return true
    }
}

/**
 * 239 炼气还神   8
 * 自身祝福，施法时间1秒，技能冷却120秒。
 * 消耗240/1080点气血，自身在6/27秒内回复252/1512点真气，回复效果可与炼气还神Ⅱ叠加，吟唱期间补血类效果无效，气血不足效果削减。
 */
class Skill239 extends BaseHookSkillStub {

    constructor() {
        super(239);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetMpgen(120, 3000 * skill.GetLevel() + 3000, 0, 72 + skill.GetLevel() * 180, 5)
        return true
    }
}

/**
 * 224 南华真经   6
 * 被动。
 * 永久增加自身真气上限300/1800点，永久增加自身自身减免致命一击率0.5%/3.0%。
 */
class Skill224 extends BaseHookSkillStub {

    constructor() {
        super(224);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetPasaddmp(300 * skill.GetLevel())
        player.SetPasdecfatalratio(0.05 * skill.GetLevel())
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
        if (mp / maxmp > 0.95) {
            skill.SetRatio(1 + 0.08)
        }

        const ts572 = player.GetSkilllevel(572)
        const tsV1 = ts572 * 0.15

        skill.SetPlus((411 + skillLevel * 54) * (ts572 * 0.2 + 1))

        player.SetVar1(player.GetRes3() * (skillLevel * 0.05 + tsV1))
        player.SetVar2(player.GetMaxatk())
        player.SetVar3(ts572)
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
        skill.SetPlus(280 + skill.GetLevel() * 16);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true;
    }

}

/**
 * 229 冰心诀   6
 * 自身祝福，施法时间1秒，技能冷却120秒。
 * 10/30秒内自身防御提升1%/6%，效果可与真元护体Ⅱ叠加。
 * 并清除逍遥游、真元护体和炼气还神的冷却时间。
 */
class Skill229 extends BaseHookSkillStub {

    constructor() {
        super(229);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetIncdefence(120, 4000 * skill.GetLevel() + 6100, 0.01 * skill.GetLevel(), 1)
        player.SetClearcooldown(233, 235, 239)
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

        skill.SetPlus(429 + skill.GetLevel() * 21)

        player.SetPerform(1)
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
        return true
    }

}

/**
 * 236 雷霆震怒   8
 * 群体诅咒，目标周围10米，目标限制6个，施法时间1秒，技能冷却140/105秒。
 * 雷电闪耀目标周围10米内敌人，技能对目标无伤害。
 * 若自身定身抗性高于目标，则强制定身目标6秒。
 */
class Skill236 extends BaseHookSkillStub {

    constructor() {
        super(236);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 145000 - skill.GetLevel() * 5000;
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
        if (mp / maxmp > 0.95) {
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
 */
class Skill241 extends BaseHookSkillStub {

    constructor() {
        super(241);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {

        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel();

        // 防御提升20/60点，持续10/30分钟
        const defenceValue = 20 + (skillLevel - 1) * 10;
        const defenceTime = (10 + (skillLevel - 1) * 5) * 60 * 1000;
        player.SetAdddefence(120, defenceTime, defenceValue, 1);

        // 真气上限提升200/1000点，持续10/30分钟
        const mpValue = 200 * skillLevel;
        const mpTime = (10 + (skillLevel - 1) * 5) * 60 * 1000;
        player.SetAddmp(mpTime, mpValue, 1);

        return true
    }

}

/**
 * 242 雷神之锥   9
 * 群体攻击，自身周围10米，目标限制35个，施法时间1秒，技能冷却2秒。
 * 攻击自身周围10/12米内的目标1次，附加609/798点攻击力。
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
        const attackValue = Math.floor(609 + (skill.GetLevel() - 1) * 189 / 8);
        skill.SetPlus(attackValue);
        player.SetPerform(1)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
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

        player.SetDecdamage(55 + ts578 * 15, 0.3 + skill.GetLevel() * 0.1, 16100)
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
 */
class Skill539 extends BaseHookSkillStub {

    constructor() {
        super(539);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 155000 - 5000 * skill.GetLevel()
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
 */
class Skill540 extends BaseHookSkillStub {

    constructor() {
        super(540);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 90000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const time = skill.GetLevel() * 2000 + 6100
        player.SetCycsubdefence(120, 64 * skill.GetLevel() + 16, time, 1)
        player.SetFlamecurse(120, time, 0.08, 1)
        player.SetSubhp(120, player.GetMaxhp() * (0.04 * skill.GetLevel()), time, skill.GetLevel() * 10, 1)
        player.SetSubmp(120, player.GetMaxmp() * (0.04 * skill.GetLevel()), time, skill.GetLevel() * 10, 1)
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
        if (mp / maxmp > 0.95) {
            r1 = 0.16
        }

        skill.SetRatio(1 + r1 + skillLevel * 0.01)
        const plus1 = 320 * skillLevel + skillLevel
        const plus2 = maxmp * 0.01 * skillLevel


        const ts580 = player.GetSkilllevel(580)
        const plusTs = ts580 * 50 * skillLevel

        skill.SetPlus(plus1 + plus2 + plusTs)

        skill.SetMobBonusDamage(plus2 * 2)
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
 */
class Skill542 extends BaseHookSkillStub {

    constructor() {
        super(542);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        skill.SetRatio(1 + 0.15 * skill.GetLevel())
        const buffcnt = player.GetBuffcnt();
        player.SetVar1(buffcnt);
        player.SetPerform(1)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();

        let d = skill.GetLevel() * 0.05;

        let v3 = 2 * (player.GetHp() + 50);
        let da = v3 / (player.GetMaxhp() + 100) + d;

        let v13 = skill.GetT2() * 0.04;
        let v14 = player.GetVar1() * v13 + 1.0;

        let v12 = skill.GetT2() * 0.04;

        const r = (player.GetDebuffcnt() * v12 + v14) * da;

        player.SetSecondattack(r, 0, 0);
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
 */
class Skill543 extends BaseHookSkillStub {

    constructor() {
        super(543);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = skill.GetLevel()
        skill.SetRatio(1 + 0.02 * lv)

        skill.SetPlus(215 * lv + lv)

        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const lv = skill.GetLevel()
        skill.SetRatio(1 + 0.02 * lv)

        skill.SetPlus(215 * lv + lv)

        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictim();
        let t = 500 * skill.GetT2() + 1500;
        player.SetInvincible(t);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDrainmagic(6, 0.25)
        return true
    }

}

/**
 * 544   天机印 6
 * 自身祝福，施法时间1秒，技能冷却220/120秒。
 * 自身在4/24秒内，TODO:所有真气贯穿效果额外增加10%自身真气上限的攻击力。
 * 天机印持续时间内,单体攻击技能天诛剑气、赤乌·天诛剑气变为群体攻击技能天诛剑气·罚、赤乌·天诛剑气·罚，并获得新技能霜极刑冰错。
 */
class Skill544 extends BaseHookSkillStub {

    constructor() {
        super(544);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 240000 - skill.GetLevel() * 20000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const time = 4000 * skill.GetLevel() + 100
        player.SetSkillreplace(120, time, 230, 5040, 1)
        player.SetSkillreplace(120, time, 6814, 5047, 2)
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

        const ts582 = player.GetSkilllevel(582)
        const mobPlus = ts582 * 0.3 * player.GetMaxatk()
        skill.SetMobBonusDamage(mobPlus)

        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()
        skill.SetRatio(1.5)
        let v7 = lv * lv * 7.2 - lv * 6.4 + 694;
        skill.SetPlus(v7)

        const ts582 = player.GetSkilllevel(582)
        const mobPlus = ts582 * 0.3 * player.GetMaxatk()
        skill.SetMobBonusDamage(mobPlus)

        player.SetPerform(0)
        player.SetPerform(0)
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
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
        if (mp / maxmp > 0.95) {
            r1 = 0.08
            p1 = maxmp * 0.05
        }

        skill.SetRatio(1 + 0.1 * skill.GetLevel() + r1)

        const v8 = 22 * lv + 750;
        const v9 = 8 * lv * lv;
        const plus = v8 + v9;
        skill.SetPlus(plus + p1)
        player.SetPerform(1)
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        let p1 = 0
        if (mp / maxmp > 0.95) {
            r1 = 0.08
            p1 = maxmp * 0.05
        }

        skill.SetRatio(1 + 0.1 * skill.GetLevel() + r1)

        const v8 = 22 * lv + 750;
        const v9 = 8 * lv * lv;
        const plus = v8 + v9;
        skill.SetPlus(plus + p1)
        player.SetPerform(0)
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayer();
        const lv = skill.GetLevel()

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        let r1 = 0
        let p1 = 0
        if (mp / maxmp > 0.95) {
            r1 = 0.08
            p1 = maxmp * 0.05
        }

        skill.SetRatio(1 + 0.1 * skill.GetLevel() + r1)

        const v8 = 22 * lv + 750;
        const v9 = 8 * lv * lv;
        const plus = v8 + v9;
        skill.SetPlus(plus + p1)
        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        setUniqprompt(stub, skill, originFunc)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictim();

        let v2 = 5 * skill.GetLevel();
        let d = v2 + 3 * skill.GetT1();
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
        if (mp / maxmp > 0.95) {
            r1 = 0.1
        }

        skill.SetRatio(1.2 + 0.2 * lv + r1)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

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
        if (mp / maxmp > 0.95) {
            r1 = 0.1
        }

        skill.SetRatio(1.2 + 0.2 * lv + r1)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)


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
        if (mp / maxmp > 0.95) {
            r1 = 0.1
        }

        skill.SetRatio(1.2 + 0.2 * lv + r1)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

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
        if (mp / maxmp > 0.95) {
            r1 = 0.1
        }

        skill.SetRatio(1.2 + 0.2 * lv + r1)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

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
        if (mp / maxmp > 0.95) {
            r1 = 0.1
        }

        skill.SetRatio(1.2 + 0.2 * lv + r1)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

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
        if (mp / maxmp > 0.95) {
            r1 = 0.1
        }

        skill.SetRatio(1.2 + 0.2 * lv + r1)

        let v11 = 50 * lv + 800;
        let v12 = 15 * lv * lv;
        let v22 = v11 + v12;
        skill.SetPlus(v22)

        player.SetVar1(16)
        player.SetPerform(0)
        player.SetVar1(17)
        player.SetPerform(0)
        player.SetVar1(18)
        //*最后一段攻击附加自身真气上限4%/8%的攻击力
        skill.SetPlus(v22 + player.GetMaxmp() * 0.04 * skill.GetLevel())
        player.SetPerform(0)
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        if (player.GetVar1() % 2 == 1 && zrand(100) <= 4 * skill.GetLevel()) {
            player.SetClearcooldown(786, 786, 786)
        }

        //范围内敌对目标每增加1人，范围内所有敌对目标伤害额外增加施法者自身气血真气和的1%与攻击力的10%。
        player.SetScopedamage(120, (player.GetHp() + player.GetMp()) * 0.01 + player.GetMaxatk() * 0.1, 0,);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer();
        if (player.GetVar1() % 2 == 1) {
            let v7 = 17 * skill.GetLevel() + 180;
            let v8 = 6 * skill.GetT0();
            let da = v7 + v8 * skill.GetLevel();
            player.SetWrap(da, 6100)
        }

        return true
    }

}


class QingYunSkillList {
}
