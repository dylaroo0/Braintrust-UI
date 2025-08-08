import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAgentLibraryStore } from './agentLibraryStore';
import AgentDatabaseService from '../services/agentDatabaseService';

// Mock the database service
vi.mock('../services/agentDatabaseService');

describe('AgentLibraryStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAgentLibraryStore.getState().resetState();
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const state = useAgentLibraryStore.getState();
    
    expect(state.agents).toEqual([]);
    expect(state.filteredAgents).toEqual([]);
    expect(state.categories).toEqual([]);
    expect(state.tags).toEqual([]);
    expect(state.searchTerm).toBe('');
    expect(state.selectedCategory).toBeNull();
    expect(state.selectedTags).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.hasMore).toBe(false);
    expect(state.currentPage).toBe(0);
    expect(state.totalCount).toBe(0);
    expect(state.error).toBeNull();
    expect(state.dbService).toBeNull();
  });

  it('should initialize database service', () => {
    const { initializeService } = useAgentLibraryStore.getState();
    
    initializeService('test.db');
    
    const state = useAgentLibraryStore.getState();
    expect(state.dbService).toBeInstanceOf(AgentDatabaseService);
    expect(state.error).toBeNull();
  });

  it('should handle search term changes', () => {
    const { setSearchTerm } = useAgentLibraryStore.getState();
    
    setSearchTerm('test query');
    
    const state = useAgentLibraryStore.getState();
    expect(state.searchTerm).toBe('test query');
  });

  it('should handle category selection', () => {
    const { setSelectedCategory } = useAgentLibraryStore.getState();
    
    setSelectedCategory('Development');
    
    const state = useAgentLibraryStore.getState();
    expect(state.selectedCategory).toBe('Development');
  });

  it('should handle tag selection', () => {
    const { setSelectedTags } = useAgentLibraryStore.getState();
    
    setSelectedTags(['javascript', 'react']);
    
    const state = useAgentLibraryStore.getState();
    expect(state.selectedTags).toEqual(['javascript', 'react']);
  });

  it('should clear filters', () => {
    const { setSearchTerm, setSelectedCategory, setSelectedTags, clearFilters } = useAgentLibraryStore.getState();
    
    // Set some filters
    setSearchTerm('test');
    setSelectedCategory('Development');
    setSelectedTags(['javascript']);
    
    // Clear filters
    clearFilters();
    
    const state = useAgentLibraryStore.getState();
    expect(state.searchTerm).toBe('');
    expect(state.selectedCategory).toBeNull();
    expect(state.selectedTags).toEqual([]);
  });

  it('should handle error states', () => {
    const { clearError } = useAgentLibraryStore.getState();
    
    // Manually set an error for testing
    useAgentLibraryStore.setState({ error: 'Test error' });
    
    let state = useAgentLibraryStore.getState();
    expect(state.error).toBe('Test error');
    
    clearError();
    
    state = useAgentLibraryStore.getState();
    expect(state.error).toBeNull();
  });

  it('should reset state correctly', () => {
    const { resetState } = useAgentLibraryStore.getState();
    
    // Set some state
    useAgentLibraryStore.setState({
      agents: [{ id: 'test', name: 'Test Agent' } as any],
      searchTerm: 'test',
      selectedCategory: 'Development',
      isLoading: true,
      error: 'Some error',
    });
    
    resetState();
    
    const state = useAgentLibraryStore.getState();
    expect(state.agents).toEqual([]);
    expect(state.searchTerm).toBe('');
    expect(state.selectedCategory).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle loading states', async () => {
    const mockDbService = {
      searchAgents: vi.fn().mockResolvedValue({
        agents: [
          {
            id: 'test-1',
            name: 'Test Agent 1',
            role: 'Developer',
            description: 'Test description',
            systemInstruction: 'Test instruction',
            color: '#FF0000',
            avatar: '🤖',
            tags: '["javascript", "react"]',
            category: 'Development',
          }
        ],
        total: 1,
        hasMore: false,
      }),
    } as any;

    // Initialize with mock service
    useAgentLibraryStore.setState({ dbService: mockDbService });
    
    const { loadAgents } = useAgentLibraryStore.getState();
    
    // Start loading
    const loadPromise = loadAgents();
    
    // Check loading state
    let state = useAgentLibraryStore.getState();
    expect(state.isLoading).toBe(true);
    
    // Wait for completion
    await loadPromise;
    
    // Check final state
    state = useAgentLibraryStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.agents).toHaveLength(1);
    expect(state.agents[0].name).toBe('Test Agent 1');
    expect(mockDbService.searchAgents).toHaveBeenCalledWith({
      query: undefined,
      category: undefined,
      tags: undefined,
      limit: 50,
      offset: 0,
    });
  });
});

// Export test utilities for other tests
export const createMockAgent = (overrides = {}) => ({
  id: 'mock-agent',
  name: 'Mock Agent',
  role: 'Test Role',
  avatar: '🤖' as any,
  systemInstruction: 'Mock system instruction',
  color: '#FF0000',
  ...overrides,
});

export const createMockDatabaseAgent = (overrides = {}) => ({
  id: 'mock-db-agent',
  name: 'Mock DB Agent',
  role: 'Test Role',
  description: 'Mock description',
  systemInstruction: 'Mock system instruction',
  color: '#FF0000',
  avatar: '🤖',
  tags: '["test", "mock"]',
  category: 'Test Category',
  ...overrides,
});