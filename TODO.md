## Next steps

- [ ] Test driven development of Prosemirror-JSON-to-markdown renderer and
      JSON-to-Markdown-to-HTML-to-JSON roundtrip.
      Check Prosemirror Markdown serializer for inspiration. Add Markdown-it
      for rendering HTML again. Special rendering for mentions?
- [ ] Write custom mention node for linked pages. It should be clickable ("opening" a the page, whatever open means, e.g. adding an element with the page content, switching URL, etc), maybe even displays a
      preview of the linked page

## Done

- Replace starter-kit with my subset of features: headings, lists,
  paragraphs, links, hr, bold, italic, blockquote
- Add prettier
- Try out mentions:
  - Mentions are not interactive (clickable, tooltip, etc).
    https://github.com/ueberdosis/tiptap/discussions/851#discussioncomment-95118
    recommends to build custom node
  - tiptap renders Mentions as `<span>` elements
