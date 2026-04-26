"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { Square } from "lucide-react";

import { EndNodeData } from "@/types/nodeTypes";

const baseHandleStyle = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
};

const handleStyles = {
    top: { ...baseHandleStyle, transform: "translate(-50%, -20%)" },
    left: { ...baseHandleStyle, transform: "translate(-20%, -50%)" },
};

export default function EndNode({
                                    data,
                                    selected,
                                }: NodeProps<EndNodeData>) {
    return (
        <div
            className={`relative bg-white/5 backdrop-blur-md border-2 text-white rounded-xl shadow-sm px-3 py-2 min-w-[200px] transition-all duration-150 hover:shadow-md ${
                selected ? "border-red-500" : "border-red-800"
            }`}
        >
            <Handle
                id="top"
                type="target"
                position={Position.Top}
                className="!bg-red-500 hover:!bg-red-300"
                style={handleStyles.top}
            />
            <Handle
                id="left"
                type="target"
                position={Position.Left}
                className="!bg-red-500 hover:!bg-red-300"
                style={handleStyles.left}
            />

            <div className="flex items-start gap-2 mb-2">
                <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded">
                    <Square size={14} className="text-red-600" />
                </div>

                <div>
                    <div className="text-sm font-semibold text-red-500">
                        {data.label || "End"}
                    </div>
                    <div className="text-xs text-white">
                        {data.endMessage || "Workflow ends here"}
                    </div>
                </div>
            </div>

            {data.summary && (
                <div className="text-xs text-red-500">
                    Summary Enabled
                </div>
            )}
        </div>
    );
}