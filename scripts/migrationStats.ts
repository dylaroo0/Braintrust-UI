import AgentDatabase from '../services/database.js';

console.log('📊 Database Migration Statistics');
console.log('================================');

const db = new AgentDatabase('agents.db');

try {
  const agents = db.getAllAgents();
  const categories = [...new Set(agents.map(a => a.category))];
  
  console.log(`\n📋 Total Agents: ${agents.length}`);
  console.log(`📂 Categories: ${categories.length}`);
  
  console.log(`\n📊 Agents by Category:`);
  categories.forEach(category => {
    const count = agents.filter(a => a.category === category).length;
    console.log(`  - ${category}: ${count} agents`);
  });
  
  // Show original agents from constants.tsx
  const originalAgents = agents.filter(a => 
    ['designer', 'developer', 'engineer', 'organizer'].includes(a.id)
  );
  
  console.log(`\n🎯 Original Agents from constants.tsx (${originalAgents.length}):`);
  originalAgents.forEach(agent => {
    console.log(`  - ${agent.name} (${agent.id}) - ${agent.category}`);
  });
  
  // Show test agents
  const testAgents = agents.filter(a => 
    a.category === 'Testing' || a.id.startsWith('test-') || a.id.startsWith('perf-')
  );
  
  console.log(`\n🧪 Test Agents (${testAgents.length}):`);
  if (testAgents.length > 0) {
    testAgents.slice(0, 5).forEach(agent => {
      console.log(`  - ${agent.name} (${agent.id})`);
    });
    if (testAgents.length > 5) {
      console.log(`  ... and ${testAgents.length - 5} more test agents`);
    }
  }
  
  console.log(`\n✅ Migration Status:`);
  console.log(`  - Original agents migrated: ${originalAgents.length}/4`);
  console.log(`  - Database ready for use: ${originalAgents.length === 4 ? 'Yes' : 'No'}`);
  console.log(`  - Test data present: ${testAgents.length > 0 ? 'Yes' : 'No'}`);

} finally {
  db.close();
}