# BiblioKit Content CRUD System Guide

## Overview

BiblioKit now features a comprehensive Content Management System with full CRUD (Create, Read, Update, Delete) operations for all website sections. This system supports both database persistence and local fallback modes.

## Features

✅ **Complete Section Coverage**
- Hero Section
- Features Section (with individual feature CRUD)
- Pricing Section (with individual plan CRUD)
- CTA (Call to Action) Section
- Waitlist Section
- Header Section (with navigation items)
- Footer Section (with link groups)
- Contact Information

✅ **Dual Mode Operation**
- **Database Mode**: Full CRUD with PostgreSQL persistence
- **Local Mode**: Fallback to localStorage/JSON editing

✅ **Authentication & Authorization**
- Admin-only access to editing functionality
- JWT token-based authentication
- Graceful fallback for unauthenticated users

## Architecture

### Database Schema

The system uses normalized PostgreSQL tables:

- `content_sections` - Main sections table
- `features` - Individual features for Features section
- `pricing_plans` - Individual plans for Pricing section
- `navigation_items` - Header navigation items
- `footer_link_groups` - Footer link organization
- `footer_links` - Individual footer links
- `contact_info` - Contact information (single record)

### API Endpoints

All endpoints require admin authentication:

#### Content Sections
- `GET /content-sections` - List all sections
- `GET /content-sections/{type}` - Get specific section
- `POST /content-sections` - Create new section
- `PUT /content-sections/{id}` - Update section
- `DELETE /content-sections/{id}` - Delete section

#### Features
- `GET /features` - List all features
- `GET /features/{id}` - Get specific feature
- `POST /features` - Create new feature
- `PUT /features/{id}` - Update feature
- `DELETE /features/{id}` - Delete feature

#### Pricing Plans
- `GET /pricing-plans` - List all plans
- `GET /pricing-plans/{id}` - Get specific plan
- `POST /pricing-plans` - Create new plan
- `PUT /pricing-plans/{id}` - Update plan
- `DELETE /pricing-plans/{id}` - Delete plan

#### Contact Info
- `GET /contact-info` - Get contact information
- `PUT /contact-info` - Update contact information

## Usage Guide

### Admin Access

1. **Access Admin Panel**: Navigate to `/admin` and login
2. **Open Content Editor**: Click the edit button (✏️) in bottom-right
3. **Choose Mode**: 
   - **Database** (recommended): Full CRUD with persistence
   - **Sections**: Local editing with localStorage
   - **JSON**: Advanced raw JSON editing

### Database Mode Features

#### Section Management
- **Create**: Fill forms and click "Create [Section] Section"
- **Update**: Modify existing sections and click "Update"
- **Delete**: Use "Delete Section" button (irreversible)
- **Visibility**: Toggle section visibility on website

#### Features CRUD
- Add/remove individual features
- Edit icons, titles, descriptions, badges
- Reorder features (drag-and-drop in future versions)
- Color-coded badges with hex support

#### Pricing Plans CRUD
- Add/remove pricing plans
- Set popularity flags
- Manage feature lists per plan
- Flexible pricing display (free, custom, monthly, etc.)

### Environment Variables

Required for database mode:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

### Migration

Convert existing JSON content to database:

```bash
# Run migration script
node scripts/migrate-content-to-db.js

# Import to database
psql -d your_database -f migration-output/complete_migration.sql
```

## API Integration

### Frontend Usage

```typescript
import { contentApi } from '@/lib/contentApi';

// Get a section
const heroResponse = await contentApi.getSection('hero');
if (heroResponse.success) {
  console.log(heroResponse.data);
}

// Create a feature
const featureResponse = await contentApi.createFeature(sectionId, {
  icon: '🚀',
  title: 'Fast Performance',
  description: 'Lightning-fast loading times',
  badge: 'New',
  badge_color: 'green',
  sort_order: 0
});

// Update contact info
const contactResponse = await contentApi.updateContactInfo({
  email: 'hello@example.com',
  twitter: '@example',
  github: 'example'
});
```

### Backend Integration

Functions automatically create tables on first run. The system includes:

- Connection pooling
- Error handling
- Transaction support
- SQL injection protection
- CORS configuration

## Section Types & Data Structures

### Hero Section
```typescript
interface HeroSection {
  section_type: 'hero';
  title: string;
  subtitle: string;
  description: string;
  primary_button: string;
  secondary_button: string;
  is_visible: boolean;
}
```

### Features Section
```typescript
interface FeaturesSection {
  section_type: 'features';
  title: string;
  description: string;
  features: FeatureItem[];
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  badge_color?: string;
  sort_order: number;
}
```

### Pricing Section
```typescript
interface PricingSection {
  section_type: 'pricing';
  title: string;
  description: string;
  plans: PricingPlan[];
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  button_text: string;
  is_popular: boolean;
  sort_order: number;
}
```

### CTA Section
```typescript
interface CTASection {
  section_type: 'cta';
  title: string;
  description: string;
  primary_button: string;
  secondary_button: string;
  is_visible: boolean;
}
```

### Waitlist Section
```typescript
interface WaitlistSection {
  section_type: 'waitlist';
  title: string;
  description: string;
  button_text: string;
  success_message: string;
  is_visible: boolean;
}
```

## Error Handling

The system includes comprehensive error handling:

- **Connection Issues**: Graceful fallback to local mode
- **Authentication Errors**: Clear user feedback
- **Validation Errors**: Form-level error display
- **Database Errors**: Logged and user-friendly messages

## Performance Considerations

- **Caching**: Sections cached in React state
- **Lazy Loading**: Components load sections on demand
- **Optimized Queries**: JOIN queries for related data
- **Connection Pooling**: Efficient database connections

## Security Features

- **Admin-Only Access**: All mutations require admin auth
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin handling
- **Input Validation**: Client and server-side validation

## Future Enhancements

### Planned Features
- **Advanced Features CRUD**: Full featured feature management
- **Drag-and-Drop Reordering**: Visual section organization
- **Content Versioning**: Track changes over time
- **Bulk Operations**: Import/export functionality
- **Media Management**: Image upload and management
- **Preview Mode**: Test changes before publishing
- **Audit Trail**: Track who changed what when

### Schema Validation
- **Zod Integration**: Runtime type checking
- **Form Validation**: Real-time error feedback
- **API Validation**: Server-side data validation

### Testing
- **Unit Tests**: Individual function testing
- **Integration Tests**: Full workflow testing
- **E2E Tests**: Complete user journey testing

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` environment variable
   - Verify database is running and accessible
   - System automatically falls back to local mode

2. **Authentication Issues**
   - Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
   - Check admin login credentials
   - Token expires after session

3. **Content Not Saving**
   - Check browser console for errors
   - Verify admin authentication status
   - Check database connectivity

4. **Missing Sections**
   - Run migration script to import existing content
   - Check section visibility settings
   - Verify database tables were created

### Debug Mode

Enable detailed logging by setting:
```env
DEBUG=true
```

This will log:
- Database queries
- API requests/responses
- Authentication attempts
- Error details

## Best Practices

1. **Regular Backups**: Export content regularly
2. **Test Changes**: Use staging environment first
3. **Monitor Performance**: Watch database query times
4. **Secure Credentials**: Use strong passwords and rotate regularly
5. **Update Dependencies**: Keep packages current for security

## Support

For technical support:
- Check browser console for detailed error messages
- Review server logs for backend issues
- Use the migration script for data conversion
- Test in local mode if database issues occur

The system is designed to be robust and user-friendly, with automatic fallbacks and clear error messaging to ensure a smooth content management experience.