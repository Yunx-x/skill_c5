import {HookFuncCore} from "../HookFuncCore";
import {GActiveImp} from "./GActiveImp";

/**
 * gnpc_imp
 */
export class GNpcImp extends GActiveImp {
    UpdateAllProp() {
        const fc = HookFuncCore.getNativeFunc(
            "_ZN8gnpc_imp16OI_UpdateAllPropEv",
            "void",
            ["pointer"],
        );
        fc(this.pointer);
    }

    /**
     * 获取 NPC 或 Monster 的 ID
     * @returns {number}
     */
    GetNPCID(): number {
        const fc = HookFuncCore.getNativeFunc("_ZN8gnpc_imp8GetNPCIDEv", "int", ["pointer"]);
        return fc(this.pointer);
    }

    IsZombie() {
        const fc = HookFuncCore.getNativeFunc("_ZN7gobject8IsZombieEv", "int", ["pointer"]);
        return fc(this.pointer.add(8));
    }

    IsBossMonster() {
        const fc = HookFuncCore.getNativeFunc("_ZN8gnpc_imp13IsBossMonsterEv", "bool", ["pointer"]);
        return fc(this.pointer);
    }

    IsMonsterBoss() {
        const fc = HookFuncCore.getNativeFunc("_ZN8gnpc_imp13IsMonsterBossEv", "bool", ["pointer"]);
        return fc(this.pointer);
    }

    IsBoss(): boolean {
        return this.IsBossMonster() || this.IsMonsterBoss();
    }
}
