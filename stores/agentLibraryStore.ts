import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AgentDatabaseService, { AgentSearchOptions, AgentSearchResult } from '../services/agentDatabaseService';
import { Agent as DatabaseAgent } from '../services/database';
import { Agent } from '../types';

// Transform database agent to UI agent format
const transformDatabaseAgent = (dbAgent: DatabaseAgent): Agent => ({
  id: dbAgent.id,
  name: dbAgent.name,
  role: dbAgent.role,
  avatar: dbAgent.avatar as any, // Will need proper React element conversion
  systemInstruction: dbAgent.systemInstruction,
  color: dbAgent.color,
});

// Transform UI agent to database agent format
const transformToDatabase = (agent: Agent): Omit<DatabaseAgent, 'created_at'> => ({
  id: agent.id,
  name: agent.name,
  role: agent.role,
  description: agent.systemInstruction, // Use systemInstruction as description
  systemInstruction: agent.systemInstruction,
  color: agent.color,
  avatar: typeof agent.avatar === 'string' ? agent.avatar : '🤖', // Default avatar
  tags: JSON.stringify([]), // Default empty tags
  category: 'General', // Default category
});

interface AgentLibraryState {
  // Core data
  agents: Agent[];
  filteredAgents: Agent[];
  categories: string[];
  tags: string[];
  
  // Search and filter state
  searchTerm: string;
  selectedCategory: string | null;
  selectedTags: string[];
  
  // Loading and pagination state
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  totalCount: number;
  
  // Error state
  error: string | null;
  
  // Database service
  dbService: AgentDatabaseService | null;
}

interface AgentLibraryActions {
  // Initialization
  initializeService: (dbPath?: string) => void;
  loadAgents: () => Promise<void>;
  loadMoreAgents: () => Promise<void>;
  
  // Search and filtering
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  clearFilters: () => void;
  searchAgents: (options?: Partial<AgentSearchOptions>) => Promise<void>;
  
  // Agent management
  addAgent: (agent: Agent) => Promise<void>;
  updateAgent: (id: string, updates: Partial<Agent>) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  getAgentById: (id: string) => Promise<Agent | null>;
  
  // Metadata
  loadCategories: () => Promise<void>;
  loadTags: () => Promise<void>;
  getSearchSuggestions: (query: string) => Promise<string[]>;
  
  // Utility
  resetState: () => void;
  clearError: () => void;
}

type AgentLibraryStore = AgentLibraryState & AgentLibraryActions;

const ITEMS_PER_PAGE = 50;

