import { PointerClass } from "../PointerClass";

//struct A3DVECTOR
// {
// 	float x;
// 	float y;
// 	float z;

export class A3DVECTOR extends PointerClass {
	x(): number {
		return this.pointer.readFloat();
	}

	y(): number {
		return this.pointer.add(4).readFloat();
	}

	z(): number {
		return this.pointer.add(8).readFloat();
	}
}
