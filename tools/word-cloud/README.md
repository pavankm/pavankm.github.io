# Word Cloud

Static, browser-only tool at `/tools/word-cloud/`. No build step, uploads, stored
text, or runtime third-party requests. Serve the repository over HTTP; ES modules
do not work by opening `index.html` as a local file.

Content and editable English stop words are normalized and counted locally.
Single-letter tokens and numbers are excluded. Up to 120 unique words are passed
to d3-cloud; the page reports words omitted by this limit or layout constraints.
SVG words support pointer dragging and keyboard arrow movement (Shift for larger
steps). Moves are bounded to the artboard but may overlap other words. Every
generation resets positions; resizing does not. SVG and 2x PNG downloads include
the current arrangement on a fixed light background.

## Vendored dependency

- d3-cloud **1.2.7**, unmodified browser bundle including d3-dispatch.
- Source: <https://cdn.jsdelivr.net/npm/d3-cloud@1.2.7/build/d3.layout.cloud.js>
- Local file: `vendor/d3.layout.cloud-1.2.7.js`
- SHA-256: `919e685c8da5024f6eaf8e1f7de455b18df910c0605c041ecc4ce8f8af4341da`
- BSD licenses are retained in `vendor/d3-cloud.LICENSE` and
  `vendor/d3-dispatch.LICENSE`.

To update, fetch an explicit version, review its bundle and licenses, and update
the filename, SHA-256, and script integrity attribute in `index.html` together.
Do not replace the local script with a CDN or unversioned URL.

## Checks

Run `node --test tools\word-cloud\words.test.mjs` from the repository root.
Browser checks should cover generation, empty/all-stop-word inputs, dragging at
different viewport sizes, keyboard nudging, regeneration, and both downloads.