export const useAgentLibraryStore = create<AgentLibraryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      agents: [],
      filteredAgents: [],
      categories: [],
      tags: [],
      searchTerm: '',
      selectedCategory: null,
      selectedTags: [],
      isLoading: false,
      hasMore: false,
      currentPage: 0,
      totalCount: 0,
      error: null,
      dbService: null,

      // Initialize database service
      initializeService: (dbPath = 'agents.db') => {
        try {
          const service = new AgentDatabaseService(dbPath);
          set({ dbService: service, error: null });
        } catch (error) {
          console.error('Failed to initialize agent database service:', error);
          set({ error: 'Failed to initialize database service' });
        }
      },

      // Load agents with current filters
      loadAgents: async () => {
        const { dbService, searchTerm, selectedCategory, selectedTags } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return;
        }

        set({ isLoading: true, error: null, currentPage: 0 });

        try {
          const searchOptions: AgentSearchOptions = {
            query: searchTerm || undefined,
            category: selectedCategory || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            limit: ITEMS_PER_PAGE,
            offset: 0,
          };

          const result: AgentSearchResult = await dbService.searchAgents(searchOptions);
          const transformedAgents = result.agents.map(transformDatabaseAgent);

          set({
            agents: transformedAgents,
            filteredAgents: transformedAgents,
            totalCount: result.total,
            hasMore: result.hasMore,
            currentPage: 1,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load agents:', error);
          set({ 
            error: 'Failed to load agents',
            isLoading: false,
            agents: [],
            filteredAgents: [],
          });
        }
      },

      // Load more agents (pagination)
      loadMoreAgents: async () => {
        const { dbService, searchTerm, selectedCategory, selectedTags, currentPage, hasMore, agents } = get();
        
        if (!dbService || !hasMore) return;

        set({ isLoading: true, error: null });

        try {
          const searchOptions: AgentSearchOptions = {
            query: searchTerm || undefined,
            category: selectedCategory || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            limit: ITEMS_PER_PAGE,
            offset: currentPage * ITEMS_PER_PAGE,
          };

          const result: AgentSearchResult = await dbService.searchAgents(searchOptions);
          const transformedAgents = result.agents.map(transformDatabaseAgent);
          const allAgents = [...agents, ...transformedAgents];

          set({
            agents: allAgents,
            filteredAgents: allAgents,
            hasMore: result.hasMore,
            currentPage: currentPage + 1,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load more agents:', error);
          set({ 
            error: 'Failed to load more agents',
            isLoading: false,
          });
        }
      },

      // Set search term and trigger search
      setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        // Debounce search - in a real implementation, you might want to add debouncing
        get().searchAgents();
      },

      // Set selected category and trigger search
      setSelectedCategory: (category: string | null) => {
        set({ selectedCategory: category });
        get().searchAgents();
      },

      // Set selected tags and trigger search
      setSelectedTags: (tags: string[]) => {
        set({ selectedTags: tags });
        get().searchAgents();
      },

      // Clear all filters
      clearFilters: () => {
        set({ 
          searchTerm: '', 
          selectedCategory: null, 
          selectedTags: [] 
        });
        get().loadAgents();
      },

      // Search agents with custom options
      searchAgents: async (customOptions?: Partial<AgentSearchOptions>) => {
        const { dbService, searchTerm, selectedCategory, selectedTags } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return;
        }

        set({ isLoading: true, error: null, currentPage: 0 });

        try {
          const searchOptions: AgentSearchOptions = {
            query: searchTerm || undefined,
            category: selectedCategory || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            limit: ITEMS_PER_PAGE,
            offset: 0,
            ...customOptions,
          };

          const result: AgentSearchResult = await dbService.advancedSearch(searchOptions);
          const transformedAgents = result.agents.map(transformDatabaseAgent);

          set({
            agents: transformedAgents,
            filteredAgents: transformedAgents,
            totalCount: result.total,
            hasMore: result.hasMore,
            currentPage: 1,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to search agents:', error);
          set({ 
            error: 'Failed to search agents',
            isLoading: false,
            agents: [],
            filteredAgents: [],
          });
        }
      },

      // Add new agent
      addAgent: async (agent: Agent) => {
        const { dbService } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return;
        }

        try {
          const dbAgent = transformToDatabase(agent);
          await dbService.addAgent(dbAgent);
          
          // Reload agents to reflect changes
          await get().loadAgents();
        } catch (error) {
          console.error('Failed to add agent:', error);
          set({ error: 'Failed to add agent' });
        }
      },

      // Update existing agent
      updateAgent: async (id: string, updates: Partial<Agent>) => {
        const { dbService } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return;
        }

        try {
          // Convert UI updates to database format
          const dbUpdates: Partial<Omit<DatabaseAgent, 'id' | 'created_at'>> = {};
          
          if (updates.name) dbUpdates.name = updates.name;
          if (updates.role) dbUpdates.role = updates.role;
          if (updates.systemInstruction) {
            dbUpdates.systemInstruction = updates.systemInstruction;
            dbUpdates.description = updates.systemInstruction;
          }
          if (updates.color) dbUpdates.color = updates.color;
          if (updates.avatar) {
            dbUpdates.avatar = typeof updates.avatar === 'string' ? updates.avatar : '🤖';
          }

          const success = await dbService.updateAgent(id, dbUpdates);
          
          if (success) {
            // Reload agents to reflect changes
            await get().loadAgents();
          } else {
            set({ error: 'Failed to update agent' });
          }
        } catch (error) {
          console.error('Failed to update agent:', error);
          set({ error: 'Failed to update agent' });
        }
      },

      // Delete agent
      deleteAgent: async (id: string) => {
        const { dbService } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return;
        }

        try {
          const success = await dbService.deleteAgent(id);
          
          if (success) {
            // Reload agents to reflect changes
            await get().loadAgents();
          } else {
            set({ error: 'Failed to delete agent' });
          }
        } catch (error) {
          console.error('Failed to delete agent:', error);
          set({ error: 'Failed to delete agent' });
        }
      },

      // Get agent by ID
      getAgentById: async (id: string): Promise<Agent | null> => {
        const { dbService } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return null;
        }

        try {
          const dbAgent = await dbService.getAgentById(id);
          return dbAgent ? transformDatabaseAgent(dbAgent) : null;
        } catch (error) {
          console.error('Failed to get agent by ID:', error);
          set({ error: 'Failed to get agent' });
          return null;
        }
      },

      // Load available categories
      loadCategories: async () => {
        const { dbService } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return;
        }

        try {
          const categories = await dbService.getCategories();
          set({ categories });
        } catch (error) {
          console.error('Failed to load categories:', error);
          set({ error: 'Failed to load categories' });
        }
      },

      // Load available tags
      loadTags: async () => {
        const { dbService } = get();
        
        if (!dbService) {
          set({ error: 'Database service not initialized' });
          return;
        }

        try {
          const tags = await dbService.getTags();
          set({ tags });
        } catch (error) {
          console.error('Failed to load tags:', error);
          set({ error: 'Failed to load tags' });
        }
      },

      // Get search suggestions
      getSearchSuggestions: async (query: string): Promise<string[]> => {
        const { dbService } = get();
        
        if (!dbService) {
          return [];
        }

        try {
          return await dbService.getSearchSuggestions(query);
        } catch (error) {
          console.error('Failed to get search suggestions:', error);
          return [];
        }
      },

      // Reset store state
      resetState: () => {
        set({
          agents: [],
          filteredAgents: [],
          categories: [],
          tags: [],
          searchTerm: '',
          selectedCategory: null,
          selectedTags: [],
          isLoading: false,
          hasMore: false,
          currentPage: 0,
          totalCount: 0,
          error: null,
        });
      },

      // Clear error state
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'agent-library-store',
      version: 1,
      // Only persist search preferences, not the actual data
      partialize: (state) => ({
        searchTerm: state.searchTerm,
        selectedCategory: state.selectedCategory,
        selectedTags: state.selectedTags,
      }),
    }
  )
);

