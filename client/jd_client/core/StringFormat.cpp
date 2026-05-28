#include "StringFormat.h"

#include <cstdarg>
#include <cstdio>

namespace jd::core {

int Snwprintf(wchar_t* buffer, int count, const wchar_t* format, ...) {
    if (!buffer || count <= 0 || !format) {
        return 0;
    }
    va_list args;
    va_start(args, format);
    const int written =
        _vsnwprintf_s(buffer, static_cast<std::size_t>(count), static_cast<std::size_t>(count), format, args);
    va_end(args);
    return written;
}

} // namespace jd::core
