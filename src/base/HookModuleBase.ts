/**
 * HookModuleBase 类，作为钩子模块的基础
 */
export class HookModuleBase {
	/**
	 * 所有模块的索引
	 */
	private static allModuleBaseIndex = new Map<string, NativePointer>();

	/**
	 * 获取模块基址索引
	 * @param {string} moduleName
	 * @returns {NativePointer}
	 */
	private static getModuleBaseIndex(moduleName: string): NativePointer {
		const index = HookModuleBase.allModuleBaseIndex.get(moduleName);
		if (!index) {
			console.error(`Can not find module ${moduleName} base index`);
			return ptr(0);
		}
		return index;
	}

	/**
	 * 获取GS模块基址索引
	 * @returns {NativePointer}
	 */
	static gsBaseIndex(): NativePointer {
		return HookModuleBase.getModuleBaseIndex("gs");
	}

	/**
	 * 获取技能模块基址索引
	 * @returns {NativePointer}
	 */
	static skillBaseIndex(): NativePointer {
		return HookModuleBase.getModuleBaseIndex("libskill.so");
	}

	/**
	 * 通过地址修改内存中的值
	 * @param address 内存地址
	 * @param type type值类型，可选 "char"、"int"、"float" 、"double"
	 * @param _originValue 原始值（此参数未使用，仅作为参考占位）
	 * @param newValue 写入新值
	 */
	private static modifyValueByAddress(
		address: NativePointer,
		type: "char" | "int" | "float" | "double",
		_originValue: number,
		newValue: number,
	) {
		try {
			Memory.protect(address, 4, "rw-");

			switch (type) {
				case "char": {
					address.writeU8(newValue);
					break;
				}

				case "int": {
					address.writeInt(newValue);
					break;
				}

				case "float": {
					address.writeFloat(newValue);
					break;
				}

				case "double": {
					address.writeDouble(newValue);
					break;
				}

				default: {
					console.log(`error: Unsupported type: ${type}`);
					return;
				}
			}
		} catch (e) {
			console.error(`Modify value failed: ${e}`);
		}
	}

	/**
	 * 读取内存中的值
	 * @param baseIndex 基址
	 * @param address 地址
	 * @param type 读取的值类型
	 */
	private static readOriginValue(
		baseIndex: NativePointer,
		address: number,
		type: "char" | "int" | "float" | "double",
	) {
		const targetAddress = baseIndex.add(address);

		switch (type) {
			case "char": {
				return targetAddress.readU8();
			}

			case "int": {
				return targetAddress.readInt();
			}

			case "float": {
				return targetAddress.readFloat();
			}

			case "double": {
				return targetAddress.readDouble();
			}

			default: {
				console.log(`error: Unsupported type: ${type}`);
				return null;
			}
		}
	}

	/**
	 * 通过地址修改技能内存中的值
	 * @param address
	 * @param type
	 * @param originValue
	 * @param newValue
	 */
	static modifySkillValue(
		address: number,
		type: "char" | "int" | "float" | "double",
		originValue: number,
		newValue: number,
	) {
		// const readOriginValue = HookModuleBase.readOriginValue(
		//   HookModuleBase.skillBaseIndex(),
		//   address,
		//   type,
		// );

		// if (readOriginValue !== null && readOriginValue !== originValue) {
		//   console.log(
		//     `warn: readValue does not match originValue: readValue: ${readOriginValue}, originValue: ${originValue}`,
		//   );
		// }
		try {
			HookModuleBase.modifyValueByAddress(
				HookModuleBase.skillBaseIndex().add(address),
				type,
				originValue,
				newValue,
			);
		} catch (error) {
			console.log(`modify skill value error: ${error}`);
		}
	}

	/**
	 * 通过地址修改GS内存中的值
	 * @param address
	 * @param type
	 * @param originValue
	 * @param newValue
	 */
	static modifyGSValue(
		address: number,
		type: "char" | "int" | "float" | "double",
		originValue: number,
		newValue: number,
	) {
		// const readOriginValue = HookModuleBase.readOriginValue(
		//   HookModuleBase.gsBaseIndex(),
		//   address,
		//   type,
		// );

		// if (readOriginValue !== null && readOriginValue !== originValue) {
		//   console.log(
		//     `warn: readValue does not match originValue: readValue: ${readOriginValue}, originValue: ${originValue}`,
		//   );
		// }
		try {
			HookModuleBase.modifyValueByAddress(
				HookModuleBase.gsBaseIndex().add(address),
				type,
				originValue,
				newValue,
			);
		} catch (error) {
			console.log(`modify gs value error: ${error}`);
		}
	}

	/**
	 * 初始化所有模块基址索引
	 * @param {Array<{ name: string; base: number; }>} modules
	 * @returns {void}
	 */
	static initializeModuleBaseIndex(
		modules: Array<{ name: string; base: NativePointer }>,
	): void {
		for (const module of modules) {
			HookModuleBase.allModuleBaseIndex.set(module.name, module.base);
		}
	}
}
