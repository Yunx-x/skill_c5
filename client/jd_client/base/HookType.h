#pragma once

#include "layout/LayoutV1792.h"

#include <cstddef>
#include <cstdint>

namespace jd::base {

enum class StubHookType : uint8_t {
    GetRequiredLevel = 0,
    GetAttackdistance,
    GetCastdistance,
    GetEffectdistance,
    GetPraydistance,
    GetDescription,
    GetIntroduction,
    GetPreSkillID,
    GetPreSkillSP,
    GetDivinityExp,
    GetDivinityLevel,
    Count
};

/// 对应 Rust 的 fn_addr_eq：由 ComputeAutoOverrideMask 按子类 override 自动推导
enum HookOverrideBits : uint32_t {
    kNone = 0,
    kRequiredLevel = 1u << 0,
    kAttackdistance = 1u << 1,
    kCastdistance = 1u << 2,
    kEffectdistance = 1u << 3,
    kPraydistance = 1u << 4,
    kDescription = 1u << 5,
    kIntroduction = 1u << 6,
    kPreSkillID = 1u << 7,
    kPreSkillSP = 1u << 8,
    kDivinityExp = 1u << 9,
    kDivinityLevel = 1u << 10,
};

inline std::size_t StubVtableSlot(StubHookType type) {
    using namespace jd::layout::v1792::stub_vtable_slot;
    switch (type) {
    case StubHookType::GetRequiredLevel: return GET_REQUIRED_LEVEL;
    case StubHookType::GetAttackdistance: return GET_ATTACK_DISTANCE;
    case StubHookType::GetCastdistance: return GET_CAST_DISTANCE;
    case StubHookType::GetEffectdistance: return GET_EFFECT_DISTANCE;
    case StubHookType::GetPraydistance: return GET_PRAY_DISTANCE;
    case StubHookType::GetDescription: return GET_DESCRIPTION;
    case StubHookType::GetIntroduction: return GET_INTRODUCTION;
    case StubHookType::GetPreSkillID: return GET_PRE_SKILL_ID;
    case StubHookType::GetPreSkillSP: return GET_PRE_SKILL_SP;
    case StubHookType::GetDivinityExp: return GET_DIVINITY_EXP;
    case StubHookType::GetDivinityLevel: return GET_DIVINITY_LEVEL;
    default: return static_cast<std::size_t>(-1);
    }
}

std::size_t DetourAddress(StubHookType type);

extern const StubHookType kAllStubHookMethods[];
extern const std::size_t kAllStubHookMethodsCount;

} // namespace jd::base
