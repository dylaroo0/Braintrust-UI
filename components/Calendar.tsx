import React, { useState, useMemo } from 'react';
import { useMemoryStore } from '../stores/memoryStore';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'goal' | 'task' | 'summary' | 'milestone' | 'deadline';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
}

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Get memory data
  const goals = useMemoryStore(state => state.goals);
  const tasks = useMemoryStore(state => state.tasks);
  const conversations = useMemoryStore(state => state.conversations);
  const savedSummaries = useMemoryStore(state => state.savedSummaries);
  
  // Generate calendar events from memory data
  const events = useMemo(() => {
    const calendarEvents: CalendarEvent[] = [];
    
    // Add goal deadlines
    goals.forEach(goal => {
      if (goal.targetDate) {
        calendarEvents.push({
          id: `goal-${goal.id}`,
          title: goal.title,
          date: new Date(goal.targetDate),
          type: 'goal',
          priority: goal.priority,
          description: goal.content,
        });
      }
      
      // Add milestones
      goal.milestones.forEach(milestone => {
        if (milestone.targetDate) {
          calendarEvents.push({
            id: `milestone-${milestone.id}`,
            title: milestone.title,
            date: new Date(milestone.targetDate),
            type: 'milestone',
            description: milestone.description,
          });
        }
      });
    });
    
    // Add task due dates
    tasks.forEach(task => {
      if (task.dueDate) {
        calendarEvents.push({
          id: `task-${task.id}`,
          title: task.title,
          date: new Date(task.dueDate),
          type: 'task',
          priority: task.priority,
          description: task.content,
        });
      }
    });
    
    // Add saved summaries
    savedSummaries.forEach(summary => {
      calendarEvents.push({
        id: `saved-summary-${summary.id}`,
        title: summary.title,
        date: new Date(summary.createdAt),
        type: 'summary',
        description: `${summary.type.replace('-', ' ')} - ${summary.metadata.messageCount} messages, ${summary.metadata.actionItemsCount} action items`,
      });
    });
    
    // Add conversation summaries (group by date) - only if no saved summaries for that date
    const conversationsByDate = new Map<string, number>();
    conversations.forEach(conv => {
      const dateKey = new Date(conv.timestamp).toDateString();
      // Only add if no saved summary exists for this date
      const hasSavedSummary = savedSummaries.some(summary => 
        new Date(summary.createdAt).toDateString() === dateKey
      );
      if (!hasSavedSummary) {
        conversationsByDate.set(dateKey, (conversationsByDate.get(dateKey) || 0) + 1);
      }
    });
    
    conversationsByDate.forEach((count, dateKey) => {
      calendarEvents.push({
        id: `conversation-${dateKey}`,
        title: `${count} conversation${count > 1 ? 's' : ''}`,
        date: new Date(dateKey),
        type: 'summary',
        description: `${count} recorded conversation${count > 1 ? 's' : ''} on this date`,
      });
    });
    
    return calendarEvents;
  }, [goals, tasks, conversations, savedSummaries]);
  
  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const days = [];
    const currentDateObj = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => 
        event.date.toDateString() === currentDateObj.toDateString()
      );
      
      days.push({
        date: new Date(currentDateObj),
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });
      
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return days;
  }, [currentDate, events]);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'goal': return 'bg-green-500';
      case 'task': return 'bg-blue-500';
      case 'milestone': return 'bg-purple-500';
      case 'summary': return 'bg-orange-500';
      case 'deadline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'goal': return '🎯';
      case 'task': return '📋';
      case 'milestone': return '🏁';
      case 'summary': return '📝';
      case 'deadline': return '⏰';
      default: return '📅';
    }
  };
  
  return (
    <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={goToToday}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToNextMonth}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
          >
            →
          </button>
        </div>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              min-h-20 p-1 border border-gray-700 rounded cursor-pointer transition-colors
              ${day.isCurrentMonth ? 'bg-gray-900' : 'bg-gray-800/50'}
              ${day.isToday ? 'ring-2 ring-indigo-500' : ''}
              ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-indigo-900/50' : ''}
              hover:bg-gray-700/50
            `}
            onClick={() => setSelectedDate(day.date)}
          >
            {/* Date Number */}
            <div className={`text-sm font-medium mb-1 ${
              day.isCurrentMonth ? 'text-white' : 'text-gray-500'
            } ${day.isToday ? 'text-indigo-400 font-bold' : ''}`}>
              {day.date.getDate()}
            </div>
            
            {/* Events */}
            <div className="space-y-1">
              {day.events.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventColor(event.type)}`}
                  title={`${getEventIcon(event.type)} ${event.title}${event.description ? ': ' + event.description : ''}`}
                >
                  {getEventIcon(event.type)} {event.title}
                </div>
              ))}
              {day.events.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-white mb-2">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          <div className="space-y-2">
            {events
              .filter(event => event.date.toDateString() === selectedDate.toDateString())
              .map(event => (
                <div key={event.id} className="flex items-start gap-2 text-sm">
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                  <div>
                    <div className="font-medium text-white">{event.title}</div>
                    {event.description && (
                      <div className="text-gray-400 text-xs">{event.description}</div>
                    )}
                    {event.priority && (
                      <div className={`text-xs font-medium ${
                        event.priority === 'critical' ? 'text-red-400' :
                        event.priority === 'high' ? 'text-orange-400' :
                        event.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {event.priority.toUpperCase()} PRIORITY
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {events.filter(event => event.date.toDateString() === selectedDate.toDateString()).length === 0 && (
              <div className="text-gray-400 text-sm">No events on this date</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;