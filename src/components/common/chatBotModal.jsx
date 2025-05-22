import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { getChatbotResponse } from '../../api/getChatbotResponse.jsx';

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
    <>
      <div className='text-primary fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='fixed inset-0 bg-gray-700/50' onClick={onClose}></div>
        <div className='relative w-full max-w-2xl bg-card-bg rounded-lg shadow-xl'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 bg-linear-(--gradient-text) rounded-t-lg'>
            <h5 className='flex items-center text-xl font-semibold text-white'>
              <FaRobot /> AI Assistant
            </h5>
            <button
              onClick={onClose}
              className='cursor-pointer text-white hover:text-gray-200 transition-colors'
              aria-label='Close'
            >
              <FaTimes className='text-xl' />
            </button>
          </div>

          {/* Messages */}
          <div className='h-96 overflow-y-auto p-4 bg-card-bg'>
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.type === 'user'
                      ? 'bg-linear-(--gradient-primary) text-text-body rounded-br-none'
                      : 'bg-border-light text-text-body rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className='p-4 border-t border-border-light'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type a message...'
                className='flex-1 p-2 border border-border-light rounded-lg bg-card-bg text-text-body
                focus:outline-none focus:ring-2 focus:ring-accent'
                disabled={isLoading}
              />
              <button
                type='submit'
                disabled={isLoading}
                className='bg-accent text-button-text p-2 rounded-lg hover:opacity-90 
                transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? <FaSpinner className='animate-spin' /> : <FaPaperPlane />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
