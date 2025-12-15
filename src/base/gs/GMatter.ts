import {PointerClass} from "../PointerClass";
import {HookFuncCore} from "../HookFuncCore";


export class GMatter extends PointerClass {
    IsMineOwner():number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN7gmatter11IsMineOwnerEiii",
            "bool",
            ["pointer"],
        );
        return func(this.pointer);
    }
}