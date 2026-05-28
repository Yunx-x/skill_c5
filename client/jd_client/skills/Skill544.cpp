/// 544 / 5440 — 天机印
#include "SkillEntry.h"

class Skill544 : public jd::skills::SkillBase<Skill544> {
public:
    Skill544() : SkillBase(544) {}

    void SetupStub(jd::base::SkillStub& stub) override {
        stub.SetRangeType(5);
        stub.SetIcon("天机印群.dds");
        for (int i = 0; i <= 6; ++i) {
            stub.SetAction(static_cast<std::size_t>(i), "青云门_天机印_新");
        }
        for (int i = 19; i <= 25; ++i) {
            stub.SetAction(static_cast<std::size_t>(i), "青云门_骑乘_天机印_新");
        }
    }

    int GetDescription(jd::base::SkillStub& /*stub*/, jd::base::Skill& skill, wchar_t* buf, int bufLen,
        wchar_t* defaultBuf, const void* /*tablePtr*/,
        jd::base::DescriptionMethod /*original*/) override {
        const int level = skill.GetLevel();
        const int duration = 4 * level;
        const int mpAtk = 2 * level;
        return jd::core::Snwprintf(buf, bufLen, defaultBuf, duration, mpAtk);
    }
};
