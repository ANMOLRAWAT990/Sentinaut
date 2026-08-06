import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const role = user ? user.role : 'guest';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: 1, text: `Hello! I'm SentiBot. How can I help you today?`, sender: 'bot' }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    // Clear chat when user changes to ensure role-based isolation
    setMessages([]);
    setIsOpen(false);
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (role === 'admin') return null;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, role })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Sorry, I encountered an error connecting to my servers.', sender: 'bot', isError: true }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${user ? 'bottom-20 md:bottom-6' : 'bottom-6'} right-4 md:right-6 p-3.5 sm:p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.2)] dark:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all z-50 flex items-center justify-center hover:scale-105 active:scale-95 group`}
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-blue-500 dark:text-blue-300 animate-pulse" />
          </div>
        </button>
      )}

      {isOpen && (
        <div className={`fixed ${user ? 'bottom-20 md:bottom-6' : 'bottom-6'} right-3 left-3 sm:left-auto sm:right-6 sm:w-96 h-[480px] sm:h-[500px] max-h-[80vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all transform scale-100 origin-bottom-right`}>
          <div className="bg-white dark:bg-slate-950 px-4 py-3 flex justify-between items-center text-slate-900 dark:text-white shadow-sm z-20 relative border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="relative bg-blue-500/10 dark:bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/20 dark:border-blue-500/30">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <Sparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-blue-500 dark:text-blue-300" />
              </div>
              <span className="font-bold text-sm tracking-wide">SentiBot</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-medium text-blue-600 dark:text-blue-300">{role}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div 
            className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-[#0B1120]"
            style={{ 
              backgroundImage: "url('/chat-bg.png')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-slate-50/85 dark:bg-[#0B1120]/85 backdrop-blur-[2px] z-0 pointer-events-none"></div>
            
            <div className="relative h-full p-4 overflow-y-auto z-10 space-y-4">
              {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user' ? 'bg-blue-600 dark:bg-blue-900/60 dark:border dark:border-blue-800/50 text-white rounded-br-none shadow-sm' : msg.isError ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:border dark:border-red-900/50 dark:text-red-400 rounded-bl-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'}`}>
                  {msg.sender === 'bot' ? (
                    <div className="prose prose-sm dark:prose-invert prose-p:leading-snug prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:text-sm prose-headings:my-1">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={sendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0 z-20 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SentiBot..."
                className="w-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-900 dark:text-white rounded-full pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border-none placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
