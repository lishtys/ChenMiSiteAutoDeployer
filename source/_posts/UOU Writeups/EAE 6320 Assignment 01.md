---
title: EAE 6320 Engineering II - 01 Project Setup
date: 2018-08-27 22:18:00
tags: 
- Entertainment Arts Engineering 
- Graphics
- C++
categories: 
- Game Engine
- Realtime Rendering
thumbnail: https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/BannnerEngII01.jpg
toc: true
---



This is the first assignment of the semester, which requires us set up the project and modify the engine instead of actually creating features.


The main purpose of the assignment is to learn how to set up the solution, which involves platform specific code, reference list, project dependencies and use of DLL libraries.  There are several important points you may need to know:

<!--more--> 


***
> Click  [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/EAE6320_A01_MyGame_.zip) download the game.
***

## Key Points

1.	**Exclude platform specific files by adding exclusion rules to correspond files.** In this assignment, the x64 platform should not ~~compile OpenGL~~ codes so make exclusion rules for those files in graphic project.

2.	**Use property sheets to manage projects.**  The sheets order would cause different effects and by setting Marcos. This is a solid and convenient way to handle different types of project location.

3.	**Reference & Dependency is important for linking projects.**  You should only contain necessary references instead of adding all of other projects.  In this assignment,although **[Graphics]** project has headers form **[Asserts]** , **[Time]** class and use namespaces from **[Results]** and **[Math]** project, there is no use case or function calls in the project. Similarly, **[ShaderBuilder]** project contains Graphics namespace but not call any function. Don't need to add these references. In my case, <code>  Encrypted For Now  </code>.

***


*Question For John-Paul Here*

> I don’t understand why we don't add a dependency of [**BuildAssets**] project to the [**Game**] Project. 
>
>
> In my opinion, if we add the reference, the compile & build flow would work solidly and automatically by one click. It helps make the flow faster and prevent from forgetting to update assets. 

***


# Goods

*   The way to generate different shaders for OpenGL and DirectX in one project is convenient and useful.

I am a big fan of auto pipeline, which I think would help improve the whole workflow. While working in a game company, I build an auto art assets importer pipeline for the project. It will import FBX files and generate prefabs, attach scripts, make animation clips and create correspond animatosr with customized animation phases.  

# Process

The assignment took me 10 hours to finish, including reading instructions, linking projects, optional challenges and write-ups. 

***
- The way that set up a single project for loading dynamic DLL and use properties to include the files is elegant.

While setting up projects, I forgot to modify the value of <code>Force Include</code> property. By reading error messages, at first I think it is a reference loss of OpenGL project that causes the problem.
***

I move constant buffer block from four shader into one single .inc file to reduce redeclaration of these properties. This file works as a template to generate shader files.
***


# Personalize

## Controls

Hold **[SPACE]** key to slow down the color animation.  You may see slower animation transition like the images below. (When it becomes dark, it become slower than usual).


## Output

![Result](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/a01.gif)

## Implementation 

- In application Updates function, I add codes listening to user inputs. When pressing down the **[SPACE]** key, it will set the simulate time factor to 0.5f, which makes the animation slow. After releasing the **[SPACE]** key, it will set simulate time factor back to 1.

- In shaders, I use **cos()** & **sin()** to change values in red channel and blue channel. To soften the color value and animation, the calculation value is **scaled by ½, add ½**. A hint form Implementation of [**Half Lambert**](https://developer.valvesoftware.com/wiki/Half_Lambert) 

For an instance, the red curve shows  <code>y=cos(x)</code> and the blue curve shows <code> y=.5 * cos(x)+0.5 </code>. The curve becomes smoother after recaculation.  

<iframe src="https://www.desmos.com/calculator/w124iofh0v?embed" width="500px" height="500px" style="border: 1px solid #ccc" frameborder=0></iframe>

# Expectation 

I focused on C# and Unity development before attending EAE. Since this course is mostly about C++ and graphics rendering, I felt a little worry about this course during the summer.

Now that after finishing the first assignment, I got excited about what I have learned and achieved during this assignment.

Now I’m looking forward to learning more about rendering and C++. For future topics, specifically form what I learn from Interviews with Tencent, these topics would be good to know and have a practice in graphics area:

- Self-defined FBX data structure, support skin animation.
-	Animation Blender. 
-	Q-Tree or Octree - brief implementation




# Download

Click  [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/EAE6320Zip/EAE6320_A01_MyGame_.zip) download the game.

Version: x64 - DirectX. 
