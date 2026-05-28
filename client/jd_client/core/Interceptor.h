#pragma once

#include <cstddef>

namespace jd::core {

/// 函数级 inline hook（对标 Rust jd_core::Interceptor / retour）
class Interceptor {
public:
    /// @return trampoline 地址，用于调用原函数；失败返回 0
    static std::size_t Replace(std::size_t functionAddress, void* replacement);

    static bool Revert(std::size_t functionAddress);
    static void Shutdown();
};

} // namespace jd::core
