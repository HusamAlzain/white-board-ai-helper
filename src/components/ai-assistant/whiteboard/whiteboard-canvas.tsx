'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import TaskCard from './task-card';
import WhiteboardToolbar from './whiteboard-toolbar';
import TaskDetailsDialog from './task-details-dialog';
import BulkEditDialog from './bulk-edit-dialog';
import { 
  ArrowLeft, 
  Grid3X3, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Layers3,
  X,
  Bot,
  Move,
  Edit,
  Trash2
} from 'lucide-react';

export default function WhiteboardCanvas() {
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<string | null>(null);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { 
    tasks, 
    selectedTasks,
    updateTaskPosition, 
    setViewMode,
    clearSelection,
    zoom: storeZoom,
    pan: storePan,
    setZoom: setStoreZoom,
    setPan: setStorePan
  } = useAIAssistantStore();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Auto-layout algorithm with proper spacing
  const autoLayoutTasks = useCallback(() => {
    if (!canvasRef.current || tasks.length === 0) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const cardWidth = 320;
    const cardHeight = 200;
    const padding = 30;
    const startX = 50;
    const startY = 50;
    
    const effectiveWidth = (canvasRect.width / zoom) - (startX * 2);
    const cols = Math.max(1, Math.floor(effectiveWidth / (cardWidth + padding)));
    
    tasks.forEach((task, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      updateTaskPosition(task.id, {
        x: startX + col * (cardWidth + padding),
        y: startY + row * (cardHeight + padding)
      });
    });
  }, [tasks, updateTaskPosition, zoom]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const taskId = active.id as string;
    
    const task = tasks.find(t => t.id === taskId);
    if (task && delta) {
      updateTaskPosition(taskId, {
        x: Math.max(0, task.position.x + delta.x / zoom),
        y: Math.max(0, task.position.y + delta.y / zoom)
      });
    }
    
    setActiveTask(null);
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) { // Middle mouse or Shift+Left
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const newPan = {
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      };
      setPan(newPan);
      setStorePan(newPan);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleTaskClick = useCallback((taskId: string) => {
    setSelectedTaskForDetails(taskId);
  }, []);

  // Zoom handlers
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
      setZoom(newZoom);
      setStoreZoom(newZoom);
    } else if (e.shiftKey) {
      e.preventDefault();
      const newPan = {
        x: pan.x - e.deltaY,
        y: pan.y - e.deltaX
      };
      setPan(newPan);
      setStorePan(newPan);
    }
  };

  // Initialize zoom and pan from store
  useEffect(() => {
    setZoom(storeZoom);
    setPan(storePan);
  }, [storeZoom, storePan]);

  useEffect(() => {
    // Auto-layout on mount if tasks don't have proper positions
    const hasValidPositions = tasks.some(task => 
      task.position.x > 0 || task.position.y > 0
    );
    
    if (tasks.length > 0 && !hasValidPositions) {
      setTimeout(autoLayoutTasks, 100);
    }
  }, [tasks.length, autoLayoutTasks]);

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
      <div className="absolute top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-glass-border">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-5 w-5 text-primary" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-success rounded-full border-2 border-background animate-glow" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-foreground">Whiteboard View</h2>
              <p className="text-xs text-muted-foreground">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} ready to organize
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={autoLayoutTasks}
              className="hidden md:flex h-8 px-3 text-xs"
            >
              Auto Layout
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setViewMode('chat')}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-destructive/10"
            >
              <X className="h-3.5 w-3.5" />
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
        className={cn(
          "absolute inset-0 pt-32 select-none",
          isPanning && "cursor-grabbing"
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            clearSelection();
          }
        }}
        style={{
          cursor: isPanning ? 'grabbing' : 'default'
        }}
      >
        <div
          className="relative w-full h-full min-w-[2000px] min-h-[2000px]"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'top left'
          }}
        >
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
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
                onTaskClick={handleTaskClick}
              />
            ))}
            
            {/* Drag Overlay */}
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  task={tasks.find(t => t.id === activeTask)!}
                  isSelected={false}
                  isDragging={true}
                  onTaskClick={() => {}}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Bulk Edit Panel */}
      {selectedTasks.length > 1 && (
        <motion.div
          className="absolute bottom-6 left-6 glass border border-glass-border rounded-2xl p-4 shadow-floating z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {selectedTasks.length} selected
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBulkEdit(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                selectedTasks.forEach(taskId => {
                  const { deleteTask } = useAIAssistantStore.getState();
                  deleteTask(taskId);
                });
                clearSelection();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
          </div>
        </motion.div>
      )}

      {/* Instructions Panel */}
      <motion.div
        className="absolute top-32 left-6 glass border border-glass-border rounded-xl p-3 shadow-floating z-20 max-w-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <Move className="h-3 w-3" />
            <span>Drag cards to move • Click to select</span>
          </div>
          <div>Shift+Drag to pan • Ctrl+Scroll to zoom</div>
          <div>Shift+Click for multi-select</div>
        </div>
      </motion.div>
      
      {/* Mobile Zoom Controls */}
      {isMobile && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
          <Button
            variant="glass"
            size="icon"
            onClick={() => {
              const newZoom = Math.min(2, zoom + 0.2);
              setZoom(newZoom);
              setStoreZoom(newZoom);
            }}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={() => {
              const newZoom = Math.max(0.5, zoom - 0.2);
              setZoom(newZoom);
              setStoreZoom(newZoom);
            }}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Task Details Dialog */}
      <AnimatePresence>
        {selectedTaskForDetails && (
          <TaskDetailsDialog
            taskId={selectedTaskForDetails}
            onClose={() => setSelectedTaskForDetails(null)}
          />
        )}
      </AnimatePresence>

      {/* Bulk Edit Dialog */}
      <AnimatePresence>
        {showBulkEdit && (
          <BulkEditDialog
            selectedTaskIds={selectedTasks}
            onClose={() => setShowBulkEdit(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}