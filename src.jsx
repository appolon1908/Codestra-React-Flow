import React, { useCallback, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import ProjectBar from "./src/ProjectBar.jsx";
import Catalog from "./src/Catalog.jsx";
import "./src/styles.css";
import { validateFlowProject } from "./src/project-data.mjs";
const initialNodes = [
  { id: "1", position: { x: 0, y: 40 }, data: { label: "Landing Page" } },
  { id: "2", position: { x: 260, y: 40 }, data: { label: "Lead Form" } },
  { id: "3", position: { x: 520, y: 40 }, data: { label: "CRM Follow-up" } },
];
const initialEdges = [
  { id: "e1", source: "1", target: "2" },
  { id: "e2", source: "2", target: "3" },
];
function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [label, setLabel] = useState("New step");
  const onConnect = useCallback(
    (connection) => setEdges((list) => addEdge(connection, list)),
    [setEdges],
  );
  function write(content) {
    if (content) content = validateFlowProject(content);
    setNodes(content ? content.nodes : structuredClone(initialNodes));
    setEdges(content ? content.edges : structuredClone(initialEdges));
  }
  function addNode() {
    setNodes((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        position: { x: 100, y: 180 + list.length * 30 },
        data: { label },
      },
    ]);
  }
  return (
    <>
      <ProjectBar
        kind="react-flow"
        readContent={() => validateFlowProject({ nodes, edges })}
        writeContent={write}
      />
      <Catalog />
      <label>
        Step name{" "}
        <input
          value={label}
          maxLength={100}
          onChange={(e) => setLabel(e.target.value)}
        />
      </label>
      <button onClick={addNode} disabled={!label.trim()}>
        Add step
      </button>
      <div className="editor">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
