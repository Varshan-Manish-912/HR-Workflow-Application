"use client";

import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";
import Sidebar from "@/components/sidebar/Sidebar";
import {
    ImperativePanelHandle,
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
import { useRef } from "react";

export default function Home() {
    const sidebarRef = useRef<ImperativePanelHandle | null>(null);

    return (
        <div className="h-screen flex flex-col bg-canvas">

            {/* 🔥 TOP BAR */}
            <div className="h-12 px-4 flex items-center justify-center border-b border-gray-800 bg-[#0b0f17] backdrop-blur-md">

                <h1 className="text-sm font-semibold text-white tracking-wide">
                    HR Workflow Application
                </h1>

                {/* (optional future controls) */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    {/* You can add save/export buttons later */}
                </div>

            </div>

            {/* 🔥 MAIN AREA */}
            <div className="flex-1">
                <PanelGroup direction="horizontal" className="h-full">

                    {/* Sidebar */}
                    <Panel ref={sidebarRef} defaultSize={18} minSize={12} collapsible>
                        <Sidebar sidebarRef={sidebarRef} />
                    </Panel>

                    {/* Resize Handle */}
                    <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-500 transition-colors" />

                    {/* Canvas */}
                    <Panel defaultSize={82}>
                        <WorkflowCanvas />
                    </Panel>

                </PanelGroup>
            </div>

        </div>
    );
}