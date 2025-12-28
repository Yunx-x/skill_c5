import {BaseManager} from "../base/BaseManager";
import {HookFuncCore} from "../base/HookFuncCore";
import {star1Boss} from "../configs";
import {randomInt} from "../base/ConstFunc";


const drop_list_1 = [
    "340001=2-5",//一星灵珠
    "360111=1-2",//月德（5）
    "360084=1-2",//姚黄（5）
    "360079=1-2",//高级珠子5
    "70322=1",//铁玉10级
    "360058=1-2",//上古首饰材料包
    "360065=1-2",//荧惑星辰5
]

const drop_list_2 = [
    "340002=2-5",//二星灵珠
    "360070=1-2",//月德（10）
    "360085=1-2",//姚黄（姚黄10）
    "360080=1-2",//高级珠子10
    "74673=1",//铁玉11级
    "360056=1-2",//上古首饰材料包
    "360066=1-2",//荧惑星辰5
    "86020=1",//混元天符
]

const drop_list_3 = [
    "340003=2-5",//三星灵珠
    "360070=3-5",//月德（10）
    "360085=3-5",//姚黄10
    "360080=3-5",//高级珠子10
    "79921=1",//铁玉12级
    "360057=1-2",//邃古首饰材料包
    "360067=1-2",//重华星辰5
    "86020=2-3",//混元天符
]

const drop_list_4 = [
    "340004=2-5",//四星灵珠
    "360112=3-5",//月德20
    "360113=3-5",//姚黄20
    "360114=3-5",//高级珠子20
    "71567=1",//铁玉13级
    "360110=1-2",//劫渊首饰材料包1
    "360068=1-2",//重华星辰10
    "86020=4-5",//混元天符
]

const drop_list_5 = [
    "340005=2-5",//五星灵珠
    "360071=6-8",//月德30
    "360086=6-8",//姚黄30
    "360081=6-8",//高级珠子30
    "54908=1",//铁玉14级
    "360069=1-2",//重华星辰20
    "360088=1-2",//冲天石5
    "86020=6-8",//混元天符
]

const drop_list_6 = [
    "340006=2-5",//六星灵珠
    "360072=6-8",//月德50
    "360087=6-8",//姚黄50
    "360082=6-8",//高级珠子50
    "330008=1",//铁玉15级
    "67361=1",//菩提子
    "340020=1",//法宝凭证
    "360089=1-3",//冲天石10
    "360100=1",//彰武碎片5
    "102219=1",//天道血魂
    "360102=1",//混元天符10
]

const drop_list_w = [
    "340006=5-8",//六星灵珠
    "360075=5",//月德200
    "360115=5",//姚黄100
    "330009=1",//铁玉16级
    "93069=1",//观心碧玺
    "360089=5",//冲天石10
    "360100=2",//彰武碎片5
    "102219=1",//天道血魂
    "360102=1",//混元天符10
    "340055=1",//月神幻灵石（体验1天）
    "375015=2",//至圣符宝匣（高级）
]

/**
 * 六星Boss额外随机两张至圣符
 */
const extra_list_6 = [
    "42894=2",
    "42895=2",
    "42896=2",
    "42897=2",
    "42898=2",
    "42900=2",
    "42901=2",
    "42902=2",
    "42903=2",
    "42904=2",
    "42905=2",
    "42906=2",
    "42907=2",
    "111552=2",
    "111553=2",
]

/**
 * 周晚八点Boss额外随机一个混虚玉
 */
const extra_list_w = [
    "510101=1",
    "510102=1",
    "510103=1",
    "510104=1",
]

/**
 * 掉落管理器
 *
 */
export class DropManager extends BaseManager {


    dropCalc(item_table: string[], dropList: NativePointer, maxSize): number {
        let dropCount = 0

        //模拟倍率
        for (let i = 0; i < 1; i++) {
            for (let i = 0; i < item_table.length; i++) {
                const dropData = item_table[i].split("=")
                const itemId = parseInt(dropData[0])
                const countData = dropData[1].split('-')
                let count = 0
                if (countData.length > 1) {
                    count = randomInt(parseInt(countData[0]), parseInt(countData[1]))
                } else {
                    count = parseInt(countData[0])
                }

                for (let j = 0; j < count; j++) {
                    dropList.add(4 * dropCount).writeInt(itemId)
                    console.log("掉落：", itemId)
                    dropCount++

                    if (dropCount >= maxSize) {
                        break
                    }
                }

                if (dropCount >= maxSize) {
                    break
                }
            }
        }

        console.log("共计掉落", dropCount)
        return dropCount
    }

