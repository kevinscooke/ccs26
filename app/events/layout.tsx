import type { ReactNode } from "react";

export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="container py-6">{children}</div>
    </div>
  );
}
