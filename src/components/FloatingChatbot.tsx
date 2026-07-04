import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Landmark, HelpCircle, Loader } from 'lucide-react';
import { ChatMessage } from '../types';

interface FloatingChatbotProps {
  userPrediction: any | null;
}

export default function FloatingChatbot({ userPrediction }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hello! I'm your Smart Lender AI Financial Advisor. Ask me anything about home loans, personal loans, documents required, how to improve your credit score, or explain your current loan status!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Contextual Greeting on prediction change
  useEffect(() => {
    if (userPrediction) {
      const outcomeText = userPrediction.status === 'Approved' ? 'approved' : 'rejected';
      const promptText = `Hello! I noticed you just evaluated a $${userPrediction.loanAmount}k ${userPrediction.loanPurpose} loan application which was ${outcomeText} with ${userPrediction.probability}% probability. I am fully updated on your details! Ask me questions like "Why was I ${outcomeText}?" or "How can I improve my borrowing margins?"`;
      
      setMessages((prev) => [
        ...prev,
        {
          id: `predict-notify-${Date.now()}`,
          sender: 'bot',
          text: promptText,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsOpen(true); // Proactively open chat to help!
    }
  }, [userPrediction]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          userPrediction: userPrediction ? {
            applicantName: userPrediction.applicantName,
            age: userPrediction.age,
            income: userPrediction.income,
            loanPurpose: userPrediction.loanPurpose,
            loanAmount: userPrediction.loanAmount,
            loanTerm: userPrediction.loanTerm,
            status: userPrediction.status,
            probability: userPrediction.probability,
            riskLevel: userPrediction.riskLevel,
            reason: userPrediction.reason,
            estimatedEMI: userPrediction.estimatedEMI,
            recommendedAmount: userPrediction.recommendedAmount,
            savings: userPrediction.savings
          } : null
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.text || "I apologize, but I'm having trouble processing that right now. Please check your credit score, as a solid credit rating is essential for loan approvals.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: "I'm running in offline mode. For a Home loan, interest rates are typically 6.5%-8%. For Personal loans, they can vary from 8%-15% depending on your credit standing.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const sampleQuestions = [
    "Am I eligible for a loan?",
    "How do I improve my credit?",
    "What is a home loan?",
    "Explain my loan prediction."
  ];

  const handleSampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-500 p-4 text-white flex justify-between items-center dark:bg-emerald-600">
            <div className="flex items-center space-x-2">
              <Landmark className="h-5 w-5" />
              <div>
                <h4 className="font-display font-bold text-sm">Smart Lender AI Chatbot</h4>
                <p className="text-[10px] text-emerald-100 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse mr-1"></span>
                  Active Credit Specialist
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div 
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-500 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200'
                  }`}
                >
                  {/* Handle markdown headers & lists simply */}
                  <div className="whitespace-pre-line space-y-1">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (line.startsWith('### ')) {
                        return <h5 key={lIdx} className="font-bold text-slate-900 dark:text-white mt-1">{line.replace('### ', '')}</h5>;
                      }
                      if (line.startsWith('- ')) {
                        return <li key={lIdx} className="ml-2 text-xs list-disc">{line.replace('- ', '')}</li>;
                      }
                      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                        return <li key={lIdx} className="ml-2 text-xs list-decimal">{line.substring(3)}</li>;
                      }
                      return <p key={lIdx}>{line}</p>;
                    })}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex space-x-2 mr-auto max-w-[80%] items-center bg-white border border-slate-100 rounded-2xl px-4 py-3 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <Loader className="h-3.5 w-3.5 text-emerald-500 animate-spin" />
                <span className="text-xs text-slate-400 font-medium">Analyzing credit conditions...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions suggestion */}
          {messages.length < 4 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 dark:bg-slate-950 dark:border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar">
              {sampleQuestions.map((q, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => handleSampleClick(q)}
                  className="flex-shrink-0 text-[11px] font-medium bg-white text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full shadow-sm hover:border-emerald-500 hover:text-emerald-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-emerald-500 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 dark:border-slate-800 dark:bg-slate-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about home rates, credit guidelines..."
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              id="chatbot-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-full bg-emerald-500 p-2.5 text-white shadow-sm hover:bg-emerald-600 focus:outline-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-700"
              id="chatbot-send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl hover:bg-emerald-600 focus:outline-none dark:bg-emerald-600 dark:hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
        aria-label="Open financial chatbot"
        id="floating-chat-trigger"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  );
}
