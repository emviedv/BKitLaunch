import React from 'react';
import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/config/routes';

const AdminPage: React.FC = () => {
  return (
    <div className="admin-page-shell relative min-h-screen bg-gradient-to-b from-[#0b0c0f] via-[#0e1014] to-[#0b0c0f] text-white">
      <div className="section-content pt-28 pb-24 max-w-4xl mx-auto flex flex-col gap-8">
        <div className="admin-page-card rounded-3xl border border-white/10 bg-white/4 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.45)] p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.18em] text-white/70 mb-4">
            Admin Area
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Admin console isn&rsquo;t available on this launch.
          </h1>
          <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8">
            Head back to the main site to keep browsing.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="admin-page-primary-cta">
              <a href={ROUTE_PATHS.HOME}>Go to site</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
