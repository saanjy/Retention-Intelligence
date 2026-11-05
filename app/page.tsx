'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  ChevronDown,
  CircleHelp,
  Download,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react'

type Customer = {
  id: string
  contract: string
  internet: string
  payment: string
  tenure: number
  monthly: number
  churn: boolean
  risk: number
  reason: string
}

const customers: Customer[] = [
  { id: '3668-QPYBK', contract: 'Month-to-month', internet: 'DSL', payment: 'Mailed check', tenure: 2, monthly: 53.85, churn: true, risk: 86, reason: 'Competitor made better offer' },
  { id: '9237-HQITU', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Electronic check', tenure: 2, monthly: 70.7, churn: true, risk: 67, reason: 'Moved' },
  { id: '9305-CDSKC', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Electronic check', tenure: 8, monthly: 99.65, churn: true, risk: 86, reason: 'Moved' },
  { id: '7892-POOKP', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Electronic check', tenure: 28, monthly: 104.8, churn: true, risk: 84, reason: 'Moved' },
  { id: '0280-XJGEX', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Bank transfer', tenure: 49, monthly: 103.7, churn: true, risk: 89, reason: 'Competitor had better devices' },
  { id: '4190-MFLUW', contract: 'Month-to-month', internet: 'DSL', payment: 'Credit card', tenure: 10, monthly: 55.2, churn: true, risk: 78, reason: 'Higher download speeds' },
  { id: '5248-YGIJN', contract: 'Two year', internet: 'DSL', payment: 'Credit card', tenure: 72, monthly: 90.25, churn: false, risk: 12, reason: 'Stable account' },
  { id: '3655-SNQYZ', contract: 'Two year', internet: 'Fiber optic', payment: 'Credit card', tenure: 69, monthly: 113.25, churn: false, risk: 9, reason: 'Stable account' },
]

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Churn analysis', icon: BarChart3 },
  { label: 'Customer explorer', icon: Users },
  { label: 'Risk analysis', icon: Gauge },
  { label: 'Retention advisor', icon: BrainCircuit },
  { label: 'Reports', icon: FileText },
]

function RiskPill({ risk }: { risk: number }) {
  const high = risk >= 70
  const medium = risk >= 35 && risk < 70
  return <span className={`risk-pill ${high ? 'high' : medium ? 'medium' : 'low'}`}>{high ? 'High' : medium ? 'Medium' : 'Low'} · {risk}%</span>
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(customers[0])
  const [advisorOpen, setAdvisorOpen] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const filtered = useMemo(() => customers.filter((customer) => customer.id.toLowerCase().includes(query.toLowerCase())), [query])

  async function getAdvice() {
    setAiLoading(true)
    setAdvisorOpen(true)
    try {
      const response = await fetch('/api/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: selected }) })
      const data = await response.json()
      setAiText(data.text || 'No recommendation returned.')
    } catch {
      setAiText('Unable to connect to the advisor right now. Use the account signals above to prioritize a contract review, pricing check, and service follow-up.')
    } finally { setAiLoading(false) }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Activity size={18} /></div><span>signal<span className="brand-dot">.</span></span></div>
        <div className="workspace-label">RETENTION INTELLIGENCE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {nav.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => { setActive(label); setMobileOpen(false) }}><Icon size={17} /><span>{label}</span>{label === 'Retention advisor' && <span className="nav-badge">AI</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="model-card"><div className="model-icon"><Sparkles size={15} /></div><div><strong>Explainable AI</strong><span>flint-v1.0 · OpenRouter</span></div><span className="status-dot" /></div><button className="nav-item"><Settings2 size={17} /><span>Settings</span></button><div className="profile"><div className="avatar">AR</div><div><strong>Alex Rivera</strong><span>Data strategist</span></div><ChevronDown size={15} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{active}</strong></div><div className="top-actions"><span className="live-dot" /> <span className="live-label">Live dataset</span><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button><button className="avatar small">AR</button></div></header>

        <div className="page-wrap">
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> MONDAY, NOVEMBER 04, 2024</div><h1>Good morning, Alex<span className="heading-accent">.</span></h1><p>Here&apos;s what&apos;s happening across your customer base.</p></div><button className="export-btn"><Download size={16} /> Export report</button></div>

          <section className="kpi-grid" aria-label="Key performance indicators">
            {[['Total customers', '7,043', '+4.8%', 'users'], ['Churned customers', '1,869', '+2.1%', 'alert'], ['Churn rate', '26.5%', '-1.4%', 'rate'], ['Avg. monthly charge', '$64.76', '+3.2%', 'money']].map(([label, value, delta, icon]) => <div className="kpi-card" key={label}><div className="kpi-top"><span>{label}</span><div className={`kpi-icon ${icon}`}><Gauge size={16} /></div></div><div className="kpi-value">{value}</div><div className={`kpi-delta ${delta.startsWith('-') ? 'positive' : ''}`}><ArrowUpRight size={13} /> {delta} <span>vs last month</span></div></div>)}
          </section>

          <div className="content-grid">
            <section className="panel trend-panel"><div className="panel-heading"><div><h2>Churn overview</h2><p>Customer movement over the last 12 months</p></div><button className="select-button">Last 12 months <ChevronDown size={14} /></button></div><div className="trend-chart"><div className="y-labels"><span>800</span><span>600</span><span>400</span><span>200</span><span>0</span></div><div className="chart-area"><div className="grid-lines"><i /><i /><i /><i /><i /></div><svg className="chart-svg" viewBox="0 0 700 205" preserveAspectRatio="none" aria-label="Churn trend chart"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ff816d" stopOpacity=".24" /><stop offset="100%" stopColor="#ff816d" stopOpacity="0" /></linearGradient></defs><path d="M0,172 C35,165 42,130 78,148 S120,130 158,142 S205,130 235,118 S270,132 300,120 S347,96 382,112 S416,105 450,88 S490,104 525,80 S562,62 594,78 S635,46 700,54 L700,205 L0,205 Z" fill="url(#fill)" /><path d="M0,172 C35,165 42,130 78,148 S120,130 158,142 S205,130 235,118 S270,132 300,120 S347,96 382,112 S416,105 450,88 S490,104 525,80 S562,62 594,78 S635,46 700,54" fill="none" stroke="#ff816d" strokeWidth="3" /></svg><div className="x-labels"><span>Dec</span><span>Feb</span><span>Apr</span><span>Jun</span><span>Aug</span><span>Oct</span></div></div></div><div className="chart-legend"><span><i className="legend-dot churn" /> Churned</span><span><i className="legend-dot retained" /> Retained</span><span className="chart-insight"><Sparkles size={13} /> Churn accelerated 8.2% in the last 30 days</span></div></section>

            <section className="panel risk-panel"><div className="panel-heading"><div><h2>Risk distribution</h2><p>Based on model predictions</p></div><button className="icon-button"><Download size={16} /></button></div><div className="risk-ring-wrap"><div className="risk-ring"><div><strong>26.5%</strong><span>at risk</span></div></div></div><div className="risk-breakdown"><div><i className="risk-bar high" /><span>High risk</span><strong>1,104 <small>15.7%</small></strong></div><div><i className="risk-bar medium" /><span>Medium risk</span><strong>765 <small>10.9%</small></strong></div><div><i className="risk-bar low" /><span>Low risk</span><strong>5,174 <small>73.4%</small></strong></div></div><button className="full-link" onClick={() => setActive('Risk analysis')}>View risk analysis <ArrowUpRight size={14} /></button></section>
          </div>

          <div className="content-grid lower"><section className="panel factors-panel"><div className="panel-heading"><div><h2>What&apos;s driving churn?</h2><p>Top contributing factors from current dataset</p></div><span className="info-label"><CircleHelp size={14} /> Explainable model</span></div><div className="factor-list">{[['Month-to-month contract', 78, 'Contract flexibility'], ['Electronic check payments', 64, 'Payment friction'], ['Fiber optic service', 51, 'Service experience'], ['High monthly charges', 43, 'Price sensitivity']].map(([label, value, detail]) => <div className="factor-row" key={label as string}><div className="factor-meta"><div><strong>{label}</strong><span>{detail}</span></div><b>{value}%</b></div><div className="factor-track"><i style={{ width: `${value}%` }} /></div></div>)}</div><button className="full-link" onClick={() => setActive('Churn analysis')}>Explore all factors <ArrowUpRight size={14} /></button></section>

            <section className="panel priority-panel"><div className="panel-heading"><div><h2>Retention priorities</h2><p>Accounts requiring attention today</p></div><span className="priority-count">12 new</span></div><div className="priority-list">{customers.slice(0, 4).map((customer) => <button className="priority-row" key={customer.id} onClick={() => { setSelected(customer); setAdvisorOpen(true) }}><div className="priority-avatar">{customer.id.slice(0, 2)}</div><div className="priority-info"><strong>{customer.id}</strong><span>{customer.contract} · {customer.tenure} mo.</span></div><RiskPill risk={customer.risk} /><ArrowUpRight size={15} /></button>)}</div><button className="full-link" onClick={() => setActive('Customer explorer')}>See all priority accounts <ArrowUpRight size={14} /></button></section></div>

          <section className="panel explorer-panel"><div className="panel-heading explorer-heading"><div><h2>Customer explorer</h2><p>Search and inspect account-level churn signals</p></div><div className="explorer-actions"><div className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer ID" aria-label="Search customer ID" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</div><button className="filter-btn"><Filter size={15} /> Filters <span>2</span></button></div></div><div className="table-wrap"><table><thead><tr><th>Customer ID</th><th>Contract</th><th>Internet service</th><th>Tenure</th><th>Monthly charge</th><th>Churn risk</th><th /></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.id} onClick={() => setSelected(customer)} className={selected.id === customer.id ? 'selected-row' : ''}><td><strong>{customer.id}</strong></td><td>{customer.contract}</td><td>{customer.internet}</td><td>{customer.tenure} months</td><td>${customer.monthly.toFixed(2)}</td><td><RiskPill risk={customer.risk} /></td><td><button className="row-more" onClick={(event) => { event.stopPropagation(); setSelected(customer); setAdvisorOpen(true) }}><BrainCircuit size={15} /></button></td></tr>)}</tbody></table></div></section>

          <section className="advisor-banner"><div className="advisor-orb"><Bot size={22} /></div><div><div className="advisor-label"><Sparkles size={13} /> AI retention advisor</div><h2>Turn signals into action.</h2><p>Get an explainable retention plan for any customer in seconds.</p></div><div className="advisor-spacer" /><button className="advisor-btn" onClick={getAdvice}>Analyze selected customer <ArrowUpRight size={16} /></button></section>
        </div>
      </main>
      {advisorOpen && <div className="drawer-backdrop" onClick={() => setAdvisorOpen(false)}><aside className="advisor-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><div className="advisor-label"><Sparkles size={13} /> Explainable AI</div><h2>Retention advisor</h2></div><button className="icon-button" onClick={() => setAdvisorOpen(false)} aria-label="Close"><X size={18} /></button></div><div className="drawer-customer"><div className="priority-avatar">{selected.id.slice(0, 2)}</div><div><strong>{selected.id}</strong><span>{selected.contract} · {selected.internet} · {selected.tenure} months</span></div><RiskPill risk={selected.risk} /></div><div className="drawer-section"><span className="section-kicker">RISK SUMMARY</span><div className="summary-box"><AlertTriangle size={18} /><p>This account shows a <strong>{selected.risk >= 70 ? 'high' : 'moderate'} likelihood of churn</strong> based on contract type, tenure, and current service signals.</p></div></div><div className="drawer-section"><span className="section-kicker">KEY SIGNALS</span><ul className="signal-list"><li><span>Contract</span><strong>{selected.contract} <em>high impact</em></strong></li><li><span>Monthly charge</span><strong>${selected.monthly.toFixed(2)} <em>medium impact</em></strong></li><li><span>Payment method</span><strong>{selected.payment} <em>medium impact</em></strong></li></ul></div><div className="drawer-section"><span className="section-kicker">RETENTION PLAN</span>{aiLoading ? <div className="loading-state"><Sparkles size={18} /> Generating explainable recommendations…</div> : aiText ? <div className="ai-result">{aiText}</div> : <div className="recommendation"><div className="recommendation-icon"><ShieldCheck size={17} /></div><div><strong>Offer a contract incentive</strong><p>Present a 3-month loyalty discount and a long-term plan with added benefits.</p></div></div>}</div>{!aiText && !aiLoading && <button className="drawer-cta" onClick={getAdvice}><Sparkles size={16} /> Generate personalized plan</button>}</aside></div>}
    </div>
  )
}
