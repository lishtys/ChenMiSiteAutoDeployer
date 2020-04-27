---
title: EAE 6320 Engineering II - Assignment 02 Mesh, Effects
date: 2018-09-04 11:42:00
tags: 
- Entertainment Arts Engineering 
- Graphics
- C++
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/assigntwoBanner.jpg
toc: true
---



This assignment requires us to make a **[Mesh]** class and a **[Effect]** class to handle vertices information and shading information separately. Our goal is to support DirectX and OpenGL at the same time and make interfaces for easy use.  

Since there are differences between these two platforms, we have to decide which part of code is platform specific and make the rest of them become platform independent.

<!--more--> 


***
> Click  [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/assignTwoAssignment%2002.zip) download the game.
***


# Process

In order to support two platforms, the <code>Graphics.d3d.cpp</code> and <code>Graphics.gl.cpp</code> supports graphic rendering respectively. We keep current structure for *cMesh* and *cEffect* class. Use <code>xxx.d3d.cpp</code>, <code>xxx.gl.cpp</code> to handle platform specific codes.

Besides, I also add a <code>cMeshData</code> Class as vertex information wrapper. Basically, a vertex would contain different properties such as position, normal, color. 

This class use a struct that contains multiple <code>sMesh</code>. Right now, the struct only has position property. The <code>cMeshData</code> class is platform independent, so it doesn't have <code>d3d.cpp</code> or <code>gl.cpp</code> file.


```C++
		struct sVertex 
		{
			eae6320::Graphics::VertexFormats::sMesh Position;
		};
```


In cMeshData :

```C++
public:
	cMeshData(sVertex* vertices, int size);
	sVertex*  vertices;
	void SetupPositionData(int size);
	sMesh* GetPositionData();
	void ClearPositionData();

private:
	sMesh * position_array = NULL;
```

---

## cMesh

In this assignment, <code>cMesh</code> contains three functions used by Graphics rendering. Because most of the geometry feature is platform specific, these functions are implemented in their platform specific cpp files, <code>cMesh.d3d.cpp</code>, <code>cMesh.gl.cpp</code>

The interfaces like below:



```C++
cResult CleanUp();
void Draw();
cResult InitializeGeometry();
```

Each <code> Graphic.[platform].cpp</code>  has a instance of cMesh like below.



```C++
// Geometry Data
//--------------

eae6320::Graphics::cMesh s_mesh_instance;
```


It also contains a <code>cMeshData</code> instance, which contains vertices array data that needs to be rendered on the screen. Right now, we only care about the position. Below are some interfaces:


