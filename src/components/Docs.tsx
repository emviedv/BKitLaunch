import React from 'react';
import { usePublishedContent } from '@/hooks/usePublishedContent';
import { useSEO } from '@/hooks/useSEO';
import { Button } from '@/components/ui/button';

export const Docs: React.FC = () => {
  const { content } = usePublishedContent();
  useSEO(content);

  return (
    <div className="container mx-auto px-4 py-16">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-3">Documentation</h1>
        <p className="text-muted-foreground max-w-2xl">
          Quick start and reference for integrating with BiblioKit products and APIs.
        </p>
      </header>

      <section aria-labelledby="quickstart-heading" className="mb-12">
        <h2 id="quickstart-heading" className="text-2xl font-semibold mb-4">Quick start</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>Pick a product page to learn its capabilities.</li>
          <li>Create an API key from your account dashboard.</li>
          <li>Call the API using the examples below.</li>
        </ol>
      </section>

      <section aria-labelledby="api-example-heading" className="mb-12">
        <h2 id="api-example-heading" className="text-2xl font-semibold mb-4">API example</h2>
        <div className="rounded-md border bg-muted/40 p-4 overflow-x-auto">
          <pre className="text-sm"><code>{`curl -X GET \\
  \"$BASE_URL/api/status\" \\
  -H \"Authorization: Bearer $API_KEY\"`}</code></pre>
        </div>
      </section>

      <section aria-labelledby="resources-heading" className="mb-12">
        <h2 id="resources-heading" className="text-2xl font-semibold mb-4">Resources</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><a className="underline hover:text-foreground" href="/#features">Features</a></li>
          <li><a className="underline hover:text-foreground" href="/#pricing">Pricing</a></li>
          <li><a className="underline hover:text-foreground" href="/#contact">Contact</a></li>
        </ul>
      </section>

      <div className="flex gap-4">
        <Button asChild size="lg">
          <a href="/bibliokit-blocks">Explore Blocks</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/ai-rename-variants">AI Rename Variants</a>
        </Button>
      </div>
    </div>
  );
};


