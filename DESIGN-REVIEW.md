# Portfolio v2 review — October 26, 2026

## October 27 balanced navigation timing

- Adjusted button navigation to 600–850 ms, between the previous overly slow and overly fast settings. The easing curve and manual interruption remain unchanged.
- The timing check now verifies that a long jump is still in progress at 500 ms and finishes by 850 ms.

## October 27 faster button navigation

- Shortened button scrolling to roughly 280–480 ms, replacing the previous maximum of 1.4 seconds. Retained smooth acceleration/deceleration, interruption, and reduced-motion behavior.
- Updated the arrival check to require completion within half a second.

## October 27 smoother button navigation

- Section navigation, hero links, the brand link, and Back to top now share a distance-aware scroll animation with gentle acceleration and deceleration (up to 1.4 seconds).
- Preserved header offsets, URL destinations, keyboard destination focus, and immediate reduced-motion navigation. Wheel, touch, pointer interaction, scrolling keys, resize, and history navigation cancel pending motion.
- Active navigation stays on the selected destination during travel, then resumes normal scroll tracking. The existing vertical content transitions continue following the actual scroll position.
- All 26 automated checks pass, including exact arrival, cancellation, returning upward, and reduced-motion changes. Live visual verification remains pending.

## October 27 reading-area fade correction

- Separated entrance and exit thresholds. The strong 300px entrance remains, but the top-edge exit now affects only the final 20% of an element (at most 48px) as it passes behind the header.
- Headings remain sharp while fully visible and through most of their departure; tall cards remain readable while their lower content is still onscreen.
- Added regression coverage for the screenshot's visible heading, scrolling back into clarity, and cards taller than the viewport.

## October 27 stronger scroll transition

- Increased vertical travel from 36 to 84 px, peak blur from 8 to 16 px, and the fade range from 0.3–1 to 0.12–1 opacity.
- Expanded each transition band from 22% (maximum 180 px) to 36% (maximum 300 px) of the unobstructed viewport height. The motion remains tied to scroll position in both directions, with a fully clear central reading area and reduced-motion/focus safeguards.

## October 27 vertical scroll-linked transition

- Supersedes the sideways unfolding effect below. Scroll position now scrubs a paused vertical translation/blur animation at the viewport edges. Reversing scroll reverses the effect immediately; elapsed time does not advance it.
- Natural layout offsets determine progress independently of animated transforms. Effects are released in the reading area and offscreen; the final content becomes fully clear at maximum scroll. Scroll updates are batched through requestAnimationFrame.
- Kept reduced-motion support and focused controls sharp. Removed horizontal rotation, clipping, and timed delays. The activity table still moves as one panel.
- Automated checks cover both directions, reversal, focus, reduced motion, viewport resizing, bottom-of-page clarity, unsupported animation APIs, and effect cleanup. Live visual checks remain limited by blank browser captures; Vite dependencies remain unavailable for a production build.

## October 27 recording-based unfold motion

- Inspected frames from the user's supplied 10-second screen recording. The reference opens a hinged screen while a frosted surface resolves into sharp content.
- Replaced the earlier vertical slide with a left-edge perspective unfold, widening clip, and blur-to-clear finish. This is an adaptation for webpage content, not a literal folding-device simulation.
- Headings lead at 720 ms; cards follow at 900 ms with the existing 160 ms initial delay and 80 ms stagger. The activity table unfolds as one surface to preserve row alignment.
- Effects are removed after completion. Reduced motion suppresses/cancels effects, focused content stays sharp, and unsupported animation APIs leave the page visible.
- All 19 automated tests pass, including replay, focus, reduced-motion changes, fallback, and animation cleanup. The Vite build remains unverified because dependencies are not installed. Live visual review follows the file update.

## October 27 two-tone headline, section motion, and project targets

- Restored blue to “engineered.” while retaining the theme's normal text color for “Curiosity,” and neutral section labels.
- Expanded the existing native project-preview buttons across their entire cards. Each card retains one keyboard tab stop and its existing preview dialog; the focus outline now encloses the card.
- Implemented the user's confirmed meaning of “Apple Duo”: a heading entrance followed by staggered card entrances. Each runs for 640 ms; cards start at 160 ms plus 80 ms per card, capped after five stagger steps. Reentering a section replays the entrance.
- Kept content visible if animation/observer support is unavailable. Reduced motion cancels/suppresses effects, keyboard focus releases affected controls immediately, and completed effects are removed to preserve hover interactions.
- All 17 automated tests pass, including the new section-motion behavior checks. Browser inventory is still empty, so live scrolling, hit-target, and visual verification remain pending.

## October 27 card and section refinements

