# Bill Splitter Smart Contracts

On-chain bill splitting contracts for Arc Network, built with Foundry.

## Overview

This contract allows users to create bills, split expenses among participants, and track payments using USDC (Arc Network's native gas token).

## Features

- ✅ **Create Bill**: Create bills with total amount, participant list, and recipient
- ✅ **Invite Wallets**: Public bill ID allows participants to view their share
- ✅ **Pay Share**: Each participant can pay their portion using USDC
- ✅ **Auto Settle**: When 100% paid, funds automatically transfer to recipient
- ✅ **Split Methods**: Support for equal or custom split
- ✅ **Payment Tracking**: Track who has paid and who hasn't
- ✅ **Bill Status**: ACTIVE, SETTLED, or CANCELLED states

## Contract Structure

```
contracts/
├── src/
│   ├── BillSplitter.sol          # Main contract
│   └── interfaces/
│       └── IERC20.sol            # ERC20 interface
├── foundry.toml                  # Foundry configuration
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## Setup

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install dependencies:
```bash
forge install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure `.env` with your Arc Network RPC URL and private key:
```env
ARC_TESTNET_RPC_URL="https://rpc.testnet.arc.network"
PRIVATE_KEY="0x..."
USDC_ADDRESS="0x3600000000000000000000000000000000000000"
```

## Compile

```bash
forge build
```

## Test

```bash
forge test
```

## Deploy to Arc Testnet

```bash
forge create src/BillSplitter.sol:BillSplitter \
  --rpc-url $ARC_TESTNET_RPC_URL \
  --private-key $PRIVATE_KEY \
  --constructor-args 0x3600000000000000000000000000000000000000 \
  --broadcast
```

## Contract Functions

### createBill
Creates a new bill with participants and split configuration. Returns a unique `billId` that can be shared as a public link.

**Parameters:**
- `_name`: Bill name/description
- `_totalAmount`: Total amount in USDC (6 decimals)
- `_recipient`: Address that will receive funds when bill is settled
- `_participants`: Array of participant wallet addresses
- `_amounts`: Array of amounts per participant (empty for equal split)
- `_deadline`: Payment deadline timestamp

**Returns:** `billId` - Unique bill identifier (can be used as public link)

### payShare
Allows a participant to pay their portion of a bill. When all participants pay, the bill automatically settles and transfers funds to the recipient.

**Parameters:**
- `_billId`: The bill ID to pay

**Note:** Requires USDC approval before calling. Automatically settles when 100% paid.

### cancelBill
Allows the creator to cancel a bill and refund any payments made.

**Parameters:**
- `_billId`: The bill ID to cancel

### View Functions (for Invite Flow)

- `getBill(uint256 _billId)`: Get complete bill details including status
- `getBillParticipants(uint256 _billId)`: Get all participants with payment status
- `getUserBills(address _user)`: Get all bill IDs for a user
- `getParticipantInfo(uint256 _billId, address _participant)`: Get participant details (amount owed, payment status)
- `getAmountOwed(uint256 _billId, address _participant)`: Get amount owed and payment status (for invite flow)
- `isParticipant(uint256 _billId, address _user)`: Check if address is a participant
- `isBillFullyPaid(uint256 _billId)`: Check if bill is fully paid
- `getTotalCollected(uint256 _billId)`: Get total amount collected so far
- `getPaymentStatus(uint256 _billId)`: Get arrays of paid and unpaid addresses

## Workflow

### 1. Create Bill
Creator calls `createBill()` with participants, amounts, and recipient. Receives `billId`.

### 2. Invite Wallets
Share the `billId` (or public link with billId). Invited users can:
- Connect wallet
- Call `getAmountOwed(billId, theirAddress)` to see how much they owe
- Call `isParticipant(billId, theirAddress)` to verify they're included

### 3. Pay Share
Each participant:
- Approves USDC to contract
- Calls `payShare(billId)` to pay their portion

### 4. Auto Settle
When all participants have paid:
- Contract automatically transfers all USDC to recipient
- Bill status changes to SETTLED
- `BillSettled` event is emitted

## Network Information

- **Network**: Arc Testnet
- **Chain ID**: (Check Arc documentation)
- **RPC URL**: https://rpc.testnet.arc.network
- **Native Token**: USDC (6 decimals)
- **USDC Address**: `0x3600000000000000000000000000000000000000`

## Security Notes

- Always use environment variables for private keys
- Never commit `.env` file to version control
- Test thoroughly on testnet before mainnet deployment
- Review all contract interactions before executing

## License

MIT