```C++
VertexFormats::cMeshData  m_mesh_data;
void CreateMeshData(VertexFormats::sVertex v_data[],int size);
unsigned int InitializeMesh();
```

	
The implementation of<code> CreateMeshData(//...)</code> ,<code>InitializeMesh() </code> are in <code>cMesh.cpp</code> file. It contains two <code>sMesh</code> arrays for two platforms, which is assigned to <code>CMeshData</code>.  The reason to maintain two different arrays is DirectX and OpenGL have different vertices sequence. 




```C++
//...
            
VertexFormats:: sVertex vData[vertexCount];

#ifdef EAE6320_PLATFORM_D3D
			vData[0].Position.x = 0.0f;
			vData[0].Position.y = 0.0f;
			vData[0].Position.z = 0.0f;
#elif EAE6320_PLATFORM_GL
	        vData[0].Position.x = 0.0f;
			vData[0].Position.y = 0.0f;
			vData[0].Position.z = 0.0f;
#endif 
            //...
```


In this way, each time we change vertices, we only need to make changes in one file.  

***


## cEffect

cEffect also has three functions for Graphic class like cMesh. These are the interfaces:



```C++
eae6320::cResult InitializeShadingData();
eae6320::cResult CleanUp();
void BindShadingData();
```
These functions are implemented in <code> cEffect.[platform].cpp </code>. However, some implementation are the same in different platform such as loading shader file, clear shading data.  In this assignment, I put these implementations in <code>cEffect.cpp</code> file.


```C++
eae6320::cResult LoadShadingData();
eae6320::cResult CleanShaderBase();
```

Each <code> Graphic.[platform].cpp </code> has a instance of cEffect like below.


```C++
 // Shading Data
//-------------
eae6320::Graphics::cEffect s_effect_instance;
```


***
## Graphics.[Platform].cpp

After adding implementations of **[Mesh]** and **[Effect]** class, both <code>Graphics.[Platform].cpp</code> call these functions to **Initialize, Draw, BindShader, CleanUp** like below :

```C++
	// Bind the shading data
	
	s_effect_instance.BindShadingData();

	// Draw the geometry
	{
		s_mesh_instance.Draw();
	}
```
***
	
```C++
	// Initialize the shading data
	{
		if ( !( result = s_effect_instance.InitializeShadingData()))
		{
			EAE6320_ASSERT( false );
			goto OnExit;
		}
	}
	// Initialize the geometry
	{
		if (!(result = s_mesh_instance.InitializeGeometry()))
		{
			EAE6320_ASSERT(false);
			goto OnExit;
		}
	}
```
***

```C++
	 result = s_mesh_instance.CleanUp();

	 result = s_effect_instance.CleanUp();

```

***
## Output

![Rect](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/AssignTwoRect.jpg)

***



## GPU Debugger

In this assignment, we need to use analyzers to capture graphic information for a single frame of a running program. We use **Visual Studio Graphics Analyzer** for DirectX and **RenderDoc** for OpenGL.
 

***

### DirectX

- After opening the analyzer, select <code>ClearRenderTargetView()</code>, you would see a black screen. This is because nothing is rendered in this stage.

![ClearRenderTargetView](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/assigntwoD_Clear.png)

- Select the <code>Draw()</code> function and Pipeline stage tab, you could see a single frame like below.

![Draw](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/assigntwoD_Wirframe.png)

***

### OpenGL

You have to download the RenderDoc first and run OpenGL program via RenderDoc. 

- After capturing a frame, select <code>glClear()</code>, you would get a black screen.

![glClear](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/assigntwoO_Clear.png)

- Then you could see the render target by selecting <code>glDrawArrays()</code>.

![glDrawArrays](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/assigntwoO_Darray.png)

- Finally, You can check triangles by checking the VS input or VS output tab.

![glDrawArrays](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/assigntwoO_VSIn.png)


***







# Thoughts & Discussion


* In general, both DirectX and OpenGL platforms share the same graphic render pipeline, which makes it possible to use **[preprocessor macros]** and **[modularize  pipeline stages]** into different files to make <code>Graphics.cpp</code> more platform independent. 

  * In order to shrink the codes of graphic renderer pipeline, we separate graphics functions like shading, mesh into **cMesh** and **cEffect**. Since their responsibility are more specific, it's easier to write platform independent implementation.

  * Besides what we implemented in cMesh and cEffects (Initialize,CleanUp,Draw,Bind), we could continue refactor codes from <code>Graphic.[Platform].cpp</code>. It's possible to merge parts of implementation of **[Submitting Data]** , **[Render Frame Buffer]**, **[Thread]** into one file, which makes easier to maintain codes and clear to understand the project.
  
- As we can see, the **[data format]** is different in OpenGL and DirectX including vertice and **[symbols]**. Besides that, DirectX needs to <code>InitializeViews</code> to setup render target's properties before rendering buffers. 
***

# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation.  You may see slower animation transition like the images below. (When it becomes dark, it become slower than usual).

***

## Output

![Result](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/assigntwooutput.gif)

***
## Implementation 

- In Fragment shader, I get vertex position and change color for each section: <code> if(i_position.x<256) rVal=rVal/2+0.5;  if(i_position.y<256) bVal =bVal/2+0.5; </code>

- The picture contains 12 triangles. Here is the vertex data in DirectX:




```C++
vData[0].Position.x = 0.0f;
vData[0].Position.y = 0.0f;
vData[0].Position.z = 0.0f;

vData[1].Position.x = 0.0f ;
vData[1].Position.y = 0.5f ;
vData[1].Position.z = 0.0f ;
					  
vData[2].Position.x = 0.5f;
vData[2].Position.y = 0.0f;
vData[2].Position.z = 0.0f;

vData[3].Position.x = 0.0f;
vData[3].Position.y = 0.5f;
vData[3].Position.z = 0.0f;

#pragma region Raw Data

//... ...

//... ...

#pragma endregion	

vData[33].Position.x = 0.5f;
vData[33].Position.y = -0.5f;
vData[33].Position.z = 0.0f;

vData[34].Position.x = 0.5f;
vData[34].Position.y = 0.0f;
vData[34].Position.z = 0.0f;

vData[35].Position.x = 1.0f;
vData[35].Position.y = 0.0f;
vData[35].Position.z = 0.0f;
```

***

* This assignment takes me 8 hours to finish. After understanding its main purpose, the main task is to build a stable structure for platforms.

***



# Download

Click  [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/assignTwoAssignment%2002.zip) download the game.

Version: x64 - DirectX.
