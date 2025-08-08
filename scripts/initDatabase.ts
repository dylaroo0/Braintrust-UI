import AgentDatabase from '../services/database.js';

// Initialize the database
const db = new AgentDatabase('agents.db');

console.log('✅ Database initialized successfully!');
console.log('📊 Tables created:');
console.log('  - agents (main table)');
console.log('  - agents_fts (full-text search index)');
console.log('🔧 Triggers created for FTS synchronization');

// Test the database by inserting a sample agent
const sampleAgent = {
  id: 'test-agent',
  name: 'Test Agent',
  role: 'Testing Specialist',
  description: 'A sample agent for testing database functionality',
  systemInstruction: 'You are a test agent used for database validation.',
  color: '#FF6B6B',
  avatar: '🧪',
  tags: JSON.stringify(['test', 'database', 'sample']),
  category: 'Testing'
};

try {
  db.insertAgent(sampleAgent);
  console.log('✅ Sample agent inserted successfully');
  
  // Test retrieval
  const agents = db.getAllAgents();
  console.log(`📋 Total agents in database: ${agents.length}`);
  
  // Test search
  const searchResults = db.searchAgents('test');
  console.log(`🔍 Search results for 'test': ${searchResults.length} found`);
  
} catch (error) {
  console.error('❌ Error testing database:', error);
}

db.close();
console.log('🔒 Database connection closed');