    attach() {
        // gnpc_imp::DropItemFromData(gnpc_imp *this, const XID *, int, int, int, gmatrix *, int)
        //gnpc_imp::DropItemFromData(const XID & owner, int owner_level, int team_id,int team_seq, int wallow_level)
        // const address = HookFuncCore.getFuncAddress("_ZN8gnpc_imp16DropItemFromDataERK3XIDiiiii")
        // Interceptor.replace(address,
        //     new NativeCallback((gnpc_imp, owner, owner_level, team_id,
        //                         team_seq, wallow_level, troupe) => {
        //         const npc = new GNpcImp(gnpc_imp);
        //         const npcId = npc.GetNPCID();
        //
        //         let drop_list = []
        //         if (star1Boss.includes(npcId)) {
        //             for (let i = 0; i < drop_list_1.length; i++) {
        //                 const dropData = drop_list_1[i].split("=")
        //                 const itemId = parseInt(dropData[0])
        //                 const countData = dropData[1].split('-')
        //                 let count = 0
        //                 if (countData.length > 1) {
        //                     count = randomInt(parseInt(countData[0]), parseInt(countData[1]))
        //                 } else {
        //                     count = parseInt(countData[0])
        //                 }
        //
        //                 for (let j = 0; j < count; j++) {
        //                     drop_list.push(itemId)
        //                 }
        //             }
        //
        //             const oi = npc.GetObjectInterface()
        //             const world = npc.pointer.add(4).readPointer()
        //             const pos = getPos(oi)
        //             let x = pos.add(0).readFloat()
        //             let y = pos.add(8).readFloat()
        //             for (let j = 0; j < drop_list.length; j++) {
        //                 const posData = randomPointInSquare(x, y, 6)
        //                 pos.add(0).writeFloat(posData[0])
        //                 pos.add(8).writeFloat(posData[1])
        //
        //                 const itemId = drop_list[j]
        //                 const item_data = dataMan.generateItem(itemId, 2)
        //                 try {
        //                     item_data.add(4).writeU32(1)
        //                     dropItemDataFunc(world, pos, item_data, owner, team_id, team_seq, 0, 0, 0, -1, -1)
        //                     console.log("掉落物品：", itemId,)
        //                 } catch (e) {
        //                     console.log("掉落物品异常：", itemId)
        //                 }
        //             }
        //         } else {
        //             const origin = HookFuncCore.getNativeFunc("_ZN8gnpc_imp16DropItemFromDataERK3XIDiiiii",
        //                 "void", ["pointer", "pointer", "int32", "int32", "int32", "int32", "int32"]);
        //
        //             origin(gnpc_imp, owner, owner_level, team_id, team_seq, wallow_level, troupe);
        //         }
        //     }, "void", ["pointer", "pointer", "int32", "int32", "int32", "int32", "int32"]));

        //itemdataman::generate_item_from_monster(itemdataman *this, unsigned int, int *, unsigned int)
        const address = HookFuncCore.getFuncAddress("_ZN11itemdataman26generate_item_from_monsterEjPij")
        Interceptor.replace(address,
            new NativeCallback((itemdataman, npcId, list, maxSize) => {
                if (star1Boss.includes(npcId)) {
                    // let dropCount = 0
                    //
                    //
                    // for (let i = 0; i < drop_list_1.length; i++) {
                    //     const dropData = drop_list_1[i].split("=")
                    //     const itemId = parseInt(dropData[0])
                    //     const countData = dropData[1].split('-')
                    //     let count = 0
                    //     if (countData.length > 1) {
                    //         count = randomInt(parseInt(countData[0]), parseInt(countData[1]))
                    //     } else {
                    //         count = parseInt(countData[0])
                    //     }
                    //
                    //     for (let j = 0; j < count; j++) {
                    //         list.add(4 * dropCount).writeInt(itemId)
                    //         console.log("掉落：", itemId)
                    //         dropCount++
                    //
                    //         if (dropCount >= maxSize) {
                    //             break
                    //         }
                    //     }
                    //
                    //     if (dropCount >= maxSize) {
                    //         break
                    //     }
                    // }
                    return this.dropCalc(drop_list_1, list, maxSize)
                } else {
                    const origin = HookFuncCore.getNativeFunc("_ZN11itemdataman26generate_item_from_monsterEjPij",
                        "int32", ["pointer", "int32", "pointer", "int32"]);
                    return origin(itemdataman, npcId, list, maxSize);
                }
            }, "int32", ["pointer", "int32", "pointer", "int32"]));

    }

}

