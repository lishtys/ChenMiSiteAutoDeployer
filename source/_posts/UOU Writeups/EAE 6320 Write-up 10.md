---
title: EAE 6320  -  Engine System Proposal
tags:
  - Entertainment Arts Engineering
  - Graphics
  - C++
  - FBX
  - Animation
  - Texture
  - EAE 6320
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: 'https://thumbs.gfycat.com/KindlyBoldLeafwing-max-1mb.gif'
toc: true
abbrlink: 58439
date: 2018-11-01 18:37:00
---

# General Functions

- Add animation system for gameobject.
- Add animation data builder.
- Implement basic animation blend flow for transitions.
<!--more--> 
**If Enough Time**

- Add animation system for vertex - (treat as bone)
- Support animation states configs Tables  
- Integrate FBX Parser into current mesh file information

***

# Process

1. 11.07 - Finish GameObject Position Animation [hard code test case].
	
- TODO: Rotation Animation; Document Writeup;

2. 11.07 - Finish GameObject  Rotation Animation [hard code test case -- Quaternion Lerp may not sure]. 

- TODO:  Change to `GameObjectAnimation` & Support multiple animation clips;  

3. 11.07 - Finish Multiple animation clips . 

- TODO:  Change to `GameObjectAnimation` & `AnimationBuilder`;  


***

# How To Use


## GameObject Animation
    
- Create `cAnimation` as a component to control the animation. 
- Add `duration` and `Keys` into `cAnimation`.
- Use functions to play each animation.


## Config Tables

- Contains key frames data.
- Lua format in certain rules. (Human readable & Binary) 
- May consider compress the file data.

## Parser & Data

Since FBX is a standard binary format, maybe it's possible to make a parser output data into current `Maya Exported Data`.

## Textures

- Extracting Textures directly from FBX and render it inside engine.

***

# Implementation

- First implement gameobject animation to control the position & rotation.
- Design animations tables and states configuration tables; Store data in Lua and and converted into binary file.
- Implement `playAnimation(string keyword)` function in `cAnimation` functions and used in `cGameObject`. Get it rendered in Engine. 

**Try**
- Implement vertex animation work as 'skeleton animation`.
- Ideally, use states table to define animation connections and use it to control transitions.



