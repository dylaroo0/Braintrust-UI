import fs from 'fs';
import path from 'path';
import { database } from '../services/database';

export interface AgentExportData {
  id: string;
  name: string;
  role: string;
  systemInstruction: string;
  color: string;
  category: string;
  tags: string[];
  description: string;
  avatarType: string;
  isPermanent?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentImportOptions {
  clearExisting?: boolean;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
}

/**
 * Agent Migration Utility Class
 * Handles import/export of agent data in various formats
 */
export class AgentMigration {
  
  /**
   * Export agents to JSON file
   */
  static async exportToFile(filePath: string): Promise<void> {
    try {
      const db = database.getDatabase();
      const selectStmt = db.prepare(`
        SELECT id, name, role, system_instruction as systemInstruction, 
               color, category, tags, description, avatar_type as avatarType, 
               is_permanent as isPermanent, created_at as createdAt, 
               updated_at as updatedAt
        FROM agents 
        ORDER BY name
      `);
      
      const agents = selectStmt.all();
      
      // Parse JSON fields and format for export
      const exportData = agents.map((agent: any) => ({
        ...agent,
        tags: JSON.parse(agent.tags || '[]'),
        isPermanent: Boolean(agent.isPermanent),
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt
      }));
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write to file
      fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
      console.log(`Exported ${exportData.length} agents to ${filePath}`);
      
    } catch (error) {
      console.error('Error exporting agents to file:', error);
      throw error;
    }
  }
  
  /**
   * Import agents from JSON file
   */
  static async importFromFile(filePath: string, options: AgentImportOptions = {}): Promise<void> {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const agentsData: AgentExportData[] = JSON.parse(fileContent);
      
      await this.importAgents(agentsData, options);
      
    } catch (error) {
      console.error('Error importing agents from file:', error);
      throw error;
    }
  }
  
