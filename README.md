# BiblioKit Simple Launch

A simplified version of the BiblioKit website designed for quick deployment to Netlify.

## Features

- **Static Site**: Built with React and Vite for fast loading
- **Easy Content Editing**: Click the edit button (✏️) in the bottom right to modify content
- **JSON-Driven**: All content is stored in `src/data/products.json` for easy editing
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

3. Open http://localhost:9399

## Editing Content

### Method 1: Using the Built-in Editor
1. Click the edit button (✏️) in the bottom right corner
2. Modify the JSON content in the editor
3. Click "Save" to apply changes
4. Refresh the page to see updates

### Method 2: Direct File Editing
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

- `npm run dev` - Start development server on port 9399
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Netlify Dev (Functions + SSR)

Use the project script:

```bash
npm run netlify:dev
```

If you see a port conflict on 9989:

```bash
lsof -n -i :9989
kill <PID>
```

If an integrations port error appears, stop previous sessions:

```bash
pkill -f "netlify dev"
```

### Local reverse proxy

Use Traefik at `https://bibliokit-launch.localhost` to proxy dev servers (frontend on 5176, functions on 9998 via path prefix). Caddy is no longer used.

## Support

For questions about this simplified version, refer to the main BiblioKit documentation or contact support. 