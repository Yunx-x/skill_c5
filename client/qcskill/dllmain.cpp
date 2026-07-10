#define MYLIBRARY_EXPORTS

#include <windows.h>
#include "dllmain.h"
#include <MinHook.h>
#include <cstring>
#include <vector>
#include "StringMemoryPool.h"
#include "QcSkillExt.h"

namespace {

constexpr char kTargetModuleName[] = "elementskill.dll";
constexpr uintptr_t kTargetFuncRva = 0x1630;
constexpr DWORD kModuleWaitTimeoutMs = 60000;

typedef void* (__cdecl* SkillFuncType)(int);
SkillFuncType g_originalFunc = nullptr;
void* g_targetFunc = nullptr;
bool g_hookInstalled = false;
HANDLE g_initThread = nullptr;

std::vector<void*> g_copiedStructs;

void LogDebug(const char* msg) {
    OutputDebugStringA("[qcskill] ");
    OutputDebugStringA(msg);
    OutputDebugStringA("\n");
}

#ifdef _DEBUG
void NotifyUser(const char* text, const char* title) {
    MessageBoxA(NULL, text, title, MB_OK | MB_ICONINFORMATION);
}
#else
void NotifyUser(const char* text, const char* /*title*/) {
    LogDebug(text);
}
#endif

HMODULE WaitForModule(const char* name, DWORD timeoutMs) {
    for (DWORD elapsed = 0; elapsed < timeoutMs; elapsed += 100) {
        if (HMODULE mod = GetModuleHandleA(name)) {
            return mod;
        }
        Sleep(100);
    }
    return nullptr;
}

void* CopyAndPatch(void* src, void (*patchFn)(void*)) {
    const size_t structSize = QcSkillExt::GetStructCopySize();
    void* copy = VirtualAlloc(nullptr, structSize, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
    if (!copy) {
        LogDebug("VirtualAlloc failed for struct copy");
        return nullptr;
    }
    memcpy(copy, src, structSize);
    patchFn(copy);
    g_copiedStructs.push_back(copy);
    return copy;
}

void* __cdecl MySkillHook(int id) {
    void* result = g_originalFunc(id);
    if (!result) {
        return nullptr;
    }

    switch (id) {
    case 220: {
        void* patched = CopyAndPatch(result, QcSkillExt::patch220);
        if (patched) {
            return patched;
        }
        LogDebug("skill 220: copy failed, returning unmodified original");
        return result;
    }
    default:
        return result;
    }
}

bool HookFunction(HMODULE hTargetModule) {
    g_targetFunc = reinterpret_cast<void*>((uintptr_t)hTargetModule + kTargetFuncRva);

    if (MH_Initialize() != MH_OK) {
        LogDebug("MH_Initialize failed");
        return false;
    }

    if (MH_CreateHook(g_targetFunc, &MySkillHook, reinterpret_cast<void**>(&g_originalFunc)) != MH_OK) {
        LogDebug("MH_CreateHook failed");
        MH_Uninitialize();
        g_targetFunc = nullptr;
        return false;
    }

    if (MH_EnableHook(g_targetFunc) != MH_OK) {
        LogDebug("MH_EnableHook failed");
        MH_RemoveHook(g_targetFunc);
        MH_Uninitialize();
        g_targetFunc = nullptr;
        g_originalFunc = nullptr;
        return false;
    }

    g_hookInstalled = true;
    NotifyUser("Hook 安装成功", "qcskill");
    return true;
}

void UnhookFunction() {
    if (g_hookInstalled && g_targetFunc) {
        MH_DisableHook(g_targetFunc);
        MH_RemoveHook(g_targetFunc);
        g_hookInstalled = false;
    }

    for (void* p : g_copiedStructs) {
        VirtualFree(p, 0, MEM_RELEASE);
    }
    g_copiedStructs.clear();

    if (g_targetFunc) {
        MH_Uninitialize();
        g_targetFunc = nullptr;
    }

    StringMemoryPool::FreeAll();
    g_originalFunc = nullptr;
}

DWORD WINAPI InitThread(LPVOID /*param*/) {
    HMODULE hTarget = WaitForModule(kTargetModuleName, kModuleWaitTimeoutMs);
    if (!hTarget) {
        LogDebug("等待 elementskill.dll 超时");
        return 1;
    }

    LogDebug("已加载 elementskill.dll，开始安装 Hook");
    if (!HookFunction(hTarget)) {
        return 1;
    }
    return 0;
}

} // namespace

void MyExportedFunction() {
    MessageBoxA(NULL, "测试弹窗！", "完成", MB_OK | MB_ICONINFORMATION);
}

BOOL APIENTRY DllMain(HMODULE hModule, DWORD reason, LPVOID lpReserved) {
    switch (reason) {
    case DLL_PROCESS_ATTACH:
        DisableThreadLibraryCalls(hModule);
        g_initThread = CreateThread(nullptr, 0, InitThread, nullptr, 0, nullptr);
        if (!g_initThread) {
            LogDebug("CreateThread 失败");
        }
        break;

    case DLL_PROCESS_DETACH:
        // lpReserved != NULL 表示进程正在退出，跳过清理
        if (lpReserved == nullptr) {
            if (g_initThread) {
                WaitForSingleObject(g_initThread, 5000);
                CloseHandle(g_initThread);
                g_initThread = nullptr;
            }
            UnhookFunction();
        }
        break;
    }
    return TRUE;
}
