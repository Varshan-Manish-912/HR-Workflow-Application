"use client";

import React from "react";
import { Edge } from "reactflow";
import { WorkflowNode } from "@/types/nodeTypes";
import { simulateWorkflowAPI } from "@/lib/api/workFlowApi";
import { SimulationResult } from "@/lib/simulation/simulateWorkflow";
import { Play } from "lucide-react";

type Props = {
    nodes: WorkflowNode[];
    edges: Edge[];
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    setSimulationResult: React.Dispatch<React.SetStateAction<SimulationResult | null>>;
};

export default function SimulationPanel({
                                            nodes,
                                            edges,
                                            setActiveStep,
                                            setSimulationResult,
                                        }: Props) {
    const [logs, setLogs] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showJSON, setShowJSON] = React.useState(false);

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

    return (
        <div className="w-full border-t border-gray-800 bg-[#0b0b0b] text-green-400 text-xs">
            {/* HEADER */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <span className="font-semibold text-gray-300">
          Simulation Sandbox
        </span>

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
                        {loading ? "Running..." : "Execute Workflow"}
                    </button>
                </div>
            </div>

            {/* BODY */}
            <div className="p-3 max-h-48 overflow-y-auto space-y-2 font-mono">

                {/* ❌ ERROR */}
                {error && (
                    <div className="text-red-400">
                        ❌ {error}
                    </div>
                )}

                {/* 📜 JSON VIEW */}
                {showJSON && !error && (
                    <pre className="bg-black p-2 rounded text-gray-300 text-[10px] overflow-auto">
            {safeStringify({ nodes, edges })}
          </pre>
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