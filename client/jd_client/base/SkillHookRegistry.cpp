#include "SkillHookRegistry.h"

#include "../core/Memory.h"
#include "../core/Module.h"
#include "layout/LayoutV1792.h"

#include <unordered_map>

namespace jd::base {

namespace {

using GetStubByIdFn = void*(__cdecl*)(int skillId);

std::unordered_map<std::size_t, HookEntry> g_table;

bool MaskHas(uint32_t mask, StubHookType type) {
    return (mask & (1u << static_cast<uint8_t>(type))) != 0;
}

std::size_t VtableWriteSlot(std::uintptr_t* vtable, std::size_t slot, std::size_t value) {
    const std::size_t original = vtable[slot];
    vtable[slot] = value;
    return original;
}

SkillStub GetStubBySkillId(int skillId) {
    static std::size_t funcAddr = 0;
    if (funcAddr == 0) {
        const std::size_t base = jd::core::Module::GetElementSkillBase();
        funcAddr = jd::core::Module::GetFunctionAddress(
            base, jd::layout::v1792::kGetStubByIdRva);
    }
    auto fn = reinterpret_cast<GetStubByIdFn>(funcAddr);
    return SkillStub(fn(skillId));
}

} // namespace

void SkillHookRegistry::RegisterImpl(std::unique_ptr<ISkillStubHook> hook, uint32_t overrideMask) {
    if (!hook) {
        return;
    }

    const int skillId = hook->SkillId();
    SkillStub stub = GetStubBySkillId(skillId);
    if (!stub.IsValid()) {
        return;
    }

    const std::size_t stubKey = reinterpret_cast<std::size_t>(stub.Raw());
    if (g_table.find(stubKey) != g_table.end()) {
        return;
    }

    hook->SetupStub(stub);

    HookEntry entry;
    entry.skillId = skillId;
    entry.stubPtr = stub.Raw();
    entry.hook = std::move(hook);

    const uint32_t mask = overrideMask;
    std::uintptr_t* vtable = stub.GetVtable();
    if (vtable) {
        const std::size_t vtableBytes =
            jd::layout::v1792::stub_vtable_slot::VTABLE_SIZE * sizeof(std::uintptr_t);
        jd::core::Memory::Protect(vtable, vtableBytes, true);

        for (std::size_t i = 0; i < kAllStubHookMethodsCount; ++i) {
            const StubHookType hookType = kAllStubHookMethods[i];
            if (!MaskHas(mask, hookType)) {
                continue;
            }
            const std::size_t slot = StubVtableSlot(hookType);
            if (slot == static_cast<std::size_t>(-1)) {
                continue;
            }
            const std::size_t detour = DetourAddress(hookType);
            if (detour == 0) {
                continue;
            }
            const std::size_t original =
                VtableWriteSlot(vtable, slot, detour);
            entry.stubOriginals[static_cast<std::size_t>(hookType)] = original;
        }
    }

    g_table.emplace(stubKey, std::move(entry));
}

HookEntry* SkillHookRegistry::GetEntry(std::size_t stubPtrKey) {
    auto it = g_table.find(stubPtrKey);
    if (it == g_table.end()) {
        return nullptr;
    }
    return &it->second;
}

} // namespace jd::base
