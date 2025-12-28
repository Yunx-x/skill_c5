import {BaseManager} from "../base/BaseManager";
import {HookFuncCore} from "../base/HookFuncCore";
import {GPlayer} from "../base/gs/GPlayer";
import {badStr, beltStone, ok10UpgradeItem} from "../configs";
import {dataMan} from "../main";
import {ItemBody} from "../base/gs/ItemBody";
import {EquipItem} from "../base/gs/EquipItem";
import {EquipEssenceNew} from "../base/gs/data/equip_essence_new";
import {GNpcImp} from "../base/gs/GNpcImp";
import {XID} from "../base/gs/XID";

class GsManager extends BaseManager {
    allPlayer = new Map<number, any>();

    attach() {
        this.attachHeart();
        this.addRuneScore(10000);
        this.attachMsg();
        this.clearAd();
        this.multiStoneReinforceSupport();
        this.fanZha();
        this.mysticStoneEmbed();
        this.ok10Upgrade();
    }

    /**
     * 监听玩家心跳
     */
    private attachHeart() {
        Interceptor.attach(
            HookFuncCore.getFuncAddress("_ZN11gplayer_imp11OnHeartbeatEj"),
            {
                onEnter(args) {
                    const player = new GPlayer(args[0]);
                    gsManager.allPlayer.set(player.getPlayerID(), player);
                },
            },
        );
    }

    /**
     * 元婴单次归劫道胎值
     */
    private addRuneScore(scoreChange) {
        const name = "_ZN11gplayer_imp12AddRuneScoreEi";

        const address = HookFuncCore.getFuncAddress(name);
        Interceptor.replace(
            address,
            new NativeCallback(
                (item: NativePointer, _score: number) => {
                    const originFunc = HookFuncCore.getNativeFunc(name, "int32", [
                        "pointer",
                        "int32",
                    ]);
                    return originFunc(item, scoreChange);
                },
                "int32",
                ["pointer", "int32"],
            ),
        );
    }

    /**
     * 炼器失败返还
     */
    ReinforceEquipment() {
        const funcName =
            "_ZNK10equip_item18ReinforceEquipmentEP4itemP11gactive_impiPKfRiS6_S6_biS5_";
        const address = HookFuncCore.getFuncAddress(funcName);
        Interceptor.replace(
            address,
            new NativeCallback(
                (
                    equip_item: NativePointer,
                    item: NativePointer,
                    playerIndex: NativePointer,
                    itemId,
                    a,
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                ) => {
                    const originFunc = HookFuncCore.getNativeFunc(funcName, "int32", [
                        "pointer",
                        "pointer",
                        "pointer",
                        "int32",
                        "float",
                        "int32",
                        "int32",
                        "int32",
                        "int32",
                        "int32",
                        "float",
                    ]);
                    const result = originFunc(
                        equip_item,
                        item,
                        playerIndex,
                        itemId,
                        a,
                        a1,
                        a2,
                        a3,
                        a4,
                        a5,
                        a6,
                    );

                    if (result === 4) {
                        const player = new GPlayer(playerIndex);
                        player.tryDeliverItem(item.readInt(), 1, 1);
                    }

                    return result;
                },
                "int32",
                [
                    "pointer",
                    "pointer",
                    "pointer",
                    "int32",
                    "float",
                    "int32",
                    "int32",
                    "int32",
                    "int32",
                    "int32",
                    "float",
                ],
            ),
        );
    }

