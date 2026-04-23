import { Node as RFNode } from "reactflow";

export type NodeType =
    | "start"
    | "task"
    | "approval"
    | "automated"
    | "end";



export interface BaseNodeData {
    label: string;

    metadata?: Record<string, string>;
    description?: string;
    assignee?: string;
    dueDate?: string;
    customFields?: Record<string, string>;

    role?: string;
    threshold?: number;

    actionId?: string;
    actionParams?: Record<string, string | number>;

    endMessage?: string;
    summary?: boolean;
}

export type EndNodeData = BaseNodeData;
export type EndNodeType = RFNode<EndNodeData>;


export type StartNodeData = BaseNodeData;

export type StartNodeType = RFNode<StartNodeData>;


export type TaskNodeData = BaseNodeData;

export type TaskNodeType = RFNode<TaskNodeData>;


export type ApprovalNodeData = BaseNodeData;

export type ApprovalNodeType = RFNode<ApprovalNodeData>;

export type AutomatedNodeData = BaseNodeData;
export type AutomatedNodeType = RFNode<AutomatedNodeData>;

export type WorkflowNode = RFNode<BaseNodeData>;