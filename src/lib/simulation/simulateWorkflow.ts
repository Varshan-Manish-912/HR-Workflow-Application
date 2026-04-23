import { Edge } from "reactflow";
import { WorkflowNode } from "@/types/nodeTypes";

export type SimulationResult = {
    path: string[];
    logs: string[];
    result?: {
        message?: string;
        summary?: boolean;
    };
};

export function simulateWorkflow(
    nodes: WorkflowNode[],
    edges: Edge[],
    inputValue: number
): SimulationResult {
    // 🔹 1. Find Start Node
    const startNode = nodes.find((n) => n.type === "start");

    if (!startNode) {
        throw new Error("No start node found");
    }

    // 🔹 2. Setup
    let currentNode: WorkflowNode | undefined = startNode;
    const path: string[] = [];
    const logs: string[] = [];
    const visited = new Set<string>();

    // 🔹 Helper: get outgoing edges
    const getOutgoingEdges = (nodeId: string) =>
        edges.filter((e) => e.source === nodeId);

    // 🔁 3. Traversal Loop
    while (currentNode) {
        // 🛑 Cycle protection
        if (visited.has(currentNode.id)) {
            throw new Error("Cycle detected in workflow");
        }
        visited.add(currentNode.id);

        path.push(currentNode.id);
        logs.push(`Visiting ${currentNode.type} node (${currentNode.id})`);

        // 🟢 START NODE
        if (currentNode.type === "start") {
            const outgoingEdges = getOutgoingEdges(currentNode.id);
            const nextEdge: Edge | undefined = outgoingEdges[0];

            if (!nextEdge) {
                throw new Error("Start node has no outgoing connection");
            }

            currentNode = nodes.find((n) => n.id === nextEdge.target);
            continue;
        }

        // 🔵 TASK NODE
        if (currentNode.type === "task") {
            logs.push(`Task: ${currentNode.data.label}`);

            const nextEdge = getOutgoingEdges(currentNode.id)[0];

            if (!nextEdge) {
                throw new Error(`Task node "${currentNode.id}" has no outgoing edge`);
            }

            currentNode = nodes.find((n) => n.id === nextEdge.target);
            continue;
        }

        // 🟣 APPROVAL NODE (Decision Engine)
        if (currentNode.type === "approval") {
            const threshold = currentNode.data.threshold ?? 0;

            const decision = inputValue < threshold ? "approved" : "rejected";

            logs.push(
                `Approval Node: input (${inputValue}) vs threshold (${threshold}) → ${decision}`
            );

            const nextEdge = edges.find(
                (e) =>
                    e.source === currentNode!.id &&
                    e.label === decision
            );

            if (!nextEdge) {
                throw new Error(
                    `Approval node "${currentNode.id}" missing "${decision}" edge`
                );
            }

            currentNode = nodes.find((n) => n.id === nextEdge.target);
            continue;
        }

        // 🟡 AUTOMATED NODE
        if (currentNode.type === "automated") {
            const actionId = currentNode.data.actionId;
            const params = currentNode.data.actionParams || {};

            logs.push(
                `Automated Step: ${actionId} → params ${JSON.stringify(params)}`
            );

            const nextEdge = getOutgoingEdges(currentNode.id)[0];

            if (!nextEdge) {
                throw new Error(
                    `Automated node "${currentNode.id}" has no outgoing edge`
                );
            }

            currentNode = nodes.find((n) => n.id === nextEdge.target);
            continue;
        }

        // 🔴 END NODE
        if (currentNode.type === "end") {
            logs.push("Reached End Node");

            return {
                path,
                logs,
                result: {
                    message: currentNode.data.endMessage,
                    summary: currentNode.data.summary,
                },
            };
        }

        // ⚠️ Unknown node type safeguard
        throw new Error(`Unknown node type: ${currentNode.type}`);
    }

    // ⚠️ If loop exits unexpectedly
    throw new Error("Workflow execution terminated unexpectedly");
}