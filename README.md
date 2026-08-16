# Watermark Layer Detector Toggle (Tampermonkey)

This project provides a Tampermonkey userscript that detects likely screen watermark overlays and lets the user decide whether to disable them.

## File Structure

- `watermarkdetector.js` – main userscript

## What the Script Does

1. Scans page elements (`div`, `canvas`, `svg`)
2. Detects possible watermark overlays using heuristics:
   - `position` is `fixed` or `absolute`
   - `pointer-events` is `none`
   - element size is close to full screen
   - class name or id contains `watermark`
3. Shows a floating warning panel if suspected overlays are found
4. Provides a checkbox for the user to:
   - **Enable checked**: disable detected overlays (`pointer-events: none`, `opacity: 0`)
   - **Enable unchecked**: restore original styles

## UI Behavior

When a watermark-like layer is detected, the script shows:

- warning text with detected layer count
- checkbox: **Disable detected watermark layers**
- button: **Close**

## How to Use

1. Install Tampermonkey in your browser
2. Create a new userscript
3. Paste content from `watermarkdetector.js`
4. Save and enable the script
5. Open a page that has watermark overlays
6. Use the warning checkbox to disable/restore detected layers

## Metadata

The script includes a standard Tampermonkey header:

- `@license Apache-2.0`
- `@match *://*/*`
- `@run-at document-idle`
- `@grant none`

You can restrict `@match` to specific domains if needed.

## Notes / Limitations

- Detection is heuristic-based; it may miss some watermarks or include false positives.
- Some websites may dynamically recreate overlays; repeated detection can be added if required.
- Script behavior can be affected by strict page security policies or shadow DOM structures.

## Customization Ideas

- Add domain allowlist/blocklist
- Add auto-disable default state
- Add repeated interval checking
- Add notification style/theme options

## License

This project is licensed under the Apache License 2.0. See [LICENSE.md](LICENSE.md).
