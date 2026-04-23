"use client";

import React from "react";
import { AutomatedNodeType } from "@/types/nodeTypes";
import { getAutomations, Automation } from "@/lib/api/workFlowApi";

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

    const params = node.data.actionParams || {};

    // 🔹 Fetch automations
    React.useEffect(() => {
        const fetchActions = async () => {
            try {
                const data = await getAutomations();
                console.log("AUTOMATIONS:", data);
                setActions(data);
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, []);

    // 🔹 Find selected action
    const selectedAction = actions.find(
        (a) => a.id === node.data.actionId
    );

    // 🔹 Update param safely
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
                className="w-full border px-2 py-1 rounded"
                placeholder="Title"
                value={node.data.label || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "label", e.target.value)
                }
            />

            {/* Action Selector */}
            <select
                className="w-full border px-2 py-1 rounded"
                value={node.data.actionId || ""}
                onChange={(e) =>
                    updateNodeFieldAction(node.id, "actionId", e.target.value)
                }
            >
                <option value="">
                    {loading ? "Loading actions..." : "Select Action"}
                </option>

                {actions.map((action) => (
                    <option key={action.id} value={action.id}>
                        {action.label}
                    </option>
                ))}
            </select>

            {/* Dynamic Params */}
            {selectedAction && (
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Parameters</p>

                    {selectedAction.params.map((param) => (
                        <input
                            key={param}
                            className="w-full border px-2 py-1 rounded"
                            placeholder={param}
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