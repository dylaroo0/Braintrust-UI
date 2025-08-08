---
original_created: 2025-08-05
last_updated: 2025-08-05
version: 1.0
status: approved
---

# Braintrust Circle Flexible Agent System - Design Document

## Overview

This design document outlines the technical architecture for transforming Braintrust Circle from a hardcoded 3-agent system into a flexible, extensible multi-agent platform with dynamic agent selection, workflow management, and comprehensive customization capabilities.

**Core Architecture Philosophy:**

- **Organizer as "Super Brain"**: The Organizer contains all deep methodological intelligence (BMad processes, brainstorming techniques, elicitation methods, checklists)
- **Specialists as Domain Filters**: Simple, focused agents that provide domain-specific perspectives without complex processes
- **Process vs. Perspective**: Organizer handles HOW to think, Specialists handle WHAT to consider from their domain

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Braintrust Circle Platform                   │
├─────────────────┬─────────────────────┬─────────────────────────┤
│   Creator Hub   │   Central Workspace │    Organizer Panel     │
│   (Left Panel)  │   (Radial UI +      │    (Right Panel)       │
│                 │    Chat Feed)       │                        │
├─────────────────┼─────────────────────┼─────────────────────────┤
│ • Agent Library │ • Dynamic Agent     │ • Memory System        │
│ • Agent Builder │   Circle            │ • Workflow Navigator   │
│ • Templates     │ • Resizable Chat    │ • Project Management   │
│ • Project Setup │ • Multi-Feed        │ • Timeline Tracking    │
│ • Community     │   Support           │ • Context Management   │
└─────────────────┴─────────────────────┴─────────────────────────┘
```

### Core System Components

#### 1. Super-Brain Organizer System

- **Methodological Intelligence**: All BMad processes, brainstorming techniques (20 methods), elicitation methods (advanced)
- **Process Mode Switching**: Can activate different thinking modes (brainstorming, deep exploration, collaborative, structural analysis)
- **Orchestration Engine**: Manages multi-agent workflows and context preservation
- **Meta-Cognitive Abilities**: Self-aware process selection and optimization

#### 2. Lightweight Specialist System

- **Domain Perspective Filters**: Simple agents focused on single-domain viewpoints
- **Minimal Configuration**: Just perspective, key questions, and domain expertise
- **Dynamic Loading**: Easy creation and modification of specialist perspectives
- **Template-Based**: Simple YAML configurations for specialist definitions

#### 3. Enhanced Workflow Management

- **Organizer-Driven Workflows**: All complex processes managed by the Super-Brain Organizer
- **Stage-Specific Intelligence**: Organizer adapts its mode based on workflow stage
- **Context Orchestration**: Organizer maintains and distributes context to specialists
- **Process Integration**: BMad methodology deeply integrated into Organizer capabilities

## Components and Interfaces

### Frontend Components

#### Core UI Components

```typescript
// Main Application Shell
<App>
  <CreatorHub />           // Left panel - project creation, agent management
  <CentralWorkspace>       // Main area - radial UI + chat
    <AgentCircle />        // Dynamic agent positioning
    <ChatFeedManager />    // Multi-feed support with stage awareness
    <WorkflowNavigator />  // Circular workflow stage navigation
  </CentralWorkspace>
  <OrganizerPanel />       // Right panel - memory, timeline, context
</App>
```

#### New/Enhanced Components

**AgentBuilder Component**

```typescript
interface AgentBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  editingAgent?: Agent;
  onSave: (agent: Agent) => void;
}

// Features:
// - Resizable card interface (like ChatFeed)
// - Template selection
// - Custom image/color/pattern upload
// - Knowledge file upload
// - System instruction editor
// - Preview functionality
```

**WorkflowNavigator Component**

```typescript
interface WorkflowNavigatorProps {
  workflow: Workflow;
  currentStage: string;
  onStageChange: (stageId: string) => void;
}

// Features:
// - Circular interlocking arrow design
// - Color-coded stages with abbreviations
// - Progress indication
// - Stage-specific agent loading
// - Context handoff management
```

**ProjectTemplateSelector Component**

```typescript
interface ProjectTemplateSelectorProps {
  templates: ProjectTemplate[];
  onSelect: (template: ProjectTemplate) => void;
  onCreateNew: () => void;
}

