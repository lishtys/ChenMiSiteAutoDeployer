---
title: EAE 6900 Realtime Rendering - CubeMap, Reflection, Metals
date: 2019-04-25 22:12:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- CubeMap
- EAE 6900
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://i.loli.net/2019/04/28/5cc51e8f39bcf.png
toc: true
---

# Summary 


In this post, we add cubemap and reflection into our engine.

- Cube Map
- Reflection
- Metals



<!--more--> 

---

#  Cube Map, Skybox


A cubemap is basically a texture that contains 6 individual 2D textures that each form one side of a cube. A skybox is a (large) cube that encompasses the entire scene and contains 6 images of a surrounding environment, giving the player the illusion that the environment he's in is actually much larger than it actually is. 

We use the texassemble tool, made available by Microsoft and based on the same DirectXTex library that our TextureBuilder uses.  We combine six faces to make a skybox which is used to get reflection color.

![example](https://learnopengl.com/img/advanced/cubemaps_skybox.png)




----

# Environment Mapping Reflection


## Reflection


> Reflection is the property that an object (or part of an object) reflects its surrounding environment e.g. the object's colors are more or less equal to its environment based on the angle of the viewer. A mirror for example is a reflective object: it reflects its surroundings based on the viewer's angle.



![image](https://learnopengl.com/img/advanced/cubemaps_reflection_theory.png)


In shader

```
half3 worldRefl = reflect(viewDir, N);
float3 cReflect = SampleCubeTexture(g_cube_map, g_diffuse_samplerState, worldRefl).rgb;
```


--------------------- 


## Fresnel


The Fresnel equation describes the ratio of the reflected light to the portion of the refracted light. This ratio will vary with the angle we observe. 

We can still use the Schlick approximation as below. The value of `f0` change material proporty. Below is a chart of common values. 


```
float F = f0 + (1.0 - f0) * pow(1.0f - VoH, 5.0);
```

![](https://i.loli.net/2019/04/26/5cc27adb0b9a1.png)

---


# Screenshots

**Gold**

To create a gold, we don't need its diffuse color / material color, which means in our example, the material color is black. We only need to use right Fresnel value as listed above.

{% youtube RN0TVOR5AZs %}

**Standard**

{% youtube 6RgUvFJmVsA %}




---


# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation. 

Hold **[Shift]** key to hide the square in the center.

Hold **[Ctrl]** key to change four triangles color.

---

Press **[↑, ↓, ←, →]** keys to move around the camera. 

Press **[Q],[E],[Z],[C]** keys to rotate camera left, right, up and down.

---


Press **[A],[S],[D],[W]** keys to move around point light

---


Press **[M],[N]** keys to increase/low down roughness factor. 


***
 



# Download

> Click [Download](http://chenmi.ink/dwns/MyGame_A14.zip) the game.

Version: x64 - DirectX.




