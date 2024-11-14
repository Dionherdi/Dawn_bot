const axios = require('axios');
const https = require('https');
const accountsData = require('./accounts');
const proxies = require('./proxy');
const config = require('./config');
const db = require('./database');
const translations = require('./languages');

const pointsCache = new Map();
const CACHE_DURATION = 30000;

const apiEndpoints = {
    ...config.endpoints,
    telegram: `${config.telegram.apiUrl}${config.telegram.botToken}`
};

const ignoreSslAgent = new https.Agent({  
    rejectUnauthorized: false
});

const randomDelay = (min, max) => {
    return new Promise(resolve => {
        const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(resolve, delayTime * 100);
    });
};

const displayWelcome = () => {
    console.log(`
===============================
            ITBAARTS
===============================
    `);
};

const fetchPoints = async (headers, retryCount = 0, maxRetries = 5) => {
    const cacheKey = headers.Authorization;
    const cachedData = pointsCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.points;
    }

    try {
        const response = await axios.get(apiEndpoints.getPoints, { headers, httpsAgent: ignoreSslAgent });
        if (response.status === 200 && response.data.status) {
            const { rewardPoint, referralPoint } = response.data.data;
            const totalPoints = (
                (rewardPoint.points || 0) +
                (rewardPoint.registerpoints || 0) +
                (rewardPoint.signinpoints || 0) +
                (rewardPoint.twitter_x_id_points || 0) +
                (rewardPoint.discordid_points || 0) +
                (rewardPoint.telegramid_points || 0) +
                (rewardPoint.bonus_points || 0) +
                (referralPoint.commission || 0)
            );
            
            pointsCache.set(cacheKey, {
                points: totalPoints,
                timestamp: Date.now()
            });
            
            return totalPoints;
        }
    } catch (error) {
        console.error(`⚠️ Error during fetching points (Attempt ${retryCount + 1}/${maxRetries}): ${error.message}`);
        
        if (retryCount < maxRetries) {
            // Exponential backoff delay: 5s, 10s, 20s, 40s, 80s
            const delayTime = Math.min(5000 * Math.pow(2, retryCount), 60000);
            console.log(`🔄 Retrying in ${delayTime/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delayTime));
            return fetchPoints(headers, retryCount + 1, maxRetries);
        }
    }
    return 0;
};

const keepAliveRequest = async (headers, email) => {
    const payload = {
        username: email,
        extensionid: "fpdkjdnhkakefebpekbdhillbhonfjjp",
        numberoftabs: Math.floor(Math.random() * 3) + 1,
        _v: "1.0.9"
    };
    
    try {
        const response = await axios.post(apiEndpoints.keepalive, payload, { 
            headers, 
            httpsAgent: ignoreSslAgent,
            timeout: 10000
        });
        if (response.status === 200) {
            console.log(`✅ Keep-Alive Success: ${email}`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Keep-Alive Error: ${email}, Detail: ${error.message}`);
    }
    return false;
};

const countdown = async (seconds) => {
    for (let i = seconds; i > 0; i--) {
        process.stdout.write(`⏳ Next: ${i}s\r`);
        await randomDelay(1, 1);
    }
    console.log("\n🔄 Restarting...\n");

    await randomDelay(30, 60);
};

const countdownAccountDelay = async (seconds) => {
    for (let i = seconds; i > 0; i--) {
        process.stdout.write(`⏳ Waiting for account processing in: ${i} seconds...\r`);
        await randomDelay(0.1, 0.3);
    }
    console.log("\n");
};

let lastMessageId = null;

const deleteLastMessage = async () => {
    if (lastMessageId) {
        try {
            await axios.post(`${apiEndpoints.telegram}/deleteMessage`, {
                chat_id: config.telegram.chatId,
                message_id: lastMessageId
            });
        } catch (error) {
            console.error(`❌ Error deleting message: ${error.message}`);
        }
    }
};

