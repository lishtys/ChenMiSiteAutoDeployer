---
title: EAE 6900 Game AI - Pathfinding
tags:
  - Entertainment Arts Engineering
  - OpenFrameworks
  - Game AI
categories:
  - Game AI
  - EAE 6900 - 023
thumbnail: 'https://i.ytimg.com/vi/5p6OAEVKw-0/maxresdefault.jpg'
toc: true
abbrlink: 63406
date: 2019-02-28 13:14:00
---

# Summary 

This writeup is a report of study research in pathfinding. It covers the following sections.

-  Representing the real world in a graph; 
-  Dijkstra's Algorithm,
-  A* Pathfinding
-  Heuristic search
-  Steer Integration 

<!--more--> 

The project is based on openFrameworks and contains several demos that help explain related analytic. For this part, the project now includes the following features.

1. Map generator. It generates a graph from pictures. One is simpler size, the other is from Google Map.
2. Pathfinding Visualization Editor. It contains implementation of Dijkstra, A* pathfinding algorithm. 
3. The demo also supports different heuristic search setting and performance report.
3. It also has a  map editor, in which you can set start node, destination node as well as obstacle node. 
3. The integration of steer behavior from the last project.



---

# AI Model

In the class, we built a model for our game AI, in which, the pathfinding is between decision making and movement. Just as the picture shows, the Pathfinder is used simply to work out where to move to reach a goal.

To move an entity along a path route in the game, we need to integrate the movement system. This is what we have built in the last update.

Input: Graph search algorithms, including A *, take a “graph” as input. A graph is a set of locations (“nodes”) and the connections (“edges”) between them. Here’s the graph I gave to A*:


