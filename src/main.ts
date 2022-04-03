import "./style.css";

import { Editor } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Gapcursor from "@tiptap/extension-gapcursor";
import Heading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

const editor = new Editor({
  element: document.getElementById("myEditor")!,
  extensions: [
    Blockquote,
    Bold,
    BulletList,
    Document,
    Gapcursor,
    Heading,
    History,
    HorizontalRule,
    Italic,
    ListItem,
    OrderedList,
    Paragraph,
    Text,
  ],
  content:
    "<p>Hello World!</p><ul><li>First list item</li><li>Other item with <em>emphasis</em></li></ul><h1>A heading</h1><h2>A subheading</h2><blockquote>To err is human</blockquote><hr>",
});

document
  .getElementById("getEditorJson")
  ?.addEventListener("click", function () {
    document.getElementById("editorJsonDisplay")!.textContent = JSON.stringify(
      editor.getJSON(),
      null,
      2
    );
  });
