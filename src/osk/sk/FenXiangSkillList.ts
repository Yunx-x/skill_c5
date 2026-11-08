import {BaseHookSkillStub} from "../../base/skill/BaseHookSkillStub";
import {Skill} from "../../base/skill/Skill";
import {norm, zrand} from "../../base/ConstFunc";
import {QuickCoolDownList} from "../../base/skill/QuickSkillUtil";

/**
 * 3443  火焰纹章
 * 冷却55秒；施法速度减少30%，增加技能伤害30%，持续25秒
 * 3748  火焰纹章II：100%触发极限效果
 */
class Skill3443 extends BaseHookSkillStub {

    constructor() {
        super(3443);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 55000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let v3 = 5000 * skill.GetT0();
        let t = v3 + 6000 * skill.GetLevel();

        let T0 = skill.GetT0();
        let ta = (20 * (T0 + skill.GetLevel()) + 40) * 0.01;
        player.SetNingjin(120, ta, t);

        let tb = player.GetMp();
        let tt = 0
        if (player.GetMaxmp() * 0.95 < tb) {
            tt = 6000 * skill.GetLevel();
        }

        let T1 = skill.GetT1();
        let tc = 5 * (T1 + skill.GetLevel());
        tc = player.GetCrit() * 0.001 * tc * 0.01;
        player.SetInccritrate(tt, tc, 0);

        let ttt = 6000 * skill.GetLevel();
        const ra = (player.GetMp() / 10000) * 0.005001 * skill.GetT2();
        player.SetInccrithurt(120, ra, ttt, 5);

        let pp = 0
        if (player.GetHasbuff(4141)) {
            pp = 120
        }

        player.SetDispel(pp, 4141, 4141, 4141);

        player.SetSwift(120, 25000, 0.3, 0)
        player.SetIncskilldamage(0.3, 25000, 1)
        return true
    }

}

/**
 * 3434  炎兵炙魂
 * 冷却减少10秒，引爆附加真气上限伤害调整为5%*level（满级30%）
 * 玄烛·炎兵炙魂·曦日：目标每一个不利状态将提升伤害调整为10%*level；
 * 技能达到5级时,额外获得雷霆诅咒效果，持续18秒。
 * 怪物目标的雷霆诅咒效果数值翻倍
 */
class Skill3434 extends BaseHookSkillStub {

    constructor() {
        super(3434);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let Var3 = player.GetVar3();
        let v5 = player.GetVar4() + Var3;
        let star_lvl = v5 + player.GetVar5();
        let v8 = player.GetHasmultbuff(113) ? 120 : 0;

        let d = player.GetVar2();
        let v46 = skill.GetLevel() * 0.05 + 0.03;
        let da = (player.GetDebuffcnt() * (star_lvl * 0.02) + v46) * d;

        let count=0
        if (player.GetHasbuff(5430)){
            count++
        }

        if (player.GetHasbuff(5431)){
            count++
        }

        if (player.GetHasbuff(5432)){
            count++
        }

        if (player.GetHasbuff(5433)){
            count++
        }

        if (player.GetHasbuff(5434)){
            count++
        }

        if (player.GetHasbuff(5435)){
            count++
        }

        if (player.GetHasbuff(5436)){
            count++
        }

        if (player.GetHasbuff(5437)){
            count++
        }

        if (player.GetHasbuff(5438)){
            count++
        }

        if (player.GetHasbuff(5439)){
            count++
        }

        da = count * da;
        player.SetDirecthurt(v8, da);

        let ratio = 0.15000001;
        if (player.GetVar3() > 0)
            ratio += 0.3;
        if (player.GetVar4() > 0)
            ratio += 0.6;
        if (player.GetVar5() > 0)
            ratio += 0.9;
        let v36 = skill.GetT0() <= 0 ? 0 : 120;
        let db = skill.GetT0() * ratio;
        let dc = player.GetVar1() * db;
        player.SetFiring(v36, 12100, 6, dc, 6, 3);

        if (player.GetVar5() >= 5) {
            player.SetIncfatalhurt(120, 0.8, 18000, 4)
            if (player.GetTypeIsMob()) {
                player.SetIncfatalhurt(120, 0.8, 18000, 5)
            }
        }

        return true
    }

}

/**
 * 3445  法元解放
 * 冷却降低25秒，新增施法后自身技能闪躲提升5*level点，持续35秒
 */
class Skill3445 extends BaseHookSkillStub {

    constructor() {
        super(3445);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, skill.GetLevel() * 0.05, 35000, 2)
        return true
    }

}

/**
 * 3368  明觉
 * 技能躲闪提高5*level，持续30秒，冷却27秒
 */
class Skill3368 extends BaseHookSkillStub {

