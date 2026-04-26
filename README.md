# 🧠 HR Workflow Designer

A **visual workflow builder and execution engine** for designing, configuring, and simulating HR processes using a node-based interface powered by React Flow.

---

## 📌 Overview

HR Workflow Designer is a **graph-based system** that allows users to:

* Build workflows visually using drag-and-drop nodes
* Configure node behavior dynamically
* Define conditional logic (approval branching)
* Execute workflows through a simulation engine
* Visualize execution paths and logs in real time

> This project goes beyond UI — it implements a **complete workflow execution system** with graph traversal and decision logic.

---

## 🚀 Key Features

### 🎨 Workflow Builder

* Drag & drop node creation
* Multiple node types:

    * Start
    * Task
    * Approval
    * Automated
    * End
* Interactive edge connections
* Edge labeling for decision logic

---

### ⚙️ Dynamic Node Configuration

* Schema-driven forms for each node type
* Real-time updates to node data
* Support for:

    * Metadata
    * Custom fields
    * Roles, thresholds
    * Automation parameters

---

### 🔄 Simulation Engine (Core Feature)

* Executes workflows using **graph traversal (DFS)**
* Supports:

    * Conditional branching (Approval nodes)
    * Parallel flows
    * Cycle prevention
* Generates:

    * Execution paths
    * Traversed edges
    * Step-by-step logs

---

### 🎯 Execution Visualization

* Node highlighting during simulation
* Edge highlighting for traversal path
* Step-based progression
* Real-time execution logs

---

### 🧾 Import / Export System

* Export workflows as JSON
* Import workflows from JSON
* Clipboard integration (copy/paste)

---

### ♻️ Undo / Redo System

* Snapshot-based state tracking
* Keyboard shortcuts:

    * `Ctrl + Z` → Undo
    * `Ctrl + Y` → Redo

---

## 🧠 Architecture

### Layered Design

```
UI Layer (React + React Flow)
        ↓
State Layer (Nodes + Edges)
        ↓
Execution Layer (Simulation Engine)
        ↓
Graph Logic (DFS Traversal)
```

---

### Data Flow

```
Sidebar → Drag → Canvas
                 ↓
           Nodes + Edges (Global State)
                 ↓
        Node Selection → Form Panel
                 ↓
          updateNodeField()
                 ↓
         React Flow Re-render

                +
        Simulation Engine
                 ↓
      Graph Traversal (DFS)
                 ↓
     Logs + Paths + Results
                 ↓
        UI Visualization
```

---

## 🧩 Core Components

### 1. Workflow Canvas

* Built using React Flow
* Handles:

    * Node rendering
    * Edge connections
    * Drag & drop
    * Selection logic

---

### 2. Node System

All nodes share a base structure:

```ts
BaseNodeData {
  label: string;
  metadata?: Record<string, string>;
  customFields?: Record<string, string>;
  ...
}
```

Node types:

* `StartNode`
* `TaskNode`
* `ApprovalNode`
* `AutomatedNode`
* `EndNode`

---

### 3. Simulation Engine

```ts
simulateWorkflow(nodes, edges, inputValue)
```

#### Responsibilities:

* Traverse workflow graph
* Apply decision logic (approval threshold)
* Prevent cycles
* Track paths and edges
* Generate logs

#### Output:

```ts
{
  paths: string[][],
  edgesTraversed: string[][],
  logs: string[]
}
```

---

### 4. API Layer

```ts
simulateWorkflowAPI(payload)
```

* Acts as abstraction over simulation logic
* Enables future backend integration

---

### 5. Simulation Panel

* Executes workflow
* Displays logs
* Handles:

    * Validation
    * Import / Export
    * Clipboard actions

---

## 🔍 How Simulation Works

### Step-by-step:

1. Validate workflow:

    * Exactly one Start node
    * At least one End node
    * All nodes (except End) have outgoing edges

2. Traverse graph using DFS

3. Handle node types:

    * **Approval Node**

        * Routes based on threshold:

            * `approved` / `rejected`
    * **Normal Nodes**

        * Traverse all outgoing edges

4. Record:

    * Node path
    * Edge path
    * Execution logs

5. Return structured result

---

## 🎯 Current Capabilities

* Visual workflow creation
* Dynamic node configuration
* Conditional branching
* Graph-based execution
* Execution logs
* Path highlighting
* Undo / Redo
* Import / Export workflows

---

## ⚠️ Limitations

* No persistent storage (local/backend)
* No visual validation indicators on nodes
* No step-by-step animation (currently interval-based)
* No real backend integration for automations
* Type system uses a shared base (less strict per node type)

---

## 🚀 Future Improvements

### 🔥 High Impact

* Graph validation layer (visual errors)
* Step-by-step animated execution
* Persistent storage (DB / local save)
* Backend-driven automation execution

### ⚙️ Enhancements

* Typed node-specific schemas
* Performance optimization (adjacency maps)
* Reusable simulation hooks
* Workflow versioning

---

## 🛠️ Tech Stack

* **React / Next.js**
* **TypeScript**
* **React Flow**
* **Tailwind CSS**
* **Lucide Icons**

---

## 💡 Design Decisions

### 1. Separation of Concerns

* UI ≠ Logic ≠ Data
* Simulation engine is pure and reusable

---

### 2. Graph-Based Modeling

* Workflows represented as directed graphs
* Enables flexible branching and traversal

---

### 3. Flexible Node Schema

* Single base type allows dynamic forms
* Trades strict typing for extensibility

---

### 4. Snapshot-based Undo/Redo

* Reliable state restoration
* Avoids complex diff tracking

---

## 🧠 What This Project Demonstrates

* Graph algorithms (DFS traversal)
* State management in complex UIs
* System design and layering
* Dynamic form handling
* Real-time simulation systems

---

## 📌 Final Status

This project is a:

> ✅ **Fully functional workflow engine prototype**
> ✅ Combines UI + Logic + Simulation
> ✅ Demonstrates system-level thinking

---

## 💬 Context

> “A React Flow-based workflow builder with a fully implemented simulation engine, supporting conditional branching, execution visualization, and modular architecture.”

---

## 👤 Author

**Varshan Manish**

---
