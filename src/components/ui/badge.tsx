import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "secondary";
}

export function Badge({
  variant = "primary",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-cta/10 text-cta border-cta/20",
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
