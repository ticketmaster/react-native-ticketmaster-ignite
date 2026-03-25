# Workarounds

Temporary fixes that should be revisited when upstream packages release proper fixes.

---

## 1. `conventional-changelog-angular` resolution override

**Location:** `package.json` → `resolutions`

```json
"conventional-changelog-angular": "^8.0.0"
```

**Root cause:** `conventional-recommended-bump` v11.2.0 (used by `@release-it/conventional-changelog` v10) dynamically imports the `conventional-changelog-angular` preset via `defaultLoadPreset`. Due to Yarn's hoisting, it resolves v7.0.0 (hoisted to the project root) instead of v8.1.0 (nested under `@release-it/conventional-changelog/node_modules/`). The v7 API places `whatBump` inside `recommendedBumpOpts.whatBump`, but the bumper expects it at the top level — causing `whatBump is not a function` when running `yarn release --preRelease=rc`.

**Current fix:** A `resolutions` override forces all instances of `conventional-changelog-angular` to v8.x, which exposes `whatBump` at the top level.

**When to remove:** Monitor these upstream packages for a fix:
- `conventional-recommended-bump` — should resolve the preset relative to the caller's `node_modules`
- `@release-it/conventional-changelog` — should pin or handle both v7 and v8 API shapes

Once the upstream fix is released, remove the `"conventional-changelog-angular": "^8.0.0"` line from `resolutions` and verify `yarn release --preRelease=rc` still works.

**Files to update:**
- `package.json` — remove the resolution entry
