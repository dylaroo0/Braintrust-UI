# Requirements Document

## Introduction

Transform the current hardcoded 3-agent system (Designer, Developer, Engineer) in BrainTrust Circle into a dynamic, draggable agent system. This enhancement allows users to move agent circles around the interface with mouse interactions while maintaining the existing visual design and functionality.

**Current System Context:**
- **Existing Architecture**: React 19.1.0 + TypeScript 5.7.2 + Vite 6.2.0 with Zustand 5.0.6 state management
- **Current Agents**: 3 hardcoded agents (Designer, Developer, Engineer) defined in constants.tsx
- **UI Layout**: Agent circles positioned around central chat feed
- **Interaction**: Double-click shows agent character card

**Enhancement Scope:**
Replace hardcoded agent positioning with draggable functionality while preserving all existing visual design and agent behavior.

## Requirements

### Requirement 1

**User Story:** As a user, I want to drag and drop agent circles around the interface with my mouse, so that I can customize the layout and positioning of agents according to my preferences.

#### Acceptance Criteria

1. WHEN clicking and holding an agent circle THEN the system SHALL enable drag mode with visual feedback
2. WHEN dragging an agent circle THEN the system SHALL move the agent smoothly following mouse cursor
3. WHEN releasing mouse button THEN the system SHALL drop the agent at the new position
4. WHEN dragging THEN the system SHALL provide visual indicators (cursor change, agent highlight, or shadow)
5. WHEN agent is dropped THEN the system SHALL save the new position and maintain it across sessions
6. WHEN double-clicking agent THEN the system SHALL still show character card as before
7. IF agents overlap THEN the system SHALL handle collision detection appropriately

### Requirement 2

**User Story:** As a developer, I want to replace the hardcoded agent system with dynamic agent loading, so that agents can be positioned and managed programmatically rather than through static constants.

#### Acceptance Criteria

1. WHEN system loads THEN it SHALL remove hardcoded AGENTS constant from constants.tsx
2. WHEN agents are created THEN the system SHALL use dynamic agent configuration with position data
3. WHEN storing agent data THEN the system SHALL include x,y coordinates for each agent
4. WHEN loading agents THEN the system SHALL restore saved positions from previous sessions
5. WHEN agents are moved THEN the system SHALL update position data in real-time
6. WHEN system initializes THEN it SHALL load default agent positions if no saved positions exist
7. IF position data is corrupted THEN the system SHALL fallback to default positioning

### Requirement 3

**User Story:** As a user, I want the draggable agent system to maintain all existing functionality and visual design, so that the enhancement feels seamless and doesn't disrupt my current workflow.

#### Acceptance Criteria

1. WHEN using draggable agents THEN the system SHALL preserve existing agent circle visual design
2. WHEN agents are moved THEN the system SHALL maintain all existing agent functionality (chat responses, specializations)
3. WHEN interacting with agents THEN the system SHALL keep double-click to show character card behavior
4. WHEN dragging THEN the system SHALL not interfere with existing chat functionality
5. WHEN positioning agents THEN the system SHALL respect workspace boundaries and panels
6. WHEN multiple agents exist THEN the system SHALL allow independent movement of each agent
7. IF drag conflicts with other UI elements THEN the system SHALL prioritize existing functionality