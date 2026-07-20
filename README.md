# SRHS Aerospace Robotics Club — Website

A coded rebuild of the ARC Wix site (no Wix watermark, free hosting via GitHub Pages).

## What's here

- `index.html` — Home (includes a 6-box officer/spotlight grid)
- `overview.html` — Club overview (scheduling, showcase, contact, community service)
- `roles.html` — Team roles (Engineers / Programmers / CAD Drafters)
- `past-years.html` — Season 23–24 / 24–25 / 25–26 (tab-switchable), rosters, and result writeups
- `extras.html` — Interactive CAD model viewers, live color-recognition camera demo, and a self-scrolling ARC Photo Gallery
- `assets/css/style.css` — shared styles ("flight-deck" design system: navy background, cyan/amber avionics accents, waypoint-labeled sections, fully fluid/responsive)
- `assets/js/main.js` — mobile nav toggle + Past Years tab switching
- `assets/js/color-detect.js` — the live camera color-detection logic (Extras page only)
- `assets/images/` — all club photos
- `assets/models/` — the two drone assemblies as `.glb` 3D files (see below)

## Deploying / updating

See `DEPLOY-STEPS.md` — it now has both the original setup steps and a section on pushing
updates like this one.

## What changed in this update

- **Home page** — the single Logan quote box is now a 6-box grid: Logan, Pratik, Akshaj, Brian,
  Evan, and C. The five new boxes have photos in but placeholder quote/role text (see below) since
  I don't have their actual quotes or titles yet.
- **Roles page** — renamed from `roles-and-updates.html` to `roles.html`; the Updates section is
  gone entirely, along with every "Updates" mention in the title, nav, and footer. The Programmers
  card now vertically centers its content so it lines up with the taller Engineers/CAD Drafters
  cards next to it.
- **Past Years tabs** — the horizontal scrollbar under the tab buttons is now hidden (tabs still
  scroll if there isn't room, the scrollbar itself just doesn't show).
- **Face crops fixed** — C's, Neil's, and Arthur's roster photos were being center-cropped in a
  way that cut off their faces (tall portrait photos in a short wide card). They now crop from
  near the top instead.
- **New official logo** — `FlyingFalconsLogo.png` replaces the old Wix-hosted logo everywhere
  (nav bar and footer, every page).
- **CAD models recolored** — every part in both `.glb` models is now a uniform `#A8A8A8` gray
  instead of whatever shading came out of the STEP export.
- **Camera demo fixed** — the video feed was likely appearing dark because it was being
  letterboxed against a solid black background; it now fills its frame edge-to-edge, detection
  thresholds are more forgiving, and there's a brightness/saturation boost applied specifically to
  the analysis step (not the visible video) to make red/green/blue detection more reliable in
  normal indoor lighting.
- **ARC Photo Gallery** — a new self-scrolling strip on the Extras page holding all 15 previously
  unused photos; hover to pause it.
- **Visual polish** — flattened the diagonal-striped placeholder boxes to a cleaner solid tint,
  and redesigned the circular icon badges (role cards, feature cards) into a more understated
  square "instrument tag" style.

## Photos

All photos are in `assets/images/`, using their original filenames. One thing still worth doing
on your end: the 5 small circular icons on the Roles page's old Updates section are gone now (no
longer relevant), so nothing to do there.

**Photos wired into the site:**
- Home hero + "Join the Crew" band + officer grid → `FrontPageCover.jpeg`, `Wallpaper-DroneBottomView.jpeg`, `Logan.jpg`, `Pratik.jpg`, `Akshaj.jpg`, `Brian.jpg`, `Evan.jpg`, `C.jpg`
- Overview hero + "Get in Touch" → `Aerial-NatsFlight-SD.jpg`, `C-Logan-Ethan.png`
- Roles hero + role cards → `ARCMascot.png`, `Engineers.jpg`, `CADdrafters.png`
- Past Years 23-24 → `ARCmech23-24.png`, `FoundingTeam23-24.jpg`, plus roster photos (`Logan.jpg`, `Ethan.jpg`, `C.jpg`, `Leandros.png`, `Jeffrey.png`, `Arthur.png`)
- Past Years 24-25 → `ARCmech24-25.png`, `ARCmech2-24-25.png`, same Falcons roster + Flight Knights (`Joshua24-25.jpg`, `Pratik24-25.jpg`, `John24-25.jpg`, `Akshaj24-25.jpg`, `Enzo24-25.jpg`, `Neil24-25.jpg`)
- Past Years 25-26 → `Mission1-Mech-25-26.jpg`, `Drone2025-26-FlyingFalcons.jpeg`, `FlyingFalcons25-26-Group.jpg`, `TheFlightKnights25-26.jpg` — no roster section
- Extras → ARC Photo Gallery holds all 15 previously-unused photos (`ARC25-26-WALLPAPER.jpg`, `ARChook.png`, `Aerial-NatsFlight-Boston.jpg`, `Aerial-NatsFlight-Boston2.jpg`, `Drone24-25.jpeg`, `Ethan-Nats.jpg`, `FlightKnights-Regionals.jpg`, `Logan-Nats.jpg`, `Noah24-25.jpg`, `NoahImg1.jpg`, `NoahWalsh.JPG`, `OldArcFlyer.jpg`, `Regionals25-26.jpg`, `SightseeingAtNats-Boston.jpg`, `TeamBonding-Nats-Jeff.jpg`)

Every photo you've sent is now used somewhere on the site.

## Editing the placeholder text

**Cover photos** (mechanism shots, group/team photos, the mascot, etc.) have an "Insert Text Here"
caption baked into the layout over the bottom of the image:

```html
<div class="cover-caption">Insert Text Here</div>
```

**The 25-26 Accolades writeup** — a highlighted box in `past-years.html` (the `y25-26` tab panel):

```html
<div class="placeholder-note">Space for text to be inserted</div>
```

**The 5 new officer boxes on the home page** (Pratik, Akshaj, Brian, Evan, C) — each has a
placeholder quote and a placeholder role, in `index.html`:

```html
<div class="placeholder-note compact">Insert quote here</div>
<cite>PRATIK SINGH — INSERT ROLE HERE</cite>
```

Replace the placeholder line with a normal `<blockquote>...</blockquote>` (matching Logan's box)
once you have their actual quotes and roles, and swap `INSERT ROLE HERE` for their real title.

## CAD models (Extras page)

Your two `.step` assembly files were converted to `.glb` (the format web browsers can actually
display), every part recolored to a uniform `#A8A8A8`, and compressed for faster loading:

| Season | Original STEP | Web model | Size |
|---|---|---|---|
| 2024–25 | `Drone-24-25.step` | `assets/models/Drone-24-25.glb` | ~520 KB (was 10.2 MB) |
| 2025–26 | `Drone-25-26.step` | `assets/models/Drone-25-26.glb` | ~1.0 MB (was 20 MB) |

They render with Google's `<model-viewer>` web component — visitors can drag to rotate,
pinch/scroll to zoom, and on a supported phone tap the AR icon to place the drone in their own
room. If you ever update the CAD design, send me the new `.step` file and I'll regenerate the
`.glb` (recolored the same way, unless you'd rather see the original material colors).

## Live color-recognition camera demo (Extras page)

Pure browser JavaScript — no server, no upload, nothing recorded. It samples the live camera feed,
classifies regions as red/green/blue by color (hue/saturation/brightness thresholds), groups
matching pixels into blobs, and draws a labeled, color-coded box around each one. Works best in
good lighting with saturated colors (bright red/green/blue objects work far better than pastel or
dim ones).

Needs **HTTPS** (or `localhost`) — GitHub Pages serves HTTPS automatically, so it works once
deployed; opening the HTML file directly from your computer won't give camera access.

## Responsive design

Every page — including the CAD viewers, camera demo, and photo gallery — uses fluid spacing and
reflowing grids (no fixed breakpoints), so it should look clean with sensible padding at any
screen size or aspect ratio, from a small phone in portrait to an ultra-wide monitor, without
overflowing horizontally.
