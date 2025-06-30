import { useState, useEffect, useCallback } from 'react';
import { getConversations, createConversation, deleteConversation } from '../utils/request';

export default function NavBar({ currentConversation, setCurrentConversation }) {
    const [conversations, setConversations] = useState([]);
    const [toDelete, setToDelete] = useState(null);

    useEffect(() => {
        getConversations().then(setConversations);
    }, []);

    useEffect(() => {
        if (currentConversation && !conversations.includes(currentConversation)) 
            setConversations(prev => [currentConversation, ...prev]);
    }, [currentConversation, conversations]);

    const handleCreateConversation = useCallback(async () => {
        const id = await createConversation();
        setCurrentConversation(id);
        setConversations(prev => [id, ...prev]);
    }, [setCurrentConversation]);

    const handleSelectConversation = useCallback(id => setCurrentConversation(id), [setCurrentConversation]);

    const handleDeleteConversation = useCallback(async id => {
        await deleteConversation(id);
        if (currentConversation === id) setCurrentConversation(null);
        setConversations(prev => prev.filter(cid => cid !== id));
    }, [currentConversation, setCurrentConversation]);

    return (
        <nav className="w-1/5 bg-white overflow-y-auto m-[2%] rounded-lg shadow-lg">
            <NewConversationButton handleCreateConversation={handleCreateConversation} />
            <ul className="p-4 space-y-2">
                {conversations.map(id => (
                    <NavItem 
                        key={id}
                        id={id}
                        currentConversation={currentConversation} 
                        handleSelectConversation={handleSelectConversation} 
                        setToDelete={setToDelete}
                    />
                ))}
            </ul>

            {toDelete && (
                <ConfirmModal
                    title="Delete chat?"
                    message={`This will delete Conversation ${toDelete}.`}
                    onCancel={() => setToDelete(null)}
                    onConfirm={() => { handleDeleteConversation(toDelete); setToDelete(null); }}
                />
            )}
        </nav>
    );
}

function NewConversationButton({ handleCreateConversation }) {
    return (
        <div className="p-4 border-gray-200 border-b">
            <button 
                onClick={handleCreateConversation} 
                className="w-full text-left text-blue-500 hover:text-blue-800 font-semibold hover:cursor-pointer"
            >+ New Conversation</button>
        </div>
    );
}

function NavItem({ id, currentConversation, handleSelectConversation, setToDelete }) {
    return (
        <li
            onClick={() => handleSelectConversation(id)}
            className={`group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer ${
                currentConversation === id ? "bg-gray-100 border border-gray-200" : ""
            }`}>
            <span className="truncate max-w-[80%] font-medium text-gray-700">{id}</span>
            <button 
                className="opacity-0 group-hover:opacity-100 hover:cursor-pointer p-1.5 rounded-full hover:bg-gray-200 duration-200"
                onClick={e => { e.stopPropagation(); setToDelete(id); }}>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors">
                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 01-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                </svg>
            </button>
        </li>
    );
}

function ConfirmModal({ title, message, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 hover:cursor-pointer"
                    >Cancel</button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
                    >Confirm</button>
                </div>
            </div>
        </div>
    );
}
