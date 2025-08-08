
import React, { useMemo, useState } from 'react';
import type { Agent, Task } from '../types';
import { CheckCircleIcon, CircleIcon } from './icons';
import { useMemoryStore } from '../stores/memoryStore';
import Calendar from './Calendar';
import MemorySearch from './MemorySearch';

interface OrganizerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  tasks: Task[];
  brief: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const OrganizerPanel: React.FC<OrganizerPanelProps> = ({ isOpen, onClose, agents, tasks, brief, setTasks }) => {
  // Collapsible section states
  const [expandedSections, setExpandedSections] = useState({
    brief: false,
    memory: true,
    tasks: false,
    calendar: false,
    summaries: false,
    search: false,
  });

  // Task creation state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(agents[0]?.id || '');

  // Goal creation state
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalContent, setNewGoalContent] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);

  // Project creation state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Memory store hooks
  const addMemoryItem = useMemoryStore(state => state.addMemoryItem);
  const memoryTasks = useMemoryStore(state => state.tasks);
  const memoryGoals = useMemoryStore(state => state.goals);
  const memoryDecisions = useMemoryStore(state => state.decisions);
  const memoryInsights = useMemoryStore(state => state.insights);
  const memoryProjects = useMemoryStore(state => state.projects);
  const conversations = useMemoryStore(state => state.conversations);
  
  // Project management hooks
  const createProject = useMemoryStore(state => state.createProject);
  const switchProject = useMemoryStore(state => state.switchProject);
  const getCurrentProject = useMemoryStore(state => state.getCurrentProject);
  const getAllProjects = useMemoryStore(state => state.getAllProjects);
  
  // Saved summaries hooks
  const getSavedSummaries = useMemoryStore(state => state.getSavedSummaries);
  const deleteSavedSummary = useMemoryStore(state => state.deleteSavedSummary);
  
  const currentProject = getCurrentProject();
  const allProjects = getAllProjects();
  const savedSummaries = getSavedSummaries(currentProject?.id);

  const memoryStats = {
    totalItems: memoryTasks.length + memoryGoals.length + memoryDecisions.length + memoryInsights.length + memoryProjects.length,
    itemsByType: {
      task: memoryTasks.length,
      goal: memoryGoals.length,
      decision: memoryDecisions.length,
      insight: memoryInsights.length,
      project: memoryProjects.length,
    },
  };

  const groupedTasks = useMemo(() => {
    return agents.reduce((acc, currentAgent) => {
      const agentSpecificTasks = tasks.filter(task => task.assigneeId === currentAgent.id);
      acc[currentAgent.id] = { agent: currentAgent, tasks: agentSpecificTasks };
      return acc;
    }, {} as Record<string, { agent: Agent, tasks: Task[] }>);
  }, [agents, tasks]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskAssignee) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      assigneeId: newTaskAssignee,
      status: 'todo',
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskTitle('');
  };
  
  const renderTask = (task: Task) => (
    <div key={task.id} className="bg-gray-800 p-3 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-gray-700/80">
      <div className="flex items-center">
        {task.status === 'done' ? <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" /> : <CircleIcon className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0" />}
        <div>
          <p className={`text-sm ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.title}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-800/80 backdrop-blur-lg border-l border-gray-700 transition-transform duration-500 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: 'clamp(400px, 30vw, 500px)' }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/50 flex-shrink-0">
          <h2 className="text-2xl font-bold text-purple-400">Command Center</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700">
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-grow">
          
          {/* Project Management Section */}
          <div className="border border-indigo-600 rounded-lg bg-indigo-900/20">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-indigo-400">Project Management</h3>
                <button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {showProjectForm ? 'Cancel' : '+ New Project'}
                </button>
              </div>

              {/* Current Project Display */}
              {currentProject ? (
                <div className="bg-indigo-800/30 p-3 rounded-lg mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-indigo-300">Currently Working On:</h4>
                      <p className="text-indigo-200">{currentProject.name}</p>
                      <p className="text-xs text-indigo-400">{currentProject.description}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 p-3 rounded-lg mb-3 text-center">
                  <p className="text-gray-400 text-sm">No project selected</p>
                  <p className="text-xs text-gray-500">Create or select a project to get started</p>
                </div>
              )}

              {/* Project Creation Form */}
              {showProjectForm && (
                <div className="bg-gray-700/30 p-3 rounded-lg mb-3">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2">Create New Project</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newProjectName.trim()) return;
                    createProject(newProjectName, newProjectDescription);
                    setNewProjectName('');
                    setNewProjectDescription('');
                    setShowProjectForm(false);
                  }} className="space-y-2">
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Project name..."
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    <textarea
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      placeholder="Project description (optional)..."
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 h-20 resize-none"
                    />
                    <div className="flex gap-2">
                      <button 
                        type="submit" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Create Project
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowProjectForm(false)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Project List */}
              {allProjects.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2">All Projects ({allProjects.length})</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {allProjects.map(project => (
                      <div 
                        key={project.id} 
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          currentProject?.id === project.id 
                            ? 'bg-indigo-700/50 border border-indigo-500' 
                            : 'bg-gray-800/50 hover:bg-gray-700/50'
                        }`}
                        onClick={() => switchProject(project.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-indigo-200">{project.name}</p>
                            <p className="text-xs text-gray-400 truncate">{project.description}</p>
                          </div>
                          {currentProject?.id === project.id && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Memory System Section */}
          <div className="border border-gray-600 rounded-lg">
            <button
              onClick={() => toggleSection('memory')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-purple-400">Memory System</h3>
                <span className="bg-purple-600 text-xs px-2 py-1 rounded-full">{memoryStats.totalItems}</span>
              </div>
              <span className="text-gray-400">{expandedSections.memory ? '−' : '+'}</span>
            </button>
            
            {expandedSections.memory && (
              <div className="p-3 border-t border-gray-600 space-y-3">
                {/* Memory Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between bg-gray-700/30 p-2 rounded">
                    <span>Tasks:</span>
                    <span className="font-mono">{memoryStats.itemsByType.task}</span>
                  </div>
                  <div className="flex justify-between bg-gray-700/30 p-2 rounded">
                    <span>Goals:</span>
                    <span className="font-mono">{memoryStats.itemsByType.goal}</span>
                  </div>
                  <div className="flex justify-between bg-gray-700/30 p-2 rounded">
                    <span>Decisions:</span>
                    <span className="font-mono">{memoryStats.itemsByType.decision}</span>
                  </div>
                  <div className="flex justify-between bg-gray-700/30 p-2 rounded">
                    <span>Insights:</span>
                    <span className="font-mono">{memoryStats.itemsByType.insight}</span>
                  </div>
                </div>
                
                {/* Conversation History Display */}
                {conversations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-orange-400 mb-2">Recent Conversations ({conversations.length})</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {conversations.slice(-5).map(msg => (
                        <div key={msg.id} className="text-xs bg-gray-800/50 p-2 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-orange-300">
                              {msg.sender === 'user' ? 'You' : msg.agent.name}
                            </span>
                            <span className="text-gray-500">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-gray-400 truncate">{msg.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Memory Items Display */}
                {memoryGoals.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2">Recent Goals</h4>
                    <div className="space-y-1">
                      {memoryGoals.slice(-3).map(goal => (
                        <div key={goal.id} className="text-xs bg-gray-800/50 p-2 rounded">
                          <div className="font-medium text-green-300">{goal.title}</div>
                          <div className="text-gray-400 truncate">{goal.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {memoryTasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2">Recent Memory Tasks</h4>
                    <div className="space-y-1">
                      {memoryTasks.slice(-3).map(task => (
                        <div key={task.id} className="text-xs bg-gray-800/50 p-2 rounded">
                          <div className="font-medium text-blue-300">{task.title}</div>
                          <div className="text-gray-400 truncate">{task.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Priority Actions Based on Organizer Input */}
                <div className="bg-yellow-900/30 border border-yellow-600/50 p-3 rounded-lg mb-3">
                  <h4 className="text-sm font-semibold text-yellow-300 mb-2">🎯 Organizer's Strategic Priorities</h4>
                  <button
                    onClick={() => addMemoryItem('goal', {
                      type: 'goal',
                      title: 'Implement Core Admin Assistant Features',
                      content: 'Build the 5 foundational pillars: Goals & Priorities confirmation, Priority To-Do Lists, Memory/Context system, Summarizer functionality, and Projects Organizer with multi-project oversight.',
                      metadata: { source: 'organizer-conversation', relatedItems: [], tags: ['strategic', 'core-features'] },
                      tags: ['strategic', 'admin-assistant', 'core-features'], 
                      priority: 'critical', 
                      status: 'active',
                      milestones: [
                        { id: '1', title: 'Goals & Priorities System', targetDate: new Date(), completed: false },
                        { id: '2', title: 'Priority To-Do Generator', targetDate: new Date(), completed: false },
                        { id: '3', title: 'Context Memory Integration', targetDate: new Date(), completed: false },
                        { id: '4', title: 'Conversation Summarizer', targetDate: new Date(), completed: false },
                        { id: '5', title: 'Multi-Project Organizer', targetDate: new Date(), completed: false }
                      ], 
                      relatedTasks: [], 
                      successCriteria: [
                        'Admin can confirm and track goals through conversation',
                        'Priority to-do lists are automatically generated',
                        'Context from memory files feeds into decisions',
                        'Conversations are summarized with key takeaways',
                        'Multiple projects can be managed with oversight'
                      ], 
                      progress: 20
                    } as any)}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-sm transition-colors font-medium"
                  >
                    🎯 Set Strategic Goal: Core Admin Features
                  </button>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addMemoryItem('task', {
                      type: 'task',
                      title: `Priority Task: ${Date.now()}`,
                      content: 'High-priority task identified from conversation',
                      metadata: { source: 'organizer', relatedItems: [], tags: ['priority'] },
                      tags: ['priority'], priority: 'high', status: 'active',
                      assigneeId: 'admin', dependencies: [], progress: 0,
                    } as any)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    + Priority Task
                  </button>
                  <button
                    onClick={() => addMemoryItem('decision', {
                      type: 'decision',
                      title: `Decision: ${Date.now()}`,
                      content: 'Important decision made in conversation',
                      metadata: { source: 'organizer', relatedItems: [], tags: ['decision'] },
                      tags: ['decision'], priority: 'medium', status: 'active',
                      context: 'Organizer conversation', alternatives: [], reasoning: 'Based on strategic discussion', impactedItems: [],
                    } as any)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-colors"
                  >
                    + Decision
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Calendar Section */}
          <div className="border border-gray-600 rounded-lg">
            <button
              onClick={() => toggleSection('calendar')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-emerald-400">📅 Project Calendar</h3>
                <span className="bg-emerald-600 text-xs px-2 py-1 rounded-full">
                  {memoryGoals.filter(g => g.targetDate).length + memoryTasks.filter(t => t.dueDate).length}
                </span>
              </div>
              <span className="text-gray-400">{expandedSections.calendar ? '−' : '+'}</span>
            </button>
            
            {expandedSections.calendar && (
              <div className="p-3 border-t border-gray-600">
                <Calendar className="w-full" />
              </div>
            )}
          </div>

          {/* Memory Search Section */}
          <div className="border border-gray-600 rounded-lg">
            <button
              onClick={() => toggleSection('search')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-blue-400">🔍 Memory Search</h3>
                <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">Search</span>
              </div>
              <span className="text-gray-400">{expandedSections.search ? '−' : '+'}</span>
            </button>
            
            {expandedSections.search && (
              <div className="p-3 border-t border-gray-600">
                <MemorySearch className="w-full" />
              </div>
            )}
          </div>

          {/* Saved Summaries Section */}
          <div className="border border-gray-600 rounded-lg">
            <button
              onClick={() => toggleSection('summaries')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-amber-400">📁 Saved Summaries</h3>
                <span className="bg-amber-600 text-xs px-2 py-1 rounded-full">{savedSummaries.length}</span>
              </div>
              <span className="text-gray-400">{expandedSections.summaries ? '−' : '+'}</span>
            </button>
            
            {expandedSections.summaries && (
              <div className="p-3 border-t border-gray-600 space-y-3">
                {savedSummaries.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {savedSummaries.map(summary => (
                      <div key={summary.id} className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-amber-300 text-sm">{summary.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                summary.type === 'priority-list' ? 'bg-red-600/20 text-red-300' :
                                summary.type === 'engineering-plan' ? 'bg-blue-600/20 text-blue-300' :
                                summary.type === 'design-plan' ? 'bg-purple-600/20 text-purple-300' :
                                summary.type === 'management-plan' ? 'bg-green-600/20 text-green-300' :
                                summary.type === 'decisions' ? 'bg-orange-600/20 text-orange-300' :
                                summary.type === 'goals' ? 'bg-yellow-600/20 text-yellow-300' :
                                'bg-gray-600/20 text-gray-300'
                              }`}>
                                {summary.type.replace('-', ' ')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(summary.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${summary.title}"? This action cannot be undone.`)) {
                                deleteSavedSummary(summary.id);
                              }
                            }}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            title="Delete summary"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        <div className="text-xs text-gray-400 mb-2">
                          {summary.metadata.messageCount} messages • {summary.metadata.participantCount} participants
                          {summary.metadata.actionItemsCount > 0 && ` • ${summary.metadata.actionItemsCount} action items`}
                          {summary.metadata.decisionsCount > 0 && ` • ${summary.metadata.decisionsCount} decisions`}
                        </div>
                        
                        {summary.metadata.keyTopics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {summary.metadata.keyTopics.slice(0, 3).map(topic => (
                              <span key={topic} className="text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded">
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-300 line-clamp-2">
                          {summary.content.substring(0, 150)}...
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(summary.content);
                              // You could add a toast notification here
                            }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                          >
                            📋 Copy
                          </button>
                          <button
                            onClick={() => {
                              // Open in a modal or expand inline
                              alert(summary.content); // Temporary - you could make this a proper modal
                            }}
                            className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded transition-colors"
                          >
                            👁️ View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">No saved summaries yet</p>
                    <p className="text-xs mt-1">Ask the organizer to process conversations, then say "save that"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Project Brief Section */}
          <div className="border border-gray-600 rounded-lg">
            <button
              onClick={() => toggleSection('brief')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-cyan-400">Project Brief</h3>
              <span className="text-gray-400">{expandedSections.brief ? '−' : '+'}</span>
            </button>
            
            {expandedSections.brief && (
              <div className="p-3 border-t border-gray-600">
                <p className="text-sm text-gray-300 bg-gray-900/70 p-3 rounded-md border border-gray-700 whitespace-pre-wrap font-mono">
                  {brief}
                </p>
              </div>
            )}
          </div>

          {/* Master Task List Section */}
          <div className="border border-gray-600 rounded-lg">
            <button
              onClick={() => toggleSection('tasks')}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-cyan-400">Master Task List</h3>
                <span className="bg-cyan-600 text-xs px-2 py-1 rounded-full">{tasks.length}</span>
              </div>
              <span className="text-gray-400">{expandedSections.tasks ? '−' : '+'}</span>
            </button>
            
            {expandedSections.tasks && (
              <div className="p-3 border-t border-gray-600 space-y-4">
                {/* Task Creation Form */}
                <div className="bg-gray-700/30 p-3 rounded-lg">
                  <h4 className="text-sm font-semibold text-cyan-300 mb-2">Assign New Task</h4>
                  <form onSubmit={handleAddTask} className="space-y-2">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Task description..."
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newTaskAssignee}
                        onChange={(e) => setNewTaskAssignee(e.target.value)}
                        className="flex-1 bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 focus:ring-cyan-500"
                      >
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                      </select>
                      <button 
                        type="submit" 
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Assign
                      </button>
                    </div>
                  </form>
                </div>

                {/* Task Lists by Agent */}
                {Object.values(groupedTasks).map(({ agent: groupAgent, tasks: groupTasks }) => (
                  <div key={groupAgent.id}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center border" style={{ borderColor: groupAgent.color, color: groupAgent.color }}>
                        {React.cloneElement(groupAgent.avatar, { className: "w-4 h-4" })}
                      </div>
                      <h4 className="text-sm font-semibold" style={{ color: groupAgent.color }}>{groupAgent.name}</h4>
                    </div>
                    <div className="space-y-1 pl-4 border-l-2 border-gray-700/50 ml-3">
                      {groupTasks.length > 0 ? groupTasks.map(renderTask) : <p className="text-gray-500 italic text-xs pb-1">No tasks assigned.</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPanel;
