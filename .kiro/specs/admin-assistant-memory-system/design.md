# Design Document

## Overview

The Admin Assistant Memory System will transform the existing Admin Assistant into the permanent, intelligent core of the Braintrust Circle. The system will automatically capture, organize, and provide insights from all shared conversation data while maintaining persistent memory across sessions. The design focuses on building robust memory capabilities first, with the existing sidebar interface serving as the foundation for displaying this enhanced functionality.

## Architecture

### MetaGPT Integration Strategy

MetaGPT can enhance the Admin Assistant Memory System by providing:

**Structured Agent Roles**: Instead of generic AI agents, MetaGPT provides well-defined roles (Product Manager, Architect, Engineer, QA) with specific responsibilities and communication patterns. This prevents agents from "running away" because they have clear boundaries.

**Controlled Autonomy**: MetaGPT agents operate within defined workflows and handoff protocols. They can be autonomous within their role but must follow established processes, making them predictable and manageable.

**Shared Memory Architecture**: MetaGPT has built-in memory systems (short-term, long-term with FAISS/RAG) that can integrate with our Admin Assistant's memory buckets. This creates a unified memory system across all agents.

**Integration Approach**:
```
┌─────────────────────────────────────────────────────────────┐
│                 Braintrust Circle (UI Layer)               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   Agent     │    │   Shared Chat   │    │   Admin     │  │
│  │   Circle    │◄──►│     Feed        │◄──►│ Assistant   │  │
│  │             │    │                 │    │ (Memory     │  │
│  │ • Standard  │    │ • All Convos    │    │  Core)      │  │
│  │   AI APIs   │    │ • MetaGPT       │    │             │  │
│  │ • MetaGPT   │    │   Workflows     │    │             │  │
│  │   Roles     │    │                 │    │             │  │
│  └─────────────┘    └─────────────────┘    └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│              Unified Agent Management Layer                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   askAgent  │  │  MetaGPT    │  │   Agent Control     │  │
│  │  Endpoint   │  │ Orchestrator│  │     System          │  │
│  │             │  │             │  │                     │  │
│  │ • Route to  │  │ • Role      │  │ • Prevent Runaway   │  │
│  │   Standard  │  │   Management│  │ • Enforce Workflows │  │
│  │   APIs      │  │ • Workflow  │  │ • Memory Sync       │  │
│  │ • Route to  │  │   Control   │  │ • Session Control   │  │
│  │   MetaGPT   │  │ • Memory    │  │ • Error Recovery    │  │
│  │   Roles     │  │   Sync      │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Benefits for Your System**:

1. **Controlled Specialization**: MetaGPT roles have defined responsibilities, so a "Product Manager" agent won't suddenly start writing code
2. **Memory Consistency**: MetaGPT's memory system can feed into your Admin Assistant's memory buckets
3. **Workflow Enforcement**: Agents follow established patterns (requirements → design → implementation)
4. **Quality Control**: Built-in review processes prevent poor outputs
5. **Scalability**: Easy to add new specialized roles without chaos

### Preventing Agent Runaway Behavior

**Session Control**: Each agent interaction is bounded by:
- **Time Limits**: Maximum conversation length before requiring user input
- **Token Limits**: Prevent excessive API usage
- **Scope Boundaries**: Agents can only operate within their defined role
- **Memory Checkpoints**: Regular saves prevent loss of progress

**Workflow Constraints**: 
- **Handoff Requirements**: Agents must explicitly hand off to next role
- **Approval Gates**: Critical decisions require user confirmation
- **Rollback Capability**: Any agent action can be undone
- **Context Preservation**: All agent reasoning is logged for review

**Integration with Admin Assistant**:
- **Central Oversight**: Admin Assistant monitors all agent activities
- **Memory Synchronization**: All agent memories flow through Admin Assistant
- **Conflict Detection**: Admin Assistant identifies conflicting agent outputs
- **Quality Assurance**: Admin Assistant validates agent outputs before storage

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Braintrust Circle UI                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   Agent     │    │   Shared Chat   │    │   Admin     │  │
│  │   Circle    │◄──►│     Feed        │◄──►│ Assistant   │  │
│  │ (Variable)  │    │  (All Convos)   │    │(Permanent)  │  │
│  └─────────────┘    └─────────────────┘    └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                Memory & Organization Layer                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Memory    │  │ Conversation│  │    Intelligence     │  │
│  │   Store     │  │   Capture   │  │     Engine          │  │
│  │             │  │             │  │                     │  │
│  │ • Tasks     │  │ • Auto      │  │ • Summarization     │  │
│  │ • Goals     │  │   Recording │  │ • Pattern Detection │  │
│  │ • Decisions │  │ • Agent     │  │ • Priority Ranking  │  │
│  │ • Insights  │  │   Metadata  │  │ • Proactive Alerts  │  │
│  │ • Projects  │  │ • Context   │  │ • Process Tracking  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                   Persistence Layer                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Local     │  │   State     │  │      Backup &       │  │
│  │  Storage    │  │ Management  │  │     Recovery        │  │
│  │             │  │             │  │                     │  │
│  │ • IndexedDB │  │ • Zustand   │  │ • Auto-save         │  │
│  │ • JSON      │  │ • React     │  │ • Export/Import     │  │
│  │   Backup    │  │   Context   │  │ • Version Control   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Conversation Capture**: All messages in the shared chat feed are automatically captured
2. **Memory Processing**: Intelligence engine processes conversations for insights, decisions, and patterns
3. **Memory Storage**: Processed information is categorized and stored in appropriate memory buckets
4. **Retrieval & Display**: Admin Assistant sidebar displays organized information and provides search/filter capabilities
5. **Proactive Assistance**: System provides suggestions, reminders, and insights based on accumulated memory

## Components and Interfaces

### Memory Store Interface

```typescript
interface MemoryStore {
  // Memory Buckets
  tasks: Task[];
  goals: Goal[];
  decisions: Decision[];
  insights: Insight[];
  projects: Project[];
  conversations: ConversationRecord[];
  
