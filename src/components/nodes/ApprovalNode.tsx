"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { ApprovalNodeData } from "@/types/nodeTypes";
import { CheckCircle, MoreHorizontal } from "lucide-react";

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

export default function ApprovalNode({
                                         data,
                                         selected,
                                     }: NodeProps<ApprovalNodeData>) {
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
        ${selected ? "border-2 border-purple-500" : "border-purple-800"}
      `}
        >
            {/* Handles */}
            <Handle id="top" className = "!bg-purple-500 hover:!bg-purple-300" type="target" position={Position.Top} style={handleStyleTop}/>
            <Handle id="bottom" className = "!bg-purple-500 hover:!bg-purple-300" type="source" position={Position.Bottom} style={handleStyleBottom}/>
            <Handle id="left" className = "!bg-purple-500 hover:!bg-purple-300" type="target" position={Position.Left} style={handleStyleLeft} />
            <Handle id="right" className = "!bg-purple-500 hover:!bg-purple-300" type="source" position={Position.Right} style={handleStyleRight} />

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
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

            {/* Metadata */}
            {data.threshold !== undefined && (
                <div className="text-xs text-gray-600">
                    Threshold: {data.threshold}
                </div>
            )}
        </div>
    );
}