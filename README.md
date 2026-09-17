# Segmented Cycle

A draggable Day/Night segment tracker HUD for Distyr, ported from the interactive prototype.

## What it does

- Two floating bars, Day and Night, each showing 5 segments by default.
- Drag either bar by its grip (the three dots on the left) to place it anywhere on screen.
- Click a pip to spend it (fill up to that point) or click the last filled pip again to restore it.
- Use the minus/plus buttons to change how many segments a track has (1 to 20).
- Click the colour swatch to recolour a bar.
- GM only by default. A client setting, "Show Segmented Cycle HUD" (Configure Settings > Module Settings), lets the GM hide or show it for themselves; it does not appear for players.

## What is shared vs personal

- Segment counts, how many are filled, and each bar's colour are a world setting, shared with the whole table (only the GM can change them, since only the GM sees the HUD right now).
- Each bar's position on screen is a client setting, personal to whoever is looking at it, so it does not jump around for other GM logins.

## Installing

This module has not been submitted anywhere, so install it as a local/manual module:

1. Locate your Foundry `Data/modules` folder.
   - Self-hosted: inside wherever you pointed Foundry's user data directory.
   - Forge: use the Bazaar's file manager (or the "My Assets" file browser) to upload into `Data/modules/`.
2. Copy the whole `segmented-cycle` folder (this one, containing `module.json`) into `Data/modules/`, so the path reads `Data/modules/segmented-cycle/module.json`.
3. In your world, go to Game Settings > Manage Modules, enable "Segmented Cycle", and save.
4. Reload. As the GM, you should see two bars appear near the top left of the screen.
