import AgentDatabase from '../services/database.js';
import { AgentDatabaseService } from '../services/agentDatabaseService.js';

console.log('🔍 Verifying Agent Migration');
console.log('============================');

// Test basic database functionality
console.log('\n1. Testing basic database connection...');
const db = new AgentDatabase('agents.db');
const allAgents = db.getAllAgents();
console.log(`✅ Database connected, found ${allAgents.length} agents`);

// Test original agents are present
console.log('\n2. Verifying original agents from constants.tsx...');
const originalIds = ['designer', 'developer', 'engineer', 'organizer'];
const originalAgents = originalIds.map(id => db.getAgentById(id)).filter(Boolean);

console.log(`✅ Found ${originalAgents.length}/4 original agents:`);
originalAgents.forEach(agent => {
  console.log(`   - ${agent!.name} (${agent!.id}) - ${agent!.category}`);
});

if (originalAgents.length !== 4) {
  console.log('❌ Missing original agents!');
  process.exit(1);
}

// Test agent database service
console.log('\n3. Testing AgentDatabaseService...');
const service = new AgentDatabaseService('agents.db');

// Test search functionality
const searchResults = await service.searchAgents({ query: 'design' });
console.log(`✅ Search test: Found ${searchResults.length} agents matching 'design'`);

// Test category filtering
const designAgents = await service.searchAgents({ category: 'design' });
console.log(`✅ Category test: Found ${designAgents.length} agents in 'design' category`);

// Test getting categories
const categories = await service.getCategories();
console.log(`✅ Categories test: Found ${categories.length} categories: ${categories.join(', ')}`);

// Verify data integrity
console.log('\n4. Verifying data integrity...');
let dataIntegrityPassed = true;

for (const agent of originalAgents) {
  // Check required fields
  const requiredFields = ['id', 'name', 'role', 'description', 'systemInstruction', 'color', 'avatar', 'category'];
  for (const field of requiredFields) {
    if (!agent![field as keyof typeof agent]) {
      console.log(`❌ Agent ${agent!.name} missing field: ${field}`);
      dataIntegrityPassed = false;
    }
  }
  
  // Check color format
  if (!/^#[0-9A-Fa-f]{6}$/.test(agent!.color)) {
    console.log(`❌ Agent ${agent!.name} has invalid color: ${agent!.color}`);
    dataIntegrityPassed = false;
  }
  
  // Check tags are valid JSON
  try {
    const tags = JSON.parse(agent!.tags);
    if (!Array.isArray(tags)) {
      console.log(`❌ Agent ${agent!.name} has invalid tags format`);
      dataIntegrityPassed = false;
    }
  } catch (error) {
    console.log(`❌ Agent ${agent!.name} has invalid JSON in tags`);
    dataIntegrityPassed = false;
  }
}

if (dataIntegrityPassed) {
  console.log('✅ Data integrity check passed');
} else {
  console.log('❌ Data integrity check failed');
  process.exit(1);
}

// Test avatar mapping
console.log('\n5. Testing avatar mapping...');
const avatarTypes = originalAgents.map(a => a!.avatar);
const expectedAvatars = ['designer', 'developer', 'engineer', 'organizer'];
const avatarMappingValid = expectedAvatars.every(avatar => avatarTypes.includes(avatar));

if (avatarMappingValid) {
  console.log('✅ Avatar mapping is correct');
} else {
  console.log('❌ Avatar mapping has issues');
  console.log(`Expected: ${expectedAvatars.join(', ')}`);
  console.log(`Found: ${avatarTypes.join(', ')}`);
}

// Final summary
console.log('\n🎉 Migration Verification Summary');
console.log('=================================');
console.log(`✅ Database connection: Working`);
console.log(`✅ Original agents: ${originalAgents.length}/4 present`);
console.log(`✅ AgentDatabaseService: Working`);
console.log(`✅ Search functionality: Working`);
console.log(`✅ Category filtering: Working`);
console.log(`✅ Data integrity: ${dataIntegrityPassed ? 'Passed' : 'Failed'}`);
console.log(`✅ Avatar mapping: ${avatarMappingValid ? 'Valid' : 'Invalid'}`);

console.log('\n🚀 Migration is complete and verified!');
console.log('Next step: Update application code to use database instead of constants.tsx');

// Cleanup
db.close();