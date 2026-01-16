
export interface SocialLink {
    platform: string;
    url: string;
    icon: string; // We'll manage icons in the component mapping
}

export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription: string;
    techStack: string[];
    image?: string;
    githubUrl?: string;
    liveUrl?: string;
    features: string[];
    challenges?: string;
}

export interface Experience {
    company: string;
    role: string;
    period: string;
    description: string[];
}

export interface ExperienceCard {
    id: string;
    role: string;
    company: string;
    periodStart: string;
    periodEnd: string;
    description: string;
    skills: string[];
    theme: 'midnight' | 'obsidian' | 'titanium';
    cardNumber: string;
    cvv: string;
    orientation?: 'landscape' | 'portrait';
}

export interface Education {
    degree: string;
    institution: string;
    year: string;
}

export const profile = {
    name: 'Prashanth Kumar',
    role: 'Full-Stack Developer',
    email: 'your.email@example.com', // TODO: Update with actual email
    location: 'San Francisco, CA', // TODO: Update with actual location
    about: `Passionate developer with expertise in building modern web applications. 
  Specializing in React, TypeScript, and creating unique user experiences. 
  I love solving complex problems and turning ideas into reality through code.`,
    social: [
        { platform: 'GitHub', url: 'https://github.com/prashanth8983', icon: 'github' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile', icon: 'linkedin' },
        { platform: 'Twitter', url: 'https://twitter.com/yourhandle', icon: 'twitter' },
        { platform: 'Email', url: 'mailto:your.email@example.com', icon: 'email' },
    ],
};

export const skills = {
    frontend: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Redux', 'Next.js'],
    backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'REST APIs', 'GraphQL'],
    tools: ['Git', 'GitHub', 'VS Code', 'Docker', 'AWS', 'Vite', 'Webpack'],
    soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Agile Methodology'],
};

export const projects: Project[] = [
    {
        id: 'portfolio-desktop',
        title: 'Portfolio Desktop',
        description: 'Interactive macOS/iOS simulator as a creative portfolio',
        longDescription: 'A fully functional desktop and mobile operating system simulation built entirely in React. Features include window management, drag-and-drop, keyboard shortcuts, and responsive design that adapts between macOS and iOS interfaces. This project demonstrates advanced React patterns and state management.',
        techStack: ['React 19', 'TypeScript', 'Tailwind CSS 4', 'Vite'],
        image: '/wallpaper.jpg', // Using wallpaper as placeholder for now
        githubUrl: 'https://github.com/prashanth8983/Portfolio-desktop',
        liveUrl: 'https://prashanth8983.github.io/Portfolio-desktop',
        features: [
            'Fully functional window management system',
            'Window snapping to screen edges',
            'Keyboard shortcuts (Cmd+W, Cmd+M, Cmd+F, Cmd+Space)',
            'Working applications (Browser, Calculator, Text Editor)',
            'Responsive design (macOS desktop ↔ iOS mobile)',
            'Dark/Light theme with persistence',
            'Context menus and drag-and-drop',
            'Spotlight search with math evaluation'
        ],
        challenges: 'Managing z-index layering for multiple windows, implementing smooth drag operations with proper offset calculations, and ensuring responsive behavior across different screen sizes.'
    },
    {
        id: 'ecommerce-dashboard',
        title: 'E-commerce Admin Dashboard',
        description: 'Comprehensive dashboard for online store management',
        longDescription: 'A feature-rich admin dashboard designed for e-commerce platforms. It allows administrators to manage products, track orders, view analytics, and handle customer queries. Built with performance and usability in mind.',
        techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Recharts'],
        features: [
            'Real-time sales analytics with interactive charts',
            'Product management (CRUD operations)',
            'Order tracking and status updates',
            'User role management',
            'Dark/Light mode support'
        ],
        githubUrl: 'https://github.com/prashanth8983',
        challenges: 'Optimizing database queries for real-time analytics and ensuring a responsive layout for complex data tables.'
    },
    {
        id: 'task-manager',
        title: 'TaskFlow',
        description: 'Collaborative task management application',
        longDescription: 'A productivity tool inspired by Trello and Asana. It enables teams to create boards, lists, and cards to organize their work. Supports real-time updates and drag-and-drop functionality.',
        techStack: ['React', 'Firebase', 'Recoil', 'Styled Components'],
        features: [
            'Drag-and-drop kanban boards',
            'Real-time updates using Firestore',
            'Team workspaces and member invites',
            'Task labels, due dates, and comments'
        ],
        githubUrl: 'https://github.com/prashanth8983',
    }
];

export const experience: Experience[] = [
    {
        company: 'Tech Corp Inc.',
        role: 'Senior Frontend Engineer',
        period: '2022 - Present',
        description: [
            'Led the migration of legacy codebase to React 18 and TypeScript.',
            'Improved site performance by 40% through code splitting and lazy loading.',
            'Mentored junior developers and conducted code reviews.'
        ]
    },
    {
        company: 'Startup Solutions',
        role: 'Full Stack Developer',
        period: '2020 - 2022',
        description: [
            'Developed and engaged end-to-end web applications for clients.',
            'Implemented RESTful APIs and integrated third-party services.',
            'Collaborated with designers to ensure pixel-perfect UI implementation.'
        ]
    }
];

export const education: Education[] = [
    {
        degree: 'Master of Computer Science',
        institution: 'Tech University',
        year: '2019'
    },
    {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'State University',
        year: '2017'
    }
];

export const experienceCards: ExperienceCard[] = [
    {
        id: '1',
        role: 'SOFTWARE ENGINEER',
        company: 'NYU IT',
        periodStart: '01/25',
        periodEnd: 'PRESENT',
        description: 'Full-Stack Dev. AWS Lambda APIs. React.js Frontend. 30% Runtime Reduction.',
        skills: ['React', 'AWS', 'TypeScript'],
        theme: 'titanium',
        cardNumber: '4242 0125 2026 3456',
        cvv: '025',
        orientation: 'landscape'
    },
    {
        id: '2',
        role: 'SOFTWARE ENGINEER',
        company: 'KAMPD',
        periodStart: '08/21',
        periodEnd: '08/24',
        description: '10+ Microservices. 70% Latency Cut. 5x Throughput. 99.9% Uptime.',
        skills: ['Go', 'Node.js', 'K8s'],
        theme: 'midnight',
        cardNumber: '5354 0821 0824 0092',
        cvv: '821',
        orientation: 'landscape'
    },
    {
        id: '3',
        role: 'DATA ENGINEER',
        company: 'DATA WEAVE',
        periodStart: '03/21',
        periodEnd: '08/21',
        description: 'ETL Pipelines. Kafka Streaming. 100GB+ Daily Processing.',
        skills: ['Python', 'Kafka', 'AWS'],
        theme: 'obsidian',
        cardNumber: '3712 0321 0821 1120',
        cvv: '321',
        orientation: 'portrait'
    }
];
