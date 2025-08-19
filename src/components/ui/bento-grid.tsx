import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type BentoGridProps = {
  children: ReactNode;
  className?: string;
};

const BentoGrid = ({ children, className }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

type BentoCardProps = {
  name: string;
  className?: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: BentoCardProps) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
      // theme-aware surface and subtle border/shadow
      "bg-background border border-border shadow-sm",
      // dark inset glow
      "transform-gpu dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
  >
    <div>{background}</div>
    <div className="z-10 flex transform-gpu flex-col gap-2 p-6 transition-all duration-300">
      {/* Keep icon size consistent with site (w-12 h-12) without hover scaling */}
      {Icon ? (
        <Icon className="h-12 w-12" />
      ) : null}
      <h3 className="text-xl font-semibold text-foreground">{name}</h3>
      <p className="max-w-lg text-muted-foreground">{description}</p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full transform-gpu flex-row items-center p-4 transition-all duration-300",
        "translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
        <a href={href} aria-label={`${cta} - ${name}`}>
          {cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-foreground/5" />
  </div>
);

export { BentoCard, BentoGrid };


