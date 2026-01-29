"use client";

import { useEffect, useRef, HTMLAttributes } from "react";

interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
}

export function Dialog({
  open,
  onClose,
  children,
  className = "",
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-primary/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={`relative bg-surface rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in z-9999 ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-8 pb-4 z-9999 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogContent({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-8 pt-0 z-9999 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function DialogFooter({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-8 pt-4 z-9999 border-t border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogClose({
  onClose,
  className = "",
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClose}
      className={`absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-background hover:bg-border transition-colors duration-200 cursor-pointer ${className}`}
      aria-label="Close dialog"
    >
      <svg
        className="w-5 h-5 text-text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
