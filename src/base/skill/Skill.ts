import { HookFuncCore } from "../HookFuncCore";
import { PointerClass } from "../PointerClass";
import { SPlayer } from "./SPlayer";
import { SkillStub } from "./SkillStub";

/**
 * Skill类中常用的函数
 */
export class Skill extends PointerClass {
	public readonly stubPointer: SkillStub;

	constructor(stubPointer: NativePointer, skillPointer: NativePointer) {
		super(skillPointer);
		this.stubPointer = stubPointer ? new SkillStub(stubPointer) : undefined;
	}

	/**
	 * 获取技能id
	 */
	GetId(): number {
		const fc = HookFuncCore.getNativeFunc("_ZNK4GNET5Skill5GetIdEv", "int32", [
			"pointer",
		]);
		return fc(this.pointer);
	}

	/**
	 * 获取目标地址
	 */
	GetVictimNice(): SPlayer {
		const fc = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill9GetVictimEv",
			"pointer",
			["pointer"],
		);
		return new SPlayer(fc(this.pointer));
	}

	/**
	 * 获取目标玩家地址（新）
	 */
	GetPlayerNice(): SPlayer {
		const fc = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill9GetPlayerEv",
			"pointer",
			["pointer"],
		);
		return new SPlayer(fc(this.pointer));
	}

	/**
	 * 获取目标地址
	 */
	GetVictim(): SPlayer {
		const fc = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill9GetVictimEv",
			"pointer",
			["pointer"],
		);
		return new SPlayer(fc(this.pointer));
	}

	/**
	 * 获取目标玩家地址（新）
	 */
	GetPlayer(): SPlayer {
		const fc = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill9GetPlayerEv",
			"pointer",
			["pointer"],
		);
		return new SPlayer(fc(this.pointer));
	}

	/**
	 * 获取技能等级
	 *
	 * @constructor
	 */
	GetLevel(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill8GetLevelEv",
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取蓄力时间比例
	 */
	GetCharging(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill11GetChargingEv",
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取倍率
	 */
	GetRatio(): number {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill8GetRatioEv", "float", [
			"pointer",
		]);
		return f(this.pointer);
	}

	/**
	 * 设置技能倍率
	 */
	SetRatio(v: number) {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill8SetRatioEf", "void", [
			"pointer",
			"float",
		]);
		return f(this.pointer, v);
	}

	/**
	 * 获取附加攻击力
	 */
	GetPlus(): number {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill7GetPlusEv", "float", [
			"pointer",
		]);
		return f(this.pointer);
	}

	/**
	 * 设置附加攻击力
	 */
	SetPlus(v: number) {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill7SetPlusEf", "void", [
			"pointer",
			"float",
		]);
		return f(this.pointer, v);
	}

	/**
	 * 获取附加攻击力2
	 */
	GetPlus2() {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill8GetPlus2Ev", "float", [
			"pointer",
		]);
		return f(this.pointer);
	}

	/**
	 * 设置附加攻击力2
	 * damage_no_crit   不暴击的伤害
	 */
	SetPlus2(v: number) {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill8SetPlus2Ef", "void", [
			"pointer",
			"float",
		]);
		return f(this.pointer, v);
	}

	/**
	 * 获取附加暴击
	 */
	GetCrit() {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill7GetCritEv", "float", [
			"pointer",
		]);
		return f(this.pointer);
	}

	/**
	 * 设置附加暴击
	 */
	SetCrit(v: number) {
		const f = HookFuncCore.getNativeFunc("_ZN4GNET5Skill7SetCritEf", "void", [
			"pointer",
			"float",
		]);
		return f(this.pointer, v);
	}

	/**
	 * 获取附加爆伤
	 */
	GetCrithurt() {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill11GetCrithurtEv",
			"float",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 设置附加爆伤
	 */
	SetCrithurt(v: number) {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill11SetCrithurtEf",
			"void",
			["pointer", "float"],
		);
		return f(this.pointer, v);
	}

	/**
	 * 获取附加技能命中
	 */
	GetSkillaccu() {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill12GetSkillaccuEv",
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 设置附加技能命中
	 */
	SetSkillaccu(v: number) {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill12SetSkillaccuEi",
			"void",
			["pointer", "int32"],
		);
		return f(this.pointer, v);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 * @param value
	 */
	GetT(value: number): number {
		const f = HookFuncCore.getNativeFunc(
			`_ZN4GNET5Skill5GetT${value}Ev`,
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT0(): number {
		return this.GetT(0);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT1(): number {
		return this.GetT(1);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT2(): number {
		return this.GetT(2);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT3(): number {
		return this.GetT(3);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT4(): number {
		return this.GetT(4);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT5(): number {
		return this.GetT(5);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT6(): number {
		return this.GetT(6);
	}

	/**
	 * 获取天书技能等级
	 * getTalent
	 * 0-7
	 */
	GetT7(): number {
		return this.GetT(7);
	}

	/**
	 * 获取天华音律等级
	 * 0-3
	 */
	GetJ(v: number): number {
		const f = HookFuncCore.getNativeFunc(`_ZN4GNET5Skill5GetJ${v}Ev`, "int32", [
			"pointer",
		]);
		return f(this.pointer);
	}

	/**
	 * 商元素
	 *
	 * 天华的音律
	 */
	GetJ0(): number {
		return this.GetJ(0);
	}

	/**
	 * 羽元素
	 *
	 * 天华的音律
	 */
	GetJ1(): number {
		return this.GetJ(1);
	}

	/**
	 * 宫元素
	 *
	 * 天华的音律
	 */
	GetJ2(): number {
		return this.GetJ(2);
	}

	/**
	 * 天华的音律
	 */
	GetJ3(): number {
		return this.GetJ(3);
	}

	/**
	 * 获取是否暴击
	 */
	GetIscrit(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill9GetIscritEv",
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取怀光连击点
	 *
	 * combo color
	 *
	 * 0~4
	 */
	GetC(v: number): number {
		const f = HookFuncCore.getNativeFunc(`_ZN4GNET5Skill5GetC${v}Ev`, "int32", [
			"pointer",
		]);
		return f(this.pointer);
	}

	/**
	 * 获取怀光连击点
	 */
	GetC0(): number {
		return this.GetC(0);
	}

	/**
	 * 获取是否仅对怪物生效
	 */
	GetMobOnly(): boolean {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill10GetMobOnlyEv",
			"bool",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 设置仅对怪物生效
	 */
	SetMobOnly(v: boolean) {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill10SetMobOnlyEb",
			"void",
			["pointer", "bool"],
		);
		return f(this.pointer, v);
	}

	/**
	 * 获取伤害
	 */
	GetDamage(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill9GetDamageEv",
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取仅对怪物的附加伤害
	 */
	GetMobBonusDamage(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill17GetMobBonusDamageEv",
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 设置仅对怪物的附加伤害
	 */
	SetMobBonusDamage(v: number) {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill17SetMobBonusDamageEi",
			"void",
			["pointer", "int32"],
		);
		return f(this.pointer, v);
	}

	/**
	 * 设置仅对怪物的附加爆伤
	 */
	SetMobCrithurt(v: number) {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill14SetMobCrithurtEf",
			"void",
			["pointer", "float"],
		);
		return f(this.pointer, v);
	}

	/**
	 * 获取仅对怪物的附加爆伤
	 */
	GetMobCrithurt(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZN4GNET5Skill14GetMobCrithurtEv",
			"float",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取攻击模式
	 */
	GetAttackMode(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill15GetAttackerModeEv",
			"char",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取攻击者信息
	 * attacker_info_t
	 */
	GetAttacker(): NativePointer {
		const f = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill11GetAttackerEv",
			"pointer",
			["pointer"],
		);
		return f(this.pointer);
	}

	/**
	 * 获取攻击者id
	 * XID
	 */
	GetAttackerid(): NativePointer {
		const f = HookFuncCore.getNativeFunc(
			"_ZNK4GNET5Skill13GetAttackeridEv",
			"pointer",
			["pointer"],
		);
		return f(this.pointer);
	}
}
