# AIM Robotics website

Site for AIM Robotics, FTC Team 18657 (Bronx, NYC). Built with Next.js (App Router).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Layout

- `app/industry.css`: design-system tokens and component classes (`.btn`, `.blueprint`, `.card`, ...)
- `app/globals.css`: site-wide additions (CTA button variants, eyebrow labels, reveal motion)
- `app/shared.module.css`: type and layout patterns shared by the inner pages
- `app/<route>/page.tsx`: one folder per page: home, about, scan (+ `scan/setup`), live-air,
  sponsors, bullseye, first, contact, donate
- `components/`: header, footer, `CadViewer` (three.js), `Placeholder`, and `fx/` motion components
- `content/bullseye/`: Bullseye blog posts (one JSON file each, scraped from the old Wix blog), loaded by `lib/bullseye.ts`
- `scan-network/`: SCAN sensor firmware, Supabase schema and setup guide (also served at `/scan/setup`)

## Live Air data

The Live Air page shows simulated readings until Supabase is configured. Copy `.env.example`
to `.env.local` and fill it in; see `scan-network/README.md`.

## Placeholders to fill in

Content that isn't ready yet. Each spot is marked in the code with a `PLACEHOLDER` comment.

| What | Where it goes | Code |
|---|---|---|
| Robot CAD (GLB from Onshape) | `public/models/robot.glb` | `app/page.tsx` (`CadViewer` `src`) |
| Competition-day photo | `public/images/` | `app/first/page.tsx` |

The contact form opens the visitor's email app with the message filled in. To receive messages
directly, connect `app/contact/ContactForm.tsx` to a form service or a server action.
