import type { JSONContent } from "@tiptap/core";
import type Token from "markdown-it/lib/token";
import isEqual from "fast-deep-equal";

// Re-definitions of parts of JSONContent
/* eslint-disable  @typescript-eslint/no-explicit-any */
type JSONAttr = Record<string, any>;
type JSONMark = {
  type: string;
  attrs?: Record<string, any>;
  [key: string]: any;
};
/* eslint-enable  @typescript-eslint/no-explicit-any */

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
    // merge text with same marks
    const lastNode = top.content[top.content.length - 1];
    if (
      lastNode &&
      lastNode.type === "text" &&
      isEqual(lastNode.marks, top.marks)
    ) {
      lastNode.text += text;
      return;
    }
    const textNode = {
      type: "text",
      text,
      marks: top.marks ? [...top.marks] : undefined,
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

  openMark(mark: JSONMark) {
    const top = this.top();
    const marks: JSONMark[] = top.marks || [];
    for (let i = 0; i < marks.length; i++) {
      if (isEqual(mark, marks[i])) {
        return;
      }
    }
    top.marks = [...marks, mark];
  }

  // Removes the given mark from the set of active marks.
  closeMark(mark: JSONMark) {
    const top = this.top();
    const marks: JSONMark[] = top.marks || [];
    for (let i = 0; i < marks.length; i++) {
      if (isEqual(mark, marks[i])) {
        marks.splice(i, 1);
        top.marks = [...marks];
        return;
      }
    }
  }
}
