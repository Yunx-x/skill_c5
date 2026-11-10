import {BaseManager} from "../base/BaseManager";
import {HookFuncCore} from "../base/HookFuncCore";
import {HookModuleBase} from "../base/HookModuleBase";
import {installGnet, installGsProto} from "./gnet";

/**
 * 18 职业跨服帮战。
 * 同一份脚本按进程挂到 glinkd、gdeliveryd、gs。
 * glinkd 把客户端协议转给交付服，交付服回区服列表和挑战，gs 在跨服副本创建和关闭时补 6900。
 */
export class UniqFactionPkManager extends BaseManager {
    private static readonly IDA_IMAGE_BASE = 0x8048000;
    private static readonly END_TIMESTAMP_OFFSET = 3116;
    private static readonly FIGHT_NOTIFY = 6900;

    attach() {
        const kind = this.processKind();
        if (kind === "gs") {
            this.attachGs();
            return;
        }
        if (kind === "glink" || kind === "delivery") {
            installGnet(kind);
            return;
        }
        console.log(`[UniqFactionPk] 当前进程不是 gs / glinkd / gdeliveryd，跳过`);
    }

    private processKind(): "gs" | "glink" | "delivery" | "" {
        const names = Process.enumerateModules().map((m) => m.name);
        if (names.indexOf("glinkd") >= 0) return "glink";
        if (names.indexOf("gdeliveryd") >= 0) return "delivery";
        if (names.indexOf("gs") >= 0) return "gs";
        return "";
    }

    private attachGs() {
        try {
            installGsProto();
        } catch (e) {
            console.log("[UniqFactionPk] gs item proto " + e);
        }
        const onCreate = this.resolve("_ZN36uniq_mafia_battle_raid_world_manager8OnCreateEv", 0x8b5a3e6);
        const onClose = this.resolve("_ZN36uniq_mafia_battle_raid_world_manager7OnCloseEv", 0x8b5a3ec);
        const getRoomId = this.resolve("_ZN18raid_world_manager13GetRaidRoomIDEv", 0);
        const dispatch = this.resolve("_ZN4GNET15GProviderClient16DispatchProtocolEiRKNS_8ProtocolE", 0x8bd1ad0);
        const release = this.resolve("_ZN4GNET8Protocol9Represent7ReleaseEPKS0_", 0x8bb1fd0);
        const notifyVt = this.resolveAddr(0x8e727c8);
        const baseVt = this.resolveAddr(0x8e6ffa8);
        if (onCreate.isNull() || onClose.isNull() || getRoomId.isNull() || dispatch.isNull() || notifyVt.isNull()) {
            console.log("[UniqFactionPk] gs 符号不齐，跨服副本通知没有挂上");
            return;
        }
        const roomIdOf = HookFuncCore.getNativeFuncForAddress(getRoomId, "int32", ["pointer"]);
        const send = HookFuncCore.getNativeFuncForAddress(dispatch, "int32", ["int32", "pointer"]);
        const releaseFn = release.isNull()
            ? null
            : HookFuncCore.getNativeFuncForAddress(release, "void", ["pointer"]);
        const notify = (world: NativePointer, isStart: number) => {
            try {
                const endTime = world.add(UniqFactionPkManager.END_TIMESTAMP_OFFSET).readS32();
                const roomId = roomIdOf(world);
                const mapId = this.readMapId(world);
                const msg = Memory.alloc(32);
                msg.writePointer(notifyVt);
                msg.add(4).writeU32(0);
                msg.add(8).writeU32(UniqFactionPkManager.FIGHT_NOTIFY);
                msg.add(12).writeS32(mapId);
                msg.add(16).writeS32(roomId);
                msg.add(20).writeS32(endTime);
                msg.add(24).writeU8(isStart);
                const ret = send(0, msg);
                if (releaseFn && !baseVt.isNull()) {
                    msg.writePointer(baseVt);
                    releaseFn(msg);
                }
                console.log(`[UniqFactionPk] 6900 is_start=${isStart} map=${mapId} room=${roomId} end=${endTime} ret=${ret}`);
            } catch (e) {
                console.log(`[UniqFactionPk] 6900 发送失败: ${e}`);
            }
        };
        Interceptor.attach(onCreate, {
            onEnter(args) { this.world = args[0]; },
            onLeave() { notify(this.world, 1); },
        });
        Interceptor.attach(onClose, {
            onEnter(args) { this.world = args[0]; },
            onLeave() { notify(this.world, 0); },
        });
        console.log("[UniqFactionPk] gs 已挂上跨服副本 6900");
    }

    private readMapId(world: NativePointer): number {
        const fn = world.readPointer().add(228).readPointer();
        const getMapId = HookFuncCore.getNativeFuncForAddress(fn, "int32", ["pointer"]);
        return getMapId(world);
    }

    private resolve(exportName: string, idaAddress: number): NativePointer {
        const exported = Module.findExportByName(null, exportName);
        if (exported) return exported;
        return this.resolveAddr(idaAddress);
    }

    private resolveAddr(idaAddress: number): NativePointer {
        if (idaAddress === 0) return ptr(0);
        const base = HookModuleBase.gsBaseIndex();
        if (base.isNull()) return ptr(0);
        return base.add(idaAddress - UniqFactionPkManager.IDA_IMAGE_BASE);
    }
}

export const uniqFactionPkManager = new UniqFactionPkManager();