const sendTelegramMessage = async (message, showBackButton = false) => {
    try {
        await clearChatHistory();

        const axiosConfig = {
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const payload = {
            chat_id: config.telegram.chatId,
            text: message,
            parse_mode: "HTML",
            reply_markup: showBackButton ? {
                inline_keyboard: [
                    [{ text: "🔙 Back to Menu", callback_data: "back" }]
                ]
            } : undefined
        };
        
        const response = await axios.post(
            `${apiEndpoints.telegram}/sendMessage`, 
            payload,
            axiosConfig
        );
        
        if (!response.data.ok) {
            throw new Error(response.data.description);
        }
        
        lastMessageId = response.data.result.message_id;
    } catch (error) {
        console.error(`❌ Failed to send message: ${error.message}`);
        if (!error.message.includes('retry')) {
            setTimeout(() => sendTelegramMessage(message, showBackButton), 1000);
        }
    }
};

const initialBalances = new Map();

const getAllAccountsInfo = async () => {
    const accounts = await db.getAllPoints();
    
    const accountInfos = accounts.map((account, i) => {
        const earnedPoints = account.current_balance - account.initial_balance;
        
        return `🔹 <b>Account ${i + 1}</b> 🔹
━━━━━━━━━━━━━━━━━━━━
👤 Account : ${account.email}
💰 Initial Balance : ${account.initial_balance}
📈 Earned Balance : ${earnedPoints}
💎 Total Balance : ${account.current_balance}
━━━━━━━━━━━━━━━━━━━━\n\n`;
    });

    return `🌟 <b>DAWN ACCOUNT INFO</b> 🌟\n\n${accountInfos.join('')}\n⏰ Last Update: ${new Date().toLocaleString()}`;
};

const sendMenuMessage = async (chatId) => {
    try {
        if (lastMessageId) {
            try {
                await axios.post(`${apiEndpoints.telegram}/deleteMessage`, {
                    chat_id: chatId,
                    message_id: lastMessageId
                });
            } catch (error) {
                console.error(`❌ Error deleting previous menu message: ${error.message}`);
            }
        }

        const currentLang = await db.getUserLanguage(chatId);
        const menuMessage = {
            chat_id: chatId,
            text: translations[currentLang].welcome,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: translations[currentLang].buttons.accountInfo, callback_data: "cek" },
                        { text: translations[currentLang].buttons.totalBalance, callback_data: "total" }
                    ],
                    [
                        { text: translations[currentLang].buttons.scriptStatus, callback_data: "status" },
                        { text: translations[currentLang].buttons.language, callback_data: "language" }
                    ],
                    [
                        { text: translations[currentLang].buttons.help, callback_data: "help" },
                        { text: translations[currentLang].buttons.about, callback_data: "about" }
                    ]
                ]
            }
        };

        const response = await axios.post(`${apiEndpoints.telegram}/sendMessage`, menuMessage);
        lastMessageId = response.data.result.message_id;
    } catch (error) {
        console.error(`❌ Error sending menu: ${error.message}`);
    }
};

// Cache untuk menyimpan data sementara
const cache = {
    lastUpdate: 0,
    updateInterval: 3000, // Update cache setiap 5 detik
    accountInfo: null,
    totalBalance: null,
    scriptStatus: null
};

// Fungsi untuk mendapatkan account info dengan terjemahan
const getAccountInfoWithCache = async (chatId) => {
    const currentLang = await db.getUserLanguage(chatId);
    const t = translations[currentLang];
    
    const now = Date.now();
    if (cache.accountInfo && (now - cache.lastUpdate) < cache.updateInterval) {
        return cache.accountInfo;
    }

    const accounts = await db.getAllPoints();
    const accountInfos = accounts.map((account, i) => {
        const earnedPoints = account.current_balance - account.initial_balance;
        return `🔹 <b>${t.accountInfo.account} ${i + 1}</b> 🔹
━━━━━━━━━━━━━━━━━━━━
👤 ${t.accountInfo.email} : ${account.email}
💰 ${t.accountInfo.initialBalance} : ${account.initial_balance}
📈 ${t.accountInfo.earnedBalance} : ${earnedPoints}
💎 ${t.accountInfo.totalBalance} : ${account.current_balance}
━━━━━━━━━━━━━━━━━━━━\n\n`;
    });

    cache.accountInfo = `${t.accountInfo.title}\n\n${accountInfos.join('')}\n⏰ ${t.accountInfo.lastUpdate}: ${new Date().toLocaleString()}`;
    cache.lastUpdate = now;
    return cache.accountInfo;
};

