import {getHookStubFuncName, getSkillStub, getStateCalculateName, getStateTimeName,} from "./HookSkillUtil";
import type {Skill} from "./Skill";
import {SkillFuncCore} from "./SkillFuncCore";

export abstract class BaseHookSkillStub {
	skillId: number;

	private hookIfImplementedValue<K extends keyof BaseHookSkillStub>(methodName: K, returnType: string) {
		const baseProto = BaseHookSkillStub.prototype;
		const currentProto = Object.getPrototypeOf(this);
		if ((currentProto as any)[methodName] !== (baseProto as any)[methodName]) {
			const fn = (this as any)[methodName];
			// console.log(methodName);
			SkillFuncCore.hookSkillValue(getHookStubFuncName(this.skillId, methodName), returnType, fn.bind(this));
		}
		// else {
		// 	console.log(`[忽略] ${methodName}`);
		// }
	}

	private hookIfImplementedEffect<K extends keyof BaseHookSkillStub>(methodName: K) {
		const baseProto = BaseHookSkillStub.prototype;
		const currentProto = Object.getPrototypeOf(this);
		if ((currentProto as any)[methodName] !== (baseProto as any)[methodName]) {
			const fn = (this as any)[methodName];
			// console.log(methodName);
			SkillFuncCore.hookSkillEffect(getHookStubFuncName(this.skillId, methodName), fn.bind(this));
		}
		// else {
		// 	console.log(`[忽略] ${methodName}`);
		// }
	}

	private hookIfImplementedStateTime(state: number) {
		// console.log(("GetTime" + state))
		const methodName = ("GetTime" + state) as keyof BaseHookSkillStub;
		const baseProto = BaseHookSkillStub.prototype;
		const currentProto = Object.getPrototypeOf(this);
		if ((currentProto as any)[methodName] !== (baseProto as any)[methodName]) {
			const fn = (this as any)[methodName];
			// console.log(methodName);
			SkillFuncCore.hookSkillValue(getStateTimeName(this.skillId, state), "int32", fn.bind(this));
		}
		// else {
		// 	console.log(`[忽略] ${methodName}`);
		// }
	}

	private hookIfImplementedStateCalculate(state: number) {
		const methodName = ("Calculate" + state) as keyof BaseHookSkillStub;
		const baseProto = BaseHookSkillStub.prototype;
		const currentProto = Object.getPrototypeOf(this);
		if ((currentProto as any)[methodName] !== (baseProto as any)[methodName]) {
			const fn = (this as any)[methodName];
			// console.log(methodName);
			SkillFuncCore.hookSkillEffect(getStateCalculateName(this.skillId, state), fn.bind(this));
		}
		// else {
		// 	console.log(`[忽略] ${methodName}`);
		// }
	}

	/**
	 * @param {number} skillId
	 */
	constructor(skillId: number) {
		this.skillId = skillId;

		if (!this.skillId || this.skillId <= 0) {
			return;
		}

		// console.log(`----------${this.skillId} 挂载Hook----------`)
		this.hookIfImplementedValue("GetExecutetime", "int32");
		this.hookIfImplementedValue("GetCooldowntime", "int32");
		this.hookIfImplementedValue("GetEnmity", "int32");
		this.hookIfImplementedValue("GetRadius", "float");
		this.hookIfImplementedValue("GetAttackdistance", "float");
		this.hookIfImplementedValue("GetAngle", "float");
		this.hookIfImplementedValue("GetPraydistance", "float");
		this.hookIfImplementedValue("GetCastdistance", "float");
		this.hookIfImplementedValue("GetEffectdistance", "float");
		this.hookIfImplementedValue("GetMpcost", "float");
		this.hookIfImplementedValue("GetInkcost", "int32");
		this.hookIfImplementedValue("GetHpcost", "int32");
		this.hookIfImplementedValue("GetDpcost", "int32");
		this.hookIfImplementedValue("GetCoverage", "int32");

		this.hookIfImplementedEffect("BlessMe");
		this.hookIfImplementedEffect("StateAttack");
		this.hookIfImplementedEffect("TakeEffect");

		this.hookIfImplementedEffect("CheckDarkLightValue");
		this.hookIfImplementedEffect("GetChargeNewDist");

		this.hookIfImplementedValue("GetConButtonMax", "int32");
		this.hookIfImplementedValue("GetConButtonTime", "int32");

		const stub = getSkillStub(this.skillId);
		const state_size = stub.getStateSize()

		for (let i = 1; i <= state_size; i++) {
			this.hookIfImplementedStateTime(i);
			this.hookIfImplementedStateCalculate(i);
		}

		// console.log(`====================`)
	}

