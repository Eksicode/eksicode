export interface Job {
  id: number;
  slug: string;
  title: string;
  description: string;
  location: string;
  type: string;
  employmentType: string;
  department: string;
  salary?: string;
  remote: boolean;
  createdAt: string;
  updatedAt: string;
  validAt: string;
  company: {
    id: number;
    name: string;
    logo?: string;
  };
} 