# Data Models and Schema Changes

## New Data Models

### Agent Model

**Purpose:** Define flexible agent configurations with customization capabilities  
**Integration:** Extends existing agent system, replaces hardcoded AGENTS constant

**Key Attributes:**

- id: string - Unique identifier for agent
- name: string - Display name for agent
- role: string - Agent's specialized role
- description: string - Detailed agent description
- systemInstruction: string - AI system prompt
- color: string - Visual theme color
- avatar: string - Display icon/emoji
- specializedSkills: string[] - List of agent capabilities
- category: string - Agent category for organization
- tags: string[] - Searchable tags
- isTemplate: boolean - Whether agent is a template
- knowledgeFiles: File[] - Uploaded knowledge documents
- customImage: string | null - Custom avatar image
- createdBy: string - Creator identifier

**Relationships:**

- **With Existing:** Integrates with current Agent interface, maintains compatibility with chat system
- **With New:** Related to ProjectTemplate, WorkflowStage models

### ProjectTemplate Model

**Purpose:** Pre-configured project setups with agent teams and workflows  
**Integration:** New system for project creation, integrates with existing project management

**Key Attributes:**

- id: string - Unique template identifier
- name: string - Template display name
- description: string - Template description
- category: string - Template category (Creative, Business, Technical, etc.)
- defaultAgents: Agent[] - Pre-selected agent team
- theme: ProjectTheme - Visual customization
- welcomeMessage: string - Initial project message
- feedHeadline: string - Custom chat feed headline
- suggestedWorkflow: Workflow - Recommended workflow
- isPublic: boolean - Community sharing flag
- createdBy: string - Template creator
- usageCount: number - Usage statistics
- rating: number - Community rating

**Relationships:**

- **With Existing:** Integrates with current project creation system
- **With New:** Contains Agent and Workflow references

### Workflow Model

**Purpose:** Structured process management with circular navigation  
**Integration:** New workflow system, integrates with existing Organizer functionality

**Key Attributes:**

- id: string - Workflow identifier
- name: string - Workflow name
- type: 'bmad' | 'creative-writing' | 'marketing' | 'custom' - Workflow category
- stages: WorkflowStage[] - Ordered workflow stages
- isCircular: boolean - Whether workflow loops back to start
- stageColors: Record<string, string> - Color coding for stages
- stageAbbreviations: Record<string, string> - Short labels (PLAN, ARCH, etc.)

**Relationships:**

- **With Existing:** Integrates with Organizer panel and memory system
- **With New:** Contains WorkflowStage references, used by ProjectTemplate

### WorkflowStage Model

**Purpose:** Individual stages within workflows that influence the single shared chat feed  
**Integration:** Integrates with existing single chat feed system, provides context for agent responses

**Key Attributes:**

- id: string - Stage identifier
- name: string - Stage display name
- abbreviation: string - Short label for circular UI (PLAN, ARCH, STORY, DEV, REV)
- color: string - Stage color coding for circular navigation
- stageContext: string - Context provided to agents when this stage is active
- suggestedAgents: string[] - Recommended agents for this stage
- stagePrompts: string[] - Suggested conversation starters for this stage

**Relationships:**

- **With Existing:** Influences the single existing chat feed with stage-aware context
- **With New:** Part of Workflow, provides context to Agent responses in shared feed

### UITheme Model

**Purpose:** User interface customization and theming system  
**Integration:** Extends existing UI system with customizable themes and color palettes

**Key Attributes:**

- id: string - Theme identifier
- name: string - Theme display name
- primaryColor: string - Main theme color
- secondaryColor: string - Accent color
- backgroundColor: string - Background color
- textColor: string - Primary text color
- panelColor: string - Panel background color
- borderColor: string - Border and divider color
- agentColors: Record<string, string> - Custom colors for different agent types
- isDefault: boolean - Whether this is a default theme
- isCustom: boolean - Whether this is user-created
- createdBy: string - Theme creator

**Relationships:**

- **With Existing:** Applies to all existing UI components and panels
- **With New:** Used by ProjectTemplate for project-specific themes

## Comprehensive Store Architecture

### Core Data Stores

- **memoryStore.ts** - Existing comprehensive memory system (tasks, goals, decisions, insights, projects, conversations, summaries)
- **agentStore.ts** - Agent library, custom agents, agent configurations, agent performance metrics
- **workflowStore.ts** - Workflow definitions, current workflow state, stage progress, workflow history
- **templateStore.ts** - Project templates, agent templates, community templates, template usage stats
- **projectStore.ts** - Current project state, project settings, project metadata, project history

### User Experience Stores

- **chatStore.ts** - Chat state, message history, active conversations, conversation context
- **themeStore.ts** - UI themes, color palettes, user customizations, theme preferences
- **userStore.ts** - User preferences, settings, authentication state, user profile
- **uiStore.ts** - Panel states, modals, loading states, UI interactions, layout preferences

### Content & File Management Stores

- **fileStore.ts** - Uploaded files, file metadata, file processing status, file history
- **sandboxStore.ts** - Code execution history, sandbox sessions, execution results, code snippets
- **searchStore.ts** - Search history, filters, search preferences, search results cache

### Integration & External Stores

- **apiStore.ts** - API configurations, keys, provider settings, rate limits, API health
- **extensionStore.ts** - Browser extension state, external AI connections, integration status
- **communityStore.ts** - Shared templates, ratings, community content, sharing preferences
- **desktopStore.ts** - Desktop-specific settings, local LLM configurations, offline capabilities

### System & Performance Stores

- **notificationStore.ts** - System notifications, alerts, status messages, notification preferences
- **analyticsStore.ts** - Usage analytics, performance metrics, user behavior, system health
- **cacheStore.ts** - Cached data, temporary storage, performance optimization, cache management
- **syncStore.ts** - Data synchronization, backup status, cloud sync, data integrity

## Schema Integration Strategy

**Database Changes Required:**

- **New Tables:** None (using Zustand local storage with persistence)
- **Modified Tables:** Extend existing memoryStore, add 18 new specialized stores
- **New Indexes:** None required for local storage
- **Migration Strategy:** Gradual store addition with backward compatibility

**Store Relationships:**

- **memoryStore** ↔ **projectStore** - Project-specific memory isolation
- **agentStore** ↔ **templateStore** - Agent templates and configurations
- **workflowStore** ↔ **chatStore** - Workflow-aware conversation context
- **fileStore** ↔ **sandboxStore** - Code file execution and results
- **themeStore** ↔ **uiStore** - Theme application and UI state
- **apiStore** ↔ **extensionStore** - External service integration
- **communityStore** ↔ **templateStore** - Community template sharing

**Backward Compatibility:**

- Existing memoryStore structure preserved completely
- New stores added alongside existing ones
- Existing conversation history and projects remain intact
- Current agent system maintained until replacement is complete