// Fungsi untuk mendapatkan total balance dengan terjemahan
const getTotalBalanceWithCache = async (chatId) => {
    const currentLang = await db.getUserLanguage(chatId);
    const t = translations[currentLang];
    
    const now = Date.now();
    if (cache.totalBalance && (now - cache.lastUpdate) < cache.updateInterval) {
        return cache.totalBalance;
    }

    const scriptStatus = await db.getScriptStatus();
    cache.totalBalance = `
${t.totalBalance.title}
━━━━━━━━━━━━━━━━━━━━
${t.totalBalance.total}: ${scriptStatus?.total_balance || 0} ${t.totalBalance.points}
━━━━━━━━━━━━━━━━━━━━
⏰ ${t.totalBalance.update}: ${new Date(scriptStatus?.last_update).toLocaleString()}
`;
    return cache.totalBalance;
};

// Fungsi untuk mendapatkan script status dengan terjemahan
const getScriptStatusWithCache = async (chatId) => {
    const currentLang = await db.getUserLanguage(chatId);
    const t = translations[currentLang];
    
    const now = Date.now();
    if (cache.scriptStatus && (now - cache.lastUpdate) < cache.updateInterval) {
        return cache.scriptStatus;
    }

    const status = await db.getScriptStatus();
    if (!status) return t.errors.fetch;

    const startTime = new Date(status.start_time);
    const currentTime = new Date();
    const uptime = Math.floor((currentTime - startTime) / 1000);
    
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    cache.scriptStatus = `
${t.scriptStatus.title}
━━━━━━━━━━━━━━━━━━━━
⏰ ${t.scriptStatus.time}: ${currentTime.toLocaleString()}
✅ ${t.scriptStatus.status}: ${status.is_running ? t.scriptStatus.active : t.scriptStatus.stopped}
⌛ ${t.scriptStatus.uptime}: ${days}${t.scriptStatus.days} ${hours}${t.scriptStatus.hours} ${minutes}${t.scriptStatus.minutes}
━━━━━━━━━━━━━━━━━━━━
`;
    return cache.scriptStatus;
};

// Tambahkan fungsi untuk menampilkan menu bahasa
const showLanguageMenu = async (chatId) => {
    try {
        const currentLang = await db.getUserLanguage(chatId);
        const menuMessage = {
            chat_id: chatId,
            text: translations[currentLang].languageMenu,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "🇺🇸 English", callback_data: "lang_en" },
                        { text: "🇮🇩 Indonesia", callback_data: "lang_id" }
                    ],
                    [
                        { text: "🇮🇳 हिंदी", callback_data: "lang_hi" }
                    ],
                    [
                        { text: translations[currentLang].buttons.back, callback_data: "back" }
                    ]
                ]
            }
        };

        const response = await axios.post(`${apiEndpoints.telegram}/sendMessage`, menuMessage);
        lastMessageId = response.data.result.message_id;
    } catch (error) {
        console.error(`❌ Error showing language menu: ${error.message}`);
    }
};

// Update handleCallback untuk menangani perubahan bahasa
const handleCallback = async (callback_query) => {
    const action = callback_query.data;
    const chatId = callback_query.message.chat.id;
    const messageId = callback_query.message.message_id;
    
    try {
        try {
            await axios.post(`${apiEndpoints.telegram}/deleteMessage`, {
                chat_id: chatId,
                message_id: messageId
            });
        } catch (error) {
            console.error(`❌ Error deleting callback message: ${error.message}`);
        }

        if (action.startsWith('lang_')) {
            const newLang = action.split('_')[1];
            await db.setUserLanguage(chatId, newLang);
            await sendMenuMessage(chatId);
            return;
        }

        const currentLang = await db.getUserLanguage(chatId);
        let message;

        switch (action) {
            case 'language':
                await showLanguageMenu(chatId);
                return;
            case 'help':
                message = translations[currentLang].help;
                break;
            case 'about':
                message = translations[currentLang].about;
                break;
            case 'cek':
                message = await getAccountInfoWithCache(chatId);
                break;
            case 'total':
                message = await getTotalBalanceWithCache(chatId);
                break;
            case 'status':
                message = await getScriptStatusWithCache(chatId);
                break;
            case 'notifications':
                message = await getNotificationSettings();
                break;
            case 'history':
                message = await getTransactionHistory();
                break;
            case 'back':
                await sendMenuMessage(chatId);
                return;
            default:
                message = "⚠️ Aksi tidak dikenal";
        }
        
        if (message) {
            await sendTelegramMessage(message, action !== 'back');
        }
    } catch (error) {
        console.error(`❌ Error handling callback: ${error.message}`);
        await sendTelegramMessage(`❌ Terjadi kesalahan: ${error.message}`, true);
    }
};

