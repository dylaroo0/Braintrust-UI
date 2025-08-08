import { Agent } from '../types';

export interface CollaborationData {
  oftenPairedWith: string[];
  teamSuccessRate: number;
  usageCount: number;
  lastUsed?: Date;
  categories: string[];
}

export interface TeamCombination {
  id: string;
  agentIds: string[];
  projectContext: string;
  timestamp: Date;
  success: boolean;
  duration: number; // in minutes
}

class CollaborationService {
  private static instance: CollaborationService;
  private collaborationData: Record<string, CollaborationData> = {};
  private teamCombinations: TeamCombination[] = [];
  private storageKey = 'braintrust-collaboration-data';
  private combinationsKey = 'braintrust-team-combinations';

  private constructor() {
    this.loadData();
  }

  public static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  // Load data from localStorage
  private loadData(): void {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      const savedCombinations = localStorage.getItem(this.combinationsKey);
      
      if (savedData) {
        this.collaborationData = JSON.parse(savedData);
      }
      
      if (savedCombinations) {
        this.teamCombinations = JSON.parse(savedCombinations).map((combo: any) => ({
          ...combo,
          timestamp: new Date(combo.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading collaboration data:', error);
    }
  }

  // Save data to localStorage
  private saveData(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.collaborationData));
      localStorage.setItem(this.combinationsKey, JSON.stringify(this.teamCombinations));
    } catch (error) {
      console.error('Error saving collaboration data:', error);
    }
  }

  // Track agent usage
  public trackAgentUsage(agentId: string, category?: string): void {
    if (!this.collaborationData[agentId]) {
      this.collaborationData[agentId] = {
        oftenPairedWith: [],
        teamSuccessRate: 80, // Default starting success rate
        usageCount: 0,
        categories: []
      };
    }

    this.collaborationData[agentId].usageCount += 1;
    this.collaborationData[agentId].lastUsed = new Date();
    
    if (category && !this.collaborationData[agentId].categories.includes(category)) {
      this.collaborationData[agentId].categories.push(category);
    }

    this.saveData();
  }

  // Track team combination
  public trackTeamCombination(
    agents: Agent[], 
    projectContext: string, 
    success: boolean = true, 
    duration: number = 60
  ): string {
    const combinationId = `combo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const agentIds = agents.map(a => a.id);
    
    const combination: TeamCombination = {
      id: combinationId,
      agentIds,
      projectContext,
      timestamp: new Date(),
      success,
      duration
    };

    this.teamCombinations.push(combination);

    // Update collaboration data for each agent
    agents.forEach(agent => {
      const otherAgentNames = agents
        .filter(a => a.id !== agent.id)
        .map(a => a.name);

      if (!this.collaborationData[agent.id]) {
        this.collaborationData[agent.id] = {
          oftenPairedWith: [],
          teamSuccessRate: 80,
          usageCount: 0,
          categories: []
        };
      }

      // Update often paired with
      otherAgentNames.forEach(name => {
        const existing = this.collaborationData[agent.id].oftenPairedWith;
        if (!existing.includes(name)) {
          existing.push(name);
        }
      });

      // Update success rate (simple moving average)
      const currentRate = this.collaborationData[agent.id].teamSuccessRate;
      const newRate = success ? 
        Math.min(95, currentRate + (100 - currentRate) * 0.1) :
        Math.max(50, currentRate - currentRate * 0.2);
      
      this.collaborationData[agent.id].teamSuccessRate = Math.round(newRate);

      this.trackAgentUsage(agent.id, agent.role.split(' ')[0]);
    });

    // Keep only last 1000 combinations to prevent storage bloat
    if (this.teamCombinations.length > 1000) {
      this.teamCombinations = this.teamCombinations.slice(-1000);
    }

    this.saveData();
    return combinationId;
  }

  // Get collaboration data for an agent
  public getAgentCollaborationData(agentId: string): CollaborationData | null {
    return this.collaborationData[agentId] || null;
  }

  // Get suggested teammates for an agent
  public getSuggestedTeammates(agentId: string, excludeIds: string[] = []): string[] {
    const data = this.collaborationData[agentId];
    if (!data) return [];

    return data.oftenPairedWith
      .filter(name => !excludeIds.includes(name))
      .slice(0, 3);
  }

  // Get most collaborative agents (sorted by usage and success rate)
  public getMostCollaborativeAgents(): Array<{agentId: string, score: number}> {
    return Object.entries(this.collaborationData)
      .map(([agentId, data]) => ({
        agentId,
        score: data.usageCount * (data.teamSuccessRate / 100) // Combined usage and success score
      }))
      .sort((a, b) => b.score - a.score);
  }

  // Get recent team combinations
  public getRecentCombinations(limit: number = 10): TeamCombination[] {
    return this.teamCombinations
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Suggest team composition based on project context
  public suggestTeam(
    projectContext: string, 
    currentAgents: string[] = [], 
    maxTeamSize: number = 5
  ): Array<{agentId: string, reason: string, confidence: number}> {
    const suggestions: Array<{agentId: string, reason: string, confidence: number}> = [];
    
    // Simple keyword-based suggestions (in a real implementation, this would be more sophisticated)
    const contextLower = projectContext.toLowerCase();
    const keywords = {
      'design': ['designer', 'ux', 'ui'],
      'development': ['developer', 'engineer', 'coding'],
      'analysis': ['analyst', 'data', 'research'],
      'management': ['manager', 'organizer', 'coordinator'],
      'marketing': ['marketing', 'growth', 'content']
    };

    // Find agents based on context keywords
    Object.entries(this.collaborationData).forEach(([agentId, data]) => {
      if (currentAgents.includes(agentId)) return;
      
      let confidence = 0;
      let reason = '';

      // Check if agent categories match project context
      const matchingCategories = data.categories.filter(cat => 
        contextLower.includes(cat.toLowerCase())
      );
      
      if (matchingCategories.length > 0) {
        confidence += 40;
        reason = `Experienced in ${matchingCategories.join(', ')}`;
      }

      // Boost confidence based on success rate and usage
      confidence += (data.teamSuccessRate - 70) * 0.5; // Bonus for high success rates
      confidence += Math.min(20, data.usageCount * 0.5); // Bonus for usage experience

      if (confidence > 30) {
        suggestions.push({
          agentId,
          reason: reason || 'Good team collaboration history',
          confidence: Math.min(100, confidence)
        });
      }
    });

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxTeamSize - currentAgents.length);
  }

  // Clear all collaboration data (for testing/reset purposes)
  public clearData(): void {
    this.collaborationData = {};
    this.teamCombinations = [];
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.combinationsKey);
  }

  // Generate mock data for demonstration purposes
  public generateMockData(agents: Agent[]): void {
    agents.forEach(agent => {
      const usageCount = Math.floor(Math.random() * 50) + 5;
      const successRate = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      const otherAgents = agents.filter(a => a.id !== agent.id);
      const pairedWith = otherAgents
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map(a => a.name);

      this.collaborationData[agent.id] = {
        oftenPairedWith: pairedWith,
        teamSuccessRate: successRate,
        usageCount: usageCount,
        lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        categories: [agent.role.split(' ')[0], agent.role.split(' ')[1]].filter(Boolean)
      };
    });

    this.saveData();
  }
}

export default CollaborationService;