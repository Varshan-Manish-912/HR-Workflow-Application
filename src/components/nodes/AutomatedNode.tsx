"use client";

import {Handle, NodeProps, Position} from "reactflow";
import { BaseNodeData } from "@/types/nodeTypes";

export default function AutomatedNode({ data, selected }: NodeProps<BaseNodeData>) {
    return (
        <div
            className={`px-4 py-2 rounded bg-purple-500 text-white shadow
        ${selected ? "ring-2 ring-white" : ""}`}
        >
            {data.label || "Automated"}
            <Handle type="target" position={Position.Top} className="w-2 h-2 bg-white" />
            <Handle type="target" position={Position.Bottom} className="w-2 h-2 bg-white" />
            <Handle type="target" position={Position.Left} className="w-2 h-2 bg-white" />
            <Handle type="target" position={Position.Right} className="w-2 h-2 bg-white" />
        </div>
    );
}