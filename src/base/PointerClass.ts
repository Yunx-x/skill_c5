/**
 * 指针类
 */
export class PointerClass {
	/**
	 * 指针，表示在内存中的地址
	 * frida专用的地址对象
	 */
	pointer: NativePointer;

	constructor(pointer: NativePointer) {
		this.pointer = pointer;
	}
}
