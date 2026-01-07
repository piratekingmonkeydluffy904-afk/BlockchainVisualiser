# 🔗 Blockchain Visualizer

An **interactive, browser-based educational platform** where students can write Python code to create blockchains and visualize their behavior in real-time. Built with 100% free and open-source technologies.

![Blockchain Visualizer](https://img.shields.io/badge/Python-Pyodide-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🐍 **Browser-based Python Execution** - Run Python code directly in the browser using Pyodide (no backend needed!)
- 📝 **Monaco Code Editor** - Professional code editor with Python syntax highlighting (same as VS Code)
- 📊 **Real-time Visualization** - Watch blocks being created and mined as your code executes
- ⛏️ **Proof-of-Work Mining** - See nonce values increment during mining with animated updates
- 🔗 **Chain Validation** - Visual feedback showing valid/invalid blockchain states
- 🎓 **Educational Focus** - Designed for teaching blockchain concepts to beginners

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone or navigate to the project directory
cd blockchainvisualiser

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application will open at `http://localhost:5173`

## 🎯 How to Use

1. **Write Python Code** - Use the left panel to write blockchain code
2. **Run Code** - Click the "Run Code" button to execute
3. **Watch Console** - Middle panel shows Python print output
4. **See Visualization** - Right panel displays the blockchain in real-time

### Example Code

The platform comes with a default example. Here's a simple blockchain:

```python
from blockchain import Blockchain

# Create blockchain with difficulty 2
blockchain = Blockchain(difficulty=2)

# Add blocks
blockchain.add_block("Alice sends 10 BTC to Bob")
blockchain.add_block("Bob sends 5 BTC to Charlie")

# Validate the chain
blockchain.is_chain_valid()
```

### Making Your Custom Code Visualize

The platform is **fully dynamic**! You can write your own blockchain implementation and make it visualize by emitting events:

**Option 1: Use the pre-loaded Blockchain class** (Easiest)
```python
# The platform already loaded a Blockchain class with visualization
blockchain = Blockchain(difficulty=2)
blockchain.add_block("My transaction")
```

**Option 2: Write your own class with event emission**
```python
from js import emit_event
import json

class MyBlock:
    def __init__(self, index, data, previous_hash):
        self.index = index
        self.data = data
        # ... your code ...
        
        # Emit event for visualization
        emit_event('BLOCK_CREATED', json.dumps({
            'index': self.index,
            'data': self.data,
            'previous_hash': previous_hash,
            'hash': self.hash,
            'nonce': self.nonce,
            'timestamp': time.time(),
            'status': 'created'
        }))
```

**See `public/examples/custom_blockchain_with_viz.py` for a complete example!**

For detailed instructions, check `public/HOW_TO_VISUALIZE.md`

## 📚 Educational Concepts Covered

- **Block Structure** - Index, timestamp, data, hashes, nonce
- **Hashing** - SHA-256 cryptographic hashing
- **Proof-of-Work** - Mining with adjustable difficulty
- **Chain Linkage** - How blocks link via previous_hash
- **Immutability** - Tampering detection and validation
- **Mining Process** - Nonce incrementation visualization

## 🏗️ Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend Framework | React + TypeScript | UI components |
| Build Tool | Vite | Fast development and building |
| Code Editor | Monaco Editor | Python code editing |
| Visualization | React Flow | Blockchain graph display |
| Python Runtime | Pyodide | Python in WebAssembly |
| Styling | Tailwind CSS | Modern UI design |

### Project Structure

```
blockchainvisualiser/
├── public/
│   ├── blockchain.py          # Core blockchain implementation
│   └── examples/              # Example Python files
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx     # Monaco editor wrapper
│   │   ├── ConsolePanel.tsx   # Output console
│   │   ├── BlockchainVisualization.tsx  # React Flow canvas
│   │   └── BlockNode.tsx      # Custom block node
│   ├── types/
│   │   └── blockchain.ts      # TypeScript interfaces
│   ├── App.tsx                # Main application
│   └── main.tsx               # Entry point
├── index.html                 # HTML with Pyodide CDN
└── vite.config.ts             # Vite configuration
```

## 🔧 How It Works

### Event Bridge System

The platform uses a custom event bridge to communicate between Python and JavaScript:

1. **Python emits events** using `emit_event(type, data)`
2. **JavaScript receives events** and updates React state
3. **React re-renders** the visualization in real-time

### Event Types

- `BLOCK_CREATED` - New block initialized
- `NONCE_UPDATED` - Mining in progress (every 100 iterations)
- `BLOCK_MINED` - Valid hash found
- `CHAIN_VALIDATED` - Validation complete

## 🎓 Teaching with This Platform

### Lesson Ideas

1. **Introduction to Blockchain** - Run the default example
2. **Mining Difficulty** - Adjust difficulty and observe mining time
3. **Chain Tampering** - Modify a block's data and validate
4. **Custom Data** - Store different types of information
5. **Performance** - Compare different difficulty levels

### Extending the Platform

Students can extend the blockchain with:
- Transaction validation
- Merkle trees
- Consensus algorithms (PoS, PBFT)
- Smart contract simulation
- Network simulation with multiple nodes

## 🛠️ Development

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Customization

- **Difficulty**: Modify `Blockchain(difficulty=N)` in Python
- **Styling**: Edit `tailwind.config.js` for custom colors
- **Layout**: Adjust grid columns in `App.tsx`

## 📖 API Reference

### Block Class

```python
Block(index, data, previous_hash)
```

**Methods:**
- `calculate_hash()` - Compute SHA-256 hash
- `mine_block(difficulty)` - Perform proof-of-work

### Blockchain Class

```python
Blockchain(difficulty=2)
```

**Methods:**
- `create_genesis_block()` - Initialize chain
- `add_block(data)` - Add and mine new block
- `is_chain_valid()` - Validate entire chain
- `print_chain()` - Display all blocks

## 🤝 Contributing

This is an educational project. Feel free to:
- Add new examples
- Improve visualizations
- Enhance documentation
- Report issues

## 📄 License

MIT License - Free to use for educational purposes

## 🙏 Acknowledgments

Built with:
- [Pyodide](https://pyodide.org/) - Python in the browser
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [React Flow](https://reactflow.dev/) - Node-based visualization
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Made for educators and students learning blockchain technology** 🎓⛓️
