import {HookFuncCore} from "./HookFuncCore";
import {PointerClass} from "./PointerClass";

export class TaskInterface extends PointerClass {

    HasTask(taskId: number): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZN13TaskInterface7HasTaskEm",
            "int32",
            ["pointer", "int32"],
        );
        return func(this.pointer, taskId);
    }

    OnUpdateClearTaskState(taskId: number) {
        const func = HookFuncCore.getNativeFunc(
            "_Z22OnUpdateClearTaskStateP13TaskInterfacem",
            "void",
            ["pointer", "int32"],
        );
        func(this.pointer, taskId);
    }

    OnUpdateFinishTaskList(taskId: number) {
        const func = HookFuncCore.getNativeFunc(
            "_Z22OnUpdateFinishTaskListP13TaskInterfacemii",
            "void",
            ["pointer", "int32", "int32", "int32"],
        );
        func(this.pointer, taskId, 1, 0);
    }

}