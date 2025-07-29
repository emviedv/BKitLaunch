import React, { useState, useEffect } from 'react';
import productData from '@/data/products.json';

const Features = () => {
  const [content, setContent] = useState(productData);

  useEffect(() => {
    const saved = localStorage.getItem('bibliokit-content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContent(parsed);
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  const { features } = content;
  const colorClasses = ['purple', 'blue', 'green', 'orange', 'pink', 'indigo'];
  
  // Return null if features section is set to hidden
  if (content.settings?.visibility?.features === false) {
    return null;
  }

  return (
    <section id="features" className="py-20 px-4 section-gradient">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to build and scale
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From secure API management to comprehensive support systems, 
            we provide all the tools you need for professional SaaS development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card relative">
              {feature.badge && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                  {feature.badge}
                </div>
              )}
              <div className={`icon-container ${colorClasses[index % colorClasses.length]} mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 