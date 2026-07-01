# 🛠️ Guide Développeur - Mode Sombre

## Pour les Nouveaux Développeurs

Si vous rejoignez le projet **après** la migration du mode sombre, ce guide vous explique comment créer de nouveaux écrans et composants qui supportent automatiquement le thème.

---

## 🎨 Utiliser le Système de Thème

### Pattern Standard

```typescript
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors, spacing, typography } from '../theme';

export function MyNewScreen() {
  // 1. TOUJOURS appeler useColors() au début du composant
  const colors = useColors();
  
  // 2. Créer les styles dans useMemo avec dépendance sur colors
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,  // Utiliser colors.*
      padding: spacing.lg,
    },
    title: {
      ...typography.h1,
      color: colors.onSurface,  // Toujours utiliser colors.*
    },
  }), [colors]);  // Ne pas oublier la dépendance !
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Titre</Text>
    </View>
  );
}
```

---

## 🎨 Couleurs Disponibles

### Surfaces (Fonds)
```typescript
colors.surface                    // Fond principal
colors.surfaceContainer           // Cartes, conteneurs
colors.surfaceContainerHigh       // Surfaces élevées
colors.surfaceContainerLow        // Surfaces basses
colors.surfaceContainerLowest     // Surfaces très basses
colors.surfaceContainerHighest    // Surfaces très élevées
```

### Textes
```typescript
colors.onSurface                  // Texte principal
colors.onSurfaceVariant           // Texte secondaire
```

### Bordures
```typescript
colors.outline                    // Bordures standards
colors.outlineVariant             // Bordures discrètes
```

### Couleurs Sémantiques
```typescript
colors.primary                    // Couleur principale (#003c90 light, #6BA3FF dark)
colors.onPrimary                  // Texte sur primary
colors.primaryContainer           // Fond avec accent primary
colors.onPrimaryContainer         // Texte sur primaryContainer

colors.error                      // Erreurs
colors.onError                    // Texte sur error
colors.errorContainer             // Fond erreur
colors.onErrorContainer           // Texte sur errorContainer

colors.secondary                  // Secondaire (succès)
colors.tertiary                   // Tertiaire (warning)
```

### Couleurs Fixes
```typescript
colors.white                      // Blanc pur (#FFFFFF)
```

---

## 📐 Espacement (Spacing)

Utiliser le système d'espacement au lieu de valeurs hardcodées :

```typescript
import { spacing } from '../theme';

spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.lg    // 16px
spacing.xl    // 24px
spacing.xxl   // 32px
```

**Exemple :**
```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,        // ✅ Bien
    marginBottom: spacing.xl,   // ✅ Bien
    // padding: 16,              // ❌ Éviter
  },
});
```

---

## 📝 Typographie

Utiliser les styles de texte prédéfinis :

```typescript
import { typography } from '../theme';

// Titres
typography.display         // Extra large
typography.h1              // Très grand
typography.h2              // Grand
typography.h3              // Moyen

// Corps de texte
typography.body            // Normal
typography.bodyBold        // Gras
typography.caption         // Petit
typography.tiny            // Très petit

// Boutons
typography.button          // Texte de bouton
```

**Exemple :**
```typescript
const styles = StyleSheet.create({
  title: {
    ...typography.h1,           // ✅ Bien - inclut font, size, weight
    color: colors.onSurface,
    // fontSize: 28,             // ❌ Éviter - utiliser typography
  },
});
```

---

## 🔘 Radius (Bordures Arrondies)

```typescript
import { radius } from '../theme';

radius.xs     // 4px
radius.sm     // 8px
radius.md     // 12px
radius.lg     // 16px
radius.xl     // 20px
radius.pill   // 999px (complètement arrondi)
```

---

## ❌ Ce qu'il NE FAUT PAS Faire

### 1. Couleurs Hardcodées
```typescript
// ❌ MAUVAIS
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',   // Ne marchera pas en dark mode
    color: '#000000',
  },
});

// ✅ BON
const colors = useColors();
const styles = useMemo(() => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    color: colors.onSurface,
  },
}), [colors]);
```

### 2. Oublier useMemo
```typescript
// ❌ MAUVAIS - Les styles seront recréés à chaque render
const colors = useColors();
const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface },
});

// ✅ BON - Styles mémorisés
const colors = useColors();
const styles = useMemo(() => StyleSheet.create({
  container: { backgroundColor: colors.surface },
}), [colors]);
```

### 3. Appeler le Hook Après un Return
```typescript
// ❌ MAUVAIS
function MyComponent({ loading }) {
  if (loading) return <Loader />;  // Early return
  
  const colors = useColors();  // Hook appelé conditionnellement !
  // ...
}

// ✅ BON
function MyComponent({ loading }) {
  const colors = useColors();  // Hook TOUJOURS appelé en premier
  
  if (loading) return <Loader />;
  // ...
}
```

