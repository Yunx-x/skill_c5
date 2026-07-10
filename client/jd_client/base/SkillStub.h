#pragma once

#include <cstddef>
#include <cstdint>

namespace jd::base {

class SkillStub {
public:
    explicit SkillStub(void* ptr = nullptr) : ptr_(ptr) {}

    void* Raw() const { return ptr_; }
    bool IsValid() const { return ptr_ != nullptr; }

    std::uintptr_t* GetVtable() const;

    void WriteI32(std::size_t offset, int32_t value) const;
    void WriteU8(std::size_t offset, uint8_t value) const;
    void WriteByte(std::size_t offset, int8_t value) const;

    void SetType(int8_t v) const { WriteByte(0x38, v); }
    void SetRangeType(uint8_t v) const { WriteU8(0x3B, v); }
    
    void SetOccupation(int32_t v) const { WriteI32(0x08, v); }
    void SetSkillClass(int32_t v) const { WriteI32(0x156, v); }

    void SetMaxLevel(int32_t v) const { WriteI32(0x0C, v); }
    void SetMaxLearn(int32_t v) const { WriteI32(0x10, v); }

    void SetIcon(const char* icon) const;
    void SetAction(std::size_t index, const char* actionName) const;


private:
    void* ptr_;
};

} // namespace jd::base
