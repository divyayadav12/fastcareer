import type { Job } from '../types/job';

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Chief Financial Officer (CFO)',
    company: 'Confidential Fintech Unicorn',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    category: 'Finance',
    salaryRange: '₹80L - ₹1.2Cr',
    postedAt: '2 days ago',
    isHot: true,
    description: 'We are seeking an experienced CFO to lead financial operations, fundraising, and strategic planning for a rapidly growing fintech startup preparing for an IPO.',
    requirements: [
      'CA / MBA Finance from a Tier 1 institute.',
      '15+ years of progressive experience, with at least 5 years as a CFO or VP Finance.',
      'Prior experience taking a company public (IPO) is highly preferred.',
      'Deep understanding of fintech regulatory frameworks in India.'
    ],
    responsibilities: [
      'Drive the company’s financial planning and strategy.',
      'Manage all financial operations, reporting, and compliance.',
      'Lead fundraising efforts and investor relations.',
      'Optimize capital structure and cash flow management.'
    ]
  },
  {
    id: 'job-2',
    title: 'Senior Audit Manager',
    company: 'Global Big 4 Firm',
    location: 'Gurugram, Haryana',
    type: 'Full-time',
    category: 'Accounting',
    salaryRange: '₹35L - ₹45L',
    postedAt: '1 week ago',
    description: 'Lead statutory audit engagements for large enterprise clients in the manufacturing and IT sectors.',
    requirements: [
      'Qualified Chartered Accountant (CA) with 8-10 years of post-qualification experience.',
      'Extensive experience in statutory audits of listed entities.',
      'Strong knowledge of Ind AS and IFRS.',
      'Excellent team management and client-facing skills.'
    ],
    responsibilities: [
      'Manage end-to-end audit engagements.',
      'Review audit work papers and finalize audit reports.',
      'Provide technical guidance to the audit team on complex accounting issues.',
      'Develop and maintain strong client relationships.'
    ]
  },
  {
    id: 'job-3',
    title: 'VP, Risk Management',
    company: 'Leading Private Bank',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    category: 'Compliance',
    salaryRange: '₹50L - ₹70L',
    postedAt: '3 days ago',
    description: 'Head the enterprise risk management function, overseeing credit, market, and operational risk across the retail banking portfolio.',
    requirements: [
      '12+ years of experience in risk management within the banking sector.',
      'Strong quantitative background (FRM/CFA is a plus).',
      'In-depth knowledge of RBI guidelines and Basel III norms.',
      'Experience implementing risk models and analytics.'
    ],
    responsibilities: [
      'Develop and implement comprehensive risk frameworks.',
      'Monitor and report on credit and operational risks.',
      'Liaise with regulators and internal auditors.',
      'Lead a team of 20+ risk professionals.'
    ]
  },
  {
    id: 'job-4',
    title: 'Financial Data Scientist',
    company: 'Algorithmic Trading Firm',
    location: 'Remote (India)',
    type: 'Contract',
    category: 'Tech',
    salaryRange: '₹40L - ₹60L',
    postedAt: 'Just now',
    isHot: true,
    description: 'Join an elite quantitative trading team to build predictive models and backtest trading strategies using large financial datasets.',
    requirements: [
      'Ph.D. or Master’s in Statistics, Mathematics, or Computer Science.',
      'Strong programming skills in Python (Pandas, NumPy, Scikit-learn).',
      'Experience working with time-series financial data.',
      'Knowledge of machine learning algorithms and deep learning.'
    ],
    responsibilities: [
      'Research and develop statistical trading models.',
      'Analyze vast amounts of market data to identify alpha signals.',
      'Collaborate with quantitative developers to deploy models in production.',
      'Continuously optimize and refine existing strategies.'
    ]
  }
];
