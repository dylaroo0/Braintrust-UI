# Technology Stack

## Frontend Framework
- **React 19** with TypeScript
- **Vite** for build tooling and development server
- **JSX Transform**: Uses new JSX transform (no React import needed)

## State Management
- **Zustand** for global state management
- Custom memory store for conversation history and project data
- Local component state with React hooks

## AI Integration
- **Google Gemini API** (@google/genai) for AI responses
- **OpenRouter API** for multi-model access and diversity
- **Dynamic Agent System**: Text-based agent configurations (YAML/JSON)
- **Code Sandbox**: Docker-based safe code execution environment
- **External AI Integration**: Browser extension for ChatGPT, Grok, DeepSeek

## Backend & Communication
- **Express.js** server for API endpoints
- **WebSockets** (ws) for real-time communication
- Environment variables for API key management

## Development Tools
- **TypeScript 5.7.2** with strict mode enabled
- **Node.js** (v16+) runtime
- **npm** for package management

## Build Configuration
- **Vite config** with path aliases (@/* maps to root)
- **TypeScript config** with bundler module resolution
- Environment variable injection for API keys

## Common Commands

### Development
```bash
npm run dev          # Start development server (port 5173)
npm run start        # Start production server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Dependencies
```bash
npm install                    # Install all dependencies
npm run install:bmad          # Install bmad-method tooling
```

## Environment Setup
Create `.env.local` file with:
```
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Code Style Conventions
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use interface definitions for all types
- Follow React 19 patterns (no React imports for JSX)
- Use path aliases (@/) for imports from root