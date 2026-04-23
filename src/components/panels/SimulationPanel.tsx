"use client";

import React from "react";
import { Edge } from "reactflow";
import { WorkflowNode } from "@/types/nodeTypes";
import { simulateWorkflowAPI } from "@/lib/api/workFlowApi";
import { SimulationResult } from "@/lib/simulation/simulateWorkflow";
import { Play } from "lucide-react";
import {ImperativePanelHandle} from "react-resizable-panels";

type Props = {
    nodes: WorkflowNode[];
    edges: Edge[];
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    setSimulationResult: React.Dispatch<React.SetStateAction<SimulationResult | null>>;
    bottomPanelRef: React.RefObject<ImperativePanelHandle | null>;
    setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

export default function SimulationPanel({
                                            nodes,
                                            edges,
                                            setActiveStep,
                                            setSimulationResult,
                                            bottomPanelRef,
                                            setNodes,
                                            setEdges,
                                        }: Props) {
    const [logs, setLogs] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showJSON, setShowJSON] = React.useState(false);
    const [jsonText, setJsonText] = React.useState("");
    const [mode, setMode] = React.useState<"export" | "import" | null>(null);

    const runSimulation = async () => {
        setError(null);
        setLogs([]);

        try {
            // 🔥 VALIDATION

            // 1. Must have exactly one Start node
            const startNodes = nodes.filter((n) => n.type === "start");
            if (startNodes.length !== 1) {
                throw new Error("Workflow must have exactly one Start node");
            }

            // 2. Must have End node
            const hasEnd = nodes.some((n) => n.type === "end");
            if (!hasEnd) {
                throw new Error("Workflow must have an End node");
            }

            // 3. Every node (except end) must have outgoing edge
            for (const node of nodes) {
                if (node.type !== "end") {
                    const hasOutgoing = edges.some((e) => e.source === node.id);
                    if (!hasOutgoing) {
                        throw new Error(
                            `Node "${node.data.label}" has no outgoing connection`
                        );
                    }
                }
            }

            // 🔹 Serialize workflow
            const workflowJSON = { nodes, edges };
            console.log("Serialized Workflow:", workflowJSON);

            setLoading(true);

            const response = await simulateWorkflowAPI({
                ...workflowJSON,
                inputValue: 50,
            });
            setSimulationResult(response);
            const playLogsStepByStep = (logs: string[], path: string[]) => {
                let i = 0;
                setLogs([]);
                setActiveStep(-1);

                const interval = setInterval(() => {
                    setLogs((prev) => [...prev, logs[i]]);
                    setActiveStep(i);

                    i++;

                    if (i >= logs.length) {
                        clearInterval(interval);
                    }
                }, 400);
            };

            playLogsStepByStep(response.logs, response.path);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const data = {
            nodes,
            edges,
        };

        setJsonText(JSON.stringify(data, null, 2));
        setMode("export");
        setShowJSON(true);
    };

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonText);

            if (!parsed.nodes || !parsed.edges) {
                throw new Error("Invalid structure");
            }

            // 🔥 IMPORTANT — use setters passed from parent
            setNodes(parsed.nodes);
            setEdges(parsed.edges);

            setShowJSON(false);
        } catch (err) {
            alert("Invalid JSON");
        }
    };

    return (
        <div className="w-full h-full flex flex-col border-t border-gray-800 bg-[#0b0b0b] text-green-400 text-xs">
            {/* HEADER */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">

  <span className="font-semibold text-gray-300 text-xs">
    Simulation Sandbox
  </span>
                <div className="flex items-center gap-2">

                    <button
                        onClick={handleExport}
                        className="text-xs text-blue-400 hover:text-white"
                    >
                        Export
                    </button>

                    <button
                        onClick={() => {
                            setMode("import");
                            setShowJSON(true);
                            setJsonText("");
                        }}
                        className="text-xs text-yellow-400 hover:text-white"
                    >
                        Import
                    </button>

                </div>

                <div className="flex items-center gap-2">

                    {/* Toggle JSON */}
                    <button
                        onClick={() => setShowJSON((prev) => !prev)}
                        className="text-xs text-gray-400 hover:text-white"
                    >
                        {showJSON ? "Hide JSON" : "Show JSON"}
                    </button>

                    {/* Run Button */}
                    <button
                        onClick={runSimulation}
                        disabled={loading}
                        className="
        flex items-center gap-1
        bg-green-600 hover:bg-green-700
        text-white
        px-2 py-1
        rounded
        text-xs
        disabled:opacity-50
      "
                    >
                        <Play size={12} />
                        {loading ? "Running..." : "Execute"}
                    </button>

                    {/* 🔥 Collapse Button */}
                    <button
                        onClick={() => bottomPanelRef.current?.collapse()}
                        className="bg-gray-700 hover:bg-red-500 px-2 py-1 rounded text-xs"
                    >
                        −
                    </button>

                </div>
            </div>

            {/* BODY */}
            <div className="p-3 h-full overflow-y-auto space-y-2 font-mono">

                {/* ❌ ERROR */}
                {error && (
                    <div className="text-red-400">
                        ❌ {error}
                    </div>
                )}

                {/* 📜 JSON VIEW */}
                {showJSON && !error && (
                    <div className="bg-black p-2 rounded flex flex-col gap-2">

    <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        readOnly={mode === "export"}
        className="w-full h-40 bg-black text-green-400 text-xs p-2 outline-none font-mono resize-none"
    />

                        <div className="flex justify-between items-center">

                            {/* EXPORT MODE */}
                            {mode === "export" && (
                                <button
                                    onClick={() => {
                                        const blob = new Blob([jsonText], { type: "application/json" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = "workflow.json";
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                    className="text-blue-400 text-xs hover:text-white"
                                >
                                    Download JSON
                                </button>
                            )}

                            {/* IMPORT MODE */}
                            {mode === "import" && (
                                <button
                                    onClick={handleImport}
                                    className="text-green-400 text-xs hover:text-white"
                                >
                                    Load Workflow
                                </button>
                            )}

                            <button
                                onClick={() => setShowJSON(false)}
                                className="text-red-400 text-xs hover:text-white"
                            >
                                Close
                            </button>

                        </div>
                    </div>
                )}

                {/* 🧠 LOGS */}
                {!showJSON && !error && logs.length === 0 && !loading && (
                    <div className="text-gray-500">
                        No execution yet
                    </div>
                )}

                {!showJSON &&
                    logs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="text-gray-500">{i + 1}.</span>
                            <span>{log}</span>
                        </div>
                    ))}

                {/* ⏳ LOADING */}
                {loading && (
                    <div className="text-gray-400">
                        Running simulation...
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Prevents circular JSON crash (ReactFlow nodes can sometimes have refs)
 */
function safeStringify(obj: unknown) {
    try {
        return JSON.stringify(obj, null, 2);
    } catch {
        return "Unable to serialize workflow (circular structure)";
    }
}