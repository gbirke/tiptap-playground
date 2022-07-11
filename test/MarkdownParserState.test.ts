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
    state.closeNode();

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

  test("adding a mark to one node", () => {
    const state = new MarkdownParseState({});

    state.openNode("paragraph");
    state.openMark({ type: "italic" });
    state.addText("first para");
    state.closeMark({ type: "italic" });
    state.closeNode();

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "first para", marks: [{ type: "italic" }] },
          ],
        },
      ],
    });
  });

  test("adding differently marked texts", () => {
    const state = new MarkdownParseState({});

    state.openNode("paragraph");
    state.openMark({ type: "italic" });
    state.addText("first para");
    state.openMark({ type: "bold" });
    state.addText("second para");
    state.closeMark({ type: "bold" });
    state.addText("third para");
    state.closeMark({ type: "italic" });
    state.addText("fourth para");
    state.closeNode();

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "first para", marks: [{ type: "italic" }] },
            {
              type: "text",
              text: "second para",
              marks: [{ type: "italic" }, { type: "bold" }],
            },
            { type: "text", text: "third para", marks: [{ type: "italic" }] },
            { type: "text", text: "fourth para", marks: [] },
          ],
        },
      ],
    });
  });

  test("marks cannot be nested", () => {
    const state = new MarkdownParseState({});

    state.openNode("paragraph");
    state.openMark({ type: "italic" });
    state.openMark({ type: "italic" });
    state.addText("first para");
    state.closeMark({ type: "italic" });
    state.addText("second para");
    state.closeNode();

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "first para", marks: [{ type: "italic" }] },
            { type: "text", text: "second para", marks: [] },
          ],
        },
      ],
    });
  });

  test("marks across nodes do not persist", () => {
    const state = new MarkdownParseState({});

    state.openNode("paragraph");
    state.openMark({ type: "italic" });
    state.closeNode();
    state.openNode("paragraph");
    state.addText("first para");
    state.closeMark({ type: "italic" });

    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [
        { type: "paragraph" },
        {
          type: "paragraph",
          content: [{ type: "text", text: "first para" }],
        },
      ],
    });
  });

  test("text with same marks is merged", () => {
    const state = new MarkdownParseState({});

    state.openNode("paragraph");
    state.addText("first para. ");
    state.addText("second para");
    state.openMark({ type: "italic" });
    state.addText("third para. ");
    state.addText("fourth para");
    state.closeMark({ type: "italic" });
    state.addText("fifth para");
    expect(getDocument(state)).toEqual({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            // marks look a bit weird, but good enough for now
            { type: "text", text: "first para. second para", marks: undefined },
            {
              type: "text",
              text: "third para. fourth para",
              marks: [{ type: "italic" }],
            },
            { type: "text", text: "fifth para", marks: [] },
          ],
        },
      ],
    });
  });
});
