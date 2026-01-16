import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { formatAddress } from '../utils/web3';

const Navbar = () => {
  const { address, isConnected, connect, disconnect } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-md">
      <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block cursor-pointer" onClick={() => navigate('/')}>
            On-Chain Splitter
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="text-sm font-bold text-primary">
            Dashboard
          </Link>
          <Link to="/create" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
            Create Bill
          </Link>
          <Link to="/history" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors">
            History
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Network</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-500"></span>
              Arc Testnet
            </span>
          </div>
          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-[#92a4c9]">
                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                <span>{formatAddress(address)}</span>
              </div>
              <button
                onClick={disconnect}
                className="flex items-center gap-2 cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">wallet</span>
                <span className="truncate max-w-[100px]">{formatAddress(address)}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="flex items-center gap-2 cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">wallet</span>
              <span className="truncate">Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;


