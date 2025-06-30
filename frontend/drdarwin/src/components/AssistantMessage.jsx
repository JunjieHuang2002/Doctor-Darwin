import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseContent } from '../utils/tools.js';

export default function AssistantMessage({ content }) {
    const segments = parseContent(content);
    const hasDisplay = Boolean(segments.displayText && segments.displayText.trim());
    const [showThinking, setShowThinking] = useState(false);

    return (
        <div className="flex flex-col w-full pt-3 pb-3 pl-6">
            {(!hasDisplay || showThinking) && segments.thinkingText && (
                <ThinkMessage text={segments.thinkingText} />
            )}

            {hasDisplay && (
                <button
                    onClick={() => setShowThinking(prev => !prev)}
                    className="self-start mb-2 text-sm text-gray-500 hover:text-gray-700 hover:cursor-pointer">
                    {showThinking ? "Hide Thoughts <" : "Show Thoughts >"}
                </button>
            )}

            <DisplayMessage text={segments.displayText} />
        </div>
    );
}

function ThinkMessage({ text }) {
    return (
        <div className="bg-gray-100 italic text-gray-600 px-3 py-1 rounded max-w-[60%] w-auto break-words whitespace-pre-wrap mb-2">
            {text}
        </div>
    );
}

function DisplayMessage({ text }) {
    return (
        <div className="bg-blue-50 p-3 rounded shadow max-w-[60%] w-auto break-words whitespace-pre-wrap">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
    );
}
