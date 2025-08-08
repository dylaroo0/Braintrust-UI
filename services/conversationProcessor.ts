import type { Message, MemoryTask, Goal, Decision, Agent } from '../types';

export interface ProcessedConversation {
  summary: string;
  actionItems: ActionItem[];
  decisions: DecisionItem[];
  goals: GoalItem[];
  priorities: PriorityItem[];
}

export interface ActionItem {
  title: string;
  description: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours?: number;
  dependencies?: string[];
}

export interface DecisionItem {
  title: string;
  decision: string;
  reasoning: string;
  alternatives: string[];
  impact: string[];
}

export interface GoalItem {
  title: string;
  description: string;
  successCriteria: string[];
  targetDate?: Date;
  milestones: string[];
}

export interface PriorityItem {
  title: string;
  description: string;
  urgency: number; // 1-10 scale
  importance: number; // 1-10 scale
  reasoning: string;
}

/**
 * Process a conversation and extract actionable items
 * This is a simplified version - in production you'd use AI/LLM for this
 */
export function processConversation(messages: Message[]): ProcessedConversation {
  // For now, we'll create a basic processor that looks for keywords
  // In production, this would use AI to analyze the conversation
  
  const conversationText = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
  
  // Basic keyword-based extraction (placeholder for AI processing)
  const actionItems = extractActionItems(messages);
  const decisions = extractDecisions(messages);
  const goals = extractGoals(messages);
  const priorities = generatePriorities(actionItems, decisions, goals);
  
  return {
    summary: generateSummary(messages),
    actionItems,
    decisions,
    goals,
    priorities,
  };
}

function extractActionItems(messages: Message[]): ActionItem[] {
  const actionItems: ActionItem[] = [];
  
  // Look for action-oriented keywords
  const actionKeywords = ['need to', 'should', 'must', 'implement', 'create', 'build', 'fix', 'update', 'add'];
  
  messages.forEach(message => {
    const text = message.text.toLowerCase();
    
    // Simple pattern matching for action items
    actionKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        // Extract the sentence containing the action
        const sentences = message.text.split(/[.!?]+/);
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(keyword)) {
            actionItems.push({
              title: sentence.trim().substring(0, 50) + '...',
              description: sentence.trim(),
              priority: determinePriority(sentence),
              assignee: message.agent.name !== 'user' ? message.agent.name : undefined,
            });
          }
        });
      }
    });
  });
  
  return actionItems.slice(0, 10); // Limit to top 10
}

function extractDecisions(messages: Message[]): DecisionItem[] {
  const decisions: DecisionItem[] = [];
  
  const decisionKeywords = ['decide', 'decision', 'choose', 'go with', 'selected', 'agreed'];
  
  messages.forEach(message => {
    const text = message.text.toLowerCase();
    
    decisionKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        const sentences = message.text.split(/[.!?]+/);
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(keyword)) {
            decisions.push({
              title: `Decision: ${sentence.trim().substring(0, 40)}...`,
              decision: sentence.trim(),
              reasoning: 'Based on team discussion',
              alternatives: [],
              impact: ['Team alignment', 'Project direction'],
            });
          }
        });
      }
    });
  });
  
  return decisions.slice(0, 5); // Limit to top 5
}

function extractGoals(messages: Message[]): GoalItem[] {
  const goals: GoalItem[] = [];
  
  const goalKeywords = ['goal', 'objective', 'target', 'aim', 'achieve', 'accomplish'];
  
  messages.forEach(message => {
    const text = message.text.toLowerCase();
    
    goalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        const sentences = message.text.split(/[.!?]+/);
        sentences.forEach(sentence => {
          if (sentence.toLowerCase().includes(keyword)) {
            goals.push({
              title: `Goal: ${sentence.trim().substring(0, 40)}...`,
              description: sentence.trim(),
              successCriteria: ['Completion of related tasks', 'Team satisfaction'],
              milestones: ['Planning phase', 'Implementation phase', 'Review phase'],
            });
          }
        });
      }
    });
  });
  
  return goals.slice(0, 5); // Limit to top 5
}

