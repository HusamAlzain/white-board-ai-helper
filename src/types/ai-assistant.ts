export interface Position {
  x: number;
  y: number;
}

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  dueDate?: Date;
  position: Position;
  createdAt: Date;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'task_generation' | 'system';
}

export type ViewMode = 'minimized' | 'chat' | 'preview' | 'whiteboard';

export type LayoutAlgorithm = 'grid' | 'priority' | 'circular' | 'timeline' | 'cluster';

export interface WhiteboardState {
  tasks: Task[];
  selectedTasks: string[];
  viewMode: ViewMode;
  zoom: number;
  pan: Position;
  isLoading: boolean;
  layoutAlgorithm: LayoutAlgorithm;
}

export interface AIAssistantState extends WhiteboardState {
  isOpen: boolean;
  chatMessages: ChatMessage[];
  isGenerating: boolean;
  currentInput: string;
}