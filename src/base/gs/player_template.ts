import {HookFuncCore} from "../HookFuncCore";

export class player_template {
    static GetDeathDropRate(pkLevel: number, eq_drop: NativePointer, inv_drop: NativePointer) {
        const fc = HookFuncCore.getNativeFunc("_ZN15player_template16GetDeathDropRateEiRiS0_", "void", [
            "int32",
            "pointer",
            "pointer"
        ]);
        return fc(pkLevel, eq_drop, inv_drop);
    }
}
