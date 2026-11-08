'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import customerData from '../../public/data/customer-data.json'

const customers = customerData as Customer[]

type Customer = {
  id: string
  contract: string
  internet: string
  payment: string
  tenure: string | number
  monthly: number
  churn: boolean
  risk: number
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

function riskLabel(risk: number) {
  return risk >= 70 ? 'High' : risk >= 40 ? 'Medium' : 'Low'
}

export default function CustomersPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0])
  const pageSize = 50
  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return customers
    return customers.filter((customer) => Object.values(customer).some((value) => String(value).toLowerCase().includes(normalizedQuery)))
  }, [query])
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
  const visibleCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize)

  return (
    <main className="records-page">
      <header className="records-header">
        <div>
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to overview</Link>
          <span className="eyebrow">CUSTOMER EXPLORER</span>
          <h1>All customer records</h1>
          <p>Complete account-level details from the uploaded ChurnIQ telecom survey.</p>
        </div>
        <div className="records-total"><strong>{filteredCustomers.length}</strong><span>of {customers.length} records</span></div>
      </header>

      <section className="records-panel" aria-labelledby="records-title">
        <div className="records-toolbar">
          <div><h2 id="records-title">Customer records</h2><p>Search across IDs, providers, plans, states, issues, and survey responses.</p></div>
          <div className="search-box records-search"><Search size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search all customer data" aria-label="Search all customer data" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</div>
        </div>
        <div className="records-table-wrap">
          <table>
            <thead><tr><th>Customer ID</th><th>Provider</th><th>State</th><th>Plan</th><th>Payment</th><th>Tenure</th><th>Monthly spend</th><th>Satisfaction</th><th>Risk</th><th>Biggest problem</th></tr></thead>
            <tbody>{visibleCustomers.map((customer) => <tr key={customer.id} onClick={() => setSelectedCustomer(customer)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedCustomer(customer) } }} role="button" tabIndex={0} className={selectedCustomer?.id === customer.id ? 'record-selected' : ''}><td data-label="Customer ID"><strong className="record-value">{customer.id}</strong></td><td data-label="Provider"><span className="record-value">{customer.provider}</span></td><td data-label="State"><span className="record-value">{customer.state}</span></td><td data-label="Plan"><span className="record-value">{customer.contract}</span></td><td data-label="Payment"><span className="record-value">{customer.payment}</span></td><td data-label="Tenure"><span className="record-value">{customer.tenure} mo.</span></td><td data-label="Monthly spend"><span className="record-value">₹{customer.monthly.toLocaleString('en-IN')}</span></td><td data-label="Satisfaction"><span className="record-value">{customer.satisfaction} / 5</span></td><td data-label="Risk"><span className={`record-risk record-value ${riskLabel(customer.risk).toLowerCase()}`}>{riskLabel(customer.risk)} · {customer.risk}%</span></td><td data-label="Biggest problem" className="problem-cell"><span className="record-value">{customer.issue || 'No issue recorded'}</span></td></tr>)}</tbody>
          </table>
        </div>
        <div className="records-pagination" aria-label="Customer record pages"><span>Showing {filteredCustomers.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredCustomers.length)} of {filteredCustomers.length}</span><div><button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Previous page"><ChevronLeft size={16} /></button><strong>Page {page} of {totalPages}</strong><button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} aria-label="Next page"><ChevronRight size={16} /></button></div></div>
      </section>
      {selectedCustomer && <section className="customer-analysis-panel" aria-labelledby="customer-analysis-title"><div className="analysis-heading"><div><span className="eyebrow">CUSTOMER ANALYSIS</span><h2 id="customer-analysis-title">{selectedCustomer.id}</h2><p>Complete account description and retention recommendation for this customer.</p></div><span className={`record-risk ${riskLabel(selectedCustomer.risk).toLowerCase()}`}>{riskLabel(selectedCustomer.risk)} risk · {selectedCustomer.risk}%</span></div><div className="analysis-grid"><div><span>Provider</span><strong>{selectedCustomer.provider}</strong></div><div><span>State</span><strong>{selectedCustomer.state}</strong></div><div><span>Plan</span><strong>{selectedCustomer.contract}</strong></div><div><span>Payment</span><strong>{selectedCustomer.payment}</strong></div><div><span>Tenure</span><strong>{selectedCustomer.tenure} months</strong></div><div><span>Monthly spend</span><strong>₹{selectedCustomer.monthly.toLocaleString('en-IN')}</strong></div><div><span>Satisfaction</span><strong>{selectedCustomer.satisfaction} / 5</strong></div><div><span>Network rating</span><strong>{selectedCustomer.networkRating} / 5</strong></div><div><span>Age / gender</span><strong>{selectedCustomer.age} · {selectedCustomer.gender}</strong></div><div><span>Continue likelihood</span><strong>{selectedCustomer.continueLikelihood}%</strong></div><div className="analysis-wide"><span>Biggest problem</span><strong>{selectedCustomer.issue || 'No issue recorded'}</strong></div><div className="analysis-wide retention-analysis"><span>Retention analysis</span><strong>{selectedCustomer.improvement || 'Continue proactive retention outreach.'}</strong><small>{selectedCustomer.churn ? 'This account is likely to churn without intervention.' : 'This account shows room for stronger retention and engagement.'}</small></div></div></section>}
    </main>
  )
}
