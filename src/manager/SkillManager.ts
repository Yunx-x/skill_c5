import {BaseManager} from "../base/BaseManager";
import {QuickCoolDownList} from "../base/skill/QuickSkillUtil";
import {Skill} from "../base/skill/Skill";
import {LingCaiManager} from "./LingCaiManager";


class DebugTestSkillXuanCooldown extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            //青云玄
            3017,
            3018,
            3019,
            3020,
            //鬼王玄
            3020,
            3021,
            3022,
            3023,
            3024,

            3025,
            3026,
            3027,
            3028,

            3029,
            3030,
            3031,
            3032,

            3033,
            3034,
            3035,
            3036,

            3037,
            3038,
            3039,
            3040,

            3041,
            3042,
            3043,
            3044,

            3045,
            3046,
            3047,
            3048,

            3049,
            3050,
            3051,
            3052,

            3569,
            3570,
            3571,
            3572,

            3573,
            3574,
            3584,
            3585,
            3587,

            4585,
            4586,
            4587,
            4588,

            5266,
            5267,
            5268,
            5269,

            5301,
            5302,
            5303,
            5304,

            5702,
            5703,
            5704,
            5705,

            6237,
            6238,
            6239,
            6240,
            6241,

            6641,
            6642,
            6643,
            6644,

            7605,
            7606,
            7607,
            7608
        ];
    }

    protected GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }

}

class DebugTestSkillShaCooldown extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            3065,
            3066,
            3067,
            3068,

            3069,
            3070,
            3071,
            3072,

            3073,
            3074,
            3075,
            3076,

            3077,
            3078,
            3079,
            3080,

            3081,
            3082,
            3083,
            3084,

            3085,
            3086,
            3087,
            3088,

            3089,
            3090,
            3091,
            3092,

            3093,
            3094,
            3095,
            3096,

            3097,
            3098,
            3099,
            3100,

            3575,
            3576,
            3577,
            3578,

            3587,
            3588,
            3590,
            3591,

            4589,
            4590,
            4591,
            4592,

            5270,
            5271,
            5272,
            5273,

            5305,
            5306,
            5307,
            5308,

            5706,
            5707,
            5708,
            5709,

            6242,
            6243,
            6244,
            6245,
            6246,

            6645,
            6646,
            6647,
            6648,

            7609,
            7610,
            7611,
            7612,

            3858
        ];
    }

    protected GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }
}

class DebugTestSkillChanCooldown extends QuickCoolDownList {
    getSkillList(): number[] {
        return [
            3113,
            3114,
            3115,
            3116,

            3117,
            3118,
            3119,
            3120,

            3121,
            3122,
            3123,
            3124,

            3125,
            3126,
            3127,
            3128,

            3129,
            3130,
            3131,
            3132,

            3133,
            3134,
            3135,
            3136,

            3137,
            3138,
            3139,
            3140,

            3141,
            3142,
            3143,
            3144,

            3145,
            3146,
            3147,
            3148,

            3579,
            3580,
            3581,
            3582,

            3583,
            3592,
            3594,
            3595,

            4593,
            4594,
            4595,
            4596,

            5274,
            5275,
            5276,
            5277,

            5313,
            5314,
            5315,
            5316,

            5710,
            5711,
            5712,
            5713,

            5721,
            6247,
            6248,
            6249,
            6250,
            6251,

            6649,
            6650,
            6651,
            6652,

            7613,
            7614,
            7615,
            7616,

            3859
        ];
    }

    protected GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 0
    }
}


export class SkillManager extends BaseManager {

    attach() {
        new DebugTestSkillXuanCooldown()
        new DebugTestSkillShaCooldown()
        new DebugTestSkillChanCooldown()
    }

}

export const skillManager = new SkillManager();
