export interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string | null;
  liveUrl: string | null;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
