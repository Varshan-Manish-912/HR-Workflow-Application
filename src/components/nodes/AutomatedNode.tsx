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
        ${selected ? "border-2 border-yellow-300" : "border-yellow-600"}
      `}
        >
            <Handle id = "top" className = "!bg-yellow-500 hover:!bg-yellow-300" type="target" position={Position.Top} style={handleStyleTop}/>
            <Handle id = "bottom" className = "!bg-yellow-500 hover:!bg-yellow-300" type="source" position={Position.Bottom} style={handleStyleBottom}/>
            <Handle id = "left" className = "!bg-yellow-500 hover:!bg-yellow-300" type="target" position={Position.Left} style={handleStyleLeft}/>
            <Handle id = "right" className = "!bg-yellow-500 hover:!bg-yellow-300" type="source" position={Position.Right} style={handleStyleRight}  />

            <div className="flex gap-2 items-start">
                <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
                    <Settings size={14} className="text-yellow-600" />
                </div>

                <div>
                    <div className="text-sm font-semibold text-yellow-500">
                        {data.label || "Automated"}
                    </div>
                    <div className="text-xs text-white">
                        {data.actionId || "No action selected"}
                    </div>
                </div>
            </div>
        </div>
    );
}