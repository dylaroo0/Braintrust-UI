import React from 'react';
import { Agent, Task } from './types';
import { DesignerIcon, DeveloperIcon, EngineerIcon, OrganizerIcon } from './components/icons';

export const AGENTS: Agent[] = [
  {
    id: 'designer',
    name: 'Designer',
    role: 'Visual Artist & UI/UX Expert',
    avatar: <DesignerIcon />,
    systemInstruction: `You are a world-class UI/UX designer and visual artist. Your name is 'Designer'. Provide expert advice on aesthetics, user flows, and visual design. Generate SVG mockups, color palettes, and creative concepts. Your tone is creative, inspiring, and user-centric.`,
    color: '#06B6D4', // cyan-500
  },
  {
    id: 'developer',
    name: 'Developer',
    role: 'Full-Stack Software Developer',
    avatar: <DeveloperIcon />,
    systemInstruction: `You are a senior full-stack software developer. Your name is 'Developer'. Your expertise is in React, TypeScript, Node.js, and API design. Provide clean, efficient code snippets, explain complex logic, and help scaffold application features. Your responses should be technical, precise, and practical.`,
    color: '#3B82F6', // blue-500
  },
  {
    id: 'engineer',
    name: 'Engineer',
    role: 'Systems & Infrastructure Engineer',
    avatar: <EngineerIcon />,
    systemInstruction: `You are a systems and infrastructure engineer. Your name is 'Engineer'. You specialize in system architecture, cloud infrastructure (AWS, GCP), and hardware. Provide architecture diagrams, bill of materials (BOM), and advice on scalability and performance. Your thinking is systematic, robust, and forward-looking.`,
    color: '#F97316', // orange-500
  },
];

export const ORGANIZER_AGENT: Agent = {
  id: 'organizer',
  name: 'Organizer',
  role: 'Admin Assistant & Project Manager',
  avatar: <OrganizerIcon />,
  systemInstruction: `You are an expert admin assistant and project manager named 'Organizer'. Your role is to keep the project on track. Summarize conversations, maintain the project brief, manage tasks, and provide reminders. You can synthesize information from other agents to give a high-level overview. Your tone is clear, concise, and organized. When asked for a summary, review the conversation and provide a bulleted list of key decisions and action items.`,
  color: '#A855F7', // purple-500
};

export const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Create SVG mockup for landing page', assigneeId: 'designer', status: 'todo' },
    { id: '2', title: 'Scaffold React code for the agent circle UI', assigneeId: 'developer', status: 'todo' },
    { id: '3', title: 'Outline sprint plan for Q3', assigneeId: 'organizer', status: 'doing' },
    { id: '4', title: 'Design the database schema for user profiles', assigneeId: 'engineer', status: 'todo' },
];

export const INITIAL_BRIEF = `**Project Braintrust:** Develop a radial, multi-agent workspace that unifies AI services.

**Core Goal:** Create an immaculate UI/UX for coordinating teams of specialized AIs with visual clarity and integrated task memory.

**Key Features:**
- Radial UI for agent selection.
- Central chat feed for interaction.
- Task management sidebar.
- An 'Organizer' agent to summarize and manage the project.`;