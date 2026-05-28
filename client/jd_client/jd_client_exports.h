#pragma once

#ifdef JD_CLIENT_EXPORTS
#define JD_API __declspec(dllexport)
#else
#define JD_API __declspec(dllimport)
#endif

extern "C" {
/// 供外部加载器 GetProcAddress / 注入器调用的占位导出；Hook 在 DllMain 中完成
JD_API void MyExportedFunction();
}
