# Implementation Plan

- [x] 1. Set up SQLite database for agent storage



  - Install better-sqlite3 package for Node.js SQLite integration
  - Create database schema with agents table and FTS index
  - Write database initialization script



  - _Requirements: Database design for 900+ agents with searchable descriptions_

- [x] 2. Create agent data migration system






  - Extract current hardcoded agents from constants.tsx
  - Create seed data script to populate initial agents
  - Implement agent import/export utilities
  - _Requirements: Remove hardcoded agents while preserving functionality_



- [x] 3. Implement agent database service



  - Create AgentSearchService with SQLite queries
  - Implement full-text search for descriptions
  - Add category and tag filtering


  - Write unit tests for database operations

  - _Requirements: Fast search through agent descriptions and metadata_

- [x] 4. Create agent library store (Zustand)



  - Implement AgentLibraryStore with search state
  - Add methods for loading and filtering agents
  - Integrate with database service
  - _Requirements: Dynamic agent loading system_

- [x] 5. Make existing agent circles draggable

  - [x] Install @neodrag/react package (React 19 compatible)
  - [x] Wrap existing AgentAvatar components with draggable functionality
  - [x] Implement drag boundaries to keep agents in viewport
  - [x] Add visual feedback during drag operations
  - [x] Fix React 19 compatibility issues with react-draggable
  - _Requirements: Keep current design but make agents movable_ ✅

- [x] 6. Implement position persistence






  - Create ActiveAgentsStore for managing agent positions
  - Save agent positions to localStorage on drag end
  - Restore positions on app reload
  - _Requirements: Remember agent positions between sessions_

- [ ] 7. Create agent library UI component
  - Build simple agent library panel with search input
  - Display agents in grid layout with basic info
  - Implement click-to-add functionality
  - Add loading states and error handling
  - _Requirements: Click agent from library to load into circle_

- [ ] 8. Integrate agent library with main app
  - Add agent library toggle to existing UI
  - Connect library to active agents system
  - Ensure new agents load into available positions
  - Handle maximum agent limits gracefully
  - _Requirements: Seamless integration with current layout_

- [ ] 9. Remove hardcoded agent dependencies
  - Update App.tsx to use dynamic agent loading
  - Remove AGENTS constant from constants.tsx completely
  - Ensure Organizer remains permanent as specified
  - Test that all existing functionality still works
  - _Requirements: Complete removal of hardcoded system_

- [ ] 10. Add search and filtering features
  - Implement real-time search in agent library
  - Add category filtering dropdown
  - Add tag-based filtering
  - Optimize search performance for large datasets
  - _Requirements: Easy discovery of agents from 900+ library_

- [ ] 11. Create comprehensive test suite
  - Unit tests for drag/drop functionality
  - Integration tests for database operations
  - E2E tests for agent loading workflow
  - Performance tests for search with large datasets
  - _Requirements: Ensure system reliability and performance_

- [ ] 12. Polish and optimization
  - Add smooth animations for agent loading
  - Implement lazy loading for large agent lists
  - Add keyboard shortcuts for common actions
  - Optimize database queries for better performance
  - _Requirements: Professional user experience_