---

## 🧩 Créer un Nouveau Composant

### Template de Base

```typescript
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useColors, spacing, typography, radius } from '../theme';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export function MyComponent({ title, onPress }: MyComponentProps) {
  const colors = useColors();
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    title: {
      ...typography.h3,
      color: colors.onSurface,
    },
  }), [colors]);
  
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}
```

---

## 🎯 Cas Particuliers

### 1. Composant avec Props de Couleur

```typescript
interface CardProps {
  variant?: 'default' | 'success' | 'error';
}

export function Card({ variant = 'default' }: CardProps) {
  const colors = useColors();
  
  const styles = useMemo(() => {
    // Calculer les couleurs en fonction de la variante
    const bgColor = variant === 'success' 
      ? colors.secondaryContainer 
      : variant === 'error'
      ? colors.errorContainer
      : colors.surfaceContainer;
      
    return StyleSheet.create({
      container: {
        backgroundColor: bgColor,
        // ...
      },
    });
  }, [colors, variant]);  // Dépendances : colors ET variant
  
  return <View style={styles.container} />;
}
```

### 2. Composant avec Icônes

```typescript
import { Ionicons } from '@expo/vector-icons';

export function IconButton({ iconName, onPress }) {
  const colors = useColors();
  
  return (
    <Pressable onPress={onPress}>
      <Ionicons 
        name={iconName} 
        size={24} 
        color={colors.onSurface}  // Couleur dynamique
      />
    </Pressable>
  );
}
```

### 3. Sous-composants

Si vous avez des sous-composants, passez `colors` en prop :

```typescript
// Parent
function ParentComponent() {
  const colors = useColors();
  
  return (
    <View>
      <ChildComponent colors={colors} />
    </View>
  );
}

// Enfant
function ChildComponent({ colors }) {
  const styles = useMemo(() => StyleSheet.create({
    text: { color: colors.onSurface },
  }), [colors]);
  
  return <Text style={styles.text}>Hello</Text>;
}
```

**OU** appeler useColors dans l'enfant aussi :

```typescript
function ChildComponent() {
  const colors = useColors();  // OK aussi !
  // ...
}
```

---

## 🧪 Tester Votre Composant

### 1. Navigation Manuelle
1. Ouvrir l'app
2. Aller dans Profile > Appearance
3. Changer le thème
4. Vérifier que votre composant s'adapte

### 2. Code de Test
```typescript
// Tester les deux modes
function TestScreen() {
  const { setMode } = useTheme();
  
  return (
    <View>
      <MyComponent />
      <Button label="Test Light" onPress={() => setMode('light')} />
      <Button label="Test Dark" onPress={() => setMode('dark')} />
    </View>
  );
}
```

---

## 📋 Checklist pour Nouveau Code

Avant de commit, vérifier :

- [ ] `useColors()` appelé au début du composant
- [ ] Styles dans `useMemo` avec `[colors]` en dépendance
- [ ] Pas de couleurs hardcodées (`#FFFFFF`, etc.)
- [ ] Utiliser `spacing.*` au lieu de valeurs fixes
- [ ] Utiliser `typography.*` pour les textes
- [ ] Icônes utilisent `colors.*`
- [ ] Testé en mode light ET dark
- [ ] Pas d'erreurs TypeScript

---

## 🔍 Debugging

### Mon composant ne change pas de couleur

```typescript
// Vérifier que :
1. useColors() est appelé
2. Les styles sont dans useMemo
3. useMemo a [colors] en dépendance
4. Vous utilisez colors.* pas des couleurs fixes

// Si toujours pas, debugger :
const colors = useColors();
console.log('Colors:', colors);  // Doit afficher l'objet colors
```

### Erreur "Rendered more hooks"

```typescript
// Cause : Hook appelé conditionnellement
// ❌
if (loading) return null;
const colors = useColors();

// ✅
const colors = useColors();
if (loading) return null;
```

---

## 📚 Ressources

- **Code Examples** : Voir `src/screens/` et `src/components/`
- **Documentation** : `DARK_MODE_COMPLETE.md`
- **Color System** : `src/theme/colors.ts`
- **Typography** : `src/theme/typography.ts`

---

## 💡 Conseils Pro

1. **Toujours utiliser le hook** même si vous n'utilisez qu'une couleur
2. **Préférer les couleurs sémantiques** (onSurface) aux couleurs spécifiques
3. **Tester en dark mode** dès le début du développement
4. **Réutiliser les composants** existants quand possible
5. **Documenter** les composants complexes

---

**Bon développement ! 🚀**
