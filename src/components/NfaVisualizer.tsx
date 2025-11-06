import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getDagreLayout } from "./DagreLayout";

import { useMemo } from "react";
type Transition = {
  from: string;
  to: string;
  symbol: string;
};

type NfaData = {
  states: string[];
  start: string;
  accept: string;
  transitions: Transition[];
};

type NfaVisualizerProps = {
  nfa: NfaData;
};

export default function NfaVisualizer({ nfa }: NfaVisualizerProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = nfa.states.map((state, index) => ({
      id: state,
      position: { x: index * 150, y: (index % 2) * 130 },
      data: { label: state },
      style: {
        padding: 10,
        borderRadius: "50%",
        border:
          state === nfa.start
            ? "2px solid green"
            : state === nfa.accept
            ? "4px double black"
            : "1px solid gray",
        background: state === nfa.start ? "#dcfce7" : "#f3f4f6",
        width: 50,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      },
    }));

    const edges: Edge[] = nfa.transitions.map((t, i) => ({
      id: `e${i}`,
      source: t.from,
      target: t.to,
      label: t.symbol,
      animated: true,
      type: "smart",
      style: { strokeWidth: 2 },
      markerEnd: {
        type: "arrowclosed",
      },
      labelStyle: { fontSize: 12, fill: "#374151" },
    }));

    const positionedNodes = getDagreLayout(nodes, edges);

    return { nodes: positionedNodes, edges };
  }, [nfa]);

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
