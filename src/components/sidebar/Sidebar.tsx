"use client";

const nodeTypes = [
    { type: "start", label: "Start Node" },
    { type: "task", label: "Task Node" },
    { type: "approval", label: "Approval Node" },
    { type: "automated", label: "Automated Node" },
    { type: "end", label: "End Node" },
];

export default function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="space-y-3">
            {nodeTypes.map((node) => (
                <div
                    key={node.type}
                    draggable
                    onDragStart={(e) => onDragStart(e, node.type)}
                    className="p-3 border rounded cursor-grab bg-white shadow-sm hover:bg-gray-50"
                >
                    {node.label}
                </div>
            ))}
        </div>
    );
}