# 🎨 Theme Update - Remaining Work

## Problem
Dark mode only works in ProfileScreen because other screens still use static `colors` import instead of dynamic `useColors()` hook.

## Solution
Update all screens and components to use `useColors()` hook.

---

## Quick Fix Script

**For each file, change:**

### Before (Static):
```tsx
import { colors, spacing, typography } from '../../theme';

export default function MyScreen() {
  // colors is static, won't change with theme
  return <View style={{ backgroundColor: colors.bg }} />
}
```

### After (Dynamic):
```tsx
import { useColors, spacing, typography } from '../../theme';

export default function MyScreen() {
  const colors = useColors(); // Now reactive!
  return <View style={{ backgroundColor: colors.surface }} />
}
```

---

## Files to Update

### Screens (High Priority)

**Home:**
- [ ] `src/screens/Home/HomeScreen.tsx`
- [ ] `src/screens/Home/PostDetailScreen.tsx`
- [ ] `src/screens/Home/SearchScreen.tsx`

**Chat:**
- [ ] `src/screens/Chat/ConversationsListScreen.tsx`
- [ ] `src/screens/Chat/ChatThreadScreen.tsx`
- [ ] `src/screens/Chat/FriendsScreen.tsx` ✅ (Already done)
- [ ] `src/screens/Chat/FriendRequestsScreen.tsx`
- [ ] `src/screens/Chat/AddFriendScreen.tsx`

**Profile:**
- [ ] `src/screens/Profile/ProfileScreen.tsx` ✅ (Already done)
- [ ] `src/screens/Profile/EditProfileScreen.tsx`

**Other:**
- [ ] `src/screens/Auth/LoginScreen.tsx`
- [ ] `src/screens/Auth/RegisterScreen.tsx`
- [ ] `src/screens/CreatePost/CreatePostScreen.tsx`
- [ ] `src/screens/Library/LibraryScreen.tsx`
- [ ] `src/screens/Notifications/NotificationsScreen.tsx`

### Components (Medium Priority)

- [ ] `src/components/Button.tsx`
- [ ] `src/components/Input.tsx`
- [ ] `src/components/PostCard.tsx`
- [ ] `src/components/Badge.tsx`
- [ ] `src/components/ConfirmModal.tsx` ✅ (Should already use it)

### Navigation (Low Priority)

- [ ] Navigation components if they have styled elements

---

## Automated Search & Replace

Use this regex to find files that need updating:

```bash
# Find files importing colors statically
grep -r "import.*colors.*from.*theme" src/
```

---

## Step-by-Step for Each File

1. **Change import:**
   ```tsx
   // Before
   import { colors, spacing, typography } from '../../theme';
   
   // After
   import { useColors, spacing, typography } from '../../theme';
   ```

2. **Add hook at component start:**
   ```tsx
   export default function MyScreen() {
     const colors = useColors(); // Add this line
     // ... rest of component
   }
   ```

3. **Move StyleSheet.create inside component if it uses colors:**
   ```tsx
   // Before (outside component)
   const styles = StyleSheet.create({
     container: { backgroundColor: colors.bg }
   });
   
   // After (inside component)
   export default function MyScreen() {
     const colors = useColors();
     
     const styles = React.useMemo(() => StyleSheet.create({
       container: { backgroundColor: colors.surface }
     }), [colors]);
   }
   ```

4. **Update color names to new semantic names:**
   ```tsx
   colors.bg          → colors.surface
   colors.textPrimary → colors.onSurface
   colors.card        → colors.surfaceContainer
   colors.cardBorder  → colors.outlineVariant
   colors.textMuted   → colors.onSurfaceVariant
   colors.danger      → colors.error
   ```

---

## Priority Order

1. **Start with most visible screens:**
   - HomeScreen
   - PostDetailScreen
   - ChatThreadScreen

2. **Then components used everywhere:**
   - PostCard
   - Button
   - Input

3. **Finally less critical:**
   - Auth screens
   - Settings screens

---

## Testing After Each Update

- [ ] Screen loads without errors
- [ ] Colors change when toggling theme
- [ ] Text is readable in both modes
- [ ] No console warnings

---

## Estimated Time

- Per screen: ~5-10 minutes
- Total screens: ~15 screens = 1.5-2.5 hours
- Per component: ~3-5 minutes  
- Total components: ~5 components = 15-25 minutes

**Total: ~2-3 hours for complete migration**

---

## Quick Win: Update Just HomeScreen First

Let's start with HomeScreen to see immediate results!
