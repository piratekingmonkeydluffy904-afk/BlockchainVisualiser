# Mining Demonstration
# This example shows how mining difficulty affects the time to mine blocks

from blockchain import Blockchain
import time

print("=" * 50)
print("MINING DIFFICULTY DEMONSTRATION")
print("=" * 50)

# Test different difficulty levels
difficulties = [1, 2, 3]

for difficulty in difficulties:
    print(f"\n{'=' * 50}")
    print(f"Testing with difficulty: {difficulty}")
    print(f"{'=' * 50}")
    
    # Create blockchain
    blockchain = Blockchain(difficulty=difficulty)
    
    # Measure time to add a block
    print(f"\nMining a block with difficulty {difficulty}...")
    start_time = time.time()
    blockchain.add_block(f"Test transaction with difficulty {difficulty}")
    end_time = time.time()
    
    mining_time = end_time - start_time
    latest_block = blockchain.get_latest_block()
    
    print(f"\n📊 Mining Statistics:")
    print(f"   - Time taken: {mining_time:.2f} seconds")
    print(f"   - Nonce found: {latest_block.nonce}")
    print(f"   - Hash: {latest_block.hash}")
    print(f"   - Required prefix: {'0' * difficulty}")

print("\n" + "=" * 50)
print("CONCLUSION")
print("=" * 50)
print("As difficulty increases, mining takes longer!")
print("This is how Bitcoin secures the network.")
