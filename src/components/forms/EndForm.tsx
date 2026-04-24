"use client";

import { EndNodeType } from "@/types/nodeTypes";

const inputClass =
    "w-full bg-white/5 backdrop-blur-md border border-gray-600/50 text-white text-sm px-2 py-1 rounded-md outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all";

const textareaClass =
    "w-full bg-white/5 backdrop-blur-md border border-gray-600/50 text-white text-sm px-2 py-1 rounded-md outline-none placeholder:text-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all resize-none";

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
                className={inputClass}
                placeholder="Enter Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            {/* End Message */}
            <textarea
                className={textareaClass}
                placeholder="Enter End Message"
                rows={3}
                value={node.data.endMessage || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "endMessage", e.target.value)
                }
            />

            {/* 🔥 Modern Toggle */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Enable Summary</span>

                <button
                    type="button"
                    onClick={() =>
                        updateNodeFieldAction(
                            node.id,
                            "summary",
                            !node.data.summary
                        )
                    }
                    className={`relative w-10 h-5 rounded-full transition ${
                        node.data.summary ? "bg-red-500" : "bg-gray-600"
                    }`}
                >
          <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition ${
                  node.data.summary ? "translate-x-5" : ""
              }`}
          />
                </button>
            </div>
        </div>
    );
}