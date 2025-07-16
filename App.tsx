
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AGENTS, INITIAL_TASKS, INITIAL_BRIEF, ORGANIZER_AGENT } from './constants';
import type { Agent, Message, Task } from './types';
import { getAgentResponse } from './services/geminiService';
import TaskSidebar from './components/TaskSidebar';
import ChatFeed from './components/ChatFeed';
import AgentAvatar from './components/AgentAvatar';
import AdminAssistant from './components/AdminAssistant';
import OrganizerPanel from './components/OrganizerPanel';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [brief, setBrief] = useState<string>(INITIAL_BRIEF);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // New state for inline expansion and organizer panel
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [isOrganizerPanelOpen, setIsOrganizerPanelOpen] = useState<boolean>(false);

  const allAgents = useMemo(() => [...AGENTS, ORGANIZER_AGENT], []);
  const circleAgents = AGENTS;

  const initialWidth = 768;
  const initialHeight = Math.min(window.innerHeight * 0.85, 800);

  const [chatSize, setChatSize] = useState({ width: initialWidth, height: initialHeight });
  const [chatPosition, setChatPosition] = useState({
      x: (window.innerWidth * 0.625) - (initialWidth / 2),
      y: (window.innerHeight / 2) - (initialHeight / 2)
  });

  const interactionRef = useRef({
    isDragging: false,
    isResizing: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    initialWidth: 0,
    initialHeight: 0,
  });

  const handleEngageAgent = (agent: Agent) => {
    setActiveAgent(agent);
  };

  const handleAgentDoubleClick = (agent: Agent) => {
    if (agent.id === ORGANIZER_AGENT.id) {
      setIsOrganizerPanelOpen(prev => !prev);
      setExpandedAgentId(null); // Close any expanded agent
    } else {
      setExpandedAgentId(prevId => (prevId === agent.id ? null : agent.id));
      setIsOrganizerPanelOpen(false); // Close organizer panel
    }
  };

  const handleSendMessage = async (prompt: string, agent: Agent) => {
    if (!agent) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: prompt,
      sender: 'user',
      agent: agent
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const agentResponseText = await getAgentResponse(prompt, agent, [...messages, userMessage]);
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        text: agentResponseText,
        sender: agent.id,
        agent: agent
      };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Failed to get agent response:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I seem to be having trouble connecting. Please try again later.",
        sender: agent.id,
        agent: agent
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = '38%'; // Percentage of the container's width/height
    const x = `calc(50% + ${radius} * ${Math.cos(angle)})`;
    const y = `calc(50% + ${radius} * ${Math.sin(angle)})`;
    return {
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
    };
  };

  const handleDragMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const ref = interactionRef.current;
    ref.isDragging = true;
    ref.isResizing = false;
    ref.startX = e.clientX;
    ref.startY = e.clientY;
    ref.initialX = chatPosition.x;
    ref.initialY = chatPosition.y;
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const ref = interactionRef.current;
    ref.isResizing = true;
    ref.isDragging = false;
    ref.startX = e.clientX;
    ref.startY = e.clientY;
    ref.initialWidth = chatSize.width;
    ref.initialHeight = chatSize.height;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const ref = interactionRef.current;
      if (!ref.isDragging && !ref.isResizing) return;

      if (ref.isDragging) {
        const dx = e.clientX - ref.startX;
        const dy = e.clientY - ref.startY;
        setChatPosition({ x: ref.initialX + dx, y: ref.initialY + dy });
      }

      if (ref.isResizing) {
        const dw = e.clientX - ref.startX;
        const dh = e.clientY - ref.startY;
        const newWidth = Math.max(400, ref.initialWidth + dw);
        const newHeight = Math.max(300, ref.initialHeight + dh);
        setChatSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      interactionRef.current.isDragging = false;
      interactionRef.current.isResizing = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
      <TaskSidebar tasks={tasks} setTasks={setTasks} brief={brief} setBrief={setBrief} agents={allAgents} />
      
      <main className="flex-1 flex items-center justify-center relative p-4">
        <div className="absolute inset-0 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        {/* Agent Circle */}
        <div className="absolute w-full h-full">
          {circleAgents.map((agent, index) => (
            <AgentAvatar
              key={agent.id}
              agent={agent}
              onClick={handleEngageAgent}
              onDoubleClick={handleAgentDoubleClick}
              isActive={activeAgent?.id === agent.id}
              isExpanded={expandedAgentId === agent.id}
              tasks={tasks.filter(t => t.assigneeId === agent.id)}
              style={getAgentPosition(index, circleAgents.length)}
            />
          ))}
        </div>

        {/* Central Chat Feed */}
        <ChatFeed 
          messages={messages} 
          activeAgent={activeAgent} 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          position={chatPosition}
          size={chatSize}
          onDragMouseDown={handleDragMouseDown}
          onResizeMouseDown={handleResizeMouseDown}
        />

        {/* Admin Assistant */}
        <AdminAssistant 
          agent={ORGANIZER_AGENT} 
          onClick={handleEngageAgent} 
          onDoubleClick={handleAgentDoubleClick}
          isActive={activeAgent?.id === ORGANIZER_AGENT.id} 
        />
        
        {/* Organizer Panel */}
        <OrganizerPanel
            isOpen={isOrganizerPanelOpen}
            onClose={() => setIsOrganizerPanelOpen(false)}
            agents={allAgents}
            tasks={tasks}
            brief={brief}
        />
      </main>
    </div>
  );
};

export default App;
