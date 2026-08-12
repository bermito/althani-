# Urban Hippie Coffee Roasters — website

Four pages, no build step, no server required.

```
index.html       Home
about.html       Founder story
wholesale.html   Café / wholesale enquiries
contact.html     Contact
assets/
  site.css       All shared styling
  site.js        Smooth scroll, magnetic buttons, WhatsApp links, page transitions
  logo-horizontal.png
  branch.webp    Hero illustration, background removed
```

## Before it's live

One thing left to fill in.

**Domain, for SEO.** Each of the four HTML files has the placeholder `https://YOURDOMAIN.COM` in four spots near the top (canonical link, Open Graph, Twitter Card). Once you have a real domain, find-and-replace `YOURDOMAIN.COM` with it in all four files — any text editor works, or edit directly on GitHub. This is what controls the preview card when someone shares the site on WhatsApp, Instagram, or anywhere else. Until it's set, those tags point at a placeholder and won't break anything, they just won't be correct yet.

The WhatsApp number is already set in `assets/site.js` (`WHATSAPP_NUMBER`) — change it there directly if it ever needs to change.

## What's already handled

- Favicon (all standard sizes, plus `favicon.ico` for older browsers/taskbars)
- A branded 1200×630 share image (`assets/og-image.jpg`) for link previews
- Meta description, Open Graph, and Twitter Card tags on every page
- `robots: index, follow` so search engines can crawl it

## Upload to GitHub

1. Go to **github.com** → **New repository**. Name it anything, e.g. `urban-hippie`. Keep it **Public** if you want free GitHub Pages hosting. Don't tick "Add a README" — this folder already has one.
2. On the new repo's page, click **Add file → Upload files**.
3. Unzip this download first, then **drag the whole folder's contents in at once** — all four `.html` files and the `assets` folder together, in one drop. Don't upload `assets` separately or one file at a time; the folder structure has to arrive intact.
4. Scroll down, click **Commit changes**.

## Turn on hosting (GitHub Pages)

1. In the repo, go to **Settings → Pages**.
2. Under **Branch**, choose `main` and `/ (root)`, then **Save**.
3. GitHub gives you a link, usually `https://yourusername.github.io/urban-hippie/` — live in a minute or two.

## Making changes later

Any edit — text, colors, a new number — happens by editing the file on GitHub (pencil icon on the file page) or re-uploading it, then committing. Pages rebuilds automatically each time.
