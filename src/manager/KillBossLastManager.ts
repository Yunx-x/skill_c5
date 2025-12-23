import {BaseManager} from "../base/BaseManager";
import {HookFuncCore} from "../base/HookFuncCore";
import {GNpcImp} from "../base/gs/GNpcImp";
import {GPlayer} from "../base/gs/GPlayer";
import {gsManager} from "./GsManager";


type Owner = { type: number; id: number; };

// export const lastBossList = [
//     400002,//万霆
//     400003,//川壅
//     400005//月神
// ]
//
// export const bossNameMap = {
//     400002: "万霆",
//     400003: "川壅",
//     400005: "月神·望舒"
// }

export class KillBossLastManager extends BaseManager {
    allNPCMap = new Map<number, Owner>()

    attach() {
        //(gnpc_imp *const this, const XID *const attacker, bool is_invader, bool no_drop, bool is_hostile_duel, int time)
        Interceptor.attach(HookFuncCore.getFuncAddress("_ZN8gnpc_imp7OnDeathERK3XIDbbbi"),
            {
                onEnter(args) {
                    const npc = new GNpcImp(args[0]);
                    if (npc.IsBoss()) {
                        const attacker = args[1]
                        const type = attacker.readInt()
                        if (type == 1) {
                            const id = attacker.add(4).readInt()
                            const npcId = npc.GetNPCID()

                            killBossLastManager.allNPCMap.set(npcId, {type, id})
                        }
                    }
                },
            },
        );

        // gnpc_imp::DropItem(gnpc_imp *this, XID *, int, int, int, anti_wallow *, int, XID)
        const dropItemFunc = HookFuncCore.getNativeFunc("_ZN8gnpc_imp8DropItemERK3XIDiiiiiS0_",
            "void", ["pointer", "pointer", "int32", "int32", "int32", "int32", "int32", "pointer"]);

        //gnpc_imp::DispatchExp(
        // gnpc_imp *const this, XID *const owner, int *const team_id,
        // int *const team_seq, int *const level, XID *const task_owner,
        // int *const wallow_level, int *const troupe_id, int *const troupe_leader)

        // gnpc_imp::DispatchExp(gnpc_imp *this, XID *, int *, int *, int *, XID *, int *, int *, int *)
        const address = HookFuncCore.getFuncAddress("_ZN8gnpc_imp11DispatchExpER3XIDRiS2_S2_S1_S2_S2_S2_")
        Interceptor.replace(address,
            new NativeCallback((gnpc_imp, owner, team_id, team_seq,
                                level, task_owner, wallow_level,
                                troupe_id, troupe_leader) => {
                // const origin = HookFuncCore.getNativeFunc("_ZN8gnpc_imp11DispatchExpER3XIDRiS2_S2_S1_S2_S2_S2_",
                //     "void", ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer"]);
                // origin(gnpc_imp, owner, team_id, team_seq, level, task_owner, wallow_level, troupe_id, troupe_leader);

                const npc = new GNpcImp(gnpc_imp);
                const npcId = npc.GetNPCID();
                if (killBossLastManager.allNPCMap.has(npcId)) {
                    const lastOwner = killBossLastManager.allNPCMap.get(npcId)
                    const player: GPlayer = gsManager.allPlayer.get(lastOwner.id)
                    const realOwner = Memory.alloc(8)
                    realOwner.writeInt(lastOwner.type)
                    realOwner.add(4).writeInt(lastOwner.id)

                    const rTeamId = player.GetTeamID()
                    const rTeamSeq = player.GetTeamSeq()
                    const rlv = player.pointer.add(752).readU16()
                    const rwlv = player.pointer.add(6737).readInt()
                    const rtroupe_id = player.GetTroupeID()
                    const rtroupe_leader = player.GetTroupeLeader()

                    owner.writeInt(lastOwner.type)
                    owner.add(4).writeInt(lastOwner.id)

                    task_owner.writeInt(lastOwner.type)
                    task_owner.add(4).writeInt(lastOwner.id)

                    team_id.writeInt(rTeamId)
                    team_seq.writeInt(rTeamSeq)
                    level.writeInt(rlv)
                    wallow_level.writeInt(rwlv)
                    troupe_id.writeInt(rtroupe_id)
                    troupe_leader.writeInt(rtroupe_leader)

                    // dropItemFunc(gnpc_imp, realOwner, rlv, rTeamId, rTeamSeq, rwlv, rtroupe_leader, realOwner)

                    // killBossLastManager.broadcastMsg(player, npcId)
                    // console.log(gnpc_imp, realOwner, rlv, rTeamId, rTeamSeq, rwlv, rtroupe_leader)
                }
            }, "void", ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer"]));
    }

    broadcastMsg(gplayer: GPlayer, npcId) {
        // const bossName = bossNameMap[npcId]
        //
        // const pos = gplayer.GetPos()
        // const tag = gplayer.getWorldTag()
        //
        // const user = `&location(${gplayer.getPlayerName()},${pos[0]},${pos[1]},${pos[2]},${tag})&`
        // const boss = `&location(${bossName},${pos[0]},${pos[1]},${pos[2]},${tag})&`
        //
        // const msg = `群雄环视，刀光电闪，${user} 一剑封喉，${boss} 轰然倒地，散落满地财宝！`
        //
        // const originFunc = HookFuncCore.getNativeFunc("_Z18broadcast_chat_msgiPKvjccS0_j",
        //     'bool', ['int32', 'pointer', 'int32', 'int32', 'char', 'int32', 'int32'])
        //
        // const cStringPointer = Memory.allocUtf16String(msg);
        // return originFunc(0, cStringPointer, msg.length * 2, 1, 0, 0, 0)
    }

}

export const killBossLastManager = new KillBossLastManager();
