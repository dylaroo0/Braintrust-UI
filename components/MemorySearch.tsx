import React, { useState, useMemo } from 'react';
import { useMemoryStore } from '../stores/memoryStore';
import type { SearchOptions, SearchResult } from '../types';

interface MemorySearchProps {
  className?: string;
}

const MemorySearch: React.FC<MemorySearchProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({});
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const searchAll = useMemoryStore(state => state.searchAll);
  const getCurrentProject = useMemoryStore(state => state.getCurrentProject);
  const getAllProjects = useMemoryStore(state => state.getAllProjects);
  
  const currentProject = getCurrentProject();
  const allProjects = getAllProjects();
  
  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchAll(searchQuery, searchOptions);
  }, [searchQuery, searchOptions, searchAll]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is performed automatically via useMemo
  };
  
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'task': return '📋';
      case 'goal': return '🎯';
      case 'decision': return '⚖️';
      case 'insight': return '💡';
      case 'project': return '📁';
      case 'conversation': return '💬';
      case 'summary': return '📝';
      default: return '📄';
    }
  };
  
  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'task': return 'text-blue-400';
      case 'goal': return 'text-green-400';
      case 'decision': return 'text-purple-400';
      case 'insight': return 'text-yellow-400';
      case 'project': return 'text-indigo-400';
      case 'conversation': return 'text-orange-400';
      case 'summary': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      {/* Search Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🔍 Memory Search</h3>
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isAdvancedOpen ? 'Simple' : 'Advanced'}
        </button>
      </div>
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all memory types..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded p-2 text-sm text-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
          >
            Search
          </button>
        </div>
        
        {/* Advanced Filters */}
        {isAdvancedOpen && (
          <div className="bg-gray-700/30 p-3 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Project Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Project</label>
                <select
                  value={searchOptions.projectId || ''}
                  onChange={(e) => setSearchOptions(prev => ({ 
                    ...prev, 
                    projectId: e.target.value || undefined 
                  }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs text-gray-300"
                >
                  <option value="">All Projects</option>
                  <option value={currentProject?.id || ''}>Current Project</option>
                  {allProjects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Type</label>
                <select
                  value={searchOptions.types?.[0] || ''}
                  onChange={(e) => setSearchOptions(prev => ({ 
                    ...prev, 
                    types: e.target.value ? [e.target.value as any] : undefined 
                  }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs text-gray-300"
                >
                  <option value="">All Types</option>
                  <option value="task">📋 Tasks</option>
                  <option value="goal">🎯 Goals</option>
                  <option value="decision">⚖️ Decisions</option>
                  <option value="insight">💡 Insights</option>
                  <option value="project">📁 Projects</option>
                </select>
              </div>
            </div>
            
            {/* Priority and Status Filters */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Priority</label>
                <select
                  value={searchOptions.priority?.[0] || ''}
                  onChange={(e) => setSearchOptions(prev => ({ 
                    ...prev, 
                    priority: e.target.value ? [e.target.value as any] : undefined 
                  }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs text-gray-300"
                >
                  <option value="">Any Priority</option>
                  <option value="critical">🔥 Critical</option>
                  <option value="high">⚡ High</option>
                  <option value="medium">📋 Medium</option>
                  <option value="low">📝 Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
                <select
                  value={searchOptions.status?.[0] || ''}
                  onChange={(e) => setSearchOptions(prev => ({ 
                    ...prev, 
                    status: e.target.value ? [e.target.value as any] : undefined 
                  }))}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs text-gray-300"
                >
                  <option value="">Any Status</option>
                  <option value="active">🟢 Active</option>
                  <option value="completed">✅ Completed</option>
                  <option value="archived">📦 Archived</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
      
      {/* Search Results */}
      {searchResults && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-400">
              {searchResults.totalCount} results in {searchResults.searchTime}ms
            </div>
            {searchResults.suggestions.length > 0 && (
              <div className="flex gap-1">
                <span className="text-xs text-gray-500">Try:</span>
                {searchResults.suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {searchResults.results.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.results.map(result => (
                <div key={result.id} className="bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">{getResultIcon(result.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium text-sm ${getResultColor(result.type)}`}>
                          {result.title}
                        </h4>
                        <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                          {result.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          Score: {result.relevanceScore}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-300 mb-2 line-clamp-2">
                        {result.content.substring(0, 120)}...
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                        {result.projectId && (
                          <span>• {allProjects.find(p => p.id === result.projectId)?.name || 'Unknown Project'}</span>
                        )}
                        {result.metadata?.priority && (
                          <span>• {result.metadata.priority} priority</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">No results found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try different keywords or adjust your filters</p>
            </div>
          )}
        </div>
      )}
      
      {/* Quick Search Suggestions */}
      {!searchQuery && (
        <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Quick Searches:</h4>
          <div className="flex flex-wrap gap-2">
            {['engineering', 'design', 'priority', 'goals', 'decisions', 'tasks'].map(term => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="text-xs bg-gray-600 hover:bg-gray-500 text-gray-300 px-2 py-1 rounded transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemorySearch;