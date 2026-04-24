"use client";

import { Play, CheckCircle, User, Zap, Square } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";

type Props = {
    sidebarRef: React.RefObject<ImperativePanelHandle | null>;
};

const nodeTypes = [
    { type: "start", label: "Start Node", icon: Play, color: "text-green-400" },
    { type: "task", label: "Task Node", icon: User, color: "text-blue-400" },
    { type: "approval", label: "Approval Node", icon: CheckCircle, color: "text-purple-400" },
    { type: "automated", label: "Automated Node", icon: Zap, color: "text-yellow-400" },
    { type: "end", label: "End Node", icon: Square, color: "text-red-400" },
];

export default function Sidebar({ sidebarRef }: Props) {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="w-full h-full bg-sidebar text-textPrimary flex flex-col relative">

            {/* 🔥 Collapse Button */}
            <button
                onClick={() => sidebarRef.current?.collapse()}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-red-600 text-white px-2 py-1 rounded text-xs z-10"
            >
                −
            </button>

            {/* 🔥 Title */}
            <div className="px-4 pt-4 pb-2 border-b border-border">
                <h1 className="text-sm font-semibold text-white tracking-wide">
                    HR-Workflow-Designer
                </h1>
            </div>

            {/* 🔥 Nodes Section */}
            <div className="flex-1 p-4 overflow-y-auto">

                <h2 className="text-xs font-semibold mb-3 text-gray-400 tracking-wide">
                    Workflow Nodes
                </h2>

                <div className="flex flex-col gap-2">
                    {nodeTypes.map((node) => {
                        const Icon = node.icon;

                        return (
                            <div
                                key={node.type}
                                draggable
                                onDragStart={(e) => onDragStart(e, node.type)}
                                className="
                  group
                  flex items-center gap-3
                  bg-panel/80
                  border border-border/50
                  rounded-xl
                  px-3 py-2
                  text-sm
                  cursor-grab
                  backdrop-blur-md

                  hover:bg-[#23242a]
                  hover:border-gray-600
                  hover:shadow-lg
                  hover:shadow-black/40

                  active:cursor-grabbing
                  active:scale-95

                  transition-all duration-200
                "
                            >
                                <Icon className={`w-4 h-4 ${node.color}`} />

                                <span className="text-gray-200 group-hover:text-white">
                  {node.label}
                </span>

                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-white transition-all" />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 🔥 Footer */}
            <div className="px-4 py-2 border-t border-border text-[10px] text-gray-500 text-center">
                © Varshan Manish 2026
            </div>

        </div>
    );
}