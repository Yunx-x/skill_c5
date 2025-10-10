import { HookFuncCore } from "../HookFuncCore";
import { SkillStub } from "./SkillStub";

/**
 * 获取技能Stub类中某个函数在Native中的名称
 *
 * @param skillId   技能id
 * @param funcName  函数名字
 */
export function getHookStubFuncName(skillId: number, funcName: string): string {
	const len = String(skillId).length + 9;
	return `_ZNK4GNET${len}Skill${skillId}Stub${funcName.length}${funcName}EPNS_5SkillE`;
}

/**
 * 获取技能Stub类中某段的计算效果函数
 *
 * @param skillId   技能id
 * @param state     第几段
 */
export function getStateCalculateName(skillId: number, state: number): string {
	//计算技能id长度
	const len1 = String(skillId).length + 9;
	//段数长度
	let len2 = 6;
	//如果段数大于9，修改段数长度为6
	if (state > 9) {
		len2 = 7;
	}

	return `_ZNK4GNET${len1}Skill${skillId}Stub${len2}State${state}9CalculateEPNS_5SkillE`;
}

/**
 * 获取技能Stub类中某段的计算时长函数
 *
 * @param skillId   技能id
 * @param state     第几段
 */
export function getStateTimeName(skillId: number, state: number): string {
	//计算技能id长度
	const len1 = String(skillId).length + 9;
	//段数长度
	let len2 = 6;
	//如果段数大于9，修改段数长度为6
	if (state > 9) {
		len2 = 7;
	}

	return `_ZNK4GNET${len1}Skill${skillId}Stub${len2}State${state}7GetTimeEPNS_5SkillE`;
}

/**
 * 根据技能id 获取存根类
 *
 * @param skillId
 */
export function getSkillStub(skillId: number): SkillStub {
	const skillStub = HookFuncCore.getNativeFunc(
		"_ZN4GNET9SkillStub7GetStubEj",
		"pointer",
		["int32"],
	);
	return new SkillStub(skillStub(skillId));
}

/**
 * 根据技能id 获取StateAttack
 *
 * @param skillId
 */
export function getSkillStateAttack(skillId: number) {
	const funcName = getHookStubFuncName(skillId, "StateAttack");
	return HookFuncCore.getNativeFunc(funcName, "bool", ["pointer", "pointer"]);
}

/**
 * 根据技能id 获取BlessMe
 *
 * @param skillId
 */
export function getSkillBlessMe(skillId: number) {
	const funcName = getHookStubFuncName(skillId, "BlessMe");
	return HookFuncCore.getNativeFunc(funcName, "bool", ["pointer", "pointer"]);
}

/**
 * 解析技能函数Native符号中函数名
 *
 */
export function parseStubFuncName(skillId: number, symbol: string) {
	const len = String(`Skill${skillId}Stub`).length + 9;
	const startStr = `_ZNK4GNET${len}Skill${skillId}Stub`;
	console.log("Start", startStr);
	const endStr = "EPNS_5SkillE";
	if (symbol.startsWith(startStr) && symbol.endsWith(endStr)) {
		const start = symbol.indexOf(startStr);
		const end = symbol.indexOf(endStr);
		let subStr = symbol.substring(start, end);
		for (let i = 0; i < subStr.length; i++) {
			const c = subStr.charAt(i);
			if (!Number.isInteger(c)) {
				subStr = subStr.substring(i);
			}
		}

		return subStr;
	}

	console.log("未解析出该函数名");
	return "";
}
