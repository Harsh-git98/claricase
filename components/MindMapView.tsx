import React, { useState, useEffect, useRef } from "react";
import { MindMap, MindMapNode } from "../types";
import { NodeDetailModal } from "./NodeDetailModal";

//
// ---- Layout helper ----
//
const layoutNodes = (nodes: MindMapNode[]): MindMapNode[] => {
  if (nodes.every((n) => n.x !== undefined && n.y !== undefined)) return nodes;

  const count = nodes.length;
  if (count === 0) return [];

  const radius = count > 1 ? Math.min(count * 40, 400) : 0;
  const centerX = 500;
  const centerY = 300;

  return nodes.map((node, i) => {
    if (node.x !== undefined && node.y !== undefined) return node;
    const angle = (i / count) * 2 * Math.PI;
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });
};

//
// ---- Component ----
//
export const MindMapView: React.FC<{ mindMap: MindMap }> = ({ mindMap }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [laidOutNodes, setLaidOutNodes] = useState<MindMapNode[]>([]);
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    w: 1000,
    h: 600,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  //
  // ---- Prepare layout ----
  //
  useEffect(() => {
    if (mindMap?.nodes) {
      setLaidOutNodes(layoutNodes(mindMap.nodes));
    }
  }, [mindMap]);

  const getNodeById = (id: string) =>
    laidOutNodes.find((n) => n.id === id);

  //
  // ---- Drag to Pan ----
  //
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current) return; // Only drag background
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const dx = dragStart.x - e.clientX;
    const dy = dragStart.y - e.clientY;

    setViewBox((prev) => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  //
  // ---- Smooth Wheel Zoom (NON-PASSIVE) ----
  //
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();

      const rect = svg.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const svgX = viewBox.x + (cursorX / rect.width) * viewBox.w;
      const svgY = viewBox.y + (cursorY / rect.height) * viewBox.h;

      const scale = e.deltaY > 0 ? 1.1 : 0.9;

      const newW = viewBox.w * scale;
      const newH = viewBox.h * scale;

      setViewBox({
        x: svgX - (cursorX / rect.width) * newW,
        y: svgY - (cursorY / rect.height) * newH,
        w: newW,
        h: newH,
      });
    };

    svg.addEventListener("wheel", wheelHandler, { passive: false });
    return () => svg.removeEventListener("wheel", wheelHandler);
  }, [viewBox]);

  //
  // ---- Empty state ----
  //
  if (!mindMap?.nodes?.length) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Mind Map</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-500">
          No mind map to display.
        </div>
      </div>
    );
  }

  //
  // ---- Render ----
  //
  return (
    <div className="flex flex-col h-full" ref={containerRef}>
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold">Mind Map</h2>
      </div>

      <div
        className="flex-1 overflow-hidden relative"
        onMouseUp={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          className={isDragging ? "cursor-grabbing" : "cursor-grab"}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
            </marker>
          </defs>

          {/* Edges */}
          {mindMap.edges.map((edge, i) => {
            const s = getNodeById(edge.source);
            const t = getNodeById(edge.target);
            if (!s || !t || s.x == null || s.y == null || t.x == null || t.y == null)
              return null;

            return (
              <g key={i}>
                <line
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke="#9ca3af"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(s.x + t.x) / 2}
                  y={(s.y + t.y) / 2}
                  dy="-5"
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="12"
                  paintOrder="stroke"
                  stroke="#fff"
                  strokeWidth="3"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {laidOutNodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedNode(node)}
            >
              <rect
                x="-60"
                y="-20"
                width="120"
                height="40"
                rx="8"
                fill="white"
                stroke="#6366f1"
                strokeWidth="2"
              />
              <text
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="#1e293b"
                fontSize="14"
                fontWeight="500"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Modal */}
      {selectedNode && (
        <NodeDetailModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};
