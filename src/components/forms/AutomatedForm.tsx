import { WorkflowNode } from "@/types/nodeTypes";

type Props = {
    node: WorkflowNode;
};

export default function AutomatedForm({ node }: Props) {
    return <p>Automated Node: {node.data?.label}</p>;
}