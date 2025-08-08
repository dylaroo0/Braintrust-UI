# BrainTrust Circle: Consolidated Project Analysis

## Project Overview

**BrainTrust Circle** is a React/TypeScript multi-agent AI workspace that's undergoing a major brownfield enhancement to transform from a hardcoded 3-agent system into a flexible, extensible platform with 900+ specialized agents.

## Current System State

### Technology Stack
- **Frontend**: React 19.1.0, TypeScript 5.7.2, Vite 6.2.0
- **State Management**: Zustand 5.0.6 with persistence
- **AI Integration**: Google Gemini API (@google/genai 1.9.0)
- **Backend**: Express 5.1.0, WebSocket (ws 8.18.3)
- **Deployment**: Netlify (frontend), Node.js (backend)

### Existing Architecture (3-Panel Layout)
1. **Left Panel (Project Hub)** - Currently basic project management
2. **Central Workspace** - Radial agent circle around chat feed
3. **Right Panel (Organizer Panel)** - Memory system, calendar, analytics

### Current Capabilities (Well-Established)
- **Comprehensive Memory System**: 7 data types (tasks, goals, decisions, insights, projects, conversations, summaries)
- **Smart Calendar**: Auto-populated from memory data with interactive timeline
- **Advanced Search**: Multi-criteria filtering with relevance scoring
- **Analytics Dashboard**: Activity trends, completion rates, project breakdown
- **Real-time Communication**: WebSocket-based agent interactions
- **Project Management**: Multi-project support with context preservation

### Current Limitations
- **Hardcoded Agents**: Only 3 agents (Designer, Developer, Engineer)
- **No Customization**: Cannot create or modify agents
- **Limited Workflows**: No structured process management
- **Single API**: Only Google Gemini integration
- **No Templates**: No project template system
- **No Community**: No sharing or discovery features

## Brownfield Enhancement Vision

### Core Transformation Goals
1. **Replace Hardcoded System** → Dynamic Agent Selection (900+ agents in 7 categories)
2. **Super Organizer** → BMad Master with full methodology integration
3. **Agent Builder** → Visual interface for custom agent creation
4. **Project Templates** → Pre-configured teams for different use cases
5. **Circular Workflows** → Interlocking arrow design with stage-specific feeds
6. **Community Sharing** → Agent and template marketplace
7. **Multi-API Support** → OpenRouter, local LLMs, external AI integration

### Enhanced Panel Architecture

#### Creator Hub (Left Panel) - Complete Redesign
**Core Project Creation:**
- New Project (blank slate with agent selection)
- From Template (browse project templates with pre-configured teams)
- Create Template (build custom project templates for sharing)
- Simple Chat (quick agent selection without full project setup)

