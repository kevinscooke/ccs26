import type { ReactNode } from "react";

export default function EventDetailLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="container py-6">{children}</div>
    </div>
  );
}
