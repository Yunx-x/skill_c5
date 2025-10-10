import {HookFuncCore} from "./HookFuncCore";
import {A3DVECTOR} from "./A3DVECTOR";
import type {SkillWrapper} from "./skill/SkillWrapper";

export class ObjectInterface {
    /**
     * 获取自身XID
     *
     * @param obj   XID，包含类型和id
     */
    static getSelfXID(obj: NativePointer): NativePointer {
        const func = HookFuncCore.getNativeFunc(
            "_ZN16object_interface9GetSelfIDEv",
            "pointer",
            ["pointer"],
        );
        return func(obj);
    }

    static getSelfType(obj: NativePointer): number {
        return ObjectInterface.getSelfXID(obj).readInt();
    }

    static getSelfID(obj: NativePointer): number {
        return ObjectInterface.getSelfXID(obj).add(4).readInt();
    }

    static GetTeamLeader(obj: NativePointer): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13GetTeamLeaderEv",
            "int32",
            ["pointer"],
        );
        return fc(obj);
    }

    static GetDuelTargetID(obj: NativePointer): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface15GetDuelTargetIDEv",
            "int32",
            ["pointer"],
        );
        return fc(obj);
    }

    static IsFilterExist(obj: NativePointer, filterId: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13IsFilterExistEi",
            "bool",
            ["pointer", "int32"],
        );
        return fc(obj, filterId);
    }

    static RemoveBuff(
        obj: NativePointer,
        buffId: number,
        buffLevel: number,
    ): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface10RemoveBuffEss",
            "int32",
            ["pointer", "int32", "int32"],
        );
        return fc(obj, buffId, buffLevel);
    }

    static DecVisibleState(obj: NativePointer, id: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface15DecVisibleStateEt",
            "int32",
            ["pointer", "int32"],
        );
        return fc(obj, id);
    }

    static IncVisibleState(obj: NativePointer, id: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface15IncVisibleStateEt",
            "int32",
            ["pointer", "int32"],
        );
        return fc(obj, id);
    }

    static BeHurt(
        obj: NativePointer,
        XID: NativePointer,
        attacker_info: NativePointer,
        damage: number,
        invader: number,
        attacker_mode: number,
    ) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface6BeHurtERK3XIDRK15attacker_info_tibcc",
            "int",
            ["pointer", "pointer", "pointer", "int32", "bool", "char", "int32"],
        );
        return fc(obj, XID, attacker_info, damage, invader, attacker_mode, 0);
    }

    static GetSkillWrapper(obj: NativePointer): SkillWrapper {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface15GetSkillWrapperEv",
            "pointer",
            ["pointer"],
        );
        return fc(obj);
    }

    static GetImmuneMask(obj: NativePointer): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13GetImmuneMaskEv",
            "int32",
            ["pointer"],
        );
        return fc(obj);
    }

    static AddFilter(obj: NativePointer, filter: NativePointer): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface9AddFilterEP6filter",
            "int32",
            ["pointer", "pointer"],
        );
        return fc(obj, filter);
    }

    static EnhanceScaleIgnDmgReduce(obj: NativePointer, value: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface24EnhanceScaleIgnDmgReduceEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static EnhanceScaleDmgReduce(obj: NativePointer, value: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface21EnhanceScaleDmgReduceEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static EnhanceAttack(obj: NativePointer, value: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13EnhanceAttackEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static EnhanceDamage(obj: NativePointer, value: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13EnhanceDamageEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static ImpairScaleIgnDmgReduce(obj: NativePointer, value: number): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface23ImpairScaleIgnDmgReduceEi",
            "int32",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static UpdateAttackData(obj: NativePointer): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface16UpdateAttackDataEv",
            "int32",
            ["pointer"],
        );
        return fc(obj);
    }

    static UpdateMagicData(obj: NativePointer): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface15UpdateMagicDataEv",
            "int32",
            ["pointer"],
        );
        return fc(obj);
    }

    static GetExtendProp(obj: NativePointer): NativePointer {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13GetExtendPropEv",
            "pointer",
            ["pointer"],
        );
        return fc(obj);
    }

    static GetCultivation(obj: NativePointer): NativePointer {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13GetExtendPropEv",
            "pointer",
            ["pointer"],
        );
        return fc(obj);
    }

    static GetPos(obj: NativePointer): A3DVECTOR {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface6GetPosEv",
            "pointer",
            ["pointer"],
        );
        return new A3DVECTOR(fc(obj));
    }

    static UpdateAllProp(obj: NativePointer) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface13UpdateAllPropEv",
            "void",
            ["pointer"],
        );
        return fc(obj);
    }

    /**
     * 提高技能命中
     */
    static EnhanceSkillAttack(obj: NativePointer, ratio: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface18EnhanceSkillAttackEi",
            "pointer",
            ["pointer", "int32"],
        );
        return fc(obj, ratio);
    }

    /**
     * 降低技能命中
     */
    static ImpairSkillAttack(obj: NativePointer, ratio: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface17ImpairSkillAttackEi",
            "pointer",
            ["pointer", "int32"],
        );
        return fc(obj, ratio);
    }

    /**
     * 提高技能躲闪百分比
     */
    static EnhanceSkillArmor(obj: NativePointer, ratio: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface17EnhanceSkillArmorEi",
            "pointer",
            ["pointer", "int32"],
        );
        return fc(obj, ratio);
    }

    /**
     * 降低技能躲闪百分比
     */
    static ImpairSkillArmor(obj: NativePointer, ratio: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface16ImpairSkillArmorEi",
            "pointer",
            ["pointer", "int32"],
        );
        return fc(obj, ratio);
    }

    /**
     * 球型范围效果
     *
     *         gactive_imp **a1,
     *         A3DVECTOR *a2,
     *         float a3,
     *         enchant_msg *a4,
     *         int a5,
     *         int a6
     */
    static RegionEnchant1(
        obj: NativePointer,
        pos: A3DVECTOR,
        radius: number,
        enchant_msg: NativePointer,
        mc: number,
        exclude_target: NativePointer,
    ) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface14RegionEnchant1ERK9A3DVECTORfR11enchant_msgiRSt6vectorI14exclude_targetSaIS6_EE",
            "void",
            ["pointer", "pointer", "float", "pointer", "int32", "pointer"],
        );
        fc(obj, pos.pointer, radius, enchant_msg, mc, exclude_target);
    }

    //更新Buff图标
    //short buff_id, short buff_level, int end_time, int overlay_cnt
    static UpdateBuff(
        obj: NativePointer,
        buffId: number,
        buffLevel: number,
        endTime: number,
        overlayCnt: number,
    ): number {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface10UpdateBuffEssii",
            "void",
            ["pointer", "int16", "int16", "int32", "int32"],
        );
        return fc(obj, buffId, buffLevel, endTime, overlayCnt);
    }

    static object_interface(obj: NativePointer, gplayer_imp: NativePointer, boolA3: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interfaceC2EP11gactive_impb",
            "pointer",
            ["pointer", "pointer", "int32"],
        );
        return fc(obj, gplayer_imp, boolA3);
    }

    static Enchant(obj: NativePointer, xid: NativePointer, enchant_msg: NativePointer) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface7EnchantERK3XIDR11enchant_msg",
            "int",
            ["pointer", "pointer", "pointer"],
        );
        return fc(obj, xid, enchant_msg);
    }

    static IsInTeam(obj: NativePointer) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface8IsInTeamEv",
            "int32",
            ["pointer"],
        );
        return fc(obj);
    }

    static TeamEnchant(obj: NativePointer, enchant_msg: NativePointer) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface11TeamEnchantER11enchant_msgbb",
            "int32",
            ["pointer", "pointer", "bool", "bool"],
        );
        return fc(obj, enchant_msg, 0, 0);
    }

    static RemoveFilter(obj: NativePointer, filterId: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface12RemoveFilterEi", "void", [
            "pointer",
            "int",
        ]);
        return fc(obj, filterId);
    }

    /**
     * 提高御
     * @param obj
     * @param cult_index 0: 魔 1: 佛 2: 仙
     * @param value
     * @returns
     */
    static EnhanceCultDefense(obj: NativePointer, cult_index: number, value: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface18EnhanceCultDefenseEii",
            "pointer",
            ["pointer", "uint", "int32"],
        );
        const realValue = value * 1000;
        return fc(obj, cult_index, realValue);
    }

    /**
     * 降低御
     * @param obj
     * @param cult_index 0: 魔 1: 佛 2: 仙
     * @param value
     * @returns
     */
    static ImpairCultDefense(obj: NativePointer, cult_index: number, value: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface17ImpairCultDefenseEii",
            "pointer",
            ["pointer", "uint", "int32"],
        );
        const realValue = value * 1000;
        return fc(obj, cult_index, realValue);
    }

    /**
     * 提高克
     * @param obj
     * @param cult_index 0: 魔 1: 佛 2: 仙
     * @param value
     * @returns
     */
    static EnhanceCultAttack(obj: NativePointer, cult_index: number, value: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface17EnhanceCultAttackEii",
            "pointer",
            ["pointer", "int32", "int32"],
        );
        return fc(obj, cult_index, value);
    }

    /**
     * 降低克
     * @param obj
     * @param cult_index 0: 魔 1: 佛 2: 仙
     * @param value
     * @returns
     */
    static ImpairCultAttack(obj: NativePointer, cult_index: number, value: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface16ImpairCultAttackEii", "pointer", [
            "pointer",
            "int32",
            "int32",
        ]);
        return fc(obj, cult_index, value);
    }

    static EnhanceAntiCritRate(obj: NativePointer, value: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface19EnhanceAntiCritRateEi",
            "pointer",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static ImpairAntiCritRate(obj: NativePointer, value: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface18ImpairAntiCritRateEi", "pointer", [
            "pointer",
            "int32",
        ]);
        return fc(obj, value);
    }

    static EnhanceScaleDamage(obj: NativePointer, value: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface18EnhanceScaleDamageEi",
            "pointer",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static ImpairScaleDamage(obj: NativePointer, value: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface17ImpairScaleDamageEi",
            "pointer", [
                "pointer",
                "int32",
            ]);
        return fc(obj, value);
    }

    static EnhanceScaleMaxHP(obj: NativePointer, value: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface17EnhanceScaleMaxHPEi",
            "pointer",
            ["pointer", "int32"],
        );
        return fc(obj, value);
    }

    static ImpairScaleMaxHP(obj: NativePointer, value: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface16ImpairScaleMaxHPEi",
            "pointer", [
                "pointer",
                "int32",
            ]);
        return fc(obj, value);
    }

    static EnhanceResistanceTenaciy(obj: NativePointer, type: number, value: number) {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN16object_interface24EnhanceResistanceTenaciyEji",
            "pointer",
            ["pointer", "int32", "int32"],
        );
        return fc(obj, type, value);
    }

    static ImpairResistanceTenaciy(obj: NativePointer, type: number, value: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface23ImpairResistanceTenaciyEji",
            "pointer", [
                "pointer",
                "int32",
                "int32"
            ]);
        return fc(obj, type, value);
    }

    static ClearRandomSpecFilter(obj: NativePointer, mask: number, amount: number, value: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface21ClearRandomSpecFilterEiii",
            "void", [
                "pointer",
                "int32",
                "int32",
                "int32"
            ]);
        return fc(obj, mask, amount, value);
    }

    static SendClientLearnSkill(obj: NativePointer, id: number, level: number) {
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface20SendClientLearnSkillEii",
            "int32", [
                "pointer",
                "int32",
                "int32"
            ]);
        return fc(obj, id, level);
    }

    static EnhanceProp(obj: NativePointer, type: number, value: number){
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface11EnhancePropEii",
            "void", [
                "pointer",
                "int32",
                "int32"
            ]);
        fc(obj, type, value);
    }

    static ImpairProp(obj: NativePointer, type: number, value: number){
        const fc = HookFuncCore.getNativeFunc("_ZN16object_interface10ImpairPropEii",
            "void", [
                "pointer",
                "int32",
                "int32"
            ]);
        fc(obj, type, value);
    }

}