**Agent Management:**
- Agent Library (browse/search 900+ specialized agents by category)
- Agent Builder (resizable card interface for creating custom agents)
- My Creations (user's custom agents and templates)
- Agent Templates (creative writer, technical expert, spiritual guru, etc.)

**Template System:**
- Template Library (browse by category: Creative, Business, Technical, Spiritual)
- Template Builder (create custom project templates)
- Community Templates (shared templates with ratings)

**Future Features:**
- Social Media Connections
- Community Marketplace
- Agent Sharing and Discovery

#### Central Workspace - Enhanced Functionality
**Existing Features (Preserved):**
- Radial agent arrangement around central chat
- Resizable chat feed
- Agent interaction (drag, move, double-click)
- Multi-project conversation history

**New Features:**
- **Dynamic Agent Loading** (replace hardcoded agents)
- **Multi-Feed Support** (workflow-specific feeds)
- **Stage-Specific Chat Feeds** (when using workflow mode)
- **Visual Content Display** (Mermaid diagrams, images)
- **External AI Integration** (ChatGPT, Grok, DeepSeek via browser extension)
- **Agent Editing Interface** (double-click → Edit button → Agent Builder)
- **Rich File Upload** (images, documents, code with sandbox execution)

#### Organizer Panel (Right Panel) - Enhanced Features
**Existing Features (Preserved):**
- Memory System (7 data types with persistence)
- Advanced Search (multi-criteria with relevance scoring)
- Project Calendar (auto-populated from memory data)
- Analytics Dashboard (activity trends, completion rates)
- Project Management (create/switch projects)
- Saved Summaries and Project Brief management

**New Features:**
- **Circular Workflow Navigator** (interlocking arrow design)
- **Workflow Management** (custom workflows for different project types)
- **Mermaid Diagram Display** (visual diagrams from agents)
- **Integration Status** (external API connections monitoring)
- **Agent Performance Tracking** (which agents are most helpful)
- **Timeline Visualization** (Gantt-style progress tracking)
- **Context Management** (maintains context across workflow stages)
- **BMad Methodology Integration** (when workflow mode is activated)

## Key System Components

### Super-Brain Organizer System
- **Permanent Presence**: Always available in every project (cannot be removed)
- **BMad Integration**: Contains all BMad processes, brainstorming techniques, elicitation methods
- **Orchestration Engine**: Routes conversations between agents, manages multi-agent workflows
- **Context Keeper**: Maintains all stage outputs and feeds context to each new stage
- **Timeline Management**: Comprehensive timeline across all workflow stages
- **Process Mode Switching**: Different thinking modes (brainstorming, analysis, coordination)

### Dynamic Agent System
- **Text-Based Storage**: Simple agent configurations (YAML/JSON) avoiding database complexity
- **Agent Builder**: Resizable card interface (like chat feed) for creating custom agents
- **Template System**: Pre-built agent templates for quick customization
- **Knowledge Integration**: Upload specific knowledge files/documents to enhance capabilities
- **Visual Customization**: Custom colors, avatars, patterns, images, titles
- **Community Sharing**: Export/import functionality for sharing custom agents

### Circular Workflow System
- **Interlocking Arrow Design**: Smooth, connecting arrow shapes in a circle
- **Stage-Specific Feeds**: Each workflow stage has its own dedicated chat feed
- **Color-Coded Stages**: PLAN (blue), ARCH (green), STORY (purple), DEV (orange), REV (red)
- **Non-Linear Navigation**: Users can move between stages while maintaining context
- **BMad Integration**: Optional workflow mode that Organizer can activate
- **Custom Workflows**: Beyond BMad - Creative Writing, Marketing Campaign, Research Project workflows

## Data Architecture

### Enhanced Store System (Zustand-based)
**Core Data Stores:**
- **memoryStore.ts** - Existing comprehensive memory system (preserved)
- **agentStore.ts** - Agent library, custom agents, configurations, performance metrics
- **workflowStore.ts** - Workflow definitions, current state, stage progress, history
- **templateStore.ts** - Project templates, agent templates, community templates, usage stats
- **projectStore.ts** - Current project state, settings, metadata, history

**User Experience Stores:**
- **chatStore.ts** - Chat state, message history, active conversations, context
- **themeStore.ts** - UI themes, color palettes, user customizations, preferences
- **userStore.ts** - User preferences, settings, authentication state, profile
- **uiStore.ts** - Panel states, modals, loading states, UI interactions, layout preferences

**Content & File Management Stores:**
- **fileStore.ts** - Uploaded files, metadata, processing status, history
- **sandboxStore.ts** - Code execution history, sandbox sessions, results, snippets
- **searchStore.ts** - Search history, filters, preferences, results cache

### Agent Configuration Models

**Text-Based Agent Configuration (Simple Approach):**
```json
{
  "id": "creative-writer",
  "name": "Creative Writer",
  "role": "Fiction & Storytelling Specialist",
  "description": "Expert in creative writing, character development, and narrative structure",
  "systemInstruction": "You are a professional creative writer...",
  "color": "#8B5CF6",
  "avatar": "✍️",
  "specializedSkills": ["Character Development", "Plot Structure", "Dialogue Writing"],
  "tags": ["writing", "creative", "fiction"],
  "category": "Creative",
  "isTemplate": true,
  "knowledgeFiles": [],
  "customImage": null
}
```

## Implementation Status

### Completed (Story 1.1)
- ✅ UI panel reorganization
- ✅ "Command Center" renamed to "Organizer Panel"
- ✅ "Project Brief" moved to Organizer Panel
- ✅ Basic UI structure improvements

### In Progress (Story 2.1)
- 🔄 Agent selection interface development
- 🔄 Modal component for agent selection
- 🔄 Integration with project creation flow

### Planned Implementation Strategy

**Phase 1: UI Foundation & Visual Structure (Weeks 1-2)**
1. Complete Creator Hub panel with comprehensive project creation options
2. Build Agent Builder as resizable card interface
3. Create project template selection with full customization
4. Build enhanced Organizer Panel sections

**Phase 2: Agent System Foundation (Weeks 3-4)**
5. Create agent data models and validation systems
6. Implement basic agent storage and dynamic loading
7. Connect Agent Builder to agent management system

**Phase 3: Enhanced Functionality (Weeks 5-6)**
8. Create workflow data models and execution engine
9. Build circular workflow navigator functionality
10. Implement BMad workflow integration

**Phase 4: Advanced Features (Weeks 7-8)**
11. Extend Organizer with orchestration capabilities
12. Implement multi-feed chat system
13. Build enhanced memory and timeline system

**Phase 5: Integration & Polish (Weeks 9-10)**
14. Implement multi-API support system
15. Add visual content support (Mermaid, images)
16. Build knowledge integration system
17. Implement sharing and community features

## Key Technical Decisions

### Architecture Principles
- **Preserve Existing Functionality**: All current memory, calendar, and analytics features maintained
- **Text-Based Configuration**: Simple YAML/JSON agent storage avoiding database complexity
- **Progressive Enhancement**: Build up from existing 3-panel layout
- **Service Layer Pattern**: Maintain existing API integration patterns
- **Component-Based Architecture**: Extend existing React component structure

### Integration Strategy
- **Backward Compatibility**: Existing projects and conversations preserved
- **Gradual Migration**: Replace hardcoded agents with dynamic system
- **API Extension**: Add OpenRouter support while maintaining Gemini
- **Store Extension**: Add new Zustand stores alongside existing memoryStore
- **UI Enhancement**: Enhance existing panels rather than complete redesign

## Critical Success Factors

### Must Preserve
- Comprehensive memory system (7 data types)
- Smart calendar with auto-population
- Advanced search and analytics
- Project management capabilities
- Real-time communication
- Existing conversation history

### Must Deliver
- Dynamic agent selection (900+ agents)
- Agent Builder with visual customization
- Project template system
- Circular workflow navigation
- BMad methodology integration
- Community sharing capabilities

### Technical Constraints
- Maintain React/TypeScript/Zustand architecture
- Preserve existing API patterns
- Keep text-based storage approach
- Ensure performance with large agent libraries
- Support progressive onboarding for new users

## Next Steps

Based on the current brownfield-full-stack spec requirements and existing documentation, the next logical step would be to proceed with the **Design Document** creation, as the requirements are comprehensive and well-defined.

The design document should focus on:
1. **Integration Strategy** - How new components integrate with existing architecture
2. **Component Architecture** - Detailed design of new UI components
3. **Data Flow** - How the enhanced store system will work
4. **API Design** - Extension of existing service layer
5. **Migration Strategy** - Safe transition from hardcoded to dynamic system

This consolidated analysis provides the foundation for creating a detailed design document that respects the existing system while enabling the ambitious transformation to a flexible multi-agent platform.