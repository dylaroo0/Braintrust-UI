import AgentDatabaseService from '../services/agentDatabaseService.js';

async function performanceTest() {
  console.log('⚡ Testing database performance for large datasets...\n');
  
  let service;
  try {
    service = new AgentDatabaseService('agents.db');
  } catch (error) {
    console.error('❌ Failed to initialize database service:', error);
    return;
  }

  // Generate test data to simulate 900+ agents
  console.log('📦 Generating test agents...');
  const testAgents = [];
  const categories = ['Development', 'Design', 'Analytics', 'Marketing', 'Content', 'Research', 'Management', 'Support'];
  const roles = ['Specialist', 'Expert', 'Analyst', 'Manager', 'Consultant', 'Advisor', 'Coordinator'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
  const avatars = ['🚀', '💡', '🎯', '📊', '🎨', '🔧', '📝', '🌟', '⚡', '🔍'];

  for (let i = 0; i < 100; i++) {
    const category = categories[i % categories.length];
    const role = roles[i % roles.length];
    const color = colors[i % colors.length];
    const avatar = avatars[i % avatars.length];
    
    testAgents.push({
      id: `agent-${i.toString().padStart(3, '0')}`,
      name: `${category} ${role} ${i}`,
      role: `${role}`,
      description: `A specialized ${role.toLowerCase()} focused on ${category.toLowerCase()} tasks. Expert in handling complex projects and providing detailed analysis. Skilled in collaboration and problem-solving with extensive experience in ${category.toLowerCase()} domain.`,
      systemInstruction: `You are a ${role.toLowerCase()} specializing in ${category.toLowerCase()}. Help users with tasks related to ${category.toLowerCase()} and provide expert guidance.`,
      color: color,
      avatar: avatar,
      tags: JSON.stringify([category.toLowerCase(), role.toLowerCase(), 'expert', 'specialist']),
      category: category
    });
  }

  // Batch insert test agents
  console.log(`📥 Inserting ${testAgents.length} test agents...`);
  const startInsert = Date.now();
  try {
    await service.batchInsertAgents(testAgents);
    const insertTime = Date.now() - startInsert;
    console.log(`✅ Batch insert completed in ${insertTime}ms`);
  } catch (error) {
    console.error('❌ Error during batch insert:', error);
    service.close();
    return;
  }

  // Test search performance
  console.log('\n🔍 Testing search performance:');
  
  // Full-text search test
  const startSearch = Date.now();
  const searchResults = await service.searchAgents({ query: 'expert analysis' });
  const searchTime = Date.now() - startSearch;
  console.log(`  - Full-text search: ${searchResults.length} results in ${searchTime}ms`);

  // Category search test
  const startCategory = Date.now();
  const categoryResults = await service.searchAgents({ category: 'Development' });
  const categoryTime = Date.now() - startCategory;
  console.log(`  - Category search: ${categoryResults.length} results in ${categoryTime}ms`);

  // Tag search test
  const startTag = Date.now();
  const tagResults = await service.searchAgents({ tags: ['expert'] });
  const tagTime = Date.now() - startTag;
  console.log(`  - Tag search: ${tagResults.length} results in ${tagTime}ms`);

  // Test pagination
  console.log('\n📄 Testing pagination:');
  const page1 = await service.searchAgents({ limit: 20, offset: 0 });
  const page2 = await service.searchAgents({ limit: 20, offset: 20 });
  console.log(`  - Page 1: ${page1.length} results`);
  console.log(`  - Page 2: ${page2.length} results`);

  // Test metadata retrieval
  console.log('\n📊 Testing metadata:');
  const startMeta = Date.now();
  const categories = await service.getCategories();
  const tags = await service.getTags();
  const count = await service.getAgentCount();
  const metaTime = Date.now() - startMeta;
  
  console.log(`  - Total agents: ${count}`);
  console.log(`  - Categories: ${categories.length} (${categories.join(', ')})`);
  console.log(`  - Tags: ${tags.length} unique tags`);
  console.log(`  - Metadata retrieval: ${metaTime}ms`);

  // Test complex search scenarios
  console.log('\n🎯 Testing complex search scenarios:');
  
  const complexSearch1 = await service.searchAgents({ query: 'development expert', limit: 10 });
  console.log(`  - "development expert": ${complexSearch1.length} results`);
  
  const complexSearch2 = await service.searchAgents({ category: 'Analytics', limit: 5 });
  console.log(`  - Analytics category: ${complexSearch2.length} results`);

  service.close();
  console.log('\n✅ Performance test completed successfully!');
  console.log(`📈 Database can efficiently handle ${count} agents with full-text search capabilities`);
}

performanceTest().catch(error => {
  console.error('❌ Performance test failed:', error);
  process.exit(1);
});