---
title: Data Oriented Technology Stack -  Structure 
date: 2020-04-26 18:14:00
tags: 
- Unity
- DOTS
categories: 
- Unity
- DOTS

toc: true
---

# DOTS Structure

DOTS is mainly composed of these three parts:

-   Job System: used for efficient threads 
-   ECS: used for high-performance codes
-   Brust Compiler: generate highly optimized local code and offer SIMD instructions

Besides, the Tiny Project also based on DOTS technology. The use of DOTS is very flexible. It can be used in different combinations such as `ECS + Job System + Brust Complier` or `ECS + Job System` or only `ECS`. 

The advantage of flexibility is portability so that projects under development could switch to DOTS partly to achieve higher performance.

Let's take a look at how much efficiency DOTS can improve from a set of data provided by Unity Team:



##  Job System & High-Performance C# (HPC)

### Job System
    
Unity doesn't support multi-thread, but C# supports it. For example, receiving networking messages, downloading resources. As long as you don't call Unity's API, just processing Unity data is suitable for C# multi threadings.

But if we want to manipulate gameobjects in multiple threads, it is unable to accomplish in C# multiple threads. Put it more precisely, it is possible to do in C# multiple threads, but it's very hard. Developers can do the calculation in C# multiple threads and call Unity Graphic API when rendering.

- Unity has provided us an easy way to implement multiple works threads by Job System. To avoid `thread deadlock`, external API offered in Unity requires **Thread-Safe**, which means they run in main threads. 

> For performance, most Unity's internal C++ codes run in multi-threads, only C# interfaces are required `thread-safe`

The use of the Job System makes multiple threads in `Business Layer` possible and diligent. The job System automatically implements `thread-locks`, which reduces creating bugs. 

> Most Unity APIs can't be called in the Job System.


### High-Performance C# (HPC)

Previously, the .Net platform doesn't support cross-platform. Therefore, Unity uses Mono Core for cross-platform. Then to support 64 bits architecture, Unity applies `IL2CPP` converting C# to C++ codes during packaging. Finally, executing AOT compiling when installing applications.


> - .NET Core is 2 times slower than C ++
> - Mono is 3 times slower than .NET Core
> - IL2CPP is 2-3 times faster than Mono
> - Compiling with Burst can make C # code run faster than C ++


### GC

IL2CPP is not directly compiled into machine code, but first converted into C ++ code, and then compiled into machine code, essentially running C ++ code, so why is it slower than C ++? After all, the automatically generated code must consider compatibility with many complex situations, but it also needs to simulate the GC operation of the C # code.


IL2CPP's GC uses Boehm, which is a conservative garbage collector applied to C / C ++. It does not support the concept of .NET garbage collection generation, so the GC of IL2CPP is not the same as the .NET native GC, and the .NET native GC supports generation. Also, Boehm's GC has a feature of progressive GC. Later, this option was also opened in Unity 2019, which is now known as progressive GC.



