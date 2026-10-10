export const profile = {
  name: "Sai Prakash Lingala",
  firstName: "Sai Prakash",
  location: "Hyderabad, India",
  email: "saiprakash15b@gmail.com",
  phone: "+91 9346284569",
  phoneHref: "+919346284569",
  github: "https://github.com/saiprakash-db",
  linkedin: "https://www.linkedin.com/in/sai-prakash-lingala-400854287",
  resume: "/assets/sai-prakash-lingala-resume.pdf",
  headline: ["Sai Prakash", "Lingala."],
  roleLine: "A foundation in AI. A focus on data engineering.",
  availability: "Available for junior data engineering roles",
  introduction:
    "I’m a recent AI graduate in Hyderabad. I work with Python, SQL and Databricks to build careful, reproducible data pipelines—from the first validation check to the final insight.",
  about:
    "I’m a recent B.Tech graduate in Artificial Intelligence from Anurag University, based in Hyderabad. I’m looking for my first Data Engineer or Junior Data Engineer role, where I can put my Python, SQL and Databricks foundation to work.",
  philosophy:
    "I enjoy the work before the dashboard: checking keys, cleaning transactions, questioning a suspiciously good model. My analytics and machine learning projects have taught me that a useful result starts with data you can trust.",
  cricket:
    "Away from the notebooks, I follow cricket. Every match is a dataset—patterns, decisions and a little uncertainty.",
  languages: ["English", "Telugu", "Hindi"],
};
export const navigation = [
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
export const heroStats = [
  {
    value: 3172115,
    display: "3.17M",
    label: "Leakage-safe transactions",
    project: "KKBOX",
    decimals: 2,
    divisor: 1e6,
    suffix: "M",
  },
  {
    value: 99441,
    display: "99,441",
    label: "Orders analyzed",
    project: "OLIST",
    decimals: 0,
    divisor: 1,
    suffix: "",
  },
  {
    value: 0.9465,
    display: "0.9465",
    label: "Random Forest ROC-AUC",
    project: "KKBOX",
    decimals: 4,
    divisor: 1,
    suffix: "",
  },
];
export type Project = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  repo: string;
  stack: string[];
  problem: string;
  data: string;
  approach: { title: string; text: string }[];
  pipeline: string[];
  metrics: { value: string; label: string }[];
  insight: string;
  caveat: string;
  dashboard: string;
  dashboardAlt: string;
  dashboardDescription: string;
  files: { name: string; path: string }[];
};
export const projects: Project[] = [
  {
    id: "olist",
    number: "01",
    title: "Olist E-Commerce Data Analytics",
    shortTitle: "From orders to understanding.",
    category: "SQL ANALYTICS · E-COMMERCE",
    description:
      "Multi-table validation, business analysis and a 12-visual dashboard. A clear path from transactional data to business decisions.",
    repo: "https://github.com/saiprakash-db/olist-ecommerce-data-analysis",
    stack: ["SQL", "Databricks SQL", "Databricks AI/BI", "GitHub"],
    problem:
      "How do sales, seller performance and delivery experience fit together? Before answering, make sure the tables tell a consistent story.",
    data: "Multi-table Olist transactional data spanning 99,441 orders and 112,650 items, with customer geography, products, payments, sellers, delivery dates and reviews.",
    pipeline: [
      "Data",
      "Validation",
      "SQL analysis",
      "Business insights",
      "Dashboard",
      "Documentation",
    ],
    approach: [
      {
        title: "Validate the relationships.",
        text: "Check primary and foreign keys, missing values, dates, prices and review scores before joining the transactional tables.",
      },
      {
        title: "Turn SQL into questions.",
        text: "Analyze revenue, product categories, payments, seller concentration and customer geography; examine delivery time alongside customer reviews.",
      },
      {
        title: "Make the findings usable.",
        text: "Serve the analysis in a Databricks AI/BI dashboard with 12 visualizations and Customer State and Payment Method filters. Document the business insights alongside the SQL.",
      },
    ],
    metrics: [
      { value: "R$13.59M", label: "Product revenue" },
      { value: "R$160.58", label: "Reported average order value" },
      { value: "~12.5 days", label: "Average delivery time" },
      { value: "4.09 / 5", label: "Average review score" },
    ],
    insight:
      "Lower review scores are associated with longer delivery times: 21.3 days for 1-star reviews compared with 10.6 days for 5-star reviews. The top 10 sellers account for approximately 13.15% of revenue.",
    caveat:
      "Delivery time and review score show an association, not proof of causation.",
    dashboard: "dashboard/olist-ecommerce-dashboard.png",
    dashboardAlt:
      "Olist Databricks AI/BI dashboard with sales, delivery, seller and customer review visualizations",
    dashboardDescription:
      "12 visualizations · Customer State & Payment Method filters",
    files: [
      { name: "Validation SQL", path: "sql/01_data_validation.sql" },
      { name: "Business analysis", path: "sql/02_business_analysis.sql" },
      { name: "Business insights", path: "docs/business_insights.md" },
    ],
  },
  {
    id: "kkbox",
    number: "02",
    title: "KKBOX Churn & Cohort Retention Pipeline",
    shortTitle: "Better signals. No future leaks.",
    category: "BATCH PIPELINE · MACHINE LEARNING",
    description:
      "A leakage-safe subscription pipeline connecting transaction cleaning, feature engineering, model evaluation and Power BI.",
    repo: "https://github.com/saiprakash-db/subscription-churn-prediction-databricks",
    stack: [
      "SQL",
      "Python",
      "PySpark",
      "Databricks",
      "Delta Lake",
      "Spark MLlib",
      "MLflow",
      "Power BI",
      "GitHub",
    ],
    problem:
      "Which subscription patterns signal churn—and can a model identify them without accidentally seeing the future?",
    data: "A 200,000-customer stratified sample and 3,172,115 leakage-safe transactions. The analytical dataset has a 6.39% churn rate and zero post-expiry transactions after the temporal leakage audit.",
    pipeline: [
      "Customer scope",
      "Cleaning",
      "Transactions",
      "Temporal leakage audit",
      "Feature engineering",
      "Leakage-safe ML dataset",
      "Cohort analysis",
      "Training",
      "Evaluation",
      "MLflow",
      "Insights",
      "Power BI",
    ],
    approach: [
      {
        title: "Build the analytical foundation.",
        text: "Scope the customer sample, clean subscription and transaction data, and audit transaction timing against subscription expiry before engineering features.",
      },
      {
        title: "Keep the future out of training.",
        text: "Build a leakage-safe ML dataset, analyze cohort activity and churn patterns, and compare Logistic Regression with Random Forest using Spark MLlib.",
      },
      {
        title: "Evaluate, track and explain.",
        text: "Select Random Forest, track experiments in MLflow and serve business insights in Power BI. The automated batch workflow is organized across 10 notebooks.",
      },
    ],
    metrics: [
      { value: "200,000", label: "Customers in stratified sample" },
      { value: "0", label: "Post-expiry transactions" },
      { value: "0.5666", label: "Random Forest PR-AUC" },
      { value: "0.9137", label: "Random Forest recall" },
    ],
    insight:
      "Churn is 31.92% among customers without auto-renew, compared with 2.95% for always-auto-renew and 0.60% for auto-renew with no cancellations. These observed segments suggest where to investigate subscription friction.",
    caveat:
      "Results are based on a sample, with no user-log features. “Month 12 Activity Rate” measures activity, not true retention. Observed associations do not establish that enabling auto-renew causes lower churn.",
    dashboard: "docs/kkbox_dashboard.png",
    dashboardAlt:
      "KKBOX Power BI dashboard showing subscription churn, cohort activity and model results",
    dashboardDescription:
      "Power BI · Churn, cohort activity & customer behavior",
    files: [
      { name: "10 notebooks", path: "notebooks" },
      { name: "Validation SQL", path: "sql/data_validation.sql" },
      { name: "Business analysis", path: "sql/business_analysis.sql" },
    ],
  },
];
export const skills = [
  {
    number: "01",
    title: "Build & transform",
    description: "From raw records to a usable dataset.",
    items: [
      "Python",
      "SQL",
      "PySpark",
      "ETL pipelines",
      "Data transformation",
      "Data integration",
      "Databricks",
      "Delta Lake",
    ],
  },
  {
    number: "02",
    title: "Validate & analyze",
    description: "Question the data before the result.",
    items: [
      "MySQL",
      "Databricks SQL",
      "Pandas",
      "NumPy",
      "EDA",
      "Data cleaning",
      "Data validation",
      "DBMS",
    ],
  },
  {
    number: "03",
    title: "Model & communicate",
    description: "Make the output understandable.",
    items: [
      "Power BI",
      "Excel",
      "Matplotlib",
      "Spark MLlib",
      "MLflow",
      "Machine learning",
      "Artificial intelligence",
    ],
  },
  {
    number: "04",
    title: "Work thoughtfully",
    description: "Reproducible work. Clear communication.",
    items: [
      "Git",
      "GitHub",
      "OOPS",
      "Problem-solving",
      "Communication",
      "Team collaboration",
      "Claude",
      "GPT",
      "Gemini",
    ],
    note: "I use AI tools to assist with data-related tasks.",
  },
];
export const education = [
  {
    date: "2022 — 2026",
    school: "Anurag University",
    qualification: "B.Tech · Artificial Intelligence",
    result: "Graduate",
  },
  {
    date: "2020 — 2022",
    school: "Narayana Junior College",
    qualification: "Intermediate",
    result: "70.1%",
  },
  {
    date: "2020",
    school: "Sri Chaitanya High School",
    qualification: "Schooling",
    result: "CGPA 9.7",
  },
];
export const certifications = [
  {
    issuer: "Deloitte Australia · Forage",
    title: "Data Analytics Job Simulation",
    date: "27 September 2026",
    text: "Completed practical tasks in data analysis and forensic technology. A virtual job simulation.",
    url: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_6ab8d6e2a90bc149451dc0bf_1790502661640_completion_certificate.pdf",
    image: "/assets/deloitte-certificate.webp",
    mark: "Deloitte",
  },
  {
    issuer: "IBM Skills Network · Cognitive Class",
    title: "SQL and Relational Databases 101",
    date: "28 September 2026",
    text: "Completed DB0101EN with a passing grade. Issued by Cognitive Class and provided by IBM Skills Network.",
    url: "https://courses.cognitiveclass.ai/certificates/b97d7f4a701b42dda28a5ec616667adb",
    image: "/assets/ibm-certificate.webp",
    mark: "IBM",
  },
];
export const modelComparison = [
  { name: "Logistic Regression", value: 0.8845 },
  { name: "Random Forest · selected", value: 0.9465 },
];

