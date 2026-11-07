import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, CheckCircle2, Sparkles, Shield, Cpu, Zap, Workflow } from 'lucide-react'

export const N8nLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#161616] font-sans antialiased selection:bg-[#ffbcca] selection:text-[#212121]">
      <style>{`
        :root {
          --vc-clr-primary: #000;
          --vc-clr-secondary: #090f207f;
          --vc-clr-white: #fff;
          --size-0: 0px;
          --size-2: 2px;
          --size-4: 4px;
          --size-8: 8px;
          --size-12: 12px;
          --size-14: 14px;
          --size-16: 16px;
          --size-24: 24px;
          --size-32: 32px;
          --size-48: 48px;
          --size-64: 64px;
          --size-96: 96px;
          --size-120: 120px;
          --size-160: 160px;
          --size-240: 240px;
        }

        .button-primary {
          background: #ffbcca;
          color: #212121;
          border-radius: 9999px;
          padding: 12px 16px;
          font-size: 14px;
          letter-spacing: 0.28px;
          text-transform: uppercase;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .button-primary:hover {
          background: #ff91ac;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 145, 172, 0.35);
        }

        .button-ghost {
          background: transparent;
          color: #161616;
          border-radius: 9999px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 400;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }
        .button-ghost:hover {
          background: #f0f0f0;
        }

        .card-n8n {
          background: #ffffff;
          color: #161616;
          border-radius: 24px;
          font-size: 16px;
          border: 1px solid #e5e5e5;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 8px 24px rgba(0, 0, 0, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-n8n:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.07);
        }

        .badge-pill {
          background: #f0f0f0;
          color: #161616;
          border-radius: 9999px;
          padding: 4px 12px;
          font-size: 14px;
          letter-spacing: 0.28px;
          text-transform: uppercase;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          width: fit-content;
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md border-b border-[#e5e5e5] px-6 py-3.5 transition-colors">
        <div className="max-w-[1392px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/meta_fa5a666447.svg"
                alt="n8n Logo"
                className="h-7 w-auto"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />
              <span className="font-semibold text-xl tracking-tight text-[#161616] flex items-center gap-1.5">
                AgentFlow <span className="text-[11px] font-mono uppercase bg-[#ffbcca] text-[#212121] px-2 py-0.5 rounded-full font-bold">n8n Theme</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-normal text-[#161616]">
              <a href="#product" className="hover:text-[#616161] transition-colors">Product</a>
              <a href="#showcase" className="hover:text-[#616161] transition-colors">Solutions</a>
              <a href="#integrations" className="hover:text-[#616161] transition-colors">Integrations</a>
              <a href="#enterprise" className="hover:text-[#616161] transition-colors">Enterprise</a>
              <a href="#pricing" className="hover:text-[#616161] transition-colors">Docs</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/editor" className="button-ghost text-xs md:text-sm">
              <Workflow className="w-4 h-4 text-[#616161]" />
              Canvas Editor
            </Link>
            <Link to="/editor" className="button-primary text-xs md:text-sm">
              Get started free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Section 1: Hero */}
      <section className="w-full px-6 pt-16 pb-12 max-w-[1392px] mx-auto text-center flex flex-col items-center">
        <div className="badge-pill mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#ff91ac]" />
          AI Workflow Automation Platform
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-medium leading-[1.08] tracking-tight text-[#161616] max-w-[1190px] mb-6">
          Build the agent. Understand its workflow.
          <br className="hidden md:inline" />
          <span className="text-[#616161]"> Build the agent. Understand its workflow.</span>
        </h1>

        <p className="text-lg md:text-[16px] leading-[24px] text-[#303030] max-w-[800px] mb-8 font-normal">
          Fair-code workflow automation platform with native AI capabilities. Connect LLMs, databases, and custom tools with total transparency and zero lock-in.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link to="/editor" className="button-primary text-sm px-6 py-3.5">
            Start building for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/n8n-io/n8n"
            target="_blank"
            rel="noreferrer"
            className="button-ghost text-sm border border-[#d9d9d9] px-6 py-3.5 bg-white"
          >
            ⭐ Star on GitHub (55k+)
          </a>
        </div>
      </section>

      {/* Section 2: Visual Workflow Canvas Showcase */}
      <section className="w-full px-6 pb-20 max-w-[1392px] mx-auto">
        <div className="card-n8n overflow-hidden border border-[#e5e5e5] bg-white p-2 md:p-4 shadow-xl">
          <div className="rounded-[18px] overflow-hidden bg-[#f0f0f0] border border-[#e5e5e5] relative group">
            <img
              src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/home_placeholder_1_7f817c9089.svg"
              alt="n8n Canvas Workflow"
              className="w-full h-auto object-cover min-h-[360px]"
              onError={(e) => {
                // Fallback clean canvas preview if blob blocked
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/40 via-transparent to-transparent flex items-end p-6 md:p-10">
              <div className="text-white">
                <span className="badge-pill bg-white/20 text-white backdrop-blur-md mb-2">Live Canvas</span>
                <h3 className="text-2xl md:text-[32px] font-medium text-white mb-2">Full drag-and-drop orchestration with step execution</h3>
                <p className="text-sm text-slate-200 max-w-xl">Every node is inspected, verified, and logged in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Video Case Study — Mark's Onboarding */}
      <section className="w-full px-6 py-16 max-w-[1392px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center card-n8n p-8 md:p-14 bg-gradient-to-br from-white to-[#fafafa]">
          <div className="lg:col-span-5 space-y-6">
            <div className="badge-pill">
              User Stories
            </div>
            <h2 className="text-3xl md:text-[48px] font-medium leading-[1.12] text-[#161616] tracking-tight">
              How Mark automated new user onboarding
            </h2>
            <p className="text-[#303030] text-[16px] leading-[24px]">
              "We connected our auth webhooks, generative AI summarizer, and Slack alerts in 20 minutes without writing custom glue code."
            </p>
            <div className="flex items-center gap-4 pt-2">
              <img
                src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/felix_bbe74bcc59.webp"
                alt="Mark"
                className="w-12 h-12 rounded-full object-cover border border-[#d9d9d9]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />
              <div>
                <h4 className="font-semibold text-sm text-[#161616]">Mark & Felix</h4>
                <p className="text-xs text-[#616161]">Lead Operations Engineers</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[20px] overflow-hidden border border-[#d9d9d9] shadow-md bg-black relative aspect-video">
              <video
                src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Prototype_Mark_Intro_36d2b66513.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Visual Step Decomposition */}
      <section className="w-full px-6 py-12 max-w-[1392px] mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <span className="badge-pill mb-3">Modular Execution</span>
          <h2 className="text-3xl md:text-[48px] font-medium leading-[1.15] text-[#161616]">
            Every trigger, LLM call, and branch on a single pane
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-n8n p-6 flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#ffbcca] flex items-center justify-center font-bold text-sm">01</div>
              <h3 className="text-xl font-medium text-[#161616]">Trigger Anywhere</h3>
              <p className="text-sm text-[#616161]">Inbound Webhooks, Cron Schedules, Event Busses, or direct REST API requests.</p>
            </div>
            <img
              src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/home_placeholder_3_1999b77b0e.svg"
              alt="Trigger node"
              className="w-full h-40 object-contain rounded-xl bg-[#fafafa]"
            />
          </div>

          <div className="card-n8n p-6 flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#ff91ac] flex items-center justify-center font-bold text-sm text-[#212121]">02</div>
              <h3 className="text-xl font-medium text-[#161616]">Reason with LLMs</h3>
              <p className="text-sm text-[#616161]">Chain local Ollama (Qwen 2.5) or Google Gemini with memory and prompt templates.</p>
            </div>
            <img
              src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/home_placeholder_5_4ffde770fc.svg"
              alt="Reasoning node"
              className="w-full h-40 object-contain rounded-xl bg-[#fafafa]"
            />
          </div>

          <div className="card-n8n p-6 flex flex-col justify-between">
            <div className="space-y-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#d9d9d9] flex items-center justify-center font-bold text-sm">03</div>
              <h3 className="text-xl font-medium text-[#161616]">Act in the Real World</h3>
              <p className="text-sm text-[#616161]">Isolated Python Sandboxes, HTTP API tools, and Wikipedia fact-checking pipelines.</p>
            </div>
            <img
              src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/home_placeholder_6_8361901318.svg"
              alt="Action tool"
              className="w-full h-40 object-contain rounded-xl bg-[#fafafa]"
            />
          </div>
        </div>
      </section>

      {/* Section 5: The USB-C for your AI stack */}
      <section className="w-full bg-[#fafafa] border-y border-[#e5e5e5] px-6 py-20">
        <div className="max-w-[1392px] mx-auto text-center space-y-6">
          <span className="badge-pill">Interoperability</span>
          <h2 className="text-4xl md:text-[48px] font-medium leading-tight text-[#161616]">
            The USB-C for your AI stack
          </h2>
          <p className="text-base text-[#616161] max-w-[800px] mx-auto font-normal">
            Switch model providers in one click. Mix and match open-weights with cloud frontiers without rewriting single-purpose SDK wrappers.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-10">
            {['Ollama (Local)', 'Qwen 2.5', 'Google Gemini', 'LangGraph', 'PostgreSQL', 'FastAPI'].map((tech) => (
              <div key={tech} className="p-4 rounded-xl bg-white border border-[#e5e5e5] shadow-xs flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#f0f0f0] flex items-center justify-center text-xs font-mono font-bold">
                  {tech[0]}
                </div>
                <span className="text-xs font-medium text-[#161616]">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Video 2 — See + Understand + Trust Your Agents */}
      <section className="w-full px-6 py-20 max-w-[1392px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center card-n8n p-8 md:p-14">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="rounded-[20px] overflow-hidden border border-[#d9d9d9] shadow-md bg-black relative aspect-video">
              <video
                src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Prototype_Deborah_Intro_cd1fbc8a46.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
            <div className="badge-pill">Observability</div>
            <h2 className="text-3xl md:text-[48px] font-medium leading-[1.12] text-[#161616] tracking-tight">
              See + understand + trust your agents
            </h2>
            <p className="text-[#303030] text-[16px] leading-[24px]">
              No black-box hallucinations. Watch the Planner formulate hypotheses, the Executor query tools, the Verifier score outputs, and the Generator craft conclusions.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#616161]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full execution trace, logs, and timing metrics on every run</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Video 3 — Built by you + readable by anyone */}
      <section className="w-full px-6 py-12 max-w-[1392px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center card-n8n p-8 md:p-14 bg-white">
          <div className="lg:col-span-5 space-y-6">
            <div className="badge-pill">Collaboration</div>
            <h2 className="text-3xl md:text-[48px] font-medium leading-[1.12] text-[#161616] tracking-tight">
              Built by you + readable by anyone
            </h2>
            <p className="text-[#303030] text-[16px] leading-[24px]">
              Engineers get Python sandboxes and REST webhooks. Product managers and stakeholders see an intuitive canvas flow they can verify at a glance.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <img
                src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/charley_mann_1459ba5b75.webp"
                alt="Charley"
                className="w-12 h-12 rounded-full object-cover border border-[#d9d9d9]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none'
                }}
              />
              <div>
                <h4 className="font-semibold text-sm text-[#161616]">Charley Mann</h4>
                <p className="text-xs text-[#616161]">VP of Product Architecture</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-[20px] overflow-hidden border border-[#d9d9d9] shadow-md bg-black relative aspect-video">
              <video
                src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Prototype_Olu_Intro_1b56fc34e7.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Move fast + break nothing */}
      <section className="w-full px-6 py-16 max-w-[1392px] mx-auto">
        <div className="card-n8n p-8 md:p-14 bg-[#212121] text-[#fafafa] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="badge-pill bg-[#303030] text-[#ffbcca]">
              Reliability First
            </div>
            <h2 className="text-3xl md:text-[48px] font-medium leading-[1.15] text-[#fafafa]">
              Move fast + break nothing
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Step through nodes individually, inspect execution states, and pin data fixtures to debug complex pipelines safely before deploying to production.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link to="/editor" className="button-primary px-6 py-3.5">
              Open Canvas Editor
              <Play className="w-4 h-4 fill-current" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 9: Enterprise-ready */}
      <section className="w-full px-6 py-20 max-w-[1392px] mx-auto text-center space-y-12">
        <div className="max-w-[800px] mx-auto space-y-4">
          <span className="badge-pill">Enterprise Scale</span>
          <h2 className="text-3xl md:text-[48px] font-medium leading-tight text-[#161616]">
            Enterprise-ready for teams of any size
          </h2>
          <p className="text-[#616161] text-base">
            Self-host via Docker, persist with PostgreSQL, and protect your intranet with SSRF network isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          <div className="card-n8n p-6 space-y-2">
            <Shield className="w-6 h-6 text-[#ff91ac]" />
            <h4 className="font-semibold text-sm text-[#161616]">SSRF Guard</h4>
            <p className="text-xs text-[#616161]">Blocks AWS metadata (169.254.169.254) and RFC 1918 private subnets.</p>
          </div>
          <div className="card-n8n p-6 space-y-2">
            <Cpu className="w-6 h-6 text-[#ff91ac]" />
            <h4 className="font-semibold text-sm text-[#161616]">Subprocess Sandbox</h4>
            <p className="text-xs text-[#616161]">User Python code executes in isolated OS subprocesses with 8s limits.</p>
          </div>
          <div className="card-n8n p-6 space-y-2">
            <Zap className="w-6 h-6 text-[#ff91ac]" />
            <h4 className="font-semibold text-sm text-[#161616]">PostgreSQL + Alembic</h4>
            <p className="text-xs text-[#616161]">Production migrations and persistent execution history.</p>
          </div>
          <div className="card-n8n p-6 space-y-2">
            <Sparkles className="w-6 h-6 text-[#ff91ac]" />
            <h4 className="font-semibold text-sm text-[#161616]">4-Role Cognitive Loop</h4>
            <p className="text-xs text-[#616161]">Planner, Executor, Verifier, and Generator for verified reasoning.</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-8">
          <Link to="/editor" className="button-primary text-base px-8 py-4">
            Launch AgentFlow Editor Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] bg-white px-6 py-12 text-xs text-[#616161]">
        <div className="max-w-[1392px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#161616] text-sm">AgentFlow</span>
            <span>— Inspired by n8n.io design reference. Built with React, Tailwind & FastAPI.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-[#161616]">Dashboard</Link>
            <Link to="/editor" className="hover:text-[#161616]">Canvas</Link>
            <Link to="/providers" className="hover:text-[#161616]">AI Providers</Link>
            <Link to="/settings" className="hover:text-[#161616]">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
