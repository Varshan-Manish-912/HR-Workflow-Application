"use client";

import { EndNodeType } from "@/types/nodeTypes";

type Props = {
    node: EndNodeType;
    updateNodeFieldAction: <K extends keyof EndNodeType["data"]>(
        id: string,
        field: K,
        value: EndNodeType["data"][K]
    ) => void;
};

export default function EndForm({
                                    node,
                                    updateNodeFieldAction,
                                }: Props) {
    return (
        <div className="space-y-3">
            <p className="font-medium">End Config</p>

            {/* Title */}
            <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            {/* End Message */}
            <textarea
                className="w-full border px-2 py-1 rounded"
                placeholder="End Message"
                value={node.data.endMessage || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "endMessage", e.target.value)
                }
            />

            {/* Summary Toggle */}
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={node.data.summary || false}
                    onChange={(e) =>
                        updateNodeFieldAction(node.id, "summary", e.target.checked)
                    }
                />
                Enable Summary
            </label>
        </div>
    );
}