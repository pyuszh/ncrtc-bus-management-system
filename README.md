# NCRTC Bus Management System

A web-based fleet management system for NCRTC's feeder bus network in the Delhi-NCR region. Built as a B.Tech capstone project at NSUT Delhi.

---

## What This Project Does

NCRTC runs feeder buses around the Delhi-NCR RRTS corridor. This system helps:
- **Track buses** in real time on a live map
- **Schedule duties** — assign drivers to vehicles for the day
- **Manage incidents** — report and track breakdowns, accidents, emergencies
- **Send notices** — push announcements to drivers

---

## Tech Stack

| Part | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Maps | Leaflet + OpenStreetMap |
| Auth | JWT + bcrypt |
| GPS Simulation | tick.js (background script) |
| Containers | Docker + Docker Compose |

---

## How to Run (Without Docker)

You need Node.js and PostgreSQL installed.

**1. Clone the repos**
```bash
git clone https://github.com/pyuszh/backend_bus.git backend
git clone https://github.com/MUKULCODE12/ncrtc-bus-management-system.git frontend
```

**2. Setup backend**
```bash
cd backend
npm install
```

Create a `.env` file:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ncrtc"
JWT_SECRET=supersecretkey123
PORT=3000
```

```bash
npx prisma migrate dev --name init
npm run seed
npm run dev
```

**3. Setup frontend**
```bash
cd frontend
npm install
npm run dev
```

**4. Start the GPS simulator**
```bash
cd backend
node tick.js
```

Open `http://localhost:5173` in your browser.

---

## How to Run (With Docker)

Make sure Docker Desktop is running, then:

```bash
docker compose up --build
```

Wait 2-3 minutes. Everything starts automatically including migrations and seed data.

Open `http://localhost:5173`

---

## Demo Credentials

All accounts use the password: `password`

| Username | Role | Access |
|---|---|---|
| `admin1` | Admin | Everything |
| `manager1` | Depot Manager | Noida depot |
| `manager2` | Depot Manager | Anand Vihar depot |
| `operator1` | Control Operator | Live map + incidents |
| `driver1` | Driver | Own duty + notices |
| `driver2` | Driver | Own duty + notices |
| `driver3` | Driver | Own duty + notices |
| `driver4` | Driver | Own duty + notices |

---

## Project Structure

```
backend/
  src/
    controllers/    # Business logic for each module
    routes/         # API route definitions
    middleware/     # JWT auth checking
    lib/            # Prisma client
  prisma/
    schema.prisma   # Database schema
    seed.js         # Demo data
  server.js         # Entry point
  tick.js           # GPS simulation script

frontend/
  src/
    pages/          # Map, Roster, Incidents, Notices, Vehicles
    components/     # Reusable UI parts
    api/            # Axios HTTP client
    context/        # Auth state
```

---

## The Four Modules

**1. AVLS (Live Map)**
Shows all active buses on a real map using Leaflet. Markers update every 5 seconds. Click a bus to see the driver, route, and recent GPS path. A background script (tick.js) simulates GPS movement by inserting a new ping for each active vehicle every 5 seconds.

**2. Scheduling (Duty Roster)**
Managers create and publish daily duties. Each duty links a driver, vehicle, and route for a specific day. Drivers see their duty and tap Acknowledge to confirm. The system prevents double-booking the same driver or vehicle on the same day.

**3. IMS (Incident Management)**
Anyone can raise an incident. Each one has a type (breakdown/accident/complaint), severity (P1/P2/P3), and goes through a fixed workflow: Open → Acknowledged → In Progress → Resolved → Closed. Every status change needs a note and is saved with a timestamp. Drivers have a one-tap panic button that creates a P1 incident automatically.

**4. CMS (Notices)**
Admins write announcements targeted at all users, a specific depot, or a specific role. Opening a notice marks it as read. Admins can see read receipts — who has and hasn't read each notice.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login |
| GET | `/avls/live` | Live vehicle locations |
| GET | `/avls/history/:id` | GPS history for a vehicle |
| GET | `/duties` | List duties by date |
| POST | `/duties` | Create duty |
| PATCH | `/duties/:id/publish` | Publish duty |
| PATCH | `/duties/:id/acknowledge` | Driver acknowledges duty |
| GET | `/incidents` | List incidents |
| POST | `/incidents` | Raise incident |
| POST | `/incidents/panic` | Emergency panic button |
| PATCH | `/incidents/:id/status` | Update incident status |
| GET | `/notices` | List notices |
| POST | `/notices` | Create notice |
| POST | `/notices/:id/read` | Mark notice as read |
| GET | `/vehicles` | List vehicles |
| POST | `/vehicles` | Add vehicle |

---

## Known Limitations

- GPS movement is simulated by tick.js, not real hardware. In production this would be a TCP ingest service connected to actual GPS devices on buses.
- History page shows paths only for dates where GPS pings exist in the database.
- Docker was added for submission. Development was done running services manually.

---

## Team

NSUT DELHI
ECE
Piyush Kumar(Handled Backend)
Mukul Jaluthria(Handled Frontend)
