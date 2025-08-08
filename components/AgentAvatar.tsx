
import React from 'react';
import { useDraggable } from '@neodrag/react';
import type { Agent, Task } from '../types';
import { CheckCircleIcon, CircleIcon } from './icons';

interface AgentAvatarProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  onDoubleClick: (agent: Agent) => void;
  isActive: boolean;
  isExpanded: boolean;
  tasks: Task[];
  style?: React.CSSProperties;
  onDrag?: (agentId: string, x: number, y: number) => void;
  position?: { x: number; y: number };
}

const AgentTask: React.FC<{ task: Task }> = ({ task }) => (
    <div className="bg-gray-900/50 p-3 rounded-lg flex items-center justify-between transition-all duration-300 hover:bg-gray-900 w-full">
      <div className="flex items-center">
        {task.status === 'done' ? <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" /> : <CircleIcon className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />}
        <div>
          <p className={`text-sm ${task.status === 'done' ? 'line-through text-gray-500' : 'text-gray-200'}`}>{task.title}</p>
        </div>
      </div>
    </div>
);

const AgentAvatar: React.FC<AgentAvatarProps> = ({ agent, onClick, onDoubleClick, isActive, isExpanded, tasks, style, onDrag, position }) => {
  const [isDragging, setIsDragging] = React.useState(false);
  
  const dragRef = React.useRef<HTMLDivElement>(null);
  
  useDraggable(dragRef, {
    position: position || { x: 0, y: 0 },
    disabled: isExpanded,
    bounds: 'parent',
    onDragStart: () => {
      if (isExpanded) return;
      setIsDragging(true);
    },
    onDrag: ({ offsetX, offsetY }) => {
      if (onDrag) {
        onDrag(agent.id, offsetX, offsetY);
      }
    },
    onDragEnd: ({ offsetX, offsetY }) => {
      setIsDragging(false);
      if (onDrag) {
        onDrag(agent.id, offsetX, offsetY);
      }
    }
  });
  
  const baseClasses = "rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ease-in-out transform group z-20";
  const sizeClasses = isExpanded ? "w-[400px] h-auto max-h-[500px] py-6 px-4 rounded-2xl" : "w-24 h-24 md:w-28 md:h-28";
  const bgClasses = isDragging ? "bg-gray-700 shadow-2xl" : "bg-gray-800 hover:bg-gray-700";
  const activeClasses = isActive ? "border-4 shadow-lg" : "border-2 border-gray-600";
  
  const dynamicStyle = (isActive || isExpanded || isDragging) ? {
    borderColor: agent.color,
    boxShadow: isDragging 
      ? `0 0 2rem ${agent.color}cc, 0 8px 32px rgba(0,0,0,0.3)` 
      : `0 0 1.5rem ${agent.color}80`,
  } : {};
  
  const iconColor = (isActive || isExpanded) ? agent.color : '#9CA3AF'; // gray-400

  const handleContainerClick = (e: React.MouseEvent) => {
    // Stop propagation if expanded to prevent engaging the agent when clicking inside the card
    if (isExpanded) {
        e.stopPropagation();
        return;
    }
    onClick(agent);
  };
  
  return (
    <div
      ref={dragRef}
      style={{ 
        ...style, 
        ...dynamicStyle, 
        '--agent-color': agent.color,
        cursor: isDragging ? 'grabbing' : (isExpanded ? 'default' : 'grab')
      } as unknown as React.CSSProperties}
      className={`${baseClasses} ${sizeClasses} ${activeClasses} ${bgClasses} hover:border-[var(--agent-color)]`}
      onClick={handleContainerClick}
      onDoubleClick={() => onDoubleClick(agent)}
    >
      {isExpanded ? (
        <div className="flex flex-col items-center w-full h-full overflow-hidden">
          <div className="flex-shrink-0 flex flex-col items-center justify-center mb-4">
            <div style={{ color: iconColor }} className="mb-2">
              {React.cloneElement(agent.avatar, { className: "w-8 h-8" })}
            </div>
            <span className="text-lg font-bold" style={{ color: agent.color }}>{agent.name}</span>
            <span className="text-xs text-gray-400 px-1 text-center">{agent.role}</span>
          </div>

          <div className="flex-grow w-full overflow-y-auto px-4 space-y-4 text-left">
            <div>
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">System Instructions</h3>
              <p className="text-xs text-gray-300 bg-gray-900/70 p-3 rounded-md border border-gray-700 whitespace-pre-wrap font-mono">
                {agent.systemInstruction}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Assigned Tasks ({tasks.length})</h3>
              <div className="space-y-2">
                {tasks.length > 0 ? (
                  tasks.map(task => <AgentTask key={task.id} task={task} />)
                ) : (
                  <p className="text-gray-500 italic text-sm">No tasks assigned.</p>
                )}
              </div>
            </div>
          </div>
          
           <button onClick={() => onDoubleClick(agent)} className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors">
                &times;
           </button>
        </div>
      ) : (
        <>
          <div style={{ color: iconColor }} className="text-gray-400 group-hover:text-[var(--agent-color)] transition-colors duration-300 mb-1">
            {agent.avatar}
          </div>
          <span className="text-sm font-bold text-gray-200">{agent.name}</span>
          <span className="text-xs text-gray-400 px-1 text-center">{agent.role}</span>
        </>
      )}
    </div>
  );
};

export default AgentAvatar;
