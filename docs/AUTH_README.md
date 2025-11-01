# Auth, Gates & Flows

This document explains how the authentication pieces fit together and how to use the unified holding UI (`AuthPageGate`) and optional `withTransition()` helper.

> See the architecture diagram: **auth-architecture.svg**

## Providers & Responsibilities

- **UIProvider (UIContext)**
  - `editingLockRef`, `editingLocked`, `lockEditing`, `unlockEditing`
  - `transitionState`: global label for full-page holds
  - `withTransition(label, fn)`: sets `transitionState = label`, runs `fn()`, then clears the label.

- **AuthProvider (AuthContext)**
  - `user`, `userState`: `checking | loggedIn | loggedOut | guest`
  - Methods: `login`, `logout`, `handleGuestSignIn`
  - (Optional legacy) `isLogoutTransitioning`

- **AuthPageGate (pure)**
  - Full-page holding UI. Preferred usage is `<AuthPageGate state="..." />`.
  - If `state` is omitted, it falls back to `UIContext.transitionState` so you can drive it via `withTransition()`.

- **AuthPagesGuard**
  - Wraps `/login`, `/register`, `/forgotpwd` only.
  - Shows `AuthPageGate` for `checking-auth`, `signing-in`, `signing-out`.
  - Redirects signed-in users away to `/dashboard`.

- **HomeRedirect**
  - At `/`, routes users to `/dashboard`, `/guest`, or `/login`.
  - Shows the gate for `checking-auth` and `signing-out`.

- **GuestGate**
  - At `/guest`, if not already guest, triggers `handleGuestSignIn`.
  - You can wrap it with `withTransition("switching-to-guest", ...)` to show the unified gate while switching.

- **AuthCallback**
  - Completes OAuth redirect. Shows `signing-in` gate (or uses `withTransition("signing-in", ...)`).

## Using `AuthPageGate`

```jsx
// Suspense fallback
<Suspense fallback={<AuthPageGate state="loading-app" />}>…</Suspense>

// While auth is resolving
if (userState === "checking") return <AuthPageGate state="checking-auth" />;

// Signing out (explicit)
return <AuthPageGate state="signing-out" />;

// Signing in via redirect (explicit)
return <AuthPageGate state="signing-in" />;
```

## Using `withTransition()` (optional convenience)

`withTransition(label, fn)` sets a **global gate label**, runs your async work, and **clears** the label even if `fn` throws.

This avoids prop-drilling a `state` everywhere: you can simply render `<AuthPageGate />` (no prop), and it will read the current label from `UIContext`.

```jsx
// Example: sign out page
const { withTransition } = useUI();
const { logout } = useAuth();

await withTransition("signing-out", async () => {
  await logout();
  navigate("/login", { replace: true });
});

// The page can render <AuthPageGate /> with no prop while the flow runs.
```

**When to use it**
- Long/async **full-page** flows where you already navigate away at the end:
  - Sign out
  - Switch to Guest
  - OAuth redirect finish
  - (Future) Delete account / Upgrade guest → full account
- You **do not** need it for component-level data loads (use skeletons) or quick checks (use explicit prop states).

**When to pass `state` explicitly**
- Route guards and redirects where the hold is brief and specific:
  - Suspense fallback: `state="loading-app"`
  - Auth resolving: `state="checking-auth"`
  - Known one-off holds in specific guards

## Test Matrix

- Cold load `/` signed out → `checking-auth` → `/login`.
- Cold load `/` signed in → `checking-auth` → `/dashboard`.
- Visit `/login` while signed in → redirect to `/dashboard`.
- Sign out → `signing-out` gate → `/login`.
- `/guest` while logged in/out → `switching-to-guest` gate → guest area.
- OAuth callback → `signing-in` gate → intent path or `/dashboard`.

## Notes on UX

- On slow networks you may briefly see `signing-out` then `loading-app` during navigation. This is normal (handoff from a flow-specific gate to Suspense/auth re-init). Using `withTransition()` narrows that window because the label stays until navigation finishes.
- Keep **AuthContext** focused on auth; global holding UI and editing locks live in **UIContext**.
- Use **skeletons** for in-page data loads to keep CLS low and avoid full-page flashes.
