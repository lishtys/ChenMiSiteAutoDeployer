---
title: 'EAE 6320 Engineering II -  06  Assets Builder, External Mesh File, Handle, Lua'
tags:
  - Entertainment Arts Engineering
  - Graphics
  - C++
  - Lua
  - EAE 6320
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: >-
  https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignSixBanner.png
toc: true
abbrlink: 5698
date: 2018-10-03 15:27:00
---



In this assignment, we added external files which contains meshes information. We use Lua files as a formatted structure and use assets manager to track all the mesh handles instead of pointers. 



<!--more--> 


## Points 
1. Since we just use files for temporary, we care more about the readability instead of efficiency this time. It's easy to compress text content and convert to binary files.  

2. Use handles to track all instances usage. This is the way we load and bind shader to effects and it automatically loads data and initialize instance. This is an assets loader.

3. Understand Lua stack and pop data from nested tables.


***
> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignSixMyGame_.zip) the game.

***


# Process

## MeshFile


First, I searched for STL model format. This format is quite simple and only contains vertex information. The ASCII STL is defined as below:

```C++
facet normal ni nj nk
    outer loop
        vertex v1x v1y v1z
        vertex v2x v2y v2z
        vertex v3x v3y v3z
    endloop
endfacet
```

***

For readability. I've designed the mesh format like below:


**Cube:**

```lua
return
{
	VerArray =
	{
		{-1.0,-1.0,1.0},
		{-1.0,1.0,1.0},
		{1.0,1.0,1.0},
		{1.0,-1.0,1.0},
		{-1.0,-1.0,-1.0},
		{-1.0,1.0,-1.0},
		{1.0,1.0,-1.0},
		{1.0,-1.0,-1.0},
	},

	IndexArray =
	{
		{0,1,2},
		{0,2,3},
		{4,6,5},
		{4,7,6},
		{4,5,1},
		{4,1,0},
		{3,2,6},
		{3,6,7},
		{1,5,6},
		{1,6,2},
		{4,0,3},
		{4,3,7},
	},

}
```

***

In my opinion, we only need position information for current assignment. So we can just use position array like above. In common cases, people will recognize each section as x,y,z position.

For index information, I divide elements into groups, this will help us see triangles.

Since we always create and modify models in DDS applications like MAYA, we don't really need to add more prefix or symbols to help user change the content. The file is assumed to be output from third application.

***


## MeshBuilder

After having these files, we need to build them into assets. The <code>MeshBuilder </code>is responsible for the mesh data assets.

 Its current main job is to copy file into correct "Data" folder and works with <code>BuildMyGameAssets</code> project to set up configurations. In this case, we need to think more about the platform independent properties and dependency


---

## cMesh

In <code>cMesh</code>, I update its implementation of <code>MeshFactory</code>. Right now, it takes and return "Handle" reference.


**Factory**
```C++
cResult MeshFactory(const char* const i_path, Handle &mesh_handle)
```


**Load**


```C++
LoadAsset(const char* const i_path,
std::vector<Graphics::VertexFormats::sMesh >&i_mesh,
std::vector<uint16_t >&indexArray);
```
<code>cMesh</code> doesn't hold the Handle in the class, the loading job is done by <code>cManager</code>.  

Inside its loading function, it reads the Lua tables and make vertex <code>std::vector</code> and index <code>std::vector</code> to initialize the mesh render-able data.

**Handle**

The Handle works as file handle and prevent from reloading again. Still we need to update reference count.

> *[location]*
> 
> If the handle is in the <code>cGameObject</code>, it suggests the handle is from file handle(combine with file source). -> Not expected to change.
>
>If the mesh change frequently, it's may be better to hold meshes in other places. 


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
- **[1]** -> Cube; **[2]** -> Small Plane

***

## Screen Shots

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignSixscreenshot_compress.gif)


***


# Download

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignSixMyGame_.zip) the game.

Version: x64 - DirectX.


