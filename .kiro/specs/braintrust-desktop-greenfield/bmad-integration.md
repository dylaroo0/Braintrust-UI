# BrainTrust Circle: User-Malleable Creation Tool

## Core Vision

**BrainTrust Circle** is a revolutionary user-malleable creation tool that empowers users to build their own personalized AI workspace. Unlike traditional software that forces users into rigid interfaces, BrainTrust Circle gives users complete control to design, customize, and create their ideal collaborative environment.

**The Three Pillars**: (1) One Shared Chat Feed where all specialists contribute to a single conversation, (2) Super Organizer that orchestrates everything and connects to external systems, (3) Specialist System with 899+ hyper-focused AI experts that users can select and arrange.

**Users don't just use BrainTrust Circle - they create their own version of it** through complete customization control over visual design, layout, naming, workflows, and specialist selection.

---

# BMAD Integration for Super Organizer

## Vision: Rapid Product Building Intelligence

The Super Organizer must **quickly figure out** product building workflows by integrating the BMAD methodology deeply into its core intelligence. When a user opens a project in an IDE, the Organizer should instantly understand the context and provide intelligent product building guidance.

## Core BMAD Integration Features

### 1. Instant Project Analysis

```typescript
interface ProjectAnalysisEngine {
  // Rapid Project Understanding
  analyzeProject(projectPath: string): Promise<ProjectInsights>;
  
  // Project Type Detection
  detectProjectType(): 'web-app' | 'mobile-app' | 'api' | 'desktop' | 'library' | 'unknown';
  
  // Architecture Recognition
  identifyArchitecture(): {
    frontend: string[];        // React, Vue, Angular, etc.
    backend: string[];         // Node, Python, Java, etc.
    database: string[];        // PostgreSQL, MongoDB, etc.
    infrastructure: string[];  // AWS, Docker, Kubernetes, etc.
  };
  
  // Development Stage Assessment
  assessStage(): 'planning' | 'development' | 'testing' | 'deployment' | 'maintenance';
}

interface ProjectInsights {
  type: ProjectType;
  architecture: ArchitectureMap;
  currentStage: DevelopmentStage;
  suggestedWorkflow: BMADWorkflow;
  nextActions: ActionItem[];
  specialists: RecommendedSpecialists[];
}
```

### 2. BMAD Workflow Engine

```typescript
interface BMADWorkflowEngine {
  // Workflow Selection
  selectOptimalWorkflow(project: ProjectInsights): BMADWorkflow;
  
  // Phase Management
  getCurrentPhase(): 'planning' | 'development' | 'review' | 'deployment';
  getNextPhase(): BMADPhase;
  
  // Task Generation
  generateTasks(phase: BMADPhase, project: ProjectInsights): Task[];
  
  // Specialist Orchestration
  orchestrateSpecialists(workflow: BMADWorkflow): SpecialistTeam;
}

interface BMADWorkflow {
  name: string;                // "Web App Development", "API Design", etc.
  phases: BMADPhase[];
  estimatedDuration: string;
  requiredSpecialists: string[];
  templates: TemplateReference[];
}

interface BMADPhase {
  name: string;
  description: string;
  tasks: Task[];
  deliverables: Deliverable[];
  specialists: string[];
  duration: string;
  dependencies: string[];
}
```

### 3. Rapid Spec Generation

```typescript
interface SpecGenerationEngine {
  // PRD Generation
  generatePRD(projectGoal: string, context: ProjectContext): Promise<PRD>;
  
  // Architecture Specs
  generateArchitectureSpec(requirements: Requirements): Promise<ArchitectureSpec>;
  
  // User Story Generation
  generateUserStories(prd: PRD): Promise<UserStory[]>;
  
  // Technical Specs
  generateTechnicalSpecs(architecture: ArchitectureSpec): Promise<TechnicalSpec[]>;
}

interface PRD {
  title: string;
  overview: string;
  objectives: string[];
  userPersonas: UserPersona[];
  features: Feature[];
  technicalRequirements: TechnicalRequirement[];
  timeline: Timeline;
  successMetrics: Metric[];
}
```

### 4. IDE Context Intelligence

```typescript
interface IDEContextEngine {
  // File System Analysis
  analyzeFileStructure(rootPath: string): FileStructureInsights;
  
  // Code Analysis
  analyzeCodebase(): {
    languages: string[];
    frameworks: string[];
    patterns: string[];
    quality: CodeQualityMetrics;
    complexity: ComplexityMetrics;
  };
  
  // Git Analysis
  analyzeGitHistory(): {
    commitPatterns: CommitPattern[];
    contributors: Contributor[];
    velocity: VelocityMetrics;
    branches: BranchStrategy;
  };
  
  // Dependency Analysis
  analyzeDependencies(): {
    packages: Package[];
    vulnerabilities: Vulnerability[];
    outdated: OutdatedPackage[];
    recommendations: DependencyRecommendation[];
  };
}
```

## BMAD Workflow Templates

