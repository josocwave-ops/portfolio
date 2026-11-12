// A small tapered spiral used as a bullet. Deterministic, so it renders on the server.
function spiralPath(seed: number) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280) - 0.5;
  // winds inward about two turns from the outer edge, with a little hand wobble
  const steps = 140;
  const turns = 2.1 + rnd() * 0.3;
  const start = rnd() * Math.PI;
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = start + t * turns * Math.PI * 2;
    const r = 17 * Math.pow(1 - t, 0.85) + 0.6 + rnd() * 0.5;
    pts.push([20 + r * Math.cos(a), 20 + r * Math.sin(a), t]);
  }
  const left: string[] = [];
  const right: string[] = [];
  pts.forEach((p, i) => {
    const q = pts[Math.min(i + 1, pts.length - 1)];
    const o = pts[Math.max(i - 1, 0)];
    let dx = q[0] - o[0];
    let dy = q[1] - o[1];
    const m = Math.hypot(dx, dy) || 1;
    dx /= m;
    dy /= m;
    const w = 2.6 * Math.pow(Math.sin(Math.PI * Math.min(p[2] * 0.9 + 0.08, 1)), 0.8) + 0.2;
    left.push(`${(p[0] - dy * w).toFixed(1)} ${(p[1] + dx * w).toFixed(1)}`);
    right.unshift(`${(p[0] + dy * w).toFixed(1)} ${(p[1] - dx * w).toFixed(1)}`);
  });
  return `M${left.concat(right).join("L")}Z`;
}

export default function Spiral({ color, seed = 1, className }: { color: string; seed?: number; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path d={spiralPath(seed)} fill={color} />
    </svg>
  );
}
