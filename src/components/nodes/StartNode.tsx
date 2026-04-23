"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { Play, MoreHorizontal } from "lucide-react";
import { StartNodeData } from "@/types/nodeTypes";

export default function StartNode({ data, selected }: NodeProps<StartNodeData>) {
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
        ${selected ? "ring-2 ring-green-500" : ""}
      `}
        >
            {/* Handles */}
            <Handle id="bottom" type="source" position={Position.Bottom} />
            <Handle id="right" type="source" position={Position.Right} style={{ right: -6 }} />

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                        <Play size={14} className="text-green-600" />
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-gray-800">
                            {data.label || "Start"}
                        </div>
                        <div className="text-xs text-gray-500">
                            Entry point
                        </div>
                    </div>
                </div>

                <MoreHorizontal size={14} className="text-gray-400" />
            </div>

            {/* Metadata preview */}
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