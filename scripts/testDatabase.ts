import AgentDatabase from '../services/database.js';

const db = new AgentDatabase('agents.db');

console.log('🔍 Testing database structure...');

// Test getting all agents
const agents = db.getAllAgents();
console.log(`📋 Total agents: ${agents.length}`);

if (agents.length > 0) {
  console.log('📄 Sample agent:');
  console.log(JSON.stringify(agents[0], null, 2));
}

// Test search functionality
console.log('\n🔍 Testing search...');
const searchResults = db.searchAgents('test');
console.log(`Search results for 'test': ${searchResults.length} found`);

// Test category filtering
console.log('\n📂 Testing category filtering...');
const categoryResults = db.getAgentsByCategory('Testing');
console.log(`Agents in 'Testing' category: ${categoryResults.length} found`);

// Test getting agent by ID
console.log('\n🆔 Testing get by ID...');
const agentById = db.getAgentById('test-agent');
console.log(`Agent found by ID: ${agentById ? 'Yes' : 'No'}`);

db.close();
console.log('\n✅ Database test completed!');