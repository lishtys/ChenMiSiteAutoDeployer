---
title: EAE 6900 Realtime Rendering - Normal Map
date: 2019-04-25 14:22:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- Normal Map
- EAE 6900
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://i.loli.net/2019/04/28/5cc519adbe228.png
toc: true
---

# Summary 

This article briefly explores the principles of normal map and its implementation.

Normal maps can simulate high-mode effects on low-mode models. Although more textures are sampled, it can produce more details than vertices in the model itself, greatly improving the real-time rendering effects.

<!--more--> 
---
# Background

Normal maps are one of the most common textures in game development today. We know that in general, the more faces a model has, the more details you can express. However, since the number of vertices is increased,  the amount of calculation is up. The effect is always inversely proportional to performance. 

Texture mapping can provied some details, but the ordinary texture map only affects the color value of the final pixel stage output. The normal map is to solve the above problem. It increases the level of detail,  but greatly reduces the number of faces of the model.

# Normal Map  

This Normal Map directly stores the normals into the normal map, that is, we directly read the normals from the normal map. You can use it instead of modifying the normals with grayscale values. 

This is completely different from the way the height map works, which is modifying normals based on the grayscale. This kind of normal is not as straightforward as grayscale for production, but it is the real normal map technique.

--------------------- 


## Data, Space


In the shader, the color value is generally in (0,1). In this case, we only need to map the normal values sampled from the normal map. Then, convert it from  (0,1)  to  (-1,1).


```
bumpMap = (bumpMap * 2.0f) - 1.0f;

```


## World Space, Model Space


If our normal map stores the normals in world space, we can directly get the normal value and calculate it in world space. It is the most direct and efficient method, but the normal map  highly dependends on world. For example, we have two models, only difference is the rotation direction.Two normal maps are needed in our case. This is obviously redundant.

Based on the model space,  the normal is tranformed into the world space in calculation,. Although there is one more operation, the same model can share the normal map.


## Tangent space 

Currently, the most common way is to use the Tangent space decribed by tangent and binormal. Its normal is perpendicular to its surface.

The formula for calculating the Tangent space is as follows:


T = normalize(dx/du, dy/du, dz/du)

N = T × normalize(dx/dv, dy/dv, dz/dv)

B = N × T

---

# Example


## Normal Map

First we use a height map as below to create a normal map.  White area is higher than the black area.

![](https://i.loli.net/2019/04/26/5cc2330496414.png)

Then in Photoshop, we change the blue channel into white color. 

> Positive X should correspond to positive red, and positive Y should correspond to positive green. It should look like light is coming from the top right.

The Normal Map I created is like below.

![](https://i.loli.net/2019/05/03/5ccb9e4a70b1e.png)

## Screen Shots

{% youtube 6MqrVM38PnM %}

---

A better example from Nick's normal map is as following:


![](https://i.loli.net/2019/04/26/5cc233f956dda.png)


## Screen Shots

Normal map from height map :

{% youtube RAVV22QyhVU %}


---


## EAE Height Map

Then I used Photoshop creating a custom height like below

![](https://i.loli.net/2019/05/03/5ccba8f33117e.png)

Here is the screen shot

{% youtube VlV89NZyzEg %}


---


# Standard Asset Screen Shots


**Mesh**

We use a plane mesh, a diffuse texture and a normal map to create a tile wall like below.

{% youtube -u7fsa7GYrI %}


---



# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation. 

Hold **[Shift]** key to hide the square in the center.

Hold **[Ctrl]** key to change four triangles color.

---

Press **[↑, ↓, ←, →]** keys to move around the camera. 

Press **[Q],[E],[Z],[C]** keys to rotate camera left, right, up and down.

Press **[A],[S],[D],[W]** keys to move around pointlight gameobject.

---


Press **[I],[K],[J],[L]** keys to rotate Light up, down, left and right.

***
 



# Download

> Click [Download](http://chenmi.ink/dwns/MyGame_A12.zip) the game.

Version: x64 - DirectX.




