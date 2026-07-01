# Theme System Migration Guide

## 🎨 New Theme System Overview

The app now has a complete design system based on `DESIGN.md` with:
- ✅ Light & Dark mode support
- ✅ Material Design 3 color system
- ✅ Comprehensive typography scale
- ✅ Consistent spacing system
- ✅ Border radius tokens
- ✅ Theme toggle functionality

---

## 🚀 Quick Start

### 1. Wrap Your App with ThemeProvider

```tsx
// App.tsx
import { ThemeProvider } from './src/theme';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Use Theme in Components

```tsx
import { useTheme, useColors } from '../theme';

function MyComponent() {
  // Get full theme context
  const { colors, isDark, toggleTheme } = useTheme();
  
  // Or just get colors
  const colors = useColors();
  
  return (
    <View style={{ backgroundColor: colors.surface }}>
      <Text style={{ color: colors.onSurface }}>Hello</Text>
    </View>
  );
}
```

---

## 📋 Color System

### Material Design 3 Colors

**Surface Colors:**
- `surface` - Main background surface
- `surfaceContainer` - Cards and containers
- `surfaceContainerHigh` - Elevated elements
- `onSurface` - Text on surface

**Primary Colors (Resolution Blue):**
- `primary` - Main brand color (#003c90)
- `onPrimary` - Text on primary
- `primaryContainer` - Tinted backgrounds
- `onPrimaryContainer` - Text on primary container

**Secondary Colors (Success Green):**
- `secondary` - Success states (#006c49)
- `onSecondary` - Text on secondary
- `secondaryContainer` - Success backgrounds

**Tertiary Colors (AI/Trending Violet):**
- `tertiary` - AI features (#4e04b8)
- `onTertiary` - Text on tertiary
- `tertiaryContainer` - AI backgrounds

**Error Colors:**
- `error` - Error states
- `errorContainer` - Error backgrounds

**Status Colors (Legacy):**
- `success` / `successMuted`
- `warning` / `warningMuted`
- `danger` / `dangerMuted`
- `info` / `infoMuted`

### Migration Examples

**Before:**
```tsx
backgroundColor: colors.primary // Old purple
color: colors.textPrimary
```

**After:**
```tsx
backgroundColor: colors.primary // New blue (#003c90)
color: colors.onSurface
```

---

## 🔤 Typography

### New Typography Scale

```tsx
import { typography, headlineLg, bodyMd, labelSm } from '../theme';

// Headlines
<Text style={headlineLg}>Large Headline</Text>
<Text style={typography.h1}>Alternative</Text>

// Body Text
<Text style={bodyMd}>Regular body text</Text>
<Text style={typography.body}>Alternative</Text>

// Labels
<Text style={labelSm}>Small label</Text>
<Text style={typography.caption}>Alternative</Text>
```

### Typography Tokens

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `displayLg` | 48px | 700 | Hero sections |
| `headlineLg` | 32px | 600 | Section headers |
| `headlineMd` | 24px | 600 | Subsection headers |
| `bodyLg` | 18px | 400 | Large body text |
| `bodyMd` | 16px | 400 | Regular body text |
| `bodySm` | 14px | 400 | Small body text |
| `labelMd` | 14px | 500 | Buttons, badges |
| `labelSm` | 12px | 500 | Small labels |

---

## 📐 Spacing

### Spacing Scale

```tsx
import { spacing } from '../theme';

<View style={{
  padding: spacing.md,        // 24px
  gap: spacing.sm,            // 12px
  marginTop: spacing.lg,      // 40px
}} />
```

### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Tight spacing |
| `sm` | 12px | Small gaps |
| `md` | 24px | Default spacing |
| `lg` | 40px | Section spacing |
| `xl` | 64px | Large spacing |
| `xxl` | 96px | Extra large |

---

## 🔲 Border Radius

### Radius Scale

```tsx
import { radius } from '../theme';

<View style={{
  borderRadius: radius.lg,    // 8px - Cards
}} />

<Pressable style={{
  borderRadius: radius.DEFAULT, // 4px - Buttons
}} />

<View style={{
  borderRadius: radius.full,  // 9999px - Pills
}} />
```

### Radius Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 2px | Subtle rounding |
| `DEFAULT` | 4px | Buttons, inputs |
| `md` | 6px | Small cards |
| `lg` | 8px | Content cards |
| `xl` | 12px | Large cards |
| `full` | 9999px | Pills, badges |

---

## 🌓 Dark Mode

### Automatic Detection

The theme automatically detects system preference:

```tsx
const { isDark } = useTheme();

