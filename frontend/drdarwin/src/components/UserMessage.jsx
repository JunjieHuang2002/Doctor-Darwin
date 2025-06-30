export default function UserMessage({ content }) {
    return (
        <div className="flex flex-col w-full pt-3 pb-3 pl-6 items-end">
            <div className="bg-blue-50 p-3 rounded shadow max-w-[60%] w-auto break-words whitespace-pre-wrap">
                {content}
            </div>
        </div>
    );
}
