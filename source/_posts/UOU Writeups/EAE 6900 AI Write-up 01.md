---
title: EAE 6900 Game AI - Steering Behaviors
date: 2019-01-31 13:14:00
tags: 
- Entertainment Arts Engineering 
- OpenFrameworks
- Game AI
categories: 
- Game AI
- EAE 6900 - 023
thumbnail: https://i.ytimg.com/vi/5p6OAEVKw-0/maxresdefault.jpg
toc: true
---

# Summary 

This writeup is a review of the first project in game AI class. This project contains a variety of steering behaviors including seeking, wandering, collision, flocking, which explores how to blend different simple behaviors to work out a complex, realistic simulation. 

<!--more--> 

The project is based on openFrameworks. It contains four parts including kinematic movement, arriving behavior, wandering behavior and flocking simulation with collision detection.  I spent much time making all behaviors realistic enough, which is not easy.

I get a further understanding of the way simple behavior parameters can contribute to the final results. The flocking simulation is a good example, which is blended by alignment, separation, wandering, and collision.  Besides that, some implementation from class is not accurate and need to make changes to fit in your architecture. 

---

# Behavioral simulation 

The primary purpose of the simulation is to calculate and updates each unit kinematic properties and use them to create movement.  The movement is reflected by position and rotation in the game.  Our AI algorithm's job is to output factors or steering force, which are used to update kinematic properties. 

## Dynamic and Kinematic

There are two different factor pairs we can use to updates unit’s position and rotation as steering force. One is called kinematic steering, which directly changes velocity and angular speed. Inside the unit, it will add the steering results during each frame.

The other way is called dynamic steering, which uses acceleration. Although they have different updates calculation and slight difference, both methods are robust for a game to create a realistic behavioral simulation. 

## Combination
To create combination behavior, the simplest way is to add all steering force and keep them to limits such as max speed, max acceleration. In a more complicated situation, for example, there is avoiding behavior that we should not move towards an obstacle and pass it. Just adding outputs is not able to create correct results in this case. One way we can use is to assign each behavior a weighted value. When combining these behaviors, we multiply the force with the value.  

---

# Project Architecture 

## Main Flow

The `ofApp` class maintains the game loop flow. It has four `Motion` class relates to four behaviors we created. Each `Motion` has `Init`,`Update`,`Draw`,`OnMousePress` states functions which fit into the main game loop.  Besides functions, it also has several steering behaviors, which are our AI algorithm, as well as units objects to be rendered.

The `Motion` class is defined like below.

```
class Motion
{

//....

    void Init();
    void Update();
    void Draw();
    void OnMousePressed(int x,int y, int button);

    DynamicArrive arrive;
    DynamicAlign align;
    //...

    Boid m_boid;
    Rigidbody targetRigid;

};

```



---
## Steering Model

Generally, the project contains two types of steering behavior base class. One is called `DynamicSteering`, the other is called `KinematicSteering`.All individual behaviors like seeking, wandering, arriving is child class of these two class.  


They all have a virtual function called `getSteering`. This function will be overridden by different individual behaviors class and give the steering force as output. 

As I mentioned above, the output from these two `steering behavior` is different. For example, the output from` KinematicSteering` behavior would only change *Velocity* or *Rotation*.  

```

class DynamicArrive : public DynamicSteering
{
public:
    float timeToTarget;
    float TargetRadius;
    float slowRadius;
    virtual void getSteering(SteeringOutput* output) ;
};


```

---
## Calculation

After setting up steering behaviors, the `Motion` class would take steering data as input and `Updates` based on the behavior.

```C++
    auto deltaTime = ofGetLastFrameTime();
    SteeringOutput steer;

    arrive.getSteering(&steer);

    targetRigid.Orientation = align.character->GetMovementOrientation();
    align.getSteering(&steer);

    m_boid.Update(steer, deltaTime);

```

---


# Individual Behavior 

## Kinematic Motion

In this motion, the unit only goes around the edges. I just assigned an initial velocity to the unit. 



The most tricky thing is to use openFrameworks to rotate the shape in its own space. I think this part is good for us to get familiar with openFrameworks. Below is the results. 



{% youtube PyOoAJA3vMA %}

---

## Seek Steering Behaviors 

**Content**

- Seek location of mouse clicks.
- Oriented the direction of travel 

 In this motion, I used `DynamicSeek`,` DynamicArrive`, `DynamicAlign`, `LookToMovement` combining them together testing. Below is the  `DynamicArrive` with `DynamicAlign`.


{% youtube VSuHjZMbpk8 %}

### Introduction 

  

