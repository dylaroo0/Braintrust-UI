// Generated Agent interface based on extracted data
export interface DatabaseAgent {
  id: string;
  name: string;
  role: string;
  systemInstruction: string;
  color: string;
  category: string;
  tags: string[];
  description: string;
  avatarType: string;
  isPermanent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Agent categories found in current data
export type AgentCategory = 'design' | 'development' | 'engineering' | 'management';

// Avatar types found in current data
export type AvatarType = 'designer' | 'developer' | 'engineer' | 'organizer';