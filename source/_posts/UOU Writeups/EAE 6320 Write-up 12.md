---
title: 'EAE 6320  - Multiple Animation Clips, Binary'
tags:
  - Entertainment Arts Engineering
  - Graphics
  - C++
  - Animation
  - Binary
  - EAE 6320
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: 'https://media.giphy.com/media/12kd8g767vzGXm/giphy.gif'
toc: true
abbrlink: 53438
date: 2018-11-14 20:49:00
---

# Updates
1. 11.13 - Finish `AnimationBuilder`.

2. 11.13 - Finish animation table binary loader test.
	
3. 11.14 - Change interfaces for multiple animation . 

4. 11.14 - Complete file loading aniamtion test.


<!--more--> 

## Screen Shot

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Output.gif)

***



# cAnimation

## Multiple Aniamtion Clips

Because of multiple animation clips, I update `cGameObjectAnimation` adding list of *duration* and *animations*.

```

	// Cached Animation KeyFrames
	std::vector<std::vector<KeyFrame>> keyframesList;
	//Cached Durations for each clip
	std::vector<float> durationList;

```

***

# Animation Table 

The main strcture has no change. For a better human readable format, just swicth the order, here is the nested table structure. 

- Duration List 
- Clip List -> KeyFrames -> KeyFrame -> {Time, Pos, Rotation} 

Below is an example (2 clips with 4 key frames each):

```Lua
return
{
Duration={10.0,20.0},
Clips=
{
	{
	-- Clip - 1
		{
		kTime=0.0,
		position={1.2,0.0,0.7},
		rotation={1,0,0,0},
		},
		{
		 -- keyframe 2
		},
		{
		 -- keyframe 3
		},
		{
		 -- keyframe 4
		},
	},	
	{
		-- Clip - 2
		{
	    -- keyframe 0
		},
		{
		kTime=8.0,
	    position={1.2,1.0,0.7},
		rotation={-0.707,0,-0.707,0},
		},
		{
		  -- keyframe 2
		},
		{
		  -- keyframe 4
		},
	},
},
}

```


## Explanation

> **kTime** : the time of the keyframe. You should keep it starts from 0 and ends at the duration for correct display.

> **rotation**: currently it stores data in `Quaternion`.  I may make a Vector->Quaternion function for a better use.  

***

# Animation Builder

It's like other Builder projects under `Tools` folder. To use that, you need to add types in `AssetsToBuild` and add functions like before, write binary files into `Data`. 

## Binary Data

**The Order**

1. Clips Count - **uint16_t**

2. Time Array (in seconds) -  **Float Array**

- ==Loop for Clips Count==

3. Keys Count - **uint16_t**

4. KeyFrame Array - **KeyFrame**

- ==End==



***
# cGameObject

## Initialize

Right now, in `LoadRenderInfo`, it pass the `cGameobjectAnimation` to the gameobject. Inside, it binds the animation and play it as default. 

## Uses

In `cMyGame`, put all animation instances inside the `Update(seconds)` function and update them. 

In `cGameObjectAnimation`, it provides public functions to stop or swicth animations.

***
# Discussion & Plan

- I'm thinking of adding `File Handler` for `cGameObjectAnimation`. But it may takes lots of work not on the feature itself. I'd rather refine some implementation and add small features like transitions, time control.

- Move current `cGameObjectAnimation` into an independent project.

- Update `cGameobject` and `cGameobejctAnimation` animation functions for a more flexible control. 


- Start to make some efforts on vertex animation if time is allowed.


***
# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation. 

Hold **[Shift]** key to hide the square in the center.

Hold **[Ctrl]** key to change four triangles color.

Press **[↑, ↓, ←, →]** keys to move around camera. 

Press **[Q],[E],[Z],[C]** keys to rotate camera left, right, up and down.

Press **[A],[S],[D],[W]** keys to move around default gameobject.

Press **[1],[2]** keys to switch default gameobject's mesh. 
- **[1]** -> Teapot; **[2]** -> Circle

***

## Screen Shots

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Output.gif)


***


# Download

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/A11MyGame_.zip) the game.

Version: x64 - DirectX.


