import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = "center",
  light = true,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && (
        <p className="mb-3 text-xs font-medium tracking-[0.3em] uppercase text-gold">
          {subtitle}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-light tracking-tight md:text-5xl lg:text-6xl",
          light ? "text-cream" : "text-black"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "mx-auto mt-4 h-px w-16 bg-gold/60",
          align === "left" && "ml-0"
        )}
      />
    </div>
  );
}
