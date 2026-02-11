"use client";

import { useState, useEffect, useRef } from 'react';
import { ProductTour, appTourSteps } from './ProductTour';

interface Message {
  id: string;
  role: 'ori' | 'user';
  content: string;
  options?: { label: string; value: string }[];
}

interface OriOnboardingProps {
  onComplete: (companyName: string, companyContext: string) => void;
  onSkip?: () => void;
}

type OnboardingStep = 'welcome' | 'company-name' | 'company-context' | 'meet-team' | 'tour' | 'complete';

export function OriOnboarding({ onComplete, onSkip }: OriOnboardingProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyContext, setCompanyContext] = useState('');
  const [showTour, setShowTour] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ori's typing effect
  const addOriMessage = (content: string, options?: Message['options']) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `ori-${Date.now()}`,
        role: 'ori',
        content,
        options,
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  // Start conversation
  useEffect(() => {
    if (step === 'welcome' && messages.length === 0) {
      setTimeout(() => {
        addOriMessage("Hey! 👋 I'm Ori, your guide to TowerHQ.");
        setTimeout(() => {
          addOriMessage("I'll introduce you to your AI executive team and show you around. Takes about 2 minutes.", [
            { label: "Let's go! 🚀", value: 'start' },
            { label: "Skip intro", value: 'skip' },
          ]);
        }, 1200);
      }, 500);
    }
  }, [step, messages.length]);

  const handleOptionClick = (value: string) => {
    if (value === 'skip') {
      onSkip?.();
      return;
    }

    if (value === 'start') {
      setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: "Let's go! 🚀" }]);
      setStep('company-name');
      setTimeout(() => {
        addOriMessage("First things first — what's your company called?");
      }, 600);
    }

    if (value === 'skip-context') {
      setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: "Skip for now" }]);
      setStep('meet-team');
      introduceTeam();
    }

    if (value === 'start-tour') {
      setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: "Show me around" }]);
      setShowTour(true);
      setStep('tour');
    }

    if (value === 'skip-tour') {
      setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: "I'll explore myself" }]);
      finishOnboarding();
    }
  };

  const introduceTeam = () => {
    setTimeout(() => {
      addOriMessage(`Perfect! Welcome to ${companyName} HQ. 🏰`);
      setTimeout(() => {
        addOriMessage("You've got four executives ready to help:");
        setTimeout(() => {
          addOriMessage("🧠 **Ada** — Your CTO. Technical architecture, engineering decisions, code strategy.");
          setTimeout(() => {
            addOriMessage("🎯 **Grace** — Your CPO. Product-market fit, user research, roadmap.");
            setTimeout(() => {
              addOriMessage("📣 **Tony** — Your CMO. Positioning, content, go-to-market.");
              setTimeout(() => {
                addOriMessage("📊 **Val** — Your CFO. Unit economics, runway, financial modeling.");
                setTimeout(() => {
                  addOriMessage("Want me to show you around the interface?", [
                    { label: "Show me around", value: 'start-tour' },
                    { label: "I'll explore myself", value: 'skip-tour' },
                  ]);
                  setStep('meet-team');
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 800);
    }, 600);
  };

  const finishOnboarding = () => {
    setTimeout(() => {
      addOriMessage("You're all set! Head to any channel to start chatting with your team. I'll be here if you need a refresher. ✨");
      setTimeout(() => {
        onComplete(companyName, companyContext);
      }, 1500);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: userInput }]);
    setInput('');

    if (step === 'company-name') {
      setCompanyName(userInput);
      setStep('company-context');
      setTimeout(() => {
        addOriMessage(`${userInput} — great name! 🎯`);
        setTimeout(() => {
          addOriMessage("What are you building? Just a sentence or two helps your execs give better advice.", [
            { label: "Skip for now", value: 'skip-context' },
          ]);
        }, 800);
      }, 600);
    } else if (step === 'company-context') {
      setCompanyContext(userInput);
      setStep('meet-team');
      introduceTeam();
    }
  };

  const handleTourComplete = () => {
    setShowTour(false);
    finishOnboarding();
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gray-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-xl">
              🧭
            </div>
            <div>
              <h2 className="font-semibold text-white">Ori</h2>
              <p className="text-xs text-gray-400">Your Guide</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                {msg.role === 'ori' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">🧭</span>
                    <span className="text-xs text-gray-400">Ori</span>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-800 text-gray-100'
                }`}>
                  <p className="text-sm whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{ 
                       __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                     }} 
                  />
                </div>
                {msg.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleOptionClick(opt.value)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-sm text-white transition-colors"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {(step === 'company-name' || step === 'company-context') && (
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={step === 'company-name' ? "Your company name..." : "What you're building..."}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        )}
      </div>

      {showTour && (
        <ProductTour
          steps={appTourSteps}
          onComplete={handleTourComplete}
          onSkip={handleTourComplete}
        />
      )}
    </>
  );
}
