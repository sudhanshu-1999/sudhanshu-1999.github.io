// Single source of truth for every word on the site.
// Facts come from the resume (Sudhanshu_ai.pdf) and the public GitHub READMEs.
// Anything not verified is marked with PLACEHOLDER so it is easy to find.

export const site = {
  name: "Sudhanshu Singh",
  url: "https://sudhanshu-1999.github.io",
  roles: ["AI Engineer", "AI Product Engineer", "Software Engineer"],
  positioning:
    "I build intelligent systems, AI-powered products, and scalable software experiences that turn complex problems into practical solutions.",
  tagline: "Engineering Intelligence. Building What's Next.",
  location: "Greater Noida, India · IST (UTC+5:30)",
  email: "sudhanshu01singh99@gmail.com",
  linkedin: "https://www.linkedin.com/in/sudhanshu-singh-1b3174179/",
  github: "https://github.com/sudhanshu-1999",
  resume: "/resume.pdf",
};

export const nav = [
  { id: "about", label: "About" },
  { id: "arsenal", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "architecture", label: "Architecture" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

// Verified numbers only.
export const stats = [
  { value: 3.5, decimals: 1, suffix: "+", label: "Years shipping production enterprise systems", note: "Nov 2022 – present" },
  { value: 7, decimals: 0, suffix: "", label: "Cloud Run services in the DocuMind RAG platform", note: "Terraform-provisioned" },
  { value: 0.909, decimals: 3, suffix: "", label: "mAP@50 on the YOLOv8 fall-detection capstone", note: "899-image validation set" },
  { value: 7, decimals: 0, suffix: "", label: "Certifications across Anthropic and Salesforce", note: "4 Anthropic · 3 Salesforce" },
];

export type SkillGroup = {
  id: string;
  label: string;
  blurb: string;
  skills: { name: string; where?: string }[];
};

// "where" = where the skill was actually used (from the resume / repos). No proficiency bars.
export const skillGroups: SkillGroup[] = [
  {
    id: "ai",
    label: "AI & LLM Engineering",
    blurb: "Agents, retrieval and the plumbing that makes them dependable.",
    skills: [
      { name: "LangGraph", where: "DocuMind agents · checkpointed memory" },
      { name: "LangChain" },
      { name: "RAG Architecture", where: "DocuMind · CloudMetic retrieval layer" },
      { name: "Agentic AI", where: "Tool-calling loops, ReAct, plan-and-execute" },
      { name: "Model Context Protocol", where: "DocuMind MCP server · visual-product-search" },
      { name: "Prompt & Context Engineering" },
      { name: "Hugging Face Transformers" },
      { name: "Sentence-Transformers", where: "all-MiniLM-L6-v2 embeddings" },
      { name: "FAISS / ChromaDB", where: "CloudMetic document retrieval" },
      { name: "Hybrid Search & Re-ranking", where: "BM25 + dense, RRF" },
      { name: "Llama" },
      { name: "Claude", where: "Claude Certified Architect – Foundations" },
      { name: "Ollama", where: "salesforce-llm-document-pipeline" },
      { name: "Vertex AI / Gemini", where: "DocuMind" },
    ],
  },
  {
    id: "ml",
    label: "Machine Learning",
    blurb: "Training, evaluating and serving models — with the data work done first.",
    skills: [
      { name: "Python" },
      { name: "PyTorch", where: "IIT Delhi programme · capstone" },
      { name: "YOLOv8 / Ultralytics", where: "Fall-detection capstone" },
      { name: "Deep Learning", where: "CNNs, RNNs / LSTMs, Transformers, GANs" },
      { name: "Computer Vision", where: "OpenCV, Roboflow" },
      { name: "Model Evaluation", where: "Golden sets, LLM-as-a-judge, regression gates" },
      { name: "Model Inference", where: "3.4 ms / image on a Tesla T4" },
      { name: "scikit-learn · NumPy · Pandas" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Software",
    blurb: "Async, idempotent services that survive retries and bad inputs.",
    skills: [
      { name: "Python" },
      { name: "FastAPI", where: "CloudMetic inference service" },
      { name: "REST APIs & Webhooks", where: "Signed callbacks, Apex REST" },
      { name: "Async & Queue-Based Processing", where: "submit → poll → retrieve" },
      { name: "Java" },
      { name: "JavaScript" },
      { name: "SQL / SOQL" },
      { name: "System Design" },
      { name: "Software Architecture" },
      { name: "OAuth 2.0 / JWT" },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & Infrastructure",
    blurb: "Event-driven GCP systems defined as code.",
    skills: [
      { name: "Google Cloud Platform", where: "DocuMind" },
      { name: "Cloud Run", where: "7 services" },
      { name: "Terraform", where: "DocuMind infrastructure" },
      { name: "Infrastructure as Code" },
      { name: "Pub/Sub · Firestore · BigQuery", where: "Ingestion + usage tracking" },
      { name: "Cloud Storage", where: "Ingestion trigger" },
      { name: "Document AI", where: "Parsing" },
      { name: "Google Kubernetes Engine" },
      { name: "Docker" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    blurb: "Day-to-day kit, plus the enterprise platform I grew up on.",
    skills: [
      { name: "Git" },
      { name: "GitLab" },
      { name: "Next.js & TypeScript", where: "Voyager Live Tracker, this site" },
      { name: "Three.js / React Three Fiber", where: "Voyager Live Tracker" },
      { name: "GitHub Actions", where: "This site's Pages deploys" },
      { name: "Vercel", where: "Voyager Live Tracker" },
      { name: "Salesforce Platform", where: "Apex, LWC, Flows · 3 certifications" },
      { name: "VS Code" },
      { name: "Jupyter Notebook" },
      { name: "Google Colab", where: "GPU training" },
    ],
  },
];

export type Metric = { label: string; value: number; display: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  kicker: string;
  year: string;
  category: "AI Platform" | "Computer Vision" | "Document AI" | "Full-Stack" | "Enterprise";
  summary: string;
  context?: string;
  problem: string;
  architecture: string[]; // pipeline steps, left to right
  implementation: string[];
  challenges: string[];
  stack: string[];
  github?: string; // only real, verified URLs
  demo?: string;
  codeNote?: string; // shown instead of a code link, e.g. for a private repo
  metrics?: Metric[];
  metricsNote?: string;
  accent: "cyan" | "violet" | "blue";
};

export const projects: Project[] = [
  {
    slug: "documind",
    index: "01",
    title: "DocuMind",
    kicker: "Multi-tenant enterprise RAG & agentic AI platform",
    year: "2026",
    category: "AI Platform",
    summary:
      "A 7-service generative-AI platform on Google Cloud: event-driven document ingestion, hybrid retrieval, grounded and cited answers, and LangGraph agents exposed over MCP and A2A.",
    context: "Built during the GenAI Engineering: Build, Scale & Deploy AI Systems programme.",
    // TODO(user): add github / demo links when ready.
    problem:
      "Enterprise teams need answers grounded in their own documents — with tenant isolation, PII protection, predictable cost and a way to prove answer quality — not a chatbot that guesses.",
    architecture: [
      "Cloud Storage",
      "Pub/Sub",
      "Document AI",
      "Chunk + embed",
      "Vertex AI Vector Search",
      "Hybrid retrieve + re-rank",
      "Gemini (grounded, cited)",
    ],
    implementation: [
      "Seven services — ingest, API, admin, UI, chat, MCP, agent — deployed on Cloud Run, all infrastructure in Terraform.",
      "Event-driven ingestion: Cloud Storage → Pub/Sub → worker, Document AI parsing, text-embedding-005, Vertex AI Vector Search; exponential-backoff retries, a dead-letter topic and incremental re-indexing.",
      "Hybrid search (BM25 + dense with Reciprocal Rank Fusion) re-ranked by the Vertex AI Ranking API; Gemini answers with token-budgeted context, structured output, explicit refusals and streaming.",
      "Multi-tenant isolation: IAP identity mapped to tenants, cross-tenant denial tests, Cloud DLP PII redaction, Model Armor guardrails and per-request audit logs.",
      "LangGraph agents with typed tool contracts and Postgres-checkpointed memory; retrieval exposed as an MCP server and A2A agent; GraphRAG on Spanner Graph and video search with timestamped citations.",
      "Evaluation pipeline: golden dataset, offline regression gates, LLM-as-a-judge groundedness; a LoRA fine-tuning experiment on Gemini Flash-Lite compared to baseline on win rate and cost.",
    ],
    challenges: [
      "Keeping tenants strictly apart while sharing one retrieval stack — solved with identity-to-tenant mapping and explicit cross-tenant denial tests.",
      "Cost and latency at scale — Gemini context caching, an answer cache and complexity-based model routing (Flash-Lite / Flash / Pro) behind a monthly budget breaker.",
      "Ingestion that never silently drops a document — retries with backoff, a dead-letter topic and incremental re-indexing.",
    ],
    stack: ["Python", "LangGraph", "Google ADK", "MCP", "A2A", "Vertex AI", "Gemini", "Vector Search", "Pub/Sub", "Firestore", "BigQuery", "Document AI", "Cloud Run", "Terraform", "Streamlit"],
    accent: "cyan",
  },
  {
    slug: "fall-detection",
    index: "02",
    title: "Real-Time Fall Detection",
    kicker: "YOLOv8 computer vision · IIT Delhi capstone",
    year: "2025 – 2026",
    category: "Computer Vision",
    summary:
      "A single-class YOLOv8s detector that spots people who have fallen, fast enough for live video monitoring — with a data-quality pipeline that cleans the dataset before training.",
    context: "Capstone project, Advanced AI & Deep Learning Programme, IIT Delhi.",
    problem:
      "Falls need to be caught in seconds on ordinary camera feeds. The model has to be accurate, fast enough for several streams per GPU, and resistant to single-frame false alarms.",
    architecture: ["Roboflow dataset", "Data-quality audit", "YOLOv8s training", "Validation", "Video inference", "N-frame alert"],
    implementation: [
      "Dataset audit: 4,497 images (3,148 train / 899 val / 450 test), one class.",
      "Data-quality pipeline: OpenCV decode check for corrupt images, MD5-hash de-duplication, outlier boxes dropped by normalised area (train split only) — 29 noisy boxes removed.",
      "YOLOv8s from COCO weights, 640 px, 100 epochs on a Tesla T4, AdamW with cosine schedule, mosaic/mixup augmentation, checkpoints to Drive every epoch.",
      "Inference script for image, folder, video or webcam that raises an alert only after a fall is seen in N consecutive frames.",
    ],
    challenges: [
      "Label noise from a mixed photo/video dataset — handled before training instead of hoping the model averages it out.",
      "Colab disconnects on a 2-hour run — per-epoch checkpoints to Google Drive.",
      "Single-frame false positives in video — a consecutive-frame alert rule.",
    ],
    stack: ["Python", "PyTorch", "YOLOv8", "Ultralytics", "OpenCV", "Roboflow", "Google Colab"],
    github: "https://github.com/sudhanshu-1999/yolov8-fall-detection",
    metrics: [
      { label: "mAP@50", value: 90.9, display: "0.909" },
      { label: "Precision", value: 87.9, display: "0.879" },
      { label: "Recall", value: 85.8, display: "0.858" },
      { label: "mAP@50-95", value: 61.4, display: "0.614" },
    ],
    metricsNote: "Held-out validation set, 899 images · 3.4 ms inference per image on a Tesla T4 (~290 FPS, model only).",
    accent: "violet",
  },
  {
    slug: "document-intelligence",
    index: "03",
    title: "AI Document Intelligence",
    kicker: "Async LLM extraction pipeline for enterprise files",
    year: "2025",
    category: "Document AI",
    summary:
      "Upload a PDF, Word or Excel file in Salesforce and get a structured LLM answer back — asynchronously, so no request waits on a slow model and one bad document never blocks the rest.",
    problem:
      "Platform callouts time out long before an LLM finishes reading a large document, bulk uploads fire many jobs at once, and at-least-once delivery means the same file can arrive twice.",
    architecture: ["File upload", "Trigger + Queueable", "FastAPI /extract (202)", "Docling → Markdown", "LLM with retries", "Signed callback"],
    implementation: [
      "Submit → callback pattern: the Queueable only submits; the FastAPI service answers 202 with a job id and calls back when done. GET /jobs/{id} adds polling.",
      "Bounded retries with exponential backoff and jitter on the LLM call and the callback — only retryable errors are retried.",
      "Idempotency key = record id + task + SHA-256 of file content, so a duplicate submission returns the existing job instead of processing twice.",
      "Per-job failure isolation, a callback host allow-list and a shared-token check on the receiving endpoint; secrets via Named Credentials and environment variables.",
      "18 pytest tests with Docling, LLM and platform stubbed.",
    ],
    challenges: [
      "Timeouts on large documents — moved from synchronous calls to submit → poll → retrieve.",
      "Duplicate writes under at-least-once delivery — content-hash idempotency keys.",
      "Context-window limits — Markdown conversion plus a word budget, with the callback reporting truncation.",
    ],
    stack: ["Python", "FastAPI", "Docling", "Ollama", "LLMs", "Apex", "REST", "pytest", "Docker"],
    github: "https://github.com/sudhanshu-1999/salesforce-llm-document-pipeline",
    accent: "blue",
  },
  {
    slug: "visual-product-search",
    index: "04",
    title: "Visual Product Search",
    kicker: "Image-to-image retrieval with a guarded vision-LLM re-ranker",
    year: "2026",
    category: "AI Platform",
    summary:
      "Identify which catalogue product is in a customer's photo — no barcode or label — then check stock. Exposed as a FastAPI service and as MCP tools for agents.",
    problem:
      "Describing a photo in text and searching with that text loses the fine detail that separates look-alike products. The system also has to refuse confidently when the product is not in the catalogue.",
    architecture: ["Customer photo", "3 guard doors", "Optional crop", "Image encoder", "Tenant-filtered index", "Re-rank if close", "Answer or abstain"],
    implementation: [
      "Image embeddings on both sides (DINOv2 / SigLIP2, or an offline toy encoder) with tenant-filtered vector search and per-SKU pooling.",
      "A vision-LLM re-ranks only close calls, inside a budget breaker, and its output is validated before use.",
      "Three guard layers — arguments, caller token, tenant + data region — shared by the API and the MCP server.",
      "Versioned catalogue ledger, eval harness with calibration and a PASS/FAIL gate, usage rows and a full trace per request; 34 offline tests.",
    ],
    challenges: [
      "Out-of-catalogue photos — the eval gate refuses to bless an encoder that cannot reject them.",
      "Keeping LLM cost bounded — re-rank only when the top results are close and the budget allows.",
    ],
    stack: ["Python", "FastAPI", "MCP", "DINOv2", "SigLIP2", "OWLv2", "Vector Search", "pytest"],
    github: "https://github.com/sudhanshu-1999/visual-product-search",
    accent: "cyan",
  },
  {
    slug: "salesforce-ai",
    index: "05",
    title: "Enterprise AI Integrations",
    kicker: "Production Salesforce engineering at CloudMetic",
    year: "2022 – present",
    category: "Enterprise",
    summary:
      "Production services and UI modules across services, healthcare, finance and education platforms — and the R&D that brought LLM document extraction and retrieval into them.",
    problem:
      "Enterprise platforms have strict limits (timeouts, governor limits, permissions). AI features have to fit inside them reliably, securely and traceably.",
    architecture: ["Platform event", "Queueable job", "FastAPI inference", "Retrieval layer", "Signed REST callback", "Record update"],
    implementation: [
      "R&D for the enterprise + LLM integration initiative: AI-assisted document extraction and query-driven retrieval taken from prototype to a working internal service.",
      "Asynchronous pipeline — platform-event triggers, queueable jobs, a FastAPI inference service and signed REST callbacks — removing synchronous timeout failures on large documents.",
      "Retrieval with Docling parsing, custom chunking, sentence-transformer embeddings and ChromaDB / FAISS, replacing whole-document prompts with top-k relevance-filtered chunks.",
      "Apex, LWC and Flows delivered from design through sandbox-to-production release; standardised validation, exception handling, structured logging and role-based access.",
    ],
    challenges: [
      "Bounded retries and failure isolation so one bad document does not stall the queue.",
      "Idempotent callback handling to prevent duplicate writes under at-least-once delivery.",
    ],
    stack: ["Apex", "Lightning Web Components", "Flows", "Salesforce APIs", "Java", "Python", "FastAPI", "ChromaDB", "FAISS"],
    accent: "violet",
  },
  {
    slug: "voyager-tracker",
    index: "06",
    title: "Voyager Live Tracker",
    kicker: "Real-time 3D tracker for Voyager 1 and 2, on NASA data",
    year: "2026",
    category: "Full-Stack",
    summary:
      "A NASA-documentary-style web app: real distance and light-time to Voyager 1 and 2 from JPL Horizons, interactive 3D views of the spacecraft, Earth and solar system, live Deep Space Network contact, and a signal simulation that sends a message at the true speed of light.",
    problem:
      "Public data about the Voyagers is scattered across NASA services with different formats, rate limits and browser restrictions. The goal was one fast, honest page: real numbers, clearly sourced, that keeps working when a source is slow or down.",
    architecture: [
      "JPL Horizons",
      "Ephemeris loader",
      "Hermite interpolation",
      "Sim clock store",
      "React Three Fiber scenes",
      "HUD + share links",
    ],
    implementation: [
      "Ephemerides from JPL Horizons with bounded concurrency and retry-with-backoff (Horizons rejects bursts), hourly samples interpolated with Hermite splines, and an offline orbit model that takes over per body when Horizons fails.",
      "A simulation clock held as an anchor plus speed rather than written every frame, so every time-dependent view works at any playback speed, including jumps to historical mission events.",
      "Three self-contained React Three Fiber views (spacecraft, solar system, Earth) with floating-origin scaling to keep precision at astronomical distances; real NASA 3D models compressed with Draco and loaded lazily.",
      "Live Deep Space Network contacts parsed from NASA's DSN Now feed; active-satellite orbits from CelesTrak propagated with SGP4 inside a Web Worker.",
      "Shareable deep links that restore the view and moment, a Q&A panel that answers with live figures, and a sources page crediting every dataset.",
      "Deployed on Vercel: Next.js server routes proxy JPL Horizons, NASA DSN Now and CelesTrak behind CDN caching, and every push to main redeploys automatically.",
    ],
    challenges: [
      "Sources that cannot be called from a browser — JPL Horizons blocks cross-origin requests, so a server route fetches it and the CDN shares one cached copy, with the offline orbit model as a fallback.",
      "Respecting upstream limits — shared CDN caching so NASA sees at most one request per interval however many people watch, and cache-aware fallbacks when CelesTrak rate-limits.",
      "Keeping a heavy 3D app fast — lazy-loaded assets, compressed models and long-lived caching for static data.",
    ],
    stack: ["Next.js", "TypeScript", "React Three Fiber", "Three.js", "Zustand", "satellite.js", "Web Workers", "Tailwind CSS", "Vercel"],
    demo: "https://voyager-live-tracker.vercel.app",
    codeNote: "source code is private",
    accent: "blue",
  },
];

export type ArchNode = { id: string; label: string; detail: string; x: number; y: number };
export type ArchDiagram = {
  id: string;
  label: string;
  summary: string;
  nodes: ArchNode[];
  edges: [string, string][];
};

// Coordinates on a 1000 x 420 canvas.
export const diagrams: ArchDiagram[] = [
  {
    id: "rag",
    label: "RAG Pipeline",
    summary: "Answers grounded in retrieved evidence, with citations and an explicit refusal path.",
    nodes: [
      { id: "q", label: "User query", x: 80, y: 210, detail: "The question arrives with the caller's identity so retrieval can be filtered to their tenant." },
      { id: "rw", label: "Query rewrite", x: 225, y: 210, detail: "Optional rewrite / expansion so short or ambiguous questions retrieve well." },
      { id: "bm", label: "BM25", x: 385, y: 120, detail: "Sparse keyword retrieval — catches exact terms, IDs and names that embeddings blur." },
      { id: "dn", label: "Dense vectors", x: 385, y: 300, detail: "Embedding similarity search (HNSW / IVF) for meaning-level matches." },
      { id: "rrf", label: "RRF fusion", x: 545, y: 210, detail: "Reciprocal Rank Fusion merges both result lists without tuning score scales." },
      { id: "rr", label: "Re-rank", x: 705, y: 210, detail: "A cross-encoder / ranking API reorders the short list; low-relevance chunks are thresholded out." },
      { id: "llm", label: "LLM + context", x: 880, y: 140, detail: "Token-budgeted context, structured output, streaming. Refuses when evidence is missing." },
      { id: "cite", label: "Cited answer", x: 880, y: 290, detail: "Every claim points back to its source chunk, so users can verify it." },
    ],
    edges: [["q", "rw"], ["rw", "bm"], ["rw", "dn"], ["bm", "rrf"], ["dn", "rrf"], ["rrf", "rr"], ["rr", "llm"], ["llm", "cite"]],
  },
  {
    id: "agent",
    label: "Agent Workflow",
    summary: "A typed state graph: plan, call tools, observe, checkpoint — and pause for a human when it matters.",
    nodes: [
      { id: "in", label: "Task", x: 70, y: 210, detail: "Input enters a typed state object with reducers, not a free-form chat log." },
      { id: "pl", label: "Planner", x: 230, y: 210, detail: "Decides the next step (ReAct or plan-and-execute) via conditional routing." },
      { id: "tl", label: "Tool call", x: 420, y: 110, detail: "Schema-validated tool I/O (Pydantic / JSON Schema), least-privilege credentials." },
      { id: "mcp", label: "MCP servers", x: 600, y: 110, detail: "Tools and retrieval exposed over the Model Context Protocol." },
      { id: "ob", label: "Observe", x: 510, y: 250, detail: "Results are validated and written back into state; errors become data, not crashes." },
      { id: "ck", label: "Checkpoint", x: 690, y: 320, detail: "Durable state after every step, so long runs resume after failure instead of restarting." },
      { id: "hitl", label: "Human review", x: 760, y: 200, detail: "interrupt() pauses the graph for approval on risky actions." },
      { id: "out", label: "Result", x: 920, y: 210, detail: "Final answer plus the trajectory, which is what evaluation scores." },
    ],
    edges: [["in", "pl"], ["pl", "tl"], ["tl", "mcp"], ["mcp", "ob"], ["ob", "pl"], ["ob", "ck"], ["ck", "hitl"], ["hitl", "out"]],
  },
  {
    id: "llmapp",
    label: "LLM Application",
    summary: "The production shell around a model: guardrails, routing, caching, budgets and evaluation.",
    nodes: [
      { id: "cl", label: "Client", x: 70, y: 210, detail: "Web UI, chat or another agent (A2A)." },
      { id: "gw", label: "API + auth", x: 220, y: 210, detail: "Identity, tenant mapping and per-request audit logging." },
      { id: "gin", label: "Input rails", x: 370, y: 120, detail: "PII redaction, prompt-injection containment, policy checks before the model sees anything." },
      { id: "cache", label: "Cache", x: 370, y: 300, detail: "Answer cache and provider context caching cut repeat cost and latency." },
      { id: "rt", label: "Model router", x: 540, y: 210, detail: "Complexity-based routing (small / medium / large) behind a monthly budget breaker." },
      { id: "m", label: "LLM", x: 690, y: 210, detail: "Prompt-versioned calls with structured output." },
      { id: "gout", label: "Output rails", x: 830, y: 120, detail: "Groundedness and schema checks before anything reaches the user." },
      { id: "ev", label: "Eval + metrics", x: 830, y: 300, detail: "Golden sets, LLM-as-a-judge, CI regression gates, usage tracking." },
    ],
    edges: [["cl", "gw"], ["gw", "gin"], ["gw", "cache"], ["gin", "rt"], ["cache", "rt"], ["rt", "m"], ["m", "gout"], ["m", "ev"]],
  },
  {
    id: "ingest",
    label: "Document Ingestion",
    summary: "Event-driven and failure-tolerant: no document is silently lost or indexed twice.",
    nodes: [
      { id: "up", label: "Upload", x: 70, y: 210, detail: "Files land in object storage, tagged with tenant metadata." },
      { id: "ps", label: "Pub/Sub event", x: 220, y: 210, detail: "Storage events fan out to workers — decoupled and scalable." },
      { id: "wk", label: "Worker", x: 370, y: 210, detail: "Pulls jobs, with exponential-backoff retries on transient errors." },
      { id: "dlq", label: "Dead-letter", x: 370, y: 350, detail: "Poison documents are parked for inspection instead of blocking the queue." },
      { id: "pa", label: "Parse", x: 520, y: 120, detail: "Document AI / Docling turn PDFs and Office files into structured text." },
      { id: "ch", label: "Chunk", x: 690, y: 120, detail: "Structure-aware chunking sized for retrieval, not for the context window." },
      { id: "em", label: "Embed", x: 800, y: 260, detail: "Embedding model turns each chunk into a vector." },
      { id: "ix", label: "Index", x: 925, y: 210, detail: "Vector index plus keyword index, updated incrementally on re-ingest." },
    ],
    edges: [["up", "ps"], ["ps", "wk"], ["wk", "dlq"], ["wk", "pa"], ["pa", "ch"], ["ch", "em"], ["em", "ix"]],
  },
  {
    id: "async",
    label: "Async AI API",
    summary: "Submit → poll → retrieve, so slow models never cause timeouts or duplicate writes.",
    nodes: [
      { id: "sys", label: "Calling system", x: 80, y: 210, detail: "An enterprise platform with hard callout timeouts." },
      { id: "sub", label: "POST /submit", x: 250, y: 210, detail: "Validates input and returns 202 + job id immediately." },
      { id: "idem", label: "Idempotency", x: 250, y: 340, detail: "Key = record + task + content hash. A duplicate returns the existing job." },
      { id: "q", label: "Job queue", x: 430, y: 210, detail: "Per-job isolation: one bad document cannot stall the rest." },
      { id: "inf", label: "Inference", x: 600, y: 120, detail: "Model call with bounded retries, backoff and jitter on retryable errors only." },
      { id: "poll", label: "GET /jobs/{id}", x: 600, y: 310, detail: "Status polling: queued / processing / succeeded / failed." },
      { id: "cb", label: "Signed callback", x: 790, y: 120, detail: "Result pushed back to an allow-listed host with a verified token." },
      { id: "rec", label: "Record update", x: 920, y: 240, detail: "Idempotent write on the receiving side — safe under at-least-once delivery." },
    ],
    edges: [["sys", "sub"], ["sub", "idem"], ["sub", "q"], ["q", "inf"], ["q", "poll"], ["inf", "cb"], ["cb", "rec"], ["poll", "rec"]],
  },
];

export const experience = [
  {
    kind: "work" as const,
    title: "Software Engineer",
    org: "CloudMetic",
    period: "Nov 2022 – Present",
    place: "India",
    points: [
      "Full-stack and applied AI engineering across services, healthcare, finance and education platforms.",
      "R&D for the enterprise + LLM integration initiative — document extraction and retrieval taken from prototype to a working internal service.",
      "Designed an asynchronous AI pipeline (submit → poll → retrieve) with retries, failure isolation and idempotent callbacks.",
      "Owned Apex, LWC and Flow delivery from design through production release.",
    ],
    honours: ["Best Employee of the Year", "Young Talent of the Year"],
  },
  {
    kind: "edu" as const,
    title: "Advanced AI & Deep Learning Programme",
    org: "IIT Delhi",
    period: "Completed",
    place: "",
    points: ["LLMs, RAG, LangGraph, AI agents, NLP, computer vision, transformers, CNNs / RNNs / LSTMs, GANs.", "Capstone: real-time fall detection with YOLOv8."],
    honours: [],
  },
  {
    kind: "edu" as const,
    title: "GenAI Engineering: Build, Scale & Deploy AI Systems",
    org: "Professional programme",
    period: "2026",
    place: "",
    points: ["16 modules: agent architectures, memory systems, multi-agent orchestration, tool use & MCP, RAG, guardrails, LLMOps."],
    honours: [],
  },
  {
    kind: "edu" as const,
    title: "B.Tech, Electrical & Electronics Engineering",
    org: "ABES Engineering College",
    period: "2017 – 2021",
    place: "India",
    points: [],
    honours: [],
  },
];

export const certifications = [
  { name: "Claude Certified Architect – Foundations", issuer: "Anthropic", year: "2026" },
  { name: "Introduction to Model Context Protocol", issuer: "Anthropic", year: "2026" },
  { name: "Introduction to Agent Skills", issuer: "Anthropic", year: "2026" },
  { name: "Claude Code in Action", issuer: "Anthropic", year: "2025" },
  { name: "Data 360 Consultant", issuer: "Salesforce", year: "2025" },
  { name: "Platform Developer", issuer: "Salesforce", year: "2024" },
  { name: "Platform Foundations", issuer: "Salesforce", year: "2023" },
];

export const exploring = [
  { code: "R-01", title: "Advanced Agentic Systems", note: "Long-running agents that recover from failure: durable state, checkpoint-resume, human-in-the-loop.", status: "active" },
  { code: "R-02", title: "Multi-Agent Architecture", note: "Supervisor, swarm and hierarchical topologies; agent-to-agent protocols like A2A.", status: "active" },
  { code: "R-03", title: "AI Evaluation & Observability", note: "Trajectory and tool-call evals, pass@k, golden sets and CI gates that block regressions.", status: "active" },
  { code: "R-04", title: "LLM Guardrails", note: "Input, output and execution rails; prompt-injection containment at integration boundaries.", status: "reading" },
  { code: "R-05", title: "Context Engineering", note: "What goes into the window, in what order, and what gets cached, compacted or retrieved instead.", status: "active" },
  { code: "R-06", title: "Production RAG Systems", note: "Hybrid search, re-ranking, GraphRAG and incremental re-indexing at tenant scale.", status: "shipping" },
  { code: "R-07", title: "AI Product Engineering", note: "Turning model capability into products people trust: UX for uncertainty, cost and latency budgets.", status: "reading" },
];
