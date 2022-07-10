import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import App from "../src/App.vue";

test("mount component", async () => {
  expect(App).toBeTruthy();

  const wrapper = mount(App, {
    props: {
      defaultEditorContent: "<p>Hello</p>",
    },
  });

  const debugOutput = wrapper.find("pre");

  expect(debugOutput.text()).toBe("");

  await wrapper.find("button").trigger("click");

  const jsonContent = JSON.parse(debugOutput.text());

  expect(jsonContent).toEqual({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Hello",
          },
        ],
      },
    ],
  });
});
