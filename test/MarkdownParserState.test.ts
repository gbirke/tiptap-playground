import { describe, expect, test } from "vitest";
import type { JSONContent } from "@tiptap/core";
import { MarkdownParseState } from "../src/MarkdownParserState";

describe("MarkdownParseState", () => {
  const getDocument = (state: MarkdownParseState): JSONContent => {
    let doc: JSONContent;
    do {
      doc = state.closeNode();
    } while (state.stack.length);
    return doc;
  };

  test("empty state returns doc with no content", () => {
    const state = new MarkdownParseState({});

    expect(getDocument(state)).toEqual({ type: "doc", content: [] });
  });

  test("adding a node appends to document", () => {
    const state = new MarkdownParseState({});

    state.addNode("paragraph");

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [{ type: "paragraph" }],
    });
  });

  test("adding multiple node appends them to document", () => {
    const state = new MarkdownParseState({});

    state.addNode("paragraph");
    state.addNode("paragraph");

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [{ type: "paragraph" }, { type: "paragraph" }],
    });
  });

  test("opening and closing nodes nests them", () => {
    const state = new MarkdownParseState({});

    state.openNode("bulletList");
    state.openNode("listItem");
    state.openNode("paragraph");
    state.closeNode(); // paragraph
    state.closeNode(); // listItem
    state.closeNode(); // bulletList
    state.openNode("paragraph");

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [{ type: "listItem", content: [{ type: "paragraph" }] }],
        },
        { type: "paragraph" },
      ],
    });
  });

  test("adding text adds it to last opened node", () => {
    const state = new MarkdownParseState({});

    state.openNode("paragraph");
    state.addText("first para");
    state.closeNode();
    state.openNode("paragraph");
    state.addText("second para");

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [
        { type: "paragraph", content: [{ type: "text", text: "first para" }] },
        { type: "paragraph", content: [{ type: "text", text: "second para" }] },
      ],
    });
  });
});
