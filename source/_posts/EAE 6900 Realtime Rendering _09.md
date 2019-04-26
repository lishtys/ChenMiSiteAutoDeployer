---
title: EAE 6900 Realtime Rendering - sRGB, Gamma Correction
date: 2019-04-21 15:30:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- Gamma
- EAE 6900
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://i.loli.net/2019/04/22/5cbcd4ee5101a.jpg
toc: true
---

# Summary 

Linear rendering means that all inputs to the rendered scene are linear. Generally, the textures are corrected by Gamma, which means that when the texture is sampled into a material, the color values are not linear.

If these textures are calculated in the same way as calculating lighting and image effects, this will result in slight deviations in non-linear space calculations. (And this bias is the reason for Gamma correction.) Linear rendering ensures that both the input and output in the shader are in the correct color space to get a more accurate result.


<!--more--> 

- sRGB
- Gamma Pipeline
- The difference between Linear Rendering and Gamma Rendering

---

# sRGB


A standard format used by personal computers is called sRGB. Its encoding gamma  is about 0.45 (1/2.2). This value works with a device with a display gamma of 2.5. In this case, the deviation after two gamma corrections is 0.45 * 2.5 = 1.125, So that it is visually compensated.


## Nonlinear input

Most of the image files are corrected in advance, that is, the encoding gamma has been used to encode the pixel values when saving the file. It is non-linear. If we use directly in our engine, it is calculated in nonlinear space. The results in calculation and real world are not consistent.


![Normal Vevctor - From Opengl tutorial](http://www.opengl-tutorial.org/assets/images/tuto-13-normal-mapping/NormalVector.png)


---

# Difference

Linear Rendering means that all calculations in the shader are performed in a linear space.

Gamma Rendering is calculated directly in the shader without conversion to linear space.

The calculation is different, which means that, for example, the liting surface will have different response curves and graphics effects.

## Light Falloff 

First, when we use Linear Rendering, performing a Gamma correction will make the lighting range larger. Gamma Rendering blurs the edges This shows the decrease in surface light intensity.


In Unity.

![](https://i.loli.net/2019/04/22/5cbcd4ee5101a.jpg)

---

# Implementation 

- Change linear color to sRGB color.
- Any calculation needs to be done in linear color space. 
    - Background color
    - Constant buffer color : light color, material color
    - Vertex color
    - Texture color



# Screen Shot

![Before](https://i.loli.net/2019/04/22/5cbcd4705ac12.png)

![After](https://i.loli.net/2019/04/22/5cbcd46e7a3f5.png)

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




# Download

> Click [Download](http://chenmi.ink/dwns/MyGame_A09.zip) the game.

Version: x64 - DirectX.




