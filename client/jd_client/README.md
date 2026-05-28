# jd_client (C++ / v1792)

诛仙客户端技能 Hook 框架，对应 Rust 项目 `jd-client` 的 **v1792** 单版本移植。

## Hook 两层（与 Rust 一致）

| 层级 | Rust | C++ | 作用 |
|------|------|-----|------|
| **函数级 detour** | `retour::RawDetour` | **MinHook** (`core/Interceptor`) | 整段替换 `elementclient` / `elementskill` 里的函数（如 `jd_features`） |
| **技能 vtable** | 写入 stub 虚表槽位 | 直接改 vtable 指针（`SkillHookRegistry`） | 每个技能 stub 的 `GetCastdistance` 等；**不需要** MinHook |

技能 detour（`GetCastdistanceDetour` 等）是 **固定的跳板函数**，注册时写进 stub 的 vtable；游戏调用虚函数 → 进 detour → 查表 → 你的 `ISkillStubHook` 实现。

## 构建

- 平台：**Win32**（与 Rust `i686-win7-windows-msvc` 一致）
- 配置：Release
- 依赖：复用 `../qcskill/MinHook`

## 扩展技能

1. 在 `skills/` 下新建一个 `.cpp`（**不需要 .h**），`#include "SkillEntry.h"`。
2. 继承 `jd::skills::SkillBase<你的类名>`，构造函数里传入技能 ID，按需 `override`。
3. 把新 `.cpp` 加入 `jd_client.vcxproj`。**不用改** `SkillsAttach.cpp`（链接时自动登记）。

示例：

```cpp
#include "SkillEntry.h"

class Skill544 : public jd::skills::SkillBase<Skill544> {
public:
    Skill544() : SkillBase(544) {}

    void SetupStub(jd::base::SkillStub& stub) override { ... }
    int GetDescription(...) override { ... }
};
```

`SkillBase<Skill544>` 里的 `Skill544` 用于自动注册；技能 ID 写在 `SkillBase(544)` 里。  
`override` 了哪些虚函数，就自动 hook 哪些 vtable 槽。
