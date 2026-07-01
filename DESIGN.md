---
name: Best Solving
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#434653'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#1d59c1'
  primary: '#003c90'
  on-primary: '#ffffff'
  primary-container: '#0f52ba'
  on-primary-container: '#bcceff'
  inverse-primary: '#b0c6ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#4e04b8'
  on-tertiary: '#ffffff'
  tertiary-container: '#6632d0'
  on-tertiary-container: '#d7c5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00419c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The brand personality is grounded in reliability, competence, and calm authority. It serves as a dependable companion for users facing the stress of hardware failures or household emergencies. The goal is to move the user from a state of frustration to a state of resolution through a "functional-first" interface.

The design style is **Corporate / Modern** with a focus on high utility. It prioritizes clarity over decoration, using ample whitespace and a systematic information hierarchy to reduce cognitive load during high-stress moments. The aesthetic is clean and precise, signaling that the platform is an expert tool designed for practical results.

## Colors
The palette is engineered for trust and clarity.
- **Primary (Resolution Blue):** A deep, authoritative blue used for core branding, primary actions, and key navigation points. It represents stability and professional support.
- **Secondary (Success Green):** Used exclusively for "Solved" states and positive confirmations, providing an immediate psychological reward for the user.
- **Tertiary (AI/Trending Violet):** A vibrant violet used for "AI Analysis" and "Trending" features. This separates machine-learning insights from human-led solutions visually.
- **Neutral (Slate Gray):** A range of cool grays used for text, borders, and background layering to maintain a professional, calm environment.
- **Status (Amber):** Used for "Pending" or "In-Progress" states to indicate caution and ongoing work without triggering alarm.

## Typography
The typographic system prioritizes legibility under duress. 
- **Hanken Grotesk** is used for headlines to provide a modern, sharp, and professional look that feels contemporary yet established.
- **Inter** is the workhorse for all body copy and problem descriptions, chosen for its exceptional readability and neutral tone.
- **JetBrains Mono** is utilized for status labels, technical metadata, and "AI Analyzing" tags to give a precise, technical feel to data-driven insights.

Line heights are intentionally generous to ensure that step-by-step repair instructions are easy to follow even on small screens in low-light environments.

## Layout & Spacing
The design system utilizes a **Fixed Grid** model on desktop (12 columns) and a fluid 4-column model on mobile. 

- **Safety Margins:** Mobile layouts use a 20px side margin to ensure content is not clipped by cases or thumbs during one-handed use.
- **Vertical Rhythm:** A strict 8px base unit ensures consistent spacing between instructional steps. 
- **Sectioning:** Content is grouped into logical "cards" or "blocks" with significant vertical spacing (40px+) between unrelated sections to prevent information overload.

## Elevation & Depth
This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to convey depth. This keeps the interface feeling "light" and efficient.

- **Level 0 (Background):** A very light cool gray (#F8FAFC) to reduce screen glare.
- **Level 1 (Cards/Containers):** Pure white surfaces with a 1px solid border (#E2E8F0).
- **Level 2 (Active/Floating):** Use a subtle, highly diffused ambient shadow (10% opacity) for elements that require immediate attention, like a "Fix Found" modal or a persistent "Ask AI" button.
- **Interactive States:** Buttons and cards should slightly lift or change border-color on hover to provide tactile feedback.

## Shapes
The shape language is **Soft** (0.25rem - 0.75rem), balancing professional rigor with approachability. 

- **Primary Buttons/Inputs:** 0.25rem (4px) corner radius for a precise, "tooled" look.
- **Content Cards:** 0.5rem (8px) corner radius to subtly soften the layout and distinguish content areas from the screen edge.
- **Status Pills:** Fully rounded (pill-shaped) to make them instantly recognizable as non-interactive status indicators.

## Components
- **Buttons:** Primary buttons are high-contrast Resolution Blue with white text. "Upload Media" buttons use a distinct outlined style with a leading icon (camera/plus) to signal utility.
- **Status Indicators:** 
    - *Solved:* Secondary Green background with a checkmark icon.
    - *Pending:* Amber background with a subtle pulse animation.
    - *AI Analyzing:* Tertiary Violet background using the monospaced Label font.
- **Practical Cards:** Solution cards feature a clear "success rate" percentage in the top right and a bold title. Steps within a solution use a numbered list with high-contrast digits.
- **Inputs:** Form fields for problem descriptions must use a large touch-target area and include a "Speak to Describe" micro-action for hands-free convenience.
- **Solution Progress Bar:** A visual indicator at the top of long repair guides to show the user how far they are through the process.