- Restored the rounded, bordered portrait card and caption surface, keeping the decorative arrow and starburst removed and retaining the current theme-aware photos.
- Updated the displayed name, page title, metadata, and accessible portrait labels to Zaki Lorenzo V. Boongaling. The runtime title now follows the content data.
- Reordered the Skills & tools section: larger 30px heading, numbered interest cards, then detailed skill groups. Removed The toolkit label.
- Renamed the section labels to Projects, Activities, and Certifications. Activities now reads “Learning beyond / the classroom.” with “Hands-on challenges. Practical experience.” at the right. Certifications reads “A stronger / foundation.” with a gray second line and “Building knowledge. One milestone at a time.” at the right.
- Changed accent text to near-black in light mode and off-white in dark mode. Blue primary-button backgrounds remain, with their contrast checked separately.
- All 13 automated checks pass. Live browser visual verification remains pending; prior limitations below still apply.

## October 27 layout and replay update

- Made the portrait area borderless, removing its enclosing panel and caption divider while preserving the theme-aware photos.
- Added a native button around the handwriting heading. Click, tap, Enter, or Space restarts the same strokes without replacing the focused element. Reduced motion suppresses replay.
- Changed the Explore my work arrow to point down-right.
- Moved the university link below the introductory bio and the short “Just a student…” text below the portrait name.
- Moved Skills & tools directly after the hero. Added the supplied skills, retained other existing entries, and grouped Git/Linux under Tools & operating systems.
- Skill columns respond from three on desktop to two on tablet and one on phones.
- All 13 Node tests pass, including two replay checks. Live browser layout/animation verification remains unavailable as noted below.

## Portrait and hero cleanup

The current portrait is the user's supplied `Zaki.png`, copied unchanged from the original project's public folder. Dark mode shows its white shirt. Light mode shows a generated charcoal-shirt version, `Zaki-black-shirt.png`, with the same composition and photographic background. Both images were visually inspected. The previous portrait assets remain available but are no longer selected.

Removed the Engineering × Cybersecurity eyebrow, Building an understanding / Thinking in security subtitle, internship availability wording, and both decorative portrait symbols. Updated the availability binding to tolerate its absent label. Portraits keep their square framing at all breakpoints. These requested changes supersede the initial content-equality notes below.

## Typography follow-up

The main headline now uses original connected cursive SVG lettering with a 3.55-second, one-time stroke animation, following the user's confirmed Apple “hello”-style direction. UI and section typography uses native Apple system fonts with explicit Text/Display fallbacks. No font binaries or external font services are required.

The completed lettering was rasterized from the actual SVG and inspected for shape and legibility. Screen-reader text is retained; reduced-motion and print modes display the complete headline without animation. The existing 11 automated checks were rerun after this change. Live browser animation and full-page responsive verification remain unavailable, as described below.

## Implemented

- Standalone duplicate with unchanged portfolio data and public assets.
- Dark-first graphite and blue theme, matched light theme, and Auto appearance.
- Sticky top navigation, responsive portrait introduction, three interest panels, skills, two featured project cards, CTF activity panel, credential panel, and contact section.
- Preserved project/CTF dialogs, certificate links, safe external destinations, image fallback, and five section anchors.
- Removed the sidebar, terminal presentation, animated data paths, pipeline modules, and motion-pause control from the duplicate.
- Local system typography, reduced-motion handling, keyboard appearance menu, and content visible without entrance-animation support.
- Separate appearance storage key and local preview ports.

## Verified

- 11 Node tests pass, covering both palettes' AA text contrast (including gradient endpoints), CSS token references, URL validation, all referenced public assets, document and ARIA targets, section anchors, active-section behavior, appearance-menu keyboard focus/scroll preservation, and interrupted theme-transition cleanup.
- Syntax checks pass for the modified JavaScript entry points.
- `src/content.js` matches the original byte-for-byte; a recursive comparison of `public/` reports no differences.
- The original repository has no modifications.
- The dependency-free preview server starts on `127.0.0.1:5174` and serves the page with HTTP 200 and the expected content type.

## Verification limits

The installed browser-control tool exposes no connected browsers. Native Chrome control timed out; Chrome and the built-in browser could not be selected. Desktop/tablet/phone screenshots and live interaction checks therefore remain pending. No visual verification is claimed.

Vite dependencies were not installed: sandbox network access failed, and the requested dependency-download approval was declined. The production build is not verified. The source preview works without downloading dependencies.

## Remaining browser review

1. Inspect at 320, 375, 768, 1024, and 1440 px widths in both appearances; confirm no overflow, clipped text, or obstructed focus outlines.
2. Open both project dialogs and all three CTF dialogs; confirm Escape, close button, outside click, focus return, and certificate preview behavior.
3. Select Light, Dark, and Auto using mouse and keyboard; reload to confirm persistence, and change device appearance while Auto is selected.
4. Navigate every section and Back to top, including from the page bottom; confirm active-section tracking and header offsets.
5. Confirm portrait swaps and image-error fallback; verify email, GitHub, LinkedIn, university, project, and certificate links.
6. Enable reduced motion and verify instant appearance changes and scrolling, with no reveal or hover movement.

Once dependency installation is available, run `npm ci`, `npm test`, and `npm run build`, then repeat a browser smoke check against `npm run preview` at port 4174.
