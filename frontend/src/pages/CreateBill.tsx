import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWallet } from '../contexts/WalletContext';
import { getBillSplitterContract, parseUSDC, formatAddress } from '../utils/web3';
import { ethers } from 'ethers';

interface Participant {
  address: string;
  amount: string;
}

const CreateBill = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const [billName, setBillName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [deadline, setDeadline] = useState('');
  const [recipient, setRecipient] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [creatorIncluded, setCreatorIncluded] = useState(false); // New state for creator inclusion
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add participant
  const addParticipant = () => {
    setParticipants([...participants, { address: '', amount: '' }]);
  };

  // Remove participant
  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  // Update participant
  const updateParticipant = (index: number, field: 'address' | 'amount', value: string) => {
    const updated = [...participants];
    // Trim whitespace for addresses
    if (field === 'address') {
      updated[index][field] = value.trim();
    } else {
      updated[index][field] = value;
    }
    setParticipants(updated);
  };

  // Validate and calculate total allocated
  const getTotalAllocated = (): number => {
    if (splitType === 'equal') {
      return parseFloat(totalAmount) || 0;
    } else {
      // Custom split
      const participantsTotal = participants.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      
      if (creatorIncluded) {
        // Creator's amount is auto-calculated by smart contract
        // Total allocated = participants total + (totalAmount - participants total) = totalAmount
        return parseFloat(totalAmount) || 0;
      } else {
        // Creator not included, return participants total
        return participantsTotal;
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isConnected || !address) {
      setError('Please connect your wallet');
      return;
    }

    if (!billName || !totalAmount || !deadline || !recipient) {
      setError('Please fill in all required fields');
      return;
    }

    if (!ethers.isAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }

    if (participants.length === 0) {
      setError('Please add at least one participant');
      return;
    }

    // Validate participant addresses
    for (const p of participants) {
      if (!p.address || !ethers.isAddress(p.address)) {
        setError('Invalid participant address');
        return;
      }
    }

    try {
      setLoading(true);

      const contract = await getBillSplitterContract();
      const totalAmountParsed = parseUSDC(totalAmount);
      const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

      // Validate deadline is in the future
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (deadlineTimestamp <= currentTimestamp) {
        setError('Deadline must be in the future');
        setLoading(false);
        return;
      }

      const participantAddresses = participants.map(p => p.address);
      let amounts: bigint[] = [];

      if (splitType === 'equal') {
        // Empty array for equal split
        amounts = [];
      } else {
        // Custom amounts - only include participants, NOT creator
        // Smart contract will automatically calculate creator's amount if creatorIncluded is true
        amounts = participants.map(p => parseUSDC(p.amount));
      }

      // Validate total for custom split
      if (splitType === 'custom') {
        const participantsTotal = participants.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        
        if (creatorIncluded) {
          // Smart contract will auto-calculate creator's amount as: totalAmount - participantsTotal
          // So we just need to ensure participantsTotal < totalAmount
          if (participantsTotal >= parseFloat(totalAmount)) {
            setError(`Participants' total (${participantsTotal.toFixed(2)}) must be less than bill total (${totalAmount}) to leave room for creator's share`);
            setLoading(false);
            return;
          }
        } else {
          // Creator not included, so participants must equal total
          if (Math.abs(participantsTotal - parseFloat(totalAmount)) > 0.01) {
            setError(`Total allocated (${participantsTotal.toFixed(2)}) doesn't match bill total (${totalAmount})`);
            setLoading(false);
            return;
          }
        }
      }

      // Add creator as recipient if not specified
      const recipientAddress = recipient || address;

      const tx = await contract.createBill(
        billName,
        totalAmountParsed,
        recipientAddress,
        participantAddresses,
        amounts,
        deadlineTimestamp,
        creatorIncluded // Pass the new parameter
      );

      // Get receipt from tx.wait() which already returns the receipt
      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'BillCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = contract.interface.parseLog(event);
        const billId = parsed?.args[0];
        navigate(`/bill/${billId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Error creating bill:', err);
      
      // Check if user rejected the transaction
      if (err.code === 'ACTION_REJECTED' || err.code === 4001 || err.message?.includes('user rejected')) {
        setError('Transaction cancelled by user');
      } else {
        setError(err.message || 'Failed to create bill');
      }
    } finally {
      setLoading(false);
    }
  };

  const totalAllocated = getTotalAllocated();
  const isValid = Math.abs(totalAllocated - parseFloat(totalAmount || '0')) < 0.01;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[800px] flex flex-col gap-6">
          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1 text-sm text-slate-500 dark:text-[#92a4c9] hover:text-primary dark:hover:text-primary transition-colors w-fit"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Dashboard
            </button>
            <div className="flex flex-col gap-1 mt-2">
              <h1 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Create New Bill</h1>
              <p className="text-slate-500 dark:text-[#92a4c9] text-base font-normal">Create a bill to split expenses on-chain using USDC.</p>
            </div>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#192233] rounded-xl border border-slate-200 dark:border-[#324467] p-6 md:p-8 shadow-sm">
            {error && (
              <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Bill Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <label className="flex flex-col flex-1 gap-2">
                <span className="text-slate-900 dark:text-white text-sm font-medium">Bill Name</span>
                <input
                  type="text"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  placeholder="e.g. Friday Dinner"
                  className="flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] px-4 text-base font-normal transition-all"
                  required
                />
              </label>
              <label className="flex flex-col flex-1 gap-2">
                <span className="text-slate-900 dark:text-white text-sm font-medium">Total Amount</span>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] pl-4 pr-16 text-base font-bold transition-all"
                    required
                  />
                  <div className="absolute right-4 pointer-events-none">
                    <span className="text-slate-500 dark:text-[#92a4c9] text-sm font-bold">USDC</span>
                  </div>
                </div>
              </label>
              <label className="flex flex-col flex-1 gap-2">
                <span className="text-slate-900 dark:text-white text-sm font-medium">Recipient Address</span>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] px-4 text-base font-normal transition-all"
                  required
                />
              </label>
              <label className="flex flex-col flex-1 gap-2">
                <span className="text-slate-900 dark:text-white text-sm font-medium">Deadline</span>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date(Date.now() + 60000).toISOString().slice(0, 16)} // At least 1 minute in the future
                  className="flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] focus:border-primary h-12 px-4 text-base font-normal transition-all [color-scheme:dark]"
                  required
                />
              </label>
            </div>

            {/* Split Method */}
            <div className="mb-6">
              <h3 className="text-slate-900 dark:text-white text-sm font-medium mb-3">Split Method</h3>
              <div className="flex p-1 bg-slate-100 dark:bg-[#111722] rounded-lg w-full md:w-fit border border-slate-200 dark:border-[#324467]">
                <button
                  type="button"
                  onClick={() => setSplitType('equal')}
                  className={`flex-1 md:flex-none py-2 px-4 rounded-md text-sm font-medium text-center transition-all ${
                    splitType === 'equal'
                      ? 'bg-white dark:bg-[#232f48] text-primary dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-[#92a4c9]'
                  }`}
                >
                  Split Evenly
                </button>
                <button
                  type="button"
                  onClick={() => setSplitType('custom')}
                  className={`flex-1 md:flex-none py-2 px-4 rounded-md text-sm font-medium text-center transition-all ${
                    splitType === 'custom'
                      ? 'bg-white dark:bg-[#232f48] text-primary dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-[#92a4c9]'
                  }`}
                >
                  Custom Amounts
                </button>
              </div>
            </div>

            {/* Creator Inclusion Option */}
            <div className="mb-6">
              <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-[#111722] border-2 border-slate-200 dark:border-[#324467] rounded-lg cursor-pointer group hover:border-primary dark:hover:border-primary transition-all">
                <div className="relative flex items-center flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={creatorIncluded}
                    onChange={(e) => setCreatorIncluded(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-[#192233] checked:bg-primary checked:border-primary transition-all"
                  />
                  <span className="absolute left-[3px] top-[3px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-slate-900 dark:text-white text-sm font-medium">
                    Include me in payment
                  </span>
                  <span className="text-slate-500 dark:text-[#92a4c9] text-xs">
                    {creatorIncluded 
                      ? "You'll pay your share along with other participants" 
                      : "You're just collecting - won't pay, only receive"}
                  </span>
                </div>
              </label>
            </div>

            {/* Participants */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-slate-900 dark:text-white text-sm font-medium">Participants</h3>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="flex items-center gap-1.5 text-primary text-sm font-bold hover:text-blue-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Add Participant
                </button>
              </div>

              <div className="border border-slate-200 dark:border-[#324467] rounded-lg overflow-hidden bg-slate-50 dark:bg-[#111722]">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-100 dark:bg-[#232f48] border-b border-slate-200 dark:border-[#324467] text-xs font-semibold text-slate-500 dark:text-[#92a4c9] uppercase tracking-wider">
                  <div className="col-span-6">Wallet Address / ENS</div>
                  <div className="col-span-3">Amount (USDC)</div>
                  <div className="col-span-2">Share (%)</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>

                {/* Creator Row - Only show if included */}
                {address && creatorIncluded && (
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 md:items-center border-b border-slate-200 dark:border-[#324467] last:border-0 bg-blue-50/50 dark:bg-blue-900/5">
                    <div className="col-span-6 flex flex-col gap-1">
                      <span className="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Wallet</span>
                      <div className="flex items-center gap-2">
                        <div className="size-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0"></div>
                        <div className="flex flex-col">
                          <span className="text-slate-900 dark:text-white text-sm font-medium">You (Creator)</span>
                          <span className="text-slate-400 dark:text-slate-500 text-xs">{formatAddress(address)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 flex flex-col gap-1">
                      <span className="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Amount</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={splitType === 'equal' && totalAmount && participants.length > 0 
                            ? (parseFloat(totalAmount) / (participants.length + 1)).toFixed(2) 
                            : splitType === 'custom' && totalAmount && participants.length > 0
                              ? (parseFloat(totalAmount) - participants.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)).toFixed(2)
                              : '0.00'}
                          readOnly
                          placeholder="Auto"
                          className="w-full bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-500 dark:text-[#92a4c9] text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                      <span className="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Share %</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={splitType === 'equal' && participants.length > 0 
                            ? `${(100 / (participants.length + 1)).toFixed(0)}%` 
                            : splitType === 'custom' && totalAmount && participants.length > 0
                              ? `${(((parseFloat(totalAmount) - participants.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)) / parseFloat(totalAmount)) * 100).toFixed(0)}%`
                              : '0%'}
                          readOnly
                          className="w-full bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-500 dark:text-[#92a4c9] text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20">
                        Paying
                      </span>
                    </div>
                  </div>
                )}

                {/* Participant Rows */}
                {participants.map((participant, index) => (
                  <div key={index} className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 md:items-center border-b border-slate-200 dark:border-[#324467] last:border-0 group">
                    <div className="col-span-6 flex flex-col gap-1">
                      <span className="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Wallet</span>
                      <input
                        type="text"
                        value={participant.address}
                        onChange={(e) => updateParticipant(index, 'address', e.target.value)}
                        placeholder={participant.address ? "0x..." : "Enter wallet address or ENS"}
                        className="w-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-900 dark:text-white text-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        required
                      />
                    </div>
                    <div className="col-span-3 flex flex-col gap-1">
                      <span className="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Amount</span>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={participant.amount}
                          onChange={(e) => updateParticipant(index, 'amount', e.target.value)}
                          placeholder={splitType === 'equal' ? 'Auto' : '0.00'}
                          readOnly={splitType === 'equal'}
                          className="w-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-900 dark:text-white text-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary"
                          required={splitType === 'custom'}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                      <span className="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Share %</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={participants.length > 0 
                            ? `${(100 / (creatorIncluded ? participants.length + 1 : participants.length)).toFixed(0)}%` 
                            : '0%'}
                          readOnly
                          className="w-full bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-500 dark:text-[#92a4c9] text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        aria-label="Remove participant"
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#324467] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#92a4c9]">
                  <span>Total Allocated:</span>
                  <span className="font-bold text-slate-900 dark:text-white">${totalAllocated.toFixed(2)} USDC</span>
                </div>
                {isValid ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                    <span>Split Matches Total Bill</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    <span>Amounts don't match total</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full sm:w-auto flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-base font-bold leading-normal tracking-[0.015em] transition shadow-lg shadow-blue-500/20"
              >
                <span className="truncate">{loading ? 'Creating...' : 'Create Bill'}</span>
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-400 dark:text-slate-600">
            By creating this bill, you agree to the On-chain Splitter Terms of Service.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CreateBill;


