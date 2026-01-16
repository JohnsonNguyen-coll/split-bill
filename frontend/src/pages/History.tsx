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

const History = () => {
  const { address, isConnected } = useWallet();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'settled' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isConnected && address) {
      loadBills();
    }
  }, [isConnected, address]);

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
            
            // Only load settled or cancelled bills
            if (Number(bill.status) === 0) {
              return null;
            }
            
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
          } catch (error) {
            return null;
          }
        })
      );

      const filteredBills = billsData.filter(Boolean) as Bill[];
      setBills(filteredBills);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
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
    
    if (bill.status === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50">
          <span className="size-1.5 rounded-full bg-red-500"></span>
          Cancelled
        </span>
      );
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
    if (filter === 'cancelled') return bill.status === 2;
    
    return true;
  });

  // Sort by settledAt or createdAt (newest first)
  const sortedBills = [...filteredBills].sort((a, b) => {
    const timeA = a.status === 1 ? Number(a.settledAt) : Number(a.createdAt);
    const timeB = b.status === 1 ? Number(b.settledAt) : Number(b.createdAt);
    return timeB - timeA;
  });

  // Calculate stats
  const stats = {
    total: bills.length,
    settled: bills.filter(b => b.status === 1).length,
    cancelled: bills.filter(b => b.status === 2).length,
    totalAmount: bills.reduce((sum, b) => {
      const amount = b.totalAmount != null ? Number(b.totalAmount) : 0;
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0)
  };

  if (!isConnected) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Please connect your wallet to view history</p>
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Transaction History</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">View your completed and cancelled bills.</p>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Bills */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Bills</p>
                <span className="material-symbols-outlined text-primary">history</span>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total}</p>
                <p className="text-xs text-slate-400 mt-1">All completed bills</p>
              </div>
            </div>

            {/* Settled Bills */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Settled</p>
                <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.settled}</p>
                <p className="text-xs text-slate-400 mt-1">Successfully settled</p>
              </div>
            </div>

            {/* Cancelled Bills */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cancelled</p>
                <span className="material-symbols-outlined text-red-500">cancel</span>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.cancelled}</p>
                <p className="text-xs text-slate-400 mt-1">Cancelled bills</p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Amount</p>
                <span className="material-symbols-outlined text-blue-500">payments</span>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {formatUSDC(Number.isNaN(stats.totalAmount) ? 0n : BigInt(Math.floor(stats.totalAmount)))} USDC
                </p>
                <p className="text-xs text-slate-400 mt-1">Total transaction value</p>
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
                All History
              </button>
              <button
                onClick={() => setFilter('settled')}
                className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === 'settled'
                    ? 'bg-[#1A2235] dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="size-2 rounded-full bg-emerald-500"></span>
                Settled
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`h-9 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === 'cancelled'
                    ? 'bg-[#1A2235] dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="size-2 rounded-full bg-red-500"></span>
                Cancelled
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
            </div>
          </div>

          {/* Bills List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">Loading history...</p>
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">history</span>
              <p className="text-slate-500 dark:text-slate-400 mb-4">No history found</p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined">dashboard</span>
                Go to Dashboard
              </Link>
            </div>
          ) : sortedBills.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 mb-4">No bills match your filter</p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#151c2b] border-b border-slate-200 dark:border-[#324467]">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Share</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#324467]">
                    {sortedBills.map((bill, index) => {
                      try {
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
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {bill.status === 1 && bill.settledAt > 0n
                              ? new Date(Number(bill.settledAt) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : bill.status === 2
                              ? new Date(Number(bill.createdAt) * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                              : '-'}
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
                              if (bill.isCreator) {
                                return (
                                  <span className="text-emerald-600 dark:text-emerald-400">
                                    + {formatUSDC(bill.userShare)} USDC
                                  </span>
                                );
                              }
                              return (
                                <span className="text-slate-600 dark:text-slate-400">
                                  {formatUSDC(bill.userShare)} USDC
                                </span>
                              );
                            })()}
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(bill)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/bill/${bill.billId.toString()}`}
                              className="text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      );
                      } catch (error) {
                        return null;
                      }
                    })}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {sortedBills.length > 0 && (
                <div className="border-t border-slate-200 dark:border-[#324467] px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-[#151c2b]/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing <span className="font-bold text-slate-900 dark:text-white">1-{sortedBills.length}</span> of{' '}
                    <span className="font-bold text-slate-900 dark:text-white">{sortedBills.length}</span> bills
                  </p>
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                      disabled={sortedBills.length <= 10}
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

export default History;

