<template>
  <div class="app">
    <div class="container">
      <div>
        <section>
          <h2>Editor</h2>
          <editor-content :editor="editor" />
          <button id="showMarkdown" @click="updateMarkdownContent">
            Show Markdown
          </button>
          <button id="showJson" @click="updateDebugContent">Show JSON</button>
        </section>
        <section>
          <h2>Input Markup</h2>
          <div>
            <textarea class="raw-text-input" v-model="markupInput"></textarea>
          </div>
          <button @click="setSampleMarkdown">
            Insert sample markdown in text field
          </button>
          <button @click="insertMarkdown">Insert markup in editor</button>
        </section>
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

import { defaultMarkdownSerializer } from "prosemirror-markdown";

import { customMarkdownParser } from "./markdownparser";
import { configureExtensions } from "./extensions";

import suggestion from "./suggestion";

const props = defineProps({
  defaultEditorContent: {
    type: String,
    default:
      '<p>Hello World!</p><ul><li>First list item</li><li>Other item with <em>emphasis</em></li></ul><h1>A heading</h1><h2>A subheading</h2><blockquote>To err is human</blockquote><hr><p>Mentioning <span data-type="mention" class="mention" data-id="Cindy Lauper" contenteditable="false">@Cindy Lauper</span>, among others</p>',
  },
});

const editor = useEditor({
  extensions: configureExtensions({
    mention: {
      HTMLAttributes: {
        class: "mention",
        // TODO how to make it clickable? https://github.com/ueberdosis/tiptap/discussions/851#discussioncomment-95118 suggests you can't use the mention plugin
      },
      renderLabel({ options, node }) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion,
    },
  }),
  content: props.defaultEditorContent,
});

const debugContent = ref("");
const markupInput = ref("");

function updateDebugContent() {
  debugContent.value = JSON.stringify(editor.value.getJSON(), null, 2);
}

function updateMarkdownContent() {
  debugContent.value = defaultMarkdownSerializer.serialize(
    editor.value.view.state.doc
  );
}

function setSampleMarkdown() {
  markupInput.value = `# A Heading

A paragraph with **bold** and italic text

Another paragraph`;
}

function insertMarkdown() {
  const newContent = customMarkdownParser.parse(markupInput.value);
  console.log("generated input", newContent);
  debugContent.value = JSON.stringify(newContent, null, 2);
  editor.value.commands.setContent({
    type: "doc",
    content: [newContent.content],
  });
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

.raw-text-input {
  width: 500px;
  height: 10em;
}
</style>
