import { AgentDatabaseServiceTest } from '../services/agentDatabaseService.test.js';

async function runTests() {
  console.log('🧪 Running AgentDatabaseService Unit Tests\n');
  
  const testRunner = new AgentDatabaseServiceTest();
  await testRunner.runAllTests();
}

runTests().catch(console.error);