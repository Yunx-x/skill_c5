import {Skill} from "base/skill/Skill";

/**
 * 真气贯穿BlessMe通用实现
 *
 */
export function setUniqprompt(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
    const player = skill.GetPlayer();
    const mp = player.GetMp();
    const maxmp = player.GetMaxmp();
    const limitMp = mp / (0.95 - skill.GetT3() * 0.1)

    player.SetUniqprompt(Math.floor(limitMp / maxmp))
}
