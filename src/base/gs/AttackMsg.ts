import { PointerClass } from "../PointerClass";
import { AttackerInfo } from "./AttackerInfo";
import { XID } from "./XID";

export class AttackMsg extends PointerClass {
  /**
   * msg中的source是XID
   * XID add 4指向id
   * @param msg
   */
  GetAttackerXID(): XID {
    return new XID(this.pointer.add(0).add(0));
  }

  GetAttackerInfo() {
    return new AttackerInfo(this.pointer.add(0));
  }

  GetSkillID(): number {
    return this.pointer.add(0x80).readInt();
  }

  GetDamageLow(): number {
    return this.pointer.add(0x40).readInt();
  }

  SetDamageLow(value: number): void {
    this.pointer.add(0x40).writeInt(value);
  }

  GetDamageHigh(): number {
    return this.pointer.add(0x44).readInt();
  }

  SetDamageHigh(value: number): void {
    this.pointer.add(0x44).writeInt(value);
  }

  GetAttackState(): number {
    return this.pointer.add(0x6e).readU8();
  }

  SetAttackState(value: number): void {
    this.pointer.add(0x6e).writeU8(value);
  }

  GetCultivation(): number {
    return this.pointer.add(0x72).readInt();
  }

  GetAttackFaction() {
    return this.pointer.add(0x5c).readInt();
  }
}
