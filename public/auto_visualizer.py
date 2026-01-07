"""
Automatic Blockchain Visualization Wrapper
This code automatically wraps user-defined blockchain classes to enable visualization
"""

from js import emit_event
import json

# Monkey-patch user's Block class to emit events
_original_block_init = None
_original_mine_methods = {}

def _wrap_block_init(original_init):
    """Wrap Block.__init__ to emit BLOCK_CREATED event"""
    def wrapped_init(self, *args, **kwargs):
        # Call original __init__
        original_init(self, *args, **kwargs)
        
        # Emit visualization event
        try:
            emit_event('BLOCK_CREATED', json.dumps({
                'index': getattr(self, 'index', 0),
                'timestamp': getattr(self, 'timestamp', 0),
                'data': str(getattr(self, 'data', '')),
                'previous_hash': str(getattr(self, 'previous_hash', '0')),
                'nonce': getattr(self, 'nonce', 0),
                'hash': str(getattr(self, 'hash', '')),
                'status': 'created'
            }))
        except Exception as e:
            pass  # Silently fail if attributes missing
    
    return wrapped_init

def _wrap_mine_method(original_method):
    """Wrap mining methods to emit progress events"""
    def wrapped_mine(self, *args, **kwargs):
        block = self
        
        # Store original hash calculation
        if hasattr(block, 'calculate_hash'):
            original_calc = block.calculate_hash
            call_count = [0]
            
            def wrapped_calc():
                result = original_calc()
                call_count[0] += 1
                
                # Emit progress every 100 calls
                if call_count[0] % 100 == 0:
                    try:
                        emit_event('NONCE_UPDATED', json.dumps({
                            'index': getattr(block, 'index', 0),
                            'nonce': getattr(block, 'nonce', 0),
                            'hash': str(result),
                            'status': 'mining'
                        }))
                    except:
                        pass
                
                return result
            
            block.calculate_hash = wrapped_calc
        
        # Call original mining method
        result = original_method(self, *args, **kwargs)
        
        # Emit mining complete
        try:
            emit_event('BLOCK_MINED', json.dumps({
                'index': getattr(block, 'index', 0),
                'nonce': getattr(block, 'nonce', 0),
                'hash': str(getattr(block, 'hash', '')),
                'status': 'mined'
            }))
        except:
            pass
        
        return result
    
    return wrapped_mine

# Auto-detect and wrap user classes after code execution
import sys

class AutoWrapperMeta(type):
    """Metaclass to automatically wrap Block classes"""
    def __call__(cls, *args, **kwargs):
        instance = super().__call__(*args, **kwargs)
        
        # Wrap mining methods
        for method_name in ['mine_block', 'mine', 'proof_of_work']:
            if hasattr(instance, method_name):
                original = getattr(instance, method_name)
                setattr(instance, method_name, _wrap_mine_method(original))
        
        return instance

# Hook into class creation
_original_build_class = __builtins__.__build_class__

def _custom_build_class(func, name, *bases, **kwargs):
    """Intercept class creation to wrap Block classes"""
    cls = _original_build_class(func, name, *bases, **kwargs)
    
    # If this looks like a Block class, wrap it
    if name == 'Block' or 'block' in name.lower():
        if hasattr(cls, '__init__'):
            cls.__init__ = _wrap_block_init(cls.__init__)
    
    return cls

__builtins__.__build_class__ = _custom_build_class

print("🎨 Auto-visualization enabled! Your blockchain will visualize automatically.")
