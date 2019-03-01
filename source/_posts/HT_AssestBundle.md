---
title: Unity Hotfix Solution (xLua, AssetBundle) - AssetBundle, Updating Strategy
date: 2018-12-06 00:10:00
tags: 
- Unity
- AssetBundle
- Unity Assets Type
categories: 
- Unity 
- Hotfix xLua
thumbnail: https://unity3d.com/sites/default/files/survivalshooter_projectheader.png
toc: true
---

# Summary


In this post, we will talk about the use of AssetBundle, simple game updating (hotfix) model, which used as reference for further learning. It covers: 

- Resources Type ( General Resources, AssetBundle, StreamingAssets, PersistentDataPath
- General Updating Model
- Build and Load
- Optimization of Dependency and Manifest 
- Walk-through Demo

<!--more--> 

***


# Overview

An AssetBundle is an archive file containing platform specific Assets
 (Models, Textures, Prefabs, Audio clips, and even entire Scenes) that can be loaded at runtime. 


> The AssetBundle system provides a method for storing one or more files in an archival format that Unity can index and serialize. AssetBundles are Unity's primary tool for the delivery and updating of non-code content after installation. This permits developers to submit a smaller app package, minimize runtime memory pressure, and selectively load content optimized for the end-user's device.

Therefore we can use it make DLC updating levels. Like in last post, we may want to update game content during social holidays without letting users download whole game again. The other factor is that app store usually has a maximum size limits for different games and we can reduce the pacakge size by AssetBundle.

> The game I've published during working in Beijing, requires the initial package is less than 200 MB in one Android store. Because Google Play Store is banned in China, there are lots of third-party stores having different requirements. 

***

# Resources Types

Before moving on, It's better to analyze different ways to handle assets in Unity. The most common ways are Resources, StreamingAssets, AssetBundle, PersistentData.

## Resources

This is the easiest way to load asset in Unity. You should know that :

- Read Only.
- Built Into `.assets` File In Package.
- Load in Main Thread.

According to official best practices for Resources System it says:


> Don't use it.
> 
> This strong recommendation is made for several reasons:
> 
> Use of the Resources folder makes fine-grained memory management more difficult
> 
> Improper use of Resources folders will increase application startup time and the length of builds
> 
> As the number of Resources folders increases, management of the Assets within those folders becomes very difficult
> The Resources system degrades a project's ability to deliver custom content to specific platforms and eliminates the possibility of incremental content upgrades
> 
> AssetBundle Variants are Unity's primary tool for adjusting content on a per-device basis

***


## Streaming Assets

Pretty like Resources. It usually used to store binary files that is able to be shipped with game.

**Difference**

- Streaming Assets would not be encrypted. Resources Assets would. (Still can be decompiled) 

**Features**

- Read only [Mobile Devices]

***

## PersistentData Assets

Like Streaming Assets.

**Difference**

- Writable/Readable in runtime. Only in runtime.
- In Application Sandbox. (Android can be sdCard)
- No Data Limits. (AssetBundle, Binary File)

**Features**

- Read only [Mobile Devices]

***

# Updating Work-flow

## Model

Below is the prototype of the game [] published.

![Model](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/Unity/Hotfix/FinalSiege-Client%20Data%20(1).png)


> Usually we may prefer zip content package and unzip in client.


# Asset Bundle 

## Build 

Like the flow chart, before updating, you have to create asset package in editor. Generally in a project, developers will build editor to manage build flow.

1.  Assign [Asset Tag] in Editor.
2.  Use `BuildPipeline.BuildAssetBundles(Path, BuildAssetBundleOptions, BuildTarget);` build assets.
3.  Zip AssetsBundle and upload to server.


You can check more details in walk-though Section.


### BuildAssetBundleOptions

- **.None**:Use LZMA compress, small size, slow loading.
- **.UncompressedAssetBundle**: big size, fast loading.
- **.ChunkBasedCompression**:Use LZ4 compress, small size, fast loading.


### BuildTarget

- Platform Specific.

***

## Load

1. Load AssestBundle

  Use `AssetBundle.LoadFromFile`, `UnityWebRequest`,`WWW.LoadFromCacheOrDownload` load 


2. Load Assets
 
``` CSharp
T obj = assetbundle.LoadAsset<T>(assetName);
```

3. Use as normal


>  `AssetBundle.LoadFromFile` is most effective; In Unity 2017, `WWW` class is wrapper of `UnityWebRequest`.

### Resources 

- Assets Bundle [AB Name]
- - Asset1      [Asset Name]
- - Asset2      [Asset Name]
- Manifest

## Dependency

### Example:

Assume material A refers to texture B. Material A is packaged into AssetBundle 1, and texture B is packaged into AssetBundle 2.


[Picture]

In this use case, AssetBundle 2 must be loaded prior to loading Material A out of AssetBundle 1.

This does not imply that AssetBundle 2 must be loaded before AssetBundle 1, or that Texture B must be loaded explicitly from AssetBundle 2. It is sufficient to have AssetBundle 2 loaded prior to loading Material A out of AssetBundle 1.

However, Unity will not automatically load AssetBundle 2 when AssetBundle 1 is loaded. This must be done manually in script code.


### Manifest

To query the dependencies of a specific AssetBundle:

`AssetBundleManifest.GetAllDependencies`, `AssetBundleManifest.GetDirectDependencies`


For instance:

``` C#
  #region Manifest

        var request = UnityWebRequest.GetAssetBundle("AB_Path");
        yield return request.Send();
        var ab = DownloadHandlerAssetBundle.GetContent(request);
        var manifest = ab.LoadAsset<AssetBundleManifest>("AssetBundleManifest");


        var resNameList = manifest.GetAllDependencies("AB_NAME");
        foreach (string resName in resNameList)
        {
           
            AssetBundle.LoadFromFile("PATH"+resName);
        }

        #endregion

```


### Size

The size superbly decreases after using dependency. Check result


You can check more details in walk-though Section.


***



