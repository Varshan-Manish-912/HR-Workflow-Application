import { Node as RFNode } from "reactflow";

export type NodeType =
    | "start"
    | "task"
    | "approval"
    | "automated"
    | "end";

export interface BaseNodeData {
    label: string;
}

export type TaskNodeData = {
    label: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
};

export type TaskNodeType = RFNode<TaskNodeData>;

export type WorkflowNode = RFNode<{
    label: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
}>;