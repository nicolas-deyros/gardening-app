import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SmartCache, generateHash } from '../lib/cache';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "¡Hola! I am your Green-Tech AI Botanist. 🌿\n\nI'm ready to help you grow a thriving, chemical-free garden. What's growing in your world today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // 1. Generate Cache Key
            const msgHash = generateHash(userMsg.content.trim().toLowerCase());
            const cacheKey = `chat_${msgHash}`;

            // 2. Check Cache
            const cachedReply = SmartCache.get(cacheKey);
            if (cachedReply) {
                console.log("Serving from cache 🧠");
                setMessages(prev => [...prev, { role: 'assistant', content: cachedReply }]);
                setLoading(false);
                return;
            }

            // 3. API Call
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.content })
            });

            const data = await response.json();
            
            const assistantMsg: Message = { 
                role: 'assistant', 
                content: data.reply || "Thinking..." 
            };
            
            if (data.error) {
                assistantMsg.content = `⚠️ Connection error: ${data.error}`;
            } else {
                // 4. Save to Cache
                SmartCache.set(cacheKey, data.reply);
            }

            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connectivity issue." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] glass-panel overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                    <div 
                        key={idx} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-green-600 text-white rounded-br-none' 
                                    : 'bg-white text-stone-800 border border-stone-100 rounded-bl-none prose prose-stone prose-sm max-w-none'
                            }`}
                        >
                            {msg.role === 'assistant' ? (
                                <ReactMarkdown 
                                    components={{
                                        ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-semibold text-green-800" {...props} />,
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-stone-100 rounded-2xl px-4 py-2 text-stone-500 text-sm animate-pulse">
                            AI Botanist is thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white/50 border-t border-white/50 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about planting, pests, or soil..."
                    className="flex-1 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
                    disabled={loading}
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-12 h-12 !px-0 flex items-center justify-center rounded-xl"
                >
                    ➤
                </button>
            </form>
        </div>
    );
}
