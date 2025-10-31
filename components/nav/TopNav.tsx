'use client';

import Link from 'next/link';
import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">Charlotte Car Shows</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Charlotte Events */}
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  aria-label="Open Charlotte Events menu"
                >
                  Charlotte Events
                  <svg
                    aria-hidden="true"
                    className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                  </svg>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg ring-1 ring-black/5 max-h-96 overflow-auto focus:outline-none"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/events/"
                          className={`block rounded-xl px-3 py-2 text-[var(--fg)] focus:outline-none ${active ? 'bg-zinc-100' : ''}`}
                        >
                          All Charlotte Events
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/weekly-car-show-list-charlotte/"
                          className={`block rounded-xl px-3 py-2 text-[var(--fg)] ${active ? 'bg-zinc-100' : ''}`}
                        >
                          Weekly Car Show List (Charlotte)
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/events/charlotte-auto-show/"
                          className={`block rounded-xl px-3 py-2 text-[var(--fg)] ${active ? 'bg-zinc-100' : ''}`}
                        >
                          Charlotte Auto Show
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/events/charlotte-autofair"
                          className={`block rounded-xl px-3 py-2 text-[var(--fg)] ${active ? 'bg-zinc-100' : ''}`}
                        >
                          Charlotte AutoFair
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          {/* Resources */}
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  aria-label="Open Resources menu"
                >
                  Resources
                  <svg
                    aria-hidden="true"
                    className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                  </svg>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg ring-1 ring-black/5 max-h-96 overflow-auto focus:outline-none"
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/guide-to-charlotte-car-shows"
                          className={`block rounded-xl px-3 py-2 text-[var(--fg)] ${active ? 'bg-zinc-100' : ''}`}
                        >
                          Guide to Charlotte Car Shows
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/resources"
                          className={`block rounded-xl px-3 py-2 text-[var(--fg)] ${active ? 'bg-zinc-100' : ''}`}
                        >
                          All Resources
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>

          <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Pricing</Link>
          <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30">Contact</Link>
        </nav>

        {/* Mobile: simple menu button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
        >
          Menu
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <nav className="container py-2 flex flex-col gap-2">
            <Link href="/events/" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>
              All Charlotte Events
            </Link>
            <Link href="/weekly-car-show-list-charlotte" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>
              Weekly Car Show List (Charlotte)
            </Link>
            <Link href="/events/charlotte-auto-show/" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>
              Charlotte Auto Show
            </Link>
            <Link href="/events/charlotte-autofair" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>
              Charlotte AutoFair
            </Link>
            <Link href="/guide-to-charlotte-car-shows" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>
              Guide to Charlotte Car Shows
            </Link>
            <Link href="/resources" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>Resources</Link>
            <Link href="/pricing" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl bg-gray-100 text-gray-900 px-4 py-2 text-sm font-semibold border border-gray-200 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-brand-500/30" onClick={() => setMobileOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
