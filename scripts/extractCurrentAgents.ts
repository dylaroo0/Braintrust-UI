import fs from 'fs';
import path from 'path';

/**
 * Script to extract current hardcoded agents from constants.tsx
 * and prepare them for database migration
 */

// This represents the current hardcoded agents from constants.tsx
const CURRENT_AGENTS = [
  {
    id: 'designer',
    name: 'Designer',
    role: 'Visual Artist & UI/UX Expert',
    systemInstruction: `You are a world-class UI/UX designer and visual artist. Your name is 'Designer'. Provide expert advice on aesthetics, user flows, and visual design. Generate SVG mockups, color palettes, and creative concepts. Your tone is creative, inspiring, and user-centric.`,
    color: '#06B6D4', // cyan-500
    category: 'design',
    tags: ['ui', 'ux', 'visual', 'creative', 'design', 'aesthetics', 'mockups', 'color-palettes'],
    description: 'World-class UI/UX designer and visual artist specializing in aesthetics, user flows, and creative concepts',
    avatarType: 'designer',
    isPermanent: false
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Full-Stack Software Developer',
    systemInstruction: `You are a senior full-stack software developer. Your name is 'Developer'. Your expertise is in React, TypeScript, Node.js, and API design. Provide clean, efficient code snippets, explain complex logic, and help scaffold application features. Your responses should be technical, precise, and practical.`,
    color: '#3B82F6', // blue-500
    category: 'development',
    tags: ['react', 'typescript', 'nodejs', 'fullstack', 'api', 'code', 'technical', 'scaffolding'],
    description: 'Senior full-stack software developer with expertise in React, TypeScript, Node.js, and API design',
    avatarType: 'developer',
    isPermanent: false
  },
  {
    id: 'engineer',
    name: 'Engineer',
    role: 'Systems & Infrastructure Engineer',
    systemInstruction: `You are a systems and infrastructure engineer. Your name is 'Engineer'. You specialize in system architecture, cloud infrastructure (AWS, GCP), and hardware. Provide architecture diagrams, bill of materials (BOM), and advice on scalability and performance. Your thinking is systematic, robust, and forward-looking.`,
    color: '#F97316', // orange-500
    category: 'engineering',
    tags: ['systems', 'infrastructure', 'aws', 'gcp', 'architecture', 'scalability', 'performance', 'cloud'],
    description: 'Systems and infrastructure engineer specializing in cloud platforms, architecture, and scalability',
    avatarType: 'engineer',
    isPermanent: false
  },
  {
    id: 'organizer',
    name: 'Organizer',
    role: 'Admin Assistant & Project Manager',
    systemInstruction: `You are an expert admin assistant and project manager named 'Organizer'. Your role is to keep the project on track. Summarize conversations, maintain the project brief, manage tasks, and provide reminders. You can synthesize information from other agents to give a high-level overview. Your tone is clear, concise, and organized. When asked for a summary, review the conversation and provide a bulleted list of key decisions and action items.`,
    color: '#A855F7', // purple-500
    category: 'management',
    tags: ['project-management', 'organization', 'admin', 'summary', 'tasks', 'coordination'],
    description: 'Expert admin assistant and project manager focused on keeping projects organized and on track',
    avatarType: 'organizer',
    isPermanent: true // This agent is always present
  }
];

/**
 * Extract and save current agents to JSON file
 */
export function extractCurrentAgents(): void {
  const outputDir = './data';
  const outputFile = path.join(outputDir, 'extracted-agents.json');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Add metadata
  const extractedData = {
    extractedAt: new Date().toISOString(),
    source: 'constants.tsx',
    description: 'Agents extracted from hardcoded constants for database migration',
    totalAgents: CURRENT_AGENTS.length,
    agents: CURRENT_AGENTS
  };
  
  // Write to file
  fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
  
  console.log(`Extracted ${CURRENT_AGENTS.length} agents to ${outputFile}`);
  console.log('Agents extracted:');
  CURRENT_AGENTS.forEach(agent => {
    console.log(`  - ${agent.name} (${agent.id}) - ${agent.category}`);
  });
}

/**
 * Generate TypeScript interface for the Agent type based on extracted data
 */
