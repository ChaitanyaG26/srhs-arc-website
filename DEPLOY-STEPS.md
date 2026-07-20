# Deploying to your `srhs-arc-website` repo

This follows exactly from the screenshot you sent: you already have an empty GitHub repo at
**`github.com/ChaitanyaG26/srhs-arc-website`** (it's showing the "Start coding with Codespaces" /
"Add collaborators" screen, which just means no files have been pushed to it yet). Here's how to
get everything from this folder onto that repo and live on the web.

There are two ways to do it — pick whichever feels easier. Either gets you to the exact same result.

---

## Option A — Upload through the GitHub website (no command line)

1. Unzip `arc-site.zip` (or grab the folder if you already have it unzipped) so you have the
   `arc-site` folder with `index.html`, `overview.html`, `assets/`, etc. inside it.
2. Go to `https://github.com/ChaitanyaG26/srhs-arc-website`.
3. On that empty-repo page, look for the small link that says **"uploading an existing file"**
   (it's part of the setup text near the top — right below "Quick setup"). Click it.
   - If you don't see it, go to the **Code** tab and click **Add file → Upload files**.
4. Open the `arc-site` folder on your computer, select **everything inside it** (`index.html`,
   `overview.html`, `roles-and-updates.html`, `past-years.html`, `extras.html`, `README.md`,
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

## Option B — Push with Git from the command line

If you're comfortable with a terminal, this is faster for this much data:

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

---

## Turning on GitHub Pages

Once the files are in the repo (either option above):

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
