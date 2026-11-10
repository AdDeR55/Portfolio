export function Spinner({ size = 40, label = "Loading" }: { size?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" role="status" aria-label={label} className="animate-spin-slow">
      <circle cx="25" cy="25" r="20" fill="none" stroke="var(--line)" strokeWidth="4" />
      <path d="M25 5a20 20 0 0 1 20 20" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
