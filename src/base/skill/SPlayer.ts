import {HookFuncCore} from "../HookFuncCore";
import {PointerClass} from "../PointerClass";
import {zrand} from "../ConstFunc";

/**
 * 技能中的Player
 */
export class SPlayer extends PointerClass {
    /**
     * 获取id（roleID）
     */
    GetID(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper5GetIDEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取职业
     *
     */
    GetOccupation(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13GetOccupationEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取等级
     */
    GetLevel(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetLevelEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取真气
     */
    GetMp(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper5GetMpEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取气血
     */
    GetHp(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper5GetHpEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取除状态外的真实血量
     */
    GetRealHP() {
        return (
            this.pointer.add(4 * 200).readUInt() +
            this.pointer.add(4 * 333).readUInt()
        );
    }

    /**
     * 获取元力
     */
    GetDp(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper5GetDpEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取攻击
     */
    GetInk(): number {
        //这个函数获取的攻击是0
        // const fc = HookFuncCore.getNativeFunc(
        //     '_ZN4GNET13PlayerWrapper6GetInkEv',
        //     'int32', ['pointer']);
        return this.GetMaxatk();
    }

    /**
     * 获取 Buff Level
     *
     * @param buffId
     */
    GetBufflevel(buffId: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12GetBufflevelEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(this.pointer, buffId);
    }

    /**
     * 获取是否有多Buff中的其一
     *
     * @param buffId
     */
    GetHasmultbuff(buffId: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14GetHasmultbuffEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(this.pointer, buffId);
    }

    /**
     * 获取某技能等级
     *
     * @param targetSkillId
     */
    GetSkilllevel(targetSkillId: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13GetSkilllevelEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(this.pointer, targetSkillId);
    }

    /**
     * 获取飞升次数
     */
    GetReborncount(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14GetReborncountEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取封神阵营
     *
     * 仙=1，魔=2，佛=4
     */
    GetCultivation(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14GetCultivationEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 是否为仙阵营
     */
    IsXian(): boolean {
        return this.GetCultivation() === 1;
    }

    /**
     * 是否为魔阵营
     */
    IsMo(): boolean {
        return this.GetCultivation() === 2;
    }

    /**
     * 是否为佛阵营
     */
    IsFo(): boolean {
        return this.GetCultivation() === 4;
    }

    /**
     * 获取元神等级
     */
    GetSglevel(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10GetSglevelEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取元神经验
     *
     */
    GetDTExp(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetDTExpEv",
            "int64",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取技能附加距离
     */
    GetAddSkillDistance(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19GetAddSkillDistanceEv",
            "float",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取与目标距离
     */
    GetTargetDistance(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17GetTargetDistanceEv",
            "float",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取有利 Buff 个数
     */
    GetBuffcnt(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10GetBuffcntEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取不利 Buff 个数
     */
    GetDebuffcnt(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12GetDebuffcntEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取结阵人数
     */
    GetCyclemembercnt(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17GetCyclemembercntEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取目标XID
     * @constructor
     */
    GetTarget(): NativePointer {
        return this.pointer.add(0x18).readPointer();
    }

    /**
     * 获取气血最大值
     */
    GetMaxhp(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetMaxhpEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取真气最大值
     */
    GetMaxmp(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetMaxmpEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取气血真气上限和
     * @constructor
     */
    GetMaxHPAndMP(): number {
        return this.GetMaxhp() + this.GetMaxmp();
    }

    /**
     * 获取是否组队
     */
    GetInteam(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9GetInteamEv",
            "bool",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取是否组团
     */
    GetInTroupe(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11GetIntroupeEv",
            "bool",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取防御
     */
    GetDef(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper6GetDefEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取攻击范围
     * 内部调用了 attack_range
     */
    GetRange(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetRangeEv",
            "float",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取昏睡抗性
     */
    GetSaint(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetSaintEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取临时变量。
     * 目前库内查看临时变量Index只有以下几种
     * 1,2,3,4,5,6,7,8,9,10,11,12,16
     */
    GetVar(index: number): number {
        let flag = 7;
        if (index >= 10) {
            flag = 8;
        }

        const fc = HookFuncCore.getNativeFunc(
            `_ZN4GNET13PlayerWrapper${flag}GetVar${index}Ev`,
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 设置临时变量。
     * 目前库内查看临时变量Index只有以下几种
     * 1,2,3,4,5,6,7,8,9,10,11,12,16
     */
    SetVar(index: number, value: number) {
        let flag = 7;
        if (index >= 10) {
            flag = 8;
        }

        const fc = HookFuncCore.getNativeFunc(
            `_ZN4GNET13PlayerWrapper${flag}SetVar${index}Ei`,
            "void",
            ["pointer", "int32"],
        );
        fc(this.pointer, value);
    }

    /**
     * 获取目标类型是否为怪物
     * 返回值：怪物=2
     *
     * 获取目标类型。在计算每段，BlessMe，CoolTime时可用于获取目标类型
     *
     * 每段中获取是否为怪物为2
     * Bless中获取是否为怪物为2
     * Attack中获取是否为怪物为-1（目标的反向目标获取不到，所以是-1）
     */
    GetTargetTypeIsMob(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13GetTargetTypeEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer) === 2; //是否为怪物
    }

    /**
     * 获取目标类型是否为玩家
     * 返回值：玩家=1
     *
     * 获取目标类型。在计算每段，BlessMe，CoolTime时可用于获取目标类型
     *
     * 每段中获取是否为玩家为1
     * Bless中获取是否为玩家为1
     * Attack中获取是否为玩家为-1（目标的反向目标获取不到，所以是-1）
     */
    GetTargetTypeIsPlayer(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13GetTargetTypeEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer) === 1; //是否为玩家
    }

    /**
     * 获取自身类型，
     *
     * 在attack时可用这个判断函数中player类型
     *
     * 每段中获取是否为玩家为0（玩家）
     * Bless中获取是否为玩家为0（玩家）
     * Attack中获取是否为玩家为0（玩家）
     */
    GetTypeIsPlayer(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetTypeEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer) === 0; //是否为玩家
    }

    /**
     * 获取自身类型，
     *
     * 在attack时可用这个判断函数中player类型
     *
     * 每段中获取是否为怪物为1
     * Bless中获取是否为怪物为1
     * Attack中获取是否为怪物为1
     */
    GetTypeIsMob(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetTypeEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer) === 1; //是否为怪物
    }

    /**
     * 获取最大攻击（常说的大攻）
     */
    GetMaxatk(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9GetMaxatkEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取暴击率
     */
    GetCrit(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetCritEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取眩晕抗性
     * resistance
     */
    GetRes1(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRes1Ev",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取虚弱抗性
     * resistance
     */
    GetRes2(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRes2Ev",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取定身抗性
     * resistance
     */
    GetRes3(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRes3Ev",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取魅惑抗性
     * resistance
     */
    GetRes4(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRes4Ev",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取昏睡抗性
     * resistance
     */
    GetRes5(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRes5Ev",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取减速抗性
     *
     * resistance
     */
    GetRes6(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRes6Ev",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取眩晕抗性
     */
    GetStunRes(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10GetStunResEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取魅惑抗性
     */
    GetSilenceRes(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13GetSilenceResEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取普攻躲闪
     */
    GetDodge(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetDodgeEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取最大元力
     */
    GetMaxdp(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetMaxdpEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取最小攻击
     */
    GetMinatk(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9GetMinatkEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取昏睡抗性
     */
    GetSleepRes(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11GetSleepResEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取麻痹（瘫痪）抗性
     */
    GetParalyzeRes(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14GetParalyzeResEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取暴击伤害
     */
    GetCrithurt(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11GetCrithurtEv",
            "float",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取减免爆伤
     */
    GetAnticrithurt(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15GetAnticrithurtEv",
            "float",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取模板id（怪物模板id）
     */
    GetTmplid(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9GetTmplidEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取技能躲闪
     */
    GetSkilldodge(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13GetSkilldodgeEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取性别
     */
    GetGender(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9GetGenderEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取连杀数量
     */
    GetKillnum(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10GetKillnumEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取是否暴击
     */
    GetIscrit(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9GetIscritEv",
            "bool",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取虚弱抗性
     */
    GetWeakenRes(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12GetWeakenResEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取技能命中
     * 百分数
     */
    GetSkillrate(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12GetSkillrateEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取伤害减免
     */
    GetDmgreduce(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12GetDmgreduceEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取怒气值
     * 人马专用
     */
    GetRage() {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRageEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取暗光值
     * 辰皇专用
     */
    GetDarklight(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12GetDarklightEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取攻击范围
     */
    GetStandrange(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13GetStandrangeEv",
            "float",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取暗光形态
     * 辰皇专用
     */
    GetDarklightform(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16GetDarklightformEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取连击数
     */
    GetComb(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetCombEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取是否隐身
     */
    GetHide(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetHideEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取傀儡
     * 类似怀光影子分身
     */
    GetPuppetid(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11GetPuppetidEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取移动速度
     * 奔跑速度 m/s
     */
    GetSpeed(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8GetSpeedEv",
            "float",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取攻击百分比
     *
     * 千分数
     */
    GetAtkrate(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10GetAtkrateEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取当前地图上家族成员个数
     */
    GetMapFamilyMembersCnt(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22GetMapFamilyMembersCntEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取是否处于灼烧状态
     * 不好使
     */
    GetIsignite(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11GetIsigniteEv",
            "bool",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取是否处于冰冻状态
     * 不好使
     */
    GetIsfrozen(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11GetIsfrozenEv",
            "bool",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取种族
     * 少侠-0，人族-1，神族-2，天脉-4，默认3
     */
    GetRace(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7GetRaceEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 获取技能命中
     */
    GetSkillAttack(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16GetSkillAttackEnEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 直接设置真气值
     */
    SetMp(v: number):boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper5SetMpEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 直接设置气血值
     */
    SetHp(v: number):boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper5SetHpEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 直接设置怒气值
     */
    SetRage(v: number):boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetRageEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 直接设置光暗值
     */
    SetDarklight(v: number):boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetDarklightEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 清除过滤器。状态过滤器
     * 合欢相思曦日
     */
    RemoveMultiFilter(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17RemoveMultiFilterEi",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 清除过滤器。状态过滤器
     */
    RemoveFilter(v: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface12RemoveFilterEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer.add(4), v);
    }

    /**
     * 获取是否拥有某状态
     *
     * @param filter_id
     */
    GetHasbuff(filter_id: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10GetHasbuffEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, filter_id);
    }

    /**
     * 获取自身大于timeout秒的不利buff个数
     *
     * @param timeout
     */
    GetDebuffcntTimeout(timeout: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19GetDebuffcntTimeoutEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(this.pointer, timeout);
    }

    /**
     * 获取灵种层数
     */
    GetSpiritSeed(): number {
        return this.GetBufflevel(9358);
    }

    /**
     * 获取行云层数
     */
    GetCloudShift(): number {
        return this.GetBufflevel(9333);
    }

    //-------------使用频率很高的临时变量--------------------

    /**
     * 设定状态概率
     *
     * 临时状态参数
     *
     * 120为100%概率
     */
    SetProbability(v: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetProbabilityEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设定状态时长
     *
     * 临时状态参数
     *
     * 毫秒
     */
    SetTime(v: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetTimeEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设定倍率
     *
     * 临时状态参数
     */
    SetRatio(v: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetRatioEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设定数值
     *
     * 临时状态参数
     */
    SetValue(v: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetValueEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设定量级
     *
     * 临时状态参数
     */
    SetAmount(v: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetAmountEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设定Buffid。
     *
     * 如果id重复就会覆盖
     * 临时状态参数
     */
    SetBuffid(v: number): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetBuffidEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置吟唱
     * 表示开始释放技能的吟唱阶段
     */
    SetPray(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetPrayEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置执行状态
     * 表示开始释放技能效果的执行，会扣技能消耗
     *
     * 绝大部分inform=1
     */
    SetPerform(inform = 1): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetPerformEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, inform);
    }

    /**
     * 设置临时变量1
     * （临时参数）
     */
    SetVar1(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar1Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量2
     * （临时参数）
     */
    SetVar2(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar2Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量3
     * （临时参数）
     */
    SetVar3(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar3Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量4
     * （临时参数）
     */
    SetVar4(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar4Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量5
     * （临时参数）
     */
    SetVar5(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar5Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量6
     * （临时参数）
     */
    SetVar6(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar6Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量7
     * （临时参数）
     */
    SetVar7(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar7Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量8
     * （临时参数）
     */
    SetVar8(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar8Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量9
     * （临时参数）
     */
    SetVar9(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetVar9Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量10
     * （临时参数）
     */
    SetVar10(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetVar10Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量11
     * （临时参数）
     */
    SetVar11(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetVar11Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量12
     * （临时参数）
     */
    SetVar12(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetVar12Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量13
     * （临时参数）
     */
    SetVar13(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetVar13Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 设置临时变量16
     * （临时参数）
     */
    SetVar16(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetVar16Ei",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 获取临时变量1
     */
    GetVar1(): number {
        return this.GetVar(1);
    }

    /**
     * 获取临时变量2
     */
    GetVar2(): number {
        return this.GetVar(2);
    }

    /**
     * 获取临时变量3
     */
    GetVar3(): number {
        return this.GetVar(3);
    }

    /**
     * 获取临时变量4
     */
    GetVar4(): number {
        return this.GetVar(4);
    }

    /**
     * 获取临时变量5
     */
    GetVar5(): number {
        return this.GetVar(5);
    }

    /**
     * 获取临时变量6
     */
    GetVar6(): number {
        return this.GetVar(6);
    }

    /**
     * 获取临时变量7
     */
    GetVar7(): number {
        return this.GetVar(7);
    }

    /**
     * 获取临时变量8
     */
    GetVar8(): number {
        return this.GetVar(8);
    }

    /**
     * 获取临时变量9
     */
    GetVar9(): number {
        return this.GetVar(9);
    }

    /**
     * 获取临时变量10
     */
    GetVar10(): number {
        return this.GetVar(10);
    }

    /**
     * 获取临时变量11
     */
    GetVar11(): number {
        return this.GetVar(11);
    }

    /**
     * 获取临时变量12
     */
    GetVar12(): number {
        return this.GetVar(12);
    }

    /**
     * 获取临时变量13
     */
    GetVar13(): number {
        return this.GetVar(13);
    }

    /**
     * 获取临时变量16
     */
    GetVar16(): number {
        return this.GetVar(16);
    }

    //--------------------设置状态的函数-----------------------
    /**
     * 坚韧
     * 增加防御力。
     * 按倍率增加防御力
     */
    SetIncdefence(
        prob: number,
        time: number,
        ratio: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(ratio);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetIncdefenceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 气血满盈
     * 增加气血上限。
     * 按倍率增加气血上限
     */
    SetInchp(ratio: number, time: number, buffId: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetInchpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 真气满盈
     * 增加真气上限。
     * 按倍率增加真气上限
     */
    SetIncmp(ratio: number, time: number, buffId: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetIncmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按倍率减少真气上限
     */
    SetDecmp(prob: number, time: number, ratio: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetDecmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 气血充沛
     * 增加气血上限。
     * 按数值增加气血上限。
     */
    SetAddhp(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetAddhpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 真气充沛
     * 增加真气上限。
     *
     * 按数值增加真气上限。
     */
    SetAddmp(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetAddmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 迅疾
     * 增加移动速度。
     * 按数值增加移动速度
     */
    SetAddspeed(
        prob: number,
        time: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAddspeedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 复活
     */
    SetResurrect() {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetResurrectEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 气血流失
     * 持续减少气血量。
     * 按数值流血
     */
    SetHpleak(
        prob: number,
        time: number,
        amount: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetHpleakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 真气涣散
     * 持续减少真气量。
     * 按数值流蓝
     */
    SetMpleak(
        prob: number,
        time: number,
        amount: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetMpleakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加爆击百分比
     * 增加致命一击率。
     * 按比例增加暴击率
     */
    SetInccritrate(time: number, ratio: number, b: number): boolean {
        this.SetTime(time);
        this.SetRatio(ratio);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetInccritrateEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 猛击
     * 增加攻击力。
     * 按比例提升攻击力
     */
    SetIncattack(
        prob: number,
        time: number,
        ratio: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(ratio);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetIncattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 眩晕
     */
    SetDizzy(prob: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetDizzyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 活血
     * 增加气血恢复速度。
     */
    SetInchpgen(inc: number, t: number, b: number): boolean {
        this.SetRatio(inc);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetInchpgenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 坚强
     * 增加防御力。
     * 按数值增加防御
     */
    SetAdddefence(
        prob: number,
        time: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetAdddefenceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虚弱
     */
    SetWeak(prob: number, time: number, ratio: number, buffId: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(ratio);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetWeakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无敌
     */
    SetInvincible(time: number): boolean {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetInvincibleEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置打断状态
     */
    SetBreak(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetBreakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 瞬回一定比例的血量
     */
    SetScaleinchp(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetScaleinchpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 瞬回一定比例的蓝
     */
    SetScaleincmp(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetScaleincmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 扣掉一定比例的血
     */
    SetScaledechp(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetScaledechpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 扣掉一定比例的蓝
     */
    SetScaledecmp(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetScaledecmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按百分比减免伤害
     *
     * 保护盾
     *
     * @param time
     * @param ratio     减免比例
     * @param amount    最大可减免到的伤害数值
     */
    SetDechurt(time: number, ratio: number, amount: number): boolean {
        this.SetTime(time);
        this.SetRatio(ratio);
        this.SetAmount(amount);
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetDechurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置回血速度
     *
     * @param prob
     * @param time
     * @param amount    health，初始恢复量
     * @param value     addtion，每秒增加恢复量
     * @param ratio     can_heal_bloodpool，是否可回复血槽。>0.001表示可以
     * @param buffId
     */
    SetHpgen(
        prob: number,
        time: number,
        amount: number,
        value: number,
        ratio: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetRatio(ratio);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetHpgenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 回蓝速度
     *
     * @param prob
     * @param time
     * @param amount    health，初始恢复量
     * @param value     addtion，每秒增加恢复量
     * @param buffId
     */
    SetMpgen(
        prob: number,
        time: number,
        amount: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetMpgenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加眩晕抗性
     */
    SetAddantidizzy(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetAddantidizzyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加昏睡抗性
     */
    SetAddantisleep(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetAddantisleepEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加虚弱抗性
     */
    SetAddantiweak(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetAddantiweakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加魅惑抗性
     */
    SetAddantisilent(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetAddantisilentEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加定身抗性
     */
    SetAddantiwrap(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetAddantiwrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加减速抗性
     */
    SetAddantislow(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetAddantislowEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 减少眩晕抗性
     */
    SetSubantidizzy(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSubantidizzyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值减少昏睡抗性
     */
    SetSubantisleep(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSubantisleepEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值减少虚弱抗性
     */
    SetSubantiweak(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSubantiweakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值减少魅惑抗性
     */
    SetSubantisilent(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSubantisilentEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值减少定身抗性
     */
    SetSubantiwrap(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSubantiwrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值减少减速抗性
     */
    SetSubantislow(time: number, value: number, buffId: number): boolean {
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSubantislowEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除眩晕
     */
    SetCleardizzy(prob: number): boolean {
        this.SetProbability(prob);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetCleardizzyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除昏睡
     */
    SetClearsleep(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetClearsleepEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除虚弱
     */
    SetClearweak(prob: number): boolean {
        this.SetProbability(prob);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetClearweakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除魅惑
     */
    SetClearsilent(prob: number): boolean {
        this.SetProbability(prob);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetClearsilentEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除定身
     */
    SetClearwrap(prob: number): boolean {
        this.SetProbability(prob);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetClearwrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除减速
     */
    SetClearslow(prob: number): boolean {
        this.SetProbability(prob);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetClearslowEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加攻击力
     */
    SetAddattack(
        prob: number,
        time: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAddattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加普攻躲闪
     */
    SetAdddodge(
        prob: number,
        time: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAdddodgeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 闪避
     *
     * 御空术的位移，辰皇莲华等效果
     */
    SetDodge(time: number, value: number): boolean {
        this.SetTime(time);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetDodgeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 狂热
     * 每次攻击通过消耗气血或真气来增加攻击力。
     */
    SetCrazy(r: number, a: number, v: number, t: number) {
        this.SetRatio(r);
        this.SetAmount(a);
        this.SetValue(v);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetCrazyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 缴械状态
     */
    SetBarehanded(prob: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetBarehandedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 真气盾，魔法盾
     * 真元护体效果
     *
     * 注：吸收倍率不能为1，且吸收最大伤害要大于1
     * @param ratio     吸收倍率
     * @param amount    可吸收累计的最大伤害
     * @param time
     */
    SetMagicshield(ratio: number, amount: number, time: number): boolean {
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetMagicshieldEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值一次性回血
     */
    SetHeal(prob: number, value: number, ratio: number): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetRatio(ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetHealEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按比例增加真气回复速度
     */
    SetIncmpgen(ratio: number, time: number, buffid: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffid);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetIncmpgenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 随机debuff
     */
    SetOverawe(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetOveraweEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 压制
     * 按数值减少防御
     */
    SetSubdefence(
        prob: number,
        value: number,
        time: number,
        buffid: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffid);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetSubdefenceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按百分比减少防御
     */
    SetDecdefence(
        prob: number,
        ratio: number,
        time: number,
        buffid: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffid);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDecdefenceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按百分比减少伤害
     *
     * 大道效果
     */
    SetDecdamage(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetDecdamageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫眩晕
     */
    SetImmunedizzy(time: number): boolean {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetImmunedizzyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫昏睡
     */
    SetImmunesleep(time: number): boolean {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetImmunesleepEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫魅惑
     */
    SetImmunesilent(time: number): boolean {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetImmunesilentEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫虚弱
     */
    SetImmuneweak(time: number): boolean {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetImmuneweakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫定身
     */
    SetImmunewrap(time: number): boolean {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetImmunewrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫减速
     */
    SetImmuneslow(time: number): boolean {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetImmuneslowEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 真气设置到真气上限的某比例
     */
    SetDrainmagic(prob: number, ratio: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDrainmagicEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 禁食状态
     */
    SetDiet(prob: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetDietEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 救人
     */
    SetSalvation(r: number, v: number, a: number) {
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetSalvationEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 受到伤害增加
     */
    SetInchurt(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetInchurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 随机DeBuff诅咒
     */
    SetRandcurse(
        prob: number,
        ratio: number,
        value: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetRandcurseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * time内，下amount次攻击令目标伤害加深value
     *
     * 每一击使目标X秒内受到伤害叠加
     */
    SetCursed(value: number, amount: number, time: number): boolean {
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetCursedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 神佑
     */
    SetBlessed(value: number, time: number): boolean {
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetBlessedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 固守
     * 提升伤害减免百分比数值。
     *
     * 没懂
     */
    SetPowerup(incdef: number, decatt: number, t: number) {
        this.SetValue(incdef);
        this.SetRatio(decatt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetPowerupEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 受到伤害则增加防御
     * @param prob  概率
     * @param ratio 倍率
     * @param value     addend
     * @param amount    最大值
     * @param time
     */
    SetBloodshield(
        prob: number,
        ratio: number,
        value: number,
        amount: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetBloodshieldEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除冷却
     *
     * 三个参数都是技能id
     */
    SetClearcooldown(ratio: number, value: number, amount: number): boolean {
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetClearcooldownEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 坚守
     * 攻击力降低，防御力增加。
     */
    SetShouyi(adddef: number, subatt: number, t: number) {
        this.SetAmount(adddef);
        this.SetValue(subatt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetShouyiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蓄势
     * 增加下一次攻击伤害
     */
    SetNingjin(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetNingjinEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 二次攻击？！
     */
    SetSecondattack(r: number, v: number, a: number): boolean {
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSecondattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按比例提升全抗
     */
    SetIncanti(ratio: number, time: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetIncantiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按比例减少全抗
     */
    SetDecanti(ratio: number, time: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetDecantiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值增加全抗
     */
    SetAddanti(value: number, time: number, b: number): boolean {
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAddantiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 抗性下降
     * 降低所有抗性。
     */
    SetSubanti(prob: number, value: number, time: number, b: number): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetSubantiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除amount个Buff
     */
    SetClearbuff(prob: number, amount: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetClearbuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除amount个Buff
     *
     * 概率清除amount个持续时间超过value秒的有利状态
     */
    SetClearbuffDuration(prob: number, amount: number, value: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetClearbuffDurationEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 反弹
     *
     * @param prob
     * @param ratio 反弹倍率
     * @param value 反弹次数
     * @param amount 反弹最多的伤害
     * @param time
     */
    SetRetort(
        prob: number,
        ratio: number,
        value: number,
        amount: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetRetortEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加暴击伤害/致命一击伤害
     *
     * @param prob
     * @param ratio 增加的百分比
     * @param time
     * @param buffId
     */
    SetInccrithurt(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetInccrithurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加技能伤害
     *
     * 专注
     */
    SetIncskilldamage(ratio: number, time: number, buffId: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetIncskilldamageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低技能伤害
     */
    SetDecskilldamage(ratio: number, time: number, buffId: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetDecskilldamageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天煞一击
     *
     * 按百分比减少防御
     */
    SetTiansha(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetTianshaEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天煞一击2
     *
     * 按数值减少防御
     */
    SetTiansha2(
        prob: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetTiansha2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 聚气凝元
     * 回血
     */
    SetJuqi(value: number): boolean {
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetJuqiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 真气贯穿
     *
     * @param buffId 伤害值
     */
    SetUniqprompt(buffId: number): boolean {
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetUniqpromptEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 醉酒
     *
     * @param prob
     * @param ratio 增伤比例
     * @param time
     */
    SetDrunk(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetValue(0); //醉酒减少的昏睡还是什么，两个，都改为0得了
        this.SetAmount(0);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetDrunkEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 辣！
     * 吃辣椒
     *
     * @param prob
     * @param value 扣血数值
     * @param amount 扣蓝数值
     * @param time
     */
    SetSpicy(prob: number, value: number, amount: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSpicyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 驱除流血燃魔效果
     *
     * @param prob
     * @param value     id
     * @param amount    id
     * @param buffId    id
     *
     * id的数值从0~19,对应的状态在IDA里查询过滤器
     */
    SetExorcism(
        prob: number,
        value: number,
        amount: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetExorcismEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低气血
     *
     * @param prob
     * @param value     降多少血
     * @param amount    最多降多少（但是内部额外的计算最多是当前血量的一半）
     * @param time
     * @param buffId
     */
    SetSubhp(
        prob: number,
        value: number,
        amount: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSubhpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低真气
     *
     * @param prob
     * @param value     降多少蓝
     * @param amount    最多降多少
     * @param time
     * @param buffId
     */
    SetSubmp(
        prob: number,
        value: number,
        amount: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSubmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低攻击力
     */
    SetSubattack(
        prob: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetSubattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置增加家族攻击力
     */
    SetFamilyincattack(ratio: number, value: number, time: number): boolean {
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetFamilyincattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置增加家族气血
     */
    SetFamilyinchp(ratio: number, value: number, time: number): boolean {
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetFamilyinchpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置增加家族真气
     */
    SetFamilyincmp(ratio: number, value: number, time: number): boolean {
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetFamilyincmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值减少防御
     * 持续减少
     * 用于法阵
     */
    SetCycsubdefence(prob: number, amount: number, time: number, b: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetTime(time);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetCycsubdefenceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按数值减少攻击
     * 持续减少
     * 用于法阵
     */
    SetCycsubattack(prob: number, amount: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetCycsubattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按比例减少防御
     * 持续减少
     * 用于法阵
     */
    SetCycdecdefence(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetCycdecdefenceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 按比例减少攻击
     * 持续减少
     * 用于法阵
     */
    SetCycdecattack(prob: number, ratio: number, time: number, b: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetCycdecattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 迷惘诅咒
     * 降低致命一击率。
     * 按比例降低暴击率
     */
    SetDeccritrate(
        prob: number,
        time: number,
        ratio: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDeccritrateEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低暴击伤害
     */
    SetDeccrithurt(
        prob: number,
        time: number,
        ratio: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDeccrithurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低目标普攻躲闪
     */
    SetDecdodge(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetDecdodgeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 受伤叠加攻击
     * 受到攻击增加攻击力
     * @param prob
     * @param ratio 叠加倍率
     * @param value addend
     * @param amount 多少次
     * @param time
     */
    SetFrenzied(
        prob: number,
        ratio: number,
        value: number,
        amount: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetFrenziedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 诅咒法阵
     * 设置每多少秒释放一次阵法效果
     *
     * @param ratio
     * @param value
     * @param amount 法阵id，好像设置1就行
     * @param time
     */
    SetEvilaura(
        ratio: number,
        value: number,
        amount: number,
        time: number,
    ): boolean {
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetEvilauraEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 祝福阵法
     * 设置每多少秒释放一次阵法效果
     */
    SetHolyaura(time: number, amount: number): boolean {
        this.SetTime(time);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetHolyauraEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 冰壳
     * 冰封，无法移动，同时持续回复气血并增加防御力，免疫流血效果。
     *
     * @param prob
     * @param amount    回复气血？
     * @param value     addon
     * @param time
     */
    SetIceshield(
        prob: number,
        amount: number,
        value: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetIceshieldEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 抗性汇聚
     *
     * @param ratio     转化率
     * @param amount    转化到哪个抗性
     * @param value     额外附加X点
     * @param time
     */
    SetFocusanti(
        ratio: number,
        amount: number,
        value: number,
        time: number,
    ): boolean {
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetFocusantiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 抗性分散
     *
     * @param ratio     平均多少倍
     * @param time
     */
    SetDisperseanti(ratio: number, time: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetDisperseantiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低普攻命中
     */
    SetDecaccuracy(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDecaccuracyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加回血比例
     */
    SetIncheal(ratio: number, time: number, buffId: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetInchealEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 吸血。攻击回血
     *
     * @param prob  概率
     * @param ratio 吸血比例
     * @param time
     */
    SetAttack2hp(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAttack2hpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 吸蓝。攻击回蓝
     *
     * @param prob  概率
     * @param ratio 吸蓝比例
     * @param time
     */
    SetAttack2mp(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAttack2mpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蛊痛
     * 持续减少气血值
     *
     * @param prob
     * @param amount 流血总量
     * @param value  addtion附加什么？！
     * @param time
     * @param buffId
     */
    SetHpleak1(
        prob: number,
        amount: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetHpleak1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蛊伤  伤蛊
     * 持续减少气血值
     *
     * @param prob
     * @param amount 流血总量
     * @param value  addtion附加什么？！
     * @param time
     * @param buffId
     */
    SetHpleak2(
        prob: number,
        amount: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetHpleak2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蛊毒
     * 持续减少气血值
     *
     * @param prob
     * @param amount 流血总量
     * @param value  addtion附加什么？！
     * @param time
     * @param buffId
     */
    SetHpleak3(
        prob: number,
        amount: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetHpleak3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 扣蓝？蓝不够扣血？
     */
    SetMpdisperse(prob: number, amount: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetMpdisperseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 怨念羁縻
     * 无法使用普通攻击
     */
    SetPowerless(prob: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetPowerlessEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 孤寂
     * 无法攻击及使用技能，也无法被攻击
     */
    SetAloof(prob: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetAloofEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 折磨
     * 持续受到攻击
     *
     * @param prob
     * @param value 受到的伤害
     * @param time
     */
    SetBleeding(prob: number, value: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetBleedingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 白字伤害
     */
    SetDirecthurt(prob: number, value: number): boolean {
        this.SetProbability(prob);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDirecthurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 白字攻击
     *
     * 计算技能的伤害和目标的防御力
     */
    SetDirectattack(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetDirectattackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 迷茫
     * 周期眩晕。
     *
     * @param prob
     * @param time  duration 持续时间
     * @param value cycle 周期
     * @param amount period 效果时间
     */
    SetDizzytimer(
        prob: number,
        time: number,
        value: number,
        amount: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDizzytimerEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 困顿
     * 周期定身。
     *
     * @param prob
     * @param time  duration 持续时间
     * @param value cycle 周期
     * @param amount period 效果时间
     */
    SetWraptimer(
        prob: number,
        time: number,
        value: number,
        amount: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetWraptimerEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 魅心
     * 周期魅惑。
     *
     * @param prob
     * @param time  duration 持续时间
     * @param value cycle 周期
     * @param amount period 效果时间
     */
    SetSilenttimer(
        prob: number,
        time: number,
        value: number,
        amount: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSilenttimerEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 昏厥
     * 周期昏睡。
     *
     * @param prob
     * @param time  duration 持续时间
     * @param value cycle 周期
     * @param amount period 效果时间
     */
    SetSleeptimer(
        prob: number,
        time: number,
        value: number,
        amount: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetSleeptimerEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 魔法门，传送
     *
     * @param prob
     * @param time  map
     * @param value  x
     * @param amount y 傻逼完美拿Y当高度
     * @param buffId z
     */
    SetMagicdoor(
        prob: number,
        time: number,
        value: number,
        amount: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetMagicdoorEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 魔魂姿态
     * 增加气血上限、攻击力、防御力，降低抗性。
     *
     * @param prob addhp 附加气血
     * @param buffId addmp 附加真气
     * @param value addattack 附加攻击
     * @param ratio adddefence 附加防御
     * @param amount addanti 附加抗性（魔魂这个值是负的，所以是降抗）
     */
    SetGhostform(
        prob: number,
        buffId: number,
        value: number,
        ratio: number,
        amount: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetBuffid(buffId);
        this.SetValue(value);
        this.SetRatio(ratio);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetGhostformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蛊王姿态
     * 增加真气上限、攻击力、抗性，降低防御力
     *
     * @param prob addhp 附加气血
     * @param buffId addmp 附加真气
     * @param value addattack 附加攻击
     * @param ratio adddefence 附加防御（蛊王这个值是负的，所以是降低防御）
     * @param amount addanti 附加抗性
     */
    SetInsanityform(
        prob: number,
        buffId: number,
        value: number,
        ratio: number,
        amount: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetBuffid(buffId);
        this.SetValue(value);
        this.SetRatio(ratio);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetInsanityformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 制造物品
     * 详细代码在gs中object_interface
     *
     */
    SetCreateitem(
        prob: number,
        value: number,
        amount: number,
        ratio: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetRatio(ratio);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetCreateitemEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 闪避秘言
     * 每次受到伤害增加普攻闪躲
     *
     * @param ratio 每次增加多少
     * @param value addend
     * @param amount 最大增加多少次
     * @param prob 概率
     * @param time 持续时间
     */
    SetDodgeregain(
        ratio: number,
        value: number,
        amount: number,
        prob: number,
        time: number,
    ): boolean {
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDodgeregainEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 回春秘言
     * 每次受到伤害恢复气血。
     *
     * @param ratio 每次增加多少
     * @param value addend
     * @param amount 最大增加多少次
     * @param prob 概率
     * @param time 持续时间
     */
    SetHpregain(
        ratio: number,
        value: number,
        amount: number,
        prob: number,
        time: number,
    ): boolean {
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetHpregainEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 命运祝福
     * 当气血低于一定比例时，忽略对自身造成死亡的伤害。
     *
     * @param ratio 低于的比例
     * @param amount 最大增加多少次
     * @param prob 概率
     * @param time 持续时间
     */
    SetDeadlybless(
        ratio: number,
        amount: number,
        prob: number,
        time: number,
    ): boolean {
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDeadlyblessEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 会心一击
     * 增加技能命中。
     */
    SetIncskillaccu(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetIncskillaccuEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 破魔诅咒
     * 降低技能命中。
     */
    SetDecskillaccu(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetDecskillaccuEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 轻盈护体
     * 增加技能躲闪。
     */
    SetIncskilldodge(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetIncskilldodgeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 迟钝护体
     * 降低技能闪躲。
     */
    SetDecskilldodge(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetDecskilldodgeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 厄运诅咒
     * 增加被致命一击概率。
     * 降低减免致命一击率
     */
    SetIncfatalratio(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetIncfatalratioEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 幸运祝福
     * 降低被致命一击概率。
     */
    SetDecfatalratio(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetDecfatalratioEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 雷霆诅咒
     * 增加被致命一击伤害。
     */
    SetIncfatalhurt(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetIncfatalhurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天佑祝福
     * 降低被致命一击伤害。
     */
    SetDecfatalhurt(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetDecfatalhurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 令技能进入冷却时间
     *
     * @param prob
     * @param ratio 技能id
     * @param amount 技能id
     * @param value 技能id
     * @param time 冷却时间
     */
    SetSetcooldown(
        prob: number,
        ratio: number,
        amount: number,
        value: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSetcooldownEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 众望所归
     * 持续获得经验。
     *
     * @param prob
     * @param amount 经验总数
     * @param time 时间
     */
    SetExpboost(prob: number, amount: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetExpboostEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 改：受到不利状态时间减少20%
     *
     * 先知先觉
     * 持续获得声望。
     *
     * @param prob
     * @param value index 声望index
     * @param amount credit 获得的声望数值
     * @param time 持续时间
     */
    SetCreditboost(
        prob: number,
        value: number,
        amount: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetCreditboostEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 反制庇佑
     * 反弹技能攻击中所附加的状态效果，计算抗性
     */
    SetRejectdebuff(prob: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetRejectdebuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 添加不利Buff（未整理）
     */
    SetAdddebuff(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAdddebuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 荆棘护体
     * 受到攻击溅射伤害。
     *
     * @param value 半径
     * @param prob 概率
     * @param ratio 倍率
     * @param amount 附加伤害
     * @param buffId 总次数
     * @param time 时间
     */
    SetHurtscatter(
        value: number,
        prob: number,
        ratio: number,
        amount: number,
        buffId: number,
        time: number,
    ): boolean {
        this.SetValue(value);
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetBuffid(buffId);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetHurtscatterEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 死亡诅咒
     * 如果自身在一定时间之内死亡，则对周围目标\r造成攻击力一定比例的伤害。
     *
     * @param value 半径
     * @param prob 概率
     * @param ratio 倍率
     * @param amount 附加伤害
     * @param buffId 影响人数
     * @param time 时间
     */
    SetDeathscatter(
        value: number,
        prob: number,
        ratio: number,
        amount: number,
        buffId: number,
        time: number,
    ): boolean {
        this.SetValue(value);
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetBuffid(buffId);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetDeathscatterEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 传送到配偶身边
     */
    SetJumptospouse(): boolean {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetJumptospouseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 勇气
     * 增加攻击力。
     */
    SetAddattack2(
        prob: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetValue(value);
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetAddattack2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 烟雨
     * 增加防御力
     *
     * @param prob 概率
     * @param ratio 倍率
     * @param value addend
     * @param time 时间
     * @param buffId 总次数
     */
    SetYanyu(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetYanyuEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 火焰灼烧
     * 受到火焰伤害。
     *
     * @param prob
     * @param time 持续时间
     * @param amount 总伤害
     * @param value 附加什么addtion
     * @param buffId
     */
    SetHpleak4(
        prob: number,
        time: number,
        amount: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetHpleak4Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 鬼王力量
     * 鬼王力量，增加攻击力
     */
    SetIncattack2(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetIncattack2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 咒怨之怒
     * 一定时间之后额外追加伤害。
     *
     * @param prob
     * @param time 持续时间
     * @param amount 总伤害
     * @param value 最后额外的附加伤害
     * @param buffId
     */
    SetHpleak5(
        prob: number,
        time: number,
        amount: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetHpleak5Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 妄念祝福
     * 增加气血上限，降低受到的致命一击伤害，不\r可被驱散。
     *
     * @param prob
     * @param value 气血上限
     * @param amount 降低被致命一击伤害
     * @param time
     * @param buffId
     */
    SetAddhp2(
        prob: number,
        value: number,
        amount: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetAddhp2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 倾情
     * 增加攻击力。
     */
    SetIncattack3(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetIncattack3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 祈福
     * 增加气血上限。
     */
    SetInchp2(ratio: number, time: number, buffId: number): boolean {
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetInchp2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 混乱诅咒
     * 受到攻击时伤害增加。
     * 黯然之痛也用这个
     */
    SetInchurt2(prob: number, ratio: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetInchurt2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 相思之苦
     * 持续减少气血。
     *
     * @param prob
     * @param amount damage伤害总量
     * @param time 持续时间
     * @param value addtion 最后一次附加的伤害
     * @param buffId
     */
    SetHpleak6(
        prob: number,
        amount: number,
        time: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetAmount(amount);
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetHpleak6Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 五气朝元
     * 增加真气上限。
     *
     * @param prob
     * @param ratio 倍率
     * @param value 额外附加
     * @param time
     * @param buffId
     */
    SetZhaoqi(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetZhaoqiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天尊法身
     * 增加气血上限，增加致命一击率。
     *
     * @param prob
     * @param ratio 暴击
     * @param value 气血
     * @param time
     * @param buffId
     */
    SetFashen(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetFashenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 慈悲之心
     * 增加气血上限。
     *
     * @param prob
     * @param ratio 倍率
     * @param value 额外附加
     * @param time
     * @param buffId
     */
    SetCibei(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetCibeiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天音普渡
     * 天音普渡。
     */
    SetIncdefence2(
        prob: number,
        ratio: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetIncdefence2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 空即是色
     * 增加四大皆空法术抗性提升效果，并使自身攻击力增加。
     * 使自身攻击力增加。
     */
    SetAddattack3(
        prob: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetAddattack3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天鼓祝福
     * 增加气血上限。
     *
     * @param prob
     * @param ratio 倍率
     * @param value 额外附加
     * @param time
     * @param buffId
     */
    SetTiangu(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetTianguEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 大梵般若
     * 增加攻击力，并每2秒回复自身一定比例的气血\r值。
     *
     * @param prob
     * @param ratio 攻击倍率
     * @param amount 额外附加
     * @param value 每秒增加多少
     * @param time 持续时间
     * @param buffId
     */
    SetBanruo(
        prob: number,
        ratio: number,
        amount: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetBanruoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 怨鬼心魔
     * 降低技能伤害，防御力降低。
     *
     * @param prob
     * @param ratio 降低倍率
     * @param value 每秒增加多少
     * @param time 持续时间
     * @param buffId
     */
    SetXinmo(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetXinmoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 邪神傲世
     * 增加攻击力、防御力、气血上限、真气上限。
     *
     * @param prob
     * @param ratio 提高倍率
     * @param amount 额外附加
     * @param value 每秒增加多少
     * @param time 持续时间
     * @param buffId
     */
    SetAoshi(
        prob: number,
        ratio: number,
        amount: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetAoshiEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虎魄冰晶
     * 增加攻击力。
     *
     * @param prob
     * @param ratio 倍率
     * @param value 额外附加
     * @param time
     * @param buffId
     */
    SetHupo(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetHupoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 龟灵冰晶
     * 增加防御力。
     *
     * @param prob
     * @param ratio 倍率
     * @param value 额外附加
     * @param time
     * @param buffId
     */
    SetGuilin(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetGuilinEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天罡战意
     * 增加攻击力。
     *
     * @param prob
     * @param value 增加多少
     * @param time
     * @param buffId
     */
    SetAddattack4(
        prob: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetAddattack4Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天罡云体
     * 增加各项抗性。
     *
     * @param prob
     * @param value 增加多少
     * @param time
     * @param buffId
     */
    SetAddanti2(
        prob: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAddanti2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天罡步尘
     * 增加普攻闪躲。
     *
     * @param prob
     * @param value 增加多少
     * @param time
     * @param buffId
     */
    SetAdddodge2(
        prob: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAdddodge2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 永结同心
     * 增加攻击力（情侣技能）。
     *
     * @param prob
     * @param ratio 增加倍率
     * @param value 额外增加多少
     * @param time
     * @param buffId
     */
    SetTongxin(
        prob: number,
        ratio: number,
        value: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetTongxinEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置更新通用数据？！
     */
    SetUpdatecommondata(prob: number, _amount: number, value: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(value);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetUpdatecommondataEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置通用数据？！
     */
    SetSetcommondata(prob: number, _amount: number, value: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(value);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSetcommondataEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 敏捷
     * 专用增加普攻命中和躲闪。
     *
     * @param prob
     * @param amount 命中
     * @param value 躲闪
     * @param buffId
     */
    SetBaradddogeaccu(
        prob: number,
        _amount: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetAmount(value);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetBaradddogeaccuEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 发现？！
     */
    SetDiscover(value: number): boolean {
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetDiscoverEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 抓宠物
     */
    SetCatchpet(prob: number, time: number): boolean {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetCatchpetEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虎魄冰晶(VIP奖励)
     * 增加攻击力。
     *
     * @param prob
     * @param ratio 倍率
     * @param value 额外附加
     * @param buffId
     */
    SetViphupo(
        prob: number,
        ratio: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetViphupoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 龟灵冰晶(VIP奖励)
     * 增加防御力。
     *
     * @param prob
     * @param ratio 倍率
     * @param value 额外附加
     * @param buffId
     */
    SetVipguilin(
        prob: number,
        ratio: number,
        value: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetVipguilinEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤兽
     * 具体代码在gs中的object_interface
     */
    SetSummon(
        prob: number,
        value: number,
        amount: number,
        time: number,
        ratio: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);
        this.SetRatio(ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetSummonEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 受攻击回血？
     * 真实伤害*倍率
     */
    SetExtracthp(prob: number, ratio: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetExtracthpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 受攻击回蓝？
     * 真实伤害*倍率
     */
    SetExtractmp(prob: number, ratio: number): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetExtractmpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 恐惧
     * 令怪物目标逃跑，虚弱玩家目标。
     *
     * @param prob
     * @param ratio 成功率
     * @param distance 逃跑的距离
     * @param time
     */
    SetFear(
        prob: number,
        ratio: number,
        distance: number,
        time: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetValue(distance);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetFearEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 龙骧
     * 姿态，增加攻击力。
     */
    SetLongxiang(
        prob: number,
        attack_ratio: number,
        defend_ratio: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetAmount(attack_ratio);
        this.SetValue(defend_ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetLongxiangEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虎踞
     * 姿态，增加防御力。
     */
    SetHuju(prob: number, attack_ratio: number, defend_ratio: number): boolean {
        this.SetProbability(prob);
        this.SetAmount(attack_ratio);
        this.SetValue(defend_ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetHujuEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 斗魂
     * 增加致命一击率和致命一击伤害，真气消耗一定比例转化为气血消耗。
     * （转化效果只对九黎本身生效）
     *
     * 底层增加爆伤为爆率*10
     *
     * 斗魂技能状态改为了斗魂2
     */
    SetDouhun(
        ratio_mp2hp: number,
        add_crit_rate: number,
        discount: number,
    ): boolean {
        this.SetAmount(ratio_mp2hp);
        this.SetRatio(add_crit_rate);
        this.SetValue(discount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetDouhunEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 钢胆
     * 增加减免致命一击率和致命一击伤害，气血消耗一定比例转化为真气消耗。
     * （转化效果只对九黎本身生效）
     *
     * 底层减免爆伤为爆率*10
     */
    SetGangdan(
        ratio_mp2hp: number,
        dec_crit_rate: number,
        discount: number,
        buffId: number,
    ): boolean {
        this.SetAmount(ratio_mp2hp);
        this.SetRatio(dec_crit_rate);
        this.SetValue(discount);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetGangdanEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 疾如风
     * 姿态，增加移动速度。
     */
    SetAswind(add_speed: number, slow_resist: number): boolean {
        this.SetAmount(add_speed);
        this.SetValue(slow_resist);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetAswindEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 徐如林
     * 姿态，增加普攻闪躲。
     */
    SetAsforest(add_dodge: number, add_skill_dodge: number): boolean {
        this.SetAmount(add_dodge);
        this.SetValue(add_skill_dodge);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAsforestEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 侵如火
     * 姿态，增加攻击力、虚弱抗性。
     */
    SetAsfire(add_attack: number, weak_resist: number): boolean {
        this.SetAmount(add_attack);
        this.SetValue(weak_resist);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetAsfireEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 安如山
     * 姿态，增加防御力、被致命一击率。
     */
    SetAshill(add_defence: number, dec_crit_rate: number): boolean {
        this.SetAmount(add_defence);
        this.SetValue(dec_crit_rate);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetAshillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 暴杀
     * 下一次攻击必然是致命一击。
     */
    SetMakecrit(time: number) {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetMakecritEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 幻化
     */
    SetBackorigin(prob: number, value: number, time: number) {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetBackoriginEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 狐影术
     * 变身为灵狐，增加移动速度，免疫定身和减速效果。
     */
    SetFoxstate(prob: number, addend: number) {
        this.SetProbability(prob);
        this.SetValue(addend);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetFoxstateEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蚩魂
     * 免疫致命一击和多种负面状态，增加气血上限、攻击力。
     */
    SetChihun(
        prob: number,
        time: number,
        attack_ratio: number,
        hpgen_ratio: number,
        buffId: number,
    ) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(attack_ratio);
        this.SetAmount(hpgen_ratio);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetChihunEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 驱散状态
     *
     * 三个参数均为状态的id
     *
     * 如果驱散的id大于4095直接填，
     * 多buff id 的，小于4095要减去4300，再除以10
     */
    SetDispel(prob: number, ratio: number, amount: number, value: number) {
        this.SetProbability(prob);
        this.SetRatio(ratio);
        this.SetAmount(amount);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetDispelEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加骑乘速度
     */
    SetIncmountspeed(prob: number, time: number, value: number, buffId: number) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetIncmountspeedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 囚禁
     * 只允许在某特定区域内移动。
     *
     * 被攻击者为中心的半径：value
     */
    SetPermitcyclearea(prob: number, value: number, time: number) {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetPermitcycleareaEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 阻止
     * 无法在某特定区域内移动。
     *
     * 被攻击者为中心的半径：value
     */
    SetLimitcyclearea(prob: number, value: number, time: number) {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetLimitcycleareaEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 囚禁
     * 只允许在某特定区域内移动。
     *
     * 被攻击者为中心的半径：value
     */
    SetJailpermitcyclearea(prob: number, value: number, time: number) {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22SetJailpermitcycleareaEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 阻止
     *
     * 被攻击者为中心的半径：value
     */
    SetJaillimitcyclearea(prob: number, value: number, time: number) {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetJaillimitcycleareaEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 原灵术
     * 变身为原灵，增加移动速度，免疫定身和减速\r效果。
     */
    SetYuanling(prob: number, addend: number) {
        this.SetProbability(prob);
        this.SetValue(addend);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetYuanlingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 地煞·形
     * 体型变大，增加攻击力、气血上限、技能释放时间。
     */
    SetGuishen1debuff(
        prob: number,
        time: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        hpRatio: number,
    ) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(hpRatio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetGuishen1debuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 地煞·神
     * 体型变大，增加攻击力、致命一击率、技能释放时间。
     */
    SetGuishen2debuff(
        prob: number,
        time: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        crit: number,
    ) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(crit);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetGuishen2debuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天罡·形
     * 体型变小，降低攻击力、气血上限、技能释放时间。
     */
    SetTuoling1debuff(
        prob: number,
        time: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        defenseRatio: number,
    ) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(defenseRatio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetTuoling1debuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天罡·神
     * 体型变小，降低攻击力、被致命一击率、技能释放时间。
     */
    SetTuoling2debuff(
        prob: number,
        time: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        antiCrit: number,
    ) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(antiCrit);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetTuoling2debuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 残废
     * 所有技能释放等级降低。
     */
    SetCrippleddebuff(prob: number, time: number, dec_skill_lvl: number) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(dec_skill_lvl);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetCrippleddebuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无视
     * 撞我试试呗
     */
    SetPzhill(time: number) {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetPzhillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 悲剧
     * 动不了鸟
     */
    SetPznomove(time: number) {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetPznomoveEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 抓狂
     * 混乱中，请远离
     */
    SetPzchaos(time: number) {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetPzchaosEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 猥琐
     * 看见我又能怎样
     */
    SetPzvoid(time: number) {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetPzvoidEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 夕
     * 暗系攻击技能冷却时间减少。
     */
    SetJuniordarkform(
        prob: number,
        dec_dark_skill_cd: number,
        inc_dark_light: number,
    ) {
        this.SetProbability(prob);
        this.SetRatio(dec_dark_skill_cd);
        this.SetValue(inc_dark_light);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetJuniordarkformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 晖
     * 光系攻击技能冷却时间减少。
     */
    SetJuniorlightform(
        prob: number,
        dec_light_skill_cd: number,
        dec_dark_light: number,
    ) {
        this.SetProbability(prob);
        this.SetRatio(dec_light_skill_cd);
        this.SetValue(dec_dark_light);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetJuniorlightformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 介
     * 暗系攻击技能冷却时间减少，且优先由灵释放。
     */
    SetSeniordarkform(
        prob: number,
        dec_dark_skill_cd: number,
        inc_dark_light: number,
        spirit_gen_interval: number,
        mp: number,
        anti: number,
    ) {
        this.SetProbability(prob);
        this.SetRatio(dec_dark_skill_cd);
        this.SetValue(inc_dark_light);
        this.SetAmount(spirit_gen_interval);
        this.SetTime(mp);
        this.SetBuffid(anti);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetSeniordarkformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 由
     * 光系攻击技能冷却时间减少，且优先由灵释放。
     */
    SetSeniorlightform(
        prob: number,
        dec_light_skill_cd: number,
        dec_dark_light: number,
        spirit_gen_interval: number,
        mp: number,
        anti: number,
    ) {
        this.SetProbability(prob);
        this.SetRatio(dec_light_skill_cd);
        this.SetValue(dec_dark_light);
        this.SetAmount(spirit_gen_interval);
        this.SetTime(mp);
        this.SetBuffid(anti);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetSeniorlightformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无间
     * 光暗两系攻击技能冷却时间减少，且优先由灵释放。
     */
    SetDarkuniform(
        prob: number,
        dec_dark_skill_cd: number,
        inc_dark_light: number,
        spirit_gen_interval: number,
        mp: number,
        anti: number,
    ) {
        this.SetProbability(prob);
        this.SetRatio(dec_dark_skill_cd);
        this.SetValue(inc_dark_light);
        this.SetAmount(spirit_gen_interval);
        this.SetTime(mp);
        this.SetBuffid(anti);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDarkuniformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无间
     * 光暗两系攻击技能冷却时间减少，且优先由灵释放。
     */
    SetLightuniform(
        prob: number,
        dec_dark_skill_cd: number,
        dec_dark_light: number,
        spirit_gen_interval: number,
        mp: number,
        anti: number,
    ) {
        this.SetProbability(prob);
        this.SetRatio(dec_dark_skill_cd);
        this.SetValue(dec_dark_light);
        this.SetAmount(spirit_gen_interval);
        this.SetTime(mp);
        this.SetBuffid(anti);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetLightuniformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 霁云
     * 吸收受到的伤害。
     */
    SetDechurt2(ratio: number, max: number, time: number) {
        this.SetRatio(ratio);
        this.SetAmount(max);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetDechurt2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 走戈
     * 可以使用走戈技能回到原来位置。
     */
    SetRecordpos(prob: number, time: number) {
        this.SetProbability(prob);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetRecordposEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 返回位置
     */
    SetReturnpos(prob: number) {
        this.SetProbability(prob);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetReturnposEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 翔
     * 飞行术。
     */
    SetFly(prob: number, speed: number, time: number) {
        this.SetProbability(prob);
        this.SetValue(speed);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper6SetFlyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 什么攻击
     *
     * buffId：self：buffid==0
     */
    SetActivebeattacked(
        prob: number,
        skill_level: number,
        skill_id: number,
        time: number,
        buffId: number,
    ) {
        this.SetProbability(prob);
        this.SetRatio(skill_level);
        this.SetValue(skill_id);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetActivebeattackedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 冥
     * 持续产生幻象，抵御攻击。
     *
     * @param prob
     * @param time
     * @param value mirrorCnt，currMirrorCnt
     * @param amount genMirrorInterval,counter
     */
    SetMirrorimage(prob: number, time: number, value: number, amount: number) {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetMirrorimageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 和合
     * 使用职业技能后有概率立即冷却。
     *
     * value：多少概率冷却
     */
    SetInstantskill(prob: number, time: number, value: number) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetInstantskillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤技能
     */
    SetSummonskill(summonid: number, skillid: number, skilllevel: number) {
        this.SetValue(summonid);
        this.SetAmount(skillid);
        this.SetRatio(skilllevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSummonskillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 嗜血2
     */
    SetBloodthirsty2(prob: number, time: number, hpratio: number) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(hpratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetBloodthirsty2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 保护罩
     * 受到攻击时削减伤害。
     */
    SetDarklaser(prob: number, time: number, value: number) {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetDarklaserEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 自动复活
     * buff索引 244
     */
    SetAutorescurrect(time: number, hp_ratio: number, exp_ratio: number) {
        this.SetTime(time);
        this.SetValue(hp_ratio);
        this.SetRatio(exp_ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetAutorescurrectEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加什么灵？
     * 辰皇？
     */
    SetAddspirit(prob: number, spirit_type: number, spirit_cnt: number) {
        this.SetProbability(prob);
        this.SetRatio(spirit_type);
        this.SetAmount(spirit_cnt);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAddspiritEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 未知
     *
     */
    SetDirstate(time: number, dir: number, state_id: number) {
        this.SetTime(time);
        this.SetValue(dir);
        this.SetAmount(state_id);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetDirstateEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 团队附魔？
     */
    SetTeamenchant(
        prob: number,
        skillid: number,
        skilllevel: number,
        radius: number,
        mc: number,
    ) {
        this.SetProbability(prob);
        this.SetValue(skillid);
        this.SetRatio(skilllevel);
        this.SetAmount(radius);
        this.SetBuffid(mc);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetTeamenchantEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * GT 气血回复速度
     *
     * 245
     */
    SetGthpgen(time: number, health: number, buffId: number) {
        this.SetValue(time);
        this.SetAmount(health);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetGthpgenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * GT 真气回复速度
     * 246
     */
    SetGtmpgen(time: number, health: number, buffId: number) {
        this.SetValue(time);
        this.SetAmount(health);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetGtmpgenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * GT 增加攻击防御
     */
    SetGtaddattackdefense(
        attack_ratio: number,
        defense_ratio: number,
        buffId: number,
    ) {
        this.SetValue(defense_ratio);
        this.SetAmount(attack_ratio);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetGtaddattackdefenseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    SetShowyb(time: number) {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetShowybEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 送福
     * 你收到了圣诞老人的祝福
     *
     * @param time
     * @param recoverHpSpeed
     */
    SetRecoverhp(time: number, recoverHpSpeed: number) {
        this.SetTime(time);
        this.SetValue(recoverHpSpeed);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetRecoverhpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置装备效果
     */
    SetEquipeffect(time: number, equip_type: number, level: number) {
        this.SetTime(time);
        this.SetValue(equip_type);
        this.SetAmount(level);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetEquipeffectEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 牵机召唤小机器人
     */
    SetSummonmachine(a: number, r: number, v: number, t: number) {
        this.SetAmount(a);
        this.SetRatio(r);
        this.SetValue(v);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSummonmachineEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 牵机陷阱
     */
    SetSummontrap(r: number, v: number, a: number, t: number) {
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetSummontrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤控制陷阱
     */
    SetSummoncontroltrap(r: number, v: number, a: number, t: number) {
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetSummoncontroltrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤传送效果1
     */
    SetSummonteleport1(p: number, r: number, v: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetSummonteleport1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤传送效果2
     */
    SetSummonteleport2(p: number, r: number, v: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetSummonteleport2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 诅咒传送
     */
    SetCurSeteleport(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetCurSeteleportEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 间谍陷阱？！
     */
    SetSpytrap(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetSpytrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置速度为
     */
    SetSpeedto(p: number, speed: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(speed);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetSpeedtoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤物牵机
     */
    SetPossummon(v: number, a: number, t: number) {
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetPossummonEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 木甲姿态
     */
    SetPuppetform(num: number, need_mp: number) {
        this.SetValue(num);
        this.SetRatio(need_mp);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPuppetformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 木甲特技
     */
    SetPuppetskill(immune_prob: number, skill_id: number, t: number) {
        this.SetProbability(immune_prob);
        this.SetValue(skill_id);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPuppetskillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 跳起来？
     */
    SetBounceto(p: number, v: number) {
        this.SetProbability(p);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetBouncetoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 拽到跟前
     */
    SetDrawto(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetDrawtoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 眩晕抗性下降叠加
     * 根据层数持续降低眩晕抗性。
     */
    SetSubantidizzy2(p: number, v: number, overlay_cnt: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(overlay_cnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSubantidizzy2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 昏睡抗性下降叠加
     * 根据层数持续降低昏睡抗性。
     */
    SetSubantisleep2(p: number, v: number, overlay_cnt: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(overlay_cnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSubantisleep2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虚弱抗性下降叠加
     * 根据层数持续降低虚弱抗性。
     */
    SetSubantiweak2(p: number, v: number, overlay_cnt: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(overlay_cnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSubantiweak2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 魅惑抗性下降叠加
     * 根据层数持续降低魅惑抗性。
     */
    SetSubantisilent2(p: number, v: number, overlay_cnt: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(overlay_cnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetSubantisilent2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 定身抗性下降叠加
     * 根据层数持续降低定身抗性。
     */
    SetSubantiwrap2(p: number, v: number, overlay_cnt: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(overlay_cnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSubantiwrap2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 减速抗性下降叠加
     * 根据层数持续降低减速抗性。
     */
    SetSubantislow2(p: number, v: number, overlay_cnt: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(overlay_cnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSubantislow2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 气血上限持续下降叠加
     * 根据层数持续降低气血上限。
     */
    SetSubhp2(p: number, v: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetSubhp2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 真气上限持续下降叠加
     * 根据层数持续降低真气上限。
     */
    SetSubmp2(p: number, v: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetSubmp2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 种子
     * 部分牵机技能可引爆，危险请远离。
     */
    SetSeed(p: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetSeedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 麒麟形态
     * 可与队友共同骑乘战斗。
     */
    SetQilinform(p: number, speed: number) {
        this.SetProbability(p);
        this.SetValue(speed);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetQilinformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 人类形态
     * 无法战斗。
     */
    SetRmhumanform(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetRmhumanformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 旋风
     * 持续攻击周围所有敌人。
     *
     * @param p
     * @param r 倍率
     * @param plus 附加伤害
     * @param crit_rate 暴击率
     * @param t
     */
    SetCycleskill(
        p: number,
        r: number,
        plus: number,
        crit_rate: number,
        t: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetValue(plus);
        this.SetAmount(crit_rate);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetCycleskillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 不朽
     * 免疫伤害且持续增加怒气。
     */
    SetBuxiu(p: number, rage: number, t: number) {
        this.SetProbability(p);
        this.SetValue(rage);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetBuxiuEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 击退2
     */
    SetRepel2(p: number, rage: number) {
        this.SetProbability(p);
        this.SetValue(rage);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetRepel2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 吹飞一下？
     */
    SetBlowoff(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetBlowoffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 嘲讽2
     * 目标不受控制并强制攻击施法者。
     */
    SetAssault2(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAssault2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 扔回去？
     */
    SetThrowback(p: number, v: number) {
        this.SetProbability(p);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetThrowbackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 防阈
     * 被攻击增加怒气。
     */
    SetAddrage1(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAddrage1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 攻阈
     * 攻击增加怒气。
     */
    SetAddrage2(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAddrage2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 人马1
     */
    SetRenma1(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetRenma1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 人马2
     */
    SetRenma2(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetRenma2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 人马3
     */
    SetRenma3(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetRenma3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 人马4
     */
    SetRenma4(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetRenma4Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤兽分担伤害
     * 受到的部分伤害转移给召唤兽承受。
     */
    SetSharelifewithsummon(p: number, r: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22SetSharelifewithsummonEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 减少技能CD
     * 减少技能冷却
     */
    SetReduceskillcd(
        p: number,
        skill_id: number,
        skill_id2: number,
        skill_id3: number,
        cooldown_msec: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(skill_id);
        this.SetAmount(skill_id2);
        this.SetBuffid(skill_id3);
        this.SetValue(cooldown_msec);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetReduceskillcdEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 伤害累积爆发
     * 受到的部分伤害数值累积到一定时间后总爆发。
     */
    SetAccumdamage(p: number, ratio: number, max_damage: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(ratio);
        this.SetAmount(max_damage);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetAccumdamageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 血盾
     * 额外增加一条新的气血槽来抵御受到的伤害。
     */
    SetBloodpool(p: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetBloodpoolEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * BeHurtOnSeekAndHideRaid
     */
    SetFinder(p: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetFinderEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 隐身
     */
    SetHider(t: number) {
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetHiderEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 战场增益
     * 提高气血和真气上限，提高全部抗性。
     */
    SetKillmonster(
        p: number,
        addhp: number,
        addmp: number,
        addanti: number,
        time: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(addhp);
        this.SetValue(addmp);
        this.SetAmount(addanti);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetKillmonsterEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 斗魂2
     * 增加致命一击率和致命一击伤害，真气消耗一定比例转化为气血消耗。（转化效果只对九黎本身生效）
     */
    SetDouhun2(add_crit_rate: number, add_crit_hurt: number, time: number) {
        this.SetAmount(add_crit_rate);
        this.SetValue(add_crit_hurt);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetDouhun2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 钢胆
     * 增加减免致命一击率和致命一击伤害，气血消耗一定比例转化为真气消耗。（转化效果只对九黎本身生效）
     */
    SetGangdan2(dec_crit_rate: number, dec_crit_hurt: number, time: number) {
        this.SetAmount(dec_crit_rate);
        this.SetValue(dec_crit_hurt);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetGangdan2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 雷霆诅咒
     * 增加被致命一击伤害。
     *
     * 仅对怪物生效
     */
    SetIncMobfatalhurt(p: number, r: number, t: number, buffId: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetIncMobfatalhurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 厄运诅咒
     * 增加被致命一击概率。
     *
     * 仅对怪物生效
     */
    SetIncMobfatalratio(p: number, r: number, t: number, buffId: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetIncMobfatalratioEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加仇恨（善恶值？）
     */
    SetEnmity(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetEnmityEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 昏睡状态
     */
    SetSleep(p: number, time: number, value: number) {
        this.SetProbability(p);
        this.SetTime(time);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSleepEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 深度昏睡
     */
    SetDsleep(p: number, time: number, value: number) {
        this.SetProbability(p);
        this.SetTime(time);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetDsleepEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 定身状态
     */
    SetWrap(p: number, time: number) {
        this.SetProbability(p);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetWrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 魅惑状态
     */
    SetSilent(p: number, time: number) {
        this.SetProbability(p);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetSilentEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 减速状态
     */
    SetSlow(p: number, ratio: number, time: number, buffId: number) {
        this.SetProbability(p);
        this.SetRatio(ratio);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetSlowEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加 伤害百分比。
     * 不确定
     */
    SetInchitrate(r: number) {
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetInchitrateEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 嘲讽
     *
     * 嘲讽目标，对玩家角色无效
     */
    SetAssault(p: number, time: number) {
        this.SetProbability(p);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAssaultEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除不利状态
     */
    SetCleardebuff(p: number, amount: number) {
        this.SetProbability(p);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetCleardebuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除几秒内的不利？
     *
     */
    SetCleardebuffDuration(p: number, amount: number, value: number) {
        this.SetProbability(p);
        this.SetAmount(amount);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22SetCleardebuffDurationEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 送回家
     */
    SetGohome(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetGohomeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 学习被动技能增加攻击
     *
     * context;   // 0:施法者 1:被施法者 2:被动技能生效 3:被动技能失效 4:被动技能学习
     */
    SetPasaddattack(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetPasaddattackEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加攻击百分比
     */
    SetPasincattack(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetPasincattackEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加防御
     */
    SetPasadddefence(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetPasadddefenceEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加防御百分比
     */
    SetPasincefence(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetPasincefenceEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加气血
     */
    SetPasaddhp(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetPasaddhpEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加真气百分比
     */
    SetPasincmp(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetPasincmpEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加气血百分比
     */
    SetPasinchp(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetPasinchpEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加真气
     */
    SetPasaddmp(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetPasaddmpEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加躲闪
     */
    SetPasadddodge(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasadddodgeEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加魅惑抗性
     */
    SetPasaddsilent(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetPasaddsilentEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加虚弱抗性
     */
    SetPasaddweak(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPasaddweakEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加眩晕抗性
     */
    SetPasadddizzy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasadddizzyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加昏睡抗性
     */
    SetPasaddsleep(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasaddsleepEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加减速抗性
     */
    SetPasaddslow(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPasaddslowEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加定身抗性
     */
    SetPasaddwrap(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPasaddwrapEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加魅惑韧性
     */
    SetPasaddsilenttenaciy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22SetPasaddsilenttenaciyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加虚弱韧性
     */
    SetPasaddweaktenaciy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetPasaddweaktenaciyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加眩晕韧性
     */
    SetPasadddizzytenaciy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetPasadddizzytenaciyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加昏睡韧性
     */
    SetPasaddsleeptenaciy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetPasaddsleeptenaciyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加减速韧性
     */
    SetPasaddslowtenaciy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetPasaddslowtenaciyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加定身韧性
     */
    SetPasaddwraptenaciy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetPasaddwraptenaciyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加魅惑精通
     */
    SetPasaddsilentproficiency(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper26SetPasaddsilentproficiencyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加虚弱精通
     */
    SetPasaddweakproficiency(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper24SetPasaddweakproficiencyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加眩晕精通
     */
    SetPasadddizzyproficiency(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper25SetPasadddizzyproficiencyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加昏睡精通
     */
    SetPasaddsleepproficiency(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper25SetPasaddsleepproficiencyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加减速精通
     */
    SetPasaddslowproficiency(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper24SetPasaddslowproficiencyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加定身精通
     */
    SetPasaddwrapproficiency(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper24SetPasaddwrapproficiencyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加真气百分比
     */
    SetPasincdefence(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetPasincdefenceEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 直接扣除封神经验
     */
    SetDecDeityExp(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDecDeityExpEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加气血恢复百分比
     */
    SetPasinchpgen(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasinchpgenEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加真气恢复百分比
     */
    SetPasincmpgen(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasincmpgenEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 击退
     * KnockBack
     */
    SetRepel(p: number, distance: number) {
        this.SetProbability(p);
        this.SetValue(distance);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetRepelEb",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 学习被动技能增加普攻命中
     */
    SetPasaddaccuracy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetPasaddaccuracyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加致命一击伤害
     */
    SetPasaddsmite(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasaddsmiteEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加全抗
     */
    SetPasaddanti(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPasaddantiEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加暴击百分比
     */
    SetPasinccrit(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPasinccritEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加眩晕抗性百分比
     */
    SetPasincantidizzy(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetPasincantidizzyEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加虚弱抗性百分比
     */
    SetPasincantiweak(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetPasincantiweakEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加定身抗性百分比
     */
    SetPasincantiwrap(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetPasincantiwrapEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加魅惑抗性百分比
     */
    SetPasincantisilent(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetPasincantisilentEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加昏睡抗性百分比
     */
    SetPasincantisleep(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetPasincantisleepEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加减速抗性百分比
     */
    SetPasincantislow(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetPasincantislowEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加全抗百分比
     */
    SetPasincanti(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPasincantiEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 死亡
     */
    SetDie() {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper6SetDieEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 学习被动技能增加减免致命一击伤害
     */
    SetPasdecfatalhurt(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetPasdecfatalhurtEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加减免致命一击率
     */
    SetPasdecfatalratio(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetPasdecfatalratioEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加技能命中
     */
    SetPasincskillaccu(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetPasincskillaccuEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加技能躲闪
     */
    SetPasincskilldodge(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetPasincskilldodgeEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加减免伤害百分比
     */
    SetPasdechurt(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPasdechurtEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加减免固定伤害
     */
    SetPassubhurt(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPassubhurtEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加御仙
     */
    SetPasdechurt1(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasdechurt1Ef",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加御佛
     */
    SetPasdechurt2(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasdechurt2Ef",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加御魔
     */
    SetPasdechurt3(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasdechurt3Ef",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 御什么？
     * 源码中传值为3
     * 学习被动技能增加种族减伤？
     */
    SetPasdechurt4(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasdechurt4Ef",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 御什么？
     * 源码中传值为4
     * @param v
     */
    SetPasdechurt5(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasdechurt5Ef",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 御什么？
     * 源码中传值为6
     * @param v
     */
    SetPasdechurt6(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasdechurt6Ef",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能减少宠物伤害
     */
    SetPasdecpethurt(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetPasdecpethurtEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加对宠物伤害
     */
    SetPasincpetdamage(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetPasincpetdamageEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 虚空一斩
     * 虚空一斩。
     */
    SetSlow2(p: number, r: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSlow2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 变身
     *
     *  int template_id, int exp_level, int timeout
     */
    SetTransform(
        p: number,
        template_id: number,
        level: number,
        exp_level: number,
        t: number,
    ) {
        this.SetProbability(p);
        this.SetValue(template_id);
        this.SetAmount(level);
        this.SetRatio(exp_level);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetTransformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除变身
     */
    SetCleartransform(
        p: number,
        template_id: number,
        template_id2: number,
        template_id3: number,
    ) {
        this.SetProbability(p);
        this.SetValue(template_id);
        this.SetAmount(template_id2);
        this.SetRatio(template_id3);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetCleartransformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫变身状态
     */
    SetImmunetransform(time: number) {
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetImmunetransformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 学习被动技能增加变身抗性
     *
     * EnhanceAntiTransform
     */
    SetPasaddtransform(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetPasaddtransformEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加变身抗性百分比
     */
    SetPasincantitransform(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22SetPasincantitransformEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 变身抗性增加
     * 增加变身抗性。
     */
    SetAddantitransform(value: number, time: number, buffId: number) {
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetAddantitransformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 变身抗性减弱
     * 降低变身抗性。
     */
    SetSubantitransform(value: number, time: number, buffId: number) {
        this.SetValue(value);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetSubantitransformEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 迷踪
     * 增加普攻闪躲。
     */
    SetDimming(
        p: number,
        inc_speed: number,
        inc_skill_dodge: number,
        time: number,
        inc_attack_dodge: number,
        buffId: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(inc_speed);
        this.SetValue(inc_skill_dodge);
        this.SetTime(time);
        this.SetAmount(inc_attack_dodge);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetDimmingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 潜形
     * 降低移动速度。
     */
    SetShadowhide(
        p: number,
        inc_speed: number,
        mpcost: number,
        time: number,
        shadow_ability: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(inc_speed);
        this.SetValue(mpcost);
        this.SetTime(time);
        this.SetAmount(shadow_ability);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetShadowhideEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 一闪
     * 攻击显形后可以自动再次融身入影。
     */
    SetShadowdance(
        p: number,
        inc_speed: number,
        v: number,
        time: number,
        shadow_ability: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(inc_speed);
        this.SetValue(v);
        this.SetTime(time);
        this.SetAmount(shadow_ability);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetShadowdanceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 影返
     * 与克隆人交换位置
     */
    SetPosexchangewithclone(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper23SetPosexchangewithcloneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 化影
     * 与克隆人交换状态
     */
    SetStateexchangewithclone(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper25SetStateexchangewithcloneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 延命
     * 吸取分身生命。
     */
    SetDrawclonelife(p: number, drawhp: number, t: number) {
        this.SetProbability(p);
        this.SetValue(drawhp);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetDrawclonelifeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 当身
     * 本体受到伤害的由影子承担。
     */
    SetSharelifewithclone(p: number, shareRatio: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(shareRatio);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetSharelifewithcloneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 共享影子状态
     * 受身
     */
    SetSharestatewithclone(p: number, ratio: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(ratio);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper22SetSharestatewithcloneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 背刺
     * 背刺。
     */
    SetBackstab(p: number, inc_crit: number, t: number) {
        this.SetProbability(p);
        this.SetValue(inc_crit);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetBackstabEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 分筋
     * 暴击诅咒
     */
    SetCritcurse(p: number, t: number, counter: number) {
        this.SetProbability(p);
        this.SetAmount(counter);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetCritcurseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 吃药效果增强
     * 增加使用药品后的效果。
     */
    SetIncdrugeffect(p: number, r: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetIncdrugeffectEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 吃药效果减弱
     * 减少使用药品后的效果。
     */
    SetDecdrugeffect(p: number, r: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetDecdrugeffectEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 效果反弹
     * 反弹敌人攻击效果。
     */
    SetSkillmirror(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSkillmirrorEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 绝对领域
     */
    SetAbsulotearea(p: number, r: number, v: number, a: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetAbsuloteareaEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤影子
     */
    SetSummonclone(
        p: number,
        id: number,
        count: number,
        lifetime: number,
        type: number,
    ) {
        this.SetProbability(p);
        this.SetValue(id);
        this.SetAmount(count);
        this.SetTime(lifetime);
        this.SetRatio(type);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSummoncloneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 取消召唤
     */
    SetUnsummon(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetUnsummonEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 取消召唤影子
     */
    SetUnsummonclone(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetUnsummoncloneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 反隐能力提升
     * 增加反隐能力。
     */
    SetAddspot(p: number, v: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAddspotEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 反隐能力下降
     * 减少反隐能力。
     */
    SetSubSpot(p: number, v: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetSubSpotEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 隐身能力提升
     * 增加隐身能力。
     */
    SetAddhide(p: number, v: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAddhideEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 隐身能力下降
     */
    SetSubhide(p: number, v: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetSubhideEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 强制打断
     */
    SetBreakcasting(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetBreakcastingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 狂热
     * 每次攻击通过消耗气血或真气来增加攻击力。
     */
    SetCrazycurse(p: number, hcost: number, mcost: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(hcost);
        this.SetAmount(mcost);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetCrazycurseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 五行遁
     * 极大增加移动速度并免疫伤害和负面效果。
     */
    SetFogstate(p: number, addend: number, t: number) {
        this.SetProbability(p);
        this.SetValue(addend);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetFogstateEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加元神威能、攻击力、无视目标伤害减免、对佛阵营伤害，降低人物对自身造成伤害。
     */
    SetMiracleburstxian(r: number, t: number, b: number, dpcost: number) {
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);
        this.SetAmount(dpcost);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetMiracleburstxianEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 爆发
     * 增加元神威能、攻击力、无视目标伤害减免、对仙阵营伤害，降低人物对自身造成伤害。
     */
    SetMiracleburstmo(r: number, t: number, b: number, dpcost: number) {
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);
        this.SetAmount(dpcost);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetMiracleburstmoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 爆发
     * 增加元神威能、攻击力、无视目标伤害减免、对魔阵营伤害，降低人物对自身造成伤害。
     */
    SetMiracleburstfo(r: number, t: number, b: number, dpcost: number) {
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);
        this.SetAmount(dpcost);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetMiracleburstfoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 业障
     * 进入黑暗状态。
     */
    SetDarkness(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetDarknessEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 业障2
     * 进入黑暗状态。
     */
    SetDarkness2(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetDarkness2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 血咒
     * 每秒流失施法者攻击力一定比例的气血。
     */
    SetIgnite(p: number, t: number, damage: number, addtion: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(damage);
        this.SetValue(addtion);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetIgniteEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 技能反射
     */
    SetSkillreflect(
        p: number,
        reflectProb: number,
        reflectCnt: number,
        t: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(reflectProb);
        this.SetValue(reflectCnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSkillreflectEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 元神震荡
     * 改变元神威能。
     */
    SetDivinityburst(
        p: number,
        dpscale: number,
        dp: number,
        t: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(dpscale);
        this.SetValue(dp);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetDivinityburstEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 元神聚合
     * 每2秒回复元力。
     */
    SetDivinityfury(
        p: number,
        dptotal: number,
        addition: number,
        t: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetAmount(dptotal);
        this.SetValue(addition);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetDivinityfuryEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 刺骨
     * 受到任何攻击伤害提高。
     */
    SetColdinjure(p: number, r: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetColdinjureEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 冻结
     * 无法移动、攻击、使用技能。
     */
    SetFrozen(p: number, r: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetFrozenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 轮回
     * 回到一定时间之前的位置。
     */
    SetGoback(p: number, t: number, v: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetGobackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 范围内人数决定伤害
     * 概率范围内敌对目标每增加1人，范围内所有敌对目标伤害增加数值
     */
    SetScopedamage(p: number, v: number, r: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetScopedamageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 将单位拉到身边
     * 将单位拉到身边。
     */
    SetPullback(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetPullbackEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 将单位拉到目标
     */
    SetPulltoTarget(p: number, x: number, y: number, z: number) {
        this.SetProbability(p);
        this.SetAmount(x);
        this.SetRatio(y);
        this.SetValue(z);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetPulltoTargetEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 刀山地狱
     * 每移动1米则每秒流失施法者攻击力一定比例的伤害。
     */
    SetDamagemove(p: number, v: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDamagemoveEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天劫
     * 一定时间之后触发效果，损失气血总量一定比例的气血，并对周围玩家造成伤害。
     */
    SetHumanbomb(
        p: number,
        hpreduceratio: number,
        damage: number,
        radius: number,
        t: number,
        total: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(hpreduceratio);
        this.SetValue(damage);
        this.SetAmount(radius);
        this.SetTime(t);
        this.SetBuffid(total);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetHumanbombEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 学习被动技能增加克仙
     */
    SetPasdecrestrainxian(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetPasdecrestrainxianEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加克魔
     */
    SetPasdecrestrainmo(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetPasdecrestrainmoEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加克佛
     */
    SetPasdecrestrainfo(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetPasdecrestrainfoEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 学习被动技能增加元力恢复速度
     */
    SetPasincdpgen(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasincdpgenEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 缚魂
     * 不受自身控制并跟随施法者移动，受到施法者攻击后自动解除。
     */
    SetSpiritdrag(p: number, t: number, r: number, v: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetValue(v);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetSpiritdragEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 灼烧
     * 持续受到施法者攻击力的伤害，同时对周围目标造成等量伤害。
     */
    SetFiring(
        p: number,
        t: number,
        amount: number,
        damage: number,
        radius: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(amount);
        this.SetValue(damage);
        this.SetRatio(radius);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetFiringEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 灼烧2
     * 持续受到施法者攻击力的伤害，同时对周围目标造成等量伤害。
     */
    SetFiring2(
        p: number,
        t: number,
        amount: number,
        damage: number,
        radius: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(amount);
        this.SetValue(damage);
        this.SetRatio(radius);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetFiring2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 集火？还是引爆火种
     */
    SetBefired(damage: number) {
        this.SetValue(damage);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetBefiredEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 创建技能对象
     *
     * gs中，未分析参数
     */
    SetCreateobject(
        p: number,
        v: number,
        r: number,
        a: number,
        t: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(a);
        this.SetValue(v);
        this.SetRatio(r);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetCreateobjectEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虚灵法元
     *
     * 任何攻击中一定概率附加虚弱效果。
     */
    SetAddweak(p: number, skill_id: number, skill_level: number, addend: number) {
        this.SetProbability(p);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetRatio(addend);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAddweakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 定灵法元
     * 任何攻击中一定概率附加定身效果
     */
    SetAddwrap(p: number, skill_id: number, skill_level: number, addend: number) {
        this.SetProbability(p);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetRatio(addend);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAddwrapEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 魅灵法元
     * 任何攻击中一定概率附加魅惑效果。
     */
    SetAddcharm(
        p: number,
        skill_id: number,
        skill_level: number,
        addend: number,
    ) {
        this.SetProbability(p);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetRatio(addend);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetAddcharmEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 眩灵法元
     * 任何攻击中一定概率附加眩晕效果。
     */
    SetAddslow(p: number, skill_id: number, skill_level: number, addend: number) {
        this.SetProbability(p);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetRatio(addend);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAddslowEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 附加
     * 任何攻击中一定概率附加特定效果。
     */
    SetAddcommon(
        p: number,
        r: number,
        skill_id: number,
        skill_level: number,
        t: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAddcommonEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天命
     * 倒计时结束后触发特定效果。
     */
    SetDelaycast(
        p: number,
        t: number,
        skill_id: number,
        skill_level: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(skill_id);
        this.SetRatio(skill_level);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetDelaycastEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 转阴易阳
     * 无法受到有利状态影响。
     */
    SetTurnbuff(t: number, turnMaxCnt: number, b: number) {
        this.SetTime(t);
        this.SetAmount(turnMaxCnt);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetTurnbuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 转阳易阴
     * 无法受到不利状态影响。
     */
    SetTurndebuff(t: number, turnMaxCnt: number, b: number) {
        this.SetTime(t);
        this.SetAmount(turnMaxCnt);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetTurndebuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 麻痹
     * 施法时间延长，移动速度降低。
     */
    SetParalysis(
        p: number,
        t: number,
        praySpeedRatio: number,
        speedRatio: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(praySpeedRatio);
        this.SetValue(speedRatio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetParalysisEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 迅疾
     * 施法时间减少，移动速度增加。
     */
    SetSwift(p: number, t: number, praySpeedRatio: number, speedRatio: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(praySpeedRatio);
        this.SetValue(speedRatio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSwiftEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 触发技能
     * 一定概率触发特定技能。
     */
    SetTriggerskill(p: number, t: number, skillid: number, skilllevel: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(skillid);
        this.SetAmount(skilllevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetTriggerskillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 激活
     * 激活特定效果。
     *
     * p==0时为对自身释放
     */
    SetActiveonfilteradd(
        p: number,
        t: number,
        param: number,
        skill_id: number,
        skill_level: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(param);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetActiveonfilteraddEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 激活
     * 激活特定效果。
     * 被暴击时激活
     *
     * b==0时为对自身释放
     */
    SetActivecrit(
        p: number,
        t: number,
        skill_id: number,
        skill_level: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetActivecritEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 激活
     * 激活特定效果。
     * 被暴击时激活
     *
     * b==0时为对自身释放
     */
    SetActivebecrit(
        p: number,
        t: number,
        skill_id: number,
        skill_level: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetActivebecritEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 残废
     * 所有技能释放等级降低。
     */
    SetCrippled(p: number, t: number, dec_skill_lvl: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(dec_skill_lvl);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetCrippledEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 地煞·形
     * 体型变大，增加攻击力、气血上限、技能释放时间。
     */
    SetGuishen1(
        p: number,
        t: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        hpRatio: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(hpRatio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetGuishen1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天罡·形
     * 体型变小，降低攻击力、气血上限、技能释放时间。"
     */
    SetTuoling1(
        p: number,
        t: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        defenseRatio: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(defenseRatio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetTuoling1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 地煞·神
     * 体型变大，增加攻击力、致命一击率、技能释放时间。
     */
    SetGuishen2(
        p: number,
        t: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        crit: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(crit);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetGuishen2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天罡·神
     * 体型变小，降低攻击力、被致命一击率、技能释放时间。
     */
    SetTuoling2(
        p: number,
        t: number,
        scaleRatio: number,
        atkRatio: number,
        praySpeedRatio: number,
        antiCrit: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(scaleRatio);
        this.SetAmount(atkRatio);
        this.SetValue(praySpeedRatio);
        this.SetBuffid(antiCrit);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetTuoling2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 被拉扯
     * 不受自身控制并以一定速度向施法者处移动。
     */
    SetBepulled(p: number, t: number, speed: number, stop_dist: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(stop_dist);
        this.SetValue(speed);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetBepulledEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 拉扯
     * 将目标以一定速度向自身处拉扯。
     */
    SetPulling(time_orign: number) {
        this.SetTime(time_orign);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetPullingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 嗜血
     * 按照受到伤害的回复气血。
     */
    SetBloodthirsty(p: number, t: number, r: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetBloodthirstyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 阵法
     * 阵法施放者的标志，对其范围内队友施加特定状态。
     */
    SetCycle(
        p: number,
        t: number,
        skillLevel: number,
        skillId: number,
        skillTickCnt: number,
        startSkillId: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(skillLevel);
        this.SetAmount(skillId);
        this.SetValue(skillTickCnt);
        this.SetBuffid(startSkillId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetCycleEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 盈升
     * 使某技能提高至一定等级。
     */
    SetIncskilllevel(
        p: number,
        t: number,
        skillId1: number,
        skillId2: number,
        skillId3: number,
        inclevel: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(skillId3);
        this.SetAmount(skillId2);
        this.SetValue(skillId1);
        this.SetBuffid(inclevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetIncskilllevelEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 定止
     * 使某技能固定为某一等级
     */
    SetSetskilllevel(
        p: number,
        t: number,
        skillId1: number,
        skillId2: number,
        skillId3: number,
        destlevel: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(skillId1);
        this.SetAmount(skillId2);
        this.SetRatio(skillId3);
        this.SetBuffid(destlevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSetskilllevelEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加经验比例？284
     */
    SetAddmonsterexp(p: number, t: number, expratio: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(expratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetAddmonsterexpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 人体炸弹？！
     * 285
     */
    SetHumanbomb2(
        p: number,
        t: number,
        radius: number,
        damage: number,
        total: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(radius);
        this.SetValue(damage);
        this.SetBuffid(total);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetHumanbomb2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 什么效果？286
     */
    SetTrad(p: number, t: number, dec_skill_lvl: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(dec_skill_lvl);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetTradEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 战场增益？
     *
     * gs中
     */
    SetStruggle(p: number, t: number, r: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetStruggleEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 格挡
     * 在一定时间内减少受到的伤害。
     */
    SetParry(
        p: number,
        t: number,
        dmgreduceratio: number,
        dmgmax: number,
        skillid: number,
        skilllevel: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(dmgreduceratio);
        this.SetValue(dmgmax);
        this.SetBuffid(skillid);
        this.SetRatio(skilllevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetParryEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 替身术
     * 在一定时间内成为施法者的替身，无法使用技能。
     */
    SetDisguise(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetDisguiseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 标记
     * 注意，你已经被破军标记了。
     */
    SetSign(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetSignEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 魔法跳动
     *
     * gs中实现
     */
    SetMagicdance(p: number, a: number, v: number) {
        this.SetProbability(p);
        this.SetAmount(a);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetMagicdanceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 改变攻击目标
     */
    SetAtkchangetarget(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetAtkchangetargetEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 改变攻击目标2
     */
    SetAtkchangetarget2(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetAtkchangetarget2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 狂暴
     * 破军进入激活状态，特定技能获得强化。
     */
    SetPojun1(p: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetPojun1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 剑梏冷却
     * 一定时间内无法再次生效剑梏效果或被剑梏效果所影响。
     */
    SetPojun2(p: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetPojun2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 挪移
     * 一定概率将受到的技能影响转移至被标记目标身上。
     */
    SetSkilltransfer(
        t: number,
        prob: number,
        max_dmg_transfer: number,
        skill_transfer_rate: number,
    ) {
        this.SetTime(t);
        this.SetRatio(prob);
        this.SetAmount(max_dmg_transfer);
        this.SetProbability(skill_transfer_rate);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSkilltransferEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无畏
     * 提高闪躲掉群体技能攻击的概率。
     */
    SetGroupatkchange(
        p: number,
        t: number,
        add_skilldodge: number,
        reduce_dmg_ratio: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(add_skilldodge);
        this.SetRatio(reduce_dmg_ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetGroupatkchangeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 破煞
     * 使用单体攻击时，攻击距离和伤害获得提高。
     */
    SetSingleatkchange(
        p: number,
        t: number,
        add_skill_distance: number,
        add_dmg_ratio: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(add_skill_distance);
        this.SetAmount(add_dmg_ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetSingleatkchangeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除连杀数量
     */
    SetClearkillnum(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetClearkillnumEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 烟雾？
     */
    SetSmog(
        p: number,
        t: number,
        radius: number,
        skillid: number,
        skillLevel: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(radius);
        this.SetRatio(skillid);
        this.SetAmount(skillLevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper7SetSmogEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除保护免疫效果
     *
     * gs中
     */
    SetClearimmune(p: number, v: number, a: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetClearimmuneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 击杀触发
     * 击杀目标后，触发特定效果。
     */
    SetWhenkillasself(t: number, skillid: number, skillLevel: number) {
        this.SetTime(t);
        this.SetValue(skillid);
        this.SetAmount(skillLevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetWhenkillasselfEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 击杀触发
     * 被击杀后，触发特定效果。
     */
    SetWhenkillastarget(t: number, skillid: number, skillLevel: number) {
        this.SetTime(t);
        this.SetValue(skillid);
        this.SetAmount(skillLevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetWhenkillastargetEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无视神佑
     *
     * 304
     */
    SetIgnoreblessed(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetIgnoreblessedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫嘲讽
     * 无法被嘲讽效果影响。
     */
    SetImmunetaune(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetImmunetauneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 格挡
     * 在一定时间内减少受到的伤害。
     */
    SetParry2(
        p: number,
        t: number,
        dmgreduceratio: number,
        dmgmax: number,
        skillid: number,
        skilllevel: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(dmgreduceratio);
        this.SetValue(dmgmax);
        this.SetBuffid(skillid);
        this.SetRatio(skilllevel);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetParry2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫燃魔
     * 在一定时间内无法受到燃魔效果影响。
     */
    SetImmunelakemp(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetImmunelakempEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 疯魔
     * 一定时间内进入疯魔状态。
     *
     * 极限连携
     * 鬼王聚灵3英雄那个
     *
     * death_trigger!=0
     */
    SetSupertrigger(
        t: number,
        trigger_skill_id: number,
        trigger_skill_level: number,
        max_cnt: number,
        death_trigger: number,
        use_skill_id: number,
    ) {
        this.SetTime(t);
        this.SetRatio(trigger_skill_id);
        this.SetValue(trigger_skill_level);
        this.SetAmount(max_cnt);
        this.SetProbability(death_trigger);
        this.SetBuffid(use_skill_id);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSupertriggerEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 附加种子
     */
    SetAddseed(p: number, a: number) {
        this.SetProbability(p);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAddseedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 节命
     * 死亡后立即复活并生存一定时间。
     *
     * deathpact_canctrl!=0
     */
    SetDeathpact(
        p: number,
        t: number,
        addspeed: number,
        deathpact_time: number,
        deathpact_canctrl: number,
        deathpact_invincible_time: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(addspeed);
        this.SetValue(deathpact_time);
        this.SetBuffid(deathpact_canctrl);
        this.SetAmount(deathpact_invincible_time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetDeathpactEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 飞毛腿祝福
     * 青罗 明月逐来 效果
     * gs中
     */
    SetScudblessing(p: number, t: number, a: number, v: number, r: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(a);
        this.SetValue(v);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetScudblessingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 唯我
     * 一定时间内汲取目标的指定属性到自身。
     */
    SetDeriveattribution(
        p: number,
        t: number,
        debuff_time: number,
        derive_value: number,
        derive_type: number,
        derive_max: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(debuff_time);
        this.SetValue(derive_value);
        this.SetBuffid(derive_type);
        this.SetAmount(derive_max);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetDeriveattributionEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 未知
     *
     * gs中
     */
    SetDerivedef(p: number, t: number, b: number, v: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetBuffid(b);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetDerivedefEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 绝脉
     * 一定时间内部分技能禁用。
     *
     * 必需：reborn_cnt==1
     */
    SetFenggong(p: number, t: number, num: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(num);
        this.SetAmount(1); //reborn_cnt

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetFenggongEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 裹足
     * 降低移动速度（可叠加）。
     */
    SetIcecurse(p: number, t: number, sub_speed: number, amount: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(sub_speed);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetIcecurseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 熔甲降低减免伤害能力（可叠加）。
     */
    SetFlamecurse(p: number, t: number, add_dmgreduce: number, amount: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(add_dmgreduce);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetFlamecurseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 苦寒
     * 减免伤害提升，但暴击和暴击伤害下降。
     */
    SetIceblessing(
        p: number,
        t: number,
        dmg_change: number,
        crit_rate: number,
        critdmg_value: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(dmg_change);
        this.SetValue(crit_rate);
        this.SetAmount(critdmg_value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetIceblessingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 炽烈
     * 暴击伤害提升，但减免暴击和减免暴伤下降。
     */
    SetFlameblessing(
        p: number,
        t: number,
        critdmg_value: number,
        anti_crit_rate: number,
        anti_critdmg_value: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(critdmg_value);
        this.SetValue(anti_crit_rate);
        this.SetAmount(anti_critdmg_value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetFlameblessingEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 迟缓
     * 移动速度降低，施法速度延长，技能冷却延长。
     */
    SetTorpescence(
        p: number,
        t: number,
        praySpeedRatio: number,
        speedRatio: number,
        addcooltime: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(praySpeedRatio);
        this.SetValue(speedRatio);
        this.SetAmount(addcooltime);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetTorpescenceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 牺牲
     * 按一定比例无视受到的伤害。
     */
    SetSacrifice(
        p: number,
        t: number,
        dmgattackratio: number,
        dmgreduceratio: number,
        cool_buff_time: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(dmgattackratio);
        this.SetValue(dmgreduceratio);
        this.SetAmount(cool_buff_time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetSacrificeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 玉盘
     * 处于特定区域内将被诅咒。
     */
    SetQingluo1(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetQingluo1Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 金盏
     * 处于特定区域内将被诅咒。
     */
    SetQingluo2(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetQingluo2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蛊惑？
     *
     * gs中实现
     */
    SetGuhuo(p: number, t: number, v: number, a: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(v);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetGuhuoEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 恐惧
     * 一定时间内逃跑。
     */
    SetFear2(p: number, t: number, distance: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(distance);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetFear2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 悬浮
     * 吹飞
     * 一定时间内飘离地面一定距离。
     *
     * @param p
     * @param t
     * @param height    高度
     * @param ign_dmg   忽略伤害，1 or 0
     * @param ign_debuff 忽略debuff，1 or 0
     */
    SetSuspend(
        p: number,
        t: number,
        height: number,
        ign_dmg: number,
        ign_debuff: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(height);
        this.SetRatio(ign_dmg);
        this.SetAmount(ign_debuff);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetSuspendEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 干扰
     * 一定时间内挑衅自己的友军。
     */
    SetDisarrange(p: number, t: number, debuff_time: number, radius: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(debuff_time);
        this.SetRatio(radius);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDisarrangeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 灵魂连接？！
     *
     * gs中
     */
    SetSoullink(p: number, t: number, v: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetSoullinkEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天衍
     * 使用特定技能将召唤“扇灵”。
     */
    SetImitate(p: number, t: number, decprayspeedratio: number, num: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(decprayspeedratio);
        this.SetAmount(num);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetImitateEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 焕发
     * 一定时间内自身的指定技能被新的技能代替。
     */
    SetSkillreplace(
        p: number,
        t: number,
        orig_skill: number,
        replace_skill: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(orig_skill);
        this.SetRatio(replace_skill);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSkillreplaceEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 共享伤害?
     *
     * 331
     */
    SetSharedamage(t: number, radius: number, share_dmg_ratio: number) {
        this.SetTime(t);
        this.SetAmount(radius);
        this.SetRatio(share_dmg_ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSharedamageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除灵魂连接
     *
     */
    SetClrsoullink(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetClrsoullinkEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加熟练度
     */
    SetAddproficiency(p: number, v: number, a: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetAddproficiencyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 保护罩
     * 受到攻击时削减伤害，达到削减总量则触发指定效果。
     */
    SetDechurt3(
        ratio: number,
        max: number,
        t: number,
        skill_id: number,
        skill_level: number,
    ) {
        this.SetRatio(ratio);
        this.SetAmount(max);
        this.SetTime(t);
        this.SetValue(skill_id);
        this.SetBuffid(skill_level);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetDechurt3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 什么dps?
     *
     * 335
     */
    SetPromotedps(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetPromotedpsEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 激活被暴击2？
     * 336
     *
     * buffid == 0 自己
     */
    SetActivebecrit2(
        t: number,
        prob: number,
        skill_id: number,
        skill_level: number,
        b: number,
    ) {
        this.SetTime(t);
        this.SetProbability(prob);
        this.SetValue(skill_id);
        this.SetAmount(skill_level);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetActivebecrit2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 元力流失
     * 337
     */
    SetDpleak(p: number, t: number, damage: number, addtion: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(damage);
        this.SetValue(addtion);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetDpleakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 怒气恢复
     *
     * 338
     */
    SetRagegen(p: number, health: number, addtion: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(health);
        this.SetAmount(addtion);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetRagegenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 清除血槽
     *
     * 339
     */
    SetAbolishbloodpool(p: number, t: number, r: number, decall: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetAmount(decall);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetAbolishbloodpoolEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫灼烧？
     *
     * 340
     */
    SetImmunemanaburn(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetImmunemanaburnEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 召唤NPC
     *
     * gs中实现
     */
    SetSummonnpc(p: number, v: number, a: number, t: number, b: number) {
        this.SetProbability(p);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetSummonnpcEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 学习被动技能增加移动速度
     */
    SetPasincspeed(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetPasincspeedEf",
            "bool",
            ["pointer", "float"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 流年（标记）
     * 只恐流年惊暗换。标记到指定的时间点。
     */
    SetAgedRewind(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetAgedRewindEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 流年（回溯）
     * 只恐流年惊暗换。标记到指定的时间点。
     */
    SetTargetAgedRewind(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper19SetTargetAgedRewindEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 屏障
     * 免疫来自远方的伤害和负面效果
     * 保护自身的屏障，免疫来自指定范围的玩家技能。
     */
    SetIntagible(p: number, close_distance: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(close_distance);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetIntagibleEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 霜结
     * 技能冷却被停止。
     */
    SetGFrosty(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetGFrostyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 羁绊
     * 降低移动速度。
     *
     * 可叠加
     */
    SetStackSlow(p: number, a: number, v: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(a);
        this.SetValue(v);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetStackSlowEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 枯荷
     * 结束时造成伤害，可通过使用技能减少层数。
     */
    SetWitheredLotus(p: number, damage: number, times: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(damage);
        this.SetRatio(times);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetWitheredLotusEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无我
     * 无视距离自身^ffcb4a%d^ffffff米范围内玩家的伤害
     * “无我”状态下可以被施加负面效果
     * 保护自身的结界，忽视来自指定范围的伤害。
     */
    SetIntagible2(p: number, close_distance: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(close_distance);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetIntagible2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 酒转
     * 颠倒乾坤，一定比例交换气血与真气。
     */
    SetInterchange(p: number, mp: number, hp: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(mp);
        this.SetValue(hp);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetInterchangeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 裂变
     * 伤害在受作用目标间裂变。
     */
    SetChainReaction(
        p: number,
        radius: number,
        targets: number,
        damage_ratio: number,
        t: number,
    ) {
        this.SetProbability(p);
        this.SetAmount(radius);
        this.SetValue(targets);
        this.SetRatio(damage_ratio);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetChainReactionEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 待发
     * 受到攻击时，有几率清空攻击者的真气。
     */
    SetReadiness(p: number, r: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetReadinessEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 随机debuff诅咒
     *
     * @param max   最大数量
     * @param r     每次的概率
     * @param t     时长
     * @param v
     * @param b
     */
    SetCurses(max: number, r: number, t: number, v: number, b: number) {
        this.SetAmount(max);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetValue(v);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetCursesEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 随机buff
     */
    SetRandbuff(p: number, max: number, r: number, t: number, v: number) {
        this.SetProbability(p);
        this.SetAmount(max);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetRandbuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 回复神力
     * 回复元力值。
     */
    SetDpgen(p: number, t: number, health: number, addtion: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(health);
        this.SetAmount(addtion);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetDpgenEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 粉碎
     * 增加致命一击伤害。
     *
     * 可叠加
     */
    SetStackCritHurt(p: number, r: number, v: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetValue(v);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetStackCritHurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 学习被动技能增加减免伤害
     */
    SetPasadddmgreduction(v: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetPasadddmgreductionEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(this.pointer, v);
    }

    /**
     * 击退3
     */
    SetRepel3(p: number, v: number) {
        this.SetProbability(p);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetRepel3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 雨珠
     * 受到攻击时回复自身真气。
     */
    SetRainBead(
        value: number,
        max: number,
        prob: number,
        defense_scale_bon: number,
        t: number,
        disrupt_chance: number,
    ) {
        this.SetValue(value);
        this.SetAmount(max);
        this.SetRatio(prob);
        this.SetProbability(defense_scale_bon);
        this.SetTime(t);
        this.SetBuffid(disrupt_chance);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetRainBeadEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 薄命
     * 免疫一次致死伤害。
     */
    SetImmuneDeath(p: number, buff_duration: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(buff_duration);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetImmuneDeathEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 灵猴兆瑞Buff
     *
     * 当自身受到魅惑及部分移动受阻类效果时，使用后有50%%概率缩短受控制时间80%
     */
    SetMonkeyBuff(p: number, r: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetMonkeyBuffEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 一丈红
     * 持续减少大量气血且无法被驱散。
     */
    SetHpleak7(p: number, t: number, damage: number, addtion: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(damage);
        this.SetValue(addtion);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetHpleak7Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虫蛊
     * 鬼道族秘术。
     */
    SetInsectPoison(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetInsectPoisonEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 蛇蛊
     * 鬼道族秘术。
     */
    SetSnakePoison(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetSnakePoisonEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 获得一个有时间限制的技能
     */
    SetTimedSkill(
        p: number,
        skill_id: number,
        skill_lvl: number,
        t: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetValue(skill_id);
        this.SetAmount(skill_lvl);
        this.SetTime(t);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetTimedSkillEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 地缚
     * 令目标在一段时间内无法移动且不可解除。
     */
    SetEarthBound(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetEarthBoundEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 凝神
     * 一段时间内保护自身当前有利状态不被一般类技能清除。
     */
    SetBuffClearImmune(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetBuffClearImmuneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 焱阳
     * 令目标在一段时间内攻击别人则丢失自身有利状态，且会受到伤害反弹。
     */
    SetBlazingSun(p: number, t: number, r: number, max_damage: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetAmount(max_damage);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetBlazingSunEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 添加通用的debuff
     */
    SetSlow3(p: number, t: number, r: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSlow3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 神佑压制
     * 令目标一段时间内无法受到神佑效果的保护。
     */
    SetDisableBless(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetDisableBlessEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 移除4198过滤器。
     */
    SetBreakArray(p: number) {
        this.SetProbability(p);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetBreakArrayEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 鱼跃
     * 获得惊人的弹跳能力！
     */
    SetSkillreflect2(
        p: number,
        reflectProb: number,
        reflectCnt: number,
        t: number,
    ) {
        this.SetProbability(p);
        this.SetRatio(reflectProb);
        this.SetValue(reflectCnt);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetSkillreflect2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 偏锋
     * 一段时间内减免自身受到部分技能附加的额外伤害。
     */
    SetSlant(p: number, t: number, dmgreduceratio: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(dmgreduceratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSlantEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 极目
     * 一段时间内提升自身视野范围。
     */
    SetEagleEye(p: number, t: number, range: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(range);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetEagleEyeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 大羿王
     * 一段时间内提升自身暴击率、技能命中及技能伤害。
     */
    SetEloquenceLord(
        p: number,
        t: number,
        skill_acc_bonus: number,
        crit_chance: number,
        skill_damage_ratio: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(skill_acc_bonus);
        this.SetValue(crit_chance);
        this.SetAmount(skill_damage_ratio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetEloquenceLordEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫冰冻
     * 一段时间内免疫冰冻效果。
     */
    SetFrozenImmune(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetFrozenImmuneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫禁食
     * 一段时间内免疫禁食效果。
     */
    SetDietImmune(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDietImmuneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 藐视
     * 一定几率免疫群体攻击技能。
     */
    SetAoEImmune(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetAoEImmuneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 漠视
     * 一定几率免疫单体攻击技能。
     */
    SetSingleTargetImmune(p: number, t: number,r:number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper21SetSingleTargetImmuneEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 固守
     * 提升伤害减免百分比数值。
     */
    SetUltimateDamageReduction(
        p: number,
        t: number,
        add_dmgreduce: number,
        a: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(add_dmgreduce);
        this.SetAmount(a);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper26SetUltimateDamageReductionEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 放逐
     * 交换双方致命一击伤害。
     */
    SetSwapCritHurt(p: number, t: number, r: number, v: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetValue(v);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetSwapCritHurtEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 麻痹
     * 施法时间延长，移动速度降低。
     */
    SetParalysis2(
        p: number,
        t: number,
        praySpeedRatio: number,
        speedRatio: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(praySpeedRatio);
        this.SetValue(speedRatio);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetParalysis2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 抗性机器人？
     *
     * 386
     *
     * 固定加了25点
     */
    SetAntiBot(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAntiBotEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 通用伤害减免？
     *
     * 387
     */
    SetCommondmgred(p: number, t: number, reduction: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(reduction);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetCommondmgredEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 无视无敌
     * 304
     */
    SetIgnoreinvicible(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper18SetIgnoreinvicibleEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 落瑛
     * 落瑛缤纷，芳华愈盛。叠加后可增强特殊技能伤害。
     */
    AddFallingLustre(p: number, real_stack: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(real_stack);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16AddFallingLustreEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 灵种
     * 灵种眠冬，闻雷而生。叠加后可增强特殊技能伤害。
     */
    AddSpiritSeed(p: number, real_stack: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(real_stack);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13AddSpiritSeedEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 敛锋
     * 敛锋待时，时来破空。增强破天技能伤害。
     */
    AddRestrainedEdge(p: number, real_stack: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(real_stack);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17AddRestrainedEdgeEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 增加神息
     */
    SetAddSyliaOrb(p: number, a: number) {
        this.SetProbability(p);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetAddSyliaOrbEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 获取神息值
     */
    GetSyliaOrb(): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11GetSyliaOrbEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    /**
     * 上善
     * 增加对非玩家目标伤害
     * 增加对怪物伤害
     */
    SetIncMobDmg(p: number, t: number, r: number, b: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetIncMobDmgEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 行意
     * 刷新五行技能冷却。
     */
    SetFiveElems(p: number, t: number, _max: number, real_stack: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetValue(10);
        this.SetAmount(real_stack);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetFiveElemsEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 设置五行伤害
     */
    SetElementDamage(
        p: number,
        ultimate_chance: number,
        damage: number,
        r: number,
        a: number,
    ) {
        this.SetProbability(p);
        this.SetBuffid(ultimate_chance);
        this.SetValue(damage);
        this.SetRatio(r);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper16SetElementDamageEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 御甲
     * 一定概率增加目标御仙御佛御魔属性
     *
     * value和buffid：0-御魔，1-御佛，2-御仙
     */
    SetIncCultRes(
        p: number,
        t: number,
        r: number,
        cult_index: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetValue(cult_index);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetIncCultResEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 罪罚
     * 一定概率降低目标御仙御佛御魔属性
     *
     * value和buffid：0-御魔，1-御佛，2-御仙
     */
    SetDecCultRes(
        p: number,
        t: number,
        r: number,
        cult_index: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetValue(cult_index);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetDecCultResEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫降血上
     * 一段时间内免疫降低气血上限类效果。
     */
    SetRedImmunity(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetRedImmunityEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 免疫降蓝上
     * 一段时间内免疫降低真气上限类效果。
     */
    SetBlueImmunity(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetBlueImmunityEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 混乱
     * 增加目标一段时间内受到的伤害。
     */
    SetInchurt3(p: number, r: number, t: number, a: number) {
        this.SetProbability(p);
        this.SetRatio(r);
        this.SetTime(t);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper11SetInchurt3Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 行云
     * 仰彼朔风，行云徘徊。增强行云系技能。
     */
    AddCloudShift(p: number, a: number, t: number) {
        this.SetProbability(p);
        this.SetAmount(a);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13AddCloudShiftEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 招架
     * 免疫附加伤害和负面效果，并将受到的伤害转化成治疗
     */
    SetAvert(p: number, t: number, r: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetAvertEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 附加
     * 任何攻击中一定概率附加特定效果。
     *
     * 单体攻击技能^ffffff都有^ffcb4a%d%%^ffffff概率打断目标施法
     */
    SetSingleTargetBreak(
        p: number,
        t: number,
        r: number,
        skillid: number,
        skilllvl: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetValue(skillid);
        this.SetAmount(skilllvl);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper20SetSingleTargetBreakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 心斋
     */
    SetAbstain(p: number, t: number, trigger_lvl: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetAmount(trigger_lvl);
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetAbstainEb",
            "bool",
            ["pointer", "bool"],
        );
        const result = fc(this.pointer, 1);
        this.SetHp(1);
        return result;
    }

    /**
     * 渐愈
     * 一段时间内每秒回复一次气血
     * @param p
     * @param health
     * @param extra_skill_trigger
     * @param time
     * @param extra_skill_trigger_lvl
     * @param extra_trigger_chance
     * @constructor
     */
    SetHpgen2(
        p: number,
        health: number,
        extra_skill_trigger: number,
        time: number,
        extra_skill_trigger_lvl: number,
        extra_trigger_chance: number,
    ) {
        this.SetProbability(p);
        this.SetValue(health);
        this.SetAmount(extra_skill_trigger);
        this.SetTime(time);
        this.SetBuffid(extra_skill_trigger_lvl);
        this.SetRatio(extra_trigger_chance);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper9SetHpgen2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 雅颂
     * 帮友方承担部分伤害
     * （需要与从革配合使用）
     * @param p
     * @param time
     */
    SetInnerSkin(p: number, time: number) {
        this.SetProbability(p);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetInnerSkinEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 从革
     * 友方帮自身承担部分伤害
     * （需要与雅颂配合使用）
     * 从革效果无法和牺牲效果共存
     * @param p
     * @param ratio
     * @param time
     */
    SetOuterSkin(p: number, ratio: number, time: number) {
        this.SetProbability(p);
        this.SetRatio(ratio);
        this.SetTime(time);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper12SetOuterSkinEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 亢奋
     * 被攻击有概率将目标石化。
     */
    SetDecay(p: number, time: number, ratio: number, value: number) {
        this.SetProbability(p);
        this.SetTime(time);
        this.SetRatio(ratio);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetDecayEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 寂然
     * 持续时间内无法产生致命一击效果。
     * 会接着施加超逸^ffffff\r持续时间内无法被施加寂然效果
     */
    SetDisableCrit(p: number, time: number, value: number) {
        this.SetProbability(p);
        this.SetTime(time);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetDisableCritEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虚引
     * 持续时间内自身部分抗性被转移至他人。
     * @param p
     * @param time
     * @param value
     */
    SetResLeak(p: number, time: number, value: number) {
        this.SetProbability(p);
        this.SetTime(time);
        this.SetValue(value);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetResLeakEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 降低元力
     *
     * @param prob
     * @param value     降多少
     * @param amount    最多降多少
     * @param time
     * @param buffId
     */
    SetSubdp(
        prob: number,
        value: number,
        amount: number,
        time: number,
        buffId: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetValue(value);
        this.SetAmount(amount);
        this.SetTime(time);
        this.SetBuffid(buffId);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper8SetSubdpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 破甲
     * 一定概率增加目标克仙克佛克魔属性
     *
     * value和buffid：0-克魔，1-克佛，2-克仙
     */
    SetIncCultAtk(
        p: number,
        t: number,
        r: number,
        cult_index: number,
        b: number,
    ) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetValue(cult_index);
        this.SetBuffid(b);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetIncCultAtkEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 天尊法身，神通类
     */
    SetHiddenmbocdred(t: number) {
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetHiddenmbocdredEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 虚引
     * 免疫附加伤害效果
     */
    SetImmuneWhiteDmg(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper17SetImmuneWhiteDmgEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 道心姿态
     * 抗性转化为攻击。
     */
    SetMoralsense(p: number, a: number) {
        this.SetProbability(p);
        this.SetAmount(a);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper13SetMoralsenseEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 石化
     * 持续时间内目标无法受到伤害，也无法攻击他方。
     */
    SetPetrify(p: number, t: number) {
        this.SetProbability(p);
        this.SetTime(t);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper10SetPetrifyEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 灭魄
     *
     */
    SetAccumdamage2(p: number, t: number, r: number, max_damage: number) {
        this.SetProbability(p);
        this.SetTime(t);
        this.SetRatio(r);
        this.SetAmount(max_damage);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15SetAccumdamage2Eb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    AddCommonDebuff(
        type: number,
        time: number,
        value: number,
        unknow1: number,
        unknow2: number,
    ) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper15AddCommonDebuffEiiiib",
            "bool",
            ["pointer", "int32", "int32", "int32", "int32", "int32"],
        );
        return fc(this.pointer, type, time, value, unknow1, unknow2);
    }

    SetCoupleInchp(time: number, ratio: number) {
        if (this.GetHasbuff(9410)) {
            return;
        }

        this.SetTime(time);
        this.SetRatio(ratio);
        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper14SetCoupleInchpEb",
            "bool",
            ["pointer", "bool"],
        );
        return fc(this.pointer, 1);
    }

    /**
     * 是否青云
     * @returns
     */
    IsQingyun() {
        const occuMap = [7, 8, 9, 19, 20];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否天音
     * @returns
     */
    IsTianyin() {
        const occuMap = [10, 11, 12, 22, 23];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否鬼王
     * @returns
     */
    IsGuiwang() {
        const occuMap = [1, 2, 3, 13, 14];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否合欢
     * @returns
     */
    IsHehuan() {
        const occuMap = [4, 5, 6, 16, 17];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否鬼道
     * @returns
     */
    IsGuidao() {
        const occuMap = [25, 26, 27, 28, 29];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否焚香
     * @returns
     */
    IsFenxiang() {
        const occuMap = [64, 65, 66, 67, 68];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否九黎
     * @returns
     */
    IsJiuli() {
        const occuMap = [33, 34, 35, 36, 37];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否烈山
     * @returns
     */
    IsLieshan() {
        const occuMap = [39, 40, 41, 42, 43];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否怀光
     * @returns
     */
    IsHuaiguang() {
        const occuMap = [45, 46, 47, 48, 49];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否天华
     * @returns
     */
    IsTianhua() {
        const occuMap = [51, 52, 53, 54, 55];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否太昊
     * @returns
     */
    IsTaihao() {
        const occuMap = [96, 97, 98, 99, 100];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否辰皇
     * @returns
     */
    IsChenhuang() {
        const occuMap = [56, 57, 58, 59, 60];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否英招
     * @returns
     */
    IsYingzhao() {
        const occuMap = [108, 109, 110, 111, 112];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否牵机
     * @returns
     */
    IsQianji() {
        const occuMap = [102, 103, 104, 105, 106];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否破军
     * @returns
     */
    IsPojun() {
        const occuMap = [117, 118, 119, 120, 121];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否青罗
     * @returns
     */
    IsQingluo() {
        const occuMap = [71, 72, 73, 74, 75];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否归云
     * @returns
     */
    IsGuiyun() {
        const occuMap = [77, 78, 79, 80, 81];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 是否画影
     * @returns
     */
    IsHuaying() {
        const occuMap = [83, 84, 85, 86, 87];
        return occuMap.includes(this.GetOccupation());
    }

    /**
     * 熔甲，降低目标减免伤害百分比
     * 可叠加
     * @param prob
     * @param time
     * @param ratio
     * @param amount - 叠加层数 默认1
     */
    SetUltimateDamageReductionDebuff(
        prob: number,
        time: number,
        ratio: number,
        amount: number,
    ): boolean {
        this.SetProbability(prob);
        this.SetTime(time);
        this.SetRatio(ratio);
        this.SetAmount(amount);

        const fc = HookFuncCore.getNativeFunc(
            "_ZN4GNET13PlayerWrapper32SetUltimateDamageReductionDebuffEb",
            "bool",
            ["pointer", "int"],
        );
        return fc(this.pointer, 1);
    }

}
