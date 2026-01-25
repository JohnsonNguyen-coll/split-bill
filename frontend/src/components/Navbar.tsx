import { Link, useNavigate, useLocation } from 'react-router-dom';
import { WalletConnectButton } from './ConnectButton';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-md">
      <div className="px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary cursor-pointer" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden sm:block cursor-pointer text-white" onClick={() => navigate('/')}>
            On-Chain Splitter
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/dashboard" 
            className={`text-sm font-${isActive('/dashboard') ? 'bold text-primary' : 'medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'} transition-colors`}
          >
            Dashboard
          </Link>
          <Link 
            to="/create" 
            className={`text-sm font-${isActive('/create') ? 'bold text-primary' : 'medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'} transition-colors`}
          >
            Create Bill
          </Link>
          <Link 
            to="/history" 
            className={`text-sm font-${isActive('/history') ? 'bold text-primary' : 'medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white'} transition-colors`}
          >
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
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;


