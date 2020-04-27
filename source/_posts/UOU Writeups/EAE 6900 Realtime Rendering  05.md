---
title: Realtime Rendering - Transparent Material
tags:
  - Entertainment Arts Engineering
  - Realtime Rendering
  - EAE 6900
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: >-
  https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR005.gif
toc: true
abbrlink: 7603
date: 2019-02-12 05:29:00
---

# Summary 

In this post, we continue to add features to the materials.  The last post, we implemented materials that contain a tint color., which is solid. In a real game, we often need to use transparent materials to make effects such as glass. 

<!--more--> 


To add a transparent feature, we need to use the alpha channel in color to determine the transparency of the material. After that, we need to care about the render order of transparent material. Instead of replacing the color behind the object, the transparent material's color need to blend with other materials' color so that the transparent material should be rendered after all solid material color, and also, rendered from far to close.

- Use the Alpha Value
- Change Render Order

---

# Render State


To support alpha value, we need to tell d3d context to enable the `AlphaTransparency`. This `RenderState` bit is already defined in the `effect` assets.

```
return
{
  -- flag order 
  --1.DepthBuffering 2.AlphaTransparency 3.DrawingBothTriangleSides
  renderState={1,0,0},
  vfShaders={"shaders/vertex/standard.shader","shaders/fragment/localspace.shader"},

}
```

---


# Render Order

## Dependent Material & Independent Material

A dependent material is whose look would be affected by other materials. Like the material behind it.  Whereas the independent material is a solid material, which would cover materials behind.

Therefore the first step is to split materials into two groups. The independent materials should render as previous way first: close to far. Then dependent materials render from far to close. 



## Render Cmd Encoding - Flag

In the project, I use render state to determine whether the material is independent or not. The render command is sorted from low to high. So we can let the independent material has `0` value in the highest bit of render command; the dependent material has `1` value in the highest bit of render command.  In this way, we don't need to add extra logic for transparency.

``` C++
    auto iDependent= cEffect::s_manager.UnsafeGet(effectIdx)
    ->s_renderState.IsAlphaTransparencyEnabled()?1:0;
```

The layout is different in independent materials and dependent materials.  The independent materials should be sorted by depth first then effect groups and material groups.

** Independent layout**

1.  64 ->  Dependent Flag
1. 56 - 63 -> Effect Handle Index
1. 48 - 55 -> Material Handle Index
2. 38 - 47 -> Depth Value
1. 9 - 16 -> Mesh Handle Index
1. 1 - 8 -> Array Index (Use this index to get the mesh data such as transforms)


** Independent layout**

1.  64 ->  Dependent Flag
2. 54 - 63 -> Depth Value
3. 46 - 53 -> Effect Handle Index
4. 38 - 45 -> Material Handle Index
5. 9 - 16 -> Mesh Handle Index
6. 1 - 8 -> Array Index (Use this index to get the mesh data such as transforms)

## Render Cmd Encoding - Depth Value


We still want to keep the same order rule after adding transparency. So for the dependent material, the depth value encoded into render command is not the `Z_Value`. The depth value is `MAX_Z_Value - normalized_Z_Value`.

``` C++
zVal = round((-zVal - 0.3f) / (1000 - 0.3f) * 1024);

if (iDependent) zVal = 1024 - zVal;
```





# ScreenShot

## Render

![GPU Capture](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR005.gif)


This is the render order. You can see all the independent materials are rendered first. Same independent materials draw from near to far.

Then independent materials are rendered from far to near.

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

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR05_New.zip) the game.

Version: x64 - DirectX.




