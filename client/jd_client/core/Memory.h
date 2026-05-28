#pragma once

#include <cstddef>
#include <cstdint>

namespace jd::core {

class Memory {
public:
    static bool Protect(void* address, std::size_t size, bool writable);

    /// 分配游戏可读 ANSI 字符串（系统代码页），调用方不释放（与 Rust forget 一致）
    static char* AllocAnsiString(const char* utf8);
};

} // namespace jd::core
