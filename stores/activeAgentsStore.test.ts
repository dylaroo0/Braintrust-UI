import { useActiveAgentsStore } from './activeAgentsStore';
import type { Agent } from '../types';

// Mock agent for testing
const mockAgent: Agent = {
  id: 'test-agent',
  name: 'Test Agent',
  role: 'Test Role',
  avatar: null as any,
  systemInstruction: 'Test instruction',
  color: '#000000',
};

describe('ActiveAgentsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useActiveAgentsStore.getState().resetPositions();
    useActiveAgentsStore.setState({ activeAgents: [], agentPositions: {} });
  });

  test('should add agent with default position', () => {
    const { addAgent, getActiveAgent, getPosition } = useActiveAgentsStore.getState();
    
    addAgent(mockAgent);
    
    const activeAgent = getActiveAgent('test-agent');
    const position = getPosition('test-agent');
    
    expect(activeAgent).toBeDefined();
    expect(activeAgent?.id).toBe('test-agent');
    expect(position).toEqual({ x: 0, y: 0 });
  });

  test('should add agent with custom position', () => {
    const { addAgent, getPosition } = useActiveAgentsStore.getState();
    const customPosition = { x: 100, y: 200 };
    
    addAgent(mockAgent, customPosition);
    
    const position = getPosition('test-agent');
    expect(position).toEqual(customPosition);
  });

  test('should update agent position', () => {
    const { addAgent, updatePosition, getPosition } = useActiveAgentsStore.getState();
    
    addAgent(mockAgent);
    updatePosition('test-agent', { x: 50, y: 75 });
    
    const position = getPosition('test-agent');
    expect(position).toEqual({ x: 50, y: 75 });
  });

  test('should not add duplicate agents', () => {
    const { addAgent, activeAgents } = useActiveAgentsStore.getState();
    
    addAgent(mockAgent);
    addAgent(mockAgent); // Try to add again
    
    expect(activeAgents.length).toBe(1);
  });

  test('should remove agent', () => {
    const { addAgent, removeAgent, getActiveAgent, getPosition } = useActiveAgentsStore.getState();
    
    addAgent(mockAgent);
    removeAgent('test-agent');
    
    const activeAgent = getActiveAgent('test-agent');
    const position = getPosition('test-agent');
    
    expect(activeAgent).toBeUndefined();
    expect(position).toBeNull();
  });

  test('should check if agent is active', () => {
    const { addAgent, isAgentActive } = useActiveAgentsStore.getState();
    
    expect(isAgentActive('test-agent')).toBe(false);
    
    addAgent(mockAgent);
    
    expect(isAgentActive('test-agent')).toBe(true);
  });

  test('should get active agent IDs', () => {
    const { addAgent, getActiveAgentIds } = useActiveAgentsStore.getState();
    
    addAgent(mockAgent);
    
    const activeIds = getActiveAgentIds();
    expect(activeIds).toContain('test-agent');
    expect(activeIds.length).toBe(1);
  });
});