const fs = require('fs');
const path = require('path');

// Function to convert JSON agent to our Agent interface
const convertJsonAgent = (jsonData, fileName) => {
  const agentId = fileName.replace('.json', '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  // Extract category from agent name or description
  const getCategory = (name, description) => {
    const lowerName = name.toLowerCase();
    const lowerDesc = description.toLowerCase();
    
    if (lowerName.includes('ai') || lowerDesc.includes('artificial intelligence')) return 'AI';
    if (lowerName.includes('data') || lowerDesc.includes('data')) return 'Data';
    if (lowerName.includes('business') || lowerDesc.includes('business')) return 'Business';
    if (lowerName.includes('code') || lowerName.includes('development') || lowerDesc.includes('programming')) return 'Development';
    if (lowerName.includes('design') || lowerDesc.includes('design')) return 'Design';
    if (lowerName.includes('marketing') || lowerDesc.includes('marketing')) return 'Marketing';
    if (lowerName.includes('writing') || lowerDesc.includes('content')) return 'Content';
    if (lowerName.includes('automation') || lowerDesc.includes('workflow')) return 'Automation';
    if (lowerName.includes('security') || lowerDesc.includes('security')) return 'Security';
    if (lowerName.includes('research') || lowerDesc.includes('research')) return 'Research';
    if (lowerName.includes('email') || lowerDesc.includes('email')) return 'Communication';
    if (lowerName.includes('legal') || lowerDesc.includes('legal')) return 'Legal';
    if (lowerName.includes('finance') || lowerDesc.includes('financial')) return 'Finance';
    if (lowerName.includes('health') || lowerDesc.includes('medical')) return 'Healthcare';
    if (lowerName.includes('education') || lowerDesc.includes('learning')) return 'Education';
    return 'General';
  };

  // Generate avatar based on category/name
  const getAvatar = (name, category) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('ai')) return '🤖';
    if (lowerName.includes('data')) return '📊';
    if (lowerName.includes('security')) return '🔒';
    if (lowerName.includes('design')) return '🎨';
    if (lowerName.includes('writing') || lowerName.includes('content')) return '✍️';
    if (lowerName.includes('code') || lowerName.includes('development')) return '💻';
    if (lowerName.includes('business')) return '💼';
    if (lowerName.includes('marketing')) return '📈';
    if (lowerName.includes('research')) return '🔬';
    if (lowerName.includes('automation')) return '⚙️';
    if (lowerName.includes('email')) return '📧';
    if (lowerName.includes('legal')) return '⚖️';
    if (lowerName.includes('finance')) return '💰';
    if (lowerName.includes('health') || lowerName.includes('medical')) return '🏥';
    if (lowerName.includes('education') || lowerName.includes('learning')) return '🎓';
    return '🎯'; // Default
  };

  // Generate color based on category
  const getColor = (category) => {
    switch (category) {
      case 'AI': return '#8B5CF6';
      case 'Data': return '#10B981';
      case 'Business': return '#F59E0B';
      case 'Development': return '#3B82F6';
      case 'Design': return '#EC4899';
      case 'Marketing': return '#F97316';
      case 'Content': return '#84CC16';
      case 'Automation': return '#6366F1';
      case 'Security': return '#EF4444';
      case 'Research': return '#06B6D4';
      case 'Communication': return '#14B8A6';
      case 'Legal': return '#7C3AED';
      case 'Finance': return '#059669';
      case 'Healthcare': return '#DC2626';
      case 'Education': return '#0891B2';
      default: return '#6B7280';
    }
  };

  const category = getCategory(jsonData.agentname || '', jsonData.description || '');
  
  return {
    id: agentId,
    name: jsonData.agentname || 'Unknown Agent',
    role: `${category} Specialist`,
    avatar: getAvatar(jsonData.agentname || '', category),
    systemInstruction: jsonData.systemprompt || jsonData.description || 'AI assistant specialized in helping users.',
    color: getColor(category),
  };
};

// Read all JSON files from the agents directory
const agentsDir = path.join(__dirname, '..', 'agent specalist', 'json_agents');
const outputFile = path.join(__dirname, '..', 'data', 'all-agents.json');

console.log('Reading agents from:', agentsDir);
console.log('Output file:', outputFile);

try {
  const files = fs.readdirSync(agentsDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  console.log(`Found ${jsonFiles.length} JSON files`);
  
  const agents = [];
  let processed = 0;
  let errors = 0;
  
  for (const file of jsonFiles) {
    try {
      const filePath = path.join(agentsDir, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(rawData);
      
      const agent = convertJsonAgent(jsonData, file);
      agents.push(agent);
      processed++;
      
      if (processed % 100 === 0) {
        console.log(`Processed ${processed}/${jsonFiles.length} agents...`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
      errors++;
    }
  }
  
  // Ensure data directory exists
  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Write the converted agents to a JSON file
  fs.writeFileSync(outputFile, JSON.stringify(agents, null, 2));
  
  console.log(`\n✅ Successfully processed ${processed} agents!`);
  console.log(`❌ ${errors} errors encountered`);
  console.log(`📄 Output saved to: ${outputFile}`);
  
  // Show category breakdown
  const categories = {};
  agents.forEach(agent => {
    const category = agent.role.split(' ')[0];
    categories[category] = (categories[category] || 0) + 1;
  });
  
  console.log('\n📊 Category Breakdown:');
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} agents`);
    });
    
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}