#include "QcSkillExt.h"
#include "StringMemoryPool.h"
#include <cstdio>
#include <cstring>

class QcSkillExtImpl {
private:
    static void LogToFile(const char* message) {
        const char* logFilePath = "C:\\qcskill_log.txt";
        char finalMsg[1024];
        snprintf(finalMsg, sizeof(finalMsg), "%s\r\n", message);

        HANDLE hFile = CreateFileA(
            logFilePath,
            FILE_APPEND_DATA,
            FILE_SHARE_READ,
            NULL,
            OPEN_ALWAYS,
            FILE_ATTRIBUTE_NORMAL,
            NULL);

        if (hFile != INVALID_HANDLE_VALUE) {
            DWORD bytesWritten;
            WriteFile(hFile, finalMsg, (DWORD)strlen(finalMsg), &bytesWritten, NULL);
            CloseHandle(hFile);
        }
    }

    static void PatchStructField(void* base, size_t fieldIndex, const char* newValue) {
        char* newStr = StringMemoryPool::AllocString(newValue);
        if (!newStr) return;

        void** targetPtr = reinterpret_cast<void**>(
            reinterpret_cast<uintptr_t>(base) + fieldIndex * sizeof(void*));
        const char* oldStr = reinterpret_cast<const char*>(*targetPtr);
        *targetPtr = newStr;

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

void QcSkillExt::patch220(void* address) {
    QcSkillExtImpl::patch220(address);
}
