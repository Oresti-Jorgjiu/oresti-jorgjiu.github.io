# oresti-jorgjiu.github.io

My personal site — a record of how I'm learning offensive security: CTF walkthroughs,
projects, and the certifications I'm working through.

Live at **[oresti-jorgjiu.github.io](https://oresti-jorgjiu.github.io)**

It's plain HTML, CSS and JavaScript. No build step, no framework, no dependencies —
GitHub Pages serves the files exactly as they sit in this repo. If you can read HTML,
you can change anything here without learning a toolchain first.

---

## Publishing a writeup or a project

I write in Notion and import it. Nothing gets typed twice.

1. In Notion: **Export → Markdown & CSV**. You get a `.zip`.
2. Open **`/admin/`** on the site and log in with a GitHub token.
3. Pick **Writeup** or **Project**, drag the `.zip` in.
4. Check the preview, then hit **Publish**.

Publishing commits straight to this repo. GitHub Pages then rebuilds, which takes
30–60 seconds — longer for a page with a lot of images. The admin page waits for the
URL to actually respond before handing it to you, so when it shows the link, the page
is genuinely live.

Writeups and projects both land in `content/`. The Writeup/Project choice doesn't change
where files go; it sets a `type` on the entry, and that's what the Work page uses for the
badge, the button wording, and the filter.

The importer leaves your content alone. Images get embedded into the page, Notion
sub-pages become expandable sections, and text is never reformatted or reinterpreted. If
you want something to be a code block, make it a code block in Notion — screenshots of a
terminal stay screenshots.

One thing to know: embedding images makes pages big. The Bounty Hacker writeup is about
1 MB. That's the trade for self-contained pages with no separate image files, but it's
worth keeping an eye on.

### About the login token

`/admin/` checks your token against GitHub itself, so you can't get past it by reading
the page source. Create a **fine-grained personal access token** under
*GitHub → Settings → Developer settings → Fine-grained tokens*:

- Repository access: **only** `oresti-jorgjiu.github.io`
- Permissions: **Contents → Read and write**, nothing else
- Set an expiry

The token is stored in that browser only and is sent only to `api.github.com`. Treat it
like a password: don't log in on a shared machine, and revoke it immediately if it leaks.

---

## Layout

```
index.html  about.html  work.html  contact.html
404.html          GitHub Pages serves this for any missing path, site-wide
content/          everything published, writeups and projects together
  data.json         the index: one entry per page, each with a "type"
  <slug>.html       one generated page per entry
  source/           the Notion import it came from (kept out of robots.txt)
admin/            the Notion importer and publisher (noindex, robots-disallowed)
fonts/            self-hosted variable woff2
styles.css  script.js
favicon.svg  og.png  sitemap.xml  robots.txt

writeups.html  projects.html  sq/*
                  redirect stubs for URLs that used to exist — see below
```

`script.js` builds the header and footer on every page, so the nav only ever needs
editing in one place.

### Things that look odd but are deliberate

**The redirect stubs.** `writeups.html` and `projects.html` were separate pages before
writeups and projects were merged into one Work page. Everything under `sq/` was an
Albanian version of the site, which has been retired. Those URLs were live for months and
may be bookmarked or indexed, and GitHub Pages can't issue a 301, so each one is a small
page that redirects and tells Google the real address. Once Search Console shows nothing
is hitting them, they can go.

**The `js` class.** Every page has this in its `<head>`:

```html
<script>document.documentElement.className+=" js"</script>
```

The scroll-reveal animation is written as `.js [data-reveal]`, so content is visible by
default and only gets hidden once that line has run. Delete the line and the animation
stops — but more importantly, if `script.js` ever fails to load, the page still shows its
content instead of rendering blank. Don't move it into a deferred file.

**Self-hosted fonts.** Loading them from Google cost about 1.9 seconds of mobile load
time, because the browser had to connect to two Google origins and parse a stylesheet
before it could paint any text. They live in `fonts/` now. All three are variable fonts,
so one file covers every weight.

**`og.png` is generated, not drawn.** It's the preview card that shows up when the site
gets shared. If the claims on it go stale, re-render it with headless Chrome at
`--window-size=1200,630`.

---

## Changelog

**5.6** — 14 Sep 2026
Site is English-only now. The `sq/` pages are redirect stubs pointing at their English
equivalents, and `script.js` lost its whole translation layer — which made it short enough
to reorganise into labelled sections and rewrite the comments to say *why* things are the
way they are rather than restating the code.

Also fixed the thing that made a publish look like it had failed: `/admin/` handed over
the live URL the moment it finished committing, but GitHub Pages hadn't rebuilt yet, so
clicking it hit the 404 page. It now polls the URL and only shows it once it really
responds.

**5.5** — 13 Sep 2026
Performance pass after a Lighthouse run. Self-hosted the fonts, which took mobile First
Contentful Paint from 2.7s to 1.1s. Reserved the header's height so injecting it no longer
shifts the page (CLS 0.061 → 0). Stopped building the social rail on phones, where it's
hidden but was still downloading four icons nobody could see. Mobile 89 → 98, desktop 100.

The one audit that can't be fixed here is cache lifetimes: GitHub Pages hardcodes
`max-age=600` and offers no way to change it. Only a CDN in front would move it.

**5.4** — 9 Sep 2026
Merged writeups and projects. They were two directories and two listing pages; now they're
one `content/` directory and one Work page, with a type filter that only appears once
there's more than one type to filter between.

**5.3** — 9 Sep 2026
Polish pass. Fixed a footer that floated mid-screen on short pages, dimmed text that
failed WCAG AA contrast, and English labels that had been left on the Albanian pages.
Added canonical URLs, a sitemap, Open Graph tags with a generated share image, a 404 page,
and a print stylesheet so About prints as a plain CV. Gave the admin page SRI hashes on
its CDN scripts, since it handles a GitHub write token.

**5.2** — 8 Sep 2026
Reframed the site around documenting the journey rather than looking for a job.

**5.1** — 8 Sep 2026
Updated from my CV: final-year rather than an outdated "Year 2", homepage leads with the
TryHackMe ranking and CPTS progress, About rebuilt as a full web CV.

**5.0** — 8 Sep 2026
Publishing now works from Notion exports. Drop the `.zip` into `/admin/` and it converts
and publishes. Replaced the manual block editor.

**4.1** — 7 Sep 2026
Fixed fonts not loading on any page except the homepage. Added code-block support,
`robots.txt`, and `noindex` on admin and draft pages.

**4.0** — 7 Sep 2026
Added the admin login and direct publishing to the repo.

**3.0** — 2 Sep 2026
Toned down the background effects, added the Writeups section and project cards.

**2.0** — 5 Mar 2026
Added the Albanian/English switch (since retired in 5.6).

**1.0** — 5 Feb 2026
First version.
