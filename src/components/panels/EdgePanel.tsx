import { Edge } from "reactflow";

type Props = {
    edges: Edge[];
    selectedEdgeId: string | null;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

export default function EdgePanel({ edges, selectedEdgeId, setEdges }: Props) {
    const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

    return (
        <div className="relative h-full bg-panel p-4 flex flex-col">

            {/* 🔥 HEADER (always visible) */}
            <h2 className="font-bold text-sm text-gray-300 mb-3">
                Edge Configuration
            </h2>

            {/* BODY */}
            {!selectedEdge ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                    Select an edge
                </div>
            ) : (
                <div className="space-y-3">

                    {/* Label */}
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
                            className="w-full mt-1 bg-gray-700 text-white text-sm px-2 py-1 rounded outline-none"
                            placeholder="Enter label"
                        />
                    </div>

                </div>
            )}
        </div>
    );
}