import Database from 'better-sqlite3';
import path from 'path';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  color: string;
  avatar: string;
  tags: string; // JSON string array
  categories: string; // Comma-separated categories
  difficulty: string; // Beginner, Intermediate, Advanced
  estimatedTime: string; // e.g., "2-5 minutes"
  tools: string; // Comma-separated tools
  sourceType: string; // manual, specialist, imported, etc.
  metadata: string; // JSON string for additional data
  created_at?: string;
}

export class DatabaseService {
  private db: Database.Database;

  constructor(dbPath: string = 'agents.db') {
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Create agents table with extended schema
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        description TEXT NOT NULL,
        systemInstruction TEXT NOT NULL,
        color TEXT NOT NULL,
        avatar TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '[]',
        categories TEXT NOT NULL DEFAULT '',
        difficulty TEXT NOT NULL DEFAULT 'Beginner',
        estimatedTime TEXT NOT NULL DEFAULT '2-5 minutes',
        tools TEXT NOT NULL DEFAULT 'Text Processing',
        sourceType TEXT NOT NULL DEFAULT 'manual',
        metadata TEXT NOT NULL DEFAULT '{}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create FTS5 virtual table for full-text search
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS agents_fts USING fts5(
        name, role, description, tags, categories, difficulty, tools, sourceType,
        content='agents',
        content_rowid='rowid'
      )
    `);

    // Create triggers to keep FTS in sync
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS agents_fts_insert AFTER INSERT ON agents BEGIN
        INSERT INTO agents_fts(rowid, name, role, description, tags, categories, difficulty, tools, sourceType)
        VALUES (new.rowid, new.name, new.role, new.description, new.tags, new.categories, new.difficulty, new.tools, new.sourceType);
      END
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS agents_fts_delete AFTER DELETE ON agents BEGIN
        INSERT INTO agents_fts(agents_fts, rowid, name, role, description, tags, categories, difficulty, tools, sourceType)
        VALUES ('delete', old.rowid, old.name, old.role, old.description, old.tags, old.categories, old.difficulty, old.tools, old.sourceType);
      END
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS agents_fts_update AFTER UPDATE ON agents BEGIN
        INSERT INTO agents_fts(agents_fts, rowid, name, role, description, tags, categories, difficulty, tools, sourceType)
        VALUES ('delete', old.rowid, old.name, old.role, old.description, old.tags, old.categories, old.difficulty, old.tools, old.sourceType);
        INSERT INTO agents_fts(rowid, name, role, description, tags, categories, difficulty, tools, sourceType)
        VALUES (new.rowid, new.name, new.role, new.description, new.tags, new.categories, new.difficulty, new.tools, new.sourceType);
      END
    `);
  }

  // Add agent
  async addAgent(agent: Agent): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO agents (
        id, name, role, description, systemInstruction, color, avatar, 
        tags, categories, difficulty, estimatedTime, tools, sourceType, metadata
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      agent.id,
      agent.name,
      agent.role,
      agent.description,
      agent.systemInstruction,
      agent.color,
      agent.avatar,
      agent.tags,
      agent.categories,
      agent.difficulty,
      agent.estimatedTime,
      agent.tools,
      agent.sourceType,
      agent.metadata
    );
  }

  // Get agent by ID
  async getAgent(id: string): Promise<Agent | null> {
    const stmt = this.db.prepare('SELECT * FROM agents WHERE id = ?');
    const result = stmt.get(id) as Agent | undefined;
    return result || null;
  }

  // Get all agents
  getAllAgents(): Agent[] {
    const stmt = this.db.prepare('SELECT * FROM agents ORDER BY name');
    return stmt.all() as Agent[];
  }

  // Get agent count
  async getAgentCount(): Promise<number> {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM agents');
    const result = stmt.get() as { count: number };
    return result.count;
  }

  // Search agents using full-text search
  searchAgents(query: string, limit: number = 50): Agent[] {
    const stmt = this.db.prepare(`
      SELECT agents.* FROM agents
      JOIN agents_fts ON agents.rowid = agents_fts.rowid
      WHERE agents_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    `);
    return stmt.all(query, limit) as Agent[];
  }

  // Advanced search with filters
  searchAgentsAdvanced(params: {
    query?: string;
    categories?: string[];
    difficulty?: string;
    sourceType?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Agent[] {
    let baseQuery = 'SELECT * FROM agents WHERE 1=1';
    const queryParams: any[] = [];

    // Full-text search
    if (params.query) {
      baseQuery = `
        SELECT agents.* FROM agents
        JOIN agents_fts ON agents.rowid = agents_fts.rowid
        WHERE agents_fts MATCH ?
      `;
      queryParams.push(params.query);
    }

    // Category filter
    if (params.categories && params.categories.length > 0) {
      const categoryConditions = params.categories.map(() => 'categories LIKE ?').join(' OR ');
      baseQuery += ` AND (${categoryConditions})`;
      params.categories.forEach(category => {
        queryParams.push(`%${category}%`);
      });
    }

    // Difficulty filter
    if (params.difficulty) {
      baseQuery += ' AND difficulty = ?';
      queryParams.push(params.difficulty);
    }

    // Source type filter
    if (params.sourceType) {
      baseQuery += ' AND sourceType = ?';
      queryParams.push(params.sourceType);
    }

    // Tags filter
    if (params.tags && params.tags.length > 0) {
      const tagConditions = params.tags.map(() => 'tags LIKE ?').join(' OR ');
      baseQuery += ` AND (${tagConditions})`;
      params.tags.forEach(tag => {
        queryParams.push(`%${tag}%`);
      });
    }

    // Order and pagination
    baseQuery += ' ORDER BY name';
    if (params.limit) {
      baseQuery += ' LIMIT ?';
      queryParams.push(params.limit);
    }
    if (params.offset) {
      baseQuery += ' OFFSET ?';
      queryParams.push(params.offset);
    }

    const stmt = this.db.prepare(baseQuery);
    return stmt.all(...queryParams) as Agent[];
  }

  // Get agents by category
  getAgentsByCategory(category: string): Agent[] {
    const stmt = this.db.prepare('SELECT * FROM agents WHERE categories LIKE ? ORDER BY name');
    return stmt.all(`%${category}%`) as Agent[];
  }

  // Get unique categories
  getCategories(): string[] {
    try {
      const stmt = this.db.prepare('SELECT DISTINCT categories FROM agents WHERE categories != ""');
      const results = stmt.all() as { categories: string }[];
      const categoriesSet = new Set<string>();
      
      results.forEach(row => {
        if (row.categories) {
          row.categories.split(',').forEach(cat => {
            if (cat.trim()) categoriesSet.add(cat.trim());
          });
        }
      });
      
      return Array.from(categoriesSet).sort();
    } catch (error) {
      console.warn('Error getting categories:', error);
      return [];
    }
  }

  // Get unique difficulties
  getDifficulties(): string[] {
    const stmt = this.db.prepare('SELECT DISTINCT difficulty FROM agents ORDER BY difficulty');
    const results = stmt.all() as { difficulty: string }[];
    return results.map(r => r.difficulty);
  }

  // Get unique source types
  getSourceTypes(): string[] {
    const stmt = this.db.prepare('SELECT DISTINCT sourceType FROM agents ORDER BY sourceType');
    const results = stmt.all() as { sourceType: string }[];
    return results.map(r => r.sourceType);
  }

  // Update agent
  updateAgent(id: string, updates: Partial<Agent>): boolean {
    const fields = Object.keys(updates).filter(key => key !== 'id').join(', ');
    const placeholders = Object.keys(updates).filter(key => key !== 'id').map(() => '?').join(', ');
    const values = Object.entries(updates).filter(([key]) => key !== 'id').map(([, value]) => value);
    
    if (fields.length === 0) return false;
    
    const stmt = this.db.prepare(`UPDATE agents SET ${fields.split(', ').map(f => `${f} = ?`).join(', ')} WHERE id = ?`);
    const result = stmt.run(...values, id);
    return result.changes > 0;
  }

  // Delete agent
  deleteAgent(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM agents WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get statistics
  getStats(): {
    totalAgents: number;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
    bySourceType: Record<string, number>;
  } {
    const total = this.db.prepare('SELECT COUNT(*) as count FROM agents').get() as { count: number };
    
    const categoriesStmt = this.db.prepare('SELECT categories, COUNT(*) as count FROM agents GROUP BY categories');
    const categoryResults = categoriesStmt.all() as { categories: string; count: number }[];
    
    const difficultyStmt = this.db.prepare('SELECT difficulty, COUNT(*) as count FROM agents GROUP BY difficulty');
    const difficultyResults = difficultyStmt.all() as { difficulty: string; count: number }[];
    
    const sourceStmt = this.db.prepare('SELECT sourceType, COUNT(*) as count FROM agents GROUP BY sourceType');
    const sourceResults = sourceStmt.all() as { sourceType: string; count: number }[];
    
    return {
      totalAgents: total.count,
      byCategory: Object.fromEntries(categoryResults.map(r => [r.categories, r.count])),
      byDifficulty: Object.fromEntries(difficultyResults.map(r => [r.difficulty, r.count])),
      bySourceType: Object.fromEntries(sourceResults.map(r => [r.sourceType, r.count]))
    };
  }

  // Close database connection
  close(): void {
    this.db.close();
  }

  // Execute raw SQL (for migrations/admin)
  exec(sql: string): void {
    this.db.exec(sql);
  }
}

// Export default instance
const databaseService = new DatabaseService();
export default databaseService;