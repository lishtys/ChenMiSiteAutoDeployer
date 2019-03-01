---
title: EAE 6320  - Game System Review - Animator and Animation Controller
date: 2018-11-21 14:18:00
tags: 
- Entertainment Arts Engineering 
- Graphics
- C++
- Animation
- Animator Controller
categories: 
- Engineering
- EAE 6320 Explore
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Pre/AnimationCurveWindow.PNG
toc: true
---

# Summary

Current animation system support:

- Animate `Gameobject` position and rotation in key frames.
- Multiple animation clips and switch flow.
- Simple animation controller.
- Binary data file driven.

<!--more--> 

***


# Animation


## Animation Clip

One animation clip contains several keyframes. Each `KeyFrame` contain keytime, position and rotation. Generally, the animation clip we defined look like following picture:

![Animation Window](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Pre/AnimationWindow.PNG)

The picture shows a clip called "New Animation" which has four keyframes.  Between each keyframe, there would be lerp curve to change the value by time. Like below:

![Animation Window](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Pre/AnimationCurveWindow.PNG)

Currently in animation system, I've implemented linear lerp for rotation and position. Besides, to support `PlayClip(string i_name)` function, we also store each clip's `duration` and `Name`.



***
## Key Frame

**Key frame structure: **

```
struct KeyFrame
	{
		float time=0.0;
		Math::sVector position;
		Math::cQuaternion rotation;
	};
```


***

## cGameObjectAnimation  (Animator)

`cGameObjectAnimation` contains several animations and transitions between clips. It works more like an `Animator` in Unity.

In `cGameObjectAnimation`, it offers several functions for user to bind, control, switch animation clips and has internal functions to update the animation by frames.

**KeyFunction**

```C++
- Binds(cGameObject i_object) // [Assign GameObject be animated]
- Play()
- Stop()
- PlayClips(int index)
- PlayClips(string clipName)
- SetSpeed(float speed)  // [1 is default.]
- Loop(bool isLoop)
- SetInt(string conditionName, int conditionValue). 
// [used for set transition condition like in Unity]
```
**Internal**
```C++
-  Update(float deltaTime)  // [Update Animations Time]
-  UpdateObject(float deltaTime) // [calculations and switch keyframes]
-  CheckConditions()   // [Determine transitions]
```
***





### Explanation

> **cType:** [`TRIGGER,INT,FLOAT,BOOL`]; 

> **ConditionName:** Use the name to assign value for transistion.

> **Relation:** 3 relations for number values. Equal,Greater,Less.

> **HasEnd:** Whether wait for the end of current animation

***



# Animation Table 

**Human Readable File**

1. Duration List 
2. Clip Names List
3. Transition Condition List
4. Clip List - Key Frame List
***


**Each Condition**

- cType [condition Type: `TRIGGER,INT,FLOAT,BOOL`]
- CName [condition Name: `STRING`]
- Condition Parameters [from clip idx, to clip idx, traget value, relation,hasEnd]


## Transitions

In the example, we have four animation clips and below is conditions.

``` Lua

Conditions=
{
	{
	ctype=1,
	cName="RCondition",
	-- From, 
	-- To,
	-- TargetVal,
	-- Relation : 1 = Greater; 0 = Equals; -1 = Less 
	-- HasEnd : 1 = YES; 0 = NO; 
	condition={1,0,3,0,1}
	},
	{
	ctype=1,
	cName="MCondition",
	-- From, To,TargetVal,Relation
	-- Relation : 1 = Greater; 0 = Equals; -1 = Less 
	condition={0,1,1,0,1}
	},
	{
	ctype=1,
	cName="MCondition",
	-- From, To,TargetVal,Relation
	-- Relation : 1 = Greater; 0 = Equals; -1 = Less 
	condition={0,2,2,0,0}
	},
	{
	ctype=1,
	cName="MCondition",
	-- From, To,TargetVal,Relation
	-- Relation : 1 = Greater; 0 = Equals; -1 = Less 
	condition={0,3,9,1,0}
	},
},
```

### Transitions Graph


<div class="justified-gallery">
![Transitions Graph](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Pre/Animation%20Controller.PNG)
![Transitions Graph](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Pre/Animation%20Controller2.PNG)
![Transitions Graph](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Pre/Animation%20Controller3.PNG)
</div>

***
In the example setting, we can change `MConditions` value to make transitions.

`anim.SetInt("MCondition",1)` switch clip to `[1] animation` - `RotY`.

***

**Each KeyFrame**

- kTime [KeyTime]
- position [x,y,z]
- rotation [w,x,y,z]
***

## Data File

**Below is the testing example**



- 4 clips with 4 key frames each; 
- 4 transition conditions;  

