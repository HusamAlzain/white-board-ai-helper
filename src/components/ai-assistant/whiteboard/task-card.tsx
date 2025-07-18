'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, Check, Clock } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { cn } from '@/lib/utils';
import { Task, Priority } from '@/types/ai-assistant';

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  isDragging: boolean;
  onTaskClick: (taskId: string) => void;
}

export default function TaskCard({ task, isSelected, isDragging, onTaskClick }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { deleteTask, toggleTaskCompletion, selectTask } = useAIAssistantStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDndDragging
  } = useDraggable({
    id: task.id,
    data: { task }
  });

  const priorityColors: Record<Priority, string> = {
    urgent: 'border-l-destructive bg-destructive/5 shadow-destructive/20',
    high: 'border-l-warning bg-warning/5 shadow-warning/20',
    medium: 'border-l-info bg-info/5 shadow-info/20',
    low: 'border-l-success bg-success/5 shadow-success/20'
  };

  const priorityBadgeColors: Record<Priority, string> = {
    urgent: 'bg-destructive/10 text-destructive border-destructive/20',
    high: 'bg-warning/10 text-warning border-warning/20',
    medium: 'bg-info/10 text-info border-info/20',
    low: 'bg-success/10 text-success border-success/20'
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'absolute' as const,
    left: task.position.x,
    top: task.position.y,
    zIndex: isDragging ? 50 : 10
  } : {
    position: 'absolute' as const,
    left: task.position.x,
    top: task.position.y,
    zIndex: isDragging ? 50 : 10
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.detail === 2) { // Double click
      onTaskClick(task.id);
    } else if (e.shiftKey || e.ctrlKey || e.metaKey) {
      selectTask(task.id, true); // Multi-select
    } else {
      selectTask(task.id, false); // Single select
    }
  };

  const formatDueDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none select-none cursor-grab active:cursor-grabbing",
        isMobile ? "w-72" : "w-80"
      )}
      {...attributes}
      {...listeners}
      initial={{ scale: 0, opacity: 0, rotateY: -90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      onClick={handleCardClick}
    >
      <Card className={cn(
        "h-48 shadow-glass border-l-4 transition-all duration-300 relative overflow-hidden",
        priorityColors[task.priority],
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isDragging && "rotate-3 shadow-floating scale-105",
        task.completed && "opacity-60"
      )}>
        {/* Completion Overlay */}
        {task.completed && (
          <div className="absolute inset-0 bg-success/20 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-success text-primary-foreground rounded-full p-2">
              <Check className="h-6 w-6" />
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className={cn(
              "text-base line-clamp-2 leading-tight",
              task.completed && "line-through"
            )}>
              {task.title}
            </CardTitle>
            <div className="flex items-center gap-1 ml-2">
              <Badge 
                className={cn(
                  "text-xs border shrink-0",
                  priorityBadgeColors[task.priority]
                )}
              >
                {task.priority}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-glass-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-3">
          <p className={cn(
            "text-sm text-muted-foreground line-clamp-3 mb-4",
            task.completed && "line-through"
          )}>
            {task.description}
          </p>
          
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center gap-1 mb-3 text-xs">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className={cn(
                "text-muted-foreground",
                formatDueDate(task.dueDate)?.includes('Overdue') && "text-destructive font-medium"
              )}>
                {formatDueDate(task.dueDate)}
              </span>
            </div>
          )}
          
          {/* Tags */}
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
        
        {/* Context Menu */}
        {showMenu && (
          <motion.div 
            className="absolute top-12 right-2 glass border border-glass-border rounded-lg shadow-floating p-2 z-30 min-w-[120px]"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleTaskCompletion(task.id);
                setShowMenu(false);
              }}
              className="w-full justify-start text-left text-xs"
            >
              <Check className="h-3 w-3 mr-2" />
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Edit functionality
                setShowMenu(false);
              }}
              className="w-full justify-start text-left text-xs"
            >
              <Edit className="h-3 w-3 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
                setShowMenu(false);
              }}
              className="w-full justify-start text-left text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </Button>
          </motion.div>
        )}

        {/* Glow effect for high priority tasks */}
        {task.priority === 'urgent' && !task.completed && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-transparent animate-glow rounded-lg" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}