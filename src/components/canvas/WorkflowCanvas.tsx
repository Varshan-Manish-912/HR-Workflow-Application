"use client";

import React, { useCallback, useRef } from "react";
import {
    Node as RFNode,
    applyNodeChanges,
    NodeChange,
} from "reactflow";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
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

const initialNodes: RFNode[] = [
    {
        id: "start-1",
        type: "start",
        position: { x: 250, y: 100 },
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
    setNodes: React.Dispatch<React.SetStateAction<RFNode[]>>;
    setSelectedNodeId: (id: string | null) => void;
};

function FlowContent({
                         nodes,
                         setNodes,
                         setSelectedNodeId,
                     }: FlowContentProps) {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();

    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges((eds) => addEdge(connection, eds));
        },
        [setEdges]
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

    const selectedNode =
        nodes.find((node) => node.id === selectedNodeId) || null;

    const updateNodeField = (
        nodeId: string,
        field: string,
        value: string
    ) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? {
                        ...node,
                        data: { ...node.data, [field]: value },
                    }
                    : node
            )
        );
    };

    return (
        <div className="flex h-full">
            {/* Canvas */}
            <div className="flex-1">
                <FlowContent
                    nodes={nodes}
                    setNodes={setNodes}
                    setSelectedNodeId={setSelectedNodeId}
                />
            </div>

            {/* Right Panel */}
            <div className="w-72 border-l p-4 bg-gray-50">
                <h2 className="font-bold mb-2">Node Config</h2>

                {selectedNode ? (
                    <div className="space-y-3">
                        <p className="font-medium">Edit Task</p>

                        <input
                            className="w-full border px-2 py-1 rounded"
                            placeholder="Title"
                            value={selectedNode.data?.label || ""}
                            onChange={(e) =>
                                updateNodeField(selectedNode.id, "label", e.target.value)
                            }
                        />

                        <input
                            className="w-full border px-2 py-1 rounded"
                            placeholder="Description"
                            value={selectedNode.data?.description || ""}
                            onChange={(e) =>
                                updateNodeField(selectedNode.id, "description", e.target.value)
                            }
                        />

                        <input
                            className="w-full border px-2 py-1 rounded"
                            placeholder="Assignee"
                            value={selectedNode.data?.assignee || ""}
                            onChange={(e) =>
                                updateNodeField(selectedNode.id, "assignee", e.target.value)
                            }
                        />

                        <input
                            type="date"
                            className="w-full border px-2 py-1 rounded"
                            value={selectedNode.data?.dueDate || ""}
                            onChange={(e) =>
                                updateNodeField(selectedNode.id, "dueDate", e.target.value)
                            }
                        />
                    </div>
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