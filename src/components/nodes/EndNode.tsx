"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { EndNodeData } from "@/types/nodeTypes";
import { Square } from "lucide-react";

const handleStyleLeft = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(-20%, -50%)",
};

const handleStyleTop = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
    transform: "translate(-50%, -20%)",
};

export default function EndNode({
                                    data,
                                    selected,
                                }: NodeProps<EndNodeData>) {
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
        ${selected ? "border-2 border-red-500" : "border-red-800"}
      `}
        >
            {/* Only incoming */}
            <Handle id="top" className = "!bg-red-500 hover:!bg-red-300" type="target" position={Position.Top} style={handleStyleTop}/>
            <Handle id="left" className = "!bg-red-500 hover:!bg-red-300" type="target" position={Position.Left} style={handleStyleLeft} />

            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center">
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

            {/* Summary flag */}
            {data.summary && (
                <div className="text-xs text-red-500">
                    Summary Enabled
                </div>
            )}
        </div>
    );
}