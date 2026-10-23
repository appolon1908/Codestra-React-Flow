const id = (value) =>
  typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(value);
export function validateFlowProject(value) {
  const fail = () => {
    throw Error("Invalid flow content. The current draft was preserved.");
  };
  if (
    !value ||
    !Array.isArray(value.nodes) ||
    !Array.isArray(value.edges) ||
    value.nodes.length > 2000 ||
    value.edges.length > 4000
  )
    return fail();
  const ids = new Set();
  const nodes = value.nodes.map((node) => {
    if (
      !node ||
      !id(node.id) ||
      ids.has(node.id) ||
      !node.position ||
      !Number.isFinite(node.position.x) ||
      !Number.isFinite(node.position.y) ||
      typeof node.data?.label !== "string" ||
      node.data.label.length > 10000
    )
      return fail();
    ids.add(node.id);
    return {
      id: node.id,
      position: { x: node.position.x, y: node.position.y },
      data: { label: node.data.label },
    };
  });
  const edgeIds = new Set();
  const edges = value.edges.map((edge) => {
    if (
      !edge ||
      !id(edge.id) ||
      edgeIds.has(edge.id) ||
      !ids.has(edge.source) ||
      !ids.has(edge.target)
    )
      return fail();
    edgeIds.add(edge.id);
    return { id: edge.id, source: edge.source, target: edge.target };
  });
  return { nodes, edges };
}
