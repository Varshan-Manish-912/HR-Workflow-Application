"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { AutomatedNodeData } from "@/types/nodeTypes";
import { Settings } from "lucide-react";

const handleStyleTop = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(-50%, -20%)",
};

const handleStyleBottom = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(-50%, 20%)",
};

const handleStyleLeft = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(-20%, -50%)",
};

const handleStyleRight = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(20%, -50%)",
};

/* ------------------ UI HELPERS ------------------ */

// Convert "generate_doc" → "Generate Doc"
const formatActionId = (id?: string) => {
    if (!id) return "Select Action";

    return id
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Generate dynamic summary from params
const getActionSummary = (
    actionId?: string,
    params?: Record<string, string | number>
) => {
    if (!actionId) return "No action selected";

    if (!params || Object.keys(params).length === 0)
        return "Configure action";

    switch (actionId) {
        case "generate_doc":
            return params.title
                ? `Doc: ${params.title}`
                : "Enter document title";

        case "send_email":
            return params.to
                ? `To: ${params.to}`
                : "Enter recipient";

        default:
            // Generic fallback → show first param
            const first = Object.entries(params)[0];
            return first ? `${first[0]}: ${first[1]}` : "Configure action";
    }
};

export default function AutomatedNode({
                                          data,
                                          selected,
                                      }: NodeProps<AutomatedNodeData>) {
    return (
        <div
            className={`
        relative
        bg-white/5 backdrop-blur-md border-2 text-white
        rounded-xl
        shadow-sm
        px-3 py-2
        min-w-[220px]
        transition-all duration-150
        hover:shadow-md
        ${selected ? "border-yellow-300" : "border-yellow-600"}
      `}
        >
            {/* Handles */}
            <Handle
                id="top"
                className="!bg-yellow-500 hover:!bg-yellow-300"
                type="target"
                position={Position.Top}
                style={handleStyleTop}
            />
            <Handle
                id="bottom"
                className="!bg-yellow-500 hover:!bg-yellow-300"
                type="source"
                position={Position.Bottom}
                style={handleStyleBottom}
            />
            <Handle
                id="left"
                className="!bg-yellow-500 hover:!bg-yellow-300"
                type="target"
                position={Position.Left}
                style={handleStyleLeft}
            />
            <Handle
                id="right"
                className="!bg-yellow-500 hover:!bg-yellow-300"
                type="source"
                position={Position.Right}
                style={handleStyleRight}
            />

            {/* Content */}
            <div className="flex gap-2 items-start">
                <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                    <Settings size={14} className="text-yellow-600" />
                </div>

                <div className="min-w-0">
                    {/* Title */}
                    <div className="text-sm font-semibold text-yellow-500">
                        {data.label || "Enter Title"}
                    </div>

                    {/* Action Name */}
                    <div
                        className={`text-xs ${
                            data.actionId ? "text-white" : "text-gray-400"
                        }`}
                    >
                        {formatActionId(data.actionId)}
                    </div>

                    {/* Summary */}
                    <div className="text-[10px] text-gray-400 mt-1 truncate">
                        {getActionSummary(data.actionId, data.actionParams)}
                    </div>
                </div>
            </div>
        </div>
    );
}