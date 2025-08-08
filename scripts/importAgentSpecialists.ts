#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { DatabaseService } from '../services/databaseService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AgentSpecialistJSON {
  agentname: string;
  description: string;
  systemprompt: string;
  chatgptlink?: string;
  'json-schema'?: string | null;
  'is-agent'?: boolean;
  'is-single-turn'?: string;
  'structured-output-generation'?: string;
  'image-generation'?: string;
  'data-utility'?: string;
  'depersonalised-system-prompt'?: string | null;
  'personalised-system-prompt'?: string;
  'json-example'?: string | null;
  'chatgpt-privacy'?: string | null;
  creation_date?: string;
}

interface DatabaseAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  avatar: string;
  color: string;
  categories: string;
  tags: string;
  difficulty: string;
  estimatedTime: string;
  tools: string;
  sourceType: string;
  metadata: string;
}

class AgentSpecialistImporter {
  private db: DatabaseService;
  private agentSpecialistDir: string;
  private importedCount = 0;
  private errorCount = 0;
  private skippedCount = 0;

  constructor() {
    this.db = new DatabaseService();
    this.agentSpecialistDir = path.join(__dirname, '../agent specalist/AI-Specialist-Agents - empty folder tree for json files/json');
  }

  private generateAgentId(name: string): string {
    const safeName = (name || 'unnamed').toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `specialist_${safeName}`;
  }

  private categorizeAgent(name: string, description: string, systemprompt: string): string {
    const text = `${name || ''} ${description || ''} ${systemprompt || ''}`.toLowerCase();
    
    const categories = [];
    
    // Technology categories
    if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('machine learning')) categories.push('AI & ML');
    if (text.includes('web') || text.includes('frontend') || text.includes('backend') || text.includes('javascript') || text.includes('react') || text.includes('node')) categories.push('Web Development');
    if (text.includes('data') || text.includes('analysis') || text.includes('database') || text.includes('sql')) categories.push('Data & Analytics');
    if (text.includes('security') || text.includes('cybersecurity') || text.includes('privacy')) categories.push('Security');
    if (text.includes('mobile') || text.includes('android') || text.includes('ios') || text.includes('app')) categories.push('Mobile Development');
    if (text.includes('cloud') || text.includes('aws') || text.includes('azure') || text.includes('docker') || text.includes('kubernetes')) categories.push('Cloud & DevOps');
    
    // Business categories
    if (text.includes('business') || text.includes('management') || text.includes('strategy')) categories.push('Business Strategy');
    if (text.includes('marketing') || text.includes('social media') || text.includes('seo')) categories.push('Marketing');
    if (text.includes('finance') || text.includes('accounting') || text.includes('budget')) categories.push('Finance');
    if (text.includes('legal') || text.includes('compliance') || text.includes('contract')) categories.push('Legal & Compliance');
    if (text.includes('hr') || text.includes('human resources') || text.includes('recruitment')) categories.push('Human Resources');
    
    // Content & Creative
    if (text.includes('writing') || text.includes('content') || text.includes('blog') || text.includes('article')) categories.push('Content Creation');
    if (text.includes('design') || text.includes('ui') || text.includes('ux') || text.includes('graphic')) categories.push('Design');
    if (text.includes('video') || text.includes('audio') || text.includes('media') || text.includes('production')) categories.push('Media Production');
    
    // Productivity & Tools
    if (text.includes('productivity') || text.includes('automation') || text.includes('workflow')) categories.push('Productivity');
    if (text.includes('research') || text.includes('analysis') || text.includes('investigation')) categories.push('Research');
    if (text.includes('education') || text.includes('learning') || text.includes('teaching') || text.includes('training')) categories.push('Education');
    
    // Health & Lifestyle
    if (text.includes('health') || text.includes('medical') || text.includes('fitness') || text.includes('wellness')) categories.push('Health & Wellness');
    if (text.includes('travel') || text.includes('food') || text.includes('recipe') || text.includes('restaurant')) categories.push('Lifestyle');
    
