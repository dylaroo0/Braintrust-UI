import AgentDatabaseService from '../services/agentDatabaseService.js';

async function testAgentService() {
  console.log('🧪 Testing AgentDatabaseService...\n');
  
  const service = new AgentDatabaseService('agents.db');

  // Test getting agent count
  const count = await service.getAgentCount();
  console.log(`📊 Total agents in database: ${count}`);

  // Test search functionality
  console.log('\n🔍 Testing search functionality:');
  
  // Search by text
  const searchResults = await service.searchAgents({ query: 'test' });
  console.log(`  - Text search for 'test': ${searchResults.length} results`);

  // Search by category
  const categoryResults = await service.searchAgents({ category: 'Testing' });
  console.log(`  - Category search for 'Testing': ${categoryResults.length} results`);

  // Search by tags
  const tagResults = await service.searchAgents({ tags: ['test'] });
  console.log(`  - Tag search for 'test': ${tagResults.length} results`);

  // Test getting categories
  console.log('\n📂 Testing categories:');
  const categories = await service.getCategories();
  console.log(`  - Available categories: ${categories.join(', ')}`);

  // Test getting tags
  console.log('\n🏷️ Testing tags:');
  const tags = await service.getTags();
  console.log(`  - Available tags: ${tags.join(', ')}`);

  // Test getting agent by ID
  console.log('\n🆔 Testing get by ID:');
  const agent = await service.getAgentById('test-agent');
  console.log(`  - Agent found: ${agent ? agent.name : 'Not found'}`);

  // Test adding a new agent
  console.log('\n➕ Testing add new agent:');
  const newAgent = {
    id: 'creative-writer',
    name: 'Creative Writer',
    role: 'Content Creator',
    description: 'Specializes in creative writing, storytelling, and content creation',
    systemInstruction: 'You are a creative writing expert who helps with storytelling, content creation, and creative projects.',
    color: '#9B59B6',
    avatar: '✍️',
    tags: JSON.stringify(['writing', 'creative', 'storytelling', 'content']),
    category: 'Creative'
  };

  try {
    await service.addAgent(newAgent);
    console.log(`  - Successfully added: ${newAgent.name}`);
    
    // Verify it was added
    const addedAgent = await service.getAgentById('creative-writer');
    console.log(`  - Verification: ${addedAgent ? 'Found' : 'Not found'}`);
    
    // Check updated count
    const newCount = await service.getAgentCount();
    console.log(`  - New total count: ${newCount}`);
    
  } catch (error) {
    console.log(`  - Error adding agent: ${error}`);
  }

  // Test batch insert
  console.log('\n📦 Testing batch insert:');
  const batchAgents = [
    {
      id: 'data-analyst',
      name: 'Data Analyst',
      role: 'Data Specialist',
      description: 'Expert in data analysis, visualization, and insights',
      systemInstruction: 'You are a data analysis expert who helps with data interpretation and visualization.',
      color: '#3498DB',
      avatar: '📊',
      tags: JSON.stringify(['data', 'analysis', 'visualization', 'insights']),
      category: 'Analytics'
    },
    {
      id: 'ui-designer',
      name: 'UI Designer',
      role: 'Design Specialist',
      description: 'Focuses on user interface design and user experience',
      systemInstruction: 'You are a UI/UX design expert who helps create beautiful and functional interfaces.',
      color: '#E74C3C',
      avatar: '🎨',
      tags: JSON.stringify(['design', 'ui', 'ux', 'interface']),
      category: 'Design'
    }
  ];

  try {
    await service.batchInsertAgents(batchAgents);
    console.log(`  - Successfully batch inserted ${batchAgents.length} agents`);
    
    const finalCount = await service.getAgentCount();
    console.log(`  - Final total count: ${finalCount}`);
    
  } catch (error) {
    console.log(`  - Error in batch insert: ${error}`);
  }

  // Test updated categories and tags
  console.log('\n📂 Updated categories:');
  const updatedCategories = await service.getCategories();
  console.log(`  - Categories: ${updatedCategories.join(', ')}`);

  console.log('\n🏷️ Updated tags:');
  const updatedTags = await service.getTags();
  console.log(`  - Tags: ${updatedTags.slice(0, 10).join(', ')}${updatedTags.length > 10 ? '...' : ''}`);

  service.close();
  console.log('\n✅ AgentDatabaseService test completed!');
}

testAgentService().catch(console.error);