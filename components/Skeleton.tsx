"use client";

import { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
  children?: ReactNode;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded bg-[var(--background-alt)] ${className}`}
      aria-hidden="true"
    />
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] rounded-lg md:rounded-xl mb-2 md:mb-3" />

      {/* Meta skeleton */}
      <div className="flex items-center gap-2 mb-1.5 md:mb-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-1 w-1 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>

      {/* Title skeleton */}
      <Skeleton className="h-5 md:h-6 w-full mb-1.5 md:mb-2" />
      <Skeleton className="h-5 md:h-6 w-3/4 mb-1.5 md:mb-2" />

      {/* Excerpt skeleton */}
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

export function FeaturedBlogSkeleton() {
  return (
    <div className="animate-pulse">
      <Skeleton className="aspect-[4/3] md:aspect-[16/9] rounded-xl md:rounded-2xl" />
    </div>
  );
}

export function BlogGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function JourneyCardSkeleton() {
  return (
    <div className="animate-pulse mb-20 md:mb-32">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-8 md:mb-12">
        {/* Cover image skeleton */}
        <div className="md:w-1/3 lg:w-2/5">
          <Skeleton className="aspect-[3/4] rounded-xl" />
        </div>

        {/* Info skeleton */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Date & location */}
          <div className="flex items-center gap-4 mb-3 md:mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Title */}
          <Skeleton className="h-8 md:h-12 w-full mb-2" />
          <Skeleton className="h-8 md:h-12 w-2/3 mb-3 md:mb-4" />

          {/* Description */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>

      {/* Gallery skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-full`} />
  );
}

export function ButtonSkeleton({ className = "" }: { className?: string }) {
  return (
    <Skeleton className={`h-10 w-24 rounded-lg ${className}`} />
  );
}
