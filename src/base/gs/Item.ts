import {HookFuncCore} from "../HookFuncCore";
import {PointerClass} from "../PointerClass";

export class Item extends PointerClass {
    /**
     * 物品的类型，id
     */
    GetType(): number {
        return this.pointer.readInt();
    }

    GetReinforceLevelEquipItem(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK10equip_item17GetReinforceLevelEPK4item",
            "int32",
            ["pointer", "pointer"],
        );
        return func(this.pointer, this.pointer);
    }

    GetItemReinforceLevel(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK4item17GetReinforceLevelEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetReinforceLevel(): number {
        const oldDataEssenceFunc = HookFuncCore.getNativeFunc(
            "_ZNK10equip_item17GetOldDataEssenceEPK4itemi",
            'pointer', ['pointer', 'pointer', 'int32']);
        const oldDataEssence = oldDataEssenceFunc(this.pointer, this.pointer, 0)
        return oldDataEssence.add(8).readInt()
    }

    GetLuckValue(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK10equip_item12GetLuckValueEPK4item",
            "int32",
            ["pointer", "pointer"],
        );
        return func(this.pointer.add(10), this.pointer);
    }

    GetEquipType(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK4item12GetEquipTypeEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    GetItemType(): number {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK4item11GetItemTypeEv",
            "int32",
            ["pointer"],
        );
        return func(this.pointer);
    }

    Release(): number {
        const func = HookFuncCore.getNativeFunc("_ZN4item7ReleaseEv", "int32", [
            "pointer",
        ]);
        return func(this.pointer);
    }

    GetItemBody(): NativePointer {
        return this.pointer.add(10 * 4);
    }

    SetLuckValue(luckValue: number) {
        const func = HookFuncCore.getNativeFunc(
            "_ZN10equip_item12SetLuckValueEP4itemi",
            "int32",
            ["pointer", "pointer", "int32"]
        );

        func(this.pointer.add(10), this.pointer, luckValue);
    }

    GetContent(size: NativePointer): NativePointer {
        const func = HookFuncCore.getNativeFunc(
            "_ZN4item10GetContentERj",
            "pointer",
            ["pointer", "pointer"],
        );
        return func(this.pointer, size);
    }
}


export class ItemCard {
    static CheckContentValid(pointer: NativePointer): boolean {
        const func = HookFuncCore.getNativeFunc(
            "_ZNK9item_card17CheckContentValidEP4item",
            "bool",
            ["pointer", "pointer"],
        );
        return func(pointer, pointer) == 1;
    }

    static GetCardLevel(item: Item): number {
        const sizePointer = Memory.alloc(4)
        return item.GetContent(sizePointer).readInt();
    }

    static GetCardRefineLevel(item: Item): number {
        const sizePointer = Memory.alloc(4)
        return item.GetContent(sizePointer).add(4).readInt();
    }

    static GetEquip(item: Item): NativePointer {
        const sizePointer = Memory.alloc(4)
        return item.GetContent(sizePointer).add(24);
    }

    static GetEquipType(item: Item): number {
        const sizePointer = Memory.alloc(4)
        return item.GetContent(sizePointer).add(24).readInt();
    }

    static GetEquipCardLevel(item: Item): number {
        const sizePointer = Memory.alloc(4)
        return item.GetContent(sizePointer).add(28).readInt();
    }

    static GetEquipCardRefineLevel(item: Item): number {
        const sizePointer = Memory.alloc(4)
        return item.GetContent(sizePointer).add(28).readInt();
    }
}