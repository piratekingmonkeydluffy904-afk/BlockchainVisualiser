import { Terminal, Trash2 } from 'lucide-react';
import type { ConsoleMessage } from '../types/blockchain';
import { useEffect, useRef } from 'react';

interface ConsolePanelProps {
    messages: ConsoleMessage[];
    onClear: () => void;
}

export default function ConsolePanel({ messages, onClear }: ConsolePanelProps) {
    const consoleEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-green-400" />
                    <h2 className="text-sm font-semibold text-white">Console Output</h2>
                </div>
                <button
                    onClick={onClear}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear
                </button>
            </div>

            {/* Console Messages */}
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {messages.length === 0 ? (
                    <div className="text-slate-500 italic">
                        Click "Run Code" to execute your Python code...
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`mb-1 ${msg.type === 'error'
                                ? 'text-red-400'
                                : msg.type === 'info'
                                    ? 'text-blue-400'
                                    : 'text-green-300'
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))
                )}
                <div ref={consoleEndRef} />
            </div>
        </div>
    );
}
