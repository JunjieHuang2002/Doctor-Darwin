import { useRef, useState, useCallback, useLayoutEffect } from 'react';

export default function TextInput({ onSend, onStop, isGenerating }) {
    const [value, setValue] = useState("");
    const taRef = useRef();

    useLayoutEffect(() => {
        const ta = taRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
    });

    const handleKeyDown = useCallback(e => {
        if (e.key === "Enter" && !e.shiftKey && value.trim() && !isGenerating) {
            e.preventDefault();
            onSend(value.trim());
            setValue("");
        }
    }, [value, isGenerating, onSend]);

    return (
        <div className="p-4">
            <div className="relative rounded-xl border border-gray-300 bg-white shadow-sm">
                <TextInputArea 
                    taRef={taRef} 
                    value={value} 
                    setValue={setValue} 
                    handleKeyDown={handleKeyDown} 
                    isGenerating={isGenerating}
                />
                <div className="absolute right-2 bottom-2 flex">
                    {isGenerating ? (
                        <StopButton onStop={onStop} />
                    ) : (
                        <SendButton onSend={onSend} value={value} />
                    )}
                </div>
            </div>
        </div>
    );
}

function TextInputArea({ taRef, value, setValue, handleKeyDown, isGenerating }) {
    return (
        <textarea
            ref={taRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? "Generating response..." : "Ask anything..."}
            disabled={isGenerating}
            className={`block w-full resize-none py-4 pl-4 pr-12 min-h-[60px] max-h-[200px] border-0 focus:ring-0 focus:outline-none placeholder-gray-400 ${
                isGenerating ? "text-gray-500 bg-gray-50 cursor-not-allowed" : "text-gray-900"
            }`}
        />
    );
}

function SendButton({ onSend, value }) {
    return (
        <button 
            onClick={() => { onSend(value.trim()); }}
            disabled={!value.trim()}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                value.trim()
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-200 cursor-not-allowed"
            }`}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="w-5 h-5 text-white">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
        </button>
    );
}

function StopButton({ onStop }) {
    return (
        <button 
            onClick={onStop}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer">
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="w-5 h-5 text-white">
                <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
        </button>
    );
}
