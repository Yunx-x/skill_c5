#pragma once

#include <cstdint>

namespace jd::base {

class Skill {
public:
    explicit Skill(void* ptr = nullptr) : ptr_(ptr) {}

    void* Raw() const { return ptr_; }

    int32_t GetLevel() const;

private:
    void* ptr_;
};

} // namespace jd::base
