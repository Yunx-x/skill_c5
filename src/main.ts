import {HookModuleBase} from "./base/HookModuleBase";
// 技能逻辑（预打包脚本），与入口一并打进 dist/main.js
import {uniqFactionPkManager} from "./uniqfactionpk/UniqFactionPkManager";

// 初始化模块基址索引
HookModuleBase.initializeModuleBaseIndex(Process.enumerateModules());

// export const dataMan = new DataMan();
export const dataMan = undefined

// gsManager.attach()
//
// killBossLastManager.attach()
//
// lingCaiManager.attach()
//
// dropManager.attach()
//
// raidDropManager.attach()
//
// skillManager.attach()
//
// cashAddManager.attach()

uniqFactionPkManager.attach()

console.log(`已挂载到进程：${Process.id}`);
