import React from "react";
import Link from "next/link";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string; current?: boolean }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-0">
      <ol className="inline-flex items-center gap-1 md:gap-2 flex-wrap">
        {items.map((it, i) => {
          const isLast = it.current ?? i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center">
              {i > 0 && (
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-[var(--fg)]/40 mx-1 md:mx-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              )}

              {!isLast && it.href ? (
                <Link
                  href={it.href}
                  className="inline-flex items-center hover:underline text-[var(--fg)]"
                >
                  {i === 0 && it.href === "/" && (
                    <svg
                      className="w-3 h-3 mr-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                  )}
                  <span className="font-medium">{it.label}</span>
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="inline-flex items-center text-[var(--fg)]/80"
                >
                  {i === 0 && it.href === "/" && (
                    <svg
                      className="w-3 h-3 mr-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                  )}
                  {it.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}