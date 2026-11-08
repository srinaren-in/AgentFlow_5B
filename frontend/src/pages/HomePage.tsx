import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react'

interface CaseStudyTab {
  id: string
  title: string
  subtitle: string
  logo: string
  video: string
  ctaText: string
  description: string
}

const caseStudyTabs: CaseStudyTab[] = [
  {
    id: 'mark',
    title: 'How Mark automated new user onboarding',
    subtitle: 'New hires get instant access to Slack, Jira, Notion, and more, all in one workflow.',
    logo: '/assets/n8n/asset-040.svg',
    video: '/assets/n8n/asset-039.mp4',
    ctaText: 'See how Mark did it',
    description: 'Automated identity provisioning and multi-system onboarding pipeline.',
  },
  {
    id: 'deborah',
    title: 'How Deborah automated threat investigation',
    subtitle: 'Suspicious indicators are checked against multiple security tools, combined into one report, and summarized by AI, all in one workflow.',
    logo: '/assets/n8n/asset-045.svg',
    video: '/assets/n8n/asset-044.mp4',
    ctaText: 'See how Deborah did it',
    description: 'Automated threat hunting, SIEM log correlation, and AI synthesis.',
  },
  {
    id: 'olu',
    title: 'How Olu automated alert triage',
    subtitle: 'When an alert comes in, an AI agent investigates it, then routes it by severity to the right people and tools, all in one workflow.',
    logo: '/assets/n8n/asset-048.svg',
    video: '/assets/n8n/asset-049.mp4',
    ctaText: 'See how Olu did it',
    description: 'High-throughput anomaly triage with automated incident escalation.',
  },
  {
    id: 'alix',
    title: 'How Alix automated lead qualification',
    subtitle: 'New messages are answered and qualified by an AI agent, the lead record is kept up to date, and a reply goes out, all in one workflow.',
    logo: '/assets/n8n/asset-053.svg',
    video: '/assets/n8n/asset-054.mp4',
    ctaText: 'See how Alix did it',
    description: 'Inbound CRM lead enrichment and intelligent multi-turn agent response.',
  },
]

