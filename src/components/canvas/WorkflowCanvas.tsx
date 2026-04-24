"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import EdgePanel from "@/components/panels/EdgePanel";
import StartForm from "@/components/forms/StartForm";
import ReactFlow, {
    applyNodeChanges,
    Background,
    Connection,
    ConnectionMode,
    Controls,
    Edge,
    EdgeChange,
    MarkerType,
    MiniMap,
    Node as RFNode,
    NodeChange,
    ReactFlowProvider,
    useEdgesState,
    useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";

import StartNode from "@/components/nodes/StartNode";
import TaskNode from "@/components/nodes/TaskNode";
import ApprovalNode from "@/components/nodes/ApprovalNode";
import AutomatedNode from "@/components/nodes/AutomatedNode";
import EndNode from "@/components/nodes/EndNode";
import {SimulationResult} from "@/lib/simulation/simulateWorkflow";
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
import {ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle,} from "react-resizable-panels";
import {Redo2, Undo2} from "lucide-react";

const initialNodes: RFNode[] = [
    {
        id: "start-1",
        type: "start",
        position: { x: 0, y: 0 },
        data: {
            label: "",
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
    highlightedNodeIds: string[];
    activeStep: number;
    activePathIndex: number;
    takeSnapshot: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    setSelectedEdgeId: (id: string | null) => void;
};

function FlowContent({
                         nodes,
                         edges,
                         setNodes,
                         setEdges,
                         onEdgesChange,
                         setSelectedNodeId,
                         highlightedNodeIds,
                         activeStep,
                         activePathIndex,
                         takeSnapshot,
                         undo,
                         redo,
                         canUndo,
                         canRedo,
                         setSelectedEdgeId,
                         simulationResult
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

            takeSnapshot(); // Snapshot right before connecting
            setEdges((eds) => [...eds, newEdge]);
        },
        [nodes, edges, setEdges, takeSnapshot]
    );

    const onDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    // 🔥 PUT THIS ABOVE onDrop (same file)
    const getDefaultData = (type: string) => {
        switch (type) {
            case "start":
                return {
                    label: "",
                    metadata: {},
                };

            case "task":
                return {
                    label: "",
                    description: "",
                    assignee: "",
                    dueDate: "",
                    customFields: {},
                };

            case "approval":
                return {
                    label: "",
                    role: "",
                    threshold: undefined,
                };

            case "automated":
                return {
                    label: "",
                };

            case "end":
                return {
                    label: "",
                };

            default:
                return { label: "" };
        }
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
            type,
            position,
            data: getDefaultData(type), // 🔥 FIX
        };

        takeSnapshot();
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

    // Event hooks for capturing position changes and deletions
    const onNodeDragStart = useCallback(() => {
        takeSnapshot();
    }, [takeSnapshot]);

    const onNodesDelete = useCallback(() => {
        takeSnapshot();
    }, [takeSnapshot]);

    const onEdgesDelete = useCallback(() => {
        takeSnapshot();
    }, [takeSnapshot]);

    const highlightedNodes = nodes.map((node) => {
        // ✨ CHANGE: Use slice to leave a trail of highlighted nodes behind the active step
        const isActive =
            activeStep >= 0 &&
            highlightedNodeIds.slice(0, activeStep + 1).includes(node.id);

        return {
            ...node,
            style: isActive
                ? {
                    border: "2px solid #22c55e",
                    boxShadow: "0 0 10px #22c55e",
                }
                : {},
        };
    });

    const currentEdges =
        simulationResult?.edgesTraversed?.[activePathIndex] || [];

    const highlightedEdges = edges.map((edge) => {
        const isActive =
            activeStep > 0 &&
            currentEdges.slice(0, activeStep).includes(edge.id);

        return {
            ...edge,
            style: isActive
                ? { stroke: "#22c55e", strokeWidth: 3 }
                : {
                    stroke: "#e5e7eb",
                    strokeWidth: 1.5,
                    opacity: 0.8,
                },
            animated: isActive,
        };
    });

    return (
        <div ref={reactFlowWrapper} className="w-full h-full relative">
            {/* Undo / Redo Overlay */}
            <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1 bg-[#111827]/90 backdrop-blur-md border border-[#1f2937] rounded-xl p-1 shadow-lg">

                    {/* Undo */}
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        title="Undo (Ctrl + Z)"
                        className="
        flex items-center justify-center
        w-8 h-8
        rounded-lg
        text-white
        hover:bg-[#1f2937]
        active:bg-[#374151]
        disabled:opacity-30 disabled:cursor-not-allowed
        transition-all duration-150
        active:scale-90
      "
                    >
                        <Undo2 size={16} />
                    </button>

                    {/* Redo */}
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        title="Redo (Ctrl + Y)"
                        className="
        flex items-center justify-center
        w-8 h-8
        rounded-lg
        text-white
        hover:bg-[#1f2937]
        active:bg-[#374151]
        disabled:opacity-30 disabled:cursor-not-allowed
        transition-all duration-150
        active:scale-90
      "
                    >
                        <Redo2 size={16} />
                    </button>

                </div>
            </div>

            <ReactFlow
                nodes={highlightedNodes}
                edges={highlightedEdges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onNodeDragStart={onNodeDragStart}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                deleteKeyCode={["Backspace", "Delete"]}
                connectionMode={ConnectionMode.Strict}
                defaultEdgeOptions={{
                    type: "smoothstep",
                    style: {
                        stroke: "#9ca3af",
                        strokeWidth: 1.5,
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color:"#e5e7eb",
                    },
                }}
                connectionLineStyle={{
                    stroke: "#9ca3af",
                    strokeWidth: 2,
                    strokeDasharray: "5 5", // 🔥 dotted
                }}
                proOptions={{ hideAttribution: true }}
                onEdgeClick={(_, edge) => setSelectedEdgeId(edge.id)}
                onPaneClick={() => {
                    setSelectedNodeId(null);
                    setSelectedEdgeId(null);
                }}
                fitView
            >
                <Background />
                <Controls />
                <div>

                </div>
                <MiniMap
                    style={{ backgroundColor: "#0b0f17"}}
                    nodeColor={(node) => {
                        switch (node.type) {
                            case "start":
                                return "#22c55e"; // green
                            case "task":
                                return "#3b82f6"; // blue
                            case "approval":
                                return "#a855f7"; // amber
                            case "automated":
                                return "#f59e0b"; // purple
                            case "end":
                                return "#ef4444"; // red
                            default:
                                return "#6b7280"; // gray fallback
                        }
                    }}
                    nodeStrokeColor="#1f2937"
                    nodeBorderRadius={2}
                />
            </ReactFlow>
        </div>
    );
}

function CanvasWithPanel() {
    const [nodes, setNodes] = useState<RFNode[]>(initialNodes);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
    const [activePathIndex, setActivePathIndex] = useState(0);
    const [activeStep, setActiveStep] = useState<number>(-1);

    // --- Undo / Redo State Tracking ---
    const [past, setPast] = useState<{ nodes: RFNode[]; edges: Edge[] }[]>([]);
    const [future, setFuture] = useState<{ nodes: RFNode[]; edges: Edge[] }[]>([]);

    const nodesRef = useRef(nodes);
    const edgesRef = useRef(edges);

    // Keep refs in sync to capture latest state reliably inside callbacks
    useEffect(() => {
        nodesRef.current = nodes;
        edgesRef.current = edges;
    }, [nodes, edges]);

    const takeSnapshot = useCallback(() => {
        setPast((p) => [...p, { nodes: nodesRef.current, edges: edgesRef.current }]);
        setFuture([]); // Clear future on new action
    }, []);

    const undo = useCallback(() => {
        setPast((p) => {
            if (p.length === 0) return p;
            const previous = p[p.length - 1];
            const newPast = p.slice(0, p.length - 1);

            setFuture((f) => [{ nodes: nodesRef.current, edges: edgesRef.current }, ...f]);

            setNodes(previous.nodes);
            setEdges(previous.edges);

            return newPast;
        });
    }, [setNodes, setEdges]);

    const redo = useCallback(() => {
        setFuture((f) => {
            if (f.length === 0) return f;
            const next = f[0];
            const newFuture = f.slice(1);

            setPast((p) => [...p, { nodes: nodesRef.current, edges: edgesRef.current }]);

            setNodes(next.nodes);
            setEdges(next.edges);

            return newFuture;
        });
    }, [setNodes, setEdges]);

    // Keyboard bindings for standard hotkeys
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement;
            // Prevent triggering Undo/Redo if user is typing in a form field
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
                return;
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
                event.preventDefault();
                if (event.shiftKey) {
                    if (future.length > 0) redo();
                } else {
                    if (past.length > 0) undo();
                }
            } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
                event.preventDefault();
                if (future.length > 0) redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, past.length, future.length]);

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

    useEffect(() => {
        if (!simulationResult) return;

        let step = -1;
        let pathIndex = 0;

        const interval = setInterval(() => {
            const currentPath = simulationResult.paths[pathIndex];

            // Total visual steps = Nodes + Edges
            const maxSteps = currentPath.length * 2 - 1;

            if (step < maxSteps - 1) {
                // 1. Walk through the path
                step++;
                setActivePathIndex(pathIndex);
                setActiveStep(step);
            }
            else if (step === maxSteps - 1) {
                // 2. Pause on the final node so the user can see it finished
                step++;
            }
            else if (step === maxSteps) {
                // 3. Clear the board briefly before starting the next route
                setActiveStep(-1);
                step++;
            }
            else {
                // 4. Move to the next route (or finish)
                pathIndex++;

                if (pathIndex >= simulationResult.paths.length) {
                    clearInterval(interval);
                    return;
                }

                step = 0;
                setActivePathIndex(pathIndex);
                setActiveStep(step);
            }
        }, 500); // 500ms gives a clean, rapid progression

        return () => clearInterval(interval);
    }, [simulationResult]);

    const renderForm = () => {
        if (!selectedNode) return null;
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

    const rightPanelRef = useRef<ImperativePanelHandle | null>(null);
    const bottomPanelRef = useRef<ImperativePanelHandle | null>(null);

    return (
        <PanelGroup direction="horizontal" className="h-full bg-canvas">
            {/* LEFT SIDE (Canvas + Simulation) */}
            <Panel defaultSize={75} minSize={50}>
                <PanelGroup direction="vertical">
                    {/* Canvas */}
                    <Panel defaultSize={80}>
                        <FlowContent
                            nodes={nodes}
                            edges={edges}
                            setNodes={setNodes}
                            setEdges={setEdges}
                            onEdgesChange={onEdgesChange}
                            setSelectedNodeId={setSelectedNodeId}
                            simulationResult={simulationResult}
                            highlightedNodeIds={
                                simulationResult?.paths?.[activePathIndex] || []
                            }
                            activeStep={activeStep}
                            activePathIndex={activePathIndex}
                            takeSnapshot={takeSnapshot}
                            undo={undo}
                            redo={redo}
                            canUndo={past.length > 0}
                            canRedo={future.length > 0}
                            setSelectedEdgeId={setSelectedEdgeId}
                        />
                    </Panel>

                    <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-500 cursor-row-resize" />

                    {/* Simulation Panel */}
                    <Panel ref={bottomPanelRef} defaultSize={20} minSize={10} collapsible>
                        <div className="relative h-full">
                            <SimulationPanel
                                nodes={nodes}
                                edges={edges}
                                setActiveStep={setActiveStep}
                                setSimulationResult={setSimulationResult}
                                bottomPanelRef={bottomPanelRef}
                                setNodes={setNodes}
                                setEdges={setEdges}
                            />
                        </div>
                    </Panel>
                </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-500 cursor-col-resize" />

            {/* RIGHT CONFIG PANEL */}
            <Panel ref={rightPanelRef} defaultSize={25} minSize={20} collapsible>
                <PanelGroup direction="vertical">

                    {/* Node Config */}
                    <Panel defaultSize={60} minSize={30} className="overflow-hidden">
                        <div className="relative h-full bg-panel p-4 flex flex-col overflow-hidden">
                            <button
                                onClick={() => rightPanelRef.current?.collapse()}
                                className="absolute top-2 right-2 bg-gray-700 hover:bg-red-600 text-white px-2 py-1 rounded text-xs z-10"
                            >
                                −
                            </button>

                            {/* HEADER */}
                            <h2 className="font-bold text-sm text-gray-300 mb-3">
                                Node Configuration
                            </h2>

                            {/* BODY */}
                            {selectedNode ? (
                                <div className="flex-1 overflow-y-auto overflow-x-hidden pl-1 pr-1">
                                    {renderForm()}
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                                    Select a node
                                </div>
                            )}
                        </div>
                    </Panel>

                    <PanelResizeHandle className="h-1 bg-gray-700 hover:bg-gray-500 cursor-row-resize" />

                    {/* Edge Config */}
                    <Panel defaultSize={40} minSize={20}>
                        <EdgePanel
                            edges={edges}
                            selectedEdgeId={selectedEdgeId}
                            setEdges={setEdges}
                        />
                    </Panel>

                </PanelGroup>
            </Panel>
        </PanelGroup>
    );
}

export default function WorkflowCanvas() {
    return (
        <ReactFlowProvider>
            <CanvasWithPanel />
        </ReactFlowProvider>
    );
}