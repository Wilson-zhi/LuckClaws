import type { ReactNode } from "react";

type AboutRevealProps = {
  children: ReactNode;
  className?: string;
};

export function AboutReveal({ children, className = "" }: AboutRevealProps) {
  return <div className={`${className} translate-y-0 opacity-100`}>{children}</div>;
}
