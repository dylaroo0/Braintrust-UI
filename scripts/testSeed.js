const AgentDatabase = require('../services/database.js').default;

console.log('Testing seed functionality...');

try {
  const db = new AgentDatabase('agents.db');
  console.log('✅ Database connection established');
  
  // Test inserting one agent
  const testAgent = {
    id: 'test-designer',
    name: 'Test Designer',
    role: 'Visual Artist & UI/UX Expert',
    description: 'Test agent for migration',
    systemInstruction: 'You are a test designer agent.',
    color: '#06B6D4',
    avatar: 'designer',
    tags: JSON.stringify(['test', 'ui', 'ux']),
    category: 'design'
  };
  
  try {
    db.insertAgent(testAgent);
    console.log('✅ Test agent inserted successfully');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
      console.log('ℹ️ Test agent already exists');
    } else {
      throw error;
    }
  }
  
  // Get all agents
  const agents = db.getAllAgents();
  console.log(`📊 Total agents in database: ${agents.length}`);
  
  agents.forEach(agent => {
    console.log(`  - ${agent.name} (${agent.id})`);
  });
  
  db.close();
  console.log('✅ Test completed successfully');
  
} catch (error) {
  console.error('❌ Test failed:', error);
  process.exit(1);
}