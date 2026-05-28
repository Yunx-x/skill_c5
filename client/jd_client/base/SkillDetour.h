#pragma once

// 由游戏以 __thiscall 调用；实现为 __cdecl，入口用 ECX 取 stub（this 指针）
extern "C" {
float GetAttackdistanceDetour(void* skill);
float GetCastdistanceDetour(void* skill);
float GetEffectdistanceDetour(void* skill);
float GetPraydistanceDetour(void* skill);
int GetRequiredLevelDetour(int level);
int GetPreSkillIDDetour(int index);
int GetPreSkillSPDetour(int index);
int GetDivinityExpDetour(int level);
int GetDivinityLevelDetour(int level);
int GetDescriptionDetour(void* skill, wchar_t* buf, int bufLen, wchar_t* defaultBuf,
    const void* tablePtr);
int GetIntroductionDetour(void* skill, wchar_t* buf, int bufLen, wchar_t* defaultBuf,
    const void* tablePtr);
}
