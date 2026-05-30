// prisma/seed.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NCRTC seed...\n');

  await prisma.noticeRead.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.incidentEvent.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.gpsPing.deleteMany();
  await prisma.duty.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.depot.deleteMany();
  console.log('🗑️  Cleared old data');

  // ── 1. Depots ─────────────────────────────────────────────
  const depot1 = await prisma.depot.create({
    data: { code: 'NOI37', name: 'Noida Sector 37 Depot', locationLat: 28.5706, locationLng: 77.3261 },
  });
  const depot2 = await prisma.depot.create({
    data: { code: 'ANV', name: 'Anand Vihar Depot', locationLat: 28.6469, locationLng: 77.3160 },
  });
  const depot3 = await prisma.depot.create({
    data: { code: 'GZB', name: 'Ghaziabad Depot', locationLat: 28.6692, locationLng: 77.4538 },
  });
  console.log('🏢 Depots created: Noida, Anand Vihar, Ghaziabad');

  // ── 2. Password hash ──────────────────────────────────────
  const hash = await bcrypt.hash('password', 10);

  // ── 3. Users ──────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: { username: 'admin1', passwordHash: hash, fullName: 'Amit Sharma', role: 'admin' },
  });
  const operator = await prisma.user.create({
    data: { username: 'operator1', passwordHash: hash, fullName: 'Priya Singh', role: 'control_operator' },
  });
  const manager1 = await prisma.user.create({
    data: { username: 'manager1', passwordHash: hash, fullName: 'Rakesh Kumar', role: 'depot_manager', depotId: depot1.id },
  });
  const manager2 = await prisma.user.create({
    data: { username: 'manager2', passwordHash: hash, fullName: 'Sunita Verma', role: 'depot_manager', depotId: depot2.id },
  });
  const driver1 = await prisma.user.create({
    data: { username: 'driver1', passwordHash: hash, fullName: 'Rajesh Yadav', role: 'driver', depotId: depot1.id, phone: '9876543210' },
  });
  const driver2 = await prisma.user.create({
    data: { username: 'driver2', passwordHash: hash, fullName: 'Suresh Gupta', role: 'driver', depotId: depot1.id, phone: '9876543211' },
  });
  const driver3 = await prisma.user.create({
    data: { username: 'driver3', passwordHash: hash, fullName: 'Mahesh Tiwari', role: 'driver', depotId: depot2.id, phone: '9876543212' },
  });
  const driver4 = await prisma.user.create({
    data: { username: 'driver4', passwordHash: hash, fullName: 'Ramesh Pandey', role: 'driver', depotId: depot1.id, phone: '9876543213' },
  });
  const executive = await prisma.user.create({
    data: { username: 'exec1', passwordHash: hash, fullName: 'Vikram Mehta', role: 'executive' },
  });
  console.log('👤 Users created (9 users across all roles)');

  // ── 4. Vehicles ───────────────────────────────────────────
  const v1 = await prisma.vehicle.create({ data: { regNo: 'UP32AB1234', depotId: depot1.id, status: 'active' } });
  const v2 = await prisma.vehicle.create({ data: { regNo: 'UP32AB1235', depotId: depot1.id, status: 'active' } });
  const v3 = await prisma.vehicle.create({ data: { regNo: 'UP32AB1236', depotId: depot1.id, status: 'maintenance' } });
  const v4 = await prisma.vehicle.create({ data: { regNo: 'DL01CD5678', depotId: depot2.id, status: 'active' } });
  const v5 = await prisma.vehicle.create({ data: { regNo: 'DL01CD5679', depotId: depot2.id, status: 'active' } });
  const v6 = await prisma.vehicle.create({ data: { regNo: 'UP14EF9012', depotId: depot3.id, status: 'active' } });
  console.log('🚌 Vehicles created (6 vehicles across depots)');

  // ── 5. Stops ──────────────────────────────────────────────
  const stops = await Promise.all([
    prisma.stop.create({ data: { name: 'Noida Sec 37 Metro',     lat: 28.5706, lng: 77.3261 } }),
    prisma.stop.create({ data: { name: 'Noida Sec 32',            lat: 28.5650, lng: 77.3200 } }),
    prisma.stop.create({ data: { name: 'Botanical Garden Metro',  lat: 28.5600, lng: 77.3150 } }),
    prisma.stop.create({ data: { name: 'Sector 18 Market',        lat: 28.5700, lng: 77.3100 } }),
    prisma.stop.create({ data: { name: 'Film City Noida',         lat: 28.5750, lng: 77.3050 } }),
    prisma.stop.create({ data: { name: 'Anand Vihar ISBT',        lat: 28.6469, lng: 77.3160 } }),
    prisma.stop.create({ data: { name: 'Kaushambi Metro',         lat: 28.6400, lng: 77.3180 } }),
    prisma.stop.create({ data: { name: 'Vaishali Metro',          lat: 28.6450, lng: 77.3400 } }),
    prisma.stop.create({ data: { name: 'Ghaziabad Railway',       lat: 28.6692, lng: 77.4538 } }),
    prisma.stop.create({ data: { name: 'Raj Nagar Extension',     lat: 28.6800, lng: 77.4200 } }),
  ]);
  console.log('🛑 Stops created (10 stops across NCR)');

  // ── 6. Routes ─────────────────────────────────────────────
  const route1 = await prisma.route.create({ data: { code: 'R01', name: 'Noida Circular',      depotId: depot1.id } });
  const route2 = await prisma.route.create({ data: { code: 'R02', name: 'Anand Vihar Express', depotId: depot2.id } });
  const route3 = await prisma.route.create({ data: { code: 'R03', name: 'Ghaziabad Local',     depotId: depot3.id } });

  await prisma.routeStop.createMany({
    data: [0, 1, 2, 3, 4].map((i) => ({
      routeId: route1.id, stopId: stops[i].id, sequence: i + 1, plannedOffsetMin: i * 8,
    })),
  });
  await prisma.routeStop.createMany({
    data: [5, 6, 7].map((i, idx) => ({
      routeId: route2.id, stopId: stops[i].id, sequence: idx + 1, plannedOffsetMin: idx * 10,
    })),
  });
  await prisma.routeStop.createMany({
    data: [8, 9].map((i, idx) => ({
      routeId: route3.id, stopId: stops[i].id, sequence: idx + 1, plannedOffsetMin: idx * 12,
    })),
  });
  console.log('🛣️  Routes created and stops linked');

  // ── 7. Duties ─────────────────────────────────────────────
  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1);

  const atHour = (base, h, m = 0) => {
    const d = new Date(base);
    d.setHours(h, m, 0, 0);
    return d;
  };

  // Today's duties — ALL 5 active vehicles get a driver
  await prisma.duty.create({
    data: {
      date: today, vehicleId: v1.id, driverId: driver1.id, routeId: route1.id,
      startTime: atHour(today, 8), endTime: atHour(today, 16), status: 'published',
    },
  });
  await prisma.duty.create({
    data: {
      date: today, vehicleId: v2.id, driverId: driver2.id, routeId: route1.id,
      startTime: atHour(today, 9), endTime: atHour(today, 17),
      status: 'acknowledged', ackAt: new Date(),
    },
  });
  await prisma.duty.create({
    data: {
      date: today, vehicleId: v4.id, driverId: driver3.id, routeId: route2.id,
      startTime: atHour(today, 7), endTime: atHour(today, 15), status: 'published',
    },
  });
  await prisma.duty.create({
    data: {
      date: today, vehicleId: v5.id, driverId: driver4.id, routeId: route2.id,
      startTime: atHour(today, 8), endTime: atHour(today, 16), status: 'published',
    },
  });
  await prisma.duty.create({
    data: {
      date: today, vehicleId: v6.id, driverId: driver1.id, routeId: route3.id,
      startTime: atHour(today, 6), endTime: atHour(today, 14), status: 'published',
    },
  });

  // Tomorrow draft
  await prisma.duty.create({
    data: {
      date: tomorrow, vehicleId: v1.id, driverId: driver1.id, routeId: route1.id,
      startTime: atHour(tomorrow, 8), endTime: atHour(tomorrow, 16), status: 'draft',
    },
  });

  // Yesterday acknowledged (for history demo)
  await prisma.duty.create({
    data: {
      date: yesterday, vehicleId: v1.id, driverId: driver1.id, routeId: route1.id,
      startTime: atHour(yesterday, 8), endTime: atHour(yesterday, 16),
      status: 'acknowledged', ackAt: new Date(yesterday.getTime() + 30 * 60000),
    },
  });
  console.log('📋 Duties created (all 5 active vehicles have drivers today)');

  // ── 8. GPS Pings ──────────────────────────────────────────
  const pingData = [];

  // v1 — UP32AB1234 — Noida area
  for (let i = 0; i < 60; i++) {
    pingData.push({
      vehicleId: v1.id,
      ts: new Date(Date.now() - (60 - i) * 60 * 1000),
      lat: 28.5706 + i * 0.0005,
      lng: 77.3261 + i * 0.0004,
      speedKmh: 20 + Math.random() * 25,
      ignitionOn: true,
    });
  }

  // v2 — UP32AB1235 — Noida different path
  for (let i = 0; i < 40; i++) {
    pingData.push({
      vehicleId: v2.id,
      ts: new Date(Date.now() - (40 - i) * 60 * 1000),
      lat: 28.5650 + i * 0.0006,
      lng: 77.3200 - i * 0.0003,
      speedKmh: 15 + Math.random() * 20,
      ignitionOn: true,
    });
  }

  // v4 — DL01CD5678 — Anand Vihar area
  for (let i = 0; i < 30; i++) {
    pingData.push({
      vehicleId: v4.id,
      ts: new Date(Date.now() - (30 - i) * 60 * 1000),
      lat: 28.6469 - i * 0.0004,
      lng: 77.3160 + i * 0.0005,
      speedKmh: 18 + Math.random() * 22,
      ignitionOn: true,
    });
  }

  // v5 — DL01CD5679 — Anand Vihar different path
  for (let i = 0; i < 30; i++) {
    pingData.push({
      vehicleId: v5.id,
      ts: new Date(Date.now() - (30 - i) * 60 * 1000),
      lat: 28.6400 + i * 0.0004,
      lng: 77.3180 + i * 0.0003,
      speedKmh: 20 + Math.random() * 20,
      ignitionOn: true,
    });
  }

  // v6 — UP14EF9012 — Ghaziabad area
  for (let i = 0; i < 30; i++) {
    pingData.push({
      vehicleId: v6.id,
      ts: new Date(Date.now() - (30 - i) * 60 * 1000),
      lat: 28.6692 - i * 0.0003,
      lng: 77.4538 - i * 0.0004,
      speedKmh: 15 + Math.random() * 25,
      ignitionOn: true,
    });
  }

  // Yesterday history pings for v1
  const yBase = new Date(yesterday);
  yBase.setHours(8, 0, 0, 0);
  for (let i = 0; i < 50; i++) {
    pingData.push({
      vehicleId: v1.id,
      ts: new Date(yBase.getTime() + i * 5 * 60 * 1000),
      lat: 28.5706 + i * 0.0006,
      lng: 77.3261 + i * 0.0005,
      speedKmh: 22 + Math.random() * 18,
      ignitionOn: true,
    });
  }

  await prisma.gpsPing.createMany({ data: pingData });
  console.log(`📍 GPS pings created (${pingData.length} pings across all vehicles)`);

  // ── 9. Incidents ──────────────────────────────────────────
  const inc1 = await prisma.incident.create({
    data: {
      type: 'breakdown', severity: 'P1', status: 'open',
      description: 'Engine overheating near Sector 32. Bus stopped on road.',
      vehicleId: v1.id, depotId: depot1.id, raisedById: driver1.id,
    },
  });
  await prisma.incidentEvent.create({
    data: { incidentId: inc1.id, actorId: driver1.id, fromStatus: 'open', toStatus: 'open', note: 'P1 incident raised by driver via panic button' },
  });

  const inc2 = await prisma.incident.create({
    data: {
      type: 'complaint', severity: 'P3', status: 'in_progress',
      description: 'Passenger complaint: AC not working, driver rude behaviour.',
      depotId: depot1.id, raisedById: driver2.id, assignedToId: manager1.id,
    },
  });
  await prisma.incidentEvent.createMany({
    data: [
      { incidentId: inc2.id, actorId: driver2.id,   fromStatus: 'open',         toStatus: 'open',         note: 'Complaint raised' },
      { incidentId: inc2.id, actorId: manager1.id,  fromStatus: 'open',         toStatus: 'acknowledged', note: 'Acknowledged. Investigating.' },
      { incidentId: inc2.id, actorId: manager1.id,  fromStatus: 'acknowledged', toStatus: 'in_progress',  note: 'Spoke with driver. Sending AC technician.' },
    ],
  });

  await prisma.incident.create({
    data: {
      type: 'accident', severity: 'P2', status: 'resolved',
      description: 'Minor collision at Botanical Garden stop. No injuries.',
      vehicleId: v2.id, depotId: depot1.id, raisedById: driver2.id,
      assignedToId: manager1.id, resolvedAt: new Date(),
    },
  });
  console.log('🚨 Incidents created (P1 open, P3 in-progress, P2 resolved)');

  // ── 10. Notices ───────────────────────────────────────────
  const notice1 = await prisma.notice.create({
    data: {
      title: 'Route R01 Diversion — Tomorrow',
      body: 'Route R01 will be diverted via Sector 62 from 7AM to 7PM tomorrow due to road construction work near Botanical Garden.',
      audience: 'all', publishAt: new Date(), createdById: admin.id,
    },
  });
  await prisma.notice.create({
    data: {
      title: 'Holiday Schedule — Sunday 26th May',
      body: 'Reduced services on Sunday. Only morning and evening shifts will operate.',
      audience: 'role:driver', publishAt: new Date(), createdById: admin.id,
    },
  });
  await prisma.notice.create({
    data: {
      title: 'New Safety Protocol — Mandatory Reading',
      body: 'All drivers must complete the updated safety checklist before starting the vehicle.',
      audience: 'all', publishAt: new Date(), createdById: admin.id,
    },
  });
  await prisma.noticeRead.createMany({
    data: [
      { noticeId: notice1.id, userId: driver2.id },
      { noticeId: notice1.id, userId: driver3.id },
    ],
  });
  console.log('📢 Notices created (3 notices, 2 read receipts)');

  console.log('\n✅ Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 DEMO CREDENTIALS (password for all: "password")');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  admin1    → admin             (all depots)');
  console.log('  operator1 → control_operator  (all depots)');
  console.log('  manager1  → depot_manager     (Noida Sec 37)');
  console.log('  manager2  → depot_manager     (Anand Vihar)');
  console.log('  driver1   → driver            (Noida, has duty today)');
  console.log('  driver2   → driver            (Noida, has duty today)');
  console.log('  driver3   → driver            (Anand Vihar, has duty today)');
  console.log('  driver4   → driver            (Noida, has duty today)');
  console.log('  exec1     → executive         (read only)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());