    return categories.length > 0 ? categories.join(', ') : 'General';
  }

  private generateTags(name: string, description: string, metadata: any): string {
    const tags = new Set<string>();
    
    // Add tags based on agent name
    if (name) {
      const nameWords = name.toLowerCase().split(/[\s\-_]+/);
      nameWords.forEach(word => {
        if (word && word.length > 2) tags.add(word);
      });
    }
    
    // Add capability tags
    if (metadata['is-agent']) tags.add('agent');
    if (metadata['structured-output-generation'] === 'true') tags.add('structured-output');
    if (metadata['image-generation'] === 'true') tags.add('image-generation');
    if (metadata['data-utility'] === 'true') tags.add('data-processing');
    if (metadata['is-single-turn'] === 'true') tags.add('single-turn');
    else tags.add('conversational');
    
    // Add domain-specific tags
    const text = (description || '').toLowerCase();
    if (text.includes('api')) tags.add('api');
    if (text.includes('json')) tags.add('json');
    if (text.includes('automation')) tags.add('automation');
    if (text.includes('assistant')) tags.add('assistant');
    if (text.includes('advisor')) tags.add('advisor');
    if (text.includes('finder')) tags.add('search');
    if (text.includes('generator')) tags.add('generation');
    if (text.includes('analyzer')) tags.add('analysis');
    
    return Array.from(tags).slice(0, 10).join(', '); // Limit to 10 tags
  }

  private estimateDifficulty(systemprompt: string, metadata: any): string {
    const promptLength = systemprompt.length;
    const hasStructuredOutput = metadata['structured-output-generation'] === 'true';
    const hasJsonSchema = metadata['json-schema'] !== null;
    const isAgent = metadata['is-agent'];
    
    if (isAgent || hasStructuredOutput || hasJsonSchema || promptLength > 2000) {
      return 'Advanced';
    } else if (promptLength > 1000) {
      return 'Intermediate';
    } else {
      return 'Beginner';
    }
  }

  private estimateTime(difficulty: string, metadata: any): string {
    const isSingleTurn = metadata['is-single-turn'] === 'true';
    
    if (difficulty === 'Advanced') {
      return isSingleTurn ? '5-15 minutes' : '15-30 minutes';
    } else if (difficulty === 'Intermediate') {
      return isSingleTurn ? '2-5 minutes' : '5-15 minutes';
    } else {
      return isSingleTurn ? '1-2 minutes' : '2-5 minutes';
    }
  }

  private generateTools(description: string, systemprompt: string, metadata: any): string {
    const tools = new Set<string>();
    
    const fullText = `${description || ''} ${systemprompt || ''}`.toLowerCase();
    
    // Basic capabilities
    tools.add('Text Processing');
    
    // Add specific tools based on content
    if (metadata['structured-output-generation'] === 'true') tools.add('Structured Output');
    if (metadata['image-generation'] === 'true') tools.add('Image Generation');
    if (metadata['data-utility'] === 'true') tools.add('Data Analysis');
    if (metadata['json-schema']) tools.add('JSON Schema');
    
    // Content-based tool detection
    if (fullText.includes('web') || fullText.includes('url') || fullText.includes('website')) tools.add('Web Browsing');
    if (fullText.includes('api') || fullText.includes('http')) tools.add('API Integration');
    if (fullText.includes('file') || fullText.includes('document') || fullText.includes('csv')) tools.add('File Processing');
    if (fullText.includes('search') || fullText.includes('find')) tools.add('Search');
    if (fullText.includes('email')) tools.add('Email');
    if (fullText.includes('calendar')) tools.add('Calendar');
    if (fullText.includes('database')) tools.add('Database');
    
    return Array.from(tools).join(', ');
  }

  private generateAvatar(name: string, categories: string): string {
    // Map categories to appropriate icons/emojis
    const categoryMap: Record<string, string> = {
      'AI & ML': '🤖',
      'Web Development': '💻',
      'Data & Analytics': '📊',
      'Security': '🔐',
      'Mobile Development': '📱',
      'Cloud & DevOps': '☁️',
      'Business Strategy': '📈',
      'Marketing': '📢',
      'Finance': '💰',
      'Legal & Compliance': '⚖️',
      'Human Resources': '👥',
      'Content Creation': '✍️',
      'Design': '🎨',
      'Media Production': '🎬',
      'Productivity': '⚡',
      'Research': '🔍',
      'Education': '🎓',
      'Health & Wellness': '🏥',
      'Lifestyle': '🌟',
      'General': '🔧'
    };

    // Get the first category
    const firstCategory = categories.split(',')[0]?.trim() || 'General';
    return categoryMap[firstCategory] || '🔧';
  }

  private generateColor(categories: string): string {
    const categoryColors: Record<string, string> = {
      'AI & ML': '#6366f1', // indigo
      'Web Development': '#3b82f6', // blue
      'Data & Analytics': '#10b981', // emerald
      'Security': '#ef4444', // red
      'Mobile Development': '#8b5cf6', // violet
      'Cloud & DevOps': '#06b6d4', // cyan
      'Business Strategy': '#f59e0b', // amber
      'Marketing': '#ec4899', // pink
      'Finance': '#22c55e', // green
      'Legal & Compliance': '#64748b', // slate
      'Human Resources': '#f97316', // orange
      'Content Creation': '#a855f7', // purple
      'Design': '#f43f5e', // rose
      'Media Production': '#84cc16', // lime
      'Productivity': '#eab308', // yellow
      'Research': '#14b8a6', // teal
      'Education': '#3b82f6', // blue
      'Health & Wellness': '#dc2626', // red
      'Lifestyle': '#d946ef', // fuchsia
      'General': '#6b7280' // gray
    };

    const firstCategory = categories.split(',')[0]?.trim() || 'General';
    return categoryColors[firstCategory] || '#6b7280';
  }

  private convertToAgent(specialistData: AgentSpecialistJSON): DatabaseAgent {
    const categories = this.categorizeAgent(specialistData.agentname, specialistData.description, specialistData.systemprompt);
    const tags = this.generateTags(specialistData.agentname, specialistData.description, specialistData);
    const difficulty = this.estimateDifficulty(specialistData.systemprompt, specialistData);
    const estimatedTime = this.estimateTime(difficulty, specialistData);
    const tools = this.generateTools(specialistData.description, specialistData.systemprompt, specialistData);
    const avatar = this.generateAvatar(specialistData.agentname, categories);
    const color = this.generateColor(categories);

    return {
      id: this.generateAgentId(specialistData.agentname),
      name: specialistData.agentname,
      role: specialistData.agentname, // Use the agent name as role for specialists
      description: specialistData.description,
      systemInstruction: specialistData.systemprompt,
      avatar: avatar,
      color: color,
      categories: categories,
      tags: tags,
      difficulty: difficulty,
      estimatedTime: estimatedTime,
      tools: tools,
      sourceType: 'specialist',
      metadata: JSON.stringify({
        originalData: specialistData,
        chatgptLink: specialistData.chatgptlink,
        capabilities: {
          isAgent: specialistData['is-agent'],
          isSingleTurn: specialistData['is-single-turn'] === 'true',
          structuredOutput: specialistData['structured-output-generation'] === 'true',
          imageGeneration: specialistData['image-generation'] === 'true',
          dataUtility: specialistData['data-utility'] === 'true'
        },
        importedAt: new Date().toISOString()
      })
    };
  }

  private async processAgentFile(filePath: string): Promise<void> {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const specialistData: AgentSpecialistJSON = JSON.parse(fileContent);
      
      // Convert to our database format
      const agent = this.convertToAgent(specialistData);
      
      // Check if agent already exists
      const existingAgent = await this.db.getAgent(agent.id);
      if (existingAgent) {
        console.log(`Skipping existing agent: ${agent.name}`);
        this.skippedCount++;
        return;
      }
      
      // Add to database
      await this.db.addAgent(agent);
      this.importedCount++;
      
      if (this.importedCount % 50 === 0) {
        console.log(`Imported ${this.importedCount} agents...`);
      }
      
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
      this.errorCount++;
    }
  }

  public async importAllAgents(): Promise<void> {
    console.log('🚀 Starting Agent Specialists Import...');
    console.log(`📂 Source directory: ${this.agentSpecialistDir}`);
    
    try {
      // Get all JSON files
      const files = fs.readdirSync(this.agentSpecialistDir)
        .filter(file => file.endsWith('.json'))
        .map(file => path.join(this.agentSpecialistDir, file));
      
      console.log(`📊 Found ${files.length} agent specialist files`);
      
      // Process each file
      for (const filePath of files) {
        await this.processAgentFile(filePath);
      }
      
      console.log('\n✅ Import Complete!');
      console.log(`📈 Statistics:`);
      console.log(`   • Imported: ${this.importedCount} agents`);
      console.log(`   • Skipped: ${this.skippedCount} agents (already existed)`);
      console.log(`   • Errors: ${this.errorCount} agents`);
      console.log(`   • Total Processed: ${files.length} files`);
      
      // Get final database stats
      const totalAgents = await this.db.getAgentCount();
      console.log(`🎯 Total agents in database: ${totalAgents}`);
      
    } catch (error) {
      console.error('❌ Import failed:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    this.db.close();
  }
}

// Main execution
async function main() {
  const importer = new AgentSpecialistImporter();
  
  try {
    await importer.importAllAgents();
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await importer.close();
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  main();
}

export { AgentSpecialistImporter };