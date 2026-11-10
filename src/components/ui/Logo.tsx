export function Logo({ className = "h-9 w-9 text-sm" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`st-outline inline-grid shrink-0 place-items-center rounded-md border-2 border-accent/80 ${className}`}
      style={{ WebkitTextStrokeWidth: "1px" }}
    >
      MJ
    </span>
  );
}
