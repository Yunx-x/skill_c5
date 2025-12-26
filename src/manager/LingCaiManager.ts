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

        const list = []
        if (level >= 1) {
            list.concat(star1Boss, star2Boss, star3Boss, star4Boss, star5Boss)
        } else if (level >= 2) {
            list.concat(star2Boss, star3Boss, star4Boss, star5Boss)
        } else if (level >= 3) {
            list.concat(star3Boss, star4Boss, star5Boss)
        } else if (level >= 4) {
            list.concat(star4Boss, star5Boss)
        } else if (level >= 5) {
            list.concat(star5Boss)
        }

        if (list.length > 0) {
            player.toGPlayer().SummonNPCOrMonster(list[zrand(list.length - 1)], 5400)
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
    }

}

export const lingCaiManager = new LingCaiManager();
