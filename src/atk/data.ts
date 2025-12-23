import {PointerClass} from "../base/PointerClass";
import {XID} from "../base/gs/XID";

export class AttackerInfoT extends PointerClass {
    getAttacker(): XID {
        return new XID(this.pointer);
    }

    setAttacker(xid: NativePointer): void {
        this.pointer.add(0x0).writePointer(xid);
    }

    getLevel(): number {
        return this.pointer.add(0x08).readU16();
    }

    setLevel(level: number): void {
        this.pointer.add(0x08).writeU16(level);
    }

    getEffLevel(): number {
        return this.pointer.add(0x0A).readU16();
    }

    setEffLevel(effLevel: number): void {
        this.pointer.add(0x0A).writeU16(effLevel);
    }

    getTeamId(): number {
        return this.pointer.add(0x0C).readInt();
    }

    setTeamId(teamId: number): void {
        this.pointer.add(0x0C).writeInt(teamId);
    }

    getTeamSeq(): number {
        return this.pointer.add(0x10).readInt();
    }

    setTeamSeq(teamSeq: number): void {
        this.pointer.add(0x10).writeInt(teamSeq);
    }

    getTroupeId(): number {
        return this.pointer.add(0x14).readInt();
    }

    setTroupeId(troupeId: number): void {
        this.pointer.add(0x14).writeInt(troupeId);
    }

    getTroupeLeader(): number {
        return this.pointer.add(0x18).readInt();
    }

    setTroupeLeader(troupeLeader: number): void {
        this.pointer.add(0x18).writeInt(troupeLeader);
    }

    getCsIndex(): number {
        return this.pointer.add(0x1C).readInt();
    }

    setCsIndex(csIndex: number): void {
        this.pointer.add(0x1C).writeInt(csIndex);
    }

    getSid(): number {
        return this.pointer.add(0x20).readInt();
    }

    setSid(sid: number): void {
        this.pointer.add(0x20).writeInt(sid);
    }

    getMafiaId(): number {
        return this.pointer.add(0x24).readInt();
    }

    setMafiaId(mafiaId: number): void {
        this.pointer.add(0x24).writeInt(mafiaId);
    }

    getFamilyId(): number {
        return this.pointer.add(0x28).readInt();
    }

    setFamilyId(familyId: number): void {
        this.pointer.add(0x28).writeInt(familyId);
    }

    getMasterId(): number {
        return this.pointer.add(0x2C).readInt();
    }

    setMasterId(masterId: number): void {
        this.pointer.add(0x2C).writeInt(masterId);
    }

    getWallowLevel(): number {
        return this.pointer.add(0x30).readInt();
    }

    setWallowLevel(wallowLevel: number): void {
        this.pointer.add(0x30).writeInt(wallowLevel);
    }

    getInvisibleRate(): number {
        return this.pointer.add(0x34).readInt();
    }

    setInvisibleRate(invisibleRate: number): void {
        this.pointer.add(0x34).writeInt(invisibleRate);
    }

    getZoneId(): number {
        return this.pointer.add(0x38).readInt();
    }

    setZoneId(zoneId: number): void {
        this.pointer.add(0x38).writeInt(zoneId);
    }

    getAtkchange2Id(): number {
        return this.pointer.add(0x3C).readInt();
    }

    setAtkchange2Id(atkchange2Id: number): void {
        this.pointer.add(0x3C).writeInt(atkchange2Id);
    }
}

export class AttachedSkill extends PointerClass {
    getSkill(): number {
        return this.pointer.readInt();
    }

    setSkill(value: number): void {
        this.pointer.writeInt(value);
    }

    getLevel(): number {
        return this.pointer.add(4).readInt();
    }

    setLevel(value: number): void {
        this.pointer.add(4).writeInt(value);
    }
}

export class AttackMsg extends PointerClass {
    getAinfo(): AttackerInfoT {
        return new AttackerInfoT(this.pointer);
    }

    getDamageLow(): number {
        return this.pointer.add(0x40).readInt();
    }

    setDamageLow(value: number): void {
        this.pointer.add(0x40).writeInt(value);
    }

    getDamageHigh(): number {
        return this.pointer.add(0x44).readInt();
    }

    setDamageHigh(value: number): void {
        this.pointer.add(0x44).writeInt(value);
    }

    getDamageNoCrit(): number {
        return this.pointer.add(0x48).readInt();
    }

    setDamageNoCrit(value: number): void {
        this.pointer.add(0x48).writeInt(value);
    }

    getSpecDamage(): number {
        return this.pointer.add(0x4C).readInt();
    }