    private attachMsg() {
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
                console.error(
                    `player_id:${input_player_id} msg:${input_msg} channel:${input_channel}`,
                );
                if (player !== undefined) {
                    if (input_msg.indexOf("11") !== -1) {
                        player.pointer.add(5 * 4).add(0x5C).readInt()
                        return;
                    }

                    // if (input_msg.indexOf("1") !== -1) {
                    //     player.tryDeliverItem(340009, 1, 100)
                    //     player.tryDeliverItem(340010,  1, 100)
                    //     player.tryDeliverItem(340011,  1, 100)
                    //     player.tryDeliverItem(340012,  1, 100)
                    //     player.tryDeliverItem(340013,  1, 100)
                    //     player.tryDeliverItem(340003,  1, 100)
                    //     player.tryDeliverItem(340014,  1, 100)
                    //     return;
                    // }
                    //
                    // if (input_msg.indexOf("受命于天，既寿永昌") !== -1 && player.countItemById(300023) > 0) {
                    //     player.setLuckInfo(600000000)
                    //     return;
                    // }

                    // debugManager.parseMsg(player, input_msg, input_channel)
                }
            },
        });
    }

    private clearAd() {
        const address = HookFuncCore.getFuncAddress(
            "_Z16handle_user_chatiiiPKvjS0_jci",
        );
        Interceptor.replace(
            address,
            new NativeCallback(
                (a1, a2, a3, a4, input_msg_length, a6, a7, a8, a9) => {
                    const originFunc = HookFuncCore.getNativeFunc(
                        "_Z16handle_user_chatiiiPKvjS0_jci",
                        "void",
                        [
                            "int32",
                            "int32",
                            "pointer",
                            "pointer",
                            "int32",
                            "pointer",
                            "int32",
                            "char",
                            "int32",
                        ],
                    );

                    if (a8 === 1) {
                        //世界
                        const input_msg = a4.readUtf16String(input_msg_length / 2);
                        let result = 0;
                        for (let i = 0; i < badStr.length; i++) {
                            const c = badStr[i];
                            if (input_msg.indexOf(c) !== -1) {
                                result = 1;
                                return;
                            }
                        }

                        if (result === 1) {
                            return null;
                        }
                        return originFunc(a1, a2, a3, a4, input_msg_length, a6, a7, a8, a9);
                    }
                    return originFunc(a1, a2, a3, a4, input_msg_length, a6, a7, a8, a9);
                },
                "void",
                [
                    "int32",
                    "int32",
                    "pointer",
                    "pointer",
                    "int32",
                    "pointer",
                    "int32",
                    "char",
                    "int32",
                ],
            ),
        );
    }

    private fanZha() {
        Interceptor.attach(HookFuncCore.getFuncAddress("_ZN13player_troupeD1Ev"), {
            onEnter(_args) {
                try {
                    this.backtrace = Thread.backtrace(this.context, Backtracer.ACCURATE)
                        .map(DebugSymbol.fromAddress)
                        .join("\n");
                    console.log(`Backtrace:\n${this.backtrace}`);
                } catch (e) {
                    console.log(`Exception caught: ${e.message}`);
                }
            },
        });
    }

    private mysticStoneEmbed() {
        const fcName = "_ZN11gplayer_imp16MysticStoneEmbedEjijii";
        const fcAddress = HookFuncCore.getFuncAddress(fcName);
        //gplayer_imp *this, unsigned int a2, int a3, unsigned int a4, int a5
        Interceptor.replace(
            fcAddress,
            new NativeCallback(
                (gplayer, equip_index, equip_id, stone_index, stone_id) => {
                    const originFunc = HookFuncCore.getNativeFunc(fcName, "int32", [
                        "pointer",
                        "int32",
                        "int32",
                        "int32",
                        "int32",
                    ]);
                    console.log(equip_index, equip_id, stone_index, stone_id);
                    //el中装备数据
                    const equipDataLen = Memory.alloc(4);
                    const equip_data: NativePointer = dataMan.get_data_ptr(
                        equip_id,
                        equipDataLen,
                    );
                    //el中石头数据
                    const stoneDataLen = Memory.alloc(4);
                    const stone_data: NativePointer = dataMan.get_data_ptr(
                        stone_id,
                        stoneDataLen,
                    );

                    if (stoneDataLen.readInt() === 288) {
                        //id4，大类4，小类4，名称64，装备类别4，-->装备部位4
                        const equipBw = equip_data.add(80).readInt();
                        //id4，名称64，掉落模型4，图标4，-->部位4
                        const stoneBw = stone_data.add(76).readInt();
                        console.log("镶嵌部位", equipBw, stoneBw);
                        if ((stoneBw & equipBw) === equipBw) {
                            // if (equipBw === stoneBw) {
                            return originFunc(
                                gplayer,
                                equip_index,
                                equip_id,
                                stone_index,
                                stone_id,
                            );
                        }
                    }

                    return 0;
                },
                "int32",
                ["pointer", "int32", "int32", "int32", "int32"],
            ),
        );
    }

    private noLossUpgradeEquip() {
        const funcName = "_ZN11gplayer_imp16UpgradeEquipmentEjiji"
        const funcAddress = HookFuncCore.getFuncAddress(funcName);

        const getEquipUpgradeOutputIDFunc = HookFuncCore.getNativeFunc(
            "_ZN15player_template23GetEquipUpgradeOutputIDEi", "int32", ["int32"]
        );

        Interceptor.replace(funcAddress,
            new NativeCallback((gplayer: NativePointer, equip_inv_index, equip_id,
                                cailiao_inv_index, tianjing_inv_index) => {
                    const originFunc = HookFuncCore.getNativeFunc(funcName,
                        'int32', ['pointer', 'int32', 'int32', 'int32', 'int32',])
                    console.log("装备升级", equip_inv_index, equip_id, cailiao_inv_index, tianjing_inv_index)
                    let originResult = originFunc(gplayer, equip_inv_index, equip_id, cailiao_inv_index, tianjing_inv_index)
                    if (originResult != 1) {
                        console.log("额外装备升级功能：", equip_inv_index, equip_id, cailiao_inv_index, tianjing_inv_index)
                        if (tianjing_inv_index == -1) {
                            return 0
                        }

                        const player = new GPlayer(gplayer)

                        const equipItem = player.getInventory().GetItem(equip_inv_index)
                        const moJuItem = player.getInventory().GetItem(cailiao_inv_index)
                        const baoJiItem = player.getInventory().GetItem(tianjing_inv_index)

                        const mojuId = moJuItem.GetType()
                        const baojiId = baoJiItem.GetType()

                        //|| player.countItemById(baojiId) <= 0
                        if (player.countItemById(mojuId) <= 0) {
                            console.log("异常：模具物品个数为0")
                            return 0
                        }

                        const output_id = getEquipUpgradeOutputIDFunc(equip_id)
                        if (output_id <= 0) {
                            console.log("异常：输出装备id小于等于0")
                            return
                        }

                        equipItem.pointer.writeInt(output_id)

                        const item_data = Memory.alloc(50)
                        const code = player.getInventory().GetItemData(equip_inv_index, item_data)
                        if (code <= 0) {
                            console.log("异常：获取背包装备数据为空")
                            return 0
                        }

                        const r2 = player.ObtainItem(item_data, 0, 0)

                        equipItem.pointer.writeInt(equip_id)

                        //装备消失
                        player.TakeOutItem(equip_inv_index, equip_id, 1)

                        //模具消失
                        player.TakeOutItem(cailiao_inv_index, mojuId, 1)

                        //保留符消失
                        player.TakeOutItem(tianjing_inv_index, baojiId, 1)

                        console.log("升级结果：", r2)
                        return 1
                        // }
                    }

                    return originFunc(gplayer, equip_inv_index, equip_id, cailiao_inv_index, tianjing_inv_index)
                }, 'int32', ['pointer', 'int32', 'int32', 'int32', 'int32']
            ));

    }

    /**
     * 一个部位支持多种强化石头功能
     */
    private multiStoneReinforceSupport() {
        const name = "_ZN23reinforce_stone_essence14CheckConditionEPK9item_bodyPK10equip_itemR17equip_essence_newP11gactive_imp";
        //(item_body *a1, equip_item *a2)
        const address = HookFuncCore.getFuncAddress(name);
        Interceptor.replace(
            address,
            new NativeCallback(
                (item_body, equip_item) => {
                    const itemBody = new ItemBody(item_body)
                    const equipItem = new EquipItem(equip_item)

                    const stoneId = itemBody.GetTID()
                    const equipMask = equipItem.GetEquipMask()

                    //仅限腰带
                    if (equipMask == 16777216 && beltStone.indexOf(stoneId) != -1) {
                        return 1
                    } else {
                        const originFunc = HookFuncCore.getNativeFunc(name, "int32",
                            ["pointer", "pointer"]);
                        return originFunc(item_body, equip_item)
                    }
                },
                "int32",
                ["pointer", "pointer"]
            ),
        );

        // const name2 = "_ZN23reinforce_stone_essence13MakeAddonDataER10addon_dataRK17equip_essence_newPK10equip_item";
        // //(int a1, _DWORD *a2, int a3, equip_item *a4)
        // //(addon_data &data, const  equip_essence_new & value, const equip_item * item)
        // const address2 = HookFuncCore.getFuncAddress(name2);
        // Interceptor.replace(
        //     address2,
        //     new NativeCallback(
        //         (reinforce_stone_essence, addon_data, equip_essence_new, equip_item) => {
        //             const originFunc = HookFuncCore.getNativeFunc(name2, "pointer",
        //                 ["pointer", "pointer", "pointer", "pointer"]);
        //             originFunc(reinforce_stone_essence, addon_data, equip_essence_new, equip_item)
        //
        //             const equipItem = new EquipItem(equip_item)
        //             if (equipItem.GetEquipMask() == 16777216) {//腰带
        //                 const addType = addon_data.readInt()
        //                 if (addType == 3 || addType == 4) {
        //                     const v = addon_data.add(4).readInt()
        //                     addon_data.add(4).writeInt(Math.floor(v / 10))
        //                 }
        //             }
        //
        //             return addon_data
        //         },
        //         "pointer",
        //         ["pointer", "pointer", "pointer", "pointer"]
        //     ),
        // );
    }

    /**
     * 蕴灵保底
     */
    private mysticUpgrade() {
        const postReinforceFunc = HookFuncCore.getNativeFunc("_ZN23reinforce_stone_essence13PostReinforceEPK10equip_itemR17equip_essence_newi",
            "int32",
            ["pointer", "pointer", "pointer"]
        )

        const name = "_ZNK23item_reinforce_templateI23reinforce_stone_essenceLi203EE11DoReinforceEPK10equip_itemR17equip_essence_newP11gactive_impPKfRiSB_SB_biSA_b";
        const address = HookFuncCore.getFuncAddress(name);
        //; int __cdecl item_reinforce_template<reinforce_stone_essence,203>::DoReinforce(item_body *, equip_item *,
        // int, reinforce_stone_essence *, float *, int *, int *, int *, char, int, int, char)
        Interceptor.replace(
            address,
            new NativeCallback(
                (item_body, equip_item, equip_essence_new, reinforce_stone_essence,
                 a5, a6, a7, a8,
                 a9, a10, a11, a12) => {
                    // console.log(equip_item, equip_essence_new, a5.readFloat(),
                    //     a6.readInt(), a7.readInt(), a8.readInt(), a9, a10, a11, a12)

                    const essence = new EquipEssenceNew(equip_essence_new)
                    const level_before = essence.GetLevel()
                    const luckValue_before = essence.GetLuckValue();
                    console.log("旧数据", level_before, luckValue_before)
                    const originFunc = HookFuncCore.getNativeFunc(name, "int32",
                        ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "int32", "int32", "int32", "int32"]);
                    const result = originFunc(item_body, equip_item, equip_essence_new, reinforce_stone_essence, a5, a6, a7, a8, a9, a10, a11, a12)
                    console.log("第一次蕴灵结果", result)
                    if (result != 0) {
                        const level_result = essence.GetLevel()
                        // const luckValue_result = essence.GetLuckValue();
                        // console.log("第一次蕴灵后数据", level_result, luckValue_result)
                        // console.log("调整数据，手动返回")
                        if (level_before == level_result) {
                            // 13  400手保底必成
                            // 14  500手保底必成
                            // 15  600手保底必成
                            // 16  800手保底必成
                            // 17  1000手保底必成

                            if (level_before == 12 && luckValue_before < 10) {
                                return result
                            }

                            if (level_before == 13 && luckValue_before < 10) {
                                return result
                            }

                            if (level_before == 14 && luckValue_before < 10) {
                                return result
                            }

                            if (level_before == 15 && luckValue_before < 10) {
                                return result
                            }

                            if (level_before == 16 && luckValue_before < 10) {
                                return result
                            }

                            equip_essence_new.add(8).writeShort(level_before + 1)
                            a6.writeInt(level_before + 1)
                            postReinforceFunc(equip_item, equip_essence_new, a8)
                            return 0//0-炼器成功
                        }
                        return result
                    }

                    return result
                },
                "int32",
                ["pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "pointer", "int32", "int32", "int32", "int32"]
            ),
        );
    }

    private fixDropZeroBug() {
        //不清楚什么原因，目前看是好的
        const name = "_ZN8gnpc_imp7OnDeathERK3XIDbbbi";
        //(const XID & attacker,bool is_invader, bool no_drop, bool is_hostile_duel, int time )
        const address = HookFuncCore.getFuncAddress(name);
        Interceptor.replace(
            address,
            new NativeCallback(
                (npc, attacker, is_invader, no_drop, is_hostile_duel, time) => {
                    console.log("OnDeath", attacker, is_invader, no_drop, is_hostile_duel, time)
                    const npcImp = new GNpcImp(npc)
                    console.log(npcImp.GetNPCID(), npcImp.IsZombie())

                    const originFunc = HookFuncCore.getNativeFunc(name, "void",
                        ["pointer", "pointer", "bool", "bool", "bool", "int32"]);
                    return originFunc(npc, attacker, is_invader, no_drop, is_hostile_duel, time)
                },
                "void",
                ["pointer", "pointer", "bool", "bool", "bool", "int32"]
            ),
        );

        const name2 = "_ZN8gnpc_imp8DropItemERK3XIDiiiiiS0_";
        //gnpc_imp *this, XID *a2, int a3, int a4, int a5, anti_wallow *a6, int a7, XID a8
        const address2 = HookFuncCore.getFuncAddress(name2);
        Interceptor.replace(
            address2,
            new NativeCallback(
                (npc, a2, a3, a4, a5, a6, a7, a8) => {
                    console.log("DropItem执行了")
                    const originFunc = HookFuncCore.getNativeFunc(name2, "void",
                        ["pointer", "pointer", "int32", "int32", "int32", "pointer", "int32", "pointer"]);

                    // for (let i = 0; i < 1000; i++) {
                    //     originFunc(npc, a2, a3, a4, a5, a6, a7, a8)
                    // }

                    return originFunc(npc, a2, a3, a4, a5, a6, a7, a8)
                },
                "void",
                ["pointer", "pointer", "int32", "int32", "int32", "pointer", "int32", "pointer"]
            ),
        );

        const address3 = HookFuncCore.getFuncAddress("_ZN11itemdataman26generate_item_from_monsterEjPij");
        Interceptor.attach(address3, {
            onEnter(args) {

            },
            onLeave(retval) {
                console.log("generate_item_from_monster", retval)
            }
        })

        const testFunc = HookFuncCore.getNativeFunc("_ZNK5abase8hash_mapI3XIDN8gnpc_imp10hurt_entryE12XID_HashFuncNS_10fast_allocILi4ELi128EEEE4sizeEv", "int32", ["pointer"])

        var testOwner: NativePointer = null
        const dispatchExp = HookFuncCore.getFuncAddress("_ZN8gnpc_imp11DispatchExpER3XIDRiS2_S2_S1_S2_S2_S2_");
        Interceptor.attach(dispatchExp, {
            onEnter(args) {
                testOwner = args[1]
                const size = testFunc(args[0].add(1964))
                console.log("伤害表", size)
            },
            onLeave() {
                const xid = new XID(testOwner)
                console.log(xid.getType(), xid.getID())
            }
        })
    }

    private sendBroadcastMsg(msg: string, channel: number) {
        const originFunc = HookFuncCore.getNativeFunc("_Z18broadcast_chat_msgiPKvjccS0_j",
            'bool', ['int32', 'pointer', 'int32', 'int32', 'char', 'int32', 'int32'])
        const cStringPointer = Memory.allocUtf16String(msg);
        return originFunc(0, cStringPointer, msg.length * 2, channel, 0, 0, 0)
    }


    private ok10Upgrade() {
        //(gplayer_imp *this, unsigned int, int, unsigned int)
        const funcName = "_ZN11gplayer_imp22UpgradeMysticEquipmentEjij";
        const address = HookFuncCore.getFuncAddress(funcName);
        Interceptor.replace(
            address,
            new NativeCallback(
                (player, a1, a2, a3) => {
                    const originFunc = HookFuncCore.getNativeFunc(funcName, "int32", ["pointer", "int32", "int32", "int32"]);
                    console.log(a1, a2, a3)

                    const gplayer = new GPlayer(player)
                    if (gplayer.countItemById(ok10UpgradeItem) > 0) {
                        if (gplayer.tryTakeOutItem(ok10UpgradeItem, 1) != 0) {
                            for (let i = 0; i < 10; i++) {
                                originFunc(player, a1, a2, a3);
                            }
                        }
                    }

                    return originFunc(player, a1, a2, a3);
                },
                "int32", ["pointer", "int32", "int32", "int32"]
            ),
        );

    }
}

export const gsManager = new GsManager();
