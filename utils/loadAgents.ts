import { Agent } from '../types';
import { ORGANIZER_AGENT } from '../constants';

// Interface for the JSON agent files
interface JsonAgent {
  agentname: string;
  description: string;
  systemprompt: string;
  chatgptlink?: string;
  creation_date?: string;
  [key: string]: any;
}

// Function to convert JSON agent to our Agent interface
export const convertJsonAgent = (jsonData: JsonAgent, fileName: string): Agent => {
  const agentId = fileName.replace('.json', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  // Extract category from agent name or description
  const getCategory = (name: string, description: string): string => {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();
    
    if (lowerName.includes('ai') || lowerDesc.includes('artificial intelligence')) return 'AI';
    if (lowerName.includes('data') || lowerDesc.includes('data')) return 'Data';
    if (lowerName.includes('business') || lowerDesc.includes('business')) return 'Business';
    if (lowerName.includes('code') || lowerName.includes('development') || lowerDesc.includes('programming')) return 'Development';
    if (lowerName.includes('design') || lowerDesc.includes('design')) return 'Design';
    if (lowerName.includes('marketing') || lowerDesc.includes('marketing')) return 'Marketing';
    if (lowerName.includes('writing') || lowerDesc.includes('content')) return 'Content';
    if (lowerName.includes('automation') || lowerDesc.includes('workflow')) return 'Automation';
    if (lowerName.includes('security') || lowerDesc.includes('security')) return 'Security';
    if (lowerName.includes('research') || lowerDesc.includes('research')) return 'Research';
    if (lowerName.includes('email') || lowerDesc.includes('email')) return 'Communication';
    if (lowerName.includes('legal') || lowerDesc.includes('legal')) return 'Legal';
    if (lowerName.includes('finance') || lowerDesc.includes('financial')) return 'Finance';
    if (lowerName.includes('health') || lowerDesc.includes('medical')) return 'Healthcare';
    if (lowerName.includes('education') || lowerDesc.includes('learning')) return 'Education';
    return 'General';
  };

  // Generate avatar based on category/name
  const getAvatar = (name: string, category: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ai')) return '🤖';
    if (lowerName.includes('data')) return '📊';
    if (lowerName.includes('security')) return '🔒';
    if (lowerName.includes('design')) return '🎨';
    if (lowerName.includes('writing') || lowerName.includes('content')) return '✍️';
    if (lowerName.includes('code') || lowerName.includes('development')) return '💻';
    if (lowerName.includes('business')) return '💼';
    if (lowerName.includes('marketing')) return '📈';
    if (lowerName.includes('research')) return '🔬';
    if (lowerName.includes('automation')) return '⚙️';
    if (lowerName.includes('email')) return '📧';
    if (lowerName.includes('legal')) return '⚖️';
    if (lowerName.includes('finance')) return '💰';
    if (lowerName.includes('health') || lowerName.includes('medical')) return '🏥';
    if (lowerName.includes('education') || lowerName.includes('learning')) return '🎓';
    return '🎯'; // Default
  };

  // Generate color based on category
  const getColor = (category: string): string => {
    switch (category) {
      case 'AI': return '#8B5CF6';
      case 'Data': return '#10B981';
      case 'Business': return '#F59E0B';
      case 'Development': return '#3B82F6';
      case 'Design': return '#EC4899';
      case 'Marketing': return '#F97316';
      case 'Content': return '#84CC16';
      case 'Automation': return '#6366F1';
      case 'Security': return '#EF4444';
      case 'Research': return '#06B6D4';
      case 'Communication': return '#14B8A6';
      case 'Legal': return '#7C3AED';
      case 'Finance': return '#059669';
      case 'Healthcare': return '#DC2626';
      case 'Education': return '#0891B2';
      default: return '#6B7280';
    }
  };

  const category = getCategory(jsonData.agentname, jsonData.description);
  
  return {
    id: agentId,
    name: jsonData.agentname || 'Unknown Agent',
    role: `${category} Specialist`,
    avatar: getAvatar(jsonData.agentname, category),
    systemInstruction: jsonData.systemprompt || jsonData.description || 'AI assistant specialized in helping users.',
    color: getColor(category),
  };
};

// Create a comprehensive list of sample agents based on the actual file names you have
export const createSampleAgentsFromManifest = (): Agent[] => {
  // Only include the Organizer, no core UI agents
  
  // Based on the file names I saw in your directory, here are representative agents
  const sampleAgents: Agent[] = [
    {
      id: 'ai-agent-builders',
      name: 'AI Agent Builders',
      role: 'AI Development Specialist',
      avatar: '🤖',
      systemInstruction: 'Expert in building and deploying AI agents, specializing in agent architecture, workflows, and commercialization strategies.',
      color: '#8B5CF6'
    },
    {
      id: 'data-analyst',
      name: 'Data Analyst', 
      role: 'Data Analysis Specialist',
      avatar: '📊',
      systemInstruction: 'Expert in data analysis, visualization, and extracting insights from complex datasets.',
      color: '#10B981'
    },
    {
      id: 'cybersecurity-advisor',
      name: 'Cybersecurity Advisor',
      role: 'Security Specialist', 
      avatar: '🔒',
      systemInstruction: 'Cybersecurity expert focusing on threat assessment, security architecture, and best practices.',
      color: '#EF4444'
    },
    {
      id: 'content-writer',
      name: 'Content Writer',
      role: 'Content Specialist',
      avatar: '✍️', 
      systemInstruction: 'Professional content writer specializing in blogs, articles, marketing copy, and technical documentation.',
      color: '#84CC16'
    },
    {
      id: 'business-assistant',
      name: 'Business Assistant',
      role: 'Business Specialist',
      avatar: '💼',
      systemInstruction: 'Business expert helping with strategy, operations, planning, and professional development.',
      color: '#F59E0B'
    },
    {
      id: 'python-helper',
      name: 'Python Helper',
      role: 'Development Specialist',
      avatar: '🐍',
      systemInstruction: 'Python programming expert helping with code, debugging, automation, and best practices.',
      color: '#3B82F6'
    },
    {
      id: 'marketing-specialist',
      name: 'Marketing Specialist', 
      role: 'Marketing Specialist',
      avatar: '📈',
      systemInstruction: 'Digital marketing expert specializing in campaigns, SEO, growth strategies, and content marketing.',
      color: '#F97316'
    },
    {
      id: 'legal-assistant',
      name: 'Legal Assistant',
      role: 'Legal Specialist',
      avatar: '⚖️',
      systemInstruction: 'Legal expert helping with contract analysis, compliance, and legal documentation.',
      color: '#7C3AED'
    },
    {
      id: 'research-assistant',
      name: 'Research Assistant', 
      role: 'Research Specialist',
      avatar: '🔬',
      systemInstruction: 'Research expert specializing in information gathering, analysis, and academic research methodologies.',
      color: '#06B6D4'
    },
    {
      id: 'email-specialist',
      name: 'Email Specialist',
      role: 'Communication Specialist',
      avatar: '📧',
      systemInstruction: 'Email marketing and communication expert helping with campaigns, templates, and automation.',
      color: '#14B8A6'
    },
    {
      id: 'automation-expert',
      name: 'Automation Expert',
      role: 'Automation Specialist', 
      avatar: '⚙️',
      systemInstruction: 'Workflow automation expert specializing in process optimization and tool integration.',
      color: '#6366F1'
    },
    {
      id: 'finance-advisor',
      name: 'Finance Advisor',
      role: 'Finance Specialist',
      avatar: '💰',
      systemInstruction: 'Financial expert helping with budgeting, analysis, investment advice, and financial planning.',
      color: '#059669'
    },
    {
      id: 'healthcare-assistant',
      name: 'Healthcare Assistant',
      role: 'Healthcare Specialist',
      avatar: '🏥',
      systemInstruction: 'Healthcare expert providing medical information, health advice, and wellness guidance.',
      color: '#DC2626'
    },
    {
      id: 'education-specialist',
      name: 'Education Specialist',
      role: 'Education Specialist',
      avatar: '🎓', 
      systemInstruction: 'Educational expert helping with learning strategies, curriculum development, and teaching methodologies.',
      color: '#0891B2'
    },
    {
      id: 'project-manager',
      name: 'Project Manager',
      role: 'Business Specialist',
      avatar: '📋',
      systemInstruction: 'Project management expert specializing in planning, execution, and team coordination.',
      color: '#F59E0B'
    }
  ];

  // Return only the specialist agents (no core UI agents)
  return sampleAgents;
};

// Function to load agents (for future API integration)
export const loadAgentsFromAPI = async (): Promise<Agent[]> => {
  // This would be implemented when you have an API endpoint
  // For now, return the sample agents
  return createSampleAgentsFromManifest();
};

// Load all agents from the generated manifest
export const loadAllAgentsFromManifest = async (): Promise<Agent[]> => {
  console.log('🔄 Loading agents from manifest...');
  try {
    // Fetch the JSON file directly
    const response = await fetch('/all-agents.json');
    console.log('📡 Fetch response:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status} ${response.statusText}`);
    }
    
    const agentsData = await response.json();
    console.log('✅ Successfully loaded agents:', agentsData.length);
    return agentsData as Agent[];
  } catch (error) {
    console.error('❌ Error loading agents manifest:', error);
    console.log('🔄 Falling back to sample agents...');
    // Fallback to sample agents
    const sampleAgents = createSampleAgentsFromManifest();
    console.log('✅ Using sample agents:', sampleAgents.length);
    return sampleAgents;
  }
};

// Main function to get all available agents
export const getAllAgents = async (): Promise<Agent[]> => {
  try {
    // Load all 899 agents from the manifest
    return await loadAllAgentsFromManifest();
  } catch (error) {
    console.error('Error loading agents:', error);
    // Fallback to sample agents
    return createSampleAgentsFromManifest();
  }
};