import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWallet } from '../hooks/useWallet';
import { getBillSplitterContractReadOnly, getBillSplitterContract, getUSDCContract, formatUSDC } from '../utils/web3';
import { CONTRACT_ADDRESSES } from '../config/constants';

const InvitePage = () => {
  const { billId } = useParams<{ billId: string }>();
  const { address, isConnected, connect } = useWallet();
  const [amountOwed, setAmountOwed] = useState<bigint | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [billName, setBillName] = useState('');

  useEffect(() => {
    if (billId) {
      loadBillInfo();
    }
  }, [billId, address]);

  const loadBillInfo = async () => {
    if (!billId) return;

    try {
      setLoading(true);
      const contract = getBillSplitterContractReadOnly();
      
      // Check if user is participant
      if (address) {
        try {
          const participant = await contract.isParticipant(billId, address);
          setIsParticipant(participant);
          
          if (participant) {
            const [amount, paid] = await contract.getAmountOwed(billId, address);
            setAmountOwed(amount);
            setHasPaid(paid);
          }
        } catch {
          setIsParticipant(false);
        }
      }

      // Get bill name
      try {
        const bill = await contract.getBill(billId);
        setBillName(bill.name);
      } catch {
        // Ignore
      }
    } catch (error) {
      console.error('Error loading bill info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet');
    }
  };

  const handlePayShare = async () => {
    if (!billId || !address || !amountOwed) return;

    try {
      setPaying(true);

      // Approve USDC
      const usdcContract = await getUSDCContract();
      const allowance = await usdcContract.allowance(address, CONTRACT_ADDRESSES.BillSplitter);
      
      if (allowance < amountOwed) {
        const approveTx = await usdcContract.approve(CONTRACT_ADDRESSES.BillSplitter, amountOwed);
        await approveTx.wait();
      }

      // Pay share
      const contract = await getBillSplitterContract();
      const tx = await contract.payShare(billId);
      await tx.wait();

      setHasPaid(true);
      alert('Payment successful!');
    } catch (error: any) {
      console.error('Error paying share:', error);
      alert(error.message || 'Failed to pay share');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[600px] flex flex-col gap-6">
          <div className="bg-white dark:bg-[#192233] rounded-xl border border-slate-200 dark:border-[#324467] p-6 md:p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {billName || 'Bill Invitation'}
            </h1>
            <p className="text-slate-500 dark:text-[#92a4c9] mb-6">Bill ID: {billId}</p>

            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Connect your wallet to view your share
                </p>
                <button
                  onClick={handleConnect}
                  className="inline-flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors"
                >
                  <span className="material-symbols-outlined">wallet</span>
                  Connect Wallet
                </button>
              </div>
            ) : !isParticipant ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  You are not a participant in this bill
                </p>
              </div>
            ) : hasPaid ? (
              <div className="text-center py-8">
                <div className="size-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400">check_circle</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">Payment Complete!</p>
                <p className="text-slate-500 dark:text-slate-400">
                  You have paid {amountOwed ? formatUSDC(amountOwed) : ''} USDC
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Your Share</p>
                  <p className="text-4xl font-bold text-slate-900 dark:text-white">
                    {amountOwed ? formatUSDC(amountOwed) : '0.00'} USDC
                  </p>
                </div>

                <button
                  onClick={handlePayShare}
                  disabled={paying}
                  className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {paying ? 'Processing...' : `Pay ${amountOwed ? formatUSDC(amountOwed) : ''} USDC`}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvitePage;


