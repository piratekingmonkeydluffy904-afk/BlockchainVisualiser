import { useState, useEffect, useCallback } from 'react';
import CodeEditor, { DEFAULT_CODE } from './components/CodeEditor';
import ConsolePanel from './components/ConsolePanel';
import BlockchainVisualization from './components/BlockchainVisualization';
import type { BlockData, ConsoleMessage } from './types/blockchain';
import { Loader2 } from 'lucide-react';

// Pyodide types
declare global {
  interface Window {
    loadPyodide: any;
  }
}

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [blocks, setBlocks] = useState<BlockData[]>([]);

  // Initialize Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      try {
        addConsoleMessage('info', 'Loading Python environment (Pyodide)...');

        // Load Pyodide from CDN
        const pyodideInstance = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });

        // Set up event bridge from Python to JavaScript
        // Expose to window object so Python can import from js
        (window as any).emit_event = (eventType: string, eventData: string) => {
          handlePythonEvent(eventType, eventData);
        };

        // Load the blockchain module - use relative path for GitHub Pages
        const blockchainCode = await fetch('./blockchain.py').then(r => r.text());
        await pyodideInstance.runPythonAsync(blockchainCode);

        setPyodide(pyodideInstance);
        addConsoleMessage('info', '✓ Python environment ready!');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Pyodide:', error);
        addConsoleMessage('error', `Failed to load Python environment: ${error}`);
        setIsLoading(false);
      }
    };

    initPyodide();
  }, []);

  const addConsoleMessage = (type: 'output' | 'error' | 'info', text: string) => {
    setConsoleMessages(prev => [...prev, { type, text, timestamp: Date.now() }]);
  };

  const handlePythonEvent = useCallback((eventType: string, eventData: string) => {
    try {
      const data = JSON.parse(eventData);

      switch (eventType) {
        case 'BLOCK_CREATED':
          setBlocks(prev => {
            const existing = prev.find(b => b.index === data.index);
            if (existing) {
              return prev.map(b => b.index === data.index ? data : b);
            }
            return [...prev, data];
          });
          break;

        case 'NONCE_UPDATED':
          setBlocks(prev =>
            prev.map(block =>
              block.index === data.index
                ? { ...block, nonce: data.nonce, hash: data.hash, status: 'mining' }
                : block
            )
          );
          break;

        case 'BLOCK_MINED':
          setBlocks(prev =>
            prev.map(block =>
              block.index === data.index
                ? { ...block, nonce: data.nonce, hash: data.hash, status: 'mined' }
                : block
            )
          );
          break;

        case 'CHAIN_VALIDATED':
          if (!data.valid && data.block_index !== undefined) {
            setBlocks(prev =>
              prev.map(block =>
                block.index === data.block_index
                  ? { ...block, status: 'invalid' }
                  : block
              )
            );
          }
          break;
      }
    } catch (error) {
      console.error('Error handling Python event:', error);
    }
  }, []);

  const runCode = async () => {
    if (!pyodide || isRunning) return;

    setIsRunning(true);
    setBlocks([]);
    setConsoleMessages([]);
    addConsoleMessage('info', 'Running Python code...\n');

    try {
      // Redirect Python stdout to capture print statements
      await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
      `);

      // Load auto-visualization wrapper - use relative path for GitHub Pages
      try {
        const wrapperCode = await fetch('./auto_visualizer.py').then(r => r.text());
        const wrappedCode = wrapperCode + '\n\n# === USER CODE ===\n\n' + code;

        // Run wrapped code with auto-visualization
        await pyodide.runPythonAsync(wrappedCode);
      } catch (wrapperError) {
        // If wrapper fails, run code normally
        await pyodide.runPythonAsync(code);
      }

      // Get stdout and stderr
      const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');
      const stderr = await pyodide.runPythonAsync('sys.stderr.getvalue()');

      if (stdout) {
        stdout.split('\n').forEach((line: string) => {
          if (line.trim()) addConsoleMessage('output', line);
        });
      }

      if (stderr) {
        stderr.split('\n').forEach((line: string) => {
          if (line.trim()) addConsoleMessage('error', line);
        });
      }

      addConsoleMessage('info', '\n✓ Execution complete!');
    } catch (error: any) {
      addConsoleMessage('error', `Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blockchain-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Python Environment...</p>
          <p className="text-slate-400 text-sm mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-blockchain-400">⛓️</span>
          Blockchain Visualizer
          <span className="text-sm font-normal text-slate-400 ml-2">
            Interactive Python Learning Platform
          </span>
        </h1>
      </header>

      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="col-span-4 h-full">
          <CodeEditor
            code={code}
            onChange={(value) => setCode(value || '')}
            onRun={runCode}
            isRunning={isRunning}
          />
        </div>

        {/* Middle: Console */}
        <div className="col-span-3 h-full">
          <ConsolePanel messages={consoleMessages} onClear={clearConsole} />
        </div>

        {/* Right: Visualization */}
        <div className="col-span-5 h-full">
          <BlockchainVisualization blocks={blocks} />
        </div>
      </div>
    </div>
  );
}

export default App;
