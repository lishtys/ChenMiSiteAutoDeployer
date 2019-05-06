---
title: EAE 6900 Realtime Rendering - Warter Ink Shader
date: 2019-05-05 21:40:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- CubeMap
- EAE 6900
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://i.loli.net/2019/05/06/5ccfb7adc275d.jpg
toc: true
---

# Summary 


In this post, I create a hand drawn effect adding it into the engine. It is a kind of toony shader which shows chinese water ink style and combined with animation effects in the shader.

- Edge Detection
- Color Mixer
- Mask
- Animation



<!--more--> 

---

# Inspiration 


In recent posts, we add several features into the engine. These features are all aimed to create realistic rendering dealing with lighting. So I'm thinking of creating a cool toony shader for this post. I choose to simulate the chinese ink painting style and combine it with some animation effecrs.

![Horse Sketch with Chinese ink by James Phua](https://i.loli.net/2019/05/06/5ccfb15040902.jpg)


----

# Implementation


## Assets


I download a free use model from Unity Asset Store. The model contains a diffuse map and normal map.

As you can see from the picture above, we don't need to use an albedo texture at the beginning. Instead, we simply apply black color to the model.

![Asset](https://i.loli.net/2019/05/06/5ccfb885de8cc.jpg)


## Edge Detection

One of the key points to create a ink painting style shader is to use edge detection, which use a fomula as following:

```
Edge = Normal * View ;
```

When the result is closer to 0, it means the point is closer to the edge. Based on this theory, we can set up a threshold to outline the model. I tried several different calculation and used the below one.

```
if(NOV>threshold)
{
    // Set a Constant factor.
    
}else
{
   //  factor=edge*edge.
}
```

## Inner color

To create a ink effect, we also need to mix color. I decided to recaculate the UV for inner vertices using `cos` and `sin` combined with a ramp texture.

The ramp texture is just a black and white picture randonmly created via photoshop brush.

![](https://i.loli.net/2019/05/06/5ccfba68a9901.jpg)


In shader

```
float2 newUV = float2(xx, yy) / InnnerAdjust.w + InnnerAdjust.xy;
maskColor.a = (maskColor.r + maskColor.g + maskColor.b) / 3;
```

Use this mask texture as well as recaculated UV values. We can define the Alpha value for the inner part. Then put the shader into our horse model. You can see the screen shots


![](https://i.loli.net/2019/05/06/5ccfb7adc275d.jpg)


--------------------- 


## Animation


Then I want to add some animation to the horse. I choose to simulate some animation like following video. You can see most of the models keep static. Only some parts like cloth and hair is moving.

{% youtube g0uhhxN_bbk %}  





At first I tried to create a mask texture based on its diffuse texture. It looks like following.

![](https://i.loli.net/2019/05/06/5ccfba66d9a1f.png)

I end up with giving up this method. One of the reason is because I'm not a good artist. Although I spent some time on producing the mask tetxure. I could not cover exact area that I wanted. The other one is that I tried sampling the texture in Vertex shader use `i_texture[i_uv]`. When using graphic debugger, it seems the `i_texture` is a null reference.


Then I realized, we didn't use vertex color to render. So for this assignment, I use vertex color to mark the animating area. In addition to this, by using maya brush tool, it is easier to create a blend color.


![](https://i.loli.net/2019/05/06/5ccfbc53c3749.jpg)

Of course, if you can get a correct mask texture, please use mask texture to create the effects.


## Calculation


To create an animation effects, we need to use `time` and multiply it by `Sin` and `Cos` function to implement a loop effects.  I hard code a parameter to control the speed and range of vertex movement. Then use the vertex color as the marker,  multiply it by some offset value. `offset*i_vertexColor_local.b`. There for, the horse body and head will remain static and tail would move along time.


```
float4 _Parameters = float4(0.2, 0.2, 0.05, 0.1);
float2 phase = (float2(g_elapsedSecondCount_simulationTime,
g_elapsedSecondCount_simulationTime));

//...

vertexPosition_local.xz = vertexPosition_local.xz + 0.05 * offset*i_vertexColor_local.b;
```

---

# Screeen Shot


![](https://i.loli.net/2019/05/06/5ccfbf7024eff.gif)



# Future

The next step would be adding color into the ink shader and create effect from a realistic model like below.

![](https://i.loli.net/2019/05/06/5ccfbe8ada35e.jpg)

I think it need to find a good way to reduce the color gradation and add more mask channel.


---









