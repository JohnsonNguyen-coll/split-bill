import { Link } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const Welcome = () => {
  const { isConnected, connect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-[#232f48] bg-background-dark/80 backdrop-blur-md">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-3">
          <div className="flex w-full max-w-[1200px] items-center justify-between">
            <Link to="/" className="flex items-center gap-4 text-white cursor-pointer">
              <div className="size-8 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined !text-3xl">account_balance_wallet</span>
              </div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">On-chain Splitter</h2>
            </Link>
            <div className="flex items-center gap-4 md:gap-8">
              <div className="hidden md:flex items-center gap-6">
                <a href="#how-it-works" className="text-slate-300 hover:text-white text-sm font-medium leading-normal transition-colors">How it works</a>
                <a href="#docs" className="text-slate-300 hover:text-white text-sm font-medium leading-normal transition-colors">Documentation</a>
              </div>
              {isConnected ? (
                <Link
                  to="/dashboard"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={handleConnect}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-col gap-6 py-10 lg:flex-row-reverse lg:items-center">
              {/* Hero Image */}
              <div className="w-full lg:w-1/2 aspect-video lg:aspect-square max-h-[400px] lg:max-h-[500px] bg-center bg-no-repeat bg-cover rounded-xl overflow-hidden shadow-2xl border border-[#232f48]" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqfUr1ELQQpu88XymffUB2kQ-kNhv31ftzOe-pCMttJt8il3-4MSIPdgPtXtTn2DjL9gfoUj9FylWzR5j4Z027R0yUht1lUIHSRb8IKc18y-ZlItJ_bGWkoVuU3j2tR-soCShKbTgGtx-n03oON2P3M4xSYsZnDoS2w6bCHkI307MWrxqUXSTQTqTNOkW02AUFSvtuvHMcoYMmJJvIT8mSpkAr_inAIsp8YklROyeDOv59Yoo4FO_Tudq4EAdTGQhPscTr8OZVjtBy")'}}>
                <div className="w-full h-full bg-gradient-to-t from-background-dark/80 to-transparent"></div>
              </div>
              {/* Hero Content */}
              <div className="flex flex-col gap-6 lg:w-1/2 lg:pr-10">
                <div className="flex flex-col gap-4 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
                    <span className="material-symbols-outlined text-primary !text-sm">verified_user</span>
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">Audited & Secure</span>
                  </div>
                  <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
                    Split Bills <br/><span className="text-primary">Seamlessly</span> with USDC
                  </h1>
                  <h2 className="text-slate-400 text-lg font-normal leading-relaxed max-w-[600px]">
                    The transparent, on-chain solution for group expenses. Invite wallets, track spending, and auto-settle instantly without crypto volatility.
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  {isConnected ? (
                    <Link
                      to="/create"
                      className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(19,91,236,0.3)] text-white text-base font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="material-symbols-outlined mr-2 !text-xl">add_circle</span>
                      <span className="truncate">Create a New Bill</span>
                    </Link>
                  ) : (
                    <button
                      onClick={handleConnect}
                      className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(19,91,236,0.3)] text-white text-base font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="material-symbols-outlined mr-2 !text-xl">wallet</span>
                      <span className="truncate">Connect Wallet</span>
                    </button>
                  )}
                  <a 
                    href="#why-settle-onchain"
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#232f48] hover:bg-[#2f3e5c] transition-all border border-[#324467] text-white text-base font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Read Docs</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[#232f48] bg-[#151b28]">
        <div className="px-4 md:px-10 lg:px-40 flex justify-center py-8">
          <div className="flex flex-col max-w-[1200px] w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#324467] bg-background-dark/50 hover:bg-[#192233] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                  <span className="material-symbols-outlined !text-6xl text-primary">payments</span>
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Settled</p>
                <p className="text-white text-3xl font-bold leading-tight flex items-baseline gap-1">
                  $1.2M+ <span className="text-primary text-sm font-normal">USDC</span>
                </p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#324467] bg-background-dark/50 hover:bg-[#192233] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                  <span className="material-symbols-outlined !text-6xl text-primary">groups</span>
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Groups</p>
                <p className="text-white text-3xl font-bold leading-tight">450+</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-[#324467] bg-background-dark/50 hover:bg-[#192233] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                  <span className="material-symbols-outlined !text-6xl text-primary">timer</span>
                </div>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Avg Settlement Time</p>
                <p className="text-white text-3xl font-bold leading-tight">&lt; 2 mins</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="why-settle-onchain" className="flex flex-col py-12 md:py-20">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
          <div className="flex flex-col max-w-[1200px] flex-1">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4 text-center items-center">
                <h2 className="text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight max-w-[720px]">
                  Why settle on-chain?
                </h2>
                <p className="text-slate-400 text-lg font-normal leading-normal max-w-[720px]">
                  Experience the future of expense sharing with the security and transparency of blockchain technology.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="flex flex-1 gap-4 rounded-xl border border-[#324467] bg-[#192233] p-8 flex-col hover:border-primary/50 transition-colors">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined !text-3xl">currency_exchange</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold leading-tight">Instant Settlement</h3>
                    <p className="text-slate-400 text-base font-normal leading-relaxed">
                      Settlements happen in seconds using USDC. No need to wait for bank transfers or deal with volatile token prices.
                    </p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="flex flex-1 gap-4 rounded-xl border border-[#324467] bg-[#192233] p-8 flex-col hover:border-primary/50 transition-colors">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined !text-3xl">hub</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold leading-tight">Multi-Wallet Support</h3>
                    <p className="text-slate-400 text-base font-normal leading-relaxed">
                      Add friends easily via their public address or ENS domains. Manage multiple groups seamlessly from one dashboard.
                    </p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="flex flex-1 gap-4 rounded-xl border border-[#324467] bg-[#192233] p-8 flex-col hover:border-primary/50 transition-colors">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined !text-3xl">history_edu</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-xl font-bold leading-tight">Transparent Ledger</h3>
                    <p className="text-slate-400 text-base font-normal leading-relaxed">
                      All transactions are recorded on-chain for immutable, verifiable history. No more disputes about who paid what.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="how-it-works" className="flex flex-col py-12 md:py-20 bg-[#151b28]">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="mb-12 text-center">
              <h2 className="text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">
                How it works
              </h2>
            </div>
            <div className="grid grid-cols-[60px_1fr] gap-x-4 px-4 md:px-20">
              {/* Step 1 */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/25 z-10">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div className="w-[2px] bg-[#324467] h-full grow min-h-[80px]"></div>
              </div>
              <div className="flex flex-1 flex-col py-2 pb-12 pl-4">
                <p className="text-primary text-sm font-bold uppercase tracking-wide mb-1">Step 1</p>
                <h3 className="text-white text-2xl font-bold leading-tight mb-2">Create a Bill</h3>
                <p className="text-slate-400 text-base font-normal leading-normal">
                  Connect your wallet and create a new expense bill. Describe the event (e.g., "Dinner at Mario's") and set the total amount in USDC.
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[2px] bg-[#324467] h-4"></div>
                <div className="size-12 rounded-full bg-[#232f48] border-2 border-[#324467] flex items-center justify-center text-slate-300 z-10">
                  <span className="material-symbols-outlined">group_add</span>
                </div>
                <div className="w-[2px] bg-[#324467] h-full grow min-h-[80px]"></div>
              </div>
              <div className="flex flex-1 flex-col py-2 pb-12 pl-4">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-1">Step 2</p>
                <h3 className="text-white text-2xl font-bold leading-tight mb-2">Invite Wallets</h3>
                <p className="text-slate-400 text-base font-normal leading-normal">
                  Add participants by pasting their wallet addresses or ENS names. Assign split percentages or equal shares instantly.
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex flex-col items-center gap-2 pb-3">
                <div className="w-[2px] bg-[#324467] h-4"></div>
                <div className="size-12 rounded-full bg-[#232f48] border-2 border-[#324467] flex items-center justify-center text-slate-300 z-10">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col py-2 pl-4">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-wide mb-1">Step 3</p>
                <h3 className="text-white text-2xl font-bold leading-tight mb-2">Auto-Settle</h3>
                <p className="text-slate-400 text-base font-normal leading-normal">
                  Participants approve the transaction, and the smart contract automatically routes USDC from their wallets to the payer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-[1200px] mx-auto rounded-2xl bg-gradient-to-r from-[#135bec] to-[#0c3c9f] p-10 md:p-16 text-center relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-white text-3xl md:text-5xl font-black tracking-tight max-w-[800px]">
              Ready to split bills the Web3 way?
            </h2>
            <p className="text-blue-100 text-lg max-w-[600px]">
              Join over 450+ groups settling expenses instantly and transparently on-chain.
            </p>
            {isConnected ? (
              <Link
                to="/create"
                className="mt-4 flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white hover:bg-gray-100 transition-colors text-primary text-lg font-bold leading-normal tracking-[0.015em] shadow-xl"
              >
                <span className="truncate">Launch App</span>
              </Link>
            ) : (
              <button
                onClick={handleConnect}
                className="mt-4 flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white hover:bg-gray-100 transition-colors text-primary text-lg font-bold leading-normal tracking-[0.015em] shadow-xl"
              >
                <span className="truncate">Launch App</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#232f48] bg-background-dark pt-12 pb-8">
        <div className="px-4 md:px-10 lg:px-40">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="flex flex-col gap-4 max-w-[300px]">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined !text-2xl text-primary">account_balance_wallet</span>
                <span className="text-lg font-bold">On-chain Splitter</span>
              </div>
              <p className="text-slate-500 text-sm">
                The decentralized way to manage shared expenses. Built on Ethereum for transparency and trust.
              </p>
            </div>
            <div className="flex flex-wrap gap-12">
              <div className="flex flex-col gap-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Product</h4>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Features</a>
                <a href="#how-it-works" className="text-slate-400 hover:text-primary transition-colors text-sm">How it works</a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Pricing</a>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Resources</h4>
                <a href="#why-settle-onchain" className="text-slate-400 hover:text-primary transition-colors text-sm">Documentation</a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">API Reference</a>
                <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Smart Contract Audit</a>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Community</h4>
                <a href="https://x.com/Johson_Nguyen" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors text-sm">Twitter</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#232f48] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">© 2026 On-chain Bill Splitter. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-600 hover:text-slate-400 text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-600 hover:text-slate-400 text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;

