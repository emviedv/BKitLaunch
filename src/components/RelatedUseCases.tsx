import React from 'react';
import { getUseCasesForPlugin, PLUGIN_DATA, type PluginSlug } from '@/data/programmaticContent';
import { ArrowRight } from '@/lib/iconUtils';
import { debugService } from '@/lib/debugService';

interface RelatedUseCasesProps {
  plugin: PluginSlug;
  limit?: number;
}

/**
 * Displays related use cases for a given plugin.
 * Designed to be embedded in product pages to create internal links
 * to use case pages, improving SEO via cross-linking.
 */
const RelatedUseCases: React.FC<RelatedUseCasesProps> = ({ plugin, limit = 3 }) => {
  debugService.info('RelatedUseCases rendering', { plugin, limit });

  const useCases = getUseCasesForPlugin(plugin).slice(0, limit);
  const pluginData = PLUGIN_DATA[plugin];

  if (useCases.length === 0) {
    debugService.info('RelatedUseCases: no use cases found', { plugin });
    return null;
  }

  return (
    <section className="py-16 md:py-20 px-6 md:px-10 landing-sections-gradient text-white border-t border-slate-800/50 relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How to Use {pluginData?.name || 'This Plugin'}
          </h2>
          <p className="text-slate-400">
            Step-by-step guides for common workflows
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {useCases.map((useCase) => (
            <a
              key={useCase.slug}
              href={`/use-cases/${useCase.slug}`}
              className="group bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all hover:bg-slate-800/70"
            >
              <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                {useCase.pluginName}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                {useCase.title}
              </h3>
              <p className="text-slate-400 text-sm line-clamp-2">
                {useCase.problem}
              </p>
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <span>Read guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/use-cases"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <span>View all use cases</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default RelatedUseCases;
