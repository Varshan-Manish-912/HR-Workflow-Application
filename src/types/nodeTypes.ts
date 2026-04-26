import { Node as RFNode } from "reactflow";

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

export type StartNodeData = BaseNodeData;
export type TaskNodeData = BaseNodeData;
export type ApprovalNodeData = BaseNodeData;
export type AutomatedNodeData = BaseNodeData;
export type EndNodeData = BaseNodeData;

export type StartNodeType = RFNode<StartNodeData>;
export type TaskNodeType = RFNode<TaskNodeData>;
export type ApprovalNodeType = RFNode<ApprovalNodeData>;
export type AutomatedNodeType = RFNode<AutomatedNodeData>;
export type EndNodeType = RFNode<EndNodeData>;

export type WorkflowNode = RFNode<BaseNodeData>;