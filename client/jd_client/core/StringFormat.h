#pragma once

#include <cstdint>

namespace jd::core {

/// 对标 Rust snwprintf!：用游戏提供的 default_buf 作为格式串
int Snwprintf(wchar_t* buffer, int count, const wchar_t* format, ...);

} // namespace jd::core
