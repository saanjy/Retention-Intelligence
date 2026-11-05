import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { customer } = await request.json()
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return NextResponse.json({ text: 'Add OPENROUTER_API_KEY in your project environment to enable live explainable recommendations. The local signal summary remains available.' }, { status: 200 })

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://v0.app', 'X-Title': 'Signal retention intelligence' },
    body: JSON.stringify({ model: 'recursive/flint-v1.0:free', temperature: 0.3, max_tokens: 500, messages: [{ role: 'system', content: 'You are an explainable telecom retention advisor. Return a concise plain-text action plan with headings: WHY THIS ACCOUNT IS AT RISK, RECOMMENDED ACTIONS, PRIORITY. Be clear that this is advisory, not a verified cause.' }, { role: 'user', content: `Analyze this customer record: ${JSON.stringify(customer)}` }] }),
  })
  if (!response.ok) return NextResponse.json({ text: 'The advisor service is temporarily unavailable. Review the displayed signals and prioritize a contract incentive, pricing review, and service follow-up.' }, { status: 200 })
  const json = await response.json()
  return NextResponse.json({ text: json.choices?.[0]?.message?.content || 'No recommendation returned.' })
}
