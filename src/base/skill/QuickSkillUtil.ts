import {
	getHookStubFuncName,
	getSkillStub,
	getStateTimeName,
} from "./HookSkillUtil";
import type { Skill } from "./Skill";
import { SkillFuncCore } from "./SkillFuncCore";

/**
 * 快速对多个技能设置相同 cooldownTime
 */
export abstract class QuickCoolDownList {
	constructor() {
		this.parseChange();
	}

	abstract getSkillList(): number[];

	protected parseChange() {
		const coolDown = this.GetCooldowntime;
		if (coolDown !== undefined) {
			for (const id of this.getSkillList()) {
				SkillFuncCore.hookSkillValue(
					getHookStubFuncName(id, "GetCooldowntime"),
					"int32",
					this.GetCooldowntime,
				);
			}
		}
	}

	protected GetCooldowntime(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return originFunc(stub, skill.pointer);
	}
}

/**
 * 快速对多个技能设置相同 cooldownTime
 */
export abstract class QuickExecutetimeList {
	constructor() {
		this.parseChange();
	}

	abstract getSkillList(): number[];

	protected parseChange() {
		const executetime = this.GetExecutetime;
		if (executetime !== undefined) {
			for (const skillId of this.getSkillList()) {
				SkillFuncCore.hookSkillValue(
					getHookStubFuncName(skillId, "GetExecutetime"),
					"int32",
					this.GetExecutetime,
				);

				const stub = getSkillStub(skillId);
				const state_size = stub.getStateSize();
				if (state_size >= 1) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 1),
						"int32",
						this.GetTime1,
					);
				}

				if (state_size >= 2) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 2),
						"int32",
						this.GetTime2,
					);
				}

				if (state_size >= 3) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 3),
						"int32",
						this.GetTime3,
					);
				}

				if (state_size >= 4) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 4),
						"int32",
						this.GetTime4,
					);
				}

				if (state_size >= 5) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 5),
						"int32",
						this.GetTime5,
					);
				}

				if (state_size >= 6) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 6),
						"int32",
						this.GetTime6,
					);
				}

				if (state_size >= 7) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 7),
						"int32",
						this.GetTime7,
					);
				}

				if (state_size >= 8) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 8),
						"int32",
						this.GetTime8,
					);
				}

				if (state_size >= 9) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 9),
						"int32",
						this.GetTime9,
					);
				}

				if (state_size >= 10) {
					SkillFuncCore.hookSkillValue(
						getStateTimeName(skillId, 10),
						"int32",
						this.GetTime10,
					);
				}
			}
		}
	}

	protected GetExecutetime(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return originFunc(stub, skill.pointer);
	}

	protected GetTime1(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime2(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime3(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime4(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime5(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime6(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime7(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime8(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime9(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}

	protected GetTime10(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<number, NativePointer[]>,
	): number {
		return <number>originFunc(stub, skill.pointer);
	}
}

export abstract class QuickStateAttackList {
	constructor() {
		this.parseChange();
	}

	abstract getSkillList(): number[];

	protected parseChange() {
		const stateAttack = this.StateAttack;
		if (stateAttack !== undefined) {
			for (const skillId of this.getSkillList()) {
				SkillFuncCore.hookSkillEffect(
					getHookStubFuncName(skillId, "StateAttack"),
					this.StateAttack,
				);
			}
		}
	}

	/**
	 * 状态攻击，每个State计算完均会执行一次该函数
	 */
	protected StateAttack(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<void, NativePointer[]>,
	): boolean {
		originFunc(stub, skill.pointer);
		return true;
	}
}

export abstract class QuickBlessMeList {
	constructor() {
		this.parseChange();
	}

	abstract getSkillList(): number[];

	protected parseChange() {
		const func = this.BlessMe;
		if (func !== undefined) {
			for (const skillId of this.getSkillList()) {
				SkillFuncCore.hookSkillEffect(
					getHookStubFuncName(skillId, "BlessMe"),
					this.BlessMe,
				);
			}
		}
	}

	/**
	 * 保护自己（对自己生效的效果）
	 */
	protected BlessMe(
		stub: NativePointer,
		skill: Skill,
		originFunc: NativeFunction<void, NativePointer[]>,
	): boolean {
		originFunc(stub, skill.pointer);
		return true;
	}
}
