#include "Interceptor.h"

#include <MinHook.h>
#include <unordered_map>

namespace jd::core {

namespace {

struct HookEntry {
    void* target = nullptr;
    void* detour = nullptr;
    void* trampoline = nullptr;
};

std::unordered_map<std::size_t, HookEntry> g_hooks;
bool g_mhInit = false;

} // namespace

std::size_t Interceptor::Replace(std::size_t functionAddress, void* replacement) {
    if (functionAddress == 0 || replacement == nullptr) {
        return 0;
    }

    Revert(functionAddress);

    if (!g_mhInit) {
        if (MH_Initialize() != MH_OK) {
            return 0;
        }
        g_mhInit = true;
    }

    void* target = reinterpret_cast<void*>(functionAddress);
    if (MH_CreateHook(target, replacement, &g_hooks[functionAddress].trampoline) != MH_OK) {
        g_hooks.erase(functionAddress);
        return 0;
    }
    if (MH_EnableHook(target) != MH_OK) {
        MH_RemoveHook(target);
        g_hooks.erase(functionAddress);
        return 0;
    }

    HookEntry& e = g_hooks[functionAddress];
    e.target = target;
    e.detour = replacement;
    return reinterpret_cast<std::size_t>(e.trampoline);
}

bool Interceptor::Revert(std::size_t functionAddress) {
    auto it = g_hooks.find(functionAddress);
    if (it == g_hooks.end()) {
        return false;
    }
    void* target = it->second.target;
    if (target) {
        MH_DisableHook(target);
        MH_RemoveHook(target);
    }
    g_hooks.erase(it);
    return true;
}

void Interceptor::Shutdown() {
    for (auto& kv : g_hooks) {
        if (kv.second.target) {
            MH_DisableHook(kv.second.target);
            MH_RemoveHook(kv.second.target);
        }
    }
    g_hooks.clear();
    if (g_mhInit) {
        MH_Uninitialize();
        g_mhInit = false;
    }
}

} // namespace jd::core
