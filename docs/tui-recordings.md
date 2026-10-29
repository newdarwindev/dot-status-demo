# Adapting the visual-evidence contract for a TUI

This template implements a browser UI only. Do not add a pretend TUI job or claim
terminal coverage before a real TUI exists.

When adding a TUI:

1. Add a deterministic synthetic scenario exercising navigation, repeated input,
   cancel/back, and exit, with assertions on its resulting state.
2. Record a real PTY session at fixed terminal dimensions. A cast from asciinema is
   useful source evidence, but it is not by itself a video.
3. Render that session to GIF/WebM/MP4 using a pinned toolchain (for example VHS),
   verifying the tool's current official installation and recording instructions.
   Avoid unpinned curl-to-shell installation.
4. Add a dedicated CI test/record step and `if: always()` artifact upload. Include
   the video, scenario source, assertions/logs, and original cast when available.
   Fail if an expected recording is absent. Preserve successful recordings too.
5. Link the named run artifact in README; optionally publish a trusted-main-only
   video gallery. Review everything for secrets before making it public.

The upload contract can reuse the existing official `actions/upload-artifact`
SHA from `.github/workflows/quality-pages.yml`, with a `tui-evidence-RUN_ID` name,
`retention-days: 14`, and `if-no-files-found: error`. Implement an actual recording
command for the chosen TUI before enabling its workflow; there is deliberately no
nonfunctional placeholder job in this starter.
