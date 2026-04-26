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
        if (path.includes(node.id)) return;

        const newPath = [...path, node.id];
        const outgoing = getOutgoingEdges(node.id);

        const recordPath = () => {
            const pathStr = newPath.join("->");

            if (!allPaths.some((p) => p.join("->") === pathStr)) {
                allPaths.push(newPath);
                allEdgePaths.push(edgePath);
            }
        };

        if (node.type === "end" || outgoing.length === 0) {
            recordPath();
            return;
        }

        let progressed = false;

        for (const edge of outgoing) {
            const nextNode = nodes.find((n) => n.id === edge.target);

            if (nextNode) {
                progressed = true;
                dfs(nextNode, newPath, [...edgePath, edge.id]);
            }
        }

        if (!progressed) {
            recordPath();
        }
    };

    dfs(startNode, [], []);

    if (allPaths.length === 0) {
        throw new Error("No valid path found");
    }

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