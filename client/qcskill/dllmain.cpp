#define MYLIBRARY_EXPORTS  // 在编译 DLL 时定义

#include <windows.h>
#include "dllmain.h"
#include <MinHook.h>
#include <iostream>
#include <cstring>  // for memcpy
#include <vector>   // for std::vector
#include "StringMemoryPool.h"
#include "QcSkillExt.cpp"

void MyExportedFunction() {
    MessageBoxA(NULL, "测试弹窗！", "完成", MB_OK | MB_ICONINFORMATION);
}

typedef void* (__cdecl* SkillFuncType)(int id);
SkillFuncType g_originalFunc = nullptr;

// 存储复制的结构体指针，用于后续释放
static std::vector<void*> g_copiedStructs;

void* __cdecl MySkillHook(int id)
{
    void* result = g_originalFunc(id);
    if (!result) {
        return result;
    }

    switch (id)
    {
        case 220: // 你可以根据需要改成别的 ID
        {
            // 估算结构体大小：patch220 修改了索引 95 的字段，所以至少需要 96 个指针大小
            // 为了安全，我们分配 200 个指针大小的空间
            const size_t structSize = 200 * sizeof(void*);

            // 分配新内存用于复制结构体
            void* copiedResult = VirtualAlloc(NULL, structSize, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
            if (copiedResult) {
                // 复制原始结构体数据
                memcpy(copiedResult, result, structSize);

                // 在副本上应用修改
                QcSkillExt::patch220(copiedResult);

                // 保存副本指针以便后续释放（如果需要）
                //g_copiedStructs.push_back(copiedResult);

                // 返回修改后的副本给 hook 程序使用
                return copiedResult;
            }
            // 如果分配失败，回退到直接修改原始 result
            QcSkillExt::patch220(result);
            break;
        }
    }

    return result;
}


// 安装 Hook（由 DllMain 调用）
void HookFunction(HMODULE hTargetModule)
{
    void* targetFunc = reinterpret_cast<void*>((uintptr_t)hTargetModule + 0x1630);

    if (MH_Initialize() != MH_OK) {
        MessageBoxA(NULL, "MH_Initialize 失败！", "错误", MB_ICONERROR);
        return;
    }

    if (MH_CreateHook(targetFunc, &MySkillHook, reinterpret_cast<void**>(&g_originalFunc)) != MH_OK) {
        MessageBoxA(NULL, "MH_CreateHook 失败！", "错误", MB_ICONERROR);
        return;
    }

    if (MH_EnableHook(targetFunc) != MH_OK) {
        MessageBoxA(NULL, "MH_EnableHook 失败！", "错误", MB_ICONERROR);
        return;
    }

    MessageBoxA(NULL, "Hook 安装成功！", "成功", MB_OK | MB_ICONINFORMATION);
}


void UnhookFunction()
{
    // 禁用钩子
    if (MH_DisableHook(&MessageBoxW) != MH_OK) {
        // 错误处理
        return;
    }

    // 释放所有复制的结构体
    for (size_t i = 0; i < g_copiedStructs.size(); ++i) {
        VirtualFree(g_copiedStructs[i], 0, MEM_RELEASE);
    }
    g_copiedStructs.clear();

    // 清理 MinHook
    MH_Uninitialize();
    // 清理字符串池内存
    StringMemoryPool::FreeAll();
}


BOOL APIENTRY DllMain(HMODULE hModule, DWORD reason, LPVOID lpReserved) {
    if (reason == DLL_PROCESS_ATTACH) {
        MessageBoxA(NULL, "qcskill.dll 注入成功！", "DLL 注入", MB_OK | MB_ICONINFORMATION);

        // 等待目标模块加载（比如 user32.dll，实际你可以改成你目标 DLL）
        HMODULE hTarget = NULL;
        while (!(hTarget = GetModuleHandleA("elementskill.dll"))) {
            Sleep(100);
        }

        MessageBoxA(NULL, "找到 elementskill.dll，准备 Hook", "注入进展", MB_OK | MB_ICONINFORMATION);
        HookFunction(hTarget);
    }

    if (reason == DLL_PROCESS_DETACH) {
        UnhookFunction();
    }

    return TRUE;
}
