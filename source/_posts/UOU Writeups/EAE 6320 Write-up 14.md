---
title: EAE 6320  - Final Project Proposal - 3D Flappy Bird.
tags:
  - Entertainment Arts Engineering
  - Graphics
  - C++
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: 'https://media.giphy.com/media/nIEkrTYEy2DQY/giphy.gif'
toc: true
abbrlink: 62671
date: 2018-12-02 14:18:00
---

# Summary

For the final project, I'm planning to make a 3D flappy bird style game. This was the first game I made when i was learning Unity. Since the project support 3D meshes and no texture, the project is 3D based.

<!--more--> 

***


# Features

- A Character moving horizontally. 
- Random generated obstacles along the road. - Different types of obstacles.
- Collectable Items. (If time is enough, it may include special items other than coin)
- Obstacle will have colliders, by default, when character hit the obstacle, the game is over.
- Objects may have its own animations.
- It will have sounds when trigger certain events.


***

# Animation Engine Feature

1. Add a [local space] animation that doesn't overwrite gameobject world position.
2. Add some animation clips for obstacles and collectable items.  

***



# Audio Engine Feature

1. When changing character movement, it will play sound. 
2. When Hitting Obstacles, it will play sound.
3. When collect items , it will play sound.

***
# Audio System Link


Click [Shantanu's Blog](http://www.codenamepandey.com/audioengine) for audio system's detail.
