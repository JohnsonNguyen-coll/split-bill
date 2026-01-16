import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWallet } from '../contexts/WalletContext';
import { getBillSplitterContract, getBillSplitterContractReadOnly, getUSDCContract, formatUSDC, formatAddress } from '../utils/web3';
import { CONTRACT_ADDRESSES } from '../config/constants';

// Helper function to get time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

interface Participant {
  wallet: string;
  amount: bigint;
  hasPaid: boolean;
  paidAt: bigint;
}

interface Bill {
  billId: bigint;
  creator: string;
  recipient: string;
  name: string;
  totalAmount: bigint;
  splitType: number;
  deadline: bigint;
  createdAt: bigint;
  status: number;
  settledAt: bigint;
  participants: Participant[];
}

const BillDetails = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const { address } = useWallet();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [userParticipant, setUserParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (billId) {
      loadBill();
    }
  }, [billId, address]);

  const loadBill = async () => {
    if (!billId) return;

    try {
      setLoading(true);
      setError(null);
      const contract = getBillSplitterContractReadOnly();
      const billData = await contract.getBill(billId);
      setBill(billData);

      if (address) {
        try {
          const participant = await contract.getParticipantInfo(billId, address);
          setUserParticipant(participant);
        } catch (error) {
          setUserParticipant(null);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load bill');
    } finally {
      setLoading(false);
    }
  };

  const handlePayShare = async () => {
    if (!billId || !address || !userParticipant) return;

    try {
      setPaying(true);

      // Approve USDC first
      const usdcContract = await getUSDCContract();
      const amount = userParticipant.amount;
      const allowance = await usdcContract.allowance(address, CONTRACT_ADDRESSES.BillSplitter);
      
      if (allowance < amount) {
        const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.BillSplitter, amount);
        await approveTx.wait();
      }

      // Pay share
      const contract = await getBillSplitterContract();
      const tx = await contract.payShare(billId);
      await tx.wait();

      // Reload bill
      await loadBill();
      setSuccessMessage('Payment successful! 🎉');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error: any) {
      console.error('Error paying share:', error);
      
      // Check if user rejected the transaction
      if (error.code === 'ACTION_REJECTED' || error.code === 4001 || error.message?.includes('user rejected')) {
        setError('Transaction cancelled by user');
      } else {
        setError(error.message || 'Failed to pay share');
      }
      
      setTimeout(() => setError(null), 5000);
    } finally {
      setPaying(false);
    }
  };

  const copyBillLink = () => {
    const link = `${globalThis.location.origin}/invite/${billId}`;
    navigator.clipboard.writeText(link);
    setSuccessMessage('Bill link copied to clipboard! 📋');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Loading bill details...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-4">Bill not found</p>
            <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
          </div>
        </main>
      </div>
    );
  }

  const isCreator = bill.creator.toLowerCase() === address?.toLowerCase();

  const collectedAmount = bill.participants?.reduce((sum, p) => {
    try {
      const amount = p.amount != null ? Number(p.amount) : 0;
      return sum + (p.hasPaid && !Number.isNaN(amount) ? amount : 0);
    } catch {
      return sum;
    }
  }, 0) || 0;
  
  const collectedPercentage = bill.totalAmount > 0n && !Number.isNaN(collectedAmount) ? (collectedAmount / Number(bill.totalAmount)) * 100 : 0;
  const userShare = userParticipant && userParticipant.amount != null ? Number(userParticipant.amount) : 0;

  // Format date
  const createdDate = new Date(Number(bill.createdAt) * 1000);
  const formattedDate = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Navbar />
      
      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-lg p-4 bg-emerald-500 text-white shadow-lg max-w-md">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            <p className="font-medium">{successMessage}</p>
          </div>
        </div>
      )}
      
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-lg p-4 bg-red-500 text-white shadow-lg max-w-md">
            <span className="material-symbols-outlined text-2xl">error</span>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}
      
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-[1200px] flex flex-col gap-8">{/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary dark:hover:text-white transition-colors"
            >
              Home
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <button
              onClick={() => navigate('/dashboard')}
              className="hover:text-primary dark:hover:text-white transition-colors"
            >
              Bills
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-slate-900 dark:text-white">{bill.name}</span>
          </div>

          {/* Bill Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {bill.name}
                </h1>
                {Number(bill.status) === 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                    OPEN
                  </span>
                )}
                {Number(bill.status) === 1 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    SETTLED
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>Created on {formattedDate}</span>
                <span className="hidden sm:inline">•</span>
                <span>Contract: {formatAddress(CONTRACT_ADDRESSES.BillSplitter)}</span>
              </div>
            </div>
            {isCreator && (
              <button
                onClick={copyBillLink}
                className="flex items-center gap-2 rounded-lg h-10 px-4 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-[#232f48] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Invite
              </button>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Bill */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Total Bill</p>
                <span className="material-symbols-outlined text-primary">receipt_long</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatUSDC(bill.totalAmount)} USDC
              </p>
            </div>

            {/* Your Share */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Your Share</p>
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {userShare > 0 && !Number.isNaN(userShare) ? formatUSDC(BigInt(Math.floor(userShare))) : '0.00'} USDC
              </p>
              {userParticipant && (
                <p className={`text-xs font-medium ${userParticipant.hasPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  Status: {userParticipant.hasPaid ? 'Paid' : 'Unpaid'}
                </p>
              )}
            </div>

            {/* Collected */}
            <div className="flex flex-col gap-3 rounded-xl p-6 bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase">Collected</p>
                <span className="material-symbols-outlined text-primary">savings</span>
              </div>
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {formatUSDC(Number.isNaN(collectedAmount) ? 0n : BigInt(Math.floor(collectedAmount)))} USDC
              </p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{Math.round(collectedPercentage)}% Complete</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${collectedPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment CTA Banner */}
          {userParticipant && !userParticipant.hasPaid && Number(bill.status) === 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl p-6 bg-primary/10 dark:bg-primary/20 border border-primary/20">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    You owe {formatUSDC(userParticipant.amount)} USDC
                  </p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Settle your share instantly on-chain. Gas fees apply.
                </p>
              </div>
              <button
                onClick={handlePayShare}
                disabled={paying}
                className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
              >
                {paying ? 'Processing...' : `Pay ${formatUSDC(userParticipant.amount)} USDC`}
              </button>
            </div>
          )}

          {/* Participants Table */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-[#324467] flex items-center justify-between">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">Participants</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">{bill.participants?.length || 0} people</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-[#151c2b] border-b border-slate-200 dark:border-[#324467]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Share</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#324467]">
                  {bill.participants?.map((participant: Participant, index: number) => {
                    try {
                      const isUser = participant.wallet?.toLowerCase() === address?.toLowerCase();
                      const avatarColors = ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'];
                      const avatarColor = avatarColors[index % avatarColors.length];
                      
                      return (
                        <tr key={`${participant.wallet}-${index}`} className="group hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`size-10 rounded-full ${avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                              {isUser ? 'ME' : participant.wallet.slice(2, 4).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-slate-900 dark:text-white">
                                {isUser ? 'You' : formatAddress(participant.wallet)}
                              </span>
                              {participant.wallet.toLowerCase() === bill.creator.toLowerCase() && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">Creator</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                          {formatUSDC(participant.amount)} USDC
                        </td>
                        <td className="px-6 py-4">
                          {participant.hasPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                              <span className="size-1.5 rounded-full bg-emerald-500"></span>
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                              <span className="size-1.5 rounded-full bg-amber-500"></span>
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isUser && !participant.hasPaid && Number(bill.status) === 0 ? (
                            <button
                              onClick={handlePayShare}
                              disabled={paying}
                              className="inline-flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <button
                              className="text-slate-400 hover:text-primary dark:hover:text-white transition-colors p-1"
                              onClick={() => window.open(`https://etherscan.io/address/${participant.wallet}`, '_blank')}
                            >
                              <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                    } catch (error) {
                      console.error('Error rendering participant:', error);
                      return null;
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Section */}
          <div className="rounded-xl border border-slate-200 dark:border-[#324467] bg-white dark:bg-[#192233] shadow-sm p-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">Activity</h3>
            <div className="flex flex-col gap-4">
              {/* Bill Created */}
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Bill Created</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formattedDate}, {createdDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} {createdDate.toLocaleTimeString('en-US', { hour: 'numeric' }).includes('PM') ? 'PM' : 'AM'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By {isCreator ? 'You' : formatAddress(bill.creator)} ({formatAddress(bill.creator)})
                  </p>
                </div>
              </div>

              {/* Payment Activities */}
              {[...bill.participants]
                .filter(p => p.hasPaid && p.paidAt > 0n)
                .sort((a, b) => Number(b.paidAt) - Number(a.paidAt))
                .map((participant, index) => {
                  const paidDate = new Date(Number(participant.paidAt) * 1000);
                  const timeAgo = getTimeAgo(paidDate);
                  
                  return (
                    <div key={`${participant.wallet}-${index}`} className="flex items-start gap-3">
                      <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        <span className="material-symbols-outlined text-[18px] filled">check_circle</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {formatAddress(participant.wallet)} Paid
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{timeAgo}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Transaction confirmed on block #{Number(participant.paidAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillDetails;


