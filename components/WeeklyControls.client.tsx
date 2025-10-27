"use client";

import { Tab } from "@headlessui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useMemo } from "react";

const tabs = [
  { label: "The List", href: "/events/" },
  { label: "This Week", href: "/weekly-car-show-list-charlotte/" },
];

export default function WeeklyControls() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const params = useSearchParams();

  const selectedIndex = useMemo(() => {
    if (pathname.startsWith("/weekly-car-show-list-charlotte")) return 1;
    if (pathname.startsWith("/daily")) return 2;
    return 0;
  }, [pathname]);

  const preserveQuery = false;

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(idx) => {
        const base = tabs[idx].href;
        const next = preserveQuery && params?.size ? `${base}?${params.toString()}` : base;
        router.push(next);
      }}
    >
      <Tab.List
        aria-label="View selector"
        className="inline-flex gap-1 rounded-xl border border-zinc-200 bg-white p-1 shadow-sm"
      >
        {tabs.map((t) => (
          <Tab as={Fragment} key={t.href}>
            {({ selected }) => (
              <button
                type="button"
                className={[
                  "px-3.5 py-1.5 text-sm font-medium rounded-lg outline-none transition",
                  "focus-visible:ring-2 focus-visible:ring-green-600/30",
                  selected ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-50",
                ].join(" ")}
              >
                {t.label}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="sr-only">
        <Tab.Panel />
        <Tab.Panel />
        <Tab.Panel />
      </Tab.Panels>
    </Tab.Group>
  );
}