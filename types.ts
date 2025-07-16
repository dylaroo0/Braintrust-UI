import React from 'react';

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: React.ReactElement;
  systemInstruction: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string;
  status: 'todo' | 'doing' | 'done';
}

export interface Message {
  id:string;
  text: string;
  sender: 'user' | string; // 'user' or agent's id
  agent: Agent;
}