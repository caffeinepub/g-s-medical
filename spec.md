# Specification

## Summary
**Goal:** Enrich the G&S Medical frontend with a new layer of unique, non-repeating animations and design treatments across customer, seller, and admin-facing pages.

**Planned changes:**
- Add a magnetic hover tilt (3D perspective rotation) to ProductCard, a liquid fill sweep on the "Add to Cart" button, and a numerical increment burst on the cart badge
- Implement a global branded green curtain wipe page-transition overlay in the Layout component
- Add a thin emerald-to-teal gradient scroll progress bar fixed at the very top of the viewport
- Redesign AnnouncementTicker as a frosted-glass pill with animated dot-pulse dividers and a 4-second shimmer sweep
- Add 6–8 very low-opacity morphing blob shapes as an ambient background layer behind the HomePage hero section
- Add an interactive radial emerald cursor spotlight effect to the five Admin Dashboard pages (desktop only)
- Apply a staggered word-split clip-path reveal animation to all major headings on the four Seller Dashboard pages
- Add an ink-drop concentric ring ripple animation to StatusBadge whenever its status prop changes
- Replace the SkeletonProductCard shimmer with a medical-scanner scan-line animation sweeping top-to-bottom
- Add a spring-bounce FAB to CartPage (visible when cart has items) that scrolls to the checkout summary on click
- All new animations include `prefers-reduced-motion` overrides and use unique keyframes not shared with any existing animations

**User-visible outcome:** Users, sellers, and admins experience a richer, more dynamic interface with distinct, non-repetitive micro-interactions, page transitions, ambient effects, and loading states throughout the application.
