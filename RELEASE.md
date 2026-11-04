# Release notes

## Temporary solo version (since 04.11.2026)

The site currently runs without Sadie. The full duo version is backed up on
the branch **`duo-version`** (commit f426858); to restore it, merge that
branch back into `main` (or revert the `temp-solo` merge).

Removed / changed in the solo version:

- Bio: press photo cropped to Alexander only
  (`public/press/lithium-sea-press-alex*.jpg`), members line
  "Alexander Muell & guest vocalists", body text rewritten, tag
  "Female-Fronted" dropped; meta description and alt text without her name.
- Music: "Watch the video" link removed (the Masters of War video on YouTube
  is untouched — set it to unlisted there if it should not be found).
- Editions section removed (The Radiant Somber), incl. nav links on the legal
  pages and `public/editions/radiant-somber.jpg`.
- Press kit: press-photo download removed; the duo photo files are gone from
  `public/press/`.
- Ambient audio, sound toggle and "click anywhere for sound" hint switched off
  (`src/main.js`); `public/audio/*.mp3` removed.
- Unreferenced Lucky 13 images (`lucky13-cover.jpg`, `og-image-lucky13.jpg`)
  removed from `public/`.

The Music section (`index.html` → `#music`) shows one featured single. Right
now that is **Masters of War** (Bob Dylan cover), out on streaming
**11.11.2026** (Amuse). The music video is linked from the "Watch the video"
button (YouTube `BZdUq4jBg_k`). The **Lucky 13** block is parked below so it
can go back in unchanged.

## Masters of War — release day

In `index.html` → `#music`:

1. Release tag: `Debut Single · Out 11.11.2026` → `Debut Single · 2026`.
2. Delete the `stream-soon` line ("Streaming from 11.11.2026") and the
   `is-soon` class on `.stream-links`.
3. Turn each `<span class="stream-link" aria-disabled="true">` into
   `<a href="LINK" target="_blank" rel="noopener" class="stream-link">`.
   Drop platforms that have no link.
4. Track duration in the tracklist (`—:——`).
5. Artwork: **done 27.10.2026** — final cover (burning globe, title + band
   name on the artwork) is in `public/masters-of-war-cover.jpg` (1300 px) and
   `public/og-image.jpg`; name overlay and colour grade removed, shown
   untouched. The distributor needs 3000 × 3000 px; the site only needs ~1300.
6. The previous OG image is kept as `public/og-image-lucky13.jpg`.

## Lucky 13 — parked block

Pre-release markup as it was on the site (music section, before Masters of
War took the slot). To show Lucky 13 again, either swap it back into
`.music-featured` or add it as a second `.music-featured` block below.

```html
<div class="album-art">
  <img class="album-art-img" src="/lucky13-cover.jpg" alt="Lucky 13 — single artwork" loading="lazy" />
</div>
<div class="album-info">
  <div class="release-tag">Single · Coming Soon</div>
  <h2 class="album-title">Lucky 13</h2>
  <p class="album-desc">The debut single from Lithium Sea. More to come.</p>
  <ul class="tracklist">
    <li>
      <span class="track-num">01</span>
      <span class="track-name">Lucky 13</span>
      <span class="track-dur">—:——</span>
    </li>
  </ul>
  <div class="video-block">
    <div class="video-label">Official Music Video · Coming Soon</div>
  </div>
  <div class="stream-soon">Streaming soon</div>
  <div class="stream-links is-soon" aria-label="Streaming links — available on release">
    <span class="stream-link" aria-disabled="true">Bandcamp</span>
    <span class="stream-link" aria-disabled="true">Spotify</span>
    <span class="stream-link" aria-disabled="true">Apple Music</span>
    <span class="stream-link" aria-disabled="true">Soundcloud</span>
    <span class="stream-link" aria-disabled="true">YouTube</span>
    <span class="stream-link" aria-disabled="true">Tidal</span>
    <span class="stream-link" aria-disabled="true">Deezer</span>
    <span class="stream-link" aria-disabled="true">Amazon Music</span>
  </div>
</div>
```

The cover file `public/lucky13-cover.jpg` stays in the repo.

## Lucky 13 — release day

1. Release tag `Coming Soon` → `<year>`; stream links as in steps 2–4 above.
2. Video: replace the `video-block` with the embed again:

   ```html
   <div class="video-block">
     <div class="video-label">Official Music Video</div>
     <div class="video-embed">
       <iframe
         src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
         title="Lucky 13 — Official Music Video"
         allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         allowfullscreen
         loading="lazy"
       ></iframe>
     </div>
   </div>
   ```

   (Set the YouTube video from unlisted to public first. The embed loads
   content from YouTube/Google, so add a YouTube section to `datenschutz.html`
   — or use a click-to-load preview — before it goes live.)
   Also extend the Content-Security-Policy in `vercel.json`: add
   `frame-src https://www.youtube-nocookie.com` (and `img-src` for
   `https://i.ytimg.com` if thumbnails are used), otherwise the browser
   blocks the embed.
3. Track duration in the tracklist (`—:——`).