    constructor() {
        super(3368);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 27000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, skill.GetLevel() * 0.05, 30000, 1)
        return true
    }

}

/**
 * 3369  神奕
 *
 */
class Skill3369 extends BaseHookSkillStub {

    constructor() {
        super(3369);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 27000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, skill.GetLevel() * 0.05, 30000, 1)
        return true
    }
}

/**
 * 3428  浑阳令
 *
 */
class Skill3428 extends BaseHookSkillStub {

    constructor() {
        super(3428);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 27000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, skill.GetLevel() * 0.05, 30000, 1)
        return true
    }
}

/**
 * 3429  封魔术
 * 技能躲闪提高5*level，持续30秒，冷却27秒
 */
class Skill3429 extends BaseHookSkillStub {

    constructor() {
        super(3429);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 27000
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetIncskilldodge(120, skill.GetLevel() * 0.05, 30000, 1)
        return true
    }
}

/**
 * 3446  缚足锁魂
 *
 */
class Skill3446 extends BaseHookSkillStub {

    constructor() {
        super(3446);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 10000;
    }
}

/**
 * 3604  天守阵法
 * 真气盾抵消2%*level伤害，自身及队伍成员，减免伤害提高8%
 */
class Skill3604 extends BaseHookSkillStub {

    constructor() {
        super(3604);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetDispel(120, 4101, 4101, 4101);
        const playerMaxHp = 10 * player.GetMaxhp();
        player.SetMagicshield(0.02 * skill.GetLevel(), playerMaxHp, 3000);
        //减免伤害
        player.SetUltimateDamageReduction(120, 3000, 0.08, 1, 1);//减免伤害百分比
        return true
    }

}

/**
 * 3606  劫火阵法
 * 自身及队伍成员，固定攻击力增加4000点
 */
class Skill3606 extends BaseHookSkillStub {

    constructor() {
        super(3606);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetDispel(120, 43, 43, 43);
        //增加攻击力
        player.SetAddattack(120, 3000, 4000, 1);
        return true
    }

}

/**
 * 3607  祝融阵法
 * 自身及队伍成员，随机增加有利状态
 */
class Skill3607 extends BaseHookSkillStub {

    constructor() {
        super(3607);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetRandbuff(120, 3, 1, 3000, 1)
        return true
    }

}

/**
 * 3454  八凶玄火
 * 冷却减少30秒；自身及队伍成员，单体攻击距离延长5米，技能伤害增加15%
 */
class Skill3454 extends BaseHookSkillStub {

