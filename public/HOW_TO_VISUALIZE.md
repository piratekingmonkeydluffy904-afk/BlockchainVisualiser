# How to Make Your Custom Blockchain Code Visualize

## The Event System

The visualization panel listens for **events** emitted from your Python code. To make your custom blockchain visualize, you need to emit these events at the right moments.

## Required Import

```python
from js import emit_event
import json
```

## Events to Emit

### 1. BLOCK_CREATED
Emit when a block is initialized:

```python
emit_event('BLOCK_CREATED', json.dumps({
    'index': self.index,
    'timestamp': self.timestamp,
    'data': self.data,
    'previous_hash': self.previous_hash,
    'nonce': self.nonce,
    'hash': self.hash,
    'status': 'created'
}))
```

### 2. NONCE_UPDATED (Optional)
Emit during mining to show progress:

```python
# Emit every 100 iterations for smooth animation
if self.nonce % 100 == 0:
    emit_event('NONCE_UPDATED', json.dumps({
        'index': self.index,
        'nonce': self.nonce,
        'hash': self.hash,
        'status': 'mining'
    }))
```

### 3. BLOCK_MINED
Emit when mining completes:

```python
emit_event('BLOCK_MINED', json.dumps({
    'index': self.index,
    'nonce': self.nonce,
    'hash': self.hash,
    'status': 'mined'
}))
```

### 4. CHAIN_VALIDATED (Optional)
Emit after validation:

```python
emit_event('CHAIN_VALIDATED', json.dumps({
    'valid': True,
    'message': 'Blockchain is valid'
}))
```

## Complete Example

```python
import hashlib
import time
import json
from js import emit_event

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
        
        # ✅ Emit event for visualization
        emit_event('BLOCK_CREATED', json.dumps({
            'index': self.index,
            'timestamp': self.timestamp,
            'data': self.data,
            'previous_hash': self.previous_hash,
            'nonce': self.nonce,
            'hash': self.hash,
            'status': 'created'
        }))

    def calculate_hash(self):
        text = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}{self.nonce}"
        return hashlib.sha256(text.encode()).hexdigest()

    def mine_block(self, difficulty):
        target = '0' * difficulty
        
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
            
            # ✅ Show mining progress
            if self.nonce % 100 == 0:
                emit_event('NONCE_UPDATED', json.dumps({
                    'index': self.index,
                    'nonce': self.nonce,
                    'hash': self.hash,
                    'status': 'mining'
                }))
        
        # ✅ Mining complete
        emit_event('BLOCK_MINED', json.dumps({
            'index': self.index,
            'nonce': self.nonce,
            'hash': self.hash,
            'status': 'mined'
        }))

class Blockchain:
    def __init__(self, difficulty=2):
        self.chain = []
        self.difficulty = difficulty
        self.create_genesis_block()
    
    def create_genesis_block(self):
        genesis = Block(0, time.time(), "Genesis Block", "0")
        genesis.mine_block(self.difficulty)
        self.chain.append(genesis)
    
    def add_block(self, data):
        previous_block = self.chain[-1]
        new_block = Block(len(self.chain), time.time(), data, previous_block.hash)
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)

# Use your custom blockchain
blockchain = Blockchain(difficulty=2)
blockchain.add_block("Transaction 1")
blockchain.add_block("Transaction 2")
print("✅ Blockchain created and visualized!")
```

## Quick Start

**Option 1:** Use the pre-loaded `Blockchain` class (already has events):
```python
blockchain = Blockchain(difficulty=2)
blockchain.add_block("My data")
```

**Option 2:** Add event emission to your custom code (see example above)

## Tips

- Always import `emit_event` from `js`
- Use `json.dumps()` to convert data to JSON string
- Emit events at key moments (block creation, mining, validation)
- All data must be JSON-serializable (strings, numbers, booleans)
