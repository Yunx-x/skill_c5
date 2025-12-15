import { HookFuncCore } from "../HookFuncCore";
import { PointerClass } from "../PointerClass";

/**
 * gactive_imp
 *
 */
export class GActiveImp extends PointerClass {
	GetObjectInterface(): NativePointer {
		//(object_interface *this, gactive_imp *a2, bool a3)
		const oi = Memory.alloc(0x08);
		const fc = HookFuncCore.getNativeFunc(
			"_ZN16object_interfaceC2EP11gactive_impb",
			"pointer",
			["pointer", "pointer", "int32"],
		);
		fc(oi, this.pointer, 0);
		return oi;
	}
}