    constructor() {
        super(3454);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        let t = 0
        if (player.GetSkilllevel(6862) > 0) {
            t = 35000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - 30000 - t;
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    // StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
    //     super.StateAttack(stub, skill, originFunc);
    //     const player = skill.GetPlayerNice()
    //     //单体攻击距离
    //     player.SetSingleatkchange(120, 3000, 5, 0);
    //     //专注
    //     player.SetIncskilldamage(0.15, 3000, 1);
    //     return true
    // }
}


/**
 * 3608  八凶阵法
 *
 */
class Skill3608 extends BaseHookSkillStub {

    constructor() {
        super(3608);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        // int (skill->GetLevel () / 10) - int (skill->GetLevel () / 100) * 10) == 1 ? 3000 : 1
        //单体攻击距离
        player.SetSingleatkchange(120, 3000, 5, 0);
        //专注
        player.SetIncskilldamage(0.15, 3000, 8);
        return true
    }

}

/**
 * 3720
 * 八荒火龙祝福技能
 */
class Skill3720 extends BaseHookSkillStub {

    constructor() {
        super(3720);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice()
        player.SetRetort(100, 0.5, 100, 0.0, 20000);
        super.StateAttack(stub, skill, originFunc);
        player.SetBlessed(30, 10000)
        return true
    }

}

// /**
//  * 3453  焚香玉册
//  * 冷却60秒，使焚香玉册<玄>、<煞>、<禅>不共享CD
//  */
// class Skill3453 extends BaseHookSkillStub {
//
//     constructor() {
//         super(3453);
//     }
//
//     // GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
//     //     return 60000
//     // }
//
// }

/**
 * 3750  玄阳火典II
 * 冷却60秒，增伤效果改为3%*level，持续时间20秒；令目标禁食5秒；额外清除目标的藐视状态
 */
class Skill3750 extends BaseHookSkillStub {

    constructor() {
        super(3750);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 60000;
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        let t = 2000 * skill.GetLevel();
        let ta = skill.GetLevel() * 0.03 + 0.05;
        player.SetInchurt(120, ta, t);

        player.SetDiet(120, 5000)

        player.SetDispel(120, 9351, 9351, 9351)
        return true
    }

}

/**
 * 3755  炽炎千里II
 * 冷却30秒，消耗自身6% * level当前气血，并对周围20米内目标附加所消耗气血4% * level的伤害，
 * 100%附加一个新的灼烧状态，灼烧量为本体攻击力的15%*level
 *
 */
class Skill3755 extends BaseHookSkillStub {

    constructor() {
        super(3755);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        skill.SetRatio(0.0);
        const player = skill.GetPlayerNice();
        let Hp = player.GetHp();
        player.SetVar1(Hp);
        let Maxatk = player.GetMaxatk();
        player.SetVar2(Maxatk);
        let v11 = player.GetHp() * 0.04 * skill.GetLevel();
        player.SetHp(player.GetHp() - (player.GetHp() * 0.06 * skill.GetLevel()))
        skill.SetPlus(v11);
        player.SetPerform(1);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        let v3;
        if (player.GetHasmultbuff(113)) {
            v3 = 10 * skill.GetLevel();
        } else {
            v3 = 0.0;
        }

        let t = 1000 * skill.GetLevel() + 5000;
        let ta = player.GetVar2() * 0.15 * skill.GetLevel();
        player.SetFiring(v3, t, 8, ta, 6, 8);
        return true
    }

}

/**
 * 3754  炎兵炙魂II
 * 施法1秒，冷却40秒
 */
class Skill3754 extends BaseHookSkillStub {

    constructor() {
        super(3754);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 40000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }
}

/**
 * 3757  霸邪阵II
 * 冷却120秒
 */
class Skill3757 extends BaseHookSkillStub {

    constructor() {
        super(3757);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

/**
 * 3749  天锁囚怨II
 * 结界血量加强为施法者的200%，且与一代天锁囚怨不再相互重置冷却
 * 血量在服务端脚本修改
 */
class Skill3749 extends BaseHookSkillStub {

    constructor() {
        super(3749);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        return true
    }
}

/**
 * 3760  祝融真典II
 * 施法为2秒，冷却150秒；
 * 删除随机阵营限制，令队伍成员都可以获得技能伤害翻倍效果
 */
class Skill3760 extends BaseHookSkillStub {

    constructor() {
        super(3760);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 500
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 750
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 750
    }
}

/**
 * 3856  祝融真典II阵法效果
 * 删除随机阵营限制，令队伍成员都可以获得技能伤害翻倍效果
 *
 */
class Skill3856 extends BaseHookSkillStub {

    constructor() {
        super(3856);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetDispel(100, 218, 218, 5281)
        const v9 = skill.GetLevel() - 100 * (skill.GetLevel() / 100) + 5;
        const d = (v9 + 2 * player.GetCyclemembercnt() - 2) * 0.01;
        player.SetIncskilldamage(d * 2, 3000, 2)
        return true
    }

}

/**
 * 3572  八凶玄火<玄>
 *
 */
class Skill3572 extends BaseHookSkillStub {

    constructor() {
        super(3572);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetCycle(120, 10000, 2, 3608, 2, 3984)
        return true
    }

}

/**
 * 3578
 *
 */
class Skill3578 extends BaseHookSkillStub {

    constructor() {
        super(3578);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetCycle(120, 10000, 2, 3608, 2, 3984)
        return true
    }
}

/**
 * 3582
 *
 */
class Skill3582 extends BaseHookSkillStub {

    constructor() {
        super(3582);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 2000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.BlessMe(stub, skill, originFunc);
        const player = skill.GetPlayerNice()
        player.SetCycle(120, 10000, 2, 3608, 2, 3984)
        return true
    }
}

/**
 * 3569  南巫天火<玄>
 * 施法3秒，攻击目标18段，瞬间冷却
 * 每一段附加本体攻击力的180%，每段额外追加当前真气值10%的伤害
 * 灼烧概率100%，灼烧攻击力调整为自身最大攻击力的100%，最高可叠加9层，持续 20 秒；
 * 攻击怪物目标时
 * 每段伤害额外附加自身气血上限15%的攻击力，
 * 同时降低怪物目标防御，数值为自身最大攻击力的100%，持续20秒，
 * 增加200%被致命一击伤害，持续20秒
 *
 * 丰脉II：新增效果:南巫天火<玄><煞><禅>额外附加自身真气上限 1%*level 的攻击力
 *
 * 6868 玄烛·炼狱劫波·曦日：
 * 南巫天火<玄><煞><禅>额外降低目标减免伤害减免2%，最高累计5次
 */
class Skill3569 extends BaseHookSkillStub {

    constructor() {
        super(3569);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 3000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(1);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = zrand(100);
        let v6;
        if (v5 >= 2 * Math.floor(skill.GetLevel() / 2) + 1) {
            v6 = 0;
        } else {
            v6 = 300;
        }
        skill.SetSkillaccu(v6);
        // 每一段附加本体攻击力的180%，每段额外追加当前真气值10%的伤害
        let v7 = 4 * skill.GetLevel();
        let v8 = 8 * Math.floor(skill.GetLevel() / 15);
        let v14 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v17 = skill.GetT0() * 0.04 + v14;
        skill.SetRatio(v17);

        let v9 = 21 * skill.GetLevel() + 375;
        let v10 = 3 * skill.GetLevel();
        let v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);

        let v15 = player.GetHp() * 0.003;
        let v16 = skill.GetLevel() * v15;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v16 + player.GetMaxhp() * 0.15);

        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(2);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = 4 * skill.GetLevel();
        let v6 = 8 * Math.floor(skill.GetLevel() / 15);
        let v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);

        let v7 = 21 * skill.GetLevel() + 375;
        let v8 = 3 * skill.GetLevel();
        let v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);

        let v13 = player.GetHp() * 0.003;
        let v14 = skill.GetLevel() * v13;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v14 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(3);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = 4 * skill.GetLevel();
        let v6 = 8 * Math.floor(skill.GetLevel() / 15);
        let v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);