export function generateAgentInterface(): string {
  return `
// Generated Agent interface based on extracted data
export interface DatabaseAgent {
  id: string;
  name: string;
  role: string;
  systemInstruction: string;
  color: string;
  category: string;
  tags: string[];
  description: string;
  avatarType: string;
  isPermanent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Agent categories found in current data
export type AgentCategory = ${CURRENT_AGENTS.map(a => `'${a.category}'`).join(' | ')};

// Avatar types found in current data
export type AvatarType = ${CURRENT_AGENTS.map(a => `'${a.avatarType}'`).join(' | ')};
`;
}

/**
 * Create a mapping file for avatar components
 */
export function createAvatarMapping(): void {
  const outputFile = './data/avatar-mapping.ts';
  
  const mappingContent = `
import { DesignerIcon, DeveloperIcon, EngineerIcon, OrganizerIcon } from '../components/icons';

/**
 * Mapping of avatar types to their corresponding React components
 * This maintains the connection between database avatar_type and UI components
 */
export const AVATAR_COMPONENTS = {
  designer: DesignerIcon,
  developer: DeveloperIcon,
  engineer: EngineerIcon,
  organizer: OrganizerIcon,
} as const;

export type AvatarType = keyof typeof AVATAR_COMPONENTS;

/**
 * Get the avatar component for a given avatar type
 */
export function getAvatarComponent(avatarType: AvatarType) {
  return AVATAR_COMPONENTS[avatarType];
}
`;
  
  // Ensure data directory exists
  if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
  }
  
  fs.writeFileSync(outputFile, mappingContent);
  console.log(`Created avatar mapping file: ${outputFile}`);
}

/**
 * Generate migration summary report
 */
export function generateMigrationReport(): void {
  const report = `
# Agent Migration Report

## Current State Analysis
- **Total Agents**: ${CURRENT_AGENTS.length}
- **Categories**: ${[...new Set(CURRENT_AGENTS.map(a => a.category))].join(', ')}
- **Permanent Agents**: ${CURRENT_AGENTS.filter(a => a.isPermanent).length}
- **Regular Agents**: ${CURRENT_AGENTS.filter(a => !a.isPermanent).length}

## Agent Breakdown
${CURRENT_AGENTS.map(agent => `
### ${agent.name} (${agent.id})
- **Role**: ${agent.role}
- **Category**: ${agent.category}
- **Color**: ${agent.color}
- **Tags**: ${agent.tags.join(', ')}
- **Permanent**: ${agent.isPermanent ? 'Yes' : 'No'}
- **Description**: ${agent.description}
`).join('')}

## Migration Tasks Completed
- [x] Extracted hardcoded agents from constants.tsx
- [x] Created seed data script (seedAgents.ts)
- [x] Created comprehensive migration utilities (agentMigration.ts)
- [x] Added npm scripts for easy migration operations
- [x] Created avatar component mapping system
- [x] Generated TypeScript interfaces for database agents

## Next Steps
1. Run database initialization: \`npm run init:db\`
2. Seed the database with extracted agents: \`npm run seed:agents seed\`
3. Test the agent database service: \`npm run test:service\`
4. Update application code to use database instead of constants
5. Remove hardcoded AGENTS from constants.tsx

## Available Commands
- \`npm run seed:agents seed\` - Populate database with initial agents
- \`npm run seed:agents export\` - Export current database agents to JSON
- \`npm run migrate:agents export <file>\` - Export agents to file
- \`npm run migrate:agents import <file>\` - Import agents from file
- \`npm run migrate:agents backup\` - Create timestamped backup
- \`npm run migrate:agents export-csv <file>\` - Export to CSV format

Generated on: ${new Date().toISOString()}
`;
  
  fs.writeFileSync('./AGENT_MIGRATION_REPORT.md', report);
  console.log('Generated migration report: ./AGENT_MIGRATION_REPORT.md');
}

// Run extraction if called directly
if (require.main === module) {
  console.log('Starting agent extraction process...');
  
  extractCurrentAgents();
  createAvatarMapping();
  
  // Generate TypeScript interface file
  const interfaceContent = generateAgentInterface();
  fs.writeFileSync('./data/agent-types.ts', interfaceContent);
  console.log('Generated TypeScript interfaces: ./data/agent-types.ts');
  
  generateMigrationReport();
  
  console.log('\nExtraction completed successfully!');
  console.log('Next steps:');
  console.log('1. Run: npm run init:db');
  console.log('2. Run: npm run seed:agents seed');
  console.log('3. Test: npm run test:service');
}