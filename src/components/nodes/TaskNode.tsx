"use client";

import { NodeProps, Handle, Position } from "reactflow";
import { TaskNodeData } from "@/types/nodeTypes";
import { User, Calendar } from "lucide-react";


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


export default function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
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
        ${selected ? "border-2 border-blue-500" : "border-blue-800"}
      `}
        >
            <Handle id = "top" className = "!bg-blue-500 hover:!bg-blue-300" type="target" position={Position.Top} style= {handleStyleTop}/>
            <Handle id = "bottom" className = "!bg-blue-500 hover:!bg-blue-300" type="source" position={Position.Bottom} style={handleStyleBottom} />
            <Handle id = "left" className = "!bg-blue-500 hover:!bg-blue-300" type="target" position={Position.Left} style={handleStyleLeft}/>
            <Handle id = "right" className = "!bg-blue-500 hover:!bg-blue-300" type="source" position={Position.Right} style={handleStyleRight}  />
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    {/* ICON */}
                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                        <User size={14} className="text-blue-600" />
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-blue-500">
                            {data.label || "Task"}
                        </div>
                        <div className="text-xs text-white">
                            {data.description || "Task description"}
                        </div>
                    </div>
                </div>
            </div>

            {/* METADATA */}
            <div className="flex gap-2 text-[11px]">
                {data.assignee && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            <User size={12} />
                        {data.assignee}
          </span>
                )}

                {data.dueDate && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            <Calendar size={12} />
                        {data.dueDate}
          </span>
                )}
            </div>

        </div>
    );
}