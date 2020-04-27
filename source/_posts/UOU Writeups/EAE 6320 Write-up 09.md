---
title: 'EAE 6320 Engineering II -  09 Binary Effects, Shader Independent'
tags:
  - Entertainment Arts Engineering
  - Graphics
  - C++
  - Binary
  - Shader
  - Lua
  - EAE 6320
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: >-
  https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/A09Banner.png
toc: true
abbrlink: 4575
date: 2018-10-31 12:12:00
---



Last week, we have implemented binary mesh files that can be used in runtime. It's more flexible and efficient than previous. This time, we need to make our effects driven by data.


<!--more--> 


## Points 
1. Design human readable file content & format.

2. Design binary format. 

3. Create `Effect Builder` to generate data files.

4. Remove hard-code path, change implementation of old cEffects.

5. Refine lua assets build work-flow. 


***
> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/MyGame_.zip) the game.

***


# Process


## EffectBuilder

`EffectBuilder` is much like `MeshBuilder`. It extracts effects data from source path (*human readable file*) and convert data to binary files.  

We need three data to make a effect for gameobject. They are `RenderState`,`Vertex Shader`, `Fragment Shader`.  

***

## Human Readable File 

 

- I use three flags to define render states. If the flag is less or equals 0, it means corresponding status are disable. Whereas, the status is enable.
- Next is a path table, contains vertex shader file path and fragement shader path. 

Below is the content.

**effect data**
```Lua

return
{
  -- flag order 
  --1.DepthBuffering 2.AlphaTransparency 3.DrawingBothTriangleSides
  renderState={1,0,0},
  vfShaders={"shaders/vertex/standard.shader","shaders/fragment/tintcoloranimation.shader"},

}
```

I make order comments as hints for easy use.

***

## Binary File

**ColorAnimation Effect**

![Binary](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/A09Binary.png)
***
### Order
1. Render Status.  (Blue Rect)                       *uint8 data*
2. Vertex shader file path length ( Orange Rect)   *uint16 data*
3. Vertex shader file path    (Follow Orange Rect) *string data*
4. Fragment shader file path    (The Rest)         *string data*

***
### Paths
 The path in binary file is a little different than human readable file. It contains `"data/"` at the beginning, which is added during building binary files.
 
 
>In this case, we don't need to modify string in runtime, which saves much time especially when there are thousands of effects files. 

> However, it also increase the storage space and make it less flexible if users want to put into other folders.

Since this is a engine, adding some rules to achieve better performance is worthy.   

***

### Load Effect

In `cEffect`, there is a factory function initializing effects data by shaders and render states.  Since we have new effect system. I update the function interface that using effect file to do the same thing.

```C++
cResult EffectFactory(const char filePath[],cEffect*& c_effect)
```

Below is the implementation of extracting data from binary files.

**Load Binary Asset**
```C++

//...
        //Load Binary Asset
		Platform::sDataFromFile pData;
		Platform::LoadBinaryFile(filePath, pData);
		uintptr_t start = reinterpret_cast<uintptr_t>(pData.data);
		uintptr_t current = start;
		
		uint8_t renderState = *reinterpret_cast<uint8_t*>(current);
		current += sizeof(uint8_t);

		uint16_t  pathLen = *reinterpret_cast<uint16_t*>(current);
		current += sizeof(uint16_t);
		
		auto path = reinterpret_cast<char*>(current);
		current += sizeof(char)*(pathLen);
		auto path1 = reinterpret_cast<char*>(current);
		current += sizeof(char)*(pathLen);

//...
		result = instance->InitializeShadingData(path, path1, renderState);
	
//....
	
	return result;
```
***

## AssetBuildFunctions.lua

To refine the building flow, we only build `shaders` that listed in `effect files` rather than converting all of them.

To support this feature, we need to extract paths in lua and register them to be built afterwards.  It involves adding new functions in building effect status.

***

## Shader Platform Independent

I follow D3D naming convention using precompiler to replace keywords and functions in OpenGL like below:

```OpenGL
#define float4x4 mat4
#define float2 vec2 
```

After using new keywords, all the codes in side `main` can be moved outside "Platform Specific". The codes are like below:
```OpenGL

{Platform Specific}

#endif

{

	float4 vertexPosition_world;
	float4 vertexPosition_local = float4( i_vertexPosition_local, 1.0 );
	vertexPosition_world = mul(g_transform_localToWorld, vertexPosition_local) ;

//....

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

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignEightScreen.gif)


***


# Download

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/MyGame_.zip) the game.

Version: x64 - DirectX.
