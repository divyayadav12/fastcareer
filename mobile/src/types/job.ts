export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  category: string;
  salaryRange: string;
  postedAt: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  isHot?: boolean;
}
