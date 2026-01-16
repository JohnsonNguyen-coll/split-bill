# Frontend Setup Guide

## Quick Start

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Update `.env` with your contract address:**
```env
VITE_CONTRACT_ADDRESS=0x...  # Your deployed BillSplitter contract
VITE_ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
VITE_USDC_ADDRESS=0x3600000000000000000000000000000000000000
```

4. **Run development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features Implemented

✅ **Wallet Connection**
- MetaMask integration
- Arc Network auto-switch
- Wallet context for global state

✅ **Create Bill Page**
- Bill name, amount, recipient, deadline
- Equal or custom split methods
- Add/remove participants
- Real-time validation
- Contract integration

✅ **Dashboard**
- List all user bills
- Bill status (Active/Settled/Cancelled)
- Quick navigation to bill details

✅ **Bill Details Page**
- Full bill information
- Participant list with payment status
- Pay share functionality
- Copy invite link

✅ **Invite Page**
- Public bill link (`/invite/{billId}`)
- Connect wallet to view share
- Pay share directly from invite page

## Contract Integration

The frontend uses ethers.js v6 to interact with:
- `BillSplitter.sol` contract
- USDC token contract

## Next Steps

1. Deploy your contract to Arc Testnet
2. Update `VITE_CONTRACT_ADDRESS` in `.env`
3. Test the full flow:
   - Create a bill
   - Share invite link
   - Pay share from another wallet
   - Verify auto-settlement

## Troubleshooting

**TypeScript errors:**
- Run `npm install` to install all dependencies
- Make sure `@types/react` and `@types/react-dom` are installed

**Wallet connection issues:**
- Make sure MetaMask is installed
- Check that Arc Network is added to MetaMask
- Verify RPC URL in `.env`

**Contract interaction errors:**
- Verify contract address in `.env`
- Check that contract is deployed on Arc Testnet
- Ensure wallet has USDC for transactions











