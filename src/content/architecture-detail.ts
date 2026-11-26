/**
 * Production detail for each diagram node, keyed "<diagramId>.<nodeId>".
 * Everything here is a REFERENCE PATTERN: trimmed Python that shows how the component is
 * usually built, not code taken from a specific system. Config values are typical defaults.
 */
export type NodeDetail = {
  /** Short Python snippet (reference pattern). */
  code: string;
  /** Example payload at this step, as JSON. */
  payload: string;
  /** Typical settings: [name, value]. */
  config: [string, string][];
  /** What the logs or trace print when this node fails. */
  failLog: string;
};

export const nodeDetail: Record<string, NodeDetail> = {
  // ───────────────────────────── Production Agent ─────────────────────────────
  "prod.req": {
    code: String.raw`import time, uuid
from fastapi import Request

@app.middleware("http")
async def attach_request_context(request: Request, call_next):
    request.state.request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    request.state.deadline = time.monotonic() + 60   # whole-run budget, in seconds
    response = await call_next(request)
    response.headers["x-request-id"] = request.state.request_id
    return response`,
    payload: `{
  "request_id": "req_7f3a9c",
  "tenant": "acme",
  "task": "Summarise open invoices for account 4471",
  "deadline_s": 60
}`,
    config: [
      ["Run deadline", "60 s"],
      ["Correlation header", "x-request-id"],
    ],
    failLog: `WARN  request_id=req_7f3a9c deadline_exceeded elapsed=60.2s
INFO  request_id=req_7f3a9c action=return_partial`,
  },

  "prod.auth": {
    code: String.raw`from fastapi import Depends, HTTPException, Request

async def authorize(request: Request, user: User = Depends(verify_jwt)) -> User:
    tenant = user.claims["tenant_id"]              # from the verified token, never the body
    if not await limiter.allow(f"{tenant}:{user.id}", limit=30, window=60):
        raise HTTPException(status_code=429, detail="rate limit")
    if await quota.remaining(tenant) <= 0:
        raise HTTPException(status_code=402, detail="quota exhausted")
    request.state.tenant = tenant
    return user`,
    payload: `{
  "user": "u_218",
  "tenant": "acme",
  "scopes": ["agent:run", "invoices:read"],
  "rate": "12 of 30 per minute",
  "quota_left": 4120
}`,
    config: [
      ["Rate limit", "30 requests / min / user"],
      ["Quota", "monthly tokens per tenant"],
      ["Token lifetime", "15 min"],
    ],
    failLog: `WARN  request_id=req_7f3a9c auth_rejected reason=rate_limit user=u_218 status=429
INFO  no model or tool call was made`,
  },

  "prod.gin": {
    code: String.raw`import re
from pydantic import BaseModel, Field

class AgentInput(BaseModel):
    task: str = Field(min_length=1, max_length=4000)

EMAIL = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")

def guard_input(text: str) -> str:
    text = EMAIL.sub("[email]", text)              # redact PII before any model sees it
    if injection_score(text) > 0.8:                # classifier or rules
        raise Blocked("possible prompt injection")
    return text                                    # still data, never instructions`,
    payload: `{
  "in":  "Summarise invoices for jane@example.com",
  "out": "Summarise invoices for [email]",
  "injection_score": 0.04
}`,
    config: [
      ["Max input", "4,000 characters"],
      ["Injection threshold", "0.8"],
      ["Redacted types", "email, phone, card number"],
    ],
    failLog: `WARN  request_id=req_7f3a9c guard_blocked reason=prompt_injection score=0.93
INFO  action=reject event_logged=true`,
  },

  "prod.qw": {
    code: String.raw`from arq import create_pool
from arq.connections import RedisSettings

async def enqueue(task: AgentInput, tenant: str, request_id: str) -> str:
    redis = await create_pool(RedisSettings())
    job = await redis.enqueue_job("run_agent", task.task, tenant,
                                  _job_id=request_id, _expires=300)
    return job.job_id

async def run_agent(ctx, task: str, tenant: str):
    ...   # stateless: everything it needs lives in the checkpoint store

class WorkerSettings:
    functions = [run_agent]
    max_jobs = 10        # per worker; scale by adding workers
    job_timeout = 120
    max_tries = 3`,
    payload: `{
  "job_id": "req_7f3a9c",
  "state": "queued",
  "queue_depth": 14,
  "workers": 6
}`,
    config: [
      ["Concurrency", "10 jobs / worker"],
      ["Job timeout", "120 s"],
      ["Max tries", "3"],
      ["Queued job expiry", "300 s"],
    ],
    failLog: `ERROR job=req_7f3a9c attempt=3/3 exc=TimeoutError
INFO  action=mark_failed isolated=true queue_depth=13`,
  },

  "prod.rt": {
    code: String.raw`async def route(task: str, tenant: str) -> Route:
    if hit := await semantic_cache.lookup(task, threshold=0.92):
        return Route(model=None, cached=hit)
    spent = await budget.spent(tenant)                  # month to date, USD
    if spent >= BUDGETS[tenant]:
        return Route(model=CHEAP_MODEL, degraded=True)  # or refuse, by policy
    model = LARGE_MODEL if complexity(task) > 0.6 else SMALL_MODEL
    return Route(model=model)`,
    payload: `{
  "cache": "miss",
  "complexity": 0.71,
  "model": "large",
  "budget_used_usd": 38.4,
  "budget_usd": 50
}`,
    config: [
      ["Cache similarity", "0.92"],
      ["Complexity cut-off", "0.6 (small below, large above)"],
      ["Monthly budget", "set per tenant, for example $50"],
    ],
    failLog: `WARN  router tenant=acme budget_exhausted spent=50.02 limit=50.00
INFO  action=degrade model=small`,
  },

  "prod.ag": {
    code: String.raw`from langgraph.graph import StateGraph, END

MAX_STEPS = 8

graph = StateGraph(AgentState)
graph.add_node("plan", plan)
graph.add_node("act", act)
graph.add_conditional_edges(
    "plan", lambda s: "act" if s["steps"] < MAX_STEPS and not s["done"] else END
)
graph.add_edge("act", "plan")
graph.set_entry_point("plan")
app = graph.compile(checkpointer=checkpointer)   # Postgres or Redis saver

result = await app.ainvoke(
    state, config={"configurable": {"thread_id": request_id}, "recursion_limit": 25}
)`,
    payload: `{
  "thread_id": "req_7f3a9c",
  "step": 3,
  "max_steps": 8,
  "state": { "done": false, "last_tool": "get_invoices" }
}`,
    config: [
      ["Step cap", "8 steps"],
      ["Graph recursion limit", "25"],
      ["Token budget per run", "50,000"],
      ["Run deadline", "60 s"],
    ],
    failLog: `WARN  thread=req_7f3a9c step_cap_reached steps=8
INFO  action=return_partial checkpoint=saved`,
  },

  "prod.tl": {
    code: String.raw`from typing import Literal
from pydantic import BaseModel

class GetInvoices(BaseModel):
    account_id: str
    status: Literal["open", "paid"] = "open"

TOOLS = {"get_invoices": (GetInvoices, "invoices:read")}

async def call_tool(name: str, raw_args: dict, user: User):
    schema, scope = TOOLS[name]
    args = schema.model_validate(raw_args)         # ValidationError on bad input
    if scope not in user.scopes:
        raise PermissionError(name)
    return await mcp_client.call_tool(name, args.model_dump())`,
    payload: `{
  "tool": "get_invoices",
  "args": { "account_id": "4471", "status": "open" },
  "scope": "invoices:read",
  "result_rows": 12
}`,
    config: [
      ["Tool timeout", "10 s"],
      ["Credentials", "narrowest scope per tool"],
      ["Write actions", "human approval required"],
    ],
    failLog: `WARN  tool=delete_invoice PermissionError scope=invoices:write missing
INFO  action=refuse error_returned_to_agent=true`,
  },

  "prod.oc": {
    code: String.raw`from pydantic import BaseModel, Field

class Answer(BaseModel):
    text: str
    sources: list[str] = Field(min_length=1)
    confidence: float = Field(ge=0, le=1)

def check_output(raw: str) -> Answer:
    answer = Answer.model_validate_json(raw)       # schema check
    if answer.confidence < 0.7 or not grounded(answer):
        raise NeedsHuman("low confidence or not grounded")
    return answer`,
    payload: `{
  "text": "12 open invoices totalling 48,200",
  "sources": ["inv-8812", "inv-8815"],
  "confidence": 0.91,
  "grounded": true
}`,
    config: [
      ["Confidence threshold", "0.7"],
      ["Output retries", "1"],
      ["Schema", "strict, sources required"],
    ],
    failLog: `WARN  output_check request_id=req_7f3a9c confidence=0.52 grounded=false
INFO  action=retry_once then=escalate_to_human`,
  },

  "prod.tr": {
    code: String.raw`from opentelemetry import trace

tracer = trace.get_tracer("agent")

async def traced_step(name: str, fn, **attrs):
    with tracer.start_as_current_span(name) as span:
        span.set_attributes(attrs)                  # request_id, tenant, model
        result = await fn()
        span.set_attribute("tokens", result.usage.total_tokens)
        span.set_attribute("cost_usd", result.cost)
        return result`,
    payload: `{
  "span": "act.get_invoices",
  "duration_ms": 842,
  "tokens": 1260,
  "cost_usd": 0.0071,
  "status": "ok"
}`,
    config: [
      ["Alert: p95 latency", "above 15 s"],
      ["Alert: error rate", "above 2%"],
      ["Trace retention", "30 days"],
    ],
    failLog: `ALERT p95_latency=18.4s threshold=15s span=act.get_invoices
INFO  trace=req_7f3a9c opened in the trace viewer`,
  },

  // ───────────────────────────── Reliability Loop ─────────────────────────────
  "loop.call": {
    code: String.raw`import asyncio

async def call_with_timeout(fn, *args, timeout: float = 10.0):
    try:
        return await asyncio.wait_for(fn(*args), timeout=timeout)
    except asyncio.TimeoutError:
        raise RetryableError("timeout")      # a timeout is a failure like any other`,
    payload: `{
  "call": "llm.chat",
  "timeout_s": 30,
  "elapsed_s": 30.0,
  "outcome": "timeout"
}`,
    config: [
      ["Model call timeout", "30 s"],
      ["Tool call timeout", "10 s"],
      ["Whole-run deadline", "60 s"],
    ],
    failLog: `WARN  call=llm.chat timeout elapsed=30.0s limit=30s
INFO  error_class=retryable entering=retry`,
  },

  "loop.val": {
    code: String.raw`from pydantic import ValidationError

def validate(raw: str) -> Answer:
    try:
        answer = Answer.model_validate_json(raw)
    except ValidationError as e:
        raise RetryableError(f"schema: {e.error_count()} errors")
    if answer.confidence < 0.7:
        raise LowConfidence(answer.confidence)
    return answer`,
    payload: `{
  "valid": false,
  "errors": 2,
  "confidence": null,
  "action": "retry"
}`,
    config: [
      ["Schema", "strict, sources required"],
      ["Confidence threshold", "0.7"],
      ["Invalid output", "counts as a failure, never passed on"],
    ],
    failLog: `WARN  validate schema_invalid errors=2 field=sources
INFO  action=retry attempt=1/3`,
  },

  "loop.ac": {
    code: String.raw`from opentelemetry import trace

async def accept(step: Step, result: Result) -> Result:
    span = trace.get_current_span()
    span.set_attributes({"step": step.name, "tokens": result.tokens, "cost_usd": result.cost})
    await trace_store.append(step.run_id, step, result)   # becomes eval data later
    return result`,
    payload: `{
  "run_id": "run_5521",
  "step": "act.get_invoices",
  "tokens": 1260,
  "kept_for_eval": true
}`,
    config: [
      ["Trace retention", "30 days"],
      ["Sampled into eval set", "10% of runs"],
      ["PII redaction before storage", "on"],
    ],
    failLog: `WARN  trace_store write_failed run=run_5521 err=ConnectionError
ALERT trace_gap_rate=3.1% threshold=1%`,
  },

  "loop.rt": {
    code: String.raw`from tenacity import (
    AsyncRetrying, retry_if_exception_type, stop_after_attempt, wait_exponential_jitter,
)

async def with_retry(fn):
    async for attempt in AsyncRetrying(
        retry=retry_if_exception_type(RetryableError),    # permanent errors are not retried
        stop=stop_after_attempt(3),
        wait=wait_exponential_jitter(initial=0.5, max=8),
        reraise=True,
    ):
        with attempt:
            return await fn()`,
    payload: `{
  "attempt": 2,
  "of": 3,
  "wait_s": 1.3,
  "error": "RetryableError: timeout"
}`,
    config: [
      ["Attempts", "3"],
      ["Backoff", "0.5 s doubling, max 8 s, with jitter"],
      ["Retried errors", "timeouts, 429, 5xx"],
    ],
    failLog: `WARN  retry attempt=3/3 err=RetryableError wait=4.1s
INFO  retries_exhausted action=breaker_check`,
  },

  "loop.br": {
    code: String.raw`import time

class CircuitBreaker:
    def __init__(self, max_failures: int = 5, reset_after: float = 30.0):
        self.max_failures, self.reset_after = max_failures, reset_after
        self.failures, self.opened_at = 0, None

    def allow(self) -> bool:
        if self.opened_at is None:
            return True
        return time.monotonic() - self.opened_at >= self.reset_after   # half-open probe

    def record(self, ok: bool) -> None:
        if ok:
            self.failures, self.opened_at = 0, None
        else:
            self.failures += 1
            if self.failures >= self.max_failures:
                self.opened_at = time.monotonic()`,
    payload: `{
  "dependency": "invoice-api",
  "state": "open",
  "failures": 5,
  "probe_in_s": 22
}`,
    config: [
      ["Failures to open", "5 in a row"],
      ["Open duration", "30 s, then one probe call"],
      ["While open", "fail fast to the fallback"],
    ],
    failLog: `ERROR breaker dependency=invoice-api state=open failures=5
INFO  calls_fail_fast=true route=fallback`,
  },

  "loop.fb": {
    code: String.raw`async def with_fallback(primary, request):
    if not breaker.allow():
        return await degrade(request)
    try:
        result = await with_retry(lambda: primary(request))
        breaker.record(True)
        return result
    except RetryableError:
        breaker.record(False)
        return await degrade(request)

async def degrade(request):
    if cached := await cache.get(request.key):
        return Result(text=cached, degraded=True)
    return Result(text="I couldn't complete this right now.", degraded=True)`,
    payload: `{
  "degraded": true,
  "source": "cache",
  "age_s": 540,
  "note": "Showing the last known result (9 min old)."
}`,
    config: [
      ["Cache max age", "15 min"],
      ["Degraded flag", "always set, always shown to the user"],
      ["Last resort", "a clear 'could not complete'"],
    ],
    failLog: `WARN  fallback used=cache age=540s request=req_7f3a9c
INFO  response flagged degraded=true`,
  },

  "loop.es": {
    code: String.raw`from langgraph.types import interrupt

def approval_gate(state: AgentState):
    decision = interrupt({
        "question": "Approve this action?",
        "action": state["pending_action"],
        "trace_id": state["trace_id"],
    })
    return {"approved": bool(decision)}      # resumes here with Command(resume=True or False)`,
    payload: `{
  "question": "Approve this action?",
  "action": "refund 120.00 on order 8812",
  "status": "waiting",
  "waiting_s": 340
}`,
    config: [
      ["Needs a checkpointer", "yes, plus a thread id"],
      ["Approval timeout", "24 h, then cancel the action"],
      ["Who can approve", "role-based"],
    ],
    failLog: `WARN  escalation approval_timeout waited=24h action=cancel
INFO  run=req_7f3a9c state=cancelled side_effects=none`,
  },

  "loop.sh": {
    code: String.raw`import asyncio

async def handle(request):
    live = await run_agent(request, version=LIVE)
    asyncio.create_task(shadow(request, live))      # the user path never waits for this
    return live

async def shadow(request, live):
    try:
        candidate = await asyncio.wait_for(
            run_agent(request, version=CANDIDATE, side_effects=False), timeout=60
        )
        await compare_store.add(request.id, live, candidate)
    except Exception:
        log.exception("shadow run failed")          # must never affect the user`,
    payload: `{
  "request": "req_7f3a9c",
  "live": { "cost_usd": 0.011, "latency_s": 4.2 },
  "candidate": { "cost_usd": 0.008, "latency_s": 3.1 },
  "agree": true
}`,
    config: [
      ["Traffic mirrored", "10%"],
      ["Candidate side effects", "disabled"],
      ["Shadow timeout", "60 s"],
    ],
    failLog: `WARN  shadow run_failed candidate=v7 err=TimeoutError
INFO  user_response_unaffected=true`,
  },

  "loop.ev": {
    code: String.raw`import pytest

THRESHOLDS = {"task_success": 0.90, "groundedness": 0.95}

@pytest.mark.parametrize("metric", THRESHOLDS)
def test_candidate_meets_bar(metric, results):
    floor = max(THRESHOLDS[metric], results.live[metric] - 0.01)   # may not regress by more than 1 point
    assert results.candidate[metric] >= floor`,
    payload: `{
  "golden_cases": 120,
  "task_success": { "live": 0.93, "candidate": 0.89 },
  "gate": "fail"
}`,
    config: [
      ["Golden set", "100+ cases plus sampled real traces"],
      ["Task success", "at least 0.90"],
      ["Groundedness", "at least 0.95"],
      ["Regression vs live", "at most 1 point"],
    ],
    failLog: `ERROR eval_gate FAILED metric=task_success candidate=0.89 required=0.92
INFO  release=blocked ci_status=red`,
  },

  "loop.rl": {
    code: String.raw`import hashlib

ROLLOUT = {"percent": 5}          # 5, 25, 50, 100: read from config, not code

def use_candidate(user_id: str) -> bool:
    bucket = int(hashlib.sha256(user_id.encode()).hexdigest(), 16) % 100
    return bucket < ROLLOUT["percent"]       # a given user always gets the same version`,
    payload: `{
  "candidate": "v7",
  "percent": 5,
  "error_rate": 0.011,
  "p95_s": 4.4,
  "baseline_error_rate": 0.010
}`,
    config: [
      ["Stages", "5%, 25%, 50%, 100%"],
      ["Auto-rollback", "error rate above 2x baseline"],
      ["Rollback", "one config switch"],
    ],
    failLog: `ALERT rollout v7 error_rate=0.031 baseline=0.010 limit=2x
INFO  action=rollback percent=0`,
  },

  // ───────────────────────────── Agent Workflow ─────────────────────────────
  "agent.in": {
    code: String.raw`from operator import add
from typing import Annotated, TypedDict

class AgentState(TypedDict):
    task: str
    steps: int
    messages: Annotated[list, add]      # reducer: append, never overwrite
    done: bool

def start(raw: AgentInput) -> AgentState:
    return {"task": raw.task, "steps": 0, "messages": [], "done": False}`,
    payload: `{
  "task": "Summarise open invoices for account 4471",
  "steps": 0,
  "messages": [],
  "done": false
}`,
    config: [
      ["Max input", "4,000 characters"],
      ["State", "typed and JSON-serialisable"],
      ["Reducers", "append for messages, overwrite for the rest"],
    ],
    failLog: `WARN  input_rejected reason=too_long chars=9120 limit=4000
INFO  no model or tool cost was spent`,
  },

  "agent.pl": {
    code: String.raw`async def plan(state: AgentState) -> dict:
    decision = await llm.with_structured_output(NextStep).ainvoke(state["messages"])
    return {
        "steps": state["steps"] + 1,
        "next": decision,
        "done": decision.kind == "finish",
    }`,
    payload: `{
  "step": 2,
  "decision": { "kind": "tool", "name": "get_invoices", "args": { "account_id": "4471" } },
  "tokens_used": 3100,
  "budget": 50000
}`,
    config: [
      ["Step cap", "8 steps"],
      ["Token budget", "50,000 per run"],
      ["Graph recursion limit", "25"],
    ],
    failLog: `WARN  plan step_cap_reached steps=8
INFO  action=return_partial`,
  },

  "agent.gd": {
    code: String.raw`import asyncio

async def guarded_call(name: str, args: dict):
    if not breakers[name].allow():
        raise BreakerOpen(name)                    # routed to the fallback
    try:
        result = await asyncio.wait_for(call_tool(name, args), timeout=10)
        breakers[name].record(True)
        return result
    except (asyncio.TimeoutError, ConnectionError):
        breakers[name].record(False)
        raise`,
    payload: `{
  "tool": "get_invoices",
  "breaker": "closed",
  "attempt": 1,
  "timeout_s": 10,
  "outcome": "ok"
}`,
    config: [
      ["Tool timeout", "10 s"],
      ["Retries", "2, retryable errors only"],
      ["Breaker", "opens after 5 failures, 30 s"],
    ],
    failLog: `ERROR guard tool=get_invoices breaker=open failures=5
INFO  action=route_to_fallback`,
  },

  "agent.tl": {
    code: String.raw`from mcp import ClientSession

async def run_tool(session: ClientSession, name: str, args: dict):
    result = await session.call_tool(name, arguments=args)
    if result.isError:
        raise ToolError(name, result.content)
    return result.content`,
    payload: `{
  "server": "invoices-mcp",
  "tool": "get_invoices",
  "arguments": { "account_id": "4471", "status": "open" },
  "isError": false
}`,
    config: [
      ["Transport", "stdio or streamable HTTP"],
      ["Credentials", "per server, least privilege"],
      ["Arguments", "schema-validated before the call"],
    ],
    failLog: `WARN  tool=get_invoices isError=true content="account not found"
INFO  returned to the planner as an observation`,
  },

  "agent.ob": {
    code: String.raw`def observe(state: AgentState, tool_result: ToolResult) -> dict:
    content = tool_result.content[:4000]
    if tool_result.is_error:
        content = f"ERROR: {tool_result.content[:500]}"    # data the planner can reason about
    return {"messages": [{"role": "tool", "name": tool_result.name, "content": content}]}`,
    payload: `{
  "role": "tool",
  "name": "get_invoices",
  "content": "12 rows: ...",
  "truncated": true
}`,
    config: [
      ["Tool output cap", "4,000 characters"],
      ["Error text cap", "500 characters"],
      ["Trace", "every step, with latency and cost"],
    ],
    failLog: `WARN  observe tool_output_truncated chars=18200 kept=4000
INFO  planner receives the error as a message`,
  },

  "agent.ck": {
    code: String.raw`from langgraph.checkpoint.postgres import PostgresSaver

with PostgresSaver.from_conn_string(DB_URL) as checkpointer:
    checkpointer.setup()                                   # creates tables once
    app = graph.compile(checkpointer=checkpointer)
    app.invoke(state, {"configurable": {"thread_id": run_id}})   # resumes if the thread exists`,
    payload: `{
  "thread_id": "run_5521",
  "checkpoint": "step-4",
  "saved": true,
  "size_kb": 12
}`,
    config: [
      ["Write", "after every step"],
      ["Store", "Postgres or Redis"],
      ["Retention", "7 days"],
    ],
    failLog: `ERROR checkpoint write_failed thread=run_5521 err=OperationalError
INFO  action=retry_write then=stop_run, nothing lost beyond the current step`,
  },

  "agent.hitl": {
    code: String.raw`from langgraph.graph import END
from langgraph.types import Command, interrupt

def human_review(state: AgentState):
    if state["risk"] != "high" and state["confidence"] >= 0.7:
        return {}                                          # no pause needed
    approved = interrupt({"action": state["pending_action"], "why": state["risk_reason"]})
    if not approved:
        return Command(goto=END)
    return {}`,
    payload: `{
  "risk": "high",
  "action": "issue refund",
  "why": "amount over limit",
  "status": "waiting_for_approval"
}`,
    config: [
      ["Pause when", "write action, high risk, or confidence below 0.7"],
      ["Approval timeout", "24 h"],
      ["Needs", "a checkpointer and a thread id"],
    ],
    failLog: `WARN  human_review no_response waited=24h
INFO  run=cancelled action_taken=none`,
  },

  "agent.out": {
    code: String.raw`def finalise(state: AgentState) -> Result:
    return Result(
        answer=state.get("answer"),
        partial=not state["done"],
        steps=state["steps"],
        trace_id=current_trace_id(),         # the full trajectory is what evaluation scores
    )`,
    payload: `{
  "answer": "12 open invoices totalling 48,200",
  "partial": false,
  "steps": 4,
  "trace_id": "tr_91ab"
}`,
    config: [
      ["Result fields", "answer, partial flag, trace id"],
      ["Trajectory kept", "30 days"],
      ["Partial results", "always flagged"],
    ],
    failLog: `WARN  finalise partial=true reason=step_cap steps=8
INFO  user told the answer is incomplete`,
  },

  "agent.fb": {
    code: String.raw`async def fallback(state: AgentState, error: Exception) -> dict:
    cached = await cache.get(state["task"])
    content = cached or "tool unavailable"
    return {
        "messages": [{"role": "tool", "name": "fallback", "content": content}],
        "degraded": True,
    }`,
    payload: `{
  "source": "cache",
  "degraded": true,
  "content": "12 open invoices (cached 9 min ago)"
}`,
    config: [
      ["Cache max age", "15 min"],
      ["Fallback tool", "read-only variant where one exists"],
      ["Degraded flag", "always set"],
    ],
    failLog: `WARN  fallback used=cache age=540s
INFO  observation marked degraded=true`,
  },

  // ───────────────────────────── LLM Application ─────────────────────────────
  "llmapp.cl": {
    code: String.raw`import uuid
import httpx

async def ask(question: str) -> dict:
    key = str(uuid.uuid4())              # reused on retry, so a retry cannot double-run
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(URL, json={"q": question}, headers={"Idempotency-Key": key})
        r.raise_for_status()
        return r.json()`,
    payload: `{
  "q": "What is our refund policy?",
  "headers": { "Idempotency-Key": "3f2a9b1c" }
}`,
    config: [
      ["Client timeout", "30 s"],
      ["Retries", "2, same idempotency key"],
      ["Streaming", "on for chat interfaces"],
    ],
    failLog: `WARN  client timeout after=30s retry=1/2 key=3f2a9b1c
INFO  server returns the existing result if the first call finished`,
  },

  "llmapp.gw": {
    code: String.raw`from fastapi import Depends, Header

@app.post("/ask")
async def ask(body: AskBody, user: User = Depends(authorize),
              idem: str = Header(alias="Idempotency-Key")):
    if cached := await idempotency.get(user.tenant, idem):
        return cached
    audit.log("ask", tenant=user.tenant, user=user.id, key=idem)
    ...`,
    payload: `{
  "tenant": "acme",
  "user": "u_218",
  "rate": "4 of 30 per minute",
  "audit_id": "aud_7731"
}`,
    config: [
      ["Rate limit", "30 requests / min / user"],
      ["Auth", "JWT, verified on the server"],
      ["Audit log", "every request, tenant-tagged"],
    ],
    failLog: `WARN  gateway rejected status=401 reason=expired_token
INFO  no model call was made`,
  },

  "llmapp.gin": {
    code: String.raw`import re

RULES = [r"ignore (all )?previous instructions", r"reveal (the )?system prompt"]

def input_rails(text: str) -> str:
    text = redact_pii(text)
    if any(re.search(rule, text, re.I) for rule in RULES) or injection_model(text) > 0.8:
        raise Blocked("policy")
    return text`,
    payload: `{
  "flags": ["email"],
  "injection_score": 0.03,
  "decision": "allow"
}`,
    config: [
      ["Injection threshold", "0.8"],
      ["Redacted types", "email, phone, card number"],
      ["On block", "reject and log"],
    ],
    failLog: `WARN  input_rails blocked reason=policy score=0.91
INFO  event logged for review`,
  },

  "llmapp.cache": {
    code: String.raw`import hashlib

async def cached_answer(prompt: str, tenant: str):
    key = f"{tenant}:{hashlib.sha256(prompt.encode()).hexdigest()}"
    try:
        return await redis.get(key)
    except RedisError:
        return None                    # a cache outage is a miss, never an error`,
    payload: `{
  "key": "acme:9c1f2e",
  "hit": false,
  "ttl_s": 3600
}`,
    config: [
      ["TTL", "1 h"],
      ["Scope", "per tenant"],
      ["Provider context caching", "on for long prompts"],
    ],
    failLog: `WARN  cache redis_unavailable err=ConnectionError
INFO  treated as a miss, request continues`,
  },

  "llmapp.rt": {
    code: String.raw`def choose_model(prompt: str, spent: float, budget: float) -> str:
    if spent >= budget:
        return "small-model"          # budget breaker: cheaper model, or refuse by policy
    return "large-model" if complexity(prompt) > 0.6 else "small-model"`,
    payload: `{
  "complexity": 0.42,
  "model": "small-model",
  "spent_usd": 41.2,
  "budget_usd": 50
}`,
    config: [
      ["Monthly budget", "set per tenant"],
      ["Complexity cut-off", "0.6"],
      ["Routing decision", "logged on every request"],
    ],
    failLog: `WARN  router budget_breaker_open spent=50.01 budget=50
INFO  routing=small-model for all requests`,
  },

  "llmapp.m": {
    code: String.raw`from tenacity import AsyncRetrying, stop_after_attempt, wait_exponential_jitter

async def generate(messages: list[dict]) -> Answer:
    async for attempt in AsyncRetrying(
        stop=stop_after_attempt(3),
        wait=wait_exponential_jitter(initial=0.5, max=8),
        reraise=True,
    ):
        with attempt:
            reply = await client.chat(model=MODEL, messages=messages, timeout=30)
            return Answer.model_validate_json(reply.text)`,
    payload: `{
  "model": "large-model",
  "prompt_version": "v12",
  "tokens": { "in": 1840, "out": 320 },
  "latency_ms": 3100
}`,
    config: [
      ["Timeout", "30 s"],
      ["Retries", "3, with jitter"],
      ["Prompt", "versioned, pinned per release"],
      ["Output", "structured, schema-validated"],
    ],
    failLog: `WARN  llm provider_error status=529 attempt=3/3
INFO  action=fallback_model`,
  },

  "llmapp.fbk": {
    code: String.raw`import asyncio

async def generate_with_fallback(messages):
    try:
        return await generate(messages, model=PRIMARY)
    except (ProviderError, asyncio.TimeoutError):
        metrics.incr("llm.fallback")             # degradation must be visible
        return await generate(messages, model=FALLBACK, timeout=20)`,
    payload: `{
  "primary": "error 529",
  "fallback_model": "backup-small",
  "latency_ms": 1900,
  "degraded": true
}`,
    config: [
      ["Fallback", "second provider or a smaller model"],
      ["Fallback timeout", "20 s"],
      ["Alert", "fallback share above 5%"],
    ],
    failLog: `WARN  fallback model=backup-small primary_error=529
ALERT fallback_rate=7.2% threshold=5%`,
  },

  "llmapp.gout": {
    code: String.raw`REFUSAL = "I can't answer that from the sources I have."

async def respond(messages, context):
    for _ in range(2):                            # one retry
        answer = await generate(messages)
        if answer.sources and supported_by(answer.text, context):
            return answer
    return Answer(text=REFUSAL, sources=[], confidence=0.0)`,
    payload: `{
  "grounded": false,
  "attempt": 2,
  "decision": "refuse",
  "text": "I can't answer that from the sources I have."
}`,
    config: [
      ["Retries", "1"],
      ["Refusal", "fixed, safe message"],
      ["Schema", "strict, sources required"],
    ],
    failLog: `WARN  output_rails ungrounded attempt=2/2
INFO  action=refuse_safely`,
  },

  "llmapp.ev": {
    code: String.raw`async def log_request(req, answer, usage):
    await metrics.record(
        tenant=req.tenant, model=usage.model, prompt_version=PROMPT_VERSION,
        tokens=usage.total, cost_usd=usage.cost, latency_ms=usage.latency_ms,
        grounded=bool(answer.sources),
    )
    if sampled(req.id, rate=0.05):
        await review_queue.add(req.id)         # judged offline by a model or a person`,
    payload: `{
  "tenant": "acme",
  "model": "large-model",
  "prompt_version": "v12",
  "cost_usd": 0.0092,
  "latency_ms": 3100,
  "sampled_for_review": false
}`,
    config: [
      ["Sampled for review", "5% of requests"],
      ["Golden set", "100+ cases"],
      ["CI gate", "blocks any regression"],
    ],
    failLog: `ERROR ci eval regression metric=groundedness 0.91 required=0.95
INFO  release=blocked`,
  },

  // ───────────────────────────── Async AI API ─────────────────────────────
  "async.sys": {
    code: String.raw`import asyncio
import httpx

async def run_job(payload: dict) -> dict:
    async with httpx.AsyncClient(timeout=5) as client:
        job = (await client.post(f"{BASE}/submit", json=payload)).json()   # 202 plus a job id
        for delay in (1, 2, 4, 8, 15, 30):
            status = (await client.get(f"{BASE}/jobs/{job['job_id']}")).json()
            if status["state"] in ("succeeded", "failed"):
                return status
            await asyncio.sleep(delay)
    raise TimeoutError("job still running; poll again later")`,
    payload: `{
  "submit": { "status": 202, "job_id": "job_8a41" },
  "poll_schedule_s": [1, 2, 4, 8, 15, 30]
}`,
    config: [
      ["Callout timeout", "5 s, well under the platform limit"],
      ["Poll backoff", "1 s up to 30 s"],
      ["Give up after", "about a minute, then resume later"],
    ],
    failLog: `WARN  caller submit_timeout after=5s
INFO  retry with the same idempotency key, no duplicate job`,
  },

  "async.sub": {
    code: String.raw`@app.post("/submit", status_code=202)
async def submit(body: SubmitBody):
    key = idempotency_key(body.record_id, body.task, body.content)
    job_id = await jobs.create_or_get(key, body)       # a duplicate returns the existing job
    return {"job_id": job_id, "status_url": f"/jobs/{job_id}"}`,
    payload: `{
  "status": 202,
  "job_id": "job_8a41",
  "status_url": "/jobs/job_8a41"
}`,
    config: [
      ["Response", "202 Accepted, well under 1 s"],
      ["Validation", "schema and size limit"],
      ["Work done here", "none: only enqueue"],
    ],
    failLog: `WARN  submit rejected status=422 reason=content_too_large
INFO  no job created`,
  },

  "async.idem": {
    code: String.raw`import hashlib

def idempotency_key(record_id: str, task: str, content: str) -> str:
    digest = hashlib.sha256(content.encode()).hexdigest()
    return f"{record_id}:{task}:{digest}"       # same input, same key, same job`,
    payload: `{
  "record_id": "a01XX",
  "task": "extract",
  "content_sha256": "4c9e1f",
  "key": "a01XX:extract:4c9e1f"
}`,
    config: [
      ["Key", "record id, task and content hash"],
      ["Key retention", "24 h"],
      ["On duplicate", "return the existing job"],
    ],
    failLog: `INFO  idempotency duplicate key=a01XX:extract:4c9e1f returned=job_8a41
INFO  no second inference run`,
  },

  "async.q": {
    code: String.raw`import asyncio

async def worker(queue):
    while True:
        job = await queue.get()
        try:
            await asyncio.wait_for(process(job), timeout=120)
        except Exception as e:
            await jobs.fail(job.id, reason=type(e).__name__)   # isolated: the next job still runs
        finally:
            queue.task_done()`,
    payload: `{
  "job_id": "job_8a41",
  "state": "processing",
  "queue_depth": 5,
  "attempt": 1
}`,
    config: [
      ["Job timeout", "120 s"],
      ["Max attempts", "3"],
      ["Workers", "scale with queue depth"],
    ],
    failLog: `ERROR job=job_8a41 failed reason=TimeoutError
INFO  other jobs unaffected queue_depth=4`,
  },

  "async.inf": {
    code: String.raw`from tenacity import (
    AsyncRetrying, retry_if_exception_type, stop_after_attempt, wait_exponential_jitter,
)

async def infer(job):
    async for attempt in AsyncRetrying(
        retry=retry_if_exception_type((TimeoutError, RateLimitError)),   # permanent errors fail fast
        stop=stop_after_attempt(3),
        wait=wait_exponential_jitter(initial=1, max=20),
        reraise=True,
    ):
        with attempt:
            return await model.extract(job.content)`,
    payload: `{
  "job_id": "job_8a41",
  "attempt": 2,
  "error": "RateLimitError",
  "wait_s": 2.4
}`,
    config: [
      ["Attempts", "3"],
      ["Backoff", "1 s up to 20 s, with jitter"],
      ["Retried errors", "timeouts and 429 only"],
    ],
    failLog: `WARN  inference attempt=3/3 err=RateLimitError
INFO  job marked failed reason=rate_limited`,
  },

  "async.poll": {
    code: String.raw`@app.get("/jobs/{job_id}")
async def get_job(job_id: str, user: User = Depends(authorize)):
    job = await jobs.get(job_id, tenant=user.tenant)       # tenant check: no IDOR
    if job is None:
        raise HTTPException(status_code=404)
    return {"state": job.state, "result": job.result if job.state == "succeeded" else None}`,
    payload: `{
  "state": "processing",
  "result": null
}`,
    config: [
      ["States", "queued, processing, succeeded, failed"],
      ["Result kept", "24 h"],
      ["Access", "scoped to the caller's tenant"],
    ],
    failLog: `WARN  poll job_not_found job=job_zzz tenant=acme
INFO  returns 404, never another tenant's job`,
  },

  "async.cb": {
    code: String.raw`import hashlib, hmac, json
from urllib.parse import urlparse

def sign(body: bytes, secret: bytes) -> str:
    return hmac.new(secret, body, hashlib.sha256).hexdigest()

async def deliver(job):
    if urlparse(job.callback_url).hostname not in ALLOWED_HOSTS:
        raise ValueError("callback host not allowed")
    body = json.dumps({"job_id": job.id, "result": job.result}).encode()
    await client.post(job.callback_url, content=body, headers={"X-Signature": sign(body, SECRET)})`,
    payload: `{
  "host": "org.example.com",
  "headers": { "X-Signature": "hmac-sha256 hex" },
  "body": { "job_id": "job_8a41", "result": "..." }
}`,
    config: [
      ["Allowed hosts", "explicit allow-list"],
      ["Signature", "HMAC-SHA256 over the body"],
      ["Delivery retries", "5, with backoff"],
    ],
    failLog: `WARN  callback delivery_failed job=job_8a41 status=503 attempt=2/5
INFO  result still available via GET /jobs/job_8a41`,
  },

  "async.rec": {
    code: String.raw`import hmac

async def apply_result(job_id: str, result: dict, signature: str, body: bytes):
    if not hmac.compare_digest(sign(body, SECRET), signature):
        raise HTTPException(status_code=401)
    await db.execute(
        "INSERT INTO results (job_id, payload) VALUES ($1, $2) ON CONFLICT (job_id) DO NOTHING",
        job_id, json.dumps(result),
    )`,
    payload: `{
  "job_id": "job_8a41",
  "rows_written": 0,
  "reason": "duplicate delivery ignored"
}`,
    config: [
      ["Write", "idempotent on job id"],
      ["Signature check", "constant-time compare"],
      ["Delivery guarantee", "at-least-once"],
    ],
    failLog: `INFO  record job=job_8a41 duplicate_delivery ignored rows_written=0
WARN  record signature_invalid status=401`,
  },
};
