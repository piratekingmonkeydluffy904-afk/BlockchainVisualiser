"""
Blockchain Implementation for Educational Visualization
This module provides a simple blockchain implementation with event emission
for real-time visualization in the browser.
"""

import hashlib
import json
import time
from js import emit_event  # Bridge to JavaScript


class Block:
    """
    Represents a single block in the blockchain.
    
    Attributes:
        index: Position of the block in the chain
        timestamp: When the block was created
        data: Information stored in the block
        previous_hash: Hash of the previous block (creates the chain)
        nonce: Number used once - incremented during mining
        hash: Current block's hash (calculated from all above)
    """
    
    def __init__(self, index, data, previous_hash):
        self.index = index
        self.timestamp = time.time()
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
        
        # Emit event for visualization
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
        """
        Calculate SHA-256 hash of block contents.
        Hash is based on: index + timestamp + data + previous_hash + nonce
        """
        block_string = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}{self.nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty):
        """
        Proof of Work: Find a hash that starts with 'difficulty' number of zeros.
        This is computationally expensive and secures the blockchain.
        
        Args:
            difficulty: Number of leading zeros required in hash
        """
        target = '0' * difficulty
        
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
            
            # Emit nonce update every 100 iterations for smooth animation
            if self.nonce % 100 == 0:
                emit_event('NONCE_UPDATED', json.dumps({
                    'index': self.index,
                    'nonce': self.nonce,
                    'hash': self.hash,
                    'status': 'mining'
                }))
        
        # Mining complete
        emit_event('BLOCK_MINED', json.dumps({
            'index': self.index,
            'nonce': self.nonce,
            'hash': self.hash,
            'status': 'mined'
        }))
    
    def to_dict(self):
        """Convert block to dictionary for JSON serialization"""
        return {
            'index': self.index,
            'timestamp': self.timestamp,
            'data': self.data,
            'previous_hash': self.previous_hash,
            'nonce': self.nonce,
            'hash': self.hash
        }


class Blockchain:
    """
    Manages the chain of blocks.
    
    The blockchain is a linked list where each block contains
    the hash of the previous block, creating an immutable chain.
    """
    
    def __init__(self, difficulty=2):
        self.chain = []
        self.difficulty = difficulty
        self.create_genesis_block()
    
    def create_genesis_block(self):
        """
        Create the first block in the chain.
        Genesis block has no previous hash (uses '0').
        """
        genesis = Block(0, "Genesis Block", "0")
        genesis.mine_block(self.difficulty)
        self.chain.append(genesis)
        print(f"✓ Genesis block created with hash: {genesis.hash}")
    
    def get_latest_block(self):
        """Return the most recent block in the chain"""
        return self.chain[-1]
    
    def add_block(self, data):
        """
        Add a new block to the chain.
        
        Args:
            data: Information to store in the block
        """
        previous_block = self.get_latest_block()
        new_block = Block(
            index=len(self.chain),
            data=data,
            previous_hash=previous_block.hash
        )
        
        print(f"Mining block {new_block.index}...")
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)
        print(f"✓ Block {new_block.index} mined with hash: {new_block.hash}")
    
    def is_chain_valid(self):
        """
        Validate the entire blockchain.
        
        Checks:
        1. Each block's hash is correct
        2. Each block's previous_hash matches the previous block's hash
        
        Returns:
            bool: True if chain is valid, False otherwise
        """
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Check if current hash is correct
            if current_block.hash != current_block.calculate_hash():
                emit_event('CHAIN_VALIDATED', json.dumps({
                    'valid': False,
                    'error': f'Block {i} has invalid hash',
                    'block_index': i
                }))
                print(f"✗ Block {i} has been tampered with!")
                return False
            
            # Check if previous_hash matches
            if current_block.previous_hash != previous_block.hash:
                emit_event('CHAIN_VALIDATED', json.dumps({
                    'valid': False,
                    'error': f'Block {i} has broken chain link',
                    'block_index': i
                }))
                print(f"✗ Block {i} has broken chain link!")
                return False
        
        emit_event('CHAIN_VALIDATED', json.dumps({
            'valid': True,
            'message': 'Blockchain is valid'
        }))
        print("✓ Blockchain is valid!")
        return True
    
    def print_chain(self):
        """Display the entire blockchain"""
        print("\n" + "="*50)
        print("BLOCKCHAIN")
        print("="*50)
        for block in self.chain:
            print(f"\nBlock #{block.index}")
            print(f"  Timestamp: {block.timestamp}")
            print(f"  Data: {block.data}")
            print(f"  Previous Hash: {block.previous_hash}")
            print(f"  Hash: {block.hash}")
            print(f"  Nonce: {block.nonce}")
        print("="*50 + "\n")


# Example usage for students
if __name__ == "__main__":
    # Create a blockchain with difficulty 2 (hash must start with "00")
    print("Creating blockchain...")
    blockchain = Blockchain(difficulty=2)
    
    # Add some blocks
    blockchain.add_block("First transaction")
    blockchain.add_block("Second transaction")
    blockchain.add_block("Third transaction")
    
    # Display the chain
    blockchain.print_chain()
    
    # Validate the chain
    blockchain.is_chain_valid()
