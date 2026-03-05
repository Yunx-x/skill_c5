import {BaseManager} from "../base/BaseManager";
import {HookFuncCore} from "../base/HookFuncCore";

export const raidList = [
    536,//四象
    598,//青云
    448,//天墟
    546,//十神（高难度的？）
    444,//T10~T12
    528,//云渺
    443,//南土
    548,//八九天劫
]


export class RaidDropManager extends BaseManager {

    GetWorldIsRaid(plane: NativePointer): boolean {
        const getWorldManagerFunc = HookFuncCore.getNativeFunc(
            "_ZN5world15GetWorldManagerEv",
            "pointer",
            ["pointer"],
        );

        const wm: NativePointer = getWorldManagerFunc(plane);
        try {
            const getClientTagFunc = HookFuncCore.getNativeFunc(
                "_ZN18raid_world_manager9GetRaidIDEv",
                "int32",
                ["pointer"],
            );

            const tag = getClientTagFunc(wm)
            const r = raidList.includes(tag)
            console.log("Raid", tag, r)
            return r
        } catch (e) {
            return false
        }
    }

    BindItem(itemData: NativePointer) {
        let proc_type = itemData.add(4 * 3).readInt()
        proc_type |= 146
        itemData.add(4 * 3).writeInt(proc_type)
    }

    attach() {
        ////DropItemData(world *pPlane, const A3DVECTOR *const pos, item_data *data, const XID *const owner, int owner_team, int seq, int name_id, char battle_faction)
        const address = HookFuncCore.getFuncAddress("_Z12DropItemDataP5worldRK9A3DVECTORP9item_dataRK3XIDiiicbii")
        Interceptor.replace(address,
            new NativeCallback((plane, pos, data, owner,
                                owner_team, seq, name_id,
                                battle_faction,
                                a9, a10, a11) => {

                const origin = HookFuncCore.getNativeFunc("_Z12DropItemDataP5worldRK9A3DVECTORP9item_dataRK3XIDiiicbii",
                    "void", ["pointer", "pointer", "pointer", "pointer", "int32", "int32", "int32", "char", "int32", "int32", "int32"]);

                if (this.GetWorldIsRaid(plane)) {
                    this.BindItem(data)
                }

                return origin(plane, pos, data, owner, owner_team, seq, name_id, battle_faction, a9, a10, a11);
            }, "void", ["pointer", "pointer", "pointer", "pointer", "int32", "int32", "int32", "char", "int32", "int32", "int32"]));
    }

}

export const raidDropManager = new RaidDropManager();
