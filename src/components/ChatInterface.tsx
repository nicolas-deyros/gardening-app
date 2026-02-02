import React, { useState, useRef, useEffect } from 'react';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "¡Hola! I am your Green-Tech Garden Architect. 🌿\n\nI'm ready to help you grow a thriving, chemical-free garden. What's growing in your world today?" }
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
            // Include history context? For now, we send just the last message + system prompt in backend.
            // Ideally we'd send history, but prompt is huge. 
            // Let's send the user message.
            const response = await fetch('/api/architect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            const data = await response.json();
            
            const assistantMsg: Message = { 
                role: 'assistant', 
                content: data.reply || "Thinking..." 
            };
            
            if (data.error) {
                assistantMsg.content = "⚠️ Connection error. Please try again.";
            }

            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ connectivity issue." }]);
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
                            className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm whitespace-pre-wrap leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-green-600 text-white rounded-br-none' 
                                    : 'bg-white text-stone-800 border border-stone-100 rounded-bl-none'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-stone-100 rounded-2xl px-4 py-2 text-stone-500 text-sm animate-pulse">
                            Architect is thinking...
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
