#include "jd_client_exports.h"
#include "skills/SkillsAttach.h"

#include "core/Interceptor.h"
#include "core/Module.h"

#include <Windows.h>

namespace {

HANDLE g_initThread = nullptr;

DWORD WINAPI InitThread(LPVOID) {
    jd::core::Module::GetElementSkillBase();
    jd::skills::AttachAll();
    OutputDebugStringA("[jd_client] v1792 hooks attached\n");
    return 0;
}

} // namespace

extern "C" JD_API void MyExportedFunction() {
    // 仅占位：供加载器确认 DLL 已映射；技能 Hook 由 DllMain 安装
}

BOOL APIENTRY DllMain(HMODULE module, DWORD reason, LPVOID reserved) {
    switch (reason) {
    case DLL_PROCESS_ATTACH:
        DisableThreadLibraryCalls(module);
        g_initThread = CreateThread(nullptr, 0, InitThread, nullptr, 0, nullptr);
        break;
    case DLL_PROCESS_DETACH:
        if (reserved == nullptr) {
            if (g_initThread) {
                WaitForSingleObject(g_initThread, 5000);
                CloseHandle(g_initThread);
                g_initThread = nullptr;
            }
            jd::core::Interceptor::Shutdown();
        }
        break;
    }
    return TRUE;
}
