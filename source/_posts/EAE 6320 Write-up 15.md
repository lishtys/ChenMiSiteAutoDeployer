---
title: EAE 6320  - Final Project - 3D Flappy Bird.
date: 2018-12-12 08:11:00
tags: 
- Entertainment Arts Engineering 
- Graphics
- C++
categories: 
- Engineering
- EAE 6320
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/fBanner.png
toc: true
---
# Summary 

During this semester, we've built a game engine based on John-Paul's architecture and add our own sub system into the engine. <!--more--> For the final project, I've made a 3D Flappy Bird based on the project and subsystem we made – Animation & Audio.

# Game 
## Gameplay
The game play is quite simple. Use keyboard move up the bird, prevent it from hitting the pipes. While flying, the bird can catch the coins. Once it collides with obstacles, it fails and player can restart the game.
## Screenshot

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/FinalGameScreen.gif)

## Controls

Press **[ENTER]** key to start & restart the game.

Press **[SPACE]** key to push up bird.

Press **[←, →]** keys to move around camera.

---

## Key Process
1.	Made meshes in Maya.
2.	Add Audio System from Shantanu’s project.
3.	Add [Additive Animation] for my Animation System.
4.	Add AABB collision detection into the project.
5.	Using object pool implement infinitely scrolling module.

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Mesh.PNG)

---

# System & Implementation

## Features
- Use File Handler maintain meshes and effects. Although the game has lots of pipes and coins, it only needs one pipe mesh and one gold mesh.  [File Handler](	http://chenmi.ink/EAE%206320%20Write-up%2006/)
- Use binary file to read & store data.   [Binary Mesh](http://chenmi.ink/EAE%206320%20Write-up%2008/) 
- Use multi-threads to handle physic calculation and graphic rendering.  [Multi-Threads](http://chenmi.ink/EAE%206320%20Write-up%2004/) 
- Use keyframe animation system work with rigid body movement.  [Sub-Animation System](http://chenmi.ink/EAE%206320%20Write-up%2013/)                
- Platform independent support.

## Issues
 
- While using Audio System, for some reason, it does not work for playing one shot without having set up a loop sound first; 

![Screen](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/AudioError.png)

- The sound play function and stop function does not work properly with each other.  May create several sound instances and cause crash
 
***


# Download

> Click [Download](	https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/FinalGame_.zip) the game.

Version: x64 - DirectX.


