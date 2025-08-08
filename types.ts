import React from 'react';

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: React.ReactElement;
  systemInstruction: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  status: 'todo' | 'doing' | 'done';
}

// Memory System Types
export type MemoryType = 'task' | 'goal' | 'decision' | 'insight' | 'project';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'active' | 'completed' | 'archived' | 'cancelled';

export interface MemoryMetadata {
  source: string;
  confidence?: number;
  relatedItems: string[];
  tags: string[];
}

export interface MemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  metadata: MemoryMetadata;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  priority: Priority;
  status: Status;
}

export interface MemoryTask extends MemoryItem {
  type: 'task';
  assigneeId?: string;
  dueDate?: Date;
  dependencies: string[];
  progress: number;
  estimatedHours?: number;
}

export interface Goal extends MemoryItem {
  type: 'goal';
  targetDate?: Date;
  milestones: Milestone[];
  relatedTasks: string[];
  successCriteria: string[];
  progress: number;
}

export interface Decision extends MemoryItem {
  type: 'decision';
  context: string;
  alternatives: Alternative[];
  reasoning: string;
  outcome?: string;
  impactedItems: string[];
}

export interface Insight extends MemoryItem {
  type: 'insight';
  source: InsightSource;
  confidence: number;
  relatedItems: string[];
  actionable: boolean;
  category: InsightCategory;
}

export interface Project extends MemoryItem {
  type: 'project';
  description: string;
  goals: string[];
  resources: Resource[];
  timeline: Timeline;
  stakeholders: string[];
  currentPhase: ProjectPhase;
}

// Supporting Types
export interface Milestone {
  id: string;
  title: string;
  targetDate: Date;
  completed: boolean;
  description?: string;
}

export interface Alternative {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  selected: boolean;
}

export type InsightSource = 'conversation' | 'pattern' | 'user' | 'system';
export type InsightCategory = 'process' | 'technical' | 'business' | 'personal';

export interface Resource {
  id: string;
  name: string;
  type: 'document' | 'tool' | 'person' | 'link';
  url?: string;
  description?: string;
}

export interface Timeline {
  startDate: Date;
  endDate?: Date;
  phases: ProjectPhase[];
}

export type ProjectPhase = 'planning' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';

// Simple Project Management
export interface ProjectInfo {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  isActive: boolean;
}

// Saved Summary Types
export interface SavedSummary {
  id: string;
  title: string;
  content: string;
  type: 'priority-list' | 'engineering-plan' | 'design-plan' | 'management-plan' | 'conversation-summary' | 'decisions' | 'goals';
  createdAt: Date;
  projectId?: string;
  conversationIds: string[];
  metadata: {
    participantCount: number;
    messageCount: number;
    keyTopics: string[];
    actionItemsCount: number;
    decisionsCount: number;
  };
}

// Memory Store Interface
export interface MemoryStore {
  // Memory Buckets
  tasks: MemoryTask[];
  goals: Goal[];
  decisions: Decision[];
  insights: Insight[];
  projects: Project[];
  conversations: Message[];
  savedSummaries: SavedSummary[];
  
  // Project Management
  projectList: ProjectInfo[];
  currentProjectId: string | null;
  
  // Core Operations
  addMemoryItem: (type: MemoryType, item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMemoryItem: (id: string, updates: Partial<MemoryItem>) => void;
  deleteMemoryItem: (id: string) => void;
  getMemoryItem: (id: string) => MemoryItem | undefined;
  getMemoryItemsByType: (type: MemoryType) => MemoryItem[];
  searchMemory: (query: string) => MemoryItem[];
  
  // Conversation Operations
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  getConversationHistory: (projectId?: string) => Message[];
  searchConversations: (query: string, projectId?: string) => Message[];
  
  // Project Operations
  createProject: (name: string, description: string) => ProjectInfo;
  switchProject: (projectId: string) => void;
  getCurrentProject: () => ProjectInfo | null;
  getAllProjects: () => ProjectInfo[];
  
  // Saved Summary Operations
  saveSummary: (summary: Omit<SavedSummary, 'id' | 'createdAt'>) => SavedSummary;
  getSavedSummaries: (projectId?: string) => SavedSummary[];
  deleteSavedSummary: (id: string) => void;
  
  // Advanced Search Operations
  searchAll: (query: string, options?: SearchOptions) => SearchResults;
  getAnalytics: (projectId?: string) => MemoryAnalytics;
  
  // Utility functions
  generateId: () => string;
  initializeStore: () => void;
}

// Advanced Search Types
export interface SearchOptions {
  types?: MemoryType[];
  projectId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: Priority[];
  status?: Status[];
}

export interface SearchResult {
  id: string;
  type: MemoryType | 'conversation' | 'summary';
  title: string;
  content: string;
  relevanceScore: number;
  createdAt: Date;
  projectId?: string;
  metadata?: any;
}

export interface SearchResults {
  results: SearchResult[];
  totalCount: number;
  searchTime: number;
  suggestions: string[];
}

export interface MemoryAnalytics {
  totalItems: number;
  itemsByType: Record<MemoryType | 'conversation' | 'summary', number>;
  itemsByPriority: Record<Priority, number>;
  itemsByStatus: Record<Status, number>;
  activityByDate: { date: string; count: number }[];
  topTags: { tag: string; count: number }[];
  completionRate: number;
  averageItemsPerDay: number;
  projectBreakdown?: { projectId: string; projectName: string; count: number }[];
}
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | string; // 'user' or agent's id
  agent: Agent;
  timestamp: Date;
  projectId?: string; // For project context
  conversationId?: string; // For threading conversations
}