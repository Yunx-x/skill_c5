#pragma once

#include "HookType.h"
#include "Skill.h"
#include "SkillStub.h"

namespace jd::base {

// 32 位游戏虚函数 / 成员：__thiscall
using F32SkillMethod = float(__thiscall*)(void* stub, void* skill);
using I32ParamMethod = int(__thiscall*)(void* stub, int param);
using DescriptionMethod = int(__thiscall*)(void* stub, void* skill, wchar_t* buf, int bufLen,
    wchar_t* defaultBuf, const void* tablePtr);

class ISkillStubHook {
public:
    virtual ~ISkillStubHook() = default;

    virtual int SkillId() const = 0;

    virtual void SetupStub(SkillStub& /*stub*/) {}

    virtual float GetAttackdistance(SkillStub& stub, Skill& skill, F32SkillMethod original) {
        return original(stub.Raw(), skill.Raw());
    }
    virtual float GetCastdistance(SkillStub& stub, Skill& skill, F32SkillMethod original) {
        return original(stub.Raw(), skill.Raw());
    }
    virtual float GetEffectdistance(SkillStub& stub, Skill& skill, F32SkillMethod original) {
        return original(stub.Raw(), skill.Raw());
    }
    virtual float GetPraydistance(SkillStub& stub, Skill& skill, F32SkillMethod original) {
        return original(stub.Raw(), skill.Raw());
    }
    virtual int GetRequiredLevel(SkillStub& stub, int level, I32ParamMethod original) {
        return original(stub.Raw(), level);
    }
    virtual int GetPreSkillID(SkillStub& stub, int index, I32ParamMethod original) {
        return original(stub.Raw(), index);
    }
    virtual int GetPreSkillSP(SkillStub& stub, int index, I32ParamMethod original) {
        return original(stub.Raw(), index);
    }
    virtual int GetDivinityExp(SkillStub& stub, int level, I32ParamMethod original) {
        return original(stub.Raw(), level);
    }
    virtual int GetDivinityLevel(SkillStub& stub, int level, I32ParamMethod original) {
        return original(stub.Raw(), level);
    }
    virtual int GetDescription(SkillStub& stub, Skill& skill, wchar_t* buf, int bufLen,
        wchar_t* defaultBuf, const void* tablePtr, DescriptionMethod original) {
        return original(stub.Raw(), skill.Raw(), buf, bufLen, defaultBuf, tablePtr);
    }
    virtual int GetIntroduction(SkillStub& stub, Skill& skill, wchar_t* buf, int bufLen,
        wchar_t* defaultBuf, const void* tablePtr, DescriptionMethod original) {
        return original(stub.Raw(), skill.Raw(), buf, bufLen, defaultBuf, tablePtr);
    }
};

/// 子类 override 了哪些虚方法，就自动 hook 哪些 vtable 槽（无需手写 OverrideMask）
template<typename HookT>
inline uint32_t ComputeAutoOverrideMask() {
    uint32_t mask = kNone;
    if (&HookT::GetRequiredLevel != &ISkillStubHook::GetRequiredLevel) {
        mask |= kRequiredLevel;
    }
    if (&HookT::GetAttackdistance != &ISkillStubHook::GetAttackdistance) {
        mask |= kAttackdistance;
    }
    if (&HookT::GetCastdistance != &ISkillStubHook::GetCastdistance) {
        mask |= kCastdistance;
    }
    if (&HookT::GetEffectdistance != &ISkillStubHook::GetEffectdistance) {
        mask |= kEffectdistance;
    }
    if (&HookT::GetPraydistance != &ISkillStubHook::GetPraydistance) {
        mask |= kPraydistance;
    }
    if (&HookT::GetDescription != &ISkillStubHook::GetDescription) {
        mask |= kDescription;
    }
    if (&HookT::GetIntroduction != &ISkillStubHook::GetIntroduction) {
        mask |= kIntroduction;
    }
    if (&HookT::GetPreSkillID != &ISkillStubHook::GetPreSkillID) {
        mask |= kPreSkillID;
    }
    if (&HookT::GetPreSkillSP != &ISkillStubHook::GetPreSkillSP) {
        mask |= kPreSkillSP;
    }
    if (&HookT::GetDivinityExp != &ISkillStubHook::GetDivinityExp) {
        mask |= kDivinityExp;
    }
    if (&HookT::GetDivinityLevel != &ISkillStubHook::GetDivinityLevel) {
        mask |= kDivinityLevel;
    }
    return mask;
}

} // namespace jd::base
