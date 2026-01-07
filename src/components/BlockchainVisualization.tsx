import { useEffect, useMemo } from 'react';
import ReactFlow, {
    type Node,
    type Edge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { BlockData } from '../types/blockchain';
import BlockNode from './BlockNode';
import { Network } from 'lucide-react';

interface BlockchainVisualizationProps {
    blocks: BlockData[];
}

const nodeTypes = {
    blockNode: BlockNode,
};

export default function BlockchainVisualization({ blocks }: BlockchainVisualizationProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Convert blocks to React Flow nodes and edges
    useEffect(() => {
        if (blocks.length === 0) return;

        const newNodes: Node[] = blocks.map((block, index) => ({
            id: `block-${block.index}`,
            type: 'blockNode',
            position: { x: index * 350, y: 100 },
            data: block,
        }));

        const newEdges: Edge[] = blocks.slice(1).map((block) => ({
            id: `edge-${block.index}`,
            source: `block-${block.index - 1}`,
            target: `block-${block.index}`,
            animated: block.status === 'mining',
            style: {
                stroke: block.status === 'invalid' ? '#ef4444' : '#0ea5e9',
                strokeWidth: 2,
            },
            label: 'hash link',
            labelStyle: { fill: '#94a3b8', fontSize: 10 },
        }));

        setNodes(newNodes);
        setEdges(newEdges);
    }, [blocks, setNodes, setEdges]);

    const proOptions = useMemo(() => ({ hideAttribution: true }), []);

    return (
        <div className="flex flex-col h-full bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-blockchain-400" />
                    <h2 className="text-sm font-semibold text-white">Blockchain Visualization</h2>
                </div>
                <div className="text-xs text-slate-400">
                    {blocks.length} block{blocks.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* React Flow Canvas */}
            <div className="flex-1">
                {blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <div className="text-center">
                            <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No blocks yet</p>
                            <p className="text-sm mt-2">Run your code to create blockchain blocks</p>
                        </div>
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        proOptions={proOptions}
                        fitView
                        minZoom={0.5}
                        maxZoom={1.5}
                    >
                        <Background color="#334155" gap={16} />
                        <Controls className="bg-slate-800 border-slate-700" />
                        <MiniMap
                            className="bg-slate-800 border-slate-700"
                            nodeColor={(node) => {
                                const block = node.data as BlockData;
                                switch (block.status) {
                                    case 'mining':
                                        return '#eab308';
                                    case 'invalid':
                                        return '#ef4444';
                                    default:
                                        return '#0ea5e9';
                                }
                            }}
                        />
                    </ReactFlow>
                )}
            </div>
        </div>
    );
}
