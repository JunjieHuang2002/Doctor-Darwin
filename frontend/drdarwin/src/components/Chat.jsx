import { useEffect, useRef, useCallback, useReducer } from 'react';
import AssistantMessage from './AssistantMessage';
import UserMessage from './UserMessage';
import TextInput from './textInput.jsx';
import { getMessages, createConversation, chat } from '../utils/request';

export default function Chat({ currentConversation, setCurrentConversation }) {
    const [status, dispatch] = useReducer(chatReducer, new ChatStatus());
    const abortCtrl = useRef();
    const skipFetchId = useRef(null);
    const endRef = useRef();

    const scrollToBottom = useCallback(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(scrollToBottom, [status.messages]);

    useEffect(() => {
        if (!currentConversation) {
            dispatch({ type: ChatReducerTypes.RESET });
            return;
        }
        if (skipFetchId.current === currentConversation) {
            skipFetchId.current = null;
            return;
        }
        let mounted = true;
        getMessages(currentConversation)
            .then(msgs => {
                if (mounted) dispatch({ type: ChatReducerTypes.HISTORY, payload: msgs });
            })
            .catch(() => {
                if (mounted) dispatch({ type: ChatReducerTypes.ERROR, payload: "Failed to load history" });
            });
        return () => { mounted = false; abortCtrl.current?.abort(); };
    }, [currentConversation]);

    const handleSendMessage = useCallback(async prompt => {
        if (status.isGenerating) return;
        dispatch({ type: ChatReducerTypes.APPEND_USER, payload: prompt });
        dispatch({ type: ChatReducerTypes.APPEND_ASSISTANT });

        let id = currentConversation;
        if (!id) {
            id = await createConversation();
            setCurrentConversation(id);
            skipFetchId.current = id;
        }

        const ctrl = new AbortController();
        abortCtrl.current = ctrl;

        let buffer = "";
        try {
            const reader = await chat(id, prompt);
            abortCtrl.currentReader = reader;
            const decoder = new TextDecoder("utf-8");
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value).replace(/\n\n/g, "").replaceAll("data:", "");
                buffer += chunk;
                dispatch({ type: ChatReducerTypes.UPDATE_ASSISTANT, payload: buffer });
            }
        } catch (err) {
            if (err.name !== "AbortError")
                dispatch({ type: ChatReducerTypes.ERROR, payload: err.message || "Error during generation" });
        } finally {
            dispatch({ type: ChatReducerTypes.STOP });
            abortCtrl.current = null;
        }
    }, [currentConversation, setCurrentConversation, status.isGenerating]);

    const handleStopGenerating = useCallback(() => {
        abortCtrl.current?.abort();
        abortCtrl.currentReader?.cancel();
        dispatch({ type: ChatReducerTypes.STOP });
    }, []);

    return (
        <div className="w-4/5 bg-white m-[2%] overflow-y-auto rounded-lg flex flex-col shadow-lg relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {status.messages.map((m, i) =>
                m.role === "assistant"
                    ? <AssistantMessage key={i} content={m.content}/>
                    : <UserMessage key={i} content={m.content}/>
                )}
                {status.error && <div className="text-red-500">Error: {status.error}</div>}
                <div ref={endRef}/>
            </div>
            <TextInput
                onSend={handleSendMessage}
                onStop={handleStopGenerating}
                isGenerating={status.isGenerating}
            />
        </div>
    );
}

const ChatReducerTypes = Object.freeze({
    RESET: "RESET",
    HISTORY: "HISTORY",
    APPEND_USER: "APPEND_USER",
    APPEND_ASSISTANT: "APPEND_ASSISTANT",
    UPDATE_ASSISTANT: "UPDATE_ASSISTANT",
    ERROR: "ERROR",
    STOP: "STOP"
});

const RoleTypes = Object.freeze({
    USER: "user",
    ASSISTANT: "assistant"
});

class Message {
    constructor(role, content) {
        this.role = role;
        this.content = content;
    }
};

class ChatStatus {
    constructor({ messages = [], isGenerating = false, error = null } = {}) {
        this.messages = messages;
        this.isGenerating = isGenerating;
        this.error = error;
    }

    reset() {
        return new ChatStatus();
    }

    withHistory(msgs) {
        return new ChatStatus({ messages: msgs.map(m => new Message(m.role, m.content)), isGenerating: false, error: null });
    }

    appendUser(content) {
        return new ChatStatus({
            messages: [...this.messages, new Message(RoleTypes.USER, content)],
            isGenerating: this.isGenerating,
            error: this.error
        });
    }

    appendAssistant() {
        return new ChatStatus({
            messages: [...this.messages, new Message(RoleTypes.ASSISTANT, "")],
            isGenerating: true,
            error: null
        });
    }

    updateAssistant(content) {
        const msgs = [...this.messages];
        msgs[msgs.length - 1].content = content;
        return new ChatStatus({ messages: msgs, isGenerating: this.isGenerating, error: this.error });
    }

    withError(error) {
        return new ChatStatus({ messages: this.messages, isGenerating: false, error });
    }

    stop() {
        return new ChatStatus({ messages: this.messages, isGenerating: false, error: this.error });
    }
};

function chatReducer(status, action) {
    switch (action.type) {
        case ChatReducerTypes.RESET:
            return new ChatStatus().reset();
        case ChatReducerTypes.HISTORY:
            return new ChatStatus().withHistory(action.payload);
        case ChatReducerTypes.APPEND_USER:
            return status.appendUser(action.payload);
        case ChatReducerTypes.APPEND_ASSISTANT:
            return status.appendAssistant();
        case ChatReducerTypes.UPDATE_ASSISTANT:
            return status.updateAssistant(action.payload);
        case ChatReducerTypes.ERROR:
            return status.withError(action.payload);
        case ChatReducerTypes.STOP:
            return status.stop();
        default:
            return status;
    }
};
