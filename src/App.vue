<template>
  <div class="app">
    <div class="container">
      <div>
        <editor-content :editor="editor" />
        <button @click="updateDebugContent">Show JSON</button>
      </div>
      <div>
        <pre>{{ debugContent }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";

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

const editor = useEditor({
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

const debugContent = ref("");

function updateDebugContent() {
  debugContent.value = JSON.stringify(editor.value.getJSON(), null, 2);
}
</script>

<style>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.container {
  display: flex;
}

.container > div {
  flex: 1 1 auto;
  border: dotted 1px lightgrey;
  gap: 20px;
  padding: 10px;
  margin: 10px;
}

.container pre {
  background: lightgrey;
  padding: 5px;
}
</style>
