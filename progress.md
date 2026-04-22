# HR Workflow Designer – Progress Log

## 📌 Project Overview

A visual HR Workflow Designer built using React + React Flow that allows users to:

* Create workflows using drag-and-drop nodes
* Connect workflow steps visually
* Select and inspect nodes
* Prepare for configurable workflows and simulation

---

## ✅ Completed Features

### 1. Project Setup

* Next.js (App Router) with TypeScript
* Tailwind CSS
* Clean modular folder structure

---

### 2. Workflow Canvas (React Flow)

* Controlled state using:

    * `useNodesState`
    * `useEdgesState`
* Integrated:

    * Background
    * Controls
    * MiniMap
* Wrapped with `ReactFlowProvider`

---

### 3. Drag & Drop Node Creation

* Sidebar with node types:

    * Start
    * Task
    * Approval
    * Automated
    * End
* Implemented:

    * `onDragStart`
    * `onDrop`
    * `onDragOver`
* Nodes spawn at correct cursor position

---

### 4. Custom Node Types

* Built reusable node components:

    * `StartNode`
    * `TaskNode`
    * `ApprovalNode`
    * `AutomatedNode`
    * `EndNode`
* Registered via `nodeTypes`
* Each node visually distinct (color-coded)

---

### 5. Node Selection

* Implemented `onNodeClick`
* Centralized `selectedNode` state
* Visual highlight using `selected` prop
* Selected node shown in panel

---

### 6. Node Deletion

* Enabled keyboard deletion (`Delete` / `Backspace`)
* Nodes can be removed from canvas

---

### 7. Node Connections

* Added `Handle` components to all nodes
* Supports:

    * Incoming edges (`target`)
    * Outgoing edges (`source`)
* Users can visually connect workflow steps

---

### 8. Right-Side Configuration Panel (Basic)

* Panel layout implemented
* Displays selected node details
* Structured for future form integration

---

## 🧠 Current Architecture

### Data Flow

* Sidebar → drag → canvas `onDrop` → node created
* React Flow manages nodes/edges state
* Node click → updates `selectedNode`
* `selectedNode` passed to right-side panel

---

### Key Components

* `WorkflowCanvas.tsx`

    * Core orchestration
    * Handles graph logic, selection, layout

* `FlowContent`

    * React Flow logic
    * Node/edge state + events

* `CanvasWithPanel`

    * Layout wrapper
    * Manages selected node

* `Sidebar.tsx`

    * Draggable node source

* `nodes/*`

    * Custom node UIs with handles

---

## ⚠️ Current Limitations

* No editable node configuration yet
* Node data is static (label only)
* No validation (e.g., Start must be first)
* No workflow serialization
* No API integration
* No simulation panel

---

## 🎯 Next Steps

### Immediate (HIGH PRIORITY)

* Build dynamic Node Configuration Forms
* Allow editing node properties

### Upcoming

* Mock API integration:

    * `/automations`
    * `/simulate`
* Workflow serialization (JSON)
* Simulation panel with execution steps
* Graph validation (missing links, cycles)

---

## 💡 Notes

* Focus on scalability and clean architecture
* Avoid hardcoding forms per node
* Maintain type safety
* Keep UI simple but functional

---
