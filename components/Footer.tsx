// components/Footer.tsx
import Link from "next/link";

const footerNav = {
  events: [
    { label: "All Events", href: "/events" },
    { label: "Car Shows Near Me", href: "/events?near=me" },
    { label: "Charlotte Auto Show", href: "/charlotte-auto-show" },
    { label: "Hornets Nest Auto Fest", href: "/hornets-nest-auto-fest" },
    { label: "Charlotte AutoFair", href: "/charlotte-autofair" },
    { label: "Local Flyers", href: "/local-flyers" },
  ],
  resources: [
    { label: "Car Show SEO", href: "https://carshowseo.com", external: true },
    { label: "Charlotte Stormwater", href: "https://charlottestormwater.com", external: true },
    { label: "Charlotte Trailer Rental", href: "https://clttrailerrental.com", external: true },
    { label: "Peoples Golf", href: "https://peoples.golf", external: true },
    { label: "Raleigh Car Shows", href: "https://raleighcarshows.com", external: true },
    { label: "Atlanta Car Shows", href: "https://charlottecarshows.com" /* placeholder if ATL site not live yet */, external: true },
    { label: "Redfin Blog", href: "https://www.redfin.com", external: true },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Promote Your Event", href: "/promote" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  social: [
    { label: "Facebook", href: "https://facebook.com/CharlotteCarShows", sr: "Visit us on Facebook" },
    { label: "Instagram", href: "https://instagram.com/charlottecarshows", sr: "Visit us on Instagram" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface text-text border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand + blurb */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">Charlotte Car Shows</span>
            </Link>
            <p className="mt-3 text-[17px] leading-relaxed text-text-muted">
              The #1 source for Charlotte-area car shows since 2016. Weekly lists, maps, and featured promotions to grow your event.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Charlotte Events">
            <h3 className="text-lg font-semibold mb-3">Charlotte Events</h3>
            <ul className="space-y-2">
              {footerNav.events.map((item) => (
                <li key={item.label}>
                  <FooterLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources / Sister sites */}
          <nav aria-label="Local Resources">
            <h3 className="text-lg font-semibold mb-3">Local Resources</h3>
            <ul className="space-y-2">
              {footerNav.resources.map((item) => (
                <li key={item.label}>
                  <FooterLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className="text-lg font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {footerNav.company.map((item) => (
                <li key={item.label}>
                  <FooterLink {...item} />
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="mt-6">
              <h4 className="text-base font-semibold mb-2">Follow</h4>
              <ul className="flex flex-wrap gap-3">
                {footerNav.social.map((s) => (
                  <li key={s.label}>
                    <a
                      className="inline-flex items-center rounded-lg px-3 py-2 border border-border hover:underline"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.sr}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} Charlotte Car Shows · Powered by{" "}
            <a className="underline" href="https://carshowseo.com" target="_blank" rel="noopener noreferrer">
              CarShowSEO
            </a>
          </p>
          <ul className="flex flex-wrap gap-4 text-sm">
            <li><Link href="/terms" className="hover:underline">Terms</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
            <li><Link href="/accessibility" className="hover:underline">Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const classes = "hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {label}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}
