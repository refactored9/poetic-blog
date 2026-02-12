interface MountainDividerProps {
  variant?: "mountain" | "river";
  className?: string;
  flip?: boolean;
}

export default function MountainDivider({
  variant = "mountain",
  className = "",
  flip = false,
}: MountainDividerProps) {
  if (variant === "river") {
    return (
      <div
        className={`w-full overflow-hidden ${className}`}
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1200 60"
          fill="none"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30 Q150 10 300 30 T600 30 T900 30 T1200 30"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            fill="none"
          />
          <path
            d="M0 40 Q150 20 300 40 T600 40 T900 40 T1200 40"
            stroke="var(--accent)"
            strokeWidth="1"
            strokeOpacity="0.15"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 120"
        fill="none"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120 L0 80 L200 40 L350 65 L500 20 L650 55 L800 10 L950 50 L1100 30 L1200 60 L1200 120 Z"
          fill="var(--border)"
          fillOpacity="0.3"
        />
        <path
          d="M0 120 L0 90 L150 55 L300 75 L450 35 L600 60 L750 25 L900 55 L1050 40 L1200 70 L1200 120 Z"
          fill="var(--border)"
          fillOpacity="0.15"
        />
      </svg>
    </div>
  );
}
