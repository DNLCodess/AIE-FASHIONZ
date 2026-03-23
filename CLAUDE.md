# Aiefashion — Claude Code Instructions

## Project

US-based (Lanham, Maryland) luxury multi-category fashion e-commerce. Global market. Mobile-first. High-quality minimalist UI.

**Brand name:** Aiefashion (no Z)
**Contact:** aiefashionllc@gmail.com · +1 (301) 433-5307
**Default currency:** USD (cents as integers internally)
**Live site being replaced:** https://www.aiefashionz.com

---

## Stack

- **Framework:** Next.js 15 (App Router, RSC by default)
- **Language:** JavaScript only — no TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database/Auth/Storage:** Supabase
- **Server state:** React Query (TanStack Query v5)
- **Client state:** Zustand
- **Payments:** Stripe (US/international) + Paystack (Nigeria)
- **Email:** Resend + React Email
- **Dark/light mode:** next-themes
- **Forms:** React Hook Form + Zod
- **Hosting:** Vercel
- **Errors:** Sentry
- **Analytics:** Vercel Analytics + Posthog

---

## Design System

### Colours (CSS variables — defined in globals.css @theme)

**These are the canonical variable names. Use exactly these in all code.**

```
Light mode:
  --color-background:     #FDFBF7   (warm ivory — page background)    → Tailwind: bg-background / text-background
  --color-surface:        #FFFFFF   (cards, modals, drawers)           → bg-surface
  --color-surface-raised: #F8F5F2   (hover states, subtle contrast)    → bg-surface-raised
  --color-foreground:     #1C1C1A   (headings, body text)              → text-foreground
  --color-muted:          #555553   (labels, captions)                 → text-muted
  --color-subtle:         #888784   (placeholders, disabled)           → text-subtle
  --color-border:         #E8E5E0   (dividers, input borders)          → border-border
  --color-gold:           #D4AF37   (CTAs, badges, prices, accents)    → bg-gold / text-gold
  --color-gold-dark:      #BF9B2F   (gold button hover)               → bg-gold-dark / hover:bg-gold-dark
  --color-gold-light:     #F7F0D8   (gold-tinted backgrounds, blur placeholder) → bg-gold-light
  --color-error:          #C0392B                                      → text-error / border-error
  --color-success:        #2D7A47                                      → text-success

Dark mode ([data-theme="dark"]):
  --color-background:     #121212
  --color-surface:        #1E1E1E
  --color-surface-raised: #2A2A2A
  --color-foreground:     #F5F5F5
  --color-muted:          #B8B8B8
  --color-subtle:         #888888
  --color-border:         #2E2E2E
  --color-gold:           #D4AF37
  --color-gold-dark:      #E0C07A
```

> **Do not use** the old names `--color-bg-base`, `--color-text-primary`, `--color-text-secondary`,
> `--color-text-muted`, `--color-gold-hover`, or `--color-gold-subtle` — they do not exist in globals.css.

### Typography

- **Heading/Display:** Instrument Serif (Google Fonts, self-hosted in /public/fonts)
- **Body/UI:** Instrument Sans (Google Fonts, self-hosted in /public/fonts)
- Font vars: `--font-heading`, `--font-body`
- Sizes: display-xl 4.5rem → body-xs 0.75rem (see design brief)
- Prices always use Instrument Serif + gold colour

### UI Rules

- Border radius: max 4px on interactive elements — sharp, refined
- Transitions: 200ms ease base, 150ms fast, 350ms slow
- Product images: 3:4 ratio for apparel, 1:1 for accessories
- Blur placeholder for all images: gold-tinted `#F7F0D8`
- Grid: 4-col desktop, 3-col tablet, 2-col mobile
- No shadows on product cards — whitespace defines separation
- Buttons: gold bg, `#1C1C1A` text, full-width on mobile
- Header: transparent over hero → `bg-surface/95 backdrop-blur-sm` on scroll

---

## Project Structure

```
app/
  (storefront)/     — customer pages, uses storefront layout
  (admin)/          — admin pages, uses admin layout + role guard
  api/
    checkout/
    webhooks/stripe/
    webhooks/paystack/
    products/revalidate/
components/
  ui/               — shadcn/ui primitives only
  layout/           — Header, Footer, MobileNav, ThemeToggle
  product/          — ProductCard, ProductGrid, ProductGallery, VariantSelector
  cart/             — CartDrawer, CartItem, CartSummary
  checkout/         — CheckoutForm, AddressForm, DeliveryOptions, PaymentStep
  home/             — HeroBanner, CategoryGrid, FeaturedProducts, FlashSaleBanner
  admin/            — AdminSidebar, ProductForm, OrderTable
lib/
  supabase/
    client.js       — createBrowserClient()
    server.js       — createServerClient() using cookies()
  stripe.js
  paystack.js
  email/            — React Email templates
  utils.js
store/
  cartStore.js      — cart items, add/remove/update/clear
  uiStore.js        — cartOpen, mobileNavOpen, currency
hooks/
  useProducts.js    — React Query
  useProduct.js
  useCart.js
  useOrders.js
  useWishlist.js
  useSearch.js
middleware.js       — protects /account/* and /admin/*
```

