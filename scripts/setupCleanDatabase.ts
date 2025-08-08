#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DatabaseService } from '../services/databaseService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CleanDatabaseSetup {
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(__dirname, '..', 'agents.db');
  }

  public async setupCleanDatabase(): Promise<void> {
    console.log('🗑️ Removing old database...');
    
    // Remove old database file
    if (fs.existsSync(this.dbPath)) {
      fs.unlinkSync(this.dbPath);
      console.log('✅ Old database removed');
    }

    console.log('🚀 Creating new database with correct schema...');
    
    // Create new database with correct schema
    const db = new DatabaseService();
    
    // Test the database
    const count = await db.getAgentCount();
    console.log(`✅ New database created with ${count} agents`);
    
    // Test basic functionality
    const categories = db.getCategories();
    const difficulties = db.getDifficulties();
    const sourceTypes = db.getSourceTypes();
    
    console.log('📊 Database structure:');
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Difficulties: ${difficulties.length}`);
    console.log(`   • Source types: ${sourceTypes.length}`);
    
    db.close();
    
    console.log('✅ Clean database setup completed!');
  }
}

// Main execution
async function main() {
  const setup = new CleanDatabaseSetup();
  
  try {
    await setup.setupCleanDatabase();
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main();
}

export { CleanDatabaseSetup };