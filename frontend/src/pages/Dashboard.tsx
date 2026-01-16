import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWallet } from '../contexts/WalletContext';
import { getBillSplitterContractReadOnly, formatUSDC, formatAddress } from '../utils/web3';
import { CONTRACT_ADDRESSES } from '../config/constants';

interface Bill {
  billId: bigint;
  creator: string;
  recipient: string;
  name: string;
  totalAmount: bigint;
  splitType: number;
  deadline: bigint;
  createdAt: bigint;
  status: number; // 0: ACTIVE, 1: SETTLED, 2: CANCELLED (converted to number)
  settledAt: bigint;
  participants: any[];
  userShare?: bigint;
  userHasPaid?: boolean;
  isCreator?: boolean;
}

const Dashboard = () => {
  const { address, isConnected } = useWallet();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'action' | 'pending' | 'settled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      checkNetwork();
      loadBills();
    }
  }, [isConnected, address]);

  const checkNetwork = async () => {
    try {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const currentChainId = parseInt(chainId, 16);
        setWrongNetwork(currentChainId !== 5042002);
      }
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  const loadBills = async () => {
    if (!address || !CONTRACT_ADDRESSES.BillSplitter) return;

    try {
      setLoading(true);
      const contract = getBillSplitterContractReadOnly();
      const billIds = await contract.getUserBills(address);
      
      const billsData = await Promise.all(
        billIds.map(async (id: bigint) => {
          try {
            const bill = await contract.getBill(id);
            const participants = bill.participants || [];
            
            // Get user's participant info
            let userShare = 0n;
            let userHasPaid = false;
            try {
              const participantInfo = await contract.getParticipantInfo(id, address);
              userShare = participantInfo.amount;
              userHasPaid = participantInfo.hasPaid;
            } catch {
              // User is not a participant
            }
            
            return {
              billId: id,
              creator: bill.creator,
              recipient: bill.recipient,
              name: bill.name,
              totalAmount: bill.totalAmount,
              splitType: Number(bill.splitType),
              deadline: bill.deadline,
              createdAt: bill.createdAt,
              status: Number(bill.status),
              settledAt: bill.settledAt,
              participants,
              userShare,
              userHasPaid,
              isCreator: bill.creator.toLowerCase() === address.toLowerCase()
            };
          } catch {
            return null;
          }
        })
      );

      setBills(billsData.filter(Boolean) as Bill[]);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = () => {
    const activeBills = bills.filter(b => b.status === 0);
    
    // Receivable: bills where user is creator but NOT a participant (userShare = 0)
    const receivable = bills
      .filter(b => b.isCreator && b.status === 0 && (!b.userShare || b.userShare === 0n))
      .reduce((sum, b) => {
        const amount = b.totalAmount != null ? Number(b.totalAmount) : 0;
        return sum + (Number.isNaN(amount) ? 0 : amount);
      }, 0);
    
    // Payable: any bill where user has a share and hasn't paid (including creator if they're a participant)
    const payable = bills
      .filter(b => b.status === 0 && b.userShare && b.userShare > 0n && !b.userHasPaid)
      .reduce((sum, b) => {
        const amount = b.userShare != null ? Number(b.userShare) : 0;
        return sum + (Number.isNaN(amount) ? 0 : amount);
      }, 0);
    
    return {
      receivable,
      payable,
      activeCount: activeBills.length
    };
  };

  // Get bill icon and color
  const getBillIcon = (index: number) => {
    const icons = [
      { icon: 'restaurant', color: 'orange' },
      { icon: 'cabin', color: 'blue' },
      { icon: 'bolt', color: 'purple' },
      { icon: 'celebration', color: 'pink' },
      { icon: 'receipt_long', color: 'primary' }
    ];
    return icons[index % icons.length];
  };

  // Get status badge
  const getStatusBadge = (bill: Bill) => {
    if (bill.status === 1) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
          <span className="size-1.5 rounded-full bg-emerald-500"></span>
          Settled
        </span>
      );
    }
    
    if (bill.status === 0) {
      // Check if user needs to pay (including creator if they're a participant)
      const needsToPay = bill.userShare && bill.userShare > 0n && !bill.userHasPaid;
      
      if (needsToPay) {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Awaiting Payment
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="size-1.5 rounded-full bg-slate-400"></span>
            Pending Others
          </span>
        );
      }
    }
    
    return null;
  };

  // Filter bills
  const filteredBills = bills.filter(bill => {
    // Search filter
    if (searchQuery && !bill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filter === 'all') return true;
    if (filter === 'settled') return bill.status === 1;
    // Action required: user has a share and hasn't paid yet (including creator if they're a participant)
    if (filter === 'action') return bill.status === 0 && bill.userShare && bill.userShare > 0n && !bill.userHasPaid;
    // Pending: user has paid or is just collecting (creator without share)
    if (filter === 'pending') return bill.status === 0 && (!bill.userShare || bill.userShare === 0n || bill.userHasPaid);
    
    return true;
  });

  const stats = calculateStats();

  if (!isConnected) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Please connect your wallet to view bills</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-white">
      <Navbar />
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1200px] flex flex-col gap-8">
          {/* Wrong Network Warning */}
          {wrongNetwork && (
            <div className="rounded-xl p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-3xl">error</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">Wrong Network</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                    You're connected to the wrong network. Please switch to Arc Testnet (Chain ID: 5042002) to view your bills.
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x4cef52' }], // 5042002 in hex
                        });
                      } catch (error: any) {
                        if (error.code === 4902) {
                          // Network not added, add it
                          await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                              chainId: '0x4cef52',
                              chainName: 'Arc Testnet',
                              rpcUrls: ['https://rpc.testnet.arc.network'],
                              nativeCurrency: {
                                name: 'USDC',
                                symbol: 'USDC',
                                decimals: 6,
                              },
                            }],
                          });
                        }
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg h-10 px-6 bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                    Switch to Arc Testnet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">My Bills Dashboard</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">Manage your shared expenses and settlements.</p>
            </div>
            <Link
              to="/create"
              className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-surface-dark dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Create New Bill</span>
            </Link>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Receivable */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Receivable</p>
                <span className="material-symbols-outlined text-emerald-500">call_received</span>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {formatUSDC(Number.isNaN(stats.receivable) ? 0n : BigInt(Math.floor(stats.receivable)))} USDC
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Across {bills.filter(b => b.isCreator && b.status === 0).length} active bills
                </p>
              </div>
            </div>

            {/* Total Payable */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Payable</p>
                <span className="material-symbols-outlined text-amber-500">call_made</span>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {formatUSDC(Number.isNaN(stats.payable) ? 0n : BigInt(Math.floor(stats.payable)))} USDC
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {(() => {
                    const count = bills.filter(b => b.status === 0 && b.userShare && b.userShare > 0n && !b.userHasPaid).length;
                    return `${count} bill${count !== 1 ? 's' : ''} requires attention`;
                  })()}
                </p>
              </div>
            </div>

            {/* Active Bills */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Bills</p>
                <span className="material-symbols-outlined text-primary">receipt_long</span>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.activeCount}</p>
                <p className="text-xs text-slate-400 mt-1">Last updated today</p>
              </div>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`h-9 px-4 rounded-lg text-sm font-bold shadow-sm transition-colors ${
                  filter === 'all'
                    ? 'bg-[#1A2235] dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Bills
              </button>
              <button
                onClick={() => setFilter('action')}
                className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === 'action'
                    ? 'bg-[#1A2235] dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="size-2 rounded-full bg-amber-500"></span>
                Action Required
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-[#1A2235] dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter('settled')}
                className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'settled'
                    ? 'bg-[#1A2235] dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Settled
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bills..."
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
                />
              </div>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-xl">filter_list</span>
              </button>
            </div>
          </div>

          {/* Bills List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">Loading bills...</p>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 mb-4">No bills found</p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Create Your First Bill
              </Link>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#151c2b] border-b border-slate-200 dark:border-[#324467]">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Share</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#324467]">
                    {filteredBills.map((bill, index) => {
                      const iconInfo = getBillIcon(index);
                      const iconColorClass = {
                        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
                        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                        pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
                        primary: 'bg-primary/10 text-primary'
                      }[iconInfo.color];
                      
                      const participantCount = bill.participants?.length || 0;
                      const showAvatars = Math.min(participantCount, 2);
                      const remainingCount = Math.max(0, participantCount - 2);
                      
                      return (
                        <tr key={bill.billId.toString()} className="group hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`size-10 rounded-lg ${iconColorClass} flex items-center justify-center`}>
                                <span className="material-symbols-outlined">{iconInfo.icon}</span>
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900 dark:text-white">{bill.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {bill.isCreator ? 'Created by You' : `Created by ${formatAddress(bill.creator)}`}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {new Date(Number(bill.createdAt) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex -space-x-2">
                              {bill.participants?.slice(0, showAvatars).map((p: any, idx: number) => {
                                const avatarColors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500'];
                                const color = avatarColors[idx % avatarColors.length];
                                const walletKey = p.wallet || `participant-${idx}`;
                                return (
                                  <div
                                    key={`${walletKey}-${idx}`}
                                    className={`size-8 rounded-full border-2 border-white dark:border-background-dark ${color} flex items-center justify-center text-white text-xs font-bold`}
                                  >
                                    {p.wallet?.slice(2, 4).toUpperCase() || '??'}
                                  </div>
                                );
                              })}
                              {remainingCount > 0 && (
                                <div className="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                  +{remainingCount}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                            {formatUSDC(bill.totalAmount)} USDC
                          </td>
                          <td className="px-6 py-4 text-sm font-bold">
                            {(() => {
                              if (!bill.userShare || bill.userShare === 0n) {
                                return <span className="text-slate-400">-</span>;
                              }
                              if (bill.userHasPaid) {
                                return (
                                  <span className="text-slate-400 line-through">
                                    {formatUSDC(bill.userShare)} USDC
                                  </span>
                                );
                              }
                              // If creator has a share (creatorIncluded), show as payable, not receivable
                              if (bill.isCreator && bill.userShare > 0n) {
                                return (
                                  <span className="text-slate-900 dark:text-white">
                                    {formatUSDC(bill.userShare)} USDC
                                  </span>
                                );
                              }
                              return (
                                <span className="text-slate-900 dark:text-white">
                                  {formatUSDC(bill.userShare)} USDC
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(bill)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {(() => {
                              // Show "Settle Now" if user has a share and hasn't paid (including creator if they're a participant)
                              if (bill.status === 0 && bill.userShare && bill.userShare > 0n && !bill.userHasPaid) {
                                return (
                                  <Link
                                    to={`/bill/${bill.billId.toString()}`}
                                    className="inline-flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors"
                                  >
                                    Settle Now
                                  </Link>
                                );
                              }
                              if (bill.status === 1) {
                                return (
                                  <button className="text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
                                    View Receipt
                                  </button>
                                );
                              }
                              return (
                                <Link
                                  to={`/bill/${bill.billId.toString()}`}
                                  className="text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
                                >
                                  View Details
                                </Link>
                              );
                            })()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {filteredBills.length > 0 && (
                <div className="border-t border-slate-200 dark:border-[#324467] px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-[#151c2b]/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-white">1-{filteredBills.length}</span> of{' '}
                    <span className="font-bold text-slate-900 dark:text-white">{filteredBills.length}</span> bills
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      disabled={filteredBills.length <= 10}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


