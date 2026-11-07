# Build the Sanlam Casablanca website

## Scope
Create a complete French-language showcase and lead-generation site for the Sanlam agency in Casablanca, matching the supplied brief and using its logo. Keep the experience frontend-only: quote and claim forms validate in the browser and show confirmation screens; nothing is submitted or stored.

## Pages and content
- Replace `/` with the agency homepage, product navigation, reassurance content, testimonials, FAQs, and contact calls to action.
- Add an offer detail page for each of the 11 insurance lines, plus `/devis`, `/sinistres`, `/agence`, and `/mentions-legales`; provide a branded not-found view.
- Keep agency details, offers, FAQs, testimonials, and quote-form definitions in typed local files. Build multi-step quote and claim forms with client-side validation and clear success states.

## Design and interactions
- Establish the requested Sanlam blue, navy, sky, ice, and warm-neutral theme, with Sora/Inter typography and responsive layouts.
- Use the uploaded logo in the header and footer and derive a square favicon from it. Create original CSS/SVG illustration accents, accessible menus and tabs, FAQ accordions, form progress, and restrained motion that respects reduced-motion preferences.
- Add click-to-call, WhatsApp links, mobile navigation and sticky contact actions.

## Technical approach
- Use the existing TanStack Start file-based routing, shadcn-style controls, Tailwind v4 tokens, React Hook Form, and Zod; do not add a backend or React Router.
- Add French per-page title, description, Open Graph and Twitter metadata; use the site's local content and safe JSON-LD for the agency and FAQs.
- Keep the scope to the requested site, update the existing routing test as appropriate, run the relevant tests, inspect the running page, and commit the completed changes.
