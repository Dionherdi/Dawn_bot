const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'itbaarts_dev.db'));

const initDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS points (
                    email TEXT PRIMARY KEY,
                    token TEXT,
                    initial_balance INTEGER,
                    current_balance INTEGER,
                    last_update DATETIME
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS script_status (
                    id INTEGER PRIMARY KEY,
                    start_time DATETIME,
                    is_running BOOLEAN,
                    total_balance INTEGER,
                    last_update DATETIME
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT,
                    type TEXT,
                    amount INTEGER,
                    description TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (email) REFERENCES points(email)
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });

            db.run(`
                CREATE TABLE IF NOT EXISTS notification_settings (
                    email TEXT PRIMARY KEY,
                    balance_updates BOOLEAN DEFAULT 1,
                    script_status BOOLEAN DEFAULT 1,
                    FOREIGN KEY (email) REFERENCES points(email)
                )
            `);

            db.run(`
                CREATE TABLE IF NOT EXISTS user_language (
                    chat_id TEXT PRIMARY KEY,
                    language TEXT DEFAULT 'en'
                )
            `);
        });
    });
};

const updatePoints = async (email, token, initialBalance, currentBalance) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get previous balance
            const previousData = await getPoints(email);
            const previousBalance = previousData?.current_balance || initialBalance;
            
            // Calculate difference
            const difference = currentBalance - previousBalance;
            
            // Begin transaction
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                
                // Update points
                db.run(`
                    INSERT OR REPLACE INTO points (email, token, initial_balance, current_balance, last_update)
                    VALUES (?, ?, ?, ?, datetime('now'))
                `, [email, token, initialBalance, currentBalance]);
                
                // Log transaction if there's a change
                if (difference !== 0) {
                    db.run(`
                        INSERT INTO transactions (email, type, amount, description)
                        VALUES (?, ?, ?, ?)
                    `, [
                        email,
                        difference > 0 ? 'EARN' : 'SPEND',
                        Math.abs(difference),
                        difference > 0 ? 'Points earned' : 'Points spent'
                    ]);
                }
                
                db.run('COMMIT', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        } catch (error) {
            db.run('ROLLBACK');
            reject(error);
        }
    });
};

const getPoints = (email) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM points WHERE email = ?', [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const getAllPoints = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM points', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const updateScriptStatus = (totalBalance) => {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT OR REPLACE INTO script_status (id, start_time, is_running, total_balance, last_update)
            VALUES (1, COALESCE((SELECT start_time FROM script_status WHERE id = 1), datetime('now')), 
            1, ?, datetime('now'))
        `, [totalBalance], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const getScriptStatus = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM script_status WHERE id = 1', (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const logTransaction = (email, type, amount, description) => {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO transactions (email, type, amount, description)
            VALUES (?, ?, ?, ?)
        `, [email, type, amount, description], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const getTransactionHistory = (limit = 10) => {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT t.*, p.email 
            FROM transactions t
            JOIN points p ON t.email = p.email
            ORDER BY t.timestamp DESC
            LIMIT ?
        `, [limit], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getTransactionHistoryByEmail = (email, limit = 10) => {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT * FROM transactions 
            WHERE email = ?
            ORDER BY timestamp DESC
            LIMIT ?
        `, [email, limit], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getNotificationSettings = (email) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM notification_settings WHERE email = ?', [email], (err, row) => {
            if (err) reject(err);
            else resolve(row || { email, balance_updates: true, script_status: true });
        });
    });
};

const updateNotificationSettings = (email, settings) => {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT OR REPLACE INTO notification_settings (email, balance_updates, script_status)
            VALUES (?, ?, ?)
        `, [email, settings.balance_updates, settings.script_status], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const getUserLanguage = (chatId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT language FROM user_language WHERE chat_id = ?', [chatId], (err, row) => {
            if (err) reject(err);
            else resolve((row && row.language) || 'en');
        });
    });
};

const setUserLanguage = (chatId, language) => {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT OR REPLACE INTO user_language (chat_id, language)
            VALUES (?, ?)
        `, [chatId, language], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

module.exports = {
    initDatabase,
    updatePoints,
    getPoints,
    getAllPoints,
    updateScriptStatus,
    getScriptStatus,
    logTransaction,
    getTransactionHistory,
    getTransactionHistoryByEmail,
    getNotificationSettings,
    updateNotificationSettings,
    getUserLanguage,
    setUserLanguage
}; 