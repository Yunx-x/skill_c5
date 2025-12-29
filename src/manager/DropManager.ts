import {BaseManager} from "../base/BaseManager";
import {HookFuncCore} from "../base/HookFuncCore";
import {
    siXiang1Boss,
    siXiang2Boss,
    siXiang3Boss,
    siXiang4Boss,
    siXiang5Boss,
    star1Boss,
    star2Boss,
    star3Boss,
    star4Boss,
    star5Boss,
    star6Boss,
    starWeek8Boss
} from "../configs";
import {randomInt, zrand} from "../base/ConstFunc";


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
    "42894",
    "42895",
    "42896",
    "42897",
    "42898",
    "42900",
    "42901",
    "42902",
    "42903",
    "42904",
    "42905",
    "42906",
    "42907",
    "111552",
    "111553",
]

/**
 * 周晚八点Boss额外随机一个混虚玉
 */
const extra_list_w = [
    "510101",
    "510102",
    "510103",
    "510104",
]

interface DropRule {
    dropList: any;
    extraList?: any;
    extraCount: number;
}


/**
 * 掉落管理器
 *
 */
export class DropManager extends BaseManager {
    private bossDropMap = new Map<number, DropRule>();

    dropCalc(item_table: string[], extra_table: string[], extraCount: number, dropList: NativePointer, maxSize: number): number {
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

            if (extra_table != undefined && extra_table.length > 0 && extraCount > 0) {
                for (let j = 0; j < extraCount; j++) {
                    const itemId = parseInt(extra_table[zrand(extra_table.length - 1)])
                    dropList.add(4 * dropCount).writeInt(itemId)
                    console.log("额外掉落：", itemId)
                    dropCount++
                    if (dropCount >= maxSize) {
                        break
                    }
                }
            }
        }

        console.log("共计掉落", dropCount)
        return dropCount
    }

    registerBoss(list: number[], rule: DropRule) {
        for (const id of list) {
            dropManager.bossDropMap.set(id, rule);
        }
    }

    attach() {
        // 星级 boss
        dropManager.registerBoss([...star1Boss, ...siXiang1Boss], {
            dropList: drop_list_1,
            extraCount: 0
        });

        dropManager.registerBoss([...star2Boss, ...siXiang2Boss], {
            dropList: drop_list_2,
            extraCount: 0
        });

        dropManager.registerBoss([...star3Boss, ...siXiang3Boss], {
            dropList: drop_list_3,
            extraCount: 0
        });

        dropManager.registerBoss([...star4Boss, ...siXiang4Boss], {
            dropList: drop_list_4,
            extraCount: 0
        });

        dropManager.registerBoss([...star5Boss, ...siXiang5Boss], {
            dropList: drop_list_5,
            extraCount: 0
        });

        dropManager.registerBoss(star6Boss, {
            dropList: drop_list_6,
            extraList: extra_list_6,
            extraCount: 2
        });

        dropManager.registerBoss(starWeek8Boss, {
            dropList: drop_list_w,
            extraList: extra_list_w,
            extraCount: 1
        });

        //itemdataman::generate_item_from_monster(itemdataman *this, unsigned int, int *, unsigned int)
        const address = HookFuncCore.getFuncAddress("_ZN11itemdataman26generate_item_from_monsterEjPij")
        Interceptor.replace(address,
            new NativeCallback((itemdataman, npcId, list, maxSize) => {
                const rule = dropManager.bossDropMap.get(npcId);
                if (rule) {
                    return dropManager.dropCalc(
                        rule.dropList,
                        rule.extraList,
                        rule.extraCount,
                        list,
                        maxSize
                    );
                }

                const origin = HookFuncCore.getNativeFunc("_ZN11itemdataman26generate_item_from_monsterEjPij",
                    "int32", ["pointer", "int32", "pointer", "int32"]);
                return origin(itemdataman, npcId, list, maxSize);
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

