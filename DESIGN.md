---
name: Docket
description: A calm task ledger for one person's day, with an admin view over the whole board.
colors:
  canvas: "oklch(0.965 0.006 165)"
  surface: "oklch(1 0 0)"
  ink: "oklch(0.205 0.015 190)"
  ink-soft: "oklch(0.355 0.015 190)"
  muted: "oklch(0.48 0.012 190)"
  line: "oklch(0.885 0.008 175)"
  line-strong: "oklch(0.78 0.01 175)"
  accent: "oklch(0.44 0.08 195)"
  accent-soft: "oklch(0.94 0.018 195)"
  urgent: "oklch(0.51 0.17 35)"
  urgent-soft: "oklch(0.955 0.022 35)"
  success: "oklch(0.45 0.1 150)"
  warning: "oklch(0.6 0.12 75)"
typography:
  display:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  xs: "3px"
  sm: "5px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  button-danger:
    backgroundColor: "{colors.urgent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "40px"
  stat:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
---

# Design System: Docket

## Overview

**Creative North Star: "The Task Ledger"**

Docket looks like a ledger kept by someone who respects their own time: cool paper, dark ink,
one stamp of teal, and a single persimmon mark when something is urgent. The interface is
built from rules, margins, and aligned columns rather than cards and shadows. It should feel
written in, not decorated.

Density is deliberate. Numbers are large and tabular; labels are quiet; lists can grow without
the page turning into a dashboard of widgets. Every screen has one obvious next action, and
empty states read as a clean page rather than a missing feature.

This is an Operate surface. Brand lives in precision: the mark, the rules, the exact spacing,
the shape of a checkbox. It rejects the default SaaS look: no cream-and-serif hero, no
gradients, no glass, no rounded card grid, no icon tiles.

**Key Characteristics:**
- Cool pale sage canvas with white working surfaces.
- Near-black ink text; teal used as a stamp, not a wash.
- One-pixel rules and generous margins instead of shadows and cards.
- Public Sans throughout, with tight display tracking and tabular numerals.
- Flat at rest; only the mobile drawer lifts off the page.

## Colors

A restrained palette: cool paper, ink, one teal accent, and three functional marks.

### Primary
- **Stamp Teal** (`oklch(0.44 0.08 195)`): links, active navigation markers, focus rings, and the check in an empty-state drawing. Never a large fill.
- **Deep Ink** (`oklch(0.205 0.015 190)`): primary buttons, the wordmark block, and the login panel ground.

### Secondary
- **Signal Persimmon** (`oklch(0.51 0.17 35)`): overdue, destructive actions, form errors. It appears in small areas only.

### Neutral
- **Cool Paper** (`oklch(0.965 0.006 165)`): page canvas in daylight.
- **Clean Sheet** (`oklch(1 0 0)`): inputs, active navigation, and raised working surfaces.
- **Rule Gray** (`oklch(0.885 0.008 175)`): hairlines and section dividers.
- **Rule Gray Strong** (`oklch(0.78 0.01 175)`): hover borders and the empty-state line drawing.
- **Ink Soft** (`oklch(0.355 0.015 190)`): secondary interface text and nav labels at rest.
- **Muted Ink** (`oklch(0.48 0.012 190)`): descriptions and metadata, held at 4.5:1 or better on canvas.
- **Quiet Teal** (`oklch(0.94 0.018 195)`): selected or informational tint, paired with Stamp Teal.
- **Success Moss** (`oklch(0.45 0.1 150)`): completed counts and success feedback.
- **Caution Amber** (`oklch(0.6 0.12 75)`): medium-priority and due-soon indicators.

**The One Stamp Rule.** Teal covers no more than about a tenth of any screen. It marks the
active thing and then stops. Persimmon is stricter still: urgency or destruction, never
decoration.

## Typography

**Display Font:** Public Sans (with `ui-sans-serif`, `system-ui`, sans-serif)
**Body Font:** Public Sans (same stack)

**Character:** One workhorse family, used with confidence. Weight and size carry hierarchy;
there is no second display face and no monospace costume. Counts use tabular figures so the
ledger does not shift when numbers change.

