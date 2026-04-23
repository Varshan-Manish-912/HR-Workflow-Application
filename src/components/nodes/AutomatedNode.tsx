"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { AutomatedNodeData } from "@/types/nodeTypes";
import { Zap } from "lucide-react";

export default function AutomatedNode({
                                          data,
                                          selected,
                                      }: NodeProps<AutomatedNodeData>) {
    return (
        <div
            className={`relative bg-white border rounded-xl shadow-sm px-3 py-2 min-w-[220px]
        ${selected ? "ring-2 ring-yellow-500" : ""}
      `}
        >
            <Handle id = "top" type="target" position={Position.Top} />
            <Handle id = "bottom" type="source" position={Position.Bottom} />
            <Handle id = "left" type="target" position={Position.Left} style={{ left: -6 }}/>
            <Handle id = "right" type="source" position={Position.Right} style={{ right: -6 }}  />

            <div className="flex gap-2 items-start">
                <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                    <Zap size={14} className="text-yellow-600" />
                </div>

                <div>
                    <div className="text-sm font-semibold">
                        {data.label || "Automated"}
                    </div>
                    <div className="text-xs text-gray-500">
                        {data.actionId || "No action selected"}
                    </div>
                </div>
            </div>
        </div>
    );
}