import {BaseHookSkillStub} from "../base/skill/BaseHookSkillStub";
import {Skill} from "../base/skill/Skill";
import {zrand} from "../base/ConstFunc";
import {getSkillStub} from "../base/skill/HookSkillUtil";


export const BOSS_ID = 400055

/**
 * 3207  月神冰
 *
 */
class Skill3207 extends BaseHookSkillStub {

    constructor() {
        super(3207);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
            skill.GetPlayerNice().SetChihun(120, 6000, 0, 0, 1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            const result = zrand(100)
            const a = result % 3
            if (a == 0) {
                player.SetSilent(9999, 6000)
            } else if (a == 1) {
                player.SetDizzy(9999, 6000)
            } else {
                player.SetSuspend(120, 6000, 3, 1, 1)
            }
            return true
        } else {
            return super.StateAttack(stub, skill, originFunc);
        }
    }

}

/**
 * 6296 BOSS通用格挡
 * 加上通用的格挡，里面有判断模版id
 */
class Skill6296 extends BaseHookSkillStub {

    constructor() {
        super(6296);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            const r = zrand(5)
            if (r == 1) {
                player.SetParry2(120, 10000, 0.7, player.GetHp() / 2, 0, 0)
                player.SetSlant(120, 10000, 1)
            } else if (r == 2) {
                player.SetDecay(120, 10000, 0.8, 2)
                player.SetAvert(120, 10000, 0.001)
            } else if (r == 3) {
                player.SetSlant(120, 10000, 0.7)
                player.SetBuffClearImmune(120, 10000)
            } else if (r == 4) {
                player.SetParry2(120, 10000, 0.7, player.GetHp() / 2, 0, 0)
                player.SetAvert(120, 10000, 0.001)
            }
            return true
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 5977 Boss清Buff，神佑
 * 增加对自己无视神佑5秒
 */
class Skill5977 extends BaseHookSkillStub {

    constructor() {
        super(5977);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
            player.SetIgnoreblessed(120, 3000)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetTurndebuff(15000, 10, 1)
            player.SetChihun(120, 5000, 0.1, 0, 1)
            player.SetFrozenImmune(120, 10000)
            // player.SetAvert(120, 10000, 1)
            player.SetSlant(120, 8000, 0.8)
            player.SetBlessed(10, 5000)

            return true
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 5997 变乌龟
 */
class Skill5997 extends BaseHookSkillStub {

    constructor() {
        super(5997);
    }

}

/**
 * 4978 秒杀单体
 *
 */
class Skill4978 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(4978)
        stub.pointer.add(0x2F).writeU8(0)
        super(4978);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
            player.SetChihun(120, 10000, 0.1, 0, 1)
            player.SetAvert(120, 6000, 0.001)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            const result = zrand(2)
            if (result == 1) {
                player.SetDirecthurt(120, player.GetMaxhp() * 10)
            } else if (result == 2) {
                player.SetMpleak(120, 6000, player.GetMaxmp(), player.GetMp(), 8)
            }

            return true
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 1775 群飞。等级秒
 * 17750  "自身为中心群攻"
 *
 */
class Skill1775 extends BaseHookSkillStub {

    constructor() {
        super(1775);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            const result = zrand(100)
            const a = result % 3
            if (a == 0) {
                player.SetSuspend(120, 7000, 3, 1, 1)
            } else if (a == 1) {
                player.SetFear2(120, 7000, 15)
            } else {
                player.SetParalysis(120, 7000, 0.5, 0.5)
            }

            return true
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 1089 群体击退。等级米。最大50
 *
 */
class Skill1089 extends BaseHookSkillStub {

    constructor() {
        super(1089);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetRepel(120, skill.GetLevel() + 6)
            player.SetHpleak7(120, 10000, player.GetMaxhp(), player.GetMaxhp() * 0.8, 0)

            return true
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 1023 招架白字，等级秒
 *
 */
class Skill1023 extends BaseHookSkillStub {

    constructor() {
        super(1023);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetAvert(120, skill.GetLevel() * 500 + 100, 0.001)
            return true
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 6549 黑屏。60%血每10秒
 * 单体
 */
class Skill6549 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(6549)
        stub.pointer.add(0x2F).writeU8(0)
        super(6549);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetIgnoreblessed(120, 4000)
            player.SetIgnoreinvicible(120, 2000)
        }

        super.Calculate2(stub, skill, originFunc);
    }
}

/**
 * 4042 刀山。60%血每8秒
 *
 */
class Skill4042 extends BaseHookSkillStub {

    constructor() {
        super(4042);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetDisguise(120, 4000)
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 3917
 */
class Skill3917 extends BaseHookSkillStub {

    constructor() {
        const stub = getSkillStub(3917)
        stub.pointer.add(0x2F).writeU8(0)
        super(3917);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
            player.SetSkillmirror(120, 6000)
            player.SetIgnoreblessed(120, 2000)
            player.SetIgnoreinvicible(120, 2000)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetDisarrange(9999, 4000, 4000, 10)
        }

        return super.StateAttack(stub, skill, originFunc);
    }
}

/**
 * 3923
 */
class Skill3923 extends BaseHookSkillStub {

    constructor() {
        super(3923);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetBlessed(10, 3000)
            player.SetHeal(120, player.GetHp() * 0.05, 0)
        }

        return super.StateAttack(stub, skill, originFunc);
    }
}

/**
 * 3184 原来是禁食
 *改刺骨
 */
class Skill3184 extends BaseHookSkillStub {

    constructor() {
        super(3184);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetColdinjure(120, 0.2, 10000, 8)
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}

/**
 * 3919  死亡时随机把一个人吹上天
 *
 */
class Skill3919 extends BaseHookSkillStub {

    constructor() {
        super(3919);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice()
        if (player.GetTmplid() == BOSS_ID) {
            player.SetVar16(1)
        }

        super.Calculate2(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        if (player.GetVar16() == 1) {
            player.SetSuspend(120, skill.GetLevel() * 1000, 3, 1, 1)
            return true
        }

        return super.StateAttack(stub, skill, originFunc);
    }

}


/**
 * 1. 出生喊话
 * 2. 开始战斗
 *  1. 3207 群攻。随机1种：魅惑、眩晕、枯荷90%大血 6秒
 *  2. 2732 自身 狂暴增伤
 *  3. 6296 自身 随机格挡、偏锋、招架、凝神、亢奋
 *  4. 定时1，30秒50次
 *  5. 定时2，10秒5000次
 *  6. 定时3，20秒5000次
 *  7. 定时4，14秒5000次
 *  8. 定时5，16秒5000次
 *  9. 定时14，5秒5000次
 * 3. 定时1：3184  群攻  刺骨20%13秒
 * 4. 定时2：
 *  1. 5977  自身 玉册20s，蚩魂10s，免冰10s，偏锋80%10s，神佑30次13s
 *  2. 5997 随机1位  变乌龟5s
 * 5. 定时3：
 *  1. 5977  自身 玉册20s，蚩魂10s，免冰10s，偏锋80%10s，神佑30次13s
 *  2. 4978 随机1位    随机1种：白字必死，抽蓝，什么都不做。 自身：回血当前量25%，蚩魂10s，招架80%6s
 * 6. 定时4：1775  群攻自身周围18米  随机1种：起飞、恐惧、麻痹 7秒。
 * 7. 定时5：1089  群攻自身周围30米  击退，一丈红10秒，流血为血上，最后一次为血上80%
 * 8. 70%血时，仅一次：
 *  1. 3733 自身  玉册45s
 *  2. 4978 随机1位    随机1种：白字必死，抽蓝，什么都不做。 自身：回血当前量30%，蚩魂10s，招架80%6s
 *  3. 定时7，20秒1000次
 * 9. 定时7：1023   自身招架90%6s
 * 10. 60%血时：
 *  1. 3964 第一位 麻痹10s
 *  2. 定时9，30秒100次
 *  3. 定时10，8秒100次
 * 11. 定时9：6549 自身无视神佑5s，无视无敌2s，随机1位 直接黑屏+流血
 * 12. 定时10：4042    随机1位，刀山+蹦跶5s
 * 13. 50%血时，仅1次
 *  1. 3733 自身  玉册45s
 *  2. 定时11，20秒100次
 *  3. 定时12，3秒1次
 *  4. 3923    自身回血当前30%
 * 14. 定时11：3207 第一位 群攻。随机1种：魅惑、眩晕、枯荷90%大血 6秒
 * 15. 定时12：
 *  1. 5997 随机1位  变乌龟5s
 *  2. 7199 群体拉人
 * 16. 30%血时，仅1次
 *  1. 3917 随机1位幽花6s，自身镜子8s
 *  2. 3923    自身回血当前30%
 * 18. 定时14：6296 自身 随机格挡、偏锋、招架、凝神、亢奋
 * 19. 10%血时，仅1次
 *  1. 3917 随机1位幽花6s，自身镜子8s
 *  2. 3923    自身回血当前30%
 *
 */
export class BossSkillList {

    constructor() {
        new Skill6296()
        new Skill5977()
        new Skill4978()
        new Skill1775()
        new Skill1089()
        new Skill1023()
        new Skill6549()
        new Skill3917()
        new Skill3923()
        new Skill3207()
        new Skill4042()
        new Skill3184()
        new Skill3919()

        // const setFrozenFunc = "_ZN4GNET13PlayerWrapper9SetFrozenEb"
        // Interceptor.replace(HookFuncCore.getFuncAddress(setFrozenFunc),
        //     new NativeCallback((playerPointer, b) => {
        //             const player = new SNewPlayer(playerPointer)
        //             if (player.GetTypeIsMob()) {
        //
        //                 return 1
        //             } else {
        //                 const originFunc = HookFuncCore.getNativeFunc(setFrozenFunc, 'int32', ['pointer', 'bool'])
        //                 return originFunc(playerPointer, b)
        //             }
        //         }, 'int32', ['pointer', 'bool']
        //     ));
    }

}
