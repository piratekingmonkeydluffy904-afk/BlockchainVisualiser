# Custom Blockchain with Visualization
# This example shows how to make YOUR OWN blockchain code visualize

import hashlib
import time
import json
from js import emit_event  # Import the visualization bridge

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
        
        # Emit event so the visualization can display this block
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
        print(f"⛏️ Mining block {self.index}...")
        target = '0' * difficulty
        
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
            
            # Show mining progress every 100 iterations
            if self.nonce % 100 == 0:
                emit_event('NONCE_UPDATED', json.dumps({
                    'index': self.index,
                    'nonce': self.nonce,
                    'hash': self.hash,
                    'status': 'mining'
                }))
        
        # Mining complete!
        emit_event('BLOCK_MINED', json.dumps({
            'index': self.index,
            'nonce': self.nonce,
            'hash': self.hash,
            'status': 'mined'
        }))
        print(f"✅ Block {self.index} mined! Hash: {self.hash}")

class Blockchain:
    def __init__(self, difficulty=2):
        self.chain = []
        self.difficulty = difficulty
        self.create_genesis_block()
    
    def create_genesis_block(self):
        print("Creating genesis block...")
        genesis = Block(0, time.time(), "Genesis Block", "0")
        genesis.mine_block(self.difficulty)
        self.chain.append(genesis)
    
    def add_block(self, data):
        previous_block = self.chain[-1]
        new_block = Block(len(self.chain), time.time(), data, previous_block.hash)
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)

# Create and use your custom blockchain
print("🚀 Starting custom blockchain...")
blockchain = Blockchain(difficulty=2)

# Add some blocks
blockchain.add_block("Alice sends 10 BTC to Bob")
blockchain.add_block("Bob sends 5 BTC to Charlie")
blockchain.add_block("Charlie sends 3 BTC to Alice")

print("\n✅ Custom blockchain created and visualized!")
print(f"Total blocks: {len(blockchain.chain)}")