    setSpecDamage(value: number): void {
        this.pointer.add(0x4C).writeInt(value);
    }

    getDamageFactor(): number {
        return this.pointer.add(0x50).readInt();
    }

    setDamageFactor(value: number): void {
        this.pointer.add(0x50).writeInt(value);
    }

    getAttackRate(): number {
        return this.pointer.add(0x54).readInt();
    }

    setAttackRate(value: number): void {
        this.pointer.add(0x54).writeInt(value);
    }

    getSkillAttackRate(): number {
        return this.pointer.add(0x58).readInt();
    }

    setSkillAttackRate(value: number): void {
        this.pointer.add(0x58).writeInt(value);
    }

    getAttackerFaction(): number {
        return this.pointer.add(0x5C).readInt();
    }

    setAttackerFaction(value: number): void {
        this.pointer.add(0x5C).writeInt(value);
    }

    getTargetFaction(): number {
        return this.pointer.add(0x60).readInt();
    }

    setTargetFaction(value: number): void {
        this.pointer.add(0x60).writeInt(value);
    }

    getCritRate(): number {
        return this.pointer.add(0x64).readInt();
    }

    setCritRate(value: number): void {
        this.pointer.add(0x64).writeInt(value);
    }

    getCritFactor(): number {
        return this.pointer.add(0x68).readInt();
    }

    setCritFactor(value: number): void {
        this.pointer.add(0x68).writeInt(value);
    }

    getNormalAttack(): number {
        return this.pointer.add(0x6C).readU8();
    }

    setNormalAttack(value: number): void {
        this.pointer.add(0x6C).writeU8(value);
    }

    getForceAttack(): number {
        return this.pointer.add(0x6D).readU8();
    }

    setForceAttack(value: number): void {
        this.pointer.add(0x6D).writeU8(value);
    }

    getAttackState(): number {
        return this.pointer.add(0x6E).readU8();
    }

    setAttackState(value: number): void {
        this.pointer.add(0x6E).writeU8(value);
    }

    getAttackerMode(): number {
        return this.pointer.add(0x6F).readU8();
    }

    setAttackerMode(value: number): void {
        this.pointer.add(0x6F).writeU8(value);
    }

    getIsInvader(): number {
        return this.pointer.add(0x70).readU8();
    }

    setIsInvader(value: number): void {
        this.pointer.add(0x70).writeU8(value);
    }

    getAttackStamp(): number {
        return this.pointer.add(0x71).readU8();
    }

    setAttackStamp(value: number): void {
        this.pointer.add(0x71).writeU8(value);
    }

    getCultivation(): number {
        return this.pointer.add(0x72).readU8();
    }

    setCultivation(value: number): void {
        this.pointer.add(0x72).writeU8(value);
    }

    getIsPet(): number {
        return this.pointer.add(0x73).readU8();
    }

    setIsPet(value: number): void {
        this.pointer.add(0x73).writeU8(value);
    }

    getIsFlying(): number {
        return this.pointer.add(0x74).readU8();
    }

    setIsFlying(value: number): void {
        this.pointer.add(0x74).writeU8(value);
    }

    getIsMirror(): number {
        return this.pointer.add(0x75).readU8();
    }

    setIsMirror(value: number): void {
        this.pointer.add(0x75).writeU8(value);
    }

    getIgnoreCult(): number {
        return this.pointer.add(0x76).readU8();
    }

    setIgnoreCult(value: number): void {
        this.pointer.add(0x76).writeU8(value);
    }

    getComboColor(index: number): number {
        return this.pointer.add(0x77 + index).readU8();
    }

    setComboColor(index: number, value: number): void {
        this.pointer.add(0x77 + index).writeU8(value);
    }

    getPetAttackAdjust(): number {
        return this.pointer.add(0x7C).readInt();
    }

    setPetAttackAdjust(value: number): void {
        this.pointer.add(0x7C).writeInt(value);
    }

    getSkillId(): number {
        return this.pointer.add(0x80).readInt();
    }

    setSkillId(value: number): void {
        this.pointer.add(0x80).writeInt(value);
    }

    getSkillModify(index: number): number {
        return this.pointer.add(0x84 + index * 4).readInt();
    }

    setSkillModify(index: number, value: number): void {
        this.pointer.add(0x84 + index * 4).writeInt(value);
    }

    getSkillLimit(): number {
        return this.pointer.add(0xA4).readInt();
    }

    setSkillLimit(value: number): void {
        this.pointer.add(0xA4).writeInt(value);
    }

