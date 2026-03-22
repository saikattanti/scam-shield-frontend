"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface UnifiedButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline" | "glass" | "shimmer";
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
}

const UnifiedButton: React.FC<UnifiedButtonProps> = ({
  text,
  href,
  onClick,
  variant = "primary",
  icon,
  className = "",
  disabled = false,
  target,
  rel,
  type = "button",
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group";
  
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-md",
    secondary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md",
    outline: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50",
    glass: "bg-white/40 backdrop-blur-md border border-white/40 text-slate-900 hover:bg-white/60 shadow-sm",
    shimmer: "bg-slate-900 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] border border-blue-500/30",
  };

  const content = (
    <>
      {/* Shimmer Effect Layer */}
      {variant === "shimmer" && (
        <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      )}
      <span className="relative z-10">{text}</span>
      {icon && <span className="relative z-10 opacity-80 transition-transform group-hover:translate-x-0.5">{icon}</span>}
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .group:hover :global(.group-hover\:animate-shimmer) {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );

  if (href) {
    return (
      <Link 
        href={href} 
        target={target} 
        rel={rel} 
        className={`${baseStyles} ${variants[variant]} ${className} group`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} group`}
    >
      {content}
    </button>
  );
};

export default UnifiedButton;
