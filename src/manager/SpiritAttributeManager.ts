import {BaseManager} from "../base/BaseManager";
import {GPlayer} from "../base/gs/GPlayer";
import {XID} from "../base/gs/XID";

const CHONG_LING = 92;
const HUA_LING = 93;
const ADDON_SPACE = 1;
const EQUIPMENT_ADDON_DATA_TYPE = 1;
const EQUIPMENT_ADDON_TYPE_OFFSET = 68;
const EQUIPMENT_ADDON_PARAMS_OFFSET = 76;
const ADDON_MASK_ACTIVATE = 2;
const LOG_PREFIX = "[SpiritAttribute]";
const ESSENCE_SPACE = 0;
const EQUIPMENT_ESSENCE_DATA_TYPE = 4;
const FIXED_ADDON_OFFSET = 0x1DC;
const FIXED_ADDON_COUNT = 10;
const ADDON_SPEC_SIZE = 20;
const EQUIPMENT_KIND_OFFSET = 0x118;
const INHERITED_ITEM_ID_OFFSET = 0x190;
const MAX_DAMAGE = 0x7FFFFFFF;
const SKILL_1792_BUILD_ID = "bdbc8229c243074b21abba087071b679d285f854";
// Return addresses immediately after the three calls to BeHurt in 1792 libskill.so.
const WHITE_DAMAGE_CALLS: ReadonlyArray<readonly [number, string]> = [
    [0x1867F93, "SetSecondattack"],
    [0x186BC5B, "SetDirecthurt"],
    [0x186BD67, "SetDirectattack"],
];

// IDA77Project/gs (1792 i386) offsets relative to ELF image base 0x08048000.
const GS_1792_BUILD_ID = "cd188cd78d30473c9528bffb06ca346a16bf89e5";
const GS_1792_OFFSETS: Readonly<Record<string, number>> = {
    _ZN11gplayer_imp4InitEP5worldP7gobject: 0x67613E,
    _ZN11gplayer_impD2Ev: 0x6754AC,
    _ZN13addon_manager14__QueryHandlerEi: 0x87AB7A,
    _ZN13addon_manager15__TransformDataER10addon_data: 0x87AB02,
    _ZN13addon_manager16__CheckAndUpdateERK10addon_dataP10equip_data: 0x987A80,
    _ZNK14addon_data_man8GetAddonEi: 0x701B66,
    _ZN7gmatrix8_datamanE: 0x115EAE0,
    _ZN11itemdataman12get_data_ptrEj8ID_SPACER9DATA_TYPE: 0xA6F038,
    _ZN13addon_manager12QueryHandlerEi: 0x87AC04,
    _ZN26enhance_skill_damage_addon3UseERK10addon_dataPK9item_bodyP11gactive_imp: 0x9714FC,
    _ZN13addon_handler13TransformDataER10addon_data: 0x970674,
    _ZTV26enhance_skill_damage_addon: 0xDCEF20,
    _ZN26enhance_skill_damage_addon10UpdateItemERK10addon_dataP10equip_data: 0x9714F2,
    _ZN26enhance_skill_damage_addon8ActivateERK10addon_dataPK9item_bodyP11gactive_impPK4item: 0x971506,
    _ZN26enhance_skill_damage_addon10DeactivateERK10addon_dataPK9item_bodyP11gactive_impPK4item: 0x971548,
    _ZN13addon_handler13ScaleActivateERK10addon_dataPK9item_bodyP11gactive_impjPK4item: 0x97059C,
    _ZN13addon_handler15ScaleDeactivateERK10addon_dataPK9item_bodyP11gactive_impjPK4item: 0x9705D2,
    _ZN13addon_handler16ScaleDeactivate2ERK10addon_dataPK9item_bodyP11gactive_impfPK4item: 0x970608,
    _ZN13addon_handler14ScaleActivate2ERK10addon_dataPK9item_bodyP11gactive_impfPK4item: 0x97063E,
    _ZN26enhance_skill_damage_addon13TransformDataER10addon_data: 0x9714E8,
    _ZN13addon_handler22IsTalismanAddonHandlerEv: 0x97067E,
    _ZNK10equip_item10OnActivateEjP11gactive_impP4item: 0x97C958,
    _ZNK10equip_item12OnDeactivateEjP11gactive_impP4item: 0x97D778,
    _ZNK10equip_item26GetNewEquipmentDataEssenceEPK4item: 0x97BB70,
    _ZN16object_interface6BeHurtERK3XIDRK15attacker_info_tibcc: 0x840370,
};

