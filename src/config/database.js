const { createClient } = require('@libsql/client');

const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://edgartech-db-edgarizkys.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || ''
});

async function initializeDatabase() {
    try {
        await tursoClient.execute(`CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT DEFAULT 'default', name TEXT NOT NULL, phone TEXT NOT NULL, birth_date TEXT NOT NULL, address TEXT NOT NULL, bpjs_number TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        console.log('[DB] Table patients (Multi-Tenant) ready');
        await tursoClient.execute(`CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT DEFAULT 'default', patient_name TEXT NOT NULL, doctor_name TEXT NOT NULL, schedule TEXT NOT NULL, status TEXT NOT NULL, notes TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        console.log('[DB] Table appointments (Multi-Tenant) ready');
        await tursoClient.execute(`CREATE TABLE IF NOT EXISTS doctors (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT DEFAULT 'default', name TEXT NOT NULL, speciality TEXT NOT NULL, schedule TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        console.log('[DB] Table doctors (Multi-Tenant) ready');
    } catch(e) { console.log('DB Notice:', e.message); }
}

module.exports = { tursoClient, initializeDatabase };