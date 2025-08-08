import React, { useState, useMemo, useEffect } from 'react';
import { useActiveAgentsStore } from '../stores/activeAgentsStore';
import CollaborationService from '../services/collaborationService';
import { getAllAgents } from '../utils/loadAgents';
import type { Agent } from '../types';

interface AgentLibraryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgentLibraryCardProps {
  agent: Agent;
  onAddToCircle: (agent: Agent) => void;
  collaborationData?: {
    oftenPairedWith: string[];
    teamSuccessRate: number;
    usageCount: number;
  };
}

const AgentLibraryCard: React.FC<AgentLibraryCardProps> = ({ 
  agent, 
  onAddToCircle, 
  collaborationData 
}) => {
  return (
    <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-white text-sm">{agent.name}</h4>
          <p className="text-xs text-gray-400 mt-1">{agent.role}</p>
        </div>
        <div className="text-xl ml-2">
          {typeof agent.avatar === 'string' ? agent.avatar : '🤖'}
        </div>
      </div>
      
      {/* Agent Description */}
      <div className="text-xs text-gray-300 mb-3 line-clamp-2">
        {agent.systemInstruction.substring(0, 120)}...
      </div>
      
      {/* Collaboration Stats */}
      {collaborationData && (
        <div className="bg-gray-900/50 p-2 rounded mb-3">
          <div className="text-xs text-gray-400 mb-1">
            Team Chemistry: {collaborationData.teamSuccessRate}% success rate
          </div>
          {collaborationData.oftenPairedWith.length > 0 && (
            <div className="text-xs text-gray-400">
              Often paired with: {collaborationData.oftenPairedWith.slice(0, 2).join(', ')}
              {collaborationData.oftenPairedWith.length > 2 && '...'}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Used {collaborationData.usageCount} times
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAddToCircle(agent)}
          className="flex-1 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors"
        >
          + Add to Circle
        </button>
        <button
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded transition-colors"
          title="Preview agent details"
        >
          👁️
        </button>
      </div>
    </div>
  );
};

const AgentLibraryPanel: React.FC<AgentLibraryPanelProps> = ({ isOpen, onClose }) => {
  // Active agents store for adding agents to circle
  const { addAgent: addToActiveAgents } = useActiveAgentsStore();

  // Load all available agents
  const [allLoadedAgents, setAllLoadedAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);

  // Load agents on component mount
  useEffect(() => {
    const loadAllAgents = async () => {
      console.log('📚 AgentLibraryPanel: Starting to load agents...');
      setIsLoadingAgents(true);
      try {
        const agents = await getAllAgents();
        console.log('📚 AgentLibraryPanel: Loaded agents:', agents.length);
        setAllLoadedAgents(agents);
      } catch (error) {
        console.error('📚 AgentLibraryPanel: Error loading agents:', error);
        setError('Failed to load agents');
      } finally {
        setIsLoadingAgents(false);
      }
    };

    loadAllAgents();
  }, []);

  // Local state for search and filters (replacing agentLibraryStore)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter agents based on search and category
  const filteredAgents = useMemo(() => {
    let filtered = allLoadedAgents;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.name.toLowerCase().includes(searchLower) ||
        agent.role.toLowerCase().includes(searchLower) ||
        agent.systemInstruction.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(agent => 
        agent.role.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    return filtered;
  }, [allLoadedAgents, searchTerm, selectedCategory]);

  // Categories based on agent roles
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allLoadedAgents.forEach(agent => {
      const roleWords = agent.role.split(' ');
      cats.add(roleWords[0]);
    });
    return Array.from(cats).sort();
  }, [allLoadedAgents]);

  // Local state for sorting and pagination
  const [sortBy, setSortBy] = useState<'category' | 'name-asc' | 'name-desc' | 'recent' | 'popular' | 'collaborative'>('category');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get collaboration service instance
  const collaborationService = CollaborationService.getInstance();
  
  // Real collaboration data from service
  const collaborationData = useMemo(() => {
    const data: Record<string, {
      oftenPairedWith: string[];
      teamSuccessRate: number;
      usageCount: number;
    }> = {};
    
    filteredAgents.forEach((agent) => {
      const agentData = collaborationService.getAgentCollaborationData(agent.id);
      if (agentData) {
        data[agent.id] = {
          oftenPairedWith: agentData.oftenPairedWith,
          teamSuccessRate: agentData.teamSuccessRate,
          usageCount: agentData.usageCount,
        };
      } else {
        // Default data for new agents
        data[agent.id] = {
          oftenPairedWith: [],
          teamSuccessRate: 80,
          usageCount: 0,
        };
      }
    });
    
    return data;
  }, [filteredAgents, collaborationService]);

  // Sort agents based on selected option
  const sortedAgents = useMemo(() => {
    let sorted = [...filteredAgents];
    
    switch (sortBy) {
      case 'category':
        sorted.sort((a, b) => {
          // Extract category from role or use name as fallback
          const categoryA = a.role.split(' ')[0];
          const categoryB = b.role.split(' ')[0];
          return categoryA.localeCompare(categoryB);
        });
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'collaborative':
        sorted.sort((a, b) => 
          (collaborationData[b.id]?.usageCount || 0) - (collaborationData[a.id]?.usageCount || 0)
        );
        break;
      case 'popular':
      case 'recent':
      default:
        // Keep default order for now
        break;
    }
    
    return sorted;
  }, [filteredAgents, sortBy, collaborationData]);

  // Paginate sorted agents
  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAgents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAgents.length / itemsPerPage);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle adding agent to active circle
  const handleAddToCircle = (agent: Agent) => {
    console.log('🎯 Adding agent to circle:', agent.name);
    
    // Track agent usage
    collaborationService.trackAgentUsage(agent.id, agent.role.split(' ')[0]);
    
    // Add agent to a random position near the circle
    const angle = Math.random() * 2 * Math.PI;
    const radius = 300 + Math.random() * 100; // Random position around the circle
    const centerX = window.innerWidth * 0.625;
    const centerY = window.innerHeight * 0.5;
    
    const position = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
    
    // Ensure avatar is serializable for localStorage
    const serializableAgent: Agent = {
      ...agent,
      avatar: typeof agent.avatar === 'string' ? agent.avatar : '🤖'
    };
    
    console.log('🎯 Agent position:', position);
    addToActiveAgents(serializableAgent, position);
    
    // Close the panel after adding
    onClose();
  };

  // Suggest team based on current selection
  const handleSuggestTeam = () => {
    // This would implement team suggestion logic
    alert('Team suggestion feature coming soon!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-start z-50">
      <div className="bg-gray-900 w-96 h-full overflow-hidden flex flex-col border-r border-gray-600">
        {/* Header */}
        <div className="p-4 border-b border-gray-600 bg-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Agent Library</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${allLoadedAgents.length} specialized agents...`}
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <div className="absolute right-2 top-2 text-gray-500">
              🔍
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="p-4 border-b border-gray-700 bg-gray-850">
          <div className="flex gap-2 mb-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white"
            >
              <option value="category">Sort by Category</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="popular">Most Popular</option>
              <option value="collaborative">Most Collaborative</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
          
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
            >
              {showAdvanced ? 'Hide' : 'Show'} Filters
            </button>
            <button
              onClick={handleSuggestTeam}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded transition-colors"
            >
              🤝 Suggest Team
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-2">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            {sortedAgents.length} agents found • Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingAgents ? (
            <div className="text-center text-gray-400 py-8">
              Loading agents...
              <div className="text-xs mt-2">
                Loaded: {allLoadedAgents.length} agents
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">
              Error: {error}
            </div>
          ) : paginatedAgents.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No agents found</p>
              <p className="text-xs mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedAgents.map(agent => (
                <AgentLibraryCard
                  key={agent.id}
                  agent={agent}
                  onAddToCircle={handleAddToCircle}
                  collaborationData={collaborationData[agent.id]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 bg-gray-850">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 px-3 py-1 rounded transition-colors"
              >
                ← Previous
              </button>
              <span className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 px-3 py-1 rounded transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentLibraryPanel;