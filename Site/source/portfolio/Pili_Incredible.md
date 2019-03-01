---
title: Unity Hotfix Solution (xLua, AssetBundle) - xLua
date: 2018-12-06 06:10:00
thumbnail: https://unity3d.com/sites/default/files/survivalshooter_projectheader.png
toc: true
---

# Summary


In this post, we will start to add xLua into our project and show how to use inside your project and interact with gameobjects.


- Introduction 
- Installation
- Loader
- Lua Table, Run Lua Function 
- Hotfix
- Lower Level Changes
- Survival Shooter Example


<!--more--> 

***


# Introduction

xLua is a framework adding Lua scripting capability to Unity. At beginning, it is internal solution in Tencent. Now it is public on Github and maintained by Tencent. It has full English documents and tutorial in the Repo.

It has been used in many commercial games, which proves its stability. 


# Installation 

- Unpack the zip package. Drag [xLua] folder , [Plugin] folder into your project.
- After compiling, you can see [Xlua] menu item at the topbar. 

## Quick Start

- To Use Lua Run CSharp Code

```
LuaEnv.DoString("CS.UnityEngine.Debug.Log('hello world')");
```

> DoString parameter is a string, and you can enter any allowable Lua code.  

> A LuaEnv instance is virtual machine to run the commands. Better to be unique globally.

> CS means CSharp, to access any functions or content inside a class, use full namespace path and add 'CS.' at the beginning.


## Loader 

By default, you can use following Lua function run Lua scripts:

```
"require 'luaVariableExample'"
```

To call the lua function, like quick start,

```
LuaEnv.DoString("require 'luaVariableExample'");

```

This is default loader in xLua. It will automatically look for ['xxxx'.lua.txt] file inside [Resources] folder. Then run content inside the file.

For instance, in Assets/Resources/luaExample.lua.txt

```Lua
print("Function From luaExample.txt");

```

After calling `DoString` function, it will print txt in the console. [It's Lua print funtion, not Unity Debug function]

***

## Customize Loader

Use `LuaEnv.AddLoader`. It takes delegate in wich defines how to access lua files.  

For example, I want to load Lua files from SteamingAssets folder not Resources file. 

```  
private byte[] RealLoader(ref string filePath)
    {
      return  Encoding.UTF8.GetBytes(File.ReadAllText(Application.streamingAssetsPath + "/_Assets/_Lua/" + filePath + ".lua.txt"));
    }

```


After using `env.AddLoader(RealLoader);` to add your loader into the virtual maching.  The `require 'luaExample'` scripts would first look file inside [StreamingAssets/_Assets/_Lua/]. If there is no file named   `LuaExample.lua.txt`, it will continue looking inside [Resources] folder.


## Get Table Values, Run Functions

Assuming we have lua file called `luaVariableExample.lua.txt` inside `Resources` folder.


```
ID=1001221001
Name="Chen Mi"
Male= true

MeshData= 
{
	position="1,2,1",
	scale="1",
}

function Test()
	print("This is Test Function!")
end

function Test1(a,b)
	print(a+b)
end
```

In order to get these values, you can use `env.Global.Get<T>("KeyName")`. It also supports struct.


```CSharp
    
    var id=  env.Global.Get<int>("ID");
    var name=  env.Global.Get<string>("Name");
    Debug.Log(" Global Variable ID is "+id+" - Name is "+name);
    
    var md= env.Global.Get<MeshData>("MeshData");
    Debug.Log(md.position+ md.scale);
   
 //.....  
   public class MeshData
{
    public string position;
    public int scale;
} 

```

For functions, it supports using delegates. You need to declare delegates first and give it an attribute `[CSharpCallLua]`

```
    [CSharpCallLua]
    delegate void TestFunction(int a, int b);
```


Then you can call the lua function like below :

```
 LuaFunction lFunc = env.Global.Get<LuaFunction>("Test1");
 lFunc.Call(112, 1);
```

It would give you a result 113.

***

# Hotfix 

## Project Setup

1. Add the HOTFIX_ENABLE macro to enable this feature (to File->Build Setting->Scripting Define Symbols in Unity). 

2. Execute the XLua/Generate Code menu.  Generating Wrapper.

3. [In Editor] Execute the "XLua/Hotfix Inject In Editor" menu when developing a hotfix in the editor.


## Workflow 

### Task

We need to overwrite `Spawn()` in ["Survival Shooter"] 

```
namespace CompleteProject
{
public class EnemyManager : MonoBehaviour
{
    
    void Start ()
    {
        InvokeRepeating ("Spawn", spawnTime, spawnTime);
    }


    void Spawn ()
    {
        if(playerHealth.currentHealth <= 0f)
        {
            return;
        }

        int spawnPointIndex = Random.Range (0, spawnPoints.Length);

        Instantiate (enemy, spawnPoints[spawnPointIndex].position, spawnPoints[spawnPointIndex].rotation);
    }
}
}

```

### Setup

1. Give Class an Attribute `[Hotfix]`.  In our case


```
namespace CompleteProject
{
    [Hotfix]
    public class EnemyManager : MonoBehaviour
 //...   
```
***
2. Give Method an Attribute `[LuaCallCSharp]`.  In our case


```

//....
     [LuaCallCSharp]
        void Spawn() {
//....
        }
```
***

3. Run [Project Setup] step 2,3.

***
4. Write Lua scripts. Use `xlua.hotfix([ClassName],[FunctionName],[NewLuaFunction])`.
In our case

```
xlua.hotfix(CS.CompleteProject.EnemyManager,'Spawn',[NewLuaFunction])
```

Following Lua script just replace the original implementation into [Print Log].

```Lua
xlua.hotfix(CS.CompleteProject.EnemyManager,'Spawn',function(self)

print('LOL')

end)

```


If you need to access private variables in the class from Lua function, you need to use `xlua.private_accessible([ClassName])`. In our case

```Lua
xlua.private_accessible(CS.CompleteProject.EnemyManager)

```
***

Below is the Lua function for Spawning the enemies.


```
xlua.private_accessible(CS.CompleteProject.EnemyManager)
xlua.hotfix(CS.CompleteProject.EnemyManager,'Spawn',function(self)

if self.playerHealth.currentHealth>50 then self.spawnTime = 1
end

mytable = {self.spawnPoints}

local spawnIdx= CS.UnityEngine.Random.Range (0, #mytable)
spawnIdx=math.floor(spawnIdx)

CS.UnityEngine.GameObject.Instantiate (self.enemy, self.spawnPoints[spawnIdx].position, self.spawnPoints[spawnIdx].rotation);

end
)

```

# Low Level

According to the author,


Before hotfix 

```
public class Calc
{
    int Add(int a, int b)
   {
        return a + b
   }
}

```

After hotfix, in IL, it will add codes like this:

```
public class Calc
{
    static Func<object, int, int, int> hotfix_Add = null;
    int Add(int a, int b)
   {
        if (hotfix_Add != null) return hotfix_Add(this, a, b);
        return a + b
   }
}

```

When Lua calls the hotfix, the `hotfix_Add` will point to a reference (function).  If there is no hotfix for this function, it will add a `if statement`.


