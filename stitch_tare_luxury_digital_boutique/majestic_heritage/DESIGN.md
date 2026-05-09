---
name: Majestic Heritage
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#46464c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#595e6f'
  primary: '#030714'
  on-primary: '#ffffff'
  primary-container: '#1a1f2e'
  on-primary-container: '#828699'
  inverse-primary: '#c1c6da'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#070704'
  on-tertiary: '#ffffff'
  tertiary-container: '#211f1a'
  on-tertiary-container: '#8a8780'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee2f7'
  primary-fixed-dim: '#c1c6da'
  on-primary-fixed: '#161b2a'
  on-primary-fixed-variant: '#414657'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#e7e2da'
  tertiary-fixed-dim: '#cac6be'
  on-tertiary-fixed: '#1d1c17'
  on-tertiary-fixed-variant: '#494741'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 120px
  section-gap-mobile: 64px
  container-max-width: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
---

## Brand & Style

The design system for TAREÉ JEWELRY is rooted in the concept of "Regal Metamorphosis." It celebrates the intersection of high-end African luxury and timeless feminine elegance. The brand personality is poised, sophisticated, and culturally rich, targeting a discerning clientele that values heritage and exquisite craftsmanship.

The visual style follows a **Minimalist-Luxury** approach. It utilizes expansive whitespace (Cream and White) to allow the intricate gold jewelry to breathe, while anchoring the experience in the Deep Navy of an African night sky. Design elements will incorporate subtle motifs inspired by the butterfly monogram—specifically fluid, symmetrical curves and golden accents—to evoke a sense of transformation and royalty. The interface must feel like a high-end physical boutique: quiet, expensive, and personal.

## Colors

This design system employs a high-contrast palette to establish prestige. 

- **Deep Navy (#1a1f2e):** Used for primary text, navigation backgrounds, and footer sections to provide a grounding sense of authority.
- **Champagne Gold (#d4af37):** Reserved for interactive elements (CTAs), iconography, and the butterfly logo. It should be used sparingly to maintain its perceived value.
- **Soft Cream (#f5f0e8):** Applied to secondary layout sections and background containers to soften the transition between pure white product spaces and dark navy headers.
- **Pure White (#ffffff):** The mandatory background for all product photography to ensure the gold and gemstones are the undisputed focal point.

## Typography

The typography strategy pairs the historical weight of a transitional serif with the functional clarity of a modern sans-serif.

- **Headlines:** Uses *Playfair Display*. This font conveys the "royal" and "timeless" nature of the brand. For large display headings, use tighter letter spacing to create a high-fashion editorial feel.
- **Body & Interface:** Uses *Manrope*. Its clean, geometric construction provides a necessary modern balance to the serif headings, ensuring legibility across product descriptions and checkout flows.
- **Labels:** Small labels and overlines should use *Manrope* in all-caps with generous letter-spacing to mimic the engraving found on luxury jewelry boxes.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model on desktop to maintain an editorial, magazine-like feel. 

- **Grid:** A 12-column grid with a maximum width of 1280px. Gutters are kept wide (24px) to emphasize the premium nature of the brand.
- **Rhythm:** Vertical spacing is intentionally generous. Sections should be separated by large gaps (120px) to prevent the UI from feeling cluttered.
- **Responsive Behavior:** On mobile, the grid collapses to 4 columns. Margins shrink to 20px, and section gaps are reduced by approximately 50% to maintain momentum while scrolling.
- **Product Display:** Product grids should alternate between 2-column and 1-column layouts to showcase hero pieces with maximum impact.

## Elevation & Depth

To maintain a "flat luxury" aesthetic, this design system avoids heavy shadows in favor of **Tonal Layers** and **Low-contrast Outlines**.

- **Layering:** Depth is communicated by placing Pure White cards over Soft Cream backgrounds. 
- **Borders:** Instead of shadows, use 1px solid borders in a very light navy tint (10% opacity) or champagne gold for active states.
- **Glassmorphism:** Navigation bars may use a subtle backdrop blur (20px) with a 90% opaque White or Navy background to maintain focus during scroll.
- **Depth of Field:** Product photography should employ a shallow depth of field, which provides a natural, organic sense of depth that digital shadows cannot replicate.

## Shapes

The shape language is primarily **Soft (Level 1)**. 

Jewelry is often organic and curved; therefore, the UI should not be aggressively sharp. A subtle 0.25rem (4px) corner radius on buttons, input fields, and product cards provides a hint of softness without losing the professional, "architectural" feel of high-end luxury. Large hero images or promotional banners may remain sharp (0px) to maintain a classic editorial aesthetic.

## Components

- **Buttons:** Primary CTAs are solid Champagne Gold with Deep Navy text. Secondary buttons are ghost-style with a Deep Navy or Gold outline. Use generous horizontal padding.
- **Input Fields:** Minimalist design—bottom border only or a very light 1px frame. Floating labels in *Manrope* (label-caps).
- **Cards:** Product cards use a Pure White background with no visible border. The product name is in *Playfair Display* and price in *Manrope*.
- **Navigation:** The logo is centered. Links use *Manrope* in all-caps with a thin gold underline appearing on hover.
- **Featured Motifs:** Use the "Butterfly Crown" as a subtle watermark in the background of certain sections or as a separator between editorial blocks. 
- **Micro-interactions:** Transitions should be slow and elegant (e.g., 400ms fades or subtle scale-ups on images) to mimic the deliberate pace of a luxury shopping experience.