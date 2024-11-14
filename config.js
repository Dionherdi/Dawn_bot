module.exports = {
    useProxy: true, // Set to true if you want to run with proxies
    minDelay: 3, // random delay for keepalive packet send
    maxDelay: 5, // random delay for keepalive packet send
    restartDelay: 30, // Delay in seconds before restarting the process
    accountDelay: 3, // Custom delay in seconds before processing the next account
    maxRetries: 5, // Tambah retry untuk request yang gagal
    requestTimeout: 5000,  // Timeout untuk requests

    endpoints: {
        keepalive: "https://www.aeropres.in/chromeapi/dawn/v1/userreward/keepalive",
        getPoints: "https://www.aeropres.in/api/atom/v1/userreferral/getpoint"
    },

    telegram: {
        botToken: "7651358362:AAH0bgFX2lBUGNON0fijPj-62n70TxyRE5E",
        chatId: "7532281298",
        apiUrl: "https://api.telegram.org/bot",
        messageInterval: 3000, // Interval for checking new messages (3 seconds)
        cacheInterval: 1800000 // Cache update interval (30 minutes)
    },

    retry: {
        maxAttempts: 5,
        delay: 3000,
        keepAliveRetries: 5
    }
};
