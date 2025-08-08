import AgentDatabaseService, { AgentSearchOptions } from './agentDatabaseService.js';
import { Agent } from './database.js';
import fs from 'fs';
import path from 'path';

// Test database path
const TEST_DB_PATH = 'test-agents.db';

// Test data
const testAgents: Omit<Agent, 'created_at'>[] = [
  {
    id: 'test-writer',
    name: 'Creative Writer',
    role: 'Content Creator',
    description: 'Specializes in creative writing, storytelling, and content creation for various media',
    systemInstruction: 'You are a creative writing expert who helps with storytelling and content creation.',
    color: '#9B59B6',
    avatar: '✍️',
    tags: JSON.stringify(['writing', 'creative', 'storytelling', 'content']),
    category: 'Creative'
  },
  {
    id: 'test-developer',
    name: 'Full Stack Developer',
    role: 'Software Engineer',
    description: 'Expert in full-stack web development, APIs, databases, and modern frameworks',
    systemInstruction: 'You are a full-stack developer expert who helps with web development projects.',
    color: '#3498DB',
    avatar: '💻',
    tags: JSON.stringify(['development', 'programming', 'web', 'fullstack', 'apis']),
    category: 'Development'
  },
  {
    id: 'test-designer',
    name: 'UI/UX Designer',
    role: 'Design Specialist',
    description: 'Focuses on user interface design, user experience, and visual design principles',
    systemInstruction: 'You are a UI/UX design expert who creates beautiful and functional interfaces.',
    color: '#E74C3C',
    avatar: '🎨',
    tags: JSON.stringify(['design', 'ui', 'ux', 'interface', 'visual']),
    category: 'Design'
  },
  {
    id: 'test-analyst',
    name: 'Data Analyst',
    role: 'Analytics Expert',
    description: 'Expert in data analysis, visualization, statistical modeling, and business insights',
    systemInstruction: 'You are a data analysis expert who helps interpret data and create insights.',
    color: '#27AE60',
    avatar: '📊',
    tags: JSON.stringify(['data', 'analysis', 'visualization', 'statistics', 'insights']),
    category: 'Analytics'
  },
  {
    id: 'test-marketer',
    name: 'Digital Marketer',
    role: 'Marketing Specialist',
    description: 'Specializes in digital marketing, content strategy, SEO, and social media marketing',
    systemInstruction: 'You are a digital marketing expert who helps with marketing strategies and campaigns.',
    color: '#F39C12',
    avatar: '📈',
    tags: JSON.stringify(['marketing', 'digital', 'seo', 'social', 'strategy']),
    category: 'Marketing'
  }
];

class AgentDatabaseServiceTest {
  private service: AgentDatabaseService;
  private testResults: { [key: string]: boolean } = {};

  constructor() {
    // Clean up any existing test database
    this.cleanupTestDb();
    this.service = new AgentDatabaseService(TEST_DB_PATH);
  }

  private cleanupTestDb(): void {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  }

