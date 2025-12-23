#pragma once
#include <Windows.h>
#include <vector>
#include <cstring>  // for strlen, memcpy

class StringMemoryPool {
public:
    static char* AllocString(const char* str) {
        size_t len = strlen(str) + 1;
        char* mem = (char*)VirtualAlloc(NULL, len, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
        if (mem) {
            memcpy(mem, str, len);
            allocations.push_back(mem);
        }
        return mem;
    }

    static void FreeAll() {
        for (size_t i = 0; i < allocations.size(); ++i) {
            VirtualFree(allocations[i], 0, MEM_RELEASE);
        }
        allocations.clear();
    }

private:
    static std::vector<char*> allocations;
};
