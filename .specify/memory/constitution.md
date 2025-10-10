# Skill C5 项目宪法

**版本**: 2.0.0 | **批准日期**: 2025-01-27 | **最后修改**: 2025-01-27

## 项目概述

诛仙游戏技能Hook系统，基于Frida + TypeScript实现所有技能的重写和修改。

## 核心原则

### I. 基于BaseHookSkillStub的标准实现模式

所有技能Hook类必须：
- 继承自`BaseHookSkillStub`基类
- 使用`Skill{技能ID}`命名格式
- 在构造函数中调用`super(技能ID)`
- 仅重写需要修改的方法，其他保持默认行为

### II. 代码注释规范 (NON-NEGOTIABLE)

每个技能类必须包含完整注释：
```typescript
/**
 * {技能ID}  {技能名称}
 * {技能效果描述}
 * {天书/神通/造化相关描述（如果有）}
 */
```

### III. 技能方法重写规范

#### 时间相关方法
- `GetExecutetime()` - 施法时间（毫秒）
- `GetCooldowntime()` - 冷却时间（毫秒）
- `GetTime1/Time2/Time3...()` - 技能各阶段时长（毫秒）

#### 计算相关方法
- `Calculate1/Calculate2/Calculate3...()` - 各阶段参数计算
- `CalculateDamage()` - 伤害计算

#### 效果相关方法
- `StateAttack()` - 技能释放时效果（获取目标对象）
- `BlessMe()` - 自身增益效果（获取自身对象）
- 其他特殊效果方法

### IV. 玩家对象使用规范

#### 对象获取
- `skill.GetPlayerNice()` / `skill.GetVictimNice()` - 在`StateAttack`中获取目标
- 在`Calculate`系列和`BlessMe`等函数中获取自身

#### 常用方法分类

**免疫类**
- `SetImmunewrap(duration)` - 免疫缠绕
- `SetImmunesilent(duration)` - 免疫沉默

**属性增益类**
- `SetIncskilldodge(id, value, duration, stackType)` - 增加技能躲闪
- `SetMpgen(probability, time, ?, mpValue, type)` - 真气恢复

**护盾类**
- `SetMagicshield(ratio, maxValue, duration)` - 魔法护盾

**伤害调整类**
- `SetDecfatalhurt(probability, ratio, duration, type)` - 减少致命伤害

**冷却管理类**
- `SetClearcooldown(...skillIds)` - 清除指定技能冷却

#### 信息获取
- `skill.GetLevel()` - 技能等级
- `skill.GetT0/T1/T2...()` - 天书等级
- `player.GetSkilllevel(skillId)` - 获取指定技能等级
- `player.GetMaxmp()` - 最大真气值

### V. 代码质量要求

- **类型安全**: 使用TypeScript严格类型，避免any
- **方法返回**: `StateAttack`等效果方法必须返回`true`表示继续执行
- **调用父类**: 修改父类行为时使用`super.方法名(...)`获取原始值后调整
- **数值精度**: 使用`Math.floor()`处理浮点数计算
- **工具函数**: 使用`ConstFunc.ts`中的工具函数（如`zrand`随机数）

## 技能实现模板

```typescript
/**
 * {技能ID}  {技能名称}
 * {效果描述}
 * {天书/神通描述（如果有）}
 */
class Skill{技能ID} extends BaseHookSkillStub {

    constructor() {
        super({技能ID});
    }

    // 示例：修改施法时间
    protected GetExecutetime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return 1000; // 1秒施法
    }

    // 示例：修改冷却时间（基于原始值）
    protected GetCooldowntime(stub: NativePointer, skill: Skill, originFunc: NativeFunction<number, NativePointer[]>): number {
        return super.GetCooldowntime(stub, skill, originFunc) - 50000; // 减少50秒
    }

    // 示例：添加技能效果
    protected StateAttack(stub: NativePointer, skill: Skill, originFunc: NativeFunction<void, NativePointer[]>): boolean {
        super.StateAttack(stub, skill, originFunc);
        
        const player = skill.GetVictimNice(); // 获取目标
        
        // 实现技能效果
        player.SetImmunewrap(6000); // 免疫缠绕6秒
        
        // 天书效果判断
        const talentLevel = player.GetSkilllevel(天书技能ID);
        if (talentLevel > 0) {
            // 天书相关效果
        }
        
        return true;
    }
}
```

## 常见模式

### 1. 瞬发技能
```typescript
protected GetExecutetime(): number {
    return 500; // 0.5秒
}
```

### 2. 基于原始值调整
```typescript
protected GetCooldowntime(stub, skill, originFunc): number {
    return super.GetCooldowntime(stub, skill, originFunc) - 30000; // 减少30秒
}
```

### 3. 天书效果判断
```typescript
const n1 = player.GetSkilllevel(6821); // 一级天书
const n2 = player.GetSkilllevel(6822); // 二级天书
const n3 = player.GetSkilllevel(6823); // 三级天书
if (n1 > 0) {
    // 一级效果
} else if (n2 > 0) {
    // 二级效果
} else if (n3 > 0) {
    // 三级效果
}
```

### 4. 技能等级相关计算
```typescript
const level = skill.GetLevel();
const duration = 1000 + 1000 * level; // 基础1秒 + 等级*1秒
```

### 5. 天书加成计算
```typescript
const t0 = skill.GetT0();
const bonus = Math.floor(t0 * 0.1); // 天书提供10%加成
```

## 文件组织

### 目录结构
```
src/
├── base/
│   ├── skill/
│   │   ├── BaseHookSkillStub.ts  # 核心基类
│   │   ├── Skill.ts               # 技能对象
│   │   └── SPlayer.ts             # 玩家对象
│   ├── ConstFunc.ts               # 工具函数
│   └── ...
├── skills/
│   ├── TongYongSkillList.ts       # 通用技能
│   ├── QingYunSkillList.ts        # 青云技能（待创建）
│   ├── HeHuanSkillList.ts         # 合欢技能（待创建）
│   └── ...
└── main.ts
```

### 技能分类组织
- 每个门派创建独立的技能列表文件
- 通用技能放在`TongYongSkillList.ts`
- 按技能ID顺序组织代码

## 图片识别与代码生成流程

### 输入
- 技能截图（来自`doc/参考/`目录）

### 输出
- 技能Hook类代码
- 简单的Markdown技能描述文档

### 信息提取要求
从截图中识别：
- 技能ID和名称
- 技能效果描述
- 数值参数（伤害、时间、冷却等）
- 天书/神通/造化相关效果
- 技能等级相关变化

## 更新记录

- **2.0.0** (2025-01-27): 基于实际项目需求重写宪法，专注代码实现规范
- **1.0.0** (2025-01-27): 初始版本（已废弃）