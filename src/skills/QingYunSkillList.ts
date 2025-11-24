import {BaseHookSkillStub} from "base/skill/BaseHookSkillStub";
import {Skill} from "src/base/skill/Skill";
import {setUniqprompt} from "base/ExtFunc";

/**
 * 223 寒冰咒   9
 * 单体攻击10.7米，施法时间1秒，技能冷却2秒。
 * 攻击目标1次，附加53/85点攻击力。
 * 有48%/72%几率使目标被冰冻，持续4/12秒：降低其移动速度22%/46%
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
        skill.SetPlus(49 + skill.GetLevel() * 4);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetFrozen(45 + skill.GetLevel() * 3, 1, 3100 + skill.GetLevel() * 1000, 1);
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
 */
class Skill222 extends BaseHookSkillStub {

    constructor() {
        super(222);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();

        if (mp / maxmp > 0.95) {
            skill.SetRatio(1 + 0.04);
        }

        skill.SetPlus(57 + skill.GetLevel() * 11);

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

    constructor() {
        super(231);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
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
 */
class Skill232 extends BaseHookSkillStub {

    constructor() {
        super(232);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        skill.SetRatio(1 + 0.02);
        skill.SetPlus(136 + skill.GetLevel() * 15);
        player.SetPerform(1);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetAddattack(120, 3100, 6 * skill.GetLevel(), 1);
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

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFrozen(40 + skill.GetLevel() * 5, 1, 2600 + skill.GetLevel() * 500, 1);
        player.SetSlow(-1, 0.18 + skill.GetLevel() * 0.04, 2600 + skill.GetLevel() * 500, 1);

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
 */
class Skill312 extends BaseHookSkillStub {

    constructor() {
        super(312);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        const skillLevel = skill.GetLevel();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();
        if (mp / maxmp > 0.95) {
            skill.SetRatio(1 + 0.08)
        }

        skill.SetPlus(411 + skillLevel * 54)
        player.SetVar1(player.GetRes3() * (skillLevel * 0.05))
        player.SetVar2(player.GetMaxatk())
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
            player.SetBlazingSun(skill.GetLevel() * 6 + r, 15000, 0.5, 0)
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
 * @未实现 若自身真气上限高于目标时，则目标4秒内无法通过吃药来回复真气。
 */
class Skill228 extends BaseHookSkillStub {

    constructor() {
        super(228);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();
        skill.SetPlus(315 + skill.GetLevel() * 33)
        // player.SetVar1(player.GetMaxmp())
        player.SetPerform(1)
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
 * TODO://被动改主动
 *
 * 461 黄帝内经   3
 * 自身祝福，施法时间1秒，技能冷却120/100秒。
 * 获得神佑效果，免疫6/18次伤害和负面效果，持续16/24秒，且最初3秒自身获得无敌效果。
 */
class Skill461 extends BaseHookSkillStub {

    constructor() {
        super(461);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 130000 - skill.GetLevel() * 10000;
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetBlessed(skill.GetLevel() * 6, 16000 + (skill.GetLevel() - 1) * 8000)
        player.SetInvincible(3100)
        return true
    }

}

/**
 * 313 剑心通明   6
 * 被动。
 * 永久增加自身攻击力100/600。
 * 永久增加自身攻击力2%/12%。
 */
class Skill313 extends BaseHookSkillStub {

    constructor() {
        super(313);
    }

    TakeEffect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetPasaddattack(skill.GetLevel() * 100)
        player.SetPasincattack(skill.GetLevel() * 0.02)
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
        player.SetWrap(player.GetVar1(),6100)
        return true
    }

}

/**
 * 237 怒剑狂花   9
 * 真气贯穿+3（真气大于95%时追加本体攻击力12%）
 * 单体攻击10.7米，施法时间2秒，技能冷却8秒。
 * 攻击目标1次，附加1008/1474点攻击力，并令目标在未来8秒内损失3296/6016气血。
 */
class Skill237 extends BaseHookSkillStub {

    constructor() {
        super(237);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 8000;
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

}

/**
 * 242 雷神之锥   9
 * 群体攻击，自身周围10米，目标限制35个，施法时间1秒，技能冷却2秒。
 * 攻击自身周围10/12米内的目标1次，附加609/798点攻击力。
 */
class Skill242 extends BaseHookSkillStub {

    constructor() {
        super(242);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000;
    }

}

/**
 * 240 天外飞仙   9
 * 单体攻击10.7米，施法时间2秒，技能冷却16秒。
 * 攻击目标1次，附加1639/2188点攻击力，受伤减速40%/64%，效果持续3.8/6.2秒，受伤减速效果可与冰冻效果叠加。
 */
class Skill240 extends BaseHookSkillStub {

    constructor() {
        super(240);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 16000;
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

}


class QingYunSkillList {
}
