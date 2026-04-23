"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { EndNodeData } from "@/types/nodeTypes";
import { Flag } from "lucide-react";

export default function EndNode({
                                    data,
                                    selected,
                                }: NodeProps<EndNodeData>) {
    return (
        <div
            className={`
        relative
        bg-white
        border border-gray-200
        rounded-xl
        shadow-sm
        px-3 py-2
        min-w-[200px]
        transition-all duration-150
        hover:shadow-md
        ${selected ? "ring-2 ring-red-500" : ""}
      `}
        >
            {/* Only incoming */}
            <Handle id="top" type="target" position={Position.Top} />
            <Handle id="left" type="target" position={Position.Left} style={{ left: -6 }} />

            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center">
                    <Flag size={14} className="text-red-600" />
                </div>

                <div>
                    <div className="text-sm font-semibold text-gray-800">
                        {data.label || "End"}
                    </div>
                    <div className="text-xs text-gray-500">
                        {data.endMessage || "Workflow ends here"}
                    </div>
                </div>
            </div>

            {/* Summary flag */}
            {data.summary && (
                <div className="text-xs text-red-500">
                    Summary Enabled
                </div>
            )}
        </div>
    );
}