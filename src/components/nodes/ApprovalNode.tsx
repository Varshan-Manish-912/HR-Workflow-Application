"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { CheckCircle } from "lucide-react";

import { ApprovalNodeData } from "@/types/nodeTypes";

const baseHandleStyle = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
};

const handleStyles = {
    top: { ...baseHandleStyle, transform: "translate(-50%, -20%)" },
    bottom: { ...baseHandleStyle, transform: "translate(-50%, 20%)" },
    left: { ...baseHandleStyle, transform: "translate(-20%, -50%)" },
    right: { ...baseHandleStyle, transform: "translate(20%, -50%)" },
};

export default function ApprovalNode({
                                         data,
                                         selected,
                                     }: NodeProps<ApprovalNodeData>) {
    return (
        <div
            className={`relative bg-white/5 backdrop-blur-md border-2 text-white rounded-xl shadow-sm px-3 py-2 min-w-[220px] transition-all duration-150 hover:shadow-md ${
                selected ? "border-purple-500" : "border-purple-800"
            }`}
        >
            <Handle
                id="top"
                type="target"
                position={Position.Top}
                className="!bg-purple-500 hover:!bg-purple-300"
                style={handleStyles.top}
            />
            <Handle
                id="bottom"
                type="source"
                position={Position.Bottom}
                className="!bg-purple-500 hover:!bg-purple-300"
                style={handleStyles.bottom}
            />
            <Handle
                id="left"
                type="target"
                position={Position.Left}
                className="!bg-purple-500 hover:!bg-purple-300"
                style={handleStyles.left}
            />
            <Handle
                id="right"
                type="source"
                position={Position.Right}
                className="!bg-purple-500 hover:!bg-purple-300"
                style={handleStyles.right}
            />

            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded">
                        <CheckCircle size={14} className="text-purple-600" />
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-purple-500">
                            {data.label || "Approval"}
                        </div>
                        <div className="text-xs text-white">
                            {data.role || "Role not set"}
                        </div>
                    </div>
                </div>
            </div>

            {data.threshold !== undefined && (
                <div className="text-xs text-white">
                    Threshold: {data.threshold}
                </div>
            )}
        </div>
    );
}