        let v7 = 21 * skill.GetLevel() + 375;
        let v8 = 3 * skill.GetLevel();
        let v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);

        let v13 = player.GetHp() * 0.003;
        let v14 = skill.GetLevel() * v13;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v14 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(4);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = zrand(100);
        let v6;
        if (v5 >= 3 * Math.floor(skill.GetLevel() / 2) + 1)
            v6 = 0;
        else
            v6 = 300;

        skill.SetSkillaccu(v6);

        let v7 = 4 * skill.GetLevel();
        let v8 = 8 * Math.floor(skill.GetLevel() / 15);
        let v14 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v17 = skill.GetT0() * 0.04 + v14;
        skill.SetRatio(v17);

        let v9 = 21 * skill.GetLevel() + 375;
        let v10 = 3 * skill.GetLevel();
        let v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);

        let v15 = player.GetHp() * 0.003;
        let v16 = skill.GetLevel() * v15;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v16 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(5);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = 4 * skill.GetLevel();
        let v6 = 8 * Math.floor(skill.GetLevel() / 15);
        let v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);

        let v7 = 21 * skill.GetLevel() + 375;
        let v8 = 3 * skill.GetLevel();
        let v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);

        let v13 = player.GetHp() * 0.003;
        let v14 = skill.GetLevel() * v13;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v14 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(6);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = 4 * skill.GetLevel();
        let v6 = 8 * Math.floor(skill.GetLevel() / 15);
        let v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);

        let v7 = 21 * skill.GetLevel() + 375;
        let v8 = 3 * skill.GetLevel();
        let v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);

        let v13 = player.GetHp() * 0.003;
        let v14 = skill.GetLevel() * v13;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v14 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(7);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = zrand(100);
        let v6;
        if (v5 >= 3 * Math.floor(skill.GetLevel() / 2) + 1)
            v6 = 0;
        else
            v6 = 300;

        skill.SetSkillaccu(v6);

        let v7 = 4 * skill.GetLevel();
        let v8 = 8 * Math.floor(skill.GetLevel() / 15);
        let v14 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v17 = skill.GetT0() * 0.04 + v14;
        skill.SetRatio(v17);

        let v9 = 21 * skill.GetLevel() + 375;
        let v10 = 3 * skill.GetLevel();
        let v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);

        let v15 = player.GetHp() * 0.003;
        let v16 = skill.GetLevel() * v15;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v16 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(8);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = 4 * skill.GetLevel();
        let v6 = 8 * Math.floor(skill.GetLevel() / 15);
        let v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);

        let v7 = 21 * skill.GetLevel() + 375;
        let v8 = 3 * skill.GetLevel();
        let v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);

        let v13 = player.GetHp() * 0.003;
        let v14 = skill.GetLevel() * v13;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v14 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        let Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(9);
        player.SetVar3(player.GetSkilllevel(6868));

        let v5 = 4 * skill.GetLevel();
        let v6 = 8 * Math.floor(skill.GetLevel() / 15);
        let v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        let v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);

        let v7 = 21 * skill.GetLevel() + 375;
        let v8 = 3 * skill.GetLevel();
        let v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);

        let v13 = player.GetHp() * 0.003;
        let v14 = skill.GetLevel() * v13;
        //每段伤害额外附加自身气血上限15%的攻击力，
        skill.SetMobBonusDamage(v14 + player.GetMaxhp() * 0.15);

        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFiring(120, 20100, 9, player.GetVar1(), 8, zrand(8) + 1);
        if (player.GetVar3() >= 5) {
            player.SetFlamecurse(120, 13100, 0.02, 5)
        }

        if (player.GetTypeIsMob()) {
            //同时降低怪物目标防御，数值为自身最大攻击力的100%，持续20秒，
            // 增加200%被致命一击伤害，持续20秒
            player.SetSubdefence(120, player.GetVar1(), 20100, 2)
            player.SetIncfatalhurt(120, 2.0, 20100, 2)
        }
        return true
    }
}

