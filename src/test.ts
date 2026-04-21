import {BaseManager} from "./base/BaseManager";
import {HookFuncCore} from "./base/HookFuncCore";
import {GPlayer} from "./base/gs/GPlayer";
import {StdMapIntIntDump, StdMapIntIntGet} from "./utils/StdMapIntInt";


export function GetLivenessCfg(): NativePointer {
    const func = HookFuncCore.getNativeFunc(
        "_ZN15player_template14GetLivenessCfgEv",
        "pointer",
        [],
    );
    return func();
}

export function MapFindIntKey(map: NativePointer, key: number): NativePointer {
    // 已验证：该项目目标进程使用 sret-first 形态：find(outIter, this, &key)
    const addr = HookFuncCore.getFuncAddress("_ZNSt3mapIiiSt4lessIiESaISt4pairIKiiEEE4findERS3_");
    const outIter = Memory.alloc(0x20);
    for (let i = 0; i < 0x20; i++) outIter.add(i).writeU8(0);
    const keyPtr = Memory.alloc(4);
    keyPtr.writeS32(key);
    const f = new NativeFunction(addr, "pointer", ["pointer", "pointer", "pointer"], "default");
    f(outIter, map, keyPtr);
    return outIter;
}

export function MapEnd(map: NativePointer): NativePointer {
    // 已验证：end(outIter, this)
    const addr = HookFuncCore.getFuncAddress("_ZNSt3mapIiiSt4lessIiESaISt4pairIKiiEEE3endEv");
    const outIter = Memory.alloc(0x20);
    for (let i = 0; i < 0x20; i++) outIter.add(i).writeU8(0);
    const f = new NativeFunction(addr, "pointer", ["pointer", "pointer"], "default");
    f(outIter, map);
    return outIter;
}




class TestManager extends BaseManager {
    allPlayer = new Map<number, any>();

    attach() {
        this.attachHeart();
        this.attachMsg();
        this.test();
    }

    /**
     * 监听玩家心跳
     */
    private attachHeart() {
        Interceptor.attach(
            HookFuncCore.getFuncAddress("_ZN11gplayer_imp11OnHeartbeatEj"),
            {
                onEnter(args) {
                    const player = new GPlayer(args[0]);
                    testManager.allPlayer.set(player.getPlayerID(), player);
                },
            },
        );
    }

    private attachMsg() {
        const address = HookFuncCore.getFuncAddress(
            "_Z16handle_user_chatiiiPKvjS0_jci",
        );
        Interceptor.attach(address, {
            onEnter(args) {
                const input_player_id = args[2].toInt32();
                const input_msg_length = args[4].toInt32();
                const input_msg = args[3].readUtf16String(input_msg_length / 2);
                const input_channel = args[7].toInt32();
                const player: GPlayer = testManager.allPlayer.get(input_player_id);
                console.error(
                    `player_id:${input_player_id} msg:${input_msg} channel:${input_channel}`,
                );

                if (player !== undefined) {
                    const cfg = GetLivenessCfg();

                    // 已验证：这里用 byte offset 的 cfg+460 是正确的 std::map<int,int>
                    const mapField = cfg.add(436);
                    const asPtr = mapField.readPointer();
                    const mapObj =Process.findRangeByAddress(asPtr) !== null ? asPtr : mapField;

                    // const testKey = 12844; // 改成你想测的 key
                    // const value = StdMapIntIntGet(mapObj, testKey);
                    // console.log("[map<int,int>]", "mapObj=", mapObj, "key=", testKey, "value=", value);

                    StdMapIntIntDump(mapObj, 50);

                }
            },
        });
    }

    private test() {
        Interceptor.attach(
            HookFuncCore.getFuncAddress("_Z18player_cash_notifyii"),
            {
                onEnter(args) {
                    const roleid = args[0].toInt32()
                    const cash_plus_used = args[1].toInt32()
                    console.log(roleid, cash_plus_used)
                },
            },
        );
    }
}

export const testManager = new TestManager();

testManager.attach()
