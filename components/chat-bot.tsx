'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Bot,
  User,
  ImageIcon,
  Paperclip,
  SmilePlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '@/lib/auth-helpers';
import { useToast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/lib/use-auth';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome-1',
    content:
      "👋 Hi there! I'm Nexa, your travel assistant powered by Gemini AI. How can I help you plan your next adventure?",
    role: 'assistant',
    timestamp: new Date(),
  },
];

const SUGGESTION_PROMPTS = [
  'What are popular destinations for summer?',
  'Help me find budget-friendly destinations',
  'Suggest family-friendly activities in Paris',
  'What should I pack for a beach vacation?',
  'Recommend places with good weather in December',
];

// Initialize Gemini AI
const API_KEY = 'AIzaSyC3NWbJrwjeTk5Gq98u2VvlOwy0edMKtXQ'; // Using the same API key from generate-destination-info.ts
const genAI = new GoogleGenerativeAI(API_KEY);

// Configure the model
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

// Create a chat session with travel context
const createChatSession = () => {
  return model.startChat({
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
    history: [
      {
        role: 'user',
        parts: [
          {
            text: 'I need help with travel planning. Please act as Nexa, a travel assistant. Keep your responses focused on travel advice, destinations, activities, and planning. Be concise but helpful.',
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: "I'm Nexa, your travel assistant. I'd be happy to help with your travel planning needs! Whether you're looking for destination recommendations, activity suggestions, packing tips, or travel advice, I'm here to assist. How can I help with your travel plans today?",
          },
        ],
      },
    ],
  });
};