function readBuildId(module: Module, noteOffset: number): string {
    const note = module.base.add(noteOffset);
    if (module.base.readU32() !== 0x464C457F || note.readU32() !== 4 ||
        note.add(4).readU32() !== 20 || note.add(8).readU32() !== 3 ||
        note.add(12).readU32() !== 0x00554E47) return "未知";

    return Array.from(new Uint8Array(note.add(16).readByteArray(20)),
        byte => byte.toString(16).padStart(2, "0")).join("");
}

function gsSymbolResolver(module: Module): (name: string) => NativePointer {
    let symbols: Map<string, NativePointer>;
    let buildId: string;
    let loggedOffsets = false;

    return (name: string) => {
        const exported = Module.findExportByName(module.name, name) ?? Module.findExportByName(null, name);
        if (exported && Process.findModuleByAddress(exported)?.base.equals(module.base)) return exported;

        symbols ??= new Map(module.enumerateSymbols().map(symbol => [symbol.name, symbol.address]));
        const symbol = symbols.get(name);
        if (symbol && !symbol.isNull() && Process.findModuleByAddress(symbol)?.base.equals(module.base)) return symbol;

        buildId ??= readBuildId(module, 0x188);
        const offset = GS_1792_OFFSETS[name];
        if (buildId === GS_1792_BUILD_ID && offset !== undefined) {
            if (!loggedOffsets) {
                console.log(`${LOG_PREFIX} 使用已核对的 1792 GS 符号偏移，Build ID=${buildId}`);
                loggedOffsets = true;
            }
            return module.base.add(offset);
        }

        throw new Error(`GS 找不到符号 ${name}，模块=${module.path}，基址=${module.base}，Build ID=${buildId}`);
    };
}

interface SpiritAttributes {
    chongLing: number;
    huaLing: number;
}

interface PlayerAttributes {
    roleId: number;
    chongLing: Map<string, {value: number; count: number}>;
    huaLing: Map<string, {value: number; count: number}>;
}

interface FixedAddonLookup {
    specs: NativePointer[];
    details: string;
}

class SpiritAttributeManager extends BaseManager {
    private attached = false;
    private readonly players = new Map<string, PlayerAttributes>();
    private readonly currentPlayer = new Map<number, string>();

    getTotals(roleId: number): SpiritAttributes {
        const player = this.players.get(this.currentPlayer.get(roleId));
        return player ? this.sum(player) : {chongLing: 0, huaLing: 0};
    }

    attach(): void {
        if (this.attached || Process.arch !== "ia32") return;
        const module = Process.findModuleByName("gs");
        if (!module) return;

        const listeners: InvocationListener[] = [];
        const gs = gsSymbolResolver(module);
        try {
            this.install(module, gs, listeners);
            this.attached = true;
            console.log(`${LOG_PREFIX} 已启用 type=92/93，角色初始化后开始统计`);
        } catch (error) {
            for (const listener of listeners.reverse()) listener.detach();
            console.error(`${LOG_PREFIX} 挂载失败 ${error}`);
            return;
        }

        try {
            this.attachWhiteDamage(gs);
        } catch (error) {
            console.error(`${LOG_PREFIX} 白字伤害 Hook 挂载失败 ${error}`);
        }
    }