function generatePriorities(actionItems: ActionItem[], decisions: DecisionItem[], goals: GoalItem[]): PriorityItem[] {
  const priorities: PriorityItem[] = [];
  
  // Convert action items to priorities
  actionItems.forEach(item => {
    const urgency = item.priority === 'critical' ? 10 : item.priority === 'high' ? 8 : item.priority === 'medium' ? 5 : 3;
    priorities.push({
      title: item.title,
      description: item.description,
      urgency,
      importance: urgency, // Simplified - same as urgency for now
      reasoning: `Action item identified from conversation with ${item.priority} priority`,
    });
  });
  
  // Convert goals to priorities
  goals.forEach(goal => {
    priorities.push({
      title: goal.title,
      description: goal.description,
      urgency: 7, // Goals are generally important but not always urgent
      importance: 9, // Goals are very important
      reasoning: 'Strategic goal identified from team discussion',
    });
  });
  
  // Sort by combined urgency + importance score
  return priorities
    .sort((a, b) => (b.urgency + b.importance) - (a.urgency + a.importance))
    .slice(0, 10); // Top 10 priorities
}

function determinePriority(text: string): 'low' | 'medium' | 'high' | 'critical' {
  const urgentWords = ['urgent', 'asap', 'immediately', 'critical', 'emergency'];
  const highWords = ['important', 'priority', 'soon', 'quickly'];
  
  const lowerText = text.toLowerCase();
  
  if (urgentWords.some(word => lowerText.includes(word))) return 'critical';
  if (highWords.some(word => lowerText.includes(word))) return 'high';
  if (lowerText.includes('later') || lowerText.includes('eventually')) return 'low';
  
  return 'medium'; // Default
}

function generateSummary(messages: Message[]): string {
  if (messages.length === 0) return 'No conversation to summarize.';
  
  const participants = [...new Set(messages.map(m => m.sender === 'user' ? 'You' : m.agent.name))];
  const messageCount = messages.length;
  const timeSpan = messages.length > 1 
    ? `${Math.round((new Date(messages[messages.length - 1].timestamp).getTime() - new Date(messages[0].timestamp).getTime()) / 60000)} minutes`
    : 'brief';
  
  return `Conversation summary: ${participants.join(', ')} discussed various topics over ${timeSpan} with ${messageCount} messages exchanged. Key themes included project planning, task assignments, and strategic decisions.`;
}

/**
 * Generate detailed to-do list for a specific agent type
 */
export function generateDetailedTodoForAgent(
  actionItems: ActionItem[], 
  agentType: 'engineer' | 'designer' | 'manager' | 'general',
  projectContext?: string
): string {
  const relevantItems = actionItems.filter(item => {
    const description = item.description.toLowerCase();
    
    switch (agentType) {
      case 'engineer':
        return description.includes('code') || description.includes('implement') || 
               description.includes('build') || description.includes('develop') ||
               description.includes('api') || description.includes('database');
      case 'designer':
        return description.includes('design') || description.includes('ui') || 
               description.includes('ux') || description.includes('mockup') ||
               description.includes('visual') || description.includes('interface');
      case 'manager':
        return description.includes('plan') || description.includes('coordinate') || 
               description.includes('manage') || description.includes('organize') ||
               description.includes('schedule') || description.includes('meeting');
      default:
        return true;
    }
  });
  
  if (relevantItems.length === 0) {
    return `No specific ${agentType} tasks identified from the conversation.`;
  }
  
  let todoList = `# DETAILED TO-DO LIST FOR ${agentType.toUpperCase()}\n`;
  if (projectContext) {
    todoList += `Project: ${projectContext}\n`;
  }
  todoList += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  relevantItems.forEach((item, index) => {
    todoList += `## ${index + 1}. ${item.title}\n`;
    todoList += `**Description:** ${item.description}\n`;
    todoList += `**Priority:** ${item.priority.toUpperCase()}\n`;
    if (item.estimatedHours) {
      todoList += `**Estimated Time:** ${item.estimatedHours} hours\n`;
    }
    if (item.dependencies && item.dependencies.length > 0) {
      todoList += `**Dependencies:** ${item.dependencies.join(', ')}\n`;
    }
    todoList += `**Status:** [ ] Not Started\n\n`;
  });
  
  return todoList;
}