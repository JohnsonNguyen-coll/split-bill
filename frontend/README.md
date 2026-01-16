# SplitArc Frontend

React/TypeScript frontend for On-chain Bill Splitter dApp on Arc Network.

## Features

- ✅ Wallet connection (MetaMask)
- ✅ Create bills with equal or custom split
- ✅ View bills dashboard
- ✅ Pay share functionality
- ✅ Invite flow for participants
- ✅ Real-time bill status tracking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your contract address:
```env
VITE_CONTRACT_ADDRESS=0x...  # Your deployed BillSplitter contract address
VITE_ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
VITE_USDC_ADDRESS=0x3600000000000000000000000000000000000000
```

4. Run development server:
```bash
npm run dev
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   └── Navbar.tsx
│   ├── contexts/          # React contexts
│   │   └── WalletContext.tsx
│   ├── pages/            # Page components
│   │   ├── CreateBill.tsx
│   │   ├── Dashboard.tsx
│   │   ├── BillDetails.tsx
│   │   ├── InvitePage.tsx
│   │   └── Welcome.tsx
│   ├── config/           # Configuration
│   │   ├── constants.ts
│   │   └── contractABI.ts
│   ├── utils/            # Utility functions
│   │   └── web3.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.ts
```

## Usage

### Create Bill
1. Connect wallet
2. Navigate to Create Bill
3. Fill in bill details (name, amount, recipient, deadline)
4. Add participants
5. Choose split method (equal or custom)
6. Submit transaction

### Pay Share
1. View bill details
2. Click "Pay Share" if you're a participant
3. Approve USDC (if needed)
4. Confirm transaction

### Invite Flow
1. Share bill link: `/invite/{billId}`
2. Participant connects wallet
3. View amount owed
4. Pay share

## Contract Integration

The frontend uses ethers.js v6 to interact with the BillSplitter contract:

- `createBill()` - Create new bill
- `payShare()` - Pay your portion
- `getBill()` - Get bill details
- `getAmountOwed()` - Get participant amount
- `getPaymentStatus()` - Track payments

## Network Configuration

The app is configured for Arc Testnet. To switch networks, update `src/config/constants.ts`.

## Build

```bash
npm run build
```

Output will be in `dist/` directory.

## License

MIT











