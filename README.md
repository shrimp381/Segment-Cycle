# Segmented Cycle

A draggable Day/Night segment tracker HUD for Distyr, with an optional third custom bar.

## What it does

- Day and Night each show 5 segments by default, starting empty and filling up as you spend them. Choose how they display:
  - **Split**: two separate bars.
  - **Combined**: both bars together in one frame.
  - **Transition**: a single bar that shows Day, then flips over to Night once Day is completely full. Night stays full once it fills, it does not automatically flip back, use the reset button when you want a fresh cycle.
- An optional third bar, fully independent of Day and Night, for anything else you want to track, an alert level, a countdown, whatever fits your table. Give it its own label, colour and segment count.
- Drag any bar by its grip (the three dots on the left) to place it anywhere on screen.
- Click a pip to fill up to that point, or click the last filled pip again to remove it.
- Every bar has its own reset icon. Resetting a Day, Night, Combined, or Transition bar resets Day and Night together (and returns Transition to Day). Resetting the custom bar only clears the custom bar.
- Everything else, colours, segment counts, layout, background transparency, and the on/off switch, lives in one settings panel: a "Segmented Cycle" button under the Journal Notes sidebar tab (GM only), which opens a small form.
- As a fallback, every one of those same settings is also in Configure Settings > Module Settings, in case the sidebar button doesn't show up on your Foundry version.

## What is shared vs personal

- Segment counts, how many are filled, each bar's colour, the layout choice, the custom bar's settings, and the background settings are world settings, shared with the whole table (only the GM can change them, since only the GM sees the HUD right now).
- Each bar's position on screen is a client setting, personal to whoever is looking at it, so it does not jump around for other GM logins.

## Installing

This module has not been submitted anywhere, so install it as a local/manual module:

1. Locate your Foundry `Data/modules` folder.
   - Self-hosted: inside wherever you pointed Foundry's user data directory.
   - Forge: use the Bazaar's file manager (or the "My Assets" file browser) to upload into `Data/modules/`.
2. Copy the whole `segmented-cycle` folder (this one, containing `module.json`) into `Data/modules/`, so the path reads `Data/modules/segmented-cycle/module.json`.
3. In your world, go to Game Settings > Manage Modules, enable "Segmented Cycle", and save.
4. Reload. As the GM, you should see the Day and Night bars appear near the top left of the screen.

## Updating from an earlier version

If you already installed this via the manifest URL, Foundry's Manage Modules screen will offer an update once the new version is published, just click Update.

If you installed manually, replace the old `segmented-cycle` folder in `Data/modules/` with the new one and reload.

Existing Day/Night segment counts and colours carry over. Filled segments reset to empty on this update, since the fill direction has changed (bars now start empty and fill up, rather than starting full and draining).

## Known limitations (still untested live)

This was built and syntax checked outside of Foundry; there is still no Foundry instance available to test it live from here. Likely rough edges:

- **The sidebar button is the least certain part.** It's injected into the Journal Notes tab's `.directory-footer` element, and that selector can differ between Foundry v11/v12/v13. If no "Segmented Cycle" button appears at the bottom of the Journal tab, that's why, use Configure Settings > Module Settings instead and tell me, so the injection can be fixed for your version.
- The settings form uses Foundry's older `FormApplication` for broad version compatibility; on the newest Foundry versions this may log a deprecation warning in the console, it should still work.
- No player-facing view yet, this is GM-only as built.

Report back what breaks and it gets fixed from there.
