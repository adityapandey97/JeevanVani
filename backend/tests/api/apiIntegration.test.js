import assert from 'assert';
import http from 'http';
import app from '../../src/server.js';

export async function runAPIIntegrationTests() {
  console.log('--- Running API Integration Tests (Node Native Fetch) ---');

  // Start ephemeral test server on port 0 (OS assigns an available port)
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Test 1: GET /api/health
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(healthRes.status, 200);
    const healthBody = await healthRes.json();
    assert.strictEqual(healthBody.status, 'healthy');
    assert.strictEqual(healthBody.version, '2.0.0');
    console.log('  ✓ Test 1 Passed: GET /api/health returned 200 with healthy status');

    // Test 2: GET /api/health/dependencies (Section 48 Observability)
    const depRes = await fetch(`${baseUrl}/api/health/dependencies`);
    assert.strictEqual(depRes.status, 200);
    const depBody = await depRes.json();
    assert.strictEqual(depBody.success, true);
    assert.ok(depBody.externalSources.skillIndia);
    assert.ok(depBody.externalSources.pmajay);
    console.log('  ✓ Test 2 Passed: GET /api/health/dependencies verified external government sources health');

    // Test 3: POST /api/profile/extract (Section 9 & 27)
    const extractRes = await fetch(`${baseUrl}/api/profile/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'मैं 10वीं पास हूँ और मुझे बिजली का काम पसंद है' })
    });
    assert.strictEqual(extractRes.status, 200);
    const extractBody = await extractRes.json();
    assert.strictEqual(extractBody.success, true);
    assert.strictEqual(extractBody.extracted.education, '10th Pass');
    assert.ok(extractBody.extracted.overallConfidence > 0);
    console.log(`  ✓ Test 3 Passed: POST /api/profile/extract extracted 10th Pass with confidence ${extractBody.extracted.overallConfidence}`);

    // Test 4: GET /api/nsqf/qualifications (Section 12 & 27)
    const nsqfRes = await fetch(`${baseUrl}/api/nsqf/qualifications`);
    assert.strictEqual(nsqfRes.status, 200);
    const nsqfBody = await nsqfRes.json();
    assert.strictEqual(nsqfBody.success, true);
    assert.ok(nsqfBody.count > 0);
    console.log(`  ✓ Test 4 Passed: GET /api/nsqf/qualifications returned ${nsqfBody.count} verified NSQF standards`);

    // Test 5: POST /api/assistant/message (Section 24 & 27)
    const assistantRes = await fetch(`${baseUrl}/api/assistant/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is PM-AJAY GIA subsidy?', language: 'en' })
    });
    assert.strictEqual(assistantRes.status, 200);
    const assistantBody = await assistantRes.json();
    assert.strictEqual(assistantBody.success, true);
    assert.ok(assistantBody.data.reply.length > 20);
    assert.ok(assistantBody.data.sources.length > 0);
    console.log('  ✓ Test 5 Passed: POST /api/assistant/message provided grounded response with official sources');

    console.log('✓ All API Integration Tests Passed Successfully!\n');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

if (process.argv[1] && process.argv[1].endsWith('apiIntegration.test.js')) {
  runAPIIntegrationTests().catch(err => {
    console.error('API Test failed:', err);
    process.exit(1);
  });
}
