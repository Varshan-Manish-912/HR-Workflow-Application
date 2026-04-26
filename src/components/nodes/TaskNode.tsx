"use client";

import { Handle, NodeProps, Position } from "reactflow";
import { Calendar, User } from "lucide-react";

import { TaskNodeData } from "@/types/nodeTypes";

const baseHandleStyle = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    padding: 0,
};

const handleStyles = {
    top: { ...baseHandleStyle, transform: "translate(-50%, -20%)" },
    bottom: { ...baseHandleStyle, transform: "translate(-50%, 20%)" },
    left: { ...baseHandleStyle, transform: "translate(-20%, -50%)" },
    right: { ...baseHandleStyle, transform: "translate(20%, -50%)" },
};

const badgeClass =
    "flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 backdrop-blur-sm";

export default function TaskNode({
                                     data,
                                     selected,
                                 }: NodeProps<TaskNodeData>) {
    return (
        <div
            className={`relative bg-white/5 backdrop-blur-md border-2 text-white rounded-xl shadow-sm px-3 py-2 min-w-[220px] transition-all duration-150 hover:shadow-md ${
                selected ? "border-blue-500" : "border-blue-800"
            }`}
        >
            <Handle
                id="top"
                type="target"
                position={Position.Top}
                className="!bg-blue-500 hover:!bg-blue-300"
                style={handleStyles.top}
            />
            <Handle
                id="bottom"
                type="source"
                position={Position.Bottom}
                className="!bg-blue-500 hover:!bg-blue-300"
                style={handleStyles.bottom}
            />
            <Handle
                id="left"
                type="target"
                position={Position.Left}
                className="!bg-blue-500 hover:!bg-blue-300"
                style={handleStyles.left}
            />
            <Handle
                id="right"
                type="source"
                position={Position.Right}
                className="!bg-blue-500 hover:!bg-blue-300"
                style={handleStyles.right}
            />

            <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded">
                        <User size={14} className="text-blue-600" />
                    </div>

                    <div>
                        <div className="text-sm font-semibold text-blue-500">
                            {data.label || "Task Node"}
                        </div>
                        <div className="text-xs text-white">
                            {data.description || "Task description"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
                {data.assignee && (
                    <span className={badgeClass}>
            <User size={12} className="text-gray-400" />
            <span className="text-gray-400">Assignee:</span>
            <span className="text-white">{data.assignee}</span>
          </span>
                )}

                {data.dueDate && (
                    <span className={badgeClass}>
            <Calendar size={12} className="text-gray-400" />
            <span className="text-gray-400">Due:</span>
            <span className="text-white">{data.dueDate}</span>
          </span>
                )}
            </div>

            {data.customFields &&
                Object.keys(data.customFields).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 text-[10px]">
                        {Object.entries(data.customFields).map(([key, value]) => (
                            <span key={key} className={badgeClass}>
                <span className="text-gray-400">{key}</span>
                <span className="text-gray-500">:</span>
                <span className="text-white">{value}</span>
              </span>
                        ))}
                    </div>
                )}
        </div>
    );
}