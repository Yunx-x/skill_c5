import { HookFuncCore } from "../HookFuncCore";

export class GActiveObject {
  static ClrObjectState(gobj: NativePointer, state: number) {
    const fc = HookFuncCore.getNativeFunc("_ZN14gactive_object14ClrObjectStateEi", "pointer", [
      "pointer",
      "int",
    ]);
    return fc(gobj, state);
  }
}
