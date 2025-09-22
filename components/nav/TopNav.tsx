'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function TopNav() {
  // open: false | 'events' | 'resources'
  const [open, setOpen] = useState<false | 'events' | 'resources'>(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current || !btnRef.current) return;
      const t = e.target as Node;
      if (menuRef.current.contains(t) || btnRef.current.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Close on escape
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setMobileOpen(false); }
    }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">Charlotte Car Shows</span>
        </Link>

        {/* Desktop nav */}
  <nav className="hidden md:flex items-center gap-2">
          {/* Charlotte Events with dropdown */}
          <div className="relative">
            <button
              ref={btnRef}
              type="button"
              className="ccs-btn"
              aria-haspopup="menu"
              aria-expanded={open === 'events'}
              onClick={() => setOpen(open === 'events' ? false : 'events')}
            >
              Charlotte Events
              <span className="ml-2 inline-block align-middle">▾</span>
            </button>
            {open === 'events' && (
              <div
                ref={menuRef}
                role="menu"
                className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white shadow-lg p-2"
              >
                <Link
                  href="/events/"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2 text-[var(--fg)] hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  onClick={() => setOpen(false)}
                >
                  All Charlotte Events
                </Link>
                <Link
                  href="/weekly-car-show-list-charlotte/"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2 text-[var(--fg)] hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  onClick={() => setOpen(false)}
                >
                  Weekly Car Show List (Charlotte)
                </Link>
              </div>
            )}
          </div>

          {/* Resources dropdown (button-based, matches Events) */}
          <div className="relative">
            <button
              type="button"
              className="ccs-btn"
              aria-haspopup="menu"
              aria-expanded={open === 'resources'}
              onClick={() => setOpen(open === 'resources' ? false : 'resources')}
            >
              Resources
              <span className="ml-2 inline-block align-middle">▾</span>
            </button>
            {open === 'resources' && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-zinc-200 bg-white shadow-lg p-2"
              >
                <Link
                  href="/guide-to-charlotte-car-shows"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2 text-[var(--fg)] hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  onClick={() => setOpen(false)}
                >
                  Guide to Charlotte Car Shows
                </Link>
                <Link
                  href="/resources"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2 text-[var(--fg)] hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                  onClick={() => setOpen(false)}
                >
                  All Resources
                </Link>
              </div>
            )}
          </div>
          <Link href="/pricing" className="ccs-btn">Pricing</Link>
          <Link href="/contact" className="ccs-btn">Contact</Link>
        </nav>

        {/* Mobile: simple menu button */}
        <button
          className="md:hidden ccs-btn"
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
            <Link href="/events/" className="ccs-btn" onClick={() => setMobileOpen(false)}>
              All Charlotte Events
            </Link>
            <Link href="/weekly-car-show-list-charlotte" className="ccs-btn" onClick={() => setMobileOpen(false)}>
              Weekly Car Show List (Charlotte)
            </Link>
            <Link href="/guide-to-charlotte-car-shows" className="ccs-btn" onClick={() => setMobileOpen(false)}>
              Guide to Charlotte Car Shows
            </Link>
            <Link href="/resources" className="ccs-btn" onClick={() => setMobileOpen(false)}>Resources</Link>
            <Link href="/pricing" className="ccs-btn" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/contact" className="ccs-btn" onClick={() => setMobileOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
