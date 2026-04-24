"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { Play, MoreHorizontal } from "lucide-react";
import { StartNodeData } from "@/types/nodeTypes";


const handleStyleBottom = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(-50%, 20%)",
};

const handleStyleRight = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(20%, -50%)",
};


export default function StartNode({ data, selected }: NodeProps<StartNodeData>) {
    return (
        <div
            className={`
        relative
        bg-white/5 backdrop-blur-md border-2 text-white
        rounded-xl
        shadow-sm
        px-3 py-2
        min-w-[200px]
        transition-all duration-150
        hover:shadow-md
        ${selected ? "border-2 border-green-500" : "border-green-800"}
      `}
        >
            {/* Handles */}
            <Handle id="bottom" className = "!bg-green-500 hover:!bg-green-300" type="source" position={Position.Bottom} style={handleStyleBottom}/>
            <Handle id="right" className = "!bg-green-500 hover:!bg-green-300" type="source" position={Position.Right} style={handleStyleRight} />

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
                        <Play size={14} className="text-green-600" />
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-green-500">
                            {data.label || "Start"}
                        </div>
                        <div className="text-xs text-white">
                            Entry point
                        </div>
                    </div>
                </div>
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