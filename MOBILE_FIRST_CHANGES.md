# AxilTree Mobile-First Redesign Plan

## Goal
AxilTree ko true mobile-first banana, jahan pe base UI `320px-430px` screens ke liye optimize ho aur desktop enhancements progressive ho (`sm`, `md`, `lg`).

## Current Issues (Observed)
- Landing page (`app/page.tsx`) me bohat zyada inline styles hain jo desktop sizing se start hote hain.
- Fixed-size elements mobile pe overflow risk create karte hain (phone mockup `300x600`, large paddings, large titles).
- Global typography fallback (`Arial`) product branding aur readability ko weak banata hai.
- Spacing aur section rhythm mobile me heavy hai (`5rem` paddings repeatedly).
- Sticky header + large content blocks mobile viewport me fold ke neeche important CTA push kar dete hain.

## Mobile-First Design Principles (Apply Globally)
- Base style hamesha mobile ka ho; larger breakpoints sirf enhancements dein.
- Touch-first interactions: minimum target size `44x44`.
- Content-first hierarchy: CTA, value proposition, and profile preview top fold me.
- Lightweight visual system: less blur-heavy decorations on small screens.
- Avoid fixed heights where possible; use intrinsic sizing.

## Required UI/System Changes

### 1. Breakpoint Strategy Standardize
- Mantine breakpoints ko primary source of truth banayein (`theme.breakpoints`).
- `base` styles ko default rakhein, `sm/md/lg` overrides use karein.
- Inline styles ko CSS modules ya Mantine `styles/classNames` pattern me move karein.

### 2. Typography Scale (Mobile First)
- `h1` mobile: `1.75rem-2rem`, desktop pe progressively `3rem+`.
- Body text mobile: `0.95rem-1rem` with `1.5-1.65` line-height.
- Section titles ke liye consistent clamp use karein.
- `app/globals.css` me body font ko brand fonts se align karein (Arial remove).

### 3. Layout & Spacing Tokens
- Section padding mobile base: `2.5rem 1rem`.
- Medium sections: `3rem 1rem`; hero max `4rem` top on mobile.
- Desktop-only generous spacing `md+` pe add karein.
- Shared spacing tokens define karein (e.g. `--section-py-sm`, `--section-py-lg`).

### 4. Header Mobile Optimization
- Sticky header height reduce karein.
- Header actions ko compact variant me convert karein (icon + short labels).
- Logged-in vs logged-out menu ke liye drawer/hamburger pattern add karein if crowded.

### 5. Hero Section Refactor
- Badge + title + CTA ko first screen me fit karna target ho.
- Multi-point trust row (`Free forever`, etc.) ko wrap-safe banayein.
- CTA full-width on mobile, auto-width on desktop.

### 6. Preview/Mockup Section
- Fixed `300x600` mockup ko responsive container se replace karein:
  - `width: min(88vw, 320px)`
  - `aspect-ratio` based sizing
- Decorative blur circles mobile pe reduce/disable karein (performance + clarity).
- Internal card paddings mobile pe shrink karein.

### 7. Cards and Grids
- All cards mobile pe single column by default.
- Card internal padding mobile: `1rem-1.25rem`.
- `SimpleGrid` already responsive hai; ensure card typography and badges mobile-size tuned hon.

### 8. How-It-Works Steps
- `Group wrap="nowrap"` mobile pe cramped ho sakta hai; `Stack` fallback dein.
- Step number icon size mobile pe smaller rakhein.
- Text alignment mobile center/left ke liye consistent rule define karein.

### 9. Contact Form Mobile UX
- Inputs full-width, clear vertical spacing.
- Keyboard overlap and scroll behavior test karein (especially iOS/Android browsers).
- Submit button sticky/always-visible pattern consider karein for long forms.

### 10. Footer Simplification
- Footer links ko mobile pe vertical stack ya 2-column wrap dein.
- Link tap targets increase karein.

## Performance & Accessibility Changes
- Large shadows/blur effects reduce on low-width screens.
- `prefers-reduced-motion` support add karein for animations.
- Color contrast audit (text on gradients).
- Focus states clear rakhein (keyboard and accessibility).
- Mobile Lighthouse targets:
  - Performance >= 85
  - Accessibility >= 95
  - Best Practices >= 95

## Code Architecture Changes
- `app/page.tsx` ko section components me split karein:
  - `HeroSection`
  - `PreviewSection`
  - `BenefitsSection`
  - `HowItWorksSection`
  - `ContactSection`
- Har section ke liye dedicated styles file/module use karein.
- Reusable constants for paddings, font sizes, radii, shadows.

## Priority Execution Plan

### Phase 1 (Quick Wins: 1-2 days)
- Typography + spacing base reset.
- Hero and header mobile tuning.
- CTA full-width behavior.
- Footer wrap fix.

### Phase 2 (Core Layout: 2-4 days)
- Preview mockup responsiveness.
- How-it-works step layout mobile fallback.
- Card paddings and section rhythm normalization.

### Phase 3 (Refactor & QA: 3-5 days)
- Inline styles reduce and modularize.
- Accessibility + performance audit.
- Device testing matrix completion.

## Device Testing Matrix
- iPhone SE (375x667)
- iPhone 14/15 (390x844)
- Pixel 7/8 (412x915)
- Small Android (~360x800)
- Tablet breakpoint (~768px) for transition checks

## Definition of Done
- No horizontal overflow on `320px+` widths.
- Core CTA above fold on primary landing mobile view.
- All interactive elements pass tap target minimum.
- No section feels desktop-shrunk on mobile.
- Lighthouse and accessibility thresholds achieved.

## Files To Update First
- `app/page.tsx`
- `app/globals.css`
- `app/components/Header.tsx`
- `app/theme/mantineTheme.ts`
