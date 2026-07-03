interface SectionLabelProps {
  children: string;
  className?: string;
}

/**
 * Overline-style section label (e.g., "The Portfolio", "Ecosystem Partners").
 * Uppercase, tracked, accent-colored.
 */
export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span className={`section-label ${className}`}>
      {children}
    </span>
  );
}
