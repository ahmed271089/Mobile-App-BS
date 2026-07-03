# 🔧 Fix: Input Multiline Placeholder Issue

## Problème Identifié

**Date** : 2026-07-01  
**Composant** : `Input.tsx`  
**Symptôme** : Le placeholder de la description s'affichait **en dehors** du champ input dans les formulaires multilignes (solution details, edit profile)

## 🐛 Cause du Bug

Le composant `Input` avait une hauteur **fixe** (`height: 50`) dans le wrapper, ce qui ne fonctionnait pas avec les champs **multilignes** (`multiline={true}`).

### Code Problématique

```tsx
// ❌ Avant - Hauteur fixe
wrapper: {
  flexDirection: "row",
  alignItems: "center",  // Toujours centré
  height: 50,            // Hauteur fixe !
}
```

**Résultat** : Le placeholder du TextInput multiline était affiché en dehors du conteneur car le contenu dépassait la hauteur fixe de 50px.

## ✅ Solution Appliquée

### 1. Input Component (src/components/Input.tsx)

**Changements :**

```tsx
// ✅ Après - Hauteur dynamique
export function Input({ label, icon, style, multiline, ...rest }: InputProps) {
  const styles = React.useMemo(
    () => StyleSheet.create({
      wrapper: {
        flexDirection: "row",
        alignItems: multiline ? "flex-start" : "center", // 👈 Flexible
        paddingVertical: multiline ? spacing.md : 0,      // 👈 Padding
        minHeight: multiline ? 80 : 50,                   // 👈 minHeight
      },
      input: {
        flex: 1,
        paddingTop: multiline ? spacing.xs : 0,           // 👈 Top padding
      },
    }),
    [colors, multiline],  // 👈 Dépendance multiline ajoutée
  );
}
```

**Améliorations :**
- ✅ `alignItems` conditionnel (flex-start pour multiline)
- ✅ `minHeight` au lieu de `height` fixe
- ✅ `paddingVertical` pour multiline
- ✅ `paddingTop` sur l'input pour multiline
- ✅ Dépendance `multiline` dans useMemo

### 2. ProblemDefinitionScreen.tsx

```tsx
// ❌ Avant
style={{ height: 110, textAlignVertical: "top" }}

// ✅ Après
style={{ minHeight: 110, textAlignVertical: "top" }}
```

Changé de `height` à `minHeight` pour permettre l'expansion.

### 3. EditProfileScreen.tsx

```tsx
// ❌ Avant
style={{ height: 100, textAlignVertical: "top" }}

// ✅ Après
style={{ minHeight: 100, textAlignVertical: "top" }}
```

Même correction appliquée.

## 📋 Fichiers Modifiés

| Fichier | Changements | Impact |
|---------|-------------|--------|
| `src/components/Input.tsx` | Logique multiline ajoutée | ✅ Composant réutilisable |
| `src/screens/CreatePost/ProblemDefinitionScreen.tsx` | height → minHeight | ✅ Description s'affiche bien |
| `src/screens/Profile/EditProfileScreen.tsx` | height → minHeight | ✅ Bio s'affiche bien |

## 🧪 Tests

### ✅ Écrans Testés

1. **CreatePost → ProblemDefinition**
   - Champ "Description" (multiline)
   - Placeholder visible correctement
   - Texte s'affiche à l'intérieur

2. **Profile → EditProfile**
   - Champ "Bio" (multiline)
   - Placeholder visible correctement
   - Texte s'affiche à l'intérieur

3. **Tous les autres Input**
   - Champs simples (non-multiline) fonctionnent toujours
   - Pas de régression

## 🎨 Comportement Attendu

### Input Normal (Single Line)

```tsx
<Input label="Title" placeholder="Enter title" />
```

- Hauteur fixe de **50px**
- Alignement centré
- Placeholder visible au centre

### Input Multiline

```tsx
<Input 
  label="Description" 
  placeholder="Enter details..." 
  multiline 
  numberOfLines={5}
  style={{ minHeight: 110 }}
/>
```

- Hauteur minimale de **80px** (ou style override)
- Alignement en haut (flex-start)
- Padding vertical pour aérer
- Placeholder visible en haut à gauche
- Le champ s'agrandit avec le contenu

## 🔍 Détails Techniques

### Avant

```
┌─────────────────────┐
│   Input Wrapper     │ height: 50 (fixe)
│   ┌─────────────┐   │
│   │ TextInput   │   │ Le contenu déborde !
│   │ multiline   │   │
│   │ ...........│    │
│   └─────────────┘   │
│   Placeholder       │ ← Affiché en dehors
└─────────────────────┘
```

### Après

```
┌─────────────────────┐
│   Input Wrapper     │ minHeight: 80, peut s'agrandir
│   ┌─────────────┐   │
│   │ Placeholder │   │ ← Bien positionné
│   │ TextInput   │   │
│   │ multiline   │   │
│   │             │   │
│   └─────────────┘   │
└─────────────────────┘
```

## 📊 Impact

### Utilisateurs

- ✅ Placeholder visible correctement
- ✅ Expérience utilisateur améliorée
- ✅ Pas de confusion visuelle
- ✅ Formulaires professionnels

### Développeurs

- ✅ Composant Input plus flexible
- ✅ Support multiline correct
- ✅ Pas de régression sur les inputs normaux
- ✅ Code maintenable

## 🚀 Validation

### ✅ Checklist

- [x] Composant Input modifié
- [x] ProblemDefinitionScreen corrigé
- [x] EditProfileScreen corrigé
- [x] Tests manuels passés
- [x] Pas de régression sur inputs simples
- [x] Diagnostics TypeScript clean
- [x] Dark mode fonctionne toujours

## 🎯 Prochaines Actions

**Aucune action requise.** Le bug est complètement résolu.

### Recommandations

Pour créer de nouveaux champs multilignes :

```tsx
<Input
  label="Your Label"
  placeholder="Your placeholder..."
  multiline
  numberOfLines={4}
  style={{ minHeight: 100, textAlignVertical: "top" }}
/>
```

**Points importants :**
- ✅ Utiliser `minHeight` pas `height`
- ✅ Ajouter `textAlignVertical: "top"`
- ✅ Le composant gère automatiquement le layout

## 📚 Ressources

- **Composant** : `src/components/Input.tsx`
- **React Native TextInput** : https://reactnative.dev/docs/textinput
- **Multiline TextInput** : https://reactnative.dev/docs/textinput#multiline

---

**Status** : ✅ Résolu  
**Version** : 2.0.2 (patch)  
**Date** : 2026-07-01
