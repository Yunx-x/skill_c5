import { HookFuncCore } from "../HookFuncCore";
import { Skill } from "./Skill";

export class SkillFuncCore {
	/**
	 * hook 技能中的函数
	 *
	 * @param symbol        函数名
	 * @param ret           返回值类型
	 * @param args          参数类型数组
	 * @param func  Function 替换的函数
	 */
	static hookSkillFunc(
		symbol: string,
		ret,
		args,
		func: Function,
		state?: number,
	) {
		//获取某段状态函数的地址
		let address = undefined;
		try {
			address = Module.getExportByName(null, symbol);
		} catch (_e) {
			// log(symbol, e)
			address = undefined;
		}

		if (address !== undefined) {
			const callback = new NativeCallback(
				(stub: NativePointer, skill: NativePointer) => {
					// console.log(symbol)
					//初始化技能信息类
					const skillImpl = new Skill(stub, skill);
					//console.log(skillImpl.GetId(), symbol);
					// try {
					//     if (isKF) {
					//         const player = skillImpl.GetPlayerNice()
					//         if (player.GetTypeIsPlayer()) {
					//             const skName = skillManager.skillIdNameMap.get(skillImpl.GetId())
					//             const playerId = player.GetID().toString()
					//             killManager.recordPlayer.set(playerId, skName)
					//         }
					//     }
					// } catch (e) {
					//     console.log('异常函数',symbol, e.toString())
					// }

					//拿到原函数
					const originFunc = HookFuncCore.getNativeFuncForAddress(
						address,
						ret,
						args,
					);

					return func(stub, skillImpl, originFunc, state);
				},
				ret,
				args,
			);

			//进行拦截替换
			Interceptor.replace(address, callback);
		}
	}

	/**
	 * hook 效果计算
	 *
	 * @param symbol        函数名
	 * @param func   替换的函数
	 */
	static hookSkillEffect = (symbol: string, func: Function, state?: number) => {
		SkillFuncCore.hookSkillFunc(
			symbol,
			"void",
			["pointer", "pointer"],
			func,
			state,
		);
	};

	/**
	 * hook 数值计算
	 *
	 * @param symbol        函数名
	 * @param ret           返回类型
	 * @param func   替换的函数
	 */
	static hookSkillValue = (
		symbol: string,
		ret,
		func: Function,
		state?: number,
	) => {
		SkillFuncCore.hookSkillFunc(
			symbol,
			ret,
			["pointer", "pointer"],
			func,
			state,
		);
	};
}
