module.exports = {
  name: 'Hanzala Rashid',
  firstName: 'Hanzala',
  role: 'AI / ML Engineer',
  location: 'Karachi, Pakistan',
  email: 'Hanzala.raja2004@gmail.com',  current: 'Junior ML & DevOps Developer @ wAI Industries',
  summary:
    'I build multi-agent LLM systems, voice and text RAG pipelines, event-driven streaming and computer vision apps — then ship them. Full-stack ML microservices, local open-source LLMs on Ollama, and production deployments with Docker, Qdrant and Linux. I take complex AI projects from architecture diagram to running server.',

  links: {
    github: 'https://github.com/Hanzala-rs',
    linkedin: 'https://www.linkedin.com/in/hanzala-rashid/',
  },

  stats: [
    { value: '1+', label: 'Year in industry', note: 'ML Engineer → full-time at wAI Industries' },
    { value: '3', label: 'Languages in one RAG', note: 'English, Urdu & Roman Urdu in OTTO' },
    { value: '5', label: 'Certifications', note: 'Anthropic, Microsoft, Google Cloud, Udemy' },
  ],

  marquee: ['RAG', 'MULTI-AGENT', 'LANGGRAPH', 'OLLAMA', 'QDRANT', 'MLOPS', 'DOCKER', 'COMPUTER VISION'],

  experience: [
    {
      year: '2026',
      org: 'wAI Industries',
      role: 'Junior ML & DevOps Developer',
      period: 'Aug 2026 — Present',
      mode: 'Remote / On-site',
      points: [
        'Offered a full-time role after the internship to own ML integrations and server operations.',
        'Containerized Python microservices with Docker & Docker Compose for production.',
        'Prepare release builds and patches, and deploy directly to client Ubuntu Linux servers.',
        'Day-to-day server maintenance and updates to keep client workloads healthy.',
      ],
    },
    {
      year: '2025',
      org: 'ISSM.AI',
      role: 'Machine Learning Engineer Intern',
      period: 'Oct 2025 — Aug 2026',
      mode: 'Remote / On-site',
      points: [
        'Built FastAPI endpoints for real-time inference, streaming responses and data pipelines.',
        'Benchmarked open-source model optimizations for faster, more accurate inference.',
        'Wrote scrapers and cleaned unstructured data into vectorizable RAG datasets.',
        'Integrated LLM and computer vision features into live client platforms.',
      ],
    },
    {
      year: '2022',
      org: 'DHA Suffa University',
      role: 'BS in Data Science',
      period: '2022 — 2026',
      mode: 'Karachi, Pakistan',
      points: [
        'Final Year Project: Smart Housing Society 2.0 — resident portal with voting, ticketing and complaints.',
        'RAG chatbot for resident queries, plus ANPR license-plate and facial recognition security modules.',
      ],
    },
  ],

  // The five featured GitHub repositories. `repo` must match the GitHub name exactly.
  projects: [
    {
      repo: 'OTTO',
      glyph: 'OTTO',
      art: 'rings',
      title: 'OTTO',
      tagline: 'Multilingual & multimodal voice/text RAG assistant',
      tags: 'RAG · Voice · Streaming',
      points: [
        'Voice + text assistant that understands English, Urdu and Roman Urdu — Next.js 14 front, FastAPI + LangGraph back.',
        'Event-driven ingestion: PostgreSQL → Debezium CDC → Redpanda (Kafka) → Qdrant, so the knowledge base stays in sync.',
        'Parent-child chunking with BGE-M3 embeddings, cross-encoder reranking, Whisper STT and Edge-TTS.',
      ],
      stack: ['Next.js 14', 'FastAPI', 'LangGraph', 'Qdrant', 'Debezium', 'Redpanda', 'BGE-M3', 'Whisper', 'Docker'],
    },
    {
      repo: 'dazia',
      glyph: 'DAZIA',
      art: 'grid',
      title: 'DAZIA',
      tagline: 'Local-first personal assistant — no paid AI APIs',
      tags: 'Local LLM · Agent',
      points: [
        'FastAPI + Ollama + SQLite assistant; on the default path nothing leaves the laptop.',
        'Benchmarked models on an i3 / 12 GB laptop and picked qwen3.5:4b (~6 tok/s) over llama3.1:8b.',
        'Reminders and a daily briefing, auto-started at login via Windows Task Scheduler with crash recovery and log rotation.',
      ],
      stack: ['Python', 'FastAPI', 'Ollama', 'Qwen 3.5', 'SQLite', 'PowerShell'],
    },
    {
      repo: 'Deppy',
      glyph: 'DEPPY',
      art: 'bars',
      title: 'Deppy',
      tagline: 'Deployment tracker for field deployment engineers',
      tags: 'DevOps · Tooling',
      demo: 'https://deppy-tau.vercel.app',
      points: [
        'Log a build in seconds through a simple form, across many client projects.',
        'Filter and export history (this month, last month, per project) with summary metrics and a monthly volume chart.',
        'Shared Supabase Postgres backend so the whole team writes to one place.',
      ],
      stack: ['Python', 'Streamlit', 'PostgreSQL', 'Supabase'],
    },
    {
      repo: 'voice-chat-box',
      glyph: 'VOX',
      art: 'wave',
      title: 'Voice Chat Box',
      tagline: 'Drop-in voice & chat widget for the web',
      tags: 'Frontend · Voice UI',
      demo: 'https://voice-chat-box.vercel.app',
      points: [
        'A chat widget UI built with TanStack Start, React and TypeScript.',
        'Accessible components on Radix UI, styled with Tailwind, deployed on Vercel.',
      ],
      stack: ['TypeScript', 'React', 'TanStack Start', 'Vite', 'Radix UI', 'Tailwind'],
    },
    {
      repo: 'Image-Classifier',
      glyph: 'VISION',
      art: 'dots',
      title: 'Image Classifier',
      tagline: 'Full-stack image classification with prediction history',
      tags: 'Computer Vision',
      points: [
        'FastAPI service running a pretrained EfficientNet-B0 (PyTorch / torchvision) over the 1,000 ImageNet classes.',
        'React frontend for upload and results; every prediction is stored in MongoDB as history.',
        'Backend, frontend and database wired together with Docker Compose.',
      ],
      stack: ['PyTorch', 'FastAPI', 'React', 'MongoDB', 'Docker Compose'],
    },
  ],

  // Work from the CV that isn't a public repo.
  alsoBuilt: [
    { title: 'MLL — Multi-Agent LLM Game Suite', note: 'UNO played by Gemma, Mistral & Llama 3 agents with their own personalities (Streamlit + Ollama).' },
    { title: 'Smart Housing Society 2.0', note: 'Resident portal + RAG chatbot + ANPR & face recognition (Final Year Project).' },
  ],

  certifications: [
    { title: 'Claude Code in Action', issuer: 'Anthropic', date: 'Jul 2026' },
    { title: 'Intro to Model Context Protocol & Advanced Topics', issuer: 'Anthropic', date: 'Jul 2026' },
    { title: 'AI Engineer Core Track: LLM, RAG, QLoRA & Agents', issuer: 'Udemy', date: 'Mar 2026' },
    { title: 'Azure AI Fundamentals (AI-900)', issuer: 'Microsoft', date: 'Oct 2025' },
    { title: 'Big Data & ML Fundamentals', issuer: 'Google Cloud / Coursera', date: 'May 2024' },
    { title: 'BS Data Science', issuer: 'DHA Suffa University', date: '2022 — 2026' },
  ],

  services: [
    {
      title: 'RAG Systems',
      text: 'Retrieval pipelines that actually stay accurate: chunking strategy, embeddings, reranking, multilingual queries and evals — on Qdrant with live CDC ingestion.',
      skills: ['LangGraph', 'LangChain', 'Qdrant', 'BGE-M3', 'Parent-Child Chunking', 'Reranking'],
    },
    {
      title: 'Multi-Agent & Local LLMs',
      text: 'Agents with roles, memory and tools, running on open-source models through Ollama — private, cheap and offline-capable.',
      skills: ['Ollama', 'Llama 3', 'Mistral', 'Gemma', 'Qwen', 'QLoRA', 'Prompt Engineering'],
    },
    {
      title: 'Voice AI',
      text: 'Speech in, speech out: Whisper speech-to-text, Edge-TTS and streaming responses wired into a real product.',
      skills: ['Whisper STT', 'Edge-TTS', 'Streaming', 'FastAPI'],
    },
    {
      title: 'MLOps & Deployment',
      text: 'Containerized ML microservices shipped to client Ubuntu servers — builds, patches, updates and day-to-day ops.',
      skills: ['Docker', 'Docker Compose', 'Ubuntu Linux', 'Bash', 'Redis'],
    },
    {
      title: 'Data & Event Streaming',
      text: 'Scrapers, cleaning and ETL that turn messy data into vector-ready datasets, with event-driven sync between databases.',
      skills: ['PostgreSQL', 'Debezium CDC', 'Redpanda (Kafka)', 'SQL', 'Python'],
    },
    {
      title: 'Computer Vision',
      text: 'Classification, license-plate recognition and face recognition, served behind APIs.',
      skills: ['OpenCV', 'PyTorch', 'TensorFlow', 'Scikit-learn'],
    },
  ],
};
