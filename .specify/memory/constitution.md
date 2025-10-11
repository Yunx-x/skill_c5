# 技能代码生成规范

**版本**: 2.0 | **批准日期**: 2025-10-11 | **最后修改**: 2025-10-11

---

## 1. 基础框架要求

### 1.1 类结构
- 每个技能类继承 `BaseHookSkillStub`
- 类名格式：`Skill{技能ID}`
- 构造函数中传入正确的技能ID

### 1.2 示例结构
```typescript
class Skill223 extends BaseHookSkillStub {
    constructor() {
        super(223);
    }
    
    // 功能函数...
}
```

---

## 2. 技能ID获取规则

- 从 `1792skillstr.txt` 文件中查找对应技能的ID
- **重要**：文件中的技能ID末尾会有 0、1、2、3 等数字后缀，**必须清除**
- 示例：`2230` → `223`（寒冰咒）

---

## 3. 注释格式规范

### 3.1 结构
```typescript
/**
 * {技能ID} {技能名称}   {最大等级}
 * {技能描述第一句}
 * {技能描述第二句}
 * ...
 */
```

### 3.2 描述换行规则
- 遇到**句号（。）**时进行换行
- 保持格式清晰易读
- 特殊标注用 `@未实现` 标记未完成功能

### 3.3 标点符号规范
**所有英文标点符号必须替换为中文标点符号：**
- 英文逗号 `,` → 中文逗号 `，`
- 英文括号 `()` → 中文括号 `（）`
- 英文冒号 `:` → 中文冒号 `：`
- 英文分号 `;` → 中文分号 `；`

---

## 4. 技能冷却时间实现

### 4.1 固定冷却时间
```typescript
GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    return 2000;  // 单位：毫秒
}
```

### 4.2 等级相关冷却时间
```typescript
// 冷却时间随等级递减
GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
    return 130000 - skill.GetLevel() * 10000;
}
```

### 4.3 被动技能
- 被动技能无需实现 `GetCooldowntime` 函数

---

## 5. 数值计算规范

### 5.1 避免小数
- 优先使用整数增长值
- 如果原始计算产生小数（如 53.625），调整基础值使每级增长为整数
- 确保满级数值100%准确

### 5.2 公式格式
**标准格式**：直接使用等级，不用 `(等级-1)`

```typescript
// ✅ 推荐
skill.SetPlus(57 + skill.GetLevel() * 11);

// ❌ 不推荐
skill.SetPlus(68 + (skill.GetLevel() - 1) * 11);
```

### 5.3 计算步骤
假设技能：附加468/897点攻击力，最大等级9

1. **计算总增长**：897 - 468 = 429
2. **计算等级差**：9 - 1 = 8
3. **计算每级增长**：429 ÷ 8 = 53.625（有小数）
4. **向上取整**：每级增长 = 54
5. **调整基础值**：897 - 8×54 = 465
6. **最终公式**：`465 + 等级 * 54`
7. **验证**：1级=465+54=519，9级=465+486=897 ✓

### 5.4 数值验证
- 必须验证1级和满级的数值准确性
- 允许1级有±5以内的偏差
- 满级数值必须100%准确

---

## 6. 完整示例

```typescript
/**
 * 222 御剑诀   9
 * 真气贯穿+1（真气大于95%时追加本体攻击力4%）
 * 单体攻击10.7米，施法时间1秒，技能冷却6秒。
 * 攻击目标1次，每击附加68/156点攻击力。
 */
class Skill222 extends BaseHookSkillStub {

    constructor() {
        super(222);
    }

    GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 6000;
    }

    Calculate2(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): void {
        const player = skill.GetPlayerNice();

        const mp = player.GetMp();
        const maxmp = player.GetMaxmp();

        if (mp / maxmp > 0.95) {
            skill.SetRatio(1 + 0.04);
        }

        skill.SetPlus(57 + skill.GetLevel() * 11);

        player.SetPerform(1);
    }

    BlessMe(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        const player = skill.GetPlayerNice();
        player.SetUniqprompt(1);
        return true;
    }
}
```

---

## 7. 代码风格规范

### 7.1 格式化
- 使用空格分隔运算符：`等级 * 11` 而非 `等级*11`
- 函数参数逗号后加空格：`SetFrozen(40, 1, 3000, 1)`
- 保持一致的缩进（4个空格）

### 7.2 变量命名
- 使用有意义的变量名
- 常用变量：`player`、`level`、`mp`、`maxmp`

