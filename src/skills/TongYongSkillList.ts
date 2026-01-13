import {BaseHookSkillStub} from "../base/skill/BaseHookSkillStub";
import {Skill} from "../base/skill/Skill";


class Skill1970 extends BaseHookSkillStub {

    constructor() {
        super(1970);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 30000
    }
}


export class TongYongSkillList {

    constructor() {
        new Skill1970()
    }
}