"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { Play } from "lucide-react";

import { StartNodeData } from "@/types/nodeTypes";

const baseHandleStyle = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
};

const handleStyles = {
    bottom: { ...baseHandleStyle, transform: "translate(-50%, 20%)" },
    right: { ...baseHandleStyle, transform: "translate(20%, -50%)" },
};

export default function StartNode({
                                      data,
                                      selected,
                                  }: NodeProps<StartNodeData>) {
    return (
        <div
            className={`relative bg-white/5 backdrop-blur-md border-2 text-white rounded-xl shadow-sm px-3 py-2 min-w-[200px] transition-all duration-150 hover:shadow-md ${
                selected ? "border-green-500" : "border-green-800"
            }`}
        >
            <Handle
                id="bottom"
                type="source"
                position={Position.Bottom}
                className="!bg-green-500 hover:!bg-green-300"
                style={handleStyles.bottom}
            />
            <Handle
                id="right"
                type="source"
                position={Position.Right}
                className="!bg-green-500 hover:!bg-green-300"
                style={handleStyles.right}
            />

            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded">
                        <Play size={14} className="text-green-600" />
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-green-500">
                            {data.label || "Start Node"}
                        </div>
                        <div className="text-xs text-white">
                            Workflow Entry Point
                        </div>
                    </div>
                </div>
            </div>

            {data.metadata && Object.keys(data.metadata).length > 0 && (
                <div className="flex flex-wrap gap-1 text-[10px]">
                    {Object.entries(data.metadata).map(([key, value]) => (
                        <span
                            key={key}
                            className="px-2 py-0.5 rounded bg-gray-100 text-gray-600"
                        >
              {key}: {value}
            </span>
                    ))}
                </div>
            )}
        </div>
    );
}