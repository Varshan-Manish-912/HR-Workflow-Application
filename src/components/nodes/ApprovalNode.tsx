"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { ApprovalNodeData } from "@/types/nodeTypes";
import { CheckCircle, MoreHorizontal } from "lucide-react";

export default function ApprovalNode({
                                         data,
                                         selected,
                                     }: NodeProps<ApprovalNodeData>) {
    return (
        <div
            className={`
        relative
        bg-white
        border border-gray-200
        rounded-xl
        shadow-sm
        px-3 py-2
        min-w-[220px]
        transition-all duration-150
        hover:shadow-md
        ${selected ? "ring-2 ring-purple-500" : ""}
      `}
        >
            {/* Handles */}
            <Handle id="top" type="target" position={Position.Top} />
            <Handle id="bottom" type="source" position={Position.Bottom} />
            <Handle id="left" type="target" position={Position.Left} style={{ left: -6 }} />
            <Handle id="right" type="source" position={Position.Right} style={{ right: -6 }} />

            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
                        <CheckCircle size={14} className="text-purple-600" />
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-gray-800">
                            {data.label || "Approval"}
                        </div>
                        <div className="text-xs text-gray-500">
                            {data.role || "Role not set"}
                        </div>
                    </div>
                </div>

                <MoreHorizontal size={14} className="text-gray-400" />
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