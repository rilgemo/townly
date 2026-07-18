# Townly Design Manifesto v0.1

This manifesto is Townly's design compass. It is not a GDD or technical specification. Every proposed feature and interface change should be checked against these principles before implementation.

## 一句话愿景（Vision）

> **From a stranger to a villager.**
>
> 玩家不是来拯救世界，而是慢慢成为这个村庄的一份子。

## 核心体验（Core Experience）

Townly 不是一个关于升级的游戏。

它是一个关于**认识一个地方**的游戏。

玩家来到一个陌生村庄。

不知道：

- 自己在哪里
- 村庄叫什么
- 谁住在这里
- 哪里可以去
- 自己以后会做什么

随着行动，不是获得越来越多的数据，而是获得越来越多的**认识（Knowledge）**。

## 第一原则：The Interface Should Never Know More Than the Player

**界面永远不能比玩家知道得更多。**

玩家不知道 Village Name，UI 就不能显示。

玩家不知道 Forest，地图就不能显示。

玩家没有得到 Wood，资源栏就不能出现 Wood。

## 第二原则：Every Interface Element Represents Discovered Knowledge

**每一个界面元素，都代表玩家真正获得的认知。**

HUD 不是固定存在。HUD 本身也是成长的一部分。

例如，第一分钟只出现：

```text
You

A stranger.
```

后来 `Belongings` 出现，再后来 `Things You've Learned` 出现。

HUD 会随着认识世界而成长。

## 第三原则：The World Comes Before the Interface

**玩家首先应该看到世界。**

不是：

```text
Character
Inventory
Map
```

而是：

```text
You wake up.

The air is cold.

A weathered gate stands ahead.
```

然后才出现行动。UI 永远服务体验。

## 第四原则：Discovery Before Explanation

**先发现，再解释。**

玩家先看到一条森林小径，后来才知道它叫 Forest Path。

玩家先遇见老人，后来才知道他是 Village Chief。

名字本身也是奖励。

## 第五原则：Places Are Remembered, Not Listed

**地点应该被记住，而不是被菜单列出来。**

玩家以后记得：

> 第一次见到村长。

> 第一次进入森林。

> 第一次修好大厅。

而不是记得一个 Location List。

## 第六原则：Every Improvement Unlocks a Future

**每一次的发展，都代表这个村庄的某个未来被实现。**

不是 `Upgrade Hall Lv2`，而是：

> Village Hall restored.

不是 `Unlock Blacksmith`，而是：

> The blacksmith has returned.

不是 `Unlock Farm`，而是：

> The abandoned field is cultivated again.

成长永远表现为世界发生变化。

## 第七原则：NPCs Are Residents, Not Progression Switches

NPC 不是 Quest Giver，也不是 Unlock Button。

他们应该像真正住在这里的人。

玩家回来时，守卫仍然在那里，樵夫今天又在砍树，矿工仍然担心矿坑。

玩家不是完成任务，而是参与他们的生活。

## 第八原则：Small World, Deep Attachment

**世界可以很小，但感情必须很深。**

Townly 不需要：

- 巨大地图
- 数百 NPC
- 国家政治
- 世界模拟

它只需要一个值得玩家每天回来看看的小村庄。

## 北极星（North Star）

以后每加入一个功能，都问自己：

> **它让这个村庄更像一个真实的地方，还是只是增加了一个系统？**

如果只是增加系统，它很可能不属于 Townly。

如果它让玩家觉得：

> 这个村子真的越来越有生命了。

那么它就是 Townly 应该有的内容。

## 项目标语

> **Townly is not about building a village.**
>
> **It is about slowly discovering that the village was waiting for you all along.**

Townly 不是关于建造一个村庄，而是关于慢慢发现，这个村庄一直在那里，等待着你的到来。

Earthly 创造一个世界，并探索它如何运作。

Townly 走进一个已经存在的小地方，陪伴它一点一点重新焕发生机。
