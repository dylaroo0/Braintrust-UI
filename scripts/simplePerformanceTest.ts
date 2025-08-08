import AgentDatabase from '../services/database.js';

console.log('🧪 Simple performance test starting...');

try {
  const db = new AgentDatabase('agents.db');
  console.log('✅ Database initialized');
  
  const agents = db.getAllAgents();
  console.log(`📊 Current agent count: ${agents.length}`);
  
  // Add a few more test agents
  for (let i = 0; i < 10; i++) {
    const agent = {
      id: `perf-test-${i}`,
      name: `Performance Test Agent ${i}`,
      role: 'Test Specialist',
      description: `This is a performance test agent number ${i} designed to test database performance with multiple agents`,
      systemInstruction: 'You are a performance test agent.',
      color: '#FF6B6B',
      avatar: '⚡',
      tags: JSON.stringify(['performance', 'test', 'database']),
      category: 'Testing'
    };
    
    try {
      db.insertAgent(agent);
      console.log(`✅ Inserted agent ${i}`);
    } catch (error) {
      console.log(`⚠️ Agent ${i} already exists, skipping`);
    }
  }
  
  const finalCount = db.getAllAgents().length;
  console.log(`📈 Final agent count: ${finalCount}`);
  
  // Test search
  const searchResults = db.searchAgents('performance');
  console.log(`🔍 Search results for 'performance': ${searchResults.length}`);
  
  db.close();
  console.log('✅ Simple performance test completed!');
  
} catch (error) {
  console.error('❌ Error in performance test:', error);
}