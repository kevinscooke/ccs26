import clsx from "clsx";
import React from "react";

type Level = 1 | 2 | 3;

const styles: Record<Level, string> = {
  1: "font-heading text-4xl md:text-5xl leading-tight tracking-tightish",
  2: "font-heading text-3xl md:text-4xl leading-snug tracking-tightish",
  3: "font-heading text-2xl md:text-3xl leading-snug",
};

export function Heading({
  as = 1,
  className,
  children,
}: {
  as?: Level;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = (`h${as}` as unknown) as keyof JSX.IntrinsicElements;
  return <Tag className={clsx(styles[as], className)}>{children}</Tag>;
}
