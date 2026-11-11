import {HookModuleBase} from "./base/HookModuleBase";
import {uniqFactionPkManager} from "./uniqfactionpk/UniqFactionPkManager";

// 初始化模块基址索引
HookModuleBase.initializeModuleBaseIndex(Process.enumerateModules());

uniqFactionPkManager.attach()

console.log(`已挂载到进程：${Process.id}`);
