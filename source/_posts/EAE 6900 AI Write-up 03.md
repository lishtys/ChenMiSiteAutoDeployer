---
title: EAE 6900 Game AI - Decision Making
date: 2019-04-14 13:14:00
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

This writeup is a report of study research in Decision Making. It covers the following sections.

-  Decision-Making AI Model
-  Decision Trees
-  Behavior Trees
-  Decision Learning
 

<!--more--> 

The project is based on openFrameworks and contains several demos that help explain related analytic. For this part, the project now includes the following features.

# Decision Tree 

## Introduction
Decision trees are fast, easily implemented, and simple to understand. They are the simplest decision-making technique that we’ll look at, although extensions to the basic algorithm can make them quite sophisticated. They are used extensively to control characters and for other in-game decision making, such as animation control.


Each choice is made based on the character’s knowledge. Because decision trees are often used simple and fast decision mechanisms, characters usually refer directly to the global game state other than having a representation of what they know.

---

## Implementation 


In our project, we define a **Decision Tree** class; whether it is behavior or condition, we consider it a node. The node will execute into the next layer according to the condition results. The **Action** node is the leaf node. Operate an instance of AI to perform some action;

**Structure**

```

class Decision : public DecisionTreeNode
{
public:
    DecisionTreeNode* trueBranch;
    DecisionTreeNode* falseBranch;
    virtual bool GetBranch() = 0;
    virtual DecisionTreeNode* MakeDecision();
};

```


**Condition**

```
class BoidWallDecisionNode :public Decision
{
public:
    Rigidbody* targetRigid;
    Boid* m_boid;
    virtual bool GetBranch();
};

```

**Action**
```
class BoidArriveActionNode :public DecisionTreeAction
{
public:
    Rigidbody* targetRigid;
    Boid* m_boid;
    DynamicArrive* arrive;
    SteeringOutput* steer;
    virtual void DoAction();
};
```
---

When constructing a decision tree, you need to specify a root node, and then to splice in Branch to form a decision tree. In each update, only the root node of the tree needs to be executed, and the corresponding action will be performed according to the situation;


**Make Decision**

```
//.....

    DecisionTreeNode *node = wall_dec_node.MakeDecision();
    auto   actionNode= dynamic_cast<DecisionTreeAction*>(node);
    actionNode->DoAction();
//.....
```
---

## Example

In the Demo, we build the following case. You can see the following figure; the monster will chase for the target boid. When it hits the wall, it will go back to the center. The target boid will respawn after being caught.

