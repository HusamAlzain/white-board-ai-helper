'use client';

import { motion } from 'framer-motion';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Plus, ArrowLeft, Layers3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Priority } from '@/types/ai-assistant';

export default function TaskPreview() {
  const { tasks, setViewMode } = useAIAssistantStore();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-xl bg-glass-primary flex items-center justify-center mb-4">
          <Layers3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Tasks Yet</h3>
        <p className="text-muted-foreground mb-6">
          Start by asking the AI to help you break down your project into manageable tasks.
        </p>
        <Button 
          onClick={() => setViewMode('chat')}
          variant="glass"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Button>
      </div>
    );
  }

  const priorityColors: Record<Priority, string> = {
    urgent: 'bg-destructive/10 text-destructive border-destructive/20',
    high: 'bg-warning/10 text-warning border-warning/20',
    medium: 'bg-info/10 text-info border-info/20',
    low: 'bg-success/10 text-success border-success/20'
  };

  const stackVariants = {
    initial: { rotateY: 0, z: 0, x: 0, y: 0 },
    stacked: (index: number) => ({
      rotateY: index * 2,
      z: -index * 10,
      x: index * 4,
      y: index * 3,
      scale: 1 - index * 0.03
    })
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Task Preview</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} tasks ready to organize
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('chat')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Task Stack Visualization */}
      <div className="relative h-64 mb-8 mx-auto w-full max-w-80">
        {tasks.slice(0, 4).map((task, index) => (
          <motion.div
            key={task.id}
            className="absolute inset-0"
            variants={stackVariants}
            custom={index}
            initial="initial"
            animate="stacked"
            style={{ zIndex: 40 - index }}
          >
            <Card className={cn(
              "h-full shadow-glass border-2 task-card",
              `task-card-priority-${task.priority}`
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base line-clamp-1">{task.title}</CardTitle>
                  <Badge 
                    className={cn(
                      "text-xs border",
                      priorityColors[task.priority]
                    )}
                  >
                    {task.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {task.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{task.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {tasks.length > 4 && (
          <div className="absolute top-4 right-4 z-50">
            <Badge className="bg-accent text-accent-foreground">
              +{tasks.length - 4} more
            </Badge>
          </div>
        )}
      </div>

      {/* Stack Counter */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2">
          <Layers3 className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">
            {tasks.length} tasks created
          </span>
          <div className="flex gap-1 ml-2">
            {Array.from({ length: Math.min(tasks.length, 5) }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-accent animate-glow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-auto">
        <Button
          onClick={() => setViewMode('whiteboard')}
          className="w-full"
          size="lg"
        >
          <Eye className="mr-2 h-5 w-5" />
          Open in Whiteboard
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="glass"
            size="lg"
            onClick={() => setViewMode('chat')}
          >
            Add More
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              // TODO: Export functionality
              console.log('Exporting tasks...');
            }}
          >
            Export Tasks
          </Button>
        </div>
      </div>
    </div>
  );
}