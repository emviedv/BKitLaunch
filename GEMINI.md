# BiblioKit Launch

This is a React-based web application built with Vite. It serves as the launch website for BiblioKit.

## Project Overview

*   **Framework**: [React](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Routing**: [wouter](https://github.com/molefrog/wouter)
*   **Deployment**: [Netlify](https://www.netlify.com/)
*   **Server-side Rendering (SSR)**: Netlify Edge Functions
*   **Testing**: [Playwright](https://playwright.dev/) for end-to-end tests.

## Building and Running

### Development

To run the development server:

```bash
npm run dev
```

This will start the Vite development server on `http://localhost:9990`.

### Netlify Dev

To simulate the Netlify environment locally, including edge functions:

```bash
npm run netlify:dev
```

### Production Build

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with the client and server builds.

## Testing

To run the end-to-end tests:

```bash
npm run test:e2e
```

## Deployment

Deployment is handled automatically by Netlify when changes are pushed to the main branch. The `netlify.toml` file contains the deployment configuration.

## Development Conventions

*   The project uses TypeScript.
*   Code is organized in the `src` directory.
*   Components are located in `src/components`.
*   Reusable hooks are in `src/hooks`.
*   Static assets are in the `public` directory.
*   Environment variables are managed with a `.env` file (see `.env.example`).
*   The project uses `ESLint` for linting (see `.eslintrc.cjs`).
*   The project uses `knip` to find unused files, exports, and dependencies.
