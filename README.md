# oresti-jorgjiu.github.io

Personal site — a record of my cybersecurity journey: projects, CTF walkthroughs and progress.

Live at **[oresti-jorgjiu.github.io](https://oresti-jorgjiu.github.io)**

Static HTML/CSS/JS. No build step, no dependencies — GitHub Pages serves the files as they are.

---

## Publishing a writeup or project

Content is written in Notion and imported. Nothing is typed twice.

1. In Notion: **Export → Markdown & CSV** (gives you a `.zip`)
2. Open **`/admin/`** on the site and log in with a GitHub token
3. Choose **Writeup** or **Project**, drag the `.zip` in
4. Check the preview, then **Publish**

Both kinds publish into the same `content/` directory. The Writeup/Project choice
is recorded as a `type` on the manifest entry, which is what the Work page badges
and filters on — it does not change where the files land.

Publishing commits straight to this repo, which redeploys the site in about 30–60 seconds.

The importer keeps your content exactly as written — images are embedded into the page,
Notion sub-pages become expandable sections, and text is never reformatted or
reinterpreted. If you want something to appear as a code block, make it a code block in
Notion.

### The login token

`/admin/` authenticates against GitHub itself, so it can't be bypassed by reading the
page source. Create a **fine-grained personal access token** at
*GitHub → Settings → Developer settings → Fine-grained tokens*:

- Repository access: **only** `oresti-jorgjiu.github.io`
- Permissions: **Contents → Read and write** (nothing else)
- Set an expiration

The token is stored only in that browser and is sent only to `api.github.com`. Treat it
like a password — don't log in on a shared machine, and revoke it immediately if it leaks.

---

## Layout

```
index.html  about.html  work.html  contact.html
404.html    served by GitHub Pages for every missing path, site-wide
sq/         Albanian version of every page (kept structurally identical)
content/    data.json (one manifest for writeups and projects)
            <slug>.html      one generated page per entry
            source/          Notion-import source JSON (robots-disallowed)
admin/      Notion importer and publisher (noindex, disallowed in robots.txt)
styles.css  script.js
favicon.svg og.png (1200x630 share card)  sitemap.xml  robots.txt

writeups.html  projects.html  (and their sq/ twins)
            redirect stubs for the pre-merge URLs — keep them
```

Writeups and projects live in one directory and render on one page (`work.html`).
Each `content/data.json` entry carries `"type": "writeup" | "project"`, which drives
the card badge, the call-to-action wording and the type filter. The filter only
renders once both kinds are actually present, so it stays out of the way while the
site is thin.

GitHub Pages cannot issue a 301, so `writeups.html` and `projects.html` are now
meta-refresh stubs with `noindex` and a canonical pointing at `work.html`. Deleting
them would 404 any link that predates the merge.

`script.js` injects the shared header, nav and footer on every page, so navigation and
language switching only need editing in one place.

A note on two things that are easy to break:

- Every page carries `<script>document.documentElement.className+=" js"</script>` in its
  `<head>`. The scroll-reveal animation is scoped to `.js [data-reveal]`, so if that line
  is dropped the animation stops - but if `script.js` ever fails to load, the page still
  shows its content instead of rendering blank. Don't move it to a deferred file.
- `og.png` is generated from a template, not hand-drawn. Re-render it with headless
  Chrome at `--window-size=1200,630` if the headline claims on it go out of date.

---

## Changelog

**5.4** — 9 Sep 2026
Merged writeups and projects into one section.

`writeups/` and `projects/` are now a single `content/` directory with one
`data.json`; import source JSON moved to `content/source/`. The two listing pages
became one — `work.html` (`sq/work.html`, "Punimet") — showing both kinds newest-first,
badged by type, with a filter that appears only once there is more than one type to
filter between. Nav is down to Home / About / Work / Contact.

The old URLs (`writeups.html`, `projects.html`, and their `sq/` twins) are kept as
`noindex` redirect stubs so nothing published before the merge 404s. `robots.txt`,
`sitemap.xml`, the homepage hero and "Latest" card, `404.html` and the admin publisher
were all repointed; the admin now stamps `type` onto each manifest entry.

**5.3** — 9 Sep 2026
Polish pass, no redesign.

*Fixed* — the footer no longer floats mid-screen on short pages; content no longer
renders blank if `script.js` fails to load (the reveal animation is now opt-in rather
than opt-out); dimmed metadata text was below the WCAG AA contrast minimum and now uses
a `--muted` token that clears it; the back-to-top button and primary nav were labelled in
English on the Albanian pages; the homepage "GitHub ↗" button pointed at an internal
page despite the external-link arrow.

*Added* — canonical URLs, `hreflang` pairs between the English and Albanian pages, a
`sitemap.xml` (referenced from `robots.txt`), full Open Graph and Twitter card tags with
a generated `og.png`, and JSON-LD `Person` markup linking the verified profiles. Also a
`404.html`, a real `favicon.svg` (it used to be injected by JS, so it only appeared after
the script ran), a print stylesheet so the About page prints as a plain CV, and a footer
carrying the nav and all five profile links — the social rail is hidden below 900px, so
those were previously unreachable on a phone.

*Changed* — the homepage "External hubs" card became a data-driven "Latest writeup" card
plus a "Verify it" card of real external links; the contact form now confirms that it
opened your mail app and offers a copy-email button, since a `mailto:` with no mail
handler used to look like a broken form.

*Performance* — the background particle animation is suspended while the tab is hidden,
its link pass compares squared distances instead of calling `Math.hypot` per pair, and
resize events are coalesced rather than reallocating the canvas on every address-bar
slide.

*Admin* — JSZip and marked are loaded with SRI hashes (the page handles a GitHub write
token, so a compromised CDN response must not execute); `escapeHtml` now escapes quotes,
which previously broke the generated `<meta description>` for any title or blurb
containing one; publishing writes the page before the manifest, so a failure part-way
can no longer leave the listing pointing at a page that was never created; and generated
pages get canonical and share tags.

**5.2** — 8 Sep 2026
Reframed the site as a record of the cybersecurity journey; removed job-seeking wording;
made the English and `sq/` directories structurally identical.

**5.1** — 8 Sep 2026
Content updated from CV: final-year (was an outdated "Year 2"); homepage leads with
TryHackMe top 2%, CPTS progress and Cisco certificates; About rebuilt as a full web CV;
updated the Hack The Box profile link.

**5.0** — 8 Sep 2026
Publishing now works from Notion exports (Export → Markdown & CSV): drop the `.zip` into
`/admin/` and it converts and publishes both writeups and projects. Images embed
automatically, Notion sub-pages become expandable sections, and content renders exactly as
written. Removed the manual block editor and `writeups/_template.html`.

**4.1** — 7 Sep 2026
Fixed fonts not loading on any page except the homepage; added code-block support; added a
`noscript` fallback so content shows even if JS fails; added `robots.txt` and `noindex` on
admin/draft pages; reorganised `styles.css`; improved writeup reading width, section
dividers and badges.

**4.0** — 7 Sep 2026
Added admin login (GitHub token) and direct publishing to the repo; writeups gained photo
blocks mixed with text; writeup content moved to `writeups/data.json`; cleaned up dead CSS
and placeholder copy.

**3.0** — 2 Sep 2026
Toned down the background glow and scanline effects; added the Writeups section; added
curated project cards; fixed a dead Writeups link, added a favicon and fixed typos.

**2.0** — 5 Mar 2026
Added the Albanian/English switch; fixed platform photos; fixed a directory-switching bug.

**1.0** — 5 Feb 2026
First version.
