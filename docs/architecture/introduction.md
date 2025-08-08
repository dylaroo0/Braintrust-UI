# Introduction

This document outlines the architectural approach for enhancing BrainTrust Circle with a flexible agent system, circular workflow navigation, and comprehensive customization capabilities. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development of new features while ensuring seamless integration with the existing system.

**Relationship to Existing Architecture:**
This document supplements existing project architecture by defining how new components will integrate with current systems. Where conflicts arise between new and existing patterns, this document provides guidance on maintaining consistency while implementing enhancements.

## Existing Project Analysis

**Current Project State:**

- **Primary Purpose:** Multi-agent AI workspace with radial UI for intelligent conversations and task management
- **Current Tech Stack:** React 19.1.0, TypeScript 5.7.2, Vite 6.2.0, Zustand 5.0.6, Google Gemini API, Express 5.1.0, WebSocket
- **Architecture Style:** Component-based React architecture with service layer pattern and Zustand state management
- **Deployment Method:** Netlify for frontend, Node.js server for backend API

**Available Documentation:**

- ✅ Tech Stack Documentation (docs/architecture/tech-stack.md)
- ✅ Source Tree Structure (docs/architecture/source-tree.md)  
- ✅ Coding Standards (docs/architecture/coding-standards.md)
- ✅ Comprehensive Memory System (7 data types with Zustand persistence)
- ✅ Calendar Integration (auto-populated from memory data)
- ✅ Advanced Search & Analytics (multi-criteria with relevance scoring)

**Identified Constraints:**

- Must preserve existing memory system and conversation history
- Must maintain current UI interaction patterns (drag, resize, double-click)
- Must keep Organizer panel functionality intact
- Must support existing project management features
- Must maintain performance characteristics during agent switching
- Text-based agent storage preferred to avoid database complexity