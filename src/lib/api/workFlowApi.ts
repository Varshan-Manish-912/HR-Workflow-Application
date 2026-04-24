import { Edge } from "reactflow";
import { WorkflowNode } from "@/types/nodeTypes";
// 🔥 1. Import the source of truth
import { simulateWorkflow, SimulationResult } from "../simulation/simulateWorkflow";

export type Automation = {
    id: string;
    label: string;
    params: string[];
};

export type SimulationRequest = {
    nodes: WorkflowNode[];
    edges: Edge[];
    inputValue: number;
};

// 🔥 2. Delete SimulationResponse entirely. We don't need two types for the exact same thing.

const AUTOMATIONS: Automation[] = [
    { id: "send_email", label: "Send Email", params: ["recipient", "subject"] },
    { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
];

export const getAutomations = async (): Promise<Automation[]> => {
    await new Promise((res) => setTimeout(res, 300));
    return AUTOMATIONS;
};

// 🔥 3. Change the return type to SimulationResult
export const simulateWorkflowAPI = async (
    payload: SimulationRequest
): Promise<SimulationResult> => {
    await new Promise((res) => setTimeout(res, 500));

    const result = simulateWorkflow(
        payload.nodes,
        payload.edges,
        payload.inputValue
    );

    return result;
};