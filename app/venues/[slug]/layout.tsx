import type { ReactNode } from "react";

export default function VenueDetailLayout({ children }: { children: ReactNode }) {
  // Render children directly; pages control their own widths/padding.
  return <>{children}</>;
}
