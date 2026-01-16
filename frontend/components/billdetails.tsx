// <!DOCTYPE html>

// <html class="dark" lang="en"><head>
// <meta charset="utf-8"/>
// <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
// <title>My Bills Dashboard - On-Chain Splitter</title>
// <!-- Google Fonts: Manrope -->
// <link href="https://fonts.googleapis.com" rel="preconnect"/>
// <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
// <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&amp;display=swap" rel="stylesheet"/>
// <!-- Material Symbols -->
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
// <!-- Tailwind CSS -->
// <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
// <!-- Theme Configuration -->
// <script id="tailwind-config">
//         tailwind.config = {
//             darkMode: "class",
//             theme: {
//                 extend: {
//                     colors: {
//                         "primary": "#135bec",
//                         "background-light": "#f6f6f8",
//                         "background-dark": "#101622",
//                         "surface-light": "#ffffff",
//                         "surface-dark": "#1A2235",
//                         "border-light": "#e2e8f0",
//                         "border-dark": "#232f48",
//                     },
//                     fontFamily: {
//                         "display": ["Manrope", "sans-serif"]
//                     },
//                     borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
//                 },
//             },
//         }
//     </script>
// </head>
// <body class="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-white transition-colors duration-200">
// <!-- Top Navigation Bar -->
// <header class="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-md">
// <div class="px-6 lg:px-10 py-4 flex items-center justify-between">
// <div class="flex items-center gap-4">
// <div class="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
// <span class="material-symbols-outlined text-2xl">account_balance_wallet</span>
// </div>
// <h1 class="text-xl font-bold tracking-tight hidden sm:block">On-Chain Splitter</h1>
// </div>
// <nav class="hidden md:flex items-center gap-8">
// <a class="text-sm font-bold text-primary" href="#">Dashboard</a>
// <a class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="#">Create Bill</a>
// <a class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="#">History</a>
// <a class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors" href="#">Settings</a>
// </nav>
// <div class="flex items-center gap-4">
// <div class="hidden lg:flex flex-col items-end mr-2">
// <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Network</span>
// <span class="text-xs font-bold text-emerald-500 flex items-center gap-1">
// <span class="size-1.5 rounded-full bg-emerald-500"></span> Ethereum Mainnet
//                     </span>
// </div>
// <button class="flex items-center gap-2 cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-600 transition-colors">
// <span class="material-symbols-outlined text-[20px]">wallet</span>
// <span class="truncate max-w-[100px]">0x...89AB</span>
// </button>
// </div>
// </div>
// </header>
// <main class="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-10">
// <div class="w-full max-w-[1200px] flex flex-col gap-8">
// <!-- Page Heading & Primary Action -->
// <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
// <div class="flex flex-col gap-1">
// <h2 class="text-3xl md:text-4xl font-black tracking-tight">My Bills Dashboard</h2>
// <p class="text-slate-500 dark:text-slate-400 text-base">Manage your shared expenses and settlements.</p>
// </div>
// <button class="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-surface-dark dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
// <span class="material-symbols-outlined">add</span>
// <span>Create New Bill</span>
// </button>
// </div>
// <!-- Stats Overview Cards -->
// <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
// <!-- Card 1: Receivable -->
// <div class="flex flex-col gap-3 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
// <div class="flex items-center justify-between">
// <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Receivable</p>
// <span class="material-symbols-outlined text-emerald-500">call_received</span>
// </div>
// <div>
// <p class="text-3xl font-bold tracking-tight">150.00 USDC</p>
// <p class="text-xs text-slate-400 mt-1">Across 2 active bills</p>
// </div>
// </div>
// <!-- Card 2: Payable -->
// <div class="flex flex-col gap-3 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
// <div class="flex items-center justify-between">
// <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Payable</p>
// <span class="material-symbols-outlined text-amber-500">call_made</span>
// </div>
// <div>
// <p class="text-3xl font-bold tracking-tight">45.00 USDC</p>
// <p class="text-xs text-slate-400 mt-1">1 bill requires attention</p>
// </div>
// </div>
// <!-- Card 3: Active Bills -->
// <div class="flex flex-col gap-3 rounded-xl p-6 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
// <div class="flex items-center justify-between">
// <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Bills</p>
// <span class="material-symbols-outlined text-primary">receipt_long</span>
// </div>
// <div>
// <p class="text-3xl font-bold tracking-tight">3</p>
// <p class="text-xs text-slate-400 mt-1">Last updated today</p>
// </div>
// </div>
// </div>
// <!-- Filters & Actions -->
// <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// <div class="flex flex-wrap gap-2">
// <button class="h-9 px-4 rounded-lg bg-surface-dark dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-sm">
//                         All Bills
//                     </button>
// <button class="h-9 px-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
// <span class="size-2 rounded-full bg-amber-500"></span>
//                         Action Required
//                     </button>
// <button class="h-9 px-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                         Pending
//                     </button>
// <button class="h-9 px-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
//                         Settled
//                     </button>
// </div>
// <div class="flex items-center gap-2 w-full sm:w-auto">
// <div class="relative w-full sm:w-64">
// <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-xl">search</span>
// <input class="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-500 text-slate-900 dark:text-white" placeholder="Search bills..." type="text"/>
// </div>
// <button class="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
// <span class="material-symbols-outlined text-xl">filter_list</span>
// </button>
// </div>
// </div>
// <!-- Bills Table -->
// <div class="rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm">
// <div class="overflow-x-auto">
// <table class="w-full min-w-[800px]">
// <thead>
// <tr class="bg-slate-100 dark:bg-[#151c2b] border-b border-border-light dark:border-border-dark">
// <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bill Name</th>
// <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
// <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Participants</th>
// <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Amount</th>
// <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Share</th>
// <th class="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
// <th class="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
// </tr>
// </thead>
// <tbody class="divide-y divide-border-light dark:divide-border-dark">
// <!-- Row 1: Action Required -->
// <tr class="group hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors">
// <td class="px-6 py-4">
// <div class="flex items-center gap-3">
// <div class="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
// <span class="material-symbols-outlined">restaurant</span>
// </div>
// <div>
// <p class="font-bold text-sm text-slate-900 dark:text-white">Friday Team Dinner</p>
// <p class="text-xs text-slate-500 dark:text-slate-400">Created by @alice_eth</p>
// </div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
//                                     Oct 24, 2023
//                                 </td>
// <td class="px-6 py-4">
// <div class="flex -space-x-2">
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" data-alt="Avatar of participant 1" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCEINEAIJ4lb-H5JCSx_uqdWm56aX1dAHNkmEeCfsYgf2E8WCtRCOmcrSB6lNggIOS1Cb4HFkS74KrGXITqmqEW7tHLyn9ToFp2cdN3y_ktj5JKXoXA4JmcGHdM9e-Pk9z7qTqLnBVfSQlhcD1o3dtDu81NkUymqXBYZ4KzZCDpvPtgJWZVYYl5hvlZfcr160-2uKDcPIU63DQThfWg-JqmKI1jxF1P1Xh111s7mzSS0ADj7BZChCMMY8yqIhfABzZwbDc7WI5Wjmo5");'></div>
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" data-alt="Avatar of participant 2" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuARtTuz4WKolGFiNVEsam0nmKXB9lXclCxg6d7FEKAcco_CnTZFlq50-jGosPsOM3aiZMw8kLwgXghqKAHrhH2Dmg4bchUH4UcmFJ_3nzvMWfrtQ5wjlZdMxkJsjwRGi91Gh8AULQ1cMb_o0SKRsfxaKxc0qLiOBbnb7t_DgHCV-f_uRDPTBbtJIHV1-ldbP22S9MH67WODeRHcD2Fz8ja5UlX92kr9kYBlgUrcH-uZqJs7Fw_w51ypSUEx2VRlmKTj6Vu0XSjrn-hG");'></div>
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">+2</div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
//                                     120.00 USDC
//                                 </td>
// <td class="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
//                                     40.00 USDC
//                                 </td>
// <td class="px-6 py-4">
// <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
// <span class="size-1.5 rounded-full bg-amber-500"></span>
//                                         Awaiting Payment
//                                     </span>
// </td>
// <td class="px-6 py-4 text-right">
// <button class="inline-flex items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors w-full sm:w-auto">
//                                         Settle Now
//                                     </button>
// </td>
// </tr>
// <!-- Row 2: Pending Others -->
// <tr class="group hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors">
// <td class="px-6 py-4">
// <div class="flex items-center gap-3">
// <div class="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
// <span class="material-symbols-outlined">cabin</span>
// </div>
// <div>
// <p class="font-bold text-sm text-slate-900 dark:text-white">Ski Trip Cabin</p>
// <p class="text-xs text-slate-500 dark:text-slate-400">Created by You</p>
// </div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
//                                     Oct 10, 2023
//                                 </td>
// <td class="px-6 py-4">
// <div class="flex -space-x-2">
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" data-alt="Avatar of participant 3" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDQ9Pmci6A2-UZatigkh5n3qEfy21dalJ7G7h7-M6S9PJuQTLnunDW5dNJA2RAU9Xo0dEkCDsm8YVwLJL9DeWcvuoSbjg0mVAl0yjEHA_4U1_piSxFZ5-1dHpWZznW-MnWsY3XSEzClGRuKqksme92Wmx2knYcm8_8x3yNXX0I_nF0oC3dZRSmtyTIH1o7IlBZk4SgX7tD7R5dzwasgDcq21tPFhfNx-sFszTBqdUQOS7rPnGc0bEcMDNd6ZzkGeURgGUeUN_GW9AP");'></div>
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" data-alt="Avatar of participant 4" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwP5sPruiFNmhglITMestR8bWAbDJud3SFo5fXHAbDJHEnSW30CqorUCHesgi1AJoCo-ydK6RL0FkK5vdVe50hedzjWopATyXra95uwKL7dV6hJLQJ2kKWh5GwtHi0Mcamtgk8OUhJxs9gwOUksEwxOH7NWsZSq1HiaDf4ofY74PYe6esR2KltO8K96rlMIuIeyAKHrV8AYEzhldcFr2wKEGMi9fPxgZgRFIElE5U8L3tbbrwPTQx8ItwrcLnyDfulXoNd75l5WRlc");'></div>
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">+5</div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
//                                     450.00 USDC
//                                 </td>
// <td class="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
//                                     + 112.50 USDC
//                                 </td>
// <td class="px-6 py-4">
// <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
// <span class="size-1.5 rounded-full bg-slate-400"></span>
//                                         Pending Others
//                                     </span>
// </td>
// <td class="px-6 py-4 text-right">
// <button class="text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
//                                         View Details
//                                     </button>
// </td>
// </tr>
// <!-- Row 3: Settled -->
// <tr class="group hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors">
// <td class="px-6 py-4">
// <div class="flex items-center gap-3">
// <div class="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
// <span class="material-symbols-outlined">bolt</span>
// </div>
// <div>
// <p class="font-bold text-sm text-slate-900 dark:text-white">Utilities March</p>
// <p class="text-xs text-slate-500 dark:text-slate-400">Created by @bob_chain</p>
// </div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
//                                     Mar 01, 2023
//                                 </td>
// <td class="px-6 py-4">
// <div class="flex -space-x-2">
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" data-alt="Avatar of participant 5" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBp2Yw3282BtRbAFrwfKtJ3ymTdHmEnMrJP2T5CTqimidqy_G4W1dNOpPGF75pHSP6QhJqhUtLVzVFmfKv_xRD9MyehEBGK5qhiMOd746YSCvvGwNiV21jnQrohyMVe16MQR3PcBVct21yF6VcpZT4RzTmTVJLVmup6bbKaL_00KgQ3zBehvVpbhpoJUAPixuRZcB-x19dzk7fhEtVkwk7vCZFPayRO0dRWphmNi44Pn5BVnadzqM4vZfVUn7qlOMXc62ymkQfuqJ4l");'></div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
//                                     80.00 USDC
//                                 </td>
// <td class="px-6 py-4 text-sm font-bold text-slate-400 line-through">
//                                     40.00 USDC
//                                 </td>
// <td class="px-6 py-4">
// <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
// <span class="size-1.5 rounded-full bg-emerald-500"></span>
//                                         Settled
//                                     </span>
// </td>
// <td class="px-6 py-4 text-right">
// <button class="text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
//                                         View Receipt
//                                     </button>
// </td>
// </tr>
// <!-- Row 4: Pending (Another one) -->
// <tr class="group hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors">
// <td class="px-6 py-4">
// <div class="flex items-center gap-3">
// <div class="size-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
// <span class="material-symbols-outlined">celebration</span>
// </div>
// <div>
// <p class="font-bold text-sm text-slate-900 dark:text-white">Birthday Gift</p>
// <p class="text-xs text-slate-500 dark:text-slate-400">Created by You</p>
// </div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
//                                     Sep 15, 2023
//                                 </td>
// <td class="px-6 py-4">
// <div class="flex -space-x-2">
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" data-alt="Avatar of participant 6" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8SaSNJq5ohzlASmmvgs-3y5bJy1Ost0G13rTOs_uQsQMMSvf77JbgKdpeISx2ReB8hn1FxRf7KBWDox1XEIgLyfHscZhtSq9LiloTMFfmV9_UFtbgywkvZRDaXlrp8v5bAhTmHN7TomulKAskNxJk6c8g2Tk_G5b4aDLymR7xuBNrOWw6fD5z83SkPjgTnEGfM1DrL2-pRC69cpkOhjuRmYbDzWXmC565igEpG3lqi8hlP0NJggozHwQkiTHDVnZ685A9kJrE3-Ah");'></div>
// <div class="size-8 rounded-full border-2 border-white dark:border-background-dark bg-slate-200 bg-cover bg-center" data-alt="Avatar of participant 7" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBq3AbFnwsPm3QBvjrcksKRvWgM4-D8hCiGoA84BP5g-F4MUu1bdqcSJwL3X9y7SLBlYLH1GiNEkp_wO_ob2j4mGAPh74AtJ8eTik_DXHT0DtP_Q1wLtiegQhI8P0a0rlb1CXFt9jEwkCJkS3632n9fYTEOifXYnx56sXuiWhModhyHXayxcOnt1QQDaRsAv_c9YN097AJdAEATFQXdVJ8X9twWnLzdrl9wVExKOM7MqWAHLeVFO1Ta0j8UCQX5oOSxnVOqXNOp2amv");'></div>
// </div>
// </td>
// <td class="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
//                                     200.00 USDC
//                                 </td>
// <td class="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">
//                                     + 37.50 USDC
//                                 </td>
// <td class="px-6 py-4">
// <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
// <span class="size-1.5 rounded-full bg-slate-400"></span>
//                                         Pending Others
//                                     </span>
// </td>
// <td class="px-6 py-4 text-right">
// <button class="text-sm font-bold text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">
//                                         View Details
//                                     </button>
// </td>
// </tr>
// </tbody>
// </table>
// </div>
// <!-- Pagination -->
// <div class="border-t border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-[#151c2b]/50">
// <p class="text-xs text-slate-500 dark:text-slate-400">Showing <span class="font-bold text-slate-900 dark:text-white">1-4</span> of <span class="font-bold text-slate-900 dark:text-white">12</span> bills</p>
// <div class="flex gap-2">
// <button class="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-600 dark:text-slate-400 disabled:cursor-not-allowed">
// <span class="material-symbols-outlined text-sm">chevron_left</span>
// </button>
// <button class="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400">
// <span class="material-symbols-outlined text-sm">chevron_right</span>
// </button>
// </div>
// </div>
// </div>
// </div>
// </main>
// </body></html>