	/**
	 * 设置职业限制
	 * @param {number} occupation
	 * @returns {void}
	 */
	SetOccupation(occupation: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x14).writeInt(occupation);
	}

	/**
	 * 设置技能类别：1主动攻击 2主动祝福 3主动诅咒 4物品技能 5被动 6武器附加 7生产 8瞬移
	 * @param {number} type
	 * @returns {void}
	 */
	SetType(type: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x2c).writeU8(type);
	}

	SetTimeType(type: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x2d).writeU8(type);
	}

	/**
	 * 技能攻击范围：0点 1线 2自身球 3目标球 4圆锥形 5自身 6地面无目标 11自身周围无目标
	 * @param {number} type
	 * @returns {void}
	 */
	SetRangeType(type: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x2f).writeU8(type);
	}

	/**
	 * 设置技能学习消耗
	 * @param {number} type
	 * @returns {void}
	 */
	SetCreditType(type: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x37).writeInt(type);
	}

	SetCharge(type: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x2e).writeU8(type);
	}

	/**
	 * 设置技能学习消耗2
	 * @param {number} type
	 * @returns {void}
	 */
	SetCreditType2(type: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x174).writeInt(type);
	}

	/**
	 * 设置技能最大等级
	 * @param {number} level
	 * @returns {void}
	 */
	SetMaxLevel(level: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x18).writeInt(level);
	}

	/**
	 * 设置技能最大学习等级
	 * @param {number} level
	 * @returns {void}
	 */
	SetMaxLearn(level: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x1c).writeInt(level);
	}

	/**
	 * 设置技能掩码
	 * @param {number} mask
	 * @returns {void}
	 */
	SetClearMask(mask: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x3b).writeInt(mask);
	}

	/**
	 * 设置技能类别
	 * @param skillClass 技能类别
	 * @returns {void}
	 */
	SetSkillClass(skillClass: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x14e).writeInt(skillClass);
	}

	/**
	 * 设置技能前置技能数量
	 * @param num 技能前置技能数量
	 */
	SetPreskillnum(num: number): void {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x141).writeInt(num);
	}

	/**
	 * 设置技能释放模式
	 * @param type
	 */
	SetAllowForm(type: number) {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x33).writeInt(type);
	}

	/**
	 * 设置技能是否调用 StateAttack
	 * @param bool true = 1，false = 0
	 */
	Doenchant(bool: number) {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x30).writeU8(bool);
	}

	/**
	 * 设置技能是否调用 BlessMe
	 * @param bool true = 1，false = 0
	 */
	Dobless(bool: number) {
		const stub = getSkillStub(this.skillId);
		stub.pointer.add(0x31).writeU8(bool);
	}

	/**
	 * 获取执行时间
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number}
	 */
	GetExecutetime(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取冷却时间
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number}
	 */
	GetCooldowntime(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取敌意（是否产生敌意？）
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} 1表示产生敌意，0表示不产生
	 */
	GetEnmity(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取半径范围
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} float
	 */
	GetRadius(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取攻击距离
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} float
	 */
	GetAttackdistance(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取攻击扇形范围
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} float
	 */
	GetAngle(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取祈祷距离
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} float
	 */
	GetPraydistance(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取施法距离
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} float
	 */
	GetCastdistance(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取法阵效果距离
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} float
	 */
	GetEffectdistance(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取真气消耗
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} float
	 */
	GetMpcost(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取攻击消耗
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} int
	 */
	GetInkcost(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取气血消耗
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} int
	 */
	GetHpcost(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取元力消耗
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} int
	 */
	GetDpcost(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取覆盖目标数量
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} int
	 */
	GetCoverage(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 状态攻击，每个State计算完均会执行一次该函数
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {boolean}
	 */
	StateAttack(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<void, NativePointer[]>
	): boolean {
		originFunc(stub, skill.pointer);
		return true;
	}

	/**
	 * 法阵效果，被动效果
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {boolean}
	 */
	TakeEffect(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<void, NativePointer[]>
	): boolean {
		originFunc(stub, skill.pointer);
		return true;
	}

	/**
	 * 祝福自己（对自己生效的效果）
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {boolean}
	 */
	BlessMe(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<void, NativePointer[]>
	): boolean {
		originFunc(stub, skill.pointer);
		return true;
	}

	/**
	 * 释放前检查光暗值
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {boolean}
	 */
	CheckDarkLightValue(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<void, NativePointer[]>
	): boolean {
		originFunc(stub, skill.pointer);
		return true;
	}

	/**
	 * 获取位移距离
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} int
	 */
	GetChargeNewDist(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取连击按钮最大次数
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} int
	 */
	GetConButtonMax(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 获取连击按钮冷却时间
	 * @param {NativePointer} stub
	 * @param {Skill} skill
	 * @param {NativeFunction} originFunc
	 * @returns {number} int
	 */
	GetConButtonTime(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>
	): number {
		return originFunc(stub, skill.pointer);
	}

	/**
	 * 第X段效果
	 */
	Calculate1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	/**
	 * 第X段效果执行时间
	 */
	GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

	Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
		originFunc(stub, skill.pointer)
	}

	GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
		return <number>originFunc(stub, skill.pointer)
	}

}
