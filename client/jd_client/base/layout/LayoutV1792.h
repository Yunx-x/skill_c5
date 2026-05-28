#pragma once

#include <cstddef>

namespace jd::layout::v1792 {

// SkillStub 虚函数表槽位（与 Rust layout.rs stub_vtable_slot 一致）
namespace stub_vtable_slot {
    constexpr std::size_t GET_REQUIRED_LEVEL = 4;
    constexpr std::size_t GET_ATTACK_DISTANCE = 7;
    constexpr std::size_t GET_CAST_DISTANCE = 10;
    constexpr std::size_t GET_EFFECT_DISTANCE = 11;
    constexpr std::size_t GET_PRAY_DISTANCE = 9;
    constexpr std::size_t GET_DESCRIPTION = 16;
    constexpr std::size_t GET_INTRODUCTION = 17;
    constexpr std::size_t GET_PRE_SKILL_ID = 28;
    constexpr std::size_t GET_PRE_SKILL_SP = 29;
    constexpr std::size_t GET_DIVINITY_EXP = 26;
    constexpr std::size_t GET_DIVINITY_LEVEL = 27;
    constexpr std::size_t VTABLE_SIZE = 30;
}

// SkillStub 字段偏移（与 Rust skill_stub_offsets 一致）
namespace skill_stub {
    constexpr std::size_t OCCUPATION = 0x08;
    constexpr std::size_t MAXLEVEL = 0x0C;
    constexpr std::size_t MAXLEARN = 0x10;
    constexpr std::size_t RANGETYPE = 0x3B;
    constexpr std::size_t ACTION = 0x3C;
    constexpr std::size_t SKILL_CLASS = 0x156;
    constexpr std::size_t ICON = 0x17C;
    constexpr std::size_t TOTAL_SIZE = 0x312;
}

// elementskill.dll：按 ID 取 SkillStub*（Rust v1792 get_stub）
constexpr std::size_t kGetStubByIdRva = 0x1630;

} // namespace jd::layout::v1792
