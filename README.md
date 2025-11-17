# BiblioKit Simple Launch

A simplified version of the BiblioKit website designed for quick deployment to Netlify.

## Features

- **Static Site**: Built with React and Vite for fast loading
- **JSON-Driven**: All content is stored in `src/data/products.json` for easy editing
- **Admin-Free**: No CMS or authentication layer — the bundle ships with published content inline
- **Responsive Design**: Works great on desktop and mobile
- **Netlify Ready**: Configured for one-click deployment

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open http://127.0.0.1:53173

## Editing Content

### Editing the JSON
1. Open `src/data/products.json`
2. Edit the content directly
3. Save the file
4. The development server will auto-reload

## Content Structure

The `products.json` file contains:

- `hero`: Homepage hero section content
- `features`: Array of feature cards
- `pricing`: Array of pricing plans
- `contact`: Contact information

## Deployment to Netlify

### Option 1: Git Integration
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Deploy automatically with these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 2: Manual Deploy
1. Run `npm run build`
2. Drag the `dist` folder to Netlify's deploy interface

## Project Structure

```
simple/
├── src/
│   ├── components/          # React components
│   ├── data/
│   │   └── products.json    # Content data (EDIT THIS)
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Styles
├── netlify.toml             # Netlify configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Customization

- **Styling**: Edit `src/index.css` for custom styles
- **Components**: Modify files in `src/components/`
- **Colors**: Update CSS variables in `src/index.css`
- **Content**: Edit `src/data/products.json`

## Development

- `npm run dev` - Start Vite on port 53173 (IPv4 localhost)
- `npm run netlify:dev` - Full stack (proxy on 9989 → Vite on 53173)
- `npm run build` - Build for production
  - Note: This builds the client only. SSR build is optional (`npm run build:server`) and not required because Edge SSR is disabled in `netlify.toml`.
- `npm run preview` - Preview production build

### Netlify Dev (Functions + SSR)

Run the app with Netlify’s local proxy so `/.netlify/functions/*` work:

```
npm run netlify:dev
```

- Opens at `http://localhost:9989` (proxy) and serves Vite on `127.0.0.1:53173`
- Stop with Ctrl+C. If a port is stuck: `pkill -f "netlify dev"`
- To free a port: `lsof -n -i :9989` then kill the PID

Note: No Docker or reverse proxy (Traefik/Caddy) is required for local dev.

## Support

For questions about this simplified version, refer to the main BiblioKit documentation or contact support. 
