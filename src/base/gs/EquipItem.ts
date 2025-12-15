import {PointerClass} from "../PointerClass";
import {HookFuncCore} from "../HookFuncCore";


//equip_item
export class EquipItem extends PointerClass{

    GetEStoneID():number{
        const func = HookFuncCore.getNativeFunc(
            "_ZNK10equip_item11GetEStoneIDEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetEquipMask():number{
        const func = HookFuncCore.getNativeFunc(
            "_ZNK10equip_item12GetEquipMaskEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

}