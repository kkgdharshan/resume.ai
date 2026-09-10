import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, ArrowUp, RefreshCcw, Plus, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithAssistant } from '../services/api';

export default function IntegratedChat({ resumeData }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto'; // reset height
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAssistant(resumeData ? resumeData.resumeId : null, userMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the server.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <div className="bg-white border-l border-slate-200 p-2 flex flex-col items-center">
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-slate-100 rounded-md mt-4">
          <Bot size={24} className="text-slate-600" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[450px] border-l border-slate-200 bg-white flex flex-col shadow-sm hidden md:flex">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-indigo-600 font-medium">
          <Bot size={18} />
          <span>AI Assistant</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-400">
          <button className="p-1.5 hover:bg-slate-100 rounded-md transition" title="New Chat" onClick={() => setMessages([])}>
            <Plus size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-md transition" title="Clear Context" onClick={() => setMessages([])}>
            <RefreshCcw size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-md transition" title="Close Panel" onClick={() => setIsOpen(false)}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <div className="text-5xl mb-4">😎</div>
            <p className="text-sm">Stuck? The AI Assistant guides you through your resume improvements.</p>
            <p className="text-sm mt-2 text-indigo-500 font-medium cursor-pointer hover:underline">View suggestion examples</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 mt-1 mr-2 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                )}
                <div className={`text-[15px] ${msg.role === 'user' ? 'bg-slate-100 px-4 py-2.5 rounded-2xl max-w-[85%] text-slate-800' : 'text-slate-800 max-w-[90%]'}`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm prose-slate max-w-none leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 mt-1 mr-2 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} />
                </div>
                <div className="text-[15px] text-slate-500 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative border border-indigo-400 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow bg-white">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Shift+Enter to insert a line break."
            className="w-full max-h-48 min-h-[50px] p-4 pr-12 resize-none outline-none text-sm text-slate-800 placeholder-slate-400 overflow-y-auto"
            rows="1"
          />
          
          <div className="absolute bottom-2 right-2 flex items-center space-x-2">
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${!input.trim() || loading ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
            >
              <ArrowUp size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
