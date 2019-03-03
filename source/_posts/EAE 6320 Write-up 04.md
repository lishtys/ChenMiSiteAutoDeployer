---
title: EAE 6320 Engineering II -  04 Application, Graphics Threads
date: 2018-09-18 06:50:00
tags: 
- Entertainment Arts Engineering 
- Graphics
- C++
- Threads
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignFourBanner.jpg
toc: true
---

Right now, all the rendering inputs are implemented within <code>[Graphics]</code> project, which belongs to engine module not game module.  

In real world, a game programmer would not directly write codes in engine project. In this case, this time, I move mesh, effect, color inputs into <code>[MyGame] </code>project.

It involves dealing with data in two threads. One is rendering thread which is used for rendering cached data, the other is application thread which manages data in application.
<!--more--> 

***
> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignFourMyGame_.zip) download the game.
***
# Process

In last post, the Graphics project becomes platform independent. It makes easier to move <code>cMesh </code> and <code>cEffect</code> to <code>MyGame</code> project. Since we decided to use two threads, it requires us to cache data rather than ~~draw it immediately~~. 

In this case, we will submit all the data in Game project and store them in <code>[s_dataBeingSubmittedByApplicationThread]</code> and use reference counting to track their usages.

## Submit Render Data

The struct <code>[sDataRequiredToRenderAFrame]</code> is used to cache information rendered in a frame. 


## Submit Background Color

First, I add a Color variable named <code>backgroundColor</code>. The variable would be assigned in <code>[MyGame.cpp]</code>. For the simulation time, I created a function in <code>cAppliction.h</code> which returns <code>simulationSecoundCount</code>.

```C++

//Simulation Time
auto ctime= (float)cos(GetElapsedSecondCount_simulationTime());
auto stime= (float)sin(GetElapsedSecondCount_simulationTime());

//Submission of color
Graphics::Color c = Graphics::Color(ctime, stime, ctime+stime, 1.0f);
Graphics::SubmitClearColor(c);
```

## Submit Mesh & Effect Pairs 

Then, I add two pointer arrays. One is used to keep meshes data, the other is to keep effects data. Besides, I add a uint16 variable to keep the mesh & effect pairs length. The struct now like below:
```C++

struct sDataRequiredToRenderAFrame
 {
 	//...
	eae6320::Graphics::Color backgroundColor;
	eae6320::Graphics::cMesh** meshArray;
	eae6320::Graphics::cEffect** effectArray;
	uint16_t i_meshSize;
 };
 ```

The instances of mesh and effects are created in Initializes function.  In  <code>Game.cpp </code>, I defined these instances like below:
```C++
eae6320::Graphics::cEffect *s_effect_instance1;
eae6320::Graphics::cMesh *s_mesh_instance1;
```
 Since we added reference counting, users are not supposed manually create these instances directly. As a result, they could use functions to initialize its own data instead.
 
  <code>cEffect </code> instance usage in below:

```C++

if (!(result = Graphics::cEffect::EffectFactory(
"data/Shaders/Vertex/standard.shader",
"data/Shaders/Fragment/standard.shader",
s_effect_instance1)))
	//....
```
Once we setup pairs data, users can submit them in <code> MyGame.cpp </code>:
```C++

void cMyGame::SubmitDataToBeRendered(const float f1,const float f2)
{
 //...
Graphics::SubmitMeshEffectPairs(s_mesh_instance, s_effect_instance);
}
```
---

- At first, It turns out messages says some assets still remains after closing the application. 

With [Yuxian's](http://yuxiandeng.info/Program/GameEngine2/Assignment4/Assignment4.html) help, I realize I forget to clean up references of data in <code>[Application]</code> thread. 

---
## Memory Usage

**cMesh**


| Platform | Geometry Data | Index Length |Reference Count |Extra Alignment | Total |
|:-----|:------:|------:|:------:|------:|------:|
|OpenGL   |3 GLuint     |1 uint16   |1 uint16   |No| 16 bytes|
|DirectX   | 3 Pointer    |1 uint16   |1 uint16   |Yes|32 bytes|


**cEffect**


| Platform | Handler | Render State |ProgramId |Reference Count| Extra Alignment | Total |
|:-----|:------:|------:|:------:|:------:|------:|------:|
|OpenGL   |2      |1    |1 GLuint |1 uint16   |No| 16 bytes|
|DirectX   | 2       |1   |NULL|1 uint16   |Yes|48 bytes|


**Render State**


| Platform | Struct Data | Extra Alignment |Total |
|:-----|:------:|------:|------:|
|OpenGL   |1uint8    | Yes |1 byte|
|DirectX | 3 Pointer + 1uint8    | Yes | 32 bytes|

**DataRequiredToRenderAFrame**

| Platform | sPerFrame | Color | Pointer Arrays | Length |Extra Alignment |Total |
|:-----|:------:|------:|------:|------:|------:|------:|
|OpenGL   |1 |4 floats|1 pMesh + 1 pEffect |1 uint16| Yes |172 byte|
|DirectX | 1 | 4 floats | 1 pMesh + 1 pEffect | 1 uint16 |Yes | 184 byte|


> **Note:**  DirectX is x64 platform, which takes 8 bytes for each address. OpenGL is x86 platform, which takes 4 bytes for each address.
> **Note:**  The Handler is 4 bytes each. 
> **Note:**  The sPerFrame is 144 bytes.
> **Note:**  The DataRequiredToRenderAFrame only contains pointer size. Combine mesh & effect size manually.

***


# Thoughts & Discussion


- We use two threads to separate logic and render tasks. This is helpful to deal with massive calculation of models, skin animations or particles.

**Reason to Cache Data**

- Each render entity has two copies. The application and graphic threads update these two copies and sync at the end of a frame. 
  In this case, storing data in place could avoid swapping data constantly, which could also improve the performance.



***


# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation.  You may see slower animation transition like the images below. 

Hold **[Shift]** key to hide the square in the center.

Hold **[Ctrl]** key to change four triangles color.


***
## Input Control Output

![Result](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignFourInput%20Output.gif)

## Implementation
- In order to detect user input, I override the implantation of <code>BaseOnSimulationInput</code>. Use two boolean values to keep key states.


- To make auto animation, I override the implantation of <code>UpdateSimulationBasedOnTime </code>. Inside, it will switch value of a boolean value which controls the visibility of four small triangles. Below is the default sreenshot.

![Result](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignFourDefaultOutput.gif)
***

# Download

Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignFourMyGame_.zip) download the game.

Version: x64 - DirectX.
