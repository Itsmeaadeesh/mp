import { SkillTrack, Course, QuizQuestion } from '../types';

export const INITIAL_TRACKS: SkillTrack[] = [
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

export const INITIAL_COURSES: Course[] = [
  // Foundational Frontend
  {
    id: 'c-fe-01',
    title: 'Modern HTML5 & Responsive CSS Architecture',
    provider: 'freeCodeCamp',
    description: 'Learn modern semantic HTML, CSS Grid, Flexbox, and mobile-first responsive design principles.',
    url: 'https://freecodecamp.org',
    duration: '6 hours',
    rating: 4.8,
    level: 'foundational',
    skillTags: ['html-css', 'frontend-basics']
  },
  {
    id: 'c-fe-02',
    title: 'Deep Dive: Modern JavaScript (ES6+)',
    provider: 'Frontend Masters',
    description: 'Master the event loop, closures, promises, async/await, and modern ECMAScript idioms.',
    url: 'https://frontendmasters.com',
    duration: '8 hours',
    rating: 4.9,
    level: 'foundational',
    skillTags: ['javascript-core', 'frontend-basics']
  },
  {
    id: 'c-fe-03',
    title: 'React 18: Complete Developer Guide',
    provider: 'Coursera / Meta',
    description: 'Build composable web applications with functional components, modern Hooks, and Virtual DOM understanding.',
    url: 'https://coursera.org',
    duration: '14 hours',
    rating: 4.9,
    level: 'intermediate',
    skillTags: ['react-fundamentals', 'frontend-basics']
  },
  {
    id: 'c-fe-04',
    title: 'Production TypeScript for React Developers',
    provider: 'Execute Program',
    description: 'Type React props, events, custom hooks, generics, and strict type safety patterns.',
    url: 'https://executeprogram.com',
    duration: '7 hours',
    rating: 4.8,
    level: 'intermediate',
    skillTags: ['typescript']
  },
  {
    id: 'c-fe-05',
    title: 'State Management with Redux Toolkit & Zustand',
    provider: 'Egghead.io',
    description: 'Handle complex application state, immutability, selectors, and async middleware with zero boilerplate.',
    url: 'https://egghead.io',
    duration: '5 hours',
    rating: 4.7,
    level: 'intermediate',
    skillTags: ['state-management']
  },
  {
    id: 'c-fe-06',
    title: 'Core Web Vitals & Web Performance Engineering',
    provider: 'web.dev',
    description: 'Optimize Largest Contentful Paint (LCP), INP, and bundle splitting for high-speed delivery.',
    url: 'https://web.dev',
    duration: '6 hours',
    rating: 4.9,
    level: 'advanced',
    skillTags: ['web-performance']
  },
  {
    id: 'c-fe-07',
    title: 'Testing React Apps with Vitest & Testing Library',
    provider: 'TestingJavaScript.com',
    description: 'Write robust unit and integration tests mimicking genuine user interactions.',
    url: 'https://testingjavascript.com',
    duration: '8 hours',
    rating: 4.8,
    level: 'advanced',
    skillTags: ['testing-qa']
  },

  // Data Analyst
  {
    id: 'c-da-01',
    title: 'Mastering SQL for Analytics & Data Science',
    provider: 'Mode Analytics',
    description: 'Master advanced SQL joins, subqueries, aggregations, window functions, and analytics queries.',
    url: 'https://mode.com',
    duration: '10 hours',
    rating: 4.9,
    level: 'foundational',
    skillTags: ['sql-querying', 'database-design']
  },
  {
    id: 'c-da-02',
    title: 'Practical Statistics for Data Analysis',
    provider: 'Khan Academy / edX',
    description: 'Confidence intervals, hypothesis testing, A/B testing statistical rigor, and variance analysis.',
    url: 'https://edx.org',
    duration: '9 hours',
    rating: 4.7,
    level: 'foundational',
    skillTags: ['statistics-prob']
  },
  {
    id: 'c-da-03',
    title: 'Data Wrangling with Python, Pandas & NumPy',
    provider: 'DataCamp',
    description: 'Clean messy datasets, reshape columns, handle missing values, and transform data streams.',
    url: 'https://datacamp.com',
    duration: '12 hours',
    rating: 4.8,
    level: 'intermediate',
    skillTags: ['python-pandas', 'python-math']
  },
  {
    id: 'c-da-04',
    title: 'Executive Dashboards with Tableau & PowerBI',
    provider: 'Coursera',
    description: 'Design visual hierarchies, calculated fields, and self-serve stakeholder reporting dashboards.',
    url: 'https://coursera.org',
    duration: '8 hours',
    rating: 4.7,
    level: 'intermediate',
    skillTags: ['bi-dashboards']
  },
  {
    id: 'c-da-05',
    title: 'Exploratory Data Analysis & Business Intelligence',
    provider: 'Google Career Certificates',
    description: 'Translate raw telemetry into cohort charts, customer retention funnels, and KPI trends.',
    url: 'https://coursera.org',
    duration: '10 hours',
    rating: 4.8,
    level: 'advanced',
    skillTags: ['exploratory-analysis', 'business-metrics']
  },

  // DevOps & Cloud
  {
    id: 'c-do-01',
    title: 'Linux CLI & Shell Automation Essentials',
    provider: 'Linux Foundation',
    description: 'File permissions, systemd services, SSH tunneling, cron jobs, and bash scripting automation.',
    url: 'https://linuxfoundation.org',
    duration: '8 hours',
    rating: 4.8,
    level: 'foundational',
    skillTags: ['linux-shell']
  },
  {
    id: 'c-do-02',
    title: 'Computer Networking & Cloud Security for Engineers',
    provider: 'Pluralsight',
    description: 'Understand TCP/IP, DNS records, TLS handshakes, subnetting, NAT gateways, and firewalls.',
    url: 'https://pluralsight.com',
    duration: '7 hours',
    rating: 4.7,
    level: 'foundational',
    skillTags: ['networking-dns']
  },
  {
    id: 'c-do-03',
    title: 'Docker Mastery: From Containers to Swarm & Compose',
    provider: 'Udemy / Bret Fisher',
    description: 'Build lightweight containers, leverage layer caching, compose multi-tier local dev environments.',
    url: 'https://udemy.com',
    duration: '9 hours',
    rating: 4.9,
    level: 'intermediate',
    skillTags: ['docker-containers']
  },
  {
    id: 'c-do-04',
    title: 'Kubernetes from the Ground Up',
    provider: 'Cloud Native Computing Foundation (CNCF)',
    description: 'Deploy stateless and stateful services, configure Ingress, Horizontal Pod Autoscalers, and Helm.',
    url: 'https://cncf.io',
    duration: '14 hours',
    rating: 4.9,
    level: 'intermediate',
    skillTags: ['kubernetes']
  },
  {
    id: 'c-do-05',
    title: 'Continuous Delivery with GitHub Actions',
    provider: 'GitHub Skills',
    description: 'Build automated continuous integration pipelines, preview deployments, and security scanners.',
    url: 'https://skills.github.com',
    duration: '5 hours',
    rating: 4.8,
    level: 'intermediate',
    skillTags: ['cicd-pipelines']
  },
  {
    id: 'c-do-06',
    title: 'Infrastructure as Code with Terraform',
    provider: 'HashiCorp Learn',
    description: 'Provision cloud instances, IAM roles, and storage buckets reliably across environments.',
    url: 'https://hashicorp.com',
    duration: '8 hours',
    rating: 4.8,
    level: 'advanced',
    skillTags: ['terraform-iac']
  },

  // AI & ML
  {
    id: 'c-ml-01',
    title: 'Mathematics & Linear Algebra for Machine Learning',
    provider: 'Imperial College London / Coursera',
    description: 'Vectors, matrix multiplications, dot products, eigenvalues, and gradient descent intuition.',
    url: 'https://coursera.org',
    duration: '10 hours',
    rating: 4.9,
    level: 'foundational',
    skillTags: ['python-math']
  },
  {
    id: 'c-ml-02',
    title: 'Machine Learning Specialization',
    provider: 'DeepLearning.AI / Andrew Ng',
    description: 'Linear & logistic regression, regularizations, tree-based models, and clustering algorithms.',
    url: 'https://deeplearning.ai',
    duration: '16 hours',
    rating: 5.0,
    level: 'foundational',
    skillTags: ['classical-ml']
  },
  {
    id: 'c-ml-03',
    title: 'Deep Learning & Neural Networks with PyTorch',
    provider: 'fast.ai',
    description: 'Train convolutional and transformer architectures, learning rate scheduling, and tensor operations.',
    url: 'https://fast.ai',
    duration: '18 hours',
    rating: 4.9,
    level: 'intermediate',
    skillTags: ['deep-learning']
  },
  {
    id: 'c-ml-04',
    title: 'Generative AI & LLM Engineering with Gemini',
    provider: 'Google Cloud Training',
    description: 'Build RAG pipelines, function calling, multimodal prompts, and embeddings with Gemini API.',
    url: 'https://cloud.google.com/training',
    duration: '8 hours',
    rating: 4.9,
    level: 'intermediate',
    skillTags: ['llm-engineering']
  },
  {
    id: 'c-ml-05',
    title: 'MLOps: Deploying & Monitoring Models in Production',
    provider: 'Full Stack Deep Learning',
    description: 'Containerize models with FastAPI, trace inferences, detect data drift, and monitor latency.',
    url: 'https://fullstackdeeplearning.com',
    duration: '10 hours',
    rating: 4.8,
    level: 'advanced',
    skillTags: ['mlops-deployment']
  },

  // Full-Stack Dev
  {
    id: 'c-fs-01',
    title: 'Node.js & Express API Development Bootcamp',
    provider: 'The Odin Project',
    description: 'Architect modular backend services, request middleware, route controllers, and status handling.',
    url: 'https://theodinproject.com',
    duration: '12 hours',
    rating: 4.9,
    level: 'foundational',
    skillTags: ['nodejs-express']
  },
  {
    id: 'c-fs-02',
    title: 'Database Architecture: SQL vs NoSQL Firestore',
    provider: 'MongoDB University & Google Cloud',
    description: 'Relational normalization vs document denormalization, indexing strategies, and querying patterns.',
    url: 'https://cloud.google.com',
    duration: '7 hours',
    rating: 4.8,
    level: 'intermediate',
    skillTags: ['database-design']
  },
  {
    id: 'c-fs-03',
    title: 'Production Web Authentication & Security',
    provider: 'Auth0 Developer Center',
    description: 'Secure cookies, JWT expiration, refresh rotation, OAuth 2.0 PKCE, and role-based authorization.',
    url: 'https://auth0.com',
    duration: '6 hours',
    rating: 4.9,
    level: 'intermediate',
    skillTags: ['auth-security']
  },
  {
    id: 'c-fs-04',
    title: 'Scalable System Design Fundamentals',
    provider: 'ByteByteGo / Alex Xu',
    description: 'Load balancers, caching tiers, asynchronous worker queues, database partitioning, and rate limiters.',
    url: 'https://bytebytego.com',
    duration: '10 hours',
    rating: 5.0,
    level: 'advanced',
    skillTags: ['system-design']
  }
];

export const BASELINE_QUIZZES: Record<string, QuizQuestion[]> = {
  'frontend-dev': [
    {
      id: 'bq-fe-1',
      quizId: 'baseline-frontend-dev',
      question: 'Which CSS layout system is natively designed for two-dimensional grid-based layouts (both rows and columns)?',
      options: ['CSS Flexbox', 'CSS Grid', 'CSS Float', 'CSS Position Absolute'],
      correctAnswerIndex: 1,
      explanation: 'CSS Grid is designed for 2-dimensional layouts (rows and columns simultaneously), whereas Flexbox is primarily 1-dimensional.',
      skillTag: 'html-css',
      difficulty: 'beginner'
    },
    {
      id: 'bq-fe-2',
      quizId: 'baseline-frontend-dev',
      question: 'What is the key difference between `==` and `===` in JavaScript?',
      options: [
        '== checks reference equality, while === checks value equality',
        '== performs implicit type coercion, while === requires operands to be identical types',
        '=== only works on numbers and strings',
        'There is no difference in ES6+'
      ],
      correctAnswerIndex: 1,
      explanation: 'The abstract equality operator `==` converts operands of different types before comparison, whereas strict equality `===` evaluates to false if types differ.',
      skillTag: 'javascript-core',
      difficulty: 'beginner'
    },
    {
      id: 'bq-fe-3',
      quizId: 'baseline-frontend-dev',
      question: 'In React, why must hooks only be called at the top level of a function component?',
      options: [
        'To allow TypeScript to infer return types',
        'To ensure hooks are called in the exact same order on every render for state persistence',
        'To prevent browser memory leaks in the DOM',
        'Because hooks are converted into class methods behind the scenes'
      ],
      correctAnswerIndex: 1,
      explanation: 'React relies on the call order of hooks across successive renders to associate internal hook state with the corresponding useState/useEffect call.',
      skillTag: 'react-fundamentals',
      difficulty: 'intermediate'
    },
    {
      id: 'bq-fe-4',
      quizId: 'baseline-frontend-dev',
      question: 'In TypeScript, what is the key distinction between `unknown` and `any`?',
      options: [
        '`unknown` disables all type checking completely',
        '`any` is type-safe, whereas `unknown` is deprecated',
        '`unknown` requires type narrowing or casting before performing operations on the value',
        'They are identical aliases in modern TypeScript'
      ],
      correctAnswerIndex: 2,
      explanation: '`unknown` is the type-safe counterpart of `any`. You cannot access properties or invoke methods on an `unknown` variable without first performing type narrowing.',
      skillTag: 'typescript',
      difficulty: 'intermediate'
    },
    {
      id: 'bq-fe-5',
      quizId: 'baseline-frontend-dev',
      question: 'Which Core Web Vital measures the time from when the page starts loading to when the largest text block or image is rendered on screen?',
      options: ['Cumulative Layout Shift (CLS)', 'First Input Delay (FID)', 'Interaction to Next Paint (INP)', 'Largest Contentful Paint (LCP)'],
      correctAnswerIndex: 3,
      explanation: 'LCP (Largest Contentful Paint) reports the render time of the largest content element visible in the viewport, targeting under 2.5 seconds.',
      skillTag: 'web-performance',
      difficulty: 'advanced'
    }
  ],

  'data-analyst': [
    {
      id: 'bq-da-1',
      quizId: 'baseline-data-analyst',
      question: 'Which SQL clause is used to filter records AFTER an aggregation (GROUP BY) has been calculated?',
      options: ['WHERE', 'HAVING', 'FILTER', 'QUALIFY'],
      correctAnswerIndex: 1,
      explanation: 'WHERE filters rows before aggregation, whereas HAVING filters grouped aggregated results (e.g. HAVING COUNT(*) > 5).',
      skillTag: 'sql-querying',
      difficulty: 'beginner'
    },
    {
      id: 'bq-da-2',
      quizId: 'baseline-data-analyst',
      question: 'When a distribution has extreme positive outliers (e.g. income), which metric is a better measure of central tendency than the mean?',
      options: ['Median', 'Standard Deviation', 'Variance', 'Range'],
      correctAnswerIndex: 0,
      explanation: 'The median is robust against extreme skewness and outliers, whereas the mean gets heavily dragged upwards by high outliers.',
      skillTag: 'statistics-prob',
      difficulty: 'beginner'
    },
    {
      id: 'bq-da-3',
      quizId: 'baseline-data-analyst',
      question: 'In Pandas, which method allows combining two DataFrames along a common key column similar to an SQL join?',
      options: ['pd.concat()', 'pd.merge()', 'df.append()', 'df.combine()'],
      correctAnswerIndex: 1,
      explanation: 'pd.merge() provides database-style join operations (inner, left, right, outer) on shared column keys.',
      skillTag: 'python-pandas',
      difficulty: 'intermediate'
    },
    {
      id: 'bq-da-4',
      quizId: 'baseline-data-analyst',
      question: 'In SQL, what is the purpose of `ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC)`?',
      options: [
        'Totals all orders per customer',
        'Assigns a sequential integer rank to each order per customer, reset for each customer',
        'Sorts the entire database table permanently',
        'Deletes duplicate customer rows'
      ],
      correctAnswerIndex: 1,
      explanation: 'The PARTITION BY divides rows into customer groups, and ROW_NUMBER() indexes each row 1, 2, 3... within that partition ordered by order date.',
      skillTag: 'sql-querying',
      difficulty: 'intermediate'
    }
  ],

  'cloud-devops': [
    {
      id: 'bq-do-1',
      quizId: 'baseline-cloud-devops',
      question: 'Which Linux command displays real-time running processes and CPU/memory utilization?',
      options: ['top / htop', 'ls -la', 'chmod 755', 'df -h'],
      correctAnswerIndex: 0,
      explanation: '`top` and `htop` provide real-time process monitoring and system resource usage.',
      skillTag: 'linux-shell',
      difficulty: 'beginner'
    },
    {
      id: 'bq-do-2',
      quizId: 'baseline-cloud-devops',
      question: 'Why are multi-stage Docker builds recommended for production images?',
      options: [
        'They run containers on multiple host machines simultaneously',
        'They separate build dependencies from the final lightweight production runtime image',
        'They automatically translate bash into Go',
        'They bypass container isolation'
      ],
      correctAnswerIndex: 1,
      explanation: 'Multi-stage builds permit keeping compilers and build tooling in an initial stage, copying only compiled artifacts into a clean, minimal runtime base image.',
      skillTag: 'docker-containers',
      difficulty: 'intermediate'
    },
    {
      id: 'bq-do-3',
      quizId: 'baseline-cloud-devops',
      question: 'In Kubernetes, what controller ensures that a specified number of identical pod replicas are running at any given time?',
      options: ['Deployment (via ReplicaSet)', 'ConfigMap', 'Ingress', 'PersistentVolumeClaim'],
      correctAnswerIndex: 0,
      explanation: 'A Deployment manages a ReplicaSet, which continuously monitors pod status and reconciles actual state to match the desired replica count.',
      skillTag: 'kubernetes',
      difficulty: 'intermediate'
    }
  ],

  'ai-ml-engineer': [
    {
      id: 'bq-ml-1',
      quizId: 'baseline-ai-ml-engineer',
      question: 'What is the fundamental goal of the Backpropagation algorithm in neural network training?',
      options: [
        'To initialize random weights across layers',
        'To compute the gradients of the loss function with respect to every weight using the chain rule',
        'To prevent overfitting by randomly dropping neurons',
        'To tokenize sentences into subwords'
      ],
      correctAnswerIndex: 1,
      explanation: 'Backpropagation applies the calculus chain rule backwards from output to input to compute partial derivatives (gradients) of the loss relative to model weights.',
      skillTag: 'deep-learning',
      difficulty: 'intermediate'
    },
    {
      id: 'bq-ml-2',
      quizId: 'baseline-ai-ml-engineer',
      question: 'What does RAG (Retrieval-Augmented Generation) do in modern LLM applications?',
      options: [
        'Retrains the base foundation weights from scratch daily',
        'Queries an external knowledge base/vector database for relevant context and injects it into the prompt',
        'Translates code between Python and C++',
        'Forces the model to only output single-word responses'
      ],
      correctAnswerIndex: 1,
      explanation: 'RAG retrieves factual chunks from a vector store based on semantic query embeddings and provides them to the LLM as grounding context to reduce hallucinations.',
      skillTag: 'llm-engineering',
      difficulty: 'intermediate'
    }
  ],

  'fullstack-dev': [
    {
      id: 'bq-fs-1',
      quizId: 'baseline-fullstack-dev',
      question: 'In Express.js, what is the role of the `next()` argument in route middleware functions?',
      options: [
        'It jumps immediately to the frontend HTML page',
        'It hands off control to the subsequent middleware function in the request pipeline',
        'It commits the database transaction',
        'It restarts the Node.js server process'
      ],
      correctAnswerIndex: 1,
      explanation: 'In Express middleware `(req, res, next)`, calling `next()` signals completion of the current task and passes the request to the next handler in the stack.',
      skillTag: 'nodejs-express',
      difficulty: 'beginner'
    },
    {
      id: 'bq-fs-2',
      quizId: 'baseline-fullstack-dev',
      question: 'Which HTTP status code is officially appropriate when a client request lacks valid authentication credentials?',
      options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
      correctAnswerIndex: 1,
      explanation: '401 Unauthorized denotes that authentication is required and has either failed or not yet been provided. 403 Forbidden denotes authentication succeeded but the user lacks permissions.',
      skillTag: 'auth-security',
      difficulty: 'beginner'
    }
  ]
};
