import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { SerializableAgent } from './extractAgents';
import { AgentSeedData } from './seedAgentData';

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

interface ExportResult {
  success: boolean;
  exported: number;
  filePath: string;
}

/**
 * Import agents from JSON file
 */
function importAgents(filePath: string, options: {
  overwrite?: boolean;
  validateSchema?: boolean;
} = {}): ImportResult {
  const result: ImportResult = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: []
  };
  
  try {
    // Check if file exists
    if (!existsSync(filePath)) {
      result.errors.push(`Import file not found: ${filePath}`);
      return result;
    }
    
    // Read and parse file
    const fileContent = readFileSync(filePath, 'utf-8');
    let importData: SerializableAgent[] | AgentSeedData;
    
    try {
      importData = JSON.parse(fileContent);
    } catch (parseError) {
      result.errors.push(`Invalid JSON format: ${parseError}`);
      return result;
    }
    
    // Handle different import formats
    let agentsToImport: SerializableAgent[];
    if (Array.isArray(importData)) {
      agentsToImport = importData;
    } else if ('agents' in importData) {
      agentsToImport = importData.agents;
    } else {
      result.errors.push('Invalid import format. Expected array of agents or seed data object.');
      return result;
    }
    
    // Validate agents if requested
    if (options.validateSchema) {
      for (const agent of agentsToImport) {
        const validation = validateAgentSchema(agent);
        if (!validation.valid) {
          result.errors.push(`Invalid agent ${agent.id}: ${validation.errors.join(', ')}`);
          continue;
        }
      }
    }
    
    // Load existing agents
    const existingAgents = loadExistingAgents();
    const existingIds = new Set(existingAgents.map(a => a.id));
    
    // Process import
    const finalAgents = [...existingAgents];
    
    for (const agent of agentsToImport) {
      if (existingIds.has(agent.id)) {
        if (options.overwrite) {
          // Replace existing agent
          const index = finalAgents.findIndex(a => a.id === agent.id);
          finalAgents[index] = agent;
          result.imported++;
        } else {
          result.skipped++;
        }
      } else {
        // Add new agent
        finalAgents.push(agent);
        result.imported++;
      }
    }
    
    // Save updated agents
    saveAgents(finalAgents);
    result.success = true;
    
  } catch (error) {
    result.errors.push(`Import failed: ${error}`);
  }
  
  return result;
}

/**
 * Export agents to JSON file
 */
function exportAgents(outputPath: string, options: {
  format?: 'array' | 'seed-data';
  agents?: SerializableAgent[];
  includeMetadata?: boolean;
} = {}): ExportResult {
  const result: ExportResult = {
    success: false,
    exported: 0,
    filePath: outputPath
  };
  
  try {
    // Get agents to export
    const agentsToExport = options.agents || loadExistingAgents();
    
    // Prepare export data
    let exportData: any;
    if (options.format === 'seed-data') {
      exportData = {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        exportedBy: 'agentImportExport',
        totalAgents: agentsToExport.length,
        agents: agentsToExport
      };
    } else {
      exportData = agentsToExport;
    }
    
    // Write to file
    writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    
    result.success = true;
    result.exported = agentsToExport.length;
    
  } catch (error) {
    console.error(`Export failed: ${error}`);
  }
  
  return result;
}

/**
 * Validate agent schema
 */
function validateAgentSchema(agent: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields
  if (!agent.id || typeof agent.id !== 'string') {
    errors.push('Missing or invalid id');
  }
  if (!agent.name || typeof agent.name !== 'string') {
    errors.push('Missing or invalid name');
  }
  if (!agent.role || typeof agent.role !== 'string') {
    errors.push('Missing or invalid role');
  }
  if (!agent.systemInstruction || typeof agent.systemInstruction !== 'string') {
    errors.push('Missing or invalid systemInstruction');
  }
  if (!agent.color || typeof agent.color !== 'string') {
    errors.push('Missing or invalid color');
  }
  if (!agent.avatar || typeof agent.avatar !== 'string') {
    errors.push('Missing or invalid avatar');
  }
  
  // Optional but typed fields
  if (agent.category && typeof agent.category !== 'string') {
    errors.push('Invalid category type');
  }
  if (agent.tags && !Array.isArray(agent.tags)) {
    errors.push('Invalid tags type (should be array)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Load existing agents from data file
 */
function loadExistingAgents(): SerializableAgent[] {
  const dataPath = join(process.cwd(), 'data', 'agent-seed-data.json');
  
  if (!existsSync(dataPath)) {
    return [];
  }
  
  try {
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
    return Array.isArray(data) ? data : data.agents || [];
  } catch (error) {
    console.warn(`Failed to load existing agents: ${error}`);
    return [];
  }
}

/**
 * Save agents to data file
 */
function saveAgents(agents: SerializableAgent[]): void {
  const dataPath = join(process.cwd(), 'data', 'agent-seed-data.json');
  const seedData: AgentSeedData = {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    agents
  };
  
  writeFileSync(dataPath, JSON.stringify(seedData, null, 2));
}

/**
 * Backup current agents before import
 */
function backupAgents(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(process.cwd(), 'data', `agents-backup-${timestamp}.json`);
  
  const existingAgents = loadExistingAgents();
  writeFileSync(backupPath, JSON.stringify(existingAgents, null, 2));
  
  return backupPath;
}

/**
 * CLI interface for import/export operations
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'import':
      const importPath = args[1];
      if (!importPath) {
        console.error('Usage: npm run agent-import <file-path> [--overwrite] [--validate]');
        process.exit(1);
      }
      
      const overwrite = args.includes('--overwrite');
      const validate = args.includes('--validate');
      
      console.log(`Importing agents from ${importPath}...`);
      if (overwrite) console.log('⚠️  Overwrite mode enabled');
      
      // Backup before import
      const backupPath = backupAgents();
      console.log(`📦 Backup created: ${backupPath}`);
      
      const importResult = importAgents(importPath, { overwrite, validateSchema: validate });
      
      if (importResult.success) {
        console.log(`✅ Import completed: ${importResult.imported} imported, ${importResult.skipped} skipped`);
      } else {
        console.error('❌ Import failed:');
        importResult.errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
      }
      break;
      
    case 'export':
      const exportPath = args[1] || join(process.cwd(), 'data', `agents-export-${Date.now()}.json`);
      const format = args.includes('--seed-data') ? 'seed-data' : 'array';
      
      console.log(`Exporting agents to ${exportPath}...`);
      
      const exportResult = exportAgents(exportPath, { format });
      
      if (exportResult.success) {
        console.log(`✅ Export completed: ${exportResult.exported} agents exported to ${exportResult.filePath}`);
      } else {
        console.error('❌ Export failed');
        process.exit(1);
      }
      break;
      
    default:
      console.log('Usage:');
      console.log('  npm run agent-import <file-path> [--overwrite] [--validate]');
      console.log('  npm run agent-export [output-path] [--seed-data]');
      process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { 
  importAgents, 
  exportAgents, 
  validateAgentSchema, 
  loadExistingAgents, 
  backupAgents,
  ImportResult,
  ExportResult
};