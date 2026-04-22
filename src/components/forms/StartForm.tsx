import { WorkflowNode } from "@/types/nodeTypes";

type Props = {
    node: WorkflowNode;
};

export default function StartForm({ node }: Props) {
    return <p>Start Node: {node.data?.label}</p>;
}