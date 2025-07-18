'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Grid3X3, 
  Layers3, 
  Trash2, 
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw 
} from 'lucide-react';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface WhiteboardToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onAutoLayout: () => void;
  className?: string;
}

export default function WhiteboardToolbar({ 
  zoom, 
  onZoomChange, 
  onAutoLayout, 
  className 
}: WhiteboardToolbarProps) {
  const { 
    tasks, 
    selectedTasks, 
    deleteSelectedTasks, 
    clearSelection 
  } = useAIAssistantStore();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const handleZoomIn = () => {
    onZoomChange(Math.min(2, zoom + 0.2));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(0.5, zoom - 0.2));
  };

  const handleReset = () => {
    onZoomChange(1);
    clearSelection();
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <motion.div
      className={cn(
        "flex items-center justify-between glass border border-glass-border rounded-xl p-3 shadow-glass",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Left Section - Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Layers3 className="h-4 w-4 text-accent" />
          <Badge variant="secondary" className="text-xs">
            {totalTasks} tasks
          </Badge>
          {completedTasks > 0 && (
            <Badge className="bg-success/10 text-success border-success/20 text-xs">
              {completedTasks} done
            </Badge>
          )}
        </div>

        {/* Selection Info */}
        {selectedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              {selectedTasks.length} selected
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteSelectedTasks}
              className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Right Section - Controls */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            
            <div className="flex items-center gap-2 min-w-[80px]">
              <Slider
                value={[zoom]}
                onValueChange={([value]) => onZoomChange(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-16"
              />
              <span className="text-xs text-muted-foreground min-w-[30px]">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 2}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAutoLayout}
            className="h-8 px-2"
          >
            <Grid3X3 className="h-3 w-3 mr-1" />
            {!isMobile && <span className="text-xs">Layout</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={exportTasks}
            className="h-8 px-2"
          >
            <Download className="h-3 w-3 mr-1" />
            {!isMobile && <span className="text-xs">Export</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {!isMobile && <span className="text-xs">Reset</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}