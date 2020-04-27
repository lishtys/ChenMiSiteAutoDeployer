---
title: EAE 6320 Engineering II -  07  Maya Mesh Exporter Plug-in
date: 2018-10-18 02:27:00
tags: 
- Entertainment Arts Engineering 
- Graphics
- C++
- Maya
- EAE 6320 
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignSevenBanner.PNG
toc: true
---



In this assignment, I created a mesh exporter tools in Maya based on Jhon-Paul's project. In addition, I added the color property into <code>Graphic</code> renderer. 



<!--more--> 


## Points 
1. Create <code>MayaMeshExporter</code> project. Pay attention to the dependencies and debug in exporting.

2. Take care of color render in different platforms and the limits of vertices based on our design.

3. Updates Lua loader and keep readable for users.

***
> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignSevenMyGame_.zip ) the game.

***


# Process

## Maya Exporter

Since we have new file extention for the mesh, I update the file path loading .mesh files.

Inside the file, I decided to export color property and add keyword to distinguish the <code>POSITION</code> and <code>COLOR</code> infomation inside the mesh. The exported mesh format is like below

**Plane.mesh**
```C++
VerArray =
{
{
position={-4.60451,-1.51643,4.7557},
color={0.0904,0.0421,0.54,1},
},
{
position={4.60451,-1.51643,4.7557},
color={0.5331,0.54,0.0423,1},
},
{
position={-4.60451,-0.24221,-4.7557},
color={0.54,0.1462,0.0422,1},
},
{
position={4.60451,-0.24221,-4.7557},
color={0.0421,0.54,0.5271,1},
},
```

***

## Exporter Dependency

Because it's an independent tool for art assests, I think we don't need to add any dependency into the new exporter project. And I clean all the solution and only build the exporter project. It works.

> Have to change the access permission to complete the copy cmd.

***

## Vertices Limits

This is pretty straitforward. Since we designed the index as a uint16, we can hold <code>2^16=65536</code> vertices.  When starting loading lua files, check the number of vertices. If the number is greater than the max size, return fialed and give user hints. 

In order to give a friendly user experience, I created a default question mark mesh for replacing any wrong meshes. like below:

![Overflow](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignSevenQuestionMissing.PNG)



***
## Debugging in Maya

It's super cool to know we can use Visual Studio to debug in Maya. Just attach any process in the computer.

![Debug](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignSevenezgif.com-optimize.gif)


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

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignSevenezgif.com-optimize%20%282%29.gif)


***


# Download

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/AssignSevenMyGame_.zip ) the game.

Version: x64 - DirectX.
