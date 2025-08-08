import React, { useState } from 'react';
import { useMemoryStore } from '../stores/memoryStore';

/**
 * Simple component to display memory store statistics
 * This demonstrates that the memory store is working correctly
 */
const MemoryStats: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const addMemoryItem = useMemoryStore(state => state.addMemoryItem);
  const tasks = useMemoryStore(state => state.tasks);
  const goals = useMemoryStore(state => state.goals);
  const decisions = useMemoryStore(state => state.decisions);
  const insights = useMemoryStore(state => state.insights);
  const projects = useMemoryStore(state => state.projects);
  
  // Calculate stats from the reactive state
  const stats = {
    totalItems: tasks.length + goals.length + decisions.length + insights.length + projects.length,
    itemsByType: {
      task: tasks.length,
      goal: goals.length,
      decision: decisions.length,
      insight: insights.length,
      project: projects.length,
    },
  };

  const handleAddSampleTask = () => {
    console.log('Adding sample task...');
    try {
      addMemoryItem('task', {
        type: 'task',
        title: `Sample Task ${Date.now()}`,
        content: 'This is a sample task created to test the memory store',
        metadata: {
          source: 'user',
          relatedItems: [],
          tags: ['sample'],
        },
        tags: ['sample', 'test'],
        priority: 'medium',
        status: 'active',
        assigneeId: 'user',
        dependencies: [],
        progress: 0,
      } as any);
      console.log('Sample task added successfully');
    } catch (error) {
      console.error('Error adding sample task:', error);
    }
  };

  const handleAddSampleGoal = () => {
    addMemoryItem('goal', {
      type: 'goal',
      title: `Sample Goal ${Date.now()}`,
      content: 'This is a sample goal created to test the memory store',
      metadata: {
        source: 'user',
        relatedItems: [],
        tags: ['sample'],
      },
      tags: ['sample', 'test'],
      priority: 'high',
      status: 'active',
      milestones: [],
      relatedTasks: [],
      successCriteria: ['Complete successfully'],
      progress: 0,
    } as any);
  };

  return (
    <div className="fixed top-4 left-4 bg-gray-800 text-white rounded-lg shadow-lg z-40 transition-all duration-300">
      {/* Collapsed state - just a small button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="text-sm font-bold">Memory</span>
          <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">{stats.totalItems}</span>
        </button>
      )}
      
      {/* Expanded state - full stats panel */}
      {isExpanded && (
        <div className="p-3 min-w-56 max-w-64">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">Memory Store Stats</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Total Items:</span>
              <span className="font-mono">{stats.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasks:</span>
              <span className="font-mono">{stats.itemsByType.task}</span>
            </div>
            <div className="flex justify-between">
              <span>Goals:</span>
              <span className="font-mono">{stats.itemsByType.goal}</span>
            </div>
            <div className="flex justify-between">
              <span>Decisions:</span>
              <span className="font-mono">{stats.itemsByType.decision}</span>
            </div>
            <div className="flex justify-between">
              <span>Insights:</span>
              <span className="font-mono">{stats.itemsByType.insight}</span>
            </div>
            <div className="flex justify-between">
              <span>Projects:</span>
              <span className="font-mono">{stats.itemsByType.project}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAddSampleTask}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Add Sample Task
            </button>
            <button
              onClick={handleAddSampleGoal}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Add Sample Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryStats;