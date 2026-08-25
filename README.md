# P.Sonkar House Of Ventures

A Vite-powered React JavaScript site for P.Sonkar House Of Ventures.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

The application uses hash-based React Router routes such as `/#/`, `/#/about`, `/#/ventures`, and `/#/contact`. This keeps direct refreshes working on static hosts without server-side route rewrites. Plain route URLs for `/about`, `/ventures`, `/services`, `/contact`, and `/admin` are also included in the production build. The main entrypoint is `src/main.jsx`.

## Scripts

```bash
npm run build
npm run preview
npm run lint
```

For production hosting, serve the generated `dist` directory.

## Contact delivery

Copy `.env.example` to `.env`, then add the values from your Supabase project. Vite exposes only variables beginning with `VITE_`, so use these names exactly and restart the dev server after changing them:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_STORAGE_BUCKET=website-images

VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Run the additions in `supabase/schema.sql` in the Supabase SQL editor before using the admin panel or dynamic site content. The EmailJS values are optional; configure an EmailJS template with `to_email` for direct contact-form delivery.

Without EmailJS variables, the email action opens the visitor's configured mail app. WhatsApp always opens a prefilled message addressed to the admin number saved in the Contact details tab.
