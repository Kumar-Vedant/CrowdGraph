import React, { useRef, useEffect, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { dummyNodes, dummyEdges } from "../../services/data";

const KnowledgeGraph: React.FC = () => {
  const fgRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const NODE_COLOR = "#00b0c8";
  const NODE_SIZE = 2;
  const LINK_COLOR = "rgba(255,255,255,0.25)";
  const LINK_WIDTH = 1;
  const LINK_DISTANCE = 50;

  // Build data
  const graphData = useMemo(
    () => ({
      nodes: dummyNodes.map((node) => ({
        id: node.id,
        label: node.name || "Unnamed",
        group: node.labels[0],
        details: node.properties,
        color: NODE_COLOR,
      })),
      links: dummyEdges.map((edge) => ({
        id: edge.id || `${edge.sourceId}->${edge.targetId}`,
        source: edge.sourceId,
        target: edge.targetId,
        label: edge.type,
        details: edge.properties,
        color: LINK_COLOR,
        width: LINK_WIDTH,
      })),
    }),
    []
  );

  // Initialize forces
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.d3Force("link")?.distance(LINK_DISTANCE);
        fgRef.current.d3Force("charge")?.strength(-150);
        fgRef.current.zoomToFit(400, 50);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Tooltip follows mouse
  useEffect(() => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    const move = (e: MouseEvent) => {
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY + 10}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Show info box (no React state)
  const showInfo = (title: string, type: string, id: string, details: any[]) => {
    const info = infoRef.current;
    if (!info) return;

    const html = `
      <div style="font-weight:600;font-size:1rem;margin-bottom:4px;">${title}</div>
      <div style="color:#94a3b8;font-size:0.85rem;margin-bottom:4px;">Type: ${type}</div>
      <div style="color:#94a3b8;font-size:0.8rem;margin-bottom:6px;">ID: <span style="color:#e2e8f0;">${id}</span></div>
      <hr style="border-color:#334155;margin:6px 0;" />
      ${details
        .map(
          (p) =>
            `<div style="margin-bottom:4px;"><strong>${p.key}:</strong> <span style="color:#cbd5e1;">${p.value}</span></div>`
        )
        .join("")}
      <button id="closeInfoBtn" style="margin-top:8px;background:#1e293b;border:none;color:#e2e8f0;border-radius:6px;padding:6px 10px;cursor:pointer;width:100%;">Close</button>
    `;

    info.innerHTML = html;
    info.style.opacity = "1";
    info.style.pointerEvents = "auto";

    // Close button handler
    const closeBtn = document.getElementById("closeInfoBtn");
    if (closeBtn) {
      closeBtn.onclick = () => {
        info.style.opacity = "0";
        info.style.pointerEvents = "none";
      };
    }
  };

  // Memoized graph (static render)
  const graph = useMemo(
    () => (
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#020c0f"
        linkColor={() => LINK_COLOR}
        linkWidth={() => LINK_WIDTH}
        nodeRelSize={NODE_SIZE}
        enableNodeDrag={true} // ✅ Nodes now movable
        cooldownTicks={0}
        nodeLabel={() => ""}
        onNodeHover={(node) => {
          const tooltip = tooltipRef.current;
          if (tooltip) {
            tooltip.style.opacity = node ? "1" : "0";
            tooltip.innerHTML = node?.label || "";
          }
        }}
        onLinkHover={(link) => {
          const tooltip = tooltipRef.current;
          if (tooltip) {
            tooltip.style.opacity = link ? "1" : "0";
            tooltip.innerHTML = link?.label || "";
          }
        }}
        onNodeClick={(node) =>
          showInfo(node.label, node.group, node.id || '', node.details)
        }
        onLinkClick={(link) =>
          showInfo(link.label, "Edge", link.id || '', link.details)
        }
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          if (!node || typeof node.x !== "number" || typeof node.y !== "number")
            return;
          const radius = NODE_SIZE;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = NODE_COLOR;
          ctx.fill();

          const fontSize = 10 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#E2E8F0";
          ctx.fillText(node.label, node.x + radius + 4, node.y);
        }}
      />
    ),
    [graphData]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#020c0f",
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          opacity: 0,
          pointerEvents: "none",
          background: "rgba(15,23,42,0.9)",
          color: "#E2E8F0",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "0.8rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          transition: "opacity 0.1s ease",
          zIndex: 100,
        }}
      />

      {/* Info Box */}
      <div
        ref={infoRef}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "rgba(30,41,59,0.95)",
          color: "#E2E8F0",
          padding: "14px",
          borderRadius: "10px",
          minWidth: "220px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
          transition: "opacity 0.2s ease",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {graph}
    </div>
  );
};

export default KnowledgeGraph;