const resetUpdateId = async () => {
    try {
        const response = await axios.get(`${apiEndpoints.telegram}/getUpdates`, {
            params: { 
                offset: -1,
                limit: 1,
                timeout: 30
            }
        });
        if (response.data.ok && response.data.result.length > 0) {
            return response.data.result[0].update_id;
        }
        return 0;
    } catch (error) {
        if (error.response?.status === 409) {
            try {
                await axios.post(`${apiEndpoints.telegram}/deleteWebhook`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return resetUpdateId();
            } catch (webhookError) {
                console.error('Error deleting webhook:', webhookError.message);
            }
        }
        return 0;
    }
};

// Optimasi checkTelegramUpdates
const checkTelegramUpdates = async () => {
    let lastUpdateId = 0;
    let isProcessing = false;
    
    const checkUpdates = async () => {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            const response = await axios.get(`${apiEndpoints.telegram}/getUpdates`, {
                params: {
                    offset: lastUpdateId + 1,
                    limit: 5,
                    timeout: 1, // Kurangi timeout
                    allowed_updates: ["message", "callback_query"]
                },
                timeout: 2000 // Kurangi timeout axios
            });

            if (response.data.ok && response.data.result.length > 0) {
                const updates = response.data.result;
                
                await Promise.all(updates.map(async (update) => {
                    lastUpdateId = update.update_id;
                    
                    if (update.message?.text === '/start') {
                        await sendMenuMessage(update.message.chat.id);
                    } else if (update.callback_query) {
                        await Promise.all([
                            axios.post(`${apiEndpoints.telegram}/answerCallbackQuery`, {
                                callback_query_id: update.callback_query.id
                            }),
                            handleCallback(update.callback_query)
                        ]);
                    }
                }));
            }
        } catch (error) {
            if (!error.message.includes('timeout') && !error.message.includes('network')) {
                console.error(`❌ Error checking updates:`, error.message);
            }
        } finally {
            isProcessing = false;
        }
    };

    setInterval(checkUpdates, 500); // Poll lebih sering
    checkUpdates();
};

