import type { SavedSummary, Message } from '../types';
import { processConversation } from './conversationProcessor';

/**
 * Service for handling summary operations
 * This bridges the conversation processing with the memory store
 */
export class SummaryService {
  private saveSummaryFn: (summary: Omit<SavedSummary, 'id' | 'createdAt'>) => SavedSummary;
  private getCurrentProjectId: () => string | null;

  constructor(
    saveSummaryFn: (summary: Omit<SavedSummary, 'id' | 'createdAt'>) => SavedSummary,
    getCurrentProjectId: () => string | null
  ) {
    this.saveSummaryFn = saveSummaryFn;
    this.getCurrentProjectId = getCurrentProjectId;
  }

  /**
   * Save a processed conversation as a summary
   */
  saveProcessedConversation(
    type: 'priority-list' | 'engineering-plan' | 'design-plan' | 'management-plan' | 'conversation-summary' | 'decisions' | 'goals',
    content: string,
    recentMessages: Message[],
    processed: any
  ): SavedSummary {
    const currentProjectId = this.getCurrentProjectId();
    const conversationIds = recentMessages.map(msg => msg.id);
    
    // Generate title based on type and content
    const title = this.generateTitle(type, processed);
    
    // Extract metadata from processed conversation
    const participants = [...new Set(recentMessages.map(m => m.sender === 'user' ? 'You' : m.agent.name))];
    const keyTopics = this.extractKeyTopics(processed);
    
    const summary: Omit<SavedSummary, 'id' | 'createdAt'> = {
      title,
      content,
      type,
      projectId: currentProjectId || undefined,
      conversationIds,
      metadata: {
        participantCount: participants.length,
        messageCount: recentMessages.length,
        keyTopics,
        actionItemsCount: processed.actionItems?.length || 0,
        decisionsCount: processed.decisions?.length || 0,
      },
    };

    return this.saveSummaryFn(summary);
  }

  /**
   * Generate an appropriate title for the summary
   */
  private generateTitle(type: string, processed: any): string {
    const timestamp = new Date().toLocaleDateString();
    
    switch (type) {
      case 'priority-list':
        return `Priority List - ${timestamp}`;
      case 'engineering-plan':
        return `Engineering Plan - ${timestamp}`;
      case 'design-plan':
        return `Design Plan - ${timestamp}`;
      case 'management-plan':
        return `Management Plan - ${timestamp}`;
      case 'conversation-summary':
        return `Conversation Summary - ${timestamp}`;
      case 'decisions':
        return `Decisions Made - ${timestamp}`;
      case 'goals':
        return `Goals Identified - ${timestamp}`;
      default:
        return `Summary - ${timestamp}`;
    }
  }

  /**
   * Extract key topics from processed conversation
   */
  private extractKeyTopics(processed: any): string[] {
    const topics: string[] = [];
    
    // Extract topics from action items
    if (processed.actionItems) {
      processed.actionItems.forEach((item: any) => {
        if (item.title) {
          const words = item.title.toLowerCase().split(' ');
          words.forEach(word => {
            if (word.length > 4 && !topics.includes(word)) {
              topics.push(word);
            }
          });
        }
      });
    }
    
    // Extract topics from goals
    if (processed.goals) {
      processed.goals.forEach((goal: any) => {
        if (goal.title) {
          const words = goal.title.toLowerCase().split(' ');
          words.forEach(word => {
            if (word.length > 4 && !topics.includes(word)) {
              topics.push(word);
            }
          });
        }
      });
    }
    
    return topics.slice(0, 5); // Limit to top 5 topics
  }
}

/**
 * Enhanced save request handler that actually saves to memory
 */
