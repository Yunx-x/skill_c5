#include "SkillsAttach.h"

#include "SkillRegistrar.h"

namespace jd::skills {

void AttachAll() {
    RegisterAllDeferredSkills();
}

} // namespace jd::skills
