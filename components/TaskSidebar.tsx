
import React, { useState } from 'react';
import type { Agent, Task } from '../types';
import { AGENTS } from '../constants';
import { PlusIcon, CheckCircleIcon, CircleIcon } from './icons';

interface TaskSidebarProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  brief: string;
  setBrief: React.Dispatch<React.SetStateAction<string>>;
  agents: Agent[];
  onClose: () => void;
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ tasks, setTasks, brief, setBrief, agents, onClose }) => {
  
  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'done' ? 'todo' : 'done' }
        : task
    ));
  };
  
  const getAgentName = (agentId: string) => AGENTS.find(a => a.id === agentId)?.name || 'Unassigned';

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 bg-gray-800/50 backdrop-blur-sm p-4 flex flex-col h-full border-r border-gray-700">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-xl font-bold text-cyan-400">Project Hub</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Project Brief</h3>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="w-full h-40 bg-gray-900/70 border border-gray-700 rounded-md p-2 text-sm text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="text-center text-gray-500 mt-8">
          <p className="text-sm">Task management moved to</p>
          <p className="text-sm font-semibold text-purple-400">Admin Assistant → Command Center</p>
          <p className="text-xs mt-2">Double-click the Admin Assistant to manage tasks</p>
        </div>
      </div>


    </aside>
  );
};

export default TaskSidebar;
