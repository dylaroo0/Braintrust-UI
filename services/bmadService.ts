import type { Agent, Message } from '../types';

// BMad-specific types
export interface BMadAgent {
  id: string;
  name: string;
  type: 'bmad-master' | 'bmad-orchestrator' | 'pm' | 'architect' | 'sm' | 'dev' | 'qa' | 'po';
  description: string;
  capabilities: string[];
}

export interface BMadRequest {
  agentId: string;
  prompt: string;
  context?: BMadContext;
  history?: Message[];
}

export interface BMadResponse {
  success: boolean;
  content: string;
  agentId: string;
  metadata?: {
    processingTime: number;
    tokensUsed?: number;
    documentsGenerated?: string[];
  };
  error?: string;
}

export interface BMadContext {
  projectId?: string;
  phase: 'planning' | 'development';
  documents?: {
    prd?: string;
    architecture?: string;
    stories?: string[];
  };
  preferences?: Record<string, any>;
}

// Planning Phase specific types
export interface ProjectContext {
  projectId: string;
  name: string;
  description: string;
  stakeholders: string[];
  businessGoals: string[];
  technicalConstraints?: string[];
}

export interface PRDDocument {
  id: string;
  projectId: string;
  title: string;
  content: string;
  version: string;
  epics: Epic[];
  createdAt: Date;
  updatedAt: Date;
  sharded: boolean;
  shardLocation?: string;
}

export interface ArchitectureDocument {
  id: string;
  projectId: string;
  title: string;
  content: string;
  version: string;
  components: ArchitectureComponent[];
  createdAt: Date;
  updatedAt: Date;
  sharded: boolean;
  shardLocation?: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedEffort: number;
  acceptanceCriteria: string[];
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'service' | 'database' | 'api' | 'ui' | 'infrastructure';
  description: string;
  dependencies: string[];
  technologies: string[];
}

export interface ShardedDocument {
  id: string;
  parentDocumentId: string;
  parentType: 'prd' | 'architecture';
  shardType: string;
  title: string;
  content: string;
  filePath: string;
  isDevLoadAlways: boolean;
  projectId: string;
  createdAt: Date;
}

export interface BMadError extends Error {
  code: 'AGENT_UNAVAILABLE' | 'INVALID_REQUEST' | 'PROCESSING_ERROR' | 'TIMEOUT';
  agentId?: string;
  retryable: boolean;
}

/**
 * BMadService handles communication with BMad-Method agents
 * Provides core agent routing, error handling, and fallback mechanisms
 */
export class BMadService {
  private static instance: BMadService;
  private isInitialized = false;
  private availableAgents: Map<string, BMadAgent> = new Map();
  private readonly maxRetries = 3;
  private readonly timeoutMs = 30000; // 30 seconds

  private constructor() {
    this.initializeAgents();
  }

  public static getInstance(): BMadService {
    if (!BMadService.instance) {
      BMadService.instance = new BMadService();
    }
    return BMadService.instance;
  }

  /**
   * Initialize BMad service and verify agent availability
   */
  public async initializeBMad(): Promise<void> {
    try {
      console.log('Initializing BMad-Method service...');
      
      // Check if BMad core is available
      await this.verifyBMadCore();
      
      // Load agent configurations
      await this.loadAgentConfigurations();
      
      this.isInitialized = true;
      console.log('BMad-Method service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize BMad-Method:', error);
      throw new BMadError('Failed to initialize BMad-Method service', {
        cause: error,
        code: 'PROCESSING_ERROR',
        retryable: true
      });
    }
  }

