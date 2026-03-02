import {Skill} from "../base/skill/Skill";
import {zrand} from "../base/ConstFunc";

/**
 * 真气贯穿BlessMe通用实现
 *
 */
export function setUniqprompt(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    const mp = player.GetMp();
    const maxmp = player.GetMaxmp();
    const limitMp = mp / (0.95 - player.GetSkilllevel(612) * 0.1)

    player.SetUniqprompt(Math.floor(limitMp / maxmp))
}


export function GetTs579Effect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    return player.GetSkilllevel(579) * 1000
}


/**
 * 剑魔宿命
 * 单攻剑气类技能的附加人物本体攻击增加5%,并额外追加该类技能致命一击率1%
 * 攻击怪物目标时，额外附加自身当前真气4%的攻击力。
 * (任一单攻剑气类技能达到9阶，均相互额外追加5%的本体攻击，并且各自附加致命一击伤害30%，致命一击率1%)
 * 影响技能:御剑诀、归元剑气、破魔剑气、少阳剑气、怒剑狂花、天外飞仙、天诛剑气、七劫斩龙诀
 */
export function GetTs583Effect1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    const skillLevel = skill.GetLevel()

    const tsLevel = player.GetSkilllevel(583)

    let ratio = skill.GetRatio() + tsLevel * 0.05

    let jianQiLevel = 0
    if (player.GetSkilllevel(222) > 8) {//御剑诀
        jianQiLevel += 1
    }

    if (player.GetSkilllevel(237) > 8) {//怒剑狂花
        jianQiLevel += 1
    }

    if (player.GetSkilllevel(232) > 8) {//归元剑气
        jianQiLevel += 1
    }

    if (player.GetSkilllevel(228) > 8) {//破魔剑气
        jianQiLevel += 1
    }

    if (player.GetSkilllevel(312) > 8) {//少阳剑气
        jianQiLevel += 1
    }

    if (player.GetSkilllevel(240) > 8) {//天外飞仙
        jianQiLevel += 1
    }

    if (player.GetSkilllevel(541) > 8) {//天诛剑气
        jianQiLevel += 1
    }

    if (player.GetSkilllevel(545) > 8) {//七劫斩龙诀
        jianQiLevel += 1
    }

    ratio += tsLevel * 0.05 * jianQiLevel

    skill.SetRatio(ratio)

    let cirt = skill.GetCrit() + tsLevel * 0.01
    cirt += tsLevel * 0.01 * Math.floor(skillLevel / 9)
    skill.SetCrit(cirt)

    let crithurt = skill.GetCrithurt()
    crithurt += tsLevel * 0.3 * Math.floor(skillLevel / 9)
    skill.SetCrithurt(crithurt)

    const mobPlus = skill.GetMobBonusDamage() + tsLevel * 0.04 * player.GetMp()
    skill.SetMobBonusDamage(mobPlus)

}


/**
 * 返朴归真
 * 令你的真元类法术在施放之后，15秒内回复自身5%的真气。
 * 影响技能:逍遥游、冰心诀、真元护体、天仙护体、极度深寒、真元华闪;
 *
 * 令你的真元类法术在施放之后,15秒内技能伤害增加10%。
 * 影响技能:炼气还神、天尊法身、天尊法身<玄><煞><禅>;
 *
 * 令你的真元类法术在施放之后，15秒内回复自身5%的气血。
 * 影响技能:天尊法身、天尊法身<玄><煞><禅>。
 */
export function GetTs592Effect1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    // const skillLevel = skill.GetLevel()
    const tsLevel = player.GetSkilllevel(592)

    player.SetMpgen(120, tsLevel * 15000, 0, tsLevel * 0.05 * player.GetMaxmp(), 1)
}

export function GetTs592Effect2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    // const skillLevel = skill.GetLevel()
    const tsLevel = player.GetSkilllevel(592)

    player.SetIncskilldamage(0.1 * tsLevel, tsLevel * 15000, 1)
}

export function GetTs592Effect3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    // const skillLevel = skill.GetLevel()
    const tsLevel = player.GetSkilllevel(592)

    player.SetHpgen(120, tsLevel * 15000, 0, tsLevel * 0.05 * player.GetMaxhp(), 0, 1)

}


/**
 * 剑心彻悟
 * 被动生效
 * 令你的真元类法术冷却时间减少10秒
 * 逍遥游、冰心诀、真元护体、炼气还神、天仙护体、极度深寒、真元华闪、天尊法身、天尊法身<玄><煞<禅>
 */
export function GetTs596Effect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    return player.GetSkilllevel(596) * 10000
}


/**
 * 盛冰之寒
 * 寒冰类法术的技能附加攻击力增加10%
 * 寒冰咒、寒霜剑气、玄冰刺、霜天雪舞
 */
export function GetTs602Effect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    const tsLevel = player.GetSkilllevel(602)

    const plus = skill.GetPlus() * (tsLevel * 0.1 + 1)
    skill.SetPlus(plus)
}


/**
 * 天雷狂啸
 * 令自身为中心群体法术的附加攻击力在90-115%范围内浮动。（每级+10%最大范围）
 * 雷云风暴、雷神之锥、天地不仁、太极玄天真诀、神剑御雷真诀
 */
export function GetTs607Effect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    const tsLevel = player.GetSkilllevel(607)

    let plus = skill.GetPlus()
    plus = (zrand(15 * tsLevel + 10) - 10) + 100 / 100.0 * plus
    skill.SetPlus(plus)
}

/**
 * 群雷裂空
 * 以下技能的附加攻击力在90-115%范围内浮动。（每级+10%最大范围）
 * 驭雷术、五雷轰顶、霜天雪舞、雷光遁龙诀
 */
export function GetTs606Effect(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    const tsLevel = player.GetSkilllevel(606)

    let plus = skill.GetPlus()
    plus = (zrand(15 * tsLevel + 10) - 10) + 100 / 100.0 * plus
    skill.SetPlus(plus)
}
