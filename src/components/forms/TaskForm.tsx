"use client";

import { TaskNodeType } from "@/types/nodeTypes";

type Props = {
    node: TaskNodeType;
    updateNodeFieldAction: (
        id: string,
        field: keyof TaskNodeType["data"],
        value: string
    ) => void;
};

export default function TaskForm({ node, updateNodeFieldAction }: Props) {
    return (
        <div className="space-y-3">
            <p className="font-medium">Task Config</p>

            <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Title"
                value={node.data?.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Description"
                value={node.data?.description || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "description", e.target.value)
                }
            />

            <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Assignee"
                value={node.data?.assignee || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "assignee", e.target.value)
                }
            />

            <input
                type="date"
                className="w-full border px-2 py-1 rounded"
                value={node.data?.dueDate || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "dueDate", e.target.value)
                }
            />
        </div>
    );
}