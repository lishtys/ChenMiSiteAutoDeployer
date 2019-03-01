---
title: EAE 6900 Realtime Rendering - Shader & Transforms
date: 2019-02-09 10:41:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
categories: 
- Game Engine
- EAE 6900 Realtime Rendering
thumbnail: https://images.slideplayer.com/34/8318378/slides/slide_11.jpg
toc: true
---

# Summary 

This writeup is a review of creating four different shaders based on different transforms and improve current performance by combining transformations.


<!--more--> 

- Local space color
- World space color
- Scaling Over Time 
- Effect based on distance


---

# Graphics Pipeline



To create all shader effects we list at the beginning, we have to know the workflow of the general graphics pipeline and know differences between two programming shaders.

## Vertex Shader & Fragment Shader

From two images below, we know that `Vertex Shader` process vertices and calculate transformation to projected space. The vertex's color interpolates to fragment color.  In `Fragment Shader`,  it runs for each fragment shader and uses Vertex Shader's output as the input to do the calculation.


##  Status Flow Layout

This is a simple graphics pipeline layout in OpenGL/Direct3D.

![OpenGL/Direct3D](http://15462.courses.cs.cmu.edu/fall2015content/lectures/05_pipeline/images/slide_046.png
)

## Transformation Flow


![OpenGL/Direct3D](https://images.slideplayer.com/34/8318378/slides/slide_11.jpg)



# Shader Implementation 

## Local Space Color

The object's color is calculated based on vertices' position in model space. In this case, when the object moves, the modified color binds with the object, which is not changed by the world position. In order to implement this effect, fragment shader needs to use the object's local vertex position, which is one of the parameters from vertex shaders.

![](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/Local.gif)




**In Fragment Shader**

```HLSL

void main( 	in const float3 i_vertPosition : POSITION,	//....
)
//....

	float value = floor(frac(i_vertPosition.x) + 0.5);
	rVal = sin(value);

```


## World Space Color

The difference between world space color and local space color is which type of position it uses to calculate. To use position in world space, we can directly use a converted position from the vertex shader. It is also the required data we need to output to fragment shader from the vertex shader.

**In Fragment Shader**

```HLSL

void main( in const float4 i_position : SV_POSITION,//....
)
//....

float gVal= floor(frac(i_position.y) + 0.5);

```
![](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/World.gif)


## Scaling Over Time 


To calculate scaling, we can use a scaling matrix. A scaling matrix is like below.

**In Vertex Shader**
```
		float4x4 scale = {
	s,               0.0f,            0.0f,            0.0f,
	0.0f,            s,               0.0f,            0.0f,
	0.0f,            0.0f,            s,               0.0f,
	0.0f,            0.0f,            0.0f,            1.0f
		};

```

We need to calculate the vertex position based on time in the vertex shader and pass it to fragment shader.

![](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/time.gif)

**In fragment Shader**
```
vertexPosition_world = mul( vertexPosition_local,scale) ;
vertexPosition_world = mul(g_transform_localToWorld, vertexPosition_world);
```



## Color Transition Over Distance


We need to use camera transformation to get the camera world position and calculate the distance between objects. Therefore we add `Math::sVector g_cameraPosition_world`;in `sPerFrameData` and declare the buffer in the shader. Then we get the offset value do some calculation and use `Lerp` function to change the color.



**In Fragment Shader**

```HLSL

float offset = g_cameraPosition_world.z-i_position.z;
float s = offset/ 10;
//....
calculateColor.rgb = lerp(closeColor.rgb, calculateColor.rgb, s);
```


To shrink the object over distance, we do a similar job in vertex shader using the offset as a scale factor.

![](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/distance.gif)

# Combining Transforms


There are three transformations in the project: `LocalToWorld, WorldToCamera, CameraToProjected`. All these transformations are calculated in the vertex shader. However, we can combine these transformations into one `MVP` transformation: `ModelViewProjected`in C++. We are passing these predefined transformations to GPU. It trades memory for realtime calculation per vertex and per fragment.

## Performance Comparison 

There are two instructions of Standard Vertex Shader.

before using `MVP`:

```
vs_4_0
dcl_constantbuffer CB0[8], immediateIndexed
dcl_constantbuffer CB2[4], immediateIndexed
dcl_input v0.xyz
dcl_input v1.xyzw
dcl_output_siv o0.xyzw, position
dcl_output o1.xyzw
dcl_output o2.xyz
dcl_temps 2
mul r0.xyzw, v0.yyyy, cb2[1].xyzw
mad r0.xyzw, cb2[0].xyzw, v0.xxxx, r0.xyzw
mad r0.xyzw, cb2[2].xyzw, v0.zzzz, r0.xyzw
add r0.xyzw, r0.xyzw, cb2[3].xyzw
mul r1.xyzw, r0.yyyy, cb0[1].xyzw
mad r1.xyzw, cb0[0].xyzw, r0.xxxx, r1.xyzw
mad r1.xyzw, cb0[2].xyzw, r0.zzzz, r1.xyzw
mad r0.xyzw, cb0[3].xyzw, r0.wwww, r1.xyzw
mul r1.xyzw, r0.yyyy, cb0[5].xyzw
mad r1.xyzw, cb0[4].xyzw, r0.xxxx, r1.xyzw
mad r1.xyzw, cb0[6].xyzw, r0.zzzz, r1.xyzw
mad o0.xyzw, cb0[7].xyzw, r0.wwww, r1.xyzw
mov o1.xyzw, v1.xyzw
mov o2.xyz, v0.xyzx
ret 
// Approximately 15 instruction slots used
 
```


After using `MVP`:

```
dcl_constantbuffer CB2[8], immediateIndexed
dcl_input v0.xyz
dcl_input v1.xyzw
dcl_output_siv o0.xyzw, position
dcl_output o1.xyzw
dcl_output o2.xyz
dcl_temps 1
mul r0.xyzw, v0.yyyy, cb2[5].xyzw
mad r0.xyzw, cb2[4].xyzw, v0.xxxx, r0.xyzw
mad r0.xyzw, cb2[6].xyzw, v0.zzzz, r0.xyzw
add o0.xyzw, r0.xyzw, cb2[7].xyzw
mov o1.xyzw, v1.xyzw
mov o2.xyz, v0.xyzx
ret 
// Approximately 7 instruction slots used
```



## Order Choice


To get the `MVP` transformation, we multiply all the transformations together. In this case, we have two orders as following sharing the same result.

1. (camera-to-projected * world-to-camera) * local-to-world

1. camera-to-projected * (world-to-camera * local-to-world)

In the project, we choose 1st way because in this case, the `ViewToProjected` transformation only needs to be calculated once. Then in `perDrawcall`, we get the `MVP` by multiplying the `ModelMatrix`. It will be N+1 multiply. However, if we apply for the 2nd order, it 2N multiply.




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

> Click [Download](	https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR0203.zip) the game.

Version: x64 - DirectX.




