import {DataMan} from "./base/gs/DataMan";
import {killBossLastManager} from "./manager/KillBossLastManager";
import {gsManager} from "./manager/GsManager";
import {HookModuleBase} from "./base/HookModuleBase";
import {lingCaiManager} from "./manager/LingCaiManager";
import {dropManager} from "./manager/DropManager";
import {raidDropManager} from "./manager/RaidDropManager";
// 技能逻辑（预打包脚本），与入口一并打进 dist/main.js
import "./skill.js";
import {skillManager} from "./manager/SkillManager";
import {cashAddManager} from "./manager/CashAddManager";

// 初始化模块基址索引
HookModuleBase.initializeModuleBaseIndex(Process.enumerateModules());

export const dataMan = new DataMan();

gsManager.attach()

killBossLastManager.attach()

lingCaiManager.attach()

dropManager.attach()

raidDropManager.attach()

skillManager.attach()

cashAddManager.attach()

console.log(`已挂载到进程：${Process.id}`);
