import {BaseManager} from "../base/BaseManager";
import {HookFuncCore} from "../base/HookFuncCore";
import {GPlayer} from "../base/gs/GPlayer";
import {TaskInterface} from "../base/TaskInterface";
import {MallInfo} from "../base/gs/MallInfo";
import {cashTaskId, cashTaskItem, cashTaskMap} from "../configs";

export class CashAddManager extends BaseManager {

    attach() {
        const name = "_ZN11gplayer_imp21DeliveryNotifyCashAddEii";

        const thresholdsDesc = [...cashTaskMap.keys()].sort((a, b) => b - a)

        const address = HookFuncCore.getFuncAddress(name);
        Interceptor.replace(
            address,
            new NativeCallback(
                (p: NativePointer, cash_plus_used: number, cash_add2: number) => {
                    const originFunc = HookFuncCore.getNativeFunc(name, "int32",
                        ["pointer", "int32", "int32"]);

                    const player = new GPlayer(p)
                    const taskInterfacePointer = player.GetTaskInterface()
                    const ti = new TaskInterface(taskInterfacePointer)
                    const hasTask = ti.HasTask(cashTaskId)
                    let cashTotal = -1
                    if (hasTask == 1) {
                        const mallInfo = new MallInfo(player.getMallInfo())
                        cashTotal = mallInfo.GetCash()
                    }

                    const result = originFunc(p, cash_plus_used, cash_add2);

                    if (hasTask == 1 && cashTotal != -1) {
                        const mallInfo = new MallInfo(player.getMallInfo())
                        const cashTotal2 = mallInfo.GetCash()

                        const rechangeCash = cashTotal2 - cashTotal

                        if (rechangeCash > 0) {
                            for (const threshold of thresholdsDesc) {
                                if (rechangeCash < threshold) {
                                    continue
                                }

                                const subTaskId = cashTaskMap.get(threshold)!
                                // 是否持有该档位对应任务（HasTask 返回 1 为持有）
                                const hasSubTask = ti.HasTask(subTaskId) === 1
                                if (hasSubTask) {
                                    player.DeliverTaskItem(cashTaskItem, 1)
                                    break
                                }
                            }
                        }
                    }

                    return result
                },
                "int32",
                ["pointer", "int32", "int32"],
            ),
        );
    }

}

export const cashAddManager = new CashAddManager();
