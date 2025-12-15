import {HookFuncCore} from "../HookFuncCore";
import {GActiveImp} from "./GActiveImp";
import {ItemList} from "./ItemList";
import {FindSkillDataForMap} from "../skill/SkillWrapper";
import {ObjectInterface} from "../ObjectInterface";

/**
 * gplayer_imp
 *
 *
 */
export class GPlayer extends GActiveImp {
    /**
     * 创建 GPlayer 实例。
     *
     * @static
     */
    static instance(playerPointer: NativePointer): GPlayer {
        return new GPlayer(playerPointer);
    }

    /**
     * 获取 规则 id（作为玩家id？）
     */
    getRoleID() {
        //*(_DWORD *)(*((_DWORD *)this + 2) + 64),
        return this.pointer
            .add(4 * 2)
            .readPointer()
            .add(64)
            .readInt();
    }

    /**
     * 获取 player id
     */
    getPlayerID() {
        return this.getRoleID();
    }

    /**
     * 获取用户id
     */
    getUserID() {
        //*((_DWORD *)this + 1015),
        return this.pointer.add(4 * 1015).readInt();
    }

    getRunner(): NativePointer {
        return this.pointer.add(4 * 4);
    }

    notify_player_drop_item(where: number, index: number, type: number, count: number, drop_type: number):number{
        //(size_t where, size_t index,int type,size_t count,unsigned char drop_type) {}
        const fc = HookFuncCore.getNativeFunc(
            "_ZN18gplayer_dispatcher16player_drop_itemEjjijh",
            "bool",
            ["pointer","int32","int32","int32","int32","int32"],
        );

        return fc(this.getRunner().readPointer(), where, index, type, count, drop_type);
    }

    /**
     * 获取大区ID
     *
     * 无效
     */
    getZoneID() {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp12OI_GetZoneIDEv",
            "void",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取玩家名字
     */
    getPlayerName() {
        const nameLen = this.pointer.add(1061).readInt();
        return this.pointer.add(4224).readUtf16String(nameLen);
        // let nameLen = this.pointer.add(4 * 993).readInt()
        // return this.pointer.add(3952).readUtf16String(nameLen)
    }

    /**
     * 获取玩家名字
     */
    getPlayerNameNew() {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp13GetPlayerNameERj",
            "void",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    getWorldTag(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gobject_imp11GetWorldTagEv",
            'int32', ['pointer']);
        return fc(this.pointer);
    }

    /**
     * 获取玩家职业
     */
    GetPlayerOccupation(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp19GetPlayerOccupationEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(this.pointer, this.GetPlayerClass());
    }

    /**
     * 获取玩家职业
     */
    GetRebornProf(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp13GetRebornProfEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 获取玩家职业Class
     */
    GetPlayerClass(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp14GetPlayerClassEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 是否为女性
     */
    IsPlayerFemale(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp14IsPlayerFemaleEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 是否在安全区
     */
    IsInSanctuary(): boolean {
        // ((_BYTE *)this + 4123)
        return this.pointer.add(4123).readU8() === 1;
    }

    /**
     * 获取当前地图Id
     */
    GetCurMapId(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gobject_imp12GetClientTagEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取玩家金钱数量
     */
    getMoney() {
        return this.pointer.add(4 * 625).readUInt();
    }

    /**
     * 添加金钱
     * @param amount
     */
    addMoney(amount): number {
        // _ZN11gplayer_imp14AddMoneyAmountEj
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp14AddMoneyAmountEj",
            "void",
            ["pointer", "int32"],
        );
        return fc(this.pointer, amount);
    }

    /**
     * 获取背包
     */
    getInventory() {
        return new ItemList(this.pointer.add(2016));
    }

    /**
     * 获取背包中物品Data
     *
     * @param index 物品位置
     */
    getInventoryItemData(index) {
        return this.pointer
            .add(2016)
            .add(4)
            .readPointer()
            .add(52 * index);
    }

    /**
     * @param index 在包裹中的位置
     */
    GetEquipRefineLevel(index) {
        const item0 = this.getInventoryItemData(index); //读取背包第一个位置的装备数据
        const p1 = Memory.alloc(4);
        const itemContentFunc = HookFuncCore.getNativeFunc(
            "_ZN4item10GetContentERj",
            "pointer",
            ["pointer", "pointer"],
        );

        const itemContent = itemContentFunc(item0, p1);
        // const equipId = item0.readInt(); // 读取装备ID
        return itemContent.add(8).readInt(); // 读取装备等级
    }

    // /**
    //  * 获取包裹，
    //  *
    //  * 0默认
    //  * @param type
    //  */
    // getInventory(type) {
    //     const fc = HookFuncCore.getNativeFunc(
    //         '_ZN11gplayer_imp17PlayerGetItemInfoEii',
    //         'pointer', ['pointer', 'int32']);
    //     return new Inventory(fc(this.pointer, type));
    // }

    //_ZN11gplayer_imp12GetInventoryEi

    /**
     * 获取物品？
     */
    getItemInfo(p1, p2) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp17PlayerGetItemInfoEii",
            "void",
            ["pointer", "int32", "int32"],
        );
        return fc(this.pointer, p1, p2);
    }

    /**
     * 获取指定物品数量
     *
     * @param itemId 物品id
     */
    countItemById(itemId) {
        const func = HookFuncCore.getNativeFunc(
            "_ZN9item_list13CountItemByIDEi",
            "int32",
            ["pointer", "int32"],
        );
        // const func = HookFuncCore.getNativeFunc('_ZN9item_list13CountItemByIDEi', 'int32', ['pointer', 'int32']);
        return func(this.pointer.add(2016), itemId);
    }

    /**
     * 获取指定材料物品数量
     *
     * @param itemId 物品id
     */
    countMaterialItemById(itemId) {
        const func = HookFuncCore.getNativeFunc(
            "_ZN9item_list13CountItemByIDEi",
            "int32",
            ["pointer", "int32"],
        );
        // const func = HookFuncCore.getNativeFunc('_ZN9item_list13CountItemByIDEi', 'int32', ['pointer', 'int32']);
        return func(this.pointer.add(2380), itemId);
    }

    /**
     * 获取玩家装备列表索引地址
     */
    playerEquipItemListIndex() {
        return this.pointer.add(2044);
    }

    GetMaterialInventory(): ItemList {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp20GetMaterialInventoryEv",
            "pointer",
            ["pointer"],
        );
        return new ItemList(func(this.pointer));
    }

    GetPetEquipInventory(): ItemList {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp20GetPetEquipInventoryEv",
            "pointer",
            ["pointer"],
        );
        return new ItemList(func(this.pointer));
    }

