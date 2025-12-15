import { PointerClass } from "../PointerClass";
import { XID } from "./XID";

export class AttackerInfo extends PointerClass {
  attackerXID() {
    return new XID(this.pointer.add(0));
  }

  teamID() {
    return this.pointer.add(0x0c).readInt();
  }
}