### 1. Web Application Development
```yaml
name: "Full-Stack Web Application"
phases:
  - name: "Discovery & Planning"
    duration: "1-2 weeks"
    specialists: ["Product Manager", "UX Designer", "System Architect"]
    deliverables: ["PRD", "User Journey Maps", "System Architecture"]
    
  - name: "Design & Prototyping"
    duration: "1-2 weeks"
    specialists: ["UX Designer", "UI Designer", "Frontend Specialist"]
    deliverables: ["Wireframes", "UI Mockups", "Interactive Prototype"]
    
  - name: "Development Sprint Planning"
    duration: "3-5 days"
    specialists: ["Scrum Master", "Tech Lead", "Backend Specialist"]
    deliverables: ["Sprint Backlog", "Technical Specifications", "Development Plan"]
    
  - name: "Development Cycles"
    duration: "2-8 weeks"
    specialists: ["Frontend Developer", "Backend Developer", "DevOps Engineer"]
    deliverables: ["Working Software", "Test Coverage", "Documentation"]
    
  - name: "Testing & QA"
    duration: "1-2 weeks"
    specialists: ["QA Engineer", "Security Specialist", "Performance Tester"]
    deliverables: ["Test Reports", "Security Audit", "Performance Metrics"]
    
  - name: "Deployment & Launch"
    duration: "3-5 days"
    specialists: ["DevOps Engineer", "Site Reliability Engineer", "Product Manager"]
    deliverables: ["Production Deployment", "Monitoring Setup", "Launch Plan"]
```

### 2. API Development
```yaml
name: "RESTful API Development"
phases:
  - name: "API Design"
    duration: "3-5 days"
    specialists: ["API Architect", "Backend Specialist", "Documentation Specialist"]
    deliverables: ["API Specification", "Data Models", "Authentication Design"]
    
  - name: "Implementation"
    duration: "1-3 weeks"
    specialists: ["Backend Developer", "Database Specialist", "Security Engineer"]
    deliverables: ["API Implementation", "Database Schema", "Security Layer"]
    
  - name: "Testing & Documentation"
    duration: "3-5 days"
    specialists: ["QA Engineer", "Technical Writer", "API Tester"]
    deliverables: ["Test Suite", "API Documentation", "Usage Examples"]
```

## Quick Recognition Algorithms

### 1. Project Type Detection
```typescript
const projectTypeDetection = {
  'web-app': {
    indicators: ['package.json', 'src/', 'public/', 'index.html'],
    frameworks: ['react', 'vue', 'angular', 'svelte'],
    confidence: (indicators: string[]) => calculateConfidence(indicators)
  },
  
  'mobile-app': {
    indicators: ['android/', 'ios/', 'flutter/', 'react-native/'],
    frameworks: ['flutter', 'react-native', 'ionic', 'xamarin'],
    confidence: (indicators: string[]) => calculateConfidence(indicators)
  },
  
  'api': {
    indicators: ['routes/', 'controllers/', 'models/', 'middleware/'],
    frameworks: ['express', 'fastapi', 'spring', 'django'],
    confidence: (indicators: string[]) => calculateConfidence(indicators)
  }
};
```

### 2. Workflow Recommendation Engine
```typescript
interface WorkflowRecommendationEngine {
  // Analyze project and recommend workflow
  recommendWorkflow(project: ProjectInsights): {
    primary: BMADWorkflow;
    alternatives: BMADWorkflow[];
    reasoning: string;
    confidence: number;
  };
  
  // Adapt workflow based on project specifics
  adaptWorkflow(workflow: BMADWorkflow, project: ProjectInsights): BMADWorkflow;
  
  // Generate immediate next steps
  getImmediateActions(project: ProjectInsights): ActionItem[];
}
```

## Integration with IDE Features

### VS Code Integration
```typescript
interface VSCodeBMADIntegration {
  // Command Palette Commands
  commands: {
    'bmad.analyzeProject': () => void;
    'bmad.generatePRD': () => void;
    'bmad.createUserStory': () => void;
    'bmad.suggestArchitecture': () => void;
    'bmad.planSprint': () => void;
  };
  
  // Status Bar Integration
  statusBar: {
    currentPhase: string;
    nextAction: string;
    progress: number;
  };
  
  // Sidebar Panel
  sidebarPanel: {
    projectOverview: ProjectInsights;
    currentTasks: Task[];
    specialists: ActiveSpecialist[];
    recommendations: Recommendation[];
  };
}
```

### Kiro Integration
```typescript
interface KiroBMADIntegration {
  // Spec Enhancement
  specEnhancement: {
    autoGenerateSpecs: boolean;
    suggestRequirements: boolean;
    validateSpecs: boolean;
  };
  
  // Task Management
  taskManagement: {
    generateTasksFromSpecs: boolean;
    trackProgress: boolean;
    suggestNextTasks: boolean;
  };
  
  // Workflow Integration
  workflowIntegration: {
    bmadWorkflows: BMADWorkflow[];
    currentWorkflow: BMADWorkflow;
    phaseTracking: boolean;
  };
}
```

## Success Metrics

### Speed Requirements
- ✅ **Project Analysis**: < 5 seconds for initial analysis
- ✅ **Workflow Recommendation**: < 2 seconds for workflow suggestion
- ✅ **Spec Generation**: < 30 seconds for basic PRD
- ✅ **Task Generation**: < 10 seconds for sprint planning

### Accuracy Requirements
- ✅ **Project Type Detection**: > 90% accuracy
- ✅ **Workflow Recommendation**: > 85% user satisfaction
- ✅ **Spec Quality**: Professional-grade output
- ✅ **Task Relevance**: > 80% of generated tasks are actionable

## Implementation Priority

### Phase 1: Core BMAD Engine
- Project analysis and type detection
- Basic workflow recommendation
- Simple spec generation
- **Time: 15-20 hours**

### Phase 2: IDE Integration
- VS Code extension with BMAD features
- Kiro integration for enhanced specs
- Real-time project monitoring
- **Time: 20-25 hours**

### Phase 3: Advanced Features
- Machine learning for better recommendations
- Custom workflow creation
- Team collaboration features
- **Time: 25-30 hours**

**This BMAD integration ensures the Super Organizer can "figure out" product building quickly and provide immediate, intelligent guidance in any IDE environment.**