  // Core Operations
  addMemoryItem(type: MemoryType, item: MemoryItem): void;
  updateMemoryItem(id: string, updates: Partial<MemoryItem>): void;
  deleteMemoryItem(id: string): void;
  searchMemory(query: string, filters?: MemoryFilter[]): MemoryItem[];
  
  // Intelligence Operations
  generateSummary(timeRange?: DateRange): Summary;
  identifyPatterns(): Pattern[];
  suggestActions(): Suggestion[];
  trackProgress(goalId: string): ProgressReport;
}
```

### Conversation Capture Service

```typescript
interface ConversationCaptureService {
  // Auto-capture from shared feed
  captureMessage(message: Message): void;
  processConversation(messages: Message[]): ProcessedConversation;
  extractInsights(conversation: ProcessedConversation): Insight[];
  categorizeContent(content: string): MemoryCategory;
  
  // Agent-specific processing
  processAgentResponse(agent: Agent, response: string): AgentInsight;
  trackAgentPatterns(agentId: string): AgentPattern[];
}
```

### Intelligence Engine

```typescript
interface IntelligenceEngine {
  // Analysis
  analyzePriorities(tasks: Task[], goals: Goal[]): PriorityRanking;
  detectConflicts(items: MemoryItem[]): Conflict[];
  identifyTrends(timeRange: DateRange): Trend[];
  
  // Proactive Features
  generateReminders(): Reminder[];
  suggestOptimizations(): Optimization[];
  predictNeeds(context: ProjectContext): Prediction[];
  
  // Summarization
  createConversationSummary(messages: Message[]): Summary;
  createProjectSummary(projectId: string): ProjectSummary;
  createProgressReport(goalId: string): ProgressReport;
}
```

## Data Models

### Core Memory Types

```typescript
interface MemoryItem {
  id: string;
  type: MemoryType;
  title: string;
  content: string;
  metadata: MemoryMetadata;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  priority: Priority;
  status: Status;
}

interface Task extends MemoryItem {
  assigneeId?: string;
  dueDate?: Date;
  dependencies: string[];
  progress: number;
  estimatedHours?: number;
}

interface Goal extends MemoryItem {
  targetDate?: Date;
  milestones: Milestone[];
  relatedTasks: string[];
  successCriteria: string[];
  progress: number;
}

interface Decision extends MemoryItem {
  context: string;
  alternatives: Alternative[];
  reasoning: string;
  outcome?: string;
  impactedItems: string[];
}

interface Insight extends MemoryItem {
  source: InsightSource;
  confidence: number;
  relatedItems: string[];
  actionable: boolean;
  category: InsightCategory;
}

interface Project extends MemoryItem {
  description: string;
  goals: string[];
  resources: Resource[];
  timeline: Timeline;
  stakeholders: string[];
  currentPhase: ProjectPhase;
}
```

### Conversation Records

```typescript
interface ConversationRecord {
  id: string;
  messages: Message[];
  participants: Agent[];
  startTime: Date;
  endTime?: Date;
  summary?: string;
  extractedInsights: string[];
  decisions: string[];
  actionItems: string[];
  topics: string[];
}
```

## Error Handling

### Data Integrity
- **Validation**: All memory items validated before storage
- **Backup**: Automatic backup before destructive operations
- **Recovery**: Rollback capability for failed operations
- **Conflict Resolution**: Merge strategies for concurrent updates

### Performance Safeguards
- **Rate Limiting**: Prevent excessive memory operations
- **Memory Limits**: Archive old data when limits reached
- **Search Optimization**: Indexed search for large datasets
- **Lazy Loading**: Load memory items on demand

### User Experience
- **Graceful Degradation**: Core functionality works even if advanced features fail
- **Error Messages**: Clear, actionable error messages
- **Retry Logic**: Automatic retry for transient failures
- **Offline Support**: Basic functionality available offline

## Testing Strategy

### Unit Testing
- **Memory Store Operations**: CRUD operations for all memory types
- **Intelligence Engine**: Summarization, pattern detection, priority ranking
- **Conversation Capture**: Message processing and insight extraction
- **Data Validation**: Schema validation and data integrity

### Integration Testing
- **End-to-End Workflows**: Complete conversation capture to memory storage
- **Cross-Component Communication**: Memory store to UI updates
- **Performance Testing**: Large dataset handling and search performance
- **Persistence Testing**: Data survival across sessions and crashes

### User Acceptance Testing
- **Memory Accuracy**: Verify captured information matches conversations
- **Intelligence Quality**: Test summarization and insight generation
- **Interface Usability**: Admin Assistant sidebar functionality
- **Performance Benchmarks**: Response times and system responsiveness