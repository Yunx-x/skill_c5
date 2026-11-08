import {QingYunSkillList} from "../sk/QingYunSkillList";
import {LieShanSkillList} from "../sk/LieShanSkillList";
import {GuiYunSkillList} from "../sk/GuiYunSkillList";
import {TianYinSkillList} from "../sk/TianYinSkillList";
import {TianHuaSkillList} from "../sk/TianHuaSkillList";
import {PoJunSkillList} from "../sk/PoJunSkillList";
import {GuiDaoSkillList} from "../sk/GuiDaoSkillList";
import {TaiHaoSkillList} from "../sk/TaiHaoSkillList";
import {QingLuoSkillList} from "../sk/QingLuoSkillList";
import {GuiWangSkillList} from "../sk/GuiWangSkillList";
import {JiuLiSkillList} from "../sk/JiuLiSkillList";
import {HuaYingSkillList} from "../sk/HuaYingSkillList";
import {HeHuanSkillList} from "../sk/HeHuanSkillList";
import {ChenHuangSkillList} from "../sk/ChenHuangSkillList";
import {QianJiSkillList} from "../sk/QianJiSkillList";
import {FenXiangSkillList} from "../sk/FenXiangSkillList";
import {HuaiGuangSkillList} from "../sk/HuaiGuangSkillList";
import {YingZhaoSkillList} from "../sk/YingZhaoSkillList";
import {TongYongSkillList} from "../sk/TongYongSkillList";
import {SkillFuncCore} from "../../base/skill/SkillFuncCore";
import {Skill} from "../../base/skill/Skill";
import {SPlayer} from "../../base/skill/SPlayer";
import {HookFuncCore} from "../../base/HookFuncCore";

class SkillManager {

    attach() {
        new TongYongSkillList()

        new TianYinSkillList()
        new QingYunSkillList()
        new GuiWangSkillList()
        new HeHuanSkillList()
        new GuiDaoSkillList()
        new FenXiangSkillList()

        new JiuLiSkillList()
        new LieShanSkillList()
        new TianHuaSkillList()
        new HuaiGuangSkillList()
        new ChenHuangSkillList()
        new TaiHaoSkillList()

        new QianJiSkillList()
        new YingZhaoSkillList()
        new QingLuoSkillList()
        new PoJunSkillList()
        new GuiYunSkillList()
        new HuaYingSkillList()

        //覆盖半径
        SkillFuncCore.hookSkillFunc("_ZNK4GNET9SkillStub9GetRadiusEPNS_5SkillE", "float", ['pointer', 'pointer'],
            function (stub, skill: Skill, originFunc) {
                const skillId = skill.GetId()
                if (skillId == 6814) {//赤乌·天诛剑气·曦日
                    return 40.0
                }

                return 0.0
            })

        SkillFuncCore.hookSkillFunc("_ZNK4GNET9SkillStub11StateAttackEPNS_5SkillE", "bool", ['pointer', 'pointer'],
            function (stub, skill: Skill, originFunc) {
                const skillId = skill.GetId()
                if (skillId == 5266 || skillId == 5270 || skillId == 5274) {
                    //纵横天下<玄><煞><禅>可以嘲讽玩家，嘲讽能力继承计·围魏救赵
                    //攻击怪物目标时，附加20秒内降低目标减免致命一击伤害300%的效果
                    const player = skill.GetPlayerNice();
                    let v4;
                    if (player.GetTypeIsMob()) {
                        v4 = 0.0;
                    } else {
                        v4 = player.GetVar1();
                    }

                    player.SetSilent(v4, 10);

                    let v9;
                    if (player.GetTypeIsMob()) {
                        v9 = 120;
                    } else {
                        v9 = -1;
                    }

                    const t = 500 * skill.GetLevel() + 2500;
                    player.SetAssault2(v9, t);

                    if (player.GetTypeIsMob()) {
                        player.SetIncfatalhurt(120, 3.0, 20000, 2)
                    }

                    return 1
                }

                if (skillId == 5268 || skillId == 5272 || skillId == 5276) {//逆鳞断<玄><煞><禅>无视目标抗性，嘲讽目标5秒
                    const player = skill.GetPlayerNice();
                    player.SetAssault2(9999, 5100);
                    return 1
                }

                return 0
            })

        SkillFuncCore.hookSkillFunc("_ZN4GNET13PlayerWrapper13SetInvincibleEb", "bool", ['pointer', 'bool'],
            function (player: NativePointer, b) {
                const playerNice = new SPlayer(player)
                playerNice.RemoveFilter(4124)
                const fc = HookFuncCore.getNativeFunc('_ZN4GNET13PlayerWrapper13SetInvincibleEb', 'bool', ['pointer', 'bool']);
                return fc(player, 1)
            })

        // //灼烧、修改对周围目标伤害为原有的十分之一，半径4米
        // SkillFuncCore.hookSkillFunc("_ZN4GNET13PlayerWrapper9SetFiringEb", "bool", ['pointer', 'bool'],
        //     function (player: NativePointer, b) {
        //         const playerNice = new SNewPlayer(player)
        //         if (playerNice.GetTargetTypeIsMob()) {
        //             playerNice.SetValue(playerNice.GetMaxatk() / 10)
        //             playerNice.SetRatio(4)
        //         }
        //
        //         const fc = HookFuncCore.getNativeFunc('_ZN4GNET13PlayerWrapper9SetFiringEb', 'bool', ['pointer', 'bool']);
        //         return fc(player, 1)
        //     })

        console.log("Skill manager attach!")
    }
}

export const skillManager = new SkillManager()