![](https://i.loli.net/2019/04/15/5cb447af858c4.jpg)

**Build A Tree**

```
    //SetUp
    wall_dec_node.trueBranch = &wall_action_node;
    wall_dec_node.falseBranch = &target_dec_node;


    target_dec_node.trueBranch = &target_action_node;
    target_dec_node.falseBranch = &arrive_action_node;
```

Related Files : `DecisionTree.h,DecisionTree.cpp, DTDemo.h, DTDemo.cpp`



---

## Thoughts

The decision tree is easy to understand and implement. People don't need the user to understand a lot of background knowledge in the learning process. However, it is hard to build and maintain when the logic becomes complicated.

## Demo

![](https://i.loli.net/2019/04/15/5cb494f7aa17b.gif)

---


# Behavior Tree

The behavior tree makes up for the shortcomings of the state machine, which simplifies the way the logic is pieced together, making it easier for simple-minded humans to write and control the intelligent behavior of the robot. This is the key point of the AI architecture, which enables simple and simple humans to make complex artificial intelligence behaviors.

Simplification is our focus. The behavior of artificial intelligence is the behavioral behavior specified by the human mind, which is expected by the human mind, not uncontrollable. It is what we need to create the logic of AI behavior that humans expect, and the way and process of production are within the tolerance of the human brain. The state machine method of making AI can theoretically achieve any AI, but the complexity is to a certain extent that the human brain can't bear it, but it is invalid or frustrating.


---

## Composite Node 
Composite nodes can be divided into three categories:

The **Selector** Node, which selects the node. When this type of node is executed, it will iterate to execute its child node from beginning to end. If it encounters a child node and returns True after execution, it will stop iterating. The Node also returns True to its upper parent node, otherwise all child nodes. Both return False; then this Node returns False to its parent.

The **Sequence** Node, the sequential node. When this type of Node is executed, it will iteratively execute its child nodes from start to finish. If it encounters a Child Node and returns False after execution, it stops iterating, and the Node returns False to its parent Node node. Otherwise, all Child Nodes return True, and the Node returns True to its Parent Node.

There is also a **Parallel** Node, a concurrent node that concurrently executes all of its Child Node children.

Also, to further increase the complexity and randomness of AI, Selector and Sequence can further provide weighted random variants of nonlinear iterations. For example, the Weight Random Selector, each time executing a different starting point, provides the possibility to execute a different First True Child Node each time. 

---

## Decorator Node 

 Its function is just like its literal meaning: it will additionally modify the result value returned by its Child Node after execution, and then return it to its Parent Node. 
 
 For example, the reverse modifier `Decorator Not` : the result is reversed and returned to the superior processing; 
 
 The failure modifier `Decorator FailUtil` : will be modified and returned to the superior processing.

---

## Updates

After any Node in the behavior tree is executed, the execution result must be reported to the parent node of the upper layer: successful True or failed False. This simple success or failure reporting principle is cleverly used to control the decision making the direction of the entire tree.

The advantage of the behavior tree is here, and it is possible to create a sufficiently complex robot behavior that is expected by humans through some simple operations that humans can cope with.


## Implementation 

## Structure

In behavior tree class, it has `three status` like below.

```
    enum class Status
    {
        Success,
        Failure,
        Running,
    };
```

The behavior tree also has a `Blackboard` class, which use a group of hashmaps to store data.

```
    std::unordered_map<std::string, bool> bools;
    std::unordered_map<std::string, int> ints;
    std::unordered_map<std::string, float> floats;
```

Each node would override the `Update()` function and return the status to its parent. For example, in the selector node, it will loop each child node and return its result.

**Selector**

```
//....

    Status update() override
    {
    

        while (it != children.end()) {
            auto status = (*it)->tick();

            if (status != Status::Failure) {
                return status;
            }

            it++;
        }

        return Status::Failure;
    }
```

---


## Example


![](https://i.loli.net/2019/04/15/5cb44b2f8e7e1.jpg)


**Build A Tree**

```
    chase_node = std::make_shared<ChaseNode>();
    wander_node = std::make_shared<WanderNode>();
    check_near_node = std::make_shared<CheckNearNode>();
    
    //......
    
	auto select= std::make_shared<Selector>();
	auto seq1 = std::make_shared<Sequence>();
	seq1->addChild(check_near_node);
	seq1->addChild(respawn_node);
	select->addChild(seq1);

	//
	auto seq2 = std::make_shared<Sequence>();
	seq2->addChild(chase_node);
	select->addChild(seq2);
	//
	mon_tree.setRoot(select);

```

---

## Demo

![](https://i.loli.net/2019/04/16/5cb4d1d700d35.gif)


---


## Thoghts & Analytics


Conceptually, the decision tree is to make decisions, and the behavior tree is to control behavior. It is two different concepts. The behavior tree pays more attention to change, while the decision tree focuses on choice. Therefore, the behavior tree can customize the AI logic more complicated than the decision tree, and the implementation of the difficulty level behavior tree does not increase much, so it is reasonable to make the decision tree cold.

Behavior trees are easier to write complex AI logic than state machines because of the scalability of a single node, and the ability to build the entire AI tree is within reach of the human brain.


# Decision Learning 

 In machine learning, a decision tree is a predictive model that represents a mapping relationship between an object attribute and an object value. Each node represents an object, and each bifurcation path in the tree represents a certain Possible attribute values, and each leaf node corresponds to the value of the object represented by the path from the root node to the leaf node. Decision trees have only a single output, and if there are multiple outputs, separate decision trees can be built to handle different outputs.
 
---

## ID3
 
 The ID3 algorithm is a kind of decision tree. It is based on the Occam razor principle, that is, to do more with a few things as possible. ID3 algorithm, namely Iterative Dichotomiser 3, iterative binary tree three generations, is a decision tree algorithm invented by Ross Quinlan. The basis of this algorithm is the Occam razor principle mentioned above. The smaller the decision tree, the better the big one. Decision trees, however, do not always generate the smallest tree structure, but a heuristic algorithm. 
 
 
 In information theory, the smaller the expected information, the greater the information gain and the higher the purity. The core idea of the ID3 algorithm is to measure the choice of attributes with information gain and to select the attribute with the largest information gain after splitting to split. The algorithm uses a top-down greedy search to traverse possible decision spaces.
 
 
 
## Implementation

### Attribute Data

**Data processing:** 

This part only uses three attributes of `"Status", "Distance", "In Respawn"`, and then according to whether the value of `distance` is greater than 20, the value of `distance` is classified into two categories. The value of `Chase Node` is the category label, only has `yes` and `no` two values.

 **Code**

```
const unsigned att_num = 3;
const unsigned rule_num = 14;
string decision_tree_name("Chase Node ?");
string attribute_names[] = { "Status", "Distance", "In Respawn" };
string attribute_values[] = { "Visable", "invisible", "Respawn", 
"<=20", ">20", "True", "False", "Yes", "No" };

```

---

**Data**

A line of training data is like {0, 4, 6, 7}.  

The attributes corresponding to the first three column values correspond to the elements in `attribute names`, the last column is the value of the `category tag`. Therefore, {0, 4, 6, 7} means `visiable, distance>20, Not Respawn, Yes` 


---

## Comparation 

In the **ID3Demo.cpp**, I use training data to build a decision tree. The tree structure printed as below.

![](https://i.loli.net/2019/04/15/5cb48e1c04ac4.jpg)


---

![](https://i.loli.net/2019/04/15/5cb4937a5b9d7.jpg)

---

## Demo

![](https://i.loli.net/2019/04/16/5cb4e55ead5b6.gif)

---

## Summary & Analytics

ID3 is a basic decision tree construction algorithm. As a classic decision-making algorithm for decision trees, it has the characteristics of simple structure and clear and easy to understand. Although ID3 is more flexible and convenient, it has the following disadvantages: 

1. Splitting with information gain, the accuracy of splitting may not be split with information gain rate. 
1. Continuous data cannot be processed, only by discretization Continuous data is converted into discrete data.
1. The default value cannot be processed.
1. The decision tree is not pruned, and the over-fitting problem is likely to occur.

---



# Download

Click Download the project.

# Ctrl
 
-  Press [q]: Show Decision Tree Demo;
 
-  Press [w]: Show Behavior Tree & Decision Tree Learning Demo;



# Install

1.  Add `ofxDatGui` Project. Download: https://github.com/braitsch/ofxDatGui. 
2.  Copy entire `ofxDatGui` project into your `OpenFrameswork` folder. The path is `OpenFrameswork/addons/ofxDatGui`
2. Use  `projectGenerator-vs/projectGenerator.exe` to Import the `GameAI`project. You should see the `Addons` section has the `ofxDatGui`.
3. Click `Update` and `Open` IDE.

# References

- Reynolds, C. W. (1999) Steering Behaviors For Autonomous Characters, in the proceedings of Game Developers Conference 1999 held in San Jose, California. Miller Freeman Game Group, San Francisco, California. Pages 763-782. https://www.red3d.com/cwr/steer/gdc99/
- Ian Millington and John Funge. 2009. Artificial Intelligence for Games, Second Edition (2nd ed.). Morgan Kaufmann Publishers Inc., San Francisco, CA, USA.
- Building Decision Trees with the ID3 Algorithm,Andrew Colin, Dr. Dobbs Journal, June 1996