import React from "react";
import heroStyles from "@/components/HomeHero.module.css";
import weeklyStyles from "@/components/Weekly.module.css";

export default function HomeHero({
  title,
  lead,
  range,
}: {
  title: string;
  lead: React.ReactNode;
  range?: string | null;
}) {
  return (
    <div className={heroStyles.hero}>
      <h1 className={heroStyles.heroTitle}>{title}</h1>
      <p className={heroStyles.heroLead}>{lead}</p>
      {range ? <div className={weeklyStyles.range} aria-hidden>{range}</div> : null}
    </div>
  );
}