export const workbench = {
  title: "A look at my process",
  caption: "Good answers start with careful groundwork.",
  stages: [
    {
      id: "ingest",
      label: "Ingest",
      number: "01",
      title: "Start with the source.",
      description: "Understand the tables before connecting them.",
      rows: [
        ["Orders", "Order lifecycle"],
        ["Order items", "Products & prices"],
        ["Customers", "Customer geography"],
        ["Reviews", "Customer feedback"],
      ],
      footer: "OLIST · SOURCE STRUCTURE",
    },
    {
      id: "validate",
      label: "Validate",
      number: "02",
      title: "Make every check count.",
      description: "A useful answer starts with a reliable input.",
      rows: [
        ["Primary & foreign keys", "Relationships"],
        ["Nulls & missing values", "Completeness"],
        ["Dates & prices", "Consistency"],
        ["Review scores", "Valid ranges"],
      ],
      footer: "OLIST · VALIDATION APPROACH",
    },
    {
      id: "serve",
      label: "Serve",
      number: "03",
      title: "Give the data a purpose.",
      description: "Document the logic. Make the findings readable.",
      rows: [
        ["SQL analysis", "Business questions"],
        ["12 visualizations", "Databricks AI/BI"],
        ["State & payment filters", "Explore the detail"],
        ["Written insights", "Explain the result"],
      ],
      footer: "OLIST · ANALYTICAL OUTPUTS",
    },
  ],
};

