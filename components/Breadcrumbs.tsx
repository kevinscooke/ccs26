import React from "react";
import Link from "next/link";

export default function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string; current?: boolean }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[var(--fg)]/60 mb-0">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((it, i) => {
          const isLast = i === items.length - 1 || it.current;
          return (
            <li key={i}>
              {it.href && !isLast ? (
                <Link href={it.href} className="hover:underline text-[var(--fg)]">
                  {it.label}
                </Link>
              ) : isLast && it.href ? (
                <span aria-current="page" className="text-[var(--fg)]/80">
                  {it.label}
                </span>
              ) : it.href ? (
                <Link href={it.href} className="hover:underline text-[var(--fg)]">
                  {it.label}
                </Link>
              ) : (
                <span className={isLast ? "text-[var(--fg)]/80" : ""}>{it.label}</span>
              )}
              {!isLast && <span aria-hidden="true" className="mx-1">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}