import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatBot() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = { sender: 'user', text: message };
    setChat(prev => [...prev, userMessage]);

    try {
      const res = await axios.post('http://localhost:5000/chat', { message });
      const botReply: Message = { sender: 'bot', text: res.data.reply };
      setChat(prev => [...prev, botReply]);
    } catch (error) {
      const errorReply: Message = { sender: 'bot', text: '⚠️ Server error. Please try again.' };
      setChat(prev => [...prev, errorReply]);
    }

    setMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[90vh] border rounded-xl bg-white shadow-lg p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-2 text-center">🛒 Inventory ChatBot</h2>
      <div className="flex-1 overflow-y-auto border p-2 mb-2">
        {chat.map((msg, i) => (
          <div key={i} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
            <p className={`p-2 my-1 rounded ${msg.sender === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Ask me something..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
