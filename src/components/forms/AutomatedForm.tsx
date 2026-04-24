"use client";

import React from "react";
import { AutomatedNodeType } from "@/types/nodeTypes";
import { getAutomations, Automation } from "@/lib/api/workFlowApi";

const inputClass =
    "w-full bg-white/5 backdrop-blur-md border border-gray-600/50 text-white text-sm px-2 py-1 rounded-md outline-none placeholder:text-gray-400 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition-all";

type Props = {
    node: AutomatedNodeType;
    updateNodeFieldAction: <K extends keyof AutomatedNodeType["data"]>(
        id: string,
        field: K,
        value: AutomatedNodeType["data"][K]
    ) => void;
};

export default function AutomatedForm({
                                          node,
                                          updateNodeFieldAction,
                                      }: Props) {
    const [actions, setActions] = React.useState<Automation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);

    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const params = node.data.actionParams || {};

    // 🔹 Fetch automations
    React.useEffect(() => {
        const fetchActions = async () => {
            try {
                const data = await getAutomations();
                setActions(data);
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, []);

    // 🔹 Close dropdown on outside click
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedAction = actions.find(
        (a) => a.id === node.data.actionId
    );

    const updateParam = (key: string, value: string) => {
        updateNodeFieldAction(node.id, "actionParams", {
            ...params,
            [key]: value,
        });
    };

    return (
        <div className="space-y-3">
            <p className="font-medium">Automated Step</p>

            {/* Title */}
            <input
                className={inputClass}
                placeholder="Enter Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            {/* 🔥 Custom Select */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="w-full bg-white/5 backdrop-blur-md border border-gray-600/50 text-white text-sm px-2 py-1 rounded-md text-left flex justify-between items-center"
                >
          <span className="text-gray-300">
            {loading
                ? "Loading actions..."
                : selectedAction
                    ? selectedAction.label
                    : "Select Action"}
          </span>

                    <span className="text-gray-400">▾</span>
                </button>

                {open && (
                    <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {actions.map((action) => (
                            <div
                                key={action.id}
                                onClick={() => {
                                    updateNodeFieldAction(node.id, "actionId", action.id);
                                    setOpen(false);
                                }}
                                className="px-3 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer transition"
                            >
                                {action.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Dynamic Params */}
            {selectedAction && (
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Parameters</p>

                    {selectedAction.params.map((param) => (
                        <input
                            key={param}
                            className={inputClass}
                            placeholder={`Enter ${param}`}
                            value={(params[param] as string) || ""}
                            onChange={(e) =>
                                updateParam(param, e.target.value)
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}