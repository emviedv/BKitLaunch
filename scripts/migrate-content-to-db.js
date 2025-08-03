#!/usr/bin/env node

/**
 * Migration script to convert existing JSON content to database format
 * Run with: node scripts/migrate-content-to-db.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current products.json file
const productsPath = path.join(__dirname, '../src/data/products.json');
let productData;

try {
  const data = fs.readFileSync(productsPath, 'utf8');
  productData = JSON.parse(data);
} catch (error) {
  console.error('Failed to read products.json:', error);
  process.exit(1);
}

console.log('🔄 Converting JSON content to database format...\n');

// Convert to database schema format
const migration = {
  content_sections: [],
  features: [],
  pricing_plans: [],
  contact_info: null
};

let sectionId = 1;

// Hero Section
if (productData.hero) {
  const heroSection = {
    id: sectionId++,
    section_type: 'hero',
    section_data: {
      title: productData.hero.title,
      subtitle: productData.hero.subtitle,
      description: productData.hero.description,
      primary_button: productData.hero.primaryButton,
      secondary_button: productData.hero.secondaryButton
    },
    is_visible: productData.settings?.visibility?.hero !== false,
    sort_order: 1
  };
  migration.content_sections.push(heroSection);
  console.log('✅ Converted Hero section');
}

// Features Section
if (productData.features && Array.isArray(productData.features)) {
  const featuresSection = {
    id: sectionId++,
    section_type: 'features',
    section_data: {
      title: 'Everything you need to build and scale',
      description: 'From secure API management to comprehensive support systems, we provide all the tools you need for professional SaaS development.'
    },
    is_visible: productData.settings?.visibility?.features !== false,
    sort_order: 2
  };
  migration.content_sections.push(featuresSection);

  // Convert features
  productData.features.forEach((feature, index) => {
    migration.features.push({
      id: index + 1,
      section_id: featuresSection.id,
      icon: feature.icon,
      title: feature.title,
      description: feature.description,
      badge: feature.badge || null,
      badge_color: feature.badgeColor || null,
      sort_order: index
    });
  });
  console.log(`✅ Converted Features section with ${productData.features.length} features`);
}

// Pricing Section
if (productData.pricing && Array.isArray(productData.pricing)) {
  const pricingSection = {
    id: sectionId++,
    section_type: 'pricing',
    section_data: {
      title: 'Simple, transparent pricing',
      description: 'Choose the perfect plan for your needs. Start free and scale as you grow.'
    },
    is_visible: productData.settings?.visibility?.pricing !== false,
    sort_order: 3
  };
  migration.content_sections.push(pricingSection);

  // Convert pricing plans
  productData.pricing.forEach((plan, index) => {
    migration.pricing_plans.push({
      id: index + 1,
      section_id: pricingSection.id,
      name: plan.name,
      price: plan.price,
      period: plan.period,
      description: plan.description,
      features: plan.features,
      button_text: plan.buttonText,
      is_popular: plan.popular || false,
      sort_order: index
    });
  });
  console.log(`✅ Converted Pricing section with ${productData.pricing.length} plans`);
}

// CTA Section
const ctaSection = {
  id: sectionId++,
  section_type: 'cta',
  section_data: {
    title: 'Ready to get started?',
    description: 'Join thousands of developers and designers who trust BiblioKit for their SaaS and plugin development needs.',
    primary_button: 'Start Free Trial',
    secondary_button: 'Schedule Demo'
  },
  is_visible: productData.settings?.visibility?.cta !== false,
  sort_order: 4
};
migration.content_sections.push(ctaSection);
console.log('✅ Converted CTA section');

// Waitlist Section
const waitlistSection = {
  id: sectionId++,
  section_type: 'waitlist',
  section_data: {
    title: 'Join the Waitlist',
    description: 'Be the first to know when BiblioKit launches. Get early access and exclusive updates.',
    button_text: 'Join Waitlist',
    success_message: 'Thank you for joining our waitlist! We\'ll keep you updated.'
  },
  is_visible: true,
  sort_order: 5
};
migration.content_sections.push(waitlistSection);
console.log('✅ Converted Waitlist section');

// Header Section
const headerSection = {
  id: sectionId++,
  section_type: 'header',
  section_data: {
    logo_text: 'BiblioKit',
    navigation_items: [
      { label: 'Home', href: '/', sort_order: 0 },
      { label: 'Features', href: '#features', sort_order: 1 },
      { label: 'Product', href: '/product', sort_order: 2 },
      { label: 'Contact', href: '#contact', sort_order: 3 }
    ],
    sign_in_text: 'Sign In',
    get_started_text: 'Get Started'
  },
  is_visible: true,
  sort_order: 0
};
migration.content_sections.push(headerSection);
console.log('✅ Converted Header section');

// Footer Section
const footerSection = {
  id: sectionId++,
  section_type: 'footer',
  section_data: {
    logo_text: 'BiblioKit',
    description: 'Professional SaaS software and Figma plugins with secure API management.',
    footer_links: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '#features', sort_order: 0 },
          { label: 'Pricing', href: '#pricing', sort_order: 1 },
          { label: 'Documentation', href: '#docs', sort_order: 2 }
        ],
        sort_order: 0
      },
      {
        title: 'Support',
        links: [
          { label: 'Help Center', href: '#help', sort_order: 0 },
          { label: 'Contact', href: '#contact', sort_order: 1 },
          { label: 'Status', href: '#status', sort_order: 2 }
        ],
        sort_order: 1
      },
      {
        title: 'Connect',
        links: [
          { label: 'Email', href: `mailto:${productData.contact?.email || 'hello@bibliokit.com'}`, sort_order: 0 },
          { label: 'Twitter', href: `https://twitter.com/${(productData.contact?.twitter || '@bibliokit').replace('@', '')}`, sort_order: 1 },
          { label: 'GitHub', href: `https://github.com/${productData.contact?.github || 'bibliokit'}`, sort_order: 2 }
        ],
        sort_order: 2
      }
    ],
    copyright_text: '© 2024 BiblioKit. All rights reserved.'
  },
  is_visible: true,
  sort_order: 6
};
migration.content_sections.push(footerSection);
console.log('✅ Converted Footer section');

// Contact Info
if (productData.contact) {
  migration.contact_info = {
    email: productData.contact.email,
    twitter: productData.contact.twitter,
    github: productData.contact.github
  };
  console.log('✅ Converted Contact info');
}

// Write migration files
const outputDir = path.join(__dirname, '../migration-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write individual SQL files for easier import
const writeSQL = (filename, content) => {
  fs.writeFileSync(path.join(outputDir, filename), content);
};

// Generate SQL for content sections
let sectionsSQL = `-- Content Sections Migration
INSERT INTO content_sections (id, section_type, section_data, is_visible, sort_order) VALUES\n`;

const sectionValues = migration.content_sections.map(section => 
  `(${section.id}, '${section.section_type}', '${JSON.stringify(section.section_data).replace(/'/g, "''")}', ${section.is_visible}, ${section.sort_order})`
).join(',\n');

sectionsSQL += sectionValues + ';\n\n';
sectionsSQL += `-- Reset sequence\nSELECT setval('content_sections_id_seq', ${sectionId});\n`;

writeSQL('01_content_sections.sql', sectionsSQL);

// Generate SQL for features
if (migration.features.length > 0) {
  let featuresSQL = `-- Features Migration
INSERT INTO features (id, section_id, icon, title, description, badge, badge_color, sort_order) VALUES\n`;

  const featureValues = migration.features.map(feature => 
    `(${feature.id}, ${feature.section_id}, '${feature.icon}', '${feature.title.replace(/'/g, "''")}', '${feature.description.replace(/'/g, "''")}', ${feature.badge ? `'${feature.badge.replace(/'/g, "''")}'` : 'NULL'}, ${feature.badge_color ? `'${feature.badge_color}'` : 'NULL'}, ${feature.sort_order})`
  ).join(',\n');

  featuresSQL += featureValues + ';\n\n';
  featuresSQL += `-- Reset sequence\nSELECT setval('features_id_seq', ${migration.features.length});\n`;

  writeSQL('02_features.sql', featuresSQL);
}

// Generate SQL for pricing plans
if (migration.pricing_plans.length > 0) {
  let pricingSQL = `-- Pricing Plans Migration
INSERT INTO pricing_plans (id, section_id, name, price, period, description, features, button_text, is_popular, sort_order) VALUES\n`;

  const pricingValues = migration.pricing_plans.map(plan => 
    `(${plan.id}, ${plan.section_id}, '${plan.name}', '${plan.price}', '${plan.period || ''}', '${(plan.description || '').replace(/'/g, "''")}', '${JSON.stringify(plan.features).replace(/'/g, "''")}', '${plan.button_text.replace(/'/g, "''")}', ${plan.is_popular}, ${plan.sort_order})`
  ).join(',\n');

  pricingSQL += pricingValues + ';\n\n';
  pricingSQL += `-- Reset sequence\nSELECT setval('pricing_plans_id_seq', ${migration.pricing_plans.length});\n`;

  writeSQL('03_pricing_plans.sql', pricingSQL);
}

// Generate SQL for contact info
if (migration.contact_info) {
  const contactSQL = `-- Contact Info Migration
INSERT INTO contact_info (email, twitter, github) VALUES 
('${migration.contact_info.email}', '${migration.contact_info.twitter}', '${migration.contact_info.github}');\n`;

  writeSQL('04_contact_info.sql', contactSQL);
}

// Write complete migration as JSON for reference
writeSQL('migration_data.json', JSON.stringify(migration, null, 2));

// Write a complete SQL file
const completeSQL = [
  '-- Complete BiblioKit Content Migration',
  '-- Run this after setting up the database tables\n',
  fs.readFileSync(path.join(outputDir, '01_content_sections.sql'), 'utf8'),
  migration.features.length > 0 ? fs.readFileSync(path.join(outputDir, '02_features.sql'), 'utf8') : '',
  migration.pricing_plans.length > 0 ? fs.readFileSync(path.join(outputDir, '03_pricing_plans.sql'), 'utf8') : '',
  migration.contact_info ? fs.readFileSync(path.join(outputDir, '04_contact_info.sql'), 'utf8') : ''
].filter(Boolean).join('\n');

writeSQL('complete_migration.sql', completeSQL);

console.log('\n🎉 Migration completed successfully!');
console.log(`📁 Files written to: ${outputDir}/`);
console.log('\nFiles created:');
console.log('  - complete_migration.sql (run this in your database)');
console.log('  - migration_data.json (for reference)');
console.log('  - Individual SQL files for each table');

console.log('\n📋 Next steps:');
console.log('1. Set up your database with the table schemas');
console.log('2. Run: psql -d your_database -f migration-output/complete_migration.sql');
console.log('3. Test the new database CRUD functionality in the admin panel');
console.log('4. Verify all sections display correctly on the website');

console.log('\n💡 Summary:');
console.log(`  - ${migration.content_sections.length} content sections`);
console.log(`  - ${migration.features.length} features`);
console.log(`  - ${migration.pricing_plans.length} pricing plans`);
console.log(`  - ${migration.contact_info ? '1' : '0'} contact info record`);