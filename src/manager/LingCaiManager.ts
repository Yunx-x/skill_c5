import {BaseManager} from "../base/BaseManager";
import {BaseHookSkillStub} from "../base/skill/BaseHookSkillStub";
import {Skill} from "../base/skill/Skill";
import {star1Boss, star2Boss, star3Boss, star4Boss, star5Boss} from "../configs";
import {zrand} from "../base/ConstFunc";


/**
 * 473 飘香竹筒饭 改 金元宝
 *
 */
class Skill473 extends BaseHookSkillStub {

    constructor() {
        super(473);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const level = skill.GetLevel()

        let cash = level * 1000
        player.toGPlayer().UseCash(-cash)
        return true
    }

}

/**
 * 516 群英荟萃 改 召唤怪
 *
 */
class Skill516 extends BaseHookSkillStub {

    constructor() {
        super(516);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const level = skill.GetLevel()
        const gPlayer = player.toGPlayer()
        const mapId = gPlayer.getWorldTag()
        if (mapId != 1101 && gPlayer.IsInSanctuary()) {
            return true
        }

        let list = []
        if (level >= 1) {
            list.push(
                ...star1Boss,
                ...star2Boss,
                ...star3Boss,
                ...star4Boss,
                ...star5Boss
            );
        } else if (level >= 2) {
            list.push(
                ...star2Boss,
                ...star3Boss,
                ...star4Boss,
                ...star5Boss
            );
        } else if (level >= 3) {
            list.push(
                ...star3Boss,
                ...star4Boss,
                ...star5Boss
            );
        } else if (level >= 4) {
            list.push(
                ...star4Boss,
                ...star5Boss
            );
        } else if (level >= 5) {
            list.push(
                ...star5Boss
            );
        }

        console.log("boss List", list)
        if (list.length > 0) {
            player.toGPlayer().SummonNPCOrMonster(list[zrand(list.length - 1)], 5400)
        }

        return true
    }

}


const bro_list = [
    [400049, 30000],
    [400050, 60000],
    [400051, 90000],
    [400052, 120000],
    [400053, 150000]
]

/**
 * 516 绝代双骄 改 召唤小弟
 *
 */
class Skill515 extends BaseHookSkillStub {

    constructor() {
        super(515);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 360000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        const level = skill.GetLevel()

        let data = bro_list[level - 1]
        if (data != undefined) {
            player.SetSummon(120, data[0], 1, data[1], 1)
        }

        return true
    }

}


/**
 * 灵材管理器
 *
 */
export class LingCaiManager extends BaseManager {

    attach() {
        new Skill473()
        new Skill516()
        new Skill515()
    }

}

export const lingCaiManager = new LingCaiManager();
