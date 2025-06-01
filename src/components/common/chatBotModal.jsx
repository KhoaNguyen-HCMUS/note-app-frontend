import { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../../api/getChatbotResponse.jsx';
import ChatHeader from './chatbot/chatHeader.jsx';
import ChatMessages from './chatbot/chatMessages.jsx';
import ChatInput from './chatbot/chatInput.jsx';

export default function ChatbotModal({ show, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);

    setIsLoading(true);
    try {
      const response = await getChatbotResponse(userMessage);
      setMessages((prev) => [...prev, { type: 'bot', text: response }]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className='text-primary fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='fixed inset-0 bg-gray-700/50' onClick={onClose}></div>
      <div className='relative w-full max-w-4xl bg-card-bg rounded-lg shadow-xl max-h-[90vh] flex flex-col'>
        <ChatHeader onClose={onClose} />
        <ChatMessages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
        <ChatInput input={input} setInput={setInput} onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