    private attachWhiteDamage(gs: (name: string) => NativePointer): void {
        const skill = Process.getModuleByName("libskill.so");
        const buildId = readBuildId(skill, 0x114);
        if (buildId !== SKILL_1792_BUILD_ID) {
            throw new Error(`libskill.so Build ID=${buildId}，无法确认白字伤害调用位置`);
        }

        const calls = new Map(WHITE_DAMAGE_CALLS.map(([offset, name]) => [skill.base.add(offset).toString(), name]));
        const beHurt = gs("_ZN16object_interface6BeHurtERK3XIDRK15attacker_info_tibcc");
        const manager = this;
        Interceptor.attach(beHurt, {
            onEnter(args) {
                const source = calls.get(this.returnAddress.toString());
                if (!source) return;
                const damage = args[3].toInt32();
                if (damage <= 0) return;

                const attacker = new XID(args[1]);
                const attackerId = attacker.IsPlayerClass() ? attacker.getID() : 0;
                const victim = manager.players.get(args[0].readPointer().toString());
                const chongLing = attackerId ? manager.getTotals(attackerId).chongLing : 0;
                const huaLing = victim ? manager.sum(victim).huaLing : 0;
                const adjusted = manager.adjustWhiteDamage(damage, chongLing, huaLing);
                if (adjusted === damage) return;

                args[3] = ptr(adjusted);
                console.log(`${LOG_PREFIX} 白字伤害 ${source} 施法者=${attackerId || "非玩家"} 受击者=${victim?.roleId ?? "无装备记录"} ${damage}->${adjusted} 冲灵=${(chongLing * 100).toFixed(4)}% 化灵=${(huaLing * 100).toFixed(4)}%`);
            },
        });
        console.log(`${LOG_PREFIX} 已挂载 SetSecondattack、SetDirecthurt、SetDirectattack 白字伤害加成`);
    }

    private adjustWhiteDamage(damage: number, chongLing: number, huaLing: number): number {
        const multiplier = 1 + chongLing - huaLing;
        return Math.min(MAX_DAMAGE, Math.max(0, Math.round(damage * multiplier)));
    }

