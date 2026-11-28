import {HookModuleBase} from "./base/HookModuleBase";
import {HookFuncCore} from "./base/HookFuncCore";
import {GPlayer} from "./base/gs/GPlayer";
import {gsManager} from "./manager/GsManager";
import {spiritAttributeManager} from "./manager/SpiritAttributeManager";
import {BaseHookSkillStub} from "./base/skill/BaseHookSkillStub";
import {Skill} from "./base/skill/Skill";
// 技能逻辑（预打包脚本），与入口一并打进 dist/main.js

// 初始化模块基址索引
HookModuleBase.initializeModuleBaseIndex(Process.enumerateModules());

// export const dataMan = new DataMan();
export const dataMan = undefined

gsManager.attach();
spiritAttributeManager.attach();

class Skill248 extends BaseHookSkillStub {

    constructor() {
        super(248);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        // return super.GetCooldowntime(stub, skill, originFunc) + 8000;
        return 0;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        //
        // const v12 = (skill.GetT3() * 0.05 + 1.2);
        skill.SetRatio(0);
        skill.SetPlus(0);
        //
        // const Level = skill.GetLevel();
        // const v9 = Math.floor(1.42 - Level * 0.05);
        // const v6 = Level * 0.014;
        // const v7 = Level * v6;
        // const v10 = ((Level * 2.9 + v7 + 34.0) * v9);
        // const v8 = Math.floor(Level * 0.05 + 0.55);
        // const v5 = Level * 0.37;
        // const v11 = ((Level * v5 + 44.0) * v8 + v10);
        // const v13 = (skill.GetT2() * 0.08 + 1.0) * v11;
        // skill.SetPlus(v13 + 2240);
        //
        // player.SetVar1(player.GetRes1())
        // player.SetVar2(player.GetMaxmp())

        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        // player.SetFlamecurse(120, 12000, 0.1, 1)
        // player.SetBlazingSun(120, 12000, 0.2, player.GetVar2() * 0.1)
        //
        // const res = player.GetVar1()
        // // 为目标增加最多3层灼烧状态，每层灼烧状态持续12秒，造成伤害总量为人物眩晕抗性的120倍。
        // player.SetHpleak4(120, 12000, res * 40, 0, 1)
        // player.SetHpleak4(120, 12000, res * 40, 0, 2)
        // player.SetHpleak4(120, 12000, res * 40, 0, 3)
        //
        // if (player.GetTypeIsPlayer() && player.GetHasmultbuff(111)) {
        //     player.SetDispel(120, 111, 111, 111)
        // }

        player.SetDirecthurt(120, 10000)
        return true
    }

}

new Skill248()

// Interceptor.attach(
//     HookFuncCore.getFuncAddress("_ZN11gplayer_imp26PlayerExchangeEquipFashionEjj"),
//     {
//         onEnter(args) {
//             const player = new GPlayer(args[0]);
//             console.log("PlayerExchangeEquipFashion", player.getPlayerID(), args[1], args[2])
//         },
//     },
// );
//
//
// Interceptor.attach(
//     HookFuncCore.getFuncAddress("_ZN11gplayer_imp24PlayerExchangeInvFashionEjj"),
//     {
//         onEnter(args) {
//             const player = new GPlayer(args[0]);
//             console.log("PlayerExchangeInvFashion", player.getPlayerID(), args[1], args[2])
//         },
//     },
// );
//

const address = HookFuncCore.getFuncAddress(
    "_Z16handle_user_chatiiiPKvjS0_jci",
);
Interceptor.attach(address, {
    onEnter(args) {
        const input_player_id = args[2].toInt32();
        const input_msg_length = args[4].toInt32();
        const input_msg = args[3].readUtf16String(input_msg_length / 2);
        const input_channel = args[7].toInt32();
        const player: GPlayer = gsManager.allPlayer.get(input_player_id);
        console.log(`player_id:${input_player_id} msg:${input_msg} channel:${input_channel}`,);
        if (input_channel == 1) {
            if (input_msg!!.startsWith("give ")) {
                const data = input_msg!!.split(" ")
                const itemId = parseInt(data[1]);
                const count = parseInt(data[2]);
                player.DeliverItem(itemId, count, 0)
                console.log("发了吗")
                return;
            }
        }
    },
});


console.log(`已挂载到进程：${Process.id}`);
