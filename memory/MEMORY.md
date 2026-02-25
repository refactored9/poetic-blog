# Project: The Solo Akash — Poetic Blog

## Stack
- **Framework**: Next.js 14+ (App Router), TypeScript
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"`)
- **Fonts**: Playfair Display (serif, headings) + Inter (sans, body) via next/font/google
- **Backend**: Separate API at `NEXT_PUBLIC_API_URL` (default: localhost:3001/api)
- **Maps**: Leaflet

## Design System (Kimi editorial redesign Feb 2026)
- **Aesthetic**: Warm editorial magazine — Kimi "Travel Diaries India" inspired, linen bg, Oswald headings, no rounded corners
- **Light palette**: #F2EDE7 bg (linen), #161616 text, #535353 muted, #E5E5E5 border, #8B6534 accent (warm brown)
- **Dark palette**: #161616 bg, #F2EDE7 text (linen), #B1B1B1 muted, #2A2A2A border, #C4955A accent
- **Fonts**: Oswald (--font-serif, headings — condensed editorial) + Roboto (--font-sans, body)
- **Border radius**: 0 (sharp edges on buttons/inputs/cards) or 2-4px (subtle)
- **Nav**: uppercase tracking-[0.18em] logo, tracking-[0.15em] links, active = underline bar under link
- **Buttons**: Sharp edges (no border-radius), uppercase tracking-[0.15em], border-toggle hover (bg↔transparent)
- **Typography**: Oswald for all h1-h6, tracking-wide, font-semibold; body in Roboto normal
- **Footer**: Dark bg (foreground color), linen text, giant Oswald background watermark "THE SOLO AKASH"
- **Hero**: Full-viewport image with gradient overlay, Oswald title, white CTA button

## Key Files
- `app/globals.css` — CSS variables + utility classes
- `app/layout.tsx` — root layout, fonts (Playfair + Inter)
- `components/Header.tsx` — sticky nav, dark/light/system theme toggle, mobile drawer
- `components/Footer.tsx` — clean 4-col grid footer (no MountainDivider/WandererQuote)
- `components/BlogCard.tsx` — default/featured/compact variants
- `components/BlogSearch.tsx` — search + tag filter + featured hero + grid
- `components/Newsletter.tsx` — left-aligned form, clean CTA
- `app/page.tsx` — hero + BlogSearch + quick links + Newsletter
- `app/blog/[slug]/page.tsx` — full blog post with reading progress, reactions, comments
- `app/about/page.tsx` — two-column profile layout
- `components/StarField.tsx` — dark mode star animation (uses `starTwinkle` keyframe)

## Layout Classes
- `.wide-width` → max-w-1160px centered
- `.content-width` → max-w-720px centered
- `.full-width` → max-w-1400px centered

## Removed from footer/homepage
- `MountainDivider` — not used in Footer or homepage anymore
- `WandererQuote` — not used in Footer or homepage anymore
- Both components still exist for other potential uses

## Content Protection
- Text selection disabled globally via CSS (user-select: none on body)
- Re-enabled on inputs/contenteditable
- Image drag disabled (pointer-events: none on img)
- Print disabled (@media print: display none)
