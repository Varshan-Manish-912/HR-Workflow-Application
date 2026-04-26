import { Dispatch, SetStateAction } from "react";
import { Edge } from "reactflow";

type Props = {
    edges: Edge[];
    selectedEdgeId: string | null;
    setEdges: Dispatch<SetStateAction<Edge[]>>;
};

export default function EdgePanel({
                                      edges,
                                      selectedEdgeId,
                                      setEdges,
                                  }: Props) {
    const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

    return (
        <div className="relative flex flex-col h-full p-4 bg-panel">
            <h2 className="mb-3 text-sm font-bold text-gray-300">
                Edge Configuration
            </h2>

            {!selectedEdge ? (
                <div className="flex items-center justify-center flex-1 text-sm text-gray-500">
                    Select an edge
                </div>
            ) : (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-400">Label</label>
                        <input
                            value={String(selectedEdge.label ?? "")}
                            onChange={(e) => {
                                const value = e.target.value;

                                setEdges((eds) =>
                                    eds.map((edge) =>
                                        edge.id === selectedEdge.id
                                            ? { ...edge, label: value }
                                            : edge
                                    )
                                );
                            }}
                            className="w-full px-2 py-1 mt-1 text-sm text-white bg-gray-700 rounded outline-none"
                            placeholder="Enter label"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setEdges((eds) =>
                                eds.filter((edge) => edge.id !== selectedEdge.id)
                            );
                        }}
                        className="flex items-center justify-center gap-2 px-3 py-1.5 mt-2 text-xs text-white transition bg-gray-700 rounded hover:bg-red-700"
                    >
                        Delete Edge
                    </button>
                </div>
            )}
        </div>
    );
}