# Draggable Agents Design

## Overview
Transform hardcoded agents into draggable, searchable system with dynamic loading from agent library.

## Architecture

### Agent Data Structure
```typescript
interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  color: string;
  avatar: string;
  tags: string[];
  category: string;
}
```

### Core Components

#### 1. Agent Library Store (Zustand)
```typescript
interface AgentLibraryStore {
  agents: Agent[];
  searchTerm: string;
  filteredAgents: Agent[];
  loadAgents: () => void;
  searchAgents: (term: string) => void;
}
```

#### 2. Active Agents Store
```typescript
interface ActiveAgentsStore {
  activeAgents: Agent[];
  agentPositions: Record<string, {x: number, y: number}>;
  addAgent: (agent: Agent) => void;
  removeAgent: (agentId: string) => void;
  updatePosition: (agentId: string, position: {x: number, y: number}) => void;
}
```

### Implementation Plan

#### Phase 1: Make Current Agents Draggable
- Keep existing agent circle design/layout
- Add react-draggable to current agent circles
- Save positions to localStorage

#### Phase 2: Remove Hardcoded System
- Remove AGENTS constant from constants.tsx
- Create dynamic agent loading system
- Preserve current visual design

#### Phase 3: Agent Library
- Simple agent library UI
- Click agent → loads into available circle
- Basic search functionality

## Database Design

### Agent Database Options

#### Option 1: SQLite (Recommended)
```sql
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  systemInstruction TEXT NOT NULL,
  color TEXT NOT NULL,
  avatar TEXT NOT NULL,
  tags TEXT NOT NULL, -- JSON array as string
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Full-text search index for descriptions
CREATE VIRTUAL TABLE agents_fts USING fts5(
  name, role, description, tags, category,
  content='agents'
);
```

#### Option 2: JSON Files (Simple Start)
```
/data/agents/
  ├── agents.json (master list)
  ├── creative-writer.json
  ├── technical-expert.json
  └── ... (900+ agents)
```

### Search Implementation
```typescript
interface AgentSearchService {
  searchByText: (query: string) => Promise<Agent[]>;
  searchByCategory: (category: string) => Promise<Agent[]>;
  searchByTags: (tags: string[]) => Promise<Agent[]>;
  getAllAgents: () => Promise<Agent[]>;
}
```

## Data Models

### Agent File Format
```json
{
  "id": "creative-writer",
  "name": "Creative Writer",
  "role": "Content Creator",
  "description": "Specializes in creative writing and storytelling",
  "systemInstruction": "You are a creative writing expert...",
  "color": "#FF6B6B",
  "avatar": "✍️",
  "tags": ["writing", "creative", "storytelling"],
  "category": "Creative Content"
}
```

## Error Handling
- Graceful fallback if agent fails to load
- Default agent positions if localStorage corrupted
- Search performance optimization for 900+ agents

## Testing Strategy
- Unit tests for drag/drop functionality
- Integration tests for agent loading
- Performance tests for large agent library search