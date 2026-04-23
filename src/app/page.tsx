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
        <PanelGroup direction="horizontal" className="h-screen bg-canvas">

            {/* 🔥 Sidebar */}
            <Panel ref={sidebarRef} defaultSize={18} minSize={12} collapsible>
                <Sidebar sidebarRef={sidebarRef} />
            </Panel>

            {/* 🔥 Resize Handle */}
            <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-gray-500 transition-colors" />

            {/* 🔥 Main Content */}
            <Panel defaultSize={82}>
                <WorkflowCanvas />
            </Panel>

        </PanelGroup>
    );
}