export type ActionField = {
    name: string;
    label: string;
    type: "text" | "number";
};

export type ActionDefinition = {
    id: string;
    label: string;
    fields: ActionField[];
};

export const MOCK_ACTIONS: ActionDefinition[] = [
    {
        id: "send_email",
        label: "Send Email",
        fields: [
            { name: "to", label: "Recipient", type: "text" },
            { name: "subject", label: "Subject", type: "text" },
        ],
    },
    {
        id: "create_ticket",
        label: "Create Ticket",
        fields: [
            { name: "title", label: "Title", type: "text" },
            { name: "priority", label: "Priority", type: "text" },
        ],
    },
];