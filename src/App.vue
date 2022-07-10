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
import Mention from "@tiptap/extension-mention";

import suggestion from "./suggestion";

const props = defineProps({
  defaultEditorContent: {
    type: String,
    default:
      '<p>Hello World!</p><ul><li>First list item</li><li>Other item with <em>emphasis</em></li></ul><h1>A heading</h1><h2>A subheading</h2><blockquote>To err is human</blockquote><hr><p>Mentioning <span data-type="mention" class="mention" data-id="Cindy Lauper" contenteditable="false">@Cindy Lauper</span>, among others</p>',
  },
});

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
    Mention.configure({
      HTMLAttributes: {
        class: "mention",
        // TODO how to make it clickable? https://github.com/ueberdosis/tiptap/discussions/851#discussioncomment-95118 suggests you can't use the mention plugin
      },
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion,
    }),
  ],
  content: props.defaultEditorContent,
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

.mention {
  border: 1px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  box-decoration-break: clone;
}
</style>
