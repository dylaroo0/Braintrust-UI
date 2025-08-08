import AgentDatabase from '../services/database.js';
import fs from 'fs';

console.log('📤 Exporting agents from database...');

const db = new AgentDatabase('agents.db');

// Get all agents
const agents = db.getAllAgents();
console.log(`📋 Found ${agents.length} agents to export`);

// Format for export
const exportData = {
  exportedAt: new Date().toISOString(),
  totalAgents: agents.length,
  agents: agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    description: agent.description,
    systemInstruction: agent.systemInstruction,
    color: agent.color,
    avatar: agent.avatar,
    tags: JSON.parse(agent.tags || '[]'),
    category: agent.category,
    created_at: agent.created_at
  }))
};

// Write to file
const outputFile = './data/exported-agents.json';
fs.writeFileSync(outputFile, JSON.stringify(exportData, null, 2));

console.log(`✅ Exported ${agents.length} agents to ${outputFile}`);

// Show summary by category
const categories = [...new Set(agents.map(a => a.category))];
console.log(`\n📊 Agents by category:`);
categories.forEach(category => {
  const count = agents.filter(a => a.category === category).length;
  console.log(`  - ${category}: ${count} agents`);
});

// Show the original 4 agents from constants.tsx
const originalAgents = agents.filter(a => ['designer', 'developer', 'engineer', 'organizer'].includes(a.id));
console.log(`\n🎯 Original agents from constants.tsx:`);
originalAgents.forEach(agent => {
  console.log(`  - ${agent.name} (${agent.id}) - ${agent.category}`);
});

db.close();
console.log('\n🎉 Export completed successfully!');