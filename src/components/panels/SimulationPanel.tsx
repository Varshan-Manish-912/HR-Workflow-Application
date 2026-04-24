"use client";

import React from "react";
import { Edge } from "reactflow";
import { WorkflowNode } from "@/types/nodeTypes";
import { simulateWorkflowAPI } from "@/lib/api/workFlowApi";
import { SimulationResult } from "@/lib/simulation/simulateWorkflow";
import { Play, Copy, ClipboardPaste } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";

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

    const [isCopied, setIsCopied] = React.useState(false);
    const [isPasted, setIsPasted] = React.useState(false);
    const [jsonError, setJsonError] = React.useState<string | null>(null);

    // 🔥 FORMATTER
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

    // ✅ COPY
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    // ✅ VALIDATE JSON
    const validateJSON = (text: string) => {
        try {
            const parsed = JSON.parse(text);
            if (!parsed.nodes || !parsed.edges) {
                throw new Error("Invalid structure: missing nodes/edges");
            }
            setJsonError(null);
            return parsed;
        } catch (err) {
            setJsonError("Invalid JSON format");
            return null;
        }
    };

    // ✅ PASTE
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJsonText(text);

            setIsPasted(true);
            setTimeout(() => setIsPasted(false), 1500);

            // 🔥 Auto validate
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
        <div className="w-full h-full flex flex-col border-t border-gray-800 bg-[#0b0b0b] text-green-400 text-xs">
            {/* HEADER */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                <span className="font-semibold text-gray-300 text-xs">
                    Simulation Sandbox
                </span>

                <div className="flex gap-2">
                    <button onClick={handleExport} className="text-blue-400 hover:text-white text-xs">
                        Export
                    </button>

                    <button
                        onClick={() => {
                            setMode("import");
                            setShowJSON(true);
                            setJsonText("");
                        }}
                        className="text-yellow-400 hover:text-white text-xs"
                    >
                        Import
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowJSON((p) => !p)}
                        className="text-gray-400 hover:text-white text-xs"
                    >
                        {showJSON ? "Hide JSON" : "Show JSON"}
                    </button>

                    <button
                        onClick={runSimulation}
                        disabled={loading}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs disabled:opacity-50"
                    >
                        <Play size={12} />
                        {loading ? "Running..." : "Execute"}
                    </button>

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

                {error && <div className="text-red-400">❌ {error}</div>}

                {showJSON && (
                    <div className="bg-black p-2 rounded space-y-2">

                        <div className="relative">
                            <textarea
                                value={jsonText}
                                onChange={(e) => setJsonText(e.target.value)}
                                readOnly={mode === "export"}
                                className="w-full h-40 bg-[#0a0a0a] text-green-400 p-2 pb-8 text-xs rounded border border-gray-800 outline-none font-mono resize-none"
                            />

                            {/* COPY (Export Only) */}
                            {mode === "export" && (
                                <button
                                    onClick={handleCopy}
                                    title="Copy JSON"
                                    className="absolute top-2 right-5 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
                                >
                                    <Copy size={14} className={isCopied ? "text-green-500" : ""} />
                                </button>
                            )}

                            {/* PASTE (Import Only) */}
                            {mode === "import" && (
                                <button
                                    onClick={handlePaste}
                                    title="Paste JSON"
                                    className="absolute top-2 right-5 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded transition-colors"
                                >
                                    <ClipboardPaste size={14} className={isPasted ? "text-green-500" : ""} />
                                </button>
                            )}
                        </div>

                        {/* STATUS */}
                        {isCopied && <div className="text-green-500 text-xs">Copied!</div>}
                        {isPasted && <div className="text-green-500 text-xs">Pasted!</div>}
                        {jsonError && <div className="text-red-400 text-xs">{jsonError}</div>}

                        <div className="flex justify-between">
                            {mode === "import" && (
                                <button onClick={handleImport} className="text-green-400 text-xs">
                                    Load Workflow
                                </button>
                            )}

                            <button
                                onClick={() => setShowJSON(false)}
                                className="text-red-400 text-xs"
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

                {loading && <div className="text-gray-400">Running simulation...</div>}
            </div>
        </div>
    );
}