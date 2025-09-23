import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans – Charlotte Car Shows",
  description: "Choose your plan to promote car shows and automotive events in Charlotte. Free listings and premium featured options available.",
  alternates: { canonical: "https://charlottecarshows.com/pricing" },
  openGraph: {
    title: "Event Promotion Plans – Charlotte Car Shows",
    description: "List your car show for free or boost visibility with premium features. Reach thousands of local car enthusiasts.",
    url: "https://charlottecarshows.com/pricing",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Event Promotion Plans – Charlotte Car Shows",
    description: "List your car show for free or boost visibility with premium features. Reach thousands of local car enthusiasts.",
  },
};

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for occasional event hosts and car enthusiasts.",
      features: [
        "Submit unlimited events",
        "Basic event listing",
        "Standard placement in search",
        "Access to community features",
        "Basic analytics"
      ],
      cta: "Get Started"
    },
    {
      name: "Featured Event",
      price: "$25",
      description: "Boost visibility for your special car show or meet.",
      features: [
        "Premium placement for 30 days",
        "Social media promotion",
        "Featured in newsletter",
        "Enhanced event page",
        "Priority support",
        "Detailed analytics"
      ],
      cta: "Feature Your Event",
      highlight: true
    },
    {
      name: "Organizer PRO",
      price: "Custom",
      description: "For frequent hosts and professional organizations.",
      features: [
        "Unlimited featured events",
        "Dedicated account manager",
        "Custom branding options",
        "Advanced analytics dashboard",
        "API access",
        "Premium support"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="space-y-16 py-8" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          Pricing &amp; Plans
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          We help car enthusiasts find and share local events. Choose the plan that best fits your needs.
        </p>
      </section>

      {/* Pricing Tiers */}
      <section className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto px-4">
        {tiers.map(t => (
          <div 
            key={t.name} 
            className={`ccs-card relative ${
              t.highlight 
                ? "ring-2 ring-green-600 before:content-['Most_Popular'] before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2 before:text-sm before:font-medium before:px-4 before:py-1 before:rounded-full before:bg-green-50 before:text-green-700" 
                : ""
            }`}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">{t.name}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{t.description}</p>
              </div>
              <div className="text-3xl font-bold text-gray-900">{t.price}</div>
              <ul className="space-y-3 text-base text-gray-600">
                {t.features.map(f => (
                  <li key={f} className="flex items-start">
                    <span className="mr-2 mt-1 text-blue-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <a
                  className={`w-full text-center ${
                    t.highlight 
                      ? "ccs-btn-primary" 
                      : "ccs-btn"
                  }`}
                  href="#"
                >
                  {t.cta}
                </a>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Additional Info Sections */}
      <section className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto px-4 py-8">
        <div className="ccs-card">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
            Why Advertise With Us?
          </h2>
          <div className="space-y-4 text-[var(--fg)] leading-relaxed">
            <p>
              Charlotte Car Shows is the premier destination for automotive enthusiasts in the Carolinas. 
              Our platform connects thousands of car lovers with local events every month.
            </p>
            <p>
              Whether you&apos;re organizing a casual cars &amp; coffee or a major auto show, 
              our targeted audience ensures your event reaches the right people at the right time.
            </p>
          </div>
        </div>
        <div className="ccs-card">
          <h2 className="text-2xl font-semibold mb-4 text-[var(--fg)]" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
            Reach &amp; Impact
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-green-600">15K+</div>
                <div className="text-base text-[var(--fg)]">Monthly Visitors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">500+</div>
                <div className="text-base text-[var(--fg)]">Events Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">90%</div>
                <div className="text-base text-[var(--fg)]">Engagement Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">48hr</div>
                <div className="text-base text-[var(--fg)]">Avg. Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="ccs-card">
            <h3 className="text-lg font-semibold text-[var(--fg)]">How long does a Featured listing last?</h3>
            <p className="mt-2 text-[var(--fg)] leading-relaxed">
              Featured listings remain prominent for 30 days from the purchase date, ensuring maximum visibility leading up to your event.
            </p>
          </div>
          <div className="ccs-card">
            <h3 className="text-lg font-semibold text-[var(--fg)]">What&apos;s included in social promotion?</h3>
            <p className="mt-2 text-[var(--fg)] leading-relaxed">
              Featured events receive dedicated posts on our Instagram and Facebook channels, reaching thousands of local car enthusiasts.
            </p>
          </div>
          <div className="ccs-card">
            <h3 className="text-lg font-semibold text-[var(--fg)]">Can I upgrade my listing later?</h3>
            <p className="mt-2 text-[var(--fg)] leading-relaxed">
              Yes! You can upgrade a standard listing to Featured at any time. Contact us for seamless plan changes.
            </p>
          </div>
        </div>
      </section>
      <div
          dangerouslySetInnerHTML={{
            __html: `
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1514406406537630" crossorigin="anonymous"></script>
<!-- CCS-2026 -->
<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1514406406537630" data-ad-slot="7335717776" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
`
          }}
        />
    </div>
  );
}
