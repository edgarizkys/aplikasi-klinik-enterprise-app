// config/database.js
const { createClient } = require('@libsql/client');

const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
});

async function initializeDatabase() {
    const schema = [
        `CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT DEFAULT 'default',
            patient_id TEXT UNIQUE,
            name TEXT NOT NULL,
            dob TEXT,
            gender TEXT,
            address TEXT,
            phone TEXT,
            insurance_provider TEXT,
            medical_history_summary TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT DEFAULT 'default',
            doctor_id TEXT UNIQUE,
            name TEXT NOT NULL,
            specialty TEXT,
            phone TEXT,
            email TEXT,
            clinic_location TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT DEFAULT 'default',
            appointment_id TEXT UNIQUE,
            patient_name TEXT,
            doctor_name TEXT,
            date TEXT,
            time TEXT,
            status TEXT,
            reason TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS medical_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT DEFAULT 'default',
            record_id TEXT UNIQUE,
            patient_name TEXT,
            doctor_name TEXT,
            visit_date TEXT,
            diagnosis TEXT,
            treatment TEXT,
            prescription TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT DEFAULT 'default',
            invoice_id TEXT UNIQUE,
            patient_name TEXT,
            invoice_date TEXT,
            services_rendered TEXT,
            total_amount REAL,
            payment_status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    try {
        for (const query of schema) {
            await tursoClient.execute(query);
        }
        console.log('[DB] Schema initialized.');
    } catch (err) {
        console.error('[DB] Init error:', err.message);
        process.exit(1);
    }
}

module.exports = { tursoClient, initializeDatabase };