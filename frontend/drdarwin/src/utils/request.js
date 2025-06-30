import { ID_generator } from "./tools";

const baseUrl = "http://localhost:8080/ai";

export async function getConversations() {
    const conversations = await fetch(`${baseUrl}/conversation/getIds`, { 
        method: "GET" 
    });
    if (!conversations.ok) 
        throw new Error("Failed to fetch conversations");
    const data = await conversations.json();
    return data.data;
};

export async function createConversation() {
    const ID = ID_generator();
    const response = await fetch(`${baseUrl}/conversation/create?conversationId=${ID}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) 
        throw new Error("Failed to create conversation");
    return ID;
};

export async function deleteConversation(conversationId) {
    const response = await fetch(`${baseUrl}/conversation/delete?conversationId=${conversationId}`, {
        method: "DELETE"
    });
    if (!response.ok) 
        throw new Error("Failed to delete conversation");
};

export async function getMessages(conversationId) {
    const response = await fetch(`${baseUrl}/conversation/history?conversationId=${conversationId}`, {
        method: "GET"
    });
    if (!response.ok) 
        throw new Error("Failed to fetch messages");
    const data = await response.json();
    return data.data;
};

export async function chat(conversationId, message) {
    const response = await fetch(`${baseUrl}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "text/event-stream" },
        body: JSON.stringify({ prompt: message, conversationId }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.body.getReader();
};
