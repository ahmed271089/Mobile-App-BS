# Light/dark theme — migration status

## Infrastructure (done)
- `src/theme/colors.ts` — split into `darkColors` / `lightColors`, both typed against `ThemeColors`
- `src/theme/ThemeContext.tsx` — `ThemeProvider` + `useTheme()`. Mode is `'light' | 'dark' | 'system'`,
  persisted to AsyncStorage, defaults to the device's system setting.
- `App.tsx` — wrapped in `<ThemeProvider>`; status bar style follows `isDark`
- `RootNavigator.tsx` — React Navigation's own theme (background, header, etc.) now follows `useTheme()`

## Converted to dynamic theming (done)
- `components/Button.tsx`
- `components/Input.tsx`
- `components/Badge.tsx`
- `screens/Profile/ProfileScreen.tsx` — also has the light/dark/system toggle UI

## Still on the old static `colors` import — light mode will NOT apply here yet
- `components/PostCard.tsx`
- `navigation/CustomTabBar.tsx`
- `screens/Auth/LoginScreen.tsx`
- `screens/Auth/RegisterScreen.tsx`
- `screens/Chat/ConversationsListScreen.tsx`
- `screens/Chat/ChatThreadScreen.tsx`
- `screens/Library/LibraryScreen.tsx`
- `screens/Home/HomeScreen.tsx`
- `screens/Home/PostDetailScreen.tsx`
- `screens/Home/SearchScreen.tsx`
- `screens/CreatePost/ChooseTypeScreen.tsx`
- `screens/CreatePost/ProblemDefinitionScreen.tsx`
- `screens/CreatePost/ShareFinalizeScreen.tsx`

These will keep rendering in dark colors regardless of the selected mode until converted —
`colors` still resolves to `darkColors` for backward compatibility (see the bottom of
`theme/colors.ts`), so nothing crashes, it just won't re-theme.

## The conversion pattern (apply to each file above)

1. Replace the import:
   ```diff
   - import { colors, radius, spacing, typography } from '../../theme';
   + import { radius, spacing, typography } from '../../theme';
   + import { useTheme } from '../../theme/ThemeContext';
   + import type { ThemeColors } from '../../theme/colors';
   ```
2. Inside the component, grab colors from the hook:
   ```diff
   export default function SomeScreen() {
   +  const { colors } = useTheme();
   +  const styles = getStyles(colors);
   ```
3. Change `const styles = StyleSheet.create({...})` at the bottom into a function:
   ```diff
   - const styles = StyleSheet.create({
   + function getStyles(colors: ThemeColors) {
   +   return StyleSheet.create({
        ...
   - });
   +   });
   + }
   ```
   Everything inside stays exactly the same — `colors.bg`, `colors.textPrimary`, etc. all still work,
   they're just reading from the parameter now instead of the static import.

`ProfileScreen.tsx` is a complete worked example of this — copy its shape.