export const projectSnapshots = {
  olist: {
    revenue: "R$13.59",
    unit: "M",
    orders: "99,441",
    items: "112,650",
    visualizations: "12",
  },
  kkbox: { audit: "0 post-expiry transactions" },
};

export const playfulUI = {
  cricket: {
    label: "OFF THE CLOCK",
    title: "A little cricket break.",
    hint: "One ball. One wicket. Give it a bowl.",
    result: "Every match is a dataset.",
    action: "Bowl a ball",
    replay: "Bowl again",
    playing: "Ball in flight…",
  },
  marble: {
    label: "INTERACTIVE ILLUSTRATION",
    title: "Give a little data a push.",
    description:
      "Drag the marble into the inlet and follow its journey. A small, playful take on pipeline thinking.",
    action: "Launch marble",
    replay: "Run it again",
    playing: "Rolling through…",
    stages: ["Validate", "Transform", "Serve"],
    ready: "Drag to the inlet, or use Launch marble.",
    complete: "A clean finish. Ready to serve.",
  },
};

export const projectCardCopy = {
  olist: {
    title: "Olist E-Commerce",
    document: "COMMERCE / ANALYSIS SHEET",
    heading: "Trust the tables. Then ask better questions.",
    stack: ["SQL", "Databricks", "AI/BI"],
    steps: [
      "Check keys, nulls, dates, prices and review scores.",
      "Analyze orders, delivery, sellers and payments.",
      "Serve the findings in a 12-visual dashboard.",
    ],
    note: "Delivery and review scores show association, not causation.",
  },
  kkbox: {
    title: "KKBOX Churn Pipeline",
    document: "SUBSCRIPTIONS / MODEL REPORT",
    heading: "Predict churn. Keep the future out.",
    stack: ["PySpark", "Delta Lake", "MLflow", "Power BI"],
    steps: [
      "Scope a 200,000-customer stratified sample.",
      "Audit 3,172,115 transactions for temporal leakage.",
      "Train, compare and track models across 10 notebooks.",
    ],
    note: "Sample-based results. No user-log features. Month 12 activity is not true retention.",
  },
};

export const contactCopy = {
  action: "Copy email",
  success: "Email copied",
  failure:
    "Couldn’t copy automatically. Select the email address above to copy it.",
};
