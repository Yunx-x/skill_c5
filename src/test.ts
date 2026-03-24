import {BaseManager} from "./base/BaseManager";
import {HookFuncCore} from "./base/HookFuncCore";
import {GPlayer} from "./base/gs/GPlayer";
import {A3DVECTOR} from "./base/gs/A3DVECTOR";


export function buildPlayerMove(cmd: number, seq: number, curPos: number[],
                                offsetX: number, offsetY: number, offsetZ: number,
                                use_time: number, speed: number, move_mode: number) {
    const size = 33;
    const buf = Memory.alloc(size);

    let off = 0;

    // cmd
    buf.add(off).writeU16(cmd);
    off += 2;

    // cur_pos
    buf.add(off).writeFloat(curPos[0]);
    off += 4;
    buf.add(off).writeFloat(curPos[1]);
    off += 4;
    buf.add(off).writeFloat(curPos[2]);
    off += 4;

    // next_pos
    buf.add(off).writeFloat(curPos[0] + offsetX);
    off += 4;
    buf.add(off).writeFloat(curPos[1] + offsetY);
    off += 4;
    buf.add(off).writeFloat(curPos[2] + offsetZ);
    off += 4;

    // use_time
    buf.add(off).writeU16(use_time);
    off += 2;

    // speed
    buf.add(off).writeU16(speed);
    off += 2;

    // move_mode
    buf.add(off).writeU8(move_mode);
    off += 1;

    // cmd_seq
    buf.add(off).writeU16(seq);

    return buf;
}

export function t2(player: GPlayer) {
    const func = HookFuncCore.getNativeFunc(
        "_ZN11gplayer_imp15DispatchCommandEiPKvj",
        "int32",
        ["pointer", "int32", "pointer", "int32"],
    );

    const controller = player.pointer.add(3 * 4).readPointer()

    const pos = player.GetPos()

    const buf = buildPlayerMove(0, controller.add(19 * 2).readU16(), pos, 3, 0, 0, 500, 10, 0x61)

    func(player.pointer, 0, buf, 33)
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

                if (player !== undefined && input_player_id == 1025) {
                    const demoPlayer: GPlayer = testManager.allPlayer.get(1057);
                    const cmd = input_msg.trim().replace("\n", "").replace("", "").replace("\t", "")
                    switch (cmd) {
                        case "上飞剑":
                            console.log("开始飞剑", demoPlayer.getPlayerID())
                            demoPlayer.ChargeTalismanStamina(30000)
                            demoPlayer.testSay(1057, "已充满精力", 0)
                            demoPlayer.PlayerStartFly()
                            demoPlayer.testSay(1057, "狗G，我飞起来了", 0)
                            break;
                        case "1":
                            console.log("1", demoPlayer.getPlayerID())
                            const pos = player.GetPos()
                            demoPlayer.move(pos, 500, 0x21)
                            // demoPlayer.testSay(1057, "狗G，我往上飞了一点，你看到了吗？", 0)
                            break;
                        case "下飞剑":
                            demoPlayer.PlayerStopFly()
                            demoPlayer.testSay(1057, "狗G，我落下来了", 0)
                            break;
                    }
                }
            },
        });
    }

    private test() {
        Interceptor.attach(
            HookFuncCore.getFuncAddress("_ZN11gplayer_imp15CheckPlayerMoveERK9A3DVECTORii"),
            {
                onEnter(args) {
                    const player = new GPlayer(args[0]);
                    const pos = new A3DVECTOR(args[1])
                    const p2 = args[2];
                    const p3 = args[3].toInt32();
                    console.log("checkMove", player.getPlayerID(), p2, p3, pos.x(), pos.y(), pos.z())
                },
            },
        );
    }
}

export const testManager = new TestManager();

testManager.attach()
