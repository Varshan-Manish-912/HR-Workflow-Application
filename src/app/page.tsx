import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
    return (
        <div className="flex h-screen bg-canvas">
            <Sidebar />
            <div className="flex-1 h-full">
                <WorkflowCanvas />
            </div>
        </div>
    );
}