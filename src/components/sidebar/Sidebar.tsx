"use client";

import {
    Play,
    CheckCircle,
    User,
    Zap,
    Square, Trash2, Undo2, Redo2,
} from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import Lottie from "lottie-react";
import animation from "@/assets/workflow.json";

type Props = {
    sidebarRef: React.RefObject<ImperativePanelHandle | null>;
};

const nodeTypes = [
    {
        type: "start",
        label: "Start Node",
        description: "Entry point of workflow",
        icon: Play,
        color: "text-green-400",
        hoverBg: "hover:bg-green-500/10",
        dot: "group-hover:bg-green-400",
    },
    {
        type: "task",
        label: "Task Node",
        description: "Assign work to a user",
        icon: User,
        color: "text-blue-400",
        hoverBg: "hover:bg-blue-500/10",
        dot: "group-hover:bg-blue-400",
    },
    {
        type: "approval",
        label: "Approval Node",
        description: "Requires approval decision",
        icon: CheckCircle,
        color: "text-purple-400",
        hoverBg: "hover:bg-purple-500/10",
        dot: "group-hover:bg-purple-400",
    },
    {
        type: "automated",
        label: "Automated Node",
        description: "Runs automated action",
        icon: Zap,
        color: "text-yellow-400",
        hoverBg: "hover:bg-yellow-500/10",
        dot: "group-hover:bg-yellow-400",
    },
    {
        type: "end",
        label: "End Node",
        description: "Workflow termination",
        icon: Square,
        color: "text-red-400",
        hoverBg: "hover:bg-red-500/10",
        dot: "group-hover:bg-red-400",
    },
];

export default function Sidebar({ sidebarRef }: Props) {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="w-full h-full bg-sidebar text-textPrimary flex flex-col relative">

            {/* Collapse */}
            <button
                onClick={() => sidebarRef.current?.collapse()}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-red-600 text-white px-2 py-1 rounded text-xs z-10"
            >
                −
            </button>

            {/* Header */}
            <div className="px-4 pt-4 pb-2 border-b border-border">
                <h1 className="text-sm font-semibold text-white tracking-wide">
                    Workflow Nodes
                </h1>
            </div>

            {/* 🔥 MAIN CONTENT */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* 🔹 Nodes (scrollable) */}
                <div className="p-4 overflow-y-auto">
                    <h2 className="text-xs font-semibold mb-3 text-gray-400 tracking-wide">
                        Nodes
                    </h2>

                    <div className="flex flex-col gap-2">
                        {nodeTypes.map((node) => {
                            const Icon = node.icon;

                            return (
                                <div
                                    key={node.type}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, node.type)}
                                    className={`
                group flex flex-col gap-1
                bg-panel/80 border border-border/50
                rounded-xl px-3 py-2 text-sm cursor-grab
                backdrop-blur-md transition-all duration-200
                ${node.hoverBg}
                hover:border-gray-600 hover:shadow-lg hover:shadow-black/40
                active:cursor-grabbing active:scale-95
              `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${node.color}`} />

                                        <span className="text-gray-200 group-hover:text-white">
                  {node.label}
                </span>

                                        <div
                                            className={`ml-auto w-1.5 h-1.5 rounded-full bg-gray-600 transition-all ${node.dot}`}
                                        />
                                    </div>

                                    <div className="text-[11px] text-gray-400 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-10 transition-all duration-200 overflow-hidden">
                                        {node.description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 🔥 LOTTIE (fills remaining space) */}
                <div className="flex-1 flex items-center justify-center px-4">
                    <Lottie
                        animationData={animation}
                        loop
                        className="w-full h-full max-h-48 opacity-60 brightness-150"
                    />
                </div>

            </div>
            <div className="px-4 py-2 border-t border-border text-[10px] text-gray-400 space-y-1">

                {/* DELETE */}
                <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition">
                    <Trash2 className="w-3 h-3 text-white" />
                    <span>
            Delete — <span className="text-gray-300">selected node/edge</span>
        </span>
                </div>

                {/* UNDO */}
                <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition">
                    <Undo2 className="w-3 h-3 text-white" />
                    <span>
            Ctrl + Z — <span className="text-gray-300">Undo</span>
        </span>
                </div>

                {/* REDO */}
                <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition">
                    <Redo2 className="w-3 h-3 text-white" />
                    <span>
            Ctrl + Y — <span className="text-gray-300">Redo</span>
        </span>
                </div>

            </div>
            {/* Footer */}
            <div className="px-4 py-2 border-t border-border text-[10px] text-gray-500 text-center">

                © Varshan Manish 2026
            </div>
        </div>
    );
}