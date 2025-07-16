
import React, { useMemo } from 'react';
import type { Agent, Task } from '../types';
import { CheckCircleIcon, CircleIcon } from './icons';

interface OrganizerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  agents: Agent[];
  tasks: Task[];
  brief: string;
}

const OrganizerPanel: React.FC<OrganizerPanelProps> = ({ isOpen, onClose, agents, tasks, brief }) => {
  const groupedTasks = useMemo(() => {
    return agents.reduce((acc, currentAgent) => {
      const agentSpecificTasks = tasks.filter(task => task.assigneeId === currentAgent.id);
      // Even if agent has no tasks, we might want to show them in the panel. Let's list all agents.
      acc[currentAgent.id] = { agent: currentAgent, tasks: agentSpecificTasks };
      return acc;
    }, {} as Record<string, { agent: Agent, tasks: Task[] }>);
  }, [agents, tasks]);
  
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
        <div className="p-6 overflow-y-auto space-y-8 flex-grow">
            <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Project Brief</h3>
                <p className="text-sm text-gray-300 bg-gray-900/70 p-4 rounded-md border border-gray-700 whitespace-pre-wrap font-mono">
                    {brief}
                </p>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Master Task List</h3>
                <div className="space-y-6">
                 {Object.values(groupedTasks).map(({ agent: groupAgent, tasks: groupTasks }) => (
                    <div key={groupAgent.id}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border" style={{ borderColor: groupAgent.color, color: groupAgent.color }}>
                                {React.cloneElement(groupAgent.avatar, { className: "w-5 h-5" })}
                            </div>
                            <h3 className="text-lg font-semibold" style={{ color: groupAgent.color }}>{groupAgent.name}</h3>
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-gray-700/50 ml-4">
                            {groupTasks.length > 0 ? groupTasks.map(renderTask) : <p className="text-gray-500 italic text-sm pb-2">No tasks assigned.</p>}
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerPanel;
