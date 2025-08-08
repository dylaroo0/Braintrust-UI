import AgentDatabase from '../services/database.js';

// Agent data extracted from constants.tsx
// Note: Avatar components will be handled separately as they need to be rendered
const SEED_AGENTS = [
  {
    id: 'designer',
    name: 'Designer',
    role: 'Visual Artist & UI/UX Expert',
    systemInstruction: `You are a world-class UI/UX designer and visual artist. Your name is 'Designer'. Provide expert advice on aesthetics, user flows, and visual design. Generate SVG mockups, color palettes, and creative concepts. Your tone is creative, inspiring, and user-centric.`,
    color: '#06B6D4',
    category: 'design',
    tags: ['ui', 'ux', 'visual', 'creative', 'design'],
    description: 'Expert in UI/UX design, visual aesthetics, and creative concepts',
    avatar: 'designer' // Reference to icon component
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Full-Stack Software Developer',
    systemInstruction: `You are a senior full-stack software developer. Your name is 'Developer'. Your expertise is in React, TypeScript, Node.js, and API design. Provide clean, efficient code snippets, explain complex logic, and help scaffold application features. Your responses should be technical, precise, and practical.`,
    color: '#3B82F6',
    category: 'development',
    tags: ['react', 'typescript', 'nodejs', 'fullstack', 'api'],
    description: 'Senior full-stack developer specializing in React, TypeScript, and Node.js',
    avatar: 'developer'
  },
  {
    id: 'engineer',
    name: 'Engineer',
    role: 'Systems & Infrastructure Engineer',
    systemInstruction: `You are a systems and infrastructure engineer. Your name is 'Engineer'. You specialize in system architecture, cloud infrastructure (AWS, GCP), and hardware. Provide architecture diagrams, bill of materials (BOM), and advice on scalability and performance. Your thinking is systematic, robust, and forward-looking.`,
    color: '#F97316',
    category: 'engineering',
    tags: ['systems', 'infrastructure', 'aws', 'gcp', 'architecture'],
    description: 'Systems and infrastructure engineer with expertise in cloud platforms and scalability',
    avatar: 'engineer'
  },
  {
    id: 'organizer',
    name: 'Organizer',
    role: 'Admin Assistant & Project Manager',
    systemInstruction: `You are an expert admin assistant and project manager named 'Organizer'. Your role is to keep the project on track. Summarize conversations, maintain the project brief, manage tasks, and provide reminders. You can synthesize information from other agents to give a high-level overview. Your tone is clear, concise, and organized. When asked for a summary, review the conversation and provide a bulleted list of key decisions and action items.`,
    color: '#A855F7',
    category: 'management',
    tags: ['project-management', 'organization', 'admin', 'summary'],
    description: 'Expert admin assistant and project manager for keeping projects on track',
    avatar: 'organizer',
    isPermanent: true // Special flag for the permanent organizer
  }
];

/**
 * Seeds the database with initial agent data extracted from constants.tsx
 */
export async function seedAgents(): Promise<void> {
  console.log('Starting agent data seeding...');
  
  try {
    const db = new AgentDatabase('agents.db');
    
    // Clear existing agents by getting all and removing them
    const existingAgents = db.getAllAgents();
    console.log(`Found ${existingAgents.length} existing agents, clearing...`);
    
    // Since there's no delete method, we'll need to work with the database directly
    // For now, let's just insert and handle duplicates
    
    // Insert seed agents
    for (const agent of SEED_AGENTS) {
      try {
        db.insertAgent({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          description: agent.description,
          systemInstruction: agent.systemInstruction,
          color: agent.color,
          avatar: agent.avatar,
          tags: JSON.stringify(agent.tags),
          category: agent.category
        });
        console.log(`Seeded agent: ${agent.name}`);
      } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
          console.log(`Agent ${agent.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log(`Successfully processed ${SEED_AGENTS.length} agents`);
    
    // Verify the data
    const allAgents = db.getAllAgents();
    console.log(`Total agents in database: ${allAgents.length}`);
    
    db.close();
    
  } catch (error) {
    console.error('Error seeding agents:', error);
    throw error;
  }
}

/**
 * Exports current agents from database to JSON format
 */
export async function exportAgents(): Promise<any[]> {
  try {
    const db = new AgentDatabase('agents.db');
    const agents = db.getAllAgents();
    
    // Parse JSON fields and format for export
    const exportData = agents.map((agent: any) => ({
      ...agent,
      tags: JSON.parse(agent.tags || '[]'),
      created_at: new Date(agent.created_at)
    }));
    
    db.close();
    return exportData;
    
  } catch (error) {
    console.error('Error exporting agents:', error);
    throw error;
  }
}

/**
 * Imports agents from JSON data
 */
export async function importAgents(agentsData: any[]): Promise<void> {
  console.log(`Starting import of ${agentsData.length} agents...`);
  
  try {
    const db = new AgentDatabase('agents.db');
    
    for (const agent of agentsData) {
      try {
        db.insertAgent({
          id: agent.id,
          name: agent.name,
          role: agent.role,
          description: agent.description,
          systemInstruction: agent.system_instruction || agent.systemInstruction,
          color: agent.color,
          avatar: agent.avatar_type || agent.avatarType || agent.avatar,
          tags: JSON.stringify(agent.tags || []),
          category: agent.category
        });
        console.log(`Imported agent: ${agent.name}`);
      } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
          console.log(`Agent ${agent.name} already exists, skipping...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log(`Successfully processed ${agentsData.length} agents`);
    db.close();
    
  } catch (error) {
    console.error('Error importing agents:', error);
    throw error;
  }
}

// CLI interface for running seed operations
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'seed':
      seedAgents()
        .then(() => {
          console.log('Seeding completed successfully');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Seeding failed:', error);
          process.exit(1);
        });
      break;
      
    case 'export':
      exportAgents()
        .then((agents) => {
          console.log(JSON.stringify(agents, null, 2));
          process.exit(0);
        })
        .catch((error) => {
          console.error('Export failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: npm run seed-agents [seed|export]');
      console.log('  seed   - Populate database with initial agent data');
      console.log('  export - Export current agents to JSON');
      process.exit(1);
  }
}