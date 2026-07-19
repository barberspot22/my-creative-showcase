import gbLogo from "@/assets/gb-ia-logo.png";

export function BrandLogo({ className = "studioBrand", href = "/", ariaLabel = "GB IA — início" }: { className?: string; href?: string; ariaLabel?: string }) {
  return (
    <a href={href} className={`${className} gbImageBrand`} aria-label={ariaLabel}>
      <img src={gbLogo} alt="GB IA" />
    </a>
  );
}
