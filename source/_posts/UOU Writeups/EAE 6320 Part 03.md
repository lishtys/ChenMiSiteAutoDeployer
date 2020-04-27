---
title: EAE 6320 Engineering II -  03 Further Graphic Independent
tags:
  - Entertainment Arts Engineering
  - Graphics
  - C++
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: >-
  https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignThreeBanner.png
toc: true
abbrlink: 26488
date: 2018-09-12 06:42:00
---



Continue with platform independent task from last week, this time I remove the <code>Graphics.[platform].cpp</code> making united interfaces for both OpenGL and DirectX.

Also, I modify the implantations for <code>cMesh</code> & <code>cEffects</code>, which allows users to pass data rather than hard coded. The mesh data format used in <code>cMesh</code> has been changed to vertices array with index array. 

<!--more--> 


***
> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignThreeMyGame_.zip) download the game.
***


# Process

In last post, I add a <code>cMeshData</code> class. Since the sMesh would be extended in the future, I remove the MeshData first.

## GraphicsBase


Then in order to remove <code>Graphics.[Platform].cpp</code> files, I make a new namespace <code> **[GraphicsBase]** </code> to handle platform dependent codes and a<code> Graphics.cpp</code> to keep the original interfaces and calls for the graphic render pipeline. In this way, the <code>Graphic.cpp</code> would be clean.

<code>**[GraphicsBase]**</code> file is in the **Graphics** project. Below are interfaces:


```C++
{
 void  ClearTarget(Graphics::Color c);
 cResult CleanUp();
 cResult Initialize(const Graphics::sInitializationParameters& 
 i_initializationParameters);
 void Swap();
}
```


The <code>Initialize()</code> handles DirectX specific view initialization and <code>Swap()</code> deal with both platform buffer swapping.

<code>ClearTarget()</code> takes a <code>Color</code> class to change the back buffer color. By using the color class, it allows user to define different color they want. It has a default color set black. Below is a usage in <code>Graphic.cpp</code> 

**Defination**
```C++
Color();
Color(float r, float g, float b, float a);
```

**Usage**
```C++
    {
    	 // Clear Color
	    Graphics::Color c;
    	GraphicsBase::ClearTarget(c);
	}
```


---

## cMesh

In order to support creating multiple meshes and save memory space. The <code>cMesh</code> has a new interface to setup geometry data :

```C++
     
cResult InitializeGeometry(std::vector<VertexFormats::sMesh> 
veticesArray, std::vector<uint16_t> indexArray);
```

It takes vertices data and index data, which could allow the engine only keep unique vertices and use index sequence to combine the vertices.

In the project, I decide to use DirectX winding order as default. The <code>InitializeGeometry() </code>would take care of differences. As a result, the <code>Graphics.cpp</code> only need to care one copy of geometry data.

> (In OpenGL, I **~~directly~~** reverse index array. It's better to use a copy to keep the index array clean in general cases. -- Okay for temporary stage. )



**usage** in graphics.cpp

```C++
//..
// data
std::vector<Graphics::VertexFormats::sMesh> meshes(vData, vData + vertexCount);
std::vector<uint16_t> indexArray(iData, iData + indexCount);
//..
if (!(result = s_mesh_instance.InitializeGeometry(meshes, indexArray)))
	{
	  //...
	}
```

In the future, those meshes and index data are stored in a file like fbx. Right now it's fine to hard code as an input from outside.




***


## cEffect

The changes on <code>cEffect</code> are quite simple. Just let shader file paths become parameters that can be changed by users.

```C++
     
ceae6320::cResult InitializeShadingData(const char filePath[], 
const char filePath2[]);
```

**usage** in graphics.cpp

```C++
// Initialize the shading data
{
	if (!(result = s_effect_instance.InitializeShadingData(
	    "data/Shaders/Vertex/standard.shader",
		"data/Shaders/Fragment/tintColorAnimation.shader")))
	{
	    //...
	}
	if (!(result = s_effect_instance1.InitializeShadingData(
	    "data/Shaders/Vertex/standard.shader",
			"data/Shaders/Fragment/standard.shader")))
	{
	  //...
	}
}
```




---
## Memory Usage




**cMesh**


| Platform |  Geometry Data | Index Length |Extra Alignment | Total |
|:-----|:------:|------:|:------:|------:|
|OpenGL   |3 GLuint     |1 uint16    |Yes| 16 bytes|
|DirectX   | 3 Pointer      |1 uint16    |Yes|32 bytes|


**cEffect**


| Platform |  Handler  | Render State |ProgramId |Extra Alignment | Total |
|:-----|:------:|------:|:------:|:------:|------:|
|OpenGL   |2      |1    |1 GLuint|Yes| 16 bytes|
|DirectX   | 2       |1   |NULL|No|40 bytes|


**Render State**


| Platform |  Struct Data  | Extra Alignment |Total |
|:-----|:------:|------:|------:|
|OpenGL   |1uint8    | Yes  |1 bytes|
|DirectX  | 3 Pointer  + 1uint8    | Yes | 32 bytes|

> **Note:**  DirectX is x64 platform, which takes 8 bytes for each address. OpenGL is x86 platform, which takes 4 bytes for each address.

> **Note:**  The Handler is 4 bytes each.

***


***







# Thoughts & Discussion

- Lots of implementation in <code>cMesh</code> follows the fact that both platform would store vertex data and index data into buffer. In this case, we don't need to store data in codes.
- In my opinion, current solution has sacrificed some flexibility (Maybe).
- If get rid of <code>[index_Length]</code>, the <code>cMesh</code> would become smaller. Some misc infomation like index length could store in File Header. 


***

# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation.  You may see slower animation transition like the images below. (When it becomes dark, it become slower than usual).

***

## Output

![Result](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignThreeRunning.gif)

***
## Implementation 

- Back Buffer Color Animation

```C++

auto stime= sin(s_dataBeingSubmittedByApplicationThread->
constantData_perFrame.g_elapsedSecondCount_simulationTime);
auto ctime= cos(s_dataBeingSubmittedByApplicationThread->
constantData_perFrame.g_elapsedSecondCount_simulationTime);
 // Clear Color
Graphics::Color c(stime,ctime, stime + ctime,1);
GraphicsBase::ClearTarget(c);
```


- In Fragment shader, I get vertex position and change color for each section: <code> if(i_position.x<256) rVal=rVal/2+0.5;  if(i_position.y<256) bVal =bVal/2+0.5; </code>

- The picture contains 2 meshes. One is for 4 white triangles,which uses standard shader. The other is for the center square using animation shader.  


```C++
 //...

vData[1].x = 0.0f;
vData[1].y = 0.5f;
vData[1].z = 0.0f;
 //...

vData[3].x = 0.5f;
vData[3].y = 0.5f;
vData[3].z = 0.0f;

std::vector<Graphics::VertexFormats::sMesh> 
					meshes(vData, vData + vertexCount);

//...
uint16_t iData[indexCount];

iData[0] = 0;
//..
iData[5] = 2;

std::vector<uint16_t> indexArray(iData, iData + indexCount);
```

***

* This assignment takes me 8 hours to finish. 

***



# Download

Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignThreeMyGame_.zip) download the game.

Version: x64 - DirectX.
