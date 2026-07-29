// config/database.js
const { createClient } = require('@libsql/client');

const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

async function initializeDatabase() {
    try {
        await tursoClient.batch([
            `CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id TEXT DEFAULT 'default',
                name TEXT NOT NULL,
                dob DATE,
                medical_record_number TEXT UNIQUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id TEXT DEFAULT 'default',
                patient_id INTEGER,
                doctor TEXT,
                time DATETIME,
                status TEXT DEFAULT 'scheduled',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(patient_id) REFERENCES patients(id)
            )`,
            `CREATE TABLE IF NOT EXISTS medications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id TEXT DEFAULT 'default',
                name TEXT NOT NULL,
                stock INTEGER DEFAULT 0,
                price REAL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ], 'write');
        console.log('[DB] Schema initialized');
    } catch (e) {
        console.error('[DB] Init failed:', e.message);
        process.exit(1);
    }
}

module.exports = { tursoClient, initializeDatabase };