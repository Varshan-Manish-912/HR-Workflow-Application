"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

import { StartNodeType } from "@/types/nodeTypes";

const inputClass =
    "w-full bg-white/5 backdrop-blur-md border border-gray-600/50 text-white text-sm px-2 py-1 rounded-md outline-none placeholder:text-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all";

type Props = {
    node: StartNodeType;
    updateNodeFieldAction: <K extends keyof StartNodeType["data"]>(
        id: string,
        field: K,
        value: StartNodeType["data"][K]
    ) => void;
};

export default function StartForm({
                                      node,
                                      updateNodeFieldAction,
                                  }: Props) {
    const metadata = node.data.metadata || {};
    const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});

    const addField = () => {
        const tempKey = `temp_${Date.now()}`;

        updateNodeFieldAction(node.id, "metadata", {
            ...metadata,
            [tempKey]: "",
        });

        setEditingKeys((prev) => ({
            ...prev,
            [tempKey]: "",
        }));
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
                placeholder="Enter Node Title"
            />

            <div className="space-y-2">
                <p className="text-sm text-gray-500">Metadata</p>

                {Object.entries(metadata).map(([key, value]) => {
                    const tempKey = editingKeys[key] ?? key;

                    return (
                        <div key={key} className="flex items-center gap-2">
                            <input
                                className={inputClass}
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
                                placeholder="Enter Key"
                            />

                            <input
                                className={inputClass}
                                value={value}
                                onChange={(e) => updateValue(key, e.target.value)}
                                placeholder="Enter Value"
                            />

                            <button
                                onClick={() => deleteField(key)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    );
                })}

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