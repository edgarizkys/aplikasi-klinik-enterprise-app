# Aplikasi Klinik Enterprise

Enterprise system for clinic management. Handle patients, appointments, and pharmacy.

## 🛠 Tech Stack
- **Backend**: Express.js
- **Database**: Turso (LibSQL/SQLite)
- **Frontend**: Tailwind CSS
- **Architecture**: Multi-tenant Enterprise Pattern

## 🚀 Features
- **Rekam Medis**: Patient history and medical records.
- **Jadwal Dokter**: Appointment scheduling and tracking.
- **Inventaris Obat**: Medicine stock and price management.
- **Billing**: Patient invoicing and payment.
- **Laporan**: Clinic operational analytics.

## 📦 Installation

1. **Clone repo**
   ```bash
   git clone https://github.com/user/klinik-enterprise.git
   cd klinik-enterprise
   ```

2. **Install deps**
   ```bash
   npm install
   ```

3. **Env setup**
   Create `.env` file:
   ```env
   TURSO_DATABASE_URL=libsql://your-db-url.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   PORT=3000
   JWT_SECRET=your-secret-key
   ```

4. **Run migrations**
   ```bash
   npm run migrate
   ```

5. **Start app**
   ```bash
   npm start
   ```

## 🛣 API Endpoints

### Patients
- `GET /api/patients` - List patients (paginated)
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient detail
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Remove patient

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Schedule appointment
- `PATCH /api/appointments/:id/status` - Update status (scheduled/completed/cancelled)

### Medications
- `GET /api/medications` - List stock
- `POST /api/medications` - Add medicine
- `PUT /api/medications/:id` - Update stock/price

## 🎨 Theme Colors
- Primary: `#0EA5E9` (Sky Blue)
- Secondary: `#6366F1` (Indigo)

## 🛡 Security
- JWT Authentication
- Role-based Access Control (RBAC)
- Input validation via Zod/Joi
- SQL Injection protection via LibSQL prepared statements