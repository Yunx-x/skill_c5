/**
 * 函数中对参数类型和返回类型的声明
 */
export type FunctionTypes =
	| "void"
	| "bool"
	| "char"
	| "int16"
	| "int32"
	| "int64"
	| "float"
	| "double"
	| "pointer";

/**
 * 所有查找过的函数缓存
 */
const funcMap = new Map<string, any>();

export class HookFuncCore {
	/**
	 * 获取函数的地址
	 *
	 * @param funcName  函数名
	 */
	static getFuncAddress = (funcName: string) => {
		return Module.getExportByName(null, funcName);
	};

	/**
	 * 获取指定名称的native函数
	 *
	 * 如果从外部有获取地址，可以直接传，省一次全局搜索的时间
	 *
	 * @param funcName  函数名称
	 * @param ret   返回值类型
	 * @param args  函数需要的参数类型
	 */
	static getNativeFunc(funcName: string, ret, args) {
		if (funcMap.has(funcName)) {
			return funcMap.get(funcName);
		}

		const func = new NativeFunction(
			HookFuncCore.getFuncAddress(funcName),
			ret,
			args,
		);
		funcMap.set(funcName, func);
		return func;
	}

	/**
	 * 获取指定地址的native函数
	 *
	 * @param address   函数地址
	 * @param ret   返回值类型
	 * @param args  函数需要的参数类型
	 */
	static getNativeFuncForAddress(
		address: NativePointer,
		ret: FunctionTypes,
		args: FunctionTypes[],
	): NativeFunction<
		GetNativeFunctionReturnValue<
			| "void"
			| "bool"
			| "char"
			| "int32"
			| "int64"
			| "float"
			| "double"
			| "pointer"
		>,
		ResolveVariadic<
			Extract<GetNativeFunctionArgumentValue<FunctionTypes[]>, unknown[]>
		>
	> | null {
		if (address == null) {
			return null;
		}
		return new NativeFunction(address, ret, args);
	}
}
