// Auto-generated file - do not edit manually
// Run 'npm run generate:agents' to update
import { Agent } from '../types';

// Import the JSON data
import agentsData from './all-agents.json';

export const ALL_AGENTS: Agent[] = agentsData as Agent[];

export const getAgentCategories = (): string[] => {
  const categories = new Set<string>();
  ALL_AGENTS.forEach(agent => {
    const category = agent.role.split(' ')[0];
    categories.add(category);
  });
  return Array.from(categories).sort();
};

export const getAgentsByCategory = (category: string): Agent[] => {
  return ALL_AGENTS.filter(agent => 
    agent.role.toLowerCase().includes(category.toLowerCase())
  );
};

export const searchAgents = (query: string): Agent[] => {
  const searchLower = query.toLowerCase();
  return ALL_AGENTS.filter(agent =>
    agent.name.toLowerCase().includes(searchLower) ||
    agent.role.toLowerCase().includes(searchLower) ||
    agent.systemInstruction.toLowerCase().includes(searchLower)
  );
};