/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONFIGURATION
 *  Everything shown on the site lives here. Edit this file only — you never
 *  need to touch the 3D scene or the UI components to update your content.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type SectionId = 'about' | 'projects' | 'skills' | 'experience' | 'contact'

export type SkillCategoryId =
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'platforms'
  | 'productivity'

export interface Skill {
  id: string
  name: string
  /** Exact proficiency, 0–100. */
  level: number
  category: SkillCategoryId
  /** One short sentence shown when the skill is selected. */
  summary: string
}

export interface SkillCategory {
  id: SkillCategoryId
  label: string
  /** Colour used for the matching energy towers in the 3D scene. */
  color: string
}

export interface ProjectLinks {
  /** Leave empty ('') to hide the GitHub button. */
  github?: string
  /** Leave empty ('') to hide the Live Demo button. */
  demo?: string
}

export interface ProjectScreenshot {
  src: string
  alt: string
}

export interface Project {
  id: string
  title: string
  /** Optional category label, e.g. "Business Management System". Hidden while empty. */
  category?: string
  tagline: string
  description: string
  /** Leave empty until confirmed — the technologies section is hidden while empty. */
  technologies: string[]
  /** Feature *areas* — not claims of finished functionality. */
  features: string[]
  /** Leave empty until confirmed — the contributions section is hidden while empty. */
  contributions: string[]
  /**
   * Optional status label, e.g. "Completed", "In development", "Internal tool".
   * Leave undefined to hide the status badge.
   */
  status?: string
  links: ProjectLinks
  /**
   * Real screenshots. Put image files in /public/screenshots and list them here.
   * While this is empty, the site shows a clearly-labelled illustrative preview.
   */
  screenshots: ProjectScreenshot[]
  /** Accent used for the island and the illustrative preview. */
  accent: string
}

export interface ExperienceItem {
  id: string
  title: string
  description: string
  /** Optional, e.g. "2022 — Present". Hidden while empty. */
  period?: string
  /** Optional, hidden while empty. */
  organization?: string
}

export interface PortfolioConfig {
  person: {
    name: string
    title: string
    tagline: string
    shortBio: string
  }
  contact: {
    email: string
    phone: string
    location: string
    /** Formspree form ID → https://formspree.io/f/<id> */
    formspreeId: string
    /**
     * Because this site is public, decide here what is displayed.
     * Set any of these to false to hide the detail everywhere.
     */
    visibility: {
      email: boolean
      phone: boolean
      location: boolean
    }
  }
  /** Only links with a real URL are rendered. */
  social: {
    github: string
    linkedin: string
  }
  stats: { value: string; label: string }[]
  about: {
    heading: string
    quote: string
    introduction: string[]
    interests: string[]
    approach: { title: string; text: string }[]
    experienceNote: string
    /** What the avatar says when you click it in the research lab. Edit freely (add your age here if you like). */
    chat: string[]
  }
  skillCategories: SkillCategory[]
  skills: Skill[]
  projects: Project[]
  experience: {
    headline: string
    summary: string
    items: ExperienceItem[]
  }
}

