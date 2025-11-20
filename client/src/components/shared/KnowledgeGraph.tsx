import React, { useRef, useEffect, useMemo, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { dummyNodes, dummyEdges } from "../../services/data";
import { useTheme } from "@/context/ThemeContext";

const KnowledgeGraph: React.FC<{ onExpand?: () => void; isExpanded?: boolean }> = ({ 
  onExpand, 
  isExpanded = false 
}) => {
  const fgRef = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const { theme } = useTheme();

  // Responsive sizing: adapt based on container size
  const isSmall = dimensions.width < 500;
  
  // Get theme-based colors
  const NODE_COLOR = theme.colors.primary;
  const NODE_SIZE = isSmall ? 6 : 10;
  const LINK_COLOR = theme.colors.border;
  const LINK_WIDTH = isSmall ? 1 : 2;
  const LINK_DISTANCE = isSmall ? 100 : 150;
  const TEXT_COLOR = theme.colors.text;
  const BACKGROUND_COLOR = theme.colors.background;
  const LABEL_FONT_SIZE = isSmall ? 8 : 11;
  const EDGE_LABEL_FONT_SIZE = isSmall ? 6 : 9;

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
    [NODE_COLOR, LINK_COLOR, LINK_WIDTH]
  );

  // Track container dimensions
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Initialize forces and center graph
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fgRef.current) {
        fgRef.current.d3Force("link")?.distance(LINK_DISTANCE);
        fgRef.current.d3Force("charge")?.strength(isSmall ? -80 : -150);
        fgRef.current.zoomToFit(isSmall ? 300 : 400, isSmall ? -50 : -100);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [dimensions, LINK_DISTANCE, isSmall]);

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

  // Close info box
  const closeInfo = () => {
    const info = infoRef.current;
    if (info) {
      info.style.opacity = "0";
      info.style.pointerEvents = "none";
    }
  };

  // Show info box (no React state)
  const showInfo = (
    title: string,
    type: string,
    id: string,
    details: any[]
  ) => {
    const info = infoRef.current;
    if (!info) return;

    const html = `
      <div style="font-weight:700;font-size:1.1rem;margin-bottom:8px;color:${
        theme.colors.primary
      };">${title}</div>
      <div style="color:${
        theme.colors.textSecondary
      };font-size:0.85rem;margin-bottom:4px;"><span style="font-weight:600;">Type:</span> ${type}</div>
      <div style="color:${
        theme.colors.textSecondary
      };font-size:0.8rem;margin-bottom:8px;"><span style="font-weight:600;">ID:</span> <span style="color:${
      theme.colors.text
    };font-family:monospace;">${id}</span></div>
      <hr style="border:none;border-top:1px solid ${
        theme.colors.border
      };margin:8px 0;" />
      ${
        details && details.length > 0
          ? details
              .map(
                (p) =>
                  `<div style="margin-bottom:6px;padding:4px 0;"><strong style="color:${theme.colors.text};">${p.key}:</strong> <span style="color:${theme.colors.textSecondary};margin-left:4px;">${p.value}</span></div>`
              )
              .join("")
          : `<div style="color:${theme.colors.textSecondary};font-style:italic;margin:8px 0;">No properties</div>`
      }
      <button id="closeInfoBtn" style="margin-top:12px;background:${
        theme.colors.primary
      };border:none;color:${
      theme.colors.background
    };border-radius:8px;padding:8px 12px;cursor:pointer;width:100%;font-weight:600;font-size:0.875rem;transition:all 0.2s;">Close</button>
    `;

    info.innerHTML = html;
    info.style.opacity = "1";
    info.style.pointerEvents = "auto";

    // Close button handler - use setTimeout to ensure DOM is updated
    setTimeout(() => {
      const closeBtn = info.querySelector("#closeInfoBtn");
      if (closeBtn) {
        closeBtn.addEventListener("mouseover", () => {
          (closeBtn as HTMLElement).style.background =
            theme.colors.primaryLight || theme.colors.primary;
        });
        closeBtn.addEventListener("mouseout", () => {
          (closeBtn as HTMLElement).style.background = theme.colors.primary;
        });
        closeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeInfo();
        });
      }
    }, 0);
  };

  // Memoized graph (static render)
  const graph = useMemo(
    () => (
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor={BACKGROUND_COLOR}
        linkColor={() => LINK_COLOR}
        linkWidth={() => LINK_WIDTH}
        nodeRelSize={NODE_SIZE}
        enableNodeDrag={true}
        cooldownTicks={0}
        nodeLabel={() => ""}
        nodePointerAreaPaint={(node: any, color, ctx, globalScale) => {
          const radius = NODE_SIZE / globalScale;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        onNodeClick={(node) =>
          showInfo(node.label, node.group, node.id || "", node.details)
        }
        onLinkClick={(link) =>
          showInfo(link.label, "Edge", link.id || "", link.details)
        }
        onNodeHover={(node) => {
          if (node) {
            tooltipRef.current?.setAttribute("data-visible", "true");
          } else {
            tooltipRef.current?.removeAttribute("data-visible");
          }
        }}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          if (!node || typeof node.x !== "number" || typeof node.y !== "number")
            return;
          
          const radius = NODE_SIZE / globalScale;
          
          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          ctx.fillStyle = NODE_COLOR;
          ctx.fill();
          
          // Draw subtle glow effect
          ctx.strokeStyle = `${NODE_COLOR}44`;
          ctx.lineWidth = 0.5 / globalScale;
          ctx.stroke();

          // Draw label - only on large view or if zoomed in
          if (!isSmall || isZoomedIn) {
            const fontSize = LABEL_FONT_SIZE / globalScale;
            ctx.font = `bold ${fontSize}px Sans-Serif`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillStyle = TEXT_COLOR;
            
            // Truncate label if too long for small view
            let displayLabel = node.label;
            if (isSmall && node.label.length > 10) {
              displayLabel = node.label.substring(0, 8) + "...";
            }
            
            ctx.fillText(
              displayLabel,
              node.x + radius + 0.5,
              node.y + radius + 0.5
            );
          }
        }}
        linkCanvasObject={(link: any, ctx, globalScale) => {
          if (!link.source || !link.target) return;
          const { x: x1, y: y1 } = link.source;
          const { x: x2, y: y2 } = link.target;

          ctx.strokeStyle = LINK_COLOR;
          ctx.lineWidth = LINK_WIDTH / globalScale;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Draw edge label only on expanded view or if focused
          if (isExpanded || isZoomedIn) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const fontSize = EDGE_LABEL_FONT_SIZE / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = TEXT_COLOR;
            ctx.fillText(link.label, midX, midY);
          }
        }}
      />
    ),
    [graphData, dimensions, NODE_COLOR, LINK_COLOR, TEXT_COLOR, isSmall, isZoomedIn, isExpanded, LABEL_FONT_SIZE, EDGE_LABEL_FONT_SIZE]
  );

  // Center and zoom toggle
  const handleCenterGraph = () => {
    if (!fgRef.current) return;

    if (isZoomedIn) {
      // Zoom out - fit entire graph
      fgRef.current.zoomToFit(isSmall ? 300 : 400, isSmall ? -50 : -100);
      setIsZoomedIn(false);
    } else {
      // Zoom in to center
      fgRef.current.centerAt(0, 0, 300);
      fgRef.current.zoom(isSmall ? 12 : 16, 300);
      setIsZoomedIn(true);
    }
  };

  const handleResetView = () => {
    if (!fgRef.current) return;
    setIsZoomedIn(false);
    fgRef.current.zoomToFit(isSmall ? 300 : 400, isSmall ? -50 : -100);
  };

  // Responsive button sizing
  const buttonSize = isSmall ? "40px" : "48px";
  const buttonFontSize = isSmall ? "0.9rem" : "1.2rem";

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: BACKGROUND_COLOR,
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          opacity: 0,
          pointerEvents: "none",
          background: `${theme.colors.primary}dd`,
          color: "#fff",
          padding: isSmall ? "6px 10px" : "8px 12px",
          borderRadius: "8px",
          fontSize: isSmall ? "0.75rem" : "0.875rem",
          fontWeight: "600",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          transition: "opacity 0.15s ease",
          zIndex: 100,
          maxWidth: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      />

      {/* Info Box - Responsive positioning */}
      <div
        ref={infoRef}
        style={{
          position: "absolute",
          top: isSmall ? 8 : 16,
          right: isSmall ? 8 : 16,
          background: `${theme.colors.cardBg}f0`,
          backdropFilter: "blur(10px)",
          color: theme.colors.text,
          padding: isSmall ? "12px" : "16px",
          borderRadius: "12px",
          minWidth: isSmall ? "200px" : "240px",
          maxWidth: isSmall ? "250px" : "320px",
          maxHeight: isSmall ? "300px" : "400px",
          overflowY: "auto",
          border: `1px solid ${theme.colors.border}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          transition: "opacity 0.25s ease",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 50,
          fontSize: isSmall ? "0.75rem" : "0.875rem",
        }}
      />

      {/* Graph Container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {graph}
      </div>

      {/* Control Bar - Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: isSmall ? 12 : 20,
          left: isSmall ? 12 : 20,
          display: "flex",
          gap: isSmall ? 8 : 12,
          zIndex: 50,
          flexWrap: "wrap",
        }}
      >
        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          style={{
            background: theme.colors.primary,
            color: theme.colors.background,
            border: "none",
            borderRadius: "50%",
            width: buttonSize,
            height: buttonSize,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: buttonFontSize,
            fontWeight: "bold",
            transition: "all 0.2s ease",
            padding: 0,
            minWidth: buttonSize,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              theme.colors.primaryLight || theme.colors.primary;
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.colors.primary;
            e.currentTarget.style.transform = "scale(1)";
          }}
          title="Reset view"
        >
          ↺
        </button>

        {/* Zoom Toggle Button */}
        <button
          onClick={handleCenterGraph}
          style={{
            background: theme.colors.primary,
            color: theme.colors.background,
            border: "none",
            borderRadius: "50%",
            width: buttonSize,
            height: buttonSize,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: buttonFontSize,
            fontWeight: "bold",
            transition: "all 0.2s ease",
            padding: 0,
            minWidth: buttonSize,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              theme.colors.primaryLight || theme.colors.primary;
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.colors.primary;
            e.currentTarget.style.transform = "scale(1)";
          }}
          title={isZoomedIn ? "Zoom Out" : "Zoom In at Center"}
        >
          {isZoomedIn ? "−" : "+"}
        </button>
      </div>

      {/* Expand Button - Bottom Right */}
      {onExpand && !isExpanded && (
        <button
          onClick={onExpand}
          style={{
            position: "absolute",
            bottom: isSmall ? 12 : 20,
            right: isSmall ? 12 : 20,
            background: theme.colors.primary,
            color: theme.colors.background,
            border: "none",
            borderRadius: "50%",
            width: buttonSize,
            height: buttonSize,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: buttonFontSize,
            fontWeight: "bold",
            transition: "all 0.2s ease",
            padding: 0,
            minWidth: buttonSize,
            zIndex: 50,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              theme.colors.primaryLight || theme.colors.primary;
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.colors.primary;
            e.currentTarget.style.transform = "scale(1)";
          }}
          title="Expand Knowledge Graph"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isSmall ? "18px" : "24px"}
            height={isSmall ? "18px" : "24px"}
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M224,48V96a8,8,0,0,1-16,0V67.31l-42.34,42.35a8,8,0,0,1-11.32-11.32L196.69,56H168a8,8,0,0,1,0-16h48A8,8,0,0,1,224,48ZM98.34,145.66,56,188v-28a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16H68L109.66,157.66a8,8,0,0,0-11.32-11.32Z"></path>
          </svg>
        </button>
      )}

      {/* Info Indicator for small view */}
      {isSmall && !isExpanded && (
        <div
          style={{
            position: "absolute",
            top: isSmall ? 8 : 12,
            left: isSmall ? 8 : 12,
            background: `${theme.colors.primary}22`,
            color: theme.colors.primary,
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "0.7rem",
            fontWeight: "600",
            pointerEvents: "none",
            zIndex: 30,
            border: `1px solid ${theme.colors.primary}44`,
          }}
        >
          Click nodes to explore
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;
