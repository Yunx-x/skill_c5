#include "HookType.h"
#include "SkillDetour.h"

namespace jd::base {

const StubHookType kAllStubHookMethods[] = {
    StubHookType::GetRequiredLevel,
    StubHookType::GetAttackdistance,
    StubHookType::GetCastdistance,
    StubHookType::GetEffectdistance,
    StubHookType::GetPraydistance,
    StubHookType::GetDescription,
    StubHookType::GetIntroduction,
    StubHookType::GetPreSkillID,
    StubHookType::GetPreSkillSP,
    StubHookType::GetDivinityExp,
    StubHookType::GetDivinityLevel,
};

const std::size_t kAllStubHookMethodsCount =
    sizeof(kAllStubHookMethods) / sizeof(kAllStubHookMethods[0]);

std::size_t DetourAddress(StubHookType type) {
    switch (type) {
    case StubHookType::GetRequiredLevel:
        return reinterpret_cast<std::size_t>(&GetRequiredLevelDetour);
    case StubHookType::GetAttackdistance:
        return reinterpret_cast<std::size_t>(&GetAttackdistanceDetour);
    case StubHookType::GetCastdistance:
        return reinterpret_cast<std::size_t>(&GetCastdistanceDetour);
    case StubHookType::GetEffectdistance:
        return reinterpret_cast<std::size_t>(&GetEffectdistanceDetour);
    case StubHookType::GetPraydistance:
        return reinterpret_cast<std::size_t>(&GetPraydistanceDetour);
    case StubHookType::GetDescription:
        return reinterpret_cast<std::size_t>(&GetDescriptionDetour);
    case StubHookType::GetIntroduction:
        return reinterpret_cast<std::size_t>(&GetIntroductionDetour);
    case StubHookType::GetPreSkillID:
        return reinterpret_cast<std::size_t>(&GetPreSkillIDDetour);
    case StubHookType::GetPreSkillSP:
        return reinterpret_cast<std::size_t>(&GetPreSkillSPDetour);
    case StubHookType::GetDivinityExp:
        return reinterpret_cast<std::size_t>(&GetDivinityExpDetour);
    case StubHookType::GetDivinityLevel:
        return reinterpret_cast<std::size_t>(&GetDivinityLevelDetour);
    default:
        return 0;
    }
}

} // namespace jd::base