![Arrival](https://www.red3d.com/cwr/steer/gdc99/figure6.gif)


### Analysis & Thoughts

- There is a tiny issue in the implementation we covered during class. When a unit is about to reach the target, if we do nothing with the steering force, it will not stop. 


**For movement :**

`DynamicArrive` is more realistic, which will slow down the speed significantly when reaching the target. It suits for smooth movement and realistic physics simulation.


`KinematicArrive` would let unit directly stop when reaching the target. It is not good for common movement or physic simulation. But for games design, it is still good enough to control objects.

**For rotation:**

`LookToMovement` creates more realistic visual effects. It always gives you correct and stable rotation, which is based on current velocity.  In our implementation, velocity is gradually calculated by steering force, therefore, just updates the orientation after setting the velocity.

`DynamicAlign` : need some time to slow down the angular speed and its target radius still has a small range, it may cause some delay depending on different parameters you set to the align Behavior.



You may find the rotation delay and the unit cannot stop in following clip. It uses `DynamicArrive`&`DynamicAlign`.


{% youtube K-XECU3AtCM %}


Below is the combination of `DynamicArrive` & `LookToMovement`. You can modify max acceleration to get smoother movement.  

{% youtube YeX2ezpq_RA %}

---

## Wander Steering Behaviors

### Introduction 

The key is to get a small rotation based on current orientation. We use unified `BinomialRandom` to get random results. The results have more chances to be around 0.  By multiple rotation factors, we can get a wandering rotation.

![Wander](https://image.slidesharecdn.com/steeringbehavioursforautonomousagentsmmug-130612055149-phpapp01/95/introduction-to-steering-behaviours-for-autonomous-agents-15-638.jpg?cb=1389697185)

There are two ways to implement wander behaviors. First is to find a target within a specific direction, then seek that target. Second is to change a rotation with a small range first and move forward. 


{% youtube sbk8VpMfmrw %}




### Analysis & Thoughts

- I've tried these two ways to wander behaviors. I think both methods can create same quality by changing parameters. 

- The most important factor creating different movement path is orientation offset. 

- Also, I tried a kinematic and dynamic way to change the movements. The dynamic steering has a better look. However, I think it is because of the parameters.

---



# Flocking Behaviors





## Blender 

Flocking is a combination behavior. This project uses weighted behavior to create the combination. Each behavior has a default weighted value. Certains Steering behavior may change the weighted value in one frame and restore to default values at the end of the frames. For instance, the `AvoidCollision` behavior would raise its weighted value if the unit enters the detection area.

See the picture below.

![Flock](https://www.labri.fr/perso/nrougier/from-python-to-numpy/data/boids.png)



For blending all steering forces. In `FockMotion`, the `Update` method hold different kinds of steerings at the beginning and accumulate together at the end of the function.

```

//for each unit in the flock
// .... Calculation
    SteeringOutput steering_output;
    steering_output.linear += seek_output.linear* (flock.boid_list[i].mRigidbody.wSeek) ;
    steering_output.linear += avoid_output.linear*(flock.boid_list[i].mRigidbody.wAvo) ;
    steering_output.linear += sep_output.linear*(flock.boid_list[i].mRigidbody.wSep) ;
    steering_output.linear += wander_output.linear*(flock.boid_list[i].mRigidbody.wWan) ;
    //....
    
    flock.boid_list[i].Update(steering_output, ofGetLastFrameTime());

```
The unit would reset its weight values into default setting after changing current movement data.  


```
    mRigidbody.Update(steer,deltaTime);
    
    //Check limits ...

    UpdateWeight();
```
---

## Flock

 Flocking behavior needs separation, align and cohesion. I only implement separation and velocity match behavior for this project.
 Theoretically, we need to implement cohesion behavior. One of the project requirements is to seek the center of the flock. It is how cohesion defines.
 
These rules are summarized as follows:   
**Cohesion:** Have each unit steer toward the average position of its neighbors.  

**Alignment:** Have each unit steer to align itself to the average heading of its neighbors.                  

**Separation:** Have each unit steer to avoid hitting its neighbors.

 
 
 You could also change the cohesion / seek center by left or right click the unit — the effects as below.


The first video set `avoid weight value` lower. You can find that units are easy to pass the blue obstacles.

{% youtube cShRdWMvmcI %}

The second video has a higher weight value. You can find that units are hard to pass the blue obstacles.

{% youtube r9kwuM3U1gg %}




---


**Collision Detection:**

I also create collision detection for the flocking behavior. Each unit has its own specific radius checking collision.

If it's heading toward the object, calculate a steering force that will lead the agent around or away from the obstacle based on its current velocity, position, and directing.

Basic Implementation as below

```

// If in collision detection 
 {
 // Change the weight
     character->wAvo= 200.0f;
     character->wWan = 0.1f;


  // If in collision  
     {
         //Flee
     }
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



## Analysis & Thoughts

- After making all units seek two leaders, it turns out that units will finally form into two groups. 

- It is essential to set weighted value correctly to get a realistic flock behavior. Different values may get different results. Balancing values and scaling factors is not convinient for current project.

- In the beginning, I set the separation scale factor too small, and there is no align steering force. Since it has cohesion at the same time, separation steering forces are influenced by cohesion force. All units are get together around the same point. After adding factor value and change the weighted value of separation steering force, It becomes realistic immediately.

- The collision steering force needs to have a higher weighted value to get a higher priority effect. If the value is too small, some units will move into the obstacle and return.   



---


# Controls
Press [q] -> Basic Motion;

Press [w] -> Seek Motion;

Press [e] -> Wander Motion;

Press [r] -> Flock Motion;

In Seek Motion, Click to set a location.

 In Flock Motion, left click to set LeaderA; right click to set LeaderB.
 
---

# Future Improvements in Steering

- Because we need to change values frequently to get a better look for AI, It would be better to integrate UI controller system into the project.


- Polishing structure and simulation result.

---

# References


- Reynolds, C. W. (1999) Steering Behaviors For Autonomous Characters, in the proceedings of Game Developers Conference 1999 held in San Jose, California. Miller Freeman Game Group, San Francisco, California. Pages 763-782. https://www.red3d.com/cwr/steer/gdc99/
- Ian Millington and John Funge. 2009. Artificial Intelligence for Games, Second Edition (2nd ed.). Morgan Kaufmann Publishers Inc., San Francisco, CA, USA.


