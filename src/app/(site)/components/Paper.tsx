import { torn } from "../lib/scatter";

// A torn sheet of aged paper floating above the night. `id` keeps its tear the same on every visit.
export default function Paper({
  id,
  tear = 4,
  depth = 0.3,
  tone,
  className,
  innerClassName,
  style,
  children,
}: {
  id: string;
  tear?: number;
  depth?: number;
  tone?: string;
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div className={`lift ${className ?? ""}`} style={{ "--d": depth, ...style } as React.CSSProperties}>
      <div
        className={`paper ${innerClassName ?? ""}`}
        style={{ clipPath: torn(id, tear), ...(tone ? { "--paper-tone": tone } : {}) } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
