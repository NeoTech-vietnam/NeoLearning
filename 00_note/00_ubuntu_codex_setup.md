# Cornell Notes

## Topic: Ubuntu - VS Code Codex UI Wayland Fix

## Date: 20/07/2026

---

<p align="center"><strong><em>"DO NOT JUST TALK ABOUT IT — SHOW IT"</em></strong></p>

---

### Cue Column (Questions, Keywords, or Prompts)

- Why does the Codex UI load in only some VS Code workspaces?
- How can VS Code always use X11/XWayland?
- When does the configuration take effect?

---

### Notes Section (Main Notes)

#### Problem

On an Ubuntu Wayland session, the Codex extension UI may load in the first VS Code window but fail or appear blank in other workspaces. The Codex UI uses a VS Code webview, so native Wayland GPU or Electron rendering problems can affect it.

The working launch command is:

```bash
code --ozone-platform=x11
```

#### Permanent Fix

Create or edit `~/.config/code-flags.conf` and add:

```text
--ozone-platform=x11
```

This forces VS Code to use X11/XWayland whenever it starts normally.

#### Verification

Check the desktop session and saved flag:

```bash
echo "$XDG_SESSION_TYPE"
cat ~/.config/code-flags.conf
```

Expected output:

```text
wayland
--ozone-platform=x11
```

Fully close all running VS Code windows before reopening VS Code. Existing VS Code processes keep their original rendering mode and may cause new windows to reuse it.

---

### Summary Section (Summary of Notes)

The Codex UI issue is caused by VS Code/Electron webview rendering under Wayland. Persisting `--ozone-platform=x11` in `~/.config/code-flags.conf` makes VS Code use X11/XWayland and allows the Codex UI to load across workspaces.
