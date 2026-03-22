# Skill: Component

Read before building any React component.

## Decision: Server vs Client

Default to Server Component (no directive).
Add `'use client'` only if the component needs:

- `useState` / `useReducer` / `useEffect`
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- React Query hooks (`useQuery`, `useMutation`)
- Zustand store access

If a large component needs one small interactive part, extract only that part as a Client Component.

## File Naming

- PascalCase: `ProductCard.js`, `CartDrawer.js`
- One component per file
- Co-locate related sub-components if they're never used elsewhere

## Structure Template

```jsx
// 'use client'  ← only if needed

import ...

/**
 * @param {{ product: import('@/types').Product }} props
 */
export default function ComponentName({ prop1, prop2 }) {
  // hooks first (if client)
  // derived values
  // handlers
  // render
  return (...)
}
```

## Tailwind Usage

- Use design token classes: `text-[var(--color-text-primary)]` or configure Tailwind to extend with token names
- Never hardcode hex values in className — use the token variable
- Mobile-first: base styles = mobile, `md:` = tablet, `lg:` = desktop
- Transition classes: `transition-all duration-200 ease-out` (base), `duration-150` (fast), `duration-350` (slow)

## Design System Enforcement

- All text colours from `--color-text-*` tokens
- All backgrounds from `--color-bg-*` or `--color-surface*` tokens
- Gold accent only via `--color-gold` — CTAs, price, selected state, badges
- Border radius: `rounded` (4px) or `rounded-sm` (2px) max on interactive elements
- No Tailwind `shadow-*` on product cards

## Images

Always use `next/image`:

```jsx
import Image from 'next/image'

<Image
  src={url}
  alt={meaningful description}
  width={400}
  height={533}     // 3:4 ratio for apparel
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."  // gold-tinted placeholder
  className="object-cover w-full h-full"
/>
```

Set `priority` only on above-the-fold images (hero, first product row).

## Loading States

Use skeleton screens that match the component layout — not spinners:

```jsx
// ProductCard skeleton
<div className="animate-pulse">
  <div className="bg-[var(--color-surface-raised)] aspect-[3/4] w-full" />
  <div className="mt-3 h-4 bg-[var(--color-surface-raised)] rounded w-3/4" />
  <div className="mt-1 h-4 bg-[var(--color-surface-raised)] rounded w-1/4" />
</div>
```

## Error Boundaries

Wrap data-dependent sections in error boundaries. Provide on-brand fallback UI, never raw error messages to users.

## Accessibility

- All icon-only buttons: `aria-label="descriptive action"`
- Images: meaningful `alt` — never empty for product images, empty `alt=""` only for decorative
- Interactive elements: keyboard accessible, visible focus ring (`focus-visible:ring-2 ring-[var(--color-gold)]`)
- Colour contrast: check gold on ivory manually (`#D4AF37` on `#FDFBF7` — borderline, use on large text / UI elements, not small body copy)
