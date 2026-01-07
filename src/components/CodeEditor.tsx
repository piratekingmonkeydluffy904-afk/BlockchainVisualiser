import Editor from '@monaco-editor/react';
import { Play, FileCode } from 'lucide-react';

interface CodeEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    onRun: () => void;
    isRunning: boolean;
}

const DEFAULT_CODE = `# Blockchain Visualization Demo
# This code runs in your browser using Pyodide (Python in WebAssembly)

# The Blockchain class is already loaded globally - just use it!

# Create a blockchain with difficulty 2
print("Creating blockchain...")
blockchain = Blockchain(difficulty=2)

# Add some blocks with data
blockchain.add_block("Alice sends 10 BTC to Bob")
blockchain.add_block("Bob sends 5 BTC to Charlie")
blockchain.add_block("Charlie sends 3 BTC to Alice")

# Display the chain
blockchain.print_chain()

# Validate the blockchain
blockchain.is_chain_valid()

# Try tampering with the chain (uncomment to see what happens)
# print("\\nTampering with block 1...")
# blockchain.chain[1].data = "Alice sends 100 BTC to Bob"
# blockchain.is_chain_valid()
`;

export default function CodeEditor({ code, onChange, onRun, isRunning }: CodeEditorProps) {
    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-blockchain-400" />
                    <h2 className="text-sm font-semibold text-white">Python Code Editor</h2>
                </div>
                <button
                    onClick={onRun}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-blockchain-600 hover:bg-blockchain-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <Play className="w-4 h-4" />
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-auto">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={onChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: true,
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'on',
                        padding: { top: 10, bottom: 10 },
                    }}
                />
            </div>
        </div>
    );
}

export { DEFAULT_CODE };
