# Basic Blockchain Example
# This demonstrates creating a simple blockchain with a few blocks

from blockchain import Blockchain

print("=" * 50)
print("BASIC BLOCKCHAIN EXAMPLE")
print("=" * 50)

# Create a blockchain with difficulty 2
# This means the hash must start with "00"
print("\n1. Creating blockchain with difficulty 2...")
blockchain = Blockchain(difficulty=2)

# Add some blocks with transaction data
print("\n2. Adding blocks to the chain...")
blockchain.add_block("Alice sends 10 BTC to Bob")
blockchain.add_block("Bob sends 5 BTC to Charlie")
blockchain.add_block("Charlie sends 3 BTC to Alice")

# Display the entire blockchain
print("\n3. Displaying the blockchain...")
blockchain.print_chain()

# Validate the blockchain
print("\n4. Validating the blockchain...")
is_valid = blockchain.is_chain_valid()

if is_valid:
    print("\n✓ SUCCESS: The blockchain is valid and secure!")
else:
    print("\n✗ ERROR: The blockchain has been compromised!")