  private assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  private async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    try {
      console.log(`🧪 Running test: ${testName}`);
      await testFn();
      this.testResults[testName] = true;
      console.log(`✅ ${testName} passed`);
    } catch (error) {
      this.testResults[testName] = false;
      console.error(`❌ ${testName} failed:`, error);
    }
  }

  async testBasicOperations(): Promise<void> {
    // Test initial empty state
    const initialCount = await this.service.getAgentCount();
    this.assert(initialCount === 0, 'Initial database should be empty');

    // Test adding a single agent
    await this.service.addAgent(testAgents[0]);
    const countAfterAdd = await this.service.getAgentCount();
    this.assert(countAfterAdd === 1, 'Count should be 1 after adding one agent');

    // Test getting agent by ID
    const retrievedAgent = await this.service.getAgentById('test-writer');
    this.assert(retrievedAgent !== null, 'Should retrieve added agent');
    this.assert(retrievedAgent!.name === 'Creative Writer', 'Retrieved agent should have correct name');

    // Test batch insert
    await this.service.batchInsertAgents(testAgents.slice(1));
    const finalCount = await this.service.getAgentCount();
    this.assert(finalCount === testAgents.length, `Should have ${testAgents.length} agents after batch insert`);
  }

  async testSearchFunctionality(): Promise<void> {
    // Test text search
    const searchResult = await this.service.searchAgents({ query: 'creative writing' });
    this.assert(searchResult.agents.length > 0, 'Should find agents with creative writing');
    this.assert(searchResult.total > 0, 'Total should be greater than 0');
    this.assert(typeof searchResult.hasMore === 'boolean', 'hasMore should be boolean');

    // Test category search
    const categoryResult = await this.service.searchAgents({ category: 'Development' });
    this.assert(categoryResult.agents.length > 0, 'Should find agents in Development category');
    this.assert(categoryResult.agents.every(agent => agent.category === 'Development'), 'All results should be in Development category');

    // Test tag search
    const tagResult = await this.service.searchAgents({ tags: ['design'] });
    this.assert(tagResult.agents.length > 0, 'Should find agents with design tag');

    // Test pagination
    const paginatedResult = await this.service.searchAgents({ limit: 2, offset: 0 });
    this.assert(paginatedResult.agents.length <= 2, 'Should respect limit parameter');

    // Test advanced search
    const advancedResult = await this.service.advancedSearch({ 
      query: 'expert', 
      category: 'Analytics' 
    });
    this.assert(advancedResult.agents.length > 0, 'Advanced search should work');
  }

  async testCategoriesAndTags(): Promise<void> {
    // Test getting categories
    const categories = await this.service.getCategories();
    this.assert(categories.length > 0, 'Should have categories');
    this.assert(categories.includes('Creative'), 'Should include Creative category');
    this.assert(categories.includes('Development'), 'Should include Development category');

    // Test getting tags
    const tags = await this.service.getTags();
    this.assert(tags.length > 0, 'Should have tags');
    this.assert(tags.includes('writing'), 'Should include writing tag');
    this.assert(tags.includes('development'), 'Should include development tag');

    // Test category counts
    const categoryCounts = await this.service.getAgentCountByCategory();
    this.assert(Object.keys(categoryCounts).length > 0, 'Should have category counts');
    this.assert(categoryCounts['Creative'] > 0, 'Creative category should have agents');

    // Test popular tags
    const popularTags = await this.service.getPopularTags(5);
    this.assert(popularTags.length > 0, 'Should have popular tags');
    this.assert(popularTags[0].count > 0, 'Popular tags should have counts');
  }

  async testSearchSuggestions(): Promise<void> {
    // Test search suggestions
    const suggestions = await this.service.getSearchSuggestions('dev', 5);
    this.assert(suggestions.length > 0, 'Should provide search suggestions');
    this.assert(suggestions.some(s => s.toLowerCase().includes('dev')), 'Suggestions should include dev-related terms');

    // Test empty suggestions for short query
    const emptySuggestions = await this.service.getSearchSuggestions('a', 5);
    this.assert(emptySuggestions.length === 0, 'Should not provide suggestions for very short queries');
  }

  async testUpdateAndDelete(): Promise<void> {
    // Test update agent
    const updateResult = await this.service.updateAgent('test-writer', {
      name: 'Updated Creative Writer',
      description: 'Updated description for creative writing specialist'
    });
    this.assert(updateResult === true, 'Update should succeed');

    // Verify update
    const updatedAgent = await this.service.getAgentById('test-writer');
    this.assert(updatedAgent!.name === 'Updated Creative Writer', 'Agent name should be updated');
    this.assert(updatedAgent!.description.includes('Updated description'), 'Agent description should be updated');

    // Test delete agent
    const deleteResult = await this.service.deleteAgent('test-writer');
    this.assert(deleteResult === true, 'Delete should succeed');

    // Verify deletion
    const deletedAgent = await this.service.getAgentById('test-writer');
    this.assert(deletedAgent === null, 'Deleted agent should not be found');

    // Verify count decreased
    const countAfterDelete = await this.service.getAgentCount();
    this.assert(countAfterDelete === testAgents.length - 1, 'Count should decrease after deletion');
  }

  async testErrorHandling(): Promise<void> {
    // Test getting non-existent agent
    const nonExistentAgent = await this.service.getAgentById('non-existent');
    this.assert(nonExistentAgent === null, 'Should return null for non-existent agent');

    // Test updating non-existent agent
    const updateNonExistent = await this.service.updateAgent('non-existent', { name: 'Test' });
    this.assert(updateNonExistent === false, 'Should return false when updating non-existent agent');

    // Test deleting non-existent agent
    const deleteNonExistent = await this.service.deleteAgent('non-existent');
    this.assert(deleteNonExistent === false, 'Should return false when deleting non-existent agent');

    // Test empty search query
    const emptySearchResult = await this.service.searchAgents({ query: '' });
    this.assert(emptySearchResult.agents.length > 0, 'Empty query should return all agents');
  }

  async testPerformance(): Promise<void> {
    // Add more test data for performance testing
    const largeDataSet: Omit<Agent, 'created_at'>[] = [];
    for (let i = 0; i < 100; i++) {
      largeDataSet.push({
        id: `perf-agent-${i}`,
        name: `Performance Agent ${i}`,
        role: `Role ${i % 10}`,
        description: `Performance test agent ${i} with various keywords for testing search functionality`,
        systemInstruction: `System instruction for performance agent ${i}`,
        color: '#000000',
        avatar: '🔧',
        tags: JSON.stringify([`tag${i % 5}`, `category${i % 3}`, 'performance']),
        category: `Category${i % 5}`
      });
    }

    const startTime = Date.now();
    await this.service.batchInsertAgents(largeDataSet);
    const insertTime = Date.now() - startTime;

    console.log(`📊 Performance: Inserted ${largeDataSet.length} agents in ${insertTime}ms`);

    // Test search performance
    const searchStartTime = Date.now();
    const searchResult = await this.service.searchAgents({ query: 'performance test' });
    const searchTime = Date.now() - searchStartTime;

    console.log(`📊 Performance: Searched ${searchResult.total} results in ${searchTime}ms`);

    this.assert(insertTime < 5000, 'Batch insert should complete within 5 seconds');
    this.assert(searchTime < 1000, 'Search should complete within 1 second');
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting AgentDatabaseService tests...\n');

    await this.runTest('Basic Operations', () => this.testBasicOperations());
    await this.runTest('Search Functionality', () => this.testSearchFunctionality());
    await this.runTest('Categories and Tags', () => this.testCategoriesAndTags());
    await this.runTest('Search Suggestions', () => this.testSearchSuggestions());
    await this.runTest('Update and Delete', () => this.testUpdateAndDelete());
    await this.runTest('Error Handling', () => this.testErrorHandling());
    await this.runTest('Performance', () => this.testPerformance());

    // Print summary
    console.log('\n📋 Test Summary:');
    const totalTests = Object.keys(this.testResults).length;
    const passedTests = Object.values(this.testResults).filter(result => result).length;
    const failedTests = totalTests - passedTests;

    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests === 0) {
      console.log('\n🎉 All tests passed!');
    } else {
      console.log('\n⚠️ Some tests failed. Check the output above for details.');
    }

    // Cleanup
    this.service.close();
    this.cleanupTestDb();
  }
}

// Export for use in other files
export { AgentDatabaseServiceTest };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testRunner = new AgentDatabaseServiceTest();
  testRunner.runAllTests().catch(console.error);
}