![Maps](https://i.loli.net/2019/03/01/5c78a0e7b02d9.gif)

# World Representations

## Quantization and Localization

To begin, we can use a directed non-negative weighted graph to represent a level. The graph contains a set of nodes and connections. Depending on the implementation, the `node` or the `connection` has a weighted value as movement cost. 

Then pathfinding algorithms use this graph to calculate movement cost for each node. After calculation, it successfully finds a path; it would return a list of nodes that are connected to form a path.

However, this is the only conceptual assumption, and real games not only have nodes and connection in the level. Therefore, we need to do some modifications to the level so that the Pathfinder can analyze map data. 

As we know, many RTS games use tile-based graphs extensively. In this project, I've implemented a world representation by using tile graphs. 



## Structure & Implementation


## Structure & Implementation


The map representation part has a `Cell` class as a `Node` in a weighted graph. It has some variables used by pathfinder algorithm such as `cost, known the cost, estimation cost`.
``` C++
    ofPtr<Cell>parent;
    ofVec2f pos;          //Tile Index 
    ofVec2f worldPos;     // Screen Position
    float cost = 1;       // Weighted Value
    float estimate=0, known=0, total=0;
```


Then we create a `TileMap` class. It contains a list of `cells (nodes)` and some util methods used by pathfinder algorithm. 

```C++
    ofPtr<Cell>& GetNode(int x, int y);
    
    std::vector<ofPtr<Cell>> NodeList;

    float width;
    float height;
```

To set up a map, I implemented it in two ways. The first is to set up a map editor simply by rows and columns. It will split the screen into cells. By default, the weighted value is defined by the geometry information.

```C++
void Setup(int col,int row);
```
The other way is to read pixel brightness from an image. By storing the geometry data into a picture, it will contain detailed information.

```C++
void Setup(ofPixels& pix);
{
    //....
    // Use Briteness as cost
    
    float brightness = pix.getColor(x, y).getBrightness() / 255.;
    if (brightness < 0.85)
    { 
        GetNode(x, y)->SetCost(0);
    }
    else if (brightness < 1.) 
    { 
        GetNode(x, y)->SetCost(1. / brightness);
    }
//....
}
```

## Simple Node Map

In the project, the simple node map is based on the picture below. Since we will check the briteness, only white area are connected, which would be considered to be walkable. 


![](https://i.loli.net/2019/03/01/5c7865b0b579c.png)


In the game , it may represent a map like this.

![](https://i.loli.net/2019/03/01/5c7866c4765e5.png)

---

We could also just define unwalkable area using the same map as below, which gives more area to move around in the game.

![](https://i.loli.net/2019/03/01/5c7867c1b34ec.png)


After we convert it into grids. The tile map structure that pathfinder use to compute look like this.

![](https://i.loli.net/2019/03/01/5c78670cdbb0b.png)

---

## Video


You could watch this video to check all the other maps and how the editor works.

![](https://i.loli.net/2019/03/01/5c788e059ef72.gif)

---


# Pathfinding Algorithm






## Dijkstra 

**Dijkstra**


The structure of this algorithm is very similar to the Prim algorithm, which uses a priority queue for traversal. In the Dijkstra algorithm, the priority is a distance value estimate.


**Implementation**

```
def dijkstra(G, s):
    D, P, Q, S = {s: 0}, {}, [(0, s)], set()
    while Q:
        _, u = heappop(Q)
        if u in S:
            continue
        S.add(u)
        for v in G[u]:
            relax(G, u, v, D, P)
            heappush(Q, (D[v], v))
    return D, P

```

---


## A*


**A algorithm**

The A* algorithm is a bit like the concept of heuristic search in artificial intelligence. Rather than blindly searching like DFS and BFS. Nor does it know nothing about the future direction like the Dijkstra algorithm. Because A* adds a potential function, it can also be called the heuristic function h(v).

```
w'(u, v) = w(u, v) - h(u) + h(v)
```

Then you will find that after this adjustment, the algorithm has a preference for the low-cost edge (node). The A* algorithm is equivalent to the Dijkstra algorithm for the modified graph. If his feasible, the algorithm is correct.


**Implementation**

```
def a_star(G, s, t, h):
    P, Q = dict(), [(h(s), None, s)]
    while Q:
        d, p, u = heappop(Q)
        if u in P:
            continue
        P[u] = p
        if u == t:
            return d - h(t), P
        for v in G[u]:
            w = G[u][v] - h(u) + h(v)
            heappush(Q, (d + w, u, v))
    return inf, None


```

The running time of this algorithm is Q((mn)lgn), where m is the number of edges and n is the number of nodes.


## Analysis & Thoughts

###  Project Support

![](https://i.loli.net/2019/03/01/5c7890baac739.gif)


---

The **Dijkstra's algorithm** spends more time, visits more nodes than **A Star algorithm**. It is greedy not motion planning. You can see the difference between these two algorithms. (Especially when getting to the end point.)



When using  **Dijkstra's algorithm**, the visited nodes in `Maze` are like below:

![Dijkstra's algorithm](https://i.loli.net/2019/03/01/5c789d8fba71f.png)

---

When using **A Star algorithm**, the visited nodes in `Maze` are like below:


![A Star algorithm](https://i.loli.net/2019/03/01/5c789d91aa8a4.png)

---




###  Thoughts


 A* is a `single source single destination algorithm`, its time complexity is O(|E|), E is the number of all the edges in the path. 

In other words, A* can be used to calculate the optimal path from one point to another. This also means that A* is suitable for path calculation of the dynamic environment, and the path can be calculated immediately according to the current environment. Correspondingly, Dijkstra’s algorithm and Floyd-Warshall are suitable for calculations in a constant environment.


Given a point on the map, Dijkstra can be used to calculate the optimal path for all other path points on the map at one time. Dijkstra's time complexity is O(|E|+|V|log|V|), where E is the number of edges and V is the number of a vertex. 

From above we can tell that if you need to calculate the left and right paths for all the points on the map at the same time, Dijkstra will be more convenient than using A*. This also explains why Dijkstra is suitable for computing in a static environment because the static environment will not change. 



**Generally**

- A* search: single source single destination, which is faster but depends on the design of the heuristic function. Suitable for RTS in dynamic environments. 

- Dijkstra's Algorithm: single source all destinations, the speed is also faster, no heuristic function is needed, but backtrack is required when creating the navigation table. Pathfinding for static environments.


---



# Heuristics 




## Implementation

```
		switch (ofApp::HeuristicsType)
		{
		case 0:
			this->estimate = dx + dy;
			break;
		case 1:
			this->estimate = max(dx, dy);
			break;
		case 2:
			this->estimate = sqrt(dx * dx + dy * dy);
			break;
		case 3:
			this->estimate = abs(dx - dy) + sqrt(2) * MIN(dx, dy);;
			break;
		case 4:
			float F = sqrt(2) - 1;
			this->estimate=(dx < dy) ? F * dx + dy : F * dy + dx;
			break;
		}

		this->estimate*=ofApp::hWeight;
	}
```

## Result



![A*](https://i.loli.net/2019/03/01/5c78940a2df4d.png)


![Euclidean ](https://i.loli.net/2019/03/01/5c78940d6bc18.png)


---

## Analysis 

  
> - The heuristic function h(n) tells A* an estimate of the minimum cost from any vertex n to the goal. It’s important to choose a good heuristic function.
> 
> - If h(n) is sometimes greater than the cost of moving from n to the goal, then A* is not guaranteed to find a shortest path, but it can run faster.
> - At the other extreme, if h(n) is very high relative to g(n), then only h(n) plays a role, and A* turns into Greedy Best-First-Search.
 
---

- Manhattan distance

```
H(n) = D * (abs ( n.x – goal.x ) + abs ( n.y – goal.y ) )

```


- Diagonal distance

```
h(n) = D * max(abs(n.x - goal.x), abs(n.y - goal.y))
```


-  Euclidean distance
 
```
function heuristic(node) =
    dx = abs(node.x - goal.x)
    dy = abs(node.y - goal.y)
    return D * sqrt(dx * dx + dy * dy)
```

# Steer

## Pathfollowing

In order to navigate thought the path, we need to make the boid move from node to node until it reaches the end of the route. Every point in the path can be seen as a target, so the `seek` and `arrive` behavior can be used. The following function defined as below:

```
class Follow : public Steering
{
public:
	std::vector<ofPtr<Cell> > path;
	float pRadius;
	int curIdx;
	virtual void getSteering(SteeringOutput* output);
};
```

The implementation is quite simple. It will go through the nodes one by one and call `Arrive` behavior.
```
	if (character->Position.distance(targetNode->worldPos) < pRadius)
	{
		if (curIdx < path.size() - 1)
		{
			curIdx++;
		}
	//....
	}
		
	if (curIdx <= path.size() - 1)
	{
	    DynamicArrive arrive;
	    //...
	    arrive.targetPosition = path[path.size() - curIdx - 1]->worldPos;
		arrive.getSteering(output);
	}

```
**Analysis**

When the node become too small like one pixel, the parameters of following behavior need to be precisely set . It may cause the boid move around or back and force when the velocity and range is too large while the cell range is too small. 



## Collision 

I also create collision detection for the flocking behavior. Each unit has its own specific radius checking collision.

If it’s heading toward the object, calculate a steering force that will lead the agent around or away from the obstacle based on its current velocity, position, and directing.

Basic Implementation as below

```C++
// If in collision detection 
 {
 // Change the weight
  // If in collision  //Flee
   
     else
     {
        
        //if move towards the obstacle
        {
            if (abs(character->Velocity.x) <= abs(character->Velocity.y)) {
            // deal in vertical direction
                output->linear = ofVec2f((character->Position.x - element.mRigidbody.Position.x), character->Velocity.y);
                output->linear = output->linear.getNormalized()*(50*((bound) / dist));
            }
            else {
             // deal in horizontal direction
                output->linear = ofVec2f(character->Velocity.x, (character->Position.y - element.mRigidbody.Position.y));
                output->linear = output->linear.getNormalized()*(50*((bound) / dist));
            }
        }
    }
 }

```

## Video 

![Simple Node Map ](https://i.loli.net/2019/03/01/5c78924c04583.gif)

---
![Maze Map](https://i.loli.net/2019/03/01/5c78933a2965f.gif)


---

# Install


1.  Add `ofxDatGui` Project. Download: https://github.com/braitsch/ofxDatGui. 
2.  Copy entire `ofxDatGui` project into your `OpenFrameswork` folder. The path is `OpenFrameswork/addons/ofxDatGui`
2. Use  `projectGenerator-vs/projectGenerator.exe` to Import the `GameAI`project. You should see the `Addons` section has the `ofxDatGui`.
3. Click `Update` and `Open` IDE.




---


# Control

- Use the GUI to change the parameters.
- Algorithm Dropdown: switch Dijkstra's or A Star.
- Map Dropdown: switch editor mode or maps.
- Editor rows/columns: change cell number in editor mode.
- Image Dropdown: show nodes or original picture
- Heuristics Dropdown: switch heuristic calculation
- Show Boid: whether show the boid in A star mode.
- Reload Button: Refresh the map.
- Run Path Finding (Press[R]): Calculate path;
---

In editor mode:
- Pressing Left Button: Drag Start Point.
- Pressing Right Button: Drag End Point.
- Pressing Left Button and Pressing [Z]: Put Obstacle Nodes. (Choose "Show Unwalkable Area" to be visible)
 
---

# Download
	

> Click [Download](https://chenmi-ink-1252570167.cos.na-siliconvalley.myqcloud.com/GameAI.zip) the project.



# References

- Reynolds, C. W. (1999) Steering Behaviors For Autonomous Characters, in the proceedings of Game Developers Conference 1999 held in San Jose, California. Miller Freeman Game Group, San Francisco, California. Pages 763-782. https://www.red3d.com/cwr/steer/gdc99/
- Ian Millington and John Funge. 2009. Artificial Intelligence for Games, Second Edition (2nd ed.). Morgan Kaufmann Publishers Inc., San Francisco, CA, USA.

- Red Blob Games, Heuristics, http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html




