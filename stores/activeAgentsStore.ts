import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Agent } from '../types';

interface AgentPosition {
  x: number;
  y: number;
}

interface ActiveAgent extends Agent {
  position: AgentPosition;
}

interface ActiveAgentsStore {
  activeAgents: ActiveAgent[];
  agentPositions: Record<string, AgentPosition>;
  
  // Agent management
  addAgent: (agent: Agent, position?: AgentPosition) => void;
  removeAgent: (agentId: string) => void;
  getActiveAgent: (agentId: string) => ActiveAgent | undefined;
  
  // Position management
  updatePosition: (agentId: string, position: AgentPosition) => void;
  getPosition: (agentId: string) => AgentPosition | null;
  resetPositions: () => void;
  
  // Utility methods
  isAgentActive: (agentId: string) => boolean;
  getActiveAgentIds: () => string[];
}

export const useActiveAgentsStore = create<ActiveAgentsStore>()(
  persist(
    (set, get) => ({
      activeAgents: [],
      agentPositions: {},
      
      addAgent: (agent: Agent, position?: AgentPosition) => {
        const state = get();
        
        // Don't add if already active
        if (state.activeAgents.some(a => a.id === agent.id)) {
          return;
        }
        
        const defaultPosition = position || { x: 0, y: 0 };
        const activeAgent: ActiveAgent = {
          ...agent,
          position: defaultPosition,
        };
        
        set({
          activeAgents: [...state.activeAgents, activeAgent],
          agentPositions: {
            ...state.agentPositions,
            [agent.id]: defaultPosition,
          },
        });
      },
      
      removeAgent: (agentId: string) => {
        const state = get();
        const { [agentId]: removed, ...remainingPositions } = state.agentPositions;
        
        set({
          activeAgents: state.activeAgents.filter(agent => agent.id !== agentId),
          agentPositions: remainingPositions,
        });
      },
      
      getActiveAgent: (agentId: string) => {
        return get().activeAgents.find(agent => agent.id === agentId);
      },
      
      updatePosition: (agentId: string, position: AgentPosition) => {
        const state = get();
        
        set({
          activeAgents: state.activeAgents.map(agent =>
            agent.id === agentId
              ? { ...agent, position }
              : agent
          ),
          agentPositions: {
            ...state.agentPositions,
            [agentId]: position,
          },
        });
      },
      
      getPosition: (agentId: string) => {
        return get().agentPositions[agentId] || null;
      },
      
      resetPositions: () => {
        const state = get();
        const resetPositions = Object.keys(state.agentPositions).reduce(
          (acc, agentId) => ({ ...acc, [agentId]: { x: 0, y: 0 } }),
          {}
        );
        
        set({
          agentPositions: resetPositions,
          activeAgents: state.activeAgents.map(agent => ({
            ...agent,
            position: { x: 0, y: 0 },
          })),
        });
      },
      
      isAgentActive: (agentId: string) => {
        return get().activeAgents.some(agent => agent.id === agentId);
      },
      
      getActiveAgentIds: () => {
        return get().activeAgents.map(agent => agent.id);
      },
    }),
    {
      name: 'active-agents-storage',
    }
  )
);