/**
 * 3575
 *
 */
class Skill3575 extends BaseHookSkillStub {

    constructor() {
        super(3575);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 3000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(1);
        player.SetVar3(player.GetSkilllevel(6868));

        const v14 = (skill.GetLevel() / 2) * 0.05;
        const v5 = zrand(100);
        let v6;
        if (v5 >= 2 * (skill.GetLevel() / 2) + 1)
            v6 = 0.0;
        else
            v6 = 1.0;
        const v18 = v6 * v14 + 0.01;
        skill.SetCrithurt(v18);
        const v7 = 4 * skill.GetLevel();
        const v8 = 8 * (skill.GetLevel() / 15);
        const v15 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v19 = skill.GetT0() * 0.04 + v15;
        skill.SetRatio(v19);
        const v9 = 21 * skill.GetLevel() + 375;
        const v10 = 3 * skill.GetLevel();
        const v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(2);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(3);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(4);
        player.SetVar3(player.GetSkilllevel(6868));

        const v14 = (skill.GetLevel() / 2) * 0.05;
        const v5 = zrand(100);
        let v6;
        if (v5 >= 2 * (skill.GetLevel() / 2) + 1)
            v6 = 0.0;
        else
            v6 = 1.0;
        const v18 = v6 * v14 + 0.01;
        skill.SetCrithurt(v18);
        const v7 = 4 * skill.GetLevel();
        const v8 = 8 * (skill.GetLevel() / 15);
        const v15 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v19 = skill.GetT0() * 0.04 + v15;
        skill.SetRatio(v19);
        const v9 = 21 * skill.GetLevel() + 375;
        const v10 = 3 * skill.GetLevel();
        const v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(5);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(6);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(7);
        player.SetVar3(player.GetSkilllevel(6868));

        const v14 = (skill.GetLevel() / 2) * 0.05;
        const v5 = zrand(100);
        let v6;
        if (v5 >= 2 * (skill.GetLevel() / 2) + 1)
            v6 = 0.0;
        else
            v6 = 1.0;
        const v18 = v6 * v14 + 0.01;
        skill.SetCrithurt(v18);
        const v7 = 4 * skill.GetLevel();
        const v8 = 8 * (skill.GetLevel() / 15);
        const v15 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v19 = skill.GetT0() * 0.04 + v15;
        skill.SetRatio(v19);
        const v9 = 21 * skill.GetLevel() + 375;
        const v10 = 3 * skill.GetLevel();
        const v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(8);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(9);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFiring(120, 20100, 9, player.GetVar1(), 8, zrand(8) + 1);

        if (player.GetTypeIsMob()) {
            //同时降低怪物目标防御，数值为自身最大攻击力的100%，持续20秒，
            // 增加200%被致命一击伤害，持续20秒
            player.SetSubdefence(120, player.GetVar1(), 20100, 2)
            player.SetIncfatalhurt(120, 2.0, 20100, 2)
        }
        return true
    }
}

/**
 * 3579
 *
 */
class Skill3579 extends BaseHookSkillStub {

    constructor() {
        super(3579);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 3000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 420
    }

