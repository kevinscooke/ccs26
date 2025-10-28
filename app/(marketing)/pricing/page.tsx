import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans – Charlotte Car Shows",
  description:
    "Choose your plan to promote car shows and automotive events in Charlotte. Free listings and premium featured options available.",
  alternates: { canonical: "https://charlottecarshows.com/pricing/" },
  openGraph: {
    title: "Event Promotion Plans – Charlotte Car Shows",
    description:
      "List your car show for free or boost visibility with premium features. Reach thousands of local car enthusiasts.",
    url: "https://charlottecarshows.com/pricing/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Event Promotion Plans – Charlotte Car Shows",
    description:
      "List your car show for free or boost visibility with premium features. Reach thousands of local car enthusiasts.",
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
      ],
      cta: "Submit Free Event",
    },
    {
      name: "Featured Event",
      price: "$25",
      description: "Boost visibility for your special car show or meet.",
      features: [
        "Premium placement the week of your event",
        "Social media promotion",
        "Enhanced event page",
        "Priority support",
      ],
      cta: "Feature Your Event",
      highlight: true,
    },
  ];

  return (
    <div
      className="space-y-16 py-0"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Notice Banner */}
      <div className="bg-green-50 text-center py-3 px-4 text-sm md:text-base text-green-800">
        🚗 <strong>Free event listings are always available!</strong>&nbsp; Just{" "}
        <a href="/submit-event/" className="underline font-medium">
          submit your event
        </a>{" "}
        or{" "}
        <a href="/contact/" className="underline font-medium">
          send us a message
        </a>
        . <a href="#faq" className="ml-2 underline">See FAQ ↓</a>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          Pricing &amp; Plans
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          List your event for free — or feature it for just $25 to reach
          thousands of Charlotte car enthusiasts.
        </p>
      </section>

      {/* Pricing Tiers */}
      <section id="pricing" className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto px-4">
        {tiers.map((t) => (
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
              {t.name === "Featured Event" && (
                <p className="text-sm text-gray-500">Available first-come, first-serve</p>
              )}
              <ul className="space-y-3 text-base text-gray-600">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start">
                    <span className="mr-2 mt-1 text-blue-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="pt-4">
                {t.name === "Free" ? (
                  <a
                    className={`w-full text-center ${t.highlight ? "ccs-btn-primary" : "ccs-btn"}`}
                    href="/submit-event/"
                  >
                    {t.cta}
                  </a>
                ) : t.name === "Featured Event" ? (
                  <div id="featured">
                    <form
                      action="https://www.paypal.com/cgi-bin/webscr"
                      method="post"
                      target="_blank"
                      className="w-full"
                    >
                      <input type="hidden" name="cmd" value="_xclick" />
                      <input type="hidden" name="business" value="kevin@searchandbefound.com" />
                      <input
                        type="hidden"
                        name="item_name"
                        value="Featured Event Listing – Charlotte Car Shows"
                      />
                      <input type="hidden" name="amount" value="25.00" />
                      <input type="hidden" name="currency_code" value="USD" />
                      <input type="hidden" name="no_shipping" value="1" />
                      <input type="hidden" name="no_note" value="1" />
                      {/* Optional return URLs */}
                      <input
                        type="hidden"
                        name="return"
                        value="https://charlottecarshows.com/pricing/?paid=1"
                      />
                      <input
                        type="hidden"
                        name="cancel_return"
                        value="https://charlottecarshows.com/pricing/?canceled=1"
                      />
                      <input
                        type="hidden"
                        name="bn"
                        value="PP-BuyNowBF:btn_buynow_LG.gif:NonHosted"
                      />

                      <button type="submit" className="w-full ccs-btn-primary">
                        {t.cta}
                      </button>
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        Pinned in listings + IG shoutout • $25 one-time via PayPal
                      </p>
                    </form>
                  </div>
                ) : (
                  <a
                    className={`w-full text-center ${t.highlight ? "ccs-btn-primary" : "ccs-btn"}`}
                    href="/contact/"
                  >
                    {t.cta}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-6" id="how-it-works">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}>
          How It Works
        </h2>
        <ol className="space-y-4 text-gray-700 text-lg">
          <li>1️⃣ -<strong>Submit your event</strong><br />It’s always free to list.</li>
          <li>2️⃣ -<strong>Want more reach?</strong><br />Upgrade to a Featured Event for $25.</li>
          <li>3️⃣ -<strong>We promote it</strong><br />Your event gets pinned and shared on Instagram &amp; Facebook.</li>
        </ol>
        
      </section>
      </section> 

      {/* Additional Info Sections */}
      <section className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto px-4 py-8">
        <div className="ccs-card">
          <h2
            className="text-2xl font-semibold mb-4 text-[var(--fg)]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
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
          <h2
            className="text-2xl font-semibold mb-4 text-[var(--fg)]"
            style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
          >
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
      <section id="faq" className="max-w-3xl mx-auto px-4">
        <h2
          className="text-2xl font-semibold mb-6 text-center text-gray-900"
          style={{ fontFamily: "'Source Serif Pro', Georgia, serif" }}
        >
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="ccs-card">
            <h3 className="text-lg font-semibold text-[var(--fg)]">Can I list my event for free?</h3>
            <p className="mt-2 text-[var(--fg)] leading-relaxed">
              Yes! All event listings are free. The Featured option is only for organizers who want extra exposure and promotion.
            </p>
          </div>
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
    </div>
  );
}
