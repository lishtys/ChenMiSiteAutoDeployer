---
title: EAE 6900 Realtime Rendering - Render Command
tags:
  - Entertainment Arts Engineering
  - Realtime Rendering
  - EAE 6900
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: >-
  https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR1Banner.PNG
toc: true
abbrlink: 5041
date: 2019-02-04 10:41:00
---

# Summary 

This writeup is a review of adding render commands into current engine project. Currently the project would submit mesh & effect to graphic render moudle. The render binds effects and draw meshes one by one from input arrays. Usually in a game, it would have many mesh instance sharing same effects. If we use current solution dealing with rendering, it will bind same effects several times and render same meshes several times, which is a waste of resources.

<!--more--> 

For better performance, we want to find a solution which can group up all the mesh instances. In this case, renderer can skip unneccesary steps. However, in order to implement this feature, we need to use more memeroy to store extra mesh information. Here is our solution.


---

# Render Command

Rather than directly drawing all the data, we use a `unit64_t` number to store mesh&effect pair meta information and use them sort meshes. Generally speaking, we store effects index, mesh index, depth index and other render data into the command. Because it is a `unit64_t` value, it is easy for computer to sort them. Then, we simply add some logic to handle same effects and mesh instances.


## Layout
1.  57 - 64  -> Effect Handle Index
2.  47 - 56  -> Depth Value
3.  9  - 16  -> Mesh Handle Index
4.  1  -  8  -> Array Index  (Use this index to get the mesh data such as transforms)

# Result

## ScreenShot

![Left To Right](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR01.gif)


---

![Right To Left](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR02.gif)


You can see meshes are rendered first by effects group and then by distance.

---

## GPU Capture


![Right To Left](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Timeline.png)



- 7 draw calls (Blue); 
- 2 effect changes (Red)
- 2 vertex and index buffers (Green)
- 1 per-frame data  (Gold)
---

##  More

We can encode Render State and Shader into render cmd to get a better performance. 


---

# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation. 

Hold **[Shift]** key to hide the square in the center.

Hold **[Ctrl]** key to change four triangles color.

---

Press **[↑, ↓, ←, →]** keys to move around camera. 

Press **[Q],[E],[Z],[C]** keys to rotate camera left, right, up and down.

Press **[A],[S],[D],[W]** keys to move around default gameobject.





***
 



# Download

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR01.zip) the game.

Version: x64 - DirectX.




