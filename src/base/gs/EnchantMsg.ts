import { PointerClass } from "../PointerClass";
import { AttackerInfo } from "./AttackerInfo";
import { XID } from "./XID";

export class EnchantMsg extends PointerClass {
  /**
   * msg中的source是XID
   * XID add 4指向id
   * @param msg
   */
  GetAttackerXID() {
    return new XID(this.pointer.add(0).add(0));
  }

  GetAttackerInfo() {
    return new AttackerInfo(this.pointer.add(0));
  }

  GetAttackState(): number {
    return this.pointer.add(0x5c).readU8();
  }

  SetAttackState(state: number): void {
    this.pointer.add(0x5c).writeU8(state);
  }
}
