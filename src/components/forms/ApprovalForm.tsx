import { WorkflowNode } from "@/types/nodeTypes";

type Props = {
    node: WorkflowNode;
};

export default function ApprovalForm({ node }: Props) {
    return <p>Approval Node: {node.data?.label}</p>;
}