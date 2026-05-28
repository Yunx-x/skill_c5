/// 2292 / 22920 — 霜极刑冰错
#include "SkillEntry.h"

class Skill2292 : public jd::skills::SkillBase<Skill2292> {
public:
    Skill2292() : SkillBase(230) {}

    void SetupStub(jd::base::SkillStub& stub) override {
        stub.SetRangeType(2);
        stub.SetIcon("青云冰刺.dds");
        for (int i = 0; i <= 6; ++i) {
            stub.SetAction(static_cast<std::size_t>(i), "青云门_霜极刑冰错");
        }
        for (int i = 19; i <= 25; ++i) {
            stub.SetAction(static_cast<std::size_t>(i), "青云门_骑乘_霜极刑冰错");
        }
    }
};
