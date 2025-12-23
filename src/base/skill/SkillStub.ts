import { HookFuncCore } from "../HookFuncCore";
import { PointerClass } from "../PointerClass";

/**
 * SkillStub类中常用的函数
 */
export class SkillStub extends PointerClass {
	/**
	 * 获取一共多少段
	 */
	getStateSize(): number {
		const f = HookFuncCore.getNativeFunc(
			"_ZNK4GNET9SkillStub12GetStateSizeEv",
			"int32",
			["pointer"],
		);
		return f(this.pointer);
	}
}
