"use client";

import React from "react";
import { StartNodeType } from "@/types/nodeTypes";

const inputClass =
    "w-full bg-gray-700 border border-gray-600 text-white text-sm px-2 py-1 rounded outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-blue-500";

type Props = {
    node: StartNodeType;
    updateNodeFieldAction: <K extends keyof StartNodeType["data"]>(
        id: string,
        field: K,
        value: StartNodeType["data"][K]
    ) => void;
};

export default function StartForm({ node, updateNodeFieldAction }: Props) {
    const metadata = node.data.metadata || {};


    const [editingKeys, setEditingKeys] = React.useState<
        Record<string, string>
    >({});


    const addField = () => {
        updateNodeFieldAction(node.id, "metadata", {
            ...metadata,
            ["key" + Date.now()]: "",
        });
    };


    const updateValue = (key: string, value: string) => {
        updateNodeFieldAction(node.id, "metadata", {
            ...metadata,
            [key]: value,
        });
    };

    const deleteField = (key: string) => {
        const newMeta = { ...metadata };
        delete newMeta[key];

        updateNodeFieldAction(node.id, "metadata", newMeta);

        // also clean local editing state (important)
        setEditingKeys((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    };

    return (
        <div className="space-y-3">
            <p className="font-medium">Start Config</p>


            <input
                className={inputClass}
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
                placeholder="Start Title"
            />

            {/* Metadata */}
            <div className="space-y-2">
                <p className="text-sm text-gray-500">Metadata</p>

                {Object.entries(metadata).map(([key, value]) => {
                    const tempKey = editingKeys[key] ?? key;

                    return (
                        <div key={key} className="flex gap-2 items-center">
                            {/* KEY */}
                            <input
                                className="w-1/2 border px-2 py-1 rounded"
                                value={tempKey}
                                onChange={(e) =>
                                    setEditingKeys((prev) => ({
                                        ...prev,
                                        [key]: e.target.value,
                                    }))
                                }
                                onBlur={() => {
                                    const newKey = editingKeys[key];
                                    if (!newKey || newKey === key) return;

                                    const newMeta = { ...metadata };
                                    const val = newMeta[key];
                                    delete newMeta[key];
                                    newMeta[newKey] = val;

                                    updateNodeFieldAction(node.id, "metadata", newMeta);

                                    setEditingKeys((prev) => {
                                        const updated = { ...prev };
                                        delete updated[key];
                                        return updated;
                                    });
                                }}
                            />

                            {/* VALUE */}
                            <input
                                className="w-1/2 border px-2 py-1 rounded"
                                value={value}
                                onChange={(e) => updateValue(key, e.target.value)}
                            />

                            {/* DELETE BUTTON */}
                            <button
                                onClick={() => deleteField(key)}
                                className="text-red-500 text-xs px-2"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}

                {/* ADD BUTTON */}
                <button
                    onClick={addField}
                    className="text-xs text-blue-500"
                >
                    + Add metadata
                </button>
            </div>
        </div>
    );
}