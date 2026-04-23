"use client";

import React, { useCallback, useRef } from "react";
import StartForm from "@/components/forms/StartForm";
import {
    Node as RFNode,
    applyNodeChanges,
    NodeChange, EdgeChange
} from "reactflow";
import { ConnectionMode } from "reactflow";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider,
    Connection,
    Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import StartNode from "@/components/nodes/StartNode";
import TaskNode from "@/components/nodes/TaskNode";
import ApprovalNode from "@/components/nodes/ApprovalNode";
import AutomatedNode from "@/components/nodes/AutomatedNode";
import EndNode from "@/components/nodes/EndNode";
import {simulateWorkflow, SimulationResult} from "@/lib/simulation/simulateWorkflow";
import SimulationPanel from "@/components/panels/SimulationPanel";
import {
    ApprovalNodeType,
    AutomatedNodeType,
    BaseNodeData,
    EndNodeType,
    StartNodeType,
    TaskNodeType
} from "@/types/nodeTypes";
import TaskForm from "@/components/forms/TaskForm";
import ApprovalForm from "@/components/forms/ApprovalForm";
import AutomatedNodeForm from "@/components/forms/AutomatedForm";
import EndForm from "@/components/forms/EndForm";
import {Play} from "lucide-react";

const initialNodes: RFNode[] = [
    {
        id: "start-1",
        type: "start",
        position: { x: 0, y: 0 },
        data: {
            label: "Start Node",
            description: "",
            assignee: "",
            dueDate: "",
        },
    },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
    start: StartNode,
    task: TaskNode,
    approval: ApprovalNode,
    automated: AutomatedNode,
    end: EndNode,
};

