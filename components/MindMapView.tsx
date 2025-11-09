import React, { useState, useEffect, useRef } from 'react';
import { MindMap, MindMapNode } from '../types';
import { NodeDetailModal } from './NodeDetailModal';

// A simple layout function if coordinates are missing
const layoutNodes = (nodes: MindMapNode[]): MindMapNode[] => {
  if (nodes.every(n => n.x !== undefined && n.y !== undefined)) {
    return nodes;
  }
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

export const MindMapView: React.FC<{ mindMap: MindMap }> = ({ mindMap }) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [viewBox, setViewBox] = useState('0 0 1000 600');
  const [laidOutNodes, setLaidOutNodes] = useState<MindMapNode[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
      if(mindMap && mindMap.nodes) {
          setLaidOutNodes(layoutNodes(mindMap.nodes));
      }
  }, [mindMap]);

  const getNodeById = (id: string) => laidOutNodes.find(n => n.id === id);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current) return;
    setIsDragging(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    const [minX, minY, width, height] = viewBox.split(' ').map(parseFloat);
    const dx = startPoint.x - e.clientX;
    const dy = startPoint.y - e.clientY;
    setViewBox(`${minX + dx} ${minY + dy} ${width} ${height}`);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const [minX, minY, width, height] = viewBox.split(' ').map(parseFloat);
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const newWidth = width * scale;
    const newHeight = height * scale;
    const dx = (newWidth - width) / 2;
    const dy = (newHeight - height) / 2;
    setViewBox(`${minX - dx} ${minY - dy} ${newWidth} ${newHeight}`);
  };

  if (!mindMap || !mindMap.nodes || mindMap.nodes.length === 0) {
    return (
      <div className="flex flex-col h-full">
         <div className="p-4 border-b border-slate-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">Mind Map</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-500">
            <p>No mind map to display.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Mind Map</h2>
      </div>
      <div className="flex-1 overflow-hidden relative" onMouseUp={handleMouseUp}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={viewBox}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
          className={`cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
            </marker>
          </defs>
          
          {mindMap.edges.map((edge, i) => {
            const sourceNode = getNodeById(edge.source);
            const targetNode = getNodeById(edge.target);
            if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) return null;
            return (
              <g key={`edge-${i}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#9ca3af"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                 <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2}
                  dy="-5"
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="12"
                  paintOrder="stroke"
                  stroke="#fff"
                  strokeWidth="3px"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {laidOutNodes.map(node => (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                <rect x="-60" y="-20" width="120" height="40" rx="8" fill="white" stroke="#6366f1" strokeWidth="2" />
                <text textAnchor="middle" alignmentBaseline="middle" fill="#1e293b" fontSize="14" fontWeight="500">
                    {node.label}
                </text>
            </g>
          ))}
        </svg>
      </div>
      {selectedNode && <NodeDetailModal node={selectedNode} onClose={() => setSelectedNode(null)} />}
    </div>
  );
};
