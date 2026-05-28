#pragma once

/// 技能作者：#include 本头文件，在单个 .cpp 里写类即可（无需 .h、无需改 SkillsAttach）。
///
/// class Skill544 : public jd::skills::SkillBase<Skill544> {
/// public:
///     Skill544() : SkillBase(544) {}
///     void SetupStub(jd::base::SkillStub& stub) override { ... }
/// };

#include "../base/ISkillStubHook.h"
#include "../base/Skill.h"
#include "../base/SkillHookRegistry.h"
#include "../base/SkillStub.h"
#include "../core/StringFormat.h"

#include "SkillRegistrar.h"

namespace jd::skills {

template<typename T>
struct AutoRegister {
    AutoRegister() {
        DeferSkillRegistration([] { jd::base::SkillHookRegistry::Register<T>(); });
    }
};

template<typename Derived>
class SkillBase : public jd::base::ISkillStubHook {
public:
    explicit SkillBase(int skillId) : skillId_(skillId) {}

    int SkillId() const override { return skillId_; }

private:
    int skillId_;
    static inline AutoRegister<Derived> s_autoRegister{};
};

} // namespace jd::skills
