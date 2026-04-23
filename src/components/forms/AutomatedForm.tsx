"use client";

import { AutomatedNodeType } from "@/types/nodeTypes";
import { MOCK_ACTIONS } from "@/data/mockActions";

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
    const selectedAction = MOCK_ACTIONS.find(
        (a) => a.id === node.data.actionId
    );

    const params = node.data.actionParams || {};

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
                <option value="">Select Action</option>
                {MOCK_ACTIONS.map((action) => (
                    <option key={action.id} value={action.id}>
                        {action.label}
                    </option>
                ))}
            </select>

            {/* Dynamic Params */}
            {selectedAction && (
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Parameters</p>

                    {selectedAction.fields.map((field) => (
                        <input
                            key={field.name}
                            className="w-full border px-2 py-1 rounded"
                            placeholder={field.label}
                            value={params[field.name] || ""}
                            onChange={(e) =>
                                updateParam(field.name, e.target.value)
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}