#include "Memory.h"

#include <Windows.h>
#include <cstring>
#include <vector>

namespace jd::core {

bool Memory::Protect(void* address, std::size_t size, bool writable) {
    if (!address || size == 0) {
        return false;
    }
    DWORD oldProtect = 0;
    const DWORD prot = writable ? PAGE_READWRITE : PAGE_READONLY;
    return VirtualProtect(address, size, prot, &oldProtect) != 0;
}

char* Memory::AllocAnsiString(const char* utf8) {
    if (!utf8) {
        utf8 = "";
    }

    int wideLen = MultiByteToWideChar(CP_UTF8, 0, utf8, -1, nullptr, 0);
    if (wideLen <= 0) {
        return nullptr;
    }
    std::vector<wchar_t> wide(static_cast<std::size_t>(wideLen));
    MultiByteToWideChar(CP_UTF8, 0, utf8, -1, wide.data(), wideLen);

    int ansiLen = WideCharToMultiByte(CP_ACP, 0, wide.data(), -1, nullptr, 0, nullptr, nullptr);
    if (ansiLen <= 0) {
        return nullptr;
    }

    char* buf = static_cast<char*>(VirtualAlloc(nullptr, static_cast<std::size_t>(ansiLen),
        MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE));
    if (!buf) {
        return nullptr;
    }
    WideCharToMultiByte(CP_ACP, 0, wide.data(), -1, buf, ansiLen, nullptr, nullptr);
    return buf;
}

} // namespace jd::core