const integrationIcons = [
  { name: 'OpenAI', icon: '/assets/n8n/asset-005.svg' },
  { name: 'Gemini', icon: '/assets/n8n/asset-011.svg' },
  { name: 'Anthropic', icon: '/assets/n8n/asset-012.svg' },
  { name: 'Notion', icon: '/assets/n8n/asset-009.svg' },
  { name: 'Slack', icon: '/assets/n8n/asset-017.svg' },
  { name: 'Gmail', icon: '/assets/n8n/asset-007.svg' },
  { name: 'Telegram', icon: '/assets/n8n/asset-008.svg' },
  { name: 'Google Drive', icon: '/assets/n8n/asset-013.svg' },
  { name: 'LinkedIn', icon: '/assets/n8n/asset-014.svg' },
  { name: 'X / Twitter', icon: '/assets/n8n/asset-015.svg' },
  { name: 'PostgreSQL', icon: '/assets/n8n/asset-068.svg' },
  { name: 'GitHub', icon: '/assets/n8n/asset-071.svg' },
  { name: 'HubSpot', icon: '/assets/n8n/asset-075.svg' },
  { name: 'Jira', icon: '/assets/n8n/asset-076.svg' },
  { name: 'Airtable', icon: '/assets/n8n/asset-077.svg' },
  { name: 'Zendesk', icon: '/assets/n8n/asset-030.svg' },
  { name: 'Webhook', icon: '/assets/n8n/asset-080.svg' },
  { name: 'Python Sandbox', icon: '/assets/n8n/asset-082.svg' },
]

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [heroMode, setHeroMode] = useState<'simulation' | 'blueprint'>('simulation')
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlayback = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const restartVideo = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#161616] font-sans antialiased selection:bg-[#FFBCCA] selection:text-[#212121]">
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 bg-[#FFF0F3]/95 backdrop-blur-md border-b border-[#F8CDD6] px-6 py-4 transition-colors">
        <div className="max-w-[1392px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-[#FFBCCA] text-[#212121] flex items-center justify-center font-bold shadow-xs group-hover:bg-[#FF91AC] transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-semibold text-xl tracking-tight text-[#161616] font-display">
                AgentFlow
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#303030]">
              <a href="#how-it-works" className="hover:text-[#161616] transition-colors">How it works</a>
              <a href="#integrations" className="hover:text-[#161616] transition-colors">Integrations</a>
              <a href="#visibility" className="hover:text-[#161616] transition-colors">Visibility</a>
              <a href="#enterprise" className="hover:text-[#161616] transition-colors">Enterprise</a>
              <a href="#stories" className="hover:text-[#161616] transition-colors">Customer Stories</a>
              <Link to="/templates" className="hover:text-[#161616] transition-colors">Templates</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#303030] hover:text-[#161616] px-3.5 py-2 rounded-full hover:bg-[#FFE4E9] transition-colors"
            >
              Dashboard
            </Link>
            <Link to="/editor" className="btn-primary text-xs md:text-sm">
              Start Building
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="w-full px-6 pt-16 md:pt-24 pb-16 max-w-[1392px] mx-auto text-center flex flex-col items-center relative">
        {/* Soft Ambient Pink Halo Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#FFBCCA]/40 via-[#FF91AC]/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="badge-token mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#FF91AC]" />
          Visual AI Agent Platform & Workflow Orchestrator
        </div>

        <h1 className="hero-headline max-w-[1100px] mb-6">
          Build the agent. Understand its workflow.
        </h1>

        <p className="text-lg md:text-[18px] leading-[28px] text-[#303030] max-w-[800px] mb-10 font-normal">
          A visual platform for building, connecting, testing, and executing intelligent AI agents through a node-based workflow interface. Drop into code whenever you need it.
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

        {/* Hero Visual: Authentic Animated Canvas & DAG Simulation */}
        <div className="w-full max-w-[1240px] card-agentflow p-3 md:p-6 bg-white border border-[#F8CDD6] shadow-2xl overflow-hidden relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#FFE4E9] gap-3 text-xs font-mono text-[#8F8F8F]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-semibold text-[#161616]">
                LIVE AGENT WORKFLOW SIMULATION
              </span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex bg-[#FFE4E9] p-0.5 rounded-full text-[11px]">
                <button
                  onClick={() => setHeroMode('simulation')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    heroMode === 'simulation'
                      ? 'bg-[#212121] text-white shadow-xs font-bold'
                      : 'text-[#303030] hover:text-[#161616]'
                  }`}
                >
                  ▶ Live Simulation
                </button>
                <button
                  onClick={() => setHeroMode('blueprint')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    heroMode === 'blueprint'
                      ? 'bg-[#212121] text-white shadow-xs font-bold'
                      : 'text-[#303030] hover:text-[#161616]'
                  }`}
                >
                  ❖ DAG Blueprint
                </button>
              </div>

              <Link
                to="/editor"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1 bg-[#FFBCCA] text-[#212121] font-bold rounded-full text-[11px] hover:bg-[#FF91AC] transition-colors"
              >
                Open in Editor
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Canvas Display */}
          <div className="relative rounded-[20px] overflow-hidden canvas-dot-grid border border-[#2b2b2b] shadow-inner group">
            {heroMode === 'simulation' ? (
              <div className="relative aspect-[1750/1184] max-h-[620px] flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="/assets/n8n/hero-workflow-animation.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {/* Floating On-Canvas Telemetry HUD Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <div className="bg-[#161616]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-mono text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>FLOW: Invoice Screening & Multi-Tool Payment</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 bg-[#161616]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-mono text-slate-300">
                    <span className="text-[#FFBCCA]">Claude 3.5 Sonnet</span>
                    <span>•</span>
                    <span className="text-emerald-400">4 Tools Bound</span>
                    <span>•</span>
                    <span className="text-sky-300">Slack & Wise API</span>
                  </div>
                </div>

                {/* Floating Bottom Control Deck */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 bg-[#161616]/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-lg">
                    <button
                      onClick={togglePlayback}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-[#FFBCCA] hover:text-[#212121] text-white transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={restartVideo}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Restart Animation"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-300 px-1">
                      {isPlaying ? 'Simulation Running' : 'Paused'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/editor"
                      className="px-3 py-1.5 rounded-full bg-[#FFBCCA] text-[#212121] font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-[#FF91AC] transition-all shadow-md flex items-center gap-1.5"
                    >
                      Build On Canvas
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative p-2 md:p-4 bg-[#FFF0F3] flex items-center justify-center max-h-[620px]">
                <img
                  src="/assets/n8n/asset-083.svg"
                  alt="Visual Agent Workflow Canvas Blueprint"
                  className="w-full h-auto object-contain mx-auto max-h-[580px]"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. TRUSTED BY LOGO CAROUSEL */}
      <section className="w-full px-6 py-12 border-t border-[#F8CDD6] bg-white">
        <div className="max-w-[1392px] mx-auto text-center space-y-6">
          <p className="text-xs font-mono uppercase tracking-widest text-[#8F8F8F]">
            Trusted by 250,000+ developers and teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            <img src="/assets/n8n/asset-029.svg" alt="Meta" className="h-6 object-contain" />
            <img src="/assets/n8n/asset-030.svg" alt="Zendesk" className="h-6 object-contain" />
            <img src="/assets/n8n/asset-031.svg" alt="Mistral AI" className="h-6 object-contain" />
            <img src="/assets/n8n/asset-032.svg" alt="Vodafone" className="h-6 object-contain" />
            <img src="/assets/n8n/asset-033.svg" alt="Microsoft" className="h-6 object-contain" />
            <img src="/assets/n8n/asset-034.svg" alt="Deutsche Telekom" className="h-6 object-contain" />
            <img src="/assets/n8n/asset-035.svg" alt="Mercedes-Benz" className="h-6 object-contain" />
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE CASE STUDY TABS (VIDEO DEMOS) */}
      <section id="how-it-works" className="w-full px-6 py-24 max-w-[1392px] mx-auto border-t border-[#F8CDD6]">
        <div className="text-center max-w-[800px] mx-auto mb-14 space-y-4">
          <span className="badge-token">Interactive Walkthrough</span>
          <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#161616] font-display">
            Real workflows. Zero guesswork.
          </h2>
          <p className="text-[#303030] text-[16px] leading-[26px]">
            Inspect how teams automate mission-critical operations by combining intelligent AI models, deterministic logic, and real tools.
          </p>
        </div>

        {/* Tab Navigation Pill Headers */}
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-10">
          {caseStudyTabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                activeTab === idx
                  ? 'bg-[#212121] text-white shadow-sm'
                  : 'bg-white border border-[#F8CDD6] text-[#303030] hover:border-[#FF91AC]'
              }`}
            >
              {tab.title.replace('How ', '').split(' automated')[0]}
            </button>
          ))}
        </div>

        {/* Active Tab Content Card */}
        <div className="card-agentflow bg-white border border-[#F8CDD6] p-6 md:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src={caseStudyTabs[activeTab].logo}
                  alt="Company Logo"
                  className="h-8 object-contain"
                />
                <span className="badge-token text-[11px]">Production Workflow</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-medium text-[#161616] font-display leading-tight">
                {caseStudyTabs[activeTab].title}
              </h3>

              <p className="text-[#303030] text-base leading-relaxed">
                {caseStudyTabs[activeTab].subtitle}
              </p>

              <div className="pt-2">
                <Link
                  to="/editor"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#161616] hover:text-[#FF91AC] transition-colors"
                >
                  <span>{caseStudyTabs[activeTab].ctaText} in AgentFlow</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-[20px] overflow-hidden border border-[#F8CDD6] bg-black shadow-md aspect-video relative">
                <video
                  key={caseStudyTabs[activeTab].video}
                  src={caseStudyTabs[activeTab].video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Community Proof Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="card-agentflow bg-[#FFE4E9]/60 p-5 flex items-center gap-4 border border-[#F8CDD6]">
            <img src="/assets/n8n/asset-055.svg" alt="GitHub" className="w-7 h-7" />
            <div>
              <div className="font-semibold text-sm text-[#161616]">Top 50 GitHub Project</div>
              <div className="text-xs text-[#8F8F8F]">With 209k+ GitHub stars</div>
            </div>
          </div>
          <div className="card-agentflow bg-[#FFE4E9]/60 p-5 flex items-center gap-4 border border-[#F8CDD6]">
            <img src="/assets/n8n/asset-056.png" alt="G2" className="w-7 h-7 rounded" />
            <div>
              <div className="font-semibold text-sm text-[#161616]">Rated 4.7/5 on G2</div>
              <div className="text-xs text-[#8F8F8F]">From thousands of verified engineers</div>
            </div>
          </div>
          <div className="card-agentflow bg-[#FFE4E9]/60 p-5 flex items-center gap-4 border border-[#F8CDD6]">
            <img src="/assets/n8n/asset-057.webp" alt="Community" className="w-7 h-7 rounded-full" />
            <div>
              <div className="font-semibold text-sm text-[#161616]">250,000+ Developers</div>
              <div className="text-xs text-[#8F8F8F]">Active builder community</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE USB-C FOR YOUR AI STACK (INTEGRATIONS GRID) */}
      <section id="integrations" className="w-full px-6 py-24 bg-white border-y border-[#F8CDD6]">
        <div className="max-w-[1392px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-16 space-y-4">
            <span className="badge-token">Universal Connectivity</span>
            <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#161616] font-display">
              The USB-C for your AI stack
            </h2>
            <p className="text-[#303030] text-[16px] leading-[26px]">
              Connect any model, database, API, and tool without wrestling custom SDKs. Over 400+ native connectors ready out-of-the-box.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {integrationIcons.map((item, idx) => (
              <div
                key={idx}
                className="card-agentflow p-4 flex flex-col items-center justify-center gap-3 text-center bg-[#FFF0F3] border border-[#F8CDD6] hover:border-[#FF91AC] hover:bg-white transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#F8CDD6] flex items-center justify-center p-2.5 shadow-xs group-hover:scale-105 transition-transform">
                  <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-medium text-[#161616]">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/editor" className="btn-secondary text-xs font-mono uppercase tracking-wider">
              Browse All 400+ Connectors & Models
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. SEE + UNDERSTAND + TRUST YOUR AGENTS */}
      <section id="visibility" className="w-full px-6 py-24 max-w-[1392px] mx-auto">
        <div className="text-center max-w-[800px] mx-auto mb-16 space-y-4">
          <span className="badge-token">Transparent Execution</span>
          <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#161616] font-display">
            See + understand + trust your agents
          </h2>
          <p className="text-[#303030] text-[16px] leading-[26px]">
            Connect any model, see every decision, and add human approval when needed.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card-agentflow p-8 bg-white border border-[#F8CDD6] space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#FFBCCA] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-xl font-medium text-[#161616]">Full visibility across agents</h3>
            <p className="text-sm text-[#303030] leading-relaxed">
              Watch agents work live, inspect intermediate thoughts, or open any past run — all inside the same workflow canvas.
            </p>
          </div>

          <div className="card-agentflow p-8 bg-white border border-[#F8CDD6] space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#FFE4E9] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-xl font-medium text-[#161616]">Put rules around AI actions</h3>
            <p className="text-sm text-[#303030] leading-relaxed">
              Use structured JSON schemas for AI actions. Add human-in-the-loop approvals and deterministic safety fallback rules.
            </p>
          </div>

          <div className="card-agentflow p-8 bg-white border border-[#F8CDD6] space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#FFE4E9] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-xl font-medium text-[#161616]">Self-host your AI stack</h3>
            <p className="text-sm text-[#303030] leading-relaxed">
              Deploy on-prem or with Docker to keep your data strictly in your private VPC. Pair with local Ollama Qwen 2.5 for offline privacy.
            </p>
          </div>
        </div>

        {/* Large Video & Diagram Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="rounded-[24px] overflow-hidden border border-[#F8CDD6] bg-black shadow-xl aspect-video">
              <video
                src="/assets/n8n/asset-084.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[24px] overflow-hidden border border-[#F8CDD6] bg-white p-4 shadow-lg">
              <img
                src="/assets/n8n/asset-085.svg"
                alt="Observability Trace"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUILT BY YOU + READABLE BY ANYONE */}
      <section className="w-full px-6 py-24 bg-[#FFE4E9]/50 border-t border-[#F8CDD6]">
        <div className="max-w-[1392px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-16 space-y-4">
            <span className="badge-token">Visual Clarity</span>
            <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#161616] font-display">
              Built by you + readable by anyone
            </h2>
            <p className="text-[#303030] text-[16px] leading-[26px]">
              Create workflows anyone can follow with a visual builder and drop into Python or TypeScript whenever you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card-agentflow p-8 bg-white border border-[#F8CDD6] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#FFBCCA] flex items-center justify-center font-bold text-xs">
                DOC
              </div>
              <h3 className="text-xl font-medium text-[#161616]">Documentation, built in</h3>
              <p className="text-sm text-[#303030] leading-relaxed">
                The visual DAG is the documentation. No separate wikis. No stale handover write-ups.
              </p>
            </div>

            <div className="card-agentflow p-8 bg-white border border-[#F8CDD6] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#FFE4E9] flex items-center justify-center font-bold text-xs">
                FIX
              </div>
              <h3 className="text-xl font-medium text-[#161616]">Recover in one step</h3>
              <p className="text-sm text-[#303030] leading-relaxed">
                Spot errors at a glance. Re-run just the individual node that broke without restarting the whole sequence.
              </p>
            </div>

            <div className="card-agentflow p-8 bg-white border border-[#F8CDD6] space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#FFE4E9] flex items-center justify-center font-bold text-xs">
                GIT
              </div>
              <h3 className="text-xl font-medium text-[#161616]">Every change, tracked</h3>
              <p className="text-sm text-[#303030] leading-relaxed">
                Complete execution history and version audit logs show who changed what, when, and with what LLM parameters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-[24px] overflow-hidden border border-[#F8CDD6] bg-white p-4 shadow-lg">
                <img
                  src="/assets/n8n/asset-087.svg"
                  alt="Workflow Flowchart"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="rounded-[24px] overflow-hidden border border-[#F8CDD6] bg-black shadow-xl aspect-video">
                <video
                  src="/assets/n8n/asset-086.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MOVE FAST + BREAK NOTHING */}
      <section className="w-full px-6 py-24 max-w-[1392px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="badge-token">Engineering Reliability</span>
            <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#161616] font-display">
              Move fast + break nothing
            </h2>
            <p className="text-lg text-[#161616] font-medium">
              Shipped months ago. Still in control. Feels good, doesn't it?
            </p>
            <div className="space-y-4 text-sm text-[#303030]">
              <div className="p-4 rounded-[16px] bg-white border border-[#F8CDD6] space-y-1">
                <h4 className="font-semibold text-[#161616]">Move Fast</h4>
                <p>Replay a past run or mock the data. Skip waiting on slow third-party staging systems.</p>
              </div>
              <div className="p-4 rounded-[16px] bg-white border border-[#F8CDD6] space-y-1">
                <h4 className="font-semibold text-[#161616]">Break Nothing</h4>
                <p>See exactly what happened in the execution traces. No grep excavation required.</p>
              </div>
            </div>
            <div className="pt-2">
              <Link to="/editor" className="btn-primary text-xs">
                Test In Canvas Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="card-agentflow bg-white border border-[#F8CDD6] p-4 shadow-xl space-y-4">
              <img
                src="/assets/n8n/asset-088.svg"
                alt="Multi-step execution graph"
                className="w-full h-auto object-contain rounded-xl"
              />
              <img
                src="/assets/n8n/asset-089.webp"
                alt="Run trace preview"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE-READY FOR TEAMS OF ANY SIZE (DARK SECTION) */}
      <section id="enterprise" className="w-full px-6 py-24 bg-[#212121] text-white">
        <div className="max-w-[1392px] mx-auto">
          <div className="text-center max-w-[800px] mx-auto mb-16 space-y-4">
            <span className="badge-token bg-[#303030] text-[#FFBCCA] border-white/10">
              Enterprise Grade
            </span>
            <h2 className="text-3xl md:text-[40px] font-medium leading-[1.15] text-[#FFF0F3] font-display">
              Enterprise-ready for teams of any size
            </h2>
            <p className="text-slate-300 text-[16px] leading-[26px]">
              Deploy with strict compliance, SOC 2 certification, SSO/SAML, and granular role-based access controls.
            </p>
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 rounded-[20px] bg-[#303030]/60 border border-white/10 space-y-4">
              <img src="/assets/n8n/asset-090.svg" alt="Security" className="w-10 h-10" />
              <h3 className="text-lg font-semibold text-white">Security + control</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Granular RBAC, audit logging, encrypted credentials, and on-prem air-gapped deployment options.
              </p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#303030]/60 border border-white/10 space-y-4">
              <img src="/assets/n8n/asset-091.svg" alt="Observability" className="w-10 h-10" />
              <h3 className="text-lg font-semibold text-white">Observability + transparency</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full execution traces, token telemetry, latency tracking, and LangGraph state checkpoints.
              </p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#303030]/60 border border-white/10 space-y-4">
              <img src="/assets/n8n/asset-092.svg" alt="Dev Experience" className="w-10 h-10" />
              <h3 className="text-lg font-semibold text-white">Developer experience</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Version control with Git, isolated Python sandboxing, CI/CD webhooks, and REST APIs.
              </p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#303030]/60 border border-white/10 space-y-4">
              <img src="/assets/n8n/asset-093.svg" alt="AI Governance" className="w-10 h-10" />
              <h3 className="text-lg font-semibold text-white">AI governance</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Guardrails, rate limits, PII sanitization, and human-in-the-loop review approvals.
              </p>
            </div>
          </div>

          {/* Compliance Badges Row */}
          <div className="p-8 rounded-[24px] bg-[#2A2A2A] border border-white/10 flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-[#FFBCCA]" />
              <div>
                <h4 className="font-semibold text-white text-base">Continuous Security Audits</h4>
                <p className="text-xs text-slate-400">Validated against modern penetration testing standards.</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <img src="/assets/n8n/asset-094.svg" alt="AICPA SOC" className="h-12 object-contain" />
              <img src="/assets/n8n/asset-095.svg" alt="GDPR" className="h-12 object-contain" />
              <img src="/assets/n8n/asset-096.svg" alt="Security" className="h-12 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 10. CASE STUDIES SPOTLIGHT (HUEL & VODAFONE) */}
      <section id="stories" className="w-full px-6 py-24 max-w-[1392px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Huel */}
          <div className="card-agentflow bg-white border border-[#F8CDD6] p-8 md:p-10 shadow-lg flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="badge-token">Case Study</span>
              <h3 className="text-2xl md:text-3xl font-medium text-[#161616] font-display">
                Huel saved 1,000 hours with an AI-first culture
              </h3>
              <blockquote className="text-base text-[#303030] leading-relaxed italic border-l-2 border-[#FFBCCA] pl-4">
                "AgentFlow was the big unlock. Tools like ChatGPT and Claude are great, but AgentFlow is the thing that allows you to integrate AI into your work and your processes in a safe and controlled way."
              </blockquote>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#FFE4E9]">
              <img
                src="/assets/n8n/asset-097.png"
                alt="Oliver Scheers"
                className="w-12 h-12 rounded-full object-cover border border-[#F8CDD6]"
              />
              <div>
                <div className="font-semibold text-sm text-[#161616]">Oliver Scheers</div>
                <div className="text-xs text-[#8F8F8F]">Chief Technology Officer, Huel</div>
              </div>
            </div>
          </div>

          {/* Card 2: Vodafone */}
          <div className="card-agentflow bg-white border border-[#F8CDD6] p-8 md:p-10 shadow-lg flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="badge-token">Case Study</span>
              <h3 className="text-2xl md:text-3xl font-medium text-[#161616] font-display">
                Vodafone delivers £2.2M security operations win
              </h3>
              <blockquote className="text-base text-[#303030] leading-relaxed italic border-l-2 border-[#FFBCCA] pl-4">
                "AgentFlow provides SOAR capability and workflows in a low-code model, as well as the ability to code for more complex workflows and integrations. It did everything that we wanted, all in one tool."
              </blockquote>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#FFE4E9]">
              <img
                src="/assets/n8n/asset-098.jpg"
                alt="Claire Van Hinsbergh"
                className="w-12 h-12 rounded-full object-cover border border-[#F8CDD6]"
              />
              <div>
                <div className="font-semibold text-sm text-[#161616]">Claire Van Hinsbergh</div>
                <div className="text-xs text-[#8F8F8F]">Cyber Operations Engineering Manager, Vodafone</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. WALL OF LOVE / TESTIMONIALS */}
      <section className="w-full px-6 py-20 bg-[#FFE4E9]/50 border-y border-[#F8CDD6]">
        <div className="max-w-[1392px] mx-auto">
          <div className="text-center max-w-[700px] mx-auto mb-14 space-y-3">
            <span className="badge-token">Community Voices</span>
            <h2 className="text-2xl md:text-3xl font-medium text-[#161616] font-display">
              Loved by automation engineers everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-agentflow bg-white p-6 border border-[#F8CDD6] space-y-4">
              <p className="text-sm text-[#303030] italic">
                "I have found the holy grail of automation. Visual flow plus Python scripts whenever needed."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#FFE4E9]">
                <img src="/assets/n8n/asset-099.webp" alt="Luisa" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-semibold text-[#161616]">Luisa Vidal</div>
                  <div className="text-[11px] text-[#8F8F8F]">AI Operations Lead</div>
                </div>
              </div>
            </div>

            <div className="card-agentflow bg-white p-6 border border-[#F8CDD6] space-y-4">
              <p className="text-sm text-[#303030] italic">
                "AgentFlow's integration with third-party services is absolutely mind-blowing. Swiss army knife for AI."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#FFE4E9]">
                <img src="/assets/n8n/asset-100.webp" alt="Felix" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-semibold text-[#161616]">Felix Leber</div>
                  <div className="text-[11px] text-[#8F8F8F]">Full Stack Architect</div>
                </div>
              </div>
            </div>

            <div className="card-agentflow bg-white p-6 border border-[#F8CDD6] space-y-4">
              <p className="text-sm text-[#303030] italic">
                "Anything is possible with AgentFlow. The local Ollama integration paired with cloud models is unparalleled."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#FFE4E9]">
                <img src="/assets/n8n/asset-101.webp" alt="Robyn" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-semibold text-[#161616]">Robyn Tindall</div>
                  <div className="text-[11px] text-[#8F8F8F]">DevOps Engineer</div>
                </div>
              </div>
            </div>

            <div className="card-agentflow bg-white p-6 border border-[#F8CDD6] space-y-4">
              <p className="text-sm text-[#303030] italic">
                "Thank you to the community. I did the beginner tutorial and promptly built an automation way beyond my skill level."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#FFE4E9]">
                <img src="/assets/n8n/asset-102.webp" alt="Charley" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-semibold text-[#161616]">Charley Mann</div>
                  <div className="text-[11px] text-[#8F8F8F]">Product Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL TO ACTION (WITH WOMAN LAPTOP ASSET) */}
      <section className="w-full px-6 py-28 max-w-[1392px] mx-auto">
        <div className="card-agentflow bg-white border border-[#F8CDD6] p-8 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="badge-token">Get Started Today</div>
              <h2 className="text-4xl md:text-[52px] font-medium leading-[1.1] text-[#161616] font-display">
                Build workflows the way you actually think
              </h2>
              <p className="text-base text-[#303030] max-w-lg leading-relaxed font-normal">
                Join over 250,000 developers building resilient, multi-turn AI agents, RAG pipelines, and automated integrations.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/editor" className="btn-primary text-sm px-8 py-4">
                  Start Building
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/templates" className="btn-secondary text-sm px-8 py-4">
                  Explore Workflows
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-mono text-[#8F8F8F]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Self-hostable & Open Source
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  No Credit Card Required
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-[24px] overflow-hidden border border-[#F8CDD6] shadow-lg max-w-[420px]">
                <img
                  src="/assets/n8n/asset-103.webp"
                  alt="Engineer building with AgentFlow"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. COMPREHENSIVE FOOTER */}
      <footer className="border-t border-[#F8CDD6] bg-white px-6 py-16 text-xs text-[#8F8F8F]">
        <div className="max-w-[1392px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-[#FFE4E9]">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#FFBCCA] text-[#212121] flex items-center justify-center font-bold text-xs">
                AF
              </div>
              <span className="font-semibold text-lg text-[#161616] tracking-tight font-display">
                AgentFlow
              </span>
            </div>
            <p className="text-xs text-[#303030] leading-relaxed max-w-sm">
              The visual workflow builder for AI agents. Connect local Ollama models, cloud LLMs, sandboxed Python tools, and self-correcting cognitive loops.
            </p>
            <div className="font-mono text-[11px] text-[#8F8F8F]">
              v1.0.0-production • Dual SQLite/PostgreSQL
            </div>
          </div>

          {/* Column: Platform */}
          <div className="space-y-3">
            <div className="font-semibold text-[#161616] font-mono uppercase tracking-wider text-[11px]">
              Platform
            </div>
            <ul className="space-y-2 font-mono text-[11px]">
              <li><Link to="/editor" className="hover:text-[#161616] transition-colors">Visual Canvas</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#161616] transition-colors">Dashboard</Link></li>
              <li><Link to="/templates" className="hover:text-[#161616] transition-colors">Templates</Link></li>
              <li><Link to="/providers" className="hover:text-[#161616] transition-colors">Model Providers</Link></li>
            </ul>
          </div>

          {/* Column: Resources */}
          <div className="space-y-3">
            <div className="font-semibold text-[#161616] font-mono uppercase tracking-wider text-[11px]">
              Resources
            </div>
            <ul className="space-y-2 font-mono text-[11px]">
              <li><a href="#integrations" className="hover:text-[#161616] transition-colors">Integrations</a></li>
              <li><a href="#how-it-works" className="hover:text-[#161616] transition-colors">Use Cases</a></li>
              <li><Link to="/settings" className="hover:text-[#161616] transition-colors">Settings & APIs</Link></li>
              <li><a href="https://github.com/lupantech/AgentFlow" target="_blank" rel="noreferrer" className="hover:text-[#161616] transition-colors inline-flex items-center gap-1">GitHub <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Column: Company / Security */}
          <div className="space-y-3">
            <div className="font-semibold text-[#161616] font-mono uppercase tracking-wider text-[11px]">
              Security
            </div>
            <ul className="space-y-2 font-mono text-[11px]">
              <li><a href="#enterprise" className="hover:text-[#161616] transition-colors">SOC 2 Type II</a></li>
              <li><a href="#enterprise" className="hover:text-[#161616] transition-colors">GDPR Compliance</a></li>
              <li><a href="#visibility" className="hover:text-[#161616] transition-colors">Self-Hosting</a></li>
              <li><a href="#enterprise" className="hover:text-[#161616] transition-colors">Python Sandboxing</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1392px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AgentFlow Inc. Built with love for AI engineers & automation creators.</p>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <Link to="/editor" className="hover:text-[#161616]">Launch Editor</Link>
            <Link to="/dashboard" className="hover:text-[#161616]">Projects</Link>
            <Link to="/templates" className="hover:text-[#161616]">Gallery</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
