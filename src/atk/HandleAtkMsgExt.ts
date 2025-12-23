import {HookFuncCore} from "base/HookFuncCore";
import {AttackMsg} from "atk/data";
import {XID} from "../base/gs/XID";

function sendBroadcastMsg(msg: string, channel: number) {
    const originFunc = HookFuncCore.getNativeFunc("_Z18broadcast_chat_msgiPKvjccS0_j",
        'bool', ['int32', 'pointer', 'int32', 'int32', 'char', 'int32', 'int32'])
    const cStringPointer = Memory.allocUtf16String(msg);
    return originFunc(0, cStringPointer, msg.length * 2, channel, 0, 0, 0)
}

const CheckRecvSkillAttack = HookFuncCore.getNativeFunc("_ZN11gactive_imp20CheckRecvSkillAttackEji",
    'bool', ['pointer', 'int32', 'int32'])

const GetFaction = HookFuncCore.getNativeFunc("_ZN11gactive_imp10GetFactionEv",
    'int32', ['pointer'])

//gactive_imp::HandleAttackMsg(gactive_imp *this, const MSG *a2, attack_msg *a3)
const HandleAttackMsg = "_ZN11gactive_imp15HandleAttackMsgERK3MSGP10attack_msg"
const HandleAttackMsg_Address = HookFuncCore.getFuncAddress(HandleAttackMsg);
Interceptor.replace(
    HandleAttackMsg_Address,
    new NativeCallback(
        (gactive_imp: NativePointer, msg: NativePointer, attack_msg: NativePointer) => {
            const attackMsg = new AttackMsg(attack_msg);

            const source = msg.add(4 * 3).readPointer()
            const skillLimit = attackMsg.getSkillLimit()

            if (skillLimit != 0 && !CheckRecvSkillAttack(gactive_imp, skillLimit, source.add(4).readInt())) {
                //goto 26
                return 0
            }

            //阵营判断
            const fac_match = GetFaction(gactive_imp) & attackMsg.getTargetFaction()

            //gobject
            const parent = gactive_imp.add(2 * 4).readPointer()

            const orange_name=attackMsg.getIsInvader()&&!fac_match

            const xid=new XID(parent.add(0x3C))

            const attacker_id = attackMsg.getAinfo().getAttacker().getID()
            const atkchange2_id = attackMsg.getAinfo().getAtkchange2Id()

            if (xid.IsPlayerClass()&&(
                parent.add(212).readInt()!=attacker_id||
                parent.add(220).readInt()!=attacker_id||
                parent.add(64).readInt()!=atkchange2_id
            )) {
                //goto 26
                return 0
            }

            parent.readInt()>0

            return 0
        },
        "int32",
        ["pointer", "pointer", "pointer"]
    ),
);
