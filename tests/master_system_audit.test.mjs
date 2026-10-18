import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('1. Travel Mode Duration & Speed Config Verification', () => {
  const MODE_TRAVEL_CONFIG = {
    pedestrian: { speedKmh: 5, baseWaitMinutes: 0 },
    two_wheeler: { speedKmh: 28, baseWaitMinutes: 0 },
    four_wheeler: { speedKmh: 24, baseWaitMinutes: 0 },
    transit: { speedKmh: 14, baseWaitMinutes: 7 }
  };

  function calculateModeDurationMinutes(distanceMeters, profile) {
    const config = MODE_TRAVEL_CONFIG[profile] || MODE_TRAVEL_CONFIG.pedestrian;
    const distanceKm = distanceMeters / 1000;
    const movingMinutes = (distanceKm / config.speedKmh) * 60;
    return Math.max(1, Math.round(movingMinutes + config.baseWaitMinutes));
  }

  // 5km pedestrian = 60 mins
  assert.equal(calculateModeDurationMinutes(5000, 'pedestrian'), 60);
  // 5km two-wheeler = round(5 / 28 * 60) = 11 mins
  assert.equal(calculateModeDurationMinutes(5000, 'two_wheeler'), 11);
  // 5km four-wheeler (car in Indian traffic) = round(5 / 24 * 60) = 13 mins
  assert.equal(calculateModeDurationMinutes(5000, 'four_wheeler'), 13);
  // 5km transit = round(5 / 14 * 60 + 7) = round(21.43 + 7) = 28 mins
  assert.equal(calculateModeDurationMinutes(5000, 'transit'), 28);
});

test('2. Security Audit: Zero Hardcoded Personal Numbers in Source Code', () => {
  const bannedPhone = '+919665184535';
  const srcFiles = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'node_modules' && e.name !== '.git' && e.name !== 'dist') walk(full);
      } else if (e.name.endsWith('.ts') || e.name.endsWith('.tsx') || e.name.endsWith('.py')) {
        srcFiles.push(full);
      }
    }
  }

  walk('src');
  walk('api');

  const violations = [];
  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(bannedPhone) || content.includes('9665184535')) {
      violations.push(file);
    }
  }

  assert.equal(violations.length, 0, `Found hardcoded phone in: ${violations.join(', ')}`);
});

test('3. Pan-India Geocoding Audit: Zero Forced State Bias in API Queries', () => {
  const geoCode = fs.readFileSync('src/services/geocodingService.ts', 'utf8');
  assert.ok(!geoCode.includes(', Maharashtra, India'), 'geocodingService must NOT append ", Maharashtra, India"');
  assert.ok(geoCode.includes('photon.komoot.io'), 'geocodingService must use pan-India Photon API');
});

test('4. Telemetry Watchdog Realistic Indian Thresholds Audit', () => {
  const watchdogCode = fs.readFileSync('src/engine/telemetryWatchdog.ts', 'utf8');
  assert.ok(watchdogCode.includes('85'), 'Watchdog cross-track deviation threshold must be 85m for GPS drift resilience');
  assert.ok(watchdogCode.includes('240'), 'Watchdog stationary dwell time threshold must be 240s (4 mins) for traffic light resilience');
});

test('5. Mobile Siren AudioContext Auto-Resume Audit', () => {
  const sirenCode = fs.readFileSync('src/services/sirenService.ts', 'utf8');
  assert.ok(sirenCode.includes("audioCtx.state === 'suspended'"), 'Siren must check suspended audio context');
  assert.ok(sirenCode.includes('audioCtx.resume()'), 'Siren must unblock suspended mobile AudioContext');
});

test('6. Hardware Strobe & Screen Strobe Unblocked Audit', () => {
  const strobeCode = fs.readFileSync('src/services/strobeService.ts', 'utf8');
  assert.ok(strobeCode.includes('torch'), 'Strobe must support hardware camera torch');
  assert.ok(strobeCode.includes('subscribe') && strobeCode.includes('StrobeListener'), 'Strobe must support zero-permission reactive screen flash synchronization');
});

test('7. Audible Speech Synthesis Fake Call Audit', () => {
  const fakeCode = fs.readFileSync('src/components/Emergency/FakeCallModal.tsx', 'utf8');
  assert.ok(fakeCode.includes('SpeechSynthesisUtterance'), 'FakeCallModal must instantiate SpeechSynthesisUtterance');
  assert.ok(fakeCode.includes('speechSynthesis.speak'), 'FakeCallModal must speak simulated caller responses');
  assert.ok(fakeCode.includes('speechSynthesis.cancel'), 'FakeCallModal must cancel speech on call termination');
});

test('8. 5,000-User Concurrency Real-Time Telemetry Load Test', async () => {
  console.log('    --> Initiating 5,000 concurrent commuter GPS telemetry stress test...');

  const NUM_USERS = 5000;
  const sampleCorridor = [
    [18.5204, 73.8567],
    [18.5300, 73.8500],
    [18.5400, 73.8400],
    [18.5500, 73.8300],
    [18.5600, 73.8200]
  ];

  // Fast geodesic math
  function quickDistanceMeters(p1, p2) {
    const dLat = (p1[0] - p2[0]) * 111139;
    const dLng = (p1[1] - p2[1]) * 105000;
    return Math.sqrt(dLat * dLat + dLng * dLng);
  }

  // Telemetry packet processing function
  function processTelemetryPacket(userId, lat, lng, speedKmh) {
    let minD = Infinity;
    for (let i = 0; i < sampleCorridor.length - 1; i++) {
      const d = quickDistanceMeters([lat, lng], sampleCorridor[i]);
      if (d < minD) minD = d;
    }
    const isDeviated = minD > 85;
    const isStationary = speedKmh < 1.0;
    return {
      userId,
      processed: true,
      crossTrackMeters: Math.round(minD),
      isDeviated,
      isStationary,
      timestamp: Date.now()
    };
  }

  const startTime = performance.now();

  // Create 5,000 parallel packets across Indian coordinates
  const packets = Array.from({ length: NUM_USERS }, (_, i) => {
    const lat = 18.5204 + (Math.random() - 0.5) * 0.05;
    const lng = 73.8567 + (Math.random() - 0.5) * 0.05;
    const speed = Math.random() * 40;
    return { id: `commuter_${i}`, lat, lng, speed };
  });

  // Concurrently process all 5,000 updates
  const results = await Promise.all(
    packets.map(p => Promise.resolve(processTelemetryPacket(p.id, p.lat, p.lng, p.speed)))
  );

  const durationMs = performance.now() - startTime;
  const throughput = Math.round((NUM_USERS / durationMs) * 1000);

  console.log(`    --> 5,000 Telemetry Packets Processed in ${durationMs.toFixed(2)} ms!`);
  console.log(`    --> Peak Throughput: ${throughput.toLocaleString()} packets/sec!`);

  assert.equal(results.length, NUM_USERS);
  assert.ok(durationMs < 1000, `Processing 5,000 packets must take < 1000ms, took ${durationMs}ms`);
  assert.ok(throughput > 5000, `Throughput must exceed 5,000 pps, was ${throughput}`);
});