  /**
   * Import agents from data array
   */
  static async importAgents(agentsData: AgentExportData[], options: AgentImportOptions = {}): Promise<void> {
    console.log(`Starting import of ${agentsData.length} agents...`);
    
    try {
      const db = database.getDatabase();
      
      // Clear existing data if requested
      if (options.clearExisting) {
        const deleteStmt = db.prepare('DELETE FROM agents');
        deleteStmt.run();
        console.log('Cleared existing agent data');
      }
      
      // Prepare statements
      const insertStmt = db.prepare(`
        INSERT INTO agents (
          id, name, role, system_instruction, color, category, tags, 
          description, avatar_type, is_permanent, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const updateStmt = db.prepare(`
        UPDATE agents SET 
          name = ?, role = ?, system_instruction = ?, color = ?, 
          category = ?, tags = ?, description = ?, avatar_type = ?, 
          is_permanent = ?, updated_at = ?
        WHERE id = ?
      `);
      
      const checkStmt = db.prepare('SELECT id FROM agents WHERE id = ?');
      
      let imported = 0;
      let updated = 0;
      let skipped = 0;
      
      for (const agent of agentsData) {
        const existing = checkStmt.get(agent.id);
        const now = new Date().toISOString();
        
        if (existing) {
          if (options.updateExisting) {
            updateStmt.run(
              agent.name,
              agent.role,
              agent.systemInstruction,
              agent.color,
              agent.category,
              JSON.stringify(agent.tags || []),
              agent.description,
              agent.avatarType,
              agent.isPermanent ? 1 : 0,
              now,
              agent.id
            );
            updated++;
            console.log(`Updated agent: ${agent.name}`);
          } else if (options.skipDuplicates) {
            skipped++;
            console.log(`Skipped existing agent: ${agent.name}`);
          } else {
            throw new Error(`Agent with id '${agent.id}' already exists. Use updateExisting or skipDuplicates option.`);
          }
        } else {
          insertStmt.run(
            agent.id,
            agent.name,
            agent.role,
            agent.systemInstruction,
            agent.color,
            agent.category,
            JSON.stringify(agent.tags || []),
            agent.description,
            agent.avatarType,
            agent.isPermanent ? 1 : 0,
            agent.createdAt || now,
            agent.updatedAt || now
          );
          imported++;
          console.log(`Imported agent: ${agent.name}`);
        }
      }
      
      console.log(`Import completed: ${imported} imported, ${updated} updated, ${skipped} skipped`);
      
    } catch (error) {
      console.error('Error importing agents:', error);
      throw error;
    }
  }
  
  /**
   * Export agents to CSV format
   */
  static async exportToCSV(filePath: string): Promise<void> {
    try {
      const db = database.getDatabase();
      const selectStmt = db.prepare(`
        SELECT id, name, role, system_instruction, color, category, 
               tags, description, avatar_type, is_permanent
        FROM agents 
        ORDER BY name
      `);
      
      const agents = selectStmt.all();
      
      // Create CSV content
      const headers = ['id', 'name', 'role', 'system_instruction', 'color', 'category', 'tags', 'description', 'avatar_type', 'is_permanent'];
      const csvContent = [
        headers.join(','),
        ...agents.map((agent: any) => [
          agent.id,
          `"${agent.name.replace(/"/g, '""')}"`,
          `"${agent.role.replace(/"/g, '""')}"`,
          `"${agent.system_instruction.replace(/"/g, '""')}"`,
          agent.color,
          agent.category,
          `"${agent.tags.replace(/"/g, '""')}"`,
          `"${agent.description.replace(/"/g, '""')}"`,
          agent.avatar_type,
          agent.is_permanent
        ].join(','))
      ].join('\n');
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, csvContent);
      console.log(`Exported ${agents.length} agents to CSV: ${filePath}`);
      
    } catch (error) {
      console.error('Error exporting agents to CSV:', error);
      throw error;
    }
  }
  
  /**
   * Backup current agents with timestamp
   */
  static async createBackup(backupDir: string = './backups'): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `agents-backup-${timestamp}.json`);
    
    await this.exportToFile(backupFile);
    console.log(`Backup created: ${backupFile}`);
    
    return backupFile;
  }
  
  /**
   * Validate agent data structure
   */
  static validateAgentData(agentsData: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const requiredFields = ['id', 'name', 'role', 'systemInstruction', 'color'];
    
    agentsData.forEach((agent, index) => {
      requiredFields.forEach(field => {
        if (!agent[field]) {
          errors.push(`Agent at index ${index}: Missing required field '${field}'`);
        }
      });
      
      // Validate color format (hex color)
      if (agent.color && !/^#[0-9A-Fa-f]{6}$/.test(agent.color)) {
        errors.push(`Agent at index ${index}: Invalid color format '${agent.color}'`);
      }
      
      // Validate tags is array
      if (agent.tags && !Array.isArray(agent.tags)) {
        errors.push(`Agent at index ${index}: Tags must be an array`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const filePath = process.argv[3];
  
  switch (command) {
    case 'export':
      if (!filePath) {
        console.error('Usage: npm run agent-migration export <file-path>');
        process.exit(1);
      }
      AgentMigration.exportToFile(filePath)
        .then(() => {
          console.log('Export completed successfully');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Export failed:', error);
          process.exit(1);
        });
      break;
      
    case 'import':
      if (!filePath) {
        console.error('Usage: npm run agent-migration import <file-path> [--clear] [--update] [--skip-duplicates]');
        process.exit(1);
      }
      
      const options: AgentImportOptions = {
        clearExisting: process.argv.includes('--clear'),
        updateExisting: process.argv.includes('--update'),
        skipDuplicates: process.argv.includes('--skip-duplicates')
      };
      
      AgentMigration.importFromFile(filePath, options)
        .then(() => {
          console.log('Import completed successfully');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Import failed:', error);
          process.exit(1);
        });
      break;
      
    case 'backup':
      AgentMigration.createBackup()
        .then((backupFile) => {
          console.log(`Backup created: ${backupFile}`);
          process.exit(0);
        })
        .catch((error) => {
          console.error('Backup failed:', error);
          process.exit(1);
        });
      break;
      
    case 'export-csv':
      if (!filePath) {
        console.error('Usage: npm run agent-migration export-csv <file-path>');
        process.exit(1);
      }
      AgentMigration.exportToCSV(filePath)
        .then(() => {
          console.log('CSV export completed successfully');
          process.exit(0);
        })
        .catch((error) => {
          console.error('CSV export failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: npm run agent-migration <command> [options]');
      console.log('Commands:');
      console.log('  export <file>           - Export agents to JSON file');
      console.log('  import <file> [options] - Import agents from JSON file');
      console.log('    --clear               - Clear existing agents before import');
      console.log('    --update              - Update existing agents');
      console.log('    --skip-duplicates     - Skip agents that already exist');
      console.log('  backup                  - Create timestamped backup');
      console.log('  export-csv <file>       - Export agents to CSV file');
      process.exit(1);
  }
}