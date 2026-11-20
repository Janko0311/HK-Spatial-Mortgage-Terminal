import { ArrowRight, BarChart3, Building2, Globe2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ConnectWalletButton } from '../../components/web3/ConnectWalletButton'

export function LandingPage() {
  return (
    <div className="site-shell">
      <div className="glass-card aurora-ring rounded-[32px] px-5 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-slate-300">
                Aura Finance
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                HK Spatial Mortgage Terminal
              </div>
            </div>

            <nav className="hidden gap-5 text-sm text-slate-300 lg:flex">
              <a href="#product" className="transition hover:text-white">Product</a>
              <a href="#features" className="transition hover:text-white">Features</a>
              <a href="#entry" className="transition hover:text-white">Enter</a>
            </nav>
          </div>

          <ConnectWalletButton />
        </div>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card aurora-ring relative overflow-hidden rounded-[36px] px-7 py-8 md:px-10 md:py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.8)]" />
            Card-based fintech interface for Hong Kong mortgage intelligence
          </div>

          <h1 className="hero-title mt-6 text-white">
            Spatial mortgage
            <br />
            experience with
            <br />
            premium UI
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            A commercial-ready frontend combining wallet onboarding, a 3D Hong Kong
            model, region-level market intelligence, and a structured mortgage workflow
            inside a frosted-glass dashboard.
          </p>

          <div id="entry" className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#features"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View Features
            </a>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="glass-soft rounded-[30px] p-6">
            <div className="section-eyebrow">Wallet onboarding</div>
            <div className="mt-3 text-2xl font-semibold text-white">Connect-first flow</div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              MetaMask and chain validation are surfaced inside a premium landing page
              instead of a raw developer overlay.
            </p>
          </div>

          <div className="glass-soft rounded-[30px] p-6">
            <div className="section-eyebrow">Dashboard system</div>
            <div className="mt-3 text-2xl font-semibold text-white">
              Sidebar + cards + 3D viewport
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The main product experience is redesigned into a card-based layout
              with clear sections and more polished spacing.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: '3D Spatial Layer',
            note: 'Stylized Hong Kong landmass with interactive regions',
            icon: Globe2,
          },
          {
            title: 'Market Cards',
            note: 'Dedicated intelligence blocks for regional pricing and LTV',
            icon: BarChart3,
          },
          {
            title: 'Mortgage Flow',
            note: 'Clear action area for application and lending steps',
            icon: Building2,
          },
          {
            title: 'Commercial UI',
            note: 'Aurora gradients, frosted glass, large radius, dashboard feel',
            icon: ArrowRight,
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="glass-soft rounded-[28px] p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">{item.title}</div>
                <div className="rounded-full bg-white/5 p-2">
                  <Icon className="h-4 w-4 text-sky-300" />
                </div>
              </div>

              <div className="mt-5 text-lg font-semibold text-white">{item.title}</div>
              <div className="mt-2 text-sm leading-6 text-slate-300">{item.note}</div>
            </div>
          )
        })}
      </section>

      <section id="product" className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="glass-card rounded-[32px] p-7">
          <div className="section-eyebrow">Product direction</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
            Frontend first, dashboard quality first
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            We are focusing on the visual system first: page structure, card hierarchy,
            modern styling, and the overall product feel. Backend sophistication can be
            layered in after the UI looks convincing.
          </p>
        </div>

        <div className="glass-soft rounded-[32px] p-7">
          <div className="section-eyebrow">Next step</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">
            Enter the dashboard
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            The dashboard page contains the full card-based layout: sidebar navigation,
            KPI cards, 3D model card, market intelligence card, and mortgage action card.
          </p>

          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
