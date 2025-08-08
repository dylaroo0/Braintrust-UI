# Developer Guide - Braintrust Circle

## Quick Start for Developers

### Prerequisites
- Node.js v18+
- Google Gemini API key

### Setup
```bash
git clone <repo-url>
cd BrainTrust_circle-main
npm install
# Create .env.local with GEMINI_API_KEY=your_key
npm run dev
```

## Architecture Overview

### Core Philosophy
- **Organizer = Super Brain**: All methodological intelligence (BMad processes, brainstorming, orchestration)
- **Specialists = Domain Filters**: Simple, focused agents with domain-specific perspectives
- **UI-First Development**: Visual components before deep functionality

### Key Directories
```
├── components/           # React UI components
├── services/            # API services and business logic
├── stores/              # Zustand state management
├── .kiro/specs/         # Feature specifications
├── .bmad-core/          # BMad methodology resources
└── docs/                # Project documentation
```

## Implementation Status

### ✅ Completed
- Basic radial UI with agent circle
- Memory system with Zustand
- BMad service integration
- Project specifications (requirements, design, tasks)

### 🚧 In Progress (UI-First Phase)
- Flexible agent system
- Agent Builder interface
- Project template system
- Enhanced Organizer capabilities

### 📋 Next Phase
- Agent data models and storage
- Workflow management
- Multi-API integration

## Contributing

### Current Priority: UI-First Development
1. **Phase 1**: Visual foundation (Tasks 1-6 in tasks.md)
2. **Phase 2**: Agent system foundation (Tasks 7-9)
3. **Phase 3**: Advanced features (Tasks 10-25)

### Key Files to Understand
- `tasks.md` - Complete implementation plan
- `requirements.md` - Feature requirements
- `design.md` - Technical architecture
- `PROJECT_BRIEF.md` - Project vision and goals

## Agent Development

### Creating New Specialists
Agents are simple YAML configurations:
```yaml
id: marketing-expert
name: Marketing Expert
role: Growth & Strategy Specialist
systemInstruction: "You are a marketing strategist focused on user acquisition..."
color: "#F59E0B"
category: "Business"
```

### Agent Categories
- Business & Strategy
- Creative & Content  
- Technical & Engineering
- Research & Analysis
- Wellness & Personal
- Household & Life Management

## Testing
- Component tests for UI interactions
- Integration tests for agent workflows
- End-to-end tests for complete user journeys

See `tasks.md` for detailed implementation guidance.