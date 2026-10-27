# Portfolio content and asset directory

The live entries for Projects, CTF, and Certifications are in [`src/content.js`](src/content.js), inside `window.PORTFOLIO`. These entries use the details supplied on October 15, 2026. Skills & tools is maintained in `index.html` and now includes the additional entries supplied on October 27, 2026, alongside retained original skills.

## Skills & tools

- Security & networks: Wireshark, Nmap, Burp Suite, TCP/IP, VLANs, Routing & Switching, Digital Forensics, Cisco Packet Tracer.
- Engineering & coding: Python, C / C++, Microcontrollers, JavaScript, TypeScript, HTML, CSS, SQL.
- Tools & operating systems: Git, GitHub, Visual Studio Code, Windows, Linux, macOS.

The section sits immediately after the hero: its heading is followed by the three numbered interest cards, then the three detailed skill groups. The university link is below the introductory bio; the short “Just a student…” bio is below the portrait name. The displayed name is Zaki Lorenzo V. Boongaling. The CTF section is labeled Activities while preserving its `#ctfs` anchor and event data.

## Where files go

| Material | Location | Use |
| --- | --- | --- |
| Project screenshots and diagrams | `public/assets/projects/<project-slug>/` | Images approved for the public site |
| CTF screenshots and diagrams | `public/assets/ctf/<challenge-slug>/` | Images approved for the public site; remove flags, secrets, and personal data |
| Certification images or PDFs | `public/assets/certifications/<credential-slug>/` | Public copies only; check credential IDs and personal information |
| Current profile portraits | `public/profile-refined.png`, `public/profile-black-shirt.png`, `public/profile.png` | Existing site images; their paths are already used or retained by the site |

## Current content index

| Entry | Type | Files or links |
| --- | --- | --- |
| review.mnl | Project | [Live site](https://review-mnl-gamma.vercel.app/); `public/assets/projects/review-mnl/screenshot.png` |
| The Event Lab | Project | [Live site](https://theeventlabs.netlify.app/); `public/assets/projects/the-event-lab/screenshot.png`, `public/assets/projects/the-event-lab/landing-page.png` |
| Cyber Apocalypse CTF 2026: The Salt Crown | CTF | Main event July 24-29, 2026; After Party July 31-August 2, 2026; no write-up supplied |
| LearnPossible 2 CTF | CTF | Participated; October 16, 2026; no write-up supplied |
| Kaspersky{CTF} | CTF | Kaspersky{CTF}; August 28, 2026; Participated |
| Cyber Apocalypse CTF 2026: The Salt Crown - Certificate of Participation | CTF event attachment | Shown inside the Cyber Apocalypse event; PDF at `public/assets/certifications/cyber-apocalypse-2026/certificate.pdf` |
| CCNA: Enterprise Networking, Security, and Automation | Certificate | Cisco; September 2026; public PDF at `public/assets/certifications/ccna-enterprise-networking-security-automation/certificate.pdf` |

Files under `public/` are publicly accessible when the site is deployed. Keep source files, private notes, and unredacted documents outside `public/`. Use lowercase, hyphenated names such as `dashboard-overview.webp` and `certificate.pdf`. Refer to a public file from the site as `/assets/projects/<project-slug>/dashboard-overview.webp`.

## Information to collect

| Section | Details needed for each entry | Helpful files and links |
| --- | --- | --- |
| Projects | Title, type, short summary, your role, tools, process, result, lessons, and desired order | 1–3 screenshots or diagrams, repository, demo |
| CTF | Challenge title, event/platform, category, date, result or status, approach, lesson, and desired order | Sanitized screenshots, public write-up or event link |
| Certifications | Exact credential title, issuer, issue month/year, current status, and desired order | Verification URL, approved badge or certificate image |

The current project card supports a title, category, description, tags, and a decorative icon; its detail view supports your role, lessons, and a link. CTF rows support a title, event, category, status, notes, and a write-up link. Certification rows support a title, issuer, date, status, and verification link. Showing uploaded images in those sections will require a small rendering change after we choose which assets to feature.

## Editing sequence

1. Confirm the real entries, preferred order, and which links/files may be public.
2. Replace placeholder text in `src/content.js` and add approved files to the matching asset folders.
3. Add image display where it improves the cards or detail views, and check mobile layouts.
4. Validate the links and build, then review the finished sections before publishing.

CTF status values are `Pending` and `Participated`. Unrecognized or missing statuses display as Pending. Certificate attachments use `certificate` for the original document and `certificateImage` for the image preview.
