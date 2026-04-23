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
        <div className="w-64 bg-sidebar border-r border-border text-textPrimary p-4">
            <h2 className="text-lg font-semibold mb-4">Nodes</h2>
            <div className="flex flex-col gap-3">
                {nodeTypes.map((node) => (
                    <div
                        key={node.type}
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                        className="
            bg-panel
            border border-border
            rounded-lg
            px-3 py-2
            text-sm
            cursor-grab
            hover:bg-[#23242a]
            transition-all
            duration-150
            active:cursor-grabbing
          "
                    >
                        {node.label}
                    </div>
                ))}
            </div>
        </div>
    );
}