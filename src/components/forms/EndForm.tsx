import { WorkflowNode } from "@/types/nodeTypes";

type Props = {
    node: WorkflowNode;
};

export default function EndForm({ node }: Props) {
    return <p>End Node: {node.data?.label}</p>;
}