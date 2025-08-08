import AgentDatabase from '../services/database.js';
import fs from 'fs';
import path from 'path';

export interface MigrationOptions {
  clearExisting?: boolean;
  skipDuplicates?: boolean;
  backupFirst?: boolean;
}

/**
 * Agent Migration Utilities
 * Provides comprehensive import/export functionality for agent data
 */
export class AgentMigrationUtils {
  private db: AgentDatabase;

  constructor(dbPath: string = 'agents.db') {
    this.db = new AgentDatabase(dbPath);
  }

  /**
   * Export all agents to JSON file
   */
  exportToFile(filePath: string): void {
    console.log('📤 Starting export...');
    
    const agents = this.db.getAllAgents();
    console.log(`📋 Found ${agents.length} agents to export`);

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalAgents: agents.length,
      source: 'database',
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

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    console.log(`✅ Exported ${agents.length} agents to ${filePath}`);
  }

  /**
   * Import agents from JSON file
   */
  importFromFile(filePath: string, options: MigrationOptions = {}): void {
    console.log(`📥 Starting import from ${filePath}...`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Create backup if requested
    if (options.backupFirst) {
      this.createBackup();
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const importData = JSON.parse(fileContent);
    
    const agents = importData.agents || importData;
    console.log(`📦 Preparing to import ${agents.length} agents...`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const agentData of agents) {
      try {
        const agent = {
          id: agentData.id,
          name: agentData.name,
          role: agentData.role,
          description: agentData.description,
          systemInstruction: agentData.systemInstruction || agentData.system_instruction,
          color: agentData.color,
          avatar: agentData.avatar || agentData.avatarType || agentData.avatar_type,
          tags: JSON.stringify(agentData.tags || []),
          category: agentData.category
        };

        this.db.insertAgent(agent);
        console.log(`✅ Imported: ${agent.name}`);
        imported++;

      } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
          if (options.skipDuplicates) {
            console.log(`⏭️  Skipped: ${agentData.name} (already exists)`);
            skipped++;
          } else {
            console.error(`❌ Duplicate: ${agentData.name} (use skipDuplicates option)`);
            errors++;
          }
        } else {
          console.error(`❌ Error importing ${agentData.name}:`, error.message);
          errors++;
        }
      }
    }

    console.log(`\n📊 Import Summary:`);
    console.log(`  - Imported: ${imported}`);
    console.log(`  - Skipped: ${skipped}`);
    console.log(`  - Errors: ${errors}`);
    console.log(`  - Total processed: ${imported + skipped + errors}`);
  }

  /**
   * Create a timestamped backup
   */
  createBackup(backupDir: string = './backups'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `agents-backup-${timestamp}.json`);
    
    console.log(`💾 Creating backup...`);
    this.exportToFile(backupFile);
    console.log(`✅ Backup created: ${backupFile}`);
    
    return backupFile;
  }

  /**
   * Get migration statistics
   */
  getStats(): any {
    const agents = this.db.getAllAgents();
    const categories = [...new Set(agents.map(a => a.category))];
    
    const stats = {
      totalAgents: agents.length,
      categories: categories.length,
      categoryBreakdown: {} as Record<string, number>,
      originalAgents: 0,
      testAgents: 0
    };

    // Count by category
    categories.forEach(category => {
      stats.categoryBreakdown[category] = agents.filter(a => a.category === category).length;
    });

    // Count original vs test agents
    stats.originalAgents = agents.filter(a => 
      ['designer', 'developer', 'engineer', 'organizer'].includes(a.id)
    ).length;
    
    stats.testAgents = agents.filter(a => 
      a.category === 'Testing' || a.id.startsWith('test-') || a.id.startsWith('perf-')
    ).length;

    return stats;
  }

  /**
   * Clean up test data
   */
  cleanupTestData(): void {
    console.log('🧹 Cleaning up test data...');
    
    const agents = this.db.getAllAgents();
    const testAgents = agents.filter(a => 
      a.category === 'Testing' || 
      a.id.startsWith('test-') || 
      a.id.startsWith('perf-')
    );

    console.log(`🗑️  Found ${testAgents.length} test agents to remove`);
    
    // Note: The current database interface doesn't have a delete method
    // This would need to be implemented in the AgentDatabase class
    console.log('⚠️  Delete functionality not available in current database interface');
    console.log('   Test agents found:');
    testAgents.forEach(agent => {
      console.log(`   - ${agent.name} (${agent.id})`);
    });
  }

  /**
   * Validate agent data structure
   */
  validateAgentData(agentsData: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const requiredFields = ['id', 'name', 'role', 'systemInstruction', 'color', 'category'];

    agentsData.forEach((agent, index) => {
      requiredFields.forEach(field => {
        if (!agent[field] && !agent[field.toLowerCase()]) {
          errors.push(`Agent at index ${index}: Missing required field '${field}'`);
        }
      });

      // Validate color format
      const color = agent.color;
      if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        errors.push(`Agent at index ${index}: Invalid color format '${color}'`);
      }

      // Validate tags
      if (agent.tags && !Array.isArray(agent.tags)) {
        errors.push(`Agent at index ${index}: Tags must be an array`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const filePath = process.argv[3];
  
  const migration = new AgentMigrationUtils();

  try {
    switch (command) {
      case 'export':
        if (!filePath) {
          console.error('Usage: npx tsx agentMigrationUtils.ts export <file-path>');
          process.exit(1);
        }
        migration.exportToFile(filePath);
        break;

      case 'import':
        if (!filePath) {
          console.error('Usage: npx tsx agentMigrationUtils.ts import <file-path> [--skip-duplicates] [--backup]');
          process.exit(1);
        }
        
        const options: MigrationOptions = {
          skipDuplicates: process.argv.includes('--skip-duplicates'),
          backupFirst: process.argv.includes('--backup')
        };
        
        migration.importFromFile(filePath, options);
        break;

      case 'backup':
        migration.createBackup();
        break;

      case 'stats':
        const stats = migration.getStats();
        console.log('📊 Database Statistics:');
        console.log(JSON.stringify(stats, null, 2));
        break;

      case 'cleanup':
        migration.cleanupTestData();
        break;

      default:
        console.log('Usage: npx tsx agentMigrationUtils.ts <command> [options]');
        console.log('Commands:');
        console.log('  export <file>     - Export agents to JSON file');
        console.log('  import <file>     - Import agents from JSON file');
        console.log('    --skip-duplicates - Skip agents that already exist');
        console.log('    --backup         - Create backup before import');
        console.log('  backup           - Create timestamped backup');
        console.log('  stats            - Show database statistics');
        console.log('  cleanup          - List test data for cleanup');
        process.exit(1);
    }
  } finally {
    migration.close();
  }
}