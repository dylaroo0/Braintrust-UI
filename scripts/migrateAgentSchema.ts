#!/usr/bin/env tsx

import Database from 'better-sqlite3';
import path from 'path';

class SchemaMigrator {
  private db: Database.Database;

  constructor(dbPath: string = 'agents.db') {
    this.db = new Database(dbPath);
  }

  private checkColumnExists(tableName: string, columnName: string): boolean {
    try {
      const result = this.db.prepare(`PRAGMA table_info(${tableName})`).all() as any[];
      return result.some((column: any) => column.name === columnName);
    } catch (error) {
      console.warn(`Error checking column ${columnName}:`, error);
      return false;
    }
  }

  public async migrateSchema(): Promise<void> {
    console.log('🚀 Starting schema migration...');

    try {
      // Add new columns to agents table if they don't exist
      const columnsToAdd = [
        { name: 'categories', type: 'TEXT DEFAULT ""', description: 'Agent categories (comma-separated)' },
        { name: 'difficulty', type: 'TEXT DEFAULT "Beginner"', description: 'Difficulty level' },
        { name: 'estimatedTime', type: 'TEXT DEFAULT "2-5 minutes"', description: 'Estimated completion time' },
        { name: 'tools', type: 'TEXT DEFAULT "Text Processing"', description: 'Available tools' },
        { name: 'sourceType', type: 'TEXT DEFAULT "manual"', description: 'Source of the agent' },
        { name: 'metadata', type: 'TEXT DEFAULT "{}"', description: 'Additional metadata as JSON' }
      ];

      let addedColumns = 0;

      for (const column of columnsToAdd) {
        if (!this.checkColumnExists('agents', column.name)) {
          console.log(`➕ Adding column: ${column.name}`);
          this.db.exec(`ALTER TABLE agents ADD COLUMN ${column.name} ${column.type}`);
          addedColumns++;
        } else {
          console.log(`✅ Column already exists: ${column.name}`);
        }
      }

      // Update existing agents to populate new fields if they're empty
      console.log('🔄 Updating existing agent records...');
      
      // Rename 'category' to 'categories' for consistency
      if (this.checkColumnExists('agents', 'category') && !this.checkColumnExists('agents', 'categories')) {
        console.log('🔄 Migrating category to categories...');
        this.db.exec(`UPDATE agents SET categories = category WHERE categories = '' OR categories IS NULL`);
      }

      // Set default values for existing records where fields are empty
      const updateQueries = [
        `UPDATE agents SET difficulty = 'Beginner' WHERE difficulty = '' OR difficulty IS NULL`,
        `UPDATE agents SET estimatedTime = '2-5 minutes' WHERE estimatedTime = '' OR estimatedTime IS NULL`,
        `UPDATE agents SET tools = 'Text Processing' WHERE tools = '' OR tools IS NULL`,
        `UPDATE agents SET sourceType = 'manual' WHERE sourceType = '' OR sourceType IS NULL`,
        `UPDATE agents SET metadata = '{}' WHERE metadata = '' OR metadata IS NULL`
      ];

      for (const query of updateQueries) {
        try {
          const result = this.db.prepare(query).run();
          if (result.changes > 0) {
            console.log(`   Updated ${result.changes} records`);
          }
        } catch (error) {
          console.warn(`Warning updating records:`, error);
        }
      }

      // Recreate FTS5 index to include new columns
      console.log('🔍 Updating full-text search index...');
      try {
        // Drop existing FTS table
        this.db.exec(`DROP TABLE IF EXISTS agents_fts`);
        
        // Create new FTS table with extended fields
        this.db.exec(`
          CREATE VIRTUAL TABLE agents_fts USING fts5(
            name, role, description, tags, categories, difficulty, tools, sourceType,
            content='agents',
            content_rowid='rowid'
          )
        `);

        // Rebuild FTS index
        this.db.exec(`INSERT INTO agents_fts(agents_fts) VALUES('rebuild')`);
        console.log('✅ FTS index updated successfully');
      } catch (error) {
        console.error('⚠️ Error updating FTS index:', error);
      }

      console.log('\n✅ Schema migration completed!');
      console.log(`📊 Statistics:`);
      console.log(`   • Added columns: ${addedColumns}`);
      
      // Get current schema
      const columns = this.db.prepare(`PRAGMA table_info(agents)`).all() as any[];
      console.log(`   • Total columns: ${columns.length}`);
      console.log(`   • Column names: ${columns.map(c => c.name).join(', ')}`);

    } catch (error) {
      console.error('❌ Schema migration failed:', error);
      throw error;
    }
  }

  public getSchemaInfo(): any {
    const tableInfo = this.db.prepare(`PRAGMA table_info(agents)`).all();
    const indexInfo = this.db.prepare(`PRAGMA index_list(agents)`).all();
    
    return {
      columns: tableInfo,
      indexes: indexInfo,
      totalAgents: this.db.prepare(`SELECT COUNT(*) as count FROM agents`).get()
    };
  }

  public close(): void {
    this.db.close();
  }
}

// Main execution
async function main() {
  const migrator = new SchemaMigrator();
  
  try {
    console.log('📋 Current schema info:');
    const beforeInfo = migrator.getSchemaInfo();
    console.log('   Columns:', beforeInfo.columns.map((c: any) => c.name).join(', '));
    console.log('   Total agents:', (beforeInfo.totalAgents as any).count);
    
    await migrator.migrateSchema();
    
    console.log('\n📋 Updated schema info:');
    const afterInfo = migrator.getSchemaInfo();
    console.log('   Columns:', afterInfo.columns.map((c: any) => c.name).join(', '));
    console.log('   Total agents:', (afterInfo.totalAgents as any).count);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    migrator.close();
  }
}

// Run if called directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  main();
}

export { SchemaMigrator };