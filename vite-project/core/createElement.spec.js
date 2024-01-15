import { describe, expect, it } from "vitest";
import React from "./React";

describe("createElement", () => {
  it("createElement render props is null", () => {
    const vNode = React.createElement("div", null, "hello world");
    expect(vNode).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello world",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `);
  });
  it("createElement render with props", () => {
    const vNode = React.createElement("div", {id: '11', class: 'class'}, "hello world");
    expect(vNode).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello world",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "class": "class",
          "id": "11",
        },
        "type": "div",
      }
    `);
  });
});
