import './style.css'

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

new Editor({
  element: document.getElementById('myEditor')!,
  extensions: [
    StarterKit,
  ],
  content: '<p>Hello World!</p><ul><li>First list item</li><li>Other item with <em>emphasis</em><li></ul><h1>A heading</h1><h2>A subheading</h2>',
})
