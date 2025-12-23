import { HookFuncCore } from "../HookFuncCore";
import { PointerClass } from "../PointerClass";
import { Item } from "./Item";

export class ItemList extends PointerClass {
	GetItemData(where: number, item_data): number {
		const func = HookFuncCore.getNativeFunc(
			"_ZN9item_list11GetItemDataEjR9item_data",
			"int32",
			["pointer", "int32", "pointer"],
		);
		return func(this.pointer, where, item_data);
	}

	GetItem(index: number): Item {
		const func = HookFuncCore.getNativeFunc("_ZN9item_listixEj", "pointer", [
			"pointer",
			"int32",
		]);
		return new Item(func(this.pointer, index));
	}

	/**
	 * 查找物品在包中的位置
	 */
	FindByType(start: number, item_type: number): number {
		//FindByType(item_list *this, unsigned int a2, int a3)
		// int start , int item_type
		const func = HookFuncCore.getNativeFunc(
			"_ZN9item_list10FindByTypeEii",
			"int32",
			["pointer", "int32", "int32"],
		);
		return func(this.pointer, start, item_type);
	}

	Remove(index: number): number {
		const func = HookFuncCore.getNativeFunc("_ZN9item_list6RemoveEj", "void", [
			"pointer",
			"int32",
		]);
		return func(this.pointer, index);
	}

	DecAmount(index: number, count: number): number {
		const func = HookFuncCore.getNativeFunc(
			"_ZN9item_list9DecAmountEjj",
			"int32",
			["pointer", "int32", "int32"],
		);
		return func(this.pointer, index, count);
	}

	Size(): number {
		const func = HookFuncCore.getNativeFunc("_ZNK9item_list4SizeEv", "int32", [
			"pointer",
		]);
		return func(this.pointer);
	}

	CountItemByID(itemId: number): number {
		const fc = HookFuncCore.getNativeFunc("_ZN9item_list13CountItemByIDEi", "int32", [
			"pointer",
			"int32",
		]);
		return fc(this.pointer, itemId);
	}

	CountItemByIndex(index: number) {
		const itemData = this.GetItem(index);
		return itemData.pointer.add(4).readInt();
	}
}

// export function ItemListCopyFrom(itemList:ItemList){
//     const newList = Memory.alloc(4 * attrList.length);
//     for (let i = 0; i < itemList.Size(); i++) {
//         newList.add(4 * i).writeInt(attrList[i]);
//     }
//
//     // _ZN9item_list9copy_fromERKS_
// }
