
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AGENTS, INITIAL_TASKS, INITIAL_BRIEF, ORGANIZER_AGENT } from './constants';
import { OrganizerIcon } from './components/icons';
import type { Agent, Message, Task } from './types';
import { getAgentResponse } from './services/geminiService';
import TaskSidebar from './components/TaskSidebar';
import ChatFeed from './components/ChatFeed';
import AgentAvatar from './components/AgentAvatar';
import OrganizerPanel from './components/OrganizerPanel';
import AgentLibraryPanel from './components/AgentLibraryPanel';

import { useMemoryInitialization } from './hooks/useMemoryInitialization';
import { useMemoryStore } from './stores/memoryStore';
import { useActiveAgentsStore } from './stores/activeAgentsStore';

const App: React.FC = () => {
  console.log('🚀 App component starting to render...');
  
  // Initialize memory store
  useMemoryInitialization();
  
  // Memory store for conversation recording
  const addMessage = useMemoryStore(state => state.addMessage);
  const getConversationHistory = useMemoryStore(state => state.getConversationHistory);
  const getCurrentProject = useMemoryStore(state => state.getCurrentProject);
  
  // Active agents store for position management
  const { updatePosition, getPosition, addAgent, activeAgents } = useActiveAgentsStore();
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [brief, setBrief] = useState<string>(INITIAL_BRIEF);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get messages for current project only
  const currentProject = getCurrentProject();
  const messages = getConversationHistory(currentProject?.id);

  // New state for inline expansion and organizer panel
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [isOrganizerPanelOpen, setIsOrganizerPanelOpen] = useState<boolean>(false);
  const [isProjectHubOpen, setIsProjectHubOpen] = useState<boolean>(true);
  const [isAgentLibraryOpen, setIsAgentLibraryOpen] = useState<boolean>(false);

  const allAgents = useMemo(() => [ORGANIZER_AGENT], []);
  const circleAgents: Agent[] = []; // No core agents in the circle

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

  const getAgentDefaultPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = 0.38; // 38% as decimal
    const centerX = window.innerWidth * 0.625; // Center of the main area
    const centerY = window.innerHeight * 0.5;
    const radiusPixels = Math.min(window.innerWidth, window.innerHeight) * radius;
    
    const x = centerX + radiusPixels * Math.cos(angle);
    const y = centerY + radiusPixels * Math.sin(angle);
    
    return { x, y };
  };

  // Initialize agents in the store on first load
  useEffect(() => {
    circleAgents.forEach((agent, index) => {
      const defaultPosition = getAgentDefaultPosition(index, circleAgents.length);
      addAgent(agent, defaultPosition);
    });
    
    // NOTE: Organizer is rendered separately in fixed position, not added to activeAgents store
    // This prevents React component serialization issues with localStorage
  }, []); // Empty dependency array since we only want this to run once on mount

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

    // Get current project for message context
    const getCurrentProject = useMemoryStore.getState().getCurrentProject;
    const currentProject = getCurrentProject();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: prompt,
      sender: 'user',
      agent: agent,
      timestamp: new Date(),
      projectId: currentProject?.id
    };
    
    // Record user message in memory system with project context
    addMessage({
      text: prompt,
      sender: 'user',
      agent: agent,
      projectId: currentProject?.id
    });
    
    setIsLoading(true);

    try {
      const agentResponseText = await getAgentResponse(prompt, agent, [...messages, userMessage]);
      
      // Record agent response in memory system
      addMessage({
        text: agentResponseText,
        sender: agent.id,
        agent: agent,
        projectId: currentProject?.id
      });
    } catch (error) {
      console.error("Failed to get agent response:", error);
      // Record error message in memory system
      addMessage({
        text: "I seem to be having trouble connecting. Please try again later.",
        sender: agent.id,
        agent: agent,
        projectId: currentProject?.id
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentPosition = (agent: Agent, index: number, total: number) => {
    const savedPosition = getPosition(agent.id);
    if (savedPosition) {
      return savedPosition;
    }
    return getAgentDefaultPosition(index, total);
  };

  const handleAgentDrag = (agentId: string, x: number, y: number) => {
    // Update position in store - this will automatically save to localStorage
    updatePosition(agentId, { x, y });
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

  console.log('📊 App state:', { 
    isProjectHubOpen, 
    isAgentLibraryOpen, 
    activeAgents: activeAgents.length,
    allAgents: allAgents.length 
  });

  try {
    return (
      <div className="flex h-screen w-screen bg-gray-900 text-gray-100 overflow-hidden">
      {isProjectHubOpen && (
        <TaskSidebar 
          tasks={tasks} 
          setTasks={setTasks} 
          brief={brief} 
          setBrief={setBrief} 
          agents={allAgents}
          onClose={() => setIsProjectHubOpen(false)}
        />
      )}
      
      {/* Project Hub Toggle Button - when closed */}
      {!isProjectHubOpen && (
        <button
          onClick={() => setIsProjectHubOpen(true)}
          className="fixed top-4 left-4 bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-lg shadow-lg z-40 transition-colors"
        >
          <span className="text-sm font-bold">Project Hub</span>
        </button>
      )}

      {/* Agent Library Toggle Button */}
      <button
        onClick={() => setIsAgentLibraryOpen(true)}
        className="fixed top-4 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg shadow-lg z-40 transition-colors"
        style={{ 
          left: isProjectHubOpen ? '350px' : '190px' // Better spacing to avoid overlap
        }}
      >
        <span className="text-sm font-bold">🔍 Agent Library</span>
      </button>
      
      <main className="flex-1 flex items-center justify-center relative p-4">
        <div className="absolute inset-0 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        {/* Agent Circle - Now shows all active agents except organizer (rendered separately) */}
        <div className="absolute w-full h-full">
          {activeAgents.filter(agent => agent.id !== ORGANIZER_AGENT.id).map((agentInCircle, index) => {
            return (
              <AgentAvatar
                key={agentInCircle.id}
                agent={agentInCircle}
                onClick={handleEngageAgent}
                onDoubleClick={handleAgentDoubleClick}
                isActive={activeAgent?.id === agentInCircle.id}
                isExpanded={expandedAgentId === agentInCircle.id}
                tasks={tasks.filter(t => t.assigneeId === agentInCircle.id)}
                position={agentInCircle.position}
                onDrag={handleAgentDrag}
                style={{
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
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

        {/* Organizer Agent - Fixed position for now */}
        <div 
          className="fixed bottom-8 right-8 z-20"
          style={{ 
            width: '80px', 
            height: '80px',
          }}
        >
          <div
            onClick={() => handleEngageAgent(ORGANIZER_AGENT)}
            onDoubleClick={() => handleAgentDoubleClick(ORGANIZER_AGENT)}
            className={`w-full h-full rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
              activeAgent?.id === ORGANIZER_AGENT.id 
                ? 'ring-4 ring-purple-400 ring-opacity-60' 
                : ''
            }`}
            style={{ 
              backgroundColor: ORGANIZER_AGENT.color,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <div className="text-2xl flex items-center justify-center">
              <OrganizerIcon />
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs font-medium text-white">{ORGANIZER_AGENT.name}</div>
            <div className="text-xs text-gray-300">{ORGANIZER_AGENT.role}</div>
          </div>
        </div>
        
        {/* Organizer Panel */}
        <OrganizerPanel
            isOpen={isOrganizerPanelOpen}
            onClose={() => setIsOrganizerPanelOpen(false)}
            agents={allAgents}
            tasks={tasks}
            brief={brief}
            setTasks={setTasks}
        />

        {/* Agent Library Panel */}
        <AgentLibraryPanel
            isOpen={isAgentLibraryOpen}
            onClose={() => setIsAgentLibraryOpen(false)}
        />

      </main>
    </div>
  );
  } catch (error) {
    console.error('💥 App render error:', error);
    return (
      <div className="flex h-screen w-screen bg-red-900 text-white items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">App Error</h1>
          <p className="text-red-200">Check console for details</p>
          <p className="text-sm mt-2 text-red-300">{error.toString()}</p>
        </div>
      </div>
    );
  }
};

export default App;
