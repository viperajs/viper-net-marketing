# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 14 App Router project. Route pages, layouts, and API handlers live in `app/`; public marketing pages are in `app/page.jsx`, while admin screens are under `app/admin/` and API endpoints under `app/api/`. Reusable UI and section components live in `components/`, with shadcn-style primitives in `components/ui/`. Shared helpers are in `lib/`, including Supabase clients in `lib/supabase/`. Static assets such as icons and favicons belong in `public/`.

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server, usually at `http://localhost:3000`.
- `npm run build`: create a production build and catch route, bundling, and type/lint integration issues.
- `npm run start`: serve the production build locally after `npm run build`.
- `npm run lint`: run ESLint with `next/core-web-vitals` and `next/typescript` rules.

Install dependencies with `npm install`; the committed `package-lock.json` indicates npm is the expected package manager.

## Coding Style & Naming Conventions

Use JavaScript/JSX for app code, matching the existing `.jsx` and `.js` files. Prefer functional React components, named exports for shared utilities, and the `@/` alias for root imports. Keep component filenames descriptive, for example `components/OurProcess.jsx` or `components/ui/infinite-slider.jsx`, and colocate small component-specific styles such as `ProfileCard.css` beside the component. Use Tailwind utility classes for layout and styling, and `cn()` from `lib/utils.js` when merging conditional classes. Follow the existing 2-space indentation style and run `npm run lint` before submitting changes.

## Testing Guidelines

No automated test runner is currently configured. For now, validate changes with `npm run lint` and `npm run build`, then manually check affected public pages, admin pages, and API flows. If adding tests, add a package script such as `npm test`, use clear names like `contact-route.test.js`, and cover Supabase/Resend integration points with mocks rather than live credentials.

## Commit & Pull Request Guidelines

Recent history uses short imperative messages, sometimes with a Conventional Commit prefix such as `feat:`. Prefer concise messages like `feat: add admin website editor` or `fix: handle missing logo URL`. Pull requests should include a brief summary, validation steps run, linked issues when applicable, and screenshots or screen recordings for UI changes.

## Security & Configuration Tips

Required environment variables include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `NOTIFICATION_EMAIL`. Keep service-role and email keys out of git. Review `middleware.js` when changing admin routes so authentication redirects remain intact.
