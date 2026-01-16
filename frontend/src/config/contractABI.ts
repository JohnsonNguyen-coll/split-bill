// BillSplitter Contract ABI
// This will be generated from the contract compilation
// For now, using the essential functions

export const BILL_SPLITTER_ABI = [
  // Events
  "event BillCreated(uint256 indexed billId, address indexed creator, address indexed recipient, string name, uint256 totalAmount, uint8 splitType, uint256 deadline, uint256 participantCount, bool creatorIncluded)",
  "event PaymentReceived(uint256 indexed billId, address indexed participant, uint256 amount, uint256 timestamp)",
  "event BillSettled(uint256 indexed billId, address indexed recipient, uint256 totalAmount, uint256 timestamp)",
  
  // Functions
  "function createBill(string memory _name, uint256 _totalAmount, address _recipient, address[] memory _participants, uint256[] memory _amounts, uint256 _deadline, bool _creatorIncluded) external returns (uint256)",
  "function payShare(uint256 _billId) external",
  "function getBill(uint256 _billId) external view returns (tuple(uint256 billId, address creator, address recipient, string name, uint256 totalAmount, uint8 splitType, uint256 deadline, uint256 createdAt, uint8 status, uint256 settledAt, bool creatorIncluded, tuple(address wallet, uint256 amount, bool hasPaid, uint256 paidAt)[] participants))",
  "function getBillParticipants(uint256 _billId) external view returns (tuple(address wallet, uint256 amount, bool hasPaid, uint256 paidAt)[])",
  "function getUserBills(address _user) external view returns (uint256[])",
  "function getParticipantInfo(uint256 _billId, address _participant) external view returns (tuple(address wallet, uint256 amount, bool hasPaid, uint256 paidAt))",
  "function getAmountOwed(uint256 _billId, address _participant) external view returns (uint256 amount, bool hasPaid)",
  "function isParticipant(uint256 _billId, address _user) external view returns (bool)",
  "function isBillFullyPaid(uint256 _billId) external view returns (bool)",
  "function getTotalCollected(uint256 _billId) external view returns (uint256)",
  "function getPaymentStatus(uint256 _billId) external view returns (address[] memory paidAddresses, address[] memory unpaidAddresses)",
] as const;

export const USDC_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
] as const;











