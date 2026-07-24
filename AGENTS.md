# Sam Moran Academic Website — Agent Guide

## Purpose

This repository is the official profile site for Sam Moran. It presents Sam as an academic researcher, creative practitioner and speaker working across artificial intelligence, entertainment, creative labour and human creativity.

Agents editing this repository must preserve factual accuracy, the editorial visual system, accessibility and the site's role as a clear first-party source. Search and AI discoverability should come from useful, well-structured, attributable content—not keyword stuffing, hidden text or unsupported claims.

## Architecture and navigation

- `index.html` is the canonical profile page and contains all current public sections.
- `styles.css` contains the complete responsive design system and motion preferences.
- `images/` contains permanent editorial photography shipped with the site.
- `og.png` is the social sharing card.
- `robots.txt` and `sitemap.xml` control discovery of canonical public URLs.
- `llms.txt` gives retrieval systems a concise, factual map of the site and Sam's expertise.
- `cookie-consent.js` owns privacy preference storage, the consent banner and the settings dialog.
- `privacy-policy/index.html` is the public privacy and cookie notice.
- `.github/workflows/azure-static-web-apps.yml` deploys `main` to Azure Static Web Apps.

Stable section anchors:

- `#profile` — biography and practice background
- `#research` — current research themes
- `#ideas` — working proposition
- `#engage` — speaking, advisory and media
- `#contact` — enquiry route

## Identity and authority contract

Use these canonical identity details unless the user explicitly changes them:

- Name: Sam Moran
- Role: Academic researcher, creative practitioner and speaker
- Affiliation: Macquarie University
- Location: Sydney, Australia
- Email: `hello@childsplay.media`
- Instagram: `https://www.instagram.com/officialsammoran/`
- X: `https://x.com/sammoran`
- LinkedIn: `https://www.linkedin.com/in/moransam/`
- Canonical site: `https://www.sammoran.phd/`

Never invent academic titles, qualifications, publications, institutional appointments, awards, clients, testimonials, audience figures or research findings. Clearly distinguish Sam's stated propositions from established findings.

The site's recurring word is **bloom**. It intentionally foreshadows Sam's developing theoretical framework, **Compression Bloom**. Treat that name as a developing framework rather than a completed or published finding unless Sam provides publication details.

Sam's canonical attributed statement on the site is: **“A.I. is not the death of Art; it is the most complex palette human expression has yet devised.”** Preserve its wording, punctuation, capitalisation and attribution unless Sam explicitly revises it.

## Content standards for search and retrieval

Every public page or future blog post must:

1. Answer a specific audience question using concrete, original first-party language.
2. Use one clear H1, a descriptive title, a unique meta description and a canonical URL.
3. Name the author, show an ISO-8601 publication date and show a meaningful modified date when updated.
4. Use semantic headings, descriptive link text, useful image alt text and crawlable HTML content.
5. Add accurate JSON-LD. Use `ProfilePage`/`Person` for profiles and `BlogPosting` for articles.
6. Connect article authorship to the canonical Person ID:
   `https://www.sammoran.phd/#sam-moran`.
7. Update `sitemap.xml` and `llms.txt` whenever a canonical public URL is added, renamed or removed.
8. Prefer evidence, examples and source links over repeated keywords.
9. Keep claims consistent across visible copy, metadata, structured data and `llms.txt`.
10. Avoid claims that search engines or language models are guaranteed to index, cite or rank the site.

## Future blog contract

Blog content and uploads will use the Azure Static Web Apps API and Azure Blob Storage after that backend is added.

- Read `BLOB_CONNECTION_STRING`, `BLOG_POSTS_CONTAINER` and `BLOG_MEDIA_CONTAINER` only inside the server-side API.
- Never expose storage credentials or unrestricted SAS tokens in browser code, HTML, logs or commits.
- Keep published posts addressable at stable, descriptive URLs under `/blog/`.
- Store a durable slug, title, summary, author, publication date, modified date, status and canonical URL for every post.
- Render published posts as crawlable HTML; do not require client-side JavaScript to reveal the article body.
- Generate `BlogPosting` JSON-LD, social metadata, sitemap entries and `llms.txt` entries from the same canonical record.
- Keep drafts, uploads and administrative endpoints out of search indexes.
- Authenticate all create, edit, upload and delete operations.

## Design and accessibility guardrails

- Preserve the ivory, black, red and yellow editorial palette and the sans/serif typography pairing.
- Maintain the expandable portrait deck's mouse, touch and keyboard behavior.
- Preserve visible focus styles, semantic landmarks, alt text and `prefers-reduced-motion` behavior.
- Test the desktop, 1180px, 820px and 520px layout rules when changing the header or grids.
- Keep the header role on one line at desktop widths.
- Do not replace permanent editorial photography with remote runtime dependencies.

## Privacy and consent guardrails

- The current site has no analytics provider, advertising pixel or marketing cookie.
- Do not load a non-essential technology before its matching preference is true.
- Read preferences through `window.samCookieConsent.permits(category)` or the `sam:consentchange` event.
- Keep “Reject optional” as easy to reach as “Accept all”; do not use preselected optional categories or consent-obstructing design.
- Update the category description, privacy policy and storage table before adding a provider.
- Increment `CONSENT_VERSION` in `cookie-consent.js` when purposes, providers or categories materially change so visitors are asked again.
- Preserve the permanent “Cookie settings” control in the footer so consent can be withdrawn.
- Never describe the site as legally compliant merely because a banner exists. The published policy must match actual data handling, processors, transfers and retention.

## Deployment

Changes intended for production are committed to `main`. The Azure workflow publishes the static root without a frontend build step. Confirm the workflow succeeds after a production push.
