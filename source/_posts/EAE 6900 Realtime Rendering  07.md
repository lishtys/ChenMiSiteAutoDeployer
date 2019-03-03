---
title: EAE 6900 Realtime Rendering - Sampler, Mipmap, UV Animation
date: 2019-02-12 15:52:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- Texture
- EAE 6900 
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/GPUMipLevel.gif
toc: true
---

# Summary 

In this post, we implemented a UV animation shader and made further research on mipmap, sampler.

<!--more--> 

---

# Sampler

## Filtering

According to Direct3D documents:

> If the primitive has a texture, Direct3D must use that texture to produce a color for each pixel in the primitive's 2D rendered image.

> For every pixel in the primitive's on-screen image, it must obtain a color value from the texture. This process is called texture filtering.


## Screen Shots

**In our project:**


![No Flitering](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/NoFlitering.png)

![Bilinear Sample](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RT07%20Bilinear.png)


You can see the difference between two filtering modes. The one uses bilinear filtering have smooth blended color than the point sampling one.

---

## Sampling Type 

![GPU Capture](https://slideplayer.com/slide/7371376/24/images/10/Texture+Filtering+Modes.jpg)

## Instance 
Consider a texture that is mapped to geometry with more fragments than texels. If you simply took the closest texel for the texture coordinate in each fragment, then you would get a result like the first image:

![Flitering](https://vulkan-tutorial.com/images/texture_filtering.png)

---

# MipMap


## Instance

Consider having a high-resolution texture on a mesh plane. When this texture is viewed from a close distance, everything is visually in place, however, when viewed from a distance, the texture becomes distorted and out of place. The distortion is also called Moire Pattern.


## Solution

> Mip-maps are primarily used to eliminate aliasing artifacts in textures under minification by pre-calculating smaller versions of the texture.

> Although these additional textures consume GPU memory—about 33 percent more than the original texture—they're also more efficient because more of their surface area fits in the GPU texture cache and its contents achieve higher utilization.


---

## ScreenShots

**Use Mipmap:**

![MipMap](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/MipMap.gif)


No mater how far or close the texture is, the texture always remain good quality. The pixel in the image remain clear to render.


**Disable Mipmap:**

![No MipMap](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/NoMipMap.gif)

When the texture goes far away, it looks distorted. It is because the GPU could not determine which texel to use to make a pixel color.


---

## Mip Level

In GPU Debugger, you can check different mip levels as follows:


![MipMap Level](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/GPUMipLevel.gif)



# Alpha Transparency 


We can use DirectX alpha transparency to make alpha texels as alpha color. We also can use a shader to get the alpha value from a texture and cutoff the texel by threshold defined in the shader. 

These two ways can have different results. If use a shader to a cutoff pixel, a pixel only has two status - On or Off. Therefore the edges of the opaque area become sharp. See effects below.

---

## Standard alpha transparency


![Level](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RT07Trs.png)

## Cutoff Shader


![Level](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RT07Cutoff.png)



You may notice Harvey's hair looks more natural in the first picture.


---

# Animated River Shader 

## UV & Tilling

We know that the vertex uses UV data to get a texel from an image. Therefore to get an animated texture in runtime, we need to change UV over time.

The common way is changing UV value based on time, which means the UV could go beyond [0,1]. In this case, we need to set our sampler mode to tile that the texture will repeat outside of [0,1].


## Assets

First, make a rectangle mesh in Maya and change its v range in [0,0.5]. The mesh would only use the bottom part of the texture. 

![River Plane](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RiverPlane.png)

- The texture in the plane is a square texture.

## Shader

Whether in Vertex Shader or Fragment Shader, calculate offset value over time and updates a new UV called `ScrollUV`. Then use `ScrollUV` get texel from an image.

```
float xScrollValue = speed * g_elapsedSecondCount_simulationTime; 
```

## Screen Shots

![River Anim](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RT07River.gif)


---

# Animated Frames Shader 


We can use a frame sheet to make animated picture. The most common case in the game is creating frames in a particle. Here we just use nine frames from an anime.  

## Assets



First, make an atlas that contains 9 frames as below.

![Atlas](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Frames.jpg)

The mesh only use one frame at a time, which means it takes 1/3 range in X and 1/3 range in Y.


## Shader

Whether in Vertex Shader or Fragment Shader, calculate offset value over time and updates a new UV called `ScrollUV`. 

Then calculate out current frame index and update the `ScrollUV` to that frame.

```
float index = floor(10*g_elapsedSecondCount_simulationTime);
float xScrollValue =index%3*0.33333;
float yScrollValue = floor((index/3.0))*0.33333;
```

## Screen Shots

![Frame Anim](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/FramesRTR.gif)



---

# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation. 

Hold **[Shift]** key to hide the square in the center.

Hold **[Ctrl]** key to change four triangles color.

---

Press **[↑, ↓, ←, →]** keys to move around the camera. 

Press **[Q],[E],[Z],[C]** keys to rotate camera left, right, up and down.

Press **[A],[S],[D],[W]** keys to move around default gameobject.

---

Press **[1, 2]** to select local or world effect object. 


***
 



# Download

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR07_New.zip) the game.

Version: x64 - DirectX.




