import AgentDatabase from '../services/database.js';

console.log('🌱 Correct Agent Seeding (3 Draggable Agents Only)');
console.log('==================================================');

const db = new AgentDatabase('agents.db');

// Define ONLY the 3 draggable agents (NOT the Organizer)
// The Organizer should remain as ORGANIZER_AGENT in constants.tsx
const DRAGGABLE_AGENTS = [
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
  }
];

console.log(`📦 Seeding ${DRAGGABLE_AGENTS.length} draggable agents (NOT including Organizer)...`);
console.log(`⚠️  Note: Organizer should remain as ORGANIZER_AGENT in constants.tsx`);

// Check existing agents
const existingAgents = db.getAllAgents();
console.log(`📋 Found ${existingAgents.length} existing agents in database`);

// Check if Organizer is incorrectly in database
const organizerInDb = db.getAgentById('organizer');
if (organizerInDb) {
  console.log(`⚠️  WARNING: Organizer found in database (this is incorrect architecture)`);
  console.log(`   The Organizer should be ORGANIZER_AGENT constant, not in database`);
}

// Seed each draggable agent
let seeded = 0;
let skipped = 0;

for (const agent of DRAGGABLE_AGENTS) {
  try {
    db.insertAgent(agent);
    console.log(`✅ Seeded: ${agent.name} (draggable agent)`);
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
const draggableInDb = DRAGGABLE_AGENTS.map(a => db.getAgentById(a.id)).filter(Boolean);

console.log(`\n📊 Seeding Summary:`);
console.log(`  - Draggable agents seeded: ${seeded}`);
console.log(`  - Draggable agents skipped: ${skipped}`);
console.log(`  - Total agents in database: ${finalAgents.length}`);
console.log(`  - Draggable agents in database: ${draggableInDb.length}/3`);

console.log(`\n🎯 Correct Architecture Verification:`);
console.log(`✅ Draggable agents in database:`);
draggableInDb.forEach(agent => {
  console.log(`   - ${agent!.name} (${agent!.id}) - ${agent!.category}`);
});

console.log(`\n✅ Organizer status:`);
if (organizerInDb) {
  console.log(`   ⚠️  Organizer is in database (should be removed for correct architecture)`);
  console.log(`   📝 Organizer should only exist as ORGANIZER_AGENT in constants.tsx`);
} else {
  console.log(`   ✅ Organizer correctly NOT in database`);
  console.log(`   📝 Organizer exists as ORGANIZER_AGENT in constants.tsx (correct)`);
}

console.log(`\n🏗️  Correct System Architecture:`);
console.log(`   📁 Database: 3 draggable agents (Designer, Developer, Engineer)`);
console.log(`   📄 constants.tsx: ORGANIZER_AGENT (permanent Super-Brain)`);
console.log(`   🎯 UI: Draggable circles from database + permanent Organizer`);

db.close();
console.log('\n🎉 Correct seeding completed!');