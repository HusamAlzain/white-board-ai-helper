'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { Bot, MessageSquare, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatInterface from './chat-interface';
import TaskPreview from './task-preview';
import WhiteboardCanvas from './whiteboard/whiteboard-canvas';

export default function AIAssistantWidget() {
  const { 
    isOpen, 
    viewMode, 
    toggleWidget, 
    setViewMode, 
    closeWidget,
    tasks 
  } = useAIAssistantStore();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1023px)');

  const getWidgetStyles = () => {
    if (viewMode === 'whiteboard') {
      return 'fixed inset-0 z-50';
    }
    
    if (isMobile) {
      return isOpen && viewMode !== 'minimized'
        ? 'fixed inset-0 z-50 p-4'
        : 'fixed bottom-6 right-6 z-40';
    }
    
    if (isTablet) {
      return isOpen && viewMode !== 'minimized'
        ? 'fixed bottom-6 right-6 left-6 z-40 h-[600px]'
        : 'fixed bottom-6 right-6 z-40';
    }
    
    return isOpen && viewMode !== 'minimized'
      ? 'fixed bottom-6 right-6 z-40 w-[420px] h-[650px]'
      : 'fixed bottom-6 right-6 z-40';
  };

  const widgetVariants = {
    minimized: {
      scale: 1,
      opacity: 1,
      borderRadius: '50%',
    },
    open: {
      scale: 1,
      opacity: 1,
      borderRadius: '24px',
    },
    whiteboard: {
      scale: 1,
      opacity: 1,
      borderRadius: '0px',
    }
  };

  const floatingButtonVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0
    },
    hover: { 
      scale: 1.1,
      rotate: 5
    },
    tap: { scale: 0.95 }
  };

  return (
    <AnimatePresence mode="wait">
      {viewMode === 'minimized' ? (
        // Floating Action Button
        <motion.div
          key="fab"
          className={getWidgetStyles()}
          variants={floatingButtonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
        >
          <Button
            onClick={toggleWidget}
            variant="floating"
            size="floating"
            className="relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-holographic animate-rotate-slow opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <Bot className="h-8 w-8 text-primary-foreground relative z-10" />
            
            {/* Notification Badge */}
            {tasks.length > 0 && (
              <motion.div
                className="absolute -top-2 -right-2 bg-destructive text-primary-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                {tasks.length}
              </motion.div>
            )}
          </Button>
        </motion.div>
      ) : (
        // Main Widget
        <motion.div
          key="widget"
          className={cn(
            getWidgetStyles(),
            'overflow-hidden',
            viewMode === 'whiteboard' 
              ? 'bg-background' 
              : 'glass shadow-widget border border-glass-border'
          )}
          variants={widgetVariants}
          initial="minimized"
          animate={viewMode === 'whiteboard' ? "whiteboard" : "open"}
          exit="minimized"
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Header */}
          {viewMode !== 'whiteboard' && (
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="h-6 w-6 text-primary" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background animate-glow" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Ready to help</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {tasks.length > 0 && viewMode === 'chat' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('preview')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}
                
                {tasks.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('whiteboard')}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeWidget}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {viewMode === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 h-full"
              >
                <ChatInterface />
              </motion.div>
            )}

            {viewMode === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex-1 h-full"
              >
                <TaskPreview />
              </motion.div>
            )}

            {viewMode === 'whiteboard' && (
              <motion.div
                key="whiteboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                <WhiteboardCanvas />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}