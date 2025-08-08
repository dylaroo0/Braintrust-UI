import React, { useState, useRef, useEffect } from 'react';
import type { Agent, Message } from '../types';
import { SendIcon } from './icons';

interface ChatFeedProps {
  messages: Message[];
  activeAgent: Agent | null;
  onSendMessage: (message: string, agent: Agent) => void;
  isLoading: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onDragMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent) => void;
}

const ChatFeed: React.FC<ChatFeedProps> = ({ 
  messages, 
  activeAgent, 
  onSendMessage, 
  isLoading,
  position,
  size,
  onDragMouseDown,
  onResizeMouseDown
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && activeAgent && !isLoading) {
      onSendMessage(input, activeAgent);
      setInput('');
    }
  };

  return (
    <div 
      className="absolute flex flex-col z-10 bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: '400px',
        minHeight: '300px'
      }}
    >
      <div 
        className="flex-shrink-0 border-b border-gray-700 cursor-move p-4 bg-gray-800/80 rounded-t-xl"
        onMouseDown={onDragMouseDown}
      >
        <h2 className="text-xl font-bold text-white select-none">Conversation Feed</h2>
        <p className="text-sm text-gray-400 select-none">
          Engaged with: {activeAgent ? 
            <span className="font-semibold" style={{ color: activeAgent.color }}>{activeAgent.name}</span> : 
            <span className="text-gray-500">None (Select an agent to begin)</span>}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender !== 'user' && (
              <div 
                className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0 border-2"
                style={{ borderColor: msg.agent.color, color: msg.agent.color }}
              >
                {React.isValidElement(msg.agent.avatar) 
                  ? msg.agent.avatar 
                  : <span className="text-xl">{msg.agent.avatar}</span>
                }
              </div>
            )}
            <div className={`max-w-xl rounded-xl ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-900/70 text-gray-200 border border-gray-700'}`}>
              {msg.sender !== 'user' && (
                <div className="px-4 pt-3 pb-1">
                    <span className="font-bold text-sm" style={{ color: msg.agent.color }}>{msg.agent.name}</span>
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap p-4 pt-2">{msg.text}</p>
            </div>
          </div>
        ))}

        {isLoading && activeAgent && (
           <div className="flex items-start gap-3 justify-start">
             <div 
                className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center flex-shrink-0 border-2"
                style={{ borderColor: activeAgent.color, color: activeAgent.color }}
             >
                {React.isValidElement(activeAgent?.avatar) 
                  ? activeAgent.avatar 
                  : <span className="text-xl">{activeAgent?.avatar}</span>
                }
              </div>
             <div className="max-w-xl p-4 rounded-xl bg-gray-900/70 text-gray-200 border border-gray-700">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 rounded-full animate-pulse delay-0" style={{ backgroundColor: activeAgent.color }}></div>
                 <div className="w-2 h-2 rounded-full animate-pulse delay-200" style={{ backgroundColor: activeAgent.color }}></div>
                 <div className="w-2 h-2 rounded-full animate-pulse delay-400" style={{ backgroundColor: activeAgent.color }}></div>
               </div>
             </div>
           </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="flex-shrink-0 p-4 border-t border-gray-700">
        <div className="flex items-center bg-gray-900 border border-gray-700 rounded-lg p-2 focus-within:ring-2 focus-within:ring-cyan-500">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeAgent ? `Ask ${activeAgent.name}...` : 'Select an agent to chat'}
            className="flex-1 bg-transparent border-none text-gray-200 placeholder-gray-500 focus:ring-0"
            disabled={!activeAgent || isLoading}
          />
          <button
            type="submit"
            disabled={!activeAgent || isLoading || !input.trim()}
            className="p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </form>

      <div
        className="absolute bottom-1 right-1 w-4 h-4 cursor-nwse-resize border-r-2 border-b-2 border-gray-600/50 hover:border-gray-400"
        onMouseDown={onResizeMouseDown}
      />
    </div>
  );
};

export default ChatFeed;