### 7.3 注释
- 复杂逻辑添加中文注释
- 未实现功能用注释标记：`// @未实现`

---

## 8. 常用函数参考

### 8.1 攻击力相关
- `skill.SetPlus(value)` - 设置附加攻击力
- `skill.SetRatio(ratio)` - 设置攻击力倍率
- `player.SetPerform(value)` - 设置施法动作

### 8.2 冷却与施法时间
- `GetCooldowntime()` - 获取技能冷却时间（毫秒）
- `GetExecutetime()` - 获取技能施法时间（毫秒）
- `GetTime1()` - 获取技能前摇时间（毫秒）
- `GetTime2()` - 获取技能后摇时间（毫秒）

### 8.3 状态效果（目标）
- `player.SetFrozen(prob, flag, time, buffid)` - 冰冻效果
- `player.SetSlow(target, ratio, time, buffid)` - 减速效果
- `player.SetRepel(prob, distance)` - 击退效果
- `player.SetDrainmagic(prob, ratio)` - 减少真气

### 8.4 状态效果（自身）
- `player.SetAddspeed(prob, time, value, buffid)` - 增加移动速度
- `player.SetIncmpgen(ratio, time, buffid)` - 增加真气回复速度
- `player.SetMagicshield(ratio, maxValue, time)` - 魔法护盾（吸收伤害）
- `player.SetIncdefence(prob, time, ratio, buffid)` - 增加防御
- `player.SetAddattack(prob, time, value, buffid)` - 增加攻击力
- `player.SetMpgen(prob, time, regen, amount, buffid)` - 真气回复
- `player.SetDodge(time, prob)` - 闪避效果

### 8.5 被动效果
- `player.SetPasincmpgen(ratio)` - 永久增加真气回复速度
- `player.SetPasaddanti(value)` - 永久增加定身抗性
- `player.SetPasadddizzy(value)` - 永久增加眩晕抗性
- `player.SetPasaddmp(value)` - 永久增加真气上限
- `player.SetPasdecfatalratio(ratio)` - 永久减少致命一击率

### 8.6 特殊功能
- `player.SetClearcooldown(skillId1, skillId2, ...)` - 清除指定技能冷却
- `player.SetClearslow(prob)` - 清除减速效果
- `player.SetUniqprompt(value)` - 设置唯一提示
- `player.SetZhaoqi(prob, ratio, flag, time, buffid)` - 召气效果（增加真气上限）

### 8.7 获取玩家信息
- `player.GetMp()` - 获取当前真气
- `player.GetMaxmp()` - 获取真气上限
- `player.GetMaxatk()` - 获取最大攻击力
- `player.GetTypeIsMob()` - 判断是否为怪物

---

## 9. 技能函数生命周期

### 9.1 主要函数调用顺序
1. **Calculate2** - 计算阶段（设置攻击力、倍率等）
2. **StateAttack** - 状态攻击阶段（施加buff/debuff）
3. **TakeEffect** - 生效阶段（被动技能、祝福技能等）
4. **BlessMe** - 祝福阶段（自身增益）

### 9.2 函数用途说明
- **Calculate2**：用于计算技能伤害、攻击力等数值
- **StateAttack**：用于对目标施加状态效果（冰冻、减速等）
- **TakeEffect**：用于被动技能的永久效果
- **BlessMe**：用于自身祝福类技能的增益效果

---

## 10. 注意事项

### 10.1 禁止事项
- ❌ 不要使用 `Math.floor((等级-1) * 差值 / 最大等级差)` 这种方式计算
- ❌ 不要在小数计算中使用 `(等级-1)` 格式
- ❌ 不要在描述中保留英文标点符号

### 10.2 最佳实践
- ✅ 所有时间单位统一使用毫秒
- ✅ 所有概率使用百分比整数（如 45 代表 45%）
- ✅ 优先保证满级数值准确，1级允许小幅偏差
- ✅ 复杂逻辑添加中文注释说明

---

## 更新日志

**v2.0 (2025-10-11)**
- ✅ 新增技能冷却时间实现规范
- ✅ 新增数值计算避免小数的规范
- ✅ 优化公式格式为直接使用等级
- ✅ 新增代码风格规范
- ✅ 新增常用函数参考
- ✅ 新增技能函数生命周期说明
- ✅ 新增注意事项和最佳实践

**v1.0 (2025-10-11)**
- 初始版本：基础框架、ID获取、注释格式规范
