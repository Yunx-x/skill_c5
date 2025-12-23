import {HookFuncCore} from "../HookFuncCore";
import {PointerClass} from "../PointerClass";

export class ItemBody extends PointerClass{

    GetTID(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK9item_body6GetTIDEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetEquipMask(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK9item_body12GetEquipMaskEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

}