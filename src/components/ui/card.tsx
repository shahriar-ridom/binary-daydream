import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
}

export function Card({
  hover = false,
  glass = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl border border-border overflow-hidden";
  const glassStyles = glass ? "glass-effect" : "bg-surface";
  const hoverStyles = hover ? "card-hover cursor-pointer" : "";

  return (
    <div
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  );
}