  /**
   * Route requests to appropriate BMad agents
   */
  public async routeToAgent(request: BMadRequest): Promise<BMadResponse> {
    if (!this.isInitialized) {
      await this.initializeBMad();
    }

    const startTime = Date.now();
    
    try {
      // Validate request
      this.validateRequest(request);
      
      // Get agent configuration
      const agent = this.availableAgents.get(request.agentId);
      if (!agent) {
        throw new BMadError(`Agent ${request.agentId} not found`, {
          code: 'AGENT_UNAVAILABLE',
          agentId: request.agentId,
          retryable: false
        });
      }

      // Route to specific agent with retry logic
      const response = await this.executeWithRetry(
        () => this.callBMadAgent(agent, request),
        this.maxRetries
      );

      return {
        ...response,
        metadata: {
          ...response.metadata,
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error(`Error routing to agent ${request.agentId}:`, error);
      
      if (error instanceof BMadError) {
        throw error;
      }
      
      throw new BMadError(`Failed to route request to ${request.agentId}`, {
        cause: error,
        code: 'PROCESSING_ERROR',
        agentId: request.agentId,
        retryable: true
      });
    }
  }

  /**
   * Check if BMad service is available and healthy
   */
  public async isAvailable(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        return false;
      }
      
      // Perform a lightweight health check
      await this.verifyBMadCore();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get list of available BMad agents
   */
  public getAvailableAgents(): BMadAgent[] {
    return Array.from(this.availableAgents.values());
  }

  /**
   * Get specific agent by ID
   */
  public getAgent(agentId: string): BMadAgent | undefined {
    return this.availableAgents.get(agentId);
  }

  /**
   * Handle graceful fallback when BMad is unavailable
   */
  public async handleFallback(request: BMadRequest, fallbackAgent?: Agent): Promise<BMadResponse> {
    console.warn(`BMad agent ${request.agentId} unavailable, using fallback`);
    
    // If no fallback agent provided, return a helpful error response
    if (!fallbackAgent) {
      return {
        success: false,
        content: `BMad agent "${request.agentId}" is currently unavailable. Please try again later or use an alternative agent.`,
        agentId: request.agentId,
        error: 'Agent unavailable - no fallback configured'
      };
    }

    // Use fallback agent (e.g., existing Gemini-based agents)
    try {
      const { getAgentResponse } = await import('./geminiService');
      const fallbackResponse = await getAgentResponse(
        request.prompt,
        fallbackAgent,
        request.history || []
      );

      return {
        success: true,
        content: `[Fallback Response from ${fallbackAgent.name}]\n\n${fallbackResponse}`,
        agentId: request.agentId,
        metadata: {
          processingTime: 0,
          fallbackUsed: true
        }
      };
    } catch (error) {
      console.error('Fallback agent also failed:', error);
      return {
        success: false,
        content: 'Both primary and fallback agents are unavailable. Please try again later.',
        agentId: request.agentId,
        error: 'All agents unavailable'
      };
    }
  }

  // Private methods

  private initializeAgents(): void {
    // Define available BMad agents based on BMad-Method specification
    const agents: BMadAgent[] = [
      {
        id: 'bmad-master',
        name: 'BMad Master',
        type: 'bmad-master',
        description: 'Main orchestrator for BMad-Method workflows',
        capabilities: ['workflow-orchestration', 'agent-coordination', 'context-management']
      },
      {
        id: 'bmad-orchestrator',
        name: 'BMad Orchestrator',
        type: 'bmad-orchestrator',
        description: 'Secondary orchestrator for complex workflows',
        capabilities: ['multi-agent-coordination', 'workflow-management']
      },
      {
        id: 'pm',
        name: 'Product Manager',
        type: 'pm',
        description: 'Creates PRDs and manages product requirements',
        capabilities: ['prd-creation', 'requirements-analysis', 'stakeholder-management']
      },
      {
        id: 'architect',
        name: 'Software Architect',
        type: 'architect',
        description: 'Designs system architecture and technical specifications',
        capabilities: ['architecture-design', 'technical-specifications', 'system-design']
      },
      {
        id: 'po',
        name: 'Product Owner',
        type: 'po',
        description: 'Handles document sharding and context management',
        capabilities: ['document-sharding', 'context-optimization', 'epic-management']
      },
      {
        id: 'sm',
        name: 'Scrum Master',
        type: 'sm',
        description: 'Creates and manages development stories',
        capabilities: ['story-creation', 'sprint-planning', 'workflow-management']
      },
      {
        id: 'dev',
        name: 'Developer',
        type: 'dev',
        description: 'Executes development tasks and implements features',
        capabilities: ['code-implementation', 'feature-development', 'technical-execution']
      },
      {
        id: 'qa',
        name: 'Quality Assurance',
        type: 'qa',
        description: 'Reviews code and ensures quality standards',
        capabilities: ['code-review', 'quality-assurance', 'testing-strategy']
      }
    ];

    agents.forEach(agent => {
      this.availableAgents.set(agent.id, agent);
    });
  }

  private async verifyBMadCore(): Promise<void> {
    // In a real implementation, this would check if BMad-Method is properly installed
    // For now, we'll simulate the check
    try {
      // Check if .bmad-core directory exists and has required files
      const fs = await import('fs');
      const path = await import('path');
      
      const bmadCorePath = path.join(process.cwd(), '.bmad-core');
      const configPath = path.join(bmadCorePath, 'core-config.yaml');
      
      if (!fs.existsSync(bmadCorePath) || !fs.existsSync(configPath)) {
        throw new Error('BMad core files not found');
      }
    } catch (error) {
      throw new BMadError('BMad core verification failed', {
        cause: error,
        code: 'AGENT_UNAVAILABLE',
        retryable: false
      });
    }
  }

  private async loadAgentConfigurations(): Promise<void> {
    // In a real implementation, this would load agent configurations from BMad core
    // For now, we'll use the predefined agents
    console.log(`Loaded ${this.availableAgents.size} BMad agents`);
  }

  private validateRequest(request: BMadRequest): void {
    if (!request.agentId) {
      throw new BMadError('Agent ID is required', {
        code: 'INVALID_REQUEST',
        retryable: false
      });
    }

    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new BMadError('Prompt is required', {
        code: 'INVALID_REQUEST',
        retryable: false
      });
    }
  }

  private async callBMadAgent(agent: BMadAgent, request: BMadRequest): Promise<BMadResponse> {
    // In a real implementation, this would call the actual BMad agent
    // For now, we'll simulate the call with a timeout
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new BMadError(`Agent ${agent.id} timed out`, {
          code: 'TIMEOUT',
          agentId: agent.id,
          retryable: true
        }));
      }, this.timeoutMs);

      // Simulate agent processing
      setTimeout(() => {
        clearTimeout(timeout);
        
        // Mock response based on agent type
        const mockResponse = this.generateMockResponse(agent, request);
        resolve(mockResponse);
      }, 1000 + Math.random() * 2000); // 1-3 second delay
    });
  }

  private generateMockResponse(agent: BMadAgent, request: BMadRequest): BMadResponse {
    // Generate appropriate mock responses based on agent type
    let content = '';
    const documentsGenerated: string[] = [];

    switch (agent.type) {
      case 'bmad-master':
      case 'bmad-orchestrator':
        content = `BMad ${agent.name} received your request: "${request.prompt}"\n\nI'm coordinating with the appropriate specialized agents to handle this request. This would typically involve routing to PM, Architect, or Development agents based on the request type.`;
        break;
      
      case 'pm':
        content = `As the Product Manager, I'm analyzing your request for PRD creation.\n\nBased on "${request.prompt}", I would typically:\n1. Gather requirements\n2. Create user stories\n3. Define acceptance criteria\n4. Generate a comprehensive PRD document`;
        documentsGenerated.push('docs/prd.md');
        break;
      
      case 'architect':
        content = `As the Software Architect, I'm designing the technical approach.\n\nFor "${request.prompt}", I would:\n1. Analyze technical requirements\n2. Design system architecture\n3. Define technical specifications\n4. Create architecture documentation`;
        documentsGenerated.push('docs/architecture.md');
        break;
      
      case 'po':
        content = `As the Product Owner, I'm handling document organization.\n\nI would shard the documents into manageable pieces and ensure proper context loading for development agents.`;
        break;
      
      case 'sm':
        content = `As the Scrum Master, I'm creating development stories.\n\nBased on the requirements, I would break down the work into actionable stories with clear acceptance criteria.`;
        documentsGenerated.push('docs/stories/story-001.md');
        break;
      
      case 'dev':
        content = `As the Developer, I'm ready to implement the requested features.\n\nI would follow the technical specifications and coding standards to deliver high-quality code.`;
        break;
      
      case 'qa':
        content = `As QA, I'm reviewing the implementation for quality assurance.\n\nI would verify that all requirements are met and the code follows best practices.`;
        break;
      
      default:
        content = `Agent ${agent.name} processed your request: "${request.prompt}"`;
    }

    return {
      success: true,
      content,
      agentId: agent.id,
      metadata: {
        processingTime: 0, // Will be set by caller
        documentsGenerated: documentsGenerated.length > 0 ? documentsGenerated : undefined
      }
    };
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number,
    delay = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry if it's not a retryable error
        if (error instanceof BMadError && !error.retryable) {
          throw error;
        }

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError!;
  }
}

// Custom error class for BMad-specific errors
class BMadError extends Error {
  public readonly code: 'AGENT_UNAVAILABLE' | 'INVALID_REQUEST' | 'PROCESSING_ERROR' | 'TIMEOUT';
  public readonly agentId?: string;
  public readonly retryable: boolean;

  constructor(
    message: string,
    options: {
      cause?: Error;
      code: BMadError['code'];
      agentId?: string;
      retryable: boolean;
    }
  ) {
    super(message);
    this.name = 'BMadError';
    this.code = options.code;
    this.agentId = options.agentId;
    this.retryable = options.retryable;
    
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

// Export singleton instance
export const bmadService = BMadService.getInstance();