    private install(module: Module, gs: (name: string) => NativePointer, listeners: InvocationListener[]): void {
        const initializePlayer = gs("_ZN11gplayer_imp4InitEP5worldP7gobject");
        const destroyPlayer = gs("_ZN11gplayer_impD2Ev");
        const queryHandler = gs("_ZN13addon_manager14__QueryHandlerEi");
        const transformData = gs("_ZN13addon_manager15__TransformDataER10addon_data");
        const checkAndUpdate = gs("_ZN13addon_manager16__CheckAndUpdateERK10addon_dataP10equip_data");
        const getAddon = gs("_ZNK14addon_data_man8GetAddonEi");
        const equipActivate = gs("_ZNK10equip_item10OnActivateEjP11gactive_impP4item");
        const equipDeactivate = gs("_ZNK10equip_item12OnDeactivateEjP11gactive_impP4item");
        const buildId = readBuildId(module, 0x188);
        const canReadFixedAddons = buildId === GS_1792_BUILD_ID;
        const getNewEssence = canReadFixedAddons
            ? new NativeFunction(gs("_ZNK10equip_item26GetNewEquipmentDataEssenceEPK4item"),
                "pointer", ["pointer", "pointer"], {scheduling: "exclusive"})
            : null;
        const dataManager = gs("_ZN7gmatrix8_datamanE");
        const getData = new NativeFunction(gs("_ZN11itemdataman12get_data_ptrEj8ID_SPACER9DATA_TYPE"),
            "pointer", ["pointer", "uint", "int", "pointer"], {scheduling: "exclusive"});
        const allocate = new NativeFunction(Module.getExportByName(null, "malloc"), "pointer", ["uint"],
            {scheduling: "exclusive"});
        const findHandler = new NativeFunction(gs("_ZN13addon_manager12QueryHandlerEi"), "pointer", ["int"]);
        // 原版没有这些类型。若目标 GS 已注册，避免重复接入或覆盖其原有处理器。
        if (!findHandler(CHONG_LING).isNull() || !findHandler(HUA_LING).isNull()) {
            throw new Error("GS 已有 type=92 或 93 的处理器");
        }

        const activate = gs("_ZN26enhance_skill_damage_addon3UseERK10addon_dataPK9item_bodyP11gactive_imp");
        const deactivate = gs("_ZN13addon_handler13TransformDataER10addon_data");
        const handler = this.createHandler(gs, allocate, activate, deactivate);
        const useMarker = handler.readPointer().add(3 * 4).readPointer();
        const manager = this;
        const addonById = new Map<number, NativePointer>();
        const dataType = Memory.alloc(4);
        const findAddonSpec = (addonId: number, details?: string[]): NativePointer | undefined => {
            if (addonId <= 0) return undefined;
            const cached = addonById.get(addonId);
            if (cached) {
                details?.push(`${addonId}(type=${cached.add(4).readS32()},param1=${cached.add(8).readFloat()})`);
                return cached;
            }

            dataType.writeS32(0);
            const row = getData(dataManager, addonId, ADDON_SPACE, dataType);
            if (row.isNull() || dataType.readS32() !== EQUIPMENT_ADDON_DATA_TYPE) {
                details?.push(`${addonId}(GS 无词条定义)`);
                return;
            }
            const type = row.add(EQUIPMENT_ADDON_TYPE_OFFSET).readS32();
            details?.push(manager.isTracked(type)
                ? `${addonId}(type=${type},param1=${row.add(EQUIPMENT_ADDON_PARAMS_OFFSET).readFloat()})`
                : `${addonId}(type=${type})`);
            if (!manager.isTracked(type)) return;

            const spec = allocate(ADDON_SPEC_SIZE);
            if (spec.isNull()) throw new Error("无法分配附加属性记录");
            spec.writePointer(handler);
            spec.add(4).writeS32(type);
            Memory.copy(spec.add(8), row.add(EQUIPMENT_ADDON_PARAMS_OFFSET), 12);
            addonById.set(addonId, spec);
            return spec;
        };
        const readEquipmentEssence = (itemId: number): NativePointer | null => {
            dataType.writeS32(0);
            const essence = getData(dataManager, itemId, ESSENCE_SPACE, dataType);
            return !essence.isNull() && dataType.readS32() === EQUIPMENT_ESSENCE_DATA_TYPE ? essence : null;
        };
        const isRecordingHandler = (object: NativePointer): boolean => {
            if (object.equals(handler)) return true;
            // 热重载后，已创建的装备仍可能持有旧脚本分配的处理器。
            const table = object.readPointer();
            return table.add(3 * 4).readPointer().equals(useMarker)
                && table.add(6 * 4).readPointer().equals(activate)
                && table.add(7 * 4).readPointer().equals(deactivate);
        };

        listeners.push(Interceptor.attach(initializePlayer, {
            onEnter(args) { this.player = args[0]; },
            onLeave() { manager.reset(this.player); },
        }));
        listeners.push(Interceptor.attach(destroyPlayer, {
            onEnter(args) { manager.release(args[0].toString()); },
        }));
        listeners.push(Interceptor.attach(activate, {
            onEnter(args) {
                if (isRecordingHandler(args[0])) manager.record(args[3], args[2], args[4], args[1], true);
            },
        }));
        listeners.push(Interceptor.attach(deactivate, {
            onEnter(args) {
                if (isRecordingHandler(args[0])) manager.record(args[3], args[2], args[4], args[1], false);
            },
        }));
        listeners.push(Interceptor.attach(transformData, {
            onEnter(args) { this.tracked = manager.isTracked(args[1].readS32()); },
            onLeave(result) {
                if (this.tracked && result.toInt32() === 0) result.replace(ptr(1));
            },
        }));
        listeners.push(Interceptor.attach(checkAndUpdate, {
            onEnter(args) { this.tracked = manager.isTracked(args[1].readS32()); },
            onLeave(result) {
                if (this.tracked && result.toInt32() === -1) result.replace(ptr(ADDON_MASK_ACTIVATE));
            },
        }));
        listeners.push(Interceptor.attach(getAddon, {
            onEnter(args) { this.addonId = args[1].toInt32(); },
            onLeave(result) {
                if (!result.isNull()) return;
                const spec = findAddonSpec(this.addonId);
                if (spec) result.replace(spec);
            },
        }));
        listeners.push(Interceptor.attach(queryHandler, {
            onEnter(args) { this.tracked = manager.isTracked(args[1].toInt32()); },
            onLeave(result) {
                if (this.tracked && result.isNull()) result.replace(handler);
            },
        }));
        listeners.push(Interceptor.attach(equipActivate, {
            onEnter(args) {
                if (args[2].isNull() || args[3].isNull()) return;
                this.player = args[2];
                this.equipment = args[0];
                this.parent = args[3];
                this.slot = args[1].toUInt32();
                const itemId = this.itemId = args[3].readS32();
                manager.ensurePlayer(this.player);
                if (!getNewEssence || itemId <= 0) return;

                try {
                    const essence = readEquipmentEssence(itemId);
                    if (!essence) {
                        this.fixed = {specs: [], details: `装备ID=${itemId}，GS 无装备模板`};
                        return;
                    }
                    const kind = essence.add(EQUIPMENT_KIND_OFFSET).readU32();
                    const canUseFixed = ![10, 11, 13].includes(this.slot) && kind <= 8;
                    this.fixed = manager.readFixedAddons(essence, findAddonSpec);
                    if (canUseFixed && kind >= 4 && kind <= 7) {
                        const firstEssence = getNewEssence(args[0], args[3]);
                        const baseId = firstEssence.isNull() ? 0 : firstEssence.add(INHERITED_ITEM_ID_OFFSET).readS32();
                        this.fixed.details += `；继承装备ID=${baseId}`;
                        const baseEssence = baseId > 0 ? readEquipmentEssence(baseId) : null;
                        if (baseEssence) {
                            const inherited = manager.readFixedAddons(baseEssence, findAddonSpec);
                            this.fixed.specs.push(...inherited.specs);
                            this.fixed.details += `，继承词条=${inherited.details}`;
                        } else if (baseId > 0) {
                            this.fixed.details += "，GS 无继承模板";
                        }
                    }
                    if (!canUseFixed) this.fixed.specs = [];
                } catch (error) {
                    console.error(`${LOG_PREFIX} 装备ID=${itemId} 补查固定词条失败 ${error}`);
                }
            },
            onLeave() {
                if (!this.player) return;
                if (this.fixed) {
                    manager.includeMissingFixedAddons(this.player, this.equipment, this.parent, this.fixed.specs);
                    console.log(`${LOG_PREFIX} 装备ID=${this.itemId} GS 固定词条=${this.fixed.details}`);
                }
                manager.logEquipment(this.player, this.slot, this.itemId, "装备激活");
            },
        }));
        listeners.push(Interceptor.attach(equipDeactivate, {
            onEnter(args) {
                if (args[2].isNull() || args[3].isNull()) return;
                this.player = args[2];
                this.equipment = args[0];
                this.slot = args[1].toUInt32();
                this.itemId = args[3].readS32();
                manager.ensurePlayer(this.player);
            },
            onLeave() {
                if (!this.player) return;
                manager.removeEquipment(this.player, this.equipment);
                manager.logEquipment(this.player, this.slot, this.itemId, "装备失效");
            },
        }));
        if (!canReadFixedAddons) {
            console.log(`${LOG_PREFIX} GS Build ID=${buildId}，装备模板布局未核对，当前仅记录原生词条事件`);
        }
    }

