import {DataMan} from "./base/gs/DataMan";
import {killBossLastManager} from "./manager/KillBossLastManager";
import {gsManager} from "./manager/GsManager";
import {HookModuleBase} from "./base/HookModuleBase";
// 初始化模块基址索引

HookModuleBase.initializeModuleBaseIndex(Process.enumerateModules());

export const dataMan = new DataMan();

gsManager.attach()

killBossLastManager.attach()

console.log(`已挂载到进程：${Process.id}`);
