export interface BlockData {
    index: number;
    timestamp: number;
    data: string;
    previous_hash: string;
    nonce: number;
    hash: string;
    status?: 'created' | 'mining' | 'mined' | 'invalid';
}

export interface BlockchainEvent {
    type: 'BLOCK_CREATED' | 'NONCE_UPDATED' | 'BLOCK_MINED' | 'CHAIN_VALIDATED';
    data: BlockData | ValidationResult;
}

export interface ValidationResult {
    valid: boolean;
    error?: string;
    message?: string;
    block_index?: number;
}

export interface ConsoleMessage {
    type: 'output' | 'error' | 'info';
    text: string;
    timestamp: number;
}
