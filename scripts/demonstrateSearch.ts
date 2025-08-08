import AgentDatabaseService from '../services/agentDatabaseService.js';

async function demonstrateSearchCapabilities() {
  console.log('🔍 Demonstrating Enhanced Agent Search Capabilities\n');
  
  const service = new AgentDatabaseService('agents.db');

  try {
    // Get basic stats
    const totalAgents = await service.getAgentCount();
    console.log(`📊 Total agents in database: ${totalAgents}\n`);

    // Demonstrate text search
    console.log('🔤 Text Search Examples:');
    const textSearch1 = await service.searchAgents({ query: 'creative writing' });
    console.log(`  - "creative writing": ${textSearch1.total} results`);
    
    const textSearch2 = await service.searchAgents({ query: 'data analysis' });
    console.log(`  - "data analysis": ${textSearch2.total} results`);
    
    const textSearch3 = await service.searchAgents({ query: 'web development' });
    console.log(`  - "web development": ${textSearch3.total} results\n`);

    // Demonstrate category filtering
    console.log('📂 Category Filtering:');
    const categories = await service.getCategories();
    console.log(`  - Available categories: ${categories.join(', ')}`);
    
    for (const category of categories.slice(0, 3)) {
      const categoryResult = await service.searchAgents({ category });
      console.log(`  - ${category}: ${categoryResult.total} agents`);
    }
    console.log();

    // Demonstrate tag filtering
    console.log('🏷️ Tag Filtering:');
    const popularTags = await service.getPopularTags(10);
    console.log(`  - Popular tags: ${popularTags.map(t => `${t.tag}(${t.count})`).join(', ')}`);
    
    // Test specific tag searches
    const tagSearches = ['development', 'design', 'analysis'];
    for (const tag of tagSearches) {
      const tagResult = await service.searchAgents({ tags: [tag] });
      console.log(`  - Tag "${tag}": ${tagResult.total} agents`);
    }
    console.log();

    // Demonstrate advanced search
    console.log('🚀 Advanced Search (Combined Filters):');
    const advancedSearch1 = await service.advancedSearch({
      query: 'expert',
      category: 'development'
    });
    console.log(`  - Text "expert" + Category "development": ${advancedSearch1.total} results`);
    
    const advancedSearch2 = await service.advancedSearch({
      query: 'design',
      tags: ['ui', 'interface']
    });
    console.log(`  - Text "design" + Tags ["ui", "interface"]: ${advancedSearch2.total} results`);

    // Demonstrate search suggestions
    console.log('\n💡 Search Suggestions:');
    const suggestions1 = await service.getSearchSuggestions('dev', 5);
    console.log(`  - Suggestions for "dev": ${suggestions1.join(', ')}`);
    
    const suggestions2 = await service.getSearchSuggestions('design', 5);
    console.log(`  - Suggestions for "design": ${suggestions2.join(', ')}`);

    // Demonstrate pagination
    console.log('\n📄 Pagination Example:');
    const page1 = await service.searchAgents({ limit: 3, offset: 0 });
    console.log(`  - Page 1 (limit 3): ${page1.agents.length} agents, hasMore: ${page1.hasMore}`);
    
    const page2 = await service.searchAgents({ limit: 3, offset: 3 });
    console.log(`  - Page 2 (limit 3): ${page2.agents.length} agents, hasMore: ${page2.hasMore}`);

    // Performance demonstration
    console.log('\n⚡ Performance Test:');
    const startTime = Date.now();
    const performanceSearch = await service.searchAgents({ query: 'expert specialist' });
    const searchTime = Date.now() - startTime;
    console.log(`  - Searched ${performanceSearch.total} results in ${searchTime}ms`);

    // Show sample results
    if (performanceSearch.agents.length > 0) {
      console.log('\n📋 Sample Search Results:');
      performanceSearch.agents.slice(0, 3).forEach((agent, index) => {
        console.log(`  ${index + 1}. ${agent.name} (${agent.role})`);
        console.log(`     Category: ${agent.category}`);
        console.log(`     Tags: ${JSON.parse(agent.tags).join(', ')}`);
        console.log(`     Description: ${agent.description.substring(0, 80)}...`);
        console.log();
      });
    }

  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  } finally {
    service.close();
  }

  console.log('✅ Search capabilities demonstration completed!');
}

demonstrateSearchCapabilities().catch(console.error);