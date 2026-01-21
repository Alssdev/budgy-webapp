# Section 5 – Visual Identity Integration Plan

1. **Goals**
   - Provide reusable controls for selecting a wallet accent color and icon that can be dropped into wallet create/edit flows.
   - Apply Tailwind-driven styling tokens so wallet cards and icons respond to the chosen palette without inline colors.

2. **Component composition & responsibilities**
   - `ColorPalettePicker`: grid of swatches derived from theme colors (use Tailwind palette classes or CSS variables); exposes `selectedColor` and emits `update:selectedColor`/`select` when tapped.
   - `IconGridSelector`: displays PrimeIcons or approved icon set; supports search/filtering (even simple) and emits `update:selectedIcon`.
   - `WalletAccentProvider` (optional wrapper) can translate the selected color/icon into Tailwind classes for downstream components; keep logic small.
   - Note: both pickers stay focused on selection, leaving persistence to the parent form.

3. **Tailwind theming strategy**
   - Use existing color tokens (`bg-slate-900`, `text-slate-100`, etc.) to craft gradients/containers; avoid hard-coded hex values.
   - Apply accent classes via `:class` bindings derived from chosen color (map selection to Tailwind palette names); update wallet cards to respond by toggling `bg-{color}-500`/`text-{color}-50` etc.
   - Introduce responsive layout utilities so icon grid and color palette stack on mobile (single column) and switch to multi-column on `sm`/`md`.

4. **Implementation steps**
   1. Build `ColorPalettePicker` component with a data-driven array of Tailwind class names, emit selected class when clicked.
   2. Build `IconGridSelector` showing icons (use PrimeIcons via `<i>` with classes) and emit selection.
   3. Update wallet card mockups (once created) to accept accent class inputs and apply them via `:class` bindings.
   4. Ensure all components leverage Tailwind utility combos for gradients/borders rather than custom CSS.

5. **Integration notes**
   - Keep selections accessible (aria labels, focus states). Use Tailwind focus rings.
   - Document expected inputs/outputs for future form wiring.
   - Plan for storing literal class names or palette keys in the store, not raw colors, to make theming consistent.
