# Color Theme Usage Guide

This project uses a consistent color theme designed to attract youth with vibrant, modern colors.

## Available Color Files

1. **`src/constants/colors.js`** - JavaScript color constants (for use in React components)
2. **`src/styles/theme.css`** - CSS variables (for use in CSS files)

## Using Colors in React Components

```javascript
import colors from '../constants/colors';

// Use in inline styles
<div style={{ backgroundColor: colors.primary, color: colors.textWhite }}>
  Content
</div>

// Use gradients
<div style={{ background: colors.gradient1 }}>
  Content
</div>
```

## Using Colors in CSS Files

```css
/* Use CSS variables */
.my-element {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}

/* Use gradients (defined in theme.css or inline) */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## Color Palette

### Primary Colors
- **Primary**: `#6366F1` (Indigo) - Main brand color
- **Primary Dark**: `#4F46E5` - Darker shade
- **Primary Light**: `#818CF8` - Lighter shade

### Secondary Colors
- **Secondary**: `#EC4899` (Pink) - Youthful and vibrant
- **Secondary Dark**: `#DB2777`
- **Secondary Light**: `#F472B6`

### Accent Colors
- **Accent Green**: `#10B981` - Success, energy
- **Accent Yellow**: `#F59E0B` - Warm, inviting
- **Accent Purple**: `#8B5CF6` - Creative, modern

### Pre-defined Gradients
- `gradient1`: Purple to purple
- `gradient2`: Pink to red
- `gradient3`: Blue to cyan
- `gradient4`: Green to teal
- `gradient5`: Pink to yellow

## Best Practices

1. **Use primary colors** for main actions and branding
2. **Use secondary colors** for highlights and accents
3. **Use gradients** for hero sections and CTAs
4. **Maintain contrast** for text readability
5. **Stay consistent** - use these colors throughout the app

## Examples

See `src/pages/HomePage.js` and `src/pages/HomePage.css` for examples of how to use these colors effectively.

