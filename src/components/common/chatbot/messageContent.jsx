import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

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

export default MessageContent;
