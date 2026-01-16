// <!DOCTYPE html>

// <html class="dark" lang="en"><head>
// <meta charset="utf-8"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
// <title>Create New Bill - On-chain Splitter</title>
// <!-- Fonts -->
// <link href="https://fonts.googleapis.com" rel="preconnect"/>
// <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
// <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
// <!-- Material Symbols -->
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <!-- Tailwind CSS -->
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <!-- Theme Config -->
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
//                     borderRadius: {
//                         "DEFAULT": "0.25rem",
//                         "lg": "0.5rem",
//                         "xl": "0.75rem",
//                         "full": "9999px"
//                     },
//                 },
//             },
//         }
//     </script>
// </head>
// <body class="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col">
// <!-- Navbar -->
// <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#232f48] px-6 lg:px-10 py-3 bg-white dark:bg-[#111722]">
// <div class="flex items-center gap-4 text-slate-900 dark:text-white">
// <div class="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary">
// <span class="material-symbols-outlined">account_balance_wallet</span>
// </div>
// <h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">On-chain Splitter</h2>
// </div>
// <div class="flex items-center gap-4">
// <div class="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-[#92a4c9]">
// <span class="material-symbols-outlined text-[20px]">account_circle</span>
// <span>0x123...4abc</span>
// </div>
// <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] transition hover:bg-blue-600">
// <span class="truncate">Connect Wallet</span>
// </button>
// </div>
// </header>
// <main class="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
// <div class="w-full max-w-[800px] flex flex-col gap-6">
// <!-- Page Heading & Back Button -->
// <div class="flex flex-col gap-2">
// <button class="flex items-center gap-1 text-sm text-slate-500 dark:text-[#92a4c9] hover:text-primary dark:hover:text-primary transition-colors w-fit">
// <span class="material-symbols-outlined text-[18px]">arrow_back</span>
//                     Back to Dashboard
//                 </button>
// <div class="flex flex-col gap-1 mt-2">
// <h1 class="text-slate-900 dark:text-white text-3xl font-bold leading-tight">Create New Bill</h1>
// <p class="text-slate-500 dark:text-[#92a4c9] text-base font-normal">Create a bill to split expenses on-chain using USDC.</p>
// </div>
// </div>
// <!-- Main Card Form -->
// <div class="bg-white dark:bg-[#192233] rounded-xl border border-slate-200 dark:border-[#324467] p-6 md:p-8 shadow-sm">
// <!-- Bill Details Section -->
// <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
// <label class="flex flex-col flex-1 gap-2">
// <span class="text-slate-900 dark:text-white text-sm font-medium leading-normal">Bill Name</span>
// <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] px-4 text-base font-normal leading-normal transition-all" placeholder="e.g. Friday Dinner" value=""/>
// </label>
// <label class="flex flex-col flex-1 gap-2">
// <span class="text-slate-900 dark:text-white text-sm font-medium leading-normal">Total Amount</span>
// <div class="relative flex items-center">
// <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-200 dark:border-[#324467] bg-slate-50 dark:bg-[#111722] focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-[#92a4c9] pl-4 pr-16 text-base font-bold leading-normal transition-all" placeholder="0.00" value="100.00"/>
// <div class="absolute right-4 flex items-center gap-1 pointer-events-none">
// <span class="text-slate-500 dark:text-[#92a4c9] text-sm font-bold">USDC</span>
// </div>
// </div>
// </label>
// </div>
// <!-- Split Logic Toggle -->
// <div class="mb-6">
// <h3 class="text-slate-900 dark:text-white text-sm font-medium mb-3">Split Method</h3>
// <div class="flex p-1 bg-slate-100 dark:bg-[#111722] rounded-lg w-full md:w-fit border border-slate-200 dark:border-[#324467]">
// <label class="cursor-pointer flex-1 md:flex-none py-2 px-4 rounded-md text-sm font-medium text-center transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-[#232f48] has-[:checked]:text-primary dark:has-[:checked]:text-white has-[:checked]:shadow-sm text-slate-500 dark:text-[#92a4c9]">
// <input checked="" class="hidden" name="split_type" type="radio"/>
//                             Split Evenly
//                         </label>
// <label class="cursor-pointer flex-1 md:flex-none py-2 px-4 rounded-md text-sm font-medium text-center transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-[#232f48] has-[:checked]:text-primary dark:has-[:checked]:text-white has-[:checked]:shadow-sm text-slate-500 dark:text-[#92a4c9]">
// <input class="hidden" name="split_type" type="radio"/>
//                             Custom Amounts
//                         </label>
// </div>
// </div>
// <!-- Participants Table -->
// <div class="flex flex-col gap-4">
// <div class="flex items-center justify-between">
// <h3 class="text-slate-900 dark:text-white text-sm font-medium">Participants</h3>
// <button class="flex items-center gap-1.5 text-primary text-sm font-bold hover:text-blue-400 transition-colors">
// <span class="material-symbols-outlined text-[18px]">add_circle</span>
//                             Add Participant
//                         </button>
// </div>
// <div class="border border-slate-200 dark:border-[#324467] rounded-lg overflow-hidden bg-slate-50 dark:bg-[#111722]">
// <div class="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-100 dark:bg-[#232f48] border-b border-slate-200 dark:border-[#324467] text-xs font-semibold text-slate-500 dark:text-[#92a4c9] uppercase tracking-wider">
// <div class="col-span-6">Wallet Address / ENS</div>
// <div class="col-span-3">Amount (USDC)</div>
// <div class="col-span-2">Share (%)</div>
// <div class="col-span-1 text-right">Action</div>
// </div>
// <!-- Row 1: Creator -->
// <div class="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 md:items-center border-b border-slate-200 dark:border-[#324467] last:border-0">
// <div class="col-span-6 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Wallet</label>
// <div class="flex items-center gap-2">
// <div class="size-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0" data-alt="Avatar gradient"></div>
// <div class="flex flex-col">
// <span class="text-slate-900 dark:text-white text-sm font-medium">You (Creator)</span>
// <span class="text-slate-400 dark:text-slate-500 text-xs">0x123...4abc</span>
// </div>
// </div>
// </div>
// <div class="col-span-3 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Amount</label>
// <div class="relative">
// <input class="w-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-900 dark:text-white text-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary" readonly="" type="text" value="50.00"/>
// </div>
// </div>
// <div class="col-span-2 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Share %</label>
// <div class="relative">
// <input class="w-full bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-500 dark:text-[#92a4c9] text-sm px-3 py-2" readonly="" type="text" value="50%"/>
// </div>
// </div>
// <div class="col-span-1 flex items-center justify-end">
// <span class="inline-flex items-center rounded-full bg-slate-100 dark:bg-[#232f48] px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 ring-1 ring-inset ring-slate-500/10">Owner</span>
// </div>
// </div>
// <!-- Row 2: Participant -->
// <div class="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 md:items-center border-b border-slate-200 dark:border-[#324467] last:border-0 group">
// <div class="col-span-6 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Wallet</label>
// <input class="w-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-900 dark:text-white text-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="0x..." type="text" value="0x892...921a"/>
// </div>
// <div class="col-span-3 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Amount</label>
// <div class="relative">
// <input class="w-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-900 dark:text-white text-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary" type="text" value="25.00"/>
// </div>
// </div>
// <div class="col-span-2 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Share %</label>
// <div class="relative">
// <input class="w-full bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-500 dark:text-[#92a4c9] text-sm px-3 py-2" readonly="" type="text" value="25%"/>
// </div>
// </div>
// <div class="col-span-1 flex items-center justify-end">
// <button aria-label="Remove participant" class="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10">
// <span class="material-symbols-outlined text-[20px]">delete</span>
// </button>
// </div>
// </div>
// <!-- Row 3: Participant -->
// <div class="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 md:items-center border-b border-slate-200 dark:border-[#324467] last:border-0 group">
// <div class="col-span-6 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Wallet</label>
// <input class="w-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-900 dark:text-white text-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Enter wallet address or ENS" type="text"/>
// </div>
// <div class="col-span-3 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Amount</label>
// <div class="relative">
// <input class="w-full bg-white dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-900 dark:text-white text-sm px-3 py-2 focus:ring-1 focus:ring-primary focus:border-primary" type="text" value="25.00"/>
// </div>
// </div>
// <div class="col-span-2 flex flex-col gap-1">
// <label class="md:hidden text-xs text-slate-500 dark:text-[#92a4c9] font-medium">Share %</label>
// <div class="relative">
// <input class="w-full bg-slate-100 dark:bg-[#192233] border border-slate-200 dark:border-[#324467] rounded text-slate-500 dark:text-[#92a4c9] text-sm px-3 py-2" readonly="" type="text" value="25%"/>
// </div>
// </div>
// <div class="col-span-1 flex items-center justify-end">
// <button aria-label="Remove participant" class="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/10">
// <span class="material-symbols-outlined text-[20px]">delete</span>
// </button>
// </div>
// </div>
// </div>
// </div>
// <!-- Footer Summary -->
// <div class="mt-8 pt-6 border-t border-slate-200 dark:border-[#324467] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// <div class="flex flex-col gap-1">
// <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-[#92a4c9]">
// <span>Total Allocated:</span>
// <span class="font-bold text-slate-900 dark:text-white">$100.00 USDC</span>
// </div>
// <div class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
// <span class="material-symbols-outlined text-[16px] filled">check_circle</span>
// <span>Split Matches Total Bill</span>
// </div>
// </div>
// <button class="w-full sm:w-auto flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 text-white text-base font-bold leading-normal tracking-[0.015em] transition shadow-lg shadow-blue-500/20">
// <span class="truncate">Create Bill</span>
// </button>
// </div>
// </div>
// <p class="text-center text-xs text-slate-400 dark:text-slate-600">
//                 By creating this bill, you agree to the On-chain Splitter Terms of Service.
//             </p>
// </div>
// </main>
// </body></html>