import type { ReactNode } from "react";

export default function EventsLayout({ children }: { children: ReactNode }) {
  // Don't add an additional container here — pages under /events provide
  // their own max-width and padding. Leaving an extra ``container`` class
  // caused nested constraints and made the event pages narrower on small
  // screens compared to the weekly page. This layout simply renders
  // children directly so the pages control their own spacing.
  return <>{children}</>;
}
