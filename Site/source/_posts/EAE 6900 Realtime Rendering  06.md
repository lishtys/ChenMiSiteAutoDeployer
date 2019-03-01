---
title: EAE 6900 Realtime Rendering - Texture
date: 2019-02-12 06:38:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- Textrure
categories: 
- Game Engine
- EAE 6900 Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/ScreenShotRT06.gif
toc: true
---

# Summary 

In this post, we add diffuse textures into our engine so that the meshes can use texture, which can give more render details.

<!--more--> 

1.  Add textures assets
2.  Update material struct
2.  Load textures in engine
3.  Load mesh texture coordinate (UV)
3.  Pass textures to GPU
4.  Pass UV to GPU
5.  Updates Shader 

---

# Texture Builder

## Setup

Because we have made many assets builders for this project, John-Paul gives us the texture builder project. For this part, all we need to do is integrating texture builder into current engine systems. Since the builder supports OpenGL & D3D, we need to deal with platform specific files as well as an external library.


Once we set up the texture builder, we also need to add `cTexture` & `cSampler` classes to our engine system. These two files are similar to `cMesh`,`cEffects`,`cMaterial` we created before, which are used to load files and keep as file handles in the engine.

## Material Dependency

For diffuse textures, normal maps and other textures that belongs to materials, we implement the building flow smartly. Rather than specifically list all the textures in the Lua file, the building system will find the textures references in all materials and build the texture assets.


Layout

```

return
{
  tintColor={1,1,1,1},
  effectPath={"Effects/Solid.effect"},
  albedo={"Textures/Yo.png"},
}

```

Later if we have many textures like normal map and specular texture, I would update the layout adding textures type specifically.

---


# Load & Pass

## UV

**Load**
In shader, we need to UV to get a texel from an image. Usually, the UV data come along with vertice data from DDS tools like Maya.

Currently, the `sMesh` only has `Position` & `Color` data, so we need to add `UV` data and export the information from `MayaExportBuilder`. Keep in mind that the UV order is different in OpenGL & D3D.

**Pass**

Then you need to updates `d3dLayoutDescription` to pass new vertex buffer to GPU registers. After that in GPU Debugger, you can see the `TEXCOORD` data information.

![GPU TEXCOORD](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RT06TEXCOORD.png)

---

## Texture

**Pass**

According to D3D documents:

> All buffers—constant, texture, sampler, or other—must have a register defined so the GPU can access them. Each shader stage allows up to 15 constant buffers, and each buffer can hold up to 4,096 constant variables. The register-usage declaration syntax is as follows:

> b*#*: A register for a constant buffer (cbuffer).
>
> t*#*: A register for a texture buffer (tbuffer).
>
> s*#*: A register for a sampler. (A sampler defines the lookup behavior for texels in the texture resource.)


To use a texture in D3D, we need to register `Texture` and `Sampler` buffers to GPU. First, we need to  update `Shader.inc.` Layout to be platform-independent. Then when rendering, we need to bind the buffers. For the `sampler buffer` we could assume we always have one sampler in our game so that it can be bind at the initialization phase. For the `Texture`,  to improve the performance, we should only bind the texture when data changes.





# Shader


After we update `d3dLayoutDescription`, we need to update the `VertexLayout` to match with the vertex buffer data. Then in `Vertex Shader`, you can use semantics`TEXCOORD` to get the buffer from the register, use the data and pass it to `Fragment Shader`

Then in `Fragment Shader`, you can get the image texel and mix with the vertex color by the following shader.

``` HLSL
float4 justColor = SampleTexture2d(g_diffuse_texture, g_diffuse_samplerState, i_uv.xy);
```



# ScreenShot

## Render

![GPU Capture](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/ScreenShotRT06.gif)

---

## Debugger

From the timeline, you can see the textures would only bind when new textures need to be rendered. 

- Red calls are binding new textures.
- Green call is drawing mesh instances.


![GPU Timeline](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/TimeLineRT06.png)




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

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR06.zip) the game.

Version: x64 - DirectX.




