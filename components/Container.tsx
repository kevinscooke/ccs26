import React from "react";

export default function Container({
  children,
  className = "",
  as: Comp = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: any;
}) {
  return (
    <Comp className={`w-full px-4 md:px-12 max-w-7xl mx-auto ${className}`}>
      {children}
    </Comp>
  );
}
