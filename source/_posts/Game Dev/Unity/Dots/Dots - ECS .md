---
title: Data Oriented Technology Stack -  ECS
tags:
  - Unity
  - DOTS
categories:
  - Unity
  - DOTS
toc: true
date: 2020-04-28 00:29:00
---

# 1 - Concept

ECS stands for Entity、Component、System. Entity has multiple Components which is similar to GameObject in Unity. However, Component in ECS is different from the classical way. It only contains data, without functions. A game would have many `Systems`, which don't care about Entity but maintain Component related to and iterate each executing method.

> **Problems with classical ECS**
> - memory location are disconnected
> - every gameobject owns Transform component, but some may not need extra data inside the Transform class
> - scripts are at the same level, calling each other leads to a couple
> - scripts are reference type, generates GC
> - when running in a mobile device, mounting scripts may cause extra 0.01s


### What is `Entity`?

Entity is a key in `Int` that takes 4 bytes in memory. Since entities in the same type are put together, their memory location is continuous. Therefore the searching is fast and the cache is more effective.

The `Entity` can be regarded as a lightweight `Gameobject`.

# Component

##  1.2 - Archetype

The `memory` used for storing components we mentioned above is called `Archetype`. It is an array with static length.

Each `Archetype` are consists of a series of 16 bytes chunks. It is like the linked node.

## 1.3 - Component

A Component is a `Struct`. Since struct is Value-Type, it won't create GC. 

1. IComponentData
2. ISharedComponentData

It must implement `IEquatable<T>`

**Example**

```
//todo -- add later
```


# System

## ComponentSystem

-  works in the main thread, so it can not use multi-core parallel processing.
-  must wait for the last execution to complete before executing its own

## JobComponentSystem

- JCS creates the job in the main thread, then deliver it to child threads
- Data modification stops JCS
- 

**Example**

```
```


## Entity Command Buffers

## Life Cycle

- [DisableAutoCreation] Tag




