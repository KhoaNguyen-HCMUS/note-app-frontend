import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getChatbotResponse } from '../../api/getChatbotResponse.jsx';
import { useTranslation } from 'react-i18next';
import 'highlight.js/styles/github.css'; // CSS cho syntax highlighting

export default function ChatbotModal({ show, onClose }) {
  const { t } = useTranslation();
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

  // Component để render tin nhắn
  const MessageContent = ({ message }) => {
    if (message.type === 'user') {
      return <span>{message.text}</span>;
    }

    // Render markdown cho bot messages
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling cho các element
          h1: ({ children }) => <h1 className='text-xl font-bold mb-2 text-text-heading'>{children}</h1>,
          h2: ({ children }) => <h2 className='text-lg font-semibold mb-2 text-text-heading'>{children}</h2>,
          h3: ({ children }) => <h3 className='text-md font-medium mb-2 text-text-heading'>{children}</h3>,
          p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
          ul: ({ children }) => <ul className='list-disc list-inside mb-2 space-y-1'>{children}</ul>,
          ol: ({ children }) => <ol className='list-decimal list-inside mb-2 space-y-1'>{children}</ol>,
          li: ({ children }) => <li className='text-sm'>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className='border-l-4 border-accent pl-4 italic mb-2 bg-border-light/30 py-2'>
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children, ...props }) => {
            // eslint-disable-next-line no-unused-vars
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <pre className='bg-gray-800 text-gray-100 p-3 rounded-lg mb-2 overflow-x-auto'>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className='bg-border-light px-1 py-0.5 rounded text-sm font-mono' {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className='overflow-x-auto mb-2'>
              <table className='min-w-full border border-border-light'>{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className='bg-border-light'>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className='border-b border-border-light'>{children}</tr>,
          th: ({ children }) => <th className='px-3 py-2 text-left font-semibold'>{children}</th>,
          td: ({ children }) => <td className='px-3 py-2'>{children}</td>,
          a: ({ href, children }) => (
            <a href={href} target='_blank' rel='noopener noreferrer' className='text-accent hover:underline'>
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className='font-semibold'>{children}</strong>,
          em: ({ children }) => <em className='italic'>{children}</em>,
        }}
      >
        {message.text}
      </ReactMarkdown>
    );
  };

  if (!show) return null;

  return (
    <>
      <div className='text-primary fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='fixed inset-0 bg-gray-700/50' onClick={onClose}></div>
        <div className='relative w-full max-w-4xl bg-card-bg rounded-lg shadow-xl max-h-[90vh] flex flex-col'>
          {/* Header */}
          <div className='flex items-center justify-between px-6 py-4 bg-linear-(--gradient-text) rounded-t-lg flex-shrink-0'>
            <h5 className='flex items-center gap-2 text-xl font-semibold text-white'>
              <FaRobot /> {t('AI assistant')}
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
          <div className='flex-1 overflow-y-auto p-4 bg-card-bg'>
            {messages.length === 0 && (
              <div className='text-center text-text-muted py-8'>
                <FaRobot className='mx-auto text-4xl mb-4 text-accent' />
                <p>{t('How can I help you today?')}</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-4 rounded-lg max-w-[85%] ${
                    msg.type === 'user'
                      ? 'bg-linear-(--gradient-primary) text-text-body rounded-br-none'
                      : 'bg-border-light text-text-body rounded-bl-none shadow-sm'
                  }`}
                >
                  <MessageContent message={msg} />
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className='flex justify-start mb-4'>
                <div className='bg-border-light text-text-body p-4 rounded-lg rounded-bl-none'>
                  <div className='flex items-center gap-2'>
                    <FaSpinner className='animate-spin' />
                    <span>Đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className='p-4 border-t border-border-light flex-shrink-0'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('Type a message...')}
                className='flex-1 p-3 border border-border-light rounded-lg bg-card-bg text-text-body
                focus:outline-none focus:ring-2 focus:ring-accent transition-all'
                disabled={isLoading}
              />
              <button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='bg-button-bg cursor-pointer text-button-text p-3 rounded-lg hover:opacity-90 
                transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-w-[48px] flex items-center justify-center'
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
