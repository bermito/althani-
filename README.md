# Urban Hippie Coffee Roasters — website

Four pages, no build step, no server required.

```
index.html       Home
about.html       Founder story
wholesale.html   Café / wholesale enquiries
contact.html     Contact
assets/
  site.css       All shared styling
  site.js        Cursor, smooth scroll, WhatsApp links, page transitions
  logo-horizontal.png
  branch.webp    Hero image
```

## Before it's live

Open `assets/site.js`, find this line near the top, and put in the real number:

```js
var WHATSAPP_NUMBER = '91XXXXXXXXXX';
```

That one line updates every "Order on WhatsApp" button across all four pages.

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
