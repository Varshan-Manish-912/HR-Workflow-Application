"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { TaskNodeData } from "@/types/nodeTypes";

export default function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
    return (
        <div
            className={`px-3 py-2 rounded bg-blue-500 text-white shadow text-xs min-w-[120px]
        ${selected ? "ring-2 ring-white" : ""}`}
        >
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white" />

            <div className="font-semibold">{data.label || "Task"}</div>

            {data.description && (
                <div className="opacity-80">{data.description}</div>
            )}

            {data.assignee && (
                <div className="opacity-80">👤 {data.assignee}</div>
            )}

            {data.dueDate && (
                <div className="opacity-80">📅 {data.dueDate}</div>
            )}
            
            <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-white" />
        </div>
    );
}