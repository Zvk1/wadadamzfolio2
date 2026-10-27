<<<<<<< HEAD
# Portfolio v2

Zaki Lorenzo V. Boongaling's standalone Apple Pro-inspired portfolio. Graphite surfaces, system typography, neutral text with blue action buttons, an editorial layout, and matched dark/light appearances. The original `Wadadamzfolio` project is separate and unchanged.

## Preview on this Mac

Double-click `start-local.command`, then open **http://127.0.0.1:5174**. This uses installed Node.js or the existing runtime bundled with ChatGPT. No package download is needed. Stop the server with Ctrl+C. Refresh the browser after editing files.

From Terminal with Node.js installed:

```sh
cd /Users/z/portfolio-v2
node scripts/serve.mjs
```

On Windows, use `start-local.cmd`. These launchers preview native HTML, CSS, and JavaScript directly; they do not create production output.

## Development and production

With Node.js 22.12+ and npm installed, download the locked dependencies and use Vite:

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vite development uses port **5174**; production preview uses **4174**. Deploy the generated `dist/` directory. The standalone source preview and Vite development server share port 5174; stop one before launching the other.

Dependencies and generated build output are not included. Dependency download was declined in this session, so the Vite production build has not been verified. The dependency-free source preview and Node checks work with the bundled Node runtime.

## Editing

- `src/content.js`: `window.PORTFOLIO` data: identity, portraits, social/contact links, projects, CTF events, and certifications. The current portraits are `Zaki.png` (white shirt, dark mode) and `Zaki-black-shirt.png` (black shirt, light mode); availability is blank as requested.
- `index.html`: introduction, university, interests, skills, section headings, and contact invitation. Skills now include the supplied networking, coding, and tools/operating-system entries, alongside the retained original skills.
- `src/style.css`: appearance tokens, typography, surfaces, and responsive layouts.
- `src/refinements.css`: appearance menu and subtle transitions.
- `src/app.js`: data rendering, links, portraits, and detail dialogs.
- `public/`: the supplied `Zaki.png`, its edited black-shirt variant, and all previously retained portrait, project, and certificate assets. See `portrait-update.md` for the image-edit prompt and provenance.

Dark is the initial appearance. Auto follows the device; Light and Dark override it. The duplicate uses `portfolio-v2-theme` in local storage, independent of the original site's preference. There are no remote font requests, new decorative images, continuous animations, Apple logos, or Apple product branding. Reduced-motion settings disable nonessential transitions and smooth scrolling.

## Typography and handwriting

The interface uses native Apple San Francisco typography through `-apple-system`, with SF Pro Text/Display and platform fallbacks in the font stacks. The system-font approach follows [WebKit's guidance](https://webkit.org/blog/3709/using-the-system-font-in-web-content/); Apple font binaries are not bundled with the site.

The main headline uses original SVG cursive lettering inspired by the flowing Apple “hello” treatment, rather than a redistributed Apple font. Each connected stroke, dot, and crossbar draws in sequence on page load, finishing in about 3.55 seconds. Click or tap the headline to replay; its native button also supports Enter and Space. It does not restart on scroll, hover, or appearance changes. The inline SVG is in `index.html`; CSS timings are in `src/refinements.css` and click replay is in `src/motion.js`. The heading retains its text for screen readers. Reduced-motion settings and print styles show the finished lettering immediately, and reduced motion suppresses replay. The initial animation requires no JavaScript or font downloads. To change the words, update both the accessible heading text and its drawn paths.

## Verification

The headline is two-tone again: “Curiosity,” uses the normal text color and “engineered.” uses blue in both appearances. Projects have a full-card preview target backed by the existing native button, keeping keyboard activation and dialog focus behavior intact.

Sections use a vertical, scroll-linked blur-to-clear transition. Content near the bottom moves up into clarity as you scroll down; content near the top moves down into clarity as you scroll up. Reversing scroll reverses the same transition, and stopping scroll stops its progress. Headings naturally enter before the content below them. Activity rows move together as one panel. The central reading area and the bottom of the page stay fully sharp. Reduced motion disables effects; focused controls stay sharp. Unsupported animation APIs leave content visible. There is no sideways rotation, scroll snapping, or scroll interception.

Run the unit checks without installing dependencies:

```sh
node --test tests/*.test.js
```

See `DESIGN-REVIEW.md` for completed checks and the remaining browser review. This copy was created without the original Git history; it can be initialized as its own repository when desired.
=======
# wadadamzfolio2
-  Zaki's Portfolio
>>>>>>> 99cf39ae3782ae5d5ff3b048076347caa102cc0e
