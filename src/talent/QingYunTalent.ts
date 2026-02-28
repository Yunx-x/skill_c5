import {Skill} from "../base/skill/Skill";

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






