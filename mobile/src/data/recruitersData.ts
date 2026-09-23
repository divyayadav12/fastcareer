export interface RecruiterCompany {
  id: number;
  name: string;
  shortName: string;
  category: 'FMCG & Retail' | 'Banking & Finance' | 'Conglomerates & Industrial' | 'Hospitality & Services' | 'Big 4 & Consulting';
  tagline: string;
  location: string;
  openings: number;
  featured: boolean;
  hiringRoles: string[];
}

export const TOP_RECRUITERS: RecruiterCompany[] = [
  {
    id: 1,
    name: 'ITC Limited',
    shortName: 'ITC',
    category: 'FMCG & Retail',
    tagline: 'Leading FMCG, Agri-Business & Paperboards Conglomerate',
    location: 'Kolkata / Pan-India',
    openings: 18,
    featured: true,
    hiringRoles: ['Financial Analyst', 'Factory Finance Manager', 'Internal Audit Lead']
  },
  {
    id: 2,
    name: 'Hindustan Unilever Limited (HUL)',
    shortName: 'HUL',
    category: 'FMCG & Retail',
    tagline: "India's #1 FMCG Market Leader & Consumer Goods Pioneer",
    location: 'Mumbai / Pan-India',
    openings: 24,
    featured: true,
    hiringRoles: ['Brand Finance Partner', 'Commercial Finance Manager', 'Supply Chain Analyst']
  },
  {
    id: 3,
    name: 'Tata Group (Tata Sons / TCS / Tata Steel)',
    shortName: 'TATA',
    category: 'Conglomerates & Industrial',
    tagline: "India's Most Trusted $300B+ Global Conglomerate",
    location: 'Mumbai / Pan-India',
    openings: 42,
    featured: true,
    hiringRoles: ['Treasury Manager', 'Corporate Governance CA', 'Statutory Reporting Lead']
  },
  {
    id: 4,
    name: 'JPMorgan Chase & Co.',
    shortName: 'J.P. Morgan',
    category: 'Banking & Finance',
    tagline: 'Global Leader in Financial Services & Investment Banking',
    location: 'Mumbai / Bengaluru',
    openings: 35,
    featured: true,
    hiringRoles: ['Investment Banking Analyst', 'Product Control Specialist', 'Credit Risk Manager']
  },
  {
    id: 5,
    name: 'Reliance Industries Limited',
    shortName: 'Reliance',
    category: 'Conglomerates & Industrial',
    tagline: "India's Largest Private Enterprise (Retail, Oil, Telecom)",
    location: 'Mumbai / Jamnagar',
    openings: 38,
    featured: true,
    hiringRoles: ['Senior Manager - Corporate Finance', 'FP&A Lead', 'Taxation Specialist']
  },
  {
    id: 6,
    name: 'PwC India (Price Waterhouse & Co)',
    shortName: 'PwC',
    category: 'Big 4 & Consulting',
    tagline: 'World-Leading Professional Services & Advisory Firm',
    location: 'Gurugram / Mumbai / Bengaluru',
    openings: 56,
    featured: true,
    hiringRoles: ['Statutory Audit Senior', 'Deals / M&A Advisory', 'Indirect Tax Consultant']
  },
  {
    id: 7,
    name: 'Deloitte India & USI',
    shortName: 'Deloitte',
    category: 'Big 4 & Consulting',
    tagline: 'Premier Global Audit, Consulting & Risk Advisory Network',
    location: 'Hyderabad / Mumbai / Delhi NCR',
    openings: 60,
    featured: true,
    hiringRoles: ['Risk Advisory Associate', 'International Tax Manager', 'Valuation Specialist']
  },
  {
    id: 8,
    name: 'EY India (Ernst & Young)',
    shortName: 'EY',
    category: 'Big 4 & Consulting',
    tagline: 'Building a Better Working World - Assurance & Strategy',
    location: 'Pan-India',
    openings: 52,
    featured: true,
    hiringRoles: ['Assurance Associate', 'Forensic Audit Consultant', 'Corporate Tax Executive']
  },
  {
    id: 9,
    name: 'KPMG India',
    shortName: 'KPMG',
    category: 'Big 4 & Consulting',
    tagline: 'Global Leader in Audit, Tax and Strategic Advisory Services',
    location: 'Pan-India',
    openings: 45,
    featured: true,
    hiringRoles: ['Management Consulting', 'Transfer Pricing Specialist', 'Internal Audit Analyst']
  },
  {
    id: 10,
    name: 'HDFC Bank Limited',
    shortName: 'HDFC Bank',
    category: 'Banking & Finance',
    tagline: "India's Largest Private Sector Bank by Market Capitalization",
    location: 'Mumbai / Pan-India',
    openings: 31,
    featured: true,
    hiringRoles: ['Credit Manager - Large Corporate', 'Treasury Operations', 'Branch Banking Head']
  },
  {
    id: 11,
    name: 'ICICI Bank',
    shortName: 'ICICI',
    category: 'Banking & Finance',
    tagline: 'Pioneering Universal Banking & Comprehensive Financial Services',
    location: 'Mumbai / Hyderabad / Delhi',
    openings: 29,
    featured: true,
    hiringRoles: ['Relationship Manager - Wholesale', 'Risk Management Lead', 'Internal Auditor']
  },
  {
    id: 12,
    name: 'Indian Hotels Company Limited (Taj Hotels)',
    shortName: 'IHCL (Taj)',
    category: 'Hospitality & Services',
    tagline: "South Asia's Largest & Most Iconic Hospitality Enterprise",
    location: 'Mumbai / Delhi / Goa',
    openings: 14,
    featured: true,
    hiringRoles: ['Unit Financial Controller', 'Corporate Accounts Manager', 'Revenue Audit Lead']
  }
];
