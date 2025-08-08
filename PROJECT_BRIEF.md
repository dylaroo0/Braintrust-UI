# Braintrust Circle - Flexible Agent System Project Brief

## Project Vision
Transform Braintrust Circle from a hardcoded 3-agent system into a flexible, extensible multi-agent platform where users can select from diverse AI specialists and create custom agent teams for any domain.

## Core Architecture Philosophy
- **Organizer as "Super Brain"**: Contains all deep methodological intelligence (BMad processes, brainstorming techniques, elicitation methods)
- **Specialists as Domain Filters**: Simple, focused agents providing domain-specific perspectives
- **Process vs. Perspective**: Organizer handles HOW to think, Specialists handle WHAT to consider

## Key Features Being Built
1. **Dynamic Agent Selection**: Replace hardcoded agents with user-selectable library
2. **Agent Builder**: Form-based interface for creating custom specialists
3. **Project Templates**: Pre-configured agent teams (Household Management, Creative Writing, Software Development, etc.)
4. **Workflow Management**: Circular BMad workflow navigator with stage-specific functionality
5. **Enhanced Organizer**: Super-brain with 20+ brainstorming techniques and process modes
6. **Customizable UI**: Personalized panel names, colors, themes

## Implementation Approach
**UI-First Development**: Build visual foundation first, then connect deeper functionality
- Phase 1: Visual components and interface structure
- Phase 2: Agent system foundation and data models  
- Phase 3: Advanced features and integrations

## Technical Stack
- React 19 + TypeScript + Vite
- Zustand for state management
- Google Gemini API (+ OpenRouter support)
- Text-based agent storage (YAML/JSON)
- Electron wrapper for desktop version

## Success Criteria
- Users can create and customize AI specialists without technical knowledge
- Project templates provide immediate value for common use cases
- Organizer provides sophisticated process orchestration
- System scales to 50+ diverse agent specialists
- Desktop and web versions maintain feature parity