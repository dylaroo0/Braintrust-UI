// Simple test to verify memory store functionality
import { useMemoryStore } from './memoryStore';

// Test the memory store functionality
export const testMemoryStore = () => {
  console.log('Testing Memory Store...');
  
  // Get the store instance
  const store = useMemoryStore.getState();
  
  // Test adding a task
  store.addMemoryItem('task', {
    type: 'task',
    title: 'Test Task',
    content: 'This is a test task',
    metadata: {
      source: 'test',
      relatedItems: [],
      tags: ['test'],
    },
    tags: ['test', 'memory'],
    priority: 'medium',
    status: 'active',
    assigneeId: 'user-1',
    dependencies: [],
    progress: 0,
  } as any);
  
  // Test adding a goal
  store.addMemoryItem('goal', {
    type: 'goal',
    title: 'Test Goal',
    content: 'This is a test goal',
    metadata: {
      source: 'test',
      relatedItems: [],
      tags: ['test'],
    },
    tags: ['test', 'goal'],
    priority: 'high',
    status: 'active',
    milestones: [],
    relatedTasks: [],
    successCriteria: ['Complete all tasks'],
    progress: 0,
  } as any);
  
  // Test adding a decision
  store.addMemoryItem('decision', {
    type: 'decision',
    title: 'Test Decision',
    content: 'This is a test decision',
    metadata: {
      source: 'test',
      relatedItems: [],
      tags: ['test'],
    },
    tags: ['test', 'decision'],
    priority: 'medium',
    status: 'active',
    context: 'Testing memory store',
    alternatives: [],
    reasoning: 'For testing purposes',
    impactedItems: [],
  } as any);
  
  // Test getting memory stats
  const stats = store.getMemoryStats();
  console.log('Memory Stats:', stats);
  
  // Test search functionality
  const searchResults = store.searchMemory('test');
  console.log('Search Results for "test":', searchResults.length);
  
  // Test getting items by type
  const tasks = store.getMemoryItemsByType('task');
  const goals = store.getMemoryItemsByType('goal');
  const decisions = store.getMemoryItemsByType('decision');
  
  console.log('Tasks:', tasks.length);
  console.log('Goals:', goals.length);
  console.log('Decisions:', decisions.length);
  
  console.log('Memory Store test completed successfully!');
  
  return {
    stats,
    searchResults: searchResults.length,
    tasks: tasks.length,
    goals: goals.length,
    decisions: decisions.length,
  };
};