export function createEnhancedSaveHandler(summaryService: SummaryService) {
  return function handleSaveRequest(history: Message[], processed: any): string {
    // Look at the last few messages to understand what was just processed
    const lastMessages = history.slice(-3);
    const lastAgentMessage = lastMessages.reverse().find(msg => msg.sender !== 'user');

    if (!lastAgentMessage) {
      return "I don't see anything recent to save. Please ask me to process a conversation first (like 'make a priority list'), then say 'save that'.";
    }

    const lastResponse = lastAgentMessage.text.toLowerCase();
    const recentMessages = history.slice(-10);

    try {
      let savedSummary: SavedSummary;

      // Determine what type of content was just generated and save it
      if (lastResponse.includes('priority list')) {
        savedSummary = summaryService.saveProcessedConversation(
          'priority-list',
          lastAgentMessage.text,
          recentMessages,
          processed
        );
        
        return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved with:\n\n• ${processed.priorities?.length || 0} prioritized items\n• ${processed.actionItems?.length || 0} action items\n• ${processed.decisions?.length || 0} decisions\n\nYou can view this in the organizer panel under Saved Summaries and on the calendar. It's now part of your project's permanent record.`;
      }

      if (lastResponse.includes('engineering plan')) {
        savedSummary = summaryService.saveProcessedConversation(
          'engineering-plan',
          lastAgentMessage.text,
          recentMessages,
          processed
        );
        
        return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved. This detailed engineering plan includes:\n\n• All technical action items\n• Implementation priorities\n• Development dependencies\n\nYou can copy this plan to share with engineers or view it in the organizer panel.`;
      }

      if (lastResponse.includes('design plan')) {
        savedSummary = summaryService.saveProcessedConversation(
          'design-plan',
          lastAgentMessage.text,
          recentMessages,
          processed
        );
        
        return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved. This design plan includes:\n\n• UI/UX requirements\n• Design priorities\n• Visual specifications\n\nYou can share this with designers or reference it in future discussions.`;
      }

      if (lastResponse.includes('management plan')) {
        savedSummary = summaryService.saveProcessedConversation(
          'management-plan',
          lastAgentMessage.text,
          recentMessages,
          processed
        );
        
        return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved. This management plan includes:\n\n• Coordination tasks\n• Resource allocation\n• Timeline management\n\nYou can use this for project coordination and team management.`;
      }

      if (lastResponse.includes('summary')) {
        savedSummary = summaryService.saveProcessedConversation(
          'conversation-summary',
          lastAgentMessage.text,
          recentMessages,
          processed
        );
        
        return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved including:\n\n• Key discussion points\n• ${processed.actionItems?.length || 0} action items\n• ${processed.decisions?.length || 0} decisions\n\nThis summary is now part of your project timeline and can be referenced in future conversations.`;
      }

      if (lastResponse.includes('decisions')) {
        savedSummary = summaryService.saveProcessedConversation(
          'decisions',
          lastAgentMessage.text,
          recentMessages,
          processed
        );
        
        return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved with ${processed.decisions?.length || 0} decision(s):\n\n${processed.decisions?.slice(0, 3).map((d: any, i: number) => `${i + 1}. ${d.decision}`).join('\n') || ''}\n\nThese decisions are now part of your project's permanent record and will inform future recommendations.`;
      }

      if (lastResponse.includes('goals')) {
        savedSummary = summaryService.saveProcessedConversation(
          'goals',
          lastAgentMessage.text,
          recentMessages,
          processed
        );
        
        return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved with ${processed.goals?.length || 0} goal(s):\n\n${processed.goals?.slice(0, 3).map((g: any, i: number) => `${i + 1}. ${g.title}`).join('\n') || ''}\n\nThese goals are now part of your project's permanent record and will be tracked for progress.`;
      }

      // Fallback - save as general conversation summary
      savedSummary = summaryService.saveProcessedConversation(
        'conversation-summary',
        lastAgentMessage.text,
        recentMessages,
        processed
      );

      return `✅ **Saved to Project Memory!**\n\n**"${savedSummary.title}"** has been saved. You can view it in the organizer panel under Saved Summaries and on the project calendar.`;

    } catch (error) {
      console.error('Error saving summary:', error);
      return `❌ **Error saving summary.** There was a problem storing the information. Please try again or contact support if the issue persists.`;
    }
  };
}