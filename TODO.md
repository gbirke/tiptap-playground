## Next steps

- [ ] Test driven development of Prosemirror-JSON-to-markdown renderer and
      JSON-to-Markdown-to-HTML-to-JSON roundtrip.
      Check Prosemirror Markdown serializer for inspiration.
	- [x] Keep markdown state for converting a Markdown-it token stream
		into tiptap JSONContent
	- [ ] Create MarkdownParser class that gets handlers and a markdown-it
		instance, parses the markdown into a token stream, iterates it
		calling the handlers and returns JSONContent
	- [ ] Create function that takes handler config and produces handler
		functions (automatically creating `_open` and `_close` handlers).
		Document how to to it.
	- [ ] Create function that validates handler config against a schema
	- [ ] Create special handler (with attrs, etc) for Mention, to try out
		converting to and from markdown/html
- [ ] Write custom mention node for linked pages. The problem with current "mention" nodes is that they are not clickable. The new node should be clickable ("opening" a the page, with a callback for opening, e.g. adding an element with the page content, switching URL, etc), Another feature would be to display a preview of the linked page.

## Done

- Replace starter-kit with my subset of features: headings, lists,
  paragraphs, links, hr, bold, italic, blockquote
- Add prettier
- Try out mentions:
  - Mentions are not interactive (clickable, tooltip, etc).
    https://github.com/ueberdosis/tiptap/discussions/851#discussioncomment-95118
    recommends to build custom node
  - tiptap renders Mentions as `<span>` elements
