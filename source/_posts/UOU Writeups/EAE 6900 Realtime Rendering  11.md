---
title: 'Realtime Rendering - Specular Light, Point Light'
tags:
  - Entertainment Arts Engineering
  - Realtime Rendering
  - Specular
  - EAE 6900
categories:
  - Game Engine
  - Realtime Rendering
thumbnail: 'https://i.loli.net/2019/04/28/5cc4f743788c2.gif'
cover: 'https://i.loli.net/2019/04/28/5cc4f743788c2.gif'
toc: true
abbrlink: 39899
date: 2019-04-22 14:22:00
---

# Summary 

In this post, I add specular highlight and point light to create more realistic effects. 

- Specular Lighting
- Phong and Blinn Phong
- Point Light
- Multiple Lighting

<!--more--> 
---

# Specular Lighting

A specular highlight is the bright spot of light that appears on shiny objects when illuminated.

A perfectly shiny surface will reflect light from the light source only in the geometrically reflected direction R. This is impossible to happen for a single light source like what we defined in the engine.

![](https://i.loli.net/2019/04/23/5cbe27230d133.png)

# Phong

 It describes the way a surface reflects light as a combination of the diffuse reflection of rough surfaces with the specular reflection of shiny surfaces. 

This model calculates the angle between the Reflection Vector and the View vector. It describes how much of the reflection hits directly on the camera lens. 

The reflection model also includes an ambient term to account for the small amount of light that is scattered about the entire scene.

![image](https://learnopengl.com/img/advanced-lighting/advanced_lighting_over_90.png)


In Phong shading, one must continually recalculate the dot product  **R** dot **V** between a viewer (V) and the beam from a light-source (L) reflected (R) on a surface.

# Blinn-Phong 


Instead of relying on a reflection vector we're using a so called halfway vector that is a unit vector exactly halfway between the view direction and the light direction. The closer this halfway vector aligns with the surface's normal vector, the higher the specular contribution.



![image](https://learnopengl.com/img/advanced-lighting/advanced_lighting_halfway_vector.png)

```
float spec = pow(max(dot(normal, halfwayDir), 0.0), shininess);
```

---

# Specular ScreenShot

![](https://i.loli.net/2019/04/23/5cbe2e4e5fd73.gif)


---


# Point light

A point light is located at a point in space and sends light out in all directions equally. Light intensity is inversely proportional to the square of the distance from the source. This is known as ‘inverse square law’ and is similar to how light behaves in the real world.

![image](https://docs.unity3d.com/uploads/Main/PointLightDiagram.svg)

## Point ScreenShot


![](https://i.loli.net/2019/04/28/5cc4f743788c2.gif)

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

Press **[A],[S],[D],[W]** keys to move around point light.

---


Press **[I],[K],[J],[L]** keys to rotate Light up, down, left and right.

***
 



# Download

> Click [Download](http://chenmi.ink/dwns/MyGame_A11.zip) the game.

Version: x64 - DirectX.




