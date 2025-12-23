import { HookFuncCore } from "../HookFuncCore";
import { PointerClass } from "../PointerClass";

export class SkillWrapper extends PointerClass {
	GetRejectRate(): number {
		const fc = HookFuncCore.getNativeFunc(
			"_ZN4GNET12SkillWrapper13GetRejectRateEv",
			"pointer",
			["pointer"],
		);
		return fc(this.pointer);
	}

	GetMap():NativePointer{
		return this.pointer.add(4)
	}

}

export function FindSkillDataForMap(mapAddress:NativePointer,id: NativePointer): NativePointer {
	const func = HookFuncCore.getNativeFunc("_ZNSt3mapIjN4GNET12SkillWrapper14PersistentDataESt4lessIjESaISt4pairIKjS2_EEEixERS6_",
		"pointer", ["pointer", "pointer"])
	return func(mapAddress, id)
}