    GetPetBedgeInventory(): ItemList {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp20GetPetBedgeInventoryEv",
            "pointer",
            ["pointer"],
        );
        return new ItemList(func(this.pointer));
    }

    /**
     * 获取玩家装备格子个数
     */
    getEquipItemListSize(pointer) {
        const func = HookFuncCore.getNativeFunc("_ZNK9item_list4SizeEv", "int32", [
            "pointer",
        ]);
        return func(pointer);
    }

    /**
     * 按装备位置获取装备id
     *
     * @param index 装备位置
     */
    getEquipIdByIndex(index) {
        const func = HookFuncCore.getNativeFunc("_ZN9item_listixEj", "pointer", [
            "int32",
            "int32",
        ]);
        return func(this.playerEquipItemListIndex().toInt32(), index).readInt();
    }

    /**
     * 获取装备列表
     */
    getEquipList() {
        const size = this.getEquipItemListSize(this.playerEquipItemListIndex());
        const equipList = [];
        for (let i = 0; i < size; ++i) {
            equipList.push(this.getEquipIdByIndex(i));
        }
        return equipList;
    }

    /**
     * 检查是否有某装备
     *
     * @param equipId 装备id
     * @param index 装备位置
     */
    checkHasEquip(equipId, index = -1) {
        //14 护符
        if (index < 0) {
            return this.getEquipList().concat(equipId);
        }
        return this.getEquipIdByIndex(index) === equipId;
    }

    /**
     * 获取等级
     */
    getLevel() {
        return this.pointer.add(376 * 2).readU16();
    }

    GetMaxHP(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK11gactive_imp8GetMaxHPEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetHP(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK11gactive_imp5GetHPEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    /**
     * 获取角色基础气血和装备气血
     */
    GetRealHP() {
        return (
            this.pointer.add(4 * 200).readUInt() +
            this.pointer.add(4 * 333).readUInt()
        );
    }

    /**
     * 获取重生次数（飞升）
     */
    getRebornCount(): number {
        //_ZN11gplayer_imp14GetRebornCountEv
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp14GetRebornCountEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    /**
     * 尝试发放物品
     */
    tryDeliverItem(itemId, isBind, count): boolean {
        // // _ZN11gplayer_imp14TryDeliverItemEiiii
        // const func = HookFuncCore.getNativeFunc(
        //     "_ZN11gplayer_imp14TryDeliverItemEiiii",
        //     'pointer',
        //     ['pointer', 'int32', 'int32', 'int32', 'int32']);
        // //player，是否绑定，物品id，数量，来源（0就是任务）
        // return func(this.pointer, isBind, itemId, count, 0)
        return this.DeliverItem(itemId, count, isBind);
    }

    /**
     * 发放物品（新，可配绑定）
     */
    DeliverItem(itemId: number, count, isBind, period = 0, deliverType = 0): boolean {
        // _ZN11gplayer_imp11DeliverItemEiibii
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp11DeliverItemEiibii",
            "pointer",
            ["pointer", "int32", "int32", "bool", "int32", "int32"],
        );
        //DeliverItem(int item_id,int count, bool bind, int lPeriod,int deliver_type)
        return func(this.pointer, itemId, count, isBind, period, deliverType);
    }

    /**
     * 发放任务物品
     */
    DeliverTaskItem(itemId, count): boolean {
        //int item_id, int count
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp15DeliverTaskItemEii",
            "void",
            ["pointer", "int32", "int32"],
        );
        //DeliverItem(int item_id,int count, bool bind, int lPeriod,int deliver_type)
        return func(this.pointer, itemId, count);
    }

    /**
     * 尝试取出物品
     */
    tryTakeOutItem(itemId, count): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp14TryTakeOutItemEij",
            "int32",
            ["pointer", "int32", "int32"],
        );
        return func(this.pointer, itemId, count);
    }

    TakeOutItem(inv_index, itemId, count): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp11TakeOutItemEiii",
            "int32",
            ["pointer", "int32", "int32", "int32"],
        );
        return func(this.pointer, inv_index, itemId, count);
    }

    /**
     * 自伤
     */
    selfHurt(hurt): boolean {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp8SelfHurtEi",
            "pointer",
            ["pointer", "int32"],
        );
        return func(this.pointer, hurt);
    }

    /**
     * 学习技能
     */
    learnSkill(skillId): number {
        // _ZN11gplayer_imp16PlayerLearnSkillEi
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp16PlayerLearnSkillEi",
            "int32",
            ["pointer", "int32"],
        );
        return func(this.pointer, skillId);
    }

    /**
     * 是否为师徒中的师傅（无效）
     */
    isSectMaster(): boolean {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp12IsSectMasterEv",
            "bool",
            ["pointer"],
        );
        return func(this.pointer);
    }

    /**
     * 获取师门中师傅id
     */
    getSectMasterID(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp14OI_GetMasterIDEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    /**
     * 获取师门id
     */
    getSectID(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp9GetSectIDEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    /**
     * 退出师门
     *
     * @param reason 理由（值未知）
     */
    quitSect() {
        const sectId = this.getSectID();
        if (sectId) {
            const func = HookFuncCore.getNativeFunc("_ZN4GMSV8QuitSectEici", "void", [
                "int32",
                "char",
                "int32",
            ]);
            func(sectId, 0, this.getPlayerID());
        }
    }

    /**
     * 设置声望值
     *
     * 师德值8
     * 师门值36
     */
    setRegionReputation(index: number, exp: number): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp19SetRegionReputationEji",
            "int32",
            ["pointer", "int32", "int32"],
        );
        return func(this.pointer, index, exp);
    }

    /**
     * 修改声望值，正负
     *
     * 师德值8
     * 师门值36
     */
    modifyRegionReputation(index: number, exp: number): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22ModifyRegionReputationEii",
            "int32",
            ["pointer", "int32", "int32"],
        );
        return func(this.pointer, index, exp);
    }

    /**
     * 设置幸运值
     */
    setLuckInfo(luck) {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp11SetLuckInfoEii",
            "int32",
            ["pointer", "int32", "int32"],
        );
        return func(this.pointer, luck, luck);
    }

    /**
     * 设置星魂
     */
    SetStarSoul(soul, soul2) {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp17PlayerAddStarSoulEii",
            "int32",
            ["pointer", "int32", "int32"],
        );
        return func(this.pointer, soul, soul2);
    }

    UseCash(cash) {
        const itemId = 55442; //目前来看是记录日志用的，可以随便造个id来代替
        const itemCount = 1;
        const unknown1 = 0;
        const orderId = -1;
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp13PlayerUseCashEiiiiib",
            "int32",
            ["pointer", "int32", "int32", "int32", "int32", "int32", "bool"],
        );
        return func(this.pointer, itemId, itemCount, unknown1, cash, orderId, 1);
    }

    SummonNPCOrMonster(id: number, duration: number) {
        let oi = Memory.alloc(0x08);
        oi.add(0).writePointer(this.pointer);
        oi.add(4).writeByteArray([0]);
        let mp = Memory.alloc(0x48);
        mp.add(0).writeInt(id);
        mp.add(0x04).writeInt(0);
        mp.add(0x08).writeInt(duration);
        mp.add(0x0b).writeInt(0);
        mp.add(0x0c).writeInt(0);
        mp.add(0x10).writeInt(0);
        mp.add(0x14).writeFloat(1.0);
        mp.add(0x18).writeFloat(1.0);
        mp.add(0x1c).writeFloat(1.0);
        //spec_leader_id.type = *((_DWORD *)this + 2);spec_leader_id.id = v81;
        mp.add(0x20).add(0).writeInt(-1);
        mp.add(0x20).add(4).writeInt(-1);
        //parent_is_leader=0,use_parent_faction=0,die_with_leader = 1;
        mp.add(0x28).writeByteArray([0, 0, 1, 0]);
        mp.add(0x44).writeInt(0);

        const func = HookFuncCore.getNativeFunc(
            "_ZN16object_interface12CreateMinorsERKNS_11minor_paramEf",
            "int32",
            ["pointer", "pointer", "float"],
        );
        func(oi, mp, 0.0);
        oi = undefined;
        mp = undefined;
    }

    /**
     * 发带炼器的装备
     */
    DeliverReinforceItem(
        itemId,
        reinforce_level,
        isBind,
        period = 0,
        deliverType = 0,
    ) {
        // void gplayer_imp::DeliverReinforceItem(int item_id,int reinforce_level, bool bind, int lPeriod,int deliver_type)
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp20DeliverReinforceItemEiibii",
            "void",
            ["pointer", "int32", "int32", "bool", "int32", "int32"],
        );
        return func(
            this.pointer,
            itemId,
            reinforce_level,
            isBind,
            period,
            deliverType,
        );
    }

    GetMafiaID(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp13OI_GetMafiaIDEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetParent() {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp9GetParentEv",
            "pointer",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetTeamID(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp9GetTeamIDEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    /**
     * 队伍序号
     */
    GetTeamSeq(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp10GetTeamSeqEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetTeam(): NativePointer {
        return this.pointer.add(2516)
    }

    IsInTeam(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp8IsInTeamEv",
            "bool",
            ["pointer"],
        );
        return func(this.pointer) == 1 ? 1 : 0;
    }

    IsInTroupe(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp10IsInTroupeEv",
            "bool",
            ["pointer"],
        );
        return func(this.pointer) == 1 ? 1 : 0;
    }

    GetTroupeID(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11player_team11GetTroupeIDEv",
            "int32",
            ["pointer"],
        );
        return func(this.GetTeam());
    }

    GetNormalPickupFlag(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11player_team19GetNormalPickupFlagEv",
            "int32",
            ["pointer"],
        );
        return func(this.GetTeam());
    }

    GetTroupeLeader(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11player_team15GetTroupeLeaderEv",
            "int32",
            ["pointer"],
        );
        return func(this.GetTeam());
    }

    IsRandomPickup(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11player_team14IsRandomPickupEv",
            "bool",
            ["pointer"],
        );
        return func(this.GetTeam()) == 1 ? 1 : 0;
    }

    SendTo(message: number, target: NativePointer, param: number, buf: NativePointer, len: number) {
        //int message,const XID & target, int param,const void * buf, size_t len
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gactive_imp6SendToILi0EEEviRK3XIDiPKvj",
            "int32",
            [
                "pointer",//gactive_imp
                "int32",//msg type
                "pointer",// target
                "int32",//param
                "pointer",//buf
                "int32"//len
            ],
        );
        return func(this.pointer, message, target, param, buf, len);
    }

    GetPos(): number[] {
        const posPointer = this.GetParent().add(4 * 12);
        const x = posPointer.add(0).readFloat();
        const y = posPointer.add(4).readFloat();
        const z = posPointer.add(8).readFloat();
        return [x, y, z];
    }

    // toObjectInterface(): NativePointer {
    //     let oi = Memory.alloc(0x08);
    //     oi.add(0).writePointer(this.pointer);
    //     oi.add(4).writeInt(0);
    //     return oi
    // }

    DropItem(item_id, item_num, expire_date) {
        //object_interface *this, unsigned int a2, unsigned int a3, unsigned int a4
        //unsigned int item_id, unsigned int item_num, unsigned int expire_date
        const func = HookFuncCore.getNativeFunc(
            "_ZN16object_interface8DropItemEjjj",
            "void",
            ["pointer", "int32", "int32", "int32"],
        );
        let oi = Memory.alloc(0x08);
        oi.add(0).writePointer(this.pointer);
        oi.add(4).writeInt(0);
        func(oi, item_id, item_num, expire_date);
        oi = undefined;
    }

    CheckDropItem(item_id, item_num, expire_date): boolean {
        if (this.countItemById(item_id) > 0) {
            // const index=player.getInventory().FindByType(0,114041)
            this.DropItem(item_id, item_num, expire_date);
            return true;
        }
        return false;
    }

    GetCurTargetID(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp12GetCurTargetEv",
            "pointer",
            ["pointer"],
        );
        const gplayer_controller: NativePointer = func(this.pointer);
        return gplayer_controller.add(4).readInt();
    }

    SetRefreshState(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gactive_imp15SetRefreshStateEv",
            "void",
            ["pointer"],
        );
        return func(this.pointer);
    }

    IncEquipChangeFlag(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp18IncEquipChangeFlagEv",
            "void",
            ["pointer"],
        );
        return func(this.pointer);
    }

    CalcEquipmentInfo(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp17CalcEquipmentInfoEv",
            "void",
            ["pointer"],
        );
        return func(this.pointer);
    }

    RefreshFuwen(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp12RefreshFuwenEv",
            "void",
            ["pointer"],
        );
        return func(this.pointer);
    }

    CheckHasWardobeItem(itemList: number[]): boolean {
        let hasCount = 0;
        for (const _item of itemList) {
            //检查拥有
            hasCount++;
        }

        return hasCount === itemList.length;
    }

    GetSkillLevel(skillId: number): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gactive_imp13GetSkillLevelEi",
            "int32",
            ["pointer", "int32"],
        );
        return func(this.pointer, skillId);
    }

    ClrCoolDown(skillId: number) {
        const func = HookFuncCore.getNativeFunc(
            "_ZN11gplayer_imp11ClrCoolDownEi",
            "void",
            ["pointer", "int32"],
        );
        return func(this.pointer, skillId);
    }

    /**
     * gs 获取玩家某 buff 层数
     * @param {number} buffId
     * @returns {number}
     */
    GetBuffLevel(buffId: number): number {
        const fc = HookFuncCore.getNativeFunc("_ZN11gplayer_imp12GetBuffLevelEi", "int", [
            "pointer",
            "int",
        ]);
        return fc(this.pointer, buffId);
    }

    /**
     GetMaxDp() {
		const extend_prop = this.pointer.add(1056);
		return extend_prop.add(8).readInt();
	}

     /**
     * 获取小攻
     * @returns
     */
    GetLowAtk() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x4c).readInt();
    }

    /**
     * 获取玩家大功
     * @returns
     */
    GetHighAtk() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x50).readInt();
    }

    /**
     * 获取玩家走路速度
     * @returns
     */
    GetWalkSpeed() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x3c).readInt();
    }

    /**
     * 获取玩家奔跑速度
     * @returns
     */
    GetRunSpeed() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x40).readInt();
    }

    /**
     * 获取玩家暴击率
     * @returns
     */
    GetCritRate() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x44).readInt();
    }

    /**
     * 获取玩家暴击伤害
     * @returns
     */
    GetCritDmg() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x48).readInt();
    }

    /**
     * 获取玩家防御力
     * @returns
     */
    GetDefense() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x58).readInt();
    }

    /**
     * 获取玩家普攻躲闪
     * @returns
     */
    GetArmor() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x5c).readInt();
    }

    /**
     * 获取玩家晕抗
     * @returns
     */
    GetDizzyRes() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x60).readInt();
    }

    /**
     * 获取玩家虚抗
     * @returns
     */
    GetWeakRes() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x64).readInt();
    }

    /**
     * 获取玩家定抗
     * @returns
     */
    GetWrapRes() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x68).readInt();
    }

    /**
     * 获取玩家魅抗
     * @returns
     */
    GetSilenceRes() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x6c).readInt();
    }

    /**
     * 获取玩家眩昏抗
     * @returns
     */
    GetSleepRes() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x70).readInt();
    }

    /**
     * 获取玩家减速抗性
     * @returns
     */
    GetSlowRes() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0x74).readInt();
    }

    /**
     * 通过玩家属性获取攻击范围
     * @returns
     */
    GetAttackRangeNew() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xa8).readInt();
    }

    /**
     * 获取玩家减暴击
     * @returns
     */
    GetAntiCrit() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xac).readInt();
    }

    GetAntiCritDmg() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xb0).readInt();
    }

    /**
     * 获取玩家技能命中
     * @returns
     */
    GetSkillAttackRate() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xb4).readInt();
    }

    /**
     * 获取玩家技能躲闪
     * @returns
     */
    GetSkillArmorRate() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xb8).readInt();
    }

    GetCultResMo() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xbc).readInt();
    }

    GetCultResFo() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xc0).readInt();
    }

    GetCultResXian() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xc4).readInt();
    }

    GetCultAtkMo() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xd4).readInt();
    }

    GetCultAtkFo() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xd8).readInt();
    }

    GetCultAtkXian() {
        const extend_prop = this.pointer.add(1056);
        return extend_prop.add(0xdc).readInt();
    }

    GetFaction() {
        const fc = HookFuncCore.getNativeFunc("_ZN11gactive_imp10GetFactionEv", "int", ["pointer"]);
        return fc(this.pointer);
    }

    /**
     * 是否为青云
     * @returns {boolean}
     */
    isQingyun() {
        const occuMap = [7, 8, 9, 19, 20];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否天音
     * @returns
     */
    IsTianyin() {
        const occuMap = [10, 11, 12, 22, 23];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否鬼王
     * @returns
     */
    IsGuiwang() {
        const occuMap = [1, 2, 3, 13, 14];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否合欢
     * @returns
     */
    IsHehuan() {
        const occuMap = [4, 5, 6, 16, 17];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否鬼道
     * @returns
     */
    IsGuidao() {
        const occuMap = [25, 26, 27, 28, 29];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否焚香
     * @returns
     */
    IsFenxiang() {
        const occuMap = [64, 65, 66, 67, 68];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否九黎
     * @returns
     */
    IsJiuli() {
        const occuMap = [33, 34, 35, 36, 37];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否烈山
     * @returns
     */
    IsLieshan() {
        const occuMap = [39, 40, 41, 42, 43];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否怀光
     * @returns
     */
    IsHuaiguang() {
        const occuMap = [45, 46, 47, 48, 49];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否天华
     * @returns
     */
    IsTianhua() {
        const occuMap = [51, 52, 53, 54, 55];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否太昊
     * @returns
     */
    IsTaihao() {
        const occuMap = [96, 97, 98, 99, 100];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否辰皇
     * @returns
     */
    IsChenhuang() {
        const occuMap = [56, 57, 58, 59, 60];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否英招
     * @returns
     */
    IsYingzhao() {
        const occuMap = [108, 109, 110, 111, 112];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否牵机
     * @returns
     */
    IsQianji() {
        const occuMap = [102, 103, 104, 105, 106];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否破军
     * @returns
     */
    IsPojun() {
        const occuMap = [117, 118, 119, 120, 121];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否青罗
     * @returns
     */
    IsQingluo() {
        const occuMap = [71, 72, 73, 74, 75];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否归云
     * @returns
     */
    IsGuiyun() {
        const occuMap = [77, 78, 79, 80, 81];
        return occuMap.includes(this.GetPlayerClass());
    }

    /**
     * 是否画影
     * @returns
     */
    IsHuaying() {
        const occuMap = [83, 84, 85, 86, 87];
        return occuMap.includes(this.GetPlayerClass());
    }

    PlayerLearnSkill(skillId: number): number {
        const func = HookFuncCore.getNativeFunc("_ZN11gplayer_imp16PlayerLearnSkillEi", "int32", [
            "pointer",
            "int32",
        ]);
        return func(this.pointer, skillId);
    }

    /**
     * 获取玩家的乾坤袋
     * @returns
     */
    GetTokenInventory(): ItemList {
        const func = HookFuncCore.getNativeFunc("_ZN11gplayer_imp17GetTokenInventoryEv", "pointer", [
            "pointer",
        ]);
        return new ItemList(func(this.pointer));
    }

    //gplayer_imp::ObtainItem(int where, item_data * pData, bool isTask, int deliver_type)
    ObtainItem(item_data: NativePointer, isTask: number, deliver_type: number) {
        const func = HookFuncCore.getNativeFunc("_ZN11gplayer_imp10ObtainItemEiP9item_databi",
            "int32", ['pointer', 'int32', 'pointer', 'int32', 'int32']);
        return func(this.pointer, 0, item_data, isTask, deliver_type)
    }

    Say(msg: string, channel: number) {
        //(int lid, int userid, int sid, const GMSV::chat_msg *const chat)
        const originFunc = HookFuncCore.getNativeFunc("_ZN4GMSV11SendChatMsgEiiiRKNS_8chat_msgE",
            'bool', ['int32', 'int32', 'int32', 'pointer'])
        const parent = this.pointer.add(4 * 2).readPointer()
        const lid = parent.add(224).readInt();
        const userid = parent.add(64).readInt();
        const sid = parent.add(228).readInt();

        const msgPointer = Memory.allocUtf16String(msg)

        const chat_msg = Memory.alloc(0x24)
        chat_msg.add(0).writeInt(userid)//speaker
        chat_msg.add(4).writePointer(msgPointer)//msg
        chat_msg.add(8).writeInt(msg.length * 2)//size
        chat_msg.add(0x0C).writePointer(ptr(0))//data
        chat_msg.add(0x10).writeInt(0)//datasize
        chat_msg.add(0x14).writeInt(channel)//channel
        // chat_msg.add(0x15).writeInt(0)//emote_id

        console.log(lid, userid, sid)
        return originFunc(lid, userid, sid, chat_msg)
    }

    /**
     * 获取玩家技能数据
     */
    GetSkillWrapper(): NativePointer {
        return this.pointer.add(164)
    }

    RemoveSkills(skillList: number[]) {
        const skillWrapper = this.GetSkillWrapper()
        const mapAddress = skillWrapper.add(4)

        const id = Memory.alloc(4)
        for (let i = 0; i < skillList.length; i++) {
            id.writeU32(skillList[i])
            const sk = FindSkillDataForMap(mapAddress, id)
            const baselevel = sk.add(0)
            const reallevel = sk.add(1)
            const actilevel = sk.add(2)
            const mask = sk.add(3)
            const cooltime = sk.add(4)

            console.log(baselevel.readU8())
            console.log(reallevel.readU8())
            console.log(actilevel.readU8())
            console.log(mask.readU8())
            console.log(cooltime.readU8())

            baselevel.writeU8(0)
            reallevel.writeU8(0)
            actilevel.writeU8(0)
            cooltime.writeU8(0)

            ObjectInterface.SendClientLearnSkill(this.GetObjectInterface(), skillList[i], 0)
        }
    }

    GetCardInventory(): NativePointer {
        return this.pointer.add(2296)
    }

    ClearAllPetBehavior() {
        const func = HookFuncCore.getNativeFunc("_ZN11pet_manager19ClearAllPetBehaviorEP11gplayer_imp",
            "int32", ['pointer', 'pointer']);
        return func(this.pointer.add(608), this.pointer)
    }
}
