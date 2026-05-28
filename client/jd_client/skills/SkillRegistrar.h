#pragma once

namespace jd::skills {

using SkillRegisterFn = void (*)();

void DeferSkillRegistration(SkillRegisterFn fn);
void RegisterAllDeferredSkills();

} // namespace jd::skills
