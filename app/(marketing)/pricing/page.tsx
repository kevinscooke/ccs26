export default function Pricing() {
  const tiers = [
    { name: "Free", features: ["Submit events", "Listed on city page"], cta: "Get Started" },
    { name: "Featured ($25)", features: ["Top placement", "Social shout-out"], cta: "Feature an Event", highlight: true },
    { name: "Organizer PRO", features: ["Recurring features", "Analytics & dashboard"], cta: "Contact Sales" },
  ];
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {tiers.map(t => (
        <div key={t.name} className={`ccs-card ${t.highlight ? "ring-1 ring-brand-600/50" : ""}`}>
          <h3 className="text-xl font-semibold">{t.name}</h3>
          <ul className="mt-3 space-y-1 text-zinc-300">
            {t.features.map(f => <li key={f}>• {f}</li>)}
          </ul>
          <div className="mt-4">
            <a className={t.highlight ? "ccs-btn-primary" : "ccs-btn"} href="#">
              {t.cta}
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
