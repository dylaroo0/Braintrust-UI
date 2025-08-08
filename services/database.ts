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
  category: string;
  created_at?: string;
}

class AgentDatabase {
  private db: Database.Database;

  constructor(dbPath: string = 'agents.db') {
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Create agents table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        description TEXT NOT NULL,
        systemInstruction TEXT NOT NULL,
        color TEXT NOT NULL,
        avatar TEXT NOT NULL,
        tags TEXT NOT NULL,
        category TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create FTS5 virtual table for full-text search
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS agents_fts USING fts5(
        name, role, description, tags, category,
        content='agents',
        content_rowid='rowid'
      )
    `);

    // Create triggers to keep FTS table in sync
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS agents_fts_insert AFTER INSERT ON agents BEGIN
        INSERT INTO agents_fts(rowid, name, role, description, tags, category)
        VALUES (new.rowid, new.name, new.role, new.description, new.tags, new.category);
      END
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS agents_fts_delete AFTER DELETE ON agents BEGIN
        INSERT INTO agents_fts(agents_fts, rowid, name, role, description, tags, category)
        VALUES ('delete', old.rowid, old.name, old.role, old.description, old.tags, old.category);
      END
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS agents_fts_update AFTER UPDATE ON agents BEGIN
        INSERT INTO agents_fts(agents_fts, rowid, name, role, description, tags, category)
        VALUES ('delete', old.rowid, old.name, old.role, old.description, old.tags, old.category);
        INSERT INTO agents_fts(rowid, name, role, description, tags, category)
        VALUES (new.rowid, new.name, new.role, new.description, new.tags, new.category);
      END
    `);
  }

  // Insert a new agent
  insertAgent(agent: Omit<Agent, 'created_at'>): void {
    const stmt = this.db.prepare(`
      INSERT INTO agents (id, name, role, description, systemInstruction, color, avatar, tags, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      agent.category
    );
  }

  // Get all agents
  getAllAgents(): Agent[] {
    const stmt = this.db.prepare('SELECT * FROM agents ORDER BY name');
    return stmt.all() as Agent[];
  }

  // Search agents using full-text search
  searchAgents(query: string): Agent[] {
    const stmt = this.db.prepare(`
      SELECT agents.* FROM agents
      JOIN agents_fts ON agents.rowid = agents_fts.rowid
      WHERE agents_fts MATCH ?
      ORDER BY rank
    `);
    return stmt.all(query) as Agent[];
  }

  // Get agents by category
  getAgentsByCategory(category: string): Agent[] {
    const stmt = this.db.prepare('SELECT * FROM agents WHERE category = ? ORDER BY name');
    return stmt.all(category) as Agent[];
  }

  // Get agents by tags (enhanced filtering)
  getAgentsByTags(tags: string[]): Agent[] {
    if (tags.length === 0) return [];
    
    // Create a query that finds agents containing any of the specified tags
    const placeholders = tags.map(() => 'tags LIKE ?').join(' OR ');
    const query = `SELECT * FROM agents WHERE ${placeholders} ORDER BY name`;
    const params = tags.map(tag => `%"${tag}"%`);
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params) as Agent[];
  }

  // Advanced search combining text, category, and tags
  searchAgentsAdvanced(query: string, category?: string, tags?: string[]): Agent[] {
    let baseQuery = `
      SELECT agents.* FROM agents
      JOIN agents_fts ON agents.rowid = agents_fts.rowid
      WHERE agents_fts MATCH ?
    `;
    
    const params: any[] = [query];
    
    if (category) {
      baseQuery += ' AND agents.category = ?';
      params.push(category);
    }
    
    if (tags && tags.length > 0) {
      const tagConditions = tags.map(() => 'agents.tags LIKE ?').join(' OR ');
      baseQuery += ` AND (${tagConditions})`;
      params.push(...tags.map(tag => `%"${tag}"%`));
    }
    
    baseQuery += ' ORDER BY rank';
    
    const stmt = this.db.prepare(baseQuery);
    return stmt.all(...params) as Agent[];
  }

  // Get agent by ID
  getAgentById(id: string): Agent | undefined {
    const stmt = this.db.prepare('SELECT * FROM agents WHERE id = ?');
    return stmt.get(id) as Agent | undefined;
  }

  // Get agents count by category
  getAgentCountByCategory(): Record<string, number> {
    const stmt = this.db.prepare('SELECT category, COUNT(*) as count FROM agents GROUP BY category');
    const results = stmt.all() as { category: string; count: number }[];
    
    const counts: Record<string, number> = {};
    results.forEach(result => {
      counts[result.category] = result.count;
    });
    
    return counts;
  }

  // Get popular tags with counts
  getPopularTags(limit: number = 20): Array<{ tag: string; count: number }> {
    const agents = this.getAllAgents();
    const tagCounts: Record<string, number> = {};
    
    agents.forEach(agent => {
      const tags = JSON.parse(agent.tags) as string[];
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Update agent
  updateAgent(id: string, updates: Partial<Omit<Agent, 'id' | 'created_at'>>): boolean {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    if (fields.length === 0) return false;
    
    const stmt = this.db.prepare(`UPDATE agents SET ${fields} WHERE id = ?`);
    const result = stmt.run(...values, id);
    
    return result.changes > 0;
  }

  // Delete agent
  deleteAgent(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM agents WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}

export default AgentDatabase;