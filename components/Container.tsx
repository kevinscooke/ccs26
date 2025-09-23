export default function Container({ children }: { children: React.ReactNode }) {
  // Container owns the centered max-width and vertical padding. Horizontal
  // gutters are provided by the root layout so we don't double-up px values
  // when Container is nested inside the app main.
  return <div className="mx-auto max-w-6xl py-6">{children}</div>;
}
