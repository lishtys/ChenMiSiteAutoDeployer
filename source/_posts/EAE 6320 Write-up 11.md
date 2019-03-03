---
title: EAE 6320  - Gameobject Animation System, Keyframes, Table
date: 2018-11-08 07:00:00
tags: 
- Entertainment Arts Engineering 
- Graphics
- C++
- Animation
- EAE 6320 
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://media.giphy.com/media/Lcx1BIYn47hra/giphy.gif
toc: true
---

# Updates

1. 11.07 - Finish GameObject Position Animation [hard code test case].
	
2. 11.07 - Finish GameObject  Rotation Animation [hard code test case -- Quaternion Lerp may not sure]. 

3. 11.07 - Finish Multiple animation clips . 

4. 11.07 - Add `AnimationBuilder` Project & Designed Animation Lua table. 

<!--more--> 

## Screen Shot

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Output.gif)

***
> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/A11MyGame_.zip) the game.

***


# cAnimation

## GameObject Animation

For now, the `cAnimation` system controls the position & rotation of a whole gameobejct. It will override the position and rotation when it is playing, just like what Unity animation did.

Therefore, next step is to change its name to `cGameobjectAnimation`.

If the `cGameobject` support nested parent tree, like make one cGameobject as a child of `cGameobject`. It will would work like Unity way. 

**Future** 

- Add vertex animation if everything goes well. Treat each vertex as joint? 

***

## Basic Implementation 


**KeyFrame** 

This is a data structure storing animation keyframe. It needs time and animation data. Like below:

``` C++
struct KeyFrame
	{
		float time;
		Math::sVector position;
		Math::cQuaternion rotation;
	};
```

***

**cAnimation** 

It has `Binds(cGameObject )`,`AddKey(index, time, pos, rotation)`, `Updates(deltaTime)`and several play, stop functions.


For a `cAnimation`, it contains a list of animation clips. Each clip has a list of `keyFrame`. Below variables in `cAnimation`.


``` C++
float duration;          // Animation Time
int frame;               // Current Frame
float time;              // Current Time
bool playing;
bool looping;
int currentClipIndex;   // Current Playing Clip Index

// Current Animate Object
cGameObject* c_object_=nullptr;

// Cached Animation KeyFrames
std::vector<std::vector<KeyFrame>> keyframesList;
```   

 
***

In `Update` function, it will calculate current `time` and update ` keyframe`. Then interpolate position and rotation.

``` C++
//....
//Decide which is current frame 
//....

float alpha = (time - keyframes[frame - 1].time) / 
(keyframes[frame].time - keyframes[frame - 1].time);

    auto pos = keyframes[frame - 1].position;
    auto posNext = keyframes[frame].position;
    Math::sVector animPos;

// Learner Lerp Position

	animPos.x = pos.x + (posNext.x-pos.x )*alpha;
	animPos.y = pos.y + (posNext.y-pos.y )*alpha;
	animPos.z = pos.z + (posNext.z-pos.z )*alpha;
	c_object_->s_rigid_body_state.position=animPos;
				
// Learner Lerp Rotation
//.....
```


**Future** 

- Add more lerp curves. Make it configurable.
***

## cGameObject Test Code

Currently, in `cGameObject`, after `InitializingGeometry`. I used below codes to define a animation like screen shot in [Output section].


```C++
//for animation test

//Start & End Data

	Math::cQuaternion rot;
	Math::sVector rotDir(0,1,0);

	Math::sVector pos;
	pos.x = 1.2f;
	pos.y = 0.0f;
	pos.z = -0.7f;


//Initialize animation and make keyframes

	anim.duration = 10;
	anim.AddKey(0, 0.0f, pos,rot);
	anim.AddKey(0,2.0f, Math::sVector(1.2f,1.0f,-0.7f), Math::cQuaternion(90.0f, rotDir));
	anim.AddKey(0, 5.0f, Math::sVector(1.2f, -1.0f, -0.7f), Math::cQuaternion(145.0f, rotDir));
	anim.AddKey(0, 10.0f, pos, rot);
	
//Bind Data and play

	anim.Binds(this);
	anim.loop(true);
	anim.play();
```

***

# Changes & Discussion

- To support rotation lerp, I add Math function and operator for `cQuaternion`. I think this is just tiny changes.

- If I want to add "Vertex Animation", I may need to store "Vertex Array Data" somewhere. This may increase memory usage in `cMesh` or `cGameObject`.  

> Probably, I would divide animation system into two projects. One deals with gameobject animation. One handles vertex animation if I implement.

- I may check to see the difference between `sLerp` and `Lerp`. Currently for the rotation, I just use simple `Lerp`. At least in test codes, it looks fine.

***


# Animation Table


Store a list of clips and each clip has a list of keyframe and its duration. So I made a nested tables like below and put clip duration into other tables.

[Haven't done testing. May Change.]


```Lua

return
{
Clips=
{
{
-- 1st Animation Clip 
{
time=0,
position={1.2,0.0,-0.7},
rotation={0,0,1,0},
},

-- ....

    
},


{
  -- 2nd Animation Clip 
{
time=0,
position={1.2,0.0,-0.7},
rotation={0,0,1,0},
},

-- ....

},

},
Duration={10,20}

}


```


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


