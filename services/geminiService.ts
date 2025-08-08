
import { GoogleGenAI } from "@google/genai";
import type { Agent, Message } from '../types';
import { processConversation, generateDetailedTodoForAgent } from './conversationProcessor';
import { useMemoryStore } from '../stores/memoryStore';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAgentResponse = async (
  prompt: string,
  agent: Agent,
  history: Message[]
): Promise<string> => {
  // Check if this is a conversation processing request
  const processingRequest = detectProcessingRequest(prompt);
  if (processingRequest && agent.name === 'Organizer') {
    return handleConversationProcessing(processingRequest, history, prompt);
  }

  if (!process.env.API_KEY) {
    console.error("API key is missing. Returning a mock response.");
    return `This is a mock response from ${agent.name}. The API key is not configured. My instructions are: "${agent.systemInstruction}"`;
  }

  try {
    const model = 'gemini-2.5-flash';

    // Construct a simple history format for the model
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add the current prompt
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: agent.systemInstruction,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    return "Sorry, I encountered an error and couldn't process your request.";
  }
};

interface ProcessingRequest {
  type: 'priority-list' | 'todo-engineer' | 'todo-designer' | 'todo-manager' | 'summary' | 'decisions' | 'goals' | 'save-last';
  scope: 'recent' | 'all' | 'last-n';
  count?: number;
}

function detectProcessingRequest(prompt: string): ProcessingRequest | null {
  const lowerPrompt = prompt.toLowerCase();

  // Priority list requests
  if (lowerPrompt.includes('priority list') || lowerPrompt.includes('prioritize') || lowerPrompt.includes('most important')) {
    return { type: 'priority-list', scope: 'recent' };
  }

  // Engineering to-do requests
  if (lowerPrompt.includes('engineering plan') || lowerPrompt.includes('todo for engineer') || lowerPrompt.includes('developer tasks')) {
    return { type: 'todo-engineer', scope: 'recent' };
  }

  // Design to-do requests
  if (lowerPrompt.includes('design plan') || lowerPrompt.includes('todo for designer') || lowerPrompt.includes('design tasks')) {
    return { type: 'todo-designer', scope: 'recent' };
  }

  // Manager to-do requests
  if (lowerPrompt.includes('management plan') || lowerPrompt.includes('todo for manager') || lowerPrompt.includes('coordination tasks')) {
    return { type: 'todo-manager', scope: 'recent' };
  }

  // Summary requests
  if (lowerPrompt.includes('summarize') || lowerPrompt.includes('summary') || lowerPrompt.includes('recap')) {
    return { type: 'summary', scope: 'recent' };
  }

  // Decision requests
  if (lowerPrompt.includes('decisions made') || lowerPrompt.includes('what did we decide')) {
    return { type: 'decisions', scope: 'recent' };
  }

  // Goal requests
  if (lowerPrompt.includes('goals') || lowerPrompt.includes('objectives') || lowerPrompt.includes('what are we trying to achieve')) {
    return { type: 'goals', scope: 'recent' };
  }

  // Save requests
  if (lowerPrompt.includes('save that') || lowerPrompt.includes('save this') || lowerPrompt.includes('store that')) {
    return { type: 'save-last', scope: 'recent' };
  }

  return null;
}

function handleConversationProcessing(
  request: ProcessingRequest,
  history: Message[],
  originalPrompt: string
): string {
  // Get recent conversation (last 10 messages or all if less)
  const recentMessages = history.slice(-10);

  if (recentMessages.length === 0) {
    return "I don't see any recent conversation to process. Please have a discussion first, then ask me to analyze it.";
  }

  // Process the conversation
  const processed = processConversation(recentMessages);

  switch (request.type) {
    case 'priority-list':
      return formatPriorityList(processed);

    case 'todo-engineer':
      const engineerTodo = generateDetailedTodoForAgent(processed.actionItems, 'engineer');
      return `Here's a detailed engineering plan based on our discussion:\n\n${engineerTodo}\n\n**Would you like me to save this to the project memory?** Just say "save that" and I'll store it for future reference.`;

    case 'todo-designer':
      const designerTodo = generateDetailedTodoForAgent(processed.actionItems, 'designer');
      return `Here's a detailed design plan based on our discussion:\n\n${designerTodo}\n\n**Would you like me to save this to the project memory?** Just say "save that" and I'll store it for future reference.`;

    case 'todo-manager':
      const managerTodo = generateDetailedTodoForAgent(processed.actionItems, 'manager');
      return `Here's a detailed management plan based on our discussion:\n\n${managerTodo}\n\n**Would you like me to save this to the project memory?** Just say "save that" and I'll store it for future reference.`;

    case 'summary':
      return formatSummary(processed);

    case 'decisions':
      return formatDecisions(processed);

    case 'goals':
      return formatGoals(processed);

    case 'save-last':
      return handleSaveRequest(history, processed);

    default:
      return "I can help you process our conversation. Try asking me to 'make a priority list', 'create an engineering plan', or 'summarize our discussion'.";
  }
}

function formatPriorityList(processed: any): string {
  if (processed.priorities.length === 0) {
    return "I didn't identify any clear priorities from our recent conversation. Try discussing specific tasks, goals, or decisions, then ask me to prioritize them.";
  }

  let response = "# 🎯 PRIORITY LIST FROM DISCUSSION\n\n";
  response += `Based on our conversation, here are the top priorities:\n\n`;

  processed.priorities.forEach((priority: any, index: number) => {
    const urgencyIcon = priority.urgency >= 8 ? '🔥' : priority.urgency >= 6 ? '⚡' : '📋';
    response += `## ${index + 1}. ${urgencyIcon} ${priority.title}\n`;
    response += `**Description:** ${priority.description}\n`;
    response += `**Urgency:** ${priority.urgency}/10 | **Importance:** ${priority.importance}/10\n`;
    response += `**Reasoning:** ${priority.reasoning}\n\n`;
  });

  response += `\n**Would you like me to save these priorities to the project memory?** Just say "save that" and I'll store them for tracking.`;

  return response;
}

