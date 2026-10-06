---
name: Nocturnal Precision
colors:
  surface: '#0e131f'
  surface-dim: '#0e131f'
  surface-bright: '#343946'
  surface-container-lowest: '#090e1a'
  surface-container-low: '#161b28'
  surface-container: '#1a1f2c'
  surface-container-high: '#252a37'
  surface-container-highest: '#303542'
  on-surface: '#dee2f3'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dee2f3'
  inverse-on-surface: '#2b303d'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#cebdff'
  on-tertiary: '#381385'
  tertiary-container: '#9b7fed'
  on-tertiary-container: '#31057e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#e8ddff'
  tertiary-fixed-dim: '#cebdff'
  on-tertiary-fixed: '#21005e'
  on-tertiary-fixed-variant: '#4f319c'
  background: '#0e131f'
  on-background: '#dee2f3'
  surface-variant: '#303542'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies the calm, focused atmosphere of late-night engineering. Designed for power users, developers, and digital artisans crafting their presence across desktop ecosystems, the visual language balances deep space-grade utility with modern luxury.

### Aesthetic Movement
- **Nocturnal Glassmorphism & Tonal Layering**: Deep navy and obsidian surfaces layered with translucent frosted planes, crystalline linear highlights, and delicate atmospheric glows.
- **Utilitarian Elegance**: Density-optimized desktop controls, razor-sharp metric readouts, and quiet micro-interactions that avoid sensory overload.
- **Atmosphere**: Cold midnight stillness, precision avionics, and low-luminescence HUDs. Elements feel optical, milled, and weightlessly suspended.

## Colors

The palette leverages high-depth navy baselines with cold luminous accents. Rather than pure neutral grays, all dark surfaces carry subtle blue-black pigments to emulate deep night skies.

### Functional Roles
- **Base Surfaces**: `#0a0d14` serves as the canvas/root layer; `#0f1420` provides container backgrounds; `#141b2d` serves as elevated panels and card backgrounds.
- **Primary Accent (`#8b5cf6` / `#7c3aed`)**: Used for primary calls-to-action, active presence indicators, and focal highlights. Retains saturation without bleeding into surrounding dark surfaces.
- **Secondary Accent (`#38bdf8`)**: Ice-cyan dedicated to real-time status pulses, API sync confirmations, connection telemetry, and secondary data visualizations.
- **Subtle Borders & Separators**: Tinted slate-gray `#1e293b` rendered between `15%` to `40%` opacity, preventing harsh dividing lines while retaining panel definition.

## Typography

The type system blends the neutral precision of Geist for primary UI navigation with JetBrains Mono for system values, status payloads, elapsed timestamps, and raw RPC attributes.

- **Geist**: Handles structural hierarchy, titles, settings labels, and conversational body copy. Tight letter spacing (`-0.01em` to `-0.03em`) produces an engineered desktop feel.
- **JetBrains Mono**: Reserved for dynamic presence previews, live counters, keybindings, client status badges, and JSON metadata.

## Layout & Spacing

A compact, desktop-first multi-pane architecture tailored for windowed operating system environments. Layouts conform to a fixed sidebar (navigation & profiles) and a fluid split workspace (live preview pane alongside editor/telemetry controls).

- **Grid & Columns**: Workspace uses an asymmetrical fluid layout with a fixed left utility bar (`64px`), a fixed profile list (`240px`), and a dual-column editor/preview area that scales linearly beyond `1024px`.
- **Rhythm**: Compact 4px base increment. Desktop inputs, list items, and status groups prioritize dense visual scanning without nested scrollbars.
- **Breakpoints**: 
  - Desktop Narrow (`800px` - `1023px`): Preview shifts to collapsible drawer; configuration fields stack vertically.
  - Desktop Standard (`1024px+`): Full three-pane view with side-by-side rich presence preview.

## Elevation & Depth

Visual hierarchy relies on translucent layers, low-opacity boundary hairpins, and subtle optical lighting rather than heavy, opaque dropshadows.

- **Base Layer (Level 0)**: `#0a0d14` - Desktop window background and unpopulated workspace areas.
- **Surface Canvas (Level 1)**: `#0f1420` with `backdrop-filter: blur(16px)` - Navigation sidebars and control toolbars.
- **Elevated Floating Panels (Level 2)**: `#141b2d` rendered at `70%` alpha with a top-down gradient border (`rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.01)`).
- **Active Ambient Glow**: Critical focus points, active presence states, and primary CTAs project a dual-layer diffuse shadow: `0 0 24px rgba(139, 92, 246, 0.15), 0 4px 12px rgba(0, 0, 0, 0.4)`.
- **Ghost Dividers**: Fine 1px borders using `rgba(30, 41, 59, 0.45)` maintain separation between adjacent deep dark surfaces without harsh line weights.

## Shapes

Corner radii balance precision software tool design with modern tactile softening.

- **Base Radius (`0.25rem` / `4px`)**: Text fields, dropdown items, compact action buttons, and telemetry chips.
- **Container Radius (`0.5rem` / `8px`)**: Cards, preview canvases, modal dialogs, and navigation flyouts.
- **Nested Curvature**: Outer panels use `8px` corner radii, while nested inner elements use `4px` to maintain geometric alignment.

## Components

### Buttons
- **Primary**: Solid purple gradient (`#8b5cf6` to `#7c3aed`) with a subtle `1px` inner top highlight `rgba(255, 255, 255, 0.2)`. Hover triggers an ambient purple glow (`0 0 16px rgba(139, 92, 246, 0.35)`).
- **Secondary / Glass**: Background `rgba(20, 27, 45, 0.6)` with a `1px` border of `rgba(30, 41, 59, 0.6)`. Text in `#e2e8f0`. Hover transitions border to `rgba(56, 189, 248, 0.4)` and surface to `rgba(30, 41, 59, 0.8)`.
- **Ghost / Icon**: Transparent surface, `#94a3b8` icon fill, transitioning to `#f8fafc` with `rgba(255, 255, 255, 0.05)` background on hover.

### Inputs & Selectors
- **Text & Number Fields**: Surface `#0f1420` with an inset baseline border `rgba(30, 41, 59, 0.8)`. Focus applies an accent border `#8b5cf6` accompanied by an inner hairline glow (`box-shadow: 0 0 0 1px #8b5cf6`).
- **Monospace Time/State Editors**: Monospaced font display, compact padding (`6px 10px`), and trailing action chips (e.g., "now", "clear", "loop").

### Status Chips & Badges
- Built with a height of `20px`, `4px` radius, and `JetBrains Mono` at `11px`.
- **Active Presence**: Background `rgba(56, 189, 248, 0.1)`, text `#38bdf8`, with a pulsing `6px` dot indicator.
- **Idle / Off**: Background `rgba(30, 41, 59, 0.4)`, text `#64748b`.

### Live Presence Card (Discord Mock)
- Mimics the platform profile popout with elevated glass fidelity. Dark navy frame (`#141b2d` at `90%` opacity), high-contrast white text (`#f8fafc`), muted secondary labels (`#94a3b8`), and a high-resolution square asset preview with an ice-cyan small asset badge nestled at the bottom-right corner.

### Checkboxes & Switches
- **Switches**: Track size `32px x 18px` in `#1e293b`. Thumb is `14px` white circle. Checked track transitions to `#8b5cf6` with smooth `150ms` ease-out motion.