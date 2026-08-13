export interface PersonaVersion {
  createdAt: string;
  id: string;
  note: string;
  systemRole: string;
}

export interface StudioCharacter {
  avatar: string;
  cover: string;
  createdAt: string;
  description: string;
  gender: 'Female' | 'Male';
  greeting: string;
  id: string;
  knowledge: string;
  model: string;
  name: string;
  systemRole: string;
  updatedAt: string;
  versions: PersonaVersion[];
}

export interface StudioExport {
  character: StudioCharacter;
  exportedAt: string;
  format: 'elysian-agent-studio';
  version: 1;
}
