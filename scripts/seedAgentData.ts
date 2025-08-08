import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { SerializableAgent } from './extractAgents';

interface AgentSeedData {
  version: string;
  createdAt: string;
  agents: SerializableAgent[];
}

/**
 * Create seed data from extracted agents
 */
function createSeedData(): AgentSeedData {
  const extractedAgentsPath = join(process.cwd(), 'data', 'extracted-agents.json');
  
  if (!existsSync(extractedAgentsPath)) {
    throw new Error('Extracted agents file not found. Run extractAgents.ts first.');
  }
  
  const extractedAgents: SerializableAgent[] = JSON.parse(
    readFileSync(extractedAgentsPath, 'utf-8')
  );
  
  return {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    agents: extractedAgents
  };
}

/**
 * Write seed data to file
 */
function writeSeedData(seedData: AgentSeedData): void {
  const dataDir = join(process.cwd(), 'data');
  
  // Ensure data directory exists
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  
  const seedPath = join(dataDir, 'agent-seed-data.json');
  writeFileSync(seedPath, JSON.stringify(seedData, null, 2));
  
  console.log(`✅ Seed data written to ${seedPath}`);
}

/**
 * Generate additional sample agents for testing
 */
function generateSampleAgents(): SerializableAgent[] {
  return [
    {
      id: 'technical-writer',
      name: 'Technical Writer',
      role: 'Documentation Specialist',
      systemInstruction: 'You are a technical writing expert. Create clear, comprehensive documentation, API guides, and user manuals. Your writing is precise, well-structured, and accessible.',
      color: '#10B981', // emerald-500
      avatar: 'WriterIcon',
      category: 'Documentation',
      tags: ['documentation', 'writing', 'technical', 'guides']
    },
    {
      id: 'data-analyst',
      name: 'Data Analyst',
      role: 'Data Science & Analytics Expert',
      systemInstruction: 'You are a data analyst and scientist. Analyze datasets, create visualizations, and provide insights from data. Your approach is methodical and evidence-based.',
      color: '#8B5CF6', // violet-500
      avatar: 'AnalystIcon',
      category: 'Analytics',
      tags: ['data', 'analytics', 'visualization', 'insights']
    },
    {
      id: 'security-expert',
      name: 'Security Expert',
      role: 'Cybersecurity Specialist',
      systemInstruction: 'You are a cybersecurity expert. Assess security risks, recommend best practices, and help implement secure systems. Your focus is on protection and risk mitigation.',
      color: '#EF4444', // red-500
      avatar: 'SecurityIcon',
      category: 'Security',
      tags: ['security', 'cybersecurity', 'risk', 'protection']
    }
  ];
}

/**
 * Main seeding function
 */
function main() {
  try {
    console.log('Creating agent seed data...');
    
    // Create base seed data from extracted agents
    const seedData = createSeedData();
    
    // Add sample agents for testing
    const sampleAgents = generateSampleAgents();
    seedData.agents.push(...sampleAgents);
    
    // Write seed data
    writeSeedData(seedData);
    
    console.log(`✅ Successfully created seed data with ${seedData.agents.length} agents`);
    console.log('Seed data includes:');
    seedData.agents.forEach(agent => {
      console.log(`  - ${agent.name} (${agent.category})`);
    });
    
  } catch (error) {
    console.error('❌ Error creating seed data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { createSeedData, generateSampleAgents, AgentSeedData };