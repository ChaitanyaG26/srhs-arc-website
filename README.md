# SRHS Aerospace Robotics Club — Website

A coded rebuild of the ARC Wix site (no Wix watermark, free hosting via GitHub Pages).

## What's here

- `index.html` — Home
- `overview.html` — Club overview (scheduling, showcase, contact, community service)
- `roles-and-updates.html` — Team roles + latest updates
- `past-years.html` — Season 23–24 / 24–25 / 25–26 (tab-switchable), rosters, and result writeups
- `extras.html` — Interactive CAD model viewers + live color-recognition camera demo
- `assets/css/style.css` — shared styles ("flight-deck" design system: navy background, cyan/amber avionics accents, waypoint-labeled sections, fully fluid/responsive)
- `assets/js/main.js` — mobile nav toggle + Past Years tab switching
- `assets/js/color-detect.js` — the live camera color-detection logic (Extras page only)
- `assets/images/` — all club photos
- `assets/models/` — the two drone assemblies as `.glb` 3D files (see below)

## Deploying to GitHub Pages (free, no watermark)

See `DEPLOY-STEPS.md` for exact steps for your `ChaitanyaG26/srhs-arc-website` repo.

## Photos

All 41 photos from your zip are in `assets/images/`, using the exact same filenames. Only two things still point to the old Wix URLs on purpose:
- The small ARC crest logo in the nav bar and footer (your actual logo — no replacement was in the photo set)
- The 5 small circular icons on the Roles & Updates page (Regular Scheduling, Library, Deadlines, Releases, Elections) — send matching ones if you'd like those swapped too

**Photos wired into the site:**
- Home hero + "Join the Crew" band → `FrontPageCover.jpeg`, `Wallpaper-DroneBottomView.jpeg`
- Overview hero + "Get in Touch" → `Aerial-NatsFlight-SD.jpg`, `C-Logan-Ethan.png`
- Roles & Updates hero + role cards → `ARCMascot.png`, `Engineers.jpg`, `CADdrafters.png`
- Past Years 23-24 → `ARCmech23-24.png`, `FoundingTeam23-24.jpg`, plus roster photos (`Logan.jpg`, `Ethan.jpg`, `C.jpg`, `Leandros.png`, `Jeffrey.png`, `Arthur.png`)
- Past Years 24-25 → `ARCmech24-25.png`, `ARCmech2-24-25.png`, same Falcons roster + Flight Knights (`Joshua24-25.jpg`, `Pratik24-25.jpg`, `John24-25.jpg`, `Akshaj24-25.jpg`, `Enzo24-25.jpg`, `Neil24-25.jpg`)
- Past Years 25-26 → `Mission1-Mech-25-26.jpg`, `Drone2025-26-FlyingFalcons.jpeg`, `FlyingFalcons25-26-Group.jpg`, `TheFlightKnights25-26.jpg` — **no roster section**, per your request

**Still unused** (available in `assets/images/` for whenever you want them): `ARC25-26-WALLPAPER.jpg`, `ARChook.png`, `Drone24-25.jpeg`, `Ethan-Nats.jpg`, `FlightKnights-Regionals.jpg`, `Logan-Nats.jpg`, `Noah24-25.jpg`, `NoahImg1.jpg`, `NoahWalsh.JPG`, `OldArcFlyer.jpg`, `Regionals25-26.jpg`, `SightseeingAtNats-Boston.jpg`, `TeamBonding-Nats-Jeff.jpg`, `Aerial-NatsFlight-Boston.jpg`, `Aerial-NatsFlight-Boston2.jpg`.

## Editing the placeholder captions

Every non-portrait "cover" photo (mechanism shots, group/team photos, the mascot, etc.) has an "Insert Text Here" caption baked into the photo itself, as a bar over the bottom of the image. To change one, open the relevant HTML file and find:

```html
<div class="cover-caption">Insert Text Here</div>
```

There's one of these right after each cover photo's `<img>` tag — replace the text between the tags. Individual roster headshots don't have captions.

The 25-26 Accolades section instead has a highlighted amber/striped box that reads **"Space for text to be inserted"** — that's in `past-years.html`, inside the `y25-26` tab panel:

```html
<div class="placeholder-note">Space for text to be inserted</div>
```

Replace that whole line with your actual write-up once you have it (it can just become a normal `<p class="award-note">...</p>` like the 23-24/24-25 sections use).

## CAD models (Extras page)

Your two `.step` assembly files were converted to `.glb` (the format web browsers can actually display) and compressed for faster loading:

| Season | Original STEP | Web model | Size |
|---|---|---|---|
| 2024–25 | `Drone-24-25.step` | `assets/models/Drone-24-25.glb` | ~560 KB (was 10.2 MB) |
| 2025–26 | `Drone-25-26.step` | `assets/models/Drone-25-26.glb` | ~1.1 MB (was 20 MB) |

They render with Google's `<model-viewer>` web component — visitors can drag to rotate, pinch/scroll to zoom, and on a supported phone tap the AR icon to place the drone in their own room. I verified both converted models still contain the full assembly geometry (hundreds of thousands of vertices across dozens of parts) — if anything looks off once you see it live (a missing part, wrong scale), it's almost always fixable by re-exporting the STEP with all parts "shown" before conversion.

If you ever update the CAD design, send me the new `.step` file and I'll regenerate the `.glb`.

## Live color-recognition camera demo (Extras page)

Pure browser JavaScript — no server, no upload, nothing recorded. It samples the live camera feed, classifies regions as red/green/blue by color (hue/saturation/brightness thresholds), groups matching pixels into blobs, and draws a labeled, color-coded box around each one. Requires camera permission and works best in good lighting with saturated colors (bright red/green/blue objects work far better than pastel or dim ones).

This needs to run over **HTTPS** (or `localhost`) — GitHub Pages serves HTTPS automatically, so it'll work fine once deployed; opening the HTML file directly from your computer won't give camera access.

## Responsive design

Every page — including the CAD viewers and camera demo — uses fluid spacing and reflowing grids (no fixed breakpoints), so it should look clean with sensible padding at any screen size or aspect ratio, from a small phone in portrait to an ultra-wide monitor, without overflowing horizontally.
