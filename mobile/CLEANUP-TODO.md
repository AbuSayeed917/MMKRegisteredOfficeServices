# Mobile App Code Cleanup TODO

## Critical
1. **Break `register.tsx` (1581 lines)** into step components (StepIndicator, Step1Company, Step2Director, Step3Account, Step4Agreement, ReviewRow)
2. **Delete 5 unused UI components**: AnimatedNumber, InfoRow, EmptyState, MetricCard, StatusBadge

## High Priority
3. **Replace ~40+ hardcoded fontSize/fontWeight** with Typography tokens across all screens
4. **Break `profile.tsx` (585 lines)** — extract PasswordChangeForm, BiometricToggle, BusinessEditForm
5. **Extract 5 duplicate patterns** into shared components:
   - ErrorBox (used in login, forgot-password, reset-password, register)
   - Pagination (admin clients + payments)
   - GlassTabBar (dashboard + admin layouts)
   - SearchBar (admin clients + payments)
   - GroupedRow (profile, subscription, agreement, client detail — InfoRow.tsx exists but unused!)
   - LogoutButton (profile + admin settings)

## Medium Priority
6. **Replace hardcoded `#fff`** with `Colors.white` in 5 files (_layout, Avatar, GradientButton, login)
7. **Replace hardcoded `borderRadius`** with Radius tokens in ~10 places
8. **Modernize payment/success.tsx and payment/cancel.tsx** — use Spacing/Typography tokens
9. **Rename `GradientButton` → `ActionButton`** (no longer uses gradients)
10. **Rename `GradientHeader` → `ScreenHeader`** (no longer uses gradients)
11. **Fix misplaced import** in dashboard `_layout.tsx` line 121 (Typography import after export)

## Low Priority
12. **Remove dead code**: `navButtonFull` style in register.tsx, `setSessionCookie` in auth-store, `PaginatedResponse<T>` in types
13. **Remove unused Typography aliases** in spacing.ts (h1, h2, h3, h4 — check which are actually used)
14. **Fix silent error swallow** in admin settings.tsx useEffect
15. **Add debounce timer cleanup** in register.tsx search (useEffect return)
