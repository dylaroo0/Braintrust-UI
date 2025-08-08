
import React from 'react';
import type { Agent } from '../types';

interface AdminAssistantProps {
  agent: Agent;
  onClick: (agent: Agent) => void;
  onDoubleClick: (agent: Agent) => void;
  isActive: boolean;
}

const AdminAssistant: React.FC<AdminAssistantProps> = ({ agent, onClick, onDoubleClick, isActive }) => {
  const baseClasses = "w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 bg-gray-800 hover:bg-gray-700 group";
  const activeClasses = isActive ? "border-4 shadow-lg" : "border-2 border-gray-600";
  
  const dynamicStyle = isActive ? {
    borderColor: agent.color,
    boxShadow: `0 0 1rem ${agent.color}80`,
  } : {};
  
  const iconColor = isActive ? agent.color : '#9CA3AF';

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <div
        style={{ ...dynamicStyle, '--agent-color': agent.color } as unknown as React.CSSProperties}
        className={`${baseClasses} ${activeClasses} hover:border-[var(--agent-color)]`}
        onClick={() => onClick(agent)}
        onDoubleClick={() => onDoubleClick(agent)}
      >
        <div style={{ color: iconColor }} className="text-gray-400 group-hover:text-[var(--agent-color)] transition-colors duration-300 mb-1 scale-110">
            {React.isValidElement(agent.avatar) 
              ? agent.avatar 
              : <span className="text-2xl">{agent.avatar}</span>
            }
        </div>
        <span className="text-sm font-bold text-gray-200">{agent.name}</span>
        <span className="text-xs text-gray-400 px-1 text-center">{agent.role}</span>
      </div>
    </div>
  );
};

export default AdminAssistant;