### Hierarchy
- **Display** (600, 28px/1.1, -0.025em): page titles such as "Today, Ada" and "Profile".
- **Headline** (600, 30px/1.15, -0.03em): auth page headings only.
- **Title** (600, 20px/1.3, -0.02em): section headings such as "Your tasks".
- **Body** (400, 14px/1.5): descriptions and list content, held to 54–62ch.
- **Label** (500, 12px/1, 0.08em, uppercase): the date group on the auth panel only. Never a
  kicker above a page heading.

**The Tabular Count Rule.** Any number that can change (task counts, due dates) uses
`font-variant-numeric: tabular-nums`.

## Layout

A fixed 248px navigation rail on desktop, a sticky 56px top bar below 1024px. Content sits in
a 1080px maximum column with 48px outer padding on desktop, 32px at tablet, and 20px on
phones. Sections are separated by full-width hairlines and 32–48px of space, not cards.

The dashboard rhythm: page header → full-width status strip with three counts → section
heading → content. On mobile the three counts stack as three ruled rows. Auth pages split into
a dark statement panel and a calm form column at 1024px, and collapse to the form alone.

Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48. More space above a heading than below
it. Nothing is centered except the loading state and the 404.

## Elevation & Depth

Flat by default. Depth is expressed with one-pixel rules, tonal contrast, and whitespace.
There is exactly one shadow in the system, used by the mobile navigation drawer and any future
transient overlay.

### Shadow Vocabulary
- **Drawer Lift** (`0 1px 2px oklch(0.2 0.02 190 / 0.05), 0 12px 32px -16px oklch(0.2 0.02 190 / 0.22)`):
  mobile drawer only.

**The Rule-Not-Shadow Rule.** If a section needs separation, add a rule and space. Do not add
a card, a border radius, or a shadow to invent hierarchy.

## Shapes

Corners are small and functional: 3px for markers, 5px for controls, 8px for overlays. The
wordmark is a hard square with a smaller square inside and a persimmon dot, the only
decorative geometry in the system. Checkboxes are 16px squares with a 1px border; checked
state fills the square rather than drawing a tick. Buttons and inputs share the 5px radius.

## Components

### Buttons
- **Shape:** 5px radius, 40px height, 16px horizontal padding.
- **Primary:** deep ink ground, clean-sheet text; hover shifts to ink-soft.
- **Secondary:** clean sheet ground, rule border, ink text; hover strengthens the border.
- **Ghost:** no border, ink-soft text; hover gives a clean-sheet ground.
- **Danger:** persimmon ground, white text; reserved for destructive confirmation.
- **Focus:** 2px teal outline with a 2px offset; never removed.

### Inputs / Fields
- **Style:** clean sheet ground, 1px rule border, 5px radius, 40px height, 15px text.
- **Focus:** teal border plus a soft teal ring; no glow.
- **Error:** persimmon message below the field, tied with `aria-describedby`; the input keeps
  its shape.

### Navigation
- **Style:** stacked 36px rows with 12px horizontal padding, 14px labels, line icons at 16px,
  1.8 stroke.
- **Default:** ink-soft text on canvas, transparent border.
- **Hover:** clean sheet ground, ink text.
- **Active:** clean sheet ground, rule border, ink text, and a 6px teal square at the far right.
- **Mobile:** the same content in a 280px drawer with the Drawer Lift shadow.

### Status Strip
The dashboard's counts are not cards. Three cells share a top and bottom rule; vertical rules
separate them on desktop. The number is 38px, semibold, tabular; the label is 14px muted and
sits directly beneath it.

## Do's and Don'ts

### Do:
- **Do** separate sections with a 1px `--color-line` rule and 32–48px of space.
- **Do** use tabular numerals for every count and date.
- **Do** keep body text at 4.5:1 or better and test against the actual canvas, not white.
- **Do** keep the teal accent on the active thing only.
- **Do** let empty states be quiet and specific about what will appear.
- **Do** keep one authored motion: content entering 6px upward over 220ms, disabled under
  `prefers-reduced-motion`.

### Don't:
- **Don't** wrap sections in cards or nest cards.
- **Don't** use gradients, glass, or decorative blur.
- **Don't** put a one-sided accent bar on a rounded box.
- **Don't** use monospace for labels, metadata, or "technical" flavor.
- **Don't** put a kicker above a page heading; the heading carries itself.
- **Don't** use persimmon for anything that is not urgent, destructive, or an error.
- **Don't** add a second font, a display serif, or an icon tile above every heading.
