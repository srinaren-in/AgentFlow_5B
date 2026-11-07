import React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Cpu,
  Workflow,
  Sparkles,
  Database,
  Terminal,
  CheckCircle2,
} from 'lucide-react'

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#161616] font-sans antialiased selection:bg-[#FFBCCA] selection:text-[#212121]">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E5E5E5] px-6 py-4 transition-colors">
        <div className="max-w-[1392px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-[#FFBCCA] text-[#212121] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#FF91AC] transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xl tracking-tight text-[#161616]">
                AgentFlow
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#303030]">
              <a href="#features" className="hover:text-[#161616] transition-colors">Features</a>
              <a href="#models" className="hover:text-[#161616] transition-colors">Models</a>
              <a href="#tools" className="hover:text-[#161616] transition-colors">Tools & Memory</a>
              <a href="#observability" className="hover:text-[#161616] transition-colors">Observability</a>
              <Link to="/templates" className="hover:text-[#161616] transition-colors">Templates</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#303030] hover:text-[#161616] px-3.5 py-2 rounded-full hover:bg-[#F0F0F0] transition-colors">
              Dashboard
            </Link>
            <Link to="/editor" className="btn-primary text-xs md:text-sm">
              Start Building
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 pt-20 pb-16 max-w-[1392px] mx-auto text-center flex flex-col items-center">
        <div className="badge-token mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF91AC]" />
          Visual AI Agent Builder & Cognitive Orchestrator
        </div>

        <h1 className="hero-headline max-w-[1190px] mb-6">
          Build AI agents. Visually.
        </h1>

        <p className="text-lg md:text-[18px] leading-[28px] text-[#303030] max-w-[800px] mb-10 font-normal">
          Design, connect, and execute intelligent AI workflows through one visual workspace. Combine local Ollama models, cloud LLMs, sandboxed Python tools, and self-correcting cognitive loops.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/editor" className="btn-primary text-sm px-8 py-3.5">
            Start Building
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/templates" className="btn-secondary text-sm px-8 py-3.5">
            Explore Workflows
          </Link>
        </div>

        {/* Sophisticated Connected AI Workflow Graph Preview */}
        <div className="w-full max-w-[1240px] card-agentflow p-6 md:p-8 bg-white border border-[#E5E5E5] shadow-xl overflow-hidden relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0F0F0] text-xs font-mono text-[#8F8F8F]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-semibold text-[#161616]">LIVE CANVASTRACE: MULTI-STEP REASONING PIPELINE</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-[#F0F0F0] text-[#161616]">6 NODES CONNECTED</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFBCCA] text-[#212121] font-bold">TOPOLOGICAL DAG</span>
            </div>
          </div>

          {/* Interactive Visual Graph Nodes Representation */}
          <div className="relative w-full overflow-x-auto py-8">
            <div className="min-w-[980px] grid grid-cols-6 gap-6 items-center relative">
              {/* Connecting background SVG lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D9D9D9" />
                    <stop offset="50%" stopColor="#FF91AC" />
                    <stop offset="100%" stopColor="#D9D9D9" />
                  </linearGradient>
                </defs>
                <path d="M 140 100 C 180 100, 180 100, 220 100" stroke="#FF91AC" strokeWidth="2.5" fill="none" strokeDasharray="4 2" />
                <path d="M 360 100 C 400 100, 400 100, 440 100" stroke="#FF91AC" strokeWidth="2.5" fill="none" />
                <path d="M 580 100 C 620 100, 620 100, 660 100" stroke="#FF91AC" strokeWidth="2.5" fill="none" />
                <path d="M 800 100 C 840 100, 840 100, 880 100" stroke="#FF91AC" strokeWidth="2.5" fill="none" />
              </svg>

              {/* Node 1: Input */}
              <div className="relative z-10 bg-white rounded-[20px] p-4 border border-[#E5E5E5] shadow-sm hover:border-[#FF91AC] hover:shadow-md transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-token text-[9px]">Input</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-xs font-semibold text-[#161616]">User Query</h4>
                <p className="text-[11px] text-[#8F8F8F] font-mono mt-1 truncate">Analyze finance table</p>
                <div className="mt-3 pt-2 border-t border-[#F0F0F0] text-[9px] font-mono text-[#161616] flex justify-between">
                  <span>OUT</span>
                  <span className="text-[#FF91AC]">prompt_str</span>
                </div>
              </div>

              {/* Node 2: Memory */}
              <div className="relative z-10 bg-white rounded-[20px] p-4 border border-[#E5E5E5] shadow-sm hover:border-[#FF91AC] hover:shadow-md transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-token text-[9px]">Memory</span>
                  <Database className="w-3.5 h-3.5 text-[#8F8F8F]" />
                </div>
                <h4 className="text-xs font-semibold text-[#161616]">Session Buffer</h4>
                <p className="text-[11px] text-[#8F8F8F] font-mono mt-1 truncate">Sliding Window (K=5)</p>
                <div className="mt-3 pt-2 border-t border-[#F0F0F0] text-[9px] font-mono text-[#161616] flex justify-between">
                  <span>STATE</span>
                  <span className="text-emerald-600">Active</span>
                </div>
              </div>

              {/* Node 3: LLM Reasoning */}
              <div className="relative z-10 bg-white rounded-[20px] p-4 border-2 border-[#FF91AC] shadow-md hover:shadow-lg transition-all text-left ring-2 ring-[#FFBCCA]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-token-highlight text-[9px]">LLM Core</span>
                  <Cpu className="w-3.5 h-3.5 text-[#212121]" />
                </div>
                <h4 className="text-xs font-semibold text-[#161616]">Qwen 2.5 / Gemini</h4>
                <p className="text-[11px] text-[#8F8F8F] font-mono mt-1 truncate">Temp: 0.2 | JSON</p>
                <div className="mt-3 pt-2 border-t border-[#F0F0F0] text-[9px] font-mono text-[#161616] flex justify-between">
                  <span>ACTION</span>
                  <span className="text-[#FF91AC]">tool_call</span>
                </div>
              </div>

              {/* Node 4: Tool Sandbox */}
              <div className="relative z-10 bg-white rounded-[20px] p-4 border border-[#E5E5E5] shadow-sm hover:border-[#FF91AC] hover:shadow-md transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-token text-[9px]">Tool Node</span>
                  <Terminal className="w-3.5 h-3.5 text-[#8F8F8F]" />
                </div>
                <h4 className="text-xs font-semibold text-[#161616]">Python Sandbox</h4>
                <p className="text-[11px] text-[#8F8F8F] font-mono mt-1 truncate">Subprocess (8s max)</p>
                <div className="mt-3 pt-2 border-t border-[#F0F0F0] text-[9px] font-mono text-[#161616] flex justify-between">
                  <span>EXEC</span>
                  <span className="text-emerald-600">Success (12ms)</span>
                </div>
              </div>

              {/* Node 5: Conditional Logic */}
              <div className="relative z-10 bg-white rounded-[20px] p-4 border border-[#E5E5E5] shadow-sm hover:border-[#FF91AC] hover:shadow-md transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-token text-[9px]">Logic</span>
                  <Workflow className="w-3.5 h-3.5 text-[#8F8F8F]" />
                </div>
                <h4 className="text-xs font-semibold text-[#161616]">Verifier Check</h4>
                <p className="text-[11px] text-[#8F8F8F] font-mono mt-1 truncate">Confidence &gt; 0.9</p>
                <div className="mt-3 pt-2 border-t border-[#F0F0F0] text-[9px] font-mono text-[#161616] flex justify-between">
                  <span>BRANCH</span>
                  <span className="text-emerald-600">True</span>
                </div>
              </div>

              {/* Node 6: Output */}
              <div className="relative z-10 bg-[#212121] text-white rounded-[20px] p-4 border border-[#333333] shadow-md hover:shadow-lg transition-all text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-token bg-[#303030] text-[#FFBCCA] text-[9px]">Terminal</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFBCCA]" />
                </div>
                <h4 className="text-xs font-semibold text-white">Final Output</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">Markdown Response</p>
                <div className="mt-3 pt-2 border-t border-white/10 text-[9px] font-mono text-slate-300 flex justify-between">
                  <span>STATUS</span>
                  <span className="text-[#FFBCCA]">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Build without complexity */}
      <section id="features" className="w-full px-6 py-24 max-w-[1392px] mx-auto border-t border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="badge-token">Visual Orchestration</span>
            <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#161616]">
              Build without complexity
            </h2>
            <p className="text-[#303030] text-[16px] leading-[26px]">
              Tired of brittle Python glue code and nested callbacks? AgentFlow provides a visual canvas where AI agents, prompts, conditionals, and tools are wired visually using directed acyclic graphs (DAGs).
            </p>
            <ul className="space-y-3 text-sm text-[#303030] pt-2">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF91AC]" />
                <span>Zero boilerplate: Drag nodes, connect handles, and execute instantly.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF91AC]" />
                <span>Kahn's topological sort with cycle and self-loop detection.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF91AC]" />
                <span>Export and import production workflow JSON templates anytime.</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="card-agentflow p-8 bg-white border border-[#E5E5E5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0]">
                <span className="font-mono text-xs uppercase font-semibold text-[#8F8F8F]">Visual Builder Canvas</span>
                <span className="text-xs text-emerald-600 font-mono">DAG Validated</span>
              </div>
              <div className="p-6 rounded-[16px] bg-[#FAFAFA] border border-[#E5E5E5] space-y-3 font-mono text-xs">
                <p className="text-[#8F8F8F]">// Workflow Graph Pipeline Specification</p>
                <p className="text-[#161616]">&gt; InputNode: User question received</p>
                <p className="text-[#161616]">&gt; PromptTemplateNode: Inject system parameters</p>
                <p className="text-[#161616]">&gt; LLMNode: Invoking Qwen 2.5 via local Ollama engine</p>
                <p className="text-emerald-600">&gt; OutputNode: Formatted markdown payload generated</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Bring your own models */}
      <section id="models" className="w-full px-6 py-24 bg-white border-y border-[#E5E5E5]">
        <div className="max-w-[1392px] mx-auto text-center space-y-6">
          <span className="badge-token">Model Freedom</span>
          <h2 className="text-3xl md:text-[40px] font-medium leading-tight text-[#161616]">
            Bring your own models
          </h2>
          <p className="text-[#303030] text-[16px] max-w-[760px] mx-auto leading-[26px]">
            No vendor lock-in. Run local privacy-preserving open-weight LLMs via Ollama, or harness frontier multimodal reasoning with Google Gemini API.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 text-left">
            <div className="card-agentflow p-8 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center font-bold text-sm">
                <Cpu className="w-5 h-5 text-[#161616]" />
              </div>
              <h3 className="text-2xl font-medium text-[#161616]">Local Ollama & Qwen 2.5</h3>
              <p className="text-sm text-[#303030] leading-relaxed">
                Connect directly to your local workstation or server running Ollama. Zero latency costs, complete data privacy, and full offline execution capabilities.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#8F8F8F]">
                <span>Default Endpoint:</span>
                <span className="bg-[#F0F0F0] px-2 py-0.5 rounded text-[#161616]">http://localhost:11434</span>
              </div>
            </div>

            <div className="card-agentflow p-8 space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#FFBCCA] flex items-center justify-center font-bold text-sm">
                <Sparkles className="w-5 h-5 text-[#212121]" />
              </div>
              <h3 className="text-2xl font-medium text-[#161616]">Google Gemini API</h3>
              <p className="text-sm text-[#303030] leading-relaxed">
                Plug in Gemini 2.0 Flash or 1.5 Pro for multimodal analysis, long-context reasoning, and fast cloud execution. Server-side API key encryption ensures zero frontend exposure.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#8F8F8F]">
                <span>Security:</span>
                <span className="bg-[#F0F0F0] px-2 py-0.5 rounded text-emerald-600">Server-Side Encrypted (.env)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Connect tools and memory */}
      <section id="tools" className="w-full px-6 py-24 max-w-[1392px] mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-16 space-y-4">
          <span className="badge-token">Extensible Ecosystem</span>
          <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#161616]">
            Connect tools and memory
          </h2>
          <p className="text-[#303030] text-[16px] leading-[26px]">
            Equip your visual agents with real-world execution superpowers. From mathematical precision to sandboxed code interpreters and database-backed session memory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-agentflow p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#FFBCCA] flex items-center justify-center text-xs font-mono font-bold">
              AST
            </div>
            <h4 className="font-semibold text-base text-[#161616]">Safe Math Calculator</h4>
            <p className="text-xs text-[#303030] leading-relaxed">
              Eliminates LLM arithmetic hallucinations using an AST expression visitor. No dangerous `eval()`.
            </p>
          </div>

          <div className="card-agentflow p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center text-xs font-mono font-bold">
              PY
            </div>
            <h4 className="font-semibold text-base text-[#161616]">Subprocess Python Sandbox</h4>
            <p className="text-xs text-[#303030] leading-relaxed">
              Runs dynamic Python scripts in isolated OS subprocesses with strict 8.0-second execution ceilings.
            </p>
          </div>

          <div className="card-agentflow p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#F0F0F0] flex items-center justify-center text-xs font-mono font-bold">
              NET
            </div>
            <h4 className="font-semibold text-base text-[#161616]">SSRF-Guarded HTTP</h4>
            <p className="text-xs text-[#303030] leading-relaxed">
              Query external web APIs with automated DNS filtering that blocks private RFC 1918 subnets and cloud metadata.
            </p>
          </div>

          <div className="card-agentflow p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#FFBCCA] flex items-center justify-center text-xs font-mono font-bold">
              DB
            </div>
            <h4 className="font-semibold text-base text-[#161616]">Persistent Memory</h4>
            <p className="text-xs text-[#303030] leading-relaxed">
              Database-backed multi-turn memory buffers and sliding windows persisted directly in PostgreSQL/SQLite.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Execute and observe */}
      <section id="observability" className="w-full px-6 py-24 bg-[#212121] text-white">
        <div className="max-w-[1392px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="badge-token bg-[#303030] text-[#FFBCCA] border-white/10">
                Cognitive Architecture & Telemetry
              </span>
              <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#FAFAFA]">
                Execute and observe
              </h2>
              <p className="text-slate-300 text-[16px] leading-[26px]">
                Watch your agents think in real-time. AgentFlow features a 4-Role Cognitive Loop (inspired by lupantech/AgentFlow research) that decomposes problem solving into four collaborative stages:
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-[16px] bg-[#303030]/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs text-[#FFBCCA]">
                    <span>1. 🧭 PLANNER</span>
                    <span>Decomposes task & chooses tool</span>
                  </div>
                </div>
                <div className="p-4 rounded-[16px] bg-[#303030]/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-300">
                    <span>2. 🛠 EXECUTOR</span>
                    <span>Runs tool & collects observations</span>
                  </div>
                </div>
                <div className="p-4 rounded-[16px] bg-[#303030]/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs text-amber-300">
                    <span>3. ✓ VERIFIER</span>
                    <span>Scores accuracy & triggers revisions</span>
                  </div>
                </div>
                <div className="p-4 rounded-[16px] bg-[#303030]/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs text-emerald-300">
                    <span>4. ✍️ GENERATOR</span>
                    <span>Synthesizes final verified answer</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[24px] bg-[#161616] border border-[#333333] p-6 shadow-2xl space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#333333] text-slate-400">
                  <span>EXECUTION LOG STREAM</span>
                  <span className="text-emerald-400">● 240ms</span>
                </div>
                <div className="space-y-2 text-slate-300">
                  <p><span className="text-[#FFBCCA]">[PLANNER]</span> Sub-goal: Compute compounded growth rate</p>
                  <p><span className="text-blue-400">[EXECUTOR]</span> Invoking Python Sandbox: result = 1.08 ** 5</p>
                  <p><span className="text-amber-400">[VERIFIER]</span> Valid=True (Confidence=0.98) | Step verified</p>
                  <p><span className="text-emerald-400">[GENERATOR]</span> Synthesis complete: Result 1.469</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="w-full px-6 py-28 max-w-[1392px] mx-auto text-center flex flex-col items-center space-y-8">
        <div className="badge-token">Get Started Today</div>
        <h2 className="text-4xl md:text-[52px] font-medium leading-tight text-[#161616] max-w-2xl">
          Your next AI agent starts here.
        </h2>
        <p className="text-base text-[#303030] max-w-lg leading-relaxed font-normal">
          Build, connect, test, and execute production AI agent workflows with zero friction. Open the visual canvas or start from a pre-built template.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/editor" className="btn-primary text-sm px-8 py-4">
            START BUILDING
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/templates" className="btn-secondary text-sm px-8 py-4">
            EXPLORE WORKFLOWS
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white px-6 py-12 text-xs text-[#8F8F8F]">
        <div className="max-w-[1392px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FFBCCA] text-[#212121] flex items-center justify-center font-bold text-[10px]">
              AF
            </div>
            <span className="font-semibold text-[#161616] text-sm">AgentFlow</span>
            <span>— Visual AI Agent Builder & Cognitive Pipeline Orchestrator.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px] uppercase">
            <Link to="/editor" className="hover:text-[#161616] transition-colors">Canvas</Link>
            <Link to="/dashboard" className="hover:text-[#161616] transition-colors">Dashboard</Link>
            <Link to="/templates" className="hover:text-[#161616] transition-colors">Templates</Link>
            <Link to="/providers" className="hover:text-[#161616] transition-colors">Providers</Link>
            <Link to="/settings" className="hover:text-[#161616] transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
