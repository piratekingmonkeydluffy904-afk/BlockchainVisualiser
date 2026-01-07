import { Handle, Position } from 'reactflow';
import type { BlockData } from '../types/blockchain';
import { Clock, Hash, Database, Link } from 'lucide-react';

interface BlockNodeProps {
    data: BlockData;
}

export default function BlockNode({ data }: BlockNodeProps) {
    const getStatusColor = () => {
        switch (data.status) {
            case 'mining':
                return 'border-yellow-500 bg-yellow-500/10';
            case 'mined':
                return 'border-green-500 bg-green-500/10';
            case 'invalid':
                return 'border-red-500 bg-red-500/10';
            default:
                return 'border-blockchain-500 bg-blockchain-500/10';
        }
    };

    const truncateHash = (hash: string) => {
        return hash.length > 12 ? `${hash.slice(0, 6)}...${hash.slice(-6)}` : hash;
    };

    return (
        <div className={`px-4 py-3 rounded-lg border-2 ${getStatusColor()} min-w-[280px] backdrop-blur-sm`}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-blockchain-400" />

            {/* Block Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-blockchain-400" />
                    <h3 className="text-lg font-bold text-white">Block #{data.index}</h3>
                </div>
                {data.status === 'mining' && (
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-yellow-400">Mining...</span>
                    </div>
                )}
            </div>

            {/* Block Data */}
            <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-slate-400">Timestamp</div>
                        <div className="text-white font-mono">{new Date(data.timestamp * 1000).toLocaleTimeString()}</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Database className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-slate-400">Data</div>
                        <div className="text-white break-words">{data.data}</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Link className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-slate-400">Previous Hash</div>
                        <div className="text-blockchain-300 font-mono text-xs break-all">{truncateHash(data.previous_hash)}</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Hash className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-slate-400">Hash</div>
                        <div className="text-green-300 font-mono text-xs break-all">{truncateHash(data.hash)}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Nonce</span>
                    <span className="text-white font-mono font-bold">{data.nonce.toLocaleString()}</span>
                </div>
            </div>

            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-blockchain-400" />
        </div>
    );
}
