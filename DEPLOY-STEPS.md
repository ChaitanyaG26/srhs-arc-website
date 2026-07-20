# Deploying to your `srhs-arc-website` repo

This follows exactly from the screenshot you sent: you already have an empty GitHub repo at
**`github.com/ChaitanyaG26/srhs-arc-website`** (it's showing the "Start coding with Codespaces" /
"Add collaborators" screen, which just means no files have been pushed to it yet). Here's how to
get everything from this folder onto that repo and live on the web.

## Updating your already-live site (this round of changes)

Your site is live now, so this batch of changes (photos, recolored CAD models, the Roles page,
the gallery, camera fixes, etc.) is an **update** to a repo you've already pushed to once — not a
fresh empty-repo push. Two things specific to this update:

- `roles-and-updates.html` was **renamed** to `roles.html` (and its "Updates" section was
  removed). When you copy these new files into your local `arc-site` folder, delete the old
  `roles-and-updates.html` first so it doesn't linger.
- If you're reusing the same local folder you already ran `git init` in, `git add .` will
  automatically pick up both the new `roles.html` and the deletion of the old file — nothing
  special needed for that.

From that same folder, push the update with just:

```bash
git add .
git commit -m "Update site: roles page, gallery, CAD colors, camera fixes"
git push
```

No need to repeat `git init`, `remote add`, or `-u origin main` — those only happen once. From
here on, every future update is just `add`, `commit`, `push`. GitHub Pages rebuilds automatically
within a minute or two of the push, same as before.

> **If you already hit a "Commit failed... file is too large" error:** that's GitHub's browser
> upload choking on this many files at once (`assets/images/` alone is ~85MB across 41 photos) —
> it's not actually about one specific oversized file. Skip Option A below and use **Option B**
> or **Option C** instead; neither has that limit.

---

## Option B — GitHub Desktop (easiest fix for the upload error, no terminal)

1. Download and install [GitHub Desktop](https://desktop.github.com/) and sign in with your
   GitHub account.
2. In GitHub Desktop: **File → Clone Repository**, choose `ChaitanyaG26/srhs-arc-website` from
   the list, and pick a folder on your computer to clone it into. This gives you an empty local
   folder linked to the repo.
3. Unzip `arc-site.zip` and copy **everything inside** the `arc-site` folder (not the folder
   itself — `index.html`, `overview.html`, `assets/`, etc.) into that cloned folder, so
   `index.html` sits directly inside it.
4. Back in GitHub Desktop, you'll see all the new files listed as changes. Type a summary like
   "Add ARC website" in the box at the bottom left, and click **Commit to main**.
5. Click **Push origin** at the top to upload everything to GitHub.

Then jump to **Turning on GitHub Pages** below.

---

## Option C — Push with Git from the command line

If you're comfortable with a terminal, this is the fastest route:

```bash
cd path/to/arc-site
git init
git add .
git commit -m "Add ARC website"
git branch -M main
git remote add origin https://github.com/ChaitanyaG26/srhs-arc-website.git
git push -u origin main
```

You'll be prompted to sign in to GitHub (a browser window will pop up, or you'll need a
[personal access token](https://github.com/settings/tokens) if prompted for a password).

Then jump to **Turning on GitHub Pages** below.

---

## Option A — Upload through the GitHub website (fine for small edits later, not for this initial upload)

1. Unzip `arc-site.zip` (or grab the folder if you already have it unzipped) so you have the
   `arc-site` folder with `index.html`, `overview.html`, `assets/`, etc. inside it.
2. Go to `https://github.com/ChaitanyaG26/srhs-arc-website`.
3. On that empty-repo page, look for the small link that says **"uploading an existing file"**
   (it's part of the setup text near the top — right below "Quick setup"). Click it.
   - If you don't see it, go to the **Code** tab and click **Add file → Upload files**.
4. Open the `arc-site` folder on your computer, select **everything inside it** (`index.html`,
   `overview.html`, `roles.html`, `past-years.html`, `extras.html`, `README.md`,
   `DEPLOY-STEPS.md`, and the whole `assets` folder), and drag them all into the GitHub upload box
   at once.
   - Important: drag the *contents* of `arc-site`, not the `arc-site` folder itself — `index.html`
     needs to sit at the top level of the repo, not inside a subfolder.
   - GitHub's drag-and-drop does preserve subfolders (like `assets/images/`), so the `assets/`
     folder structure will come through correctly as long as you drag the whole `assets` folder in.
5. Scroll down, add a commit message like "Add ARC website," and click **Commit changes**.
6. Wait for the upload to finish — the `assets/models/` files and photos add up to a decent
   amount of data, so this may take a minute or two depending on your connection.

Then jump to **Turning on GitHub Pages** below.

---

## Turning on GitHub Pages

Once the files are in the repo (any option above):

1. Go to the repo's **Settings** tab.
2. In the left sidebar, click **Pages**.
3. Under "Build and deployment," set **Source** to **Deploy from a branch**.
4. Set **Branch** to `main` and the folder to `/ (root)`, then click **Save**.
5. Give it a minute or two — GitHub will show a green banner with your live URL:
   **`https://chaitanyag26.github.io/srhs-arc-website/`**

That's it — the site is live. Anyone with that link can view it, no Wix watermark, completely free.

## After it's live — double-check these

- Open the site on your phone and click through all five pages (Home, Overview, Past Years,
  Roles & Updates, Extras) to confirm everything looks right and nothing overflows.
- On the **Extras** page, confirm both CAD models load and rotate, and that "Start Camera" prompts
  for camera permission and draws boxes around red/green/blue objects.
- If a photo looks broken (a gray box instead of an image), it usually means that file didn't
  finish uploading — check `assets/images/` in the repo on GitHub.com to confirm the filename is
  there and matches exactly (capitalization matters).

## Making changes later

Any time you want to update text, swap a photo, or fill in one of the placeholder captions:
edit the file directly on GitHub.com (click the file, then the pencil/edit icon), or pull the repo
down with `git clone`, edit locally, and `git push` again. GitHub Pages automatically redeploys
within a minute or two of any push to `main`.
