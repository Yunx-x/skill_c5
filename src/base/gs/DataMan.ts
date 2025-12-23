import { HookFuncCore } from "../HookFuncCore";
import { PointerClass } from "../PointerClass";

/**
 * 公共的dataMan对象
 */
export class DataMan extends PointerClass {
	constructor() {
		const dataManFunc = HookFuncCore.getNativeFunc(
			"_ZN7gmatrix10GetDataManEv",
			"pointer",
			[],
		);

		super(dataManFunc());
	}

	/**
	 * 使用示例：
	 *
	 *  //开一块长度为4的内存。用于存放这条数据的总长度
	 *  const len = Memory.alloc(4)
	 *  const elDataPointer = dataMan.get_data_ptr(1234,len)
	 *  const bw = elDataPointer.add(76).readInt()
	 *
	 *
	 * @param id
	 * @param len
	 */
	get_data_ptr(id, len: NativePointer): NativePointer {
		const fc = HookFuncCore.getNativeFunc(
			"_ZN11itemdataman12get_data_ptrEj8ID_SPACER9DATA_TYPE",
			"pointer",
			["pointer", "int32", "int32", "pointer"],
		);

		return fc(this.pointer, id, 0, len);
	}
}