if (isDark) {
  // Dark mode specific logic
}
```

### Manual Toggle

```tsx
import { ThemeToggle } from '../components/ThemeToggle';

// In your component
<ThemeToggle size={24} showLabel={true} />
```

### Theme Modes

- `'light'` - Always light
- `'dark'` - Always dark
- `'auto'` - Follow system (default)

```tsx
const { mode, setTheme } = useTheme();

setTheme('dark');  // Force dark
setTheme('light'); // Force light
setTheme('auto');  // Follow system
```

---

## 🔄 Migration Checklist

### Step 1: Update App.tsx

```tsx
import { ThemeProvider } from './src/theme';

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        {/* Your app */}
      </NavigationContainer>
    </ThemeProvider>
  );
}
```

### Step 2: Update Imports

**Before:**
```tsx
import { colors, typography, spacing } from '../theme';
```

**After:**
```tsx
import { useColors, typography, spacing, radius } from '../theme';

function Component() {
  const colors = useColors(); // Now reactive!
  // ...
}
```

### Step 3: Replace Static Colors

**Before:**
```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#6C5CE7', // Hardcoded
  },
});
```

**After:**
```tsx
function Component() {
  const colors = useColors();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.primary, // Dynamic!
    },
  });
}
```

### Step 4: Use Semantic Colors

**Before:**
```tsx
backgroundColor: colors.primary  // Was purple
color: colors.textPrimary
borderColor: colors.cardBorder
```

**After:**
```tsx
backgroundColor: colors.surface          // Adaptive
color: colors.onSurface                 // Adaptive
borderColor: colors.outlineVariant      // Adaptive
```

---

## 📦 Component Examples

### Button with New Theme

```tsx
import { Pressable, Text, StyleSheet } from 'react-native';
import { useColors, typography, spacing, radius } from '../theme';

function Button({ label, onPress }) {
  const colors = useColors();
  
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: colors.primary }
      ]}
    >
      <Text style={[
        typography.button,
        { color: colors.onPrimary }
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.DEFAULT,
    alignItems: 'center',
  },
});
```

### Card with New Theme

```tsx
function Card({ title, children }) {
  const colors = useColors();
  
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: colors.surfaceContainer,
        borderColor: colors.outlineVariant,
      }
    ]}>
      <Text style={[
        typography.headlineMd,
        { color: colors.onSurface }
      ]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
  },
});
```

---

## 🎨 Design Tokens Reference

### Color Usage Guide

| Purpose | Light | Dark |
|---------|-------|------|
| **Backgrounds** | | |
| App background | `surface` | `surface` |
| Cards | `surfaceContainer` | `surfaceContainer` |
| Elevated | `surfaceContainerHigh` | `surfaceContainerHigh` |
| **Text** | | |
| Primary text | `onSurface` | `onSurface` |
| Secondary text | `onSurfaceVariant` | `onSurfaceVariant` |
| Muted text | Use `outline` | Use `outline` |
| **Actions** | | |
| Primary button | `primary` | `primary` |
| Success action | `secondary` | `secondary` |
| AI feature | `tertiary` | `tertiary` |
| Destructive | `error` | `error` |
| **Borders** | | |
| Subtle | `outlineVariant` | `outlineVariant` |
| Visible | `outline` | `outline` |

---

## 🐛 Troubleshooting

### Colors Don't Update on Theme Change

**Problem:** Colors are static in StyleSheet
```tsx
const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface } // ❌ Static
});
```

**Solution:** Create styles inside component
```tsx
function Component() {
  const colors = useColors();
  
  const styles = StyleSheet.create({
    container: { backgroundColor: colors.surface } // ✅ Dynamic
  });
}
```

### Theme Not Persisting

Make sure ThemeProvider is at the root level, above Navigation.

### Dark Mode Not Working

Check that system dark mode is enabled if using `'auto'` mode.

---

## 📚 Resources

- **DESIGN.md** - Full design specification
- **ThemeProvider.tsx** - Theme implementation
- **colors.ts** - All color tokens
- **typography.ts** - Typography scale
- **spacing.ts** - Spacing system
- **radius.ts** - Border radius tokens

---

## 🎯 Benefits

✅ **Consistent Design** - All colors from single source
✅ **Dark Mode** - Automatic light/dark switching
✅ **Accessible** - High contrast ratios
✅ **Maintainable** - Change once, update everywhere
✅ **Professional** - Based on Material Design 3
✅ **Flexible** - Easy to customize

---

**Ready to migrate? Start with wrapping App.tsx in ThemeProvider!** 🚀
