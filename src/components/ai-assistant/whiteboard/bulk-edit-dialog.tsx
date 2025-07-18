'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAIAssistantStore } from '@/store/ai-assistant-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Trash2, Check } from 'lucide-react';
import { Priority } from '@/types/ai-assistant';

interface BulkEditDialogProps {
  selectedTaskIds: string[];
  onClose: () => void;
}

export default function BulkEditDialog({ selectedTaskIds, onClose }: BulkEditDialogProps) {
  const { tasks, updateTask, deleteTask, toggleTaskCompletion, clearSelection } = useAIAssistantStore();
  const selectedTasks = tasks.filter(task => selectedTaskIds.includes(task.id));
  
  const [changePriority, setChangePriority] = useState(false);
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [markCompleted, setMarkCompleted] = useState<boolean | null>(null);

  const handleApplyChanges = () => {
    selectedTaskIds.forEach(taskId => {
      const updates: Partial<any> = {};
      
      if (changePriority) {
        updates.priority = newPriority;
      }
      
      if (updates.priority) {
        updateTask(taskId, updates);
      }
      
      if (markCompleted !== null) {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.completed !== markCompleted) {
          toggleTaskCompletion(taskId);
        }
      }
    });
    
    clearSelection();
    onClose();
  };

  const handleBulkDelete = () => {
    selectedTaskIds.forEach(taskId => {
      deleteTask(taskId);
    });
    clearSelection();
    onClose();
  };

  const priorityStats = selectedTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<Priority, number>);

  const completionStats = selectedTasks.reduce((acc, task) => {
    if (task.completed) acc.completed++;
    else acc.incomplete++;
    return acc;
  }, { completed: 0, incomplete: 0 });

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg glass border-glass-border">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">
            Bulk Edit Tasks
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Editing {selectedTaskIds.length} selected tasks
          </div>
        </DialogHeader>
        
        <motion.div
          className="space-y-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Current Stats */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Current Distribution</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Priority:</span>
                <div className="flex gap-1">
                  {Object.entries(priorityStats).map(([priority, count]) => (
                    <Badge key={priority} variant="secondary" className="text-xs">
                      {priority}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">
                    Completed: {completionStats.completed}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Incomplete: {completionStats.incomplete}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Bulk Actions</h3>
            
            {/* Change Priority */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="change-priority"
                  checked={changePriority}
                  onCheckedChange={(checked) => setChangePriority(checked as boolean)}
                />
                <label htmlFor="change-priority" className="text-sm text-foreground">
                  Change priority for all selected tasks
                </label>
              </div>
              
              {changePriority && (
                <Select value={newPriority} onValueChange={(value: Priority) => setNewPriority(value)}>
                  <SelectTrigger className="bg-glass-secondary border-glass-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="low">🟢 Low</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Mark Completion */}
            <div className="space-y-3">
              <div className="text-sm text-foreground">Mark all as:</div>
              <div className="flex gap-2">
                <Button
                  variant={markCompleted === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMarkCompleted(markCompleted === true ? null : true)}
                  className="text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Completed
                </Button>
                <Button
                  variant={markCompleted === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMarkCompleted(markCompleted === false ? null : false)}
                  className="text-xs"
                >
                  Incomplete
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-glass-border">
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete}
              className="text-sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All ({selectedTaskIds.length})
            </Button>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleApplyChanges} className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}