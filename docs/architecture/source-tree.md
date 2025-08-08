# Source Tree Structure

## Root Directory
```
/
├── .kiro/               # Kiro IDE specifications and settings
│   ├── specs/          # Feature specifications
│   └── steering/       # Development guidance
├── components/          # React components
│   ├── AgentAvatar.tsx # Individual agent representations
│   ├── ChatFeed.tsx    # Central conversation interface
│   └── OrganizerPanel.tsx # Admin assistant interface
├── services/            # API and business logic services
│   ├── geminiService.ts # Google Gemini API integration
│   └── agentService.ts  # Agent management and selection
├── stores/              # Zustand state management
│   └── memoryStore.ts   # Conversation history and project data
├── hooks/               # Custom React hooks
├── docs/                # Project documentation
│   └── architecture/    # Architecture documentation
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── package.json        # Dependencies and scripts
```

## Component Organization
```
components/
├── AdminAssistant.tsx   # Main admin interface
├── Calendar.tsx         # Calendar and timeline view
├── ChatFeed.tsx         # AI conversation interface
├── MemorySearch.tsx     # Memory system search
├── MemoryStats.tsx      # Memory usage statistics
├── OrganizerPanel.tsx   # Main organizer interface
└── TaskSidebar.tsx      # Task management sidebar
```

## Services Layer
```
services/
├── conversationProcessor.ts  # AI conversation handling
├── geminiService.ts         # Google Gemini API integration
└── summaryService.ts        # Content summarization
```

## State Management
```
stores/
├── index.ts            # Store exports
├── memoryStore.ts      # Memory system state
└── memoryStore.test.ts # Memory store tests
```

## Key Files
- `App.tsx` - Main application component and routing
- `types.ts` - Global TypeScript type definitions
- `constants.tsx` - Application constants
- `server.js` - Express server for API endpoints
- `vite.config.ts` - Vite build configuration