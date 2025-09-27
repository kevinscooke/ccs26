import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export default function Container({ children, className = "", as: Comp = "div" }: ContainerProps) {
  return (
    <Comp className={`w-full px-4 md:px-12 max-w-7xl mx-auto ${className}`}>
      {children}
    </Comp>
  );
}