    getFeedbackMask(): number {
        return this.pointer.add(0xA8).readInt();
    }

    setFeedbackMask(value: number): void {
        this.pointer.add(0xA8).writeInt(value);
    }

    getAttachedSkill(): AttachedSkill {
        return new AttachedSkill(this.pointer.add(0xAC));
    }

    getFashionWeaponAddonId(): number {
        return this.pointer.add(0xB4).readInt();
    }

    setFashionWeaponAddonId(value: number): void {
        this.pointer.add(0xB4).writeInt(value);
    }

    getSkillVar(index: number): number {
        return this.pointer.add(0xB8 + index * 4).readInt();
    }

    setSkillVar(index: number, value: number): void {
        this.pointer.add(0xB8 + index * 4).writeInt(value);
    }

    getSkillElement(index: number): number {
        return this.pointer.add(0xF8 + index * 2).readU16();
    }

    setSkillElement(index: number, value: number): void {
        this.pointer.add(0xF8 + index * 2).writeU16(value);
    }

    getIgnDmgReduce(): number {
        return this.pointer.add(0x10C).readInt();
    }

    setIgnDmgReduce(value: number): void {
        this.pointer.add(0x10C).writeInt(value);
    }

    getDmgChange(): number {
        return this.pointer.add(0x110).readInt();
    }

    setDmgChange(value: number): void {
        this.pointer.add(0x110).writeInt(value);
    }

    getSkillDamage(): number {
        return this.pointer.add(0x114).readInt();
    }

    setSkillDamage(value: number): void {
        this.pointer.add(0x114).writeInt(value);
    }

    getMobDamage(): number {
        return this.pointer.add(0x118).readInt();
    }

    setMobDamage(value: number): void {
        this.pointer.add(0x118).writeInt(value);
    }

    getCultAttack(index: number): number {
        return this.pointer.add(0x11C + index * 4).readInt();
    }

    setCultAttack(index: number, value: number): void {
        this.pointer.add(0x11C + index * 4).writeInt(value);
    }

    getDeityPower(): number {
        return this.pointer.add(0x128).readInt();
    }

    setDeityPower(value: number): void {
        this.pointer.add(0x128).writeInt(value);
    }

    getFixedDamage(): number {
        return this.pointer.add(0x12C).readInt();
    }

    setFixedDamage(value: number): void {
        this.pointer.add(0x12C).writeInt(value);
    }

    getTalismanSkills(index: number): number {
        return this.pointer.add(0x130 + index * 2).readU16();
    }

    setTalismanSkills(index: number, value: number): void {
        this.pointer.add(0x130 + index * 2).writeU16(value);
    }

    getResistanceProficiency(index: number): number {
        return this.pointer.add(0x140 + index * 4).readInt();
    }

    setResistanceProficiency(index: number, value: number): void {
        this.pointer.add(0x140 + index * 4).writeInt(value);
    }

    getRangeType(): number {
        return this.pointer.add(0x158).readU8();
    }

    setRangeType(value: number): void {
        this.pointer.add(0x158).writeU8(value);
    }

    getIgnBlessed(): number {
        return this.pointer.add(0x15C).readInt();
    }

    setIgnBlessed(value: number): void {
        this.pointer.add(0x15C).writeInt(value);
    }

    getEjectRange(): number {
        return this.pointer.add(0x160).readInt();
    }

    setEjectRange(value: number): void {
        this.pointer.add(0x160).writeInt(value);
    }

    getEjectNum(): number {
        return this.pointer.add(0x164).readInt();
    }

    setEjectNum(value: number): void {
        this.pointer.add(0x164).writeInt(value);
    }

    getEjectAddRatio(): number {
        return this.pointer.add(0x168).readInt();
    }

    setEjectAddRatio(value: number): void {
        this.pointer.add(0x168).writeInt(value);
    }

    getMobOnly(): number {
        return this.pointer.add(0x16C).readU8();
    }

    setMobOnly(value: number): void {
        this.pointer.add(0x16C).writeU8(value);
    }

    getMobBonusDamage(): number {
        return this.pointer.add(0x170).readInt();
    }

    setMobBonusDamage(value: number): void {
        this.pointer.add(0x170).writeInt(value);
    }

    getIgnInvincible(): number {
        return this.pointer.add(0x174).readInt();
    }

    setIgnInvincible(value: number): void {
        this.pointer.add(0x174).writeInt(value);
    }

    getSummonRedirected(): number {
        return this.pointer.add(0x178).readInt();
    }

    setSummonRedirected(value: number): void {
        this.pointer.add(0x178).writeInt(value);
    }
}