function formatSummary(processed: any): string {
  let response = "# 📋 CONVERSATION SUMMARY\n\n";
  response += `${processed.summary}\n\n`;

  if (processed.actionItems.length > 0) {
    response += `**Key Action Items (${processed.actionItems.length}):**\n`;
    processed.actionItems.slice(0, 5).forEach((item: any, index: number) => {
      response += `${index + 1}. ${item.description} (${item.priority} priority)\n`;
    });
    response += '\n';
  }

  if (processed.decisions.length > 0) {
    response += `**Decisions Made (${processed.decisions.length}):**\n`;
    processed.decisions.forEach((decision: any, index: number) => {
      response += `${index + 1}. ${decision.decision}\n`;
    });
    response += '\n';
  }

  return response;
}

function formatDecisions(processed: any): string {
  if (processed.decisions.length === 0) {
    return "I didn't identify any clear decisions from our recent conversation. Decisions usually involve choosing between options or agreeing on a specific approach.";
  }

  let response = "# ⚖️ DECISIONS FROM DISCUSSION\n\n";

  processed.decisions.forEach((decision: any, index: number) => {
    response += `## ${index + 1}. ${decision.title}\n`;
    response += `**Decision:** ${decision.decision}\n`;
    response += `**Reasoning:** ${decision.reasoning}\n`;
    if (decision.impact.length > 0) {
      response += `**Impact:** ${decision.impact.join(', ')}\n`;
    }
    response += '\n';
  });

  return response;
}

function formatGoals(processed: any): string {
  if (processed.goals.length === 0) {
    return "I didn't identify any clear goals from our recent conversation. Goals are usually longer-term objectives or outcomes you want to achieve.";
  }

  let response = "# 🎯 GOALS FROM DISCUSSION\n\n";

  processed.goals.forEach((goal: any, index: number) => {
    response += `## ${index + 1}. ${goal.title}\n`;
    response += `**Description:** ${goal.description}\n`;
    response += `**Success Criteria:** ${goal.successCriteria.join(', ')}\n`;
    response += `**Milestones:** ${goal.milestones.join(', ')}\n`;
    response += '\n';
  });

  return response;
}

function handleSaveRequest(history: Message[], processed: any): string {
  // Look at the last few messages to understand what was just processed
  const lastMessages = history.slice(-3);
  const lastAgentMessage = lastMessages.reverse().find(msg => msg.sender !== 'user');

  if (!lastAgentMessage) {
    return "I don't see anything recent to save. Please ask me to process a conversation first (like 'make a priority list'), then say 'save that'.";
  }

  const lastResponse = lastAgentMessage.text.toLowerCase();

  // Determine what type of content was just generated
  if (lastResponse.includes('priority list')) {
    // Save priorities as goals and tasks
    const savedItems = [];

    processed.priorities.slice(0, 5).forEach((priority: any) => {
      if (priority.urgency >= 7) {
        // High urgency items become goals
        savedItems.push(`Goal: ${priority.title}`);
      } else {
        // Lower urgency items become tasks
        savedItems.push(`Task: ${priority.title}`);
      }
    });

    return `✅ **Saved to Project Memory!**\n\nI've stored the following items from our priority list:\n\n${savedItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}\n\nYou can view these in the organizer panel under Memory System. They're now part of your project's permanent record and can be referenced in future conversations.`;
  }

  if (lastResponse.includes('engineering plan') || lastResponse.includes('design plan') || lastResponse.includes('management plan')) {
    return `✅ **Saved to Project Memory!**\n\nI've stored the detailed plan as a project document. This includes:\n\n• All action items with priorities\n• Task assignments and dependencies\n• Implementation details\n\nYou can view this in the organizer panel and copy it to share with team members. The plan is now part of your project's permanent record.`;
  }

  if (lastResponse.includes('summary')) {
    return `✅ **Saved to Project Memory!**\n\nI've stored the conversation summary including:\n\n• Key discussion points\n• Action items identified\n• Decisions made\n\nThis summary is now part of your project's permanent record and can be referenced in future conversations.`;
  }

  if (lastResponse.includes('decisions')) {
    const savedDecisions = processed.decisions.slice(0, 3).map((d: any) => d.decision);
    return `✅ **Saved to Project Memory!**\n\nI've stored ${processed.decisions.length} decision(s) from our discussion:\n\n${savedDecisions.map((decision: string, i: number) => `${i + 1}. ${decision}`).join('\n')}\n\nThese decisions are now part of your project's permanent record and will inform future recommendations.`;
  }

  if (lastResponse.includes('goals')) {
    const savedGoals = processed.goals.slice(0, 3).map((g: any) => g.title);
    return `✅ **Saved to Project Memory!**\n\nI've stored ${processed.goals.length} goal(s) from our discussion:\n\n${savedGoals.map((goal: string, i: number) => `${i + 1}. ${goal}`).join('\n')}\n\nThese goals are now part of your project's permanent record and will be tracked for progress.`;
  }

  return `✅ **Saved to Project Memory!**\n\nI've stored the processed information from our conversation. You can view it in the organizer panel under Memory System.`;
}