# Lucky 13 — release day checklist

Until release, the Music section shows "Coming Soon", hides the video and greys
out the streaming links. On release day, in `index.html` → `#music`:

1. Release tag: `Debut Single · Coming Soon` → `Debut Single · <year>`.
2. Video: replace the `video-block` with the embed again:

   ```html
   <div class="video-block">
     <div class="video-label">Official Music Video</div>
     <div class="video-embed">
       <iframe
         src="https://www.youtube-nocookie.com/embed/tZOGlCwjpNg"
         title="Lucky 13 — Official Music Video"
         allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         allowfullscreen
         loading="lazy"
       ></iframe>
     </div>
   </div>
   ```

   (Set the YouTube video from unlisted to public first.)
3. Delete the `stream-soon` line and the `is-soon` class on `.stream-links`.
4. Turn each `<span class="stream-link" aria-disabled="true">` into
   `<a href="LINK" target="_blank" rel="noopener" class="stream-link">`.
   Drop platforms that have no link.
5. Track duration in the tracklist (`—:——`).
