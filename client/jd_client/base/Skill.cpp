#include "Skill.h"

namespace jd::base {

int32_t Skill::GetLevel() const {
    if (!ptr_) {
        return 0;
    }
    auto* vtable = *reinterpret_cast<std::uintptr_t**>(ptr_);
    if (!vtable) {
        return 0;
    }
    // Skill 虚表第 21 项：GetLevel（与 Rust skill.rs 一致）
    using GetLevelFn = int(__thiscall*)(void* skill);
    auto fn = reinterpret_cast<GetLevelFn>(vtable[21]);
    return fn(ptr_);
}

} // namespace jd::base
