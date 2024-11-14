const translations = {
    en: {
        welcome: `
🤖 <b>Welcome to DAWN BOT</b> 🤖

Please select an option below:`,
        menuItems: {
            accountInfo: "📊 Account Info - View your account details",
            totalBalance: "💰 Total Balance - Check total balance",
            scriptStatus: "✅ Script Status - View current script status",
            notifications: "🔔 Notifications - Manage notifications",
            history: "📅 Transaction History - View transactions",
            language: "🌐 Language - Change language",
            help: "ℹ️ Help - Get help and support",
            about: "👤 About Me - Learn more about this bot"
        },
        buttons: {
            accountInfo: "📊 Account Info",
            totalBalance: "💰 Total Balance",
            scriptStatus: "✅ Script Status",
            notifications: "🔔 Notifications",
            history: "📅 History",
            language: "🌐 Language",
            help: "ℹ️ Help",
            about: "👤 About",
            back: "🔙 Back to Menu"
        },
        accountInfo: {
            title: "🌟 <b>DAWN ACCOUNT INFO</b> 🌟",
            account: "Account",
            email: "Account",
            initialBalance: "Initial Balance",
            earnedBalance: "Earned Balance",
            totalBalance: "Total Balance",
            lastUpdate: "Last Update"
        },
        totalBalance: {
            title: "💰 <b>Total Balance All Accounts</b>",
            total: "Total",
            points: "points",
            update: "Update"
        },
        scriptStatus: {
            title: "🔄 <b>Script Status</b>",
            time: "Time",
            status: "Status",
            active: "Active and Running",
            stopped: "Stopped",
            uptime: "Uptime",
            days: "d",
            hours: "h",
            minutes: "m"
        },
        notifications: {
            title: "🔔 <b>Notification Settings</b>",
            balanceUpdates: "Balance Updates",
            scriptStatus: "Script Status",
            changeSettings: "To change these settings, please contact support."
        },
        transactionHistory: {
            title: "📅 <b>Transaction History</b>",
            email: "Email",
            type: "Type",
            amount: "Amount",
            points: "points",
            description: "Description",
            noTransactions: "No transactions found",
            date: "Date"
        },
        errors: {
            general: "❌ An error occurred",
            fetch: "Failed to fetch data",
            update: "Failed to update",
            unknown: "Unknown action"
        },
        help: `
ℹ️ <b>DAWN BOT HELP CENTER</b> ℹ️
━━━━━━━━━━━━━━━━━━━━

<b>📌 AVAILABLE COMMANDS</b>
• /start - Start bot and show main menu

<b>🔍 MENU FEATURES</b>
• 📊 <b>Account Info</b>
  View detailed information for each account including:
  - Account email
  - Initial balance
  - Earned balance
  - Current total balance

• 💰 <b>Total Balance</b>
  Display total balance from all accounts

• ✅ <b>Script Status</b>
  View script status including:
  - Active/inactive status
  - Start time
  - Running duration
  - Last update

• 🔔 <b>Notifications</b>
  Manage notification settings for:
  - Balance changes
  - Script status updates

• 📅 <b>Transaction History</b>
  View transaction records including:
  - Transaction time
  - Transaction type
  - Amount
  - Description

<b>💡 NEED HELP?</b>
If you need further assistance:
• Telegram: @itbaarts_dev

━━━━━━━━━━━━━━━━━━━━
<i>DAWN BOT v1.0.0</i>`,
        about: `
👤 <b>ABOUT DAWN BOT</b> 👤
━━━━━━━━━━━━━━━━━━━━

<b>🤖 BOT INFORMATION</b>
• Name: DAWN BOT
• Version: 1.0.0
• Developer: ITBAARTS
• Last Update: ${new Date().toLocaleDateString()}

<b>🌟 FEATURES</b>
• Real-time balance tracking
• Multi-account management
• Automated script monitoring
• Transaction history
• Customizable notifications
• Secure and reliable

<b>🛡️ SECURITY</b>
• End-to-end encryption
• Secure authentication
• Regular security updates
• Privacy protection

<b>👨‍💻 DEVELOPER CONTACT</b>
• Telegram: @itbaarts_dev

<b>📢 SOCIAL MEDIA</b>
• Telegram Channel: @UXScript

━━━━━━━━━━━━━━━━━━━━
<i>Developed with ❤️ by ITBAARTS</i>`,
        languageMenu: "🌐 <b>Select Language</b>\n\nChoose your preferred language:"
    },
    id: {
        welcome: `
🤖 <b>Selamat Datang di DAWN BOT</b> 🤖

Silakan pilih opsi di bawah ini:`,
        menuItems: {
            accountInfo: "📊 Info Akun - Lihat detail akun Anda",
            totalBalance: "💰 Total Saldo - Cek total saldo",
            scriptStatus: "✅ Status Script - Lihat status script saat ini",
            notifications: "🔔 Notifikasi - Kelola notifikasi",
            history: "📅 Riwayat Transaksi - Lihat transaksi",
            language: "🌐 Bahasa - Ubah bahasa",
            help: "ℹ️ Bantuan - Dapatkan bantuan",
            about: "👤 Tentang - Pelajari lebih lanjut tentang bot ini"
        },
        buttons: {
            accountInfo: "📊 Info Akun",
            totalBalance: "💰 Total Saldo",
            scriptStatus: "✅ Status Script",
            notifications: "🔔 Notifikasi",
            history: "📅 Riwayat",
            language: "🌐 Bahasa",
            help: "ℹ️ Bantuan",
            about: "👤 Tentang",
            back: "🔙 Kembali ke Menu"
        },
        accountInfo: {
            title: "🌟 <b>INFO AKUN DAWN</b> 🌟",
            account: "Akun",
            email: "Email",
            initialBalance: "Saldo Awal",
            earnedBalance: "Saldo Diperoleh",
            totalBalance: "Total Saldo",
            lastUpdate: "Update Terakhir"
        },
        totalBalance: {
            title: "💰 <b>Total Saldo Semua Akun</b>",
            total: "Total",
            points: "poin",
            update: "Update"
        },
        scriptStatus: {
            title: "🔄 <b>Status Script</b>",
            time: "Waktu",
            status: "Status",
            active: "Aktif dan Berjalan",
            stopped: "Berhenti",
            uptime: "Waktu Aktif",
            days: "h",
            hours: "j",
            minutes: "m"
        },
        notifications: {
            title: "🔔 <b>Pengaturan Notifikasi</b>",
            balanceUpdates: "Update Saldo",
            scriptStatus: "Status Script",
            changeSettings: "Untuk mengubah pengaturan ini, silakan hubungi support."
        },
        transactionHistory: {
            title: "📅 <b>Riwayat Transaksi</b>",
            email: "Email",
            type: "Tipe",
            amount: "Jumlah",
            points: "poin",
            description: "Deskripsi",
            noTransactions: "Tidak ada transaksi ditemukan",
            date: "Tanggal"
        },
        errors: {
            general: "❌ Terjadi kesalahan",
            fetch: "Gagal mengambil data",
            update: "Gagal memperbarui",
            unknown: "Aksi tidak dikenal"
        },
        help: `
ℹ️ <b>PUSAT BANTUAN DAWN BOT</b> ℹ️
━━━━━━━━━━━━━━━━━━━━

<b>📌 PERINTAH TERSEDIA</b>
• /start - Mulai bot dan tampilkan menu utama

<b>🔍 FITUR MENU</b>
• 📊 <b>Info Akun</b>
  Lihat informasi detail untuk setiap akun:
  - Email akun
  - Saldo awal
  - Saldo yang diperoleh
  - Total saldo saat ini

• 💰 <b>Total Saldo</b>
  Tampilkan total saldo dari semua akun

• ✅ <b>Status Script</b>
  Lihat status script termasuk:
  - Status aktif/nonaktif
  - Waktu mulai
  - Durasi berjalan
  - Update terakhir

<b>💡 BUTUH BANTUAN?</b>
Jika Anda membutuhkan bantuan:
• Telegram: @itbaarts_dev

━━━━━━━━━━━━━━━━━━━━
<i>DAWN BOT v1.0.0</i>`,
        about: `
👤 <b>TENTANG DAWN BOT</b> 👤
━━━━━━━━━━━━━━━━━━━━

<b>🤖 INFORMASI BOT</b>
• Nama: DAWN BOT
• Versi: 1.0.0
• Pengembang: ITBAARTS
• Update Terakhir: ${new Date().toLocaleDateString()}

<b>🌟 FITUR</b>
• Pelacakan saldo real-time
• Manajemen multi-akun
• Pemantauan script otomatis
• Riwayat transaksi
• Notifikasi yang dapat disesuaikan
• Aman dan andal

<b>👨‍💻 KONTAK PENGEMBANG</b>
• Telegram: @itbaarts_dev

<b>📢 MEDIA SOSIAL</b>
• Channel Telegram: @UXScript

━━━━━━━━━━━━━━━━━━━━
<i>Dikembangkan dengan ❤️ oleh ITBAARTS</i>`,
        languageMenu: "🌐 <b>Pilih Bahasa</b>\n\nPilih bahasa yang Anda inginkan:"
    },
    hi: {
        welcome: `
🤖 <b>DAWN BOT में आपका स्वागत है</b> 🤖

कृपया नीचे दिए गए विकल्प चुनें:`,
        menuItems: {
            accountInfo: "📊 खाता जानकारी - अपने खाते का विवरण देखें",
            totalBalance: "💰 कुल बैलेंस - कुल बैलेंस जांचें",
            scriptStatus: "✅ स्क्रिप्ट स्थिति - वर्तमान स्क्रिप्ट स्थिति देखें",
            notifications: "🔔 सूचनाएं - सूचनाएं प्रबंधित करें",
            history: "📅 लेन-देन इतिहास - लेन-देन देखें",
            language: "🌐 भाषा - भाषा बदलें",
            help: "ℹ️ सहायता - सहायता प्राप्त करें",
            about: "👤 परिचय - बॉट के बारे में और जानें"
        },
        buttons: {
            accountInfo: "📊 खाता जानकारी",
            totalBalance: "💰 कुल बैलेंस",
            scriptStatus: "✅ स्क्रिप्ट स्थिति",
            notifications: "🔔 सूचनाएं",
            history: "📅 इतिहास",
            language: "🌐 भाषा",
            help: "ℹ️ सहायता",
            about: "👤 परिचय",
            back: "🔙 मेनू पर वापस"
        },
        accountInfo: {
            title: "🌟 <b>DAWN खाता जानकारी</b> 🌟",
            account: "खाता",
            email: "खाता",
            initialBalance: "प्रारंभिक बैलेंस",
            earnedBalance: "अर्जित बैलेंस",
            totalBalance: "कुल बैलेंस",
            lastUpdate: "अंतिम अपडेट"
        },
        totalBalance: {
            title: "💰 <b>सभी खातों का कुल बैलेंस</b>",
            total: "कुल",
            points: "पॉइंट्स",
            update: "अपडेट"
        },
        scriptStatus: {
            title: "🔄 <b>स्क्रिप्ट स्थिति</b>",
            time: "समय",
            status: "स्थिति",
            active: "सक्रिय और चल रहा है",
            stopped: "रुका हुआ",
            uptime: "अपटाइम",
            days: "दिन",
            hours: "घंटे",
            minutes: "मिनट"
        },
        notifications: {
            title: "🔔 <b>सूचना सेटिंग्स</b>",
            balanceUpdates: "बैलेंस अपडेट",
            scriptStatus: "स्क्रिप्ट स्थिति",
            changeSettings: "इन सेटिंग्स को बदलने के लिए, कृपया सपोर्ट से संपर्क करें।"
        },
        transactionHistory: {
            title: "📅 <b>लेन-देन इतिहास</b>",
            email: "ईमेल",
            type: "प्रकार",
            amount: "राशि",
            points: "पॉइंट्स",
            description: "विवरण",
            noTransactions: "कोई लेन-देन नहीं मिला",
            date: "दिनांक"
        },
        errors: {
            general: "❌ एक त्रुटि हुई",
            fetch: "डेटा प्राप्त करने में विफल",
            update: "अपडेट करने में विफल",
            unknown: "अज्ञात कार्रवाई"
        },
        help: `
ℹ️ <b>DAWN BOT सहायता केंद्र</b> ℹ️
━━━━━━━━━━━━━━━━━━━━

<b>📌 उपलब्ध कमांड</b>
• /start - बॉट शुरू करें और मुख्य मेनू दिखाएं

<b>🔍 मेनू सुविधाएं</b>
• 📊 <b>खाता जानकारी</b>
  प्रत्येक खाते की विस्तृत जानकारी देखें:
  - खाता ईमेल
  - प्रारंभिक बैलेंस
  - अर्जित बैलेंस
  - वर्तमान कुल बैलेंस

• 💰 <b>कुल बैलेंस</b>
  सभी खातों का कुल बैलेंस दिखाएं

• ✅ <b>स्क्रिप्ट स्थिति</b>
  स्क्रिप्ट स्थिति देखें:
  - सक्रिय/निष्क्रिय स्थिति
  - प्रारंभ समय
  - चलने की अवधि
  - अंतिम अपडेट

• 🔔 <b>सूचनाएं</b>
  सूचनाएं प्रबंधित करें:
  - बैलेंस अपडेट
  - स्क्रिप्ट स्थिति अपडेट

• 📅 <b>लेन-देन इतिहास</b>
  लेन-देन इतिहास देखें:
  - विवरण
  - विवरण

<b>💡 सहायता चाहिए?</b>
यदि आपको अधिक सहायता की आवश्यकता है:
• Telegram: @itbaarts_dev

━━━━━━━━━━━━━━━━━━━━
<i>DAWN BOT v1.0.0</i>`,
        about: `
👤 <b>DAWN BOT के बारे में</b> 👤
━━━━━━━━━━━━━━━━━━━━

<b>🤖 बॉट जानकारी</b>
• नाम: DAWN BOT
• संस्करण: 1.0.0
• डेवलपर: ITBAARTS
• अंतिम अपडेट: ${new Date().toLocaleDateString()}

<b>🌟 सुविधाएं</b>
• रीयल-टाइम बैलेंस ट्रैकिंग
• मल्टी-अकाउंट प्रबंधन
• स्वचालित स्क्रिप्ट निगरानी
• लेन-देन इतिहास
• अनुकूलन योग्य सूचनाएं
• सुरक्षित और विश्वसनीय

<b>🛡️ सुरक्षा</b>
• एंड-टू-एंड एन्क्रिप्शन
• सुरक्षित प्रमाणीकरण
• नियमित सुरक्षा अपडेट
• गोपनीयता सुरक्षा

<b>👨‍💻 डेवलपर संपर्क</b>
• Telegram: @itbaarts_dev

<b>📢 सोशल मीडिया</b>
• Telegram चैनल: @UXScript

━━━━━━━━━━━━━━━━━━━━
<i>ITBAARTS द्वारा ❤️ के साथ विकसित</i>`,
        languageMenu: "🌐 <b>भाषा चुनें</b>\n\nअपनी पसंदीदा भाषा चुनें:"
    }
};

module.exports = translations; 