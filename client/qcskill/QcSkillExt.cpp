#include "StringMemoryPool.h"
#include <MinHook.h>
#include <cstdio> // 用于 printf
#include <ctime>

class QcSkillExt {

private:
    // 替换结构体中第 N 个字段为字符串（N 是以指针为单位的偏移）
    static inline void ReplaceStructFieldString(void* base, size_t fieldIndex, const char* newValue) {
        char* newStr = StringMemoryPool::AllocString(newValue);
        if (!newStr) return;

        uintptr_t* fieldAddr = reinterpret_cast<uintptr_t*>((uintptr_t)base + fieldIndex * sizeof(void*));
        *fieldAddr = reinterpret_cast<uintptr_t>(newStr);
    }

    static void LogToFile(const char* message) {
        const char* logFilePath = "C:\\qcskill_log.txt";

        // 拼接完整日志内容
        char finalMsg[1024];
        snprintf(finalMsg, sizeof(finalMsg), "%s\r\n",  message);

        // 打开文件并追加写入
        HANDLE hFile = CreateFileA(
            logFilePath,
            FILE_APPEND_DATA,
            FILE_SHARE_READ,
            NULL,
            OPEN_ALWAYS,
            FILE_ATTRIBUTE_NORMAL,
            NULL
        );

        if (hFile != INVALID_HANDLE_VALUE) {
            DWORD bytesWritten;
            WriteFile(hFile, finalMsg, (DWORD)strlen(finalMsg), &bytesWritten, NULL);
            CloseHandle(hFile);
        }
    }

    static inline void PatchStructField(void* base, size_t fieldIndex, const char* newValue) {
        char* newStr = StringMemoryPool::AllocString(newValue);
        if (!newStr) return;

        void** targetPtr = reinterpret_cast<void**>((uintptr_t)base + fieldIndex * sizeof(void*));
        const char* oldStr = reinterpret_cast<const char*>(*targetPtr);

        *targetPtr = reinterpret_cast<void*>(newStr);

        // 日志记录
        char logMsg[512];
        snprintf(logMsg, sizeof(logMsg),
            "PatchStructField: 替换字段 [%zu], 原始值: \"%s\", 新值: \"%s\"",
            fieldIndex,
            oldStr ? oldStr : "NULL",
            newValue);
        LogToFile(logMsg);
    }


public:
	static void patch220(void* address) {
        PatchStructField(address, 95, "青云冰刺.dds");
        PatchStructField(address, 15, "青云门_霜极刑冰错");
        PatchStructField(address, 16, "青云门_霜极刑冰错");
        PatchStructField(address, 17, "青云门_霜极刑冰错");
        PatchStructField(address, 18, "青云门_霜极刑冰错");
        PatchStructField(address, 19, "青云门_霜极刑冰错");
        PatchStructField(address, 20, "青云门_霜极刑冰错");
	}
};
