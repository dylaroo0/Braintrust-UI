# Project Structure

## Root Directory Layout
```
BrainTrust_circle-main/
├── components/          # React UI components
├── services/           # API services and business logic
├── stores/             # Zustand state management
├── hooks/              # Custom React hooks
├── docs/               # Documentation
├── web-bundles/        # Build artifacts
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── types.ts            # TypeScript type definitions
├── constants.tsx       # Application constants and config
├── server.js           # Express server
├── vite.config.ts      # Vite build configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
└── netlify.toml        # Deployment configuration
```

## Component Architecture
- **App.tsx**: Main application orchestrator with agent circle layout
- **components/**: Reusable UI components organized by feature
  - `AgentAvatar.tsx` - Individual agent representations
  - `ChatFeed.tsx` - Central conversation interface
  - `TaskSidebar.tsx` - Project hub and task management
  - `OrganizerPanel.tsx` - Admin assistant interface
  - `icons.tsx` - SVG icon components

## Service Layer
- **services/**: Business logic and external integrations
  - `geminiService.ts` - Google Gemini API integration
  - `conversationProcessor.ts` - Chat analysis and summarization
  - `summaryService.ts` - Memory and summary management
  - `bmadService.ts` - BMAD method integration

## State Management
- **stores/**: Zustand stores for global state
  - `memoryStore.ts` - Conversation history and project memory
  - `index.ts` - Store exports and configuration

## Type System
- **types.ts**: Comprehensive type definitions for:
  - Agent interfaces and configurations
  - Message and conversation types
  - Memory system types (tasks, goals, decisions, insights)
  - Project management interfaces

## Constants and Configuration
- **constants.tsx**: Agent definitions with system instructions
- **vite.config.ts**: Build configuration with environment variables
- **tsconfig.json**: TypeScript compiler options

## Key Architectural Patterns

### Agent System
- Each agent has unique ID, role, avatar, system instruction, and color
- Agents are defined in `constants.tsx` with specialized roles:
  - Designer: UI/UX and visual design
  - Developer: Full-stack development
  - Engineer: Systems and infrastructure
  - Organizer: Project management and coordination

### Memory System
- Persistent conversation history with project context
- Structured memory types: tasks, goals, decisions, insights
- Search and analytics capabilities
- Project-based organization

### UI Layout
- Radial agent arrangement around central chat
- Draggable and resizable chat interface
- Collapsible sidebar for project management
- Modal panels for detailed interactions

## File Naming Conventions
- Components: PascalCase (e.g., `AgentAvatar.tsx`)
- Services: camelCase (e.g., `geminiService.ts`)
- Types: Descriptive interfaces (e.g., `Agent`, `Message`)
- Constants: UPPER_SNAKE_CASE for values, PascalCase for objects