import { PointerClass } from "../PointerClass";

export class XID extends PointerClass {
	getType(): number {
		return this.pointer.readInt();
	}

	getID(): number {
		return this.pointer.add(4).readInt();
	}

    IsPlayerClass():boolean{
        return this.getType()==1;
    }
}
