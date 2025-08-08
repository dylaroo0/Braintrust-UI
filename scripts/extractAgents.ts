import { AGENTS, ORGANIZER_AGENT } from '../constants';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface SerializableAgent {
  id: string;
  name: string;
  role: string;
  systemInstruction: string;
  color: string;
  avatar: string; // Convert React element to string identifier
  category: string;
  tags: string[];
}

/**
 * Extract current hardcoded agents and convert them to serializable format
 */
function extractCurrentAgents(): SerializableAgent[] {
  const allAgents = [...AGENTS, ORGANIZER_AGENT];
  
  return allAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    systemInstruction: agent.systemInstruction,
    color: agent.color,
    avatar: getAvatarIdentifier(agent.id),
    category: getCategoryFromRole(agent.role),
    tags: getTagsFromRole(agent.role)
  }));
}

/**
 * Map agent ID to avatar identifier
 */
function getAvatarIdentifier(agentId: string): string {
  const avatarMap: Record<string, string> = {
    'designer': 'DesignerIcon',
    'developer': 'DeveloperIcon', 
    'engineer': 'EngineerIcon',
    'organizer': 'OrganizerIcon'
  };
  
  return avatarMap[agentId] || 'DefaultIcon';
}

/**
 * Derive category from agent role
 */
function getCategoryFromRole(role: string): string {
  if (role.includes('Designer') || role.includes('Visual')) return 'Design';
  if (role.includes('Developer') || role.includes('Software')) return 'Development';
  if (role.includes('Engineer') || role.includes('Infrastructure')) return 'Engineering';
  if (role.includes('Manager') || role.includes('Admin')) return 'Management';
  return 'General';
}

/**
 * Generate relevant tags from agent role and system instruction
 */
function getTagsFromRole(role: string): string[] {
  const tags: string[] = [];
  
  if (role.includes('UI/UX')) tags.push('ui', 'ux', 'design');
  if (role.includes('Visual')) tags.push('visual', 'creative');
  if (role.includes('Full-Stack')) tags.push('fullstack', 'frontend', 'backend');
  if (role.includes('Software')) tags.push('software', 'coding');
  if (role.includes('Systems')) tags.push('systems', 'architecture');
  if (role.includes('Infrastructure')) tags.push('infrastructure', 'devops');
  if (role.includes('Manager')) tags.push('management', 'organization');
  if (role.includes('Admin')) tags.push('admin', 'coordination');
  
  return tags;
}

/**
 * Main extraction function
 */
function main() {
  try {
    console.log('Extracting current hardcoded agents...');
    
    const extractedAgents = extractCurrentAgents();
    
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    
    // Write extracted agents to JSON file
    const outputPath = join(dataDir, 'extracted-agents.json');
    writeFileSync(outputPath, JSON.stringify(extractedAgents, null, 2));
    
    console.log(`✅ Successfully extracted ${extractedAgents.length} agents to ${outputPath}`);
    console.log('Extracted agents:');
    extractedAgents.forEach(agent => {
      console.log(`  - ${agent.name} (${agent.id}): ${agent.role}`);
    });
    
  } catch (error) {
    console.error('❌ Error extracting agents:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { extractCurrentAgents, SerializableAgent };