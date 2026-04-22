import WorkflowCanvas from "@/components/canvas/WorkflowCanvas";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
    return (
        <div className="flex h-screen">
            <div className="w-64 border-r p-4">
                <h2 className="font-bold text-lg mb-4">Nodes</h2>
                <Sidebar />
            </div>
            <div className="flex-1">
                <WorkflowCanvas />
            </div>
        </div>
    );
}