#pragma once

#include <cstddef>

namespace jd::core {

class Module {
public:
    static std::size_t GetElementSkillBase();
    static std::size_t GetFunctionAddress(std::size_t base, std::size_t rva);
};

} // namespace jd::core
