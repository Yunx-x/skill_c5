import {PointerClass} from "../PointerClass";
import {HookFuncCore} from "../HookFuncCore";


export class MallInfo extends PointerClass{

    GetCash():number{
        const fc = HookFuncCore.getNativeFunc(
            "_ZN15player_mallinfo7GetCashEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

    GetCashAdd():number{
        const fc = HookFuncCore.getNativeFunc(
            "_ZN15player_mallinfo10GetCashAddEv",
            "int32",
            ["pointer"],
        );
        return fc(this.pointer);
    }

}