---

## Categories

```
/shop/luxury-fabrics
/shop/bags-shoes
/shop/jewellery
/shop/party-dinner-wear
/shop/childrens-wear
/shop/body-shapers
```

---

## Rendering Rules

| Page type           | Strategy                                 |
| ------------------- | ---------------------------------------- |
| Homepage            | ISR revalidate=60                        |
| Category pages      | SSR                                      |
| Product detail      | SSG + ISR (on-demand revalidate via API) |
| Cart                | CSR                                      |
| Checkout            | CSR + API routes                         |
| Account pages       | SSR + auth guard                         |
| Admin pages         | SSR + role guard                         |
| Search              | SSR                                      |
| Static (FAQ, About) | SSG                                      |

---

## State Management Rules

| Concern                 | Tool                       |
| ----------------------- | -------------------------- |
| Products / categories   | React Query                |
| Orders / reviews        | React Query                |
| Wishlist (logged in)    | React Query + Supabase     |
| Guest cart              | Zustand + localStorage     |
| Logged-in cart          | Zustand synced to Supabase |
| Cart drawer open/closed | Zustand (uiStore)          |
| Currency preference     | Zustand + localStorage     |
| Auth session            | Supabase Auth SDK only     |

---

## Supabase Conventions

- Browser client: `lib/supabase/client.js` — use in Client Components
- Server client: `lib/supabase/server.js` — use in Server Components, Route Handlers, middleware
- Never expose service role key to client — server-side only
- RLS is enabled on all tables — always test as authenticated user AND anonymous
- Admin bypasses RLS via service role key in server routes only

---

## Key Conventions

- RSC by default — only add `'use client'` when needed (event handlers, hooks, browser APIs)
- No TypeScript — use JSDoc `/** @type {} */` annotations where clarity helps
- Zod schemas live alongside their form component
- All currency values stored in pence/kobo (integers) — display layer handles formatting
- Slugs: lowercase, hyphenated, unique — generated from title on product create
- Images stored in Cloudinary — `secure_url` stored in DB (format: `https://res.cloudinary.com/<cloud>/image/upload/...`)
- All admin mutations go through API routes — never call service role client from browser
- Webhook routes: always verify signature (Stripe: `stripe.webhooks.constructEvent`, Paystack: HMAC SHA512)

---

## US Legal (non-negotiable, built-in from day one)

- No VAT — sales tax not collected at checkout (US state tax complexity handled separately if required)
- 30-day returns policy clearly stated at checkout and in footer
- Cookie consent banner on first visit (CCPA-aligned for California users)
- WCAG 2.1 AA accessibility minimum
- BNPL must include required credit disclosures if added in future

---

## Agents

Three specialist review agents are available. Invoke them at key milestones:

| Agent               | File                                    | When to use                          |
| ------------------- | --------------------------------------- | ------------------------------------ |
| Performance Auditor | `.claude/agents/performance-auditor.md` | After any page/component is complete |
| UI/UX Reviewer      | `.claude/agents/ui-ux-reviewer.md`      | After UI implementation of any page  |
| Market Comparator   | `.claude/agents/market-comparator.md`   | After full feature sections ship     |

---

## Skills

Reusable instruction modules. Read before executing that task type:

| Skill            | File                                 | Use when                                |
| ---------------- | ------------------------------------ | --------------------------------------- |
| Component        | `.claude/skills/component.md`        | Building any React component            |
| Supabase Query   | `.claude/skills/supabase-query.md`   | Writing DB queries or RLS policies      |
| React Query Hook | `.claude/skills/react-query-hook.md` | Creating a new useX data hook           |
| Checkout Flow    | `.claude/skills/checkout-flow.md`    | Any work touching checkout or payments  |
| Admin CRUD       | `.claude/skills/admin-crud.md`       | Admin product/order/category management |
| SEO              | `.claude/skills/seo.md`              | Adding metadata, OG, structured data    |
| Email Template   | `.claude/skills/email-template.md`   | Creating Resend/React Email templates   |

---

## Do Not

- Do not use TypeScript
- Do not use the Pages Router
- Do not add CSS-in-JS libraries (styled-components, emotion)
- Do not use Redux — Zustand only for client state
- Do not store prices as floats — integers (cents/kobo) only
- Do not call Supabase service role client from any Client Component
- Do not skip RLS testing
- Do not use `any` workarounds or disable eslint rules without a comment explaining why
- Do not add animation libraries (Framer Motion etc.) without explicit instruction
- Do not over-engineer — prefer simple, readable code over clever abstractions
