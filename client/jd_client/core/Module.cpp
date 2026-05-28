#include "Module.h"

#include <Windows.h>

namespace jd::core {

static std::size_t g_elementSkillBase = 0;

std::size_t Module::GetElementSkillBase() {
    if (g_elementSkillBase != 0) {
        return g_elementSkillBase;
    }
    for (;;) {
        HMODULE mod = GetModuleHandleW(L"elementskill.dll");
        if (mod) {
            g_elementSkillBase = reinterpret_cast<std::size_t>(mod);
            return g_elementSkillBase;
        }
        Sleep(100);
    }
}

std::size_t Module::GetFunctionAddress(std::size_t base, std::size_t rva) {
    return base + rva;
}

} // namespace jd::core