type FlowContentProps = {
    nodes: RFNode[];
    edges: Edge[];
    setNodes: React.Dispatch<React.SetStateAction<RFNode[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    onEdgesChange: (changes: EdgeChange[]) => void;
    setSelectedNodeId: (id: string | null) => void;
    simulationResult: SimulationResult | null;
};

function FlowContent({
                         nodes,
                         edges,
                         setNodes,
                         setEdges,
                         onEdgesChange,
                         setSelectedNodeId,
                     }: FlowContentProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();



    const isValidConnection = (connection: Connection) => {
        const { source, target } = connection;
        if (source === target) return false;
        const targetNode = nodes.find((n) => n.id === target);
        return targetNode?.type !== "start";
    };

    const onConnect = useCallback(
        (connection: Connection) => {
            if (!isValidConnection(connection)) return;

            const sourceNode = nodes.find((n) => n.id === connection.source);

            let label = "";

            if (sourceNode?.type === "approval") {
                const existingOutgoing = edges.filter(
                    (e) => e.source === connection.source
                );

                if (existingOutgoing.length === 0) {
                    label = "approved";
                } else if (existingOutgoing.length === 1) {
                    label = "rejected";
                } else {
                    alert("Approval node can only have 2 outputs");
                    return;
                }
            }

            if (!connection.source || !connection.target) return;

            const newEdge: Edge = {
                id: `${connection.source}-${connection.target}-${Date.now()}`,
                source: connection.source,
                target: connection.target,
                sourceHandle: connection.sourceHandle,
                targetHandle: connection.targetHandle,
                type: "step",
                label,
                labelStyle: {
                    fill: "#fff",
                    fontSize: 10,
                },
                labelBgStyle: {
                    fill: "#111",
                },
            };

            setEdges((eds) => [...eds, newEdge]);
        },
        [nodes, edges, setEdges]
    );

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();

        const type = event.dataTransfer.getData("application/reactflow");
        if (!type) return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: RFNode = {
            id: `${type}-${Date.now()}`,
            type: type,
            position,
            data: {
                label: `${type} node`,
                description: "",
                assignee: "",
                dueDate: "",
            },
        };

        setNodes((nds) => [...nds, newNode]);
    };

    const onNodeClick = (_: React.MouseEvent, node: RFNode) => {
        setSelectedNodeId(node.id);
    };

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
        },
        [setNodes]
    );

    return (
        <div ref={reactFlowWrapper} className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                deleteKeyCode={["Backspace", "Delete"]}
                connectionMode={ConnectionMode.Strict}
                defaultEdgeOptions={{
                    type: "step",
                    style: {
                        stroke: "#9ca3af",
                        strokeWidth: 2,
                    },
                }}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

function CanvasWithPanel() {
    const [nodes, setNodes] = React.useState<RFNode[]>(initialNodes);
    const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [simulationResult, setSimulationResult] = React.useState<{
        path: string[];
        logs: string[];
        result?: { message?: string; summary?: boolean };
    } | null>(null);

    const selectedNode =
        nodes.find((node) => node.id === selectedNodeId) || null;

    const updateNodeField = <
        K extends keyof BaseNodeData
    >(
        nodeId: string,
        field: K,
        value: BaseNodeData[K]
    ) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            [field]: value,
                        },
                    }
                    : node
            )
        );
    };

    const renderForm = () => {
        if (!selectedNode) return null;
        console.log("TYPE:", selectedNode?.type);
        switch (selectedNode.type) {
            case "start":
                return (
                    <StartForm
                        node={selectedNode as StartNodeType}
                        updateNodeFieldAction={updateNodeField}
                    />
                );
            case "task":
                return (
                    <TaskForm
                        node={selectedNode as TaskNodeType}
                        updateNodeFieldAction={updateNodeField}
                    />
                );
            case "approval":
                return (
                    <ApprovalForm
                        node={selectedNode as ApprovalNodeType}
                        updateNodeFieldAction={updateNodeField}
                    />
                );
            case "automated":
                return (
                    <AutomatedNodeForm
                        node={selectedNode as AutomatedNodeType}
                        updateNodeFieldAction={updateNodeField}
                    />
                );
            case "end":
                return (
                    <EndForm
                        node={selectedNode as EndNodeType}
                        updateNodeFieldAction={updateNodeField}
                    />
                );
            default:
                return <p className="text-gray-400 text-sm">No config available</p>;
        }
    };

    const runSimulation = () => {
        try {
            const result = simulateWorkflow(nodes, edges, 50); // inputValue for approval
            setSimulationResult(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    };

    return (
        <div className="flex h-full bg-canvas">

            {/* LEFT SIDE (Canvas + Simulation Panel) */}
            <div className="flex-1 flex flex-col">

                {/* Canvas Area */}
                <div className="flex-1 relative">
                    <FlowContent
                        nodes={nodes}
                        edges={edges}
                        setNodes={setNodes}
                        setEdges={setEdges}
                        onEdgesChange={onEdgesChange}
                        setSelectedNodeId={setSelectedNodeId}
                        simulationResult={simulationResult}
                    />

          {/*          <button*/}
          {/*              onClick={runSimulation}*/}
          {/*              className="*/}
          {/*  absolute*/}
          {/*  bottom-45 right-6*/}
          {/*  bg-green-600 hover:bg-green-700*/}
          {/*  text-white*/}
          {/*  px-4 py-2*/}
          {/*  rounded-full*/}
          {/*  shadow-lg*/}
          {/*  flex items-center gap-2*/}
          {/*  z-50*/}
          {/*"*/}
          {/*          >*/}
          {/*              <Play size={16} />*/}
          {/*              Execute Workflow*/}
          {/*          </button>*/}
                </div>

                {/* 🔥 Simulation Panel (BOTTOM CONSOLE) */}
                <SimulationPanel nodes={nodes} edges={edges} />

            </div>

            {/* RIGHT SIDE PANEL */}
            <div className="w-72 bg-panel border-l border-border text-textPrimary p-4">
                <h2 className="font-bold mb-2">Node Config</h2>

                {selectedNode ? (
                    renderForm()
                ) : (
                    <p className="text-gray-400 text-sm">Select a node</p>
                )}
            </div>

        </div>
    );
}

export default function WorkflowCanvas() {
    return (
        <ReactFlowProvider>
            <CanvasWithPanel />
        </ReactFlowProvider>
    );
}