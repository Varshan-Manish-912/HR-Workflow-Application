import { Edge } from "reactflow";

import { WorkflowNode } from "@/types/nodeTypes";
import {
    simulateWorkflow,
    SimulationResult,
} from "../simulation/simulateWorkflow";

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

const AUTOMATIONS: Automation[] = [
    {
        id: "send_email",
        label: "Send Email",
        params: ["recipient", "subject"],
    },
    {
        id: "generate_doc",
        label: "Generate Document",
        params: ["template", "recipient"],
    },
];

export const getAutomations = async (): Promise<Automation[]> => {
    await new Promise((res) => setTimeout(res, 300));
    return AUTOMATIONS;
};

export const simulateWorkflowAPI = async (
    payload: SimulationRequest
): Promise<SimulationResult> => {
    await new Promise((res) => setTimeout(res, 500));

    return simulateWorkflow(
        payload.nodes,
        payload.edges,
        payload.inputValue
    );
};