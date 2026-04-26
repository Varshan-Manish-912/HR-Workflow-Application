"use client";

import React, { useState } from "react";
import { Edge } from "reactflow";
import { Play, Copy, ClipboardPaste } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";

import { WorkflowNode } from "@/types/nodeTypes";
import { simulateWorkflowAPI } from "@/lib/api/workFlowApi";
import { SimulationResult } from "@/lib/simulation/simulateWorkflow";

type Props = {
    nodes: WorkflowNode[];
    edges: Edge[];
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    setSimulationResult: React.Dispatch<
        React.SetStateAction<SimulationResult | null>
    >;
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
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showJSON, setShowJSON] = useState(false);
    const [jsonText, setJsonText] = useState("");
    const [mode, setMode] = useState<"export" | "import" | null>(null);

    const [isCopied, setIsCopied] = useState(false);
    const [isPasted, setIsPasted] = useState(false);
    const [jsonError, setJsonError] = useState<string | null>(null);

    function formatStepLog(node: WorkflowNode, step: number): string {
        const label = node.data?.label || node.type;

        let message = "";

        switch (node.type) {
            case "start":
                message = `Started workflow from "${label}".`;
                break;

            case "task":
                message = `Assigned "${label}" to ${
                    node.data?.assignee || "user"
                }${node.data?.dueDate ? `. Due ${node.data.dueDate}.` : "."}`;
                break;

            case "approval":
                message = `Approval "${label}" routed to role ${
                    node.data?.role || "approver"
                }.`;
                break;

            case "automated":
                message = `Ran automation "${
                    node.data?.actionId || label
                }" successfully.`;
                break;

            case "end":
                message =
                    node.data?.endMessage || "Workflow ended successfully.";
                break;

            default:
                message = `Executed "${label}".`;
        }

        return `Step ${step + 1}: ${label} (${node.type})\n\n${message}\n`;
    }

    const generateReadableLogs = (path: string[], nodes: WorkflowNode[]) => {
        return path.map((nodeId, index) => {
            const node = nodes.find((n) => n.id === nodeId);
            if (!node) return `Step ${index + 1}: Unknown node`;
            return formatStepLog(node, index);
        });
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const validateJSON = (text: string) => {
        try {
            const parsed = JSON.parse(text);
            if (!parsed.nodes || !parsed.edges) {
                throw new Error("Invalid structure: missing nodes/edges");
            }
            setJsonError(null);
            return parsed;
        } catch {
            setJsonError("Invalid JSON format");
            return null;
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJsonText(text);

            setIsPasted(true);
            setTimeout(() => setIsPasted(false), 1500);

            const parsed = validateJSON(text);
            if (parsed) {
                setNodes(parsed.nodes);
                setEdges(parsed.edges);
            }
        } catch (err) {
            console.error("Paste failed", err);
        }
    };

    const runSimulation = async () => {
        setError(null);
        setLogs([]);

        try {
            const startNodes = nodes.filter((n) => n.type === "start");
            if (startNodes.length !== 1) {
                throw new Error("Workflow must have exactly one Start node");
            }

            const hasEnd = nodes.some((n) => n.type === "end");
            if (!hasEnd) {
                throw new Error("Workflow must have an End node");
            }

            for (const node of nodes) {
                if (node.type !== "end") {
                    const hasOutgoing = edges.some((e) => e.source === node.id);
                    if (!hasOutgoing) {
                        throw new Error(
                            `Node "${node.data.label || node.type}" has no outgoing connection`
                        );
                    }
                }
            }

            setLoading(true);

            const response = await simulateWorkflowAPI({
                nodes,
                edges,
                inputValue: 50,
            });

            setSimulationResult(response);

            const path = response.paths?.[0];
            if (!path) throw new Error("No valid path returned");

            const readableLogs = generateReadableLogs(path, nodes);

            let i = 0;
            setLogs([]);
            setActiveStep(-1);

            const interval = setInterval(() => {
                setLogs((prev) => [...prev, readableLogs[i]]);
                setActiveStep(i);

                i++;

                if (i >= readableLogs.length) {
                    clearInterval(interval);
                    setTimeout(() => setActiveStep(-1), 1000);
                }
            }, 600);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        const data = { nodes, edges };
        setJsonText(JSON.stringify(data, null, 2));
        setMode("export");
        setShowJSON(true);
    };

    const handleImport = () => {
        const parsed = validateJSON(jsonText);
        if (!parsed) return;

        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        setShowJSON(false);
    };

    return (
        <div className="flex flex-col w-full h-full text-xs text-green-400 border-t border-gray-800 bg-[#0b0b0b]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <span className="text-xs font-semibold text-gray-300">
          Simulation Sandbox
        </span>

                <div className="flex gap-2">
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

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowJSON((p) => !p)}
                        className="text-xs text-gray-400 hover:text-white"
                    >
                        {showJSON ? "Hide JSON" : "Show JSON"}
                    </button>

                    <button
                        onClick={runSimulation}
                        disabled={loading}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        <Play size={12} />
                        {loading ? "Running..." : "Execute"}
                    </button>

                    <button
                        onClick={() => bottomPanelRef.current?.collapse()}
                        className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-red-500"
                    >
                        −
                    </button>
                </div>
            </div>

            <div className="p-3 space-y-2 overflow-y-auto font-mono h-full">
                {error && <div className="text-red-400">❌ {error}</div>}

                {showJSON && (
                    <div className="p-2 space-y-2 bg-black rounded">
                        <div className="relative">
              <textarea
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  readOnly={mode === "export"}
                  className="w-full h-40 p-2 pb-8 text-xs text-green-400 border border-gray-800 rounded outline-none resize-none bg-[#0a0a0a] font-mono"
              />

                            {mode === "export" && (
                                <button
                                    onClick={handleCopy}
                                    className="absolute p-1.5 text-gray-400 transition-colors bg-gray-800 rounded top-2 right-5 hover:bg-gray-700 hover:text-white"
                                >
                                    <Copy
                                        size={14}
                                        className={isCopied ? "text-green-500" : ""}
                                    />
                                </button>
                            )}

                            {mode === "import" && (
                                <button
                                    onClick={handlePaste}
                                    className="absolute p-1.5 text-gray-400 transition-colors bg-gray-800 rounded top-2 right-5 hover:bg-gray-700 hover:text-white"
                                >
                                    <ClipboardPaste
                                        size={14}
                                        className={isPasted ? "text-green-500" : ""}
                                    />
                                </button>
                            )}
                        </div>

                        {isCopied && (
                            <div className="text-xs text-green-500">Copied!</div>
                        )}
                        {isPasted && (
                            <div className="text-xs text-green-500">Pasted!</div>
                        )}
                        {jsonError && (
                            <div className="text-xs text-red-400">{jsonError}</div>
                        )}

                        <div className="flex justify-between">
                            {mode === "import" && (
                                <button
                                    onClick={handleImport}
                                    className="text-xs text-green-400"
                                >
                                    Load Workflow
                                </button>
                            )}

                            <button
                                onClick={() => setShowJSON(false)}
                                className="text-xs text-red-400"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {!showJSON && logs.length === 0 && !loading && (
                    <div className="text-gray-500">No execution yet</div>
                )}

                {!showJSON &&
                    logs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="text-gray-500">{i + 1}.</span>
                            <span className="whitespace-pre-line">{log}</span>
                        </div>
                    ))}

                {loading && (
                    <div className="text-gray-400">Running simulation...</div>
                )}
            </div>
        </div>
    );
}