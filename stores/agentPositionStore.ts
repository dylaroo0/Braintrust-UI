import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AgentPosition {
  x: number;
  y: number;
}

interface AgentPositionStore {
  positions: Record<string, AgentPosition>;
  updatePosition: (agentId: string, position: AgentPosition) => void;
  getPosition: (agentId: string) => AgentPosition | null;
  resetPositions: () => void;
}

export const useAgentPositionStore = create<AgentPositionStore>()(
  persist(
    (set, get) => ({
      positions: {},
      
      updatePosition: (agentId: string, position: AgentPosition) => {
        set((state) => ({
          positions: {
            ...state.positions,
            [agentId]: position,
          },
        }));
      },
      
      getPosition: (agentId: string) => {
        return get().positions[agentId] || null;
      },
      
      resetPositions: () => {
        set({ positions: {} });
      },
    }),
    {
      name: 'agent-positions',
    }
  )
);