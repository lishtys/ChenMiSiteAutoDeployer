---
title: Unity Hotfix Solution (xLua, AssetBundle) —— Overview
date: 2018-12-05 18:18:00
tags: 
- Unity
- xLua
- AssetBundle
categories: 
- Unity 
- Hotfix xLua
thumbnail: https://unity3d.com/sites/default/files/survivalshooter_projectheader.png
toc: true
---

# Introduction


This is a research topic I delivered in EAE @ UOU recently. It includes a hotfix solution in commercial game based on Unity.

The serials and example demo covers - in Unity :

- Assets Updating Solution Based on Versions (AssetBundle, Unzip)
- Using Lua hotfix game logic in runtime (xLua)

The example bases on Complete Project from Unity Technology - Survive Shooter. It stimulate the task to add hotfix feature in a published game.

Since this is a research topic, for each section, I would write related introduction post.

<!--more--> 

***


# Case

After publishing games, you may want to update game content. Like in a MOBA game:

- It always needs to add more charaters and in most cases, the new character won't change game logic.
- To balance the battle, developers need to change the attack range which also needs to be changed in skill indicator in client.
- Change map for different holidays or events.

[**Bad Choice**] Rebuild. Why?

- AppStore needs to check new builds and could be rejected due to new changes.
- Users need to re-download the game again for tiny changes. Not flexible.


[**Ideally**] What we want.

- Only download & updates game content that changes.
- Rewrite game logic. Straightforward , change the implementation in the game.

Then you need a [**Hotfix**]  solution.


***

# Solution

There are two parts in game content. One is codes, which will be compiled into dll in Unity. The rest like models, materials, audios can be treated as assets. 



## Assets
We can use Unity build-in system to update the Assets content. But for codes, Unity doesn't have solution for that. 

The asset managing system in Unity used for updating is AssetBundle. You can check [TO-BE-ADD] for details and follow instructions to learn how to use.


## Codes

### Reflection 

Generally, C# has reflect feature which can be used to change logic in DLL.

However, why not using reflection ?

- AppStore doesn't allow you use the feature because they think it is unsafe.
- The game industry has used scripts language for fixing bugs.


For this topic, I would use xLua in Unity and stimulate updating tasks in real world. 

Check [TO-BE-ADD] for details and follow instructions to learn how to use.



***



# Demo Setup

For this topic, the project use Unity 2017. All different versions of Unity 2017 works. 

In AssetStore, download [Unity-Chan] and [Survive Shooter].

That's all. See you in next post.



***

