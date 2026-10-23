import test from "node:test";
import assert from "node:assert/strict";
import { validateFlowProject } from "../src/project-data.mjs";
test("malformed nodes and edges are rejected before replacing the current flow", () => {
  for (const content of [
    { nodes: [null], edges: [] },
    {
      nodes: [
        { id: "a", position: { x: 1, y: 2 }, data: { label: { bad: true } } },
      ],
      edges: [],
    },
    {
      nodes: [
        { id: "a", position: { x: Infinity, y: 2 }, data: { label: "ok" } },
      ],
      edges: [],
    },
    { nodes: [], edges: [{ id: "e", source: "a", target: "b" }] },
  ])
    assert.throws(() => validateFlowProject(content), /Invalid flow/);
});
test("valid flow preserves node positions and connections", () => {
  const flow = {
    nodes: [
      { id: "a", position: { x: 1, y: 2 }, data: { label: "Page" } },
      { id: "b", position: { x: 3, y: 4 }, data: { label: "CRM" } },
    ],
    edges: [{ id: "e", source: "a", target: "b" }],
  };
  assert.deepEqual(validateFlowProject(flow), flow);
});