    private readFixedAddons(
        essence: NativePointer,
        findAddonSpec: (addonId: number, details: string[]) => NativePointer | undefined,
    ): FixedAddonLookup {
        const specs: NativePointer[] = [];
        const details: string[] = [];
        for (let index = 0; index < FIXED_ADDON_COUNT; index++) {
            const id = essence.add(FIXED_ADDON_OFFSET + index * 4).readS32();
            if (id <= 0) continue;
            const spec = findAddonSpec(id, details);
            if (spec) specs.push(spec.add(4));
        }
        return {specs, details: details.join(", ") || "空"};
    }

    private includeMissingFixedAddons(
        pointer: NativePointer,
        equipment: NativePointer,
        parent: NativePointer,
        fixed: NativePointer[],
    ): void {
        const player = this.players.get(pointer.toString());
        if (!player) return;
        // 原生激活可能已统计这些词条。对照模板保留重复条数，只补缺少的次数。
        const expected = new Map<string, number>();
        for (const data of fixed) {
            const key = `${equipment}/${this.addonKey(data)}`;
            const count = (expected.get(key) ?? 0) + 1;
            expected.set(key, count);
            const entries = data.readS32() === CHONG_LING ? player.chongLing : player.huaLing;
            if ((entries.get(key)?.count ?? 0) < count) this.record(pointer, equipment, parent, data, true);
        }
    }

