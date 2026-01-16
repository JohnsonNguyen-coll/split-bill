// <!DOCTYPE html>

// <html class="dark" lang="en"><head>
// <meta charset="utf-8"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
// <title>On-chain Bill Splitter</title>
// <link href="https://fonts.googleapis.com" rel="preconnect"/>
// <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
// <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <script id="tailwind-config">
//         tailwind.config = {
//             darkMode: "class",
//             theme: {
//                 extend: {
//                     colors: {
//                         "primary": "#135bec",
//                         "background-light": "#f6f6f8",
//                         "background-dark": "#101622",
//                     },
//                     fontFamily: {
//                         "display": ["Manrope", "sans-serif"]
//                     },
//                     borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
//                 },
//             },
//         }
//     </script>
// <style>
//         .material-symbols-outlined {
//             font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
//         }
//     </style>
// </head>
// <body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-x-hidden">
// <!-- Main Container -->
// <div class="relative flex min-h-screen w-full flex-col group/design-root">
// <!-- Navbar -->
// <header class="sticky top-0 z-50 w-full border-b border-solid border-[#232f48] bg-background-dark/80 backdrop-blur-md">
// <div class="layout-container flex h-full grow flex-col">
// <div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-3">
// <div class="layout-content-container flex w-full max-w-[1200px] items-center justify-between">
// <div class="flex items-center gap-4 text-white cursor-pointer">
// <div class="size-8 flex items-center justify-center text-primary">
// <span class="material-symbols-outlined !text-3xl">account_balance_wallet</span>
// </div>
// <h2 class="text-white text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">On-chain Splitter</h2>
// </div>
// <div class="flex items-center gap-4 md:gap-8">
// <div class="hidden md:flex items-center gap-6">
// <a class="text-slate-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">How it works</a>
// <a class="text-slate-300 hover:text-white text-sm font-medium leading-normal transition-colors" href="#">Documentation</a>
// </div>
// <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
// <span class="truncate">Connect Wallet</span>
// </button>
// </div>
// </div>
// </div>
// </div>
// </header>
// <!-- Hero Section -->
// <section class="flex flex-col">
// <div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
// <div class="layout-content-container flex flex-col max-w-[1200px] flex-1">
// <div class="@container">
// <div class="flex flex-col gap-6 py-10 lg:flex-row-reverse lg:items-center">
// <!-- Hero Image -->
// <div class="w-full lg:w-1/2 aspect-video lg:aspect-square max-h-[400px] lg:max-h-[500px] bg-center bg-no-repeat bg-cover rounded-xl overflow-hidden shadow-2xl border border-[#232f48]" data-alt="Abstract 3D illustration of digital coins flowing between connected nodes in a dark network" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDqfUr1ELQQpu88XymffUB2kQ-kNhv31ftzOe-pCMttJt8il3-4MSIPdgPtXtTn2DjL9gfoUj9FylWzR5j4Z027R0yUht1lUIHSRb8IKc18y-ZlItJ_bGWkoVuU3j2tR-soCShKbTgGtx-n03oON2P3M4xSYsZnDoS2w6bCHkI307MWrxqUXSTQTqTNOkW02AUFSvtuvHMcoYMmJJvIT8mSpkAr_inAIsp8YklROyeDOv59Yoo4FO_Tudq4EAdTGQhPscTr8OZVjtBy");'>
// <div class="w-full h-full bg-gradient-to-t from-background-dark/80 to-transparent"></div>
// </div>
// <!-- Hero Content -->
// <div class="flex flex-col gap-6 lg:w-1/2 lg:pr-10">
// <div class="flex flex-col gap-4 text-left">
// <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
// <span class="material-symbols-outlined text-primary !text-sm">verified_user</span>
// <span class="text-primary text-xs font-bold uppercase tracking-wider">Audited &amp; Secure</span>
// </div>
// <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl lg:text-6xl">
//                                         Split Bills <br/><span class="text-primary">Seamlessly</span> with USDC
//                                     </h1>
// <h2 class="text-slate-400 text-lg font-normal leading-relaxed max-w-[600px]">
//                                         The transparent, on-chain solution for group expenses. Invite wallets, track spending, and auto-settle instantly without crypto volatility.
//                                     </h2>
// </div>
// <div class="flex flex-wrap gap-3 mt-2">
// <button class="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(19,91,236,0.3)] text-white text-base font-bold leading-normal tracking-[0.015em]">
// <span class="material-symbols-outlined mr-2 !text-xl">add_circle</span>
// <span class="truncate">Create a New Bill</span>
// </button>
// <button class="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#232f48] hover:bg-[#2f3e5c] transition-all border border-[#324467] text-white text-base font-bold leading-normal tracking-[0.015em]">
// <span class="truncate">Read Docs</span>
// </button>
// </div>
// <div class="flex items-center gap-2 text-slate-500 text-sm mt-2">
// <span class="material-symbols-outlined !text-lg">check_circle</span>
// <span>No gas fees for settlements on L2</span>
// </div>
// </div>
// </div>
// </div>
// </div>
// </div>
// </section>
// <!-- Stats Section -->
// <section class="border-y border-[#232f48] bg-[#151b28]">
// <div class="px-4 md:px-10 lg:px-40 flex justify-center py-8">
// <div class="layout-content-container flex flex-col max-w-[1200px] w-full">
// <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
// <div class="flex flex-col gap-2 rounded-xl p-6 border border-[#324467] bg-background-dark/50 hover:bg-[#192233] transition-colors relative overflow-hidden group">
// <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
// <span class="material-symbols-outlined !text-6xl text-primary">payments</span>
// </div>
// <p class="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Settled</p>
// <p class="text-white text-3xl font-bold leading-tight flex items-baseline gap-1">
//                                 $1.2M+ <span class="text-primary text-sm font-normal">USDC</span>
// </p>
// </div>
// <div class="flex flex-col gap-2 rounded-xl p-6 border border-[#324467] bg-background-dark/50 hover:bg-[#192233] transition-colors relative overflow-hidden group">
// <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
// <span class="material-symbols-outlined !text-6xl text-primary">groups</span>
// </div>
// <p class="text-slate-400 text-sm font-medium uppercase tracking-wider">Active Groups</p>
// <p class="text-white text-3xl font-bold leading-tight">450+</p>
// </div>
// <div class="flex flex-col gap-2 rounded-xl p-6 border border-[#324467] bg-background-dark/50 hover:bg-[#192233] transition-colors relative overflow-hidden group">
// <div class="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
// <span class="material-symbols-outlined !text-6xl text-primary">timer</span>
// </div>
// <p class="text-slate-400 text-sm font-medium uppercase tracking-wider">Avg Settlement Time</p>
// <p class="text-white text-3xl font-bold leading-tight">&lt; 2 mins</p>
// </div>
// </div>
// </div>
// </div>
// </section>
// <!-- Features Section -->
// <section class="flex flex-col py-12 md:py-20">
// <div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
// <div class="layout-content-container flex flex-col max-w-[1200px] flex-1">
// <div class="flex flex-col gap-10">
// <div class="flex flex-col gap-4 text-center items-center">
// <h2 class="text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight max-w-[720px]">
//                                 Why settle on-chain?
//                             </h2>
// <p class="text-slate-400 text-lg font-normal leading-normal max-w-[720px]">
//                                 Experience the future of expense sharing with the security and transparency of blockchain technology.
//                             </p>
// </div>
// <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
// <!-- Feature 1 -->
// <div class="flex flex-1 gap-4 rounded-xl border border-[#324467] bg-[#192233] p-8 flex-col hover:border-primary/50 transition-colors">
// <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
// <span class="material-symbols-outlined !text-3xl">currency_exchange</span>
// </div>
// <div class="flex flex-col gap-2">
// <h3 class="text-white text-xl font-bold leading-tight">Instant Settlement</h3>
// <p class="text-slate-400 text-base font-normal leading-relaxed">
//                                         Settlements happen in seconds using USDC. No need to wait for bank transfers or deal with volatile token prices.
//                                     </p>
// </div>
// </div>
// <!-- Feature 2 -->
// <div class="flex flex-1 gap-4 rounded-xl border border-[#324467] bg-[#192233] p-8 flex-col hover:border-primary/50 transition-colors">
// <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
// <span class="material-symbols-outlined !text-3xl">hub</span>
// </div>
// <div class="flex flex-col gap-2">
// <h3 class="text-white text-xl font-bold leading-tight">Multi-Wallet Support</h3>
// <p class="text-slate-400 text-base font-normal leading-relaxed">
//                                         Add friends easily via their public address or ENS domains. Manage multiple groups seamlessly from one dashboard.
//                                     </p>
// </div>
// </div>
// <!-- Feature 3 -->
// <div class="flex flex-1 gap-4 rounded-xl border border-[#324467] bg-[#192233] p-8 flex-col hover:border-primary/50 transition-colors">
// <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
// <span class="material-symbols-outlined !text-3xl">history_edu</span>
// </div>
// <div class="flex flex-col gap-2">
// <h3 class="text-white text-xl font-bold leading-tight">Transparent Ledger</h3>
// <p class="text-slate-400 text-base font-normal leading-relaxed">
//                                         All transactions are recorded on-chain for immutable, verifiable history. No more disputes about who paid what.
//                                     </p>
// </div>
// </div>
// </div>
// </div>
// </div>
// </div>
// </section>
// <!-- Timeline Section -->
// <section class="flex flex-col py-12 md:py-20 bg-[#151b28]">
// <div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
// <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
// <div class="mb-12 text-center">
// <h2 class="text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">
//                             How it works
//                         </h2>
// </div>
// <div class="grid grid-cols-[60px_1fr] gap-x-4 px-4 md:px-20">
// <!-- Step 1 -->
// <div class="flex flex-col items-center gap-2 pt-2">
// <div class="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/25 z-10">
// <span class="material-symbols-outlined">receipt_long</span>
// </div>
// <div class="w-[2px] bg-[#324467] h-full grow min-h-[80px]"></div>
// </div>
// <div class="flex flex-1 flex-col py-2 pb-12 pl-4">
// <p class="text-primary text-sm font-bold uppercase tracking-wide mb-1">Step 1</p>
// <h3 class="text-white text-2xl font-bold leading-tight mb-2">Create a Bill</h3>
// <p class="text-slate-400 text-base font-normal leading-normal">
//                                 Connect your wallet and create a new expense bill. Describe the event (e.g., "Dinner at Mario's") and set the total amount in USDC.
//                             </p>
// </div>
// <!-- Step 2 -->
// <div class="flex flex-col items-center gap-2">
// <div class="w-[2px] bg-[#324467] h-4"></div>
// <div class="size-12 rounded-full bg-[#232f48] border-2 border-[#324467] flex items-center justify-center text-slate-300 z-10">
// <span class="material-symbols-outlined">group_add</span>
// </div>
// <div class="w-[2px] bg-[#324467] h-full grow min-h-[80px]"></div>
// </div>
// <div class="flex flex-1 flex-col py-2 pb-12 pl-4">
// <p class="text-slate-500 text-sm font-bold uppercase tracking-wide mb-1">Step 2</p>
// <h3 class="text-white text-2xl font-bold leading-tight mb-2">Invite Wallets</h3>
// <p class="text-slate-400 text-base font-normal leading-normal">
//                                 Add participants by pasting their wallet addresses or ENS names. Assign split percentages or equal shares instantly.
//                             </p>
// </div>
// <!-- Step 3 -->
// <div class="flex flex-col items-center gap-2 pb-3">
// <div class="w-[2px] bg-[#324467] h-4"></div>
// <div class="size-12 rounded-full bg-[#232f48] border-2 border-[#324467] flex items-center justify-center text-slate-300 z-10">
// <span class="material-symbols-outlined">check_circle</span>
// </div>
// </div>
// <div class="flex flex-1 flex-col py-2 pl-4">
// <p class="text-slate-500 text-sm font-bold uppercase tracking-wide mb-1">Step 3</p>
// <h3 class="text-white text-2xl font-bold leading-tight mb-2">Auto-Settle</h3>
// <p class="text-slate-400 text-base font-normal leading-normal">
//                                 Participants approve the transaction, and the smart contract automatically routes USDC from their wallets to the payer.
//                             </p>
// </div>
// </div>
// </div>
// </div>
// </section>
// <!-- CTA Section -->
// <section class="py-20 px-4">
// <div class="max-w-[1200px] mx-auto rounded-2xl bg-gradient-to-r from-[#135bec] to-[#0c3c9f] p-10 md:p-16 text-center relative overflow-hidden">
// <!-- Decorative background elements -->
// <div class="absolute top-0 left-0 w-full h-full opacity-10" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 30px 30px;"></div>
// <div class="relative z-10 flex flex-col items-center gap-6">
// <h2 class="text-white text-3xl md:text-5xl font-black tracking-tight max-w-[800px]">
//                         Ready to split bills the Web3 way?
//                     </h2>
// <p class="text-blue-100 text-lg max-w-[600px]">
//                         Join over 450+ groups settling expenses instantly and transparently on-chain.
//                     </p>
// <button class="mt-4 flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-white hover:bg-gray-100 transition-colors text-primary text-lg font-bold leading-normal tracking-[0.015em] shadow-xl">
// <span class="truncate">Launch App</span>
// </button>
// </div>
// </div>
// </section>
// <!-- Footer -->
// <footer class="border-t border-[#232f48] bg-background-dark pt-12 pb-8">
// <div class="layout-container px-4 md:px-10 lg:px-40">
// <div class="flex flex-col md:flex-row justify-between items-start gap-10">
// <div class="flex flex-col gap-4 max-w-[300px]">
// <div class="flex items-center gap-2 text-white">
// <span class="material-symbols-outlined !text-2xl text-primary">account_balance_wallet</span>
// <span class="text-lg font-bold">On-chain Splitter</span>
// </div>
// <p class="text-slate-500 text-sm">
//                             The decentralized way to manage shared expenses. Built on Ethereum for transparency and trust.
//                         </p>
// </div>
// <div class="flex flex-wrap gap-12">
// <div class="flex flex-col gap-3">
// <h4 class="text-white font-bold text-sm uppercase tracking-wider">Product</h4>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">Features</a>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">How it works</a>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">Pricing</a>
// </div>
// <div class="flex flex-col gap-3">
// <h4 class="text-white font-bold text-sm uppercase tracking-wider">Resources</h4>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">Documentation</a>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">API Reference</a>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">Smart Contract Audit</a>
// </div>
// <div class="flex flex-col gap-3">
// <h4 class="text-white font-bold text-sm uppercase tracking-wider">Community</h4>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">Discord</a>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">Twitter</a>
// <a class="text-slate-400 hover:text-primary transition-colors text-sm" href="#">GitHub</a>
// </div>
// </div>
// </div>
// <div class="mt-12 pt-8 border-t border-[#232f48] flex flex-col md:flex-row justify-between items-center gap-4">
// <p class="text-slate-600 text-sm">© 2023 On-chain Bill Splitter. All rights reserved.</p>
// <div class="flex gap-6">
// <a class="text-slate-600 hover:text-slate-400 text-sm" href="#">Privacy Policy</a>
// <a class="text-slate-600 hover:text-slate-400 text-sm" href="#">Terms of Service</a>
// </div>
// </div>
// </div>
// </footer>
// </div>
// </body></html>