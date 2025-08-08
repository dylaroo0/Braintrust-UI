import AgentDatabase, { Agent } from './database.js';

export interface AgentSearchOptions {
  query?: string;
  category?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface AgentSearchResult {
  agents: Agent[];
  total: number;
  hasMore: boolean;
}

export class AgentDatabaseService {
  private db: AgentDatabase;

  constructor(dbPath: string = 'agents.db') {
    this.db = new AgentDatabase(dbPath);
  }

  // Enhanced search agents with multiple criteria and better performance
  async searchAgents(options: AgentSearchOptions): Promise<AgentSearchResult> {
    const { query, category, tags, limit = 50, offset = 0 } = options;

    let agents: Agent[] = [];
    let total = 0;

    if (query && query.trim()) {
      // Use full-text search with better query handling
      const searchQuery = this.prepareSearchQuery(query);
      agents = this.db.searchAgents(searchQuery);
      total = agents.length;
    } else if (category) {
      // Filter by category
      agents = this.db.getAgentsByCategory(category);
      total = agents.length;
    } else if (tags && tags.length > 0) {
      // Enhanced tag filtering using database queries
      agents = this.db.getAgentsByTags(tags);
      total = agents.length;
    } else {
      // Return all agents
      agents = this.db.getAllAgents();
      total = agents.length;
    }

    // Apply pagination
    const paginatedAgents = agents.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      agents: paginatedAgents,
      total,
      hasMore
    };
  }

  // Advanced search with combined filters
  async advancedSearch(options: AgentSearchOptions): Promise<AgentSearchResult> {
    const { query, category, tags, limit = 50, offset = 0 } = options;

    let agents: Agent[] = [];

    if (query && category && tags && tags.length > 0) {
      // Combined search: text + category + tags
      agents = this.db.searchAgentsAdvanced(query, category, tags);
    } else if (query && category) {
      // Text + category
      const searchQuery = this.prepareSearchQuery(query);
      const searchResults = this.db.searchAgents(searchQuery);
      agents = searchResults.filter(agent => agent.category === category);
    } else if (query && tags && tags.length > 0) {
      // Text + tags
      const searchQuery = this.prepareSearchQuery(query);
      const searchResults = this.db.searchAgents(searchQuery);
      agents = searchResults.filter(agent => {
        const agentTags = JSON.parse(agent.tags) as string[];
        return tags.some(tag => agentTags.includes(tag));
      });
    } else if (category && tags && tags.length > 0) {
      // Category + tags
      const categoryAgents = this.db.getAgentsByCategory(category);
      agents = categoryAgents.filter(agent => {
        const agentTags = JSON.parse(agent.tags) as string[];
        return tags.some(tag => agentTags.includes(tag));
      });
    } else {
      // Fallback to regular search
      return this.searchAgents(options);
    }

    const total = agents.length;
    const paginatedAgents = agents.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return {
      agents: paginatedAgents,
      total,
      hasMore
    };
  }

  // Prepare search query for FTS5
  private prepareSearchQuery(query: string): string {
    // Clean and prepare the query for FTS5
    const cleanQuery = query.trim().replace(/[^\w\s]/g, ' ');
    const terms = cleanQuery.split(/\s+/).filter(term => term.length > 0);
    
    if (terms.length === 0) return '';
    
    // Use OR for multiple terms to get broader results
    return terms.map(term => `"${term}"*`).join(' OR ');
  }

  // Get all unique categories
  async getCategories(): Promise<string[]> {
    const agents = this.db.getAllAgents();
    const categories = [...new Set(agents.map(agent => agent.category))];
    return categories.sort();
  }

  // Get all unique tags
  async getTags(): Promise<string[]> {
    const agents = this.db.getAllAgents();
    const allTags = new Set<string>();
    
    agents.forEach(agent => {
      const tags = JSON.parse(agent.tags) as string[];
      tags.forEach(tag => allTags.add(tag));
    });
    
    return Array.from(allTags).sort();
  }

  // Get agent by ID
  async getAgentById(id: string): Promise<Agent | null> {
    const agent = this.db.getAgentById(id);
    return agent || null;
  }

  // Add new agent
  async addAgent(agent: Omit<Agent, 'created_at'>): Promise<void> {
    this.db.insertAgent(agent);
  }

  // Get total count of agents
  async getAgentCount(): Promise<number> {
    return this.db.getAllAgents().length;
  }

  // Get agent count by category
  async getAgentCountByCategory(): Promise<Record<string, number>> {
    return this.db.getAgentCountByCategory();
  }

  // Get popular tags with usage counts
  async getPopularTags(limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
    return this.db.getPopularTags(limit);
  }

  // Search suggestions based on partial input
  async getSearchSuggestions(partialQuery: string, limit: number = 10): Promise<string[]> {
    if (!partialQuery || partialQuery.length < 2) return [];
    
    const agents = this.db.getAllAgents();
    const suggestions = new Set<string>();
    
    // Add matching agent names
    agents.forEach(agent => {
      if (agent.name.toLowerCase().includes(partialQuery.toLowerCase())) {
        suggestions.add(agent.name);
      }
      if (agent.role.toLowerCase().includes(partialQuery.toLowerCase())) {
        suggestions.add(agent.role);
      }
    });
    
    // Add matching tags
    const allTags = await this.getTags();
    allTags.forEach(tag => {
      if (tag.toLowerCase().includes(partialQuery.toLowerCase())) {
        suggestions.add(tag);
      }
    });
    
    return Array.from(suggestions).slice(0, limit);
  }

  // Batch insert agents (useful for seeding)
  async batchInsertAgents(agents: Omit<Agent, 'created_at'>[]): Promise<void> {
    agents.forEach(agent => {
      try {
        this.db.insertAgent(agent);
      } catch (error) {
        console.warn(`Failed to insert agent ${agent.id}:`, error);
      }
    });
  }

  // Update agent
  async updateAgent(id: string, updates: Partial<Omit<Agent, 'id' | 'created_at'>>): Promise<boolean> {
    try {
      return this.db.updateAgent(id, updates);
    } catch (error) {
      console.error(`Failed to update agent ${id}:`, error);
      return false;
    }
  }

  // Delete agent
  async deleteAgent(id: string): Promise<boolean> {
    try {
      return this.db.deleteAgent(id);
    } catch (error) {
      console.error(`Failed to delete agent ${id}:`, error);
      return false;
    }
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

export default AgentDatabaseService;