    private removeEquipment(pointer: NativePointer, equipment: NativePointer): void {
        const player = this.players.get(pointer.toString());
        if (!player) return;
        const prefix = `${equipment}/`;
        for (const entries of [player.chongLing, player.huaLing]) {
            for (const key of entries.keys()) {
                if (key.startsWith(prefix)) entries.delete(key);
            }
        }
    }

    private addonKey(data: NativePointer): string {
        return `${data.readS32()}/${data.add(4).readU32()}/${data.add(8).readU32()}/${data.add(12).readU32()}`;
    }

    private ensurePlayer(pointer: NativePointer): void {
        if (!this.players.has(pointer.toString())) this.reset(pointer, "装备事件初始化");
    }

    private logEquipment(pointer: NativePointer, slot: number, itemId: number, event: string): void {
        const player = this.players.get(pointer.toString());
        if (player) this.log(player.roleId, `${event} 装备位=${slot} 装备ID=${itemId}`, this.sum(player));
    }

    private createHandler(
        gs: (name: string) => NativePointer,
        allocate: (size: number) => NativePointer,
        activate: NativePointer,
        deactivate: NativePointer,
    ): NativePointer {
        const template = gs("_ZTV26enhance_skill_damage_addon");
        const update = gs("_ZN26enhance_skill_damage_addon10UpdateItemERK10addon_dataP10equip_data");
        const originalActivate = gs("_ZN26enhance_skill_damage_addon8ActivateERK10addon_dataPK9item_bodyP11gactive_impPK4item");
        const originalDeactivate = gs("_ZN26enhance_skill_damage_addon10DeactivateERK10addon_dataPK9item_bodyP11gactive_impPK4item");
        const baseScaleActivate = gs("_ZN13addon_handler13ScaleActivateERK10addon_dataPK9item_bodyP11gactive_impjPK4item");
        const baseScaleDeactivate = gs("_ZN13addon_handler15ScaleDeactivateERK10addon_dataPK9item_bodyP11gactive_impjPK4item");
        const scaleDeactivate2 = gs("_ZN13addon_handler16ScaleDeactivate2ERK10addon_dataPK9item_bodyP11gactive_impfPK4item");
        const scaleActivate2 = gs("_ZN13addon_handler14ScaleActivate2ERK10addon_dataPK9item_bodyP11gactive_impfPK4item");
        const passTransform = gs("_ZN26enhance_skill_damage_addon13TransformDataER10addon_data");
        const isTalisman = gs("_ZN13addon_handler22IsTalismanAddonHandlerEv");

        // C5 x86 ABI。先校验已知虚函数槽，避免在布局不同的 GS 上挂载。
        const slots: [number, NativePointer][] = [
            [4, update], [5, activate], [8, originalActivate], [9, originalDeactivate],
            [12, scaleDeactivate2], [13, scaleActivate2], [14, passTransform], [15, isTalisman],
        ];
        for (const [slot, address] of slots) {
            if (!template.add(slot * 4).readPointer().equals(address)) {
                throw new Error(`GS addon_handler 虚表布局不匹配 slot=${slot - 2}`);
            }
        }

        // 装备对象可能缓存 handler。只保存 GS 原生函数地址，内存保留至 GS 退出。
        const storage = allocate(19 * 4);
        if (storage.isNull()) throw new Error("无法分配词条处理器");
        const vtable = storage.add(4);
        Memory.copy(vtable, template, 18 * 4);
        vtable.add(5 * 4).writePointer(isTalisman);
        vtable.add(8 * 4).writePointer(activate);
        vtable.add(9 * 4).writePointer(deactivate);
        vtable.add(10 * 4).writePointer(baseScaleActivate);
        vtable.add(11 * 4).writePointer(baseScaleDeactivate);
        return storage.writePointer(vtable.add(8));
    }

