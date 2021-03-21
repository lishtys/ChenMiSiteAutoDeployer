---
title: ''
layout: post
comment: false
busuanzi: false
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/Website/Portfolio/Minestory.png
cover: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/Website/Portfolio/Minestory.png
toc: false
widgets: []
abbrlink: 1
---


# Overview

The research project is to create a real-time animation production platform. This tool supports the analysis of a script text, applying natural language processing algorithms, to get the bare bones of the stories. Based on the description, the tool can generate acting performance directly. Combined with the auto-camera position algorithm, it can produce a sketch of a clip without manual operation.

Users only need to tweak around a few things to get a final movie. This tool dramatically improves the speed of creating animations and lets more people without 3D graphics knowledge or animating knowledge can easily produce their content.



---
# Key Responsibility


1. large-scale art resource maintenance and update based on AssetsBundle. In the design, the whole platform involves a variety of ages, a large number of scenes, and optional characters. In this case, our resource library is huge and not suitable to store within the client.The users only need to maintain the resources that appear in the story for the production. By applying an incremental content update solution, all the content in the cloud is avoided to be loaded at once at the very beginning.

2. The art resources are produced together by multiple art groups distributed in different time zones. To increase the stability of the overall solution, I worked with the art team to develop a set of automated resource work pipeline generation tools.  I extended the Unity editor to support a one-click generation of Prefabs and corresponding resource files based on certain file naming rules and directory structure.

3. Use Promise network library to implement the wrapping of  Unity's underlying network module (UnityWebRequest). Solve the problem of multiple nested Callbacks. 
4. Use UGUI to simulate a Timeline multi-track interface. Use the behavior tree in the logic layer to handle the logic control of character performance.
5. Cooperate and Integrate a voice to facial animation service, personal avatar from selfie features with other companies. 
6. Manage the project and work with the development teams in different time zones and built business cooperation with AI service providers.


