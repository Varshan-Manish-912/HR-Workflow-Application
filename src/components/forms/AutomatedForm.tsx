"use client";

import React, { useEffect, useRef, useState } from "react";

import { AutomatedNodeType } from "@/types/nodeTypes";
import { Automation, getAutomations } from "@/lib/api/workFlowApi";

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
    const [actions, setActions] = useState<Automation[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const params = node.data.actionParams || {};

    useEffect(() => {
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

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!dropdownRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
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

            <input
                className={inputClass}
                placeholder="Enter Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center justify-between w-full px-2 py-1 text-sm text-left text-white border rounded-md bg-white/5 backdrop-blur-md border-gray-600/50"
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
                    <div className="absolute z-50 w-full mt-1 overflow-y-auto bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-48">
                        {actions.map((action) => (
                            <div
                                key={action.id}
                                onClick={() => {
                                    updateNodeFieldAction(node.id, "actionId", action.id);
                                    setOpen(false);
                                }}
                                className="px-3 py-2 text-sm text-white transition cursor-pointer hover:bg-gray-700"
                            >
                                {action.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedAction && (
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Parameters</p>

                    {selectedAction.params.map((param) => (
                        <input
                            key={param}
                            className={inputClass}
                            placeholder={`Enter ${param}`}
                            value={(params[param] as string) || ""}
                            onChange={(e) => updateParam(param, e.target.value)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}