    GetTime6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 180
    }

    GetTime8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    GetTime10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 300
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(1);
        player.SetVar3(player.GetSkilllevel(6868));

        const v14 = (skill.GetLevel() / 5 + 1) * 0.01;
        const v5 = zrand(100);
        const v6 = (v5 >= 2 * (skill.GetLevel() / 2) + 1) ? 0.0 : 1.0;
        const v18 = v6 * v14;
        skill.SetCrit(v18);
        const v7 = 4 * skill.GetLevel();
        const v8 = 8 * (skill.GetLevel() / 15);
        const v15 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v19 = skill.GetT0() * 0.04 + v15;
        skill.SetRatio(v19);
        const v9 = 21 * skill.GetLevel() + 375;
        const v10 = 3 * skill.GetLevel();
        const v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(1);
        player.SetPerform(0);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(2);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(3);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate5(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(4);
        player.SetVar3(player.GetSkilllevel(6868));

        const v14 = (skill.GetLevel() / 5 + 1) * 0.01;
        const v5 = zrand(100);
        const v6 = (v5 >= 2 * (skill.GetLevel() / 2) + 1) ? 0.0 : 1.0;
        const v18 = v6 * v14;
        skill.SetCrit(v18);
        const v7 = 4 * skill.GetLevel();
        const v8 = 8 * (skill.GetLevel() / 15);
        const v15 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v19 = skill.GetT0() * 0.04 + v15;
        skill.SetRatio(v19);
        const v9 = 21 * skill.GetLevel() + 375;
        const v10 = 3 * skill.GetLevel();
        const v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate6(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(5);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate7(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(6);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate8(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(7);
        player.SetVar3(player.GetSkilllevel(6868));

        const v14 = (skill.GetLevel() / 5 + 1) * 0.01;
        const v5 = zrand(100);
        const v6 = (v5 >= 2 * (skill.GetLevel() / 2) + 1) ? 0.0 : 1.0;
        const v18 = v6 * v14;
        skill.SetCrit(v18);
        const v7 = 4 * skill.GetLevel();
        const v8 = 8 * (skill.GetLevel() / 15);
        const v15 = (v7 + v8 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v19 = skill.GetT0() * 0.04 + v15;
        skill.SetRatio(v19);
        const v9 = 21 * skill.GetLevel() + 375;
        const v10 = 3 * skill.GetLevel();
        const v13 = v9 + v10 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v13 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate9(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(8);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    Calculate10(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        const Maxatk = player.GetMaxatk();
        player.SetVar1(Maxatk);
        player.SetVar2(9);
        player.SetVar3(player.GetSkilllevel(6868));

        const v5 = 4 * skill.GetLevel();
        const v6 = 8 * (skill.GetLevel() / 15);
        const v12 = (v5 + v6 * (skill.GetLevel() - 15)) * 0.01 + 2.0;
        const v15 = skill.GetT0() * 0.04 + v12;
        skill.SetRatio(v15);
        const v7 = 21 * skill.GetLevel() + 375;
        const v8 = 3 * skill.GetLevel();
        const v11 = v7 + v8 * skill.GetLevel();
        const fm = player.GetSkilllevel(3751)
        const fmPlus = fm * 0.01 * player.GetMaxmp()
        skill.SetPlus(v11 + player.GetMp() * 0.12 + fmPlus);
        const v16 = player.GetHp() * 0.003;
        const v17 = skill.GetLevel() * v16;
        skill.SetMobBonusDamage(v17 + player.GetMaxhp() * 0.15);
        player.SetPerform(0);
        player.SetPerform(0);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetFiring(120, 20100, 9, player.GetVar1(), 8, zrand(8) + 1);
        if (player.GetTypeIsMob()) {
            //同时降低怪物目标防御，数值为自身最大攻击力的100%，持续20秒，
            // 增加200%被致命一击伤害，持续20秒
            player.SetSubdefence(120, player.GetVar1(), 20100, 2)
            player.SetIncfatalhurt(120, 2.0, 20100, 2)
        }
        return true
    }
}

/**
 * 3571  焚香玉册<玄>
 *   额外令自身免疫单攻技能伤害15秒
 */
class Skill3571 extends BaseHookSkillStub {

    constructor() {
        super(3571);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const tb = 3000 * (skill.GetLevel() / 5) + 5000;
        const t = player.GetMaxhp();
        const v13 = Math.floor(skill.GetLevel() / 4 + 2);
        let Debuffcnt;
        if (v13 <= player.GetDebuffcnt()) {
            Debuffcnt = v13;
        } else {
            Debuffcnt = player.GetDebuffcnt();
        }
        const tc = ((Debuffcnt * (skill.GetLevel() / 5 + 1)) * 0.01 + 0.05) * t;
        player.SetHpregain(1.0, tc, 40.0, 100, tb);
        player.SetSingleTargetImmune(120, 15000,1.0)
        player.SetBuxiu(120,0,10000)
        return true
    }
}

/**
 * 3577  焚香玉册<煞>
 *施法后不再令焚香玉册技能进入冷却
 */
class Skill3577 extends BaseHookSkillStub {

    constructor() {
        super(3577);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const v9 = 3 * (Math.floor(skill.GetLevel() / 5)) + 5;
        const v10 = Math.floor(skill.GetLevel() / 4 + 2);
        let v13;
        if (v10 <= player.GetDebuffcnt()) {
            v13 = 2 * (Math.floor(skill.GetLevel() / 4 + 2));
        } else {
            v13 = 2 * player.GetDebuffcnt();
        }
        const tb = 1000 * (v9 + v13);
        const v16 = Math.floor(skill.GetLevel() / 5 + 4);
        const v17 = Math.floor(skill.GetLevel() / 4 + 2);
        let Debuffcnt;
        if (v17 <= player.GetDebuffcnt()) {
            Debuffcnt = Math.floor(skill.GetLevel() / 4 + 2);
        } else {
            Debuffcnt = player.GetDebuffcnt();
        }
        const tc = v16 + Debuffcnt;
        const t = player.GetMaxatk();
        const v30 = Math.floor(skill.GetLevel() / 5) * 0.01 + 0.01;
        const v23 = Math.floor(skill.GetLevel() / 4 + 2);
        let v26;
        if (v23 <= player.GetDebuffcnt()) {
            v26 = Math.floor(skill.GetLevel() / 4 + 2) * 0.01;
        } else {
            v26 = player.GetDebuffcnt() * 0.01;
        }
        const td = (v26 + v30) * t;
        player.SetFrenzied(100, 1.0, td, tc, tb);
        return true
    }

}

/**
 * 3581  焚香玉册<禅>
 *施法后不再令焚香玉册技能进入冷却
 */
class Skill3581 extends BaseHookSkillStub {

    constructor() {
        super(3581);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const v9 = 3 * (Math.floor(skill.GetLevel() / 5)) + 5;
        const v10 = Math.floor(skill.GetLevel() / 4 + 2);
        let v13;
        if (v10 <= player.GetDebuffcnt()) {
            v13 = 2 * (Math.floor(skill.GetLevel() / 4 + 2));
        } else {
            v13 = 2 * player.GetDebuffcnt();
        }
        const ta = 1000 * (v9 + v13);
        const v15 = skill.GetLevel() + 20;
        const v16 = Math.floor(skill.GetLevel() / 4 + 2);
        let Debuffcnt;
        if (v16 <= player.GetDebuffcnt()) {
            Debuffcnt = Math.floor(skill.GetLevel() / 4 + 2);
        } else {
            Debuffcnt = player.GetDebuffcnt();
        }
        const tb = (v15 + Debuffcnt * (Math.floor(skill.GetLevel() / 5 + 6))) * 0.01;
        player.SetRetort(100, tb, 100, 0.0, ta);

        return true
    }

}

/**
 * 玄阳火典III《碧海》《大地》《英雄》冷却减少25秒
 */
class XuanYangHuoDian3 extends QuickCoolDownList {

    getSkillList(): number[] {
        return [5768, 5769, 5770];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 25000;
    }

}

/**
 * 5767  玄阳火典III《天》
 * 魔阵营冷却减少30秒
 */
class Skill5767 extends BaseHookSkillStub {

    constructor() {
        super(5767);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        const player = skill.GetPlayerNice()
        let t = 0
        if (player.GetCultivation() == 2) {
            t = 5000
        }

        return super.GetCooldowntime(stub, skill, originFunc) - 25000 - t;
    }
}

/**
 * 5853  涅槃重生III  《天空》
 * 18秒内免疫负面及效果72次，10秒内增加自身技能命中75点
 */
class Skill5853 extends BaseHookSkillStub {

    constructor() {
        super(5853);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        player.SetHpgen(120, 6000, 0, player.GetMaxhp(), 1, 1);

        player.SetIncskillaccu(100, 0.75, 10100, 7);
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, 40);

        player.SetBlessed(72, 18100);
        return true
    }
}

/**
 * 5856  涅槃重生III  《英雄》
 * 18秒内免疫负面及效果72次，前10秒处于真无敌状态，额外清除火焰纹章的冷却
 */
class Skill5856 extends BaseHookSkillStub {

    constructor() {
        super(5856);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetHpgen(120, 6000, 0, player.GetMaxhp(), 1, 1);
        player.SetClearcooldown(3443, 3443, 3443)
        return true
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        player.SetCleardebuff(120, 40);
        player.SetInvincible(10100)
        player.SetBlessed(72, 18100);
        return true
    }
}

/**
 * 6862  赤乌·三昧真火·曦日
 * 施法1秒，第一击新增效果令冰冻目标6秒，第二击新增效果令目标6秒内残废，技能等级降低2*level级。
 * 被动效果：降低“八凶阵法”冷却35秒
 */
class Skill6862 extends BaseHookSkillStub {

    constructor() {
        super(6862);
    }

    GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000
    }

    GetTime1(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    GetTime4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 250
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetVictimNice();
        const var1 = player.GetVar(1);
        const var2 = player.GetVar(2);

        if (var1 == 2) {//第二击，灼烧
            const v29 = var2 * (zrand(20) + 30);
            player.SetFiring(120, 3100, 4, v29, 4, 6);

            //残废，最高6秒
            player.SetCrippleddebuff(120, 1000 * skill.GetLevel() * 1000, skill.GetLevel() * 2);
        } else if (var1 > 2) {//第三击
            if (var1 == 3) {//第三击
                const da = skill.GetLevel() * 0.1;
                player.SetDecskilldamage(da, 8100, 8);
                player.SetDpleak(120, 6100, var2 * skill.GetLevel(), 0, 2);
            }
        } else if (var1 == 1) {//第一击
            const d = var2 * 1.2;
            player.SetDizzy(d, 3100);
            //冰冻
            player.SetFrozen(d, 1, 6000, 4)
        }

        return true
    }

}

/**
 * 3448  炼狱劫波
 * 6868 玄烛·炼狱劫波·曦日：
 * 灼烧几率提升为100%，打断目标施法调整为10%*level；
 * 额外受到一次灼烧伤害，数值为自身气血上限的30%，持续时间15秒。仅对玩家生效
 */
class Skill3448 extends BaseHookSkillStub {

    constructor() {
        super(3448);
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar7(player.GetMaxhp())
        super.Calculate2(stub, skill, originFunc);
    }

    Calculate3(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar7(player.GetMaxhp())
        super.Calculate3(stub, skill, originFunc);
    }

    Calculate4(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>) {
        const player = skill.GetPlayerNice();
        player.SetVar7(player.GetMaxhp())
        super.Calculate4(stub, skill, originFunc);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        const var3 = player.GetVar3();
        const var4 = player.GetVar4() + var3;
        const var5 = var4 + player.GetVar5();
        player.SetBreakcasting(var5 * 10);

        const db = (2000 * skill.GetT1() + 12100);

        const var1 = player.GetVar1();
        const dc = var1 * 0.25;
        let dd = (skill.GetT1() * 0.5 + 1.0) * dc;
        const ddd = ((skill.GetT2() * 0.1 + 1.0) * dd);
        player.SetFiring(120, db, 8, ddd, 6, 4);
        if (player.GetVar5() >= 5 && player.GetTypeIsPlayer()) {
            player.SetFiring(120, db, 8, player.GetVar7() * 0.3, 6, 9);
        }
        return true
    }
}

/**
 * 3435  火猎护主
 *
 * 火猎护主：降低目标隐身能力额外加10点
 * 玄烛·火猎护主·曦日：
 * 24秒降低目标全抗100点，技能命中60点，技能躲闪30点；
 * 技能达到5级时，八凶玄火<玄><煞><禅>召唤的火龙的血量额外增加自身真气上限的18倍，自身每10万真气额外增加火龙3%减免致命一击率和15%减免致命一击伤害
 */
class Skill3435 extends BaseHookSkillStub {

    constructor() {
        super(3435);
    }

    StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();

        let p = 0
        if (player.GetHasbuff(5331) && skill.GetLevel() <= player.GetVar1() + 10) {
            p = 120
        }

        let v = skill.GetLevel() + 2 + 2 * skill.GetT2() + 10
        player.SetSubhide(p, v, 10000, 1)

        let p2 = -1
        const result = zrand(100)
        if (skill.GetT1() <= 0 || result >= 33 * skill.GetT1()) {
            p2 = 0
        }
        const t2 = 2000 * skill.GetT1();
        player.SetWrap(p2, t2)

        const Var2 = player.GetVar2();
        const v21 = player.GetVar3() + Var2;
        const star_lvl = v21 + player.GetVar4();
        const db = 120 * star_lvl;
        const dc = star_lvl * 0.12;
        player.SetDecskillaccu(db, dc, 24100, 9);
        player.SetDecskilldodge(db, star_lvl * 0.06, 24100, 9);

        let res = 0;
        if (player.GetVar2() > 0)
            res = 30;
        if (player.GetVar3() > 0)
            res = 60;
        if (player.GetVar4() > 0)
            res = 100;
        const dd = 120 * star_lvl;
        player.SetSubanti(dd, res, 24100, 9)
        return true
    }

}

class FeiShengFenXiang extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            3763, 3767, 3771, 3775, 3779, 3783,//绝情殇
            3764, 3768, 3772, 3776, 3780, 3784,//鬼神通
            3761, 3765, 3769, 3773, 3777, 3781,//红尘恨
            3762, 3766, 3770, 3774, 3778, 3782//山河逆
        ];
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 120000
    }

}

export class FenXiangSkillList {
    constructor() {
        new Skill3443()
        new Skill3434()
        new Skill3445()
        new Skill3368()
        new Skill3369()
        new Skill3428()
        new Skill3429()
        new Skill3446()
        new Skill3604()
        new Skill3606()
        new Skill3607()
        new Skill3454()
        new Skill3608()
        new Skill3720()
        // new Skill3453()
        new Skill3750()
        new Skill3755()
        new Skill3754()
        new Skill3757()
        new Skill3749()
        new Skill3760()
        new Skill3856()
        new Skill3569()
        new Skill3575()
        new Skill3579()
        new Skill3571()
        new Skill3577()
        new Skill3581()
        new XuanYangHuoDian3()
        new Skill5767()
        new Skill5853()
        new Skill5856()
        new Skill6862()
        new Skill3448()
        new Skill3435()
        new FeiShengFenXiang()
        new Skill3572()
        new Skill3578()
        new Skill3582()
    }
}