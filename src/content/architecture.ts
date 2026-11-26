// Architecture diagrams for the "How I design AI systems" section. Per-node code, data and config live in architecture-detail.ts.

export type Pillar = "Reliability" | "Scalability" | "Cost" | "Observability" | "Security";
/** `fail` = what goes wrong at this node and what the design does about it. `pillar` = production concern it serves. */
export type ArchNode = { id: string; label: string; detail: string; x: number; y: number; fail?: string; pillar?: Pillar };
export type ArchDiagram = {
  id: string;
  label: string;
  summary: string;
  nodes: ArchNode[];
  edges: [string, string][];
  /** Degraded paths, drawn dashed: they carry traffic only when the primary path fails. */
  fallbackEdges?: [string, string][];
};

// Coordinates on a 1000 x 420 canvas.
export const diagrams: ArchDiagram[] = [
  {
    id: "agent",
    label: "Agent Workflow",
    summary: "A typed state graph with guarded tool calls: plan, act, observe, checkpoint — degrade to a fallback or pause for a human when it matters.",
    nodes: [
      { id: "in", label: "Task", x: 70, y: 210, detail: "Input is validated, then enters a typed state object with reducers, not a free-form chat log.", fail: "Malformed or oversized input is rejected here, before any model or tool cost is spent." },
      { id: "pl", label: "Planner", x: 225, y: 210, detail: "Decides the next step (ReAct or plan-and-execute) via conditional routing, under a step and token budget.", fail: "A looping or over-budget plan hits the step cap and ends with a partial result instead of running forever." },
      { id: "gd", label: "Guard", x: 380, y: 110, detail: "Every tool call passes a timeout, retry-with-backoff on retryable errors only, and a circuit breaker.", fail: "After repeated failures the breaker opens and the call goes to the fallback instead of retrying into an outage." },
      { id: "tl", label: "Tool call", x: 540, y: 110, detail: "Schema-validated tool I/O (Pydantic / JSON Schema) over MCP, with least-privilege credentials per tool.", fail: "A schema-invalid or unauthorised call is refused and returned to the planner as an error, not executed." },
      { id: "ob", label: "Observe", x: 700, y: 110, detail: "Results are validated and written back into state. Each step is traced with its inputs, latency and cost.", fail: "Errors become data the planner can reason about, so one bad tool result does not crash the run." },
      { id: "ck", label: "Checkpoint", x: 880, y: 110, detail: "Durable state after every step, so long runs resume after failure instead of restarting.", fail: "A crashed worker resumes from the last checkpoint; completed steps are not repeated." },
      { id: "hitl", label: "Human review", x: 880, y: 225, detail: "interrupt() pauses the graph for approval on risky actions or low-confidence answers.", fail: "No approval, no action: the run stays paused rather than guessing on a high-stakes step." },
      { id: "out", label: "Result", x: 880, y: 340, detail: "Final answer plus the full trajectory, which is what evaluation scores and what you debug from.", fail: "If the run was cut short, the result says it is partial and carries the trajectory so far." },
      { id: "fb", label: "Fallback", x: 380, y: 320, detail: "Degraded path when a tool is down: a cached result, a simpler tool, or a clear 'could not complete' for the user.", fail: "The user gets an honest degraded answer, never a hang or a fabricated success." },
    ],
    edges: [["in", "pl"], ["pl", "gd"], ["gd", "tl"], ["tl", "ob"], ["ob", "pl"], ["ob", "ck"], ["ck", "hitl"], ["hitl", "out"]],
    fallbackEdges: [["gd", "fb"], ["fb", "ob"]],
  },
  {
    id: "llmapp",
    label: "LLM Application",
    summary: "The production shell around a model: guardrails, routing, caching, budgets, a fallback model and evaluation.",
    nodes: [
      { id: "cl", label: "Client", x: 70, y: 210, detail: "Web UI, chat or another agent (A2A).", fail: "Requests carry a timeout and an idempotency key, so a client retry cannot double-run or double-bill." },
      { id: "gw", label: "API + auth", x: 220, y: 210, detail: "Identity, tenant mapping, rate limits and per-request audit logging.", fail: "Unauthenticated or over-limit callers are stopped here; no model call is made." },
      { id: "gin", label: "Input rails", x: 370, y: 120, detail: "PII redaction, prompt-injection containment, policy checks before the model sees anything.", fail: "A flagged input is blocked or sanitised, and the event is logged for review." },
      { id: "cache", label: "Cache", x: 370, y: 300, detail: "Answer cache and provider context caching cut repeat cost and latency.", fail: "A cache miss or outage simply falls through to the model; it never blocks the request." },
      { id: "rt", label: "Model router", x: 540, y: 210, detail: "Complexity-based routing (small / medium / large) behind a monthly budget breaker.", fail: "When the budget breaker trips, traffic moves to a cheaper model or a clear 'limit reached' response." },
      { id: "m", label: "LLM", x: 690, y: 210, detail: "Prompt-versioned calls with structured output, a timeout and bounded retries.", fail: "Provider errors or timeouts retry with backoff, then divert to the fallback model." },
      { id: "fbk", label: "Fallback model", x: 690, y: 70, detail: "A second provider or smaller model used when the primary is slow, down or rate-limited.", fail: "Quality may drop, but the service stays up, and the degradation is visible in metrics." },
      { id: "gout", label: "Output rails", x: 870, y: 130, detail: "Groundedness and schema checks before anything reaches the user.", fail: "An ungrounded or invalid answer is retried once, then replaced by a safe refusal." },
      { id: "ev", label: "Eval + traces", x: 870, y: 300, detail: "Per-request traces and cost, golden sets, LLM-as-a-judge and CI regression gates.", fail: "A regression on the golden set blocks the release; a prompt or model change ships only if it passes." },
    ],
    edges: [["cl", "gw"], ["gw", "gin"], ["gw", "cache"], ["gin", "rt"], ["cache", "rt"], ["rt", "m"], ["m", "gout"], ["m", "ev"]],
    fallbackEdges: [["m", "fbk"], ["fbk", "gout"]],
  },
  {
    id: "async",
    label: "Async AI API",
    summary: "Submit → poll → retrieve, so slow models never cause timeouts or duplicate writes.",
    nodes: [
      { id: "sys", label: "Calling system", x: 80, y: 210, detail: "An enterprise platform with hard callout timeouts.", fail: "If the platform's callout times out, the job id from submit is still valid, so it can poll later instead of resubmitting." },
      { id: "sub", label: "POST /submit", x: 250, y: 210, detail: "Validates input and returns 202 + job id immediately.", fail: "A duplicate submit returns the existing job instead of starting a second run." },
      { id: "idem", label: "Idempotency", x: 250, y: 340, detail: "Key = record + task + content hash. A duplicate returns the existing job.", fail: "A retry of the same record, task and content returns the existing job; it never creates a duplicate run." },
      { id: "q", label: "Job queue", x: 430, y: 210, detail: "Per-job isolation: one bad document cannot stall the rest.", fail: "One poison job is isolated and fails on its own; the other jobs in the queue keep running." },
      { id: "inf", label: "Inference", x: 600, y: 120, detail: "Model call with bounded retries, backoff and jitter on retryable errors only.", fail: "Retryable errors back off with jitter; permanent errors mark the job failed with a reason." },
      { id: "poll", label: "GET /jobs/{id}", x: 600, y: 310, detail: "Status polling: queued / processing / succeeded / failed.", fail: "A job that is still processing returns its status; the caller keeps polling instead of failing." },
      { id: "cb", label: "Signed callback", x: 790, y: 120, detail: "Result pushed back to an allow-listed host with a verified token.", fail: "If the callback cannot be delivered, the result stays retrievable through polling." },
      { id: "rec", label: "Record update", x: 920, y: 240, detail: "Idempotent write on the receiving side — safe under at-least-once delivery.", fail: "A callback delivered twice writes once, because the update is idempotent on the receiving side." },
    ],
    edges: [["sys", "sub"], ["sub", "idem"], ["sub", "q"], ["q", "inf"], ["q", "poll"], ["inf", "cb"], ["cb", "rec"], ["poll", "rec"]],
  },
  {
    id: "prod",
    label: "Production Agent",
    summary: "One request through a production agent, with each component tagged by the concern it protects: reliability, scalability, cost, observability, security.",
    nodes: [
      { id: "req", label: "Request", x: 70, y: 210, detail: "A user or system asks for a task. From here on, every step is attributable to a request id.", fail: "Each request gets an id and a deadline up front, so every later failure can be traced and bounded." },
      { id: "auth", label: "Auth + limits", x: 225, y: 210, pillar: "Security", detail: "Identity, tenant mapping, rate limits and per-user quotas, enforced on the server and never trusted from the client.", fail: "Unauthenticated or over-limit callers are rejected here, before any model or tool runs." },
      { id: "gin", label: "Input guard", x: 390, y: 110, pillar: "Security", detail: "Input validation, PII redaction and prompt-injection containment. Untrusted text is treated as data, never as instructions.", fail: "Flagged input is blocked or sanitised, and the event is logged for review." },
      { id: "qw", label: "Workers", x: 390, y: 310, pillar: "Scalability", detail: "Slow agent runs go through a queue to stateless workers, so load is smoothed and capacity scales by adding workers.", fail: "A burst waits in the queue instead of overloading the model provider; a bad job is isolated, not blocking others." },
      { id: "rt", label: "Router", x: 560, y: 210, pillar: "Cost", detail: "Semantic cache first, then complexity-based routing to a small or large model, under a per-user and monthly budget.", fail: "When the budget is spent, requests degrade to a cheaper model or a clear 'limit reached' answer, never a surprise bill." },
      { id: "ag", label: "Agent loop", x: 730, y: 210, pillar: "Reliability", detail: "Plan, act, observe, checkpoint, with a step cap, timeouts, and retry-then-fallback on every tool call.", fail: "A looping or failing run is cut off at the cap and returns a partial result or escalates, never hangs." },
      { id: "tl", label: "Tools", x: 900, y: 110, pillar: "Security", detail: "Schema-validated tools with the narrowest credentials each needs (least privilege). Risky actions require human approval.", fail: "An invalid or unauthorised call is refused and returned to the agent as an error instead of executing." },
      { id: "oc", label: "Output check", x: 900, y: 310, pillar: "Reliability", detail: "Schema and groundedness checks, plus a confidence threshold, before anything reaches the user.", fail: "A failed check is retried once, then replaced by a safe refusal or handed to a human." },
      { id: "tr", label: "Tracing", x: 730, y: 370, pillar: "Observability", detail: "Every step is traced with inputs, latency, tokens and cost. Traces feed dashboards, alerts and the evaluation set.", fail: "A slow or failing step shows up in the trace and alerts, so you debug from evidence instead of guessing." },
    ],
    edges: [["req", "auth"], ["auth", "gin"], ["auth", "qw"], ["gin", "rt"], ["qw", "rt"], ["rt", "ag"], ["ag", "tl"], ["tl", "oc"], ["ag", "oc"], ["ag", "tr"]],
  },
  {
    id: "loop",
    label: "Reliability Loop",
    summary: "What happens when a step fails (retry, break, fall back, escalate), and how a change is proven safe before release.",
    nodes: [
      { id: "call", label: "Call", x: 70, y: 210, pillar: "Reliability", detail: "Every external call runs with a timeout, so a slow dependency cannot hold the whole run.", fail: "A timeout is treated as a failure like any other and enters the retry path." },
      { id: "val", label: "Validate", x: 230, y: 210, pillar: "Reliability", detail: "Output is checked against a schema, and low-confidence results are flagged.", fail: "Invalid output is a failure, not a result: it never flows downstream." },
      { id: "ac", label: "Accept", x: 420, y: 110, pillar: "Observability", detail: "A valid result moves on, and the step is traced. Those traces become the real-traffic evaluation set.", fail: "If tracing itself fails, the run continues but the gap is alerted, so blind spots are visible." },
      { id: "rt", label: "Retry", x: 420, y: 300, pillar: "Reliability", detail: "Retryable errors retry a bounded number of times with exponential backoff and jitter. Permanent errors skip straight on.", fail: "Retries are capped so a dependency outage is not made worse by a retry storm." },
      { id: "br", label: "Breaker", x: 600, y: 300, pillar: "Reliability", detail: "After repeated failures the breaker opens and stops calling the dependency, then probes it periodically before closing.", fail: "While open, calls fail fast to the fallback instead of queueing behind a dead service." },
      { id: "fb", label: "Fallback", x: 780, y: 300, pillar: "Reliability", detail: "A degraded but honest answer: a cached result, a simpler model or tool, or a clear 'could not complete'.", fail: "The user gets a degraded answer that says so, never a fabricated success." },
      { id: "es", label: "Escalate", x: 930, y: 200, pillar: "Security", detail: "High-stakes or still-failing cases pause for a human, with the full trajectory attached.", fail: "No approval means no action: the run stays paused." },
      { id: "sh", label: "Shadow mode", x: 600, y: 110, pillar: "Observability", detail: "A new prompt or model version replays real traffic beside the live one, with no user impact, and is compared on cost, latency and quality.", fail: "A worse candidate is caught here, while it is still affecting nobody." },
      { id: "ev", label: "Eval gate", x: 780, y: 110, pillar: "Reliability", detail: "The candidate must beat or match the live version on a golden set and real traces before it can ship.", fail: "A regression fails the gate and blocks the release." },
      { id: "rl", label: "Release", x: 930, y: 110, pillar: "Scalability", detail: "Roll out to a small share of traffic first, watch the metrics, then widen. Rolling back is one switch.", fail: "A metric drop during rollout reverts traffic to the previous version." },
    ],
    edges: [["call", "val"], ["val", "ac"], ["val", "rt"], ["rt", "call"], ["rt", "br"], ["br", "fb"], ["fb", "es"], ["ac", "sh"], ["sh", "ev"], ["ev", "rl"]],
  },
];
