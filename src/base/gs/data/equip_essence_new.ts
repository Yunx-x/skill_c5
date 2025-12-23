import {PointerClass} from "../../PointerClass";

export class EquipEssenceNew extends PointerClass {

    GetLevel(): number {
        return this.pointer.add(8).readShort()
    }

    GetLuckValue(): number {
        return this.pointer.add(406).readInt()
    }
}
