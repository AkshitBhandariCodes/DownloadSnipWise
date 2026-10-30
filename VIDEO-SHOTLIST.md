# Feature videos to record

Each feature card on the site shows a small animated preview until its video exists. To swap in a recording:

1. Export the clip as `.mp4` (H.264, 1280×720 or 1600×900, no audio, under 2 MB if you can). Optionally add a poster `.jpg` from its first frame.
2. Put the files in `public/media/`, for example `public/media/dock.mp4` and `public/media/dock.jpg`.
3. In `content/features.ts`, set `video: "/media/dock.mp4"` and `poster: "/media/dock.jpg"` on that feature.

The card then plays the clip on loop and gets a **Watch** button that opens it full size.

Tips: use a clean desktop with the light theme, a 125% display scale, and no personal data on screen. Keep each clip to one action, with no intro or ending.

| # | File | Feature | What to record |
|---|------|---------|----------------|
| 01 | `dock.mp4` | Quick Dock | In a real app (VS Code or Notepad), copy three different things. Press Win+V, arrow down to the second clip, press Enter so it pastes. 6 to 8 seconds, no mouse. |
| 02 | `search.mp4` | Search everything | Open the dock with lots of history. Type a word like "deploy", click the Code filter, then clear it and filter by an app. 8 seconds. |
| 03 | `shortcuts.mp4` | Inline shortcuts | Give a clip the trigger `;sig` in SnipWise. Switch to Gmail or Outlook, type `;sig` and a space, and let the signature appear. 8 to 10 seconds. |
| 04 | `convert.mp4` | 31 converters | Copy a messy one-line JSON. Open the dock, pick JSON to YAML, paste the result into an editor. Then copy a hex code and show the colour formats. 10 seconds. |
| 05 | `drag.mp4` | Drag it out | With Slack or a browser form open, drag a clip from the dock into the message box. Do it twice with two different clips. 6 seconds. |
| 06 | `types.mp4` | Knows what you copied | Copy a code line, a URL, a hex colour and a sentence. Open the dock and slowly hover the four new rows so the tags are readable. 6 seconds. |
| 07 | `folders.mp4` | Folders and pins | Pin a clip so it jumps to the top. Move two clips into a folder called Client A and open the folder. 8 seconds. |
| 08 | `passwords.mp4` | Skips your passwords | Copy a fake demo password from Bitwarden, 1Password or KeePass. Open the dock and show it is not there, then copy normal text and show that one is. 8 seconds. |
| 09 | `offline.mp4` | Works offline | Turn on airplane mode from Windows quick settings so the icon is visible. Copy two things and open the dock to show they were saved. 6 seconds. |
| 10 | `pal.mp4` | Pixel pal | Show the pal on the taskbar. Copy something so it reacts, drag it to the top corner so it hangs, then hide it from the tray menu. 10 seconds. |
| 11 | `tray.mp4` | Quiet in the tray | Show the tray icon, right-click it to open the menu, then copy something and capture the notification that appears without the clip's content. 6 seconds. |
| 12 | `sync.mp4` | Encrypted sync | Not needed yet. Once sync ships: copy on one PC and show the clip appear on a second PC. |