// Features:
// - Template preview
// - Agent roster display
// - Workflow visualization
// - Customization options
// - Progressive setup wizard
```

### Backend Services

#### Super-Brain Organizer Service

```typescript
interface OrganizerService {
  // Process Mode Management
  activateMode(mode: ProcessMode): Promise<void>;
  getAvailableModes(): Promise<ProcessMode[]>;
  switchMode(fromMode: string, toMode: string): Promise<void>;
  
  // Methodological Intelligence
  executeBrainstormingTechnique(technique: string, context: any): Promise<BrainstormingResult>;
  runElicitationMethod(method: string, target: any): Promise<ElicitationResult>;
  executeChecklist(checklist: string, project: any): Promise<ChecklistResult>;
  
  // Orchestration
  coordinateSpecialists(specialists: Specialist[], task: any): Promise<CoordinationResult>;
  manageWorkflowStage(stage: string, context: any): Promise<StageResult>;
  preserveContext(context: any): Promise<void>;
  
  // Advanced Capabilities
  initializeMetaGPT?(): Promise<MetaGPTInstance>;
  createSandbox?(): Promise<SandboxEnvironment>;
}

interface SpecialistService {
  // Simple Specialist Management
  loadSpecialistLibrary(): Promise<Specialist[]>;
  saveSpecialist(specialist: Specialist): Promise<void>;
  createFromTemplate(templateId: string, customizations: any): Promise<Specialist>;
  
  // Perspective Generation
  generatePerspective(specialist: Specialist, context: any): Promise<SpecialistPerspective>;
  getKeyQuestions(specialist: Specialist, situation: any): Promise<string[]>;
}
```

#### Workflow Service

```typescript
interface WorkflowService {
  // Workflow Management
  getAvailableWorkflows(): Promise<Workflow[]>;
  createWorkflow(definition: WorkflowDefinition): Promise<Workflow>;
  
  // Stage Management
  getStageAgents(workflowId: string, stageId: string): Promise<Agent[]>;
  transitionToStage(workflowId: string, stageId: string, context: any): Promise<void>;
  
  // Context Management
  preserveStageContext(stageId: string, context: any): Promise<void>;
  getStageContext(stageId: string): Promise<any>;
}
```

#### Project Service

```typescript
interface ProjectService {
  // Project Management
  createProject(template: ProjectTemplate, customizations: any): Promise<Project>;
  getProjectTemplates(): Promise<ProjectTemplate[]>;
  saveProjectTemplate(template: ProjectTemplate): Promise<void>;
  
  // Customization
  updateProjectTheme(projectId: string, theme: ProjectTheme): Promise<void>;
  uploadProjectAssets(projectId: string, assets: File[]): Promise<void>;
}
```

## Data Models

### Core Data Structures

#### Super-Brain Organizer Model

```typescript
interface SuperBrainOrganizer {
  // Core Identity
  id: 'organizer';
  name: 'Organizer';
  role: 'Super-Brain Orchestrator & Project Manager';
  
  // Methodological Intelligence
  brainstormingTechniques: BrainstormingMethod[];
  elicitationMethods: ElicitationMethod[];
  processChecklists: ProcessChecklist[];
  bmadWorkflows: BMadWorkflow[];
  
  // Mode Management
  currentMode: ProcessMode;
  availableModes: ProcessMode[];
  modeHistory: ProcessModeHistory[];
  
  // Orchestration Capabilities
  contextManagement: ContextManager;
  agentCoordination: AgentCoordinator;
  workflowEngine: WorkflowEngine;
  
  // Advanced Configuration
  metaGPTIntegration?: MetaGPTConfig;
  sandboxEnvironment?: SandboxConfig;
}

interface ProcessMode {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  applicableScenarios: string[];
}
```

#### Lightweight Specialist Model

```typescript
interface Specialist {
  id: string;
  name: string;
  role: string;
  
  // Core Perspective
  domainFocus: string;
  perspective: string;
  keyQuestions: string[];
  
  // Simple Configuration
  color: string;
  avatar: string;
  description: string;
  
  // Minimal Metadata
  category: string;
  tags: string[];
  isTemplate: boolean;
}
```

```

