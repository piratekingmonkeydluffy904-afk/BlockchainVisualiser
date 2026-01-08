# Chain Validation and Tampering Demo
# This shows what happens when someone tries to tamper with the blockchain

from blockchain import Blockchain

print("=" * 50)
print("BLOCKCHAIN SECURITY DEMONSTRATION")
print("=" * 50)

# Create a blockchain
print("\n1. Creating blockchain...")
blockchain = Blockchain(difficulty=2)

# Add some blocks
print("\n2. Adding blocks...")
blockchain.add_block("Alice sends 10 BTC to Bob")
blockchain.add_block("Bob sends 5 BTC to Charlie")
blockchain.add_block("Charlie sends 3 BTC to Alice")

# Validate the original chain
print("\n3. Validating original blockchain...")
blockchain.is_chain_valid()

# Display the chain
blockchain.print_chain()

# Now let's tamper with the blockchain!
print("\n" + "=" * 50)
print("⚠️  ATTEMPTING TO TAMPER WITH BLOCK 1")
print("=" * 50)

print("\nOriginal data: 'Alice sends 10 BTC to Bob'")
print("Tampered data: 'Alice sends 100 BTC to Bob'")

# Modify the data in block 1
blockchain.chain[1].data = "Alice sends 100 BTC to Bob"

# Try to validate the tampered chain
print("\n4. Validating tampered blockchain...")
is_valid = blockchain.is_chain_valid()

if not is_valid:
    print("\n✓ SECURITY WORKS!")
    print("The blockchain detected the tampering!")
    print("This is why blockchain is immutable and secure.")
else:
    print("\n✗ This shouldn't happen!")

print("\n" + "=" * 50)
print("KEY LESSON")
print("=" * 50)
print("Any change to a block invalidates the entire chain.")
print("This makes blockchain tamper-proof and trustworthy!")
