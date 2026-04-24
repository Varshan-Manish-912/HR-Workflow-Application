"use client";

import { ApprovalNodeType } from "@/types/nodeTypes";

const inputClass =
    "w-full bg-white/5 backdrop-blur-md border border-gray-600/50 text-white text-sm px-2 py-1 rounded-md outline-none placeholder:text-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all";

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
                className={inputClass}
                placeholder="Enter Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            {/* Role */}
            <input
                className={inputClass}
                placeholder="Enter Role (e.g., Manager)"
                value={node.data.role || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "role", e.target.value)
                }
            />

            {/* Threshold */}
            <input
                type="number"
                className={inputClass}
                placeholder="Enter Threshold"
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