export function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const [showChatbot, setShowChatbot] = useState(true); // Always show by default
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check if user is logged in - but don't hide the chatbot based on this
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error('Auth check error:', error);
        // Still show the chatbot even if auth check fails
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Initialize chat session when dialog opens
  useEffect(() => {
    if (isOpen && !chatSession) {
      try {
        setChatSession(createChatSession());
      } catch (error) {
        console.error('Failed to create chat session:', error);
        toast({
          title: 'Chat Initialization Error',
          description: 'Failed to initialize the chat. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [isOpen, chatSession, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize chat session if not already done
      let currentSession = chatSession;
      if (!currentSession) {
        currentSession = createChatSession();
        setChatSession(currentSession);
      }

      // Send message to Gemini AI
      const result = await currentSession.sendMessage(input);
      const response = await result.response;
      const responseText = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Gemini AI Error:', error);

      // Fallback response in case of API error
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting to my knowledge base right now. Please try again in a moment or ask me something else about travel planning.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);

      toast({
        title: 'Connection Issue',
        description:
          'There was a problem getting a response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to format message content with links
  const formatMessageContent = (content: string) => {
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Always render the chatbot button, but handle authentication in the dialog
  return (
    <>
      {/* Floating chat button - always visible */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            className='fixed bottom-6 right-6 z-[100]' // Increased z-index
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsOpen(true)}
                    className='h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105'
                    aria-label='Open travel assistant'
                  >
                    <Bot className='h-6 w-6' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>
                  <p>Chat with Nexa Travel Assistant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat dialog */}
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent className='sm:max-w-[450px] p-0 gap-0 h-[650px] max-h-[85vh] flex flex-col rounded-xl overflow-hidden border-none shadow-2xl'>
          {/* Chat header */}
          <div className='p-4 flex items-center justify-between bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Avatar className='h-10 w-10 bg-primary-foreground border-2 border-white/20'>
                  <Bot className='h-5 w-5 text-primary' />
                </Avatar>
                <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-primary'></span>
              </div>
              <div>
                <h2 className='font-semibold text-lg'>Nexa Travel Assistant</h2>
                <p className='text-xs text-primary-foreground/80 flex items-center gap-1'>
                  <span className='inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse'></span>
                  Powered by Gemini AI • Online
                </p>
              </div>
            </div>
          </div>

          {/* Authentication check */}
          {!isLoggedIn ? (
            <div className='flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 text-center'>
              <Bot className='h-16 w-16 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>
                Sign in to chat with Nexa
              </h3>
              <p className='text-muted-foreground mb-6 max-w-xs'>
                Please log in to get personalized travel recommendations and
                assistance.
              </p>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/login';
                }}
              >
                Sign In
              </Button>
            </div>
          ) : (
            <>
              {/* Messages container */}
              <div className='flex-1 overflow-y-auto p-4 bg-slate-50/80'>
                <div className='space-y-4'>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.role === 'assistant'
                          ? 'justify-start'
                          : 'justify-end'
                      }`}
                    >
                      <div className='flex items-start gap-2 max-w-[85%]'>
                        {message.role === 'assistant' && (
                          <Avatar className='h-8 w-8 mt-1 bg-primary text-primary-foreground text-center'>
                            <Bot className='h-4 w-4' />
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'rounded-2xl p-3 shadow-sm',
                            message.role === 'assistant'
                              ? 'bg-white text-foreground rounded-tl-none'
                              : 'bg-primary text-primary-foreground rounded-tr-none'
                          )}
                        >
                          <div className='text-sm whitespace-pre-wrap text-black'>
                            {formatMessageContent(message.content)}
                          </div>
                          <div
                            className={cn(
                              'text-xs mt-1',
                              message.role === 'assistant'
                                ? 'text-muted-foreground'
                                : 'text-primary-foreground/70'
                            )}
                          >
                            {new Date(message.timestamp).toLocaleTimeString(
                              [],
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                        </div>
                        {message.role === 'user' && (
                          <Avatar className='h-8 w-8 mt-1 bg-secondary'>
                            <User className='h-4 w-4' />
                          </Avatar>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='flex justify-start'
                    >
                      <div className='flex items-start gap-2 max-w-[85%]'>
                        <Avatar className='h-8 w-8 mt-1 bg-primary text-primary-foreground'>
                          <Bot className='h-4 w-4' />
                        </Avatar>
                        <div className='rounded-2xl rounded-tl-none p-3 bg-white shadow-sm'>
                          <div className='flex items-center gap-2'>
                            <div className='flex space-x-1'>
                              <div
                                className='h-2 w-2 rounded-full bg-primary animate-bounce'
                                style={{ animationDelay: '0ms' }}
                              ></div>
                              <div
                                className='h-2 w-2 rounded-full bg-primary animate-bounce'
                                style={{ animationDelay: '300ms' }}
                              ></div>
                              <div
                                className='h-2 w-2 rounded-full bg-primary animate-bounce'
                                style={{ animationDelay: '600ms' }}
                              ></div>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                              Thinking...
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Suggestion chips */}
              <div className='p-3 border-t bg-white flex gap-2 overflow-x-auto scrollbar-thin'>
                {SUGGESTION_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    variant='outline'
                    size='sm'
                    className='whitespace-nowrap text-xs rounded-full px-3 py-1 h-auto border-primary/20 hover:bg-primary/5 hover:text-primary'
                    onClick={() => {
                      setInput(prompt);
                    }}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              {/* Input area */}
              <div className='p-4 border-t bg-white'>
                <div className='flex flex-col gap-2'>
                  <div className='relative'>
                    <Textarea
                      placeholder='Ask about travel suggestions...'
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className='min-h-[60px] pr-12 resize-none rounded-xl border-muted bg-background focus-visible:ring-1 focus-visible:ring-primary'
                    />
                    <div className='absolute right-3 bottom-3'>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isLoading}
                        size='icon'
                        className='h-8 w-8 rounded-full'
                        aria-label='Send message'
                      >
                        <Send className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='flex justify-between items-center px-1'>
                    <div className='flex gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 rounded-full text-muted-foreground'
                      >
                        <SmilePlus className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 rounded-full text-muted-foreground'
                      >
                        <Paperclip className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 rounded-full text-muted-foreground'
                      >
                        <ImageIcon className='h-4 w-4' />
                      </Button>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Powered by Gemini AI
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
