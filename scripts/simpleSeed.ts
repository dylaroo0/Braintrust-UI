import AgentDatabase from '../services/database.js';

console.log('🌱 Starting simple agent seeding...');

const db = new AgentDatabase('agents.db');

// Define the seed agents (extracted from constants.tsx)
const SEED_AGENTS = [
  {
    id: 'designer',
    name: 'Designer',
    role: 'Visual Artist & UI/UX Expert',
    description: 'World-class UI/UX designer and visual artist specializing in aesthetics, user flows, and creative concepts',
    systemInstruction: `You are a world-class UI/UX designer and visual artist. Your name is 'Designer'. Provide expert advice on aesthetics, user flows, and visual design. Generate SVG mockups, color palettes, and creative concepts. Your tone is creative, inspiring, and user-centric.`,
    color: '#06B6D4',
    avatar: 'designer',
    tags: JSON.stringify(['ui', 'ux', 'visual', 'creative', 'design', 'aesthetics', 'mockups', 'color-palettes']),
    category: 'design'
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Full-Stack Software Developer',
    description: 'Senior full-stack software developer with expertise in React, TypeScript, Node.js, and API design',
    systemInstruction: `You are a senior full-stack software developer. Your name is 'Developer'. Your expertise is in React, TypeScript, Node.js, and API design. Provide clean, efficient code snippets, explain complex logic, and help scaffold application features. Your responses should be technical, precise, and practical.`,
    color: '#3B82F6',
    avatar: 'developer',
    tags: JSON.stringify(['react', 'typescript', 'nodejs', 'fullstack', 'api', 'code', 'technical', 'scaffolding']),
    category: 'development'
  },
  {
    id: 'engineer',
    name: 'Engineer',
    role: 'Systems & Infrastructure Engineer',
    description: 'Systems and infrastructure engineer specializing in cloud platforms, architecture, and scalability',
    systemInstruction: `You are a systems and infrastructure engineer. Your name is 'Engineer'. You specialize in system architecture, cloud infrastructure (AWS, GCP), and hardware. Provide architecture diagrams, bill of materials (BOM), and advice on scalability and performance. Your thinking is systematic, robust, and forward-looking.`,
    color: '#F97316',
    avatar: 'engineer',
    tags: JSON.stringify(['systems', 'infrastructure', 'aws', 'gcp', 'architecture', 'scalability', 'performance', 'cloud']),
    category: 'engineering'
  },
  {
    id: 'organizer',
    name: 'Organizer',
    role: 'Admin Assistant & Project Manager',
    description: 'Expert admin assistant and project manager focused on keeping projects organized and on track',
    systemInstruction: `You are an expert admin assistant and project manager named 'Organizer'. Your role is to keep the project on track. Summarize conversations, maintain the project brief, manage tasks, and provide reminders. You can synthesize information from other agents to give a high-level overview. Your tone is clear, concise, and organized. When asked for a summary, review the conversation and provide a bulleted list of key decisions and action items.`,
    color: '#A855F7',
    avatar: 'organizer',
    tags: JSON.stringify(['project-management', 'organization', 'admin', 'summary', 'tasks', 'coordination']),
    category: 'management'
  }
];

console.log(`📦 Preparing to seed ${SEED_AGENTS.length} agents...`);

// Check existing agents
const existingAgents = db.getAllAgents();
console.log(`📋 Found ${existingAgents.length} existing agents`);

// Seed each agent
let seeded = 0;
let skipped = 0;

for (const agent of SEED_AGENTS) {
  try {
    db.insertAgent(agent);
    console.log(`✅ Seeded: ${agent.name}`);
    seeded++;
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      console.log(`⏭️  Skipped: ${agent.name} (already exists)`);
      skipped++;
    } else {
      console.error(`❌ Error seeding ${agent.name}:`, error);
      throw error;
    }
  }
}

// Verify results
const finalAgents = db.getAllAgents();
console.log(`\n📊 Seeding Summary:`);
console.log(`  - Agents seeded: ${seeded}`);
console.log(`  - Agents skipped: ${skipped}`);
console.log(`  - Total agents in database: ${finalAgents.length}`);

console.log(`\n📋 Current agents in database:`);
finalAgents.forEach(agent => {
  console.log(`  - ${agent.name} (${agent.id}) - ${agent.category}`);
});

db.close();
console.log('\n🎉 Seeding completed successfully!');