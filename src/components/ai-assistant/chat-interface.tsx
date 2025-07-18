'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, Sparkles, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Priority } from '@/types/ai-assistant';

export default function ChatInterface() {
  const { 
    chatMessages, 
    currentInput, 
    isGenerating,
    addMessage, 
    setCurrentInput, 
    setIsGenerating,
    addMultipleTasks,
    setViewMode,
    tasks 
  } = useAIAssistantStore();

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const generateTasksFromInput = async (input: string) => {
    setIsGenerating(true);
    setIsTyping(true);

    // Add user message
    addMessage({
      content: input,
      sender: 'user',
      type: 'text'
    });

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI task generation based on input
    const mockTasks = generateMockTasks(input);
    
    // Add AI response
    addMessage({
      content: `I've analyzed your request and created ${mockTasks.length} tasks to help you achieve your goal. Here's what I recommend:`,
      sender: 'ai',
      type: 'task_generation'
    });

    // Add tasks to store
    addMultipleTasks(mockTasks);

    setIsTyping(false);
    setIsGenerating(false);
    
    // Auto-switch to preview after task generation
    setTimeout(() => {
      setViewMode('preview');
    }, 1000);
  };

  const generateMockTasks = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('website') || lowerInput.includes('web')) {
      return [
        {
          title: 'Design Website Layout',
          description: 'Create wireframes and mockups for the main pages',
          priority: 'high' as Priority,
          tags: ['design', 'ui/ux', 'planning'],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Set Up Development Environment',
          description: 'Configure React, Tailwind, and necessary dependencies',
          priority: 'high' as Priority,
          tags: ['development', 'setup', 'frontend'],
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Implement Authentication',
          description: 'Set up user login/signup functionality',
          priority: 'medium' as Priority,
          tags: ['backend', 'security', 'auth'],
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Deploy to Production',
          description: 'Configure hosting and deploy the application',
          priority: 'low' as Priority,
          tags: ['deployment', 'hosting', 'production'],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        }
      ];
    }

    if (lowerInput.includes('mobile app')) {
      return [
        {
          title: 'Market Research',
          description: 'Analyze competitor apps and user needs',
          priority: 'urgent' as Priority,
          tags: ['research', 'analysis', 'planning'],
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Create User Stories',
          description: 'Define user journeys and feature requirements',
          priority: 'high' as Priority,
          tags: ['planning', 'ux', 'requirements'],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Design App Interface',
          description: 'Create UI mockups and interactive prototypes',
          priority: 'high' as Priority,
          tags: ['design', 'ui', 'prototyping'],
          dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        }
      ];
    }

    // Default tasks for general project management
    return [
      {
        title: 'Project Planning',
        description: 'Define project scope, timeline, and deliverables',
        priority: 'urgent' as Priority,
        tags: ['planning', 'management', 'strategy'],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Resource Allocation',
        description: 'Identify and assign team members and tools needed',
        priority: 'high' as Priority,
        tags: ['resources', 'team', 'tools'],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Implementation',
        description: 'Execute the planned tasks and monitor progress',
        priority: 'medium' as Priority,
        tags: ['execution', 'monitoring', 'progress'],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isGenerating) return;

    const input = currentInput.trim();
    setCurrentInput('');
    
    await generateTasksFromInput(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {chatMessages.map((message, index) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  'flex gap-3',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-[80%] rounded-xl p-3 text-sm',
                    message.sender === 'user'
                      ? 'bg-gradient-secondary text-secondary-foreground ml-12'
                      : 'glass text-foreground'
                  )}
                >
                  {message.type === 'task_generation' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-accent animate-glow" />
                      <span className="text-xs font-medium text-accent">Task Generation</span>
                    </div>
                  )}
                  
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  <div className="text-xs text-muted-foreground mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-secondary flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="glass rounded-xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.1s]" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-glass-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your project or ask for help..."
              className="min-h-[50px] max-h-[120px] resize-none glass border-glass-border focus:ring-primary pr-12"
              disabled={isGenerating}
            />
          </div>
          
          <Button 
            type="submit" 
            size="icon"
            disabled={!currentInput.trim() || isGenerating}
            className="self-end mb-0.5"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <div className="mt-2 text-xs text-muted-foreground">
          Try: "Help me build a website" or "I need to create a mobile app"
        </div>
        
        {/* Tasks Summary */}
        {tasks.length > 0 && (
          <div className="mt-3 p-3 rounded-lg glass border border-glass-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} created
              </span>
              <Button
                variant="holographic"
                size="sm"
                onClick={() => setViewMode('whiteboard')}
                className="h-7 px-3 text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Whiteboard
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {tasks.slice(0, 3).map((task, index) => (
                <div
                  key={task.id}
                  className="px-2 py-1 bg-background/50 rounded-md text-xs text-muted-foreground border border-glass-border"
                >
                  {task.title}
                </div>
              ))}
              {tasks.length > 3 && (
                <div className="px-2 py-1 bg-background/50 rounded-md text-xs text-muted-foreground border border-glass-border">
                  +{tasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}