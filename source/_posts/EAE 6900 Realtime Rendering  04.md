---
title: EAE 6900 Realtime Rendering - Materials
date: 2019-02-10 04:24:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- EAE 6900 
- Materials
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR04Bannar.gif
toc: true
---

# Summary 

This writeup is a review of implementing material feature into the project. So far in the project, it uses mesh & effect files to define a gameobject's look. The effect files defines which two shader files we used in vertex and fragment. However, In real game engine, the engine have a file called material used to define how a mesh looks.   


<!--more--> 

A material contains what shaders we use and properties (parameters) such as tint color, diffuse texture, normal texture. Usually a material property layout depends on what shader it combines. For example, if the material combine with a shader that uses a texture, tint color, emerssive color, then the material should have these variable slots availiable for artists. 

In our project, we simplify the layout assuming that all materials share the same layout. The steps are listed below.

1. Add material builder to create supported data file
2. Add material class for engine
2. Add material buffer passing to GPU
3. Update shader layout to use material parameters
4. Update render command


---

# Material Builder


Just as all the file builder we created before, the `MaterialBuilder` loads a human readable file and converted to a binary file. The binary file is loaded by the engine.

## Layout

The material file contains a the effect path and several other parameters. As what we said above, a effect path is required for each material. Right now we have not implemented the tetxure module, so the material file only has a color property which is passed to GPU. The layout is defined as following:

**GreenSolid Material**

```Lua
return
{
  tintColor={0,1,0,1},
  effectPath={"Effects/Solid.effect"},

}
```
---


## Assets To Build

Update the `AssetBuildFunctions`, the material builder will automatically build effects based on materials. In `AssetToBuild` list, we don't need `effects` list anymore.

```Lua
effects =
{
},
materials =
{
	{ path = "Materials/redStandard.material"},
	{ path = "Materials/yellowStandard.material"},
	{ path = "Materials/greenStandard.material"},
	{ path = "Materials/whiteLocal.material"},
},

```


## Optional Property

Usually, all the variable would have a default value for its own. Therefore, we use white color as defaut value for color parameter. Since when use mutiply calculation, white color won't affect current color in the shader. In this case, a material doesn't have the `tintColor` property, the `MaterialBuilder` creates a white color for the variable and convert it into a binary file.


**WhiteLocal Material**

```
return
{
  effectPath={"Effects/Local.effect"},
}
```

## Binary

The binary file look like below.

![Binary File](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RT04_Mat_Binary.png)

You can see RGBA color values come first. Then continues with a effect path.


# Render

## cMaterial

After creating the data file, we need to create a `cMaterial` class to use the material data. It is similar to the way we use `cEffect` that after initializing, the class holds a file handle.

The `cGameobject` has a `meshHandle` & a `materialHandle`; The `cMaterial` has a `EffectHandle`; The `cEffect` has two `ShaderHandle`.

The initialization is as following:

```
	if (!(result = Graphics::cMaterial::MaterialFactory("data/Materials/greenStandard.material", s_greenStandard_Mat)))
	{
		EAE6320_ASSERT(false);
		goto OnExit;
	}	
```

## Submission

Right now, we can use material replacing effects. In our `cMyGame`, the gameobject needs a `meshHandle` & a `materialHandle` to define its look.

```
	teapot.LoadRenderInfo(s_meshHandle, s_MaterialHandle);
```

## Material Buffer

In order to use material in shader, we need to pass parameters into GPU in a buffer. So we create a `sPerMaterial` struct as `sPerFrame` data and bind the properties with shaders.


```C++
struct sPerMaterial
{
 Color g_tintColor={1,0,0,1};
};
```

## Render Command

We still need to keep `EffectHandleIndex` to group up all the mesh instances, but we don't want to pass same material several times causing wastes. So we add `MaterialHandleIndex` as secondary order.

**Layout**


1. 57 - 64 -> Effect Handle Index
1. 49 - 56 -> Material Handle Index
2. 39 - 48 -> Depth Value
1. 9 - 16 -> Mesh Handle Index
1. 1 - 8 -> Array Index (Use this index to get the mesh data such as transforms)



# ScreenShot

## Render

The order of things being rendered that demonstrates that draw calls are being sorted by materials.

![ScrrenShot](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/ScreenShotRT04.gif)

## GPU Timeline

This is the event list when drawing red solid material objects and yellow solid material.

![GPU Timeline](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/GPU_EventRT04.png)



- The calls in green are for specific draw calls
- the calls in red show when new material data is being set


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

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320/RTR04.zip) the game.

Version: x64 - DirectX.




