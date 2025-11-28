"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -inset-[10px] opacity-50 will-change-transform pointer-events-none",
            "bg-gradient-to-r from-blue-500 via-indigo-300 via-blue-300 via-violet-200 to-blue-400",
            "animate-aurora blur-[10px]",
            showRadialGradient && "mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)"
          )}
          style={{
            backgroundSize: "300% 200%",
            backgroundPosition: "50% 50%"
          }}
        />
        <div
          className={cn(
            "absolute inset-0 opacity-30 will-change-transform pointer-events-none",
            "bg-gradient-to-r from-blue-400 via-purple-300 via-cyan-300 via-pink-200 to-indigo-400",
            "animate-aurora blur-[20px]"
          )}
          style={{
            backgroundSize: "200% 100%",
            backgroundPosition: "50% 50%",
            animationDelay: "-30s",
            mixBlendMode: "difference"
          }}
        />
      </div>
      {children}
    </div>
  );
};