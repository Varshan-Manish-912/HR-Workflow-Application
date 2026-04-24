import { Edge } from "reactflow";
import { WorkflowNode } from "@/types/nodeTypes";

export type SimulationResult = {
    paths: string[][];
    edgesTraversed: string[][];
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
    const startNode = nodes.find((n) => n.type === "start");
    if (!startNode) throw new Error("No start node found");

    const allPaths: string[][] = [];
    const allEdgePaths: string[][] = [];

    const getOutgoingEdges = (nodeId: string) =>
        edges.filter((e) => e.source === nodeId);

    const dfs = (
        node: WorkflowNode,
        path: string[],
        edgePath: string[]
    ) => {
        // prevent cycles
        if (path.includes(node.id)) return;

        const newPath = [...path, node.id];
        const outgoing = getOutgoingEdges(node.id);

        // Helper to finalize and store a completed path
// Helper to finalize and store a completed path
        const recordPath = () => {
            const pathStr = newPath.join("->");
            // Prevent duplicate ghost paths from being recorded
            if (!allPaths.some((p) => p.join("->") === pathStr)) {
                allPaths.push(newPath);
                allEdgePaths.push(edgePath);
            }
        };

        // ✅ TERMINAL NODE: It's an end node OR has no outgoing edges
        if (node.type === "end" || outgoing.length === 0) {
            recordPath();
            return;
        }

        // 🟣 APPROVAL (single branch)
        if (node.type === "approval") {
            const threshold = node.data?.threshold ?? 0;
            const decision = inputValue < threshold ? "approved" : "rejected";

            const edge = outgoing.find((e) => e.label === decision);
            if (edge) {
                const nextNode = nodes.find((n) => n.id === edge.target);
                if (nextNode) {
                    dfs(nextNode, newPath, [...edgePath, edge.id]);
                } else {
                    recordPath(); // Dead end: Edge exists but target node is missing
                }
            } else {
                recordPath(); // Dead end: No matching edge for decision
            }
            return;
        }

        // 🔥 NORMAL DFS (Parallel routes)
        let progressed = false;
        for (const edge of outgoing) {
            const nextNode = nodes.find((n) => n.id === edge.target);
            if (nextNode) {
                progressed = true;
                dfs(nextNode, newPath, [...edgePath, edge.id]);
            }
        }

        // If we couldn't progress (e.g., broken edges), save the path up to here
        if (!progressed) {
            recordPath();
        }
    };

    // 🚀 START DFS
    dfs(startNode, [], []);

    if (allPaths.length === 0) {
        throw new Error("No valid path found");
    }

    // 📝 REBUILD LOGS ONE BY ONE
    // Doing this after DFS ensures logs represent distinct, linear paths
    // from start to finish without interleaving or UI flickering.
    const logs: string[] = [];
    allPaths.forEach((path, index) => {
        logs.push(`--- Path ${index + 1} ---`);
        path.forEach((nodeId) => {
            const n = nodes.find((x) => x.id === nodeId);
            if (n) {
                logs.push(`Visiting ${n.type} (${n.id})`);
            }
        });
    });

    return {
        paths: allPaths,
        edgesTraversed: allEdgePaths,
        logs,
    };
}