export const portfolio: PortfolioConfig = {
  person: {
    name: 'John Carlo Salva',
    title: 'Creative Developer & Tech Enthusiast',
    tagline:
      'Building digital experiences, intelligent systems, and creative solutions through technology.',
    shortBio:
      'I enjoy building practical digital solutions, developing web applications, automating workflows, and exploring the intersection of technology and creative design.',
  },

  contact: {
    email: 'salvajohn7@gmail.com',
    phone: '09217282491',
    location: '737 Brgy. Biñan Pagsanjan, Laguna, Philippines',
    formspreeId: 'xyklajyn',
    visibility: {
      email: true,
      // The site is public — flip either of these to false to hide them.
      phone: true,
      location: true,
    },
  },

  social: {
    github: '', // e.g. 'https://github.com/your-username'
    linkedin: '', // e.g. 'https://www.linkedin.com/in/your-profile'
  },

  stats: [
    { value: '3+', label: 'Years Experience' },
    { value: '5+', label: 'Projects' },
    { value: '100%', label: 'Satisfaction' },
  ],

  about: {
    heading: 'About Me',
    quote:
      'I enjoy building practical digital solutions, developing web applications, automating workflows, and exploring the intersection of technology and creative design.',
    introduction: [
      "I'm a creative developer and tech enthusiast with 3+ years of experience building web applications and business systems.",
      'I like work that sits where practical engineering meets thoughtful design — tools that are dependable behind the scenes and pleasant to use in front.',
    ],
    interests: [
      'Web application development',
      'Database-driven business systems',
      'Workflow automation',
      'Creative front-end and interactive experiences',
    ],
    approach: [
      {
        title: 'Understand first',
        text: 'Start from the real problem and the people who deal with it every day.',
      },
      {
        title: 'Structure the data',
        text: 'Good systems begin with clear, well-organised data and sensible workflows.',
      },
      {
        title: 'Build and refine',
        text: 'Ship something usable, test it against real tasks, then polish the details.',
      },
    ],
    experienceNote:
      '3+ years developing web applications and business systems, from database-backed tools to polished front-end experiences.',
    chat: [
      "Hi! 👋 I'm John Carlo Salva.",
      "I'm a Creative Developer & Tech Enthusiast.",
      'I have 3+ years of experience building web applications and business systems.',
      "I'm based in Pagsanjan, Laguna, Philippines.",
      'I enjoy web apps, database-driven systems, workflow automation, and creative front-end work.',
      'Feel free to look around — or send me a signal from the Contact beacon!',
    ],
  },

  skillCategories: [
    { id: 'frontend', label: 'Frontend Development', color: '#22d3ee' },
    { id: 'backend', label: 'Backend Development', color: '#a78bfa' },
    { id: 'databases', label: 'Databases', color: '#2dd4bf' },
    { id: 'platforms', label: 'Platforms', color: '#60a5fa' },
    { id: 'productivity', label: 'Productivity Tools', color: '#f0abfc' },
  ],

  skills: [
    {
      id: 'html5',
      name: 'HTML5',
      level: 95,
      category: 'frontend',
      summary: 'Semantic, accessible page structure that forms the foundation of every interface.',
    },
    {
      id: 'css3',
      name: 'CSS3',
      level: 90,
      category: 'frontend',
      summary: 'Responsive layouts, visual hierarchy and polished styling across screen sizes.',
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      level: 85,
      category: 'frontend',
      summary: 'Interactive front-end behaviour and dynamic features for web applications.',
    },
    {
      id: 'php',
      name: 'PHP',
      level: 80,
      category: 'backend',
      summary: 'Server-side logic for database-driven web applications and management systems.',
    },
    {
      id: 'java',
      name: 'Java',
      level: 75,
      category: 'backend',
      summary: 'Object-oriented programming for structured, maintainable application logic.',
    },
    {
      id: 'python',
      name: 'Python',
      level: 70,
      category: 'backend',
      summary: 'Scripting and automation for data handling and everyday workflow tasks.',
    },
    {
      id: 'mysql',
      name: 'MySQL',
      level: 85,
      category: 'databases',
      summary: 'Relational database design and queries that keep records organised and reliable.',
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      level: 80,
      category: 'platforms',
      summary: 'Building and customising content-managed websites on the WordPress platform.',
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      level: 90,
      category: 'productivity',
      summary: 'Structured spreadsheets and formulas for tracking, reporting and data organisation.',
    },
  ],

  projects: [
    {
      id: 'payroll-system',
      title: 'Payroll System',
      tagline: 'Payroll processing and administration',
      description:
        'A payroll management system designed to streamline employee payroll processing, payroll data management, and related administrative workflows.',
      technologies: ['PHP', 'JavaScript', 'MySQL'],
      features: [
        'Employee information management',
        'Payroll calculation workflows',
        'Database-driven records',
        'Payroll reporting and validation',
      ],
      contributions: [
        'Application development with PHP and JavaScript',
        'Database-backed record handling with MySQL',
      ],
      status: undefined,
      links: { github: '', demo: '' },
      screenshots: [],
      accent: '#fbbf24',
    },
    {
      id: 'supplements-landing-page',
      title: 'Supplements Landing Page',
      tagline: 'Responsive brand landing page',
      description:
        'A responsive landing page for a supplements brand, designed to present products, communicate brand identity, and provide a polished online experience.',
      technologies: ['HTML5', 'CSS3', 'JavaScript'],
      features: [
        'Responsive web design',
        'Product presentation',
        'Visual hierarchy and branding',
        'Interactive front-end elements',
      ],
      contributions: [
        'Front-end design and development',
        'Responsive layout and interactive elements',
      ],
      status: undefined,
      links: { github: '', demo: '' },
      screenshots: [],
      accent: '#34d399',
    },
    {
      id: 'free-sample-monitoring',
      title: 'Google Sheets Free Sample Monitoring',
      tagline: 'Spreadsheet tracking and automation',
      description:
        'A spreadsheet-based monitoring solution designed to organize and track free sample activity through structured data and workflow automation.',
      technologies: ['Google Sheets', 'Google Apps Script'],
      features: [
        'Spreadsheet-based tracking',
        'Data organization',
        'Automated workflows where implemented',
        'Monitoring and reporting',
      ],
      contributions: [
        'Spreadsheet structure and data organisation',
        'Workflow automation with Google Apps Script',
      ],
      status: undefined,
      links: { github: '', demo: '' },
      screenshots: [],
      accent: '#4ade80',
    },
    {
      id: 'ugc-management-system',
      title: 'UGC Management System',
      tagline: 'Record management and admin tracking',
      description:
        'A web-based management system designed to organize UGC-related records and simplify administrative tracking.',
      technologies: ['PHP', 'JavaScript', 'MySQL'],
      features: [
        'Database-backed record management',
        'Web-based workflows',
        'Organized data presentation',
        'Administrative efficiency',
      ],
      contributions: [
        'Application development with PHP and JavaScript',
        'Database-backed record handling with MySQL',
      ],
      status: undefined,
      links: { github: '', demo: '' },
      screenshots: [],
      accent: '#c084fc',
    },
    {
      id: 'inventory-management-system',
      title: 'Inventory Management System',
      category: 'Business Management System',
      tagline: 'Smart Inventory Tracking & Stock Management',
      description:
        'A web-based inventory management solution designed to simplify stock monitoring, organize inventory records, and improve inventory-related workflows.',
      // TODO(John): add the technologies you actually used — hidden until filled in.
      technologies: [],
      features: [
        'Inventory dashboard',
        'Product and stock management',
        'Stock monitoring',
        'Inventory records',
        'Reporting and analytics',
      ],
      // TODO(John): add your real contributions — hidden until filled in.
      contributions: [],
      status: undefined,
      links: { github: '', demo: '' },
      screenshots: [],
      accent: '#14b8a6',
    },
    {
      id: 'production-mrp-system',
      title: 'Production MRP System',
      category: 'Production Management System',
      tagline: 'Production Planning & Manufacturing Operations',
      description:
        'A web-based Material Requirements Planning (MRP) system designed to organize production operations, monitor manufacturing activities, manage production records, and support efficient production workflows.',
      // TODO(John): add the technologies you actually used — hidden until filled in.
      technologies: [],
      features: [
        'Production dashboard',
        'Production monitoring',
        'Mixing operations',
        'Production records',
        'Material and bag usage tracking',
        'Production stage management',
        'Operator-based workflows',
      ],
      // TODO(John): add your real contributions — hidden until filled in.
      contributions: [],
      status: undefined,
      links: { github: '', demo: '' },
      screenshots: [],
      accent: '#fb923c',
    },
    {
      id: 'maintenance-management-system',
      title: 'Maintenance Management System',
      category: 'Facility Management System',
      tagline: 'Facility Maintenance & Issue Tracking',
      description:
        'A web-based maintenance management system designed to organize facility maintenance activities, manage reported issues, monitor maintenance status, and maintain historical records.',
      // TODO(John): add the technologies you actually used — hidden until filled in.
      technologies: [],
      features: [
        'Maintenance dashboard',
        'Room monitoring',
        'Pending maintenance issues',
        'AC maintenance',
        'Maintenance history',
        'Issue status tracking',
      ],
      // TODO(John): add your real contributions — hidden until filled in.
      contributions: [],
      status: undefined,
      links: { github: '', demo: '' },
      screenshots: [],
      accent: '#10b981',
    },
  ],

  experience: {
    headline: '3+ Years of Experience',
    summary:
      'Hands-on experience across creative development, web applications and business systems.',
    items: [
      {
        id: 'creative-development',
        title: 'Creative Development',
        description:
          'Crafting visually engaging, interactive front-end experiences with careful attention to detail.',
      },
      {
        id: 'web-application-development',
        title: 'Web Application Development',
        description:
          'Designing and building web applications that turn real-world processes into usable software.',
      },
      {
        id: 'database-driven-systems',
        title: 'Database-Driven Systems',
        description:
          'Developing systems backed by relational databases for dependable record keeping and reporting.',
      },
      {
        id: 'business-workflow-automation',
        title: 'Business Workflow Automation',
        description:
          'Automating repetitive business workflows to save time and reduce manual errors.',
      },
      {
        id: 'technical-problem-solving',
        title: 'Technical Problem-Solving',
        description:
          'Breaking down complex problems and finding clear, maintainable solutions.',
      },
    ],
  },
}

/** Navigation order and labels (used by the menu and the 3D landmarks). */
export const sections: { id: SectionId; label: string; blurb: string }[] = [
  { id: 'about', label: 'About', blurb: 'Research station' },
  { id: 'projects', label: 'Projects', blurb: 'Project islands' },
  { id: 'skills', label: 'Skills', blurb: 'Energy towers' },
  { id: 'experience', label: 'Experience', blurb: 'Orbital stations' },
  { id: 'contact', label: 'Contact', blurb: 'Communication beacon' },
]

/** Helpers — derived values the UI relies on. */
export const formspreeEndpoint = `https://formspree.io/f/${portfolio.contact.formspreeId}`

export const hasSocial = Boolean(portfolio.social.github || portfolio.social.linkedin)
