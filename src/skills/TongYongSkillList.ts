import {BaseHookSkillStub} from "../base/skill/BaseHookSkillStub";
import {Skill} from "../base/skill/Skill";
import {HookFuncCore} from "../base/HookFuncCore";
import {XID} from "../base/gs/XID";
import {GPlayer} from "../base/gs/GPlayer";
import {gsManager} from "../manager/GsManager";
import {SPlayer} from "../base/skill/SPlayer";


/**
 * 捕捉
 */
class Skill1970 extends BaseHookSkillStub {

    constructor() {
        super(1970);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 15000
    }
}

/**
 * Buff道具
 * 持续30分钟
 * 攻击、防御增加5%；
 * 人物抗性提高20；
 * 致命一击提高5%；
 * 致命一击伤害提高30%；
 * 减免致命一击提高5%；
 * 减免致命一击伤害提高30%；
 * 减少释放速度20%
 * 增加技能伤害15%
 * 增加对怪伤害15%
 */
class Skill1926 extends BaseHookSkillStub {

    constructor() {
        super(1926);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayer()

        player.SetIncattack(120, 1800000, 0.05, 8)
        player.SetIncdefence(120, 1800000, 0.05, 8)
        player.SetInccritrate(1800000, 0.05, 8)
        player.SetInccrithurt(120, 1800000, 0.3, 8)
        player.SetDecfatalratio(120, 1800000, 0.05, 8)
        player.SetDecfatalhurt(120, 1800000, 0.3, 8)

        player.SetSwift(120, 1800000, 0.2, 0.2)
        player.SetIncskilldamage(0.15, 1800000, 8)
        player.SetIncMobDmg(120, 1800000, 0.15, 8)
        return true
    }
}


export class TongYongSkillList {

    /**
     * 真实伤害不超过施法者气血1.5倍
     */
    RealDmgRatio1_5() {
        const name = "_ZN16object_interface6BeHurtERK3XIDRK15attacker_info_tibcc";
        const address = HookFuncCore.getFuncAddress(name);

        //(&this->object, Attackerid, Attacker, real_dmg, invader, AttackerMode, 0)
        //BeHurt(object_interface *this, XID *, attacker_info_t *, int, bool, char, int)
        Interceptor.replace(
            address,
            new NativeCallback((obj: NativePointer, xid: NativePointer, attacker_info_t: NativePointer,
                                realDmg, invader, attackerMode, unknow,) => {
                    const originFunc = HookFuncCore.getNativeFunc(name, "int32",
                        ["pointer", "pointer", "pointer", "int32", "int32", "char", "int32",]);
                    const attacker = new XID(xid);
                    if (attacker.getType() === 1) {
                        //player
                        const p: GPlayer = gsManager.allPlayer.get(attacker.getID());
                        if (p) {
                            const hp = p.GetMaxHP();
                            if (realDmg > hp) {
                                return originFunc(obj, xid, attacker_info_t, hp * 1.5, invader, attackerMode, unknow,);
                            }
                        }
                    }

                    return originFunc(obj, xid, attacker_info_t, realDmg, invader, attackerMode, unknow,);
                },
                "int32",
                ["pointer", "pointer", "pointer", "int32", "int32", "char", "int32"],
            ),
        );
    }

    /**
     * 无敌可覆盖
     */
    SetInvincible() {
        const name = "_ZN4GNET13PlayerWrapper13SetInvincibleEb";
        const address = HookFuncCore.getFuncAddress(name);
        Interceptor.replace(
            address,
            new NativeCallback(
                (player: NativePointer, b: number) => {
                    const playerNice = new SPlayer(player);
                    playerNice.RemoveFilter(4124);
                    const originFunc = HookFuncCore.getNativeFunc(name, "bool", [
                        "pointer",
                        "bool",
                    ]);
                    return originFunc(player, b);
                },
                "bool",
                ["pointer", "bool"],
            ),
        );
    }

    constructor() {
        this.RealDmgRatio1_5()
        this.SetInvincible()

        new Skill1970()
        new Skill1926()
    }
}
