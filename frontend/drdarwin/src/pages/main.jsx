import { useState } from 'react';
import Header from '../components/header';
import NavBar from '../components/navBar';
import Chat from '../components/Chat';

export default function Main() {
    const [currentConversation, setCurrentConversation] = useState(null);
    return (
        <div className="bg-gray-100 h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden mx-[5%]">
                <NavBar 
                    currentConversation={currentConversation} 
                    setCurrentConversation={setCurrentConversation} />
                <Chat 
                    currentConversation={currentConversation} 
                    setCurrentConversation={setCurrentConversation} />
            </div>
        </div>
    );
}
