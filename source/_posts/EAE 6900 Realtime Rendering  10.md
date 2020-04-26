---
title: Realtime Rendering - Sprite, UI
date: 2019-04-21 20:30:00
tags: 
- Entertainment Arts Engineering 
- Realtime Rendering
- Gamma
- EAE 6900
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://i.loli.net/2019/04/22/5cbd3b1b28628.gif
toc: true
---

# Summary 

In this post, I add `sprite` feature to current engine, which can be used to make UI elements.  

<!--more--> 
---

# Sprite

Sprite is a computer graphics term for a two-dimensional bitmap that is integrated into a larger scene, most often in a 2D video game.


# Sprite Vertex Buffer Layout

Since the sprite is a quad with 4 vertices, we can make optimizations for them. Instead of using index buffer and vertex buffer to draw the triangles, we can apply triangle strip to draw a quad. In this case, the engine does't need to store and pass the index buffer to GPU. 

![](https://i.loli.net/2019/04/22/5cbd3f6325e67.png)


The sprite would always remain in the top of the screen, so it doesn't need a third value in z direction. The vertex buffer struct is designed as following.

```
struct sSprite
{
	
	// POSITION
	// 3 floats == 12 bytes
	// Offset = 0		
	float x, y;

	//UV
	float u, v;

};

```

In the buffer, I use following vertex data to make up a quad in triangle strip. 

```
 VertexFormats::sSprite verticesArray[vertices_Count];
{

	verticesArray[0].x = -1; verticesArray[0].y = -1; 
	verticesArray[0].u = 0; verticesArray[0].v =1;
	verticesArray[1].x = -1; verticesArray[1].y = 1;  
	verticesArray[1].u = 0; verticesArray[1].v = 0;
	verticesArray[2].x = 1; verticesArray[2].y = -1; 
	verticesArray[2].u = 1; verticesArray[2].v = 1;
	verticesArray[3].x = 1; verticesArray[3].y = 1;   
	verticesArray[3].u = 1; verticesArray[3].v = 0;
}
```

# Sprite Object Properties

If we directly draw the squad on the screen, it will cover the entire screen. In common game engine, a sprite would have some properties to be modified such as size, position and tint color.  


Similar to the `gameobject`, I create a `spriteObject` used for 2D object render. It uses four values to specify how a sprite represent on the screen. 

``` C++
cSpriteObject::cSpriteObject(float posX, float posY, float width, float height)

```

For the right top EAE icon, it is initialized like below.


```
eae6320::Graphics::cSpriteObject mi_sprite_object(-0.8f,0,0.2f,0.2f);
eae6320::Graphics::cSpriteObject eae_sprite_object(0.0f,0,0.2f,0.2f);

```

# Screen Shot

```
mi_sprite_object(-0.8f,0,0.2f,0.2f)

```

![512x512](https://i.loli.net/2019/04/30/5cc8062edd237.gif)

---

```
mi_sprite_object(0.8f,0,0.2f,0.2f)

```

![512x512](https://i.loli.net/2019/04/30/5cc8077da9a96.gif)

---


![700x700](https://i.loli.net/2019/04/30/5cc808a18694a.gif)

---

# Shader 

Before submitting into GPU, we need a  transform to translate and scale the sprite. The translation factor and scale factor is based on screen size and sprite data.

```
m_transformation= Math::cMatrix_transformation{
				mScalX,0.0f,0.0f,0.0f,
				0.0f,mScalY,0.0f,0.0f,
				0.0f,0.0f,0.0f,0.0f,
				translateX,translateY,0.0f,1.0f
			};
```

```
constantData_perDrawcall.g_transform_localToProject = 
s_dataBeingRenderedByRenderThread->spriteProjectedMatrix[i];
```

Then in sprite vertex shader, we use the projected matrix to transform the quad. In fragment shader, we simply apply texels into the sprite. In common case, we don't apply lighting into our UI elements. 



# Screen Shot

![](https://i.loli.net/2019/04/30/5cc8062edd237.gif)


---


# GPU 


![](https://i.loli.net/2019/04/30/5cc80fec73235.png)


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

> Click [Download](http://chenmi.ink/dwns/MyGame_A10.zip) the game.

Version: x64 - DirectX.




