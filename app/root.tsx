import type { ReactNode } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import '../src/index.css'
import { SmoothScrollProvider } from '../src/components/SmoothScrollProvider'

export const meta = () => [
  { title: 'B-1-O — Developer + Geek' },
  { name: 'description', content: 'Erik Ghabuzyan — frontend developer, interface obsessive and late-night builder.' },
  { name: 'theme-color', content: '#050505' },
]

export function Layout({ children }: { children: ReactNode }) {
  return <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
    </body>
  </html>
}

export default function Root() {
  return <SmoothScrollProvider><Outlet /></SmoothScrollProvider>
}

export function HydrateFallback() {
  return <main className="boot-screen" aria-label="Loading portfolio">
    <span className="boot-screen__mark">b.</span>
    <p>INITIALIZING / B-1-O</p>
    <div className="boot-screen__rule"><span /></div>
  </main>
}
