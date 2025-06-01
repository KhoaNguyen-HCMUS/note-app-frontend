import MessageContent from './messageContent.jsx';

const ChatMessage = ({ message, index }) => {
  return (
    <div key={index} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-4 rounded-lg max-w-[85%] ${
          message.type === 'user'
            ? 'bg-linear-(--gradient-primary) text-text-body rounded-br-none'
            : 'bg-border-light text-text-body rounded-bl-none shadow-sm'
        }`}
      >
        <MessageContent message={message} />
      </div>
    </div>
  );
};

export default ChatMessage;
