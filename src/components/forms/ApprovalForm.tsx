"use client";

import { ApprovalNodeType } from "@/types/nodeTypes";

type Props = {
    node: ApprovalNodeType;
    updateNodeFieldAction: <K extends keyof ApprovalNodeType["data"]>(
        id: string,
        field: K,
        value: ApprovalNodeType["data"][K]
    ) => void;
};

export default function ApprovalForm({
                                         node,
                                         updateNodeFieldAction,
                                     }: Props) {
    return (
        <div className="space-y-3">
            <p className="font-medium">Approval Config</p>

            {/* Title */}
            <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            {/* Role */}
            <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Approver Role (e.g., Manager)"
                value={node.data.role || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "role", e.target.value)
                }
            />

            {/* Threshold */}
            <input
                type="number"
                className="w-full border px-2 py-1 rounded"
                placeholder="Auto-approve threshold"
                value={node.data.threshold ?? ""}
                onChange={(e) =>
                    updateNodeFieldAction(
                        node.id,
                        "threshold",
                        e.target.value === "" ? undefined : Number(e.target.value)
                    )
                }
            />
        </div>
    );
}