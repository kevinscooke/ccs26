'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function TopNav() {
  const [open, setOpen] = useState(false);
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
    <header className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/40 sticky top-0 z-50">
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
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
            >
              Charlotte Events
              <span className="ml-2 inline-block align-middle">▾</span>
            </button>
            {open && (
              <div
                ref={menuRef}
                role="menu"
                className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-soft p-2"
              >
                <Link
                  href="/events"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2 text-zinc-100 hover:bg-zinc-800"
                  onClick={() => setOpen(false)}
                >
                  All Charlotte Events
                </Link>
                <Link
                  href="/weekly-car-show-list-charlotte"
                  role="menuitem"
                  className="block rounded-xl px-3 py-2 text-zinc-100 hover:bg-zinc-800"
                  onClick={() => setOpen(false)}
                >
                  Weekly Car Show List (Charlotte)
                </Link>
              </div>
            )}
          </div>

          <Link href="/resources" className="ccs-btn">Resources</Link>
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
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/90">
          <nav className="container py-2 flex flex-col gap-2">
            <Link href="/events" className="ccs-btn" onClick={() => setMobileOpen(false)}>
              All Charlotte Events
            </Link>
            <Link href="/weekly-car-show-list-charlotte" className="ccs-btn" onClick={() => setMobileOpen(false)}>
              Weekly Car Show List (Charlotte)
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
