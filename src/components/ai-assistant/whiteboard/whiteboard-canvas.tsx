'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TaskCard from './task-card';
import WhiteboardToolbar from './whiteboard-toolbar';
import { 
  ArrowLeft, 
  Grid3X3, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Layers3
} from 'lucide-react';

export default function WhiteboardCanvas() {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { 
    tasks, 
    selectedTasks,
    updateTaskPosition, 
    setViewMode,
    clearSelection
  } = useAIAssistantStore();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Auto-layout algorithm
  const autoLayoutTasks = () => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const cardWidth = 300;
    const cardHeight = 180;
    const padding = 20;
    
    const cols = Math.floor((canvasRect.width - padding * 2) / (cardWidth + padding));
    
    tasks.forEach((task, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      updateTaskPosition(task.id, {
        x: col * (cardWidth + padding) + padding,
        y: row * (cardHeight + padding) + padding + 80 // Account for header
      });
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const taskId = active.id as string;
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskPosition(taskId, {
        x: task.position.x + delta.x / zoom,
        y: task.position.y + delta.y / zoom
      });
    }
    
    setActiveTask(null);
  };

  // Zoom and pan handlers
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
    }
  };

  useEffect(() => {
    // Auto-layout on mount if tasks don't have positions
    const hasPositions = tasks.some(task => task.position.x !== 0 || task.position.y !== 0);
    if (tasks.length > 0 && !hasPositions) {
      setTimeout(autoLayoutTasks, 100);
    }
  }, []);

  if (tasks.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-background text-center p-8">
        <div className="w-20 h-20 rounded-xl bg-glass-primary flex items-center justify-center mb-6">
          <Layers3 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Empty Whiteboard</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Generate some tasks first by chatting with the AI assistant, 
          then come back here to organize them visually.
        </p>
        <Button onClick={() => setViewMode('chat')} size="lg">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Chat
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="relative h-full bg-background overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 glass border-b border-glass-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isMobile ? '' : 'Back'}
            </Button>
            <div>
              <h2 className="text-lg font-semibold">Whiteboard</h2>
              <Badge variant="secondary" className="text-xs">
                {tasks.length} tasks
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={autoLayoutTasks}
              className="hidden md:flex"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Auto Layout
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button 
              onClick={() => setViewMode('preview')}
              size="sm"
            >
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <WhiteboardToolbar
        zoom={zoom}
        onZoomChange={setZoom}
        onAutoLayout={autoLayoutTasks}
        className="absolute top-20 left-4 right-4 z-30"
      />

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 pt-32"
        onWheel={handleWheel}
        onClick={() => clearSelection()}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'top left'
        }}
      >
        <DndContext
          sensors={sensors}
          modifiers={[restrictToWindowEdges]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          </div>
          
          {/* Task Cards */}
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isSelected={selectedTasks.includes(task.id)}
              isDragging={activeTask === task.id}
            />
          ))}
          
          {/* Drag Overlay */}
          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={tasks.find(t => t.id === activeTask)!}
                isSelected={false}
                isDragging={true}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
      
      {/* Mobile Zoom Controls */}
      {isMobile && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setZoom(prev => Math.min(2, prev + 0.2))}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}