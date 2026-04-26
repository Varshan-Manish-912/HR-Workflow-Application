"use client";

import React, { useState } from "react";
import { Calendar, X } from "lucide-react";

import { TaskNodeType } from "@/types/nodeTypes";

type Props = {
    node: TaskNodeType;
    updateNodeFieldAction: <K extends keyof TaskNodeType["data"]>(
        id: string,
        field: K,
        value: TaskNodeType["data"][K]
    ) => void;
};

const inputClass =
    "w-full bg-white/5 backdrop-blur-md border border-gray-600/50 text-white text-sm px-2 py-1 rounded-md outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all";

export default function TaskForm({
                                     node,
                                     updateNodeFieldAction,
                                 }: Props) {
    const customFields = node.data.customFields || {};
    const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});

    const addField = () => {
        updateNodeFieldAction(node.id, "customFields", {
            ...customFields,
            [`key${Date.now()}`]: "",
        });
    };

    const updateValue = (key: string, value: string) => {
        updateNodeFieldAction(node.id, "customFields", {
            ...customFields,
            [key]: value,
        });
    };

    const deleteField = (key: string) => {
        const newFields = { ...customFields };
        delete newFields[key];

        updateNodeFieldAction(node.id, "customFields", newFields);

        setEditingKeys((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
        });
    };

    return (
        <div className="space-y-3">
            <p className="font-medium">Task Config</p>

            <input
                className={inputClass}
                placeholder="Enter Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            <input
                className={inputClass}
                placeholder="Enter Description"
                value={node.data.description || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "description", e.target.value)
                }
            />

            <input
                className={inputClass}
                placeholder="Enter Assignee"
                value={node.data.assignee || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "assignee", e.target.value)
                }
            />

            <div className="relative">
                <input
                    type="date"
                    className={inputClass}
                    value={node.data.dueDate || ""}
                    onChange={(e) =>
                        updateNodeFieldAction(node.id, "dueDate", e.target.value)
                    }
                />
                <Calendar
                    size={16}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
            </div>

            <div className="space-y-2">
                <p className="text-sm text-gray-500">Custom Fields</p>

                {Object.entries(customFields).map(([key, value]) => {
                    const tempKey = editingKeys[key] ?? key;

                    return (
                        <div key={key} className="flex items-center gap-2">
                            <input
                                className={inputClass}
                                value={tempKey}
                                placeholder="Enter Key"
                                onChange={(e) =>
                                    setEditingKeys((prev) => ({
                                        ...prev,
                                        [key]: e.target.value,
                                    }))
                                }
                                onBlur={() => {
                                    const newKey = editingKeys[key];
                                    if (!newKey || newKey === key) return;

                                    const newFields = { ...customFields };
                                    const val = newFields[key];

                                    delete newFields[key];
                                    newFields[newKey] = val;

                                    updateNodeFieldAction(
                                        node.id,
                                        "customFields",
                                        newFields
                                    );

                                    setEditingKeys((prev) => {
                                        const updated = { ...prev };
                                        delete updated[key];
                                        return updated;
                                    });
                                }}
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
                    + Add field
                </button>
            </div>
        </div>
    );
}