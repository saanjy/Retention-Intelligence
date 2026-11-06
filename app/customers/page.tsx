'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
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
  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return customers
    return customers.filter((customer) => Object.values(customer).some((value) => String(value).toLowerCase().includes(normalizedQuery)))
  }, [query])

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
          <div className="search-box records-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all customer data" aria-label="Search all customer data" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</div>
        </div>
        <div className="records-table-wrap">
          <table>
            <thead><tr><th>Customer ID</th><th>Provider</th><th>State</th><th>Plan</th><th>Payment</th><th>Tenure</th><th>Monthly spend</th><th>Satisfaction</th><th>Risk</th><th>Biggest problem</th></tr></thead>
            <tbody>{filteredCustomers.map((customer) => <tr key={customer.id}><td><strong>{customer.id}</strong></td><td>{customer.provider}</td><td>{customer.state}</td><td>{customer.contract}</td><td>{customer.payment}</td><td>{customer.tenure} mo.</td><td>₹{customer.monthly.toLocaleString('en-IN')}</td><td>{customer.satisfaction} / 5</td><td><span className={`record-risk ${riskLabel(customer.risk).toLowerCase()}`}>{riskLabel(customer.risk)} · {customer.risk}%</span></td><td className="problem-cell">{customer.issue || 'No issue recorded'}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
