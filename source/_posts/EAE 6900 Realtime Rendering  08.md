---
title: EAE 6900 Realtime Rendering - Lighting
date: 2019-02-19 16:30:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- Texture
- EAE 6900
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR08.gif
toc: true
---

# Summary 

In this post, we add the lighting system into our engine.


<!--more--> 

- Add normal data into our mesh
- Calculate color in the Lambert model
- Add directional light object
- Add ambient color
- Update shaders
---

# Normals

## Triangle Normals

The normal of a plane is a vector of length one that is perpendicular to this plane.


## Vertex Normals
By extension, we call the normal of a vertex the combination of the normals of the surroundings triangles. This is handy because, in vertex shaders, we deal with vertices, not triangles, so it's better to have information on the vertex.

![Normal Vevctor - From Opengl tutorial](http://www.opengl-tutorial.org/assets/images/tuto-13-normal-mapping/NormalVector.png)


## Implement

Just as how we added the UV data. We need to add corresponding structure into our `sVertex` and pass data to GPU through `D3D11_INPUT_ELEMENT_DESC` in C++.  

After updating `LayoutInput` file, you could see the normal data in the `GPU Debugger` as following:

![Normals](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RT08Normals.png)


# Light & Ambient Color

## Diffuse Light

 According to  `Lambert's cosine law`, when we compute the color of a pixel, the angle between the incoming light and the surface's normal matters.
 
 Generally speaking, if the light is perpendicular to the surface, it is concentrated on a small surface. If it arrives at a grazing angle, the same quantity of light spreads on a greater surface, which means the point of the surface looks darker.

![Model](https://www.alanzucconi.com/wp-content/uploads/2015/06/Light-Geometry2.png)

- Normals (Blue)
- Light (Orange)

## Lambertian model

![Model](https://i.loli.net/2019/02/20/5c6ca3d7dd89b.jpg)


- diffuse = I*cosθ; 
- cosθ = L*N;

## Shader

```
float cosTheta = dot( normal,lightDirction );

color = LightColor * cosTheta;
```
- ** light direction is goes from the object surface to the light source.**
-  ** Both are unit vector **


In this case, if the surface is in the opposite of the light, the `cosTheta` would become a negative value. While the color value should clamp into [0,1]. Therefore, we clamp `cosTheta` into [0,1].

```
float cosTheta =clamp(dot( normal,lightDirction ));
```

## Implementation

There are three spaces we can do lighting calculation: `local space, world space, view space`.  In my implementation, I choose `world space` for the diffuse light model.  Because it doesn't depend on the view direction and world space is easier to understand.

> When doing a specular light model, I might need to do the calculation in view space. I guess. Guessing.


In C++, we pass the light rotation and color to GPU. 

Since the light data in a frame is a constant data, I put light rotation and light color in `sPerFrameData`


Then in the vertex shader, we transform normals into world space. 

Since we won't have a non-uniform scale or shear in the project, I used a `float3x3` rotation matrix to transform the local normals into world space.

```
const float3 normal_world = mul( rotation_localToWorld, i_normal_local );
```

Finally, we calculate the light color in the fragment shader.


## More 

After testing, I create diffuse lighting function in `shader.inc` for easy use.

```
#define CalculateLighting_multiplicative( i_normal_world )  
// Implementation 
```
**Use**

```
float4 color_multiplicativeLighting 
       = saturate((color_directional + g_ambientColor).rgba);

o_color = textureColor*g_tintColor
        *i_color*color_multiplicativeLighting;
```


---



# Screen Shot

![](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR08.gif)


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


Press **[I],[K],[J],[L]** keys to rotate Light up, down, left and right.

***
 



# Download

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR08.zip) the game.

Version: x64 - DirectX.




