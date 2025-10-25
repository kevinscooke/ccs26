import Link from "next/link";
import { cn } from "@/lib/utils";

export function SearchForm({
  initialQuery = "",
  className,
}: {
  initialQuery?: string;
  className?: string;
}) {
  return (
    <form action="/search" method="get" className={cn("relative", className)}>
      <label htmlFor="q" className="sr-only">
        Search events and venues
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={initialQuery}
        placeholder="Search events or venues"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      />
      <div className="mt-2 text-[11px] text-gray-500">
        Try “cars and coffee” or a venue name
      </div>
    </form>
  );
}