const clearChatHistory = async () => {
    try {
        const response = await axios.get(`${apiEndpoints.telegram}/getUpdates`, {
            params: { 
                offset: -1,  // Ambil update terbaru
                limit: 10    // Batasi jumlah pesan yang diambil
            }
        });

        if (response.data.ok && response.data.result.length > 0) {
            // Hapus pesan terakhir jika ada
            if (lastMessageId) {
                try {
                    await axios.post(`${apiEndpoints.telegram}/deleteMessage`, {
                        chat_id: config.telegram.chatId,
                        message_id: lastMessageId
                    });
                } catch (deleteError) {
                    // Abaikan error jika pesan sudah terhapus
                    if (!deleteError.response?.data?.description?.includes('message to delete not found')) {
                        console.error(`❌ Error deleting message: ${deleteError.message}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error clearing chat history: ${error.message}`);
    }
};

const processAccounts = async () => {
    displayWelcome();
    
    try {
        console.log('🔄 Menginisialisasi database...');
        await db.initDatabase();
        console.log('✅ Database berhasil diinisialisasi');
    } catch (error) {
        console.error('❌ Error inisialisasi database:', error);
        process.exit(1);
    }

    const processInitialBalance = async () => {
        const promises = accountsData.map(async (account) => {
            const { email, token } = account;
            const headers = {
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            };
            
            let points = 0;
            let attempts = 0;
            const maxAttempts = 5;

            while (points === 0 && attempts < maxAttempts) {
                try {
                    points = await fetchPoints(headers);
                    if (points > 0) {
                        await db.updatePoints(email, token, points, points);
                        console.log(`✅ Initial balance for ${email}: ${points} points`);
                    } else {
                        attempts++;
                        if (attempts < maxAttempts) {
                            const delayTime = Math.min(5000 * Math.pow(2, attempts), 60000);
                            console.log(`⚠️ Retry ${attempts}/${maxAttempts} for ${email} in ${delayTime/1000} seconds...`);
                            await new Promise(resolve => setTimeout(resolve, delayTime));
                        }
                    }
                } catch (error) {
                    console.error(`❌ Error checking balance for ${email}:`, error.message);
                    attempts++;
                    if (attempts < maxAttempts) {
                        const delayTime = Math.min(5000 * Math.pow(2, attempts), 60000);
                        await new Promise(resolve => setTimeout(resolve, delayTime));
                    }
                }
            }

            if (points === 0) {
                console.error(`❌ Failed to get initial balance for ${email} after ${maxAttempts} attempts`);
            }
        });

        await Promise.all(promises);
    };

    await processInitialBalance();
    await clearChatHistory();
    await sendMenuMessage(config.telegram.chatId);
    checkTelegramUpdates();

    const processBatch = async (accounts) => {
        const promises = accounts.map(async (account) => {
            const { email, token } = account;
            const headers = {
                "Accept": "*/*",
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            };

            try {
                await keepAliveRequest(headers, email);
                await randomDelay(5, 10);
                
                let currentPoints = 0;
                let attempts = 0;
                const maxAttempts = 5;

                while (currentPoints === 0 && attempts < maxAttempts) {
                    currentPoints = await fetchPoints(headers);
                    if (currentPoints === 0) {
                        attempts++;
                        if (attempts < maxAttempts) {
                            const delayTime = Math.min(5000 * Math.pow(2, attempts), 60000);
                            console.log(`⚠️ Retry ${attempts}/${maxAttempts} for ${email} in ${delayTime/1000} seconds...`);
                            await new Promise(resolve => setTimeout(resolve, delayTime));
                        }
                    }
                }
                
                const pointData = await db.getPoints(email);
                await db.updatePoints(
                    email,
                    token,
                    pointData?.initial_balance || currentPoints,
                    currentPoints
                );

                await randomDelay(15, 30);

                return currentPoints;
            } catch (error) {
                console.error(`❌ Error on account ${email}:`, error.message);
                return 0;
            }
        });

        const results = await Promise.all(promises);
        return results.reduce((a, b) => a + b, 0);
    };

    while (true) {
        const batchSize = 3;
        let totalBalance = 0;

        for (let i = 0; i < accountsData.length; i += batchSize) {
            const batch = accountsData.slice(i, i + batchSize);
            const batchTotal = await processBatch(batch);
            totalBalance += batchTotal;
            
            if (i + batchSize < accountsData.length) {
                await randomDelay(5, 10);
            }
        }

        await db.updateScriptStatus(totalBalance);
        cache.lastUpdate = 0;

        await countdown(Math.floor(config.restartDelay));
    }
};

const getTransactionHistory = async () => {
    try {
        const transactions = await db.getTransactionHistory(10); // Ambil 10 transaksi terakhir
        if (!transactions || transactions.length === 0) {
            return `
📅 <b>Transaction History</b>
━━━━━━━━━━━━━━━━━━━
No transactions found
━━━━━━━━━━━━━━━━━━━
`;
        }

        const transactionList = transactions.map((tx, i) => `
${i + 1}. ${new Date(tx.timestamp).toLocaleString()}
   Email: ${tx.email}
   Type: ${tx.type}
   Amount: ${tx.amount} points
   Description: ${tx.description}
`).join('\n');

        return `
📅 <b>Transaction History</b>
━━━━━━━━━━━━━━━━━━━━
${transactionList}
━━━━━━━━━━━━━━━━━━━━
`;
    } catch (error) {
        console.error('Error getting transaction history:', error);
        return "❌ Failed to fetch transaction history";
    }
};

const getNotificationSettings = async () => {
    try {
        const accounts = await db.getAllPoints();
        let settingsList = '';
        
        for (const account of accounts) {
            const settings = await db.getNotificationSettings(account.email);
            settingsList += `
📧 ${account.email}
• Balance Updates: ${settings.balance_updates ? '✅' : '❌'}
• Script Status: ${settings.script_status ? '✅' : '❌'}
`;
        }

        return `
🔔 <b>Notification Settings</b>
━━━━━━━━━━━━━━━━━━━━
${settingsList}
━━━━━━━━━━━━━━━━━━━━
To change these settings, please contact support.
`;
    } catch (error) {
        console.error('Error getting notification settings:', error);
        return "❌ Failed to fetch notification settings";
    }
};

processAccounts();
