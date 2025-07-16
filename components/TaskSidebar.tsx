
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
}

const TaskSidebar: React.FC<TaskSidebarProps> = ({ tasks, setTasks, brief, setBrief, agents }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(agents[0]?.id || '');

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
      <h2 className="text-xl font-bold mb-4 text-cyan-400 border-b border-gray-700 pb-2">Project Hub</h2>
      
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">Project Brief</h3>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="w-full h-40 bg-gray-900/70 border border-gray-700 rounded-md p-2 text-sm text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
        />
      </div>

      <div className="flex-grow overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">Tasks</h3>
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between transition-all duration-300">
                <div className="flex items-center">
                    <button onClick={() => toggleTaskStatus(task.id)} className="mr-3 flex-shrink-0">
                        {task.status === 'done' ? <CheckCircleIcon className="w-6 h-6 text-green-400" /> : <CircleIcon className="w-6 h-6 text-gray-400" />}
                    </button>
                    <div>
                        <p className={`text-sm ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.title}</p>
                        <p className="text-xs text-cyan-400 bg-cyan-900/50 px-2 py-0.5 rounded-full inline-block mt-1">{getAgentName(task.assigneeId)}</p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mt-4 pt-4 border-t border-gray-700 flex-shrink-0">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 mb-2 text-sm text-gray-300 focus:ring-cyan-500"
        />
        <div className="flex items-center space-x-2">
            <select
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              className="flex-grow bg-gray-900 border border-gray-700 rounded-md p-2 text-sm text-gray-300 focus:ring-cyan-500"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-2 rounded-md transition-colors flex items-center justify-center">
              <PlusIcon />
            </button>
        </div>
      </form>
    </aside>
  );
};

export default TaskSidebar;
