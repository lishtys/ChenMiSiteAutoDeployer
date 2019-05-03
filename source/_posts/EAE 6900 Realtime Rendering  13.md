---
title: EAE 6900 Realtime Rendering - PBR
date: 2019-04-25 20:22:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- PBR
- EAE 6900
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://i.loli.net/2019/04/26/5cc27eb2a06d8.gif
toc: true
---

# Summary 


In this post, we add PBR rendering into our engine and roughness map. 

- Microfacet
- BRDF
- Fresnel
- Roughness Map 



<!--more--> 
---
# Microfacet


According to PBR theory, any plane can be drawn with a small mirror called a microfacets after reaching the microscopic scale. Depending on the roughness of the plane, the orientation of these tiny mirrors can be quite inconsistent.



![image](https://learnopengl.com/img/pbr/microfacets_light_rays.png)


In this case, if a plane is rougher, the micro-planes on this plane are more disorder. The effect of the disordered orientation of these tiny mirrors is that,  the incident light tends to diverge in completely different directions, resulting in a wider range of specular reflections. Whereas, for a smooth plane, the light will generally tend to reflect in the same direction, resulting in a smaller and sharper reflection.



![Roughness](https://learnopengl.com/img/pbr/ndf.png)

----

# BRDF




Almost all real-time rendering pipelines use a model called the Cook-Torrance BRDF.
Cook-Torrance BRDF combines diffuse and specular reflections:

    Fr = Kd*F_lambert +  Ks*F_cook-torrance

BRDF, bidirectional reflection distribution function, 
It accepts a incident (light) direction `ωi`, an exit (observation) direction `ωo`, a plane normal `n` and a parameter `a` used to represent the roughness of the micro-plane as a function of the input parameters.

The BRDF can get the amount of final reflected light on a plane a ray contributes based on material property.  For example, if a plane has a perfectly smooth surface (such as a mirror), the BRDF function returns 0.0 for all incident rays `ωi`, and only one beam has the same appearance as the exit ray `ωo`. The angle of light will get a return value of 1.0.




--------------------- 


# Fresnel


The Fresnel equation  describes the ratio of the reflected light to the portion of the refracted light. This ratio will vary with the angle we observe. 

When the light hits a surface, the Fresnel equation tells us the percentage of the reflected light based on the angle of observation. Using this reflection ratio and energy conservation principle, we can directly derive the part of the light that is refracted and the energy remaining in the light.

![image](https://learnopengl.com/img/pbr/fresnel.png)

```
float F = f0 + (1.0 - f0) * pow(1.0f - VoH, 5.0);
```

# Roughness Map 


The Roughness map specifies how rough a surface is in texels. The sampled roughness value of a surface. A rougher surface will result in a wider, more blurred specular reflection.  While a smoother surface will result in a concentrated and clear specular reflection. 

Some PBR engines use Smoothness Map, which is more intuitive to some artists. When sampling, these values are converted to ( 1.0 - smoothness), Roughness.


Since we only use one channel, in our engine we use `BC4` texture compression.



## Combine

![Model](https://learnopengl.com/img/pbr/textures.png)

---

## Roughness Parameter

We can adjust different rough parameters to modify material properties.


{% youtube mmBGvla46oI %}


---


# Example Screenshots

We use a roughness map like below.

![](https://i.loli.net/2019/04/26/5cc246e39470c.png)


## Screenshots


**with roughness**

{% youtube o21ROUDNRmQ %}


**previous**

{% youtube -u7fsa7GYrI %}




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

> Click [Download](http://chenmi.ink/dwns/MyGame_A13.zip) the game.

Version: x64 - DirectX.




