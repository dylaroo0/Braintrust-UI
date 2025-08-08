import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  MemoryStore, 
  MemoryItem, 
  MemoryTask, 
  Goal, 
  Decision, 
  Insight, 
  Project, 
  MemoryType,
  Message,
  ProjectInfo,
  SavedSummary
} from '../types';

// Helper function to generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to create base memory item
const createBaseMemoryItem = (
  type: MemoryType,
  item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>
): MemoryItem => {
  const now = new Date();
  return {
    ...item,
    id: generateId(),
    type,
    createdAt: now,
    updatedAt: now,
  };
};

// Type-specific creation helpers
const createMemoryTask = (item: Omit<MemoryTask, 'id' | 'createdAt' | 'updatedAt'>): MemoryTask => ({
  ...createBaseMemoryItem('task', item),
  type: 'task',
  assigneeId: item.assigneeId,
  dueDate: item.dueDate,
  dependencies: item.dependencies || [],
  progress: item.progress || 0,
  estimatedHours: item.estimatedHours,
});

const createGoal = (item: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal => ({
  ...createBaseMemoryItem('goal', item),
  type: 'goal',
  targetDate: item.targetDate,
  milestones: item.milestones || [],
  relatedTasks: item.relatedTasks || [],
  successCriteria: item.successCriteria || [],
  progress: item.progress || 0,
});

const createDecision = (item: Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>): Decision => ({
  ...createBaseMemoryItem('decision', item),
  type: 'decision',
  context: item.context,
  alternatives: item.alternatives || [],
  reasoning: item.reasoning,
  outcome: item.outcome,
  impactedItems: item.impactedItems || [],
});

const createInsight = (item: Omit<Insight, 'id' | 'createdAt' | 'updatedAt'>): Insight => ({
  ...createBaseMemoryItem('insight', item),
  type: 'insight',
  source: item.source,
  confidence: item.confidence,
  relatedItems: item.relatedItems || [],
  actionable: item.actionable,
  category: item.category,
});

const createProject = (item: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => ({
  ...createBaseMemoryItem('project', item),
  type: 'project',
  description: item.description,
  goals: item.goals || [],
  resources: item.resources || [],
  timeline: item.timeline,
  stakeholders: item.stakeholders || [],
  currentPhase: item.currentPhase,
});

interface MemoryStoreState extends MemoryStore {
  // Additional state management methods
  clearAllMemory: () => void;
  getMemoryStats: () => {
    totalItems: number;
    itemsByType: Record<MemoryType, number>;
  };
}

export const useMemoryStore = create<MemoryStoreState>()(
  persist(
    (set, get) => ({
      // Memory Buckets
      tasks: [],
      goals: [],
      decisions: [],
      insights: [],
      projects: [],
      conversations: [],
      savedSummaries: [],

      // Project Management
      projectList: [],
      currentProjectId: null,

      // Core Operations
      addMemoryItem: (type: MemoryType, item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        set((state) => {
          let newItem: MemoryItem;
          
          switch (type) {
            case 'task':
              newItem = createMemoryTask(item as Omit<MemoryTask, 'id' | 'createdAt' | 'updatedAt'>);
              return { ...state, tasks: [...state.tasks, newItem as MemoryTask] };
            case 'goal':
              newItem = createGoal(item as Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>);
              return { ...state, goals: [...state.goals, newItem as Goal] };
            case 'decision':
              newItem = createDecision(item as Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>);
              return { ...state, decisions: [...state.decisions, newItem as Decision] };
            case 'insight':
              newItem = createInsight(item as Omit<Insight, 'id' | 'createdAt' | 'updatedAt'>);
              return { ...state, insights: [...state.insights, newItem as Insight] };
            case 'project':
              newItem = createProject(item as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
              return { ...state, projects: [...state.projects, newItem as Project] };
            default:
              return state;
          }
        });
      },

      updateMemoryItem: (id: string, updates: Partial<MemoryItem>) => {
        set((state) => {
          const updatedItem = { ...updates, updatedAt: new Date() };
          
          return {
            ...state,
            tasks: state.tasks.map(item => 
              item.id === id ? { ...item, ...updatedItem } as MemoryTask : item
            ),
            goals: state.goals.map(item => 
              item.id === id ? { ...item, ...updatedItem } as Goal : item
            ),
            decisions: state.decisions.map(item => 
              item.id === id ? { ...item, ...updatedItem } as Decision : item
            ),
            insights: state.insights.map(item => 
              item.id === id ? { ...item, ...updatedItem } as Insight : item
            ),
            projects: state.projects.map(item => 
              item.id === id ? { ...item, ...updatedItem } as Project : item
            ),
          };
        });
      },

      deleteMemoryItem: (id: string) => {
        set((state) => ({
          ...state,
          tasks: state.tasks.filter(item => item.id !== id),
          goals: state.goals.filter(item => item.id !== id),
          decisions: state.decisions.filter(item => item.id !== id),
          insights: state.insights.filter(item => item.id !== id),
          projects: state.projects.filter(item => item.id !== id),
        }));
      },

      getMemoryItem: (id: string) => {
        const state = get();
        const allItems = [
          ...state.tasks,
          ...state.goals,
          ...state.decisions,
          ...state.insights,
          ...state.projects,
        ];
        return allItems.find(item => item.id === id);
      },

      getMemoryItemsByType: (type: MemoryType) => {
        const state = get();
        switch (type) {
          case 'task':
            return state.tasks;
          case 'goal':
            return state.goals;
          case 'decision':
            return state.decisions;
          case 'insight':
            return state.insights;
          case 'project':
            return state.projects;
          default:
            return [];
        }
      },

      searchMemory: (query: string) => {
        const state = get();
        const allItems = [
          ...state.tasks,
          ...state.goals,
          ...state.decisions,
          ...state.insights,
          ...state.projects,
        ];
        
        const lowercaseQuery = query.toLowerCase();
        return allItems.filter(item => 
          item.title.toLowerCase().includes(lowercaseQuery) ||
          item.content.toLowerCase().includes(lowercaseQuery) ||
          item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
      },

      // Conversation Operations
      addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => {
        set((state) => {
          const newMessage: Message = {
            ...message,
            id: generateId(),
            timestamp: new Date(),
          };
          return {
            ...state,
            conversations: [...state.conversations, newMessage],
          };
        });
      },

      getConversationHistory: (projectId?: string) => {
        const state = get();
        if (projectId) {
          return state.conversations.filter(msg => msg.projectId === projectId);
        }
        return state.conversations;
      },

      searchConversations: (query: string, projectId?: string) => {
        const state = get();
        let conversations = state.conversations;
        
        if (projectId) {
          conversations = conversations.filter(msg => msg.projectId === projectId);
        }
        
        const lowercaseQuery = query.toLowerCase();
        return conversations.filter(msg => 
          msg.text.toLowerCase().includes(lowercaseQuery) ||
          msg.agent.name.toLowerCase().includes(lowercaseQuery)
        );
      },

      // Project Operations
      createProject: (name: string, description: string) => {
        const newProject: ProjectInfo = {
          id: generateId(),
          name,
          description,
          createdAt: new Date(),
          isActive: true,
        };
        
        set((state) => ({
          ...state,
          projectList: [...state.projectList, newProject],
          currentProjectId: newProject.id, // Auto-switch to new project
        }));
        
        // Add welcome message for new project
        const welcomeMessage = {
          text: `🎉 Welcome to "${name}"!\n\nI'm your Organizer, and I'm here to help you manage this project. Here's what I can do:\n\n📋 **Process Conversations**: Say "make a priority list" and I'll analyze your discussions\n🎯 **Create Plans**: Ask for "engineering plan" or "design plan" for detailed to-dos\n💾 **Save Everything**: Say "save that" and I'll organize it with timestamps\n📅 **Track Progress**: View everything on the project calendar\n\n**Ready to get started?** Try having a conversation with the team about your project goals, then ask me to summarize or prioritize!`,
          sender: 'organizer',
          agent: { id: 'organizer', name: 'Organizer', role: 'Project Manager', avatar: '🗂️', systemInstruction: '', color: '#8B5CF6' },
          projectId: newProject.id,
        };
        
        // Add welcome message to conversations
        set((prevState) => ({
          ...prevState,
          conversations: [...prevState.conversations, {
            ...welcomeMessage,
            id: generateId(),
            timestamp: new Date(),
          }],
        }));
        
        return newProject;
      },

      switchProject: (projectId: string) => {
        set((state) => ({
          ...state,
          currentProjectId: projectId,
        }));
      },

      getCurrentProject: () => {
        const state = get();
        if (!state.currentProjectId) return null;
        return state.projectList.find(p => p.id === state.currentProjectId) || null;
      },

      getAllProjects: () => {
        const state = get();
        return state.projectList;
      },

      // Saved Summary Operations
      saveSummary: (summary: Omit<SavedSummary, 'id' | 'createdAt'>) => {
        const newSummary: SavedSummary = {
          ...summary,
          id: generateId(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          ...state,
          savedSummaries: [...state.savedSummaries, newSummary],
        }));
        
        return newSummary;
      },

      getSavedSummaries: (projectId?: string) => {
        const state = get();
        if (projectId) {
          return state.savedSummaries.filter(summary => summary.projectId === projectId);
        }
        return state.savedSummaries;
      },

      deleteSavedSummary: (id: string) => {
        set((state) => ({
          ...state,
          savedSummaries: state.savedSummaries.filter(summary => summary.id !== id),
        }));
      },

      // Advanced Search Operations
      searchAll: (query: string, options = {}) => {
        const startTime = Date.now();
        const state = get();
        const results = [];
        
        const {
          types,
          projectId,
          dateRange,
          priority,
          status
        } = options;
        
        const lowercaseQuery = query.toLowerCase();
        
        // Helper function to calculate relevance score
        const calculateRelevance = (item: any, searchFields: string[]) => {
          let score = 0;
          searchFields.forEach(field => {
            if (field && field.toLowerCase().includes(lowercaseQuery)) {
              score += field.toLowerCase() === lowercaseQuery ? 10 : 
                      field.toLowerCase().startsWith(lowercaseQuery) ? 5 : 1;
            }
          });
          return score;
        };
        
        // Helper function to check filters
        const passesFilters = (item: any) => {
          if (projectId && item.projectId !== projectId) return false;
          if (priority && priority.length > 0 && !priority.includes(item.priority)) return false;
          if (status && status.length > 0 && !status.includes(item.status)) return false;
          if (dateRange) {
            const itemDate = new Date(item.createdAt || item.timestamp);
            if (itemDate < dateRange.start || itemDate > dateRange.end) return false;
          }
          return true;
        };
        
        // Search memory items
        if (!types || types.includes('task')) {
          state.tasks.forEach(task => {
            if (passesFilters(task)) {
              const relevance = calculateRelevance(task, [task.title, task.content, ...task.tags]);
              if (relevance > 0) {
                results.push({
                  id: task.id,
                  type: 'task' as const,
                  title: task.title,
                  content: task.content,
                  relevanceScore: relevance,
                  createdAt: task.createdAt,
                  projectId: task.projectId,
                  metadata: { priority: task.priority, status: task.status, tags: task.tags }
                });
              }
            }
          });
        }
        
        if (!types || types.includes('goal')) {
          state.goals.forEach(goal => {
            if (passesFilters(goal)) {
              const relevance = calculateRelevance(goal, [goal.title, goal.content, ...goal.tags]);
              if (relevance > 0) {
                results.push({
                  id: goal.id,
                  type: 'goal' as const,
                  title: goal.title,
                  content: goal.content,
                  relevanceScore: relevance,
                  createdAt: goal.createdAt,
                  projectId: goal.projectId,
                  metadata: { priority: goal.priority, status: goal.status, tags: goal.tags }
                });
              }
            }
          });
        }
        
        if (!types || types.includes('decision')) {
          state.decisions.forEach(decision => {
            if (passesFilters(decision)) {
              const relevance = calculateRelevance(decision, [decision.title, decision.content, decision.reasoning, ...decision.tags]);
              if (relevance > 0) {
                results.push({
                  id: decision.id,
                  type: 'decision' as const,
                  title: decision.title,
                  content: decision.content,
                  relevanceScore: relevance,
                  createdAt: decision.createdAt,
                  projectId: decision.projectId,
                  metadata: { priority: decision.priority, status: decision.status, tags: decision.tags }
                });
              }
            }
          });
        }
        
        // Search conversations
        state.conversations.forEach(message => {
          if (passesFilters(message)) {
            const relevance = calculateRelevance(message, [message.text, message.agent.name]);
            if (relevance > 0) {
              results.push({
                id: message.id,
                type: 'conversation' as const,
                title: `${message.agent.name}: ${message.text.substring(0, 50)}...`,
                content: message.text,
                relevanceScore: relevance,
                createdAt: message.timestamp,
                projectId: message.projectId,
                metadata: { sender: message.sender, agent: message.agent.name }
              });
            }
          }
        });
        
        // Search saved summaries
        state.savedSummaries.forEach(summary => {
          if (passesFilters(summary)) {
            const relevance = calculateRelevance(summary, [summary.title, summary.content, ...summary.metadata.keyTopics]);
            if (relevance > 0) {
              results.push({
                id: summary.id,
                type: 'summary' as const,
                title: summary.title,
                content: summary.content,
                relevanceScore: relevance,
                createdAt: summary.createdAt,
                projectId: summary.projectId,
                metadata: { type: summary.type, keyTopics: summary.metadata.keyTopics }
              });
            }
          }
        });
        
        // Sort by relevance score
        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        const searchTime = Date.now() - startTime;
        
        // Generate search suggestions based on common terms
        const suggestions = [];
        const commonTerms = ['priority', 'engineering', 'design', 'goals', 'decisions', 'tasks'];
        commonTerms.forEach(term => {
          if (term.includes(lowercaseQuery) && term !== lowercaseQuery) {
            suggestions.push(term);
          }
        });
        
        return {
          results: results.slice(0, 50), // Limit to 50 results
          totalCount: results.length,
          searchTime,
          suggestions: suggestions.slice(0, 5)
        };
      },

      getAnalytics: (projectId?: string) => {
        const state = get();
        
        // Filter data by project if specified
        const filterByProject = (items: any[]) => {
          return projectId ? items.filter(item => item.projectId === projectId) : items;
        };
        
        const tasks = filterByProject(state.tasks);
        const goals = filterByProject(state.goals);
        const decisions = filterByProject(state.decisions);
        const insights = filterByProject(state.insights);
        const projects = filterByProject(state.projects);
        const conversations = filterByProject(state.conversations);
        const summaries = filterByProject(state.savedSummaries);
        
        const totalItems = tasks.length + goals.length + decisions.length + insights.length + projects.length + conversations.length + summaries.length;
        
        // Items by type
        const itemsByType = {
          task: tasks.length,
          goal: goals.length,
          decision: decisions.length,
          insight: insights.length,
          project: projects.length,
          conversation: conversations.length,
          summary: summaries.length
        };
        
        // Items by priority
        const itemsByPriority = { low: 0, medium: 0, high: 0, critical: 0 };
        [...tasks, ...goals, ...decisions, ...insights, ...projects].forEach(item => {
          if (item.priority) {
            itemsByPriority[item.priority]++;
          }
        });
        
        // Items by status
        const itemsByStatus = { active: 0, completed: 0, archived: 0, cancelled: 0 };
        [...tasks, ...goals, ...decisions, ...insights, ...projects].forEach(item => {
          if (item.status) {
            itemsByStatus[item.status]++;
          }
        });
        
        // Activity by date (last 30 days)
        const activityByDate = [];
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayItems = [...tasks, ...goals, ...decisions, ...conversations, ...summaries].filter(item => {
            const itemDate = new Date(item.createdAt || item.timestamp);
            return itemDate.toISOString().split('T')[0] === dateStr;
          });
          
          activityByDate.push({
            date: dateStr,
            count: dayItems.length
          });
        }
        
        // Top tags
        const tagCounts = new Map();
        [...tasks, ...goals, ...decisions, ...insights, ...projects].forEach(item => {
          if (item.tags) {
            item.tags.forEach(tag => {
              tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            });
          }
        });
        
        const topTags = Array.from(tagCounts.entries())
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        // Completion rate
        const completableItems = [...tasks, ...goals];
        const completedItems = completableItems.filter(item => item.status === 'completed');
        const completionRate = completableItems.length > 0 ? (completedItems.length / completableItems.length) * 100 : 0;
        
        // Average items per day
        const daysWithActivity = activityByDate.filter(day => day.count > 0).length;
        const averageItemsPerDay = daysWithActivity > 0 ? totalItems / daysWithActivity : 0;
        
        // Project breakdown (if not filtering by project)
        let projectBreakdown;
        if (!projectId) {
          const projectCounts = new Map();
          [...tasks, ...goals, ...decisions, ...conversations, ...summaries].forEach(item => {
            if (item.projectId) {
              const project = state.projectList.find(p => p.id === item.projectId);
              const projectName = project ? project.name : 'Unknown Project';
              projectCounts.set(item.projectId, {
                projectId: item.projectId,
                projectName,
                count: (projectCounts.get(item.projectId)?.count || 0) + 1
              });
            }
          });
          
          projectBreakdown = Array.from(projectCounts.values())
            .sort((a, b) => b.count - a.count);
        }
        
        return {
          totalItems,
          itemsByType,
          itemsByPriority,
          itemsByStatus,
          activityByDate,
          topTags,
          completionRate,
          averageItemsPerDay,
          projectBreakdown
        };
      },

      // Utility functions
      generateId,

      initializeStore: () => {
        // Initialize with empty state - persistence will handle loading
        set({
          tasks: [],
          goals: [],
          decisions: [],
          insights: [],
          projects: [],
          conversations: [],
          savedSummaries: [],
          projectList: [],
          currentProjectId: null,
        });
      },

      // Additional state management methods
      clearAllMemory: () => {
        set({
          tasks: [],
          goals: [],
          decisions: [],
          insights: [],
          projects: [],
        });
      },

      getMemoryStats: () => {
        const state = get();
        return {
          totalItems: state.tasks.length + state.goals.length + state.decisions.length + 
                     state.insights.length + state.projects.length,
          itemsByType: {
            task: state.tasks.length,
            goal: state.goals.length,
            decision: state.decisions.length,
            insight: state.insights.length,
            project: state.projects.length,
          },
        };
      },
    }),
    {
      name: 'memory-store', // unique name for localStorage key
      version: 1,
    }
  )
);

// Export individual bucket hooks for convenience
export const useMemoryTasks = () => useMemoryStore(state => state.tasks);
export const useMemoryGoals = () => useMemoryStore(state => state.goals);
export const useMemoryDecisions = () => useMemoryStore(state => state.decisions);
export const useMemoryInsights = () => useMemoryStore(state => state.insights);
export const useMemoryProjects = () => useMemoryStore(state => state.projects);

// Export action hooks
export const useMemoryActions = () => useMemoryStore(state => ({
  addMemoryItem: state.addMemoryItem,
  updateMemoryItem: state.updateMemoryItem,
  deleteMemoryItem: state.deleteMemoryItem,
  getMemoryItem: state.getMemoryItem,
  getMemoryItemsByType: state.getMemoryItemsByType,
  searchMemory: state.searchMemory,
  clearAllMemory: state.clearAllMemory,
  getMemoryStats: state.getMemoryStats,
}));