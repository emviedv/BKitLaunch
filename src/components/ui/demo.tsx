import { MagnetizeButton } from "@/components/ui/magnetize-button";
import { ShinyButton } from "@/components/ui/shiny-button";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Bell, Calendar, FileText, Globe, Search } from "lucide-react";

function MagnetizeButtonDemo() {
  return <MagnetizeButton particleCount={14} attractRadius={50} />;
}

function ShinyButtonDemo() {
  return <ShinyButton>Shiny Button</ShinyButton>;
}

export { MagnetizeButtonDemo, ShinyButtonDemo };



function BentoDemo() {
  const features = [
    {
      Icon: FileText,
      name: "Save your files",
      description: "We automatically save your files as you type.",
      href: "/",
      cta: "Learn more",
      background: (
        <img
          src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop"
          className="absolute -right-20 -top-20 opacity-50"
          alt=""
          aria-hidden="true"
        />
      ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: Search,
      name: "Full text search",
      description: "Search through all your files in one place.",
      href: "/",
      cta: "Learn more",
      background: (
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
          className="absolute -right-20 -top-20 opacity-50"
          alt=""
          aria-hidden="true"
        />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Globe,
      name: "Multilingual",
      description: "Supports 100+ languages and counting.",
      href: "/",
      cta: "Learn more",
      background: (
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop"
          className="absolute -right-20 -top-20 opacity-50"
          alt=""
          aria-hidden="true"
        />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Calendar,
      name: "Calendar",
      description: "Use the calendar to filter your files by date.",
      href: "/",
      cta: "Learn more",
      background: (
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
          className="absolute -right-20 -top-20 opacity-50"
          alt=""
          aria-hidden="true"
        />
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Bell,
      name: "Notifications",
      description:
        "Get notified when someone shares a file or mentions you in a comment.",
      href: "/",
      cta: "Learn more",
      background: (
        <img
          src="https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop"
          className="absolute -right-20 -top-20 opacity-50"
          alt=""
          aria-hidden="true"
        />
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };
