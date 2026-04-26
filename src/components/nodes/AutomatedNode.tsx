"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { Settings } from "lucide-react";

import { AutomatedNodeData } from "@/types/nodeTypes";

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

const formatActionId = (id?: string) => {
    if (!id) return "Select Action";

    return id
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

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

        default: {
            const first = Object.entries(params)[0];
            return first ? `${first[0]}: ${first[1]}` : "Configure action";
        }
    }
};

export default function AutomatedNode({
                                          data,
                                          selected,
                                      }: NodeProps<AutomatedNodeData>) {
    return (
        <div
            className={`relative bg-white/5 backdrop-blur-md border-2 text-white rounded-xl shadow-sm px-3 py-2 min-w-[220px] transition-all duration-150 hover:shadow-md ${
                selected ? "border-yellow-300" : "border-yellow-600"
            }`}
        >
            <Handle
                id="top"
                type="target"
                position={Position.Top}
                className="!bg-yellow-500 hover:!bg-yellow-300"
                style={handleStyles.top}
            />
            <Handle
                id="bottom"
                type="source"
                position={Position.Bottom}
                className="!bg-yellow-500 hover:!bg-yellow-300"
                style={handleStyles.bottom}
            />
            <Handle
                id="left"
                type="target"
                position={Position.Left}
                className="!bg-yellow-500 hover:!bg-yellow-300"
                style={handleStyles.left}
            />
            <Handle
                id="right"
                type="source"
                position={Position.Right}
                className="!bg-yellow-500 hover:!bg-yellow-300"
                style={handleStyles.right}
            />

            <div className="flex items-start gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded">
                    <Settings size={14} className="text-yellow-600" />
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-semibold text-yellow-500">
                        {data.label || "Enter Title"}
                    </div>

                    <div
                        className={`text-xs ${
                            data.actionId ? "text-white" : "text-gray-400"
                        }`}
                    >
                        {formatActionId(data.actionId)}
                    </div>

                    <div className="mt-1 text-[10px] text-gray-400 truncate">
                        {getActionSummary(data.actionId, data.actionParams)}
                    </div>
                </div>
            </div>
        </div>
    );
}