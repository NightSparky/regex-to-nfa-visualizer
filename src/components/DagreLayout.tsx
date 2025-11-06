import dagre from "dagre";
import { type Node } from "@xyflow/react";

const nodeWidth = 50;
const nodeHeight = 50;

export function getDagreLayout(
  nodes: Node[],
  edges: any[],
  direction: "LR" | "TB" = "LR"
) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    marginx: 50,
    marginy: 50,
    nodesep: 100,
    ranksep: 150,
  });

  //REMEMBER
  //TO
  //REMOVE//
  //THIS MESS


  //WHAT MESS ARE YOU TALKING ABOUT, YESTERDAY ME?

  nodes.forEach((node) => {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const positionedNodes = nodes.map((node) => {
    const { x, y } = g.node(node.id);
    return {
      ...node,
      position: { x: x - nodeWidth / 2, y: y - nodeHeight / 2 },
    };
  });

  return positionedNodes;
}