export const dropManager = new DropManager();

// const dataManFunc = HookFuncCore.getNativeFuncForAddress(
//     // "_ZN7gmatrix10GetDataManEv",
//     ptr("0x8078596"),
//     "pointer",
//     [],
// );
//
// export const dataMan = dataManFunc()

//(itemdataman *const this, unsigned int id, const void *tag, size_t tag_size, int name_id)

function getPos(oi: NativePointer) {
    const fc = HookFuncCore.getNativeFunc(
        "_ZN16object_interface6GetPosEv",
        // ptr("0x81C0F38"),
        "pointer",
        ["pointer"],
    );
    return fc(oi);
}

function randomPointInSquare(cx, cy, size) {
    const half = size / 2;

    const x = cx + (Math.random() * size - half);
    const y = cy + (Math.random() * size - half);

    return [x, y];
}

//DropItemData(world *pPlane, const A3DVECTOR *const pos, item_data *data, const XID *const owner, int owner_team, int seq, int name_id, char battle_faction)
export const dropItemDataFunc = HookFuncCore.getNativeFunc(
    "_Z12DropItemDataP5worldRK9A3DVECTORP9item_dataRK3XIDiiicbii",
    "void", ["pointer", "pointer", "pointer", "pointer", "int32", "int32", "int32", "char", "int32", "int32", "int32"])

// export function dropItem() {
//     const address = ptr("0x80FA1E8")
//     //(gnpc_imp *const this, const XID *const owner, int owner_level, int team_id, int team_seq, int wallow_level)
//
//     Interceptor.replace(
//         address,
//         new NativeCallback(
//             (gnpc_imp, owner, owner_level, team_id, team_seq, wallow_level) => {
//                 const originFunc = HookFuncCore.getNativeFuncForAddress(address, "void",
//                     ["pointer", "pointer", "int32", "int32", "int32", "int32"]);
//
//                 originFunc(gnpc_imp, owner, owner_level, team_id, team_seq, wallow_level)
//
//                 const npc = new GNPC(gnpc_imp)
//                 const id = npc.GetNPCID()
//                 for (let i = 1; i <= 10; i++) {
//                     if ("table" + i in dropTableConf) {
//                         const dropTable = dropTableConf["table" + i]
//                         const mob_list = dropTable.mob_list
//                         if (mob_list.indexOf(id) > -1) {
//                             const item_table = dropTable.item_table
//                             const oi = npc.GetObjectInterface()
//                             const world = npc.pointer.add(4).readPointer()
//                             const pos = getPos(oi)
//                             let x = pos.add(0).readFloat()
//                             let y = pos.add(8).readFloat()
//                             for (let k = 0; k < item_table.length; k++) {
//                                 const drop = item_table[k].split("=")
//                                 const itemId = parseInt(drop[0])
//                                 const count = parseInt(drop[1])
//                                 for (let j = 0; j < count; j++) {
//                                     const posData = randomPointInSquare(x, y, 6)
//                                     pos.add(0).writeFloat(posData[0])
//                                     pos.add(8).writeFloat(posData[1])
//
//                                     const item_data = generateItem(itemId)
//                                     try {
//                                         item_data.add(4).writeU32(1)
//                                         dropItemDataFunc(world, pos, item_data, owner, team_id, team_seq, 0, 0)
//                                         console.log("掉落物品：", itemId,)
//                                     } catch (e) {
//                                         console.log("掉落物品异常：", itemId)
//                                     }
//                                 }
//                             }
//
//                             break
//                         }
//                     }
//                 }
//             },
//             "void",
//             ["pointer", "pointer", "int32", "int32", "int32", "int32"]
//         ),
//     );
// }