// Export convenience hooks for specific parts of the store
export const useAgentLibraryData = () => useAgentLibraryStore(state => ({
  agents: state.agents,
  filteredAgents: state.filteredAgents,
  categories: state.categories,
  tags: state.tags,
  totalCount: state.totalCount,
  hasMore: state.hasMore,
}));

export const useAgentLibrarySearch = () => useAgentLibraryStore(state => ({
  searchTerm: state.searchTerm,
  selectedCategory: state.selectedCategory,
  selectedTags: state.selectedTags,
  setSearchTerm: state.setSearchTerm,
  setSelectedCategory: state.setSelectedCategory,
  setSelectedTags: state.setSelectedTags,
  clearFilters: state.clearFilters,
  searchAgents: state.searchAgents,
  getSearchSuggestions: state.getSearchSuggestions,
}));

export const useAgentLibraryActions = () => useAgentLibraryStore(state => ({
  initializeService: state.initializeService,
  loadAgents: state.loadAgents,
  loadMoreAgents: state.loadMoreAgents,
  addAgent: state.addAgent,
  updateAgent: state.updateAgent,
  deleteAgent: state.deleteAgent,
  getAgentById: state.getAgentById,
  loadCategories: state.loadCategories,
  loadTags: state.loadTags,
}));

export const useAgentLibraryStatus = () => useAgentLibraryStore(state => ({
  isLoading: state.isLoading,
  error: state.error,
  clearError: state.clearError,
}));