```Lua
return
{
Duration={5.0,10.0,5.0,8.0},
ClipsNames={"MoveUp","RotY","RotZ","Combine"},

Conditions=
{
	{
	ctype=1,
	cName="MCondition",
	-- From, 
	-- To,
	-- TargetVal,
	-- Relation : 1 = Greater; 0 = Equals; -1 = Less 
	-- HasEnd : 1 = YES; 0 = NO; 
	condition={0,1,3,0,1}
	},
	{
-- condition -2
	},
	{
-- condition -3
	},
	{
	ctype=1,
	cName="MCondition",
	-- Relation : 1 = Greater; 0 = Equals; -1 = Less 
	condition={0,3,9,1,0}
	},
},

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
		  -- keyframe 3
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

3. Name Array -  **String Array**

- ==Loop for Clips Count==


4. Keys Count - **uint16_t**

5. KeyFrame Array - **KeyFrame**

- ==End==



- ==Loop for Clips Count==

5. Condition Count - **uint16_t**

6. Condition Array - **ConditionPair**

- ==End==


***
# cGameObject

## Initialize

Right now, in `LoadRenderInfo`, it pass the `cGameobjectAnimation` to the gameobject. Inside, it binds the animation and play it as default. 

In `cMyGame::Initialize()`, you can load the animation table and initialize the instance.
```
//Load Animation

c_test_animation.LoadAsset("data/animations/testanimation.lua");
```

Then, in your gameobject initialize function, pass the instance and bind.

```
if(c_animation)
	{
		anim = *c_animation;
		anim.Binds(this);
	}
```
## Uses

In `cMyGame`, put all animation instances inside the `Update(seconds)` function and update them. 

Access `cGameObjectAnimation` and use related functions to control the Animation. Like below:

```C++
	// Animation Ctrl
	    //Stop
		{
			s_movable_game_object->anim.stop();
		}
		
		//change Loop
		{
			s_movable_game_object->anim.loop(true);
		}
		
		//change Speed
		{
			s_movable_game_object->anim.setSpeed(10);
		}
	
		//Play By Name
		{
			s_movable_game_object->anim.playClip("RotZ");
		}

	// Condition Ctrl
		{
			s_movable_game_object->anim.SetInt("MCondition",1);
		}
	
```
***

# Changes 

## Add Projects
- Add `Animation Project` into `Engine`;
- Add `AnimationBuilder Project` into `Tools`; 

## Add Lerp Math 
- Add two math function for Rotation Lerp in `cQuaternion`;

## Add Assets Hanlder

- In `AssetsToBuild.lua`, add new type as following
```lua
	animations =
	{
		{ path = "Animations/testAnimation.lua"},
	},
```


- In `AssetsBuildFunctions.lua`, add functions
```lua
NewAssetTypeInfo( "animations",
	{
		ConvertSourceRelativePathToBuiltRelativePath = function( i_sourceRelativePath )
			-- Change the source file extension to the binary version
			local relativeDirectory, file = i_sourceRelativePath:match( "(.-)([^/\\]+)$" )
			local fileName, extensionWithPeriod = file:match( "([^%.]+)(.*)" )
			return relativeDirectory .. fileName .. extensionWithPeriod
		end,
		GetBuilderRelativePath = function()
			return "AnimationBuilder.exe"
		end
	}
)
```
## Initialize 

You can initialize the Aniamtion Instance just like `cMesh` instance or `cEffects` instance.

Depend on the way you want to implement, you can let `cGameObject` has a reference of `cGameobejctAnimation`. Or put somewhere you like.

If you add a reference in GameObject, you can update like below 
```lua
selectedGameobject->UpdateAniamtion(i_elapsedSecondCount_sinceLastUpdate);
```

***
# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation. 

Hold **[Shift]** key to hide the square in the center.

Hold **[Ctrl]** key to change four triangles color.

---

Press **[↑, ↓, ←, →]** keys to move around camera. 

Press **[Q],[E],[Z],[C]** keys to rotate camera left, right, up and down.

Press **[A],[S],[D],[W]** keys to move around default gameobject.

Press **[1],[2]** keys to switch default gameobject's mesh. 
- **[1]** -> Teapot; **[2]** -> Circle

---

Press **[7],[8],[9],[0]** keys to play animation clips by name. [MoveUp,RotY,RotZ,Combine]

Press **[J],[K],[L]** keys to play animation using conditions .

Press **[P],[O],[U],[Y],[I]** keys to stop, play, loop, disable loop, change speed in animation.

***

## Screen Shots

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Output.gif)


***


# Download

## Animation Project

> Click [Download](	https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Pre/Animation.zip) the game.

## Game

> Click [Download](	https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/MyGame_Pre.zip) the game.

Version: x64 - DirectX.

