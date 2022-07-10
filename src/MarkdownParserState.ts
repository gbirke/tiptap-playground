import type { JSONContent } from "@tiptap/core";
import type Token from "markdown-it/lib/token";

// To pacify ESLint, in tiptap attrs are defined as "any"
type JSONAttr = string | number | null;

const createNode = (
  type?: string,
  attrs?: Record<string, JSONAttr>,
  content?: JSONContent[]
): JSONContent => {
  if (!type) {
    throw new Error("Type must not be empty");
  }
  const node: JSONContent = { type };
  if (attrs) {
    node.attrs = attrs;
  }
  if (content) {
    node.content = content;
  }
  return node;
};

export class MarkdownParseState {
  stack: JSONContent[];

  constructor(
    // TODO use markdown-it token definition
    readonly tokenHandlers: {
      [token: string]: (
        stat: MarkdownParseState,
        token: Token,
        tokens: Token[],
        i: number
      ) => void;
    }
  ) {
    this.stack = [{ type: "doc", content: [] }];
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  push(elt: JSONContent) {
    if (this.stack.length) {
      const top = this.top();
      if (!top.content) {
        top.content = [];
      }
      top.content.push(elt);
    }
  }

  // Adds the given text to the current position in the document,
  // using the current marks as styling.
  addText(text: string) {
    if (!text) return;
    const top = this.top();

    if (!top.content) {
      top.content = [];
    }
    // TODO merge text nodes with the same marks
    const textNode = {
      type: "text",
      text,
      marks: top.marks,
    };
    top.content.push(textNode);
  }

  // Add a node at the current position.
  addNode(
    type?: string,
    attrs?: Record<string, JSONAttr>,
    content?: JSONContent[]
  ): JSONContent {
    const node = createNode(type, attrs, content);
    this.push(node);
    return node;
  }

  // Wrap subsequent content in a node of the given type.
  openNode(type?: string, attrs?: Record<string, JSONAttr>) {
    this.stack.push(createNode(type, attrs));
  }

  // Close and return the node that is currently on top of the stack.
  closeNode() {
    const info = this.stack.pop();
    if (info === undefined) {
      throw Error(
        "You must not call closeNode when stack is empty. Please check your logic."
      );
    }
    return this.addNode(info.type, info.attrs, info.content);
  }
}
