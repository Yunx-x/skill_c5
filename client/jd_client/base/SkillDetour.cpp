#include "SkillDetour.h"

#include "SkillHookRegistry.h"

namespace jd::base {
namespace {

HookEntry* Find(void* stub) {
    return SkillHookRegistry::GetEntry(reinterpret_cast<std::size_t>(stub));
}

#if defined(_M_IX86)

__forceinline void* ThisStub() {
    void* stub = nullptr;
    __asm {
        mov stub, ecx
    }
    return stub;
}

#else
#error jd_client 仅支持 Win32 (x86)
#endif

template <typename Fn>
Fn Original(HookEntry* entry, StubHookType type) {
    return reinterpret_cast<Fn>(entry->stubOriginals[static_cast<std::size_t>(type)]);
}

} // namespace
} // namespace jd::base

using namespace jd::base;

extern "C" float GetAttackdistanceDetour(void* skill) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0.f;
    SkillStub s(stub);
    Skill sk(skill);
    return entry->hook->GetAttackdistance(s, sk,
        Original<F32SkillMethod>(entry, StubHookType::GetAttackdistance));
}

extern "C" float GetCastdistanceDetour(void* skill) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0.f;
    SkillStub s(stub);
    Skill sk(skill);
    return entry->hook->GetCastdistance(s, sk,
        Original<F32SkillMethod>(entry, StubHookType::GetCastdistance));
}

extern "C" float GetEffectdistanceDetour(void* skill) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0.f;
    SkillStub s(stub);
    Skill sk(skill);
    return entry->hook->GetEffectdistance(s, sk,
        Original<F32SkillMethod>(entry, StubHookType::GetEffectdistance));
}

extern "C" float GetPraydistanceDetour(void* skill) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0.f;
    SkillStub s(stub);
    Skill sk(skill);
    return entry->hook->GetPraydistance(s, sk,
        Original<F32SkillMethod>(entry, StubHookType::GetPraydistance));
}

extern "C" int GetRequiredLevelDetour(int level) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0;
    SkillStub s(stub);
    return entry->hook->GetRequiredLevel(s, level,
        Original<I32ParamMethod>(entry, StubHookType::GetRequiredLevel));
}

extern "C" int GetPreSkillIDDetour(int index) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0;
    SkillStub s(stub);
    return entry->hook->GetPreSkillID(s, index,
        Original<I32ParamMethod>(entry, StubHookType::GetPreSkillID));
}

extern "C" int GetPreSkillSPDetour(int index) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0;
    SkillStub s(stub);
    return entry->hook->GetPreSkillSP(s, index,
        Original<I32ParamMethod>(entry, StubHookType::GetPreSkillSP));
}

extern "C" int GetDivinityExpDetour(int level) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0;
    SkillStub s(stub);
    return entry->hook->GetDivinityExp(s, level,
        Original<I32ParamMethod>(entry, StubHookType::GetDivinityExp));
}

extern "C" int GetDivinityLevelDetour(int level) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0;
    SkillStub s(stub);
    return entry->hook->GetDivinityLevel(s, level,
        Original<I32ParamMethod>(entry, StubHookType::GetDivinityLevel));
}

extern "C" int GetDescriptionDetour(void* skill, wchar_t* buf, int bufLen, wchar_t* defaultBuf,
    const void* tablePtr) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0;
    SkillStub s(stub);
    Skill sk(skill);
    return entry->hook->GetDescription(s, sk, buf, bufLen, defaultBuf, tablePtr,
        Original<DescriptionMethod>(entry, StubHookType::GetDescription));
}

extern "C" int GetIntroductionDetour(void* skill, wchar_t* buf, int bufLen, wchar_t* defaultBuf,
    const void* tablePtr) {
    void* stub = jd::base::ThisStub();
    auto* entry = jd::base::Find(stub);
    if (!entry || !entry->hook) return 0;
    SkillStub s(stub);
    Skill sk(skill);
    return entry->hook->GetIntroduction(s, sk, buf, bufLen, defaultBuf, tablePtr,
        Original<DescriptionMethod>(entry, StubHookType::GetIntroduction));
}
