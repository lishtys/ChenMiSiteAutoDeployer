---
title: EAE 6320 Engineering II -  08  Binary Mesh Loader
tags:
  - Entertainment Arts Engineering
  - Graphics
  - C++
  - Binary
  - EAE 6320
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: >-
  https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignEightTrBanner_meitu_1.png
toc: true
abbrlink: 39646
date: 2018-10-24 13:27:00
---



In this assignment, the goal is to change  human readale assets into binary assets and replace implementation in cMesh.


<!--more--> 


## Points 
1.  Design binary file format.  

2. Change the implementation of cMeshBuilder.


***
> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignEightMyGame_%20.zip) the game.

***


# Process


## MeshBuilder

In previous assignments, the  <code>cMeshBuilder </code>only copy mesh source files into data folder. This time, cMeshBuilder would load mesh file from Maya outputs and convert them into binary files.

In order to keep track of different parts of vertex information. We have to devide mesh into four parts as vertex data, vertex count, index data, index count.

***

## cMesh

In <code>cMesh</code>, I update <code>LoadAsset</code> method, which would be called by cMananger. 

Below is the implementation of extracting data from binary files.

**Load Binary Asset**
```C++

    //....
    //  Load Binary Asset
	Platform::sDataFromFile pData;
	Platform::LoadBinaryFile(i_path, pData);

	uintptr_t start = reinterpret_cast<uintptr_t>(pData.data);
	uintptr_t current = start;
	uint16_t  vCnt = *reinterpret_cast<uint16_t*>(current);
	current += sizeof(vCnt);
	auto vData = reinterpret_cast<VertexFormats::sMesh*>(current);
	current += sizeof(VertexFormats::sMesh)*vCnt;
	uint16_t  iCnt = *reinterpret_cast<uint16_t*>(current);
	current += sizeof(iCnt);
	auto iData = reinterpret_cast<uint16_t*>(current);
	current+= sizeof(uint16_t)*iCnt;
	
    //....
	
	return result;
```
***

## AssetBuildFunctions.lua

Inside <code>AssetBuildFunctions</code>, I change file extension of binary file into [.bin]. So that it can make obvious difference from the human readable files.


***

# Binary File

## Format

**Plane Mesh**

![Binary](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignEightBinary.png)

### Order
1. VertexCount  (Red Rect)
2. VertexData   (Follow Red Rect)
3. IndexCount   (Orange Rect)
4. IndexData    (Follow Orange Rect)

In this way, it's easier to recognize vertex content and easier to access data when loading in runtime.
***
## Advantages 
- Loading data is faster in runtime. Since you only need to access address and all the data is already in binary format.
- Less storage space compare to text. With different char set, one number or character may take up mutiple bytes. Binary format only take fixed space for diffrent length of numbers.
- Friendly for serialization. Support serialization to make a class in binary content.

## Platform Independent
- I don't think we need to make different formats for each platform. Because like most engines, they support certain kinds of assets type. Users like artists should follow certain or standard rules to create assets. 
- Binary assets are used to improve efficiency during runtime rather than store assets to modify in the future. It's more like a mid output from original assets, so keeping one format is better.
***

# Utah Teapot

## size

- Lua File : 1493 KB
- Binary File: 334 KB

These size can be even smaller if we use certain kinds of compress algorithm to reduce the lua file size.

## Time

-  Human Readable File ： 0.0539135 s

```C++
2>Building MyGame_ Assets
2>Iterating through every Vertex path:
2> Vertex Count	18957
2>Iterating through every Index path:
2>Index Lua Count	6319
2>Time :0.0539135
2>Built C:\Users\u1157989\Documents\GitHub\MI_CHEN\MyGame_\Content\meshes/teapot.mesh
```

- Binary File

```C++
duration=0.00021699007940861669
```
***
## Capture

![Binary](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/teapotpng.png)

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

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignEightMyGame_%20.zip) the game.

Version: x64 - DirectX.
