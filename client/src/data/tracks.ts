import { SkillTrack } from '../types';

export const DEFAULT_TRACKS: SkillTrack[] = [
  {
    id: 'frontend-dev',
    trackName: 'Frontend Developer',
    description: 'Master modern user interfaces, component architecture, TypeScript, and state management.',
    icon: 'Layout',
    skills: [
      { id: 'html-css', name: 'HTML5 & Modern CSS', description: 'Semantic markup, Flexbox, Grid, CSS variables, and layout mechanics', category: 'foundational', targetLevel: 4, weight: 3 },
      { id: 'javascript-core', name: 'Core JavaScript (ES6+)', description: 'Closures, Event Loop, Promises, Async/Await, prototypes', category: 'foundational', targetLevel: 4, weight: 3 },
      { id: 'react-fundamentals', name: 'React Architecture', description: 'Hooks, Lifecycle, JSX, Component hierarchy, Virtual DOM', category: 'core', targetLevel: 5, weight: 3 },
      { id: 'typescript', name: 'TypeScript for Frontend', description: 'Types, Generics, Interfaces, React typing, strict null checks', category: 'core', targetLevel: 4, weight: 2 },
      { id: 'state-management', name: 'State Management', description: 'Context API, Redux Toolkit, Zustand, cache synchronization', category: 'core', targetLevel: 4, weight: 2 },
      { id: 'web-performance', name: 'Web Performance & CWV', description: 'LCP, CLS, INP, bundle optimization, code splitting, memoization', category: 'advanced', targetLevel: 4, weight: 1 },
      { id: 'testing-qa', name: 'Frontend Testing', description: 'Unit testing with Jest/Vitest, React Testing Library, e2e testing', category: 'advanced', targetLevel: 3, weight: 1 }
    ]
  },
  {
    id: 'data-analyst',
    trackName: 'Data Analyst',
    description: 'Transform raw numbers into actionable business intelligence through SQL, Python, and visualizations.',
    icon: 'BarChart2',
    skills: [
      { id: 'sql-querying', name: 'SQL & Database Querying', description: 'Complex JOINs, Window functions, Aggregations, CTEs, indexing', category: 'foundational', targetLevel: 5, weight: 3 },
      { id: 'statistics-prob', name: 'Applied Statistics', description: 'Descriptive stats, hypothesis testing, distributions, p-values', category: 'foundational', targetLevel: 4, weight: 2 },
      { id: 'python-pandas', name: 'Python, Pandas & NumPy', description: 'Data wrangling, cleaning, merging, feature transformation', category: 'core', targetLevel: 4, weight: 3 },
      { id: 'bi-dashboards', name: 'Tableau & Power BI', description: 'Interactive dashboards, DAX calculations, storytelling', category: 'core', targetLevel: 4, weight: 2 },
      { id: 'exploratory-analysis', name: 'Exploratory Data Analysis (EDA)', description: 'Correlation analysis, outlier detection, data validation', category: 'advanced', targetLevel: 4, weight: 2 },
      { id: 'business-metrics', name: 'Product & Business Metrics', description: 'CAC, LTV, churn prediction, cohort retention analysis', category: 'advanced', targetLevel: 3, weight: 1 }
    ]
  },
  {
    id: 'cloud-devops',
    trackName: 'Cloud & DevOps Engineer',
    description: 'Automate scalable infrastructure, CI/CD pipelines, container orchestration, and cloud reliability.',
    icon: 'Cloud',
    skills: [
      { id: 'linux-shell', name: 'Linux OS & Bash Scripting', description: 'Process management, networking, file permissions, automation scripts', category: 'foundational', targetLevel: 4, weight: 3 },
      { id: 'networking-dns', name: 'Networking & Security', description: 'TCP/IP, HTTP/S, SSL/TLS certificates, DNS, VPC routing, firewalls', category: 'foundational', targetLevel: 4, weight: 2 },
      { id: 'docker-containers', name: 'Docker & Containerization', description: 'Multi-stage Dockerfiles, caching, volumes, container security', category: 'core', targetLevel: 5, weight: 3 },
      { id: 'kubernetes', name: 'Kubernetes Orchestration', description: 'Pods, Deployments, Services, Ingress, Helm charts, config maps', category: 'core', targetLevel: 4, weight: 2 },
      { id: 'cicd-pipelines', name: 'CI/CD Automation', description: 'GitHub Actions, automated test execution, artifact publishing', category: 'core', targetLevel: 4, weight: 2 },
      { id: 'terraform-iac', name: 'Terraform & Cloud IaC', description: 'Declarative cloud provisioning, state management, modularization', category: 'advanced', targetLevel: 4, weight: 2 },
      { id: 'observability-monitoring', name: 'Observability & Telemetry', description: 'Prometheus, Grafana, structured logging, alert policies', category: 'advanced', targetLevel: 3, weight: 1 }
    ]
  },
  {
    id: 'ai-ml-engineer',
    trackName: 'AI & Machine Learning Engineer',
    description: 'Build predictive models, fine-tune LLMs, and deploy production ML systems.',
    icon: 'Cpu',
    skills: [
      { id: 'python-math', name: 'Python & Linear Algebra', description: 'Vector math, matrix calculus, gradients, vectorization', category: 'foundational', targetLevel: 4, weight: 3 },
      { id: 'classical-ml', name: 'Supervised & Unsupervised ML', description: 'Scikit-learn, Random Forests, XGBoost, regularizations, metrics', category: 'foundational', targetLevel: 4, weight: 3 },
      { id: 'deep-learning', name: 'Deep Learning & PyTorch', description: 'Neural networks, backprop, CNNs, Transformers, loss functions', category: 'core', targetLevel: 4, weight: 3 },
      { id: 'llm-engineering', name: 'Generative AI & LLM Systems', description: 'Prompt engineering, RAG, vector embeddings, fine-tuning, Gemini API', category: 'core', targetLevel: 4, weight: 2 },
      { id: 'mlops-deployment', name: 'MLOps & Model Serving', description: 'FastAPI model endpoints, model registry, latency tracking, Docker', category: 'advanced', targetLevel: 3, weight: 2 }
    ]
  },
  {
    id: 'fullstack-dev',
    trackName: 'Full-Stack Developer',
    description: 'Connect elegant frontend user experiences with performant backend APIs and databases.',
    icon: 'Layers',
    skills: [
      { id: 'frontend-basics', name: 'Frontend Architecture (React)', description: 'Components, responsive design, state, API consumption', category: 'foundational', targetLevel: 4, weight: 3 },
      { id: 'nodejs-express', name: 'Node.js & Express REST APIs', description: 'Middleware, routing, async handlers, error handling, status codes', category: 'foundational', targetLevel: 4, weight: 3 },
      { id: 'database-design', name: 'Database Modeling (SQL & NoSQL)', description: 'Postgres schemas, Firestore collections, indexing, ACID vs eventual', category: 'core', targetLevel: 4, weight: 3 },
      { id: 'auth-security', name: 'Auth, JWT & Application Security', description: 'OAuth2, session tokens, CSRF/XSS defense, RBAC', category: 'core', targetLevel: 4, weight: 2 },
      { id: 'system-design', name: 'System Design & Scalability', description: 'Caching (Redis), rate-limiting, message queues, horizontal scaling', category: 'advanced', targetLevel: 3, weight: 2 }
    ]
  }
];