    private isTracked(type: number): boolean {
        return type === CHONG_LING || type === HUA_LING;
    }

    private reset(pointer: NativePointer, event = "登录初始化"): void {
        const roleId = new GPlayer(pointer).getPlayerID();
        if (roleId <= 0) return;
        const key = pointer.toString();
        const previous = this.currentPlayer.get(roleId);
        if (previous) this.players.delete(previous);
        this.players.set(key, {roleId, chongLing: new Map(), huaLing: new Map()});
        this.currentPlayer.set(roleId, key);
        this.log(roleId, event, {chongLing: 0, huaLing: 0});
    }

    private release(key: string): void {
        const player = this.players.get(key);
        if (!player) return;
        this.players.delete(key);
        if (this.currentPlayer.get(player.roleId) === key) this.currentPlayer.delete(player.roleId);
    }

    private record(
        pointer: NativePointer,
        equipment: NativePointer,
        parent: NativePointer,
        data: NativePointer,
        active: boolean,
    ): void {
        const player = this.players.get(pointer.toString());
        if (!player) return;
        const type = data.readS32();
        if (!this.isTracked(type)) return;
        const value = data.add(4).readFloat();
        if (!Number.isFinite(value) || value === 0) return;

        const entries = type === CHONG_LING ? player.chongLing : player.huaLing;
        // 相同词条可能在同一件装备上激活多次，失效时逐次扣除。
        // item_list::Remove moves the item into a temporary wrapper before calling Deactivate.
        const key = `${equipment}/${this.addonKey(data)}`;
        const count = entries.get(key)?.count ?? 0;
        if (!active && count === 0) return;
        if (!active && count === 1) entries.delete(key);
        else entries.set(key, {value, count: count + (active ? 1 : -1)});

        const itemId = parent.isNull() ? "未知" : parent.readS32();
        const change = ((active ? value : -value) * 100).toFixed(4);
        this.log(player.roleId, `${active ? "激活" : "失效"} type=${type} 装备ID=${itemId} 变动=${change}%`, this.sum(player));
    }

    private sum(player: PlayerAttributes): SpiritAttributes {
        let chongLing = 0;
        let huaLing = 0;
        for (const {value, count} of player.chongLing.values()) chongLing += value * count;
        for (const {value, count} of player.huaLing.values()) huaLing += value * count;
        return {chongLing, huaLing};
    }

    private log(roleId: number, event: string, totals: SpiritAttributes): void {
        console.log(`${LOG_PREFIX} 角色=${roleId} ${event} 冲灵=${(totals.chongLing * 100).toFixed(4)}% 化灵=${(totals.huaLing * 100).toFixed(4)}%`);
    }
}

export const spiritAttributeManager = new SpiritAttributeManager();
