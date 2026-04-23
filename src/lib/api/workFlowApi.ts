import { Edge } from "reactflow";
import { WorkflowNode } from "@/types/nodeTypes";
import { simulateWorkflow } from "../simulation/simulateWorkflow";

// 🔹 Types
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

export type SimulationResponse = {
    logs: string[];
    path: string[];
    result?: {
        message?: string;
        summary?: boolean;
    };
};

// 🔹 Mock DB
const AUTOMATIONS: Automation[] = [
    {
        id: "send_email",
        label: "Send Email",
        params: ["to", "subject"],
    },
    {
        id: "generate_doc",
        label: "Generate Document",
        params: ["template", "recipient"],
    },
];

// 🔹 API functions

export const getAutomations = async (): Promise<Automation[]> => {
    // simulate network delay
    await new Promise((res) => setTimeout(res, 300));
    return AUTOMATIONS;
};

export const simulateWorkflowAPI = async (
    payload: SimulationRequest
): Promise<SimulationResponse> => {
    await new Promise((res) => setTimeout(res, 500));

    const result = simulateWorkflow(
        payload.nodes,
        payload.edges,
        payload.inputValue
    );

    return result;
};