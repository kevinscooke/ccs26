import React from "react";

type HomeHeroProps = {
  title: string;
  lead: React.ReactNode;
  range?: string | null;
  className?: string;
};

export default function HomeHero({
  title,
  lead,
  range,
  className = "",
}: HomeHeroProps) {
  return (
    <header className={`ccs-hero ${className}`}>
      <h1 className="ccs-hero__title">{title}</h1>
      <p className="ccs-hero__lead">{lead}</p>
      {range ? <div className="ccs-weekly__range" aria-hidden>{range}</div> : null}
    </header>
  );
}