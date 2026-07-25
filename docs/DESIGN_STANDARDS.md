# Design Standards

## Visual Direction

Use a restrained editorial design suitable for serious factual, legal, investigative, technical, or public-interest material.

## Layout

- Use a centered content container.
- Maintain readable line length.
- Use consistent spacing.
- Separate primary content from supporting detail.
- Use cards, tables, timelines, and accordions only when they improve comprehension.
- Avoid overcrowding.

## Typography

- Use no more than two primary font families.
- Maintain logical heading scale.
- Avoid all-capital body text.
- Use bold sparingly.
- Maintain sufficient line height.

## Accessibility

- Provide adequate contrast.
- Preserve visible keyboard focus.
- Use semantic landmarks.
- Use logical heading order.
- Use alt text.
- Use actual buttons for actions.
- Use actual links for navigation.
- Support reduced-motion preferences.
- Ensure controls work without a mouse.

## Responsive Design

Test:

- narrow mobile
- wide mobile
- tablet
- laptop
- desktop

Avoid horizontal scrolling.

Useful CSS patterns:

```css
img {
  display: block;
  max-width: 100%;
  height: auto;
}

.content {
  width: min(100% - 2rem, 72rem);
  margin-inline: auto;
}
```

## Interaction

Use minimal motion.

Avoid:

- flashing
- autoplay media
- unnecessary parallax
- excessive transitions
- hidden navigation without accessible controls

## Credibility

The visual design should support the content, not compete with it.
