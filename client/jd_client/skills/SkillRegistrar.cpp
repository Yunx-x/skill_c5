#include "SkillRegistrar.h"

#include <vector>

namespace jd::skills {

namespace {

std::vector<SkillRegisterFn>& DeferredRegistrations() {
    static std::vector<SkillRegisterFn> fns;
    return fns;
}

} // namespace

void DeferSkillRegistration(SkillRegisterFn fn) {
    if (fn) {
        DeferredRegistrations().push_back(fn);
    }
}

void RegisterAllDeferredSkills() {
    for (SkillRegisterFn fn : DeferredRegistrations()) {
        fn();
    }
}

} // namespace jd::skills
