#pragma once

#include "HookType.h"
#include "ISkillStubHook.h"

#include <cstddef>
#include <memory>

namespace jd::base {

struct HookEntry {
    int skillId = 0;
    void* stubPtr = nullptr;
    std::unique_ptr<ISkillStubHook> hook;
    std::size_t stubOriginals[static_cast<std::size_t>(StubHookType::Count)]{};
};

class SkillHookRegistry {
public:
    /// 注册技能 Hook：子类 override 了哪些虚方法，就自动 hook 哪些槽位
    template<typename HookT>
    static void Register() {
        RegisterImpl(std::make_unique<HookT>(), ComputeAutoOverrideMask<HookT>());
    }

    static HookEntry* GetEntry(std::size_t stubPtrKey);

private:
    static void RegisterImpl(std::unique_ptr<ISkillStubHook> hook, uint32_t overrideMask);
};

} // namespace jd::base
