import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-surface-container rounded", className)}
      style={{ width, height }}
    />
  );
}
