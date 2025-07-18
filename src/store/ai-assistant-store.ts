import { create } from 'zustand';
import { AIAssistantState, Task, ChatMessage, ViewMode, Position, LayoutAlgorithm } from '@/types/ai-assistant';

interface AIAssistantActions {
  // Widget state
  toggleWidget: () => void;
  setViewMode: (mode: ViewMode) => void;
  closeWidget: () => void;
  
  // Chat functionality
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setCurrentInput: (input: string) => void;
  setIsGenerating: (generating: boolean) => void;
  
  // Task management
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'position'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskPosition: (id: string, position: Position) => void;
  toggleTaskCompletion: (id: string) => void;
  
  // Selection and whiteboard
  selectTask: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: Position) => void;
  setLayoutAlgorithm: (algorithm: LayoutAlgorithm) => void;
  
  // Bulk operations
  addMultipleTasks: (tasks: Omit<Task, 'id' | 'createdAt' | 'completed' | 'position'>[]) => void;
  deleteSelectedTasks: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultPosition = (): Position => ({
  x: Math.random() * 400,
  y: Math.random() * 300
});

export const useAIAssistantStore = create<AIAssistantState & AIAssistantActions>((set, get) => ({
  // Initial state
  isOpen: false,
  viewMode: 'minimized',
  tasks: [],
  selectedTasks: [],
  chatMessages: [
    {
      id: '1',
      content: 'Hello! I\'m your AI task assistant. I can help you break down complex projects into manageable tasks. What would you like to work on today?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ],
  zoom: 1,
  pan: { x: 0, y: 0 },
  isLoading: false,
  isGenerating: false,
  currentInput: '',
  layoutAlgorithm: 'grid',

  // Widget actions
  toggleWidget: () => set((state) => ({
    isOpen: !state.isOpen,
    viewMode: !state.isOpen ? 'chat' : 'minimized'
  })),

  setViewMode: (mode) => set({ viewMode: mode }),

  closeWidget: () => set({ isOpen: false, viewMode: 'minimized' }),

  // Chat actions
  addMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, {
      ...message,
      id: generateId(),
      timestamp: new Date()
    }]
  })),

  setCurrentInput: (input) => set({ currentInput: input }),

  setIsGenerating: (generating) => set({ isGenerating: generating }),

  // Task actions
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      completed: false,
      position: defaultPosition()
    }]
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    )
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTasks: state.selectedTasks.filter(taskId => taskId !== id)
  })),

  updateTaskPosition: (id, position) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, position } : task
    )
  })),

  toggleTaskCompletion: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  })),

  // Selection actions
  selectTask: (id, multiSelect = false) => set((state) => {
    if (multiSelect) {
      const isSelected = state.selectedTasks.includes(id);
      return {
        selectedTasks: isSelected
          ? state.selectedTasks.filter(taskId => taskId !== id)
          : [...state.selectedTasks, id]
      };
    }
    return { selectedTasks: [id] };
  }),

  clearSelection: () => set({ selectedTasks: [] }),

  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),

  setPan: (pan) => set({ pan }),

  setLayoutAlgorithm: (algorithm) => set({ layoutAlgorithm: algorithm }),

  // Bulk actions
  addMultipleTasks: (tasks) => set((state) => ({
    tasks: [...state.tasks, ...tasks.map(task => ({
      ...task,
      id: generateId(),
      createdAt: new Date(),
      completed: false,
      position: defaultPosition()
    }))]
  })),

  deleteSelectedTasks: () => set((state) => ({
    tasks: state.tasks.filter(task => !state.selectedTasks.includes(task.id)),
    selectedTasks: []
  }))
}));