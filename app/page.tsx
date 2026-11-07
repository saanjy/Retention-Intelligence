'use client'

import { useEffect, useMemo, useState } from 'react'
import surveySummary from '../public/data/survey-summary.json'
import customerData from '../public/data/customer-data.json'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CircleHelp,
  ChevronDown,
  Download,
  Filter,
  Gauge,
  LayoutDashboard,
  Menu,
  Search,
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
  tenure: number | string
  monthly: number
  churn: boolean
  risk: number
  reason: string
  provider: string
  state: string
  satisfaction: number
  issue: string
  age: string
  gender: string
  networkRating: number
  continueLikelihood: number
  improvement: string
}

const featuredCustomers = [
  { id: '3668-QPYBK', contract: 'Month-to-month', internet: 'DSL', payment: 'Mailed check', tenure: 2, monthly: 53.85, churn: true, risk: 86, reason: 'Competitor made better offer' },
  { id: '9237-HQITU', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Electronic check', tenure: 2, monthly: 70.7, churn: true, risk: 67, reason: 'Moved' },
  { id: '9305-CDSKC', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Electronic check', tenure: 8, monthly: 99.65, churn: true, risk: 86, reason: 'Moved' },
  { id: '7892-POOKP', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Electronic check', tenure: 28, monthly: 104.8, churn: true, risk: 84, reason: 'Moved' },
  { id: '0280-XJGEX', contract: 'Month-to-month', internet: 'Fiber optic', payment: 'Bank transfer', tenure: 49, monthly: 103.7, churn: true, risk: 89, reason: 'Competitor had better devices' },
  { id: '4190-MFLUW', contract: 'Month-to-month', internet: 'DSL', payment: 'Credit card', tenure: 10, monthly: 55.2, churn: true, risk: 78, reason: 'Higher download speeds' },
  { id: '5248-YGIJN', contract: 'Two year', internet: 'DSL', payment: 'Credit card', tenure: 72, monthly: 90.25, churn: false, risk: 12, reason: 'Stable account' },
  { id: '3655-SNQYZ', contract: 'Two year', internet: 'Fiber optic', payment: 'Credit card', tenure: 69, monthly: 113.25, churn: false, risk: 9, reason: 'Stable account' },
]

const allCustomers = customerData as Customer[]

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Churn analysis', icon: BarChart3 },
  { label: 'Customer explorer', icon: Users },
  { label: 'Risk analysis', icon: Gauge },
  { label: 'Retention advisor', icon: BrainCircuit },
]

const sectionIds: Record<string, string> = {
  Overview: 'overview',
  'Churn analysis': 'churn-analysis',
  'Customer explorer': 'customer-explorer',
  'Risk analysis': 'risk-analysis',
    'Retention advisor': 'retention-advisor',
}

function RiskPill({ risk }: { risk: number }) {
  const high = risk >= 70
  const medium = risk >= 35 && risk < 70
  return <span className={`risk-pill ${high ? 'high' : medium ? 'medium' : 'low'}`}>{high ? 'High' : medium ? 'Medium' : 'Low'} · {risk}%</span>
}

export default function Page() {
  const [active, setActive] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(allCustomers[0])
  const [advisorOpen, setAdvisorOpen] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [greeting, setGreeting] = useState('Good morning')
  const [today, setToday] = useState('')

  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
    setToday(new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now))
  }, [])

  function selectCustomer(customer: Customer, openAdvisor = false) {
    setSelected(customer)
    setAiText('')
    setAiLoading(false)
    if (openAdvisor) setAdvisorOpen(true)
  }

  function navigateTo(label: string) {
    if (label === 'Customer explorer') {
      window.location.href = '/customers'
      return
    }
    setActive(label)
    setMobileOpen(false)
    if (label === 'Retention advisor') {
      setAdvisorOpen(true)
      return
    }
    document.getElementById(sectionIds[label])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function exportReport(format: 'csv' | 'pdf') {
    const headers = ['Customer ID', 'Contract', 'Internet service', 'Payment method', 'Tenure months', 'Monthly charge', 'Churn risk']
    const rows = [headers, ...allCustomers.map((customer) => [customer.id, customer.contract, customer.internet, customer.payment, String(customer.tenure), `₹${customer.monthly.toFixed(2)}`, `${customer.risk}%`])]
    if (format === 'csv') {
      const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = url
      link.download = 'signal-retention-report.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      return
    }
    const reportWindow = window.open('', '_blank')
    if (!reportWindow) return
    const tableRows = rows.slice(1).map((row) => `<tr>${row.map((value) => `<td>${value}</td>`).join('')}</tr>`).join('')
    reportWindow.document.write(`<html><head><title>Signal retention report</title><style>body{font:12px Arial;color:#102a3a;padding:24px}h1{font-size:22px}p{color:#607985}table{border-collapse:collapse;width:100%}th,td{border:1px solid #d8e3e2;padding:6px;text-align:left}th{background:#edf6f4}@media print{body{padding:0}}</style></head><body><h1>Signal retention report</h1><p>${allCustomers.length} customer records · Generated ${new Date().toLocaleDateString()}</p><table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table><script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}</script></body></html>`)
    reportWindow.document.close()
  }

  const filtered = useMemo(() => allCustomers.filter((customer) => customer.id.toLowerCase().includes(query.toLowerCase())), [query])

  async function getAdvice() {
    setAiLoading(true)
    setAdvisorOpen(true)
    try {
      const response = await fetch('/api/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer: selected }) })
      const data = await response.json()
      setAiText(data.text || `Prioritize a ${selected.contract.toLowerCase()} contract review, address the ${selected.payment.toLowerCase()} payment experience, and follow up on ${selected.internet.toLowerCase()} service quality.`)
    } catch {
      setAiText('Unable to connect to the advisor right now. Use the account signals above to prioritize a contract review, pricing check, and service follow-up.')
    } finally { setAiLoading(false) }
  }

  return (
    <div className="app-shell" id="reports">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Activity size={18} /></div><span>signal<span className="brand-dot">.</span></span></div>
        <div className="workspace-label">RETENTION INTELLIGENCE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {nav.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => navigateTo(label)}><Icon size={17} /><span>{label}</span>{label === 'Retention advisor' && <span className="nav-badge">AI</span>}</button>)}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{active}</strong></div></header>

        <div className="page-wrap" id="overview">
          <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> {today || 'Today'}</div><h1>{greeting}, user<span className="heading-accent">.</span></h1><p>Here&apos;s what&apos;s happening across your customer base.</p></div><div className="export-wrap"><button className="export-btn" onClick={() => setExportOpen((open) => !open)} aria-expanded={exportOpen}><Download size={16} /> Export report <ChevronDown size={14} /></button>{exportOpen && <div className="export-menu" role="menu"><button role="menuitem" onClick={() => { exportReport('csv'); setExportOpen(false) }}>Download CSV</button><button role="menuitem" onClick={() => { exportReport('pdf'); setExportOpen(false) }}>Print / Save PDF</button></div>}</div></div>

          <section className="kpi-grid" aria-label="Key performance indicators">
            {[['Total customers', '7,043', '+4.8%', 'users'], ['Churned customers', '1,869', '+2.1%', 'alert'], ['Churn rate', '26.5%', '-1.4%', 'rate'], ['Avg. monthly charge', '₹300', '+3.2%', 'money']].map(([label, value, delta, icon]) => <div className="kpi-card" key={label}><div className="kpi-top"><span>{label}</span><div className={`kpi-icon ${icon}`}><Gauge size={16} /></div></div><div className="kpi-value">{value}</div><div className={`kpi-delta ${delta.startsWith('-') ? 'positive' : ''}`}><ArrowUpRight size={13} /> {delta} <span>vs last month</span></div></div>)}
          </section>

          <section className="panel survey-pulse" aria-labelledby="survey-pulse-title">
            <div className="panel-heading"><div><h2 id="survey-pulse-title">India survey pulse</h2><p>{surveySummary.records} responses from the expanded ChurnIQ telecom survey</p></div><span className="info-label"><Users size={14} /> Survey dataset</span></div>
            <div className="survey-metrics">
              <div><span>Leading provider</span><strong>{surveySummary.providers[0][0]}</strong><small>{surveySummary.providers[0][1]} responses</small></div>
              <div><span>Most common plan</span><strong>{surveySummary.plans[0][0]}</strong><small>{surveySummary.plans[0][1]} responses</small></div>
              <div><span>Top state</span><strong>{surveySummary.states[0][0]}</strong><small>{surveySummary.states[0][1]} responses</small></div>
              <div><span>Avg. satisfaction</span><strong>{(surveySummary.satisfaction.reduce((total, item) => total + Number(item[0]) * Number(item[1]), 0) / surveySummary.records).toFixed(1)} / 5</strong><small>weighted survey score</small></div>
            </div>
            <div className="survey-provider-list">{surveySummary.providers.map(([provider, count]) => <div key={provider}><span>{provider}</span><i><b style={{ width: `${(Number(count) / surveySummary.records) * 100}%` }} /></i><strong>{count}</strong></div>)}</div>
          </section>

          <div className="content-grid">
            <section className="panel trend-panel" id="churn-analysis"><div className="panel-heading"><div><h2>Churn overview</h2><p>Customer movement over the last 12 months</p></div><button className="select-button" aria-label="Open churn overview range">Overview <ChevronDown size={14} /></button></div><div className="trend-chart"><div className="y-labels"><span>800</span><span>600</span><span>400</span><span>200</span><span>0</span></div><div className="chart-area"><div className="grid-lines"><i /><i /><i /><i /><i /></div><svg className="chart-svg" viewBox="0 0 700 205" preserveAspectRatio="none" aria-label="Churn trend chart"><defs><linearGradient id="fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ff816d" stopOpacity=".24" /><stop offset="100%" stopColor="#ff816d" stopOpacity="0" /></linearGradient></defs><path d="M0,172 C35,165 42,130 78,148 S120,130 158,142 S205,130 235,118 S270,132 300,120 S347,96 382,112 S416,105 450,88 S490,104 525,80 S562,62 594,78 S635,46 700,54 L700,205 L0,205 Z" fill="url(#fill)" /><path d="M0,172 C35,165 42,130 78,148 S120,130 158,142 S205,130 235,118 S270,132 300,120 S347,96 382,112 S416,105 450,88 S490,104 525,80 S562,62 594,78 S635,46 700,54" fill="none" stroke="#ff816d" strokeWidth="3" /></svg><div className="x-labels"><span>Dec</span><span>Feb</span><span>Apr</span><span>Jun</span><span>Aug</span><span>Oct</span></div></div></div><div className="chart-legend"><span><i className="legend-dot churn" /> Churned</span><span><i className="legend-dot retained" /> Retained</span><span className="chart-insight"><Sparkles size={13} /> Churn accelerated 8.2% in the last 30 days</span></div></section>

            <section className="panel risk-panel" id="risk-analysis"><div className="panel-heading"><div><h2>Risk distribution</h2><p>Based on model predictions</p></div></div><div className="risk-ring-wrap"><div className="risk-ring"><div><strong>26.5%</strong><span>at risk</span></div></div></div><div className="risk-breakdown"><div><i className="risk-bar high" /><span>High risk</span><strong>1,104 <small>15.7%</small></strong></div><div><i className="risk-bar medium" /><span>Medium risk</span><strong>765 <small>10.9%</small></strong></div><div><i className="risk-bar low" /><span>Low risk</span><strong>5,174 <small>73.4%</small></strong></div></div><button className="full-link" onClick={() => setActive('Risk analysis')}>View risk analysis <ArrowUpRight size={14} /></button></section>
          </div>

          <div className="content-grid lower"><section className="panel factors-panel"><div className="panel-heading"><div><h2>What&apos;s driving churn?</h2><p>Top contributing factors from current dataset</p></div><span className="info-label"><CircleHelp size={14} /> Explainable model</span></div><div className="factor-list">{[['Month-to-month contract', 78, 'Contract flexibility'], ['Electronic check payments', 64, 'Payment friction'], ['Fiber optic service', 51, 'Service experience'], ['High monthly charges', 43, 'Price sensitivity']].map(([label, value, detail]) => <div className="factor-row" key={label as string}><div className="factor-meta"><div><strong>{label}</strong><span>{detail}</span></div><b>{value}%</b></div><div className="factor-track"><i style={{ width: `${value}%` }} /></div></div>)}</div><button className="full-link" onClick={() => setActive('Churn analysis')}>Explore all factors <ArrowUpRight size={14} /></button></section>

            <section className="panel priority-panel"><div className="panel-heading"><div><h2>Retention priorities</h2><p>Accounts requiring attention today</p></div><span className="priority-count">10 shown</span></div><div className="priority-list">{allCustomers.slice(0, 10).map((customer) => <button className="priority-row" key={customer.id} onClick={() => selectCustomer(customer, true)}><div className="priority-avatar">{customer.id.slice(0, 2)}</div><div className="priority-info"><strong>{customer.id}</strong><span>{customer.contract} · {customer.tenure} mo.</span></div><RiskPill risk={customer.risk} /><ArrowUpRight size={15} /></button>)}</div><button className="full-link" onClick={() => setActive('Customer explorer')}>See all priority accounts <ArrowUpRight size={14} /></button></section></div>

          <section className="panel explorer-panel" id="customer-explorer"><div className="panel-heading explorer-heading"><div><h2>Customer explorer</h2><p>Search and inspect account-level churn signals</p></div><div className="explorer-actions"><div className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer ID" aria-label="Search customer ID" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</div><button className="filter-btn"><Filter size={15} /> Filters <span>2</span></button></div></div><div className="table-wrap"><table><thead><tr><th>Customer ID</th><th>Contract</th><th>Internet service</th><th>Tenure</th><th>Monthly charge</th><th>Churn risk</th><th /></tr></thead><tbody>{filtered.slice(0, 10).map((customer) => <tr key={customer.id} onClick={() => selectCustomer(customer)} className={selected.id === customer.id ? 'selected-row' : ''}><td><strong>{customer.id}</strong></td><td>{customer.contract}</td><td>{customer.internet}</td><td>{customer.tenure} months</td><td>₹{customer.monthly.toLocaleString('en-IN')}</td><td><RiskPill risk={customer.risk} /></td><td><button className="row-more" onClick={(event) => { event.stopPropagation(); selectCustomer(customer, true) }}><BrainCircuit size={15} /></button></td></tr>)}</tbody></table></div><div className="customer-detail-card" aria-live="polite"><div className="customer-detail-heading"><div><span className="section-kicker">SELECTED CUSTOMER</span><h3>{selected.id}</h3></div><RiskPill risk={selected.risk} /></div><div className="customer-detail-grid"><div><span>Provider</span><strong>{selected.provider}</strong></div><div><span>State</span><strong>{selected.state}</strong></div><div><span>Plan</span><strong>{selected.contract}</strong></div><div><span>Monthly spend</span><strong>₹{selected.monthly.toLocaleString('en-IN')}</strong></div><div><span>Age / gender</span><strong>{selected.age} · {selected.gender}</strong></div><div><span>Satisfaction</span><strong>{selected.satisfaction} / 5</strong></div><div><span>Network rating</span><strong>{selected.networkRating} / 5</strong></div><div><span>Continue likelihood</span><strong>{selected.continueLikelihood} / 5</strong></div><div className="wide"><span>Biggest problem</span><strong>{selected.issue || 'No issue recorded'}</strong></div><div className="wide"><span>Requested improvement</span><strong>{selected.improvement || 'No improvement recorded'}</strong></div></div></div></section>

          <section className="advisor-banner" id="retention-advisor"><div className="advisor-orb"><Bot size={22} /></div><div><div className="advisor-label"><Sparkles size={13} /> AI retention advisor</div><h2>Turn signals into action.</h2><p>Get an explainable retention plan for any customer in seconds.</p></div><div className="advisor-spacer" /><button className="advisor-btn" onClick={getAdvice}>Analyze selected customer <ArrowUpRight size={16} /></button></section>
        </div>
      </main>
      {advisorOpen && <div className="drawer-backdrop" onClick={() => setAdvisorOpen(false)}><aside className="advisor-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><div className="advisor-label"><Sparkles size={13} /> Explainable AI</div><h2>Retention advisor</h2></div><button className="icon-button" onClick={() => setAdvisorOpen(false)} aria-label="Close"><X size={18} /></button></div><div className="drawer-customer"><div className="priority-avatar">{selected.id.slice(0, 2)}</div><div><strong>{selected.id}</strong><span>{selected.contract} · {selected.internet} · {selected.tenure} months</span></div><RiskPill risk={selected.risk} /></div><div className="drawer-section"><span className="section-kicker">RISK SUMMARY</span><div className="summary-box"><AlertTriangle size={18} /><p>This account shows a <strong>{selected.risk >= 70 ? 'high' : 'moderate'} likelihood of churn</strong> based on contract type, tenure, and current service signals.</p></div></div><div className="drawer-section"><span className="section-kicker">KEY SIGNALS</span><ul className="signal-list"><li><span>Contract</span><strong>{selected.contract} <em>high impact</em></strong></li><li><span>Monthly charge</span><strong>₹{selected.monthly.toLocaleString('en-IN')} <em>medium impact</em></strong></li><li><span>Payment method</span><strong>{selected.payment} <em>medium impact</em></strong></li></ul></div><div className="drawer-section"><span className="section-kicker">RETENTION PLAN</span>{aiLoading ? <div className="loading-state"><Sparkles size={18} /> Generating explainable recommendations…</div> : aiText ? <div className="ai-result">{aiText}</div> : <div className="recommendation"><div className="recommendation-icon"><ShieldCheck size={17} /></div><div><strong>{selected.contract === 'Month-to-month' ? 'Offer a contract incentive' : 'Protect the relationship'}</strong><p>{selected.contract === 'Month-to-month' ? `Offer a loyalty discount to move this ${selected.tenure}-month account to a longer-term plan.` : `Recognize this established account and address ${selected.reason.toLowerCase()} before it becomes a churn signal.`}</p></div></div>}</div>{!aiText && !aiLoading && <button className="drawer-cta" onClick={getAdvice}><Sparkles size={16} /> Generate personalized plan</button>}</aside></div>}
    </div>
  )
}
