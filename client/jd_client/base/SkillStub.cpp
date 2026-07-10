#include "SkillStub.h"

#include "layout/LayoutV1792.h"
#include "../core/Memory.h"

#include <cstring>

namespace jd::base {

std::uintptr_t* SkillStub::GetVtable() const {
    if (!ptr_) {
        return nullptr;
    }
    return *reinterpret_cast<std::uintptr_t**>(ptr_);
}

void SkillStub::WriteI32(std::size_t offset, int32_t value) const {
    if (!ptr_) {
        return;
    }
    *reinterpret_cast<int32_t*>(reinterpret_cast<std::uint8_t*>(ptr_) + offset) = value;
}

void SkillStub::WriteU8(std::size_t offset, uint8_t value) const {
    if (!ptr_) {
        return;
    }
    *reinterpret_cast<uint8_t*>(reinterpret_cast<std::uint8_t*>(ptr_) + offset) = value;
}

void SkillStub::WriteByte(std::size_t offset, int8_t value) const {
    if (!ptr_) {
        return;
    }
    *reinterpret_cast<int8_t*>(reinterpret_cast<std::uint8_t*>(ptr_) + offset) = value;
}

void SkillStub::SetIcon(const char* icon) const {
    char* p = jd::core::Memory::AllocAnsiString(icon);
    if (!p) {
        return;
    }
    *reinterpret_cast<char**>(reinterpret_cast<std::uint8_t*>(ptr_) +
        jd::layout::v1792::skill_stub::ICON) = p;
}

void SkillStub::SetAction(std::size_t index, const char* actionName) const {
    char* p = jd::core::Memory::AllocAnsiString(actionName);
    if (!p) {
        return;
    }
    const std::size_t offset =
        jd::layout::v1792::skill_stub::ACTION + index * sizeof(void*);
    *reinterpret_cast<char**>(reinterpret_cast<std::uint8_t*>(ptr_) + offset) = p;
}

} // namespace jd::base
