import {HookFuncCore} from "../HookFuncCore";


export class LivenessCfg {
    static getInstance(): NativePointer {
        const func = HookFuncCore.getNativeFunc(
            "_ZN15player_template14GetLivenessCfgEv",
            "pointer",
            [],
        );
        return func();
    }

    static getTaskindexs(): NativePointer {
        return this.getInstance().add(460)
    }

    static getMapindexs(): NativePointer {
        return this.getInstance().add(484)
    }

    static getSpecialindexs(): NativePointer {
        return this.getInstance().add(508)
    }

    static getIndex2typeid(): NativePointer {
        return this.getInstance().add(436)
    }

    static getLivenessTypeInfo(index:number): NativePointer {
        return this.getInstance().add(28*index+16)
    }

}