#### Workflow Model
```typescript
interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'bmad' | 'custom';
  
  stages: WorkflowStage[];
  isCircular: boolean;
  
  // Visual Configuration
  stageColors: Record<string, string>;
  stageAbbreviations: Record<string, string>;
}

interface WorkflowStage {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  
  // Stage Configuration
  requiredAgents: string[];
  optionalAgents: string[];
  stageInstructions: string;
  
  // Flow Control
  nextStages: string[];
  prerequisites: string[];
  
  // Context Management
  inputContext: string[];
  outputContext: string[];
}
```

#### Project Template Model

```typescript
interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  
  // Agent Configuration
  defaultAgents: Agent[];
  recommendedAgents: Agent[];
  
  // Workflow Configuration
  defaultWorkflow?: Workflow;
  suggestedWorkflows: Workflow[];
  
  // UI Configuration
  theme: ProjectTheme;
  welcomeMessage?: string;
  feedHeadline?: string;
  
  // Metadata
  createdBy: string;
  isPublic: boolean;
  usageCount: number;
  rating: number;
}

interface ProjectTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundImage?: string;
  backgroundPattern?: string;
  fontFamily?: string;
  customCSS?: string;
}
```

#### Knowledge Integration Model

```typescript
interface KnowledgeItem {
  id: string;
  agentId: string;
  
  // Content
  title: string;
  content: string;
  fileType: 'text' | 'pdf' | 'markdown' | 'json';
  
  // Processing
  embeddings?: number[];
  chunks: string[];
  
  // Metadata
  uploadedAt: Date;
  lastUsed?: Date;
  usageCount: number;
}
```

## Error Handling

### Agent System Error Handling

- **Agent Loading Failures**: Graceful fallback to default agents
- **Custom Agent Validation**: Comprehensive validation with user-friendly error messages
- **API Integration Failures**: Fallback to alternative APIs or cached responses
- **Knowledge Upload Errors**: Clear feedback on file format/size limitations

### Workflow Error Handling

- **Stage Transition Failures**: Allow manual override or stage skipping
- **Context Loss**: Automatic context recovery from previous stages
- **Agent Unavailability**: Dynamic agent substitution within workflow stages
- **Circular Dependency Detection**: Prevent infinite workflow loops

### Data Persistence Error Handling

- **Storage Failures**: Local fallback with sync when available
- **Template Corruption**: Validation and repair mechanisms
- **Project Recovery**: Automatic backup and restore capabilities
- **Migration Errors**: Version compatibility and data migration tools

## Testing Strategy

### Unit Testing

- **Component Testing**: All new UI components with comprehensive prop testing
- **Service Testing**: Agent, Workflow, and Project services with mock data
- **Model Validation**: Data model validation and transformation testing
- **Utility Functions**: Helper functions for agent management and workflow processing

### Integration Testing

- **Agent Builder Flow**: Complete agent creation and customization process
- **Workflow Navigation**: Stage transitions and context preservation
- **Project Template System**: Template creation, customization, and instantiation
- **API Integration**: Multiple API provider testing and fallback mechanisms

### End-to-End Testing

- **Complete User Journeys**: From project creation to workflow completion
- **Multi-Agent Conversations**: Complex scenarios with multiple agents and workflows
- **Customization Workflows**: Agent building, template creation, and sharing
- **Error Recovery**: System behavior under various failure conditions

### Performance Testing

- **Agent Loading**: Performance with large agent libraries
- **Workflow Execution**: Complex workflow performance and memory usage
- **Real-time Features**: Chat feed responsiveness with multiple agents
- **Storage Operations**: Template and project data persistence performance

## Desktop Version Considerations

### Architecture Adaptations

- **Electron Wrapper**: Minimal changes to existing React codebase
- **Local API Service**: Node.js service for local LLM integration
- **File System Integration**: Native file dialogs and local storage
- **Offline Capabilities**: Full functionality without internet connection

### Local LLM Integration

- **Model Management**: Download, update, and manage local models
- **Performance Optimization**: GPU acceleration and memory management
- **Model Selection**: Per-agent model assignment and switching
- **Fallback Mechanisms**: Cloud API fallback when local models unavailable

### Native OS Integration

- **System Notifications**: Native notifications for agent responses
- **File Association**: Open project files directly in Braintrust Circle
- **Menu Integration**: Native application menus and shortcuts
- **Auto-Updates**: Seamless application updates and model downloads

This design provides a comprehensive foundation for implementing the flexible agent system while maintaining